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

var _jscsLibExtractJs = require('jscs/lib/extract-js');

var _jscsLibExtractJs2 = _interopRequireDefault(_jscsLibExtractJs);

var _globule = require('globule');

var _globule2 = _interopRequireDefault(_globule);

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var _atom = require('atom');

'use babel';

var grammarScopes = ['source.js', 'source.js.jsx', 'text.html.basic'];

var LinterJSCS = (function () {
  function LinterJSCS() {
    _classCallCheck(this, LinterJSCS);
  }

  _createClass(LinterJSCS, null, [{
    key: 'activate',
    value: function activate() {
      var _this = this;

      // Install dependencies using atom-package-deps
      require('atom-package-deps').install('linter-jscs');

      this.subscriptions = new _atom.CompositeDisposable();

      this.subscriptions.add(atom.config.observe('linter-jscs.preset', function (preset) {
        _this.preset = preset;
      }));

      this.subscriptions.add(atom.config.observe('linter-jscs.esnext', function (esnext) {
        _this.esnext = esnext;
      }));

      this.subscriptions.add(atom.config.observe('linter-jscs.onlyConfig', function (onlyConfig) {
        _this.onlyConfig = onlyConfig;
      }));

      this.subscriptions.add(atom.config.observe('linter-jscs.fixOnSave', function (fixOnSave) {
        _this.fixOnSave = fixOnSave;
      }));

      this.subscriptions.add(atom.config.observe('linter-jscs.displayAs', function (displayAs) {
        _this.displayAs = displayAs;
      }));

      this.subscriptions.add(atom.config.observe('linter-jscs.configPath', function (configPath) {
        _this.configPath = configPath;
      }));

      this.subscriptions.add(atom.workspace.observeTextEditors(function (editor) {
        editor.getBuffer().onWillSave(function () {
          if (grammarScopes.indexOf(editor.getGrammar().scopeName) !== -1 || _this.testFixOnSave) {
            // Exclude `excludeFiles` for fix on save
            var config = _this.getConfig(editor.getPath());
            var exclude = _globule2['default'].isMatch(config && config.excludeFiles, _this.getFilePath(editor.getPath()));

            if (_this.fixOnSave && !exclude || _this.testFixOnSave) {
              _this.fixString(editor);
            }
          }
        });
      }));

      this.subscriptions.add(atom.commands.add('atom-text-editor', {
        'linter-jscs:fix-file': function linterJscsFixFile() {
          var textEditor = atom.workspace.getActiveTextEditor();

          if (!textEditor) {
            atom.notifications.addError('Linter-jscs: invalid textEditor received, aborting.');
            return;
          }

          _this.fixString(textEditor);
        }
      }));
    }
  }, {
    key: 'deactivate',
    value: function deactivate() {
      this.subscriptions.dispose();
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

          var filePath = editor.getPath();

          // We need re-initialize JSCS before every lint
          // or it will looses the errors, didn't trace the error
          // must be something with new 2.0.0 JSCS
          _this2.jscs = new JSCS();
          _this2.jscs.registerDefaultRules();
          var config = _this2.getConfig(filePath);

          // We don't have a config file present in project directory
          // let's return an empty array of errors
          if (!config) return Promise.resolve([]);

          var jscsConfig = overrideOptions || config;
          _this2.jscs.configure(jscsConfig);

          var text = editor.getText();
          var scope = editor.getGrammar().scopeName;

          var errors = undefined;
          // text.plain.null-grammar is temp for tests
          if (scope === 'text.html.basic' || scope === 'text.plain.null-grammar') {
            (function () {
              var result = (0, _jscsLibExtractJs2['default'])(filePath, text);

              result.sources.forEach(function (script) {
                _this2.jscs.checkString(script.source, filePath).getErrorList().forEach(function (error) {
                  var err = error;
                  err.line += script.line;
                  err.column += script.offset;
                  result.addError(err);
                });
              }, _this2);

              errors = result.errors.getErrorList();
            })();
          } else {
            errors = _this2.jscs.checkString(text, filePath).getErrorList();
          }

          // Exclude `excludeFiles` for errors
          var exclude = _globule2['default'].isMatch(config && config.excludeFiles, _this2.getFilePath(editor.getPath()));
          if (exclude) {
            return Promise.resolve([]);
          }

          return Promise.resolve(errors.map(function (_ref) {
            var rule = _ref.rule;
            var message = _ref.message;
            var line = _ref.line;
            var column = _ref.column;

            var type = _this2.displayAs;
            var html = '<span class=\'badge badge-flexible\'>' + rule + '</span> ' + message;

            /* Work around a bug in esprima causing jscs to report columns past
             * the end of the line. This is fixed in esprima@2.7.2, but as jscs
             * only depends on "~2.7.0" we need to wait on a jscs release depending
             * on a later version till this can be removed.
             * Ref: https://github.com/jquery/esprima/issues/1457
             * TODO: Remove when jscs updates
             */
            var col = column;
            var maxCol = editor.getBuffer().lineLengthForRow(line - 1);
            if (col - 1 > maxCol) {
              col = maxCol + 1;
            }

            var range = helpers.rangeFromLineNumber(editor, line - 1, col - 1);

            return { type: type, html: html, filePath: filePath, range: range };
          }));
        }
      };
    }
  }, {
    key: 'getFilePath',
    value: function getFilePath(file) {
      var relative = atom.project.relativizePath(file);
      return relative[1];
    }
  }, {
    key: 'getConfig',
    value: function getConfig(filePath) {
      var config = undefined;
      if (_path2['default'].isAbsolute(this.configPath)) {
        config = _jscsLibCliConfig2['default'].load(false, this.configPath);
      } else {
        config = _jscsLibCliConfig2['default'].load(false, _path2['default'].join(_path2['default'].dirname(filePath), this.configPath));
      }

      if (!config && this.onlyConfig) {
        return undefined;
      }

      // Options passed to `jscs` from package configuration
      var options = { esnext: this.esnext };
      var newConfig = (0, _objectAssign2['default'])(options, config || { preset: this.preset });
      // `configPath` is non-enumerable so `Object.assign` won't copy it.
      // Without a proper `configPath` JSCS plugs cannot be loaded. See #175.
      if (!newConfig.configPath && config && config.configPath) {
        newConfig.configPath = config.configPath;
      }
      return newConfig;
    }
  }, {
    key: 'fixString',
    value: function fixString(editor) {
      var editorPath = editor.getPath();
      var editorText = editor.getText();

      var config = this.getConfig(editorPath);
      if (!config) {
        return;
      }

      var JSCS = require('jscs');

      // We need re-initialize JSCS before every lint
      // or it will looses the errors, didn't trace the error
      // must be something with new 2.0.0 JSCS
      this.jscs = new JSCS();
      this.jscs.registerDefaultRules();
      this.jscs.configure(config);

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
        description: 'Attempts to parse your code as ES6+, JSX, and Flow using ' + 'the babel-jscs package as the parser.',
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
        'enum': ['error', 'warning']
      },
      configPath: {
        title: 'Config file path (Absolute or relative path to your project)',
        type: 'string',
        'default': ''
      }
    },
    enumerable: true
  }]);

  return LinterJSCS;
})();

