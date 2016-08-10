"use babel";

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var fs = require('fs');
var path = require('path');
var glob = require('glob');
var minimatch = require('minimatch');
var uuid = require('node-uuid');

var Server = (function () {
  function Server(projectRoot, client, manager) {
    _classCallCheck(this, Server);

    this.manager = manager;
    this.client = client;

    this.resolves = {};

    this.projectDir = projectRoot;
    this.distDir = path.resolve(__dirname, '../node_modules/tern');

    this.defaultConfig = {

      libs: [],
      loadEagerly: false,
      plugins: {},
      ecmaScript: true,
      ecmaVersion: 6,
      dependencyBudget: 20000
    };

    this.projectFileName = '.tern-project';
    this.disableLoadingLocal = false;

    this.getHomeDir();
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

      this.worker = new Worker(path.resolve(__dirname, './atom-ternjs-server-worker.js'));
      this.worker.onmessage = this.onWorkerMessage.bind(this);

      this.worker.postMessage({

        type: 'init',
        dir: this.projectDir,
        config: this.config,
        defs: defs,
        plugins: plugins,
        files: files
      });
    }
  }, {
    key: 'request',
    value: function request(type, data) {
      var _this2 = this;

      var requestID = uuid.v1();

      return new Promise(function (resolve, reject) {

        _this2.resolves[requestID] = resolve;

        _this2.worker.postMessage({

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

        atom.notifications.addInfo('All files fetched an analyzed.');
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
      var _this3 = this;

      if (!e.data.type) {

        this.resolves[e.data.id](e.data.data);
        delete this.resolves[e.data.id];

        return;
      }

      if (e.data.type === 'getFile') {

        var result = undefined;

        if (this.dontLoad(e.data.name)) {

          this.worker.postMessage({

            type: 'pending',
            id: e.data.id,
            data: [null, '']
          });
        } else {

          fs.readFile(path.resolve(this.projectDir, e.data.name), 'utf8', function (err, data) {

            _this3.worker.postMessage({

              type: 'pending',
              id: e.data.id,
              data: [String(err), data]
            });
          });
        }
      }
    }
  }, {
    key: 'destroy',
    value: function destroy() {

      this.worker.terminate();
      this.worker = undefined;
    }
  }, {
    key: 'getHomeDir',
    value: function getHomeDir() {

      var homeDir = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;

      if (homeDir && fs.existsSync(path.resolve(homeDir, '.tern-config'))) {

        this.defaultConfig = this.readProjectFile(path.resolve(homeDir, '.tern-config'));
      }
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
    key: 'defaultPlugins',
    value: function defaultPlugins(config) {

      var result = ['doc_comment'];
      return result;
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

      this.defaultPlugins(config).forEach(function (name) {

        if (!plugins.hasOwnProperty(name)) {

          options[name] = true;
        }
      });

      return options;
    }
  }]);

  return Server;
})();

exports['default'] = Server;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvYXRvbS10ZXJuanMvbGliL2F0b20tdGVybmpzLXNlcnZlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxXQUFXLENBQUM7Ozs7Ozs7Ozs7QUFFWixJQUFJLEVBQUUsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDdkIsSUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzNCLElBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUMzQixJQUFJLFNBQVMsR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDckMsSUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDOztJQUVYLE1BQU07QUFFZCxXQUZRLE1BQU0sQ0FFYixXQUFXLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRTswQkFGdkIsTUFBTTs7QUFJdkIsUUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7QUFDdkIsUUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7O0FBRXJCLFFBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDOztBQUVuQixRQUFJLENBQUMsVUFBVSxHQUFHLFdBQVcsQ0FBQztBQUM5QixRQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLHNCQUFzQixDQUFDLENBQUM7O0FBRS9ELFFBQUksQ0FBQyxhQUFhLEdBQUc7O0FBRW5CLFVBQUksRUFBRSxFQUFFO0FBQ1IsaUJBQVcsRUFBRSxLQUFLO0FBQ2xCLGFBQU8sRUFBRSxFQUFFO0FBQ1gsZ0JBQVUsRUFBRSxJQUFJO0FBQ2hCLGlCQUFXLEVBQUUsQ0FBQztBQUNkLHNCQUFnQixFQUFFLEtBQUs7S0FDeEIsQ0FBQzs7QUFFRixRQUFJLENBQUMsZUFBZSxHQUFHLGVBQWUsQ0FBQztBQUN2QyxRQUFJLENBQUMsbUJBQW1CLEdBQUcsS0FB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QUNWO1NBQ0Y7O0FBRUQsWUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3RDLGVBQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDO09BQ3RDOztBQUVELFVBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUMsSUFBSSxFQUFLOztBQUU1QyxZQUFJLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsRUFBRTs7QUFFakMsaUJBQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUM7U0FDdEI7T0FDRixDQUFDLENBQUM7O0FBRUgsYUFBTyxPQUFPLENBQUM7S0FDaEI7OztTQTVVa0IsTUFBTTs7O3FCQUFOLE1BQU0iLCJmaWxlIjoiL2hvbWUvY2luX2NoYWxpYy8uYXRvbS9wYWNrYWdlcy9hdG9tLXRlcm5qcy9saWIvYXRvbS10ZXJuanMtc2VydmVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2UgYmFiZWxcIjtcblxubGV0IGZzID0gcmVxdWlyZSgnZnMnKTtcbmxldCBwYXRoID0gcmVxdWlyZSgncGF0aCcpO1xubGV0IGdsb2IgPSByZXF1aXJlKCdnbG9iJyk7XG5sZXQgbWluaW1hdGNoID0gcmVxdWlyZSgnbWluaW1hdGNoJyk7XG5sZXQgdXVpZCA9IHJlcXVpcmUoJ25vZGUtdXVpZCcpO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTZXJ2ZXIge1xuXG4gIGNvbnN0cnVjdG9yKHByb2plY3RSb290LCBjbGllbnQsIG1hbmFnZXIpIHtcblxuICAgIHRoaXMubWFuYWdlciA9IG1hbmFnZXI7XG4gICAgdGhpcy5jbGllbnQgPSBjbGllbnQ7XG5cbiAgICB0aGlzLnJlc29sdmVzID0ge307XG5cbiAgICB0aGlzLnByb2plY3REaXIgPSBwcm9qZWN0Um9vdDtcbiAgICB0aGlzLmRpc3REaXIgPSBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi4vbm9kZV9tb2R1bGVzL3Rlcm4nKTtcblxuICAgIHRoaXMuZGVmYXVsdENvbmZpZyA9IHtcblxuICAgICAgbGliczogW10sXG4gICAgICBsb2FkRWFnZXJseTogZmFsc2UsXG4gICAgICBwbHVnaW5zOiB7fSxcbiAgICAgIGVjbWFTY3JpcHQ6IHRydWUsXG4gICAgICBlY21hVmVyc2lvbjogNixcbiAgICAgIGRlcGVuZGVuY3lCdWRnZXQ6IDIwMDAwXG4gICAgfTtcblxuICAgIHRoaXMucHJvamVjdEZpbGVOYW1lID0gJy50ZXJuLXByb2plY3QnO1xuICAgIHRoaXMuZGlzYWJsZUxvYWRpbmdMb2NhbCA9IGZhbHNlO1xuXG4gICAgdGhpcy5nZXRIb21lRGlyKCk7XG4gICAgdGhpcy5pbml0KCk7XG4gIH1cblxuICBpbml0KCkge1xuXG4gICAgaWYgKCF0aGlzLnByb2plY3REaXIpIHtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuY29uZmlnID0gdGhpcy5yZWFkUHJvamVjdEZpbGUocGF0aC5yZXNvbHZlKHRoaXMucHJvamVjdERpciwgdGhpcy5wcm9qZWN0RmlsZU5hbWUpKTtcblxuICAgIGlmICghdGhpcy5jb25maWcpIHtcblxuICAgICAgdGhpcy5jb25maWcgPSB0aGlzLmRlZmF1bHRDb25maWc7XG4gICAgfVxuXG4gICAgbGV0IGRlZnMgPSB0aGlzLmZpbmREZWZzKHRoaXMucHJvamVjdERpciwgdGhpcy5jb25maWcpO1xuICAgIGxldCBwbHVnaW5zID0gdGhpcy5sb2FkUGx1Z2lucyh0aGlzLnByb2plY3REaXIsIHRoaXMuY29uZmlnKTtcbiAgICBsZXQgZmlsZXMgPSBbXTtcblxuICAgIGlmICh0aGlzLmNvbmZpZy5sb2FkRWFnZXJseSkge1xuXG4gICAgICB0aGlzLmNvbmZpZy5sb2FkRWFnZXJseS5mb3JFYWNoKChwYXQpID0+IHtcblxuICAgICAgICBnbG9iLnN5bmMocGF0LCB7IGN3ZDogdGhpcy5wcm9qZWN0RGlyIH0pLmZvckVhY2goZnVuY3Rpb24oZmlsZSkge1xuXG4gICAgICAgICAgZmlsZXMucHVzaChmaWxlKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICB0aGlzLndvcmtlciA9IG5ldyBXb3JrZXIocGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vYXRvbS10ZXJuanMtc2VydmVyLXdvcmtlci5qcycpKTtcbiAgICB0aGlzLndvcmtlci5vbm1lc3NhZ2UgPSB0aGlzLm9uV29ya2VyTWVzc2FnZS5iaW5kKHRoaXMpO1xuXG4gICAgdGhpcy53b3JrZXIucG9zdE1lc3NhZ2Uoe1xuXG4gICAgICB0eXBlOiAnaW5pdCcsXG4gICAgICBkaXI6IHRoaXMucHJvamVjdERpcixcbiAgICAgIGNvbmZpZzogdGhpcy5jb25maWcsXG4gICAgICBkZWZzOiBkZWZzLFxuICAgICAgcGx1Z2luczogcGx1Z2lucyxcbiAgICAgIGZpbGVzOiBmaWxlc1xuICAgIH0pO1xuICB9XG5cbiAgcmVxdWVzdCh0eXBlLCBkYXRhKSB7XG5cbiAgICBsZXQgcmVxdWVzdElEID0gdXVpZC52MSgpO1xuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcblxuICAgICAgdGhpcy5yZXNvbHZlc1tyZXF1ZXN0SURdID0gcmVzb2x2ZTtcblxuICAgICAgdGhpcy53b3JrZXIucG9zdE1lc3NhZ2Uoe1xuXG4gICAgICAgIHR5cGU6IHR5cGUsXG4gICAgICAgIGlkOiByZXF1ZXN0SUQsXG4gICAgICAgIGRhdGE6IGRhdGFcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgZmx1c2goKSB7XG5cbiAgICB0aGlzLnJlcXVlc3QoJ2ZsdXNoJywge30pLnRoZW4oKCkgPT4ge1xuXG4gICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkSW5mbygnQWxsIGZpbGVzIGZldGNoZWQgYW4gYW5hbHl6ZWQuJyk7XG4gICAgfSk7XG4gIH1cblxuICBkb250TG9hZChmaWxlKSB7XG5cbiAgICBpZiAoIXRoaXMuY29uZmlnLmRvbnRMb2FkKSB7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5jb25maWcuZG9udExvYWQuc29tZSgocGF0KSA9PiB7XG5cbiAgICAgIHJldHVybiBtaW5pbWF0Y2goZmlsZSwgcGF0KTtcbiAgICB9KTtcbiAgfVxuXG4gIG9uV29ya2VyTWVzc2FnZShlKSB7XG5cbiAgICBpZiAoIWUuZGF0YS50eXBlKSB7XG5cbiAgICAgIHRoaXMucmVzb2x2ZXNbZS5kYXRhLmlkXShlLmRhdGEuZGF0YSk7XG4gICAgICBkZWxldGUodGhpcy5yZXNvbHZlc1tlLmRhdGEuaWRdKTtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChlLmRhdGEudHlwZSA9PT0gJ2dldEZpbGUnKSB7XG5cbiAgICAgIGxldCByZXN1bHQ7XG5cbiAgICAgIGlmICh0aGlzLmRvbnRMb2FkKGUuZGF0YS5uYW1lKSkge1xuXG4gICAgICAgIHRoaXMud29ya2VyLnBvc3RNZXNzYWdlKHtcblxuICAgICAgICAgIHR5cGU6ICdwZW5kaW5nJyxcbiAgICAgICAgICBpZDogZS5kYXRhLmlkLFxuICAgICAgICAgIGRhdGE6IFtudWxsLCAnJ11cbiAgICAgICAgfSk7XG5cbiAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgZnMucmVhZEZpbGUocGF0aC5yZXNvbHZlKHRoaXMucHJvamVjdERpciwgZS5kYXRhLm5hbWUpLCAndXRmOCcsIChlcnIsIGRhdGEpID0+IHtcblxuICAgICAgICAgIHRoaXMud29ya2VyLnBvc3RNZXNzYWdlKHtcblxuICAgICAgICAgICAgdHlwZTogJ3BlbmRpbmcnLFxuICAgICAgICAgICAgaWQ6IGUuZGF0YS5pZCxcbiAgICAgICAgICAgIGRhdGE6IFtTdHJpbmcoZXJyKSwgZGF0YV1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZGVzdHJveSgpIHtcblxuICAgIHRoaXMud29ya2VyLnRlcm1pbmF0ZSgpO1xuICAgIHRoaXMud29ya2VyID0gdW5kZWZpbmVkO1xuICB9XG5cbiAgZ2V0SG9tZURpcigpIHtcblxuICAgIGxldCBob21lRGlyID0gcHJvY2Vzcy5lbnYuSE9NRSB8fCBwcm9jZXNzLmVudi5IT01FUEFUSCB8fCBwcm9jZXNzLmVudi5VU0VSUFJPRklMRTtcblxuICAgIGlmIChob21lRGlyICYmIGZzLmV4aXN0c1N5bmMocGF0aC5yZXNvbHZlKGhvbWVEaXIsICcudGVybi1jb25maWcnKSkpIHtcblxuICAgICAgdGhpcy5kZWZhdWx0Q29uZmlnID0gdGhpcy5yZWFkUHJvamVjdEZpbGUocGF0aC5yZXNvbHZlKGhvbWVEaXIsICcudGVybi1jb25maWcnKSk7XG4gICAgfVxuICB9XG5cbiAgcmVhZEpTT04oZmlsZU5hbWUpIHtcblxuICAgIGlmICh0aGlzLm1hbmFnZXIuaGVscGVyLmZpbGVFeGlzdHMoZmlsZU5hbWUpICE9PSB1bmRlZmluZWQpIHtcblxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGxldCBmaWxlID0gZnMucmVhZEZpbGVTeW5jKGZpbGVOYW1lLCAndXRmOCcpO1xuXG4gICAgdHJ5IHtcblxuICAgICAgcmV0dXJuIEpTT04ucGFyc2UoZmlsZSk7XG5cbiAgICB9IGNhdGNoIChlKSB7XG5cbiAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcihgQmFkIEpTT04gaW4gJHtmaWxlTmFtZX06ICR7ZS5tZXNzYWdlfWAsIHtcblxuICAgICAgICBkaXNtaXNzYWJsZTogdHJ1ZVxuICAgICAgfSk7XG4gICAgICB0aGlzLmRlc3Ryb3koKTtcbiAgICB9XG4gIH1cblxuICByZWFkUHJvamVjdEZpbGUoZmlsZU5hbWUpIHtcblxuICAgIGxldCBkYXRhID0gdGhpcy5yZWFkSlNPTihmaWxlTmFtZSk7XG5cbiAgICBpZiAoIWRhdGEpIHtcblxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGZvciAodmFyIG9wdGlvbiBpbiB0aGlzLmRlZmF1bHRDb25maWcpIGlmICghZGF0YS5oYXNPd25Qcm9wZXJ0eShvcHRpb24pKVxuICAgICAgZGF0YVtvcHRpb25dID0gdGhpcy5kZWZhdWx0Q29uZmlnW29wdGlvbl07XG4gICAgcmV0dXJuIGRhdGE7XG4gIH1cblxuICBmaW5kRmlsZShmaWxlLCBwcm9qZWN0RGlyLCBmYWxsYmFja0Rpcikge1xuXG4gICAgbGV0IGxvY2FsID0gcGF0aC5yZXNvbHZlKHByb2plY3REaXIsIGZpbGUpO1xuXG4gICAgaWYgKCF0aGlzLmRpc2FibGVMb2FkaW5nTG9jYWwgJiYgZnMuZXhpc3RzU3luYyhsb2NhbCkpIHtcblxuICAgICAgcmV0dXJuIGxvY2FsO1xuICAgIH1cblxuICAgIGxldCBzaGFyZWQgPSBwYXRoLnJlc29sdmUoZmFsbGJhY2tEaXIsIGZpbGUpO1xuXG4gICAgaWYgKGZzLmV4aXN0c1N5bmMoc2hhcmVkKSkge1xuXG4gICAgICByZXR1cm4gc2hhcmVkO1xuICAgIH1cbiAgfVxuXG4gIGZpbmREZWZzKHByb2plY3REaXIsIGNvbmZpZykge1xuXG4gICAgbGV0IGRlZnMgPSBbXTtcbiAgICBsZXQgc3JjID0gY29uZmlnLmxpYnMuc2xpY2UoKTtcblxuICAgIGlmIChjb25maWcuZWNtYVNjcmlwdCkge1xuXG4gICAgICBpZiAoc3JjLmluZGV4T2YoJ2VjbWE2JykgPT0gLTEgJiYgY29uZmlnLmVjbWFWZXJzaW9uID49IDYpIHtcblxuICAgICAgICBzcmMudW5zaGlmdCgnZWNtYTYnKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHNyYy5pbmRleE9mKCdlY21hNScpID09IC0xKSB7XG5cbiAgICAgICAgc3JjLnVuc2hpZnQoJ2VjbWE1Jyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzcmMubGVuZ3RoOyArK2kpIHtcblxuICAgICAgbGV0IGZpbGUgPSBzcmNbaV07XG5cbiAgICAgIGlmICghL1xcLmpzb24kLy50ZXN0KGZpbGUpKSB7XG5cbiAgICAgICAgZmlsZSA9IGAke2ZpbGV9Lmpzb25gO1xuICAgICAgfVxuXG4gICAgICBsZXQgZm91bmQgPSB0aGlzLmZpbmRGaWxlKGZpbGUsIHByb2plY3REaXIsIHBhdGgucmVzb2x2ZSh0aGlzLmRpc3REaXIsICdkZWZzJykpO1xuXG4gICAgICBpZiAoIWZvdW5kKSB7XG5cbiAgICAgICAgdHJ5IHtcblxuICAgICAgICAgIGZvdW5kID0gcmVxdWlyZS5yZXNvbHZlKGB0ZXJuLSR7c3JjW2ldfWApO1xuXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcblxuICAgICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcihgRmFpbGVkIHRvIGZpbmQgbGlicmFyeSAke3NyY1tpXX1cXG5gLCB7XG5cbiAgICAgICAgICAgIGRpc21pc3NhYmxlOiB0cnVlXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGZvdW5kKSB7XG5cbiAgICAgICAgZGVmcy5wdXNoKHRoaXMucmVhZEpTT04oZm91bmQpKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGRlZnM7XG4gIH1cblxuICBkZWZhdWx0UGx1Z2lucyhjb25maWcpIHtcblxuICAgIGxldCByZXN1bHQgPSBbJ2RvY19jb21tZW50J107XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIGxvYWRQbHVnaW5zKHByb2plY3REaXIsIGNvbmZpZykge1xuXG4gICAgbGV0IHBsdWdpbnMgPSBjb25maWcucGx1Z2lucztcbiAgICBsZXQgb3B0aW9ucyA9IHt9O1xuICAgIHRoaXMuY29uZmlnLnBsdWdpbkltcG9ydHMgPSBbXTtcblxuICAgIGZvciAobGV0IHBsdWdpbiBpbiBwbHVnaW5zKSB7XG5cbiAgICAgIGxldCB2YWwgPSBwbHVnaW5zW3BsdWdpbl07XG5cbiAgICAgIGlmICghdmFsKSB7XG5cbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGxldCBmb3VuZCA9IHRoaXMuZmluZEZpbGUoYCR7cGx1Z2lufS5qc2AsIHByb2plY3REaXIsIHBhdGgucmVzb2x2ZSh0aGlzLmRpc3REaXIsICdwbHVnaW4nKSk7XG5cbiAgICAgIGlmICghZm91bmQpIHtcblxuICAgICAgICB0cnkge1xuXG4gICAgICAgICAgZm91bmQgPSByZXF1aXJlLnJlc29sdmUoYHRlcm4tJHtwbHVnaW59YCk7XG5cbiAgICAgICAgfSBjYXRjaChlKSB7fVxuICAgICAgfVxuXG4gICAgICBpZiAoIWZvdW5kKSB7XG5cbiAgICAgICAgdHJ5IHtcblxuICAgICAgICAgIGZvdW5kID0gcmVxdWlyZS5yZXNvbHZlKGAke3RoaXMucHJvamVjdERpcn0vbm9kZV9tb2R1bGVzL3Rlcm4tJHtwbHVnaW59YCk7XG5cbiAgICAgICAgfSBjYXRjaCAoZSkge1xuXG4gICAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKGBGYWlsZWQgdG8gZmluZCBwbHVnaW4gJHtwbHVnaW59XFxuYCwge1xuXG4gICAgICAgICAgICBkaXNtaXNzYWJsZTogdHJ1ZVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRoaXMuY29uZmlnLnBsdWdpbkltcG9ydHMucHVzaChmb3VuZCk7XG4gICAgICBvcHRpb25zW3BhdGguYmFzZW5hbWUocGx1Z2luKV0gPSB2YWw7XG4gICAgfVxuXG4gICAgdGhpcy5kZWZhdWx0UGx1Z2lucyhjb25maWcpLmZvckVhY2goKG5hbWUpID0+IHtcblxuICAgICAgaWYgKCFwbHVnaW5zLmhhc093blByb3BlcnR5KG5hbWUpKSB7XG5cbiAgICAgICAgb3B0aW9uc1tuYW1lXSA9IHRydWU7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gb3B0aW9ucztcbiAgfVxufVxuIl19
//# sourceURL=/home/cin_chalic/.atom/packages/atom-ternjs/lib/atom-ternjs-server.js
