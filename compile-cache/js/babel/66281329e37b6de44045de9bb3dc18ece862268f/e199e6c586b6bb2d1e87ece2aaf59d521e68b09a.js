"use babel";

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Server = undefined;
var Client = undefined;
var Documentation = undefined;
var Helper = undefined;
var PackageConfig = undefined;
var Config = undefined;
var Type = undefined;
var Reference = undefined;
var Rename = undefined;
var _ = require('underscore-plus');

var Manager = (function () {
  function Manager(provider) {
    _classCallCheck(this, Manager);

    this.provider = provider;

    this.disposables = [];

    this.grammars = ['JavaScript'];

    this.clients = [];
    this.client = undefined;
    this.servers = [];
    this.server = undefined;

    this.editors = [];

    this.rename = undefined;
    this.type = undefined;
    this.reference = undefined;
    this.documentation = undefined;

    this.initialised = false;

    window.setTimeout(this.init.bind(this), 0);
  }

  _createClass(Manager, [{
    key: 'init',
    value: function init() {
      var _this = this;

      Helper = require('./atom-ternjs-helper.coffee');
      PackageConfig = require('./atom-ternjs-package-config');
      Config = require('./atom-ternjs-config');

      this.helper = new Helper(this);
      this.packageConfig = new PackageConfig(this);
      this.config = new Config(this);
      this.provider.init(this);
      this.initServers();

      this.registerHelperCommands();

      this.disposables.push(atom.project.onDidChangePaths(function (paths) {

        _this.destroyServer(paths);
        _this.checkPaths(paths);
        _this.setActiveServerAndClient();
      }));
    }
  }, {
    key: 'activate',
    value: function activate() {

      this.initialised = true;
      this.registerEvents();
      this.registerCommands();
    }
  }, {
    key: 'destroyObject',
    value: function destroyObject(object) {

      if (object) {

        object.destroy();
      }
      object = undefined;
    }
  }, {
    key: 'destroy',
    value: function destroy() {

      for (var server of this.servers) {

        server.destroy();
        server = undefined;
      }
      this.servers = [];

      for (var client of this.clients) {

        client = undefined;
      }
      this.clients = [];

      this.server = undefined;
      this.client = undefined;
      this.unregisterEventsAndCommands();
      this.provider = undefined;

      this.destroyObject(this.config);
      this.destroyObject(this.packageConfig);
      this.destroyObject(this.reference);
      this.destroyObject(this.rename);
      this.destroyObject(this.type);
      this.destroyObject(this.helper);

      this.initialised = false;
    }
  }, {
    key: 'unregisterEventsAndCommands',
    value: function unregisterEventsAndCommands() {

      for (var disposable of this.disposables) {

        if (!disposable) {

          continue;
        }

        disposable.dispose();
      }

      this.disposables = [];
    }
  }, {
    key: 'initServers',
    value: function initServers() {

      var dirs = atom.project.getDirectories();

      if (dirs.length === 0) {

        return;
      }

      for (var dir of dirs) {

        dir = atom.project.relativizePath(dir.path)[0];

        if (this.helper.isDirectory(dir)) {

          this.startServer(dir);
        }
      }
    }
  }, {
    key: 'startServer',
    value: function startServer(dir) {

      if (!Server) {

        Server = require('./atom-ternjs-server');
      }

      if (this.getServerForProject(dir)) {

        return;
      }

      var client = this.getClientForProject(dir);

      if (!client) {

        if (!Client) {

          Client = require('./atom-ternjs-client');
        }

        var clientIdx = this.clients.push(new Client(this, dir)) - 1;
        client = this.clients[clientIdx];
      }

      this.servers.push(new Server(dir, client, this));

      if (this.servers.length === this.clients.length) {

        if (!this.initialised) {

          this.activate();
        }

        this.setActiveServerAndClient(dir);
      }
    }
  }, {
    key: 'setActiveServerAndClient',
    value: function setActiveServerAndClient(URI) {

      if (!URI) {

        var activePane = atom.workspace.getActivePaneItem();

        if (activePane && activePane.getURI) {

          URI = activePane.getURI();
        } else {

          this.server = undefined;
          this.client = undefined;

          return;
        }
      }

      var dir = atom.project.relativizePath(URI)[0];
      var server = this.getServerForProject(dir);
      var client = this.getClientForProject(dir);

      if (server && client) {

        this.server = server;
        this.config.gatherData();
        this.client = client;
      } else {

        this.server = undefined;
        this.config.clear();
        this.client = undefined;
      }
    }
  }, {
    key: 'checkPaths',
    value: function checkPaths(paths) {

      for (var path of paths) {

        var dir = atom.project.relativizePath(path)[0];

        if (this.helper.isDirectory(dir)) {

          this.startServer(dir);
        }
      }
    }
  }, {
    key: 'destroyServer',
    value: function destroyServer(paths) {

      if (this.servers.length === 0) {

        return;
      }

      var serverIdx = undefined;

      for (var i = 0; i < this.servers.length; i++) {

        if (paths.indexOf(this.servers[i].projectDir) === -1) {

          serverIdx = i;
          break;
        }
      }

      if (serverIdx === undefined) {

        return;
      }

      var server = this.servers[serverIdx];
      var client = this.getClientForProject(server.projectDir);
      client = undefined;

      server.destroy();
      server = undefined;

      this.servers.splice(serverIdx, 1);
    }
  }, {
    key: 'getServerForProject',
    value: function getServerForProject(projectDir) {

      for (var server of this.servers) {

        if (server.projectDir === projectDir) {

          return server;
        }
      }

      return false;
    }
  }, {
    key: 'getClientForProject',
    value: function getClientForProject(projectDir) {

      for (var client of this.clients) {

        if (client.projectDir === projectDir) {

          return client;
        }
      }

      return false;
    }
  }, {
    key: 'getEditor',
    value: function getEditor(editor) {

      for (var _editor of this.editors) {

        if (_editor.id === editor.id) {

          return _editor;
        }
      }
    }
  }, {
    key: 'isValidEditor',
    value: function isValidEditor(editor) {

      if (!editor || !editor.getGrammar || editor.mini) {

        return;
      }

      if (!editor.getGrammar()) {

        return;
      }

      if (this.grammars.indexOf(editor.getGrammar().name) === -1) {

        return false;
      }

      return true;
    }
  }, {
    key: 'onDidChangeCursorPosition',
    value: function onDidChangeCursorPosition(editor, e) {

      if (this.packageConfig.options.inlineFnCompletion) {

        if (!this.type) {

          Type = require('./atom-ternjs-type');
          this.type = new Type(this);
        }

        this.type.queryType(editor, e.cursor);
      }

      if (this.rename) {

        this.rename.hide();
      }
    }
  }, {
    key: 'registerEvents',
    value: function registerEvents() {
      var _this2 = this;

      this.disposables.push(atom.workspace.observeTextEditors(function (editor) {

        if (!_this2.isValidEditor(editor)) {

          return;
        }

        // Register valid editor
        _this2.editors.push({

          id: editor.id,
          diffs: []
        });

        if (!_this2.initCalled) {

          _this2.init();
        }

        var editorView = atom.views.getView(editor);

        if (editorView) {

          _this2.disposables.push(editorView.addEventListener('click', function (e) {

            if (!e[_this2.helper.accessKey]) {

              return;
            }

            if (_this2.client) {

              _this2.client.definition();
            }
          }));
        }

        var scrollView = undefined;

        if (!editorView.shadowRoot) {

          scrollView = editorView.querySelector('.scroll-view');
        } else {

          scrollView = editorView.shadowRoot.querySelector('.scroll-view');
        }

        if (scrollView) {

          _this2.disposables.push(scrollView.addEventListener('mousemove', function (e) {

            if (!e[_this2.helper.accessKey]) {

              return;
            }

            if (e.target.classList.contains('line')) {

              return;
            }

            e.target.classList.add('atom-ternjs-hover');
          }));

          _this2.disposables.push(scrollView.addEventListener('mouseout', function (e) {

            e.target.classList.remove('atom-ternjs-hover');
          }));
        }

        _this2.disposables.push(editor.onDidChangeCursorPosition(function (e) {

          if (_this2.type) {

            _this2.type.destroyOverlay();
          }

          if (_this2.documentation) {

            _this2.documentation.destroyOverlay();
          }
        }));

        _this2.disposables.push(editor.onDidChangeCursorPosition(_.debounce(_this2.onDidChangeCursorPosition.bind(_this2, editor), 300)));

        _this2.disposables.push(editor.getBuffer().onDidSave(function (e) {

          if (_this2.client) {

            _this2.client.update(editor);
          }
        }));

        _this2.disposables.push(editor.getBuffer().onDidChange(function (e) {

          _this2.getEditor(editor).diffs.push(e);
        }));
      }));

      this.disposables.push(atom.workspace.onDidChangeActivePaneItem(function (item) {

        if (_this2.config) {

          _this2.config.clear();
        }

        if (_this2.type) {

          _this2.type.destroyOverlay();
        }

        if (_this2.rename) {

          _this2.rename.hide();
        }

        if (!_this2.isValidEditor(item)) {

          if (_this2.reference) {

            _this2.reference.hide();
          }
        } else {

          _this2.setActiveServerAndClient(item.getURI());
        }
      }));
    }
  }, {
    key: 'registerHelperCommands',
    value: function registerHelperCommands() {
      var _this3 = this;

      this.disposables.push(atom.commands.add('atom-workspace', 'atom-ternjs:openConfig', function (e) {

        if (!_this3.config) {

          _this3.config = new Config(_this3);
        }

        _this3.config.show();
      }));
    }
  }, {
    key: 'registerCommands',
    value: function registerCommands() {
      var _this4 = this;

      this.disposables.push(atom.commands.add('atom-text-editor', 'core:cancel', function (e) {

        if (_this4.config) {

          _this4.config.hide();
        }

        if (_this4.type) {

          _this4.type.destroyOverlay();
        }

        if (_this4.rename) {

          _this4.rename.hide();
        }

        if (_this4.reference) {

          _this4.reference.hide();
        }

        if (_this4.documentation) {

          _this4.documentation.destroyOverlay();
        }
      }));

      this.disposables.push(atom.commands.add('atom-text-editor', 'atom-ternjs:listFiles', function (e) {

        if (_this4.client) {

          _this4.client.files().then(function (data) {

            console.dir(data);
          });
        }
      }));

      this.disposables.push(atom.commands.add('atom-text-editor', 'atom-ternjs:flush', function (e) {

        if (_this4.server) {

          _this4.server.flush();
        }
      }));

      this.disposables.push(atom.commands.add('atom-text-editor', 'atom-ternjs:documentation', function (e) {

        if (!_this4.documentation) {

          Documentation = require('./atom-ternjs-documentation');
          _this4.documentation = new Documentation(_this4);
        }

        if (_this4.client) {

          _this4.documentation.request();
        }
      }));

      this.disposables.push(atom.commands.add('atom-text-editor', 'atom-ternjs:references', function (e) {

        if (!_this4.reference) {

          Reference = require('./atom-ternjs-reference');
          _this4.reference = new Reference(_this4);
        }

        _this4.reference.findReference();
      }));

      this.disposables.push(atom.commands.add('atom-text-editor', 'atom-ternjs:rename', function (e) {

        if (!_this4.rename) {

          Rename = require('./atom-ternjs-rename');
          _this4.rename = new Rename(_this4);
        }

        _this4.rename.show();
      }));

      this.disposables.push(atom.commands.add('atom-text-editor', 'atom-ternjs:markerCheckpointBack', function (e) {

        if (_this4.helper) {

          _this4.helper.markerCheckpointBack();
        }
      }));

      this.disposables.push(atom.commands.add('atom-text-editor', 'atom-ternjs:startCompletion', function (e) {

        if (_this4.provider) {

          _this4.provider.forceCompletion();
        }
      }));

      this.disposables.push(atom.commands.add('atom-text-editor', 'atom-ternjs:definition', function (e) {

        if (_this4.client) {

          _this4.client.definition();
        }
      }));

      this.disposables.push(atom.commands.add('atom-workspace', 'atom-ternjs:restart', function (e) {

        _this4.restartServer();
      }));
    }
  }, {
    key: 'restartServer',
    value: function restartServer() {

      if (!this.server) {

        return;
      }

      var dir = this.server.projectDir;

      for (var i = 0; i < this.servers.length; i++) {

        if (dir === this.servers[i].projectDir) {

          serverIdx = i;
          break;
        }
      }

      if (this.server) {

        this.server.destroy();
      }

      this.server = undefined;
      this.servers.splice(serverIdx, 1);
      this.startServer(dir);
    }
  }]);

  return Manager;
})();

