
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2luX2NoYWxpYy8uYXRvbS9wYWNrYWdlcy93YWthdGltZS9saWIvd2FrYXRpbWUuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQTs7Ozs7O0dBQUE7QUFBQTtBQUFBO0FBQUEsTUFBQSw0Z0JBQUE7O0FBQUEsRUFTQSxHQUFBLEdBQU0sSUFUTixDQUFBOztBQUFBLEVBVUEsY0FBQSxHQUFpQixJQVZqQixDQUFBOztBQUFBLEVBV0EsYUFBQSxHQUFnQixDQVhoQixDQUFBOztBQUFBLEVBWUEsUUFBQSxHQUFXLEVBWlgsQ0FBQTs7QUFBQSxFQWFBLGFBQUEsR0FBZ0IsSUFiaEIsQ0FBQTs7QUFBQSxFQWNBLFdBQUEsR0FBYyxLQWRkLENBQUE7O0FBQUEsRUFpQkEsTUFBQSxHQUFTLE9BQUEsQ0FBUSxTQUFSLENBakJULENBQUE7O0FBQUEsRUFrQkEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSLENBbEJMLENBQUE7O0FBQUEsRUFtQkEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSLENBbkJMLENBQUE7O0FBQUEsRUFvQkEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBcEJQLENBQUE7O0FBQUEsRUFxQkEsUUFBQSxHQUFXLE9BQUEsQ0FBUSxlQUFSLENBQXdCLENBQUMsUUFyQnBDLENBQUE7O0FBQUEsRUFzQkEsT0FBQSxHQUFVLE9BQUEsQ0FBUSxTQUFSLENBdEJWLENBQUE7O0FBQUEsRUF1QkEsTUFBQSxHQUFTLE9BQUEsQ0FBUSxRQUFSLENBdkJULENBQUE7O0FBQUEsRUF3QkEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxLQUFSLENBeEJOLENBQUE7O0FBQUEsRUEwQkEsaUJBQUEsR0FBb0IsT0FBQSxDQUFRLHdCQUFSLENBMUJwQixDQUFBOztBQUFBLEVBMkJBLE1BQUEsR0FBUyxPQUFBLENBQVEsVUFBUixDQTNCVCxDQUFBOztBQUFBLEVBNkJBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLFFBQUEsRUFBVSxTQUFDLEtBQUQsR0FBQTtBQUNSLE1BQUEsR0FBQSxHQUFVLElBQUEsTUFBQSxDQUFPLFVBQVAsQ0FBVixDQUFBO0FBQ0EsTUFBQSxJQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixnQkFBaEIsQ0FBSDtBQUNFLFFBQUEsR0FBRyxDQUFDLFFBQUosQ0FBYSxPQUFiLENBQUEsQ0FERjtPQURBO0FBQUEsTUFHQSxjQUFBLEdBQWlCLElBQUksQ0FBQyxRQUFRLENBQUMsZ0JBQWQsQ0FBK0IsVUFBL0IsQ0FBMEMsQ0FBQyxRQUFRLENBQUMsT0FIckUsQ0FBQTtBQUFBLE1BSUEsR0FBRyxDQUFDLEtBQUosQ0FBVSx5QkFBQSxHQUE0QixjQUE1QixHQUE2QyxLQUF2RCxDQUpBLENBQUE7QUFBQSxNQUtBLFlBQUEsQ0FBQSxDQUxBLENBQUE7QUFBQSxNQU1BLElBQUMsQ0FBQSxzQkFBRCxHQUEwQixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQVosQ0FBb0IsVUFBcEIsRUFBZ0MscUJBQWhDLENBTjFCLENBQUE7YUFRQSxpQkFBQSxDQUFrQixTQUFDLFNBQUQsR0FBQTtBQUNoQixRQUFBLElBQUcsQ0FBQSxTQUFIO0FBQ0UsVUFBQSxJQUFHLEVBQUUsQ0FBQyxJQUFILENBQUEsQ0FBQSxLQUFhLFlBQWhCO21CQUNFLGFBQUEsQ0FBYyxRQUFkLEVBREY7V0FBQSxNQUFBO21CQUdFLE1BQU0sQ0FBQyxLQUFQLENBQWEsMkdBQWIsRUFIRjtXQURGO1NBQUEsTUFBQTtpQkFNRSxRQUFBLENBQUEsRUFORjtTQURnQjtNQUFBLENBQWxCLEVBVFE7SUFBQSxDQUFWO0FBQUEsSUFtQkEsZ0JBQUEsRUFBa0IsU0FBQyxTQUFELEdBQUE7QUFDaEIsTUFBQSxhQUFBLEdBQW9CLElBQUEsaUJBQUEsQ0FBQSxDQUFwQixDQUFBO0FBQUEsTUFDQSxhQUFhLENBQUMsSUFBZCxDQUFBLENBREEsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLGFBQUQsdUJBQWlCLFNBQVMsQ0FBRSxZQUFYLENBQXdCO0FBQUEsUUFBQSxJQUFBLEVBQU0sYUFBTjtBQUFBLFFBQXFCLFFBQUEsRUFBVSxHQUEvQjtPQUF4QixVQUZqQixDQUFBO0FBS0EsTUFBQSxJQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiw0QkFBaEIsQ0FBSDtBQUNFLFFBQUEsYUFBYSxDQUFDLElBQWQsQ0FBQSxDQUFBLENBREY7T0FBQSxNQUFBO0FBR0UsUUFBQSxhQUFhLENBQUMsSUFBZCxDQUFBLENBQUEsQ0FIRjtPQUxBO0FBVUEsTUFBQSxJQUFHLFdBQUg7QUFDRSxRQUFBLGFBQWEsQ0FBQyxRQUFkLENBQXVCLGdCQUF2QixDQUFBLENBQUE7ZUFDQSxhQUFhLENBQUMsU0FBZCxDQUFBLEVBRkY7T0FYZ0I7SUFBQSxDQW5CbEI7QUFBQSxJQWtDQSxVQUFBLEVBQVksU0FBQSxHQUFBO0FBQ1YsVUFBQSxXQUFBOztZQUFjLENBQUUsT0FBaEIsQ0FBQTtPQUFBOztRQUNBLGFBQWEsQ0FBRSxPQUFmLENBQUE7T0FEQTtrRUFFdUIsQ0FBRSxPQUF6QixDQUFBLFdBSFU7SUFBQSxDQWxDWjtHQTlCRixDQUFBOztBQUFBLEVBcUVBLFFBQUEsR0FBVyxTQUFBLEdBQUE7QUFDVCxRQUFBLHdDQUFBO0FBQUEsSUFBQSxJQUFHLENBQUEsY0FBSSxDQUFBLENBQVA7YUFDRSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsUUFBQSxHQUFHLENBQUMsS0FBSixDQUFVLG1DQUFWLENBQUEsQ0FBQTtlQUNBLGdCQUFBLENBQUEsRUFGUztNQUFBLENBQVgsRUFERjtLQUFBLE1BQUE7QUFRRSxNQUFBLEtBQUEsR0FBUSxFQUFSLENBQUE7QUFBQSxNQUVBLFFBQUEsR0FBVyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsMEJBQWhCLENBRlgsQ0FBQTtBQUFBLE1BR0EsV0FBQSxHQUFjLElBQUksQ0FBQyxLQUFMLENBQVcsQ0FBQyxHQUFBLENBQUEsSUFBRCxDQUFVLENBQUMsT0FBWCxDQUFBLENBQUEsR0FBdUIsSUFBbEMsQ0FIZCxDQUFBO0FBQUEsTUFJQSxVQUFBLEdBQWEsUUFBQSxDQUFTLFFBQVQsRUFBbUIsRUFBbkIsQ0FBQSxHQUF5QixJQUFBLEdBQU8sS0FBaEMsR0FBd0MsV0FKckQsQ0FBQTtBQU1BLE1BQUEsSUFBTyxrQkFBSixJQUFpQixVQUFqQixJQUErQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsZ0JBQWhCLENBQWxDO0FBQ0UsUUFBQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsMEJBQWhCLEVBQTRDLFdBQTVDLENBQUEsQ0FBQTtlQUNBLFdBQUEsQ0FBWSxTQUFDLE1BQUQsR0FBQTtBQUNWLFVBQUEsSUFBRyxDQUFBLE1BQUg7bUJBQ0UsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULGNBQUEsR0FBRyxDQUFDLEtBQUosQ0FBVSxtQ0FBVixDQUFBLENBQUE7cUJBQ0EsZ0JBQUEsQ0FBQSxFQUZTO1lBQUEsQ0FBWCxFQURGO1dBQUEsTUFBQTttQkFNRSxnQkFBQSxDQUFBLEVBTkY7V0FEVTtRQUFBLENBQVosRUFGRjtPQUFBLE1BQUE7ZUFZRSxnQkFBQSxDQUFBLEVBWkY7T0FkRjtLQURTO0VBQUEsQ0FyRVgsQ0FBQTs7QUFBQSxFQWtHQSxnQkFBQSxHQUFtQixTQUFBLEdBQUE7QUFDakIsSUFBQSxXQUFBLEdBQWMsSUFBZCxDQUFBO0FBQUEsSUFDQSxrQkFBQSxDQUFBLENBREEsQ0FBQTtBQUlBLElBQUEsSUFBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsNEJBQWhCLENBQUg7O1FBQ0UsYUFBYSxDQUFFLElBQWYsQ0FBQTtPQURGO0tBQUEsTUFBQTs7UUFHRSxhQUFhLENBQUUsSUFBZixDQUFBO09BSEY7S0FKQTs7TUFTQSxhQUFhLENBQUUsUUFBZixDQUF3QixnQkFBeEI7S0FUQTs7TUFVQSxhQUFhLENBQUUsU0FBZixDQUFBO0tBVkE7V0FXQSxHQUFHLENBQUMsS0FBSixDQUFVLGlDQUFWLEVBWmlCO0VBQUEsQ0FsR25CLENBQUE7O0FBQUEsRUFnSEEscUJBQUEsR0FBd0IsU0FBQyxRQUFELEdBQUE7QUFDdEIsUUFBQSxNQUFBO0FBQUEsSUFBQSxJQUFHLFFBQVEsQ0FBQyxpQkFBWjs7UUFDRSxhQUFhLENBQUUsSUFBZixDQUFBO09BREY7S0FBQSxNQUFBOztRQUdFLGFBQWEsQ0FBRSxJQUFmLENBQUE7T0FIRjtLQUFBO0FBSUEsSUFBQSxJQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixnQkFBaEIsQ0FBSDtBQUNFLE1BQUEsR0FBRyxDQUFDLFFBQUosQ0FBYSxPQUFiLENBQUEsQ0FERjtLQUFBLE1BQUE7QUFHRSxNQUFBLEdBQUcsQ0FBQyxRQUFKLENBQWEsTUFBYixDQUFBLENBSEY7S0FKQTtBQUFBLElBUUEsTUFBQSxHQUFTLFFBQVEsQ0FBQyxNQVJsQixDQUFBO0FBU0EsSUFBQSxJQUFHLGFBQUEsQ0FBYyxNQUFkLENBQUg7QUFDRSxNQUFBLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixpQkFBaEIsRUFBbUMsRUFBbkMsQ0FBQSxDQUFBO0FBQUEsTUFDQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsaUJBQWhCLEVBQW1DLG9DQUFuQyxDQURBLENBQUE7YUFFQSxVQUFBLENBQVcsTUFBWCxFQUhGO0tBVnNCO0VBQUEsQ0FoSHhCLENBQUE7O0FBQUEsRUErSEEsVUFBQSxHQUFhLFNBQUMsTUFBRCxHQUFBO0FBQ1gsUUFBQSxVQUFBO0FBQUEsSUFBQSxVQUFBLEdBQWEsSUFBSSxDQUFDLElBQUwsQ0FBVSxXQUFBLENBQUEsQ0FBVixFQUF5QixlQUF6QixDQUFiLENBQUE7V0FDQSxFQUFFLENBQUMsUUFBSCxDQUFZLFVBQVosRUFBd0IsT0FBeEIsRUFBaUMsU0FBQyxHQUFELEVBQU0sR0FBTixHQUFBO0FBQy9CLFVBQUEsdUZBQUE7QUFBQSxNQUFBLElBQUcsV0FBSDtBQUNFLFFBQUEsR0FBRyxDQUFDLEtBQUosQ0FBVSw0Q0FBVixDQUFBLENBREY7T0FBQTs7YUFFUSxDQUFBLGFBQWMsU0FBQyxDQUFELEdBQUE7aUJBQU8sSUFBQyxDQUFBLEtBQUQsQ0FBTyxDQUFQLEVBQVUsQ0FBQyxDQUFDLE1BQVosQ0FBQSxLQUF1QixFQUE5QjtRQUFBO09BRnRCOztjQUdRLENBQUEsV0FBYyxTQUFDLENBQUQsR0FBQTtpQkFBTyxDQUFBLEtBQUssRUFBTCxJQUFXLElBQUMsQ0FBQSxLQUFELENBQU8sQ0FBQSxDQUFFLENBQUMsTUFBVixDQUFBLEtBQXFCLEVBQXZDO1FBQUE7T0FIdEI7QUFBQSxNQUlBLFFBQUEsR0FBVyxFQUpYLENBQUE7QUFBQSxNQUtBLGNBQUEsR0FBaUIsRUFMakIsQ0FBQTtBQUFBLE1BTUEsS0FBQSxHQUFRLEtBTlIsQ0FBQTtBQU9BLE1BQUEsSUFBRyxXQUFIO0FBQ0U7QUFBQSxhQUFBLDJDQUFBOzBCQUFBO0FBQ0UsVUFBQSxJQUFHLElBQUksQ0FBQyxJQUFMLENBQUEsQ0FBVyxDQUFDLFVBQVosQ0FBdUIsR0FBdkIsQ0FBQSxJQUFnQyxJQUFJLENBQUMsSUFBTCxDQUFBLENBQVcsQ0FBQyxRQUFaLENBQXFCLEdBQXJCLENBQW5DO0FBQ0UsWUFBQSxJQUFHLGNBQUEsS0FBa0IsVUFBbEIsSUFBaUMsQ0FBQSxLQUFwQztBQUNFLGNBQUEsUUFBUSxDQUFDLElBQVQsQ0FBYyxZQUFBLEdBQWUsTUFBN0IsQ0FBQSxDQUFBO0FBQUEsY0FDQSxLQUFBLEdBQVEsSUFEUixDQURGO2FBQUE7QUFBQSxZQUdBLGNBQUEsR0FBaUIsSUFBSSxDQUFDLElBQUwsQ0FBQSxDQUFXLENBQUMsU0FBWixDQUFzQixDQUF0QixFQUF5QixJQUFJLENBQUMsSUFBTCxDQUFBLENBQVcsQ0FBQyxNQUFaLEdBQXFCLENBQTlDLENBQWdELENBQUMsV0FBakQsQ0FBQSxDQUhqQixDQUFBO0FBQUEsWUFJQSxRQUFRLENBQUMsSUFBVCxDQUFjLElBQWQsQ0FKQSxDQURGO1dBQUEsTUFNSyxJQUFHLGNBQUEsS0FBa0IsVUFBckI7QUFDSCxZQUFBLEtBQUEsR0FBUSxJQUFJLENBQUMsS0FBTCxDQUFXLEdBQVgsQ0FBUixDQUFBO0FBQUEsWUFDQSxVQUFBLEdBQWEsS0FBTSxDQUFBLENBQUEsQ0FBRSxDQUFDLElBQVQsQ0FBQSxDQURiLENBQUE7QUFFQSxZQUFBLElBQUcsVUFBQSxLQUFjLFNBQWpCO0FBQ0UsY0FBQSxJQUFHLENBQUEsS0FBSDtBQUNFLGdCQUFBLFFBQVEsQ0FBQyxJQUFULENBQWMsWUFBQSxHQUFlLE1BQTdCLENBQUEsQ0FBQTtBQUFBLGdCQUNBLEtBQUEsR0FBUSxJQURSLENBREY7ZUFERjthQUFBLE1BQUE7QUFLRSxjQUFBLFFBQVEsQ0FBQyxJQUFULENBQWMsSUFBZCxDQUFBLENBTEY7YUFIRztXQUFBLE1BQUE7QUFVSCxZQUFBLFFBQVEsQ0FBQyxJQUFULENBQWMsSUFBZCxDQUFBLENBVkc7V0FQUDtBQUFBLFNBREY7T0FQQTtBQTJCQSxNQUFBLElBQUcsQ0FBQSxLQUFIO0FBQ0UsUUFBQSxJQUFHLGNBQUEsS0FBa0IsVUFBckI7QUFDRSxVQUFBLFFBQVEsQ0FBQyxJQUFULENBQWMsWUFBZCxDQUFBLENBREY7U0FBQTtBQUFBLFFBRUEsUUFBUSxDQUFDLElBQVQsQ0FBYyxZQUFBLEdBQWUsTUFBN0IsQ0FGQSxDQURGO09BM0JBO2FBZ0NBLEVBQUUsQ0FBQyxTQUFILENBQWEsVUFBYixFQUF5QixRQUFRLENBQUMsSUFBVCxDQUFjLElBQWQsQ0FBekIsRUFBOEM7QUFBQSxRQUFDLFFBQUEsRUFBVSxPQUFYO09BQTlDLEVBQW1FLFNBQUMsSUFBRCxHQUFBO0FBQ2pFLFlBQUEsR0FBQTtBQUFBLFFBQUEsSUFBRyxZQUFIO0FBQ0UsVUFBQSxHQUFBLEdBQU0sZ0RBQU4sQ0FBQTtBQUFBLFVBQ0EsR0FBRyxDQUFDLEtBQUosQ0FBVSxHQUFWLENBREEsQ0FBQTs7WUFFQSxhQUFhLENBQUUsU0FBZixDQUF5QixPQUF6QjtXQUZBO3lDQUdBLGFBQWEsQ0FBRSxRQUFmLENBQXdCLEdBQXhCLFdBSkY7U0FEaUU7TUFBQSxDQUFuRSxFQWpDK0I7SUFBQSxDQUFqQyxFQUZXO0VBQUEsQ0EvSGIsQ0FBQTs7QUFBQSxFQXlLQSxXQUFBLEdBQWMsU0FBQSxHQUFBO1dBQ1osT0FBTyxDQUFDLEdBQUksQ0FBRyxPQUFPLENBQUMsUUFBUixLQUFvQixPQUF2QixHQUFvQyxhQUFwQyxHQUF1RCxNQUF2RCxDQUFaLElBQThFLEdBRGxFO0VBQUEsQ0F6S2QsQ0FBQTs7QUFBQSxFQTRLQSxZQUFBLEdBQWUsU0FBQSxHQUFBO0FBQ2IsUUFBQSxVQUFBO0FBQUEsSUFBQSxVQUFBLEdBQWEsSUFBSSxDQUFDLElBQUwsQ0FBVSxXQUFBLENBQUEsQ0FBVixFQUF5QixlQUF6QixDQUFiLENBQUE7V0FDQSxFQUFFLENBQUMsUUFBSCxDQUFZLFVBQVosRUFBd0IsT0FBeEIsRUFBaUMsU0FBQyxHQUFELEVBQU0sYUFBTixHQUFBO0FBQy9CLFVBQUEsYUFBQTtBQUFBLE1BQUEsSUFBRyxXQUFIO0FBQ0UsUUFBQSxHQUFHLENBQUMsS0FBSixDQUFVLDRDQUFWLENBQUEsQ0FBQTtBQUFBLFFBQ0EscUJBQUEsQ0FBc0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLFVBQWhCLENBQXRCLENBREEsQ0FBQTtBQUVBLGNBQUEsQ0FIRjtPQUFBO0FBQUEsTUFJQSxhQUFBLEdBQWdCLEdBQUcsQ0FBQyxNQUFKLENBQVcsYUFBWCxDQUpoQixDQUFBO0FBS0EsTUFBQSxJQUFHLHVCQUFBLElBQW1CLGdDQUFuQixJQUErQyxhQUFBLENBQWMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxPQUFyQyxDQUFsRDtBQUNFLFFBQUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLGlCQUFoQixFQUFtQyxFQUFuQyxDQUFBLENBQUE7ZUFDQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsaUJBQWhCLEVBQW1DLG9DQUFuQyxFQUZGO09BQUEsTUFBQTtlQUlFLHFCQUFBLENBQXNCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixVQUFoQixDQUF0QixFQUpGO09BTitCO0lBQUEsQ0FBakMsRUFGYTtFQUFBLENBNUtmLENBQUE7O0FBQUEsRUEwTEEsYUFBQSxHQUFnQixTQUFDLEdBQUQsR0FBQTtBQUNkLFFBQUEsRUFBQTtBQUFBLElBQUEsSUFBTyxXQUFQO0FBQ0UsYUFBTyxLQUFQLENBREY7S0FBQTtBQUFBLElBRUEsRUFBQSxHQUFTLElBQUEsTUFBQSxDQUFPLHVFQUFQLEVBQWdGLEdBQWhGLENBRlQsQ0FBQTtBQUdBLFdBQU8sRUFBRSxDQUFDLElBQUgsQ0FBUSxHQUFSLENBQVAsQ0FKYztFQUFBLENBMUxoQixDQUFBOztBQUFBLEVBZ01BLGdCQUFBLEdBQW1CLFNBQUMsSUFBRCxHQUFBO0FBQ2pCLFdBQU8sYUFBQSxHQUFnQixNQUFoQixHQUF5QixJQUFoQyxDQURpQjtFQUFBLENBaE1uQixDQUFBOztBQUFBLEVBbU1BLGtCQUFBLEdBQXFCLFNBQUMsUUFBRCxHQUFBO1dBQ25CLElBQUksQ0FBQyxTQUFTLENBQUMsa0JBQWYsQ0FBa0MsU0FBQyxNQUFELEdBQUE7QUFDaEMsVUFBQSxNQUFBO0FBQUE7QUFDRSxRQUFBLE1BQUEsR0FBUyxNQUFNLENBQUMsU0FBUCxDQUFBLENBQVQsQ0FBQTtBQUFBLFFBQ0EsTUFBTSxDQUFDLFNBQVAsQ0FBaUIsU0FBQyxDQUFELEdBQUE7QUFDZixjQUFBLFlBQUE7QUFBQSxVQUFBLElBQUEsR0FBTyxNQUFNLENBQUMsSUFBZCxDQUFBO0FBQ0EsVUFBQSxJQUFHLGNBQUEsSUFBVSxJQUFiO0FBQ0UsWUFBQSxNQUFBLEdBQVMsSUFBVCxDQUFBO0FBQ0EsWUFBQSxJQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBZixHQUF3QixDQUEzQjtBQUNFLGNBQUEsTUFBQSxHQUFTLE1BQU0sQ0FBQyxPQUFRLENBQUEsQ0FBQSxDQUFFLENBQUMseUJBQWxCLENBQUEsQ0FBNkMsQ0FBQyxHQUFHLENBQUMsR0FBbEQsR0FBd0QsQ0FBakUsQ0FERjthQURBO21CQUdBLGFBQUEsQ0FBYyxJQUFkLEVBQW9CLE1BQXBCLEVBQTRCLElBQTVCLEVBSkY7V0FGZTtRQUFBLENBQWpCLENBREEsQ0FBQTtBQUFBLFFBUUEsTUFBTSxDQUFDLFdBQVAsQ0FBbUIsU0FBQyxDQUFELEdBQUE7QUFDakIsY0FBQSxZQUFBO0FBQUEsVUFBQSxJQUFBLEdBQU8sTUFBTSxDQUFDLElBQWQsQ0FBQTtBQUNBLFVBQUEsSUFBRyxjQUFBLElBQVUsSUFBYjtBQUNFLFlBQUEsTUFBQSxHQUFTLElBQVQsQ0FBQTtBQUNBLFlBQUEsSUFBRyxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQWYsR0FBd0IsQ0FBM0I7QUFDRSxjQUFBLE1BQUEsR0FBUyxNQUFNLENBQUMsT0FBUSxDQUFBLENBQUEsQ0FBRSxDQUFDLHlCQUFsQixDQUFBLENBQTZDLENBQUMsR0FBRyxDQUFDLEdBQWxELEdBQXdELENBQWpFLENBREY7YUFEQTttQkFHQSxhQUFBLENBQWMsSUFBZCxFQUFvQixNQUFwQixFQUpGO1dBRmlCO1FBQUEsQ0FBbkIsQ0FSQSxDQUFBO0FBQUEsUUFlQSxNQUFNLENBQUMseUJBQVAsQ0FBaUMsU0FBQyxDQUFELEdBQUE7QUFDL0IsY0FBQSxZQUFBO0FBQUEsVUFBQSxJQUFBLEdBQU8sTUFBTSxDQUFDLElBQWQsQ0FBQTtBQUNBLFVBQUEsSUFBRyxjQUFBLElBQVUsSUFBYjtBQUNFLFlBQUEsTUFBQSxHQUFTLElBQVQsQ0FBQTtBQUNBLFlBQUEsSUFBRyxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQWYsR0FBd0IsQ0FBM0I7QUFDRSxjQUFBLE1BQUEsR0FBUyxNQUFNLENBQUMsT0FBUSxDQUFBLENBQUEsQ0FBRSxDQUFDLHlCQUFsQixDQUFBLENBQTZDLENBQUMsR0FBRyxDQUFDLEdBQWxELEdBQXdELENBQWpFLENBREY7YUFEQTttQkFHQSxhQUFBLENBQWMsSUFBZCxFQUFvQixNQUFwQixFQUpGO1dBRitCO1FBQUEsQ0FBakMsQ0FmQSxDQURGO09BQUEsa0JBQUE7QUF1QkEsTUFBQSxJQUFHLGdCQUFIO2VBQ0UsUUFBQSxDQUFBLEVBREY7T0F4QmdDO0lBQUEsQ0FBbEMsRUFEbUI7RUFBQSxDQW5NckIsQ0FBQTs7QUFBQSxFQStOQSxpQkFBQSxHQUFvQixTQUFDLFFBQUQsR0FBQTtXQUNsQixjQUFBLENBQWUsU0FBQyxNQUFELEdBQUE7YUFDYixRQUFBLENBQVMsY0FBVCxFQURhO0lBQUEsQ0FBZixFQURrQjtFQUFBLENBL05wQixDQUFBOztBQUFBLEVBb09BLGNBQUEsR0FBaUIsU0FBQyxRQUFELEVBQVcsU0FBWCxHQUFBO0FBQ2YsUUFBQSxpQkFBQTtBQUFBLElBQUEsSUFBRyxtQ0FBSDthQUNFLFFBQUEsQ0FBUyxNQUFNLENBQUMsb0JBQWhCLEVBREY7S0FBQSxNQUFBO0FBR0UsTUFBQSxJQUFPLGlCQUFQO0FBQ0UsUUFBQSxTQUFBLEdBQVksQ0FDVixTQUFBLEdBQVksSUFBSSxDQUFDLEdBQWpCLEdBQXVCLFFBQXZCLEdBQWtDLElBQUksQ0FBQyxHQUF2QyxHQUE2QyxTQURuQyxFQUVWLFNBRlUsRUFHVixRQUhVLEVBSVYsdUJBSlUsRUFLVixpQkFMVSxDQUFaLENBQUE7QUFBQSxRQU9BLENBQUEsR0FBSSxFQVBKLENBQUE7QUFRQSxlQUFNLENBQUEsR0FBSSxFQUFWLEdBQUE7QUFDRSxVQUFBLFNBQVMsQ0FBQyxJQUFWLENBQWUsVUFBQSxHQUFhLENBQWIsR0FBaUIsV0FBaEMsQ0FBQSxDQUFBO0FBQUEsVUFDQSxTQUFTLENBQUMsSUFBVixDQUFlLFVBQUEsR0FBYSxDQUFiLEdBQWlCLFdBQWhDLENBREEsQ0FBQTtBQUFBLFVBRUEsQ0FBQSxFQUZBLENBREY7UUFBQSxDQVRGO09BQUE7QUFBQSxNQWFBLElBQUEsR0FBTyxDQUFDLFdBQUQsQ0FiUCxDQUFBO0FBY0EsTUFBQSxJQUFHLFNBQVMsQ0FBQyxNQUFWLEtBQW9CLENBQXZCO0FBQ0UsUUFBQSxRQUFBLENBQVMsSUFBVCxDQUFBLENBQUE7QUFDQSxjQUFBLENBRkY7T0FkQTtBQUFBLE1BaUJBLFFBQUEsR0FBVyxTQUFVLENBQUEsQ0FBQSxDQWpCckIsQ0FBQTthQWtCQSxRQUFBLENBQVMsUUFBVCxFQUFtQixJQUFuQixFQUF5QixTQUFDLEtBQUQsRUFBUSxNQUFSLEVBQWdCLE1BQWhCLEdBQUE7QUFDdkIsUUFBQSxJQUFPLGFBQVA7QUFDRSxVQUFBLE1BQU0sQ0FBQyxvQkFBUCxHQUE4QixRQUE5QixDQUFBO2lCQUNBLFFBQUEsQ0FBUyxRQUFULEVBRkY7U0FBQSxNQUFBO0FBSUUsVUFBQSxTQUFTLENBQUMsTUFBVixDQUFpQixDQUFqQixFQUFvQixDQUFwQixDQUFBLENBQUE7aUJBQ0EsY0FBQSxDQUFlLFFBQWYsRUFBeUIsU0FBekIsRUFMRjtTQUR1QjtNQUFBLENBQXpCLEVBckJGO0tBRGU7RUFBQSxDQXBPakIsQ0FBQTs7QUFBQSxFQW1RQSxhQUFBLEdBQWdCLFNBQUMsUUFBRCxHQUFBO0FBQ2QsUUFBQSx5QkFBQTtBQUFBLElBQUEsS0FBQSxHQUFRLE9BQVIsQ0FBQTtBQUFBLElBQ0EsSUFBQSxHQUFPLE9BRFAsQ0FBQTtBQUVBLElBQUEsSUFBRyxFQUFFLENBQUMsSUFBSCxDQUFBLENBQVMsQ0FBQyxPQUFWLENBQWtCLEtBQWxCLENBQUEsR0FBMkIsQ0FBQSxDQUE5QjtBQUNFLE1BQUEsSUFBQSxHQUFPLE9BQVAsQ0FERjtLQUZBO0FBQUEsSUFJQSxHQUFBLEdBQU0sb0NBQUEsR0FBdUMsS0FBdkMsR0FBK0MsVUFBL0MsR0FBNEQsS0FBNUQsR0FBb0UsU0FBcEUsR0FBZ0YsSUFBaEYsR0FBdUYsTUFKN0YsQ0FBQTtBQUFBLElBTUEsR0FBRyxDQUFDLEtBQUosQ0FBVSx1QkFBVixDQU5BLENBQUE7O01BT0EsYUFBYSxDQUFFLFNBQWYsQ0FBeUIsdUJBQXpCO0tBUEE7QUFBQSxJQVNBLE9BQUEsR0FBVSxTQUFBLEdBQVksSUFBSSxDQUFDLEdBQWpCLEdBQXVCLFlBVGpDLENBQUE7V0FVQSxZQUFBLENBQWEsR0FBYixFQUFrQixPQUFsQixFQUEyQixTQUFBLEdBQUE7QUFFekIsTUFBQSxHQUFHLENBQUMsS0FBSixDQUFVLHNCQUFWLENBQUEsQ0FBQTs7UUFDQSxhQUFhLENBQUUsU0FBZixDQUF5QixzQkFBekI7T0FEQTthQUdBLEtBQUEsQ0FBTSxPQUFOLEVBQWUsU0FBQSxHQUFZLElBQUksQ0FBQyxHQUFqQixHQUF1QixRQUF0QyxFQUFnRCxTQUFBLEdBQUE7QUFDOUMsUUFBQSxFQUFFLENBQUMsTUFBSCxDQUFVLE9BQVYsQ0FBQSxDQUFBO0FBQUEsUUFDQSxHQUFHLENBQUMsS0FBSixDQUFVLDZCQUFWLENBREEsQ0FBQTtBQUVBLFFBQUEsSUFBRyxnQkFBSDtpQkFDRSxRQUFBLENBQUEsRUFERjtTQUg4QztNQUFBLENBQWhELEVBTHlCO0lBQUEsQ0FBM0IsRUFYYztFQUFBLENBblFoQixDQUFBOztBQUFBLEVBMlJBLGNBQUEsR0FBaUIsU0FBQSxHQUFBO0FBQ2YsV0FBTyxFQUFFLENBQUMsVUFBSCxDQUFjLFdBQUEsQ0FBQSxDQUFkLENBQVAsQ0FEZTtFQUFBLENBM1JqQixDQUFBOztBQUFBLEVBOFJBLFdBQUEsR0FBYyxTQUFDLFFBQUQsR0FBQTtXQUNaLGNBQUEsQ0FBZSxTQUFDLE1BQUQsR0FBQTtBQUNiLFVBQUEsSUFBQTtBQUFBLE1BQUEsSUFBRyxjQUFIO0FBQ0UsUUFBQSxJQUFBLEdBQU8sQ0FBQyxXQUFBLENBQUEsQ0FBRCxFQUFnQixXQUFoQixDQUFQLENBQUE7ZUFDQSxRQUFBLENBQVMsTUFBVCxFQUFpQixJQUFqQixFQUF1QixTQUFDLEtBQUQsRUFBUSxNQUFSLEVBQWdCLE1BQWhCLEdBQUE7QUFDckIsY0FBQSxjQUFBO0FBQUEsVUFBQSxJQUFPLGFBQVA7QUFDRSxZQUFBLGNBQUEsR0FBaUIsTUFBTSxDQUFDLElBQVAsQ0FBQSxDQUFqQixDQUFBO0FBQUEsWUFDQSxHQUFHLENBQUMsS0FBSixDQUFVLGtDQUFBLEdBQXFDLGNBQS9DLENBREEsQ0FBQTtBQUFBLFlBRUEsR0FBRyxDQUFDLEtBQUosQ0FBVSx5Q0FBVixDQUZBLENBQUE7bUJBR0EsbUJBQUEsQ0FBb0IsU0FBQyxhQUFELEdBQUE7QUFDbEIsY0FBQSxJQUFHLGNBQUEsS0FBa0IsYUFBckI7QUFDRSxnQkFBQSxHQUFHLENBQUMsS0FBSixDQUFVLDZCQUFWLENBQUEsQ0FBQTtBQUNBLGdCQUFBLElBQUcsZ0JBQUg7eUJBQ0UsUUFBQSxDQUFTLElBQVQsRUFERjtpQkFGRjtlQUFBLE1BQUE7QUFLRSxnQkFBQSxJQUFHLHFCQUFIO0FBQ0Usa0JBQUEsR0FBRyxDQUFDLEtBQUosQ0FBVSxpQ0FBQSxHQUFvQyxhQUE5QyxDQUFBLENBQUE7QUFDQSxrQkFBQSxJQUFHLGdCQUFIOzJCQUNFLFFBQUEsQ0FBUyxLQUFULEVBREY7bUJBRkY7aUJBQUEsTUFBQTtBQUtFLGtCQUFBLEdBQUcsQ0FBQyxLQUFKLENBQVUseURBQVYsQ0FBQSxDQUFBO0FBQ0Esa0JBQUEsSUFBRyxnQkFBSDsyQkFDRSxRQUFBLENBQVMsSUFBVCxFQURGO21CQU5GO2lCQUxGO2VBRGtCO1lBQUEsQ0FBcEIsRUFKRjtXQUFBLE1BQUE7QUFvQkUsWUFBQSxJQUFHLGdCQUFIO3FCQUNFLFFBQUEsQ0FBUyxLQUFULEVBREY7YUFwQkY7V0FEcUI7UUFBQSxDQUF2QixFQUZGO09BQUEsTUFBQTtBQTJCRSxRQUFBLElBQUcsZ0JBQUg7aUJBQ0UsUUFBQSxDQUFTLEtBQVQsRUFERjtTQTNCRjtPQURhO0lBQUEsQ0FBZixFQURZO0VBQUEsQ0E5UmQsQ0FBQTs7QUFBQSxFQStUQSxtQkFBQSxHQUFzQixTQUFDLFFBQUQsR0FBQTtBQUNwQixRQUFBLEdBQUE7QUFBQSxJQUFBLEdBQUEsR0FBTSxrRkFBTixDQUFBO1dBQ0EsT0FBTyxDQUFDLEdBQVIsQ0FBWSxHQUFaLEVBQWlCLFNBQUMsS0FBRCxFQUFRLFFBQVIsRUFBa0IsSUFBbEIsR0FBQTtBQUNmLFVBQUEsd0NBQUE7QUFBQSxNQUFBLE9BQUEsR0FBVSxJQUFWLENBQUE7QUFDQSxNQUFBLElBQUcsQ0FBQSxLQUFBLElBQVcsUUFBUSxDQUFDLFVBQVQsS0FBdUIsR0FBckM7QUFDRSxRQUFBLEVBQUEsR0FBUyxJQUFBLE1BQUEsQ0FBTyw0REFBUCxDQUFULENBQUE7QUFDQTtBQUFBLGFBQUEsMkNBQUE7MEJBQUE7QUFDRSxVQUFBLEtBQUEsR0FBUSxFQUFFLENBQUMsSUFBSCxDQUFRLElBQVIsQ0FBUixDQUFBO0FBQ0EsVUFBQSxJQUFHLGFBQUg7QUFDRSxZQUFBLE9BQUEsR0FBVSxLQUFNLENBQUEsQ0FBQSxDQUFOLEdBQVcsR0FBWCxHQUFpQixLQUFNLENBQUEsQ0FBQSxDQUF2QixHQUE0QixHQUE1QixHQUFrQyxLQUFNLENBQUEsQ0FBQSxDQUFsRCxDQURGO1dBRkY7QUFBQSxTQUZGO09BREE7QUFPQSxNQUFBLElBQUcsZ0JBQUg7ZUFDRSxRQUFBLENBQVMsT0FBVCxFQURGO09BUmU7SUFBQSxDQUFqQixFQUZvQjtFQUFBLENBL1R0QixDQUFBOztBQUFBLEVBNlVBLFdBQUEsR0FBYyxTQUFBLEdBQUE7QUFDWixRQUFBLEdBQUE7QUFBQSxJQUFBLEdBQUEsR0FBTSxTQUFBLEdBQVksSUFBSSxDQUFDLEdBQWpCLEdBQXVCLGlCQUF2QixHQUEyQyxJQUFJLENBQUMsR0FBaEQsR0FBc0QsVUFBdEQsR0FBbUUsSUFBSSxDQUFDLEdBQXhFLEdBQThFLFFBQXBGLENBQUE7QUFDQSxXQUFPLEdBQVAsQ0FGWTtFQUFBLENBN1VkLENBQUE7O0FBQUEsRUFpVkEsVUFBQSxHQUFhLFNBQUMsUUFBRCxHQUFBO0FBQ1gsUUFBQSxZQUFBO0FBQUEsSUFBQSxHQUFHLENBQUMsS0FBSixDQUFVLDZCQUFWLENBQUEsQ0FBQTs7TUFDQSxhQUFhLENBQUUsU0FBZixDQUF5Qiw2QkFBekI7S0FEQTtBQUFBLElBRUEsR0FBQSxHQUFNLHlEQUZOLENBQUE7QUFBQSxJQUdBLE9BQUEsR0FBVSxTQUFBLEdBQVksSUFBSSxDQUFDLEdBQWpCLEdBQXVCLHFCQUhqQyxDQUFBO1dBSUEsWUFBQSxDQUFhLEdBQWIsRUFBa0IsT0FBbEIsRUFBMkIsU0FBQSxHQUFBO2FBQ3pCLFVBQUEsQ0FBVyxPQUFYLEVBQW9CLFFBQXBCLEVBRHlCO0lBQUEsQ0FBM0IsRUFMVztFQUFBLENBalZiLENBQUE7O0FBQUEsRUEwVkEsVUFBQSxHQUFhLFNBQUMsT0FBRCxFQUFVLFFBQVYsR0FBQTtBQUNYLElBQUEsR0FBRyxDQUFDLEtBQUosQ0FBVSx3Q0FBVixDQUFBLENBQUE7O01BQ0EsYUFBYSxDQUFFLFNBQWYsQ0FBeUIsNEJBQXpCO0tBREE7V0FFQSxTQUFBLENBQVUsU0FBQSxHQUFBO2FBQ1IsS0FBQSxDQUFNLE9BQU4sRUFBZSxTQUFmLEVBQTBCLFFBQTFCLEVBRFE7SUFBQSxDQUFWLEVBSFc7RUFBQSxDQTFWYixDQUFBOztBQUFBLEVBaVdBLFNBQUEsR0FBWSxTQUFDLFFBQUQsR0FBQTtBQUNWLFFBQUEsQ0FBQTtBQUFBLElBQUEsSUFBRyxFQUFFLENBQUMsVUFBSCxDQUFjLFNBQUEsR0FBWSxJQUFJLENBQUMsR0FBakIsR0FBdUIsaUJBQXJDLENBQUg7QUFDRTtlQUNFLE1BQUEsQ0FBTyxTQUFBLEdBQVksSUFBSSxDQUFDLEdBQWpCLEdBQXVCLGlCQUE5QixFQUFpRCxTQUFBLEdBQUE7QUFDL0MsVUFBQSxJQUFHLGdCQUFIO21CQUNFLFFBQUEsQ0FBQSxFQURGO1dBRCtDO1FBQUEsQ0FBakQsRUFERjtPQUFBLGNBQUE7QUFNRSxRQURJLFVBQ0osQ0FBQTtBQUFBLFFBQUEsR0FBRyxDQUFDLElBQUosQ0FBUyxDQUFULENBQUEsQ0FBQTtBQUNBLFFBQUEsSUFBRyxnQkFBSDtpQkFDRSxRQUFBLENBQUEsRUFERjtTQVBGO09BREY7S0FBQSxNQUFBO0FBV0UsTUFBQSxJQUFHLGdCQUFIO2VBQ0UsUUFBQSxDQUFBLEVBREY7T0FYRjtLQURVO0VBQUEsQ0FqV1osQ0FBQTs7QUFBQSxFQWdYQSxZQUFBLEdBQWUsU0FBQyxHQUFELEVBQU0sVUFBTixFQUFrQixRQUFsQixHQUFBO0FBQ2IsUUFBQSxNQUFBO0FBQUEsSUFBQSxDQUFBLEdBQUksT0FBQSxDQUFRLEdBQVIsQ0FBSixDQUFBO0FBQUEsSUFDQSxHQUFBLEdBQU0sRUFBRSxDQUFDLGlCQUFILENBQXFCLFVBQXJCLENBRE4sQ0FBQTtBQUFBLElBRUEsQ0FBQyxDQUFDLElBQUYsQ0FBTyxHQUFQLENBRkEsQ0FBQTtXQUdBLENBQUMsQ0FBQyxFQUFGLENBQUssS0FBTCxFQUFZLFNBQUEsR0FBQTthQUNWLEdBQUcsQ0FBQyxFQUFKLENBQU8sUUFBUCxFQUFpQixTQUFBLEdBQUE7QUFDZixRQUFBLElBQUcsZ0JBQUg7aUJBQ0UsUUFBQSxDQUFBLEVBREY7U0FEZTtNQUFBLENBQWpCLEVBRFU7SUFBQSxDQUFaLEVBSmE7RUFBQSxDQWhYZixDQUFBOztBQUFBLEVBMlhBLEtBQUEsR0FBUSxTQUFDLElBQUQsRUFBTyxTQUFQLEVBQWtCLFFBQWxCLEdBQUE7QUFDTixRQUFBLE1BQUE7QUFBQSxJQUFBLElBQUcsRUFBRSxDQUFDLFVBQUgsQ0FBYyxJQUFkLENBQUg7QUFDRTtBQUNFLFFBQUEsR0FBQSxHQUFVLElBQUEsTUFBQSxDQUFPLElBQVAsQ0FBVixDQUFBO2VBQ0EsR0FBRyxDQUFDLFlBQUosQ0FBaUIsU0FBakIsRUFBNEIsSUFBNUIsRUFGRjtPQUFBLGNBQUE7QUFJRSxRQURJLFVBQ0osQ0FBQTtlQUFBLEdBQUcsQ0FBQyxJQUFKLENBQVMsQ0FBVCxFQUpGO09BQUE7QUFNRSxRQUFBLEVBQUUsQ0FBQyxNQUFILENBQVUsSUFBVixDQUFBLENBQUE7QUFDQSxRQUFBLElBQUcsZ0JBQUg7QUFDRSxVQUFBLFFBQUEsQ0FBQSxDQUFBLENBREY7U0FQRjtPQURGO0tBRE07RUFBQSxDQTNYUixDQUFBOztBQUFBLEVBdVlBLGFBQUEsR0FBZ0IsU0FBQyxJQUFELEVBQU8sTUFBUCxFQUFlLE9BQWYsR0FBQTtBQUNkLFFBQUEsaUJBQUE7QUFBQSxJQUFBLElBQU8sbUJBQUosSUFBa0IsSUFBSSxDQUFDLElBQUwsS0FBYSxNQUEvQixJQUE0QyxhQUFBLENBQWMsSUFBSSxDQUFDLElBQW5CLENBQS9DO0FBQ0UsWUFBQSxDQURGO0tBQUE7QUFBQSxJQUdBLElBQUEsR0FBTyxJQUFJLENBQUMsR0FBTCxDQUFBLENBSFAsQ0FBQTtBQUFBLElBSUEsV0FBQSxHQUFjLElBQUksQ0FBQyxJQUpuQixDQUFBO0FBS0EsSUFBQSxJQUFHLE9BQUEsSUFBVyxnQkFBQSxDQUFpQixJQUFqQixDQUFYLElBQXFDLFFBQUEsS0FBYyxXQUF0RDthQUNFLGNBQUEsQ0FBZSxTQUFDLE1BQUQsR0FBQTtBQUNiLFlBQUEsNkNBQUE7QUFBQSxRQUFBLElBQWMsY0FBZDtBQUFBLGdCQUFBLENBQUE7U0FBQTtBQUFBLFFBQ0EsSUFBQSxHQUFPLENBQUMsV0FBQSxDQUFBLENBQUQsRUFBZ0IsUUFBaEIsRUFBMEIsV0FBMUIsRUFBdUMsVUFBdkMsRUFBbUQsZ0JBQUEsR0FBbUIsY0FBdEUsQ0FEUCxDQUFBO0FBRUEsUUFBQSxJQUFHLE9BQUg7QUFDRSxVQUFBLElBQUksQ0FBQyxJQUFMLENBQVUsU0FBVixDQUFBLENBREY7U0FGQTtBQUlBLFFBQUEsSUFBRyxjQUFIO0FBQ0UsVUFBQSxJQUFJLENBQUMsSUFBTCxDQUFVLFVBQVYsQ0FBQSxDQUFBO0FBQUEsVUFDQSxJQUFJLENBQUMsSUFBTCxDQUFVLE1BQVYsQ0FEQSxDQURGO1NBSkE7QUFPQSxRQUFBLElBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLGdCQUFoQixDQUFIO0FBQ0UsVUFBQSxJQUFJLENBQUMsSUFBTCxDQUFVLFdBQVYsQ0FBQSxDQURGO1NBUEE7QUFVQSxRQUFBLElBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFiLENBQXNCLElBQUksQ0FBQyxJQUEzQixDQUFIO0FBQ0UsVUFBQSxXQUFBLEdBQWMsSUFBSSxDQUFDLElBQW5CLENBQUE7QUFDQTtBQUFBLGVBQUEsMkNBQUE7K0JBQUE7QUFDRSxZQUFBLFFBQUEsR0FBVyxPQUFPLENBQUMsUUFBbkIsQ0FBQTtBQUNBLFlBQUEsSUFBRyxXQUFXLENBQUMsT0FBWixDQUFvQixRQUFwQixDQUFBLEdBQWdDLENBQUEsQ0FBbkM7QUFDRSxjQUFBLElBQUksQ0FBQyxJQUFMLENBQVUscUJBQVYsQ0FBQSxDQUFBO0FBQUEsY0FDQSxJQUFJLENBQUMsSUFBTCxDQUFVLElBQUksQ0FBQyxRQUFMLENBQWMsUUFBZCxDQUFWLENBREEsQ0FBQTtBQUVBLG9CQUhGO2FBRkY7QUFBQSxXQUZGO1NBVkE7QUFBQSxRQW1CQSxHQUFHLENBQUMsS0FBSixDQUFVLE1BQUEsR0FBUyxHQUFULEdBQWUsSUFBSSxDQUFDLElBQUwsQ0FBVSxHQUFWLENBQXpCLENBbkJBLENBQUE7QUFBQSxRQXFCQSxJQUFBLEdBQU8sUUFBQSxDQUFTLE1BQVQsRUFBaUIsSUFBakIsRUFBdUIsU0FBQyxLQUFELEVBQVEsTUFBUixFQUFnQixNQUFoQixHQUFBO0FBQzVCLGNBQUEseUJBQUE7QUFBQSxVQUFBLElBQUcsYUFBSDtBQUNFLFlBQUEsSUFBRyxnQkFBQSxJQUFZLE1BQUEsS0FBVSxFQUF6QjtBQUNFLGNBQUEsR0FBRyxDQUFDLElBQUosQ0FBUyxNQUFULENBQUEsQ0FERjthQUFBO0FBRUEsWUFBQSxJQUFHLGdCQUFBLElBQVksTUFBQSxLQUFVLEVBQXpCO0FBQ0UsY0FBQSxHQUFHLENBQUMsSUFBSixDQUFTLE1BQVQsQ0FBQSxDQURGO2FBRkE7QUFJQSxZQUFBLElBQUcsSUFBSSxDQUFDLFFBQUwsS0FBaUIsR0FBcEI7QUFDRSxjQUFBLEdBQUEsR0FBTSxJQUFOLENBQUE7QUFBQSxjQUNBLE1BQUEsR0FBUyxJQURULENBQUE7QUFBQSxjQUVBLEtBQUEsR0FBUSwwREFGUixDQURGO2FBQUEsTUFJSyxJQUFHLElBQUksQ0FBQyxRQUFMLEtBQWlCLEdBQXBCO0FBQ0gsY0FBQSxHQUFBLEdBQU0sc0ZBQU4sQ0FBQTtBQUFBLGNBQ0EsTUFBQSxHQUFTLE9BRFQsQ0FBQTtBQUFBLGNBRUEsS0FBQSxHQUFRLEdBRlIsQ0FERzthQUFBLE1BSUEsSUFBRyxJQUFJLENBQUMsUUFBTCxLQUFpQixHQUFwQjtBQUNILGNBQUEsR0FBQSxHQUFNLHFEQUFOLENBQUE7QUFBQSxjQUNBLE1BQUEsR0FBUyxPQURULENBQUE7QUFBQSxjQUVBLEtBQUEsR0FBUSxHQUZSLENBREc7YUFBQSxNQUFBO0FBS0gsY0FBQSxHQUFBLEdBQU0sS0FBTixDQUFBO0FBQUEsY0FDQSxNQUFBLEdBQVMsT0FEVCxDQUFBO0FBQUEsY0FFQSxLQUFBLEdBQVEsaUJBQUEsR0FBb0IsSUFBSSxDQUFDLFFBQXpCLEdBQW9DLDhEQUY1QyxDQUxHO2FBWkw7QUFxQkEsWUFBQSxJQUFHLFdBQUg7QUFDRSxjQUFBLEdBQUcsQ0FBQyxJQUFKLENBQVMsR0FBVCxDQUFBLENBREY7YUFyQkE7O2NBdUJBLGFBQWEsQ0FBRSxTQUFmLENBQXlCLE1BQXpCO2FBdkJBOzJDQXdCQSxhQUFhLENBQUUsUUFBZixDQUF3QixLQUF4QixXQXpCRjtXQUFBLE1BQUE7O2NBNEJFLGFBQWEsQ0FBRSxTQUFmLENBQUE7YUFBQTtBQUFBLFlBQ0EsS0FBQSxHQUFZLElBQUEsSUFBQSxDQUFBLENBRFosQ0FBQTsyQ0FFQSxhQUFhLENBQUUsUUFBZixDQUF3QixzQkFBQSxHQUF5QixVQUFBLENBQVcsS0FBWCxDQUFqRCxXQTlCRjtXQUQ0QjtRQUFBLENBQXZCLENBckJQLENBQUE7QUFBQSxRQXNEQSxhQUFBLEdBQWdCLElBdERoQixDQUFBO2VBdURBLFFBQUEsR0FBVyxJQUFJLENBQUMsS0F4REg7TUFBQSxDQUFmLEVBREY7S0FOYztFQUFBLENBdlloQixDQUFBOztBQUFBLEVBd2NBLGFBQUEsR0FBZ0IsU0FBQyxJQUFELEdBQUE7QUFDZCxRQUFBLHVDQUFBO0FBQUEsSUFBQSxJQUFHLFFBQUEsQ0FBUyxJQUFULEVBQWUsZ0JBQWYsQ0FBQSxJQUFvQyxRQUFBLENBQVMsSUFBVCxFQUFlLGlCQUFmLENBQXBDLElBQXlFLFFBQUEsQ0FBUyxJQUFULEVBQWUsV0FBZixDQUF6RSxJQUF3RyxRQUFBLENBQVMsSUFBVCxFQUFlLGFBQWYsQ0FBM0c7QUFDRSxhQUFPLElBQVAsQ0FERjtLQUFBO0FBQUEsSUFFQSxRQUFBLEdBQVcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLGlCQUFoQixDQUZYLENBQUE7QUFHQSxJQUFBLElBQU8sZ0JBQVA7QUFDRSxhQUFPLElBQVAsQ0FERjtLQUhBO0FBQUEsSUFNQSxNQUFBLEdBQVMsS0FOVCxDQUFBO0FBT0EsU0FBQSwrQ0FBQTs2QkFBQTtBQUNFLE1BQUEsRUFBQSxHQUFTLElBQUEsTUFBQSxDQUFPLE9BQVAsRUFBZ0IsSUFBaEIsQ0FBVCxDQUFBO0FBQ0EsTUFBQSxJQUFHLEVBQUUsQ0FBQyxJQUFILENBQVEsSUFBUixDQUFIO0FBQ0UsUUFBQSxNQUFBLEdBQVMsSUFBVCxDQUFBO0FBQ0EsY0FGRjtPQUZGO0FBQUEsS0FQQTtBQVlBLFdBQU8sTUFBUCxDQWJjO0VBQUEsQ0F4Y2hCLENBQUE7O0FBQUEsRUF1ZEEsUUFBQSxHQUFXLFNBQUMsR0FBRCxFQUFNLE1BQU4sR0FBQTtBQUNULElBQUEsSUFBRyxhQUFBLElBQVMsZ0JBQVo7QUFDRSxhQUFPLEdBQUcsQ0FBQyxPQUFKLENBQVksTUFBWixFQUFvQixHQUFHLENBQUMsTUFBSixHQUFhLE1BQU0sQ0FBQyxNQUF4QyxDQUFBLEtBQW1ELENBQUEsQ0FBMUQsQ0FERjtLQUFBO0FBRUEsV0FBTyxLQUFQLENBSFM7RUFBQSxDQXZkWCxDQUFBOztBQUFBLEVBNGRBLFVBQUEsR0FBYSxTQUFDLElBQUQsR0FBQTtBQUNYLFFBQUEsMEJBQUE7QUFBQSxJQUFBLE1BQUEsR0FBUyxDQUNMLEtBREssRUFFTCxLQUZLLEVBR0wsS0FISyxFQUlMLEtBSkssRUFLTCxLQUxLLEVBTUwsS0FOSyxFQU9MLEtBUEssRUFRTCxLQVJLLEVBU0wsS0FUSyxFQVVMLEtBVkssRUFXTCxLQVhLLEVBWUwsS0FaSyxDQUFULENBQUE7QUFBQSxJQWNBLElBQUEsR0FBTyxJQWRQLENBQUE7QUFBQSxJQWVBLElBQUEsR0FBTyxJQUFJLENBQUMsUUFBTCxDQUFBLENBZlAsQ0FBQTtBQWdCQSxJQUFBLElBQUksSUFBQSxHQUFPLEVBQVg7QUFDRSxNQUFBLElBQUEsR0FBTyxJQUFQLENBQUE7QUFBQSxNQUNBLElBQUEsR0FBTyxJQUFBLEdBQU8sRUFEZCxDQURGO0tBaEJBO0FBbUJBLElBQUEsSUFBSSxJQUFBLEtBQVEsQ0FBWjtBQUNFLE1BQUEsSUFBQSxHQUFPLEVBQVAsQ0FERjtLQW5CQTtBQUFBLElBcUJBLE1BQUEsR0FBUyxJQUFJLENBQUMsVUFBTCxDQUFBLENBckJULENBQUE7QUFzQkEsSUFBQSxJQUFJLE1BQUEsR0FBUyxFQUFiO0FBQ0UsTUFBQSxNQUFBLEdBQVMsR0FBQSxHQUFNLE1BQWYsQ0FERjtLQXRCQTtBQXdCQSxXQUFPLE1BQU8sQ0FBQSxJQUFJLENBQUMsUUFBTCxDQUFBLENBQUEsQ0FBUCxHQUEwQixHQUExQixHQUFnQyxJQUFJLENBQUMsT0FBTCxDQUFBLENBQWhDLEdBQWlELElBQWpELEdBQXdELElBQUksQ0FBQyxXQUFMLENBQUEsQ0FBeEQsR0FBNkUsR0FBN0UsR0FBbUYsSUFBbkYsR0FBMEYsR0FBMUYsR0FBZ0csTUFBaEcsR0FBeUcsR0FBekcsR0FBK0csSUFBdEgsQ0F6Qlc7RUFBQSxDQTVkYixDQUFBOztBQUFBLEVBdWZBLEtBQUEsR0FBUSxTQUFDLFFBQUQsR0FBQTtBQUNOLFFBQUEsQ0FBQTtBQUFBLElBQUEsSUFBRyxFQUFFLENBQUMsVUFBSCxDQUFjLFNBQUEsR0FBWSxJQUFJLENBQUMsR0FBakIsR0FBdUIsaUJBQXJDLENBQUg7QUFDRTtlQUNFLE1BQUEsQ0FBTyxTQUFBLEdBQVksSUFBSSxDQUFDLEdBQWpCLEdBQXVCLGlCQUE5QixFQUFpRCxTQUFBLEdBQUE7QUFDL0MsVUFBQSxJQUFHLGdCQUFIO21CQUNFLFFBQUEsQ0FBQSxFQURGO1dBRCtDO1FBQUEsQ0FBakQsRUFERjtPQUFBLGNBQUE7QUFNRSxRQURJLFVBQ0osQ0FBQTtBQUFBLFFBQUEsR0FBRyxDQUFDLElBQUosQ0FBUyxDQUFULENBQUEsQ0FBQTtBQUNBLFFBQUEsSUFBRyxnQkFBSDtpQkFDRSxRQUFBLENBQUEsRUFERjtTQVBGO09BREY7S0FBQSxNQUFBO0FBV0UsTUFBQSxJQUFHLGdCQUFIO2VBQ0UsUUFBQSxDQUFBLEVBREY7T0FYRjtLQURNO0VBQUEsQ0F2ZlIsQ0FBQTtBQUFBIgp9

//# sourceURL=/home/cin_chalic/.atom/packages/wakatime/lib/wakatime.coffee
