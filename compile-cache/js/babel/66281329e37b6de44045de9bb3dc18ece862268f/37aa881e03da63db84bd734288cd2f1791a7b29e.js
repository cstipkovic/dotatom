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

        if (_this4.client) {

          _this4.documentation.request();
        }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvYXRvbS10ZXJuanMvbGliL2F0b20tdGVybmpzLW1hbmFnZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsV0FBVyxDQUFDOzs7Ozs7Ozs7O0FBRVosSUFBSSxNQUFNLFlBQUEsQ0FBQztBQUNYLElBQUksTUFBTSxZQUFBLENBQUM7QUFDWCxJQUFJLGFBQWEsWUFBQSxDQUFDO0FBQ2xCLElBQUksTUFBTSxZQUFBLENBQUM7QUFDWCxJQUFJLGFBQWEsWUFBQSxDQUFDO0FBQ2xCLElBQUksTUFBTSxZQUFBLENBQUM7QUFDWCxJQUFJLElBQUksWUFBQSxDQUFDO0FBQ1QsSUFBSSxTQUFTLFlBQUEsQ0FBQztBQUNkLElBQUksTUFBTSxZQUFBLENBQUM7QUFDWCxJQUFJLENBQUMsR0FBRyxPQUFPLENBQUMsaUJBQWlCLENBQUMsQ0FBQzs7SUFFZCxPQUFPO0FBRWYsV0FGUSxPQUFPLENBRWQsUUFBUSxFQUFFOzBCQUZILE9BQU87O0FBSXhCLFFBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDOztBQUV6QixRQUFJLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQzs7QUFFdEIsUUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDOztBQUUvQixRQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztBQUNsQixRQUFJLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQztBQUN4QixRQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztBQUNsQixRQUFJLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQzs7QUFFeEIsUUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7O0FBRWxCLFFBQUksQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFDO0FBQ3hCLFFBQUksQ0FBQyxJQUFJLEdBQUcsU0FBUyxDQUFDO0FBQ3RCLFFBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO0FBQzNCLFFBQUksQ0FBQyxh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LENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTs7QUFFNUMsWUFBSSxHQUFHLEtBQUssSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLEVBQUU7O0FBRXRDLG1CQUFTLEdBQUcsQ0FBQyxDQUFDO0FBQ2QsZ0JBQU07U0FDUDtPQUNGOztBQUVELFVBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTs7QUFFZixZQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDO09BQ3ZCOztBQUVELFVBQUksQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFDO0FBQ3hCLFVBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNsQyxVQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQ3ZCOzs7U0F2bUJrQixPQUFPOzs7cUJBQVAsT0FBTyIsImZpbGUiOiIvaG9tZS9jaW5fY2hhbGljLy5hdG9tL3BhY2thZ2VzL2F0b20tdGVybmpzL2xpYi9hdG9tLXRlcm5qcy1tYW5hZ2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2UgYmFiZWxcIjtcblxubGV0IFNlcnZlcjtcbmxldCBDbGllbnQ7XG5sZXQgRG9jdW1lbnRhdGlvbjtcbmxldCBIZWxwZXI7XG5sZXQgUGFja2FnZUNvbmZpZztcbmxldCBDb25maWc7XG5sZXQgVHlwZTtcbmxldCBSZWZlcmVuY2U7XG5sZXQgUmVuYW1lO1xubGV0IF8gPSByZXF1aXJlKCd1bmRlcnNjb3JlLXBsdXMnKTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWFuYWdlciB7XG5cbiAgY29uc3RydWN0b3IocHJvdmlkZXIpIHtcblxuICAgIHRoaXMucHJvdmlkZXIgPSBwcm92aWRlcjtcblxuICAgIHRoaXMuZGlzcG9zYWJsZXMgPSBbXTtcblxuICAgIHRoaXMuZ3JhbW1hcnMgPSBbJ0phdmFTY3JpcHQnXTtcblxuICAgIHRoaXMuY2xpZW50cyA9IFtdO1xuICAgIHRoaXMuY2xpZW50ID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuc2VydmVycyA9IFtdO1xuICAgIHRoaXMuc2VydmVyID0gdW5kZWZpbmVkO1xuXG4gICAgdGhpcy5lZGl0b3JzID0gW107XG5cbiAgICB0aGlzLnJlbmFtZSA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLnR5cGUgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5yZWZlcmVuY2UgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5kb2N1bWVudGF0aW9uID0gdW5kZWZpbmVkO1xuXG4gICAgdGhpcy5pbml0aWFsaXNlZCA9IGZhbHNlO1xuXG4gICAgd2luZG93LnNldFRpbWVvdXQodGhpcy5pbml0LmJpbmQodGhpcyksIDApO1xuICB9XG5cbiAgaW5pdCgpIHtcblxuICAgIEhlbHBlciA9IHJlcXVpcmUoJy4vYXRvbS10ZXJuanMtaGVscGVyJyk7XG4gICAgUGFja2FnZUNvbmZpZyA9IHJlcXVpcmUoJy4vYXRvbS10ZXJuanMtcGFja2FnZS1jb25maWcnKTtcbiAgICBDb25maWcgPSByZXF1aXJlKCcuL2F0b20tdGVybmpzLWNvbmZpZycpO1xuXG4gICAgdGhpcy5oZWxwZXIgPSBuZXcgSGVscGVyKHRoaXMpO1xuICAgIHRoaXMucGFja2FnZUNvbmZpZyA9IG5ldyBQYWNrYWdlQ29uZmlnKHRoaXMpO1xuICAgIHRoaXMuY29uZmlnID0gbmV3IENvbmZpZyh0aGlzKTtcbiAgICB0aGlzLnByb3ZpZGVyLmluaXQodGhpcyk7XG4gICAgdGhpcy5pbml0U2VydmVycygpO1xuXG4gICAgdGhpcy5yZWdpc3RlckhlbHBlckNvbW1hbmRzKCk7XG5cbiAgICB0aGlzLmRpc3Bvc2FibGVzLnB1c2goYXRvbS5wcm9qZWN0Lm9uRGlkQ2hhbmdlUGF0aHMoKHBhdGhzKSA9PiB7XG5cbiAgICAgIHRoaXMuZGVzdHJveVNlcnZlcihwYXRocyk7XG4gICAgICB0aGlzLmNoZWNrUGF0aHMocGF0aHMpO1xuICAgICAgdGhpcy5zZXRBY3RpdmVTZXJ2ZXJBbmRDbGllbnQoKTtcbiAgICB9KSk7XG4gIH1cblxuICBhY3RpdmF0ZSgpIHtcblxuICAgIHRoaXMuaW5pdGlhbGlzZWQgPSB0cnVlO1xuICAgIHRoaXMucmVnaXN0ZXJFdmVudHMoKTtcbiAgICB0aGlzLnJlZ2lzdGVyQ29tbWFuZHMoKTtcbiAgfVxuXG4gIGRlc3Ryb3lPYmplY3Qob2JqZWN0KSB7XG5cbiAgICBpZiAob2JqZWN0KSB7XG5cbiAgICAgIG9iamVjdC5kZXN0cm95KCk7XG4gICAgfVxuICAgIG9iamVjdCA9IHVuZGVmaW5lZDtcbiAgfVxuXG4gIGRlc3Ryb3koKSB7XG5cbiAgICBmb3IgKGxldCBzZXJ2ZXIgb2YgdGhpcy5zZXJ2ZXJzKSB7XG5cbiAgICAgIHNlcnZlci5kZXN0cm95KCk7XG4gICAgICBzZXJ2ZXIgPSB1bmRlZmluZWQ7XG4gICAgfVxuICAgIHRoaXMuc2VydmVycyA9IFtdO1xuXG4gICAgZm9yIChsZXQgY2xpZW50IG9mIHRoaXMuY2xpZW50cykge1xuXG4gICAgICBjbGllbnQgPSB1bmRlZmluZWQ7XG4gICAgfVxuICAgIHRoaXMuY2xpZW50cyA9IFtdO1xuXG4gICAgdGhpcy5zZXJ2ZXIgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5jbGllbnQgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy51bnJlZ2lzdGVyRXZlbnRzQW5kQ29tbWFuZHMoKTtcbiAgICB0aGlzLnByb3ZpZGVyID0gdW5kZWZpbmVkO1xuXG4gICAgdGhpcy5kZXN0cm95T2JqZWN0KHRoaXMuY29uZmlnKTtcbiAgICB0aGlzLmRlc3Ryb3lPYmplY3QodGhpcy5wYWNrYWdlQ29uZmlnKTtcbiAgICB0aGlzLmRlc3Ryb3lPYmplY3QodGhpcy5yZWZlcmVuY2UpO1xuICAgIHRoaXMuZGVzdHJveU9iamVjdCh0aGlzLnJlbmFtZSk7XG4gICAgdGhpcy5kZXN0cm95T2JqZWN0KHRoaXMudHlwZSk7XG4gICAgdGhpcy5kZXN0cm95T2JqZWN0KHRoaXMuaGVscGVyKTtcblxuICAgIHRoaXMuaW5pdGlhbGlzZWQgPSBmYWxzZTtcbiAgfVxuXG4gIHVucmVnaXN0ZXJFdmVudHNBbmRDb21tYW5kcygpIHtcblxuICAgIGZvciAobGV0IGRpc3Bvc2FibGUgb2YgdGhpcy5kaXNwb3NhYmxlcykge1xuXG4gICAgICBpZiAoIWRpc3Bvc2FibGUpIHtcblxuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgZGlzcG9zYWJsZS5kaXNwb3NlKCk7XG4gICAgfVxuXG4gICAgdGhpcy5kaXNwb3NhYmxlcyA9IFtdO1xuICB9XG5cbiAgaW5pdFNlcnZlcnMoKSB7XG5cbiAgICBsZXQgZGlycyA9IGF0b20ucHJvamVjdC5nZXREaXJlY3RvcmllcygpO1xuXG4gICAgaWYgKGRpcnMubGVuZ3RoID09PSAwKSB7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBmb3IgKGxldCBkaXIgb2YgZGlycykge1xuXG4gICAgICBkaXIgPSBhdG9tLnByb2plY3QucmVsYXRpdml6ZVBhdGgoZGlyLnBhdGgpWzBdO1xuXG4gICAgICBpZiAodGhpcy5oZWxwZXIuaXNEaXJlY3RvcnkoZGlyKSkge1xuXG4gICAgICAgIHRoaXMuc3RhcnRTZXJ2ZXIoZGlyKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBzdGFydFNlcnZlcihkaXIpIHtcblxuICAgIGlmICghU2VydmVyKSB7XG5cbiAgICAgIFNlcnZlciA9IHJlcXVpcmUoJy4vYXRvbS10ZXJuanMtc2VydmVyJyk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuZ2V0U2VydmVyRm9yUHJvamVjdChkaXIpKSB7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgY2xpZW50ID0gdGhpcy5nZXRDbGllbnRGb3JQcm9qZWN0KGRpcik7XG5cbiAgICBpZiAoIWNsaWVudCkge1xuXG4gICAgICBpZiAoIUNsaWVudCkge1xuXG4gICAgICAgIENsaWVudCA9IHJlcXVpcmUoJy4vYXRvbS10ZXJuanMtY2xpZW50Jyk7XG4gICAgICB9XG5cbiAgICAgIGxldCBjbGllbnRJZHggPSB0aGlzLmNsaWVudHMucHVzaChuZXcgQ2xpZW50KHRoaXMsIGRpcikpIC0gMTtcbiAgICAgIGNsaWVudCA9IHRoaXMuY2xpZW50c1tjbGllbnRJZHhdO1xuICAgIH1cblxuICAgIHRoaXMuc2VydmVycy5wdXNoKG5ldyBTZXJ2ZXIoZGlyLCBjbGllbnQsIHRoaXMpKTtcblxuICAgIGlmICh0aGlzLnNlcnZlcnMubGVuZ3RoID09PSB0aGlzLmNsaWVudHMubGVuZ3RoKSB7XG5cbiAgICAgIGlmICghdGhpcy5pbml0aWFsaXNlZCkge1xuXG4gICAgICAgIHRoaXMuYWN0aXZhdGUoKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5zZXRBY3RpdmVTZXJ2ZXJBbmRDbGllbnQoZGlyKTtcbiAgICB9XG4gIH1cblxuICBzZXRBY3RpdmVTZXJ2ZXJBbmRDbGllbnQoVVJJKSB7XG5cbiAgICBpZiAoIVVSSSkge1xuXG4gICAgICBsZXQgYWN0aXZlUGFuZSA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmVJdGVtKCk7XG5cbiAgICAgIGlmIChhY3RpdmVQYW5lICYmIGFjdGl2ZVBhbmUuZ2V0VVJJKSB7XG5cbiAgICAgICAgVVJJID0gYWN0aXZlUGFuZS5nZXRVUkkoKTtcblxuICAgICAgfSBlbHNlIHtcblxuICAgICAgICB0aGlzLnNlcnZlciA9IHVuZGVmaW5lZDtcbiAgICAgICAgdGhpcy5jbGllbnQgPSB1bmRlZmluZWQ7XG5cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cblxuICAgIGxldCBkaXIgPSBhdG9tLnByb2plY3QucmVsYXRpdml6ZVBhdGgoVVJJKVswXTtcbiAgICBsZXQgc2VydmVyID0gdGhpcy5nZXRTZXJ2ZXJGb3JQcm9qZWN0KGRpcik7XG4gICAgbGV0IGNsaWVudCA9IHRoaXMuZ2V0Q2xpZW50Rm9yUHJvamVjdChkaXIpO1xuXG4gICAgaWYgKHNlcnZlciAmJiBjbGllbnQpIHtcblxuICAgICAgdGhpcy5zZXJ2ZXIgPSBzZXJ2ZXI7XG4gICAgICB0aGlzLmNvbmZpZy5nYXRoZXJEYXRhKCk7XG4gICAgICB0aGlzLmNsaWVudCA9IGNsaWVudDtcblxuICAgIH0gZWxzZSB7XG5cbiAgICAgIHRoaXMuc2VydmVyID0gdW5kZWZpbmVkO1xuICAgICAgdGhpcy5jb25maWcuY2xlYXIoKTtcbiAgICAgIHRoaXMuY2xpZW50ID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgfVxuXG4gIGNoZWNrUGF0aHMocGF0aHMpIHtcblxuICAgIGZvciAobGV0IHBhdGggb2YgcGF0aHMpIHtcblxuICAgICAgbGV0IGRpciA9IGF0b20ucHJvamVjdC5yZWxhdGl2aXplUGF0aChwYXRoKVswXTtcblxuICAgICAgaWYgKHRoaXMuaGVscGVyLmlzRGlyZWN0b3J5KGRpcikpIHtcblxuICAgICAgICB0aGlzLnN0YXJ0U2VydmVyKGRpcik7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZGVzdHJveVNlcnZlcihwYXRocykge1xuXG4gICAgaWYgKHRoaXMuc2VydmVycy5sZW5ndGggPT09IDApIHtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCBzZXJ2ZXJJZHg7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuc2VydmVycy5sZW5ndGg7IGkrKykge1xuXG4gICAgICBpZiAocGF0aHMuaW5kZXhPZih0aGlzLnNlcnZlcnNbaV0ucHJvamVjdERpcikgPT09IC0xKSB7XG5cbiAgICAgICAgc2VydmVySWR4ID0gaTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHNlcnZlcklkeCA9PT0gdW5kZWZpbmVkKSB7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgc2VydmVyID0gdGhpcy5zZXJ2ZXJzW3NlcnZlcklkeF07XG4gICAgbGV0IGNsaWVudCA9IHRoaXMuZ2V0Q2xpZW50Rm9yUHJvamVjdChzZXJ2ZXIucHJvamVjdERpcik7XG4gICAgY2xpZW50ID0gdW5kZWZpbmVkO1xuXG4gICAgc2VydmVyLmRlc3Ryb3koKTtcbiAgICBzZXJ2ZXIgPSB1bmRlZmluZWQ7XG5cbiAgICB0aGlzLnNlcnZlcnMuc3BsaWNlKHNlcnZlcklkeCwgMSk7XG4gIH1cblxuICBnZXRTZXJ2ZXJGb3JQcm9qZWN0KHByb2plY3REaXIpIHtcblxuICAgIGZvciAobGV0IHNlcnZlciBvZiB0aGlzLnNlcnZlcnMpIHtcblxuICAgICAgaWYgKHNlcnZlci5wcm9qZWN0RGlyID09PSBwcm9qZWN0RGlyKSB7XG5cbiAgICAgICAgcmV0dXJuIHNlcnZlcjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBnZXRDbGllbnRGb3JQcm9qZWN0KHByb2plY3REaXIpIHtcblxuICAgIGZvciAobGV0IGNsaWVudCBvZiB0aGlzLmNsaWVudHMpIHtcblxuICAgICAgaWYgKGNsaWVudC5wcm9qZWN0RGlyID09PSBwcm9qZWN0RGlyKSB7XG5cbiAgICAgICAgcmV0dXJuIGNsaWVudDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBnZXRFZGl0b3IoZWRpdG9yKSB7XG5cbiAgICBmb3IgKGxldCBfZWRpdG9yIG9mIHRoaXMuZWRpdG9ycykge1xuXG4gICAgICBpZiAoX2VkaXRvci5pZCA9PT0gZWRpdG9yLmlkKSB7XG5cbiAgICAgICAgcmV0dXJuIF9lZGl0b3I7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaXNWYWxpZEVkaXRvcihlZGl0b3IpIHtcblxuICAgIGlmICghZWRpdG9yIHx8ICFlZGl0b3IuZ2V0R3JhbW1hciB8fCBlZGl0b3IubWluaSkge1xuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCFlZGl0b3IuZ2V0R3JhbW1hcigpKSB7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5ncmFtbWFycy5pbmRleE9mKGVkaXRvci5nZXRHcmFtbWFyKCkubmFtZSkgPT09IC0xKSB7XG5cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIG9uRGlkQ2hhbmdlQ3Vyc29yUG9zaXRpb24oZWRpdG9yLCBlKSB7XG5cbiAgICBpZiAodGhpcy5wYWNrYWdlQ29uZmlnLm9wdGlvbnMuaW5saW5lRm5Db21wbGV0aW9uKSB7XG5cbiAgICAgIGlmICghdGhpcy50eXBlKSB7XG5cbiAgICAgICAgVHlwZSA9IHJlcXVpcmUoJy4vYXRvbS10ZXJuanMtdHlwZScpO1xuICAgICAgICB0aGlzLnR5cGUgPSBuZXcgVHlwZSh0aGlzKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy50eXBlLnF1ZXJ5VHlwZShlZGl0b3IsIGUuY3Vyc29yKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5yZW5hbWUpIHtcblxuICAgICAgdGhpcy5yZW5hbWUuaGlkZSgpO1xuICAgIH1cbiAgfVxuXG4gIHJlZ2lzdGVyRXZlbnRzKCkge1xuXG4gICAgdGhpcy5kaXNwb3NhYmxlcy5wdXNoKGF0b20ud29ya3NwYWNlLm9ic2VydmVUZXh0RWRpdG9ycygoZWRpdG9yKSA9PiB7XG5cbiAgICAgIGlmICghdGhpcy5pc1ZhbGlkRWRpdG9yKGVkaXRvcikpIHtcblxuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIC8vIFJlZ2lzdGVyIHZhbGlkIGVkaXRvclxuICAgICAgdGhpcy5lZGl0b3JzLnB1c2goe1xuXG4gICAgICAgIGlkOiBlZGl0b3IuaWQsXG4gICAgICAgIGRpZmZzOiBbXVxuICAgICAgfSk7XG5cbiAgICAgIGlmICghdGhpcy5pbml0Q2FsbGVkKSB7XG5cbiAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgICB9XG5cbiAgICAgIGxldCBlZGl0b3JWaWV3ID0gYXRvbS52aWV3cy5nZXRWaWV3KGVkaXRvcik7XG5cbiAgICAgIGlmIChlZGl0b3JWaWV3KSB7XG5cbiAgICAgICAgdGhpcy5kaXNwb3NhYmxlcy5wdXNoKGVkaXRvclZpZXcuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuXG4gICAgICAgICAgaWYgKCFlW3RoaXMuaGVscGVyLmFjY2Vzc0tleV0pIHtcblxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICh0aGlzLmNsaWVudCkge1xuXG4gICAgICAgICAgICB0aGlzLmNsaWVudC5kZWZpbml0aW9uKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KSk7XG4gICAgICB9XG5cbiAgICAgIGxldCBzY3JvbGxWaWV3O1xuXG4gICAgICBpZiAoIWVkaXRvclZpZXcuc2hhZG93Um9vdCkge1xuXG4gICAgICAgIHNjcm9sbFZpZXcgPSBlZGl0b3JWaWV3LnF1ZXJ5U2VsZWN0b3IoJy5zY3JvbGwtdmlldycpO1xuXG4gICAgICB9IGVsc2Uge1xuXG4gICAgICAgIHNjcm9sbFZpZXcgPSBlZGl0b3JWaWV3LnNoYWRvd1Jvb3QucXVlcnlTZWxlY3RvcignLnNjcm9sbC12aWV3Jyk7XG4gICAgICB9XG5cbiAgICAgIGlmIChzY3JvbGxWaWV3KSB7XG5cbiAgICAgICAgdGhpcy5kaXNwb3NhYmxlcy5wdXNoKHNjcm9sbFZpZXcuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgKGUpID0+IHtcblxuICAgICAgICAgIGlmICghZVt0aGlzLmhlbHBlci5hY2Nlc3NLZXldKSB7XG5cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoZS50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdsaW5lJykpIHtcblxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGUudGFyZ2V0LmNsYXNzTGlzdC5hZGQoJ2F0b20tdGVybmpzLWhvdmVyJyk7XG4gICAgICAgIH0pKTtcblxuICAgICAgICB0aGlzLmRpc3Bvc2FibGVzLnB1c2goc2Nyb2xsVmlldy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW91dCcsIChlKSA9PiB7XG5cbiAgICAgICAgICBlLnRhcmdldC5jbGFzc0xpc3QucmVtb3ZlKCdhdG9tLXRlcm5qcy1ob3ZlcicpO1xuICAgICAgICB9KSk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuZGlzcG9zYWJsZXMucHVzaChlZGl0b3Iub25EaWRDaGFuZ2VDdXJzb3JQb3NpdGlvbigoZSkgPT4ge1xuXG4gICAgICAgIGlmICh0aGlzLnR5cGUpIHtcblxuICAgICAgICAgIHRoaXMudHlwZS5kZXN0cm95T3ZlcmxheSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuZG9jdW1lbnRhdGlvbikge1xuXG4gICAgICAgICAgdGhpcy5kb2N1bWVudGF0aW9uLmRlc3Ryb3lPdmVybGF5KCk7XG4gICAgICAgIH1cbiAgICAgIH0pKTtcblxuICAgICAgdGhpcy5kaXNwb3NhYmxlcy5wdXNoKGVkaXRvci5vbkRpZENoYW5nZUN1cnNvclBvc2l0aW9uKF8uZGVib3VuY2UodGhpcy5vbkRpZENoYW5nZUN1cnNvclBvc2l0aW9uLmJpbmQodGhpcywgZWRpdG9yKSwgMzAwKSkpO1xuXG4gICAgICB0aGlzLmRpc3Bvc2FibGVzLnB1c2goZWRpdG9yLmdldEJ1ZmZlcigpLm9uRGlkU2F2ZSgoZSkgPT4ge1xuXG4gICAgICAgIGlmICh0aGlzLmNsaWVudCkge1xuXG4gICAgICAgICAgdGhpcy5jbGllbnQudXBkYXRlKGVkaXRvcik7XG4gICAgICAgIH1cbiAgICAgIH0pKTtcblxuICAgICAgdGhpcy5kaXNwb3NhYmxlcy5wdXNoKGVkaXRvci5nZXRCdWZmZXIoKS5vbkRpZENoYW5nZSgoZSkgPT4ge1xuXG4gICAgICAgIHRoaXMuZ2V0RWRpdG9yKGVkaXRvcikuZGlmZnMucHVzaChlKTtcbiAgICAgIH0pKTtcbiAgICB9KSk7XG5cbiAgICB0aGlzLmRpc3Bvc2FibGVzLnB1c2goYXRvbS53b3Jrc3BhY2Uub25EaWRDaGFuZ2VBY3RpdmVQYW5lSXRlbSgoaXRlbSkgPT4ge1xuXG4gICAgICBpZiAodGhpcy5jb25maWcpIHtcblxuICAgICAgICB0aGlzLmNvbmZpZy5jbGVhcigpO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy50eXBlKSB7XG5cbiAgICAgICAgdGhpcy50eXBlLmRlc3Ryb3lPdmVybGF5KCk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLnJlbmFtZSkge1xuXG4gICAgICAgIHRoaXMucmVuYW1lLmhpZGUoKTtcbiAgICAgIH1cblxuICAgICAgaWYgKCF0aGlzLmlzVmFsaWRFZGl0b3IoaXRlbSkpIHtcblxuICAgICAgICBpZiAodGhpcy5yZWZlcmVuY2UpIHtcblxuICAgICAgICAgIHRoaXMucmVmZXJlbmNlLmhpZGUoKTtcbiAgICAgICAgfVxuXG4gICAgICB9IGVsc2Uge1xuXG4gICAgICAgIHRoaXMuc2V0QWN0aXZlU2VydmVyQW5kQ2xpZW50KGl0ZW0uZ2V0VVJJKCkpO1xuICAgICAgfVxuICAgIH0pKTtcbiAgfVxuXG4gIHJlZ2lzdGVySGVscGVyQ29tbWFuZHMoKSB7XG5cbiAgICB0aGlzLmRpc3Bvc2FibGVzLnB1c2goYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20td29ya3NwYWNlJywgJ3Rlcm46b3BlbkNvbmZpZycsIChlKSA9PiB7XG5cbiAgICAgIGlmICghdGhpcy5jb25maWcpIHtcblxuICAgICAgICB0aGlzLmNvbmZpZyA9IG5ldyBDb25maWcodGhpcyk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuY29uZmlnLnNob3coKTtcbiAgICB9KSk7XG4gIH1cblxuICByZWdpc3RlckNvbW1hbmRzKCkge1xuXG4gICAgdGhpcy5kaXNwb3NhYmxlcy5wdXNoKGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXRleHQtZWRpdG9yJywgJ2NvcmU6Y2FuY2VsJywgKGUpID0+IHtcblxuICAgICAgaWYgKHRoaXMuY29uZmlnKSB7XG5cbiAgICAgICAgdGhpcy5jb25maWcuaGlkZSgpO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy50eXBlKSB7XG5cbiAgICAgICAgdGhpcy50eXBlLmRlc3Ryb3lPdmVybGF5KCk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLnJlbmFtZSkge1xuXG4gICAgICAgIHRoaXMucmVuYW1lLmhpZGUoKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMucmVmZXJlbmNlKSB7XG5cbiAgICAgICAgdGhpcy5yZWZlcmVuY2UuaGlkZSgpO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5kb2N1bWVudGF0aW9uKSB7XG5cbiAgICAgICAgdGhpcy5kb2N1bWVudGF0aW9uLmRlc3Ryb3lPdmVybGF5KCk7XG4gICAgICB9XG4gICAgfSkpO1xuXG4gICAgdGhpcy5kaXNwb3NhYmxlcy5wdXNoKGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXRleHQtZWRpdG9yJywgJ3Rlcm46bGlzdEZpbGVzJywgKGUpID0+IHtcblxuICAgICAgaWYgKHRoaXMuY2xpZW50KSB7XG5cbiAgICAgICAgdGhpcy5jbGllbnQuZmlsZXMoKS50aGVuKChkYXRhKSA9PiB7XG5cbiAgICAgICAgICBjb25zb2xlLmRpcihkYXRhKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSkpO1xuXG4gICAgdGhpcy5kaXNwb3NhYmxlcy5wdXNoKGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXRleHQtZWRpdG9yJywgJ3Rlcm46Zmx1c2gnLCAoZSkgPT4ge1xuXG4gICAgICBpZiAodGhpcy5zZXJ2ZXIpIHtcblxuICAgICAgICB0aGlzLnNlcnZlci5mbHVzaCgpO1xuICAgICAgfVxuICAgIH0pKTtcblxuICAgIHRoaXMuZGlzcG9zYWJsZXMucHVzaChhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS10ZXh0LWVkaXRvcicsICd0ZXJuOmRvY3VtZW50YXRpb24nLCAoZSkgPT4ge1xuXG4gICAgICBpZiAoIXRoaXMuZG9jdW1lbnRhdGlvbikge1xuXG4gICAgICAgIERvY3VtZW50YXRpb24gPSByZXF1aXJlKCcuL2F0b20tdGVybmpzLWRvY3VtZW50YXRpb24nKTtcbiAgICAgICAgdGhpcy5kb2N1bWVudGF0aW9uID0gbmV3IERvY3VtZW50YXRpb24odGhpcyk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLmNsaWVudCkge1xuXG4gICAgICAgIHRoaXMuZG9jdW1lbnRhdGlvbi5yZXF1ZXN0KCk7XG4gICAgICB9XG4gICAgfSkpO1xuXG4gICAgdGhpcy5kaXNwb3NhYmxlcy5wdXNoKGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXRleHQtZWRpdG9yJywgJ3Rlcm46cmVmZXJlbmNlcycsIChlKSA9PiB7XG5cbiAgICAgIGlmICghdGhpcy5yZWZlcmVuY2UpIHtcblxuICAgICAgICBSZWZlcmVuY2UgPSByZXF1aXJlKCcuL2F0b20tdGVybmpzLXJlZmVyZW5jZScpO1xuICAgICAgICB0aGlzLnJlZmVyZW5jZSA9IG5ldyBSZWZlcmVuY2UodGhpcyk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMucmVmZXJlbmNlLmZpbmRSZWZlcmVuY2UoKTtcbiAgICB9KSk7XG5cbiAgICB0aGlzLmRpc3Bvc2FibGVzLnB1c2goYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20tdGV4dC1lZGl0b3InLCAndGVybjpyZW5hbWUnLCAoZSkgPT4ge1xuXG4gICAgICAgIGlmICghdGhpcy5yZW5hbWUpIHtcblxuICAgICAgICAgIFJlbmFtZSA9IHJlcXVpcmUoJy4vYXRvbS10ZXJuanMtcmVuYW1lJyk7XG4gICAgICAgICAgdGhpcy5yZW5hbWUgPSBuZXcgUmVuYW1lKHRoaXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5yZW5hbWUuc2hvdygpO1xuICAgICAgfVxuICAgICkpO1xuXG4gICAgdGhpcy5kaXNwb3NhYmxlcy5wdXNoKGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXRleHQtZWRpdG9yJywgJ3Rlcm46bWFya2VyQ2hlY2twb2ludEJhY2snLCAoZSkgPT4ge1xuXG4gICAgICBpZiAodGhpcy5oZWxwZXIpIHtcblxuICAgICAgICB0aGlzLmhlbHBlci5tYXJrZXJDaGVja3BvaW50QmFjaygpO1xuICAgICAgfVxuICAgIH0pKTtcblxuICAgIHRoaXMuZGlzcG9zYWJsZXMucHVzaChhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS10ZXh0LWVkaXRvcicsICd0ZXJuOnN0YXJ0Q29tcGxldGlvbicsIChlKSA9PiB7XG5cbiAgICAgIGlmICh0aGlzLnByb3ZpZGVyKSB7XG5cbiAgICAgICAgdGhpcy5wcm92aWRlci5mb3JjZUNvbXBsZXRpb24oKTtcbiAgICAgIH1cbiAgICB9KSk7XG5cbiAgICB0aGlzLmRpc3Bvc2FibGVzLnB1c2goYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20tdGV4dC1lZGl0b3InLCAndGVybjpkZWZpbml0aW9uJywgKGUpID0+IHtcblxuICAgICAgaWYgKHRoaXMuY2xpZW50KSB7XG5cbiAgICAgICAgdGhpcy5jbGllbnQuZGVmaW5pdGlvbigpO1xuICAgICAgfVxuICAgIH0pKTtcblxuICAgIHRoaXMuZGlzcG9zYWJsZXMucHVzaChhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS13b3Jrc3BhY2UnLCAndGVybjpyZXN0YXJ0JywgKGUpID0+IHtcblxuICAgICAgdGhpcy5yZXN0YXJ0U2VydmVyKCk7XG4gICAgfSkpO1xuICB9XG5cbiAgcmVzdGFydFNlcnZlcigpIHtcblxuICAgIGlmICghdGhpcy5zZXJ2ZXIpIHtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCBkaXIgPSB0aGlzLnNlcnZlci5wcm9qZWN0RGlyO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnNlcnZlcnMubGVuZ3RoOyBpKyspIHtcblxuICAgICAgaWYgKGRpciA9PT0gdGhpcy5zZXJ2ZXJzW2ldLnByb2plY3REaXIpIHtcblxuICAgICAgICBzZXJ2ZXJJZHggPSBpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcy5zZXJ2ZXIpIHtcblxuICAgICAgdGhpcy5zZXJ2ZXIuZGVzdHJveSgpO1xuICAgIH1cblxuICAgIHRoaXMuc2VydmVyID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuc2VydmVycy5zcGxpY2Uoc2VydmVySWR4LCAxKTtcbiAgICB0aGlzLnN0YXJ0U2VydmVyKGRpcik7XG4gIH1cbn1cbiJdfQ==
//# sourceURL=/home/cin_chalic/.atom/packages/atom-ternjs/lib/atom-ternjs-manager.js
