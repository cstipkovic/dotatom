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

function startMeasure(baseName) {
  performance.mark(baseName + '-start');
}

function endMeasure(baseName) {
  if (atom.inDevMode()) {
    performance.mark(baseName + '-end');
    performance.measure(baseName, baseName + '-start', baseName + '-end');
    console.log(baseName + ' took: ', performance.getEntriesByName(baseName)[0].duration);
    performance.clearMarks(baseName + '-end');
    performance.clearMeasures(baseName);
  }
  performance.clearMarks(baseName + '-start');
}

var JSCS = undefined;

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

      this.editorDisposables = new Map();
      this.subscriptions.add(atom.workspace.observeTextEditors(function (editor) {
        // Now we can handle multiple events for this editor
        var editorHandlers = new _atom.CompositeDisposable();
        _this.editorDisposables.set(editor.id, editorHandlers);
        // Fix before saving
        editorHandlers.add(editor.getBuffer().onWillSave(function () {
          var scope = editor.getGrammar().scopeName;
          if (atom.workspace.getActiveTextEditor().id === editor.id && grammarScopes.indexOf(scope) !== -1 && scope !== 'text.html.basic' || _this.testFixOnSave) {
            // Exclude `excludeFiles` for fix on save
            var config = _this.getConfig(editor.getPath());
            var exclude = _globule2['default'].isMatch(config && config.excludeFiles, _this.getFilePath(editor.getPath()));

            if (_this.fixOnSave && !exclude || _this.testFixOnSave) {
              _this.fixString(editor);
            }
          }
        }));
        // Remove all disposables associated with this editor
        editorHandlers.add(editor.onDidDestroy(function () {
          editorHandlers.dispose();
          _this.editorDisposables['delete'](editor.id);
        }));
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
      this.editorDisposables.forEach(function (editor) {
        return editor.dispose();
      });
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
          startMeasure('linter-jscs: Lint');

          // Load JSCS if it hasn't already been loaded
          if (!JSCS) {
            JSCS = require('jscs');
          }

          // Set only by specs
          _this2.testFixOnSave = testFixOnSave;

          var filePath = editor.getPath();
          var config = _this2.getConfig(filePath);

          // We don't have a config file present in project directory
          // let's return an empty array of errors
          if (!config) {
            endMeasure('linter-jscs: Lint');
            return Promise.resolve([]);
          }

          // Exclude `excludeFiles` for errors
          var exclude = _globule2['default'].isMatch(config && config.excludeFiles, _this2.getFilePath(editor.getPath()));
          if (exclude) {
            endMeasure('linter-jscs: Lint');
            return Promise.resolve([]);
          }

          // We need re-initialize JSCS before every lint
          // or it will looses the errors, didn't trace the error
          // must be something with new 2.0.0 JSCS
          _this2.jscs = new JSCS();
          _this2.jscs.registerDefaultRules();

          var jscsConfig = overrideOptions || config;
          _this2.jscs.configure(jscsConfig);

          var text = editor.getText();
          var scope = editor.getGrammar().scopeName;

          var errors = undefined;
          // text.plain.null-grammar is temp for tests
          startMeasure('linter-jscs: JSCS');
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
          endMeasure('linter-jscs: JSCS');

          var translatedErrors = errors.map(function (_ref) {
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
          });
          endMeasure('linter-jscs: Lint');
          return Promise.resolve(translatedErrors);
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
      startMeasure('linter-jscs: Fix');
      var editorPath = editor.getPath();
      var config = this.getConfig(editorPath);
      if (!config) {
        return;
      }

      // Load JSCS if it hasn't already been loaded
      if (!JSCS) {
        JSCS = require('jscs');
      }

      // We need re-initialize JSCS before every lint
      // or it will looses the errors, didn't trace the error
      // must be something with new 2.0.0 JSCS
      this.jscs = new JSCS();
      this.jscs.registerDefaultRules();
      this.jscs.configure(config);

      var editorText = editor.getText();
      var fixedText = this.jscs.fixString(editorText, editorPath).output;
      if (editorText === fixedText) {
        return;
      }

      var cursorPosition = editor.getCursorScreenPosition();
      editor.setText(fixedText);
      editor.setCursorScreenPosition(cursorPosition);
      endMeasure('linter-jscs: Fix');
    }
  }, {
    key: 'config',
    value: {
      preset: {
        title: 'Preset',
        description: 'Preset option is ignored if a config file is found for the linter.',
        type: 'string',
        'default': 'airbnb',
        'enum': ['airbnb', 'crockford', 'google', 'grunt', 'idiomatic', 'jquery', 'mdcs', 'node-style-guide', 'wikimedia', 'wordpress']
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGludGVyLWpzY3Mvc3JjL2xpbnRlci1qc2NzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7b0JBRWlCLE1BQU07Ozs7Z0NBQ0EscUJBQXFCOzs7O2dDQUN0QixxQkFBcUI7Ozs7dUJBQ3ZCLFNBQVM7Ozs7NEJBQ0osZUFBZTs7OztvQkFDSixNQUFNOztBQVAxQyxXQUFXLENBQUM7O0FBU1osSUFBTSxhQUFhLEdBQUcsQ0FBQyxXQUFXLEVBQUUsZUFBZSxFQUFFLGlCQUFpQixDQUFDLENBQUM7O0FBRXhFLFNBQVMsWUFBWSxDQUFDLFFBQVEsRUFBRTtBQUM5QixhQUFXLENBQUMsSUFBSSxDQUFJLFFBQVEsWUFBUyxDQUFDO0NBQ3ZDOztBQUVELFNBQVMsVUFBVSxDQUFDLFFBQVEsRUFBRTtBQUM1QixNQUFJLElBQUksQ0FBQyxTQUFTLEVBQUUsRUFBRTtBQUNwQixlQUFXLENBQUMsSUFBSSxDQUFJLFFBQVEsVUFBTyxDQUFDO0FBQ3BDLGVBQVcsQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFLLFFBQVEsYUFBYSxRQUFRLFVBQU8sQ0FBQztBQUN0RSxXQUFPLENBQUMsR0FBRyxDQUFJLFFBQVEsY0FBVyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDdEYsZUFBVyxDQUFDLFVBQVUsQ0FBSSxRQUFRLFVBQU8sQ0FBQztBQUMxQyxlQUFXLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0dBQ3JDO0FBQ0QsYUFBVyxDQUFDLFVBQVUsQ0FBSSxRQUFRLFlBQVMsQ0FBQztDQUM3Qzs7QUFFRCxJQUFJLElBQUksWUFBQSxDQUFDOztJQUVZLFVBQVU7V0FBVixVQUFVOzBCQUFWLFVBQVU7OztlQUFWLFVBQVU7O1dBcUNkLG9CQUFHOzs7O0FBRWhCLGFBQU8sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLE9BQU8s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Q2QsWUFBTSxFQUFFO0FBQ04sYUFBSyxFQUFFLFFBQVE7QUFDZixtQkFBVyxFQUFFLG9FQUFvRTtBQUNqRixZQUFJLEVBQUUsUUFBUTtBQUNkLG1CQUFTLFFBQVE7QUFDakIsZ0JBQU0sQ0FDSixRQUFRLEVBQUUsV0FBVyxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsV0FBVyxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQ3ZFLGtCQUFrQixFQUFFLFdBQVcsRUFBRSxXQUFXLENBQzdDO09BQ0Y7QUFDRCxnQkFBVSxFQUFFO0FBQ1YsYUFBSyxFQUFFLGFBQWE7QUFDcEIsbUJBQVcsRUFBRSxpRUFBaUU7QUFDOUUsWUFBSSxFQUFFLFNBQVM7QUFDZixtQkFBUyxLQUFLO09BQ2Y7QUFDRCxlQUFTLEVBQUU7QUFDVCxhQUFLLEVBQUUsYUFBYTtBQUNwQixtQkFBVyxFQUFFLHdCQUF3QjtBQUNyQyxZQUFJLEVBQUUsU0FBUztBQUNmLG1CQUFTLEtBQUs7T0FDZjtBQUNELGVBQVMsRUFBRTtBQUNULGFBQUssRUFBRSxtQkFBbUI7QUFDMUIsWUFBSSxFQUFFLFFBQVE7QUFDZCxtQkFBUyxPQUFPO0FBQ2hCLGdCQUFNLENBQUMsT0FBTyxFQUFFLFNBQVMsQ0FBQztPQUMzQjtBQUNELGdCQUFVLEVBQUU7QUFDVixhQUFLLEVBQUUsOERBQThEO0FBQ3JFLFlBQUksRUFBRSxRQUFRO0FBQ2QsbUJBQVMsRUFBRTtPQUNaO0tBQ0Y7Ozs7U0FuQ2tCLFVBQVU7OztxQkFBVixVQUFVIiwiZmlsZSI6Ii9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGludGVyLWpzY3Mvc3JjL2xpbnRlci1qc2NzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IGNvbmZpZ0ZpbGUgZnJvbSAnanNjcy9saWIvY2xpLWNvbmZpZyc7XG5pbXBvcnQgZXh0cmFjdEpzIGZyb20gJ2pzY3MvbGliL2V4dHJhY3QtanMnO1xuaW1wb3J0IGdsb2J1bGUgZnJvbSAnZ2xvYnVsZSc7XG5pbXBvcnQgb2JqZWN0QXNzaWduIGZyb20gJ29iamVjdC1hc3NpZ24nO1xuaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSB9IGZyb20gJ2F0b20nO1xuXG5jb25zdCBncmFtbWFyU2NvcGVzID0gWydzb3VyY2UuanMnLCAnc291cmNlLmpzLmpzeCcsICd0ZXh0Lmh0bWwuYmFzaWMnXTtcblxuZnVuY3Rpb24gc3RhcnRNZWFzdXJlKGJhc2VOYW1lKSB7XG4gIHBlcmZvcm1hbmNlLm1hcmsoYCR7YmFzZU5hbWV9LXN0YXJ0YCk7XG59XG5cbmZ1bmN0aW9uIGVuZE1lYXN1cmUoYmFzZU5hbWUpIHtcbiAgaWYgKGF0b20uaW5EZXZNb2RlKCkpIHtcbiAgICBwZXJmb3JtYW5jZS5tYXJrKGAke2Jhc2VOYW1lfS1lbmRgKTtcbiAgICBwZXJmb3JtYW5jZS5tZWFzdXJlKGJhc2VOYW1lLCBgJHtiYXNlTmFtZX0tc3RhcnRgLCBgJHtiYXNlTmFtZX0tZW5kYCk7XG4gICAgY29uc29sZS5sb2coYCR7YmFzZU5hbWV9IHRvb2s6IGAsIHBlcmZvcm1hbmNlLmdldEVudHJpZXNCeU5hbWUoYmFzZU5hbWUpWzBdLmR1cmF0aW9uKTtcbiAgICBwZXJmb3JtYW5jZS5jbGVhck1hcmtzKGAke2Jhc2VOYW1lfS1lbmRgKTtcbiAgICBwZXJmb3JtYW5jZS5jbGVhck1lYXN1cmVzKGJhc2VOYW1lKTtcbiAgfVxuICBwZXJmb3JtYW5jZS5jbGVhck1hcmtzKGAke2Jhc2VOYW1lfS1zdGFydGApO1xufVxuXG5sZXQgSlNDUztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGludGVySlNDUyB7XG4gIHN0YXRpYyBjb25maWcgPSB7XG4gICAgcHJlc2V0OiB7XG4gICAgICB0aXRsZTogJ1ByZXNldCcsXG4gICAgICBkZXNjcmlwdGlvbjogJ1ByZXNldCBvcHRpb24gaXMgaWdub3JlZCBpZiBhIGNvbmZpZyBmaWxlIGlzIGZvdW5kIGZvciB0aGUgbGludGVyLicsXG4gICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgIGRlZmF1bHQ6ICdhaXJibmInLFxuICAgICAgZW51bTogW1xuICAgICAgICAnYWlyYm5iJywgJ2Nyb2NrZm9yZCcsICdnb29nbGUnLCAnZ3J1bnQnLCAnaWRpb21hdGljJywgJ2pxdWVyeScsICdtZGNzJyxcbiAgICAgICAgJ25vZGUtc3R5bGUtZ3VpZGUnLCAnd2lraW1lZGlhJywgJ3dvcmRwcmVzcycsXG4gICAgICBdLFxuICAgIH0sXG4gICAgb25seUNvbmZpZzoge1xuICAgICAgdGl0bGU6ICdPbmx5IENvbmZpZycsXG4gICAgICBkZXNjcmlwdGlvbjogJ0Rpc2FibGUgbGludGVyIGlmIHRoZXJlIGlzIG5vIGNvbmZpZyBmaWxlIGZvdW5kIGZvciB0aGUgbGludGVyLicsXG4gICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICB9LFxuICAgIGZpeE9uU2F2ZToge1xuICAgICAgdGl0bGU6ICdGaXggb24gc2F2ZScsXG4gICAgICBkZXNjcmlwdGlvbjogJ0ZpeCBKYXZhU2NyaXB0IG9uIHNhdmUnLFxuICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgZGVmYXVsdDogZmFsc2UsXG4gICAgfSxcbiAgICBkaXNwbGF5QXM6IHtcbiAgICAgIHRpdGxlOiAnRGlzcGxheSBlcnJvcnMgYXMnLFxuICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICBkZWZhdWx0OiAnZXJyb3InLFxuICAgICAgZW51bTogWydlcnJvcicsICd3YXJuaW5nJ10sXG4gICAgfSxcbiAgICBjb25maWdQYXRoOiB7XG4gICAgICB0aXRsZTogJ0NvbmZpZyBmaWxlIHBhdGggKEFic29sdXRlIG9yIHJlbGF0aXZlIHBhdGggdG8geW91ciBwcm9qZWN0KScsXG4gICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgIGRlZmF1bHQ6ICcnLFxuICAgIH0sXG4gIH07XG5cbiAgc3RhdGljIGFjdGl2YXRlKCkge1xuICAgIC8vIEluc3RhbGwgZGVwZW5kZW5jaWVzIHVzaW5nIGF0b20tcGFja2FnZS1kZXBzXG4gICAgcmVxdWlyZSgnYXRvbS1wYWNrYWdlLWRlcHMnKS5pbnN0YWxsKCdsaW50ZXItanNjcycpO1xuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGU7XG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci1qc2NzLnByZXNldCcsIChwcmVzZXQpID0+IHtcbiAgICAgIHRoaXMucHJlc2V0ID0gcHJlc2V0O1xuICAgIH0pKTtcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLWpzY3Mub25seUNvbmZpZycsIChvbmx5Q29uZmlnKSA9PiB7XG4gICAgICB0aGlzLm9ubHlDb25maWcgPSBvbmx5Q29uZmlnO1xuICAgIH0pKTtcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLWpzY3MuZml4T25TYXZlJywgKGZpeE9uU2F2ZSkgPT4ge1xuICAgICAgdGhpcy5maXhPblNhdmUgPSBmaXhPblNhdmU7XG4gICAgfSkpO1xuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXItanNjcy5kaXNwbGF5QXMnLCAoZGlzcGxheUFzKSA9PiB7XG4gICAgICB0aGlzLmRpc3BsYXlBcyA9IGRpc3BsYXlBcztcbiAgICB9KSk7XG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci1qc2NzLmNvbmZpZ1BhdGgnLCAoY29uZmlnUGF0aCkgPT4ge1xuICAgICAgdGhpcy5jb25maWdQYXRoID0gY29uZmlnUGF0aDtcbiAgICB9KSk7XG5cbiAgICB0aGlzLmVkaXRvckRpc3Bvc2FibGVzID0gbmV3IE1hcCgpO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS53b3Jrc3BhY2Uub2JzZXJ2ZVRleHRFZGl0b3JzKChlZGl0b3IpID0+IHtcbiAgICAgIC8vIE5vdyB3ZSBjYW4gaGFuZGxlIG11bHRpcGxlIGV2ZW50cyBmb3IgdGhpcyBlZGl0b3JcbiAgICAgIGNvbnN0IGVkaXRvckhhbmRsZXJzID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGU7XG4gICAgICB0aGlzLmVkaXRvckRpc3Bvc2FibGVzLnNldChlZGl0b3IuaWQsIGVkaXRvckhhbmRsZXJzKTtcbiAgICAgIC8vIEZpeCBiZWZvcmUgc2F2aW5nXG4gICAgICBlZGl0b3JIYW5kbGVycy5hZGQoZWRpdG9yLmdldEJ1ZmZlcigpLm9uV2lsbFNhdmUoKCkgPT4ge1xuICAgICAgICBjb25zdCBzY29wZSA9IGVkaXRvci5nZXRHcmFtbWFyKCkuc2NvcGVOYW1lO1xuICAgICAgICBpZiAoYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpLmlkID09PSBlZGl0b3IuaWQgJiZcbiAgICAgICAgICAoZ3JhbW1hclNjb3Blcy5pbmRleE9mKHNjb3BlKSAhPT0gLTEgJiYgc2NvcGUgIT09ICd0ZXh0Lmh0bWwuYmFzaWMnKVxuICAgICAgICAgIHx8IHRoaXMudGVzdEZpeE9uU2F2ZSkge1xuICAgICAgICAgIC8vIEV4Y2x1ZGUgYGV4Y2x1ZGVGaWxlc2AgZm9yIGZpeCBvbiBzYXZlXG4gICAgICAgICAgY29uc3QgY29uZmlnID0gdGhpcy5nZXRDb25maWcoZWRpdG9yLmdldFBhdGgoKSk7XG4gICAgICAgICAgY29uc3QgZXhjbHVkZSA9IGdsb2J1bGUuaXNNYXRjaChcbiAgICAgICAgICAgIGNvbmZpZyAmJiBjb25maWcuZXhjbHVkZUZpbGVzLCB0aGlzLmdldEZpbGVQYXRoKGVkaXRvci5nZXRQYXRoKCkpXG4gICAgICAgICAgKTtcblxuICAgICAgICAgIGlmICgodGhpcy5maXhPblNhdmUgJiYgIWV4Y2x1ZGUpIHx8IHRoaXMudGVzdEZpeE9uU2F2ZSkge1xuICAgICAgICAgICAgdGhpcy5maXhTdHJpbmcoZWRpdG9yKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pKTtcbiAgICAgIC8vIFJlbW92ZSBhbGwgZGlzcG9zYWJsZXMgYXNzb2NpYXRlZCB3aXRoIHRoaXMgZWRpdG9yXG4gICAgICBlZGl0b3JIYW5kbGVycy5hZGQoZWRpdG9yLm9uRGlkRGVzdHJveSgoKSA9PiB7XG4gICAgICAgIGVkaXRvckhhbmRsZXJzLmRpc3Bvc2UoKTtcbiAgICAgICAgdGhpcy5lZGl0b3JEaXNwb3NhYmxlcy5kZWxldGUoZWRpdG9yLmlkKTtcbiAgICAgIH0pKTtcbiAgICB9KSk7XG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXRleHQtZWRpdG9yJywge1xuICAgICAgJ2xpbnRlci1qc2NzOmZpeC1maWxlJzogKCkgPT4ge1xuICAgICAgICBjb25zdCB0ZXh0RWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpO1xuXG4gICAgICAgIGlmICghdGV4dEVkaXRvcikge1xuICAgICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcignTGludGVyLWpzY3M6IGludmFsaWQgdGV4dEVkaXRvciByZWNlaXZlZCwgYWJvcnRpbmcuJyk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5maXhTdHJpbmcodGV4dEVkaXRvcik7XG4gICAgICB9LFxuICAgIH0pKTtcbiAgfVxuXG4gIHN0YXRpYyBkZWFjdGl2YXRlKCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKCk7XG4gICAgdGhpcy5lZGl0b3JEaXNwb3NhYmxlcy5mb3JFYWNoKGVkaXRvciA9PiBlZGl0b3IuZGlzcG9zZSgpKTtcbiAgfVxuXG4gIHN0YXRpYyBwcm92aWRlTGludGVyKCkge1xuICAgIGNvbnN0IGhlbHBlcnMgPSByZXF1aXJlKCdhdG9tLWxpbnRlcicpO1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lOiAnSlNDUycsXG4gICAgICBncmFtbWFyU2NvcGVzLFxuICAgICAgc2NvcGU6ICdmaWxlJyxcbiAgICAgIGxpbnRPbkZseTogdHJ1ZSxcbiAgICAgIGxpbnQ6IChlZGl0b3IsIG9wdHMsIG92ZXJyaWRlT3B0aW9ucywgdGVzdEZpeE9uU2F2ZSkgPT4ge1xuICAgICAgICBzdGFydE1lYXN1cmUoJ2xpbnRlci1qc2NzOiBMaW50Jyk7XG5cbiAgICAgICAgLy8gTG9hZCBKU0NTIGlmIGl0IGhhc24ndCBhbHJlYWR5IGJlZW4gbG9hZGVkXG4gICAgICAgIGlmICghSlNDUykge1xuICAgICAgICAgIEpTQ1MgPSByZXF1aXJlKCdqc2NzJyk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBTZXQgb25seSBieSBzcGVjc1xuICAgICAgICB0aGlzLnRlc3RGaXhPblNhdmUgPSB0ZXN0Rml4T25TYXZlO1xuXG4gICAgICAgIGNvbnN0IGZpbGVQYXRoID0gZWRpdG9yLmdldFBhdGgoKTtcbiAgICAgICAgY29uc3QgY29uZmlnID0gdGhpcy5nZXRDb25maWcoZmlsZVBhdGgpO1xuXG4gICAgICAgIC8vIFdlIGRvbid0IGhhdmUgYSBjb25maWcgZmlsZSBwcmVzZW50IGluIHByb2plY3QgZGlyZWN0b3J5XG4gICAgICAgIC8vIGxldCdzIHJldHVybiBhbiBlbXB0eSBhcnJheSBvZiBlcnJvcnNcbiAgICAgICAgaWYgKCFjb25maWcpIHtcbiAgICAgICAgICBlbmRNZWFzdXJlKCdsaW50ZXItanNjczogTGludCcpO1xuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoW10pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gRXhjbHVkZSBgZXhjbHVkZUZpbGVzYCBmb3IgZXJyb3JzXG4gICAgICAgIGNvbnN0IGV4Y2x1ZGUgPSBnbG9idWxlLmlzTWF0Y2goXG4gICAgICAgICAgY29uZmlnICYmIGNvbmZpZy5leGNsdWRlRmlsZXMsIHRoaXMuZ2V0RmlsZVBhdGgoZWRpdG9yLmdldFBhdGgoKSlcbiAgICAgICAgKTtcbiAgICAgICAgaWYgKGV4Y2x1ZGUpIHtcbiAgICAgICAgICBlbmRNZWFzdXJlKCdsaW50ZXItanNjczogTGludCcpO1xuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoW10pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gV2UgbmVlZCByZS1pbml0aWFsaXplIEpTQ1MgYmVmb3JlIGV2ZXJ5IGxpbnRcbiAgICAgICAgLy8gb3IgaXQgd2lsbCBsb29zZXMgdGhlIGVycm9ycywgZGlkbid0IHRyYWNlIHRoZSBlcnJvclxuICAgICAgICAvLyBtdXN0IGJlIHNvbWV0aGluZyB3aXRoIG5ldyAyLjAuMCBKU0NTXG4gICAgICAgIHRoaXMuanNjcyA9IG5ldyBKU0NTKCk7XG4gICAgICAgIHRoaXMuanNjcy5yZWdpc3RlckRlZmF1bHRSdWxlcygpO1xuXG4gICAgICAgIGNvbnN0IGpzY3NDb25maWcgPSBvdmVycmlkZU9wdGlvbnMgfHwgY29uZmlnO1xuICAgICAgICB0aGlzLmpzY3MuY29uZmlndXJlKGpzY3NDb25maWcpO1xuXG4gICAgICAgIGNvbnN0IHRleHQgPSBlZGl0b3IuZ2V0VGV4dCgpO1xuICAgICAgICBjb25zdCBzY29wZSA9IGVkaXRvci5nZXRHcmFtbWFyKCkuc2NvcGVOYW1lO1xuXG4gICAgICAgIGxldCBlcnJvcnM7XG4gICAgICAgIC8vIHRleHQucGxhaW4ubnVsbC1ncmFtbWFyIGlzIHRlbXAgZm9yIHRlc3RzXG4gICAgICAgIHN0YXJ0TWVhc3VyZSgnbGludGVyLWpzY3M6IEpTQ1MnKTtcbiAgICAgICAgaWYgKHNjb3BlID09PSAndGV4dC5odG1sLmJhc2ljJyB8fCBzY29wZSA9PT0gJ3RleHQucGxhaW4ubnVsbC1ncmFtbWFyJykge1xuICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGV4dHJhY3RKcyhmaWxlUGF0aCwgdGV4dCk7XG5cbiAgICAgICAgICByZXN1bHQuc291cmNlcy5mb3JFYWNoKChzY3JpcHQpID0+IHtcbiAgICAgICAgICAgIHRoaXMuanNjcy5jaGVja1N0cmluZyhzY3JpcHQuc291cmNlLCBmaWxlUGF0aCkuZ2V0RXJyb3JMaXN0KCkuZm9yRWFjaCgoZXJyb3IpID0+IHtcbiAgICAgICAgICAgICAgY29uc3QgZXJyID0gZXJyb3I7XG4gICAgICAgICAgICAgIGVyci5saW5lICs9IHNjcmlwdC5saW5lO1xuICAgICAgICAgICAgICBlcnIuY29sdW1uICs9IHNjcmlwdC5vZmZzZXQ7XG4gICAgICAgICAgICAgIHJlc3VsdC5hZGRFcnJvcihlcnIpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSwgdGhpcyk7XG5cbiAgICAgICAgICBlcnJvcnMgPSByZXN1bHQuZXJyb3JzLmdldEVycm9yTGlzdCgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGVycm9ycyA9IHRoaXMuanNjc1xuICAgICAgICAgICAgLmNoZWNrU3RyaW5nKHRleHQsIGZpbGVQYXRoKVxuICAgICAgICAgICAgLmdldEVycm9yTGlzdCgpO1xuICAgICAgICB9XG4gICAgICAgIGVuZE1lYXN1cmUoJ2xpbnRlci1qc2NzOiBKU0NTJyk7XG5cbiAgICAgICAgY29uc3QgdHJhbnNsYXRlZEVycm9ycyA9IGVycm9ycy5tYXAoKHsgcnVsZSwgbWVzc2FnZSwgbGluZSwgY29sdW1uIH0pID0+IHtcbiAgICAgICAgICBjb25zdCB0eXBlID0gdGhpcy5kaXNwbGF5QXM7XG4gICAgICAgICAgLy8gVE9ETzogUmVtb3ZlIHRoaXMgd2hlbiBodHRwczovL2dpdGh1Yi5jb20vanNjcy1kZXYvbm9kZS1qc2NzL2lzc3Vlcy8yMjM1IGhhcyBiZWVuIGFkZHJlc3NlZFxuICAgICAgICAgIGNvbnN0IGNsZWFuTWVzc2FnZSA9IG1lc3NhZ2UucmVwbGFjZShgJHtydWxlfTogYCwgJycpO1xuICAgICAgICAgIGNvbnN0IGh0bWwgPSBgPHNwYW4gY2xhc3M9J2JhZGdlIGJhZGdlLWZsZXhpYmxlJz4ke3J1bGV9PC9zcGFuPiAke2NsZWFuTWVzc2FnZX1gO1xuICAgICAgICAgIGNvbnN0IHJhbmdlID0gaGVscGVycy5yYW5nZUZyb21MaW5lTnVtYmVyKGVkaXRvciwgbGluZSAtIDEsIGNvbHVtbiAtIDEpO1xuXG4gICAgICAgICAgcmV0dXJuIHsgdHlwZSwgaHRtbCwgZmlsZVBhdGgsIHJhbmdlIH07XG4gICAgICAgIH0pO1xuICAgICAgICBlbmRNZWFzdXJlKCdsaW50ZXItanNjczogTGludCcpO1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRyYW5zbGF0ZWRFcnJvcnMpO1xuICAgICAgfSxcbiAgICB9O1xuICB9XG5cbiAgc3RhdGljIGdldEZpbGVQYXRoKGZpbGUpIHtcbiAgICBjb25zdCByZWxhdGl2ZSA9IGF0b20ucHJvamVjdC5yZWxhdGl2aXplUGF0aChmaWxlKTtcbiAgICByZXR1cm4gcmVsYXRpdmVbMV07XG4gIH1cblxuICBzdGF0aWMgZ2V0Q29uZmlnKGZpbGVQYXRoKSB7XG4gICAgbGV0IGNvbmZpZztcbiAgICBpZiAocGF0aC5pc0Fic29sdXRlKHRoaXMuY29uZmlnUGF0aCkpIHtcbiAgICAgIGNvbmZpZyA9IGNvbmZpZ0ZpbGUubG9hZChmYWxzZSwgdGhpcy5jb25maWdQYXRoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uZmlnID0gY29uZmlnRmlsZS5sb2FkKGZhbHNlLFxuICAgICAgICBwYXRoLmpvaW4ocGF0aC5kaXJuYW1lKGZpbGVQYXRoKSwgdGhpcy5jb25maWdQYXRoKSk7XG4gICAgfVxuXG4gICAgaWYgKCFjb25maWcgJiYgdGhpcy5vbmx5Q29uZmlnKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIC8vIE9wdGlvbnMgcGFzc2VkIHRvIGBqc2NzYCBmcm9tIHBhY2thZ2UgY29uZmlndXJhdGlvblxuICAgIGNvbnN0IG9wdGlvbnMgPSB7fTtcbiAgICBjb25zdCBuZXdDb25maWcgPSBvYmplY3RBc3NpZ24oXG4gICAgICBvcHRpb25zLFxuICAgICAgY29uZmlnIHx8IHsgcHJlc2V0OiB0aGlzLnByZXNldCB9XG4gICAgKTtcbiAgICAvLyBgY29uZmlnUGF0aGAgaXMgbm9uLWVudW1lcmFibGUgc28gYE9iamVjdC5hc3NpZ25gIHdvbid0IGNvcHkgaXQuXG4gICAgLy8gV2l0aG91dCBhIHByb3BlciBgY29uZmlnUGF0aGAgSlNDUyBwbHVncyBjYW5ub3QgYmUgbG9hZGVkLiBTZWUgIzE3NS5cbiAgICBpZiAoIW5ld0NvbmZpZy5jb25maWdQYXRoICYmIGNvbmZpZyAmJiBjb25maWcuY29uZmlnUGF0aCkge1xuICAgICAgbmV3Q29uZmlnLmNvbmZpZ1BhdGggPSBjb25maWcuY29uZmlnUGF0aDtcbiAgICB9XG4gICAgcmV0dXJuIG5ld0NvbmZpZztcbiAgfVxuXG4gIHN0YXRpYyBmaXhTdHJpbmcoZWRpdG9yKSB7XG4gICAgc3RhcnRNZWFzdXJlKCdsaW50ZXItanNjczogRml4Jyk7XG4gICAgY29uc3QgZWRpdG9yUGF0aCA9IGVkaXRvci5nZXRQYXRoKCk7XG4gICAgY29uc3QgY29uZmlnID0gdGhpcy5nZXRDb25maWcoZWRpdG9yUGF0aCk7XG4gICAgaWYgKCFjb25maWcpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBMb2FkIEpTQ1MgaWYgaXQgaGFzbid0IGFscmVhZHkgYmVlbiBsb2FkZWRcbiAgICBpZiAoIUpTQ1MpIHtcbiAgICAgIEpTQ1MgPSByZXF1aXJlKCdqc2NzJyk7XG4gICAgfVxuXG4gICAgLy8gV2UgbmVlZCByZS1pbml0aWFsaXplIEpTQ1MgYmVmb3JlIGV2ZXJ5IGxpbnRcbiAgICAvLyBvciBpdCB3aWxsIGxvb3NlcyB0aGUgZXJyb3JzLCBkaWRuJ3QgdHJhY2UgdGhlIGVycm9yXG4gICAgLy8gbXVzdCBiZSBzb21ldGhpbmcgd2l0aCBuZXcgMi4wLjAgSlNDU1xuICAgIHRoaXMuanNjcyA9IG5ldyBKU0NTKCk7XG4gICAgdGhpcy5qc2NzLnJlZ2lzdGVyRGVmYXVsdFJ1bGVzKCk7XG4gICAgdGhpcy5qc2NzLmNvbmZpZ3VyZShjb25maWcpO1xuXG4gICAgY29uc3QgZWRpdG9yVGV4dCA9IGVkaXRvci5nZXRUZXh0KCk7XG4gICAgY29uc3QgZml4ZWRUZXh0ID0gdGhpcy5qc2NzLmZpeFN0cmluZyhlZGl0b3JUZXh0LCBlZGl0b3JQYXRoKS5vdXRwdXQ7XG4gICAgaWYgKGVkaXRvclRleHQgPT09IGZpeGVkVGV4dCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGN1cnNvclBvc2l0aW9uID0gZWRpdG9yLmdldEN1cnNvclNjcmVlblBvc2l0aW9uKCk7XG4gICAgZWRpdG9yLnNldFRleHQoZml4ZWRUZXh0KTtcbiAgICBlZGl0b3Iuc2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oY3Vyc29yUG9zaXRpb24pO1xuICAgIGVuZE1lYXN1cmUoJ2xpbnRlci1qc2NzOiBGaXgnKTtcbiAgfVxufVxuIl19
//# sourceURL=/home/cin_chalic/.atom/packages/linter-jscs/src/linter-jscs.js
