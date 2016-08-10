"use babel";

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var fs = require('fs');
var path = require('path');
var glob = require('glob');
var cp = require('child_process');
var minimatch = require('minimatch');
var uuid = require('node-uuid');

var Server = (function () {
  function Server(projectRoot, client, manager) {
    _classCallCheck(this, Server);

    this.manager = manager;
    this.client = client;

    this.child = null;

    this.resolves = {};
    this.rejects = {};

    this.projectDir = projectRoot;
    this.distDir = path.resolve(__dirname, '../node_modules/tern');

    this.defaultConfig = {

      libs: [],
      loadEagerly: false,
      plugins: {

        doc_comment: true
      },
      ecmaScript: true,
      ecmaVersion: 6,
      dependencyBudget: 40000
    };

    this.projectFileName = '.tern-project';
    this.disableLoadingLocal = false;

    this.init();
  }

  _createClass(Server, [{
    key: 'init',
    value: function init() {
      var _this = this;

      if (!this.projectDir) {

        return;
      }

      this.config = this.readProjectFile(path.resolve(this.projectDir, this.projectFileName));

      if (!this.config) {

        this.config = this.defaultConfig;
      }

      if (!this.config.plugins['doc_comment']) {

        this.config.plugins['doc_comment'] = true;
      }

      var defs = this.findDefs(this.projectDir, this.config);
      var plugins = this.loadPlugins(this.projectDir, this.config);
      var files = [];

      if (this.config.loadEagerly) {

        this.config.loadEagerly.forEach(function (pat) {

          glob.sync(pat, { cwd: _this.projectDir }).forEach(function (file) {

            files.push(file);
          });
        });
      }

      this.child = cp.fork(path.resolve(__dirname, './atom-ternjs-server-worker.js'));
      this.child.on('message', this.onWorkerMessage.bind(this));
      this.child.on('error', this.onError);
      this.child.on('disconnect', this.onDisconnect);
      this.child.send({

        type: 'init',
        dir: this.projectDir,
        config: this.config,
        defs: defs,
        plugins: plugins,
        files: files
      });
    }
  }, {
    key: 'onError',
    value: function onError(e) {

      atom.notifications.addError('Child process error: ' + e, {

        dismissable: true
      });
    }
  }, {
    key: 'onDisconnect',
    value: function onDisconnect(e) {

      console.log(e);
    }
  }, {
    key: 'request',
    value: function request(type, data) {
      var _this2 = this;

      var requestID = uuid.v1();

      return new Promise(function (resolve, reject) {

        _this2.resolves[requestID] = resolve;
        _this2.rejects[requestID] = reject;

        _this2.child.send({

          type: type,
          id: requestID,
          data: data
        });
      });
    }
  }, {
    key: 'flush',
    value: function flush() {

      this.request('flush', {}).then(function () {

        atom.notifications.addInfo('All files fetched and analyzed.');
      });
    }
  }, {
    key: 'dontLoad',
    value: function dontLoad(file) {

      if (!this.config.dontLoad) {

        return;
      }

      return this.config.dontLoad.some(function (pat) {

        return minimatch(file, pat);
      });
    }
  }, {
    key: 'onWorkerMessage',
    value: function onWorkerMessage(e) {

      if (e.error && e.error.isUncaughtException) {

        atom.notifications.addError('UncaughtException: ' + e.error.message + '. Restarting Server...', {

          dismissable: false
        });

        for (var key in this.rejects) {

          this.rejects[key]({});
        }

        this.resolves = {};
        this.rejects = {};

        this.manager.restartServer();

        return;
      }

      var isError = e.error !== 'null' && e.error !== 'undefined';

      if (isError) {

        console.log(e);
      }

      if (!e.type && this.resolves[e.id]) {

        if (isError) {

          this.rejects[e.id](e.error);
        } else {

          this.resolves[e.id](e.data);
        }

        delete this.resolves[e.id];
        delete this.rejects[e.id];
      }
    }
  }, {
    key: 'destroy',
    value: function destroy() {

      if (!this.child) {

        return;
      }

      this.child.disconnect();
      this.child = undefined;
    }
  }, {
    key: 'readJSON',
    value: function readJSON(fileName) {

      if (this.manager.helper.fileExists(fileName) !== undefined) {

        return false;
      }

      var file = fs.readFileSync(fileName, 'utf8');

      try {

        return JSON.parse(file);
      } catch (e) {

        atom.notifications.addError('Bad JSON in ' + fileName + ': ' + e.message, {

          dismissable: true
        });
        this.destroy();
      }
    }
  }, {
    key: 'readProjectFile',
    value: function readProjectFile(fileName) {

      var data = this.readJSON(fileName);

      if (!data) {

        return false;
      }

      for (var option in this.defaultConfig) if (!data.hasOwnProperty(option)) data[option] = this.defaultConfig[option];
      return data;
    }
  }, {
    key: 'findFile',
    value: function findFile(file, projectDir, fallbackDir) {

      var local = path.resolve(projectDir, file);

      if (!this.disableLoadingLocal && fs.existsSync(local)) {

        return local;
      }

      var shared = path.resolve(fallbackDir, file);

      if (fs.existsSync(shared)) {

        return shared;
      }
    }
  }, {
    key: 'findDefs',
    value: function findDefs(projectDir, config) {

      var defs = [];
      var src = config.libs.slice();

      if (config.ecmaScript) {

        if (src.indexOf('ecma6') == -1 && config.ecmaVersion >= 6) {

          src.unshift('ecma6');
        }

        if (src.indexOf('ecma5') == -1) {

          src.unshift('ecma5');
        }
      }

      for (var i = 0; i < src.length; ++i) {

        var file = src[i];

        if (!/\.json$/.test(file)) {

          file = file + '.json';
        }

        var found = this.findFile(file, projectDir, path.resolve(this.distDir, 'defs'));

        if (!found) {

          try {

            found = require.resolve('tern-' + src[i]);
          } catch (e) {

            atom.notifications.addError('Failed to find library ' + src[i] + '\n', {

              dismissable: true
            });
            continue;
          }
        }

        if (found) {

          defs.push(this.readJSON(found));
        }
      }
      return defs;
    }
  }, {
    key: 'loadPlugins',
    value: function loadPlugins(projectDir, config) {

      var plugins = config.plugins;
      var options = {};
      this.config.pluginImports = [];

      for (var plugin in plugins) {

        var val = plugins[plugin];

        if (!val) {

          continue;
        }

        var found = this.findFile(plugin + '.js', projectDir, path.resolve(this.distDir, 'plugin'));

        if (!found) {

          try {

            found = require.resolve('tern-' + plugin);
          } catch (e) {}
        }

        if (!found) {

          try {

            found = require.resolve(this.projectDir + '/node_modules/tern-' + plugin);
          } catch (e) {

            atom.notifications.addError('Failed to find plugin ' + plugin + '\n', {

              dismissable: true
            });
            continue;
          }
        }

        this.config.pluginImports.push(found);
        options[path.basename(plugin)] = val;
      }

      return options;
    }
  }]);

  return Server;
})();