exports['default'] = Manager;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvYXRvbS10ZXJuanMvbGliL2F0b20tdGVybmpzLW1hbmFnZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsV0FBVyxDQUFDOzs7Ozs7Ozs7O0FBRVosSUFBSSxNQUFNLFlBQUEsQ0FBQztBQUNYLElBQUksTUFBTSxZQUFBLENBQUM7QUFDWCxJQUFJLGFBQWEsWUFBQSxDQUFDO0FBQ2xCLElBQUksTUFBTSxZQUFBLENBQUM7QUFDWCxJQUFJLGFBQWEsWUFBQSxDQUFDO0FBQ2xCLElBQUksTUFBTSxZQUFBLENBQUM7QUFDWCxJQUFJLElBQUksWUFBQSxDQUFDO0FBQ1QsSUFBSSxTQUFTLFlBQUEsQ0FBQztBQUNkLElBQUksTUFBTSxZQUFBLENBQUM7QUFDWCxJQUFJLENBQUMsR0FBRyxPQUFPLENBQUMsaUJBQWlCLENBQUMsQ0FBQzs7SUFFZCxPQUFPO0FBRWYsV0FGUSxPQUFPLENBRWQsUUFBUSxFQUFFOzBCQUZILE9BQU87O0FBSXhCLFFBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDOztBQUV6QixRQUFJLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQzs7QUFFdEIsUUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDOztBQUUvQixRQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztBQUNsQixRQUFJLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQztBQUN4QixRQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztBQUNsQixRQUFJLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQzs7QUFFeEIsUUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7O0FBRWxCLFFBQUksQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFDO0FBQ3hCLFFBQUksQ0FBQyxJQUFJLEdBQUcsU0FBUyxDQUFDO0FBQ3RCLFFBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO0FBQzNCLFFBQUksQ0FBQyxh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RyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTs7QUFFNUMsWUFBSSxHQUFHLEtBQUssSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLEVBQUU7O0FBRXRDLG1CQUFTLEdBQUcsQ0FBQyxDQUFDO0FBQ2QsZ0JBQU07U0FDUDtPQUNGOztBQUVELFVBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTs7QUFFZixZQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDO09BQ3ZCOztBQUVELFVBQUksQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFDO0FBQ3hCLFVBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNsQyxVQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQ3ZCOzs7U0F2bUJrQixPQUFPOzs7cUJBQVAsT0FBTyIsImZpbGUiOiIvaG9tZS9jaW5fY2hhbGljLy5hdG9tL3BhY2thZ2VzL2F0b20tdGVybmpzL2xpYi9hdG9tLXRlcm5qcy1tYW5hZ2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2UgYmFiZWxcIjtcblxubGV0IFNlcnZlcjtcbmxldCBDbGllbnQ7XG5sZXQgRG9jdW1lbnRhdGlvbjtcbmxldCBIZWxwZXI7XG5sZXQgUGFja2FnZUNvbmZpZztcbmxldCBDb25maWc7XG5sZXQgVHlwZTtcbmxldCBSZWZlcmVuY2U7XG5sZXQgUmVuYW1lO1xubGV0IF8gPSByZXF1aXJlKCd1bmRlcnNjb3JlLXBsdXMnKTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWFuYWdlciB7XG5cbiAgY29uc3RydWN0b3IocHJvdmlkZXIpIHtcblxuICAgIHRoaXMucHJvdmlkZXIgPSBwcm92aWRlcjtcblxuICAgIHRoaXMuZGlzcG9zYWJsZXMgPSBbXTtcblxuICAgIHRoaXMuZ3JhbW1hcnMgPSBbJ0phdmFTY3JpcHQnXTtcblxuICAgIHRoaXMuY2xpZW50cyA9IFtdO1xuICAgIHRoaXMuY2xpZW50ID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuc2VydmVycyA9IFtdO1xuICAgIHRoaXMuc2VydmVyID0gdW5kZWZpbmVkO1xuXG4gICAgdGhpcy5lZGl0b3JzID0gW107XG5cbiAgICB0aGlzLnJlbmFtZSA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLnR5cGUgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5yZWZlcmVuY2UgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5kb2N1bWVudGF0aW9uID0gdW5kZWZpbmVkO1xuXG4gICAgdGhpcy5pbml0aWFsaXNlZCA9IGZhbHNlO1xuXG4gICAgd2luZG93LnNldFRpbWVvdXQodGhpcy5pbml0LmJpbmQodGhpcyksIDApO1xuICB9XG5cbiAgaW5pdCgpIHtcblxuICAgIEhlbHBlciA9IHJlcXVpcmUoJy4vYXRvbS10ZXJuanMtaGVscGVyLmNvZmZlZScpO1xuICAgIFBhY2thZ2VDb25maWcgPSByZXF1aXJlKCcuL2F0b20tdGVybmpzLXBhY2thZ2UtY29uZmlnJyk7XG4gICAgQ29uZmlnID0gcmVxdWlyZSgnLi9hdG9tLXRlcm5qcy1jb25maWcnKTtcblxuICAgIHRoaXMuaGVscGVyID0gbmV3IEhlbHBlcih0aGlzKTtcbiAgICB0aGlzLnBhY2thZ2VDb25maWcgPSBuZXcgUGFja2FnZUNvbmZpZyh0aGlzKTtcbiAgICB0aGlzLmNvbmZpZyA9IG5ldyBDb25maWcodGhpcyk7XG4gICAgdGhpcy5wcm92aWRlci5pbml0KHRoaXMpO1xuICAgIHRoaXMuaW5pdFNlcnZlcnMoKTtcblxuICAgIHRoaXMucmVnaXN0ZXJIZWxwZXJDb21tYW5kcygpO1xuXG4gICAgdGhpcy5kaXNwb3NhYmxlcy5wdXNoKGF0b20ucHJvamVjdC5vbkRpZENoYW5nZVBhdGhzKChwYXRocykgPT4ge1xuXG4gICAgICB0aGlzLmRlc3Ryb3lTZXJ2ZXIocGF0aHMpO1xuICAgICAgdGhpcy5jaGVja1BhdGhzKHBhdGhzKTtcbiAgICAgIHRoaXMuc2V0QWN0aXZlU2VydmVyQW5kQ2xpZW50KCk7XG4gICAgfSkpO1xuICB9XG5cbiAgYWN0aXZhdGUoKSB7XG5cbiAgICB0aGlzLmluaXRpYWxpc2VkID0gdHJ1ZTtcbiAgICB0aGlzLnJlZ2lzdGVyRXZlbnRzKCk7XG4gICAgdGhpcy5yZWdpc3RlckNvbW1hbmRzKCk7XG4gIH1cblxuICBkZXN0cm95T2JqZWN0KG9iamVjdCkge1xuXG4gICAgaWYgKG9iamVjdCkge1xuXG4gICAgICBvYmplY3QuZGVzdHJveSgpO1xuICAgIH1cbiAgICBvYmplY3QgPSB1bmRlZmluZWQ7XG4gIH1cblxuICBkZXN0cm95KCkge1xuXG4gICAgZm9yIChsZXQgc2VydmVyIG9mIHRoaXMuc2VydmVycykge1xuXG4gICAgICBzZXJ2ZXIuZGVzdHJveSgpO1xuICAgICAgc2VydmVyID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgICB0aGlzLnNlcnZlcnMgPSBbXTtcblxuICAgIGZvciAobGV0IGNsaWVudCBvZiB0aGlzLmNsaWVudHMpIHtcblxuICAgICAgY2xpZW50ID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgICB0aGlzLmNsaWVudHMgPSBbXTtcblxuICAgIHRoaXMuc2VydmVyID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuY2xpZW50ID0gdW5kZWZpbmVkO1xuICAgIHRoaXMudW5yZWdpc3RlckV2ZW50c0FuZENvbW1hbmRzKCk7XG4gICAgdGhpcy5wcm92aWRlciA9IHVuZGVmaW5lZDtcblxuICAgIHRoaXMuZGVzdHJveU9iamVjdCh0aGlzLmNvbmZpZyk7XG4gICAgdGhpcy5kZXN0cm95T2JqZWN0KHRoaXMucGFja2FnZUNvbmZpZyk7XG4gICAgdGhpcy5kZXN0cm95T2JqZWN0KHRoaXMucmVmZXJlbmNlKTtcbiAgICB0aGlzLmRlc3Ryb3lPYmplY3QodGhpcy5yZW5hbWUpO1xuICAgIHRoaXMuZGVzdHJveU9iamVjdCh0aGlzLnR5cGUpO1xuICAgIHRoaXMuZGVzdHJveU9iamVjdCh0aGlzLmhlbHBlcik7XG5cbiAgICB0aGlzLmluaXRpYWxpc2VkID0gZmFsc2U7XG4gIH1cblxuICB1bnJlZ2lzdGVyRXZlbnRzQW5kQ29tbWFuZHMoKSB7XG5cbiAgICBmb3IgKGxldCBkaXNwb3NhYmxlIG9mIHRoaXMuZGlzcG9zYWJsZXMpIHtcblxuICAgICAgaWYgKCFkaXNwb3NhYmxlKSB7XG5cbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGRpc3Bvc2FibGUuZGlzcG9zZSgpO1xuICAgIH1cblxuICAgIHRoaXMuZGlzcG9zYWJsZXMgPSBbXTtcbiAgfVxuXG4gIGluaXRTZXJ2ZXJzKCkge1xuXG4gICAgbGV0IGRpcnMgPSBhdG9tLnByb2plY3QuZ2V0RGlyZWN0b3JpZXMoKTtcblxuICAgIGlmIChkaXJzLmxlbmd0aCA9PT0gMCkge1xuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZm9yIChsZXQgZGlyIG9mIGRpcnMpIHtcblxuICAgICAgZGlyID0gYXRvbS5wcm9qZWN0LnJlbGF0aXZpemVQYXRoKGRpci5wYXRoKVswXTtcblxuICAgICAgaWYgKHRoaXMuaGVscGVyLmlzRGlyZWN0b3J5KGRpcikpIHtcblxuICAgICAgICB0aGlzLnN0YXJ0U2VydmVyKGRpcik7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgc3RhcnRTZXJ2ZXIoZGlyKSB7XG5cbiAgICBpZiAoIVNlcnZlcikge1xuXG4gICAgICBTZXJ2ZXIgPSByZXF1aXJlKCcuL2F0b20tdGVybmpzLXNlcnZlcicpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmdldFNlcnZlckZvclByb2plY3QoZGlyKSkge1xuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGV0IGNsaWVudCA9IHRoaXMuZ2V0Q2xpZW50Rm9yUHJvamVjdChkaXIpO1xuXG4gICAgaWYgKCFjbGllbnQpIHtcblxuICAgICAgaWYgKCFDbGllbnQpIHtcblxuICAgICAgICBDbGllbnQgPSByZXF1aXJlKCcuL2F0b20tdGVybmpzLWNsaWVudCcpO1xuICAgICAgfVxuXG4gICAgICBsZXQgY2xpZW50SWR4ID0gdGhpcy5jbGllbnRzLnB1c2gobmV3IENsaWVudCh0aGlzLCBkaXIpKSAtIDE7XG4gICAgICBjbGllbnQgPSB0aGlzLmNsaWVudHNbY2xpZW50SWR4XTtcbiAgICB9XG5cbiAgICB0aGlzLnNlcnZlcnMucHVzaChuZXcgU2VydmVyKGRpciwgY2xpZW50LCB0aGlzKSk7XG5cbiAgICBpZiAodGhpcy5zZXJ2ZXJzLmxlbmd0aCA9PT0gdGhpcy5jbGllbnRzLmxlbmd0aCkge1xuXG4gICAgICBpZiAoIXRoaXMuaW5pdGlhbGlzZWQpIHtcblxuICAgICAgICB0aGlzLmFjdGl2YXRlKCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuc2V0QWN0aXZlU2VydmVyQW5kQ2xpZW50KGRpcik7XG4gICAgfVxuICB9XG5cbiAgc2V0QWN0aXZlU2VydmVyQW5kQ2xpZW50KFVSSSkge1xuXG4gICAgaWYgKCFVUkkpIHtcblxuICAgICAgbGV0IGFjdGl2ZVBhbmUgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lSXRlbSgpO1xuXG4gICAgICBpZiAoYWN0aXZlUGFuZSAmJiBhY3RpdmVQYW5lLmdldFVSSSkge1xuXG4gICAgICAgIFVSSSA9IGFjdGl2ZVBhbmUuZ2V0VVJJKCk7XG5cbiAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgdGhpcy5zZXJ2ZXIgPSB1bmRlZmluZWQ7XG4gICAgICAgIHRoaXMuY2xpZW50ID0gdW5kZWZpbmVkO1xuXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBsZXQgZGlyID0gYXRvbS5wcm9qZWN0LnJlbGF0aXZpemVQYXRoKFVSSSlbMF07XG4gICAgbGV0IHNlcnZlciA9IHRoaXMuZ2V0U2VydmVyRm9yUHJvamVjdChkaXIpO1xuICAgIGxldCBjbGllbnQgPSB0aGlzLmdldENsaWVudEZvclByb2plY3QoZGlyKTtcblxuICAgIGlmIChzZXJ2ZXIgJiYgY2xpZW50KSB7XG5cbiAgICAgIHRoaXMuc2VydmVyID0gc2VydmVyO1xuICAgICAgdGhpcy5jb25maWcuZ2F0aGVyRGF0YSgpO1xuICAgICAgdGhpcy5jbGllbnQgPSBjbGllbnQ7XG5cbiAgICB9IGVsc2Uge1xuXG4gICAgICB0aGlzLnNlcnZlciA9IHVuZGVmaW5lZDtcbiAgICAgIHRoaXMuY29uZmlnLmNsZWFyKCk7XG4gICAgICB0aGlzLmNsaWVudCA9IHVuZGVmaW5lZDtcbiAgICB9XG4gIH1cblxuICBjaGVja1BhdGhzKHBhdGhzKSB7XG5cbiAgICBmb3IgKGxldCBwYXRoIG9mIHBhdGhzKSB7XG5cbiAgICAgIGxldCBkaXIgPSBhdG9tLnByb2plY3QucmVsYXRpdml6ZVBhdGgocGF0aClbMF07XG5cbiAgICAgIGlmICh0aGlzLmhlbHBlci5pc0RpcmVjdG9yeShkaXIpKSB7XG5cbiAgICAgICAgdGhpcy5zdGFydFNlcnZlcihkaXIpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGRlc3Ryb3lTZXJ2ZXIocGF0aHMpIHtcblxuICAgIGlmICh0aGlzLnNlcnZlcnMubGVuZ3RoID09PSAwKSB7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgc2VydmVySWR4O1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnNlcnZlcnMubGVuZ3RoOyBpKyspIHtcblxuICAgICAgaWYgKHBhdGhzLmluZGV4T2YodGhpcy5zZXJ2ZXJzW2ldLnByb2plY3REaXIpID09PSAtMSkge1xuXG4gICAgICAgIHNlcnZlcklkeCA9IGk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChzZXJ2ZXJJZHggPT09IHVuZGVmaW5lZCkge1xuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGV0IHNlcnZlciA9IHRoaXMuc2VydmVyc1tzZXJ2ZXJJZHhdO1xuICAgIGxldCBjbGllbnQgPSB0aGlzLmdldENsaWVudEZvclByb2plY3Qoc2VydmVyLnByb2plY3REaXIpO1xuICAgIGNsaWVudCA9IHVuZGVmaW5lZDtcblxuICAgIHNlcnZlci5kZXN0cm95KCk7XG4gICAgc2VydmVyID0gdW5kZWZpbmVkO1xuXG4gICAgdGhpcy5zZXJ2ZXJzLnNwbGljZShzZXJ2ZXJJZHgsIDEpO1xuICB9XG5cbiAgZ2V0U2VydmVyRm9yUHJvamVjdChwcm9qZWN0RGlyKSB7XG5cbiAgICBmb3IgKGxldCBzZXJ2ZXIgb2YgdGhpcy5zZXJ2ZXJzKSB7XG5cbiAgICAgIGlmIChzZXJ2ZXIucHJvamVjdERpciA9PT0gcHJvamVjdERpcikge1xuXG4gICAgICAgIHJldHVybiBzZXJ2ZXI7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgZ2V0Q2xpZW50Rm9yUHJvamVjdChwcm9qZWN0RGlyKSB7XG5cbiAgICBmb3IgKGxldCBjbGllbnQgb2YgdGhpcy5jbGllbnRzKSB7XG5cbiAgICAgIGlmIChjbGllbnQucHJvamVjdERpciA9PT0gcHJvamVjdERpcikge1xuXG4gICAgICAgIHJldHVybiBjbGllbnQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgZ2V0RWRpdG9yKGVkaXRvcikge1xuXG4gICAgZm9yIChsZXQgX2VkaXRvciBvZiB0aGlzLmVkaXRvcnMpIHtcblxuICAgICAgaWYgKF9lZGl0b3IuaWQgPT09IGVkaXRvci5pZCkge1xuXG4gICAgICAgIHJldHVybiBfZWRpdG9yO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGlzVmFsaWRFZGl0b3IoZWRpdG9yKSB7XG5cbiAgICBpZiAoIWVkaXRvciB8fCAhZWRpdG9yLmdldEdyYW1tYXIgfHwgZWRpdG9yLm1pbmkpIHtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICghZWRpdG9yLmdldEdyYW1tYXIoKSkge1xuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuZ3JhbW1hcnMuaW5kZXhPZihlZGl0b3IuZ2V0R3JhbW1hcigpLm5hbWUpID09PSAtMSkge1xuXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBvbkRpZENoYW5nZUN1cnNvclBvc2l0aW9uKGVkaXRvciwgZSkge1xuXG4gICAgaWYgKHRoaXMucGFja2FnZUNvbmZpZy5vcHRpb25zLmlubGluZUZuQ29tcGxldGlvbikge1xuXG4gICAgICBpZiAoIXRoaXMudHlwZSkge1xuXG4gICAgICAgIFR5cGUgPSByZXF1aXJlKCcuL2F0b20tdGVybmpzLXR5cGUnKTtcbiAgICAgICAgdGhpcy50eXBlID0gbmV3IFR5cGUodGhpcyk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMudHlwZS5xdWVyeVR5cGUoZWRpdG9yLCBlLmN1cnNvcik7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucmVuYW1lKSB7XG5cbiAgICAgIHRoaXMucmVuYW1lLmhpZGUoKTtcbiAgICB9XG4gIH1cblxuICByZWdpc3RlckV2ZW50cygpIHtcblxuICAgIHRoaXMuZGlzcG9zYWJsZXMucHVzaChhdG9tLndvcmtzcGFjZS5vYnNlcnZlVGV4dEVkaXRvcnMoKGVkaXRvcikgPT4ge1xuXG4gICAgICBpZiAoIXRoaXMuaXNWYWxpZEVkaXRvcihlZGl0b3IpKSB7XG5cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAvLyBSZWdpc3RlciB2YWxpZCBlZGl0b3JcbiAgICAgIHRoaXMuZWRpdG9ycy5wdXNoKHtcblxuICAgICAgICBpZDogZWRpdG9yLmlkLFxuICAgICAgICBkaWZmczogW11cbiAgICAgIH0pO1xuXG4gICAgICBpZiAoIXRoaXMuaW5pdENhbGxlZCkge1xuXG4gICAgICAgIHRoaXMuaW5pdCgpO1xuICAgICAgfVxuXG4gICAgICBsZXQgZWRpdG9yVmlldyA9IGF0b20udmlld3MuZ2V0VmlldyhlZGl0b3IpO1xuXG4gICAgICBpZiAoZWRpdG9yVmlldykge1xuXG4gICAgICAgIHRoaXMuZGlzcG9zYWJsZXMucHVzaChlZGl0b3JWaWV3LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcblxuICAgICAgICAgIGlmICghZVt0aGlzLmhlbHBlci5hY2Nlc3NLZXldKSB7XG5cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAodGhpcy5jbGllbnQpIHtcblxuICAgICAgICAgICAgdGhpcy5jbGllbnQuZGVmaW5pdGlvbigpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSkpO1xuICAgICAgfVxuXG4gICAgICBsZXQgc2Nyb2xsVmlldztcblxuICAgICAgaWYgKCFlZGl0b3JWaWV3LnNoYWRvd1Jvb3QpIHtcblxuICAgICAgICBzY3JvbGxWaWV3ID0gZWRpdG9yVmlldy5xdWVyeVNlbGVjdG9yKCcuc2Nyb2xsLXZpZXcnKTtcblxuICAgICAgfSBlbHNlIHtcblxuICAgICAgICBzY3JvbGxWaWV3ID0gZWRpdG9yVmlldy5zaGFkb3dSb290LnF1ZXJ5U2VsZWN0b3IoJy5zY3JvbGwtdmlldycpO1xuICAgICAgfVxuXG4gICAgICBpZiAoc2Nyb2xsVmlldykge1xuXG4gICAgICAgIHRoaXMuZGlzcG9zYWJsZXMucHVzaChzY3JvbGxWaWV3LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIChlKSA9PiB7XG5cbiAgICAgICAgICBpZiAoIWVbdGhpcy5oZWxwZXIuYWNjZXNzS2V5XSkge1xuXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGUudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnbGluZScpKSB7XG5cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBlLnRhcmdldC5jbGFzc0xpc3QuYWRkKCdhdG9tLXRlcm5qcy1ob3ZlcicpO1xuICAgICAgICB9KSk7XG5cbiAgICAgICAgdGhpcy5kaXNwb3NhYmxlcy5wdXNoKHNjcm9sbFZpZXcuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdXQnLCAoZSkgPT4ge1xuXG4gICAgICAgICAgZS50YXJnZXQuY2xhc3NMaXN0LnJlbW92ZSgnYXRvbS10ZXJuanMtaG92ZXInKTtcbiAgICAgICAgfSkpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmRpc3Bvc2FibGVzLnB1c2goZWRpdG9yLm9uRGlkQ2hhbmdlQ3Vyc29yUG9zaXRpb24oKGUpID0+IHtcblxuICAgICAgICBpZiAodGhpcy50eXBlKSB7XG5cbiAgICAgICAgICB0aGlzLnR5cGUuZGVzdHJveU92ZXJsYXkoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmRvY3VtZW50YXRpb24pIHtcblxuICAgICAgICAgIHRoaXMuZG9jdW1lbnRhdGlvbi5kZXN0cm95T3ZlcmxheSgpO1xuICAgICAgICB9XG4gICAgICB9KSk7XG5cbiAgICAgIHRoaXMuZGlzcG9zYWJsZXMucHVzaChlZGl0b3Iub25EaWRDaGFuZ2VDdXJzb3JQb3NpdGlvbihfLmRlYm91bmNlKHRoaXMub25EaWRDaGFuZ2VDdXJzb3JQb3NpdGlvbi5iaW5kKHRoaXMsIGVkaXRvciksIDMwMCkpKTtcblxuICAgICAgdGhpcy5kaXNwb3NhYmxlcy5wdXNoKGVkaXRvci5nZXRCdWZmZXIoKS5vbkRpZFNhdmUoKGUpID0+IHtcblxuICAgICAgICBpZiAodGhpcy5jbGllbnQpIHtcblxuICAgICAgICAgIHRoaXMuY2xpZW50LnVwZGF0ZShlZGl0b3IpO1xuICAgICAgICB9XG4gICAgICB9KSk7XG5cbiAgICAgIHRoaXMuZGlzcG9zYWJsZXMucHVzaChlZGl0b3IuZ2V0QnVmZmVyKCkub25EaWRDaGFuZ2UoKGUpID0+IHtcblxuICAgICAgICB0aGlzLmdldEVkaXRvcihlZGl0b3IpLmRpZmZzLnB1c2goZSk7XG4gICAgICB9KSk7XG4gICAgfSkpO1xuXG4gICAgdGhpcy5kaXNwb3NhYmxlcy5wdXNoKGF0b20ud29ya3NwYWNlLm9uRGlkQ2hhbmdlQWN0aXZlUGFuZUl0ZW0oKGl0ZW0pID0+IHtcblxuICAgICAgaWYgKHRoaXMuY29uZmlnKSB7XG5cbiAgICAgICAgdGhpcy5jb25maWcuY2xlYXIoKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMudHlwZSkge1xuXG4gICAgICAgIHRoaXMudHlwZS5kZXN0cm95T3ZlcmxheSgpO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5yZW5hbWUpIHtcblxuICAgICAgICB0aGlzLnJlbmFtZS5oaWRlKCk7XG4gICAgICB9XG5cbiAgICAgIGlmICghdGhpcy5pc1ZhbGlkRWRpdG9yKGl0ZW0pKSB7XG5cbiAgICAgICAgaWYgKHRoaXMucmVmZXJlbmNlKSB7XG5cbiAgICAgICAgICB0aGlzLnJlZmVyZW5jZS5oaWRlKCk7XG4gICAgICAgIH1cblxuICAgICAgfSBlbHNlIHtcblxuICAgICAgICB0aGlzLnNldEFjdGl2ZVNlcnZlckFuZENsaWVudChpdGVtLmdldFVSSSgpKTtcbiAgICAgIH1cbiAgICB9KSk7XG4gIH1cblxuICByZWdpc3RlckhlbHBlckNvbW1hbmRzKCkge1xuXG4gICAgdGhpcy5kaXNwb3NhYmxlcy5wdXNoKGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXdvcmtzcGFjZScsICdhdG9tLXRlcm5qczpvcGVuQ29uZmlnJywgKGUpID0+IHtcblxuICAgICAgaWYgKCF0aGlzLmNvbmZpZykge1xuXG4gICAgICAgIHRoaXMuY29uZmlnID0gbmV3IENvbmZpZyh0aGlzKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5jb25maWcuc2hvdygpO1xuICAgIH0pKTtcbiAgfVxuXG4gIHJlZ2lzdGVyQ29tbWFuZHMoKSB7XG5cbiAgICB0aGlzLmRpc3Bvc2FibGVzLnB1c2goYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20tdGV4dC1lZGl0b3InLCAnY29yZTpjYW5jZWwnLCAoZSkgPT4ge1xuXG4gICAgICBpZiAodGhpcy5jb25maWcpIHtcblxuICAgICAgICB0aGlzLmNvbmZpZy5oaWRlKCk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLnR5cGUpIHtcblxuICAgICAgICB0aGlzLnR5cGUuZGVzdHJveU92ZXJsYXkoKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMucmVuYW1lKSB7XG5cbiAgICAgICAgdGhpcy5yZW5hbWUuaGlkZSgpO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5yZWZlcmVuY2UpIHtcblxuICAgICAgICB0aGlzLnJlZmVyZW5jZS5oaWRlKCk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLmRvY3VtZW50YXRpb24pIHtcblxuICAgICAgICB0aGlzLmRvY3VtZW50YXRpb24uZGVzdHJveU92ZXJsYXkoKTtcbiAgICAgIH1cbiAgICB9KSk7XG5cbiAgICB0aGlzLmRpc3Bvc2FibGVzLnB1c2goYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20tdGV4dC1lZGl0b3InLCAnYXRvbS10ZXJuanM6bGlzdEZpbGVzJywgKGUpID0+IHtcblxuICAgICAgaWYgKHRoaXMuY2xpZW50KSB7XG5cbiAgICAgICAgdGhpcy5jbGllbnQuZmlsZXMoKS50aGVuKChkYXRhKSA9PiB7XG5cbiAgICAgICAgICBjb25zb2xlLmRpcihkYXRhKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSkpO1xuXG4gICAgdGhpcy5kaXNwb3NhYmxlcy5wdXNoKGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXRleHQtZWRpdG9yJywgJ2F0b20tdGVybmpzOmZsdXNoJywgKGUpID0+IHtcblxuICAgICAgaWYgKHRoaXMuc2VydmVyKSB7XG5cbiAgICAgICAgdGhpcy5zZXJ2ZXIuZmx1c2goKTtcbiAgICAgIH1cbiAgICB9KSk7XG5cbiAgICB0aGlzLmRpc3Bvc2FibGVzLnB1c2goYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20tdGV4dC1lZGl0b3InLCAnYXRvbS10ZXJuanM6ZG9jdW1lbnRhdGlvbicsIChlKSA9PiB7XG5cbiAgICAgIGlmICghdGhpcy5kb2N1bWVudGF0aW9uKSB7XG5cbiAgICAgICAgRG9jdW1lbnRhdGlvbiA9IHJlcXVpcmUoJy4vYXRvbS10ZXJuanMtZG9jdW1lbnRhdGlvbicpO1xuICAgICAgICB0aGlzLmRvY3VtZW50YXRpb24gPSBuZXcgRG9jdW1lbnRhdGlvbih0aGlzKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuY2xpZW50KSB7XG5cbiAgICAgICAgdGhpcy5kb2N1bWVudGF0aW9uLnJlcXVlc3QoKTtcbiAgICAgIH1cbiAgICB9KSk7XG5cbiAgICB0aGlzLmRpc3Bvc2FibGVzLnB1c2goYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20tdGV4dC1lZGl0b3InLCAnYXRvbS10ZXJuanM6cmVmZXJlbmNlcycsIChlKSA9PiB7XG5cbiAgICAgIGlmICghdGhpcy5yZWZlcmVuY2UpIHtcblxuICAgICAgICBSZWZlcmVuY2UgPSByZXF1aXJlKCcuL2F0b20tdGVybmpzLXJlZmVyZW5jZScpO1xuICAgICAgICB0aGlzLnJlZmVyZW5jZSA9IG5ldyBSZWZlcmVuY2UodGhpcyk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMucmVmZXJlbmNlLmZpbmRSZWZlcmVuY2UoKTtcbiAgICB9KSk7XG5cbiAgICB0aGlzLmRpc3Bvc2FibGVzLnB1c2goYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20tdGV4dC1lZGl0b3InLCAnYXRvbS10ZXJuanM6cmVuYW1lJywgKGUpID0+IHtcblxuICAgICAgICBpZiAoIXRoaXMucmVuYW1lKSB7XG5cbiAgICAgICAgICBSZW5hbWUgPSByZXF1aXJlKCcuL2F0b20tdGVybmpzLXJlbmFtZScpO1xuICAgICAgICAgIHRoaXMucmVuYW1lID0gbmV3IFJlbmFtZSh0aGlzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMucmVuYW1lLnNob3coKTtcbiAgICAgIH1cbiAgICApKTtcblxuICAgIHRoaXMuZGlzcG9zYWJsZXMucHVzaChhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS10ZXh0LWVkaXRvcicsICdhdG9tLXRlcm5qczptYXJrZXJDaGVja3BvaW50QmFjaycsIChlKSA9PiB7XG5cbiAgICAgIGlmICh0aGlzLmhlbHBlcikge1xuXG4gICAgICAgIHRoaXMuaGVscGVyLm1hcmtlckNoZWNrcG9pbnRCYWNrKCk7XG4gICAgICB9XG4gICAgfSkpO1xuXG4gICAgdGhpcy5kaXNwb3NhYmxlcy5wdXNoKGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXRleHQtZWRpdG9yJywgJ2F0b20tdGVybmpzOnN0YXJ0Q29tcGxldGlvbicsIChlKSA9PiB7XG5cbiAgICAgIGlmICh0aGlzLnByb3ZpZGVyKSB7XG5cbiAgICAgICAgdGhpcy5wcm92aWRlci5mb3JjZUNvbXBsZXRpb24oKTtcbiAgICAgIH1cbiAgICB9KSk7XG5cbiAgICB0aGlzLmRpc3Bvc2FibGVzLnB1c2goYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20tdGV4dC1lZGl0b3InLCAnYXRvbS10ZXJuanM6ZGVmaW5pdGlvbicsIChlKSA9PiB7XG5cbiAgICAgIGlmICh0aGlzLmNsaWVudCkge1xuXG4gICAgICAgIHRoaXMuY2xpZW50LmRlZmluaXRpb24oKTtcbiAgICAgIH1cbiAgICB9KSk7XG5cbiAgICB0aGlzLmRpc3Bvc2FibGVzLnB1c2goYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20td29ya3NwYWNlJywgJ2F0b20tdGVybmpzOnJlc3RhcnQnLCAoZSkgPT4ge1xuXG4gICAgICB0aGlzLnJlc3RhcnRTZXJ2ZXIoKTtcbiAgICB9KSk7XG4gIH1cblxuICByZXN0YXJ0U2VydmVyKCkge1xuXG4gICAgaWYgKCF0aGlzLnNlcnZlcikge1xuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGV0IGRpciA9IHRoaXMuc2VydmVyLnByb2plY3REaXI7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuc2VydmVycy5sZW5ndGg7IGkrKykge1xuXG4gICAgICBpZiAoZGlyID09PSB0aGlzLnNlcnZlcnNbaV0ucHJvamVjdERpcikge1xuXG4gICAgICAgIHNlcnZlcklkeCA9IGk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLnNlcnZlcikge1xuXG4gICAgICB0aGlzLnNlcnZlci5kZXN0cm95KCk7XG4gICAgfVxuXG4gICAgdGhpcy5zZXJ2ZXIgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5zZXJ2ZXJzLnNwbGljZShzZXJ2ZXJJZHgsIDEpO1xuICAgIHRoaXMuc3RhcnRTZXJ2ZXIoZGlyKTtcbiAgfVxufVxuIl19
//# sourceURL=/home/cin_chalic/.atom/packages/atom-ternjs/lib/atom-ternjs-manager.js
