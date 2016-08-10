
/*
WakaTime
Description: Analytics for programmers.
Maintainer:  WakaTime <support@wakatime.com>
License:     BSD, see LICENSE for more details.
Website:     https://wakatime.com/
 */

(function() {
  var AdmZip, cleanupOnUninstall, cliLocation, downloadFile, endsWith, enoughTimePassed, extractCLI, fileIsIgnored, fs, installCLI, installPython, isCLIInstalled, isCLILatest, isPythonInstalled, lastFile, lastHeartbeat, latestCLIVersion, os, packageVersion, path, process, pythonLocation, removeCLI, request, rimraf, sendHeartbeat, setupConfig, setupEventHandlers, unloadHandler, unzip;

  AdmZip = require('adm-zip');

  fs = require('fs');

  os = require('os');

  path = require('path');

  process = require('child_process');

  request = require('request');

  rimraf = require('rimraf');

  latestCLIVersion = '4.1.3';

  packageVersion = null;

  unloadHandler = null;

  lastHeartbeat = 0;

  lastFile = '';

  module.exports = {
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
      setupConfig();
      setupEventHandlers();
      return console.log('WakaTime v' + packageVersion + ' loaded.');
    }
  };

  enoughTimePassed = function(time) {
    return lastHeartbeat + 120000 < time;
  };

  setupConfig = function() {
    var defaults;
    if (atom.config.get("wakatime.apikey") == null) {
      defaults = {
        apikey: "",
        ignore: ["^/var/", "^/tmp/", "^/private/", "COMMIT_EDITMSG$", "PULLREQ_EDITMSG$", "MERGE_MSG$"]
      };
      return atom.config.set("wakatime", defaults);
    }
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
        locations = ["pythonw", "python", "/usr/local/bin/python", "/usr/bin/python", "\\python37\\pythonw", "\\Python37\\pythonw", "\\python36\\pythonw", "\\Python36\\pythonw", "\\python35\\pythonw", "\\Python35\\pythonw", "\\python34\\pythonw", "\\Python34\\pythonw", "\\python33\\pythonw", "\\Python33\\pythonw", "\\python32\\pythonw", "\\Python32\\pythonw", "\\python31\\pythonw", "\\Python31\\pythonw", "\\python30\\pythonw", "\\Python30\\pythonw", "\\python27\\pythonw", "\\Python27\\pythonw", "\\python26\\pythonw", "\\Python26\\pythonw", "\\python37\\python", "\\Python37\\python", "\\python36\\python", "\\Python36\\python", "\\python35\\python", "\\Python35\\python", "\\python34\\python", "\\Python34\\python", "\\python33\\python", "\\Python33\\python", "\\python32\\python", "\\Python32\\python", "\\python31\\python", "\\Python31\\python", "\\python30\\python", "\\Python30\\python", "\\python27\\python", "\\Python27\\python", "\\python26\\python", "\\Python26\\python"];
      }
      args = ['--version'];
      if (locations.length === 0) {
        callback(null);
        return;
      }
      location = locations[0];
      return process.execFile(location, args, function(error, stdout, stderr) {
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
    var msiFile, url;
    if (os.type() === 'Windows_NT') {
      url = 'https://www.python.org/ftp/python/3.4.3/python-3.4.3.msi';
      if (os.arch().indexOf('x64') > -1) {
        url = "https://www.python.org/ftp/python/3.4.3/python-3.4.3.amd64.msi";
      }
      console.log('Downloading python...');
      msiFile = __dirname + path.sep + 'python.msi';
      return downloadFile(url, msiFile, function() {
        var args;
        console.log('Installing python...');
        args = ['/i', msiFile, '/norestart', '/qb!'];
        return process.execFile('msiexec', args, function(error, stdout, stderr) {
          if (error != null) {
            console.warn(error);
            return window.alert('Error encountered while installing Python.');
          } else {
            fs.unlink(msiFile);
            return console.log('Finished installing python.');
          }
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
        return process.execFile(python, args, function(error, stdout, stderr) {
          if (error == null) {
            if (stderr.trim() === latestCLIVersion) {
              return callback(true);
            } else {
              return callback(false);
            }
          } else {
            return callback(false);
          }
        });
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
      zip = new AdmZip(file);
      try {
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
        var apikey, args;
        if (python != null) {
          apikey = atom.config.get('wakatime.apikey');
          if (!apikey) {
            return;
          }
          args = [cliLocation(), '--file', file.path, '--key', apikey, '--plugin', 'atom-wakatime/' + packageVersion];
          if (isWrite) {
            args.push('--write');
          }
          if (lineno != null) {
            args.push('--lineno');
            args.push(lineno);
          }
          process.execFile(python, args, function(error, stdout, stderr) {
            if (error != null) {
              return console.warn(error);
            }
          });
          lastHeartbeat = time;
          return lastFile = file.path;
        }
      });
    }
  };

  fileIsIgnored = function(file) {
    var ignore, pattern, patterns, re, _i, _len;
    if (endsWith(file, 'COMMIT_EDITMSG') || endsWith(file, 'PULLREQ_EDITMSG') || endsWith(file, 'MERGE_MSG') || endsWith(file, 'TAG_EDITMSG')) {
      return true;
    }
    patterns = atom.config.get("wakatime.ignore");
    ignore = false;
    for (_i = 0, _len = patterns.length; _i < _len; _i++) {
      pattern = patterns[_i];
      re = new RegExp(pattern, "gi");
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
