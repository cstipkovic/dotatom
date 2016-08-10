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

      this.subscriptions.add(atom.workspace.observeTextEditors(function (editor) {
        editor.getBuffer().onWillSave(function () {
          var scope = editor.getGrammar().scopeName;
          if (grammarScopes.indexOf(scope) !== -1 && scope !== 'text.html.basic' || _this.testFixOnSave) {
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
        'enum': ['airbnb', 'crockford', 'google', 'grunt', 'idiomatic', 'jquery', 'mdcs', 'node-style-guide', 'wikimedia', 'wordpress', 'yandex']
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGludGVyLWpzY3Mvc3JjL2xpbnRlci1qc2NzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7b0JBRWlCLE1BQU07Ozs7Z0NBQ0EscUJBQXFCOzs7O2dDQUN0QixxQkFBcUI7Ozs7dUJBQ3ZCLFNBQVM7Ozs7NEJBQ0osZUFBZTs7OztvQkFDSixNQUFNOztBQVAxQyxXQUFXLENBQUM7O0FBU1osSUFBTSxhQUFhLEdBQUcsQ0FBQyxXQUFXLEVBQUUsZUFBZSxFQUFFLGlCQUFpQixDQUFDLENBQUM7O0FBRXhFLFNBQVMsWUFBWSxDQUFDLFFBQVEsRUFBRTtBQUM5QixhQUFXLENBQUMsSUFBSSxDQUFJLFFBQVEsWUFBUyxDQUFDO0NBQ3ZDOztBQUVELFNBQVMsVUFBVSxDQUFDLFFBQVEsRUFBRTtBQUM1QixNQUFJLElBQUksQ0FBQyxTQUFTLEVBQUUsRUFBRTtBQUNwQixlQUFXLENBQUMsSUFBSSxDQUFJLFFBQVEsVUFBTyxDQUFDO0FBQ3BDLGVBQVcsQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFLLFFBQVEsYUFBYSxRQUFRLFVBQU8sQ0FBQztBQUN0RSxXQUFPLENBQUMsR0FBRyxDQUFJLFFBQVEsY0FBVyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDdEYsZUFBVyxDQUFDLFVBQVUsQ0FBSSxRQUFRLFVBQU8sQ0FBQztBQUMxQyxlQUFXLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0dBQ3JDO0FBQ0QsYUFBVyxDQUFDLFVBQVUsQ0FBSSxRQUFRLFlBQVMsQ0FBQztDQUM3Qzs7QUFFRCxJQUFJLElBQUksWUFBQSxDQUFDOztJQUVZLFVBQVU7V0FBVixVQUFVOzBCQUFWLFVBQVU7OztlQUFWLFVBQVU7O1dBcUNkLG9CQUFHOzs7O0FBRWhCLGFBQU8sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLE9BQU8s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Q2QsbUJBQVMsT0FBTztBQUNoQixnQkFBTSxDQUFDLE9BQU8sRUFBRSxTQUFTLENBQUM7T0FDM0I7QUFDRCxnQkFBVSxFQUFFO0FBQ1YsYUFBSyxFQUFFLDhEQUE4RDtBQUNyRSxZQUFJLEVBQUUsUUFBUTtBQUNkLG1CQUFTLEVBQUU7T0FDWjtLQUNGOzs7O1NBbkNrQixVQUFVOzs7cUJBQVYsVUFBVSIsImZpbGUiOiIvaG9tZS9jaW5fY2hhbGljLy5hdG9tL3BhY2thZ2VzL2xpbnRlci1qc2NzL3NyYy9saW50ZXItanNjcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBjb25maWdGaWxlIGZyb20gJ2pzY3MvbGliL2NsaS1jb25maWcnO1xuaW1wb3J0IGV4dHJhY3RKcyBmcm9tICdqc2NzL2xpYi9leHRyYWN0LWpzJztcbmltcG9ydCBnbG9idWxlIGZyb20gJ2dsb2J1bGUnO1xuaW1wb3J0IG9iamVjdEFzc2lnbiBmcm9tICdvYmplY3QtYXNzaWduJztcbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUgfSBmcm9tICdhdG9tJztcblxuY29uc3QgZ3JhbW1hclNjb3BlcyA9IFsnc291cmNlLmpzJywgJ3NvdXJjZS5qcy5qc3gnLCAndGV4dC5odG1sLmJhc2ljJ107XG5cbmZ1bmN0aW9uIHN0YXJ0TWVhc3VyZShiYXNlTmFtZSkge1xuICBwZXJmb3JtYW5jZS5tYXJrKGAke2Jhc2VOYW1lfS1zdGFydGApO1xufVxuXG5mdW5jdGlvbiBlbmRNZWFzdXJlKGJhc2VOYW1lKSB7XG4gIGlmIChhdG9tLmluRGV2TW9kZSgpKSB7XG4gICAgcGVyZm9ybWFuY2UubWFyayhgJHtiYXNlTmFtZX0tZW5kYCk7XG4gICAgcGVyZm9ybWFuY2UubWVhc3VyZShiYXNlTmFtZSwgYCR7YmFzZU5hbWV9LXN0YXJ0YCwgYCR7YmFzZU5hbWV9LWVuZGApO1xuICAgIGNvbnNvbGUubG9nKGAke2Jhc2VOYW1lfSB0b29rOiBgLCBwZXJmb3JtYW5jZS5nZXRFbnRyaWVzQnlOYW1lKGJhc2VOYW1lKVswXS5kdXJhdGlvbik7XG4gICAgcGVyZm9ybWFuY2UuY2xlYXJNYXJrcyhgJHtiYXNlTmFtZX0tZW5kYCk7XG4gICAgcGVyZm9ybWFuY2UuY2xlYXJNZWFzdXJlcyhiYXNlTmFtZSk7XG4gIH1cbiAgcGVyZm9ybWFuY2UuY2xlYXJNYXJrcyhgJHtiYXNlTmFtZX0tc3RhcnRgKTtcbn1cblxubGV0IEpTQ1M7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExpbnRlckpTQ1Mge1xuICBzdGF0aWMgY29uZmlnID0ge1xuICAgIHByZXNldDoge1xuICAgICAgdGl0bGU6ICdQcmVzZXQnLFxuICAgICAgZGVzY3JpcHRpb246ICdQcmVzZXQgb3B0aW9uIGlzIGlnbm9yZWQgaWYgYSBjb25maWcgZmlsZSBpcyBmb3VuZCBmb3IgdGhlIGxpbnRlci4nLFxuICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICBkZWZhdWx0OiAnYWlyYm5iJyxcbiAgICAgIGVudW06IFtcbiAgICAgICAgJ2FpcmJuYicsICdjcm9ja2ZvcmQnLCAnZ29vZ2xlJywgJ2dydW50JywgJ2lkaW9tYXRpYycsICdqcXVlcnknLCAnbWRjcycsXG4gICAgICAgICdub2RlLXN0eWxlLWd1aWRlJywgJ3dpa2ltZWRpYScsICd3b3JkcHJlc3MnLCAneWFuZGV4JyxcbiAgICAgIF0sXG4gICAgfSxcbiAgICBvbmx5Q29uZmlnOiB7XG4gICAgICB0aXRsZTogJ09ubHkgQ29uZmlnJyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnRGlzYWJsZSBsaW50ZXIgaWYgdGhlcmUgaXMgbm8gY29uZmlnIGZpbGUgZm91bmQgZm9yIHRoZSBsaW50ZXIuJyxcbiAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgIH0sXG4gICAgZml4T25TYXZlOiB7XG4gICAgICB0aXRsZTogJ0ZpeCBvbiBzYXZlJyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnRml4IEphdmFTY3JpcHQgb24gc2F2ZScsXG4gICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICB9LFxuICAgIGRpc3BsYXlBczoge1xuICAgICAgdGl0bGU6ICdEaXNwbGF5IGVycm9ycyBhcycsXG4gICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgIGRlZmF1bHQ6ICdlcnJvcicsXG4gICAgICBlbnVtOiBbJ2Vycm9yJywgJ3dhcm5pbmcnXSxcbiAgICB9LFxuICAgIGNvbmZpZ1BhdGg6IHtcbiAgICAgIHRpdGxlOiAnQ29uZmlnIGZpbGUgcGF0aCAoQWJzb2x1dGUgb3IgcmVsYXRpdmUgcGF0aCB0byB5b3VyIHByb2plY3QpJyxcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgZGVmYXVsdDogJycsXG4gICAgfSxcbiAgfTtcblxuICBzdGF0aWMgYWN0aXZhdGUoKSB7XG4gICAgLy8gSW5zdGFsbCBkZXBlbmRlbmNpZXMgdXNpbmcgYXRvbS1wYWNrYWdlLWRlcHNcbiAgICByZXF1aXJlKCdhdG9tLXBhY2thZ2UtZGVwcycpLmluc3RhbGwoJ2xpbnRlci1qc2NzJyk7XG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZTtcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLWpzY3MucHJlc2V0JywgKHByZXNldCkgPT4ge1xuICAgICAgdGhpcy5wcmVzZXQgPSBwcmVzZXQ7XG4gICAgfSkpO1xuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXItanNjcy5vbmx5Q29uZmlnJywgKG9ubHlDb25maWcpID0+IHtcbiAgICAgIHRoaXMub25seUNvbmZpZyA9IG9ubHlDb25maWc7XG4gICAgfSkpO1xuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXItanNjcy5maXhPblNhdmUnLCAoZml4T25TYXZlKSA9PiB7XG4gICAgICB0aGlzLmZpeE9uU2F2ZSA9IGZpeE9uU2F2ZTtcbiAgICB9KSk7XG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci1qc2NzLmRpc3BsYXlBcycsIChkaXNwbGF5QXMpID0+IHtcbiAgICAgIHRoaXMuZGlzcGxheUFzID0gZGlzcGxheUFzO1xuICAgIH0pKTtcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLWpzY3MuY29uZmlnUGF0aCcsIChjb25maWdQYXRoKSA9PiB7XG4gICAgICB0aGlzLmNvbmZpZ1BhdGggPSBjb25maWdQYXRoO1xuICAgIH0pKTtcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS53b3Jrc3BhY2Uub2JzZXJ2ZVRleHRFZGl0b3JzKChlZGl0b3IpID0+IHtcbiAgICAgIGVkaXRvci5nZXRCdWZmZXIoKS5vbldpbGxTYXZlKCgpID0+IHtcbiAgICAgICAgY29uc3Qgc2NvcGUgPSBlZGl0b3IuZ2V0R3JhbW1hcigpLnNjb3BlTmFtZTtcbiAgICAgICAgaWYgKChncmFtbWFyU2NvcGVzLmluZGV4T2Yoc2NvcGUpICE9PSAtMSAmJiBzY29wZSAhPT0gJ3RleHQuaHRtbC5iYXNpYycpXG4gICAgICAgICAgfHwgdGhpcy50ZXN0Rml4T25TYXZlXG4gICAgICAgICkge1xuICAgICAgICAgIC8vIEV4Y2x1ZGUgYGV4Y2x1ZGVGaWxlc2AgZm9yIGZpeCBvbiBzYXZlXG4gICAgICAgICAgY29uc3QgY29uZmlnID0gdGhpcy5nZXRDb25maWcoZWRpdG9yLmdldFBhdGgoKSk7XG4gICAgICAgICAgY29uc3QgZXhjbHVkZSA9IGdsb2J1bGUuaXNNYXRjaChcbiAgICAgICAgICAgIGNvbmZpZyAmJiBjb25maWcuZXhjbHVkZUZpbGVzLCB0aGlzLmdldEZpbGVQYXRoKGVkaXRvci5nZXRQYXRoKCkpXG4gICAgICAgICAgKTtcblxuICAgICAgICAgIGlmICgodGhpcy5maXhPblNhdmUgJiYgIWV4Y2x1ZGUpIHx8IHRoaXMudGVzdEZpeE9uU2F2ZSkge1xuICAgICAgICAgICAgdGhpcy5maXhTdHJpbmcoZWRpdG9yKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pKTtcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20tdGV4dC1lZGl0b3InLCB7XG4gICAgICAnbGludGVyLWpzY3M6Zml4LWZpbGUnOiAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHRleHRFZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCk7XG5cbiAgICAgICAgaWYgKCF0ZXh0RWRpdG9yKSB7XG4gICAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKCdMaW50ZXItanNjczogaW52YWxpZCB0ZXh0RWRpdG9yIHJlY2VpdmVkLCBhYm9ydGluZy4nKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmZpeFN0cmluZyh0ZXh0RWRpdG9yKTtcbiAgICAgIH0sXG4gICAgfSkpO1xuICB9XG5cbiAgc3RhdGljIGRlYWN0aXZhdGUoKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKTtcbiAgfVxuXG4gIHN0YXRpYyBwcm92aWRlTGludGVyKCkge1xuICAgIGNvbnN0IGhlbHBlcnMgPSByZXF1aXJlKCdhdG9tLWxpbnRlcicpO1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lOiAnSlNDUycsXG4gICAgICBncmFtbWFyU2NvcGVzLFxuICAgICAgc2NvcGU6ICdmaWxlJyxcbiAgICAgIGxpbnRPbkZseTogdHJ1ZSxcbiAgICAgIGxpbnQ6IChlZGl0b3IsIG9wdHMsIG92ZXJyaWRlT3B0aW9ucywgdGVzdEZpeE9uU2F2ZSkgPT4ge1xuICAgICAgICBzdGFydE1lYXN1cmUoJ2xpbnRlci1qc2NzOiBMaW50Jyk7XG5cbiAgICAgICAgLy8gTG9hZCBKU0NTIGlmIGl0IGhhc24ndCBhbHJlYWR5IGJlZW4gbG9hZGVkXG4gICAgICAgIGlmICghSlNDUykge1xuICAgICAgICAgIEpTQ1MgPSByZXF1aXJlKCdqc2NzJyk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBTZXQgb25seSBieSBzcGVjc1xuICAgICAgICB0aGlzLnRlc3RGaXhPblNhdmUgPSB0ZXN0Rml4T25TYXZlO1xuXG4gICAgICAgIGNvbnN0IGZpbGVQYXRoID0gZWRpdG9yLmdldFBhdGgoKTtcbiAgICAgICAgY29uc3QgY29uZmlnID0gdGhpcy5nZXRDb25maWcoZmlsZVBhdGgpO1xuXG4gICAgICAgIC8vIFdlIGRvbid0IGhhdmUgYSBjb25maWcgZmlsZSBwcmVzZW50IGluIHByb2plY3QgZGlyZWN0b3J5XG4gICAgICAgIC8vIGxldCdzIHJldHVybiBhbiBlbXB0eSBhcnJheSBvZiBlcnJvcnNcbiAgICAgICAgaWYgKCFjb25maWcpIHtcbiAgICAgICAgICBlbmRNZWFzdXJlKCdsaW50ZXItanNjczogTGludCcpO1xuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoW10pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gRXhjbHVkZSBgZXhjbHVkZUZpbGVzYCBmb3IgZXJyb3JzXG4gICAgICAgIGNvbnN0IGV4Y2x1ZGUgPSBnbG9idWxlLmlzTWF0Y2goXG4gICAgICAgICAgY29uZmlnICYmIGNvbmZpZy5leGNsdWRlRmlsZXMsIHRoaXMuZ2V0RmlsZVBhdGgoZWRpdG9yLmdldFBhdGgoKSlcbiAgICAgICAgKTtcbiAgICAgICAgaWYgKGV4Y2x1ZGUpIHtcbiAgICAgICAgICBlbmRNZWFzdXJlKCdsaW50ZXItanNjczogTGludCcpO1xuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoW10pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gV2UgbmVlZCByZS1pbml0aWFsaXplIEpTQ1MgYmVmb3JlIGV2ZXJ5IGxpbnRcbiAgICAgICAgLy8gb3IgaXQgd2lsbCBsb29zZXMgdGhlIGVycm9ycywgZGlkbid0IHRyYWNlIHRoZSBlcnJvclxuICAgICAgICAvLyBtdXN0IGJlIHNvbWV0aGluZyB3aXRoIG5ldyAyLjAuMCBKU0NTXG4gICAgICAgIHRoaXMuanNjcyA9IG5ldyBKU0NTKCk7XG4gICAgICAgIHRoaXMuanNjcy5yZWdpc3RlckRlZmF1bHRSdWxlcygpO1xuXG4gICAgICAgIGNvbnN0IGpzY3NDb25maWcgPSBvdmVycmlkZU9wdGlvbnMgfHwgY29uZmlnO1xuICAgICAgICB0aGlzLmpzY3MuY29uZmlndXJlKGpzY3NDb25maWcpO1xuXG4gICAgICAgIGNvbnN0IHRleHQgPSBlZGl0b3IuZ2V0VGV4dCgpO1xuICAgICAgICBjb25zdCBzY29wZSA9IGVkaXRvci5nZXRHcmFtbWFyKCkuc2NvcGVOYW1lO1xuXG4gICAgICAgIGxldCBlcnJvcnM7XG4gICAgICAgIC8vIHRleHQucGxhaW4ubnVsbC1ncmFtbWFyIGlzIHRlbXAgZm9yIHRlc3RzXG4gICAgICAgIHN0YXJ0TWVhc3VyZSgnbGludGVyLWpzY3M6IEpTQ1MnKTtcbiAgICAgICAgaWYgKHNjb3BlID09PSAndGV4dC5odG1sLmJhc2ljJyB8fCBzY29wZSA9PT0gJ3RleHQucGxhaW4ubnVsbC1ncmFtbWFyJykge1xuICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGV4dHJhY3RKcyhmaWxlUGF0aCwgdGV4dCk7XG5cbiAgICAgICAgICByZXN1bHQuc291cmNlcy5mb3JFYWNoKChzY3JpcHQpID0+IHtcbiAgICAgICAgICAgIHRoaXMuanNjcy5jaGVja1N0cmluZyhzY3JpcHQuc291cmNlLCBmaWxlUGF0aCkuZ2V0RXJyb3JMaXN0KCkuZm9yRWFjaCgoZXJyb3IpID0+IHtcbiAgICAgICAgICAgICAgY29uc3QgZXJyID0gZXJyb3I7XG4gICAgICAgICAgICAgIGVyci5saW5lICs9IHNjcmlwdC5saW5lO1xuICAgICAgICAgICAgICBlcnIuY29sdW1uICs9IHNjcmlwdC5vZmZzZXQ7XG4gICAgICAgICAgICAgIHJlc3VsdC5hZGRFcnJvcihlcnIpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSwgdGhpcyk7XG5cbiAgICAgICAgICBlcnJvcnMgPSByZXN1bHQuZXJyb3JzLmdldEVycm9yTGlzdCgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGVycm9ycyA9IHRoaXMuanNjc1xuICAgICAgICAgICAgLmNoZWNrU3RyaW5nKHRleHQsIGZpbGVQYXRoKVxuICAgICAgICAgICAgLmdldEVycm9yTGlzdCgpO1xuICAgICAgICB9XG4gICAgICAgIGVuZE1lYXN1cmUoJ2xpbnRlci1qc2NzOiBKU0NTJyk7XG5cbiAgICAgICAgY29uc3QgdHJhbnNsYXRlZEVycm9ycyA9IGVycm9ycy5tYXAoKHsgcnVsZSwgbWVzc2FnZSwgbGluZSwgY29sdW1uIH0pID0+IHtcbiAgICAgICAgICBjb25zdCB0eXBlID0gdGhpcy5kaXNwbGF5QXM7XG4gICAgICAgICAgLy8gVE9ETzogUmVtb3ZlIHRoaXMgd2hlbiBodHRwczovL2dpdGh1Yi5jb20vanNjcy1kZXYvbm9kZS1qc2NzL2lzc3Vlcy8yMjM1IGhhcyBiZWVuIGFkZHJlc3NlZFxuICAgICAgICAgIGNvbnN0IGNsZWFuTWVzc2FnZSA9IG1lc3NhZ2UucmVwbGFjZShgJHtydWxlfTogYCwgJycpO1xuICAgICAgICAgIGNvbnN0IGh0bWwgPSBgPHNwYW4gY2xhc3M9J2JhZGdlIGJhZGdlLWZsZXhpYmxlJz4ke3J1bGV9PC9zcGFuPiAke2NsZWFuTWVzc2FnZX1gO1xuICAgICAgICAgIGNvbnN0IHJhbmdlID0gaGVscGVycy5yYW5nZUZyb21MaW5lTnVtYmVyKGVkaXRvciwgbGluZSAtIDEsIGNvbHVtbiAtIDEpO1xuXG4gICAgICAgICAgcmV0dXJuIHsgdHlwZSwgaHRtbCwgZmlsZVBhdGgsIHJhbmdlIH07XG4gICAgICAgIH0pO1xuICAgICAgICBlbmRNZWFzdXJlKCdsaW50ZXItanNjczogTGludCcpO1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRyYW5zbGF0ZWRFcnJvcnMpO1xuICAgICAgfSxcbiAgICB9O1xuICB9XG5cbiAgc3RhdGljIGdldEZpbGVQYXRoKGZpbGUpIHtcbiAgICBjb25zdCByZWxhdGl2ZSA9IGF0b20ucHJvamVjdC5yZWxhdGl2aXplUGF0aChmaWxlKTtcbiAgICByZXR1cm4gcmVsYXRpdmVbMV07XG4gIH1cblxuICBzdGF0aWMgZ2V0Q29uZmlnKGZpbGVQYXRoKSB7XG4gICAgbGV0IGNvbmZpZztcbiAgICBpZiAocGF0aC5pc0Fic29sdXRlKHRoaXMuY29uZmlnUGF0aCkpIHtcbiAgICAgIGNvbmZpZyA9IGNvbmZpZ0ZpbGUubG9hZChmYWxzZSwgdGhpcy5jb25maWdQYXRoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uZmlnID0gY29uZmlnRmlsZS5sb2FkKGZhbHNlLFxuICAgICAgICBwYXRoLmpvaW4ocGF0aC5kaXJuYW1lKGZpbGVQYXRoKSwgdGhpcy5jb25maWdQYXRoKSk7XG4gICAgfVxuXG4gICAgaWYgKCFjb25maWcgJiYgdGhpcy5vbmx5Q29uZmlnKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIC8vIE9wdGlvbnMgcGFzc2VkIHRvIGBqc2NzYCBmcm9tIHBhY2thZ2UgY29uZmlndXJhdGlvblxuICAgIGNvbnN0IG9wdGlvbnMgPSB7fTtcbiAgICBjb25zdCBuZXdDb25maWcgPSBvYmplY3RBc3NpZ24oXG4gICAgICBvcHRpb25zLFxuICAgICAgY29uZmlnIHx8IHsgcHJlc2V0OiB0aGlzLnByZXNldCB9XG4gICAgKTtcbiAgICAvLyBgY29uZmlnUGF0aGAgaXMgbm9uLWVudW1lcmFibGUgc28gYE9iamVjdC5hc3NpZ25gIHdvbid0IGNvcHkgaXQuXG4gICAgLy8gV2l0aG91dCBhIHByb3BlciBgY29uZmlnUGF0aGAgSlNDUyBwbHVncyBjYW5ub3QgYmUgbG9hZGVkLiBTZWUgIzE3NS5cbiAgICBpZiAoIW5ld0NvbmZpZy5jb25maWdQYXRoICYmIGNvbmZpZyAmJiBjb25maWcuY29uZmlnUGF0aCkge1xuICAgICAgbmV3Q29uZmlnLmNvbmZpZ1BhdGggPSBjb25maWcuY29uZmlnUGF0aDtcbiAgICB9XG4gICAgcmV0dXJuIG5ld0NvbmZpZztcbiAgfVxuXG4gIHN0YXRpYyBmaXhTdHJpbmcoZWRpdG9yKSB7XG4gICAgc3RhcnRNZWFzdXJlKCdsaW50ZXItanNjczogRml4Jyk7XG4gICAgY29uc3QgZWRpdG9yUGF0aCA9IGVkaXRvci5nZXRQYXRoKCk7XG4gICAgY29uc3QgY29uZmlnID0gdGhpcy5nZXRDb25maWcoZWRpdG9yUGF0aCk7XG4gICAgaWYgKCFjb25maWcpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBMb2FkIEpTQ1MgaWYgaXQgaGFzbid0IGFscmVhZHkgYmVlbiBsb2FkZWRcbiAgICBpZiAoIUpTQ1MpIHtcbiAgICAgIEpTQ1MgPSByZXF1aXJlKCdqc2NzJyk7XG4gICAgfVxuXG4gICAgLy8gV2UgbmVlZCByZS1pbml0aWFsaXplIEpTQ1MgYmVmb3JlIGV2ZXJ5IGxpbnRcbiAgICAvLyBvciBpdCB3aWxsIGxvb3NlcyB0aGUgZXJyb3JzLCBkaWRuJ3QgdHJhY2UgdGhlIGVycm9yXG4gICAgLy8gbXVzdCBiZSBzb21ldGhpbmcgd2l0aCBuZXcgMi4wLjAgSlNDU1xuICAgIHRoaXMuanNjcyA9IG5ldyBKU0NTKCk7XG4gICAgdGhpcy5qc2NzLnJlZ2lzdGVyRGVmYXVsdFJ1bGVzKCk7XG4gICAgdGhpcy5qc2NzLmNvbmZpZ3VyZShjb25maWcpO1xuXG4gICAgY29uc3QgZWRpdG9yVGV4dCA9IGVkaXRvci5nZXRUZXh0KCk7XG4gICAgY29uc3QgZml4ZWRUZXh0ID0gdGhpcy5qc2NzLmZpeFN0cmluZyhlZGl0b3JUZXh0LCBlZGl0b3JQYXRoKS5vdXRwdXQ7XG4gICAgaWYgKGVkaXRvclRleHQgPT09IGZpeGVkVGV4dCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGN1cnNvclBvc2l0aW9uID0gZWRpdG9yLmdldEN1cnNvclNjcmVlblBvc2l0aW9uKCk7XG4gICAgZWRpdG9yLnNldFRleHQoZml4ZWRUZXh0KTtcbiAgICBlZGl0b3Iuc2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oY3Vyc29yUG9zaXRpb24pO1xuICAgIGVuZE1lYXN1cmUoJ2xpbnRlci1qc2NzOiBGaXgnKTtcbiAgfVxufVxuIl19
//# sourceURL=/home/cin_chalic/.atom/packages/linter-jscs/src/linter-jscs.js
