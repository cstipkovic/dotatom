
/*
WakaTime
Description: Analytics for programmers.
Maintainer:  WakaTime <support@wakatime.com>
License:     BSD, see LICENSE for more details.
Website:     https://wakatime.com/
 */

(function() {
  var AdmZip, apiKey, cleanupOnUninstall, cliLocation, downloadFile, endsWith, enoughTimePassed, execFile, extractCLI, fileIsIgnored, fs, getLatestCliVersion, getUserHome, ini, installCLI, installPython, isCLIInstalled, isCLILatest, isPythonInstalled, lastFile, lastHeartbeat, loadApiKey, loadPackages, os, packageVersion, path, pythonLocation, removeCLI, request, rimraf, sendHeartbeat, setApiKey, setupEventHandlers, unloadHandler, unzip;

  packageVersion = null;

  unloadHandler = null;

  lastHeartbeat = 0;

  lastFile = '';

  apiKey = null;

  AdmZip = null;

  fs = null;

  os = null;

  path = null;

  execFile = null;

  request = null;

  rimraf = null;

  ini = null;

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
      loadPackages();
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
      return setApiKey();
    }
  };

  loadPackages = function() {
    AdmZip = require('adm-zip');
    fs = require('fs');
    os = require('os');
    path = require('path');
    execFile = require('child_process').execFile;
    request = require('request');
    rimraf = require('rimraf');
    return ini = require('ini');
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
    var args, location;
    if (global.cachedPythonLocation != null) {
      return callback(global.cachedPythonLocation);
    } else {
      if (locations == null) {
        locations = [__dirname + path.sep + 'python' + path.sep + 'pythonw', "pythonw", "python", "/usr/local/bin/python", "/usr/bin/python", "\\python37\\pythonw", "\\Python37\\pythonw", "\\python36\\pythonw", "\\Python36\\pythonw", "\\python35\\pythonw", "\\Python35\\pythonw", "\\python34\\pythonw", "\\Python34\\pythonw", "\\python33\\pythonw", "\\Python33\\pythonw", "\\python32\\pythonw", "\\Python32\\pythonw", "\\python31\\pythonw", "\\Python31\\pythonw", "\\python30\\pythonw", "\\Python30\\pythonw", "\\python27\\pythonw", "\\Python27\\pythonw", "\\python26\\pythonw", "\\Python26\\pythonw", "\\python37\\python", "\\Python37\\python", "\\python36\\python", "\\Python36\\python", "\\python35\\python", "\\Python35\\python", "\\python34\\python", "\\Python34\\python", "\\python33\\python", "\\Python33\\python", "\\python32\\python", "\\Python32\\python", "\\python31\\python", "\\Python31\\python", "\\python30\\python", "\\Python30\\python", "\\python27\\python", "\\Python27\\python", "\\python26\\python", "\\Python26\\python"];
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
    var time;
    time = Date.now();
    if (isWrite || enoughTimePassed(time) || lastFile !== file.path) {
      if ((file.path == null) || file.path === void 0 || fileIsIgnored(file.path)) {
        return;
      }
      return pythonLocation(function(python) {
        var args, proc;
        if (!((python != null) && (apiKey != null))) {
          return;
        }
        args = [cliLocation(), '--file', file.path, '--key', apiKey, '--plugin', 'atom-wakatime/' + packageVersion];
        if (isWrite) {
          args.push('--write');
        }
        if (lineno != null) {
          args.push('--lineno');
          args.push(lineno);
        }
        proc = execFile(python, args, function(error, stdout, stderr) {
          if (error != null) {
            if ((stderr != null) && stderr !== '') {
              console.warn(stderr);
            }
            if ((stdout != null) && stdout !== '') {
              console.warn(stdout);
            }
            if (proc.exitCode === 102) {
              return console.warn('Warning: api error (102); Check your ~/.wakatime.log file for more details.');
            } else if (proc.exitCode === 103) {
              return console.warn('Warning: config parsing error (103); Check your ~/.wakatime.log file for more details.');
            } else {
              return console.warn(error);
            }
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

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2luX2NoYWxpYy8uYXRvbS9wYWNrYWdlcy93YWthdGltZS9saWIvd2FrYXRpbWUuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQTs7Ozs7O0dBQUE7QUFBQTtBQUFBO0FBQUEsTUFBQSxpYkFBQTs7QUFBQSxFQVNBLGNBQUEsR0FBaUIsSUFUakIsQ0FBQTs7QUFBQSxFQVVBLGFBQUEsR0FBZ0IsSUFWaEIsQ0FBQTs7QUFBQSxFQVdBLGFBQUEsR0FBZ0IsQ0FYaEIsQ0FBQTs7QUFBQSxFQVlBLFFBQUEsR0FBVyxFQVpYLENBQUE7O0FBQUEsRUFhQSxNQUFBLEdBQVMsSUFiVCxDQUFBOztBQUFBLEVBZ0JBLE1BQUEsR0FBUyxJQWhCVCxDQUFBOztBQUFBLEVBaUJBLEVBQUEsR0FBSyxJQWpCTCxDQUFBOztBQUFBLEVBa0JBLEVBQUEsR0FBSyxJQWxCTCxDQUFBOztBQUFBLEVBbUJBLElBQUEsR0FBTyxJQW5CUCxDQUFBOztBQUFBLEVBb0JBLFFBQUEsR0FBVyxJQXBCWCxDQUFBOztBQUFBLEVBcUJBLE9BQUEsR0FBVSxJQXJCVixDQUFBOztBQUFBLEVBc0JBLE1BQUEsR0FBUyxJQXRCVCxDQUFBOztBQUFBLEVBdUJBLEdBQUEsR0FBTSxJQXZCTixDQUFBOztBQUFBLEVBeUJBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLE1BQUEsRUFDRTtBQUFBLE1BQUEsTUFBQSxFQUNFO0FBQUEsUUFBQSxLQUFBLEVBQU8sU0FBUDtBQUFBLFFBQ0EsV0FBQSxFQUFhLHFEQURiO0FBQUEsUUFFQSxJQUFBLEVBQU0sUUFGTjtBQUFBLFFBR0EsU0FBQSxFQUFTLEVBSFQ7QUFBQSxRQUlBLEtBQUEsRUFBTyxDQUpQO09BREY7QUFBQSxNQU1BLE1BQUEsRUFDRTtBQUFBLFFBQUEsS0FBQSxFQUFPLG9CQUFQO0FBQUEsUUFDQSxX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

//# sourceURL=/home/cin_chalic/.atom/packages/wakatime/lib/wakatime.coffee