exports['default'] = Server;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvYXRvbS10ZXJuanMvbGliL2F0b20tdGVybmpzLXNlcnZlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxXQUFXLENBQUM7Ozs7Ozs7Ozs7QUFFWixJQUFJLEVBQUUsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDdkIsSUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzNCLElBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUMzQixJQUFJLEVBQUUsR0FBRyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDbEMsSUFBSSxTQUFTLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQ3JDLElBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQzs7SUFFWCxNQUFNO0FBRWQsV0FGUSxNQUFNLENBRWIsV0FBVyxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUU7MEJBRnZCLE1BQU07O0FBSXZCLFFBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO0FBQ3ZCLFFBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDOztBQUVyQixRQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQzs7QUFFbEIsUUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7QUFDbkIsUUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7O0FBRWxCLFFBQUksQ0FBQyxVQUFVLEdBQUcsV0FBVyxDQUFDO0FBQzlCLFFBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsc0JBQXNCLENBQUMsQ0FBQzs7QUFFL0QsUUFBSSxDQUFDLGFBQWEsR0FBRzs7QUFFbkIsVUFBSSxFQUFFLEVBQUU7QUFDUixpQkFBVyxFQUFFLEtBQUs7QUFDbEIsYUFBTyxFQUFFOztBQUVQLG1CQUFXLEVBQUUsSUFBSTtPQUNsQjtB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LFlBQUksQ0FBQyxLQUFLLEVBQUU7O0FBRVYsY0FBSTs7QUFFRixpQkFBSyxHQUFHLE9BQU8sQ0FBQyxPQUFPLFdBQVMsTUFBTSxDQUFHLENBQUM7V0FFM0MsQ0FBQyxPQUFNLENBQUMsRUFBRSxFQUFFO1NBQ2Q7O0FBRUQsWUFBSSxDQUFDLEtBQUssRUFBRTs7QUFFVixjQUFJOztBQUVGLGlCQUFLLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBSSxJQUFJLENBQUMsVUFBVSwyQkFBc0IsTUFBTSxDQUFHLENBQUM7V0FFM0UsQ0FBQyxPQUFPLENBQUMsRUFBRTs7QUFFVixnQkFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLDRCQUEwQixNQUFNLFNBQU07O0FBRS9ELHlCQUFXLEVBQUUsSUFBSTthQUNsQixDQUFDLENBQUM7QUFDSCxxQkFBUztXQUNWO1NBQ0Y7O0FBRUQsWUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3RDLGVBQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDO09BQ3RDOztBQUVELGFBQU8sT0FBTyxDQUFDO0tBQ2hCOzs7U0F6VmtCLE1BQU07OztxQkFBTixNQUFNIiwiZmlsZSI6Ii9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvYXRvbS10ZXJuanMvbGliL2F0b20tdGVybmpzLXNlcnZlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIGJhYmVsXCI7XG5cbmxldCBmcyA9IHJlcXVpcmUoJ2ZzJyk7XG5sZXQgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcbmxldCBnbG9iID0gcmVxdWlyZSgnZ2xvYicpO1xubGV0IGNwID0gcmVxdWlyZSgnY2hpbGRfcHJvY2VzcycpO1xubGV0IG1pbmltYXRjaCA9IHJlcXVpcmUoJ21pbmltYXRjaCcpO1xubGV0IHV1aWQgPSByZXF1aXJlKCdub2RlLXV1aWQnKTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2VydmVyIHtcblxuICBjb25zdHJ1Y3Rvcihwcm9qZWN0Um9vdCwgY2xpZW50LCBtYW5hZ2VyKSB7XG5cbiAgICB0aGlzLm1hbmFnZXIgPSBtYW5hZ2VyO1xuICAgIHRoaXMuY2xpZW50ID0gY2xpZW50O1xuXG4gICAgdGhpcy5jaGlsZCA9IG51bGw7XG5cbiAgICB0aGlzLnJlc29sdmVzID0ge307XG4gICAgdGhpcy5yZWplY3RzID0ge307XG5cbiAgICB0aGlzLnByb2plY3REaXIgPSBwcm9qZWN0Um9vdDtcbiAgICB0aGlzLmRpc3REaXIgPSBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi4vbm9kZV9tb2R1bGVzL3Rlcm4nKTtcblxuICAgIHRoaXMuZGVmYXVsdENvbmZpZyA9IHtcblxuICAgICAgbGliczogW10sXG4gICAgICBsb2FkRWFnZXJseTogZmFsc2UsXG4gICAgICBwbHVnaW5zOiB7XG5cbiAgICAgICAgZG9jX2NvbW1lbnQ6IHRydWVcbiAgICAgIH0sXG4gICAgICBlY21hU2NyaXB0OiB0cnVlLFxuICAgICAgZWNtYVZlcnNpb246IDYsXG4gICAgICBkZXBlbmRlbmN5QnVkZ2V0OiA0MDAwMFxuICAgIH07XG5cbiAgICB0aGlzLnByb2plY3RGaWxlTmFtZSA9ICcudGVybi1wcm9qZWN0JztcbiAgICB0aGlzLmRpc2FibGVMb2FkaW5nTG9jYWwgPSBmYWxzZTtcblxuICAgIHRoaXMuaW5pdCgpO1xuICB9XG5cbiAgaW5pdCgpIHtcblxuICAgIGlmICghdGhpcy5wcm9qZWN0RGlyKSB7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmNvbmZpZyA9IHRoaXMucmVhZFByb2plY3RGaWxlKHBhdGgucmVzb2x2ZSh0aGlzLnByb2plY3REaXIsIHRoaXMucHJvamVjdEZpbGVOYW1lKSk7XG5cbiAgICBpZiAoIXRoaXMuY29uZmlnKSB7XG5cbiAgICAgIHRoaXMuY29uZmlnID0gdGhpcy5kZWZhdWx0Q29uZmlnO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5jb25maWcucGx1Z2luc1snZG9jX2NvbW1lbnQnXSkge1xuXG4gICAgICB0aGlzLmNvbmZpZy5wbHVnaW5zWydkb2NfY29tbWVudCddID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBsZXQgZGVmcyA9IHRoaXMuZmluZERlZnModGhpcy5wcm9qZWN0RGlyLCB0aGlzLmNvbmZpZyk7XG4gICAgbGV0IHBsdWdpbnMgPSB0aGlzLmxvYWRQbHVnaW5zKHRoaXMucHJvamVjdERpciwgdGhpcy5jb25maWcpO1xuICAgIGxldCBmaWxlcyA9IFtdO1xuXG4gICAgaWYgKHRoaXMuY29uZmlnLmxvYWRFYWdlcmx5KSB7XG5cbiAgICAgIHRoaXMuY29uZmlnLmxvYWRFYWdlcmx5LmZvckVhY2goKHBhdCkgPT4ge1xuXG4gICAgICAgIGdsb2Iuc3luYyhwYXQsIHsgY3dkOiB0aGlzLnByb2plY3REaXIgfSkuZm9yRWFjaChmdW5jdGlvbihmaWxlKSB7XG5cbiAgICAgICAgICBmaWxlcy5wdXNoKGZpbGUpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHRoaXMuY2hpbGQgPSBjcC5mb3JrKHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuL2F0b20tdGVybmpzLXNlcnZlci13b3JrZXIuanMnKSk7XG4gICAgdGhpcy5jaGlsZC5vbignbWVzc2FnZScsIHRoaXMub25Xb3JrZXJNZXNzYWdlLmJpbmQodGhpcykpO1xuICAgIHRoaXMuY2hpbGQub24oJ2Vycm9yJywgdGhpcy5vbkVycm9yKTtcbiAgICB0aGlzLmNoaWxkLm9uKCdkaXNjb25uZWN0JywgdGhpcy5vbkRpc2Nvbm5lY3QpO1xuICAgIHRoaXMuY2hpbGQuc2VuZCh7XG5cbiAgICAgIHR5cGU6ICdpbml0JyxcbiAgICAgIGRpcjogdGhpcy5wcm9qZWN0RGlyLFxuICAgICAgY29uZmlnOiB0aGlzLmNvbmZpZyxcbiAgICAgIGRlZnM6IGRlZnMsXG4gICAgICBwbHVnaW5zOiBwbHVnaW5zLFxuICAgICAgZmlsZXM6IGZpbGVzXG4gICAgfSk7XG4gIH1cblxuICBvbkVycm9yKGUpIHtcblxuICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcihgQ2hpbGQgcHJvY2VzcyBlcnJvcjogJHtlfWAsIHtcblxuICAgICAgZGlzbWlzc2FibGU6IHRydWVcbiAgICB9KTtcblx0fVxuXG5cdG9uRGlzY29ubmVjdChlKSB7XG5cbiAgICBjb25zb2xlLmxvZyhlKTtcblx0fVxuXG4gIHJlcXVlc3QodHlwZSwgZGF0YSkge1xuXG4gICAgbGV0IHJlcXVlc3RJRCA9IHV1aWQudjEoKTtcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cbiAgICAgIHRoaXMucmVzb2x2ZXNbcmVxdWVzdElEXSA9IHJlc29sdmU7XG4gICAgICB0aGlzLnJlamVjdHNbcmVxdWVzdElEXSA9IHJlamVjdDtcblxuICAgICAgdGhpcy5jaGlsZC5zZW5kKHtcblxuICAgICAgICB0eXBlOiB0eXBlLFxuICAgICAgICBpZDogcmVxdWVzdElELFxuICAgICAgICBkYXRhOiBkYXRhXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIGZsdXNoKCkge1xuXG4gICAgdGhpcy5yZXF1ZXN0KCdmbHVzaCcsIHt9KS50aGVuKCgpID0+IHtcblxuICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEluZm8oJ0FsbCBmaWxlcyBmZXRjaGVkIGFuZCBhbmFseXplZC4nKTtcbiAgICB9KTtcbiAgfVxuXG4gIGRvbnRMb2FkKGZpbGUpIHtcblxuICAgIGlmICghdGhpcy5jb25maWcuZG9udExvYWQpIHtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmNvbmZpZy5kb250TG9hZC5zb21lKChwYXQpID0+IHtcblxuICAgICAgcmV0dXJuIG1pbmltYXRjaChmaWxlLCBwYXQpO1xuICAgIH0pO1xuICB9XG5cbiAgb25Xb3JrZXJNZXNzYWdlKGUpIHtcblxuICAgIGlmIChlLmVycm9yICYmIGUuZXJyb3IuaXNVbmNhdWdodEV4Y2VwdGlvbikge1xuXG4gICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoYFVuY2F1Z2h0RXhjZXB0aW9uOiAke2UuZXJyb3IubWVzc2FnZX0uIFJlc3RhcnRpbmcgU2VydmVyLi4uYCwge1xuXG4gICAgICAgIGRpc21pc3NhYmxlOiBmYWxzZVxuICAgICAgfSk7XG5cbiAgICAgIGZvciAoY29uc3Qga2V5IGluIHRoaXMucmVqZWN0cykge1xuXG4gICAgICAgIHRoaXMucmVqZWN0c1trZXldKHt9KTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5yZXNvbHZlcyA9IHt9O1xuICAgICAgdGhpcy5yZWplY3RzID0ge307XG5cbiAgICAgIHRoaXMubWFuYWdlci5yZXN0YXJ0U2VydmVyKCk7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBpc0Vycm9yID0gZS5lcnJvciAhPT0gJ251bGwnICYmIGUuZXJyb3IgIT09ICd1bmRlZmluZWQnO1xuXG4gICAgaWYgKGlzRXJyb3IpIHtcblxuICAgICAgY29uc29sZS5sb2coZSk7XG4gICAgfVxuXG4gICAgaWYgKCFlLnR5cGUgJiYgdGhpcy5yZXNvbHZlc1tlLmlkXSkge1xuXG4gICAgICBpZiAoaXNFcnJvcikge1xuXG4gICAgICAgIHRoaXMucmVqZWN0c1tlLmlkXShlLmVycm9yKTtcblxuICAgICAgfSBlbHNlIHtcblxuICAgICAgICB0aGlzLnJlc29sdmVzW2UuaWRdKGUuZGF0YSk7XG4gICAgICB9XG5cbiAgICAgIGRlbGV0ZSh0aGlzLnJlc29sdmVzW2UuaWRdKTtcbiAgICAgIGRlbGV0ZSh0aGlzLnJlamVjdHNbZS5pZF0pO1xuICAgIH1cbiAgfVxuXG4gIGRlc3Ryb3koKSB7XG5cbiAgICBpZiAoIXRoaXMuY2hpbGQpIHtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuY2hpbGQuZGlzY29ubmVjdCgpO1xuICAgIHRoaXMuY2hpbGQgPSB1bmRlZmluZWQ7XG4gIH1cblxuICByZWFkSlNPTihmaWxlTmFtZSkge1xuXG4gICAgaWYgKHRoaXMubWFuYWdlci5oZWxwZXIuZmlsZUV4aXN0cyhmaWxlTmFtZSkgIT09IHVuZGVmaW5lZCkge1xuXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgbGV0IGZpbGUgPSBmcy5yZWFkRmlsZVN5bmMoZmlsZU5hbWUsICd1dGY4Jyk7XG5cbiAgICB0cnkge1xuXG4gICAgICByZXR1cm4gSlNPTi5wYXJzZShmaWxlKTtcblxuICAgIH0gY2F0Y2ggKGUpIHtcblxuICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKGBCYWQgSlNPTiBpbiAke2ZpbGVOYW1lfTogJHtlLm1lc3NhZ2V9YCwge1xuXG4gICAgICAgIGRpc21pc3NhYmxlOiB0cnVlXG4gICAgICB9KTtcbiAgICAgIHRoaXMuZGVzdHJveSgpO1xuICAgIH1cbiAgfVxuXG4gIHJlYWRQcm9qZWN0RmlsZShmaWxlTmFtZSkge1xuXG4gICAgbGV0IGRhdGEgPSB0aGlzLnJlYWRKU09OKGZpbGVOYW1lKTtcblxuICAgIGlmICghZGF0YSkge1xuXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgZm9yICh2YXIgb3B0aW9uIGluIHRoaXMuZGVmYXVsdENvbmZpZykgaWYgKCFkYXRhLmhhc093blByb3BlcnR5KG9wdGlvbikpXG4gICAgICBkYXRhW29wdGlvbl0gPSB0aGlzLmRlZmF1bHRDb25maWdbb3B0aW9uXTtcbiAgICByZXR1cm4gZGF0YTtcbiAgfVxuXG4gIGZpbmRGaWxlKGZpbGUsIHByb2plY3REaXIsIGZhbGxiYWNrRGlyKSB7XG5cbiAgICBsZXQgbG9jYWwgPSBwYXRoLnJlc29sdmUocHJvamVjdERpciwgZmlsZSk7XG5cbiAgICBpZiAoIXRoaXMuZGlzYWJsZUxvYWRpbmdMb2NhbCAmJiBmcy5leGlzdHNTeW5jKGxvY2FsKSkge1xuXG4gICAgICByZXR1cm4gbG9jYWw7XG4gICAgfVxuXG4gICAgbGV0IHNoYXJlZCA9IHBhdGgucmVzb2x2ZShmYWxsYmFja0RpciwgZmlsZSk7XG5cbiAgICBpZiAoZnMuZXhpc3RzU3luYyhzaGFyZWQpKSB7XG5cbiAgICAgIHJldHVybiBzaGFyZWQ7XG4gICAgfVxuICB9XG5cbiAgZmluZERlZnMocHJvamVjdERpciwgY29uZmlnKSB7XG5cbiAgICBsZXQgZGVmcyA9IFtdO1xuICAgIGxldCBzcmMgPSBjb25maWcubGlicy5zbGljZSgpO1xuXG4gICAgaWYgKGNvbmZpZy5lY21hU2NyaXB0KSB7XG5cbiAgICAgIGlmIChzcmMuaW5kZXhPZignZWNtYTYnKSA9PSAtMSAmJiBjb25maWcuZWNtYVZlcnNpb24gPj0gNikge1xuXG4gICAgICAgIHNyYy51bnNoaWZ0KCdlY21hNicpO1xuICAgICAgfVxuXG4gICAgICBpZiAoc3JjLmluZGV4T2YoJ2VjbWE1JykgPT0gLTEpIHtcblxuICAgICAgICBzcmMudW5zaGlmdCgnZWNtYTUnKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNyYy5sZW5ndGg7ICsraSkge1xuXG4gICAgICBsZXQgZmlsZSA9IHNyY1tpXTtcblxuICAgICAgaWYgKCEvXFwuanNvbiQvLnRlc3QoZmlsZSkpIHtcblxuICAgICAgICBmaWxlID0gYCR7ZmlsZX0uanNvbmA7XG4gICAgICB9XG5cbiAgICAgIGxldCBmb3VuZCA9IHRoaXMuZmluZEZpbGUoZmlsZSwgcHJvamVjdERpciwgcGF0aC5yZXNvbHZlKHRoaXMuZGlzdERpciwgJ2RlZnMnKSk7XG5cbiAgICAgIGlmICghZm91bmQpIHtcblxuICAgICAgICB0cnkge1xuXG4gICAgICAgICAgZm91bmQgPSByZXF1aXJlLnJlc29sdmUoYHRlcm4tJHtzcmNbaV19YCk7XG5cbiAgICAgICAgfSBjYXRjaCAoZSkge1xuXG4gICAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKGBGYWlsZWQgdG8gZmluZCBsaWJyYXJ5ICR7c3JjW2ldfVxcbmAsIHtcblxuICAgICAgICAgICAgZGlzbWlzc2FibGU6IHRydWVcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoZm91bmQpIHtcblxuICAgICAgICBkZWZzLnB1c2godGhpcy5yZWFkSlNPTihmb3VuZCkpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZGVmcztcbiAgfVxuXG4gIGxvYWRQbHVnaW5zKHByb2plY3REaXIsIGNvbmZpZykge1xuXG4gICAgbGV0IHBsdWdpbnMgPSBjb25maWcucGx1Z2lucztcbiAgICBsZXQgb3B0aW9ucyA9IHt9O1xuICAgIHRoaXMuY29uZmlnLnBsdWdpbkltcG9ydHMgPSBbXTtcblxuICAgIGZvciAobGV0IHBsdWdpbiBpbiBwbHVnaW5zKSB7XG5cbiAgICAgIGxldCB2YWwgPSBwbHVnaW5zW3BsdWdpbl07XG5cbiAgICAgIGlmICghdmFsKSB7XG5cbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGxldCBmb3VuZCA9IHRoaXMuZmluZEZpbGUoYCR7cGx1Z2lufS5qc2AsIHByb2plY3REaXIsIHBhdGgucmVzb2x2ZSh0aGlzLmRpc3REaXIsICdwbHVnaW4nKSk7XG5cbiAgICAgIGlmICghZm91bmQpIHtcblxuICAgICAgICB0cnkge1xuXG4gICAgICAgICAgZm91bmQgPSByZXF1aXJlLnJlc29sdmUoYHRlcm4tJHtwbHVnaW59YCk7XG5cbiAgICAgICAgfSBjYXRjaChlKSB7fVxuICAgICAgfVxuXG4gICAgICBpZiAoIWZvdW5kKSB7XG5cbiAgICAgICAgdHJ5IHtcblxuICAgICAgICAgIGZvdW5kID0gcmVxdWlyZS5yZXNvbHZlKGAke3RoaXMucHJvamVjdERpcn0vbm9kZV9tb2R1bGVzL3Rlcm4tJHtwbHVnaW59YCk7XG5cbiAgICAgICAgfSBjYXRjaCAoZSkge1xuXG4gICAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKGBGYWlsZWQgdG8gZmluZCBwbHVnaW4gJHtwbHVnaW59XFxuYCwge1xuXG4gICAgICAgICAgICBkaXNtaXNzYWJsZTogdHJ1ZVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRoaXMuY29uZmlnLnBsdWdpbkltcG9ydHMucHVzaChmb3VuZCk7XG4gICAgICBvcHRpb25zW3BhdGguYmFzZW5hbWUocGx1Z2luKV0gPSB2YWw7XG4gICAgfVxuXG4gICAgcmV0dXJuIG9wdGlvbnM7XG4gIH1cbn1cbiJdfQ==
//# sourceURL=/home/cin_chalic/.atom/packages/atom-ternjs/lib/atom-ternjs-server.js
