Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _jscsLibCliConfig = require('jscs/lib/cli-config');

var _jscsLibCliConfig2 = _interopRequireDefault(_jscsLibCliConfig);

var _globule = require('globule');

var _globule2 = _interopRequireDefault(_globule);

'use babel';

var grammarScopes = ['source.js', 'source.js.jsx'];

var LinterJSCS = (function () {
  function LinterJSCS() {
    _classCallCheck(this, LinterJSCS);
  }

  _createClass(LinterJSCS, null, [{
    key: 'activate',
    value: function activate() {
      var _this = this;

      // Install dependencies using atom-package-deps
      require('atom-package-deps').install();

      this.observer = atom.workspace.observeTextEditors(function (editor) {
        editor.getBuffer().onDidSave(function () {

          // Exclude `excludeFiles` for fix on save
          var config = _this.getConfig(editor.getPath());
          var exclude = _globule2['default'].isMatch(config && config.excludeFiles, _this.getFilePath(editor.getPath()));

          if (grammarScopes.indexOf(editor.getGrammar().scopeName) !== -1 && _this.fixOnSave && !exclude || _this.testFixOnSave) {
            _this.fixString(editor);
          }
        });
      });
    }
  }, {
    key: 'deactivate',
    value: function deactivate() {
      this.observer.dispose();
    }
  }, {
    key: 'provideLinter',
    value: function provideLinter() {
      var _this2 = this;

      var helpers = require('atom-linter');
      return {
        name: 'JSCS',
        grammarScopes: grammarScopes,
        scope: 'file',
        lintOnFly: true,
        lint: function lint(editor, opts, overrideOptions, testFixOnSave) {
          var JSCS = require('jscs');

          _this2.testFixOnSave = testFixOnSave;

          // We need re-initialize JSCS before every lint
          // or it will looses the errors, didn't trace the error
          // must be something with new 2.0.0 JSCS
          _this2.jscs = new JSCS();
          _this2.jscs.registerDefaultRules();

          var filePath = editor.getPath();
          var config = _this2.getConfig(filePath);

          // Options passed to `jscs` from package configuration
          var options = { esnext: _this2.esnext, preset: _this2.preset };

          _this2.jscs.configure(overrideOptions || config || options);

          // We don't have a config file present in project directory
          // let's return an empty array of errors
          if (!config && _this2.onlyConfig) return Promise.resolve([]);

          var text = editor.getText();
          var errors = _this2.jscs.checkString(text, filePath).getErrorList();

          // Exclude `excludeFiles` for errors
          var exclude = _globule2['default'].isMatch(config && config.excludeFiles, _this2.getFilePath(editor.getPath()));
          if (exclude) return Promise.resolve([]);

          return Promise.resolve(errors.map(function (_ref) {
            var rule = _ref.rule;
            var message = _ref.message;
            var line = _ref.line;
            var column = _ref.column;

            var type = _this2.displayAs;
            var html = '<span class=\'badge badge-flexible\'>' + rule + '</span> ' + message;
            var range = helpers.rangeFromLineNumber(editor, line - 1, column - 1);

            return { type: type, html: html, filePath: filePath, range: range };
          }));
        }
      };
    }
  }, {
    key: 'getFilePath',
    value: function getFilePath(path) {
      var relative = atom.project.relativizePath(path);
      return relative[1];
    }
  }, {
    key: 'getConfig',
    value: function getConfig(filePath) {
      if (_path2['default'].isAbsolute(this.configPath)) {
        return _jscsLibCliConfig2['default'].load(false, this.configPath);
      }

      return _jscsLibCliConfig2['default'].load(false, _path2['default'].join(_path2['default'].dirname(filePath), this.configPath));
    }
  }, {
    key: 'fixString',
    value: function fixString(editor) {
      var editorPath = editor.getPath();
      var editorText = editor.getText();

      var config = this.getConfig(editorPath);
      if (!config && this.onlyConfig) {
        return;
      }

      var fixedText = this.jscs.fixString(editorText, editorPath).output;
      if (editorText === fixedText) {
        return;
      }

      var cursorPosition = editor.getCursorScreenPosition();
      editor.setText(fixedText);
      editor.setCursorScreenPosition(cursorPosition);
    }
  }, {
    key: 'config',
    value: {
      preset: {
        title: 'Preset',
        description: 'Preset option is ignored if a config file is found for the linter.',
        type: 'string',
        'default': 'airbnb',
        'enum': ['airbnb', 'crockford', 'google', 'grunt', 'idiomatic', 'jquery', 'mdcs', 'node-style-guide', 'wikimedia', 'wordpress', 'yandex']
      },
      esnext: {
        description: 'Attempts to parse your code as ES6+, JSX, and Flow using the babel-jscs package as the parser.',
        type: 'boolean',
        'default': false
      },
      onlyConfig: {
        title: 'Only Config',
        description: 'Disable linter if there is no config file found for the linter.',
        type: 'boolean',
        'default': false
      },
      fixOnSave: {
        title: 'Fix on save',
        description: 'Fix JavaScript on save',
        type: 'boolean',
        'default': false
      },
      displayAs: {
        title: 'Display errors as',
        type: 'string',
        'default': 'error',
        'enum': ['error', 'warning', 'jscs Warning', 'jscs Error']
      },
      configPath: {
        title: 'Config file path (Absolute or relative path to your project)',
        type: 'string',
        'default': ''
      }
    },
    enumerable: true
  }, {
    key: 'preset',
    get: function get() {
      return atom.config.get('linter-jscs.preset');
    }
  }, {
    key: 'esnext',
    get: function get() {
      return atom.config.get('linter-jscs.esnext');
    }
  }, {
    key: 'onlyConfig',
    get: function get() {
      return atom.config.get('linter-jscs.onlyConfig');
    }
  }, {
    key: 'fixOnSave',
    get: function get() {
      return atom.config.get('linter-jscs.fixOnSave');
    }
  }, {
    key: 'displayAs',
    get: function get() {
      return atom.config.get('linter-jscs.displayAs');
    }
  }, {
    key: 'configPath',
    get: function get() {
      return atom.config.get('linter-jscs.configPath');
    }
  }]);

  return LinterJSCS;
})();

