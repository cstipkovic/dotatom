Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _fsPlus = require('fs-plus');

var _fsPlus2 = _interopRequireDefault(_fsPlus);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _werkzeug = require('./werkzeug');

'use babel';

var Composer = (function () {
  function Composer() {
    _classCallCheck(this, Composer);
  }

  _createClass(Composer, [{
    key: 'destroy',
    value: function destroy() {
      this.destroyProgressIndicator();
      this.destroyErrorIndicator();
      this.destroyErrorMarkers();
    }
  }, {
    key: 'build',
    value: _asyncToGenerator(function* () {
      var _this = this;

      var _getEditorDetails = this.getEditorDetails();

      var editor = _getEditorDetails.editor;
      var filePath = _getEditorDetails.filePath;

      if (!filePath) {
        latex.log.warning('File needs to be saved to disk before it can be TeXified.');
        return Promise.reject(false);
      }

      if (!this.isTexFile(filePath)) {
        latex.log.warning((0, _werkzeug.heredoc)('File does not seem to be a TeX file\n        unsupported extension \'' + _path2['default'].extname(filePath) + '\'.'));
        return Promise.reject(false);
      }

      if (editor.isModified()) {
        editor.save(); // TODO: Make this configurable?
      }

      var builder = latex.getBuilder();
      var rootFilePath = this.resolveRootFilePath(filePath);

      this.destroyErrorMarkers();
      this.destroyErrorIndicator();
      this.showProgressIndicator();

      return new Promise(_asyncToGenerator(function* (resolve, reject) {
        var statusCode = undefined,
            result = undefined;

        var showBuildError = function showBuildError() {
          _this.showError(statusCode, result, builder);
          reject(statusCode);
        };

        try {
          statusCode = yield builder.run(rootFilePath);
          result = builder.parseLogFile(rootFilePath);
          if (statusCode > 0 || !result || !result.outputFilePath) {
            showBuildError(statusCode, result, builder);
            return;
          }

          if (_this.shouldMoveResult()) {
            _this.moveResult(result, rootFilePath);
          }

          _this.showResult(result);
          resolve(statusCode);
        } catch (error) {
          console.error(error.message);
          reject(error.message);
        } finally {
          _this.destroyProgressIndicator();
        }
      }));
    })
  }, {
    key: 'sync',
    value: function sync() {
      var _getEditorDetails2 = this.getEditorDetails();

      var filePath = _getEditorDetails2.filePath;
      var lineNumber = _getEditorDetails2.lineNumber;

      if (!filePath || !this.isTexFile(filePath)) {
        return;
      }

      var outputFilePath = this.resolveOutputFilePath(filePath);
      if (!outputFilePath) {
        latex.log.warning('Could not resolve path to output file associated with the current file.');
        return;
      }

      var opener = latex.getOpener();
      if (opener) {
        opener.open(outputFilePath, filePath, lineNumber);
      }
    }
  }, {
    key: 'clean',
    value: _asyncToGenerator(function* () {
      var _getEditorDetails3 = this.getEditorDetails();

      var filePath = _getEditorDetails3.filePath;

      if (!filePath || !this.isTexFile(filePath)) {
        return Promise.reject();
      }

      var rootFilePath = this.resolveRootFilePath(filePath);
      var rootPath = _path2['default'].dirname(rootFilePath);

      var outdir = atom.config.get('latex.outputDirectory');
      if (outdir) {
        rootPath = _path2['default'].join(rootPath, outdir);
      }

      var rootFile = _path2['default'].basename(rootFilePath);
      rootFile = rootFile.substring(0, rootFile.lastIndexOf('.'));

      var cleanExtensions = atom.config.get('latex.cleanExtensions');
      return yield Promise.all(cleanExtensions.map(_asyncToGenerator(function* (extension) {
        var candidatePath = _path2['default'].join(rootPath, rootFile + extension);
        return new Promise(_asyncToGenerator(function* (resolve) {
          _fsPlus2['default'].remove(candidatePath, function (error) {
            resolve({ filePath: candidatePath, error: error });
          });
        }));
      })));
    })
  }, {
    key: 'setStatusBar',
    value: function setStatusBar(statusBar) {
      this.statusBar = statusBar;
    }
  }, {
    key: 'moveResult',
    value: function moveResult(result, filePath) {
      var originalOutputFilePath = result.outputFilePath;
      result.outputFilePath = this.alterParentPath(filePath, originalOutputFilePath);
      if (_fsPlus2['default'].existsSync(originalOutputFilePath)) {
        _fsPlus2['default'].removeSync(result.outputFilePath);
        _fsPlus2['default'].moveSync(originalOutputFilePath, result.outputFilePath);
      }

      var originalSyncFilePath = originalOutputFilePath.replace(/\.pdf$/, '.synctex.gz');
      if (_fsPlus2['default'].existsSync(originalSyncFilePath)) {
        var syncFilePath = this.alterParentPath(filePath, originalSyncFilePath);
        _fsPlus2['default'].removeSync(syncFilePath);
        _fsPlus2['default'].moveSync(originalSyncFilePath, syncFilePath);
      }
    }
  }, {
    key: 'resolveRootFilePath',
    value: function resolveRootFilePath(filePath) {
      var MasterTexFinder = require('./master-tex-finder');
      var finder = new MasterTexFinder(filePath);
      return finder.getMasterTexPath();
    }
  }, {
    key: 'resolveOutputFilePath',
    value: function resolveOutputFilePath(filePath) {
      var outputFilePath = undefined,
          rootFilePath = undefined;

      if (this.outputLookup) {
        outputFilePath = this.outputLookup[filePath];
      }

      if (!outputFilePath) {
        rootFilePath = this.resolveRootFilePath(filePath);

        var builder = latex.getBuilder();
        var result = builder.parseLogFile(rootFilePath);
        if (!result || !result.outputFilePath) {
          latex.log.warning('Log file parsing failed!');
          return null;
        }

        this.outputLookup = this.outputLookup || {};
        this.outputLookup[filePath] = result.outputFilePath;
      }

      if (this.shouldMoveResult()) {
        outputFilePath = this.alterParentPath(rootFilePath, outputFilePath);
      }

      return outputFilePath;
    }
  }, {
    key: 'showResult',
    value: function showResult(result) {
      if (!this.shouldOpenResult()) {
        return;
      }

      var opener = latex.getOpener();
      if (opener) {
        var _getEditorDetails4 = this.getEditorDetails();

        var filePath = _getEditorDetails4.filePath;
        var lineNumber = _getEditorDetails4.lineNumber;

        opener.open(result.outputFilePath, filePath, lineNumber);
      }
    }
  }, {
    key: 'showError',
    value: function showError(statusCode, result, builder) {
      this.showErrorIndicator(result);
      this.showErrorMarkers(result);
      latex.log.error(statusCode, result, builder);
    }
  }, {
    key: 'showProgressIndicator',
    value: function showProgressIndicator() {
      if (!this.statusBar) {
        return null;
      }
      if (this.indicator) {
        return this.indicator;
      }

      var ProgressIndicator = require('./status-bar/progress-indicator');
      this.indicator = new ProgressIndicator();
      this.statusBar.addRightTile({
        item: this.indicator,
        priority: 9001
      });
    }
  }, {
    key: 'showErrorIndicator',
    value: function showErrorIndicator(result) {
      if (!this.statusBar) {
        return null;
      }
      if (this.errorIndicator) {
        return this.errorIndicator;
      }

      var ErrorIndicator = require('./status-bar/error-indicator');
      this.errorIndicator = new ErrorIndicator(result);
      this.statusBar.addRightTile({
        item: this.errorIndicator,
        priority: 9001
      });
    }
  }, {
    key: 'showErrorMarkers',
    value: function showErrorMarkers(result) {
      var _this2 = this;

      if (this.errorMarkers && this.errorMarkers.length > 0) {
        this.destroyErrorMarkers();
      }
      var editors = this.getAllEditors();
      this.errorMarkers = [];
      var ErrorMarker = require('./error-marker');

      var _loop = function (editor) {
        if (editor.getPath()) {
          var errors = _lodash2['default'].filter(result.errors, function (error) {
            return editor.getPath().includes(error.filePath);
          });
          var warnings = _lodash2['default'].filter(result.warnings, function (warning) {
            return editor.getPath().includes(warning.filePath);
          });
          if (errors.length || warnings.length) {
            _this2.errorMarkers.push(new ErrorMarker(editor, errors, warnings));
          }
        }
      };

      for (var editor of editors) {
        _loop(editor);
      }
    }
  }, {
    key: 'destroyProgressIndicator',
    value: function destroyProgressIndicator() {
      if (this.indicator) {
        this.indicator.element.remove();
        this.indicator = null;
      }
    }
  }, {
    key: 'destroyErrorIndicator',
    value: function destroyErrorIndicator() {
      if (this.errorIndicator) {
        this.errorIndicator.element.remove();
        this.errorIndicator = null;
      }
    }
  }, {
    key: 'destroyErrorMarkers',
    value: function destroyErrorMarkers() {
      if (this.errorMarkers) {
        for (var errorMarker of this.errorMarkers) {
          errorMarker.clear();
          errorMarker = null;
        }
        this.errorMarkers = [];
      }
    }
  }, {
    key: 'isTexFile',
    value: function isTexFile(filePath) {
      // TODO: Improve will suffice for the time being.
      return !filePath || filePath.search(/\.(tex|lhs)$/) > 0;
    }
  }, {
    key: 'getEditorDetails',
    value: function getEditorDetails() {
      var editor = atom.workspace.getActiveTextEditor();
      var filePath = undefined,
          lineNumber = undefined;
      if (editor) {
        filePath = editor.getPath();
        lineNumber = editor.getCursorBufferPosition().row + 1;
      }

      return {
        editor: editor,
        filePath: filePath,
        lineNumber: lineNumber
      };
    }
  }, {
    key: 'getAllEditors',
    value: function getAllEditors() {
      return atom.workspace.getTextEditors();
    }
  }, {
    key: 'alterParentPath',
    value: function alterParentPath(targetPath, originalPath) {
      var targetDir = _path2['default'].dirname(targetPath);
      return _path2['default'].join(targetDir, _path2['default'].basename(originalPath));
    }
  }, {
    key: 'shouldMoveResult',
    value: function shouldMoveResult() {
      var moveResult = atom.config.get('latex.moveResultToSourceDirectory');
      var outputDirectory = atom.config.get('latex.outputDirectory');
      return moveResult && outputDirectory.length > 0;
    }
  }, {
    key: 'shouldOpenResult',
    value: function shouldOpenResult() {
      return atom.config.get('latex.openResultAfterBuild');
    }
  }]);

  return Composer;
})();

