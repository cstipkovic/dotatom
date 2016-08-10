
/*
WakaTime
Description: Analytics for programmers.
Maintainer:  WakaTime <support@wakatime.com>
License:     BSD, see LICENSE for more details.
Website:     https://wakatime.com/
 */

(function() {
  var AdmZip, StatusBarTileView, apiKey, cleanupOnUninstall, cliLocation, downloadFile, endsWith, enoughTimePassed, execFile, extractCLI, fileIsIgnored, formatDate, fs, getLatestCliVersion, getUserHome, ini, installCLI, installPython, isCLIInstalled, isCLILatest, isPythonInstalled, lastFile, lastHeartbeat, loadApiKey, os, packageVersion, path, pluginReady, pythonLocation, removeCLI, request, rimraf, sendHeartbeat, setApiKey, setupEventHandlers, statusBarTileView, unloadHandler, unzip;

  packageVersion = null;

  unloadHandler = null;

  lastHeartbeat = 0;

  lastFile = '';

  apiKey = null;

  statusBarTileView = null;

  pluginReady = false;

  AdmZip = require('adm-zip');

  fs = require('fs');

  os = require('os');

  path = require('path');

  execFile = require('child_process').execFile;

  request = require('request');

  rimraf = require('rimraf');

  ini = require('ini');

  StatusBarTileView = require('./status-bar-tile-view');

  module.exports = {
    config: {
      apikey: {
        title: 'Api Key',
        description: 'Your secret key from https://wakatime.com/settings.',
        type: 'string',
        "default": '',
        order: 1
      },
      ignore: {
        title: 'Exclude File Paths',
        description: 'Exclude these file paths from logging; POSIX regex patterns',
        type: 'array',
        "default": ['^/var/', '^/tmp/', '^/private/', 'COMMIT_EDITMSG$', 'PULLREQ_EDITMSG$', 'MERGE_MSG$'],
        items: {
          type: 'string'
        },
        order: 2
      }
    },
    activate: function(state) {
      packageVersion = atom.packages.getLoadedPackage('wakatime').metadata.version;
      if (!isCLIInstalled()) {
        installCLI(function() {
          return console.log('Finished installing wakatime cli.');
        });
      } else {
        isCLILatest(function(latest) {
          if (!latest) {
            return installCLI(function() {
              return console.log('Finished installing wakatime cli.');
            });
          }
        });
      }
      isPythonInstalled(function(installed) {
        if (!installed) {
          return atom.confirm({
            message: 'WakaTime requires Python',
            detailedMessage: 'Let\'s download and install Python now?',
            buttons: {
              OK: function() {
                return installPython();
              },
              Cancel: function() {
                return window.alert('Please install Python (https://www.python.org/downloads/) and restart Atom to enable the WakaTime plugin.');
              }
            }
          });
        }
      });
      cleanupOnUninstall();
      setupEventHandlers();
      setApiKey();
      pluginReady = true;
      if (statusBarTileView != null) {
        statusBarTileView.setTitle('WakaTime initialized');
      }
      return statusBarTileView != null ? statusBarTileView.setStatus() : void 0;
    },
    consumeStatusBar: function(statusBar) {
      statusBarTileView = new StatusBarTileView();
      statusBarTileView.init();
      this.statusBarTile = statusBar.addRightTile({
        item: statusBarTileView,
        priority: 300
      });
      if (pluginReady) {
        statusBarTileView.setTitle('WakaTime initialized');
        return statusBarTileView.setStatus();
      }
    },
    deactivate: function() {
      var _ref;
      if ((_ref = this.statusBarTile) != null) {
        _ref.destroy();
      }
      if (statusBarTileView != null) {
        statusBarTileView.destroy();
      }
      return statusBarTileView = null;
    }
  };

  getUserHome = function() {
    return process.env[process.platform === 'win32' ? 'USERPROFILE' : 'HOME'] || '';
  };

  setApiKey = function() {
    return loadApiKey(function(err, key) {
      if (err) {
        return console.log(err.message);
      } else {
        return apiKey = key;
      }
    });
  };

  loadApiKey = function(cb) {
    var key, wakatimeConfigFile;
    key = atom.config.get('wakatime.apikey');
    if ((key != null) && key.length > 0) {
      return cb(null, key);
    }
    wakatimeConfigFile = path.join(getUserHome(), '.wakatime.cfg');
    return fs.readFile(wakatimeConfigFile, 'utf-8', function(err, configContent) {
      var wakatimeConfig, _ref;
      if (err != null) {
        return cb(new Error('could not read wakatime config'));
      }
      wakatimeConfig = ini.parse(configContent);
      key = wakatimeConfig != null ? (_ref = wakatimeConfig.settings) != null ? _ref.api_key : void 0 : void 0;
      if (key != null) {
        return cb(null, key);
      } else {
        return cb(new Error('wakatime key not found'));
      }
    });
  };

  enoughTimePassed = function(time) {
    return lastHeartbeat + 120000 < time;
  };

  cleanupOnUninstall = function() {
    if (unloadHandler != null) {
      unloadHandler.dispose();
      unloadHandler = null;
    }
    return unloadHandler = atom.packages.onDidUnloadPackage(function(p) {
      if ((p != null) && p.name === 'wakatime') {
        removeCLI();
        if (unloadHandler != null) {
          unloadHandler.dispose();
          return unloadHandler = null;
        }
      }
    });
  };

  setupEventHandlers = function() {
    return atom.workspace.observeTextEditors((function(_this) {
      return function(editor) {
        var buffer;
        try {
          buffer = editor.getBuffer();
          buffer.onDidSave(function(e) {
            var file, lineno;
            file = buffer.file;
            if ((file != null) && file) {
              lineno = null;
              if (editor.cursors.length > 0) {
                lineno = editor.cursors[0].getCurrentLineBufferRange().end.row + 1;
              }
              return sendHeartbeat(file, lineno, true);
            }
          });
          buffer.onDidChange(function(e) {
            var file, lineno;
            file = buffer.file;
            if ((file != null) && file) {
              lineno = null;
              if (editor.cursors.length > 0) {
                lineno = editor.cursors[0].getCurrentLineBufferRange().end.row + 1;
              }
              return sendHeartbeat(file, lineno);
            }
          });
          return editor.onDidChangeCursorPosition(function(e) {
            var file, lineno;
            file = buffer.file;
            if ((file != null) && file) {
              lineno = null;
              if (editor.cursors.length > 0) {
                lineno = editor.cursors[0].getCurrentLineBufferRange().end.row + 1;
              }
              return sendHeartbeat(file, lineno);
            }
          });
        } catch (_error) {}
      };
    })(this));
  };

  isPythonInstalled = function(callback) {
    return pythonLocation(function(result) {
      return callback(result != null);
    });
  };

  pythonLocation = function(callback, locations) {
    var args, i, location;
    if (global.cachedPythonLocation != null) {
      return callback(global.cachedPythonLocation);
    } else {
      if (locations == null) {
        locations = [__dirname + path.sep + 'python' + path.sep + 'pythonw', "pythonw", "python", "/usr/local/bin/python", "/usr/bin/python"];
        i = 26;
        while (i < 50) {
          locations.push('\\python' + i + '\\pythonw');
          locations.push('\\Python' + i + '\\pythonw');
          i++;
        }
      }
      args = ['--version'];
      if (locations.length === 0) {
        callback(null);
        return;
      }
      location = locations[0];
      return execFile(location, args, function(error, stdout, stderr) {
        if (error == null) {
          global.cachedPythonLocation = location;
          return callback(location);
        } else {
          locations.splice(0, 1);
          return pythonLocation(callback, locations);
        }
      });
    }
  };

  installPython = function() {
    var arch, pyVer, url, zipFile;
    if (os.type() === 'Windows_NT') {
      pyVer = '3.5.0';
      arch = 'win32';
      if (os.arch().indexOf('x64') > -1) {
        arch = 'amd64';
      }
      url = 'https://www.python.org/ftp/python/' + pyVer + '/python-' + pyVer + '-embed-' + arch + '.zip';
      console.log('Downloading python...');
      zipFile = __dirname + path.sep + 'python.zip';
      return downloadFile(url, zipFile, function() {
        console.log('Extracting python...');
        return unzip(zipFile, __dirname + path.sep + 'python', function() {
          fs.unlink(zipFile);
          return console.log('Finished installing python.');
        });
      });
    } else {
      return window.alert('WakaTime depends on Python. Install it from https://python.org/downloads then restart Atom.');
    }
  };

  isCLIInstalled = function() {
    return fs.existsSync(cliLocation());
  };

  isCLILatest = function(callback) {
    return pythonLocation(function(python) {
      var args;
      if (python != null) {
        args = [cliLocation(), '--version'];
        return execFile(python, args, function(error, stdout, stderr) {
          var currentVersion;
          if (error == null) {
            currentVersion = stderr.trim();
            console.log('Current wakatime-cli version is ' + currentVersion);
            console.log('Checking for updates to wakatime-cli...');
            return getLatestCliVersion(function(latestVersion) {
              if (currentVersion === latestVersion) {
                console.log('wakatime-cli is up to date.');
                if (callback != null) {
                  return callback(true);
                }
              } else {
                console.log('Found an updated wakatime-cli v' + latestVersion);
                if (callback != null) {
                  return callback(false);
                }
              }
            });
          } else {
            if (callback != null) {
              return callback(false);
            }
          }
        });
      }
    });
  };

  getLatestCliVersion = function(callback) {
    var url;
    url = 'https://raw.githubusercontent.com/wakatime/wakatime/master/wakatime/__about__.py';
    return request.get(url, function(error, response, body) {
      var line, match, re, version, _i, _len, _ref;
      version = null;
      if (!error && response.statusCode === 200) {
        re = new RegExp(/__version_info__ = \('([0-9]+)', '([0-9]+)', '([0-9]+)'\)/g);
        _ref = body.split('\n');
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          line = _ref[_i];
          match = re.exec(line);
          if (match != null) {
            version = match[1] + '.' + match[2] + '.' + match[3];
          }
        }
      }
      if (callback != null) {
        return callback(version);
      }
    });
  };

  cliLocation = function() {
    var dir;
    dir = __dirname + path.sep + 'wakatime-master' + path.sep + 'wakatime' + path.sep + 'cli.py';
    return dir;
  };

  installCLI = function(callback) {
    var url, zipFile;
    console.log('Downloading wakatime cli...');
    url = 'https://github.com/wakatime/wakatime/archive/master.zip';
    zipFile = __dirname + path.sep + 'wakatime-master.zip';
    return downloadFile(url, zipFile, function() {
      return extractCLI(zipFile, callback);
    });
  };

  extractCLI = function(zipFile, callback) {
    console.log('Extracting wakatime-master.zip file...');
    return removeCLI(function() {
      return unzip(zipFile, __dirname, callback);
    });
  };

  removeCLI = function(callback) {
    var e;
    if (fs.existsSync(__dirname + path.sep + 'wakatime-master')) {
      try {
        return rimraf(__dirname + path.sep + 'wakatime-master', function() {
          if (callback != null) {
            return callback();
          }
        });
      } catch (_error) {
        e = _error;
        console.warn(e);
        if (callback != null) {
          return callback();
        }
      }
    } else {
      if (callback != null) {
        return callback();
      }
    }
  };

  downloadFile = function(url, outputFile, callback) {
    var out, r;
    r = request(url);
    out = fs.createWriteStream(outputFile);
    r.pipe(out);
    return r.on('end', function() {
      return out.on('finish', function() {
        if (callback != null) {
          return callback();
        }
      });
    });
  };

  unzip = function(file, outputDir, callback) {
    var e, zip;
    if (fs.existsSync(file)) {
      try {
        zip = new AdmZip(file);
        return zip.extractAllTo(outputDir, true);
      } catch (_error) {
        e = _error;
        return console.warn(e);
      } finally {
        fs.unlink(file);
        if (callback != null) {
          callback();
        }
      }
    }
  };

  sendHeartbeat = function(file, lineno, isWrite) {
    var currentFile, time;
    if ((file.path == null) || file.path === void 0 || fileIsIgnored(file.path)) {
      return;
    }
    time = Date.now();
    currentFile = file.path;
    if (isWrite || enoughTimePassed(time) || lastFile !== currentFile) {
      return pythonLocation(function(python) {
        var args, proc, realPath, rootDir, _i, _len, _ref;
        if (!((python != null) && (apiKey != null))) {
          return;
        }
        args = [cliLocation(), '--file', currentFile, '--key', apiKey, '--plugin', 'atom-wakatime/' + packageVersion];
        if (isWrite) {
          args.push('--write');
        }
        if (lineno != null) {
          args.push('--lineno');
          args.push(lineno);
        }
        if (atom.project.contains(file.path)) {
          currentFile = file.path;
          _ref = atom.project.rootDirectories;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            rootDir = _ref[_i];
            realPath = rootDir.realPath;
            if (currentFile.indexOf(realPath) > -1) {
              args.push('--alternate-project');
              args.push(path.basename(realPath));
              break;
            }
          }
        }
        proc = execFile(python, args, function(error, stdout, stderr) {
          var msg, status, title, today;
          if (error != null) {
            if ((stderr != null) && stderr !== '') {
              console.warn(stderr);
            }
            if ((stdout != null) && stdout !== '') {
              console.warn(stdout);
            }
            if (proc.exitCode === 102) {
              msg = null;
              status = null;
              title = 'WakaTime Offline, coding activity will sync when online.';
            } else if (proc.exitCode === 103) {
              msg = 'An error occured while parsing ~/.wakatime.cfg. Check ~/.wakatime.log for more info.';
              status = 'Error';
              title = msg;
            } else if (proc.exitCode === 104) {
              msg = 'Invalid API Key. Make sure your API Key is correct!';
              status = 'Error';
              title = msg;
            } else {
              msg = error;
              status = 'Error';
              title = 'Unknown Error (' + proc.exitCode + '); Check your Dev Console and ~/.wakatime.log for more info.';
            }
            console.warn(msg);
            if (statusBarTileView != null) {
              statusBarTileView.setStatus(status);
            }
            return statusBarTileView != null ? statusBarTileView.setTitle(title) : void 0;
          } else {
            if (statusBarTileView != null) {
              statusBarTileView.setStatus();
            }
            today = new Date();
            return statusBarTileView != null ? statusBarTileView.setTitle('Last heartbeat sent ' + formatDate(today)) : void 0;
          }
        });
        lastHeartbeat = time;
        return lastFile = file.path;
      });
    }
  };

  fileIsIgnored = function(file) {
    var ignore, pattern, patterns, re, _i, _len;
    if (endsWith(file, 'COMMIT_EDITMSG') || endsWith(file, 'PULLREQ_EDITMSG') || endsWith(file, 'MERGE_MSG') || endsWith(file, 'TAG_EDITMSG')) {
      return true;
    }
    patterns = atom.config.get('wakatime.ignore');
    ignore = false;
    for (_i = 0, _len = patterns.length; _i < _len; _i++) {
      pattern = patterns[_i];
      re = new RegExp(pattern, 'gi');
      if (re.test(file)) {
        ignore = true;
        break;
      }
    }
    return ignore;
  };

  endsWith = function(str, suffix) {
    if ((str != null) && (suffix != null)) {
      return str.indexOf(suffix, str.length - suffix.length) !== -1;
    }
    return false;
  };

  formatDate = function(date) {
    var ampm, hour, minute, months;
    months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    ampm = 'AM';
    hour = date.getHours();
    if (hour > 11) {
      ampm = 'PM';
      hour = hour - 12;
    }
    if (hour === 0) {
      hour = 12;
    }
    minute = date.getMinutes();
    if (minute < 10) {
      minute = '0' + minute;
    }
    return months[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear() + ' ' + hour + ':' + minute + ' ' + ampm;
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2luX2NoYWxpYy8uYXRvbS9wYWNrYWdlcy93YWthdGltZS9saWIvd2FrYXRpbWUuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQTs7Ozs7O0dBQUE7QUFBQTtBQUFBO0FBQUEsTUFBQSxrZUFBQTs7QUFBQSxFQVNBLGNBQUEsR0FBaUIsSUFUakIsQ0FBQTs7QUFBQSxFQVVBLGFBQUEsR0FBZ0IsSUFWaEIsQ0FBQTs7QUFBQSxFQVdBLGFBQUEsR0FBZ0IsQ0FYaEIsQ0FBQTs7QUFBQSxFQVlBLFFBQUEsR0FBVyxFQVpYLENBQUE7O0FBQUEsRUFhQSxNQUFBLEdBQVMsSUFiVCxDQUFBOztBQUFBLEVBY0EsaUJBQUEsR0FBb0IsSUFkcEIsQ0FBQTs7QUFBQSxFQWVBLFdBQUEsR0FBYyxLQWZkLENBQUE7O0FBQUEsRUFrQkEsTUFBQSxHQUFTLE9BQUEsQ0FBUSxTQUFSLENBbEJULENBQUE7O0FBQUEsRUFtQkEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSLENBbkJMLENBQUE7O0FBQUEsRUFvQkEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSLENBcEJMLENBQUE7O0FBQUEsRUFxQkEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBckJQLENBQUE7O0FBQUEsRUFzQkEsUUFBQSxHQUFXLE9BQUEsQ0FBUSxlQUFSLENBQXdCLENBQUMsUUF0QnBDLENBQUE7O0FBQUEsRUF1QkEsT0FBQSxHQUFVLE9BQUEsQ0FBUSxTQUFSLENBdkJWLENBQUE7O0FBQUEsRUF3QkEsTUFBQSxHQUFTLE9BQUEsQ0FBUSxRQUFSLENBeEJULENBQUE7O0FBQUEsRUF5QkEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxLQUFSLENBekJOLENBQUE7O0FBQUEsRUEyQkEsaUJBQUEsR0FBb0IsT0FBQSxDQUFRLHdCQUFSLENBM0JwQixDQUFBOztBQUFBLEVBNkJB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

//# sourceURL=/home/cin_chalic/.atom/packages/wakatime/lib/wakatime.coffee
