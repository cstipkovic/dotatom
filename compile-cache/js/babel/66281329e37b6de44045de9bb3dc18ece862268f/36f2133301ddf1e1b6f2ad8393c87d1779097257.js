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

      Helper = require('./atom-ternjs-helper');
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

        _this2.disposables.push(editorView.addEventListener('click', function (e) {

          if (!e[_this2.helper.accessKey]) {

            return;
          }

          if (_this2.client) {

            _this2.client.definition();
          }
        }));

        var scrollView = undefined;

        if (!editorView.shadowRoot) {

          scrollView = editorView.querySelector('.scroll-view');
        } else {

          scrollView = editorView.shadowRoot.querySelector('.scroll-view');
        }

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

      this.disposables.push(atom.commands.add('atom-workspace', 'tern:openConfig', function (e) {

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

      this.disposables.push(atom.commands.add('atom-text-editor', 'tern:listFiles', function (e) {

        if (_this4.client) {

          _this4.client.files().then(function (data) {

            console.dir(data);
          });
        }
      }));

      this.disposables.push(atom.commands.add('atom-text-editor', 'tern:flush', function (e) {

        if (_this4.server) {

          _this4.server.flush();
        }
      }));

      this.disposables.push(atom.commands.add('atom-text-editor', 'tern:documentation', function (e) {

        if (!_this4.documentation) {

          Documentation = require('./atom-ternjs-documentation');
          _this4.documentation = new Documentation(_this4);
        }

        _this4.documentation.request();
      }));

      this.disposables.push(atom.commands.add('atom-text-editor', 'tern:references', function (e) {

        if (!_this4.reference) {

          Reference = require('./atom-ternjs-reference');
          _this4.reference = new Reference(_this4);
        }

        _this4.reference.findReference();
      }));

      this.disposables.push(atom.commands.add('atom-text-editor', 'tern:rename', function (e) {

        if (!_this4.rename) {

          Rename = require('./atom-ternjs-rename');
          _this4.rename = new Rename(_this4);
        }

        _this4.rename.show();
      }));

      this.disposables.push(atom.commands.add('atom-text-editor', 'tern:markerCheckpointBack', function (e) {

        if (_this4.helper) {

          _this4.helper.markerCheckpointBack();
        }
      }));

      this.disposables.push(atom.commands.add('atom-text-editor', 'tern:startCompletion', function (e) {

        if (_this4.provider) {

          _this4.provider.forceCompletion();
        }
      }));

      this.disposables.push(atom.commands.add('atom-text-editor', 'tern:definition', function (e) {

        if (_this4.client) {

          _this4.client.definition();
        }
      }));

      this.disposables.push(atom.commands.add('atom-workspace', 'tern:restart', function (e) {

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvYXRvbS10ZXJuanMvbGliL2F0b20tdGVybmpzLW1hbmFnZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsV0FBVyxDQUFDOzs7Ozs7Ozs7O0FBRVosSUFBSSxNQUFNLFlBQUEsQ0FBQztBQUNYLElBQUksTUFBTSxZQUFBLENBQUM7QUFDWCxJQUFJLGFBQWEsWUFBQSxDQUFDO0FBQ2xCLElBQUksTUFBTSxZQUFBLENBQUM7QUFDWCxJQUFJLGFBQWEsWUFBQSxDQUFDO0FBQ2xCLElBQUksTUFBTSxZQUFBLENBQUM7QUFDWCxJQUFJLElBQUksWUFBQSxDQUFDO0FBQ1QsSUFBSSxTQUFTLFlBQUEsQ0FBQztBQUNkLElBQUksTUFBTSxZQUFBLENBQUM7QUFDWCxJQUFJLENBQUMsR0FBRyxPQUFPLENBQUMsaUJBQWlCLENBQUMsQ0FBQzs7SUFFZCxPQUFPO0FBRWYsV0FGUSxPQUFPLENBRWQsUUFBUSxFQUFFOzBCQUZILE9BQU87O0FBSXhCLFFBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDOztBQUV6QixRQUFJLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQzs7QUFFdEIsUUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDOztBQUUvQixRQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztBQUNsQixRQUFJLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQztBQUN4QixRQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztBQUNsQixRQUFJLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQzs7QUFFeEIsUUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7O0FBRWxCLFFBQUksQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFDO0FBQ3hCLFFBQUksQ0FBQyxJQUFJLEdBQUcsU0FBUyxDQUFDO0FBQ3RCLFFBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO0FBQzNCLFFBQUksQ0FBQyxh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QztBQUNkLGdCQUFNO1NBQ1A7T0FDRjs7QUFFRCxVQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7O0FBRWYsWUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQztPQUN2Qjs7QUFFRCxVQUFJLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQztBQUN4QixVQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDbEMsVUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQztLQUN2Qjs7O1NBemxCa0IsT0FBTzs7O3FCQUFQLE9BQU8iLCJmaWxlIjoiL2hvbWUvY2luX2NoYWxpYy8uYXRvbS9wYWNrYWdlcy9hdG9tLXRlcm5qcy9saWIvYXRvbS10ZXJuanMtbWFuYWdlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIGJhYmVsXCI7XG5cbmxldCBTZXJ2ZXI7XG5sZXQgQ2xpZW50O1xubGV0IERvY3VtZW50YXRpb247XG5sZXQgSGVscGVyO1xubGV0IFBhY2thZ2VDb25maWc7XG5sZXQgQ29uZmlnO1xubGV0IFR5cGU7XG5sZXQgUmVmZXJlbmNlO1xubGV0IFJlbmFtZTtcbmxldCBfID0gcmVxdWlyZSgndW5kZXJzY29yZS1wbHVzJyk7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1hbmFnZXIge1xuXG4gIGNvbnN0cnVjdG9yKHByb3ZpZGVyKSB7XG5cbiAgICB0aGlzLnByb3ZpZGVyID0gcHJvdmlkZXI7XG5cbiAgICB0aGlzLmRpc3Bvc2FibGVzID0gW107XG5cbiAgICB0aGlzLmdyYW1tYXJzID0gWydKYXZhU2NyaXB0J107XG5cbiAgICB0aGlzLmNsaWVudHMgPSBbXTtcbiAgICB0aGlzLmNsaWVudCA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLnNlcnZlcnMgPSBbXTtcbiAgICB0aGlzLnNlcnZlciA9IHVuZGVmaW5lZDtcblxuICAgIHRoaXMuZWRpdG9ycyA9IFtdO1xuXG4gICAgdGhpcy5yZW5hbWUgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy50eXBlID0gdW5kZWZpbmVkO1xuICAgIHRoaXMucmVmZXJlbmNlID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuZG9jdW1lbnRhdGlvbiA9IHVuZGVmaW5lZDtcblxuICAgIHRoaXMuaW5pdGlhbGlzZWQgPSBmYWxzZTtcblxuICAgIHdpbmRvdy5zZXRUaW1lb3V0KHRoaXMuaW5pdC5iaW5kKHRoaXMpLCAwKTtcbiAgfVxuXG4gIGluaXQoKSB7XG5cbiAgICBIZWxwZXIgPSByZXF1aXJlKCcuL2F0b20tdGVybmpzLWhlbHBlcicpO1xuICAgIFBhY2thZ2VDb25maWcgPSByZXF1aXJlKCcuL2F0b20tdGVybmpzLXBhY2thZ2UtY29uZmlnJyk7XG4gICAgQ29uZmlnID0gcmVxdWlyZSgnLi9hdG9tLXRlcm5qcy1jb25maWcnKTtcblxuICAgIHRoaXMuaGVscGVyID0gbmV3IEhlbHBlcih0aGlzKTtcbiAgICB0aGlzLnBhY2thZ2VDb25maWcgPSBuZXcgUGFja2FnZUNvbmZpZyh0aGlzKTtcbiAgICB0aGlzLmNvbmZpZyA9IG5ldyBDb25maWcodGhpcyk7XG4gICAgdGhpcy5wcm92aWRlci5pbml0KHRoaXMpO1xuICAgIHRoaXMuaW5pdFNlcnZlcnMoKTtcblxuICAgIHRoaXMucmVnaXN0ZXJIZWxwZXJDb21tYW5kcygpO1xuXG4gICAgdGhpcy5kaXNwb3NhYmxlcy5wdXNoKGF0b20ucHJvamVjdC5vbkRpZENoYW5nZVBhdGhzKChwYXRocykgPT4ge1xuXG4gICAgICB0aGlzLmRlc3Ryb3lTZXJ2ZXIocGF0aHMpO1xuICAgICAgdGhpcy5jaGVja1BhdGhzKHBhdGhzKTtcbiAgICAgIHRoaXMuc2V0QWN0aXZlU2VydmVyQW5kQ2xpZW50KCk7XG4gICAgfSkpO1xuICB9XG5cbiAgYWN0aXZhdGUoKSB7XG5cbiAgICB0aGlzLmluaXRpYWxpc2VkID0gdHJ1ZTtcbiAgICB0aGlzLnJlZ2lzdGVyRXZlbnRzKCk7XG4gICAgdGhpcy5yZWdpc3RlckNvbW1hbmRzKCk7XG4gIH1cblxuICBkZXN0cm95T2JqZWN0KG9iamVjdCkge1xuXG4gICAgaWYgKG9iamVjdCkge1xuXG4gICAgICBvYmplY3QuZGVzdHJveSgpO1xuICAgIH1cbiAgICBvYmplY3QgPSB1bmRlZmluZWQ7XG4gIH1cblxuICBkZXN0cm95KCkge1xuXG4gICAgZm9yIChsZXQgc2VydmVyIG9mIHRoaXMuc2VydmVycykge1xuXG4gICAgICBzZXJ2ZXIuZGVzdHJveSgpO1xuICAgICAgc2VydmVyID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgICB0aGlzLnNlcnZlcnMgPSBbXTtcblxuICAgIGZvciAobGV0IGNsaWVudCBvZiB0aGlzLmNsaWVudHMpIHtcblxuICAgICAgY2xpZW50ID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgICB0aGlzLmNsaWVudHMgPSBbXTtcblxuICAgIHRoaXMuc2VydmVyID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuY2xpZW50ID0gdW5kZWZpbmVkO1xuICAgIHRoaXMudW5yZWdpc3RlckV2ZW50c0FuZENvbW1hbmRzKCk7XG4gICAgdGhpcy5wcm92aWRlciA9IHVuZGVmaW5lZDtcblxuICAgIHRoaXMuZGVzdHJveU9iamVjdCh0aGlzLmNvbmZpZyk7XG4gICAgdGhpcy5kZXN0cm95T2JqZWN0KHRoaXMucGFja2FnZUNvbmZpZyk7XG4gICAgdGhpcy5kZXN0cm95T2JqZWN0KHRoaXMucmVmZXJlbmNlKTtcbiAgICB0aGlzLmRlc3Ryb3lPYmplY3QodGhpcy5yZW5hbWUpO1xuICAgIHRoaXMuZGVzdHJveU9iamVjdCh0aGlzLnR5cGUpO1xuICAgIHRoaXMuZGVzdHJveU9iamVjdCh0aGlzLmhlbHBlcik7XG5cbiAgICB0aGlzLmluaXRpYWxpc2VkID0gZmFsc2U7XG4gIH1cblxuICB1bnJlZ2lzdGVyRXZlbnRzQW5kQ29tbWFuZHMoKSB7XG5cbiAgICBmb3IgKGxldCBkaXNwb3NhYmxlIG9mIHRoaXMuZGlzcG9zYWJsZXMpIHtcblxuICAgICAgZGlzcG9zYWJsZS5kaXNwb3NlKCk7XG4gICAgfVxuXG4gICAgdGhpcy5kaXNwb3NhYmxlcyA9IFtdO1xuICB9XG5cbiAgaW5pdFNlcnZlcnMoKSB7XG5cbiAgICBsZXQgZGlycyA9IGF0b20ucHJvamVjdC5nZXREaXJlY3RvcmllcygpO1xuXG4gICAgaWYgKGRpcnMubGVuZ3RoID09PSAwKSB7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBmb3IgKGxldCBkaXIgb2YgZGlycykge1xuXG4gICAgICBkaXIgPSBhdG9tLnByb2plY3QucmVsYXRpdml6ZVBhdGgoZGlyLnBhdGgpWzBdO1xuXG4gICAgICBpZiAodGhpcy5oZWxwZXIuaXNEaXJlY3RvcnkoZGlyKSkge1xuXG4gICAgICAgIHRoaXMuc3RhcnRTZXJ2ZXIoZGlyKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBzdGFydFNlcnZlcihkaXIpIHtcblxuICAgIGlmICghU2VydmVyKSB7XG5cbiAgICAgIFNlcnZlciA9IHJlcXVpcmUoJy4vYXRvbS10ZXJuanMtc2VydmVyJyk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuZ2V0U2VydmVyRm9yUHJvamVjdChkaXIpKSB7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgY2xpZW50ID0gdGhpcy5nZXRDbGllbnRGb3JQcm9qZWN0KGRpcik7XG5cbiAgICBpZiAoIWNsaWVudCkge1xuXG4gICAgICBpZiAoIUNsaWVudCkge1xuXG4gICAgICAgIENsaWVudCA9IHJlcXVpcmUoJy4vYXRvbS10ZXJuanMtY2xpZW50Jyk7XG4gICAgICB9XG5cbiAgICAgIGxldCBjbGllbnRJZHggPSB0aGlzLmNsaWVudHMucHVzaChuZXcgQ2xpZW50KHRoaXMsIGRpcikpIC0gMTtcbiAgICAgIGNsaWVudCA9IHRoaXMuY2xpZW50c1tjbGllbnRJZHhdO1xuICAgIH1cblxuICAgIHRoaXMuc2VydmVycy5wdXNoKG5ldyBTZXJ2ZXIoZGlyLCBjbGllbnQsIHRoaXMpKTtcblxuICAgIGlmICh0aGlzLnNlcnZlcnMubGVuZ3RoID09PSB0aGlzLmNsaWVudHMubGVuZ3RoKSB7XG5cbiAgICAgIGlmICghdGhpcy5pbml0aWFsaXNlZCkge1xuXG4gICAgICAgIHRoaXMuYWN0aXZhdGUoKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5zZXRBY3RpdmVTZXJ2ZXJBbmRDbGllbnQoZGlyKTtcbiAgICB9XG4gIH1cblxuICBzZXRBY3RpdmVTZXJ2ZXJBbmRDbGllbnQoVVJJKSB7XG5cbiAgICBpZiAoIVVSSSkge1xuXG4gICAgICBsZXQgYWN0aXZlUGFuZSA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmVJdGVtKCk7XG5cbiAgICAgIGlmIChhY3RpdmVQYW5lICYmIGFjdGl2ZVBhbmUuZ2V0VVJJKSB7XG5cbiAgICAgICAgVVJJID0gYWN0aXZlUGFuZS5nZXRVUkkoKTtcblxuICAgICAgfSBlbHNlIHtcblxuICAgICAgICB0aGlzLnNlcnZlciA9IHVuZGVmaW5lZDtcbiAgICAgICAgdGhpcy5jbGllbnQgPSB1bmRlZmluZWQ7XG5cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cblxuICAgIGxldCBkaXIgPSBhdG9tLnByb2plY3QucmVsYXRpdml6ZVBhdGgoVVJJKVswXTtcbiAgICBsZXQgc2VydmVyID0gdGhpcy5nZXRTZXJ2ZXJGb3JQcm9qZWN0KGRpcik7XG4gICAgbGV0IGNsaWVudCA9IHRoaXMuZ2V0Q2xpZW50Rm9yUHJvamVjdChkaXIpO1xuXG4gICAgaWYgKHNlcnZlciAmJiBjbGllbnQpIHtcblxuICAgICAgdGhpcy5zZXJ2ZXIgPSBzZXJ2ZXI7XG4gICAgICB0aGlzLmNvbmZpZy5nYXRoZXJEYXRhKCk7XG4gICAgICB0aGlzLmNsaWVudCA9IGNsaWVudDtcblxuICAgIH0gZWxzZSB7XG5cbiAgICAgIHRoaXMuc2VydmVyID0gdW5kZWZpbmVkO1xuICAgICAgdGhpcy5jb25maWcuY2xlYXIoKTtcbiAgICAgIHRoaXMuY2xpZW50ID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgfVxuXG4gIGNoZWNrUGF0aHMocGF0aHMpIHtcblxuICAgIGZvciAobGV0IHBhdGggb2YgcGF0aHMpIHtcblxuICAgICAgbGV0IGRpciA9IGF0b20ucHJvamVjdC5yZWxhdGl2aXplUGF0aChwYXRoKVswXTtcblxuICAgICAgaWYgKHRoaXMuaGVscGVyLmlzRGlyZWN0b3J5KGRpcikpIHtcblxuICAgICAgICB0aGlzLnN0YXJ0U2VydmVyKGRpcik7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZGVzdHJveVNlcnZlcihwYXRocykge1xuXG4gICAgaWYgKHRoaXMuc2VydmVycy5sZW5ndGggPT09IDApIHtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCBzZXJ2ZXJJZHg7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuc2VydmVycy5sZW5ndGg7IGkrKykge1xuXG4gICAgICBpZiAocGF0aHMuaW5kZXhPZih0aGlzLnNlcnZlcnNbaV0ucHJvamVjdERpcikgPT09IC0xKSB7XG5cbiAgICAgICAgc2VydmVySWR4ID0gaTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHNlcnZlcklkeCA9PT0gdW5kZWZpbmVkKSB7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgc2VydmVyID0gdGhpcy5zZXJ2ZXJzW3NlcnZlcklkeF07XG4gICAgbGV0IGNsaWVudCA9IHRoaXMuZ2V0Q2xpZW50Rm9yUHJvamVjdChzZXJ2ZXIucHJvamVjdERpcik7XG4gICAgY2xpZW50ID0gdW5kZWZpbmVkO1xuXG4gICAgc2VydmVyLmRlc3Ryb3koKTtcbiAgICBzZXJ2ZXIgPSB1bmRlZmluZWQ7XG5cbiAgICB0aGlzLnNlcnZlcnMuc3BsaWNlKHNlcnZlcklkeCwgMSk7XG4gIH1cblxuICBnZXRTZXJ2ZXJGb3JQcm9qZWN0KHByb2plY3REaXIpIHtcblxuICAgIGZvciAobGV0IHNlcnZlciBvZiB0aGlzLnNlcnZlcnMpIHtcblxuICAgICAgaWYgKHNlcnZlci5wcm9qZWN0RGlyID09PSBwcm9qZWN0RGlyKSB7XG5cbiAgICAgICAgcmV0dXJuIHNlcnZlcjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBnZXRDbGllbnRGb3JQcm9qZWN0KHByb2plY3REaXIpIHtcblxuICAgIGZvciAobGV0IGNsaWVudCBvZiB0aGlzLmNsaWVudHMpIHtcblxuICAgICAgaWYgKGNsaWVudC5wcm9qZWN0RGlyID09PSBwcm9qZWN0RGlyKSB7XG5cbiAgICAgICAgcmV0dXJuIGNsaWVudDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBnZXRFZGl0b3IoZWRpdG9yKSB7XG5cbiAgICBmb3IgKGxldCBfZWRpdG9yIG9mIHRoaXMuZWRpdG9ycykge1xuXG4gICAgICBpZiAoX2VkaXRvci5pZCA9PT0gZWRpdG9yLmlkKSB7XG5cbiAgICAgICAgcmV0dXJuIF9lZGl0b3I7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaXNWYWxpZEVkaXRvcihlZGl0b3IpIHtcblxuICAgIGlmICghZWRpdG9yIHx8ICFlZGl0b3IuZ2V0R3JhbW1hciB8fCBlZGl0b3IubWluaSkge1xuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCFlZGl0b3IuZ2V0R3JhbW1hcigpKSB7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5ncmFtbWFycy5pbmRleE9mKGVkaXRvci5nZXRHcmFtbWFyKCkubmFtZSkgPT09IC0xKSB7XG5cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIG9uRGlkQ2hhbmdlQ3Vyc29yUG9zaXRpb24oZWRpdG9yLCBlKSB7XG5cbiAgICBpZiAodGhpcy5wYWNrYWdlQ29uZmlnLm9wdGlvbnMuaW5saW5lRm5Db21wbGV0aW9uKSB7XG5cbiAgICAgIGlmICghdGhpcy50eXBlKSB7XG5cbiAgICAgICAgVHlwZSA9IHJlcXVpcmUoJy4vYXRvbS10ZXJuanMtdHlwZScpO1xuICAgICAgICB0aGlzLnR5cGUgPSBuZXcgVHlwZSh0aGlzKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy50eXBlLnF1ZXJ5VHlwZShlZGl0b3IsIGUuY3Vyc29yKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5yZW5hbWUpIHtcblxuICAgICAgdGhpcy5yZW5hbWUuaGlkZSgpO1xuICAgIH1cbiAgfVxuXG4gIHJlZ2lzdGVyRXZlbnRzKCkge1xuXG4gICAgdGhpcy5kaXNwb3NhYmxlcy5wdXNoKGF0b20ud29ya3NwYWNlLm9ic2VydmVUZXh0RWRpdG9ycygoZWRpdG9yKSA9PiB7XG5cbiAgICAgIGlmICghdGhpcy5pc1ZhbGlkRWRpdG9yKGVkaXRvcikpIHtcblxuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIC8vIFJlZ2lzdGVyIHZhbGlkIGVkaXRvclxuICAgICAgdGhpcy5lZGl0b3JzLnB1c2goe1xuXG4gICAgICAgIGlkOiBlZGl0b3IuaWQsXG4gICAgICAgIGRpZmZzOiBbXVxuICAgICAgfSk7XG5cbiAgICAgIGlmICghdGhpcy5pbml0Q2FsbGVkKSB7XG5cbiAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgICB9XG5cbiAgICAgIGxldCBlZGl0b3JWaWV3ID0gYXRvbS52aWV3cy5nZXRWaWV3KGVkaXRvcik7XG5cbiAgICAgIHRoaXMuZGlzcG9zYWJsZXMucHVzaChlZGl0b3JWaWV3LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcblxuICAgICAgICBpZiAoIWVbdGhpcy5oZWxwZXIuYWNjZXNzS2V5XSkge1xuXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuY2xpZW50KSB7XG5cbiAgICAgICAgICB0aGlzLmNsaWVudC5kZWZpbml0aW9uKCk7XG4gICAgICAgIH1cbiAgICAgIH0pKTtcblxuICAgICAgbGV0IHNjcm9sbFZpZXc7XG5cbiAgICAgIGlmICghZWRpdG9yVmlldy5zaGFkb3dSb290KSB7XG5cbiAgICAgICAgc2Nyb2xsVmlldyA9IGVkaXRvclZpZXcucXVlcnlTZWxlY3RvcignLnNjcm9sbC12aWV3Jyk7XG5cbiAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgc2Nyb2xsVmlldyA9IGVkaXRvclZpZXcuc2hhZG93Um9vdC5xdWVyeVNlbGVjdG9yKCcuc2Nyb2xsLXZpZXcnKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5kaXNwb3NhYmxlcy5wdXNoKHNjcm9sbFZpZXcuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgKGUpID0+IHtcblxuICAgICAgICBpZiAoIWVbdGhpcy5oZWxwZXIuYWNjZXNzS2V5XSkge1xuXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGUudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnbGluZScpKSB7XG5cbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBlLnRhcmdldC5jbGFzc0xpc3QuYWRkKCdhdG9tLXRlcm5qcy1ob3ZlcicpO1xuICAgICAgfSkpO1xuXG4gICAgICB0aGlzLmRpc3Bvc2FibGVzLnB1c2goc2Nyb2xsVmlldy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW91dCcsIChlKSA9PiB7XG5cbiAgICAgICAgZS50YXJnZXQuY2xhc3NMaXN0LnJlbW92ZSgnYXRvbS10ZXJuanMtaG92ZXInKTtcbiAgICAgIH0pKTtcblxuICAgICAgdGhpcy5kaXNwb3NhYmxlcy5wdXNoKGVkaXRvci5vbkRpZENoYW5nZUN1cnNvclBvc2l0aW9uKChlKSA9PiB7XG5cbiAgICAgICAgaWYgKHRoaXMudHlwZSkge1xuXG4gICAgICAgICAgdGhpcy50eXBlLmRlc3Ryb3lPdmVybGF5KCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5kb2N1bWVudGF0aW9uKSB7XG5cbiAgICAgICAgICB0aGlzLmRvY3VtZW50YXRpb24uZGVzdHJveU92ZXJsYXkoKTtcbiAgICAgICAgfVxuICAgICAgfSkpO1xuXG4gICAgICB0aGlzLmRpc3Bvc2FibGVzLnB1c2goZWRpdG9yLm9uRGlkQ2hhbmdlQ3Vyc29yUG9zaXRpb24oXy5kZWJvdW5jZSh0aGlzLm9uRGlkQ2hhbmdlQ3Vyc29yUG9zaXRpb24uYmluZCh0aGlzLCBlZGl0b3IpLCAzMDApKSk7XG5cbiAgICAgIHRoaXMuZGlzcG9zYWJsZXMucHVzaChlZGl0b3IuZ2V0QnVmZmVyKCkub25EaWRTYXZlKChlKSA9PiB7XG5cbiAgICAgICAgaWYgKHRoaXMuY2xpZW50KSB7XG5cbiAgICAgICAgICB0aGlzLmNsaWVudC51cGRhdGUoZWRpdG9yKTtcbiAgICAgICAgfVxuICAgICAgfSkpO1xuXG4gICAgICB0aGlzLmRpc3Bvc2FibGVzLnB1c2goZWRpdG9yLmdldEJ1ZmZlcigpLm9uRGlkQ2hhbmdlKChlKSA9PiB7XG5cbiAgICAgICAgdGhpcy5nZXRFZGl0b3IoZWRpdG9yKS5kaWZmcy5wdXNoKGUpO1xuICAgICAgfSkpO1xuICAgIH0pKTtcblxuICAgIHRoaXMuZGlzcG9zYWJsZXMucHVzaChhdG9tLndvcmtzcGFjZS5vbkRpZENoYW5nZUFjdGl2ZVBhbmVJdGVtKChpdGVtKSA9PiB7XG5cbiAgICAgIGlmICh0aGlzLmNvbmZpZykge1xuXG4gICAgICAgIHRoaXMuY29uZmlnLmNsZWFyKCk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLnR5cGUpIHtcblxuICAgICAgICB0aGlzLnR5cGUuZGVzdHJveU92ZXJsYXkoKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMucmVuYW1lKSB7XG5cbiAgICAgICAgdGhpcy5yZW5hbWUuaGlkZSgpO1xuICAgICAgfVxuXG4gICAgICBpZiAoIXRoaXMuaXNWYWxpZEVkaXRvcihpdGVtKSkge1xuXG4gICAgICAgIGlmICh0aGlzLnJlZmVyZW5jZSkge1xuXG4gICAgICAgICAgdGhpcy5yZWZlcmVuY2UuaGlkZSgpO1xuICAgICAgICB9XG5cbiAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgdGhpcy5zZXRBY3RpdmVTZXJ2ZXJBbmRDbGllbnQoaXRlbS5nZXRVUkkoKSk7XG4gICAgICB9XG4gICAgfSkpO1xuICB9XG5cbiAgcmVnaXN0ZXJIZWxwZXJDb21tYW5kcygpIHtcblxuICAgIHRoaXMuZGlzcG9zYWJsZXMucHVzaChhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS13b3Jrc3BhY2UnLCAndGVybjpvcGVuQ29uZmlnJywgKGUpID0+IHtcblxuICAgICAgaWYgKCF0aGlzLmNvbmZpZykge1xuXG4gICAgICAgIHRoaXMuY29uZmlnID0gbmV3IENvbmZpZyh0aGlzKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5jb25maWcuc2hvdygpO1xuICAgIH0pKTtcbiAgfVxuXG4gIHJlZ2lzdGVyQ29tbWFuZHMoKSB7XG5cbiAgICB0aGlzLmRpc3Bvc2FibGVzLnB1c2goYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20tdGV4dC1lZGl0b3InLCAnY29yZTpjYW5jZWwnLCAoZSkgPT4ge1xuXG4gICAgICBpZiAodGhpcy5jb25maWcpIHtcblxuICAgICAgICB0aGlzLmNvbmZpZy5oaWRlKCk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLnR5cGUpIHtcblxuICAgICAgICB0aGlzLnR5cGUuZGVzdHJveU92ZXJsYXkoKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMucmVuYW1lKSB7XG5cbiAgICAgICAgdGhpcy5yZW5hbWUuaGlkZSgpO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5yZWZlcmVuY2UpIHtcblxuICAgICAgICB0aGlzLnJlZmVyZW5jZS5oaWRlKCk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLmRvY3VtZW50YXRpb24pIHtcblxuICAgICAgICB0aGlzLmRvY3VtZW50YXRpb24uZGVzdHJveU92ZXJsYXkoKTtcbiAgICAgIH1cbiAgICB9KSk7XG5cbiAgICB0aGlzLmRpc3Bvc2FibGVzLnB1c2goYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20tdGV4dC1lZGl0b3InLCAndGVybjpsaXN0RmlsZXMnLCAoZSkgPT4ge1xuXG4gICAgICBpZiAodGhpcy5jbGllbnQpIHtcblxuICAgICAgICB0aGlzLmNsaWVudC5maWxlcygpLnRoZW4oKGRhdGEpID0+IHtcblxuICAgICAgICAgIGNvbnNvbGUuZGlyKGRhdGEpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KSk7XG5cbiAgICB0aGlzLmRpc3Bvc2FibGVzLnB1c2goYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20tdGV4dC1lZGl0b3InLCAndGVybjpmbHVzaCcsIChlKSA9PiB7XG5cbiAgICAgIGlmICh0aGlzLnNlcnZlcikge1xuXG4gICAgICAgIHRoaXMuc2VydmVyLmZsdXNoKCk7XG4gICAgICB9XG4gICAgfSkpO1xuXG4gICAgdGhpcy5kaXNwb3NhYmxlcy5wdXNoKGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXRleHQtZWRpdG9yJywgJ3Rlcm46ZG9jdW1lbnRhdGlvbicsIChlKSA9PiB7XG5cbiAgICAgIGlmICghdGhpcy5kb2N1bWVudGF0aW9uKSB7XG5cbiAgICAgICAgRG9jdW1lbnRhdGlvbiA9IHJlcXVpcmUoJy4vYXRvbS10ZXJuanMtZG9jdW1lbnRhdGlvbicpO1xuICAgICAgICB0aGlzLmRvY3VtZW50YXRpb24gPSBuZXcgRG9jdW1lbnRhdGlvbih0aGlzKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5kb2N1bWVudGF0aW9uLnJlcXVlc3QoKTtcbiAgICB9KSk7XG5cbiAgICB0aGlzLmRpc3Bvc2FibGVzLnB1c2goYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20tdGV4dC1lZGl0b3InLCAndGVybjpyZWZlcmVuY2VzJywgKGUpID0+IHtcblxuICAgICAgaWYgKCF0aGlzLnJlZmVyZW5jZSkge1xuXG4gICAgICAgIFJlZmVyZW5jZSA9IHJlcXVpcmUoJy4vYXRvbS10ZXJuanMtcmVmZXJlbmNlJyk7XG4gICAgICAgIHRoaXMucmVmZXJlbmNlID0gbmV3IFJlZmVyZW5jZSh0aGlzKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5yZWZlcmVuY2UuZmluZFJlZmVyZW5jZSgpO1xuICAgIH0pKTtcblxuICAgIHRoaXMuZGlzcG9zYWJsZXMucHVzaChhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS10ZXh0LWVkaXRvcicsICd0ZXJuOnJlbmFtZScsIChlKSA9PiB7XG5cbiAgICAgICAgaWYgKCF0aGlzLnJlbmFtZSkge1xuXG4gICAgICAgICAgUmVuYW1lID0gcmVxdWlyZSgnLi9hdG9tLXRlcm5qcy1yZW5hbWUnKTtcbiAgICAgICAgICB0aGlzLnJlbmFtZSA9IG5ldyBSZW5hbWUodGhpcyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnJlbmFtZS5zaG93KCk7XG4gICAgICB9XG4gICAgKSk7XG5cbiAgICB0aGlzLmRpc3Bvc2FibGVzLnB1c2goYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20tdGV4dC1lZGl0b3InLCAndGVybjptYXJrZXJDaGVja3BvaW50QmFjaycsIChlKSA9PiB7XG5cbiAgICAgIGlmICh0aGlzLmhlbHBlcikge1xuXG4gICAgICAgIHRoaXMuaGVscGVyLm1hcmtlckNoZWNrcG9pbnRCYWNrKCk7XG4gICAgICB9XG4gICAgfSkpO1xuXG4gICAgdGhpcy5kaXNwb3NhYmxlcy5wdXNoKGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXRleHQtZWRpdG9yJywgJ3Rlcm46c3RhcnRDb21wbGV0aW9uJywgKGUpID0+IHtcblxuICAgICAgaWYgKHRoaXMucHJvdmlkZXIpIHtcblxuICAgICAgICB0aGlzLnByb3ZpZGVyLmZvcmNlQ29tcGxldGlvbigpO1xuICAgICAgfVxuICAgIH0pKTtcblxuICAgIHRoaXMuZGlzcG9zYWJsZXMucHVzaChhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS10ZXh0LWVkaXRvcicsICd0ZXJuOmRlZmluaXRpb24nLCAoZSkgPT4ge1xuXG4gICAgICBpZiAodGhpcy5jbGllbnQpIHtcblxuICAgICAgICB0aGlzLmNsaWVudC5kZWZpbml0aW9uKCk7XG4gICAgICB9XG4gICAgfSkpO1xuXG4gICAgdGhpcy5kaXNwb3NhYmxlcy5wdXNoKGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXdvcmtzcGFjZScsICd0ZXJuOnJlc3RhcnQnLCAoZSkgPT4ge1xuXG4gICAgICB0aGlzLnJlc3RhcnRTZXJ2ZXIoKTtcbiAgICB9KSk7XG4gIH1cblxuICByZXN0YXJ0U2VydmVyKCkge1xuXG4gICAgaWYgKCF0aGlzLnNlcnZlcikge1xuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGV0IGRpciA9IHRoaXMuc2VydmVyLnByb2plY3REaXI7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuc2VydmVycy5sZW5ndGg7IGkrKykge1xuXG4gICAgICBpZiAoZGlyID09PSB0aGlzLnNlcnZlcnNbaV0ucHJvamVjdERpcikge1xuXG4gICAgICAgIHNlcnZlcklkeCA9IGk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLnNlcnZlcikge1xuXG4gICAgICB0aGlzLnNlcnZlci5kZXN0cm95KCk7XG4gICAgfVxuXG4gICAgdGhpcy5zZXJ2ZXIgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5zZXJ2ZXJzLnNwbGljZShzZXJ2ZXJJZHgsIDEpO1xuICAgIHRoaXMuc3RhcnRTZXJ2ZXIoZGlyKTtcbiAgfVxufVxuIl19
//# sourceURL=/home/cin_chalic/.atom/packages/atom-ternjs/lib/atom-ternjs-manager.js