exports['default'] = Composer;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL2NvbXBvc2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztzQkFFYyxRQUFROzs7O3NCQUNQLFNBQVM7Ozs7b0JBQ1AsTUFBTTs7Ozt3QkFDRCxZQUFZOztBQUxsQyxXQUFXLENBQUE7O0lBT1UsUUFBUTtXQUFSLFFBQVE7MEJBQVIsUUFBUTs7O2VBQVIsUUFBUTs7V0FDbkIsbUJBQUc7QUFDVCxVQUFJLENBQUMsd0JBQXdCLEVBQUUsQ0FBQTtBQUMvQixVQUFJLENBQUMscUJBQXFCLEVBQUUsQ0FBQTtBQUM1QixVQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQTtLQUMzQjs7OzZCQUVXLGFBQUc7Ozs4QkFDYyxJQUFJLENBQUMsZ0JBQWdCLEVBQUU7O1VBQTNDLE1BQU0scUJBQU4sTUFBTTtVQUFFLFFBQVEscUJBQVIsUUFBUTs7QUFFdkIsVUFBSSxDQUFDLFFBQVEsRUFBRTtBQUNiLGFBQUssQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLDJEQUEyRCxDQUFDLENBQUE7QUFDOUUsZUFBTyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFBO09BQzdCOztBQUVELFVBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxFQUFFO0FBQzdCLGFBQUssQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLGlHQUNTLGtCQUFLLE9BQU8sQ0FBQyxRQUFRLENBQUMsU0FBSyxDQUFDLENBQUE7QUFDdkQsZUFBTyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFBO09BQzdCOztBQUVELFVBQUksTUFBTSxDQUFDLFVBQVUsRUFBRSxFQUFFO0FBQ3ZCLGNBQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQTtPQUNkOztBQUVELFVBQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxVQUFVLEVBQUUsQ0FBQTtBQUNsQyxVQUFNLFlBQVksR0FBRyxJQUFJLENBQUMs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LE1BQU0sQ0FBQyxHQUFHLENBQUMsbUNBQW1DLENBQUMsQ0FBQTtBQUN2RSxVQUFNLGVBQWUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFBO0FBQ2hFLGFBQU8sVUFBVSxJQUFJLGVBQWUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFBO0tBQ2hEOzs7V0FFZ0IsNEJBQUc7QUFBRSxhQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLDRCQUE0QixDQUFDLENBQUE7S0FBRTs7O1NBelJ6RCxRQUFROzs7cUJBQVIsUUFBUSIsImZpbGUiOiIvaG9tZS9jaW5fY2hhbGljLy5hdG9tL3BhY2thZ2VzL2xhdGV4L2xpYi9jb21wb3Nlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmltcG9ydCBfIGZyb20gJ2xvZGFzaCdcbmltcG9ydCBmcyBmcm9tICdmcy1wbHVzJ1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcbmltcG9ydCB7aGVyZWRvY30gZnJvbSAnLi93ZXJremV1ZydcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29tcG9zZXIge1xuICBkZXN0cm95ICgpIHtcbiAgICB0aGlzLmRlc3Ryb3lQcm9ncmVzc0luZGljYXRvcigpXG4gICAgdGhpcy5kZXN0cm95RXJyb3JJbmRpY2F0b3IoKVxuICAgIHRoaXMuZGVzdHJveUVycm9yTWFya2VycygpXG4gIH1cblxuICBhc3luYyBidWlsZCAoKSB7XG4gICAgY29uc3Qge2VkaXRvciwgZmlsZVBhdGh9ID0gdGhpcy5nZXRFZGl0b3JEZXRhaWxzKClcblxuICAgIGlmICghZmlsZVBhdGgpIHtcbiAgICAgIGxhdGV4LmxvZy53YXJuaW5nKCdGaWxlIG5lZWRzIHRvIGJlIHNhdmVkIHRvIGRpc2sgYmVmb3JlIGl0IGNhbiBiZSBUZVhpZmllZC4nKVxuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KGZhbHNlKVxuICAgIH1cblxuICAgIGlmICghdGhpcy5pc1RleEZpbGUoZmlsZVBhdGgpKSB7XG4gICAgICBsYXRleC5sb2cud2FybmluZyhoZXJlZG9jKGBGaWxlIGRvZXMgbm90IHNlZW0gdG8gYmUgYSBUZVggZmlsZVxuICAgICAgICB1bnN1cHBvcnRlZCBleHRlbnNpb24gJyR7cGF0aC5leHRuYW1lKGZpbGVQYXRoKX0nLmApKVxuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KGZhbHNlKVxuICAgIH1cblxuICAgIGlmIChlZGl0b3IuaXNNb2RpZmllZCgpKSB7XG4gICAgICBlZGl0b3Iuc2F2ZSgpIC8vIFRPRE86IE1ha2UgdGhpcyBjb25maWd1cmFibGU/XG4gICAgfVxuXG4gICAgY29uc3QgYnVpbGRlciA9IGxhdGV4LmdldEJ1aWxkZXIoKVxuICAgIGNvbnN0IHJvb3RGaWxlUGF0aCA9IHRoaXMucmVzb2x2ZVJvb3RGaWxlUGF0aChmaWxlUGF0aClcblxuICAgIHRoaXMuZGVzdHJveUVycm9yTWFya2VycygpXG4gICAgdGhpcy5kZXN0cm95RXJyb3JJbmRpY2F0b3IoKVxuICAgIHRoaXMuc2hvd1Byb2dyZXNzSW5kaWNhdG9yKClcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBsZXQgc3RhdHVzQ29kZSwgcmVzdWx0XG5cbiAgICAgIGNvbnN0IHNob3dCdWlsZEVycm9yID0gKCkgPT4ge1xuICAgICAgICB0aGlzLnNob3dFcnJvcihzdGF0dXNDb2RlLCByZXN1bHQsIGJ1aWxkZXIpXG4gICAgICAgIHJlamVjdChzdGF0dXNDb2RlKVxuICAgICAgfVxuXG4gICAgICB0cnkge1xuICAgICAgICBzdGF0dXNDb2RlID0gYXdhaXQgYnVpbGRlci5ydW4ocm9vdEZpbGVQYXRoKVxuICAgICAgICByZXN1bHQgPSBidWlsZGVyLnBhcnNlTG9nRmlsZShyb290RmlsZVBhdGgpXG4gICAgICAgIGlmIChzdGF0dXNDb2RlID4gMCB8fCAhcmVzdWx0IHx8ICFyZXN1bHQub3V0cHV0RmlsZVBhdGgpIHtcbiAgICAgICAgICBzaG93QnVpbGRFcnJvcihzdGF0dXNDb2RlLCByZXN1bHQsIGJ1aWxkZXIpXG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5zaG91bGRNb3ZlUmVzdWx0KCkpIHtcbiAgICAgICAgICB0aGlzLm1vdmVSZXN1bHQocmVzdWx0LCByb290RmlsZVBhdGgpXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNob3dSZXN1bHQocmVzdWx0KVxuICAgICAgICByZXNvbHZlKHN0YXR1c0NvZGUpXG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yLm1lc3NhZ2UpXG4gICAgICAgIHJlamVjdChlcnJvci5tZXNzYWdlKVxuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgdGhpcy5kZXN0cm95UHJvZ3Jlc3NJbmRpY2F0b3IoKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBzeW5jICgpIHtcbiAgICBjb25zdCB7ZmlsZVBhdGgsIGxpbmVOdW1iZXJ9ID0gdGhpcy5nZXRFZGl0b3JEZXRhaWxzKClcbiAgICBpZiAoIWZpbGVQYXRoIHx8ICF0aGlzLmlzVGV4RmlsZShmaWxlUGF0aCkpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGNvbnN0IG91dHB1dEZpbGVQYXRoID0gdGhpcy5yZXNvbHZlT3V0cHV0RmlsZVBhdGgoZmlsZVBhdGgpXG4gICAgaWYgKCFvdXRwdXRGaWxlUGF0aCkge1xuICAgICAgbGF0ZXgubG9nLndhcm5pbmcoJ0NvdWxkIG5vdCByZXNvbHZlIHBhdGggdG8gb3V0cHV0IGZpbGUgYXNzb2NpYXRlZCB3aXRoIHRoZSBjdXJyZW50IGZpbGUuJylcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGNvbnN0IG9wZW5lciA9IGxhdGV4LmdldE9wZW5lcigpXG4gICAgaWYgKG9wZW5lcikge1xuICAgICAgb3BlbmVyLm9wZW4ob3V0cHV0RmlsZVBhdGgsIGZpbGVQYXRoLCBsaW5lTnVtYmVyKVxuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGNsZWFuICgpIHtcbiAgICBjb25zdCB7ZmlsZVBhdGh9ID0gdGhpcy5nZXRFZGl0b3JEZXRhaWxzKClcbiAgICBpZiAoIWZpbGVQYXRoIHx8ICF0aGlzLmlzVGV4RmlsZShmaWxlUGF0aCkpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdCgpXG4gICAgfVxuXG4gICAgY29uc3Qgcm9vdEZpbGVQYXRoID0gdGhpcy5yZXNvbHZlUm9vdEZpbGVQYXRoKGZpbGVQYXRoKVxuICAgIGxldCByb290UGF0aCA9IHBhdGguZGlybmFtZShyb290RmlsZVBhdGgpXG5cbiAgICBsZXQgb3V0ZGlyID0gYXRvbS5jb25maWcuZ2V0KCdsYXRleC5vdXRwdXREaXJlY3RvcnknKVxuICAgIGlmIChvdXRkaXIpIHtcbiAgICAgIHJvb3RQYXRoID0gcGF0aC5qb2luKHJvb3RQYXRoLCBvdXRkaXIpXG4gICAgfVxuXG4gICAgbGV0IHJvb3RGaWxlID0gcGF0aC5iYXNlbmFtZShyb290RmlsZVBhdGgpXG4gICAgcm9vdEZpbGUgPSByb290RmlsZS5zdWJzdHJpbmcoMCwgcm9vdEZpbGUubGFzdEluZGV4T2YoJy4nKSlcblxuICAgIGNvbnN0IGNsZWFuRXh0ZW5zaW9ucyA9IGF0b20uY29uZmlnLmdldCgnbGF0ZXguY2xlYW5FeHRlbnNpb25zJylcbiAgICByZXR1cm4gYXdhaXQqIGNsZWFuRXh0ZW5zaW9ucy5tYXAoYXN5bmMgKGV4dGVuc2lvbikgPT4ge1xuICAgICAgY29uc3QgY2FuZGlkYXRlUGF0aCA9IHBhdGguam9pbihyb290UGF0aCwgcm9vdEZpbGUgKyBleHRlbnNpb24pXG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHJlc29sdmUpID0+IHtcbiAgICAgICAgZnMucmVtb3ZlKGNhbmRpZGF0ZVBhdGgsIChlcnJvcikgPT4ge1xuICAgICAgICAgIHJlc29sdmUoe2ZpbGVQYXRoOiBjYW5kaWRhdGVQYXRoLCBlcnJvcjogZXJyb3J9KVxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9KVxuICB9XG5cbiAgc2V0U3RhdHVzQmFyIChzdGF0dXNCYXIpIHtcbiAgICB0aGlzLnN0YXR1c0JhciA9IHN0YXR1c0JhclxuICB9XG5cbiAgbW92ZVJlc3VsdCAocmVzdWx0LCBmaWxlUGF0aCkge1xuICAgIGNvbnN0IG9yaWdpbmFsT3V0cHV0RmlsZVBhdGggPSByZXN1bHQub3V0cHV0RmlsZVBhdGhcbiAgICByZXN1bHQub3V0cHV0RmlsZVBhdGggPSB0aGlzLmFsdGVyUGFyZW50UGF0aChmaWxlUGF0aCwgb3JpZ2luYWxPdXRwdXRGaWxlUGF0aClcbiAgICBpZiAoZnMuZXhpc3RzU3luYyhvcmlnaW5hbE91dHB1dEZpbGVQYXRoKSkge1xuICAgICAgZnMucmVtb3ZlU3luYyhyZXN1bHQub3V0cHV0RmlsZVBhdGgpXG4gICAgICBmcy5tb3ZlU3luYyhvcmlnaW5hbE91dHB1dEZpbGVQYXRoLCByZXN1bHQub3V0cHV0RmlsZVBhdGgpXG4gICAgfVxuXG4gICAgY29uc3Qgb3JpZ2luYWxTeW5jRmlsZVBhdGggPSBvcmlnaW5hbE91dHB1dEZpbGVQYXRoLnJlcGxhY2UoL1xcLnBkZiQvLCAnLnN5bmN0ZXguZ3onKVxuICAgIGlmIChmcy5leGlzdHNTeW5jKG9yaWdpbmFsU3luY0ZpbGVQYXRoKSkge1xuICAgICAgY29uc3Qgc3luY0ZpbGVQYXRoID0gdGhpcy5hbHRlclBhcmVudFBhdGgoZmlsZVBhdGgsIG9yaWdpbmFsU3luY0ZpbGVQYXRoKVxuICAgICAgZnMucmVtb3ZlU3luYyhzeW5jRmlsZVBhdGgpXG4gICAgICBmcy5tb3ZlU3luYyhvcmlnaW5hbFN5bmNGaWxlUGF0aCwgc3luY0ZpbGVQYXRoKVxuICAgIH1cbiAgfVxuXG4gIHJlc29sdmVSb290RmlsZVBhdGggKGZpbGVQYXRoKSB7XG4gICAgY29uc3QgTWFzdGVyVGV4RmluZGVyID0gcmVxdWlyZSgnLi9tYXN0ZXItdGV4LWZpbmRlcicpXG4gICAgY29uc3QgZmluZGVyID0gbmV3IE1hc3RlclRleEZpbmRlcihmaWxlUGF0aClcbiAgICByZXR1cm4gZmluZGVyLmdldE1hc3RlclRleFBhdGgoKVxuICB9XG5cbiAgcmVzb2x2ZU91dHB1dEZpbGVQYXRoIChmaWxlUGF0aCkge1xuICAgIGxldCBvdXRwdXRGaWxlUGF0aCwgcm9vdEZpbGVQYXRoXG5cbiAgICBpZiAodGhpcy5vdXRwdXRMb29rdXApIHtcbiAgICAgIG91dHB1dEZpbGVQYXRoID0gdGhpcy5vdXRwdXRMb29rdXBbZmlsZVBhdGhdXG4gICAgfVxuXG4gICAgaWYgKCFvdXRwdXRGaWxlUGF0aCkge1xuICAgICAgcm9vdEZpbGVQYXRoID0gdGhpcy5yZXNvbHZlUm9vdEZpbGVQYXRoKGZpbGVQYXRoKVxuXG4gICAgICBjb25zdCBidWlsZGVyID0gbGF0ZXguZ2V0QnVpbGRlcigpXG4gICAgICBjb25zdCByZXN1bHQgPSBidWlsZGVyLnBhcnNlTG9nRmlsZShyb290RmlsZVBhdGgpXG4gICAgICBpZiAoIXJlc3VsdCB8fCAhcmVzdWx0Lm91dHB1dEZpbGVQYXRoKSB7XG4gICAgICAgIGxhdGV4LmxvZy53YXJuaW5nKCdMb2cgZmlsZSBwYXJzaW5nIGZhaWxlZCEnKVxuICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgfVxuXG4gICAgICB0aGlzLm91dHB1dExvb2t1cCA9IHRoaXMub3V0cHV0TG9va3VwIHx8IHt9XG4gICAgICB0aGlzLm91dHB1dExvb2t1cFtmaWxlUGF0aF0gPSByZXN1bHQub3V0cHV0RmlsZVBhdGhcbiAgICB9XG5cbiAgICBpZiAodGhpcy5zaG91bGRNb3ZlUmVzdWx0KCkpIHtcbiAgICAgIG91dHB1dEZpbGVQYXRoID0gdGhpcy5hbHRlclBhcmVudFBhdGgocm9vdEZpbGVQYXRoLCBvdXRwdXRGaWxlUGF0aClcbiAgICB9XG5cbiAgICByZXR1cm4gb3V0cHV0RmlsZVBhdGhcbiAgfVxuXG4gIHNob3dSZXN1bHQgKHJlc3VsdCkge1xuICAgIGlmICghdGhpcy5zaG91bGRPcGVuUmVzdWx0KCkpIHsgcmV0dXJuIH1cblxuICAgIGNvbnN0IG9wZW5lciA9IGxhdGV4LmdldE9wZW5lcigpXG4gICAgaWYgKG9wZW5lcikge1xuICAgICAgY29uc3Qge2ZpbGVQYXRoLCBsaW5lTnVtYmVyfSA9IHRoaXMuZ2V0RWRpdG9yRGV0YWlscygpXG4gICAgICBvcGVuZXIub3BlbihyZXN1bHQub3V0cHV0RmlsZVBhdGgsIGZpbGVQYXRoLCBsaW5lTnVtYmVyKVxuICAgIH1cbiAgfVxuXG4gIHNob3dFcnJvciAoc3RhdHVzQ29kZSwgcmVzdWx0LCBidWlsZGVyKSB7XG4gICAgdGhpcy5zaG93RXJyb3JJbmRpY2F0b3IocmVzdWx0KVxuICAgIHRoaXMuc2hvd0Vycm9yTWFya2VycyhyZXN1bHQpXG4gICAgbGF0ZXgubG9nLmVycm9yKHN0YXR1c0NvZGUsIHJlc3VsdCwgYnVpbGRlcilcbiAgfVxuXG4gIHNob3dQcm9ncmVzc0luZGljYXRvciAoKSB7XG4gICAgaWYgKCF0aGlzLnN0YXR1c0JhcikgeyByZXR1cm4gbnVsbCB9XG4gICAgaWYgKHRoaXMuaW5kaWNhdG9yKSB7IHJldHVybiB0aGlzLmluZGljYXRvciB9XG5cbiAgICBjb25zdCBQcm9ncmVzc0luZGljYXRvciA9IHJlcXVpcmUoJy4vc3RhdHVzLWJhci9wcm9ncmVzcy1pbmRpY2F0b3InKVxuICAgIHRoaXMuaW5kaWNhdG9yID0gbmV3IFByb2dyZXNzSW5kaWNhdG9yKClcbiAgICB0aGlzLnN0YXR1c0Jhci5hZGRSaWdodFRpbGUoe1xuICAgICAgaXRlbTogdGhpcy5pbmRpY2F0b3IsXG4gICAgICBwcmlvcml0eTogOTAwMVxuICAgIH0pXG4gIH1cblxuICBzaG93RXJyb3JJbmRpY2F0b3IgKHJlc3VsdCkge1xuICAgIGlmICghdGhpcy5zdGF0dXNCYXIpIHsgcmV0dXJuIG51bGwgfVxuICAgIGlmICh0aGlzLmVycm9ySW5kaWNhdG9yKSB7IHJldHVybiB0aGlzLmVycm9ySW5kaWNhdG9yIH1cblxuICAgIGNvbnN0IEVycm9ySW5kaWNhdG9yID0gcmVxdWlyZSgnLi9zdGF0dXMtYmFyL2Vycm9yLWluZGljYXRvcicpXG4gICAgdGhpcy5lcnJvckluZGljYXRvciA9IG5ldyBFcnJvckluZGljYXRvcihyZXN1bHQpXG4gICAgdGhpcy5zdGF0dXNCYXIuYWRkUmlnaHRUaWxlKHtcbiAgICAgIGl0ZW06IHRoaXMuZXJyb3JJbmRpY2F0b3IsXG4gICAgICBwcmlvcml0eTogOTAwMVxuICAgIH0pXG4gIH1cbiAgc2hvd0Vycm9yTWFya2VycyAocmVzdWx0KSB7XG4gICAgaWYgKHRoaXMuZXJyb3JNYXJrZXJzICYmIHRoaXMuZXJyb3JNYXJrZXJzLmxlbmd0aCA+IDApIHsgdGhpcy5kZXN0cm95RXJyb3JNYXJrZXJzKCkgfVxuICAgIGNvbnN0IGVkaXRvcnMgPSB0aGlzLmdldEFsbEVkaXRvcnMoKVxuICAgIHRoaXMuZXJyb3JNYXJrZXJzID0gW11cbiAgICBjb25zdCBFcnJvck1hcmtlciA9IHJlcXVpcmUoJy4vZXJyb3ItbWFya2VyJylcbiAgICBmb3IgKGxldCBlZGl0b3Igb2YgZWRpdG9ycykge1xuICAgICAgaWYgKGVkaXRvci5nZXRQYXRoKCkpIHtcbiAgICAgICAgbGV0IGVycm9ycyA9IF8uZmlsdGVyKHJlc3VsdC5lcnJvcnMsIGVycm9yID0+IHtcbiAgICAgICAgICByZXR1cm4gZWRpdG9yLmdldFBhdGgoKS5pbmNsdWRlcyhlcnJvci5maWxlUGF0aClcbiAgICAgICAgfSlcbiAgICAgICAgbGV0IHdhcm5pbmdzID0gXy5maWx0ZXIocmVzdWx0Lndhcm5pbmdzLCB3YXJuaW5nID0+IHtcbiAgICAgICAgICByZXR1cm4gZWRpdG9yLmdldFBhdGgoKS5pbmNsdWRlcyh3YXJuaW5nLmZpbGVQYXRoKVxuICAgICAgICB9KVxuICAgICAgICBpZiAoZXJyb3JzLmxlbmd0aCB8fCB3YXJuaW5ncy5sZW5ndGgpIHtcbiAgICAgICAgICB0aGlzLmVycm9yTWFya2Vycy5wdXNoKG5ldyBFcnJvck1hcmtlcihlZGl0b3IsIGVycm9ycywgd2FybmluZ3MpKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZGVzdHJveVByb2dyZXNzSW5kaWNhdG9yICgpIHtcbiAgICBpZiAodGhpcy5pbmRpY2F0b3IpIHtcbiAgICAgIHRoaXMuaW5kaWNhdG9yLmVsZW1lbnQucmVtb3ZlKClcbiAgICAgIHRoaXMuaW5kaWNhdG9yID0gbnVsbFxuICAgIH1cbiAgfVxuXG4gIGRlc3Ryb3lFcnJvckluZGljYXRvciAoKSB7XG4gICAgaWYgKHRoaXMuZXJyb3JJbmRpY2F0b3IpIHtcbiAgICAgIHRoaXMuZXJyb3JJbmRpY2F0b3IuZWxlbWVudC5yZW1vdmUoKVxuICAgICAgdGhpcy5lcnJvckluZGljYXRvciA9IG51bGxcbiAgICB9XG4gIH1cblxuICBkZXN0cm95RXJyb3JNYXJrZXJzICgpIHtcbiAgICBpZiAodGhpcy5lcnJvck1hcmtlcnMpIHtcbiAgICAgIGZvciAobGV0IGVycm9yTWFya2VyIG9mIHRoaXMuZXJyb3JNYXJrZXJzKSB7XG4gICAgICAgIGVycm9yTWFya2VyLmNsZWFyKClcbiAgICAgICAgZXJyb3JNYXJrZXIgPSBudWxsXG4gICAgICB9XG4gICAgICB0aGlzLmVycm9yTWFya2VycyA9IFtdXG4gICAgfVxuICB9XG5cbiAgaXNUZXhGaWxlIChmaWxlUGF0aCkge1xuICAgIC8vIFRPRE86IEltcHJvdmUgd2lsbCBzdWZmaWNlIGZvciB0aGUgdGltZSBiZWluZy5cbiAgICByZXR1cm4gIWZpbGVQYXRoIHx8IGZpbGVQYXRoLnNlYXJjaCgvXFwuKHRleHxsaHMpJC8pID4gMFxuICB9XG5cbiAgZ2V0RWRpdG9yRGV0YWlscyAoKSB7XG4gICAgY29uc3QgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgbGV0IGZpbGVQYXRoLCBsaW5lTnVtYmVyXG4gICAgaWYgKGVkaXRvcikge1xuICAgICAgZmlsZVBhdGggPSBlZGl0b3IuZ2V0UGF0aCgpXG4gICAgICBsaW5lTnVtYmVyID0gZWRpdG9yLmdldEN1cnNvckJ1ZmZlclBvc2l0aW9uKCkucm93ICsgMVxuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBlZGl0b3I6IGVkaXRvcixcbiAgICAgIGZpbGVQYXRoOiBmaWxlUGF0aCxcbiAgICAgIGxpbmVOdW1iZXI6IGxpbmVOdW1iZXJcbiAgICB9XG4gIH1cblxuICBnZXRBbGxFZGl0b3JzICgpIHtcbiAgICByZXR1cm4gYXRvbS53b3Jrc3BhY2UuZ2V0VGV4dEVkaXRvcnMoKVxuICB9XG5cbiAgYWx0ZXJQYXJlbnRQYXRoICh0YXJnZXRQYXRoLCBvcmlnaW5hbFBhdGgpIHtcbiAgICBjb25zdCB0YXJnZXREaXIgPSBwYXRoLmRpcm5hbWUodGFyZ2V0UGF0aClcbiAgICByZXR1cm4gcGF0aC5qb2luKHRhcmdldERpciwgcGF0aC5iYXNlbmFtZShvcmlnaW5hbFBhdGgpKVxuICB9XG5cbiAgc2hvdWxkTW92ZVJlc3VsdCAoKSB7XG4gICAgY29uc3QgbW92ZVJlc3VsdCA9IGF0b20uY29uZmlnLmdldCgnbGF0ZXgubW92ZVJlc3VsdFRvU291cmNlRGlyZWN0b3J5JylcbiAgICBjb25zdCBvdXRwdXREaXJlY3RvcnkgPSBhdG9tLmNvbmZpZy5nZXQoJ2xhdGV4Lm91dHB1dERpcmVjdG9yeScpXG4gICAgcmV0dXJuIG1vdmVSZXN1bHQgJiYgb3V0cHV0RGlyZWN0b3J5Lmxlbmd0aCA+IDBcbiAgfVxuXG4gIHNob3VsZE9wZW5SZXN1bHQgKCkgeyByZXR1cm4gYXRvbS5jb25maWcuZ2V0KCdsYXRleC5vcGVuUmVzdWx0QWZ0ZXJCdWlsZCcpIH1cbn1cbiJdfQ==
//# sourceURL=/home/cin_chalic/.atom/packages/latex/lib/composer.js