exports['default'] = LinterJSCS;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGludGVyLWpzY3Mvc3JjL2xpbnRlci1qc2NzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7b0JBRWlCLE1BQU07Ozs7Z0NBQ0EscUJBQXFCOzs7O2dDQUN0QixxQkFBcUI7Ozs7dUJBQ3ZCLFNBQVM7Ozs7NEJBQ0osZUFBZTs7OztvQkFDSixNQUFNOztBQVAxQyxXQUFXLENBQUM7O0FBU1osSUFBTSxhQUFhLEdBQUcsQ0FBQyxXQUFXLEVBQUUsZUFBZSxFQUFFLGlCQUFpQixDQUFDLENBQUM7O0lBRW5ELFVBQVU7V0FBVixVQUFVOzBCQUFWLFVBQVU7OztlQUFWLFVBQVU7O1dBMkNkLG9CQUFHOzs7O0FBRWhCLGFBQU8sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQzs7QUFFcEQsVUFBSSxDQUFDLGFBQWEsR0FBRywrQkFBdUIsQ0FBQzs7QUFFN0MsVUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsb0JBQW9CLEVBQUUsVUFBQyxNQUFNLEVBQUs7QUFDM0UsY0FBSyxNQUFNLEdBQUcsTUFBTSxDQUFDO09BQ3RCLENBQUMsQ0FBQyxDQUFDOztBQUVKLFVBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLG9CQUFvQixFQUFFLFVBQUMsTUFBTSxFQUFLO0FBQzNFLGNBQUssTUFBTSxHQUFHLE1BQU0sQ0FBQztPQUN0QixDQUFDLENBQUMsQ0FBQzs7QUFFSixVQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyx3QkFBd0IsRUFBRSxVQUFDLFVBQVUsRUFBSztBQUNuRixjQUFLLFVBQVUsR0FBRyxVQUFVLENBQUM7T0FDOUIsQ0FBQyxDQUFDLENBQUM7O0FBRUosVUFBSSxDQUFD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LFFBQVEsQ0FDdkQ7T0FDRjtBQUNELFlBQU0sRUFBRTtBQUNOLG1CQUFXLEVBQUUsMkRBQTJELEdBQ3RFLHVDQUF1QztBQUN6QyxZQUFJLEVBQUUsU0FBUztBQUNmLG1CQUFTLEtBQUs7T0FDZjtBQUNELGdCQUFVLEVBQUU7QUFDVixhQUFLLEVBQUUsYUFBYTtBQUNwQixtQkFBVyxFQUFFLGlFQUFpRTtBQUM5RSxZQUFJLEVBQUUsU0FBUztBQUNmLG1CQUFTLEtBQUs7T0FDZjtBQUNELGVBQVMsRUFBRTtBQUNULGFBQUssRUFBRSxhQUFhO0FBQ3BCLG1CQUFXLEVBQUUsd0JBQXdCO0FBQ3JDLFlBQUksRUFBRSxTQUFTO0FBQ2YsbUJBQVMsS0FBSztPQUNmO0FBQ0QsZUFBUyxFQUFFO0FBQ1QsYUFBSyxFQUFFLG1CQUFtQjtBQUMxQixZQUFJLEVBQUUsUUFBUTtBQUNkLG1CQUFTLE9BQU87QUFDaEIsZ0JBQU0sQ0FBQyxPQUFPLEVBQUUsU0FBUyxDQUFDO09BQzNCO0FBQ0QsZ0JBQVUsRUFBRTtBQUNWLGFBQUssRUFBRSw4REFBOEQ7QUFDckUsWUFBSSxFQUFFLFFBQVE7QUFDZCxtQkFBUyxFQUFFO09BQ1o7S0FDRjs7OztTQXpDa0IsVUFBVTs7O3FCQUFWLFVBQVUiLCJmaWxlIjoiL2hvbWUvY2luX2NoYWxpYy8uYXRvbS9wYWNrYWdlcy9saW50ZXItanNjcy9zcmMvbGludGVyLWpzY3MuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgY29uZmlnRmlsZSBmcm9tICdqc2NzL2xpYi9jbGktY29uZmlnJztcbmltcG9ydCBleHRyYWN0SnMgZnJvbSAnanNjcy9saWIvZXh0cmFjdC1qcyc7XG5pbXBvcnQgZ2xvYnVsZSBmcm9tICdnbG9idWxlJztcbmltcG9ydCBvYmplY3RBc3NpZ24gZnJvbSAnb2JqZWN0LWFzc2lnbic7XG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlIH0gZnJvbSAnYXRvbSc7XG5cbmNvbnN0IGdyYW1tYXJTY29wZXMgPSBbJ3NvdXJjZS5qcycsICdzb3VyY2UuanMuanN4JywgJ3RleHQuaHRtbC5iYXNpYyddO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMaW50ZXJKU0NTIHtcbiAgc3RhdGljIGNvbmZpZyA9IHtcbiAgICBwcmVzZXQ6IHtcbiAgICAgIHRpdGxlOiAnUHJlc2V0JyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnUHJlc2V0IG9wdGlvbiBpcyBpZ25vcmVkIGlmIGEgY29uZmlnIGZpbGUgaXMgZm91bmQgZm9yIHRoZSBsaW50ZXIuJyxcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgZGVmYXVsdDogJ2FpcmJuYicsXG4gICAgICBlbnVtOiBbXG4gICAgICAgICdhaXJibmInLCAnY3JvY2tmb3JkJywgJ2dvb2dsZScsICdncnVudCcsICdpZGlvbWF0aWMnLCAnanF1ZXJ5JywgJ21kY3MnLFxuICAgICAgICAnbm9kZS1zdHlsZS1ndWlkZScsICd3aWtpbWVkaWEnLCAnd29yZHByZXNzJywgJ3lhbmRleCcsXG4gICAgICBdLFxuICAgIH0sXG4gICAgZXNuZXh0OiB7XG4gICAgICBkZXNjcmlwdGlvbjogJ0F0dGVtcHRzIHRvIHBhcnNlIHlvdXIgY29kZSBhcyBFUzYrLCBKU1gsIGFuZCBGbG93IHVzaW5nICcgK1xuICAgICAgICAndGhlIGJhYmVsLWpzY3MgcGFja2FnZSBhcyB0aGUgcGFyc2VyLicsXG4gICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICB9LFxuICAgIG9ubHlDb25maWc6IHtcbiAgICAgIHRpdGxlOiAnT25seSBDb25maWcnLFxuICAgICAgZGVzY3JpcHRpb246ICdEaXNhYmxlIGxpbnRlciBpZiB0aGVyZSBpcyBubyBjb25maWcgZmlsZSBmb3VuZCBmb3IgdGhlIGxpbnRlci4nLFxuICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgZGVmYXVsdDogZmFsc2UsXG4gICAgfSxcbiAgICBmaXhPblNhdmU6IHtcbiAgICAgIHRpdGxlOiAnRml4IG9uIHNhdmUnLFxuICAgICAgZGVzY3JpcHRpb246ICdGaXggSmF2YVNjcmlwdCBvbiBzYXZlJyxcbiAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgIH0sXG4gICAgZGlzcGxheUFzOiB7XG4gICAgICB0aXRsZTogJ0Rpc3BsYXkgZXJyb3JzIGFzJyxcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgZGVmYXVsdDogJ2Vycm9yJyxcbiAgICAgIGVudW06IFsnZXJyb3InLCAnd2FybmluZyddLFxuICAgIH0sXG4gICAgY29uZmlnUGF0aDoge1xuICAgICAgdGl0bGU6ICdDb25maWcgZmlsZSBwYXRoIChBYnNvbHV0ZSBvciByZWxhdGl2ZSBwYXRoIHRvIHlvdXIgcHJvamVjdCknLFxuICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICBkZWZhdWx0OiAnJyxcbiAgICB9LFxuICB9O1xuXG4gIHN0YXRpYyBhY3RpdmF0ZSgpIHtcbiAgICAvLyBJbnN0YWxsIGRlcGVuZGVuY2llcyB1c2luZyBhdG9tLXBhY2thZ2UtZGVwc1xuICAgIHJlcXVpcmUoJ2F0b20tcGFja2FnZS1kZXBzJykuaW5zdGFsbCgnbGludGVyLWpzY3MnKTtcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlO1xuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXItanNjcy5wcmVzZXQnLCAocHJlc2V0KSA9PiB7XG4gICAgICB0aGlzLnByZXNldCA9IHByZXNldDtcbiAgICB9KSk7XG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci1qc2NzLmVzbmV4dCcsIChlc25leHQpID0+IHtcbiAgICAgIHRoaXMuZXNuZXh0ID0gZXNuZXh0O1xuICAgIH0pKTtcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLWpzY3Mub25seUNvbmZpZycsIChvbmx5Q29uZmlnKSA9PiB7XG4gICAgICB0aGlzLm9ubHlDb25maWcgPSBvbmx5Q29uZmlnO1xuICAgIH0pKTtcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLWpzY3MuZml4T25TYXZlJywgKGZpeE9uU2F2ZSkgPT4ge1xuICAgICAgdGhpcy5maXhPblNhdmUgPSBmaXhPblNhdmU7XG4gICAgfSkpO1xuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXItanNjcy5kaXNwbGF5QXMnLCAoZGlzcGxheUFzKSA9PiB7XG4gICAgICB0aGlzLmRpc3BsYXlBcyA9IGRpc3BsYXlBcztcbiAgICB9KSk7XG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci1qc2NzLmNvbmZpZ1BhdGgnLCAoY29uZmlnUGF0aCkgPT4ge1xuICAgICAgdGhpcy5jb25maWdQYXRoID0gY29uZmlnUGF0aDtcbiAgICB9KSk7XG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20ud29ya3NwYWNlLm9ic2VydmVUZXh0RWRpdG9ycygoZWRpdG9yKSA9PiB7XG4gICAgICBlZGl0b3IuZ2V0QnVmZmVyKCkub25XaWxsU2F2ZSgoKSA9PiB7XG4gICAgICAgIGlmIChncmFtbWFyU2NvcGVzLmluZGV4T2YoZWRpdG9yLmdldEdyYW1tYXIoKS5zY29wZU5hbWUpICE9PSAtMSB8fCB0aGlzLnRlc3RGaXhPblNhdmUpIHtcbiAgICAgICAgICAvLyBFeGNsdWRlIGBleGNsdWRlRmlsZXNgIGZvciBmaXggb24gc2F2ZVxuICAgICAgICAgIGNvbnN0IGNvbmZpZyA9IHRoaXMuZ2V0Q29uZmlnKGVkaXRvci5nZXRQYXRoKCkpO1xuICAgICAgICAgIGNvbnN0IGV4Y2x1ZGUgPSBnbG9idWxlLmlzTWF0Y2goXG4gICAgICAgICAgICBjb25maWcgJiYgY29uZmlnLmV4Y2x1ZGVGaWxlcywgdGhpcy5nZXRGaWxlUGF0aChlZGl0b3IuZ2V0UGF0aCgpKVxuICAgICAgICAgICk7XG5cbiAgICAgICAgICBpZiAoKHRoaXMuZml4T25TYXZlICYmICFleGNsdWRlKSB8fCB0aGlzLnRlc3RGaXhPblNhdmUpIHtcbiAgICAgICAgICAgIHRoaXMuZml4U3RyaW5nKGVkaXRvcik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KSk7XG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXRleHQtZWRpdG9yJywge1xuICAgICAgJ2xpbnRlci1qc2NzOmZpeC1maWxlJzogKCkgPT4ge1xuICAgICAgICBjb25zdCB0ZXh0RWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpO1xuXG4gICAgICAgIGlmICghdGV4dEVkaXRvcikge1xuICAgICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcignTGludGVyLWpzY3M6IGludmFsaWQgdGV4dEVkaXRvciByZWNlaXZlZCwgYWJvcnRpbmcuJyk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5maXhTdHJpbmcodGV4dEVkaXRvcik7XG4gICAgICB9LFxuICAgIH0pKTtcbiAgfVxuXG4gIHN0YXRpYyBkZWFjdGl2YXRlKCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKCk7XG4gIH1cblxuICBzdGF0aWMgcHJvdmlkZUxpbnRlcigpIHtcbiAgICBjb25zdCBoZWxwZXJzID0gcmVxdWlyZSgnYXRvbS1saW50ZXInKTtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZTogJ0pTQ1MnLFxuICAgICAgZ3JhbW1hclNjb3BlcyxcbiAgICAgIHNjb3BlOiAnZmlsZScsXG4gICAgICBsaW50T25GbHk6IHRydWUsXG4gICAgICBsaW50OiAoZWRpdG9yLCBvcHRzLCBvdmVycmlkZU9wdGlvbnMsIHRlc3RGaXhPblNhdmUpID0+IHtcbiAgICAgICAgY29uc3QgSlNDUyA9IHJlcXVpcmUoJ2pzY3MnKTtcblxuICAgICAgICB0aGlzLnRlc3RGaXhPblNhdmUgPSB0ZXN0Rml4T25TYXZlO1xuXG4gICAgICAgIGNvbnN0IGZpbGVQYXRoID0gZWRpdG9yLmdldFBhdGgoKTtcblxuICAgICAgICAvLyBXZSBuZWVkIHJlLWluaXRpYWxpemUgSlNDUyBiZWZvcmUgZXZlcnkgbGludFxuICAgICAgICAvLyBvciBpdCB3aWxsIGxvb3NlcyB0aGUgZXJyb3JzLCBkaWRuJ3QgdHJhY2UgdGhlIGVycm9yXG4gICAgICAgIC8vIG11c3QgYmUgc29tZXRoaW5nIHdpdGggbmV3IDIuMC4wIEpTQ1NcbiAgICAgICAgdGhpcy5qc2NzID0gbmV3IEpTQ1MoKTtcbiAgICAgICAgdGhpcy5qc2NzLnJlZ2lzdGVyRGVmYXVsdFJ1bGVzKCk7XG4gICAgICAgIGNvbnN0IGNvbmZpZyA9IHRoaXMuZ2V0Q29uZmlnKGZpbGVQYXRoKTtcblxuICAgICAgICAvLyBXZSBkb24ndCBoYXZlIGEgY29uZmlnIGZpbGUgcHJlc2VudCBpbiBwcm9qZWN0IGRpcmVjdG9yeVxuICAgICAgICAvLyBsZXQncyByZXR1cm4gYW4gZW1wdHkgYXJyYXkgb2YgZXJyb3JzXG4gICAgICAgIGlmICghY29uZmlnKSByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKFtdKTtcblxuICAgICAgICBjb25zdCBqc2NzQ29uZmlnID0gb3ZlcnJpZGVPcHRpb25zIHx8IGNvbmZpZztcbiAgICAgICAgdGhpcy5qc2NzLmNvbmZpZ3VyZShqc2NzQ29uZmlnKTtcblxuICAgICAgICBjb25zdCB0ZXh0ID0gZWRpdG9yLmdldFRleHQoKTtcbiAgICAgICAgY29uc3Qgc2NvcGUgPSBlZGl0b3IuZ2V0R3JhbW1hcigpLnNjb3BlTmFtZTtcblxuICAgICAgICBsZXQgZXJyb3JzO1xuICAgICAgICAvLyB0ZXh0LnBsYWluLm51bGwtZ3JhbW1hciBpcyB0ZW1wIGZvciB0ZXN0c1xuICAgICAgICBpZiAoc2NvcGUgPT09ICd0ZXh0Lmh0bWwuYmFzaWMnIHx8IHNjb3BlID09PSAndGV4dC5wbGFpbi5udWxsLWdyYW1tYXInKSB7XG4gICAgICAgICAgY29uc3QgcmVzdWx0ID0gZXh0cmFjdEpzKGZpbGVQYXRoLCB0ZXh0KTtcblxuICAgICAgICAgIHJlc3VsdC5zb3VyY2VzLmZvckVhY2goKHNjcmlwdCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5qc2NzLmNoZWNrU3RyaW5nKHNjcmlwdC5zb3VyY2UsIGZpbGVQYXRoKS5nZXRFcnJvckxpc3QoKS5mb3JFYWNoKChlcnJvcikgPT4ge1xuICAgICAgICAgICAgICBjb25zdCBlcnIgPSBlcnJvcjtcbiAgICAgICAgICAgICAgZXJyLmxpbmUgKz0gc2NyaXB0LmxpbmU7XG4gICAgICAgICAgICAgIGVyci5jb2x1bW4gKz0gc2NyaXB0Lm9mZnNldDtcbiAgICAgICAgICAgICAgcmVzdWx0LmFkZEVycm9yKGVycik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9LCB0aGlzKTtcblxuICAgICAgICAgIGVycm9ycyA9IHJlc3VsdC5lcnJvcnMuZ2V0RXJyb3JMaXN0KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZXJyb3JzID0gdGhpcy5qc2NzXG4gICAgICAgICAgICAuY2hlY2tTdHJpbmcodGV4dCwgZmlsZVBhdGgpXG4gICAgICAgICAgICAuZ2V0RXJyb3JMaXN0KCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBFeGNsdWRlIGBleGNsdWRlRmlsZXNgIGZvciBlcnJvcnNcbiAgICAgICAgY29uc3QgZXhjbHVkZSA9IGdsb2J1bGUuaXNNYXRjaChcbiAgICAgICAgICBjb25maWcgJiYgY29uZmlnLmV4Y2x1ZGVGaWxlcywgdGhpcy5nZXRGaWxlUGF0aChlZGl0b3IuZ2V0UGF0aCgpKVxuICAgICAgICApO1xuICAgICAgICBpZiAoZXhjbHVkZSkge1xuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoW10pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShlcnJvcnMubWFwKCh7IHJ1bGUsIG1lc3NhZ2UsIGxpbmUsIGNvbHVtbiB9KSA9PiB7XG4gICAgICAgICAgY29uc3QgdHlwZSA9IHRoaXMuZGlzcGxheUFzO1xuICAgICAgICAgIGNvbnN0IGh0bWwgPSBgPHNwYW4gY2xhc3M9J2JhZGdlIGJhZGdlLWZsZXhpYmxlJz4ke3J1bGV9PC9zcGFuPiAke21lc3NhZ2V9YDtcblxuICAgICAgICAgIC8qIFdvcmsgYXJvdW5kIGEgYnVnIGluIGVzcHJpbWEgY2F1c2luZyBqc2NzIHRvIHJlcG9ydCBjb2x1bW5zIHBhc3RcbiAgICAgICAgICAgKiB0aGUgZW5kIG9mIHRoZSBsaW5lLiBUaGlzIGlzIGZpeGVkIGluIGVzcHJpbWFAMi43LjIsIGJ1dCBhcyBqc2NzXG4gICAgICAgICAgICogb25seSBkZXBlbmRzIG9uIFwifjIuNy4wXCIgd2UgbmVlZCB0byB3YWl0IG9uIGEganNjcyByZWxlYXNlIGRlcGVuZGluZ1xuICAgICAgICAgICAqIG9uIGEgbGF0ZXIgdmVyc2lvbiB0aWxsIHRoaXMgY2FuIGJlIHJlbW92ZWQuXG4gICAgICAgICAgICogUmVmOiBodHRwczovL2dpdGh1Yi5jb20vanF1ZXJ5L2VzcHJpbWEvaXNzdWVzLzE0NTdcbiAgICAgICAgICAgKiBUT0RPOiBSZW1vdmUgd2hlbiBqc2NzIHVwZGF0ZXNcbiAgICAgICAgICAgKi9cbiAgICAgICAgICBsZXQgY29sID0gY29sdW1uO1xuICAgICAgICAgIGNvbnN0IG1heENvbCA9IGVkaXRvci5nZXRCdWZmZXIoKS5saW5lTGVuZ3RoRm9yUm93KGxpbmUgLSAxKTtcbiAgICAgICAgICBpZiAoKGNvbCAtIDEpID4gbWF4Q29sKSB7XG4gICAgICAgICAgICBjb2wgPSBtYXhDb2wgKyAxO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbnN0IHJhbmdlID0gaGVscGVycy5yYW5nZUZyb21MaW5lTnVtYmVyKGVkaXRvciwgbGluZSAtIDEsIGNvbCAtIDEpO1xuXG4gICAgICAgICAgcmV0dXJuIHsgdHlwZSwgaHRtbCwgZmlsZVBhdGgsIHJhbmdlIH07XG4gICAgICAgIH0pKTtcbiAgICAgIH0sXG4gICAgfTtcbiAgfVxuXG4gIHN0YXRpYyBnZXRGaWxlUGF0aChmaWxlKSB7XG4gICAgY29uc3QgcmVsYXRpdmUgPSBhdG9tLnByb2plY3QucmVsYXRpdml6ZVBhdGgoZmlsZSk7XG4gICAgcmV0dXJuIHJlbGF0aXZlWzFdO1xuICB9XG5cbiAgc3RhdGljIGdldENvbmZpZyhmaWxlUGF0aCkge1xuICAgIGxldCBjb25maWc7XG4gICAgaWYgKHBhdGguaXNBYnNvbHV0ZSh0aGlzLmNvbmZpZ1BhdGgpKSB7XG4gICAgICBjb25maWcgPSBjb25maWdGaWxlLmxvYWQoZmFsc2UsIHRoaXMuY29uZmlnUGF0aCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbmZpZyA9IGNvbmZpZ0ZpbGUubG9hZChmYWxzZSxcbiAgICAgICAgcGF0aC5qb2luKHBhdGguZGlybmFtZShmaWxlUGF0aCksIHRoaXMuY29uZmlnUGF0aCkpO1xuICAgIH1cblxuICAgIGlmICghY29uZmlnICYmIHRoaXMub25seUNvbmZpZykge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICAvLyBPcHRpb25zIHBhc3NlZCB0byBganNjc2AgZnJvbSBwYWNrYWdlIGNvbmZpZ3VyYXRpb25cbiAgICBjb25zdCBvcHRpb25zID0geyBlc25leHQ6IHRoaXMuZXNuZXh0IH07XG4gICAgY29uc3QgbmV3Q29uZmlnID0gb2JqZWN0QXNzaWduKFxuICAgICAgb3B0aW9ucyxcbiAgICAgIGNvbmZpZyB8fCB7IHByZXNldDogdGhpcy5wcmVzZXQgfVxuICAgICk7XG4gICAgLy8gYGNvbmZpZ1BhdGhgIGlzIG5vbi1lbnVtZXJhYmxlIHNvIGBPYmplY3QuYXNzaWduYCB3b24ndCBjb3B5IGl0LlxuICAgIC8vIFdpdGhvdXQgYSBwcm9wZXIgYGNvbmZpZ1BhdGhgIEpTQ1MgcGx1Z3MgY2Fubm90IGJlIGxvYWRlZC4gU2VlICMxNzUuXG4gICAgaWYgKCFuZXdDb25maWcuY29uZmlnUGF0aCAmJiBjb25maWcgJiYgY29uZmlnLmNvbmZpZ1BhdGgpIHtcbiAgICAgIG5ld0NvbmZpZy5jb25maWdQYXRoID0gY29uZmlnLmNvbmZpZ1BhdGg7XG4gICAgfVxuICAgIHJldHVybiBuZXdDb25maWc7XG4gIH1cblxuICBzdGF0aWMgZml4U3RyaW5nKGVkaXRvcikge1xuICAgIGNvbnN0IGVkaXRvclBhdGggPSBlZGl0b3IuZ2V0UGF0aCgpO1xuICAgIGNvbnN0IGVkaXRvclRleHQgPSBlZGl0b3IuZ2V0VGV4dCgpO1xuXG4gICAgY29uc3QgY29uZmlnID0gdGhpcy5nZXRDb25maWcoZWRpdG9yUGF0aCk7XG4gICAgaWYgKCFjb25maWcpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBKU0NTID0gcmVxdWlyZSgnanNjcycpO1xuXG4gICAgLy8gV2UgbmVlZCByZS1pbml0aWFsaXplIEpTQ1MgYmVmb3JlIGV2ZXJ5IGxpbnRcbiAgICAvLyBvciBpdCB3aWxsIGxvb3NlcyB0aGUgZXJyb3JzLCBkaWRuJ3QgdHJhY2UgdGhlIGVycm9yXG4gICAgLy8gbXVzdCBiZSBzb21ldGhpbmcgd2l0aCBuZXcgMi4wLjAgSlNDU1xuICAgIHRoaXMuanNjcyA9IG5ldyBKU0NTKCk7XG4gICAgdGhpcy5qc2NzLnJlZ2lzdGVyRGVmYXVsdFJ1bGVzKCk7XG4gICAgdGhpcy5qc2NzLmNvbmZpZ3VyZShjb25maWcpO1xuXG4gICAgY29uc3QgZml4ZWRUZXh0ID0gdGhpcy5qc2NzLmZpeFN0cmluZyhlZGl0b3JUZXh0LCBlZGl0b3JQYXRoKS5vdXRwdXQ7XG4gICAgaWYgKGVkaXRvclRleHQgPT09IGZpeGVkVGV4dCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGN1cnNvclBvc2l0aW9uID0gZWRpdG9yLmdldEN1cnNvclNjcmVlblBvc2l0aW9uKCk7XG4gICAgZWRpdG9yLnNldFRleHQoZml4ZWRUZXh0KTtcbiAgICBlZGl0b3Iuc2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oY3Vyc29yUG9zaXRpb24pO1xuICB9XG59XG4iXX0=
//# sourceURL=/home/cin_chalic/.atom/packages/linter-jscs/src/linter-jscs.js
