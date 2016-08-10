
/*
WakaTime
Description: Analytics for programmers.
Maintainer:  WakaTime <support@wakatime.com>
License:     BSD, see LICENSE for more details.
Website:     https://wakatime.com/
 */

(function() {
  var AdmZip, StatusBarTileView, cleanupOnUninstall, cliLocation, downloadFile, endsWith, enoughTimePassed, execFile, extractCLI, fileIsIgnored, formatDate, fs, getLatestCliVersion, getUserHome, ini, installCLI, installPython, isCLIInstalled, isCLILatest, isPythonInstalled, isValidApiKey, lastFile, lastHeartbeat, os, packageVersion, path, pluginReady, pythonLocation, removeCLI, request, rimraf, saveApiKey, sendHeartbeat, settingChangedHandler, setupConfigs, setupEventHandlers, statusBarTileView, unloadHandler, unzip;

  packageVersion = null;

  unloadHandler = null;

  lastHeartbeat = 0;

  lastFile = '';

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
      },
      showStatusBarIcon: {
        title: 'Show WakaTime in Atom status bar',
        description: 'Add an icon to Atom\'s status bar with WakaTime info. Hovering over the icon shows current WakaTime status or error message.',
        type: 'boolean',
        "default": true,
        order: 3
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
      setupConfigs();
      if (statusBarTileView != null) {
        statusBarTileView.setTitle('WakaTime initialized');
      }
      if (statusBarTileView != null) {
        statusBarTileView.setStatus();
      }
      return this.settingChangedObserver = atom.config.observe('wakatime', settingChangedHandler);
    },
    consumeStatusBar: function(statusBar) {
      statusBarTileView = new StatusBarTileView();
      statusBarTileView.init();
      this.statusBarTile = statusBar != null ? statusBar.addRightTile({
        item: statusBarTileView,
        priority: 300
      }) : void 0;
      if (pluginReady) {
        statusBarTileView.setTitle('WakaTime initialized');
        statusBarTileView.setStatus();
        if (!atom.config.get('wakatime.showStatusBarIcon')) {
          return statusBarTileView != null ? statusBarTileView.hide() : void 0;
        }
      }
    },
    deactivate: function() {
      var _ref, _ref1;
      if ((_ref = this.statusBarTile) != null) {
        _ref.destroy();
      }
      if (statusBarTileView != null) {
        statusBarTileView.destroy();
      }
      return (_ref1 = this.settingChangedObserver) != null ? _ref1.dispose() : void 0;
    }
  };

  settingChangedHandler = function(settings) {
    var apiKey;
    if (settings.showStatusBarIcon) {
      if (statusBarTileView != null) {
        statusBarTileView.show();
      }
    } else {
      if (statusBarTileView != null) {
        statusBarTileView.hide();
      }
    }
    if (pluginReady) {
      apiKey = settings.apikey;
      if (isValidApiKey(apiKey)) {
        atom.config.set('wakatime.apikey', '');
        atom.config.set('wakatime.apikey', 'Saved in your ~/.wakatime.cfg file');
        return saveApiKey(apiKey);
      }
    }
  };

  saveApiKey = function(apiKey) {
    var configFile;
    configFile = path.join(getUserHome(), '.wakatime.cfg');
    return fs.readFile(configFile, 'utf-8', function(err, inp) {
      var contents, currentKey, currentSection, found, line, parts, _base, _base1, _i, _len, _ref;
      if (err != null) {
        console.log('Error: could not read wakatime config file');
      }
      if ((_base = String.prototype).startsWith == null) {
        _base.startsWith = function(s) {
          return this.slice(0, s.length) === s;
        };
      }
      if ((_base1 = String.prototype).endsWith == null) {
        _base1.endsWith = function(s) {
          return s === '' || this.slice(-s.length) === s;
        };
      }
      contents = [];
      currentSection = '';
      found = false;
      if (inp != null) {
        _ref = inp.split('\n');
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          line = _ref[_i];
          if (line.trim().startsWith('[') && line.trim().endsWith(']')) {
            if (currentSection === 'settings' && !found) {
              contents.push('api_key = ' + apiKey);
              found = true;
            }
            currentSection = line.trim().substring(1, line.trim().length - 1).toLowerCase();
            contents.push(line);
          } else if (currentSection === 'settings') {
            parts = line.split('=');
            currentKey = parts[0].trim();
            if (currentKey === 'api_key') {
              if (!found) {
                contents.push('api_key = ' + apiKey);
                found = true;
              }
            } else {
              contents.push(line);
            }
          } else {
            contents.push(line);
          }
        }
      }
      if (!found) {
        if (currentSection !== 'settings') {
          contents.push('[settings]');
        }
        contents.push('api_key = ' + apiKey);
      }
      return fs.writeFile(configFile, contents.join('\n'), {
        encoding: 'utf-8'
      }, function(err2) {
        var msg;
        if (err2 != null) {
          msg = 'Error: could not write to wakatime config file';
          console.error(msg);
          if (statusBarTileView != null) {
            statusBarTileView.setStatus('Error');
          }
          return statusBarTileView != null ? statusBarTileView.setTitle(msg) : void 0;
        }
      });
    });
  };

  getUserHome = function() {
    return process.env[process.platform === 'win32' ? 'USERPROFILE' : 'HOME'] || '';
  };

  setupConfigs = function() {
    var configFile;
    configFile = path.join(getUserHome(), '.wakatime.cfg');
    return fs.readFile(configFile, 'utf-8', function(err, configContent) {
      var commonConfigs;
      pluginReady = true;
      if (err != null) {
        console.log('Error: could not read wakatime config file');
        settingChangedHandler(atom.config.get('wakatime'));
        return;
      }
      commonConfigs = ini.decode(configContent);
      if ((commonConfigs != null) && (commonConfigs.settings != null) && isValidApiKey(commonConfigs.settings.api_key)) {
        atom.config.set('wakatime.apikey', '');
        return atom.config.set('wakatime.apikey', 'Saved in your ~/.wakatime.cfg file');
      } else {
        return settingChangedHandler(atom.config.get('wakatime'));
      }
    });
  };

  isValidApiKey = function(key) {
    var re;
    if (key == null) {
      return false;
    }
    re = new RegExp('^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$', 'i');
    return re.test(key);
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
      pyVer = '3.5.1';
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
        if (python == null) {
          return;
        }
        args = [cliLocation(), '--file', currentFile, '--plugin', 'atom-wakatime/' + packageVersion];
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2luX2NoYWxpYy8uYXRvbS9wYWNrYWdlcy93YWthdGltZS9saWIvd2FrYXRpbWUuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQTs7Ozs7O0dBQUE7QUFBQTtBQUFBO0FBQUEsTUFBQSxtZ0JBQUE7O0FBQUEsRUFTQSxjQUFBLEdBQWlCLElBVGpCLENBQUE7O0FBQUEsRUFVQSxhQUFBLEdBQWdCLElBVmhCLENBQUE7O0FBQUEsRUFXQSxhQUFBLEdBQWdCLENBWGhCLENBQUE7O0FBQUEsRUFZQSxRQUFBLEdBQVcsRUFaWCxDQUFBOztBQUFBLEVBYUEsaUJBQUEsR0FBb0IsSUFicEIsQ0FBQTs7QUFBQSxFQWNBLFdBQUEsR0FBYyxLQWRkLENBQUE7O0FBQUEsRUFpQkEsTUFBQSxHQUFTLE9BQUEsQ0FBUSxTQUFSLENBakJULENBQUE7O0FBQUEsRUFrQkEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSLENBbEJMLENBQUE7O0FBQUEsRUFtQkEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSLENBbkJMLENBQUE7O0FBQUEsRUFvQkEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBcEJQLENBQUE7O0FBQUEsRUFxQkEsUUFBQSxHQUFXLE9BQUEsQ0FBUSxlQUFSLENBQXdCLENBQUMsUUFyQnBDLENBQUE7O0FBQUEsRUFzQkEsT0FBQSxHQUFVLE9BQUEsQ0FBUSxTQUFSLENBdEJWLENBQUE7O0FBQUEsRUF1QkEsTUFBQSxHQUFTLE9BQUEsQ0FBUSxRQUFSLENBdkJULENBQUE7O0FBQUEsRUF3QkEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxLQUFSLENBeEJOLENBQUE7O0FBQUEsRUEwQkEsaUJBQUEsR0FBb0IsT0FBQSxDQUFRLHdCQUFSLENBMUJwQixDQUFBOztBQUFBLEVBNEJBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFB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

//# sourceURL=/home/cin_chalic/.atom/packages/wakatime/lib/wakatime.coffee
