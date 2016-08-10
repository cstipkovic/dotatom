"use babel";

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var ConfigView = undefined;
var _ = require('underscore-plus');

var Config = (function () {
  function Config(manager) {
    _classCallCheck(this, Config);

    this.manager = manager;

    this.config = undefined;
    this.projectConfig = undefined;
    this.editors = [];
  }

  _createClass(Config, [{
    key: 'getContent',
    value: function getContent(filePath, projectRoot) {

      var error = false;
      var content = this.manager.helper.getFileContent(filePath, projectRoot);

      if (!content) {

        return;
      }

      try {

        content = JSON.parse(content);
      } catch (e) {

        atom.notifications.addInfo('Error parsing .tern-project. Please check if it is a valid JSON file.', {

          dismissable: true
        });
        return;
      }

      return content;
    }
  }, {
    key: 'prepareLibs',
    value: function prepareLibs(localConfig, configStub) {

      var libs = {};

      if (!localConfig.libs) {

        localConfig.libs = {};
      } else {

        var libsAsObject = {};
        for (var lib of localConfig.libs) {

          libsAsObject[lib] = true;
        }

        localConfig.libs = libsAsObject;
      }

      for (var lib of Object.keys(configStub.libs)) {

        if (!localConfig.libs[lib]) {

          libs[lib] = false;
        } else {

          libs[lib] = true;
        }
      }

      for (var lib of Object.keys(localConfig.libs)) {

        if (lib === 'ecma5' || lib === 'ecma6') {

          atom.notifications.addInfo('You are using a outdated .tern-project file. Please remove libs ecma5, ecma6 manually and restart the Server via Packages -> Atom Ternjs -> Restart server. Then configure the project via Packages -> Atom Ternjs -> Configure project.', {

            dismissable: true
          });
        }

        if (!libs[lib]) {

          libs[lib] = true;
        }
      }

      localConfig.libs = libs;

      return localConfig;
    }
  }, {
    key: 'prepareEcma',
    value: function prepareEcma(localConfig, configStub) {

      var ecmaVersions = {};

      for (var lib of Object.keys(configStub.ecmaVersions)) {

        ecmaVersions[lib] = configStub.ecmaVersions[lib];
      }

      localConfig.ecmaVersions = ecmaVersions;

      if (localConfig.ecmaVersion) {

        for (var lib of Object.keys(localConfig.ecmaVersions)) {

          if (lib === 'ecmaVersion' + localConfig.ecmaVersion) {

            localConfig.ecmaVersions[lib] = true;
          } else {

            localConfig.ecmaVersions[lib] = false;
          }
        }
      }

      return localConfig;
    }
  }, {
    key: 'registerEvents',
    value: function registerEvents() {
      var _this = this;

      var close = this.configView.getClose();
      var cancel = this.configView.getCancel();

      close.addEventListener('click', function (e) {

        _this.updateConfig();
        _this.hide();
        _this.manager.helper.focusEditor();
      });

      cancel.addEventListener('click', function (e) {

        _this.destroyEditors();
        _this.hide();
        _this.manager.helper.focusEditor();
      });
    }
  }, {
    key: 'mergeConfigObjects',
    value: function mergeConfigObjects(obj1, obj2) {

      return _.deepExtend({}, obj1, obj2);
    }
  }, {
    key: 'hide',
    value: function hide() {

      if (!this.configPanel) {

        return;
      }

      this.configPanel.hide();
    }
  }, {
    key: 'clear',
    value: function clear() {

      this.hide();
      this.destroyEditors();
      this.config = undefined;
      this.projectConfig = undefined;

      if (!this.configView) {

        return;
      }

      this.configView.removeContent();
    }
  }, {
    key: 'gatherData',
    value: function gatherData() {

      var configStub = this.getContent('../tern-config.json', false);

      if (!configStub) {

        return;
      }

      this.projectConfig = this.getContent('/.tern-project', true);

      this.config = {};
      this.config = this.mergeConfigObjects(this.projectConfig, this.config);

      if (this.projectConfig) {

        this.config = this.prepareEcma(this.config, configStub);
        this.config = this.prepareLibs(this.config, configStub);

        for (var plugin in this.config.plugins) {

          if (this.config.plugins[plugin]) {

            this.config.plugins[plugin].active = true;
          }
        }

        this.config = this.mergeConfigObjects(configStub, this.config);
      } else {

        this.config = configStub;
      }

      return true;
    }
  }, {
    key: 'removeEditor',
    value: function removeEditor(editor) {

      if (!editor) {

        return;
      }

      var idx = this.editors.indexOf(editor);

      if (idx === -1) {

        return;
      }

      this.editors.splice(idx, 1);
    }
  }, {
    key: 'destroyEditors',
    value: function destroyEditors() {

      for (var editor of this.editors) {

        var buffer = editor.getModel().getBuffer();
        buffer.destroy();
      }

      this.editors = [];
    }
  }, {
    key: 'updateConfig',
    value: function updateConfig() {

      this.config.loadEagerly = [];
      this.config.dontLoad = [];

      for (var editor of this.editors) {

        var buffer = editor.getModel().getBuffer();
        var text = buffer.getText().trim();

        if (text === '') {

          continue;
        }

        this.config[editor.__ternjs_section].push(text);
      }

      this.destroyEditors();

      var newConfig = this.buildNewConfig();
      var newConfigJSON = JSON.stringify(newConfig, null, 2);

      this.manager.helper.updateTernFile(newConfigJSON, true);
    }
  }, {
    key: 'buildNewConfig',
    value: function buildNewConfig() {

      var newConfig = {};

      for (var key of Object.keys(this.config.ecmaVersions)) {

        if (this.config.ecmaVersions[key]) {

          newConfig.ecmaVersion = Number(key[key.length - 1]);
          break;
        }
      }

      if (!_.isEmpty(this.config.libs)) {

        newConfig.libs = [];

        for (var key of Object.keys(this.config.libs)) {

          if (this.config.libs[key]) {

            newConfig.libs.push(key);
          }
        }
      }

      if (this.config.loadEagerly.length !== 0) {

        newConfig.loadEagerly = this.config.loadEagerly;
      }

      if (this.config.dontLoad.length !== 0) {

        newConfig.dontLoad = this.config.dontLoad;
      }

      if (this.projectConfig && !_.isEmpty(this.projectConfig.plugins)) {

        newConfig.plugins = this.projectConfig.plugins;
      }

      return newConfig;
    }
  }, {
    key: 'initConfigView',
    value: function initConfigView() {

      if (!ConfigView) {

        ConfigView = require('./atom-ternjs-config-view');
      }

      this.configView = new ConfigView();
      this.configView.initialize(this);

      this.configPanel = atom.workspace.addRightPanel({

        item: this.configView,
        priority: 0
      });
      this.configPanel.hide();

      this.registerEvents();
    }
  }, {
    key: 'show',
    value: function show() {

      if (!this.configView) {

        this.initConfigView();
      }

      this.clear();

      atom.views.getView(this.configPanel).classList.add('atom-ternjs-config-panel');

      if (!this.gatherData()) {

        atom.notifications.addInfo('There is no active project. Please re-open or focus at least one JavaScript file of the project to configure.', {

          dismissable: true
        });
        return;
      }

      this.configView.buildOptionsMarkup(this.manager);
      this.configPanel.show();
    }
  }, {
    key: 'destroy',
    value: function destroy() {

      if (this.configView) {

        this.configView.destroy();
      }
      this.configView = undefined;

      if (this.configPanel) {

        this.configPanel.destroy();
      }
      this.configPanel = undefined;
    }
  }]);

  return Config;
})();

