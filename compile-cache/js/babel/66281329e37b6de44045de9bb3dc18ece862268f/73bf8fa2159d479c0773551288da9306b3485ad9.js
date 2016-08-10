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
            // TODO: Remove this when https://github.com/jscs-dev/node-jscs/issues/2235 has been addressed
            var cleanMessage = message.replace(rule + ': ', '');
            var html = '<span class=\'badge badge-flexible\'>' + rule + '</span> ' + cleanMessage;
            var range = helpers.rangeFromLineNumber(editor, line - 1, column - 1);

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
      var options = {};
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGludGVyLWpzY3Mvc3JjL2xpbnRlci1qc2NzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7b0JBRWlCLE1BQU07Ozs7Z0NBQ0EscUJBQXFCOzs7O2dDQUN0QixxQkFBcUI7Ozs7dUJBQ3ZCLFNBQVM7Ozs7NEJBQ0osZUFBZTs7OztvQkFDSixNQUFNOztBQVAxQyxXQUFXLENBQUM7O0FBU1osSUFBTSxhQUFhLEdBQUcsQ0FBQyxXQUFXLEVBQUUsZUFBZSxFQUFFLGlCQUFpQixDQUFDLENBQUM7O0lBRW5ELFVBQVU7V0FBVixVQUFVOzBCQUFWLFVBQVU7OztlQUFWLFVBQVU7O1dBMkNkLG9CQUFHOzs7O0FBRWhCLGFBQU8sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQzs7QUFFcEQsVUFBSSxDQUFDLGFBQWEsR0FBRywrQkFBdUIsQ0FBQzs7QUFFN0MsVUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsb0JBQW9CLEVBQUUsVUFBQyxNQUFNLEVBQUs7QUFDM0UsY0FBSyxNQUFNLEdBQUcsTUFBTSxDQUFDO09BQ3RCLENBQUMsQ0FBQyxDQUFDOztBQUVKLFVBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLG9CQUFvQixFQUFFLFVBQUMsTUFBTSxFQUFLO0FBQzNFLGNBQUssTUFBTSxHQUFHLE1BQU0sQ0FBQztPQUN0QixDQUFDLENBQUMsQ0FBQzs7QUFFSixVQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyx3QkFBd0IsRUFBRSxVQUFDLFVBQVUsRUFBSztBQUNuRixjQUFLLFVBQVUsR0FBRyxVQUFVLENBQUM7T0FDOUIsQ0FBQyxDQUFDLENBQUM7O0FBRUosVUFBSSxDQUFD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WUFBSSxFQUFFLFNBQVM7QUFDZixtQkFBUyxLQUFLO09BQ2Y7QUFDRCxlQUFTLEVBQUU7QUFDVCxhQUFLLEVBQUUsYUFBYTtBQUNwQixtQkFBVyxFQUFFLHdCQUF3QjtBQUNyQyxZQUFJLEVBQUUsU0FBUztBQUNmLG1CQUFTLEtBQUs7T0FDZjtBQUNELGVBQVMsRUFBRTtBQUNULGFBQUssRUFBRSxtQkFBbUI7QUFDMUIsWUFBSSxFQUFFLFFBQVE7QUFDZCxtQkFBUyxPQUFPO0FBQ2hCLGdCQUFNLENBQUMsT0FBTyxFQUFFLFNBQVMsQ0FBQztPQUMzQjtBQUNELGdCQUFVLEVBQUU7QUFDVixhQUFLLEVBQUUsOERBQThEO0FBQ3JFLFlBQUksRUFBRSxRQUFRO0FBQ2QsbUJBQVMsRUFBRTtPQUNaO0tBQ0Y7Ozs7U0F6Q2tCLFVBQVU7OztxQkFBVixVQUFVIiwiZmlsZSI6Ii9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGludGVyLWpzY3Mvc3JjL2xpbnRlci1qc2NzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IGNvbmZpZ0ZpbGUgZnJvbSAnanNjcy9saWIvY2xpLWNvbmZpZyc7XG5pbXBvcnQgZXh0cmFjdEpzIGZyb20gJ2pzY3MvbGliL2V4dHJhY3QtanMnO1xuaW1wb3J0IGdsb2J1bGUgZnJvbSAnZ2xvYnVsZSc7XG5pbXBvcnQgb2JqZWN0QXNzaWduIGZyb20gJ29iamVjdC1hc3NpZ24nO1xuaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSB9IGZyb20gJ2F0b20nO1xuXG5jb25zdCBncmFtbWFyU2NvcGVzID0gWydzb3VyY2UuanMnLCAnc291cmNlLmpzLmpzeCcsICd0ZXh0Lmh0bWwuYmFzaWMnXTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGludGVySlNDUyB7XG4gIHN0YXRpYyBjb25maWcgPSB7XG4gICAgcHJlc2V0OiB7XG4gICAgICB0aXRsZTogJ1ByZXNldCcsXG4gICAgICBkZXNjcmlwdGlvbjogJ1ByZXNldCBvcHRpb24gaXMgaWdub3JlZCBpZiBhIGNvbmZpZyBmaWxlIGlzIGZvdW5kIGZvciB0aGUgbGludGVyLicsXG4gICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgIGRlZmF1bHQ6ICdhaXJibmInLFxuICAgICAgZW51bTogW1xuICAgICAgICAnYWlyYm5iJywgJ2Nyb2NrZm9yZCcsICdnb29nbGUnLCAnZ3J1bnQnLCAnaWRpb21hdGljJywgJ2pxdWVyeScsICdtZGNzJyxcbiAgICAgICAgJ25vZGUtc3R5bGUtZ3VpZGUnLCAnd2lraW1lZGlhJywgJ3dvcmRwcmVzcycsICd5YW5kZXgnLFxuICAgICAgXSxcbiAgICB9LFxuICAgIGVzbmV4dDoge1xuICAgICAgZGVzY3JpcHRpb246ICdBdHRlbXB0cyB0byBwYXJzZSB5b3VyIGNvZGUgYXMgRVM2KywgSlNYLCBhbmQgRmxvdyB1c2luZyAnICtcbiAgICAgICAgJ3RoZSBiYWJlbC1qc2NzIHBhY2thZ2UgYXMgdGhlIHBhcnNlci4nLFxuICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgZGVmYXVsdDogZmFsc2UsXG4gICAgfSxcbiAgICBvbmx5Q29uZmlnOiB7XG4gICAgICB0aXRsZTogJ09ubHkgQ29uZmlnJyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnRGlzYWJsZSBsaW50ZXIgaWYgdGhlcmUgaXMgbm8gY29uZmlnIGZpbGUgZm91bmQgZm9yIHRoZSBsaW50ZXIuJyxcbiAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgIH0sXG4gICAgZml4T25TYXZlOiB7XG4gICAgICB0aXRsZTogJ0ZpeCBvbiBzYXZlJyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnRml4IEphdmFTY3JpcHQgb24gc2F2ZScsXG4gICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICB9LFxuICAgIGRpc3BsYXlBczoge1xuICAgICAgdGl0bGU6ICdEaXNwbGF5IGVycm9ycyBhcycsXG4gICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgIGRlZmF1bHQ6ICdlcnJvcicsXG4gICAgICBlbnVtOiBbJ2Vycm9yJywgJ3dhcm5pbmcnXSxcbiAgICB9LFxuICAgIGNvbmZpZ1BhdGg6IHtcbiAgICAgIHRpdGxlOiAnQ29uZmlnIGZpbGUgcGF0aCAoQWJzb2x1dGUgb3IgcmVsYXRpdmUgcGF0aCB0byB5b3VyIHByb2plY3QpJyxcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgZGVmYXVsdDogJycsXG4gICAgfSxcbiAgfTtcblxuICBzdGF0aWMgYWN0aXZhdGUoKSB7XG4gICAgLy8gSW5zdGFsbCBkZXBlbmRlbmNpZXMgdXNpbmcgYXRvbS1wYWNrYWdlLWRlcHNcbiAgICByZXF1aXJlKCdhdG9tLXBhY2thZ2UtZGVwcycpLmluc3RhbGwoJ2xpbnRlci1qc2NzJyk7XG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZTtcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLWpzY3MucHJlc2V0JywgKHByZXNldCkgPT4ge1xuICAgICAgdGhpcy5wcmVzZXQgPSBwcmVzZXQ7XG4gICAgfSkpO1xuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXItanNjcy5lc25leHQnLCAoZXNuZXh0KSA9PiB7XG4gICAgICB0aGlzLmVzbmV4dCA9IGVzbmV4dDtcbiAgICB9KSk7XG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci1qc2NzLm9ubHlDb25maWcnLCAob25seUNvbmZpZykgPT4ge1xuICAgICAgdGhpcy5vbmx5Q29uZmlnID0gb25seUNvbmZpZztcbiAgICB9KSk7XG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci1qc2NzLmZpeE9uU2F2ZScsIChmaXhPblNhdmUpID0+IHtcbiAgICAgIHRoaXMuZml4T25TYXZlID0gZml4T25TYXZlO1xuICAgIH0pKTtcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLWpzY3MuZGlzcGxheUFzJywgKGRpc3BsYXlBcykgPT4ge1xuICAgICAgdGhpcy5kaXNwbGF5QXMgPSBkaXNwbGF5QXM7XG4gICAgfSkpO1xuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXItanNjcy5jb25maWdQYXRoJywgKGNvbmZpZ1BhdGgpID0+IHtcbiAgICAgIHRoaXMuY29uZmlnUGF0aCA9IGNvbmZpZ1BhdGg7XG4gICAgfSkpO1xuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLndvcmtzcGFjZS5vYnNlcnZlVGV4dEVkaXRvcnMoKGVkaXRvcikgPT4ge1xuICAgICAgZWRpdG9yLmdldEJ1ZmZlcigpLm9uV2lsbFNhdmUoKCkgPT4ge1xuICAgICAgICBpZiAoZ3JhbW1hclNjb3Blcy5pbmRleE9mKGVkaXRvci5nZXRHcmFtbWFyKCkuc2NvcGVOYW1lKSAhPT0gLTEgfHwgdGhpcy50ZXN0Rml4T25TYXZlKSB7XG4gICAgICAgICAgLy8gRXhjbHVkZSBgZXhjbHVkZUZpbGVzYCBmb3IgZml4IG9uIHNhdmVcbiAgICAgICAgICBjb25zdCBjb25maWcgPSB0aGlzLmdldENvbmZpZyhlZGl0b3IuZ2V0UGF0aCgpKTtcbiAgICAgICAgICBjb25zdCBleGNsdWRlID0gZ2xvYnVsZS5pc01hdGNoKFxuICAgICAgICAgICAgY29uZmlnICYmIGNvbmZpZy5leGNsdWRlRmlsZXMsIHRoaXMuZ2V0RmlsZVBhdGgoZWRpdG9yLmdldFBhdGgoKSlcbiAgICAgICAgICApO1xuXG4gICAgICAgICAgaWYgKCh0aGlzLmZpeE9uU2F2ZSAmJiAhZXhjbHVkZSkgfHwgdGhpcy50ZXN0Rml4T25TYXZlKSB7XG4gICAgICAgICAgICB0aGlzLmZpeFN0cmluZyhlZGl0b3IpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSkpO1xuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS10ZXh0LWVkaXRvcicsIHtcbiAgICAgICdsaW50ZXItanNjczpmaXgtZmlsZSc6ICgpID0+IHtcbiAgICAgICAgY29uc3QgdGV4dEVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKTtcblxuICAgICAgICBpZiAoIXRleHRFZGl0b3IpIHtcbiAgICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoJ0xpbnRlci1qc2NzOiBpbnZhbGlkIHRleHRFZGl0b3IgcmVjZWl2ZWQsIGFib3J0aW5nLicpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZml4U3RyaW5nKHRleHRFZGl0b3IpO1xuICAgICAgfSxcbiAgICB9KSk7XG4gIH1cblxuICBzdGF0aWMgZGVhY3RpdmF0ZSgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpO1xuICB9XG5cbiAgc3RhdGljIHByb3ZpZGVMaW50ZXIoKSB7XG4gICAgY29uc3QgaGVscGVycyA9IHJlcXVpcmUoJ2F0b20tbGludGVyJyk7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWU6ICdKU0NTJyxcbiAgICAgIGdyYW1tYXJTY29wZXMsXG4gICAgICBzY29wZTogJ2ZpbGUnLFxuICAgICAgbGludE9uRmx5OiB0cnVlLFxuICAgICAgbGludDogKGVkaXRvciwgb3B0cywgb3ZlcnJpZGVPcHRpb25zLCB0ZXN0Rml4T25TYXZlKSA9PiB7XG4gICAgICAgIGNvbnN0IEpTQ1MgPSByZXF1aXJlKCdqc2NzJyk7XG5cbiAgICAgICAgdGhpcy50ZXN0Rml4T25TYXZlID0gdGVzdEZpeE9uU2F2ZTtcblxuICAgICAgICBjb25zdCBmaWxlUGF0aCA9IGVkaXRvci5nZXRQYXRoKCk7XG5cbiAgICAgICAgLy8gV2UgbmVlZCByZS1pbml0aWFsaXplIEpTQ1MgYmVmb3JlIGV2ZXJ5IGxpbnRcbiAgICAgICAgLy8gb3IgaXQgd2lsbCBsb29zZXMgdGhlIGVycm9ycywgZGlkbid0IHRyYWNlIHRoZSBlcnJvclxuICAgICAgICAvLyBtdXN0IGJlIHNvbWV0aGluZyB3aXRoIG5ldyAyLjAuMCBKU0NTXG4gICAgICAgIHRoaXMuanNjcyA9IG5ldyBKU0NTKCk7XG4gICAgICAgIHRoaXMuanNjcy5yZWdpc3RlckRlZmF1bHRSdWxlcygpO1xuICAgICAgICBjb25zdCBjb25maWcgPSB0aGlzLmdldENvbmZpZyhmaWxlUGF0aCk7XG5cbiAgICAgICAgLy8gV2UgZG9uJ3QgaGF2ZSBhIGNvbmZpZyBmaWxlIHByZXNlbnQgaW4gcHJvamVjdCBkaXJlY3RvcnlcbiAgICAgICAgLy8gbGV0J3MgcmV0dXJuIGFuIGVtcHR5IGFycmF5IG9mIGVycm9yc1xuICAgICAgICBpZiAoIWNvbmZpZykgcmV0dXJuIFByb21pc2UucmVzb2x2ZShbXSk7XG5cbiAgICAgICAgY29uc3QganNjc0NvbmZpZyA9IG92ZXJyaWRlT3B0aW9ucyB8fCBjb25maWc7XG4gICAgICAgIHRoaXMuanNjcy5jb25maWd1cmUoanNjc0NvbmZpZyk7XG5cbiAgICAgICAgY29uc3QgdGV4dCA9IGVkaXRvci5nZXRUZXh0KCk7XG4gICAgICAgIGNvbnN0IHNjb3BlID0gZWRpdG9yLmdldEdyYW1tYXIoKS5zY29wZU5hbWU7XG5cbiAgICAgICAgbGV0IGVycm9ycztcbiAgICAgICAgLy8gdGV4dC5wbGFpbi5udWxsLWdyYW1tYXIgaXMgdGVtcCBmb3IgdGVzdHNcbiAgICAgICAgaWYgKHNjb3BlID09PSAndGV4dC5odG1sLmJhc2ljJyB8fCBzY29wZSA9PT0gJ3RleHQucGxhaW4ubnVsbC1ncmFtbWFyJykge1xuICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGV4dHJhY3RKcyhmaWxlUGF0aCwgdGV4dCk7XG5cbiAgICAgICAgICByZXN1bHQuc291cmNlcy5mb3JFYWNoKChzY3JpcHQpID0+IHtcbiAgICAgICAgICAgIHRoaXMuanNjcy5jaGVja1N0cmluZyhzY3JpcHQuc291cmNlLCBmaWxlUGF0aCkuZ2V0RXJyb3JMaXN0KCkuZm9yRWFjaCgoZXJyb3IpID0+IHtcbiAgICAgICAgICAgICAgY29uc3QgZXJyID0gZXJyb3I7XG4gICAgICAgICAgICAgIGVyci5saW5lICs9IHNjcmlwdC5saW5lO1xuICAgICAgICAgICAgICBlcnIuY29sdW1uICs9IHNjcmlwdC5vZmZzZXQ7XG4gICAgICAgICAgICAgIHJlc3VsdC5hZGRFcnJvcihlcnIpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSwgdGhpcyk7XG5cbiAgICAgICAgICBlcnJvcnMgPSByZXN1bHQuZXJyb3JzLmdldEVycm9yTGlzdCgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGVycm9ycyA9IHRoaXMuanNjc1xuICAgICAgICAgICAgLmNoZWNrU3RyaW5nKHRleHQsIGZpbGVQYXRoKVxuICAgICAgICAgICAgLmdldEVycm9yTGlzdCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gRXhjbHVkZSBgZXhjbHVkZUZpbGVzYCBmb3IgZXJyb3JzXG4gICAgICAgIGNvbnN0IGV4Y2x1ZGUgPSBnbG9idWxlLmlzTWF0Y2goXG4gICAgICAgICAgY29uZmlnICYmIGNvbmZpZy5leGNsdWRlRmlsZXMsIHRoaXMuZ2V0RmlsZVBhdGgoZWRpdG9yLmdldFBhdGgoKSlcbiAgICAgICAgKTtcbiAgICAgICAgaWYgKGV4Y2x1ZGUpIHtcbiAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKFtdKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoZXJyb3JzLm1hcCgoeyBydWxlLCBtZXNzYWdlLCBsaW5lLCBjb2x1bW4gfSkgPT4ge1xuICAgICAgICAgIGNvbnN0IHR5cGUgPSB0aGlzLmRpc3BsYXlBcztcbiAgICAgICAgICAvLyBUT0RPOiBSZW1vdmUgdGhpcyB3aGVuIGh0dHBzOi8vZ2l0aHViLmNvbS9qc2NzLWRldi9ub2RlLWpzY3MvaXNzdWVzLzIyMzUgaGFzIGJlZW4gYWRkcmVzc2VkXG4gICAgICAgICAgY29uc3QgY2xlYW5NZXNzYWdlID0gbWVzc2FnZS5yZXBsYWNlKGAke3J1bGV9OiBgLCAnJyk7XG4gICAgICAgICAgY29uc3QgaHRtbCA9IGA8c3BhbiBjbGFzcz0nYmFkZ2UgYmFkZ2UtZmxleGlibGUnPiR7cnVsZX08L3NwYW4+ICR7Y2xlYW5NZXNzYWdlfWA7XG4gICAgICAgICAgY29uc3QgcmFuZ2UgPSBoZWxwZXJzLnJhbmdlRnJvbUxpbmVOdW1iZXIoZWRpdG9yLCBsaW5lIC0gMSwgY29sdW1uIC0gMSk7XG5cbiAgICAgICAgICByZXR1cm4geyB0eXBlLCBodG1sLCBmaWxlUGF0aCwgcmFuZ2UgfTtcbiAgICAgICAgfSkpO1xuICAgICAgfSxcbiAgICB9O1xuICB9XG5cbiAgc3RhdGljIGdldEZpbGVQYXRoKGZpbGUpIHtcbiAgICBjb25zdCByZWxhdGl2ZSA9IGF0b20ucHJvamVjdC5yZWxhdGl2aXplUGF0aChmaWxlKTtcbiAgICByZXR1cm4gcmVsYXRpdmVbMV07XG4gIH1cblxuICBzdGF0aWMgZ2V0Q29uZmlnKGZpbGVQYXRoKSB7XG4gICAgbGV0IGNvbmZpZztcbiAgICBpZiAocGF0aC5pc0Fic29sdXRlKHRoaXMuY29uZmlnUGF0aCkpIHtcbiAgICAgIGNvbmZpZyA9IGNvbmZpZ0ZpbGUubG9hZChmYWxzZSwgdGhpcy5jb25maWdQYXRoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uZmlnID0gY29uZmlnRmlsZS5sb2FkKGZhbHNlLFxuICAgICAgICBwYXRoLmpvaW4ocGF0aC5kaXJuYW1lKGZpbGVQYXRoKSwgdGhpcy5jb25maWdQYXRoKSk7XG4gICAgfVxuXG4gICAgaWYgKCFjb25maWcgJiYgdGhpcy5vbmx5Q29uZmlnKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIC8vIE9wdGlvbnMgcGFzc2VkIHRvIGBqc2NzYCBmcm9tIHBhY2thZ2UgY29uZmlndXJhdGlvblxuICAgIGNvbnN0IG9wdGlvbnMgPSB7fTtcbiAgICBjb25zdCBuZXdDb25maWcgPSBvYmplY3RBc3NpZ24oXG4gICAgICBvcHRpb25zLFxuICAgICAgY29uZmlnIHx8IHsgcHJlc2V0OiB0aGlzLnByZXNldCB9XG4gICAgKTtcbiAgICAvLyBgY29uZmlnUGF0aGAgaXMgbm9uLWVudW1lcmFibGUgc28gYE9iamVjdC5hc3NpZ25gIHdvbid0IGNvcHkgaXQuXG4gICAgLy8gV2l0aG91dCBhIHByb3BlciBgY29uZmlnUGF0aGAgSlNDUyBwbHVncyBjYW5ub3QgYmUgbG9hZGVkLiBTZWUgIzE3NS5cbiAgICBpZiAoIW5ld0NvbmZpZy5jb25maWdQYXRoICYmIGNvbmZpZyAmJiBjb25maWcuY29uZmlnUGF0aCkge1xuICAgICAgbmV3Q29uZmlnLmNvbmZpZ1BhdGggPSBjb25maWcuY29uZmlnUGF0aDtcbiAgICB9XG4gICAgcmV0dXJuIG5ld0NvbmZpZztcbiAgfVxuXG4gIHN0YXRpYyBmaXhTdHJpbmcoZWRpdG9yKSB7XG4gICAgY29uc3QgZWRpdG9yUGF0aCA9IGVkaXRvci5nZXRQYXRoKCk7XG4gICAgY29uc3QgZWRpdG9yVGV4dCA9IGVkaXRvci5nZXRUZXh0KCk7XG5cbiAgICBjb25zdCBjb25maWcgPSB0aGlzLmdldENvbmZpZyhlZGl0b3JQYXRoKTtcbiAgICBpZiAoIWNvbmZpZykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IEpTQ1MgPSByZXF1aXJlKCdqc2NzJyk7XG5cbiAgICAvLyBXZSBuZWVkIHJlLWluaXRpYWxpemUgSlNDUyBiZWZvcmUgZXZlcnkgbGludFxuICAgIC8vIG9yIGl0IHdpbGwgbG9vc2VzIHRoZSBlcnJvcnMsIGRpZG4ndCB0cmFjZSB0aGUgZXJyb3JcbiAgICAvLyBtdXN0IGJlIHNvbWV0aGluZyB3aXRoIG5ldyAyLjAuMCBKU0NTXG4gICAgdGhpcy5qc2NzID0gbmV3IEpTQ1MoKTtcbiAgICB0aGlzLmpzY3MucmVnaXN0ZXJEZWZhdWx0UnVsZXMoKTtcbiAgICB0aGlzLmpzY3MuY29uZmlndXJlKGNvbmZpZyk7XG5cbiAgICBjb25zdCBmaXhlZFRleHQgPSB0aGlzLmpzY3MuZml4U3RyaW5nKGVkaXRvclRleHQsIGVkaXRvclBhdGgpLm91dHB1dDtcbiAgICBpZiAoZWRpdG9yVGV4dCA9PT0gZml4ZWRUZXh0KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgY3Vyc29yUG9zaXRpb24gPSBlZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKTtcbiAgICBlZGl0b3Iuc2V0VGV4dChmaXhlZFRleHQpO1xuICAgIGVkaXRvci5zZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbihjdXJzb3JQb3NpdGlvbik7XG4gIH1cbn1cbiJdfQ==
//# sourceURL=/home/cin_chalic/.atom/packages/linter-jscs/src/linter-jscs.js