exports['default'] = LinterJSCS;
;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGludGVyLWpzY3Mvc3JjL2xpbnRlci1qc2NzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7b0JBRWlCLE1BQU07Ozs7Z0NBQ0EscUJBQXFCOzs7O3VCQUN4QixTQUFTOzs7O0FBSjdCLFdBQVcsQ0FBQzs7QUFNWixJQUFNLGFBQWEsR0FBRyxDQUFDLFdBQVcsRUFBRSxlQUFlLENBQUMsQ0FBQzs7SUFFaEMsVUFBVTtXQUFWLFVBQVU7MEJBQVYsVUFBVTs7O2VBQVYsVUFBVTs7V0FnRWQsb0JBQUc7Ozs7QUFFaEIsYUFBTyxDQUFDLG1CQUFtQixDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7O0FBRXZDLFVBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxVQUFDLE1BQU0sRUFBSztBQUM1RCxjQUFNLENBQUMsU0FBUyxFQUFFLENBQUMsU0FBUyxDQUFDLFlBQU07OztBQUdqQyxjQUFNLE1BQU0sR0FBRyxNQUFLLFNBQVMsQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztBQUNoRCxjQUFJLE9BQU8sR0FBRyxxQkFBUSxPQUFPLENBQUMsTUFBTSxJQUFJLE1BQU0sQ0FBQyxZQUFZLEVBQUUsTUFBSyxXQUFXLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQzs7QUFFakcsY0FBSSxBQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLE1BQUssU0FBUyxJQUFJLENBQUMsT0FBTyxJQUFLLE1BQUssYUFBYSxFQUFFO0FBQ3JILGtCQUFLLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztXQUN4QjtTQUNGLENBQUMsQ0FBQztPQUNKLENBQUMsQ0FBQztLQUNKOzs7V0FFZ0Isc0JBQUc7QUFDbEIsVUFBSSxDQUFDLFFBQVEs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Q0FBQyxDQUFDO0tBQ2pEOzs7U0FFb0IsZUFBRztBQUN0QixhQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLHdCQUF3QixDQUFDLENBQUM7S0FDbEQ7OztTQTlEa0IsVUFBVTs7O3FCQUFWLFVBQVU7QUF3SzlCLENBQUMiLCJmaWxlIjoiL2hvbWUvY2luX2NoYWxpYy8uYXRvbS9wYWNrYWdlcy9saW50ZXItanNjcy9zcmMvbGludGVyLWpzY3MuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgY29uZmlnRmlsZSBmcm9tICdqc2NzL2xpYi9jbGktY29uZmlnJztcbmltcG9ydCBnbG9idWxlIGZyb20gJ2dsb2J1bGUnO1xuXG5jb25zdCBncmFtbWFyU2NvcGVzID0gWydzb3VyY2UuanMnLCAnc291cmNlLmpzLmpzeCddO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMaW50ZXJKU0NTIHtcblxuICBzdGF0aWMgY29uZmlnID0ge1xuICAgIHByZXNldDoge1xuICAgICAgdGl0bGU6ICdQcmVzZXQnLFxuICAgICAgZGVzY3JpcHRpb246ICdQcmVzZXQgb3B0aW9uIGlzIGlnbm9yZWQgaWYgYSBjb25maWcgZmlsZSBpcyBmb3VuZCBmb3IgdGhlIGxpbnRlci4nLFxuICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICBkZWZhdWx0OiAnYWlyYm5iJyxcbiAgICAgIGVudW06IFsnYWlyYm5iJywgJ2Nyb2NrZm9yZCcsICdnb29nbGUnLCAnZ3J1bnQnLCAnaWRpb21hdGljJywgJ2pxdWVyeScsICdtZGNzJywgJ25vZGUtc3R5bGUtZ3VpZGUnLCAnd2lraW1lZGlhJywgJ3dvcmRwcmVzcycsICd5YW5kZXgnXSxcbiAgICB9LFxuICAgIGVzbmV4dDoge1xuICAgICAgZGVzY3JpcHRpb246ICdBdHRlbXB0cyB0byBwYXJzZSB5b3VyIGNvZGUgYXMgRVM2KywgSlNYLCBhbmQgRmxvdyB1c2luZyB0aGUgYmFiZWwtanNjcyBwYWNrYWdlIGFzIHRoZSBwYXJzZXIuJyxcbiAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgIH0sXG4gICAgb25seUNvbmZpZzoge1xuICAgICAgdGl0bGU6ICdPbmx5IENvbmZpZycsXG4gICAgICBkZXNjcmlwdGlvbjogJ0Rpc2FibGUgbGludGVyIGlmIHRoZXJlIGlzIG5vIGNvbmZpZyBmaWxlIGZvdW5kIGZvciB0aGUgbGludGVyLicsXG4gICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICB9LFxuICAgIGZpeE9uU2F2ZToge1xuICAgICAgdGl0bGU6ICdGaXggb24gc2F2ZScsXG4gICAgICBkZXNjcmlwdGlvbjogJ0ZpeCBKYXZhU2NyaXB0IG9uIHNhdmUnLFxuICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgZGVmYXVsdDogZmFsc2UsXG4gICAgfSxcbiAgICBkaXNwbGF5QXM6IHtcbiAgICAgIHRpdGxlOiAnRGlzcGxheSBlcnJvcnMgYXMnLFxuICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICBkZWZhdWx0OiAnZXJyb3InLFxuICAgICAgZW51bTogWydlcnJvcicsICd3YXJuaW5nJywgJ2pzY3MgV2FybmluZycsICdqc2NzIEVycm9yJ10sXG4gICAgfSxcbiAgICBjb25maWdQYXRoOiB7XG4gICAgICB0aXRsZTogJ0NvbmZpZyBmaWxlIHBhdGggKEFic29sdXRlIG9yIHJlbGF0aXZlIHBhdGggdG8geW91ciBwcm9qZWN0KScsXG4gICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgIGRlZmF1bHQ6ICcnLFxuICAgIH0sXG4gIH07XG5cbiAgc3RhdGljIGdldCBwcmVzZXQoKSB7XG4gICAgcmV0dXJuIGF0b20uY29uZmlnLmdldCgnbGludGVyLWpzY3MucHJlc2V0Jyk7XG4gIH1cblxuICBzdGF0aWMgZ2V0IGVzbmV4dCgpIHtcbiAgICByZXR1cm4gYXRvbS5jb25maWcuZ2V0KCdsaW50ZXItanNjcy5lc25leHQnKTtcbiAgfVxuXG4gIHN0YXRpYyBnZXQgb25seUNvbmZpZygpIHtcbiAgICByZXR1cm4gYXRvbS5jb25maWcuZ2V0KCdsaW50ZXItanNjcy5vbmx5Q29uZmlnJyk7XG4gIH1cblxuICBzdGF0aWMgZ2V0IGZpeE9uU2F2ZSgpIHtcbiAgICByZXR1cm4gYXRvbS5jb25maWcuZ2V0KCdsaW50ZXItanNjcy5maXhPblNhdmUnKTtcbiAgfVxuXG4gIHN0YXRpYyBnZXQgZGlzcGxheUFzKCkge1xuICAgIHJldHVybiBhdG9tLmNvbmZpZy5nZXQoJ2xpbnRlci1qc2NzLmRpc3BsYXlBcycpO1xuICB9XG5cbiAgc3RhdGljIGdldCBjb25maWdQYXRoKCkge1xuICAgIHJldHVybiBhdG9tLmNvbmZpZy5nZXQoJ2xpbnRlci1qc2NzLmNvbmZpZ1BhdGgnKTtcbiAgfVxuXG4gIHN0YXRpYyBhY3RpdmF0ZSgpIHtcbiAgICAvLyBJbnN0YWxsIGRlcGVuZGVuY2llcyB1c2luZyBhdG9tLXBhY2thZ2UtZGVwc1xuICAgIHJlcXVpcmUoJ2F0b20tcGFja2FnZS1kZXBzJykuaW5zdGFsbCgpO1xuXG4gICAgdGhpcy5vYnNlcnZlciA9IGF0b20ud29ya3NwYWNlLm9ic2VydmVUZXh0RWRpdG9ycygoZWRpdG9yKSA9PiB7XG4gICAgICBlZGl0b3IuZ2V0QnVmZmVyKCkub25EaWRTYXZlKCgpID0+IHtcblxuICAgICAgICAvLyBFeGNsdWRlIGBleGNsdWRlRmlsZXNgIGZvciBmaXggb24gc2F2ZVxuICAgICAgICBjb25zdCBjb25maWcgPSB0aGlzLmdldENvbmZpZyhlZGl0b3IuZ2V0UGF0aCgpKTtcbiAgICAgICAgdmFyIGV4Y2x1ZGUgPSBnbG9idWxlLmlzTWF0Y2goY29uZmlnICYmIGNvbmZpZy5leGNsdWRlRmlsZXMsIHRoaXMuZ2V0RmlsZVBhdGgoZWRpdG9yLmdldFBhdGgoKSkpO1xuXG4gICAgICAgIGlmICgoZ3JhbW1hclNjb3Blcy5pbmRleE9mKGVkaXRvci5nZXRHcmFtbWFyKCkuc2NvcGVOYW1lKSAhPT0gLTEgJiYgdGhpcy5maXhPblNhdmUgJiYgIWV4Y2x1ZGUpIHx8IHRoaXMudGVzdEZpeE9uU2F2ZSkge1xuICAgICAgICAgIHRoaXMuZml4U3RyaW5nKGVkaXRvcik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgc3RhdGljIGRlYWN0aXZhdGUoKSB7XG4gICAgdGhpcy5vYnNlcnZlci5kaXNwb3NlKCk7XG4gIH1cblxuICBzdGF0aWMgcHJvdmlkZUxpbnRlcigpIHtcbiAgICBjb25zdCBoZWxwZXJzID0gcmVxdWlyZSgnYXRvbS1saW50ZXInKTtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZTogJ0pTQ1MnLFxuICAgICAgZ3JhbW1hclNjb3BlcyxcbiAgICAgIHNjb3BlOiAnZmlsZScsXG4gICAgICBsaW50T25GbHk6IHRydWUsXG4gICAgICBsaW50OiAoZWRpdG9yLCBvcHRzLCBvdmVycmlkZU9wdGlvbnMsIHRlc3RGaXhPblNhdmUpID0+IHtcbiAgICAgICAgY29uc3QgSlNDUyA9IHJlcXVpcmUoJ2pzY3MnKTtcblxuICAgICAgICB0aGlzLnRlc3RGaXhPblNhdmUgPSB0ZXN0Rml4T25TYXZlO1xuXG4gICAgICAgIC8vIFdlIG5lZWQgcmUtaW5pdGlhbGl6ZSBKU0NTIGJlZm9yZSBldmVyeSBsaW50XG4gICAgICAgIC8vIG9yIGl0IHdpbGwgbG9vc2VzIHRoZSBlcnJvcnMsIGRpZG4ndCB0cmFjZSB0aGUgZXJyb3JcbiAgICAgICAgLy8gbXVzdCBiZSBzb21ldGhpbmcgd2l0aCBuZXcgMi4wLjAgSlNDU1xuICAgICAgICB0aGlzLmpzY3MgPSBuZXcgSlNDUygpO1xuICAgICAgICB0aGlzLmpzY3MucmVnaXN0ZXJEZWZhdWx0UnVsZXMoKTtcblxuICAgICAgICBjb25zdCBmaWxlUGF0aCA9IGVkaXRvci5nZXRQYXRoKCk7XG4gICAgICAgIGNvbnN0IGNvbmZpZyA9IHRoaXMuZ2V0Q29uZmlnKGZpbGVQYXRoKTtcblxuICAgICAgICAvLyBPcHRpb25zIHBhc3NlZCB0byBganNjc2AgZnJvbSBwYWNrYWdlIGNvbmZpZ3VyYXRpb25cbiAgICAgICAgY29uc3Qgb3B0aW9ucyA9IHsgZXNuZXh0OiB0aGlzLmVzbmV4dCwgcHJlc2V0OiB0aGlzLnByZXNldCB9O1xuXG4gICAgICAgIHRoaXMuanNjcy5jb25maWd1cmUob3ZlcnJpZGVPcHRpb25zIHx8IGNvbmZpZyB8fCBvcHRpb25zKTtcblxuICAgICAgICAvLyBXZSBkb24ndCBoYXZlIGEgY29uZmlnIGZpbGUgcHJlc2VudCBpbiBwcm9qZWN0IGRpcmVjdG9yeVxuICAgICAgICAvLyBsZXQncyByZXR1cm4gYW4gZW1wdHkgYXJyYXkgb2YgZXJyb3JzXG4gICAgICAgIGlmICghY29uZmlnICYmIHRoaXMub25seUNvbmZpZykgcmV0dXJuIFByb21pc2UucmVzb2x2ZShbXSk7XG5cbiAgICAgICAgY29uc3QgdGV4dCA9IGVkaXRvci5nZXRUZXh0KCk7XG4gICAgICAgIGNvbnN0IGVycm9ycyA9IHRoaXMuanNjc1xuICAgICAgICAgIC5jaGVja1N0cmluZyh0ZXh0LCBmaWxlUGF0aClcbiAgICAgICAgICAuZ2V0RXJyb3JMaXN0KCk7XG5cbiAgICAgICAgLy8gRXhjbHVkZSBgZXhjbHVkZUZpbGVzYCBmb3IgZXJyb3JzXG4gICAgICAgIHZhciBleGNsdWRlID0gZ2xvYnVsZS5pc01hdGNoKGNvbmZpZyAmJiBjb25maWcuZXhjbHVkZUZpbGVzLCB0aGlzLmdldEZpbGVQYXRoKGVkaXRvci5nZXRQYXRoKCkpKTtcbiAgICAgICAgaWYgKGV4Y2x1ZGUpIHJldHVybiBQcm9taXNlLnJlc29sdmUoW10pO1xuXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoZXJyb3JzLm1hcCgoeyBydWxlLCBtZXNzYWdlLCBsaW5lLCBjb2x1bW4gfSkgPT4ge1xuICAgICAgICAgIGNvbnN0IHR5cGUgPSB0aGlzLmRpc3BsYXlBcztcbiAgICAgICAgICBjb25zdCBodG1sID0gYDxzcGFuIGNsYXNzPSdiYWRnZSBiYWRnZS1mbGV4aWJsZSc+JHtydWxlfTwvc3Bhbj4gJHttZXNzYWdlfWA7XG4gICAgICAgICAgY29uc3QgcmFuZ2UgPSBoZWxwZXJzLnJhbmdlRnJvbUxpbmVOdW1iZXIoZWRpdG9yLCBsaW5lIC0gMSwgY29sdW1uIC0gMSk7XG5cbiAgICAgICAgICByZXR1cm4geyB0eXBlLCBodG1sLCBmaWxlUGF0aCwgcmFuZ2UgfTtcbiAgICAgICAgfSkpO1xuICAgICAgfSxcbiAgICB9O1xuICB9XG5cbiAgc3RhdGljIGdldEZpbGVQYXRoKHBhdGgpIHtcbiAgICBjb25zdCByZWxhdGl2ZSA9IGF0b20ucHJvamVjdC5yZWxhdGl2aXplUGF0aChwYXRoKTtcbiAgICByZXR1cm4gcmVsYXRpdmVbMV07XG4gIH1cblxuICBzdGF0aWMgZ2V0Q29uZmlnKGZpbGVQYXRoKSB7XG4gICAgaWYgKHBhdGguaXNBYnNvbHV0ZSh0aGlzLmNvbmZpZ1BhdGgpKSB7XG4gICAgICByZXR1cm4gY29uZmlnRmlsZS5sb2FkKGZhbHNlLCB0aGlzLmNvbmZpZ1BhdGgpO1xuICAgIH1cblxuICAgIHJldHVybiBjb25maWdGaWxlLmxvYWQoZmFsc2UsXG4gICAgICBwYXRoLmpvaW4ocGF0aC5kaXJuYW1lKGZpbGVQYXRoKSwgdGhpcy5jb25maWdQYXRoKSk7XG4gIH1cblxuICBzdGF0aWMgZml4U3RyaW5nKGVkaXRvcikge1xuICAgIGNvbnN0IGVkaXRvclBhdGggPSBlZGl0b3IuZ2V0UGF0aCgpO1xuICAgIGNvbnN0IGVkaXRvclRleHQgPSBlZGl0b3IuZ2V0VGV4dCgpO1xuXG4gICAgY29uc3QgY29uZmlnID0gdGhpcy5nZXRDb25maWcoZWRpdG9yUGF0aCk7XG4gICAgaWYgKCFjb25maWcgJiYgdGhpcy5vbmx5Q29uZmlnKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgZml4ZWRUZXh0ID0gdGhpcy5qc2NzLmZpeFN0cmluZyhlZGl0b3JUZXh0LCBlZGl0b3JQYXRoKS5vdXRwdXQ7XG4gICAgaWYgKGVkaXRvclRleHQgPT09IGZpeGVkVGV4dCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGN1cnNvclBvc2l0aW9uID0gZWRpdG9yLmdldEN1cnNvclNjcmVlblBvc2l0aW9uKCk7XG4gICAgZWRpdG9yLnNldFRleHQoZml4ZWRUZXh0KTtcbiAgICBlZGl0b3Iuc2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oY3Vyc29yUG9zaXRpb24pO1xuICB9XG59O1xuIl19
//# sourceURL=/home/cin_chalic/.atom/packages/linter-jscs/src/linter-jscs.js
