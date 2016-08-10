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

          if (grammarScopes.indexOf(editor.getGrammar().scopeName) !== -1 || _this.testFixOnSave) {

            // Exclude `excludeFiles` for fix on save
            var config = _this.getConfig(editor.getPath());
            var exclude = _globule2['default'].isMatch(config && config.excludeFiles, _this.getFilePath(editor.getPath()));

            if (_this.fixOnSave && !exclude || _this.testFixOnSave) {
              console.log('FIXING');
              _this.fixString(editor);
            }
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
          var options = { esnext: _this2.esnext };
          if (_this2.preset !== '<none>') {
            options.preset = _this2.preset;
          }

          // `configPath` is non-enumerable so `Object.assign` won't copy it.
          // Without a proper `configPath` JSCS plugs cannot be loaded. See #175.
          var jscsConfig = overrideOptions || Object.assign({}, options, config);
          if (!jscsConfig.configPath && config) {
            jscsConfig.configPath = config.configPath;
          }
          _this2.jscs.configure(jscsConfig);

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

            // Work around a bug in jscs causing it to report columns past the end of the line
            var maxCol = editor.getBuffer().lineLengthForRow(line - 1);
            if (column - 1 > maxCol) {
              column = maxCol + 1;
            }

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
        'enum': ['<none>', 'airbnb', 'crockford', 'google', 'grunt', 'idiomatic', 'jquery', 'mdcs', 'node-style-guide', 'wikimedia', 'wordpress', 'yandex']
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGludGVyLWpzY3Mvc3JjL2xpbnRlci1qc2NzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7b0JBRWlCLE1BQU07Ozs7Z0NBQ0EscUJBQXFCOzs7O3VCQUN4QixTQUFTOzs7O0FBSjdCLFdBQVcsQ0FBQzs7QUFNWixJQUFNLGFBQWEsR0FBRyxDQUFDLFdBQVcsRUFBRSxlQUFlLENBQUMsQ0FBQzs7SUFFaEMsVUFBVTtXQUFWLFVBQVU7MEJBQVYsVUFBVTs7O2VBQVYsVUFBVTs7V0FnRWQsb0JBQUc7Ozs7QUFFaEIsYUFBTyxDQUFDLG1CQUFtQixDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7O0FBRXZDLFVBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxVQUFDLE1BQU0sRUFBSztBQUM1RCxjQUFNLENBQUMsU0FBUyxFQUFFLENBQUMsU0FBUyxDQUFDLFlBQU07O0FBRWpDLGNBQUksYUFBYSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksTUFBSyxhQUFhLEVBQUU7OztBQUdyRixnQkFBTSxNQUFNLEdBQUcsTUFBSyxTQUFTLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7QUFDaEQsZ0JBQUksT0FBTyxHQUFHLHFCQUFRLE9BQU8sQ0FBQyxNQUFNLElBQUksTUFBTSxDQUFDLFlBQVksRUFBRSxNQUFLLFdBQVcsQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDOztBQUVqRyxnQkFBSSxBQUFDLE1BQUssU0FBUyxJQUFJLENBQUMsT0FBTyxJQUFLLE1BQUssYUFBYSxFQUFFO0FBQ3RELHFCQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ3RCLG9CQUFLLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQzthQUN4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LEVBQUUsY0FBYyxFQUFFLFlBQVksQ0FBQztPQUN6RDtBQUNELGdCQUFVLEVBQUU7QUFDVixhQUFLLEVBQUUsOERBQThEO0FBQ3JFLFlBQUksRUFBRSxRQUFRO0FBQ2QsbUJBQVMsRUFBRTtPQUNaO0tBQ0Y7Ozs7U0FFZ0IsZUFBRztBQUNsQixhQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLG9CQUFvQixDQUFDLENBQUM7S0FDOUM7OztTQUVnQixlQUFHO0FBQ2xCLGFBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsb0JBQW9CLENBQUMsQ0FBQztLQUM5Qzs7O1NBRW9CLGVBQUc7QUFDdEIsYUFBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO0tBQ2xEOzs7U0FFbUIsZUFBRztBQUNyQixhQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLHVCQUF1QixDQUFDLENBQUM7S0FDakQ7OztTQUVtQixlQUFHO0FBQ3JCLGFBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsdUJBQXVCLENBQUMsQ0FBQztLQUNqRDs7O1NBRW9CLGVBQUc7QUFDdEIsYUFBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO0tBQ2xEOzs7U0E5RGtCLFVBQVU7OztxQkFBVixVQUFVO0FBNEw5QixDQUFDIiwiZmlsZSI6Ii9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGludGVyLWpzY3Mvc3JjL2xpbnRlci1qc2NzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IGNvbmZpZ0ZpbGUgZnJvbSAnanNjcy9saWIvY2xpLWNvbmZpZyc7XG5pbXBvcnQgZ2xvYnVsZSBmcm9tICdnbG9idWxlJztcblxuY29uc3QgZ3JhbW1hclNjb3BlcyA9IFsnc291cmNlLmpzJywgJ3NvdXJjZS5qcy5qc3gnXTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGludGVySlNDUyB7XG5cbiAgc3RhdGljIGNvbmZpZyA9IHtcbiAgICBwcmVzZXQ6IHtcbiAgICAgIHRpdGxlOiAnUHJlc2V0JyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnUHJlc2V0IG9wdGlvbiBpcyBpZ25vcmVkIGlmIGEgY29uZmlnIGZpbGUgaXMgZm91bmQgZm9yIHRoZSBsaW50ZXIuJyxcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgZGVmYXVsdDogJ2FpcmJuYicsXG4gICAgICBlbnVtOiBbJzxub25lPicsICdhaXJibmInLCAnY3JvY2tmb3JkJywgJ2dvb2dsZScsICdncnVudCcsICdpZGlvbWF0aWMnLCAnanF1ZXJ5JywgJ21kY3MnLCAnbm9kZS1zdHlsZS1ndWlkZScsICd3aWtpbWVkaWEnLCAnd29yZHByZXNzJywgJ3lhbmRleCddLFxuICAgIH0sXG4gICAgZXNuZXh0OiB7XG4gICAgICBkZXNjcmlwdGlvbjogJ0F0dGVtcHRzIHRvIHBhcnNlIHlvdXIgY29kZSBhcyBFUzYrLCBKU1gsIGFuZCBGbG93IHVzaW5nIHRoZSBiYWJlbC1qc2NzIHBhY2thZ2UgYXMgdGhlIHBhcnNlci4nLFxuICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgZGVmYXVsdDogZmFsc2UsXG4gICAgfSxcbiAgICBvbmx5Q29uZmlnOiB7XG4gICAgICB0aXRsZTogJ09ubHkgQ29uZmlnJyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnRGlzYWJsZSBsaW50ZXIgaWYgdGhlcmUgaXMgbm8gY29uZmlnIGZpbGUgZm91bmQgZm9yIHRoZSBsaW50ZXIuJyxcbiAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgIH0sXG4gICAgZml4T25TYXZlOiB7XG4gICAgICB0aXRsZTogJ0ZpeCBvbiBzYXZlJyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnRml4IEphdmFTY3JpcHQgb24gc2F2ZScsXG4gICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICB9LFxuICAgIGRpc3BsYXlBczoge1xuICAgICAgdGl0bGU6ICdEaXNwbGF5IGVycm9ycyBhcycsXG4gICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgIGRlZmF1bHQ6ICdlcnJvcicsXG4gICAgICBlbnVtOiBbJ2Vycm9yJywgJ3dhcm5pbmcnLCAnanNjcyBXYXJuaW5nJywgJ2pzY3MgRXJyb3InXSxcbiAgICB9LFxuICAgIGNvbmZpZ1BhdGg6IHtcbiAgICAgIHRpdGxlOiAnQ29uZmlnIGZpbGUgcGF0aCAoQWJzb2x1dGUgb3IgcmVsYXRpdmUgcGF0aCB0byB5b3VyIHByb2plY3QpJyxcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgZGVmYXVsdDogJycsXG4gICAgfSxcbiAgfTtcblxuICBzdGF0aWMgZ2V0IHByZXNldCgpIHtcbiAgICByZXR1cm4gYXRvbS5jb25maWcuZ2V0KCdsaW50ZXItanNjcy5wcmVzZXQnKTtcbiAgfVxuXG4gIHN0YXRpYyBnZXQgZXNuZXh0KCkge1xuICAgIHJldHVybiBhdG9tLmNvbmZpZy5nZXQoJ2xpbnRlci1qc2NzLmVzbmV4dCcpO1xuICB9XG5cbiAgc3RhdGljIGdldCBvbmx5Q29uZmlnKCkge1xuICAgIHJldHVybiBhdG9tLmNvbmZpZy5nZXQoJ2xpbnRlci1qc2NzLm9ubHlDb25maWcnKTtcbiAgfVxuXG4gIHN0YXRpYyBnZXQgZml4T25TYXZlKCkge1xuICAgIHJldHVybiBhdG9tLmNvbmZpZy5nZXQoJ2xpbnRlci1qc2NzLmZpeE9uU2F2ZScpO1xuICB9XG5cbiAgc3RhdGljIGdldCBkaXNwbGF5QXMoKSB7XG4gICAgcmV0dXJuIGF0b20uY29uZmlnLmdldCgnbGludGVyLWpzY3MuZGlzcGxheUFzJyk7XG4gIH1cblxuICBzdGF0aWMgZ2V0IGNvbmZpZ1BhdGgoKSB7XG4gICAgcmV0dXJuIGF0b20uY29uZmlnLmdldCgnbGludGVyLWpzY3MuY29uZmlnUGF0aCcpO1xuICB9XG5cbiAgc3RhdGljIGFjdGl2YXRlKCkge1xuICAgIC8vIEluc3RhbGwgZGVwZW5kZW5jaWVzIHVzaW5nIGF0b20tcGFja2FnZS1kZXBzXG4gICAgcmVxdWlyZSgnYXRvbS1wYWNrYWdlLWRlcHMnKS5pbnN0YWxsKCk7XG5cbiAgICB0aGlzLm9ic2VydmVyID0gYXRvbS53b3Jrc3BhY2Uub2JzZXJ2ZVRleHRFZGl0b3JzKChlZGl0b3IpID0+IHtcbiAgICAgIGVkaXRvci5nZXRCdWZmZXIoKS5vbkRpZFNhdmUoKCkgPT4ge1xuXG4gICAgICAgIGlmIChncmFtbWFyU2NvcGVzLmluZGV4T2YoZWRpdG9yLmdldEdyYW1tYXIoKS5zY29wZU5hbWUpICE9PSAtMSB8fCB0aGlzLnRlc3RGaXhPblNhdmUpIHtcblxuICAgICAgICAgIC8vIEV4Y2x1ZGUgYGV4Y2x1ZGVGaWxlc2AgZm9yIGZpeCBvbiBzYXZlXG4gICAgICAgICAgY29uc3QgY29uZmlnID0gdGhpcy5nZXRDb25maWcoZWRpdG9yLmdldFBhdGgoKSk7XG4gICAgICAgICAgdmFyIGV4Y2x1ZGUgPSBnbG9idWxlLmlzTWF0Y2goY29uZmlnICYmIGNvbmZpZy5leGNsdWRlRmlsZXMsIHRoaXMuZ2V0RmlsZVBhdGgoZWRpdG9yLmdldFBhdGgoKSkpO1xuXG4gICAgICAgICAgaWYgKCh0aGlzLmZpeE9uU2F2ZSAmJiAhZXhjbHVkZSkgfHwgdGhpcy50ZXN0Rml4T25TYXZlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnRklYSU5HJyk7XG4gICAgICAgICAgICB0aGlzLmZpeFN0cmluZyhlZGl0b3IpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBzdGF0aWMgZGVhY3RpdmF0ZSgpIHtcbiAgICB0aGlzLm9ic2VydmVyLmRpc3Bvc2UoKTtcbiAgfVxuXG4gIHN0YXRpYyBwcm92aWRlTGludGVyKCkge1xuICAgIGNvbnN0IGhlbHBlcnMgPSByZXF1aXJlKCdhdG9tLWxpbnRlcicpO1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lOiAnSlNDUycsXG4gICAgICBncmFtbWFyU2NvcGVzLFxuICAgICAgc2NvcGU6ICdmaWxlJyxcbiAgICAgIGxpbnRPbkZseTogdHJ1ZSxcbiAgICAgIGxpbnQ6IChlZGl0b3IsIG9wdHMsIG92ZXJyaWRlT3B0aW9ucywgdGVzdEZpeE9uU2F2ZSkgPT4ge1xuICAgICAgICBjb25zdCBKU0NTID0gcmVxdWlyZSgnanNjcycpO1xuXG4gICAgICAgIHRoaXMudGVzdEZpeE9uU2F2ZSA9IHRlc3RGaXhPblNhdmU7XG5cbiAgICAgICAgLy8gV2UgbmVlZCByZS1pbml0aWFsaXplIEpTQ1MgYmVmb3JlIGV2ZXJ5IGxpbnRcbiAgICAgICAgLy8gb3IgaXQgd2lsbCBsb29zZXMgdGhlIGVycm9ycywgZGlkbid0IHRyYWNlIHRoZSBlcnJvclxuICAgICAgICAvLyBtdXN0IGJlIHNvbWV0aGluZyB3aXRoIG5ldyAyLjAuMCBKU0NTXG4gICAgICAgIHRoaXMuanNjcyA9IG5ldyBKU0NTKCk7XG4gICAgICAgIHRoaXMuanNjcy5yZWdpc3RlckRlZmF1bHRSdWxlcygpO1xuXG4gICAgICAgIGNvbnN0IGZpbGVQYXRoID0gZWRpdG9yLmdldFBhdGgoKTtcbiAgICAgICAgY29uc3QgY29uZmlnID0gdGhpcy5nZXRDb25maWcoZmlsZVBhdGgpO1xuXG4gICAgICAgIC8vIE9wdGlvbnMgcGFzc2VkIHRvIGBqc2NzYCBmcm9tIHBhY2thZ2UgY29uZmlndXJhdGlvblxuICAgICAgICBjb25zdCBvcHRpb25zID0geyBlc25leHQ6IHRoaXMuZXNuZXh0IH07XG4gICAgICAgIGlmICh0aGlzLnByZXNldCAhPT0gJzxub25lPicpIHtcbiAgICAgICAgICBvcHRpb25zLnByZXNldCA9IHRoaXMucHJlc2V0O1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gYGNvbmZpZ1BhdGhgIGlzIG5vbi1lbnVtZXJhYmxlIHNvIGBPYmplY3QuYXNzaWduYCB3b24ndCBjb3B5IGl0LlxuICAgICAgICAvLyBXaXRob3V0IGEgcHJvcGVyIGBjb25maWdQYXRoYCBKU0NTIHBsdWdzIGNhbm5vdCBiZSBsb2FkZWQuIFNlZSAjMTc1LlxuICAgICAgICBsZXQganNjc0NvbmZpZyA9IG92ZXJyaWRlT3B0aW9ucyB8fCBPYmplY3QuYXNzaWduKHt9LCBvcHRpb25zLCBjb25maWcpO1xuICAgICAgICBpZiAoIWpzY3NDb25maWcuY29uZmlnUGF0aCAmJiBjb25maWcpIHtcbiAgICAgICAgICBqc2NzQ29uZmlnLmNvbmZpZ1BhdGggPSBjb25maWcuY29uZmlnUGF0aDtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmpzY3MuY29uZmlndXJlKGpzY3NDb25maWcpO1xuXG4gICAgICAgIC8vIFdlIGRvbid0IGhhdmUgYSBjb25maWcgZmlsZSBwcmVzZW50IGluIHByb2plY3QgZGlyZWN0b3J5XG4gICAgICAgIC8vIGxldCdzIHJldHVybiBhbiBlbXB0eSBhcnJheSBvZiBlcnJvcnNcbiAgICAgICAgaWYgKCFjb25maWcgJiYgdGhpcy5vbmx5Q29uZmlnKSByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKFtdKTtcblxuICAgICAgICBjb25zdCB0ZXh0ID0gZWRpdG9yLmdldFRleHQoKTtcbiAgICAgICAgY29uc3QgZXJyb3JzID0gdGhpcy5qc2NzXG4gICAgICAgICAgLmNoZWNrU3RyaW5nKHRleHQsIGZpbGVQYXRoKVxuICAgICAgICAgIC5nZXRFcnJvckxpc3QoKTtcblxuICAgICAgICAvLyBFeGNsdWRlIGBleGNsdWRlRmlsZXNgIGZvciBlcnJvcnNcbiAgICAgICAgdmFyIGV4Y2x1ZGUgPSBnbG9idWxlLmlzTWF0Y2goY29uZmlnICYmIGNvbmZpZy5leGNsdWRlRmlsZXMsIHRoaXMuZ2V0RmlsZVBhdGgoZWRpdG9yLmdldFBhdGgoKSkpO1xuICAgICAgICBpZiAoZXhjbHVkZSkgcmV0dXJuIFByb21pc2UucmVzb2x2ZShbXSk7XG5cbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShlcnJvcnMubWFwKCh7IHJ1bGUsIG1lc3NhZ2UsIGxpbmUsIGNvbHVtbiB9KSA9PiB7XG4gICAgICAgICAgY29uc3QgdHlwZSA9IHRoaXMuZGlzcGxheUFzO1xuICAgICAgICAgIGNvbnN0IGh0bWwgPSBgPHNwYW4gY2xhc3M9J2JhZGdlIGJhZGdlLWZsZXhpYmxlJz4ke3J1bGV9PC9zcGFuPiAke21lc3NhZ2V9YDtcblxuICAgICAgICAgIC8vIFdvcmsgYXJvdW5kIGEgYnVnIGluIGpzY3MgY2F1c2luZyBpdCB0byByZXBvcnQgY29sdW1ucyBwYXN0IHRoZSBlbmQgb2YgdGhlIGxpbmVcbiAgICAgICAgICBjb25zdCBtYXhDb2wgPSBlZGl0b3IuZ2V0QnVmZmVyKCkubGluZUxlbmd0aEZvclJvdyhsaW5lIC0gMSk7XG4gICAgICAgICAgaWYgKChjb2x1bW4gLSAxKSA+IG1heENvbCkge1xuICAgICAgICAgICAgY29sdW1uID0gbWF4Q29sICsgMTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjb25zdCByYW5nZSA9IGhlbHBlcnMucmFuZ2VGcm9tTGluZU51bWJlcihlZGl0b3IsIGxpbmUgLSAxLCBjb2x1bW4gLSAxKTtcblxuICAgICAgICAgIHJldHVybiB7IHR5cGUsIGh0bWwsIGZpbGVQYXRoLCByYW5nZSB9O1xuICAgICAgICB9KSk7XG4gICAgICB9LFxuICAgIH07XG4gIH1cblxuICBzdGF0aWMgZ2V0RmlsZVBhdGgocGF0aCkge1xuICAgIGNvbnN0IHJlbGF0aXZlID0gYXRvbS5wcm9qZWN0LnJlbGF0aXZpemVQYXRoKHBhdGgpO1xuICAgIHJldHVybiByZWxhdGl2ZVsxXTtcbiAgfVxuXG4gIHN0YXRpYyBnZXRDb25maWcoZmlsZVBhdGgpIHtcbiAgICBpZiAocGF0aC5pc0Fic29sdXRlKHRoaXMuY29uZmlnUGF0aCkpIHtcbiAgICAgIHJldHVybiBjb25maWdGaWxlLmxvYWQoZmFsc2UsIHRoaXMuY29uZmlnUGF0aCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNvbmZpZ0ZpbGUubG9hZChmYWxzZSxcbiAgICAgIHBhdGguam9pbihwYXRoLmRpcm5hbWUoZmlsZVBhdGgpLCB0aGlzLmNvbmZpZ1BhdGgpKTtcbiAgfVxuXG4gIHN0YXRpYyBmaXhTdHJpbmcoZWRpdG9yKSB7XG4gICAgY29uc3QgZWRpdG9yUGF0aCA9IGVkaXRvci5nZXRQYXRoKCk7XG4gICAgY29uc3QgZWRpdG9yVGV4dCA9IGVkaXRvci5nZXRUZXh0KCk7XG5cbiAgICBjb25zdCBjb25maWcgPSB0aGlzLmdldENvbmZpZyhlZGl0b3JQYXRoKTtcbiAgICBpZiAoIWNvbmZpZyAmJiB0aGlzLm9ubHlDb25maWcpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBmaXhlZFRleHQgPSB0aGlzLmpzY3MuZml4U3RyaW5nKGVkaXRvclRleHQsIGVkaXRvclBhdGgpLm91dHB1dDtcbiAgICBpZiAoZWRpdG9yVGV4dCA9PT0gZml4ZWRUZXh0KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgY3Vyc29yUG9zaXRpb24gPSBlZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKTtcbiAgICBlZGl0b3Iuc2V0VGV4dChmaXhlZFRleHQpO1xuICAgIGVkaXRvci5zZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbihjdXJzb3JQb3NpdGlvbik7XG4gIH1cbn07XG4iXX0=
//# sourceURL=/home/cin_chalic/.atom/packages/linter-jscs/src/linter-jscs.js
