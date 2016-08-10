
/*
WakaTime
Description: Analytics for programmers.
Maintainer:  WakaTime <support@wakatime.com>
License:     BSD, see LICENSE for more details.
Website:     https://wakatime.com/
 */

(function() {
  var AdmZip, apiKey, cleanupOnUninstall, cliLocation, downloadFile, endsWith, enoughTimePassed, execFile, extractCLI, fileIsIgnored, fs, getLatestCliVersion, getUserHome, ini, installCLI, installPython, isCLIInstalled, isCLILatest, isPythonInstalled, lastFile, lastHeartbeat, loadApiKey, os, packageVersion, path, pythonLocation, removeCLI, request, rimraf, sendHeartbeat, setApiKey, setupEventHandlers, unloadHandler, unzip;

  AdmZip = require('adm-zip');

  fs = require('fs');

  os = require('os');

  path = require('path');

  execFile = require('child_process').execFile;

  request = require('request');

  rimraf = require('rimraf');

  ini = require('ini');

  packageVersion = null;

  unloadHandler = null;

  lastHeartbeat = 0;

  lastFile = '';

  apiKey = null;

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
      return setApiKey();
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2luX2NoYWxpYy8uYXRvbS9wYWNrYWdlcy93YWthdGltZS9saWIvd2FrYXRpbWUuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQTs7Ozs7O0dBQUE7QUFBQTtBQUFBO0FBQUEsTUFBQSxtYUFBQTs7QUFBQSxFQVFBLE1BQUEsR0FBUyxPQUFBLENBQVEsU0FBUixDQVJULENBQUE7O0FBQUEsRUFTQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVIsQ0FUTCxDQUFBOztBQUFBLEVBVUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSLENBVkwsQ0FBQTs7QUFBQSxFQVdBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQVhQLENBQUE7O0FBQUEsRUFZQSxRQUFBLEdBQVcsT0FBQSxDQUFRLGVBQVIsQ0FBd0IsQ0FBQyxRQVpwQyxDQUFBOztBQUFBLEVBYUEsT0FBQSxHQUFVLE9BQUEsQ0FBUSxTQUFSLENBYlYsQ0FBQTs7QUFBQSxFQWNBLE1BQUEsR0FBUyxPQUFBLENBQVEsUUFBUixDQWRULENBQUE7O0FBQUEsRUFlQSxHQUFBLEdBQU0sT0FBQSxDQUFRLEtBQVIsQ0FmTixDQUFBOztBQUFBLEVBaUJBLGNBQUEsR0FBaUIsSUFqQmpCLENBQUE7O0FBQUEsRUFrQkEsYUFBQSxHQUFnQixJQWxCaEIsQ0FBQTs7QUFBQSxFQW1CQSxhQUFBLEdBQWdCLENBbkJoQixDQUFBOztBQUFBLEVBb0JBLFFBQUEsR0FBVyxFQXBCWCxDQUFBOztBQUFBLEVBcUJBLE1BQUEsR0FBUyxJQXJCVCxDQUFBOztBQUFBLEVBdUJBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLE1BQUEsRUFDRTtBQUFBLE1BQUEsTUFBQSxFQUNFO0FBQUEsUUFBQSxLQUFBLEVBQU8sU0FBUDtBQUFBLFFBQ0EsV0FBQSxFQUFhLHFEQURiO0FBQUEsUUFFQSxJ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

//# sourceURL=/home/cin_chalic/.atom/packages/wakatime/lib/wakatime.coffee
