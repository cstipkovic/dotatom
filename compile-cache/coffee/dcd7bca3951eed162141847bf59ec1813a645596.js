
/*
WakaTime
Description: Analytics for programmers.
Maintainer:  WakaTime <support@wakatime.com>
License:     BSD, see LICENSE for more details.
Website:     https://wakatime.com/
 */

(function() {
  var AdmZip, Logger, StatusBarTileView, checkCLI, cliLocation, debug, downloadFile, endsWith, enoughTimePassed, execFile, extractCLI, fileIsIgnored, finishActivation, formatDate, fs, getLatestCliVersion, getUserHome, ini, installCLI, installPython, isCLIInstalled, isCLILatest, isPythonInstalled, isValidApiKey, lastFile, lastHeartbeat, log, os, packageVersion, path, pluginReady, pythonLocation, removeCLI, request, rimraf, saveApiKey, sendHeartbeat, settingChangedHandler, setupConfigs, setupEventHandlers, statusBarIcon, unzip;

  log = null;

  packageVersion = null;

  lastHeartbeat = 0;

  lastFile = '';

  statusBarIcon = null;

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

  Logger = require('./logger');

  module.exports = {
    activate: function(state) {
      log = new Logger('WakaTime');
      if (atom.config.get('wakatime.debug')) {
        log.setLevel('DEBUG');
      }
      packageVersion = atom.packages.getLoadedPackage('wakatime').metadata.version;
      log.debug('Initializing WakaTime v' + packageVersion + '...');
      setupConfigs();
      this.settingChangedObserver = atom.config.observe('wakatime', settingChangedHandler);
      return isPythonInstalled(function(installed) {
        if (!installed) {
          if (os.type() === 'Windows_NT') {
            return installPython(checkCLI);
          } else {
            return window.alert('Please install Python (https://www.python.org/downloads/) and restart Atom to enable the WakaTime plugin.');
          }
        } else {
          return checkCLI();
        }
      });
    },
    consumeStatusBar: function(statusBar) {
      statusBarIcon = new StatusBarTileView();
      statusBarIcon.init();
      this.statusBarTile = statusBar != null ? statusBar.addRightTile({
        item: statusBarIcon,
        priority: 300
      }) : void 0;
      if (atom.config.get('wakatime.showStatusBarIcon')) {
        statusBarIcon.show();
      } else {
        statusBarIcon.hide();
      }
      if (pluginReady) {
        statusBarIcon.setTitle('WakaTime ready');
        return statusBarIcon.setStatus();
      }
    },
    deactivate: function() {
      var _ref, _ref1;
      if ((_ref = this.statusBarTile) != null) {
        _ref.destroy();
      }
      if (statusBarIcon != null) {
        statusBarIcon.destroy();
      }
      return (_ref1 = this.settingChangedObserver) != null ? _ref1.dispose() : void 0;
    }
  };

  checkCLI = function() {
    var beenawhile, currentTime, hours, lastInit;
    if (!isCLIInstalled()) {
      return installCLI(function() {
        log.debug('Finished installing wakatime-cli.');
        return finishActivation();
      });
    } else {
      hours = 24;
      lastInit = atom.config.get('wakatime-hidden.lastInit');
      currentTime = Math.round((new Date).getTime() / 1000);
      beenawhile = parseInt(lastInit, 10) + 3600 * hours < currentTime;
      if ((lastInit == null) || beenawhile || atom.config.get('wakatime.debug')) {
        atom.config.set('wakatime-hidden.lastInit', currentTime);
        return isCLILatest(function(latest) {
          if (!latest) {
            return installCLI(function() {
              log.debug('Finished installing wakatime-cli.');
              return finishActivation();
            });
          } else {
            return finishActivation();
          }
        });
      } else {
        return finishActivation();
      }
    }
  };

  finishActivation = function() {
    pluginReady = true;
    setupEventHandlers();
    if (atom.config.get('wakatime.showStatusBarIcon')) {
      if (statusBarIcon != null) {
        statusBarIcon.show();
      }
    } else {
      if (statusBarIcon != null) {
        statusBarIcon.hide();
      }
    }
    if (statusBarIcon != null) {
      statusBarIcon.setTitle('WakaTime ready');
    }
    if (statusBarIcon != null) {
      statusBarIcon.setStatus();
    }
    return log.debug('Finished initializing WakaTime.');
  };

  settingChangedHandler = function(settings) {
    var apiKey;
    if (settings.showStatusBarIcon) {
      if (statusBarIcon != null) {
        statusBarIcon.show();
      }
    } else {
      if (statusBarIcon != null) {
        statusBarIcon.hide();
      }
    }
    if (atom.config.get('wakatime.debug')) {
      log.setLevel('DEBUG');
    } else {
      log.setLevel('INFO');
    }
    apiKey = settings.apikey;
    if (isValidApiKey(apiKey)) {
      atom.config.set('wakatime.apikey', '');
      atom.config.set('wakatime.apikey', 'Saved in your ~/.wakatime.cfg file');
      return saveApiKey(apiKey);
    }
  };

  saveApiKey = function(apiKey) {
    var configFile;
    configFile = path.join(getUserHome(), '.wakatime.cfg');
    return fs.readFile(configFile, 'utf-8', function(err, inp) {
      var contents, currentKey, currentSection, found, line, parts, _base, _base1, _i, _len, _ref;
      if (err != null) {
        log.debug('Error: could not read wakatime config file');
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
          log.error(msg);
          if (statusBarIcon != null) {
            statusBarIcon.setStatus('Error');
          }
          return statusBarIcon != null ? statusBarIcon.setTitle(msg) : void 0;
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
      if (err != null) {
        log.debug('Error: could not read wakatime config file');
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

  setupEventHandlers = function(callback) {
    return atom.workspace.observeTextEditors(function(editor) {
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
        editor.onDidChangeCursorPosition(function(e) {
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
      if (callback != null) {
        return callback();
      }
    });
  };

  isPythonInstalled = function(callback) {
    return pythonLocation(function(result) {
      return callback(result != null);
    });
  };

  pythonLocation = function(callback, locations) {
    var args, i, location, pattern;
    if (global.cachedPythonLocation != null) {
      return callback(global.cachedPythonLocation);
    } else {
      if (locations == null) {
        locations = [__dirname + path.sep + 'python' + path.sep + 'pythonw', 'pythonw', 'python', '/usr/local/bin/python', '/usr/bin/python'];
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
      pattern = /\d+\.\d+/;
      location = locations[0];
      return execFile(location, args, function(error, stdout, stderr) {
        if (error == null) {
          if ((stdout != null) && stdout.match(pattern) || (stderr != null) && stderr.match(pattern)) {
            global.cachedPythonLocation = location;
            return callback(location);
          }
        } else {
          locations.splice(0, 1);
          return pythonLocation(callback, locations);
        }
      });
    }
  };

  installPython = function(callback) {
    var arch, pyVer, url, zipFile;
    pyVer = '3.5.1';
    arch = 'win32';
    if (os.arch().indexOf('x64') > -1) {
      arch = 'amd64';
    }
    url = 'https://www.python.org/ftp/python/' + pyVer + '/python-' + pyVer + '-embed-' + arch + '.zip';
    log.debug('downloading python...');
    if (statusBarIcon != null) {
      statusBarIcon.setStatus('downloading python...');
    }
    zipFile = __dirname + path.sep + 'python.zip';
    return downloadFile(url, zipFile, function() {
      log.debug('extracting python...');
      if (statusBarIcon != null) {
        statusBarIcon.setStatus('extracting python...');
      }
      return unzip(zipFile, __dirname + path.sep + 'python', function() {
        fs.unlink(zipFile);
        log.debug('Finished installing python.');
        if (callback != null) {
          return callback();
        }
      });
    });
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
            log.debug('Current wakatime-cli version is ' + currentVersion);
            log.debug('Checking for updates to wakatime-cli...');
            return getLatestCliVersion(function(latestVersion) {
              if (currentVersion === latestVersion) {
                log.debug('wakatime-cli is up to date.');
                if (callback != null) {
                  return callback(true);
                }
              } else {
                if (latestVersion != null) {
                  log.debug('Found an updated wakatime-cli v' + latestVersion);
                  if (callback != null) {
                    return callback(false);
                  }
                } else {
                  log.debug('Unable to find latest wakatime-cli version from GitHub.');
                  if (callback != null) {
                    return callback(true);
                  }
                }
              }
            });
          } else {
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
    log.debug('Downloading wakatime-cli...');
    if (statusBarIcon != null) {
      statusBarIcon.setStatus('downloading wakatime-cli...');
    }
    url = 'https://github.com/wakatime/wakatime/archive/master.zip';
    zipFile = __dirname + path.sep + 'wakatime-master.zip';
    return downloadFile(url, zipFile, function() {
      return extractCLI(zipFile, callback);
    });
  };

  extractCLI = function(zipFile, callback) {
    log.debug('Extracting wakatime-master.zip file...');
    if (statusBarIcon != null) {
      statusBarIcon.setStatus('extracting wakatime-cli...');
    }
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
        log.warn(e);
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
        return log.warn(e);
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
        if (atom.config.get('wakatime.debug')) {
          args.push('--verbose');
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
        log.debug(python + ' ' + args.join(' '));
        proc = execFile(python, args, function(error, stdout, stderr) {
          var msg, status, title, today;
          if (error != null) {
            if ((stderr != null) && stderr !== '') {
              log.warn(stderr);
            }
            if ((stdout != null) && stdout !== '') {
              log.warn(stdout);
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
            if (msg != null) {
              log.warn(msg);
            }
            if (statusBarIcon != null) {
              statusBarIcon.setStatus(status);
            }
            return statusBarIcon != null ? statusBarIcon.setTitle(title) : void 0;
          } else {
            if (statusBarIcon != null) {
              statusBarIcon.setStatus();
            }
            today = new Date();
            return statusBarIcon != null ? statusBarIcon.setTitle('Last heartbeat sent ' + formatDate(today)) : void 0;
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
    if (patterns == null) {
      return true;
    }
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

  debug = function(callback) {
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
        log.warn(e);
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

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2luX2NoYWxpYy8uYXRvbS9wYWNrYWdlcy93YWthdGltZS9saWIvd2FrYXRpbWUuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQTs7Ozs7O0dBQUE7QUFBQTtBQUFBO0FBQUEsTUFBQSw0Z0JBQUE7O0FBQUEsRUFTQSxHQUFBLEdBQU0sSUFUTixDQUFBOztBQUFBLEVBVUEsY0FBQSxHQUFpQixJQVZqQixDQUFBOztBQUFBLEVBV0EsYUFBQSxHQUFnQixDQVhoQixDQUFBOztBQUFBLEVBWUEsUUFBQSxHQUFXLEVBWlgsQ0FBQTs7QUFBQSxFQWFBLGFBQUEsR0FBZ0IsSUFiaEIsQ0FBQTs7QUFBQSxFQWNBLFdBQUEsR0FBYyxLQWRkLENBQUE7O0FBQUEsRUFpQkEsTUFBQSxHQUFTLE9BQUEsQ0FBUSxTQUFSLENBakJULENBQUE7O0FBQUEsRUFrQkEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSLENBbEJMLENBQUE7O0FBQUEsRUFtQkEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSLENBbkJMLENBQUE7O0FBQUEsRUFvQkEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBcEJQLENBQUE7O0FBQUEsRUFxQkEsUUFBQSxHQUFXLE9BQUEsQ0FBUSxlQUFSLENBQXdCLENBQUMsUUFyQnBDLENBQUE7O0FBQUEsRUFzQkEsT0FBQSxHQUFVLE9BQUEsQ0FBUSxTQUFSLENBdEJWLENBQUE7O0FBQUEsRUF1QkEsTUFBQSxHQUFTLE9BQUEsQ0FBUSxRQUFSLENBdkJULENBQUE7O0FBQUEsRUF3QkEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxLQUFSLENBeEJOLENBQUE7O0FBQUEsRUEwQkEsaUJBQUEsR0FBb0IsT0FBQSxDQUFRLHdCQUFSLENBMUJwQixDQUFBOztBQUFBLEVBMkJBLE1BQUEsR0FBUyxPQUFBLENBQVEsVUFBUixDQTNCVCxD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

//# sourceURL=/home/cin_chalic/.atom/packages/wakatime/lib/wakatime.coffee