exports['default'] = Config;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvYXRvbS10ZXJuanMvbGliL2F0b20tdGVybmpzLWNvbmZpZy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxXQUFXLENBQUM7Ozs7Ozs7Ozs7QUFFWixJQUFJLFVBQVUsWUFBQSxDQUFDO0FBQ2YsSUFBSSxDQUFDLEdBQUcsT0FBTyxDQUFDLGlCQUFpQixDQUFDLENBQUM7O0lBRWQsTUFBTTtBQUVkLFdBRlEsTUFBTSxDQUViLE9BQU8sRUFBRTswQkFGRixNQUFNOztBQUl2QixRQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQzs7QUFFdkIsUUFBSSxDQUFDLE1BQU0sR0FBRyxTQUFTLENBQUM7QUFDeEIsUUFBSSxDQUFDLGFBQWEsR0FBRyxTQUFTLENBQUM7QUFDL0IsUUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7R0FDbkI7O2VBVGtCLE1BQU07O1dBV2Ysb0JBQUMsUUFBUSxFQUFFLFdBQVcsRUFBRTs7QUFFaEMsVUFBSSxLQUFLLEdBQUcsS0FBSyxDQUFDO0FBQ2xCLFVBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxRQUFRLEVBQUUsV0FBVyxDQUFDLENBQUM7O0FBRXhFLFVBQUksQ0FBQyxPQUFPLEVBQUU7O0FBRVosZUFBTztPQUNSOztBQUVELFVBQUk7O0FBRUYsZUFBTyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7T0FFL0IsQ0FBQyxPQUFNLENBQUMsRUFBRTs7QUFFVCxZQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyx1RUFBdUUsRUFBRTs7QUFFbEcscUJBQVcsRUFBRSxJQUFJO1NBQ2xCLENBQUMsQ0FBQztBQUNILGVBQU87T0FDUjs7QUFFRCxhQUFPLE9BQU8sQ0FBQztLQUNoQjs7O1dBRVUscUJBQUMsV0FBVyxFQUFFLFVBQVUsRUFBRTs7QUFFbkMsVUFBSSxJQUFJLEdBQUcsRUFB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VSxDQUFDLE9BQU8sRUFBRSxDQUFDO09BQzNCO0FBQ0QsVUFBSSxDQUFDLFVBQVUsR0FBRyxTQUFTLENBQUM7O0FBRTVCLFVBQUksSUFBSSxDQUFDLFdBQVcsRUFBRTs7QUFFcEIsWUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztPQUM1QjtBQUNELFVBQUksQ0FBQyxXQUFXLEdBQUcsU0FBUyxDQUFDO0tBQzlCOzs7U0ExV2tCLE1BQU07OztxQkFBTixNQUFNIiwiZmlsZSI6Ii9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvYXRvbS10ZXJuanMvbGliL2F0b20tdGVybmpzLWNvbmZpZy5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIGJhYmVsXCI7XG5cbmxldCBDb25maWdWaWV3O1xubGV0IF8gPSByZXF1aXJlKCd1bmRlcnNjb3JlLXBsdXMnKTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29uZmlnIHtcblxuICBjb25zdHJ1Y3RvcihtYW5hZ2VyKSB7XG5cbiAgICB0aGlzLm1hbmFnZXIgPSBtYW5hZ2VyO1xuXG4gICAgdGhpcy5jb25maWcgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5wcm9qZWN0Q29uZmlnID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuZWRpdG9ycyA9IFtdO1xuICB9XG5cbiAgZ2V0Q29udGVudChmaWxlUGF0aCwgcHJvamVjdFJvb3QpIHtcblxuICAgIGxldCBlcnJvciA9IGZhbHNlO1xuICAgIGxldCBjb250ZW50ID0gdGhpcy5tYW5hZ2VyLmhlbHBlci5nZXRGaWxlQ29udGVudChmaWxlUGF0aCwgcHJvamVjdFJvb3QpO1xuXG4gICAgaWYgKCFjb250ZW50KSB7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0cnkge1xuXG4gICAgICBjb250ZW50ID0gSlNPTi5wYXJzZShjb250ZW50KTtcblxuICAgIH0gY2F0Y2goZSkge1xuXG4gICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkSW5mbygnRXJyb3IgcGFyc2luZyAudGVybi1wcm9qZWN0LiBQbGVhc2UgY2hlY2sgaWYgaXQgaXMgYSB2YWxpZCBKU09OIGZpbGUuJywge1xuXG4gICAgICAgIGRpc21pc3NhYmxlOiB0cnVlXG4gICAgICB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICByZXR1cm4gY29udGVudDtcbiAgfVxuXG4gIHByZXBhcmVMaWJzKGxvY2FsQ29uZmlnLCBjb25maWdTdHViKSB7XG5cbiAgICBsZXQgbGlicyA9IHt9O1xuXG4gICAgaWYgKCFsb2NhbENvbmZpZy5saWJzKSB7XG5cbiAgICAgIGxvY2FsQ29uZmlnLmxpYnMgPSB7fTtcblxuICAgIH0gZWxzZSB7XG5cbiAgICAgIGxldCBsaWJzQXNPYmplY3QgPSB7fTtcbiAgICAgIGZvciAobGV0IGxpYiBvZiBsb2NhbENvbmZpZy5saWJzKSB7XG5cbiAgICAgICAgbGlic0FzT2JqZWN0W2xpYl0gPSB0cnVlO1xuICAgICAgfVxuXG4gICAgICBsb2NhbENvbmZpZy5saWJzID0gbGlic0FzT2JqZWN0O1xuICAgIH1cblxuICAgIGZvciAobGV0IGxpYiBvZiBPYmplY3Qua2V5cyhjb25maWdTdHViLmxpYnMpKcKge1xuXG4gICAgICBpZiAoIWxvY2FsQ29uZmlnLmxpYnNbbGliXSkge1xuXG4gICAgICAgIGxpYnNbbGliXSA9IGZhbHNlO1xuXG4gICAgICB9IGVsc2Uge1xuXG4gICAgICAgIGxpYnNbbGliXSA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZm9yIChsZXQgbGliIG9mIE9iamVjdC5rZXlzKGxvY2FsQ29uZmlnLmxpYnMpKSB7XG5cbiAgICAgIGlmIChsaWIgPT09ICdlY21hNScgfHwgbGliID09PSAnZWNtYTYnKSB7XG5cbiAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEluZm8oJ1lvdSBhcmUgdXNpbmcgYSBvdXRkYXRlZCAudGVybi1wcm9qZWN0IGZpbGUuIFBsZWFzZSByZW1vdmUgbGlicyBlY21hNSwgZWNtYTYgbWFudWFsbHkgYW5kIHJlc3RhcnQgdGhlIFNlcnZlciB2aWEgUGFja2FnZXMgLT4gQXRvbSBUZXJuanMgLT4gUmVzdGFydCBzZXJ2ZXIuIFRoZW4gY29uZmlndXJlIHRoZSBwcm9qZWN0IHZpYSBQYWNrYWdlcyAtPiBBdG9tIFRlcm5qcyAtPiBDb25maWd1cmUgcHJvamVjdC4nLCB7XG5cbiAgICAgICAgICBkaXNtaXNzYWJsZTogdHJ1ZVxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFsaWJzW2xpYl0pIHtcblxuICAgICAgICBsaWJzW2xpYl0gPSB0cnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIGxvY2FsQ29uZmlnLmxpYnMgPSBsaWJzO1xuXG4gICAgcmV0dXJuIGxvY2FsQ29uZmlnO1xuICB9XG5cbiAgcHJlcGFyZUVjbWEobG9jYWxDb25maWcsIGNvbmZpZ1N0dWIpIHtcblxuICAgIGxldCBlY21hVmVyc2lvbnMgPSB7fTtcblxuICAgIGZvciAobGV0IGxpYiBvZiBPYmplY3Qua2V5cyhjb25maWdTdHViLmVjbWFWZXJzaW9ucykpIHtcblxuICAgICAgZWNtYVZlcnNpb25zW2xpYl0gPSBjb25maWdTdHViLmVjbWFWZXJzaW9uc1tsaWJdO1xuICAgIH1cblxuICAgIGxvY2FsQ29uZmlnLmVjbWFWZXJzaW9ucyA9IGVjbWFWZXJzaW9ucztcblxuICAgIGlmIChsb2NhbENvbmZpZy5lY21hVmVyc2lvbikge1xuXG4gICAgICBmb3IgKGxldCBsaWIgb2YgT2JqZWN0LmtleXMobG9jYWxDb25maWcuZWNtYVZlcnNpb25zKSkge1xuXG4gICAgICAgIGlmIChsaWIgPT09ICdlY21hVmVyc2lvbicgKyBsb2NhbENvbmZpZy5lY21hVmVyc2lvbikge1xuXG4gICAgICAgICAgbG9jYWxDb25maWcuZWNtYVZlcnNpb25zW2xpYl0gPSB0cnVlO1xuXG4gICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICBsb2NhbENvbmZpZy5lY21hVmVyc2lvbnNbbGliXSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGxvY2FsQ29uZmlnO1xuICB9XG5cbiAgcmVnaXN0ZXJFdmVudHMoKSB7XG5cbiAgICBsZXQgY2xvc2UgPSB0aGlzLmNvbmZpZ1ZpZXcuZ2V0Q2xvc2UoKTtcbiAgICBsZXQgY2FuY2VsID0gdGhpcy5jb25maWdWaWV3LmdldENhbmNlbCgpO1xuXG4gICAgY2xvc2UuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuXG4gICAgICB0aGlzLnVwZGF0ZUNvbmZpZygpO1xuICAgICAgdGhpcy5oaWRlKCk7XG4gICAgICB0aGlzLm1hbmFnZXIuaGVscGVyLmZvY3VzRWRpdG9yKCk7XG4gICAgfSk7XG5cbiAgICBjYW5jZWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuXG4gICAgICB0aGlzLmRlc3Ryb3lFZGl0b3JzKCk7XG4gICAgICB0aGlzLmhpZGUoKTtcbiAgICAgIHRoaXMubWFuYWdlci5oZWxwZXIuZm9jdXNFZGl0b3IoKTtcbiAgICB9KTtcbiAgfVxuXG4gIG1lcmdlQ29uZmlnT2JqZWN0cyhvYmoxLCBvYmoyKSB7XG5cbiAgICByZXR1cm4gXy5kZWVwRXh0ZW5kKHt9LCBvYmoxLCBvYmoyKTtcbiAgfVxuXG4gIGhpZGUoKSB7XG5cbiAgICBpZiAoIXRoaXMuY29uZmlnUGFuZWwpIHtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuY29uZmlnUGFuZWwuaGlkZSgpO1xuICB9XG5cbiAgY2xlYXIoKSB7XG5cbiAgICB0aGlzLmhpZGUoKTtcbiAgICB0aGlzLmRlc3Ryb3lFZGl0b3JzKCk7XG4gICAgdGhpcy5jb25maWcgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5wcm9qZWN0Q29uZmlnID0gdW5kZWZpbmVkO1xuXG4gICAgaWYgKCF0aGlzLmNvbmZpZ1ZpZXcpIHtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuY29uZmlnVmlldy5yZW1vdmVDb250ZW50KCk7XG4gIH1cblxuICBnYXRoZXJEYXRhKCkge1xuXG4gICAgbGV0IGNvbmZpZ1N0dWIgPSB0aGlzLmdldENvbnRlbnQoJy4uL3Rlcm4tY29uZmlnLmpzb24nLCBmYWxzZSk7XG5cbiAgICBpZiAoIWNvbmZpZ1N0dWIpIHtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMucHJvamVjdENvbmZpZyA9IHRoaXMuZ2V0Q29udGVudCgnLy50ZXJuLXByb2plY3QnLCB0cnVlKTtcblxuICAgIHRoaXMuY29uZmlnID0ge307XG4gICAgdGhpcy5jb25maWcgPSB0aGlzLm1lcmdlQ29uZmlnT2JqZWN0cyh0aGlzLnByb2plY3RDb25maWcsIHRoaXMuY29uZmlnKTtcblxuICAgIGlmICh0aGlzLnByb2plY3RDb25maWcpIHtcblxuICAgICAgdGhpcy5jb25maWcgPSB0aGlzLnByZXBhcmVFY21hKHRoaXMuY29uZmlnLCBjb25maWdTdHViKTtcbiAgICAgIHRoaXMuY29uZmlnID0gdGhpcy5wcmVwYXJlTGlicyh0aGlzLmNvbmZpZywgY29uZmlnU3R1Yik7XG5cbiAgICAgIGZvciAobGV0IHBsdWdpbiBpbiB0aGlzLmNvbmZpZy5wbHVnaW5zKSB7XG5cbiAgICAgICAgaWYgKHRoaXMuY29uZmlnLnBsdWdpbnNbcGx1Z2luXSkge1xuXG4gICAgICAgICAgdGhpcy5jb25maWcucGx1Z2luc1twbHVnaW5dLmFjdGl2ZSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdGhpcy5jb25maWcgPSB0aGlzLm1lcmdlQ29uZmlnT2JqZWN0cyhjb25maWdTdHViLCB0aGlzLmNvbmZpZyk7XG5cbiAgICB9IGVsc2Uge1xuXG4gICAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZ1N0dWI7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICByZW1vdmVFZGl0b3IoZWRpdG9yKSB7XG5cbiAgICBpZiAoIWVkaXRvcikge1xuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGV0IGlkeCA9IHRoaXMuZWRpdG9ycy5pbmRleE9mKGVkaXRvcik7XG5cbiAgICBpZiAoaWR4ID09PSAtMSkge1xuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5lZGl0b3JzLnNwbGljZShpZHgsIDEpO1xuICB9XG5cblxuICBkZXN0cm95RWRpdG9ycygpIHtcblxuICAgIGZvciAobGV0IGVkaXRvciBvZiB0aGlzLmVkaXRvcnMpIHtcblxuICAgICAgbGV0IGJ1ZmZlciA9IGVkaXRvci5nZXRNb2RlbCgpLmdldEJ1ZmZlcigpO1xuICAgICAgYnVmZmVyLmRlc3Ryb3koKTtcbiAgICB9XG5cbiAgICB0aGlzLmVkaXRvcnMgPSBbXTtcbiAgfVxuXG4gIHVwZGF0ZUNvbmZpZygpIHtcblxuICAgIHRoaXMuY29uZmlnLmxvYWRFYWdlcmx5ID0gW107XG4gICAgdGhpcy5jb25maWcuZG9udExvYWQgPSBbXTtcblxuICAgIGZvciAobGV0IGVkaXRvciBvZiB0aGlzLmVkaXRvcnMpIHtcblxuICAgICAgbGV0IGJ1ZmZlciA9IGVkaXRvci5nZXRNb2RlbCgpLmdldEJ1ZmZlcigpO1xuICAgICAgbGV0IHRleHQgPSBidWZmZXIuZ2V0VGV4dCgpLnRyaW0oKTtcblxuICAgICAgaWYgKHRleHQgPT09ICcnKSB7XG5cbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuY29uZmlnW2VkaXRvci5fX3Rlcm5qc19zZWN0aW9uXS5wdXNoKHRleHQpO1xuICAgIH1cblxuICAgIHRoaXMuZGVzdHJveUVkaXRvcnMoKTtcblxuICAgIGxldCBuZXdDb25maWcgPSB0aGlzLmJ1aWxkTmV3Q29uZmlnKCk7XG4gICAgbGV0IG5ld0NvbmZpZ0pTT04gPSBKU09OLnN0cmluZ2lmeShuZXdDb25maWcsIG51bGwsIDIpO1xuXG4gICAgdGhpcy5tYW5hZ2VyLmhlbHBlci51cGRhdGVUZXJuRmlsZShuZXdDb25maWdKU09OLCB0cnVlKTtcbiAgfVxuXG4gIGJ1aWxkTmV3Q29uZmlnKCkge1xuXG4gICAgbGV0IG5ld0NvbmZpZyA9IHt9O1xuXG4gICAgZm9yIChsZXQga2V5IG9mIE9iamVjdC5rZXlzKHRoaXMuY29uZmlnLmVjbWFWZXJzaW9ucykpIHtcblxuICAgICAgaWYgKHRoaXMuY29uZmlnLmVjbWFWZXJzaW9uc1trZXldKSB7XG5cbiAgICAgICAgbmV3Q29uZmlnLmVjbWFWZXJzaW9uID0gTnVtYmVyKGtleVtrZXkubGVuZ3RoIC0gMV0pO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoIV8uaXNFbXB0eSh0aGlzLmNvbmZpZy5saWJzKSkge1xuXG4gICAgICBuZXdDb25maWcubGlicyA9IFtdO1xuXG4gICAgICBmb3IgKGxldCBrZXkgb2YgT2JqZWN0LmtleXModGhpcy5jb25maWcubGlicykpIHtcblxuICAgICAgICBpZiAodGhpcy5jb25maWcubGlic1trZXldKSB7XG5cbiAgICAgICAgICBuZXdDb25maWcubGlicy5wdXNoKGtleSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcy5jb25maWcubG9hZEVhZ2VybHkubGVuZ3RoICE9PSAwKSB7XG5cbiAgICAgIG5ld0NvbmZpZy5sb2FkRWFnZXJseSA9IHRoaXMuY29uZmlnLmxvYWRFYWdlcmx5O1xuICAgIH1cblxuICAgIGlmICh0aGlzLmNvbmZpZy5kb250TG9hZC5sZW5ndGggIT09IDApIHtcblxuICAgICAgbmV3Q29uZmlnLmRvbnRMb2FkID0gdGhpcy5jb25maWcuZG9udExvYWQ7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucHJvamVjdENvbmZpZyAmJiAhXy5pc0VtcHR5KHRoaXMucHJvamVjdENvbmZpZy5wbHVnaW5zKSkge1xuXG4gICAgICBuZXdDb25maWcucGx1Z2lucyA9IHRoaXMucHJvamVjdENvbmZpZy5wbHVnaW5zO1xuICAgIH1cblxuICAgIHJldHVybiBuZXdDb25maWc7XG4gIH1cblxuICBpbml0Q29uZmlnVmlldygpIHtcblxuICAgIGlmICghQ29uZmlnVmlldykge1xuXG4gICAgICBDb25maWdWaWV3ID0gcmVxdWlyZSgnLi9hdG9tLXRlcm5qcy1jb25maWctdmlldycpO1xuICAgIH1cblxuXG4gICAgdGhpcy5jb25maWdWaWV3ID0gbmV3IENvbmZpZ1ZpZXcoKTtcbiAgICB0aGlzLmNvbmZpZ1ZpZXcuaW5pdGlhbGl6ZSh0aGlzKTtcblxuICAgIHRoaXMuY29uZmlnUGFuZWwgPSBhdG9tLndvcmtzcGFjZS5hZGRSaWdodFBhbmVsKHtcblxuICAgICAgaXRlbTogdGhpcy5jb25maWdWaWV3LFxuICAgICAgcHJpb3JpdHk6IDBcbiAgICB9KTtcbiAgICB0aGlzLmNvbmZpZ1BhbmVsLmhpZGUoKTtcblxuICAgIHRoaXMucmVnaXN0ZXJFdmVudHMoKTtcbiAgfVxuXG4gIHNob3coKSB7XG5cbiAgICBpZiAoIXRoaXMuY29uZmlnVmlldykge1xuXG4gICAgICB0aGlzLmluaXRDb25maWdWaWV3KCk7XG4gICAgfVxuXG4gICAgdGhpcy5jbGVhcigpO1xuXG4gICAgYXRvbS52aWV3cy5nZXRWaWV3KHRoaXMuY29uZmlnUGFuZWwpLmNsYXNzTGlzdC5hZGQoJ2F0b20tdGVybmpzLWNvbmZpZy1wYW5lbCcpO1xuXG4gICAgaWYgKCF0aGlzLmdhdGhlckRhdGEoKSkge1xuXG4gICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkSW5mbygnVGhlcmUgaXMgbm8gYWN0aXZlIHByb2plY3QuIFBsZWFzZSByZS1vcGVuIG9yIGZvY3VzIGF0IGxlYXN0IG9uZSBKYXZhU2NyaXB0IGZpbGUgb2YgdGhlIHByb2plY3QgdG8gY29uZmlndXJlLicsIHtcblxuICAgICAgICBkaXNtaXNzYWJsZTogdHJ1ZVxuICAgICAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5jb25maWdWaWV3LmJ1aWxkT3B0aW9uc01hcmt1cCh0aGlzLm1hbmFnZXIpO1xuICAgIHRoaXMuY29uZmlnUGFuZWwuc2hvdygpO1xuICB9XG5cbiAgZGVzdHJveSgpIHtcblxuICAgIGlmICh0aGlzLmNvbmZpZ1ZpZXcpIHtcblxuICAgICAgdGhpcy5jb25maWdWaWV3LmRlc3Ryb3koKTtcbiAgICB9XG4gICAgdGhpcy5jb25maWdWaWV3ID0gdW5kZWZpbmVkO1xuXG4gICAgaWYgKHRoaXMuY29uZmlnUGFuZWwpIHtcblxuICAgICAgdGhpcy5jb25maWdQYW5lbC5kZXN0cm95KCk7XG4gICAgfVxuICAgIHRoaXMuY29uZmlnUGFuZWwgPSB1bmRlZmluZWQ7XG4gIH1cbn1cbiJdfQ==
//# sourceURL=/home/cin_chalic/.atom/packages/atom-ternjs/lib/atom-ternjs-config.js
