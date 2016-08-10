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

var _builderRegistry = require('./builder-registry');

var _builderRegistry2 = _interopRequireDefault(_builderRegistry);

'use babel';

var Composer = (function () {
  function Composer() {
    _classCallCheck(this, Composer);

    this.builderRegistry = new _builderRegistry2['default']();
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

      var builder = this.getBuilder(filePath);
      if (builder == null) {
        latex.log.warning('No registered LaTeX builder can process ' + filePath + '.');
        return Promise.reject(false);
      }

      if (editor.isModified()) {
        editor.save(); // TODO: Make this configurable?
      }

      this.destroyErrorMarkers();
      this.destroyErrorIndicator();
      this.showProgressIndicator();

      return new Promise(_asyncToGenerator(function* (resolve, reject) {
        try {
          var rootFilePath = _this.resolveRootFilePath(filePath);
          var statusCode = yield builder.run(rootFilePath);
          var result = builder.parseLogFile(rootFilePath);
          if (statusCode > 0 || !result || !result.outputFilePath) {
            _this.showError(statusCode, result, builder);
            return reject(statusCode);
          }

          if (_this.shouldMoveResult()) {
            _this.moveResult(result, rootFilePath);
          }

          _this.showResult(result);
          return resolve(statusCode);
        } catch (error) {
          latex.log.error(error.message);
          return reject(error.message);
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
      return Promise.all(cleanExtensions.map(_asyncToGenerator(function* (extension) {
        var candidatePath = _path2['default'].join(rootPath, rootFile + extension);
        return new Promise(_asyncToGenerator(function* (resolve) {
          _fsPlus2['default'].remove(candidatePath, function (error) {
            return resolve({ filePath: candidatePath, error: error });
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
      if (!result || !result.errors) {
        return;
      }

      var ErrorMarker = require('./error-marker');

      this.errorMarkers = [];

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

      for (var editor of this.getAllEditors()) {
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
    key: 'getBuilder',
    value: function getBuilder(filePath) {
      var BuilderImpl = this.builderRegistry.getBuilder(filePath);
      return BuilderImpl != null ? new BuilderImpl() : null;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL2NvbXBvc2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztzQkFFYyxRQUFROzs7O3NCQUNQLFNBQVM7Ozs7b0JBQ1AsTUFBTTs7OzsrQkFDSyxvQkFBb0I7Ozs7QUFMaEQsV0FBVyxDQUFBOztJQU9VLFFBQVE7QUFDZixXQURPLFFBQVEsR0FDWjswQkFESSxRQUFROztBQUV6QixRQUFJLENBQUMsZUFBZSxHQUFHLGtDQUFxQixDQUFBO0dBQzdDOztlQUhrQixRQUFROztXQUtuQixtQkFBRztBQUNULFVBQUksQ0FBQyx3QkFBd0IsRUFBRSxDQUFBO0FBQy9CLFVBQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFBO0FBQzVCLFVBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFBO0tBQzNCOzs7NkJBRVcsYUFBRzs7OzhCQUNjLElBQUksQ0FBQyxnQkFBZ0IsRUFBRTs7VUFBM0MsTUFBTSxxQkFBTixNQUFNO1VBQUUsUUFBUSxxQkFBUixRQUFROztBQUV2QixVQUFJLENBQUMsUUFBUSxFQUFFO0FBQ2IsYUFBSyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsMkRBQTJELENBQUMsQ0FBQTtBQUM5RSxlQUFPLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUE7T0FDN0I7O0FBRUQsVUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQTtBQUN6QyxVQUFJLE9BQU8sSUFBSSxJQUFJLEVBQUU7QUFDbkIsYUFBSyxDQUFDLEdBQUcsQ0FBQyxPQUFPLDhDQUE0QyxRQUFRLE9BQUksQ0FBQTtBQUN6RSxlQUFPLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUE7T0FDN0I7O0FBRUQsVUFBSSxNQUFNLENBQUMsVUFBVSxFQUFFLEVBQUU7QUFDdkIsY0FBTSxDQUFDLElBQUksRUFBRSxDQUFBO09BQ2Q7O0FBRUQsVUFBSSxD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QUssSUFBSSxDQUFDLFNBQVMsRUFBRSxrQkFBSyxRQUFRLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQTtLQUN6RDs7O1dBRWdCLDRCQUFHO0FBQ2xCLFVBQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLG1DQUFtQyxDQUFDLENBQUE7QUFDdkUsVUFBTSxlQUFlLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsdUJBQXVCLENBQUMsQ0FBQTtBQUNoRSxhQUFPLFVBQVUsSUFBSSxlQUFlLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQTtLQUNoRDs7O1dBRWdCLDRCQUFHO0FBQUUsYUFBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFBO0tBQUU7OztTQTVSekQsUUFBUTs7O3FCQUFSLFFBQVEiLCJmaWxlIjoiL2hvbWUvY2luX2NoYWxpYy8uYXRvbS9wYWNrYWdlcy9sYXRleC9saWIvY29tcG9zZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnXG5pbXBvcnQgZnMgZnJvbSAnZnMtcGx1cydcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5pbXBvcnQgQnVpbGRlclJlZ2lzdHJ5IGZyb20gJy4vYnVpbGRlci1yZWdpc3RyeSdcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29tcG9zZXIge1xuICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgdGhpcy5idWlsZGVyUmVnaXN0cnkgPSBuZXcgQnVpbGRlclJlZ2lzdHJ5KClcbiAgfVxuXG4gIGRlc3Ryb3kgKCkge1xuICAgIHRoaXMuZGVzdHJveVByb2dyZXNzSW5kaWNhdG9yKClcbiAgICB0aGlzLmRlc3Ryb3lFcnJvckluZGljYXRvcigpXG4gICAgdGhpcy5kZXN0cm95RXJyb3JNYXJrZXJzKClcbiAgfVxuXG4gIGFzeW5jIGJ1aWxkICgpIHtcbiAgICBjb25zdCB7ZWRpdG9yLCBmaWxlUGF0aH0gPSB0aGlzLmdldEVkaXRvckRldGFpbHMoKVxuXG4gICAgaWYgKCFmaWxlUGF0aCkge1xuICAgICAgbGF0ZXgubG9nLndhcm5pbmcoJ0ZpbGUgbmVlZHMgdG8gYmUgc2F2ZWQgdG8gZGlzayBiZWZvcmUgaXQgY2FuIGJlIFRlWGlmaWVkLicpXG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoZmFsc2UpXG4gICAgfVxuXG4gICAgY29uc3QgYnVpbGRlciA9IHRoaXMuZ2V0QnVpbGRlcihmaWxlUGF0aClcbiAgICBpZiAoYnVpbGRlciA9PSBudWxsKSB7XG4gICAgICBsYXRleC5sb2cud2FybmluZyhgTm8gcmVnaXN0ZXJlZCBMYVRlWCBidWlsZGVyIGNhbiBwcm9jZXNzICR7ZmlsZVBhdGh9LmApXG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoZmFsc2UpXG4gICAgfVxuXG4gICAgaWYgKGVkaXRvci5pc01vZGlmaWVkKCkpIHtcbiAgICAgIGVkaXRvci5zYXZlKCkgLy8gVE9ETzogTWFrZSB0aGlzIGNvbmZpZ3VyYWJsZT9cbiAgICB9XG5cbiAgICB0aGlzLmRlc3Ryb3lFcnJvck1hcmtlcnMoKVxuICAgIHRoaXMuZGVzdHJveUVycm9ySW5kaWNhdG9yKClcbiAgICB0aGlzLnNob3dQcm9ncmVzc0luZGljYXRvcigpXG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3Qgcm9vdEZpbGVQYXRoID0gdGhpcy5yZXNvbHZlUm9vdEZpbGVQYXRoKGZpbGVQYXRoKVxuICAgICAgICBjb25zdCBzdGF0dXNDb2RlID0gYXdhaXQgYnVpbGRlci5ydW4ocm9vdEZpbGVQYXRoKVxuICAgICAgICBjb25zdCByZXN1bHQgPSBidWlsZGVyLnBhcnNlTG9nRmlsZShyb290RmlsZVBhdGgpXG4gICAgICAgIGlmIChzdGF0dXNDb2RlID4gMCB8fCAhcmVzdWx0IHx8ICFyZXN1bHQub3V0cHV0RmlsZVBhdGgpIHtcbiAgICAgICAgICB0aGlzLnNob3dFcnJvcihzdGF0dXNDb2RlLCByZXN1bHQsIGJ1aWxkZXIpXG4gICAgICAgICAgcmV0dXJuIHJlamVjdChzdGF0dXNDb2RlKVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuc2hvdWxkTW92ZVJlc3VsdCgpKSB7XG4gICAgICAgICAgdGhpcy5tb3ZlUmVzdWx0KHJlc3VsdCwgcm9vdEZpbGVQYXRoKVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zaG93UmVzdWx0KHJlc3VsdClcbiAgICAgICAgcmV0dXJuIHJlc29sdmUoc3RhdHVzQ29kZSlcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGxhdGV4LmxvZy5lcnJvcihlcnJvci5tZXNzYWdlKVxuICAgICAgICByZXR1cm4gcmVqZWN0KGVycm9yLm1lc3NhZ2UpXG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICB0aGlzLmRlc3Ryb3lQcm9ncmVzc0luZGljYXRvcigpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIHN5bmMgKCkge1xuICAgIGNvbnN0IHtmaWxlUGF0aCwgbGluZU51bWJlcn0gPSB0aGlzLmdldEVkaXRvckRldGFpbHMoKVxuICAgIGlmICghZmlsZVBhdGggfHwgIXRoaXMuaXNUZXhGaWxlKGZpbGVQYXRoKSkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgY29uc3Qgb3V0cHV0RmlsZVBhdGggPSB0aGlzLnJlc29sdmVPdXRwdXRGaWxlUGF0aChmaWxlUGF0aClcbiAgICBpZiAoIW91dHB1dEZpbGVQYXRoKSB7XG4gICAgICBsYXRleC5sb2cud2FybmluZygnQ291bGQgbm90IHJlc29sdmUgcGF0aCB0byBvdXRwdXQgZmlsZSBhc3NvY2lhdGVkIHdpdGggdGhlIGN1cnJlbnQgZmlsZS4nKVxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgY29uc3Qgb3BlbmVyID0gbGF0ZXguZ2V0T3BlbmVyKClcbiAgICBpZiAob3BlbmVyKSB7XG4gICAgICBvcGVuZXIub3BlbihvdXRwdXRGaWxlUGF0aCwgZmlsZVBhdGgsIGxpbmVOdW1iZXIpXG4gICAgfVxuICB9XG5cbiAgYXN5bmMgY2xlYW4gKCkge1xuICAgIGNvbnN0IHtmaWxlUGF0aH0gPSB0aGlzLmdldEVkaXRvckRldGFpbHMoKVxuICAgIGlmICghZmlsZVBhdGggfHwgIXRoaXMuaXNUZXhGaWxlKGZpbGVQYXRoKSkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KClcbiAgICB9XG5cbiAgICBjb25zdCByb290RmlsZVBhdGggPSB0aGlzLnJlc29sdmVSb290RmlsZVBhdGgoZmlsZVBhdGgpXG4gICAgbGV0IHJvb3RQYXRoID0gcGF0aC5kaXJuYW1lKHJvb3RGaWxlUGF0aClcblxuICAgIGxldCBvdXRkaXIgPSBhdG9tLmNvbmZpZy5nZXQoJ2xhdGV4Lm91dHB1dERpcmVjdG9yeScpXG4gICAgaWYgKG91dGRpcikge1xuICAgICAgcm9vdFBhdGggPSBwYXRoLmpvaW4ocm9vdFBhdGgsIG91dGRpcilcbiAgICB9XG5cbiAgICBsZXQgcm9vdEZpbGUgPSBwYXRoLmJhc2VuYW1lKHJvb3RGaWxlUGF0aClcbiAgICByb290RmlsZSA9IHJvb3RGaWxlLnN1YnN0cmluZygwLCByb290RmlsZS5sYXN0SW5kZXhPZignLicpKVxuXG4gICAgY29uc3QgY2xlYW5FeHRlbnNpb25zID0gYXRvbS5jb25maWcuZ2V0KCdsYXRleC5jbGVhbkV4dGVuc2lvbnMnKVxuICAgIHJldHVybiBQcm9taXNlLmFsbChjbGVhbkV4dGVuc2lvbnMubWFwKGFzeW5jIChleHRlbnNpb24pID0+IHtcbiAgICAgIGNvbnN0IGNhbmRpZGF0ZVBhdGggPSBwYXRoLmpvaW4ocm9vdFBhdGgsIHJvb3RGaWxlICsgZXh0ZW5zaW9uKVxuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChyZXNvbHZlKSA9PiB7XG4gICAgICAgIGZzLnJlbW92ZShjYW5kaWRhdGVQYXRoLCAoZXJyb3IpID0+IHtcbiAgICAgICAgICByZXR1cm4gcmVzb2x2ZSh7ZmlsZVBhdGg6IGNhbmRpZGF0ZVBhdGgsIGVycm9yOiBlcnJvcn0pXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH0pKVxuICB9XG5cbiAgc2V0U3RhdHVzQmFyIChzdGF0dXNCYXIpIHtcbiAgICB0aGlzLnN0YXR1c0JhciA9IHN0YXR1c0JhclxuICB9XG5cbiAgbW92ZVJlc3VsdCAocmVzdWx0LCBmaWxlUGF0aCkge1xuICAgIGNvbnN0IG9yaWdpbmFsT3V0cHV0RmlsZVBhdGggPSByZXN1bHQub3V0cHV0RmlsZVBhdGhcbiAgICByZXN1bHQub3V0cHV0RmlsZVBhdGggPSB0aGlzLmFsdGVyUGFyZW50UGF0aChmaWxlUGF0aCwgb3JpZ2luYWxPdXRwdXRGaWxlUGF0aClcbiAgICBpZiAoZnMuZXhpc3RzU3luYyhvcmlnaW5hbE91dHB1dEZpbGVQYXRoKSkge1xuICAgICAgZnMucmVtb3ZlU3luYyhyZXN1bHQub3V0cHV0RmlsZVBhdGgpXG4gICAgICBmcy5tb3ZlU3luYyhvcmlnaW5hbE91dHB1dEZpbGVQYXRoLCByZXN1bHQub3V0cHV0RmlsZVBhdGgpXG4gICAgfVxuXG4gICAgY29uc3Qgb3JpZ2luYWxTeW5jRmlsZVBhdGggPSBvcmlnaW5hbE91dHB1dEZpbGVQYXRoLnJlcGxhY2UoL1xcLnBkZiQvLCAnLnN5bmN0ZXguZ3onKVxuICAgIGlmIChmcy5leGlzdHNTeW5jKG9yaWdpbmFsU3luY0ZpbGVQYXRoKSkge1xuICAgICAgY29uc3Qgc3luY0ZpbGVQYXRoID0gdGhpcy5hbHRlclBhcmVudFBhdGgoZmlsZVBhdGgsIG9yaWdpbmFsU3luY0ZpbGVQYXRoKVxuICAgICAgZnMucmVtb3ZlU3luYyhzeW5jRmlsZVBhdGgpXG4gICAgICBmcy5tb3ZlU3luYyhvcmlnaW5hbFN5bmNGaWxlUGF0aCwgc3luY0ZpbGVQYXRoKVxuICAgIH1cbiAgfVxuXG4gIHJlc29sdmVSb290RmlsZVBhdGggKGZpbGVQYXRoKSB7XG4gICAgY29uc3QgTWFzdGVyVGV4RmluZGVyID0gcmVxdWlyZSgnLi9tYXN0ZXItdGV4LWZpbmRlcicpXG4gICAgY29uc3QgZmluZGVyID0gbmV3IE1hc3RlclRleEZpbmRlcihmaWxlUGF0aClcbiAgICByZXR1cm4gZmluZGVyLmdldE1hc3RlclRleFBhdGgoKVxuICB9XG5cbiAgcmVzb2x2ZU91dHB1dEZpbGVQYXRoIChmaWxlUGF0aCkge1xuICAgIGxldCBvdXRwdXRGaWxlUGF0aCwgcm9vdEZpbGVQYXRoXG5cbiAgICBpZiAodGhpcy5vdXRwdXRMb29rdXApIHtcbiAgICAgIG91dHB1dEZpbGVQYXRoID0gdGhpcy5vdXRwdXRMb29rdXBbZmlsZVBhdGhdXG4gICAgfVxuXG4gICAgaWYgKCFvdXRwdXRGaWxlUGF0aCkge1xuICAgICAgcm9vdEZpbGVQYXRoID0gdGhpcy5yZXNvbHZlUm9vdEZpbGVQYXRoKGZpbGVQYXRoKVxuXG4gICAgICBjb25zdCBidWlsZGVyID0gbGF0ZXguZ2V0QnVpbGRlcigpXG4gICAgICBjb25zdCByZXN1bHQgPSBidWlsZGVyLnBhcnNlTG9nRmlsZShyb290RmlsZVBhdGgpXG4gICAgICBpZiAoIXJlc3VsdCB8fCAhcmVzdWx0Lm91dHB1dEZpbGVQYXRoKSB7XG4gICAgICAgIGxhdGV4LmxvZy53YXJuaW5nKCdMb2cgZmlsZSBwYXJzaW5nIGZhaWxlZCEnKVxuICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgfVxuXG4gICAgICB0aGlzLm91dHB1dExvb2t1cCA9IHRoaXMub3V0cHV0TG9va3VwIHx8IHt9XG4gICAgICB0aGlzLm91dHB1dExvb2t1cFtmaWxlUGF0aF0gPSByZXN1bHQub3V0cHV0RmlsZVBhdGhcbiAgICB9XG5cbiAgICBpZiAodGhpcy5zaG91bGRNb3ZlUmVzdWx0KCkpIHtcbiAgICAgIG91dHB1dEZpbGVQYXRoID0gdGhpcy5hbHRlclBhcmVudFBhdGgocm9vdEZpbGVQYXRoLCBvdXRwdXRGaWxlUGF0aClcbiAgICB9XG5cbiAgICByZXR1cm4gb3V0cHV0RmlsZVBhdGhcbiAgfVxuXG4gIHNob3dSZXN1bHQgKHJlc3VsdCkge1xuICAgIGlmICghdGhpcy5zaG91bGRPcGVuUmVzdWx0KCkpIHsgcmV0dXJuIH1cblxuICAgIGNvbnN0IG9wZW5lciA9IGxhdGV4LmdldE9wZW5lcigpXG4gICAgaWYgKG9wZW5lcikge1xuICAgICAgY29uc3Qge2ZpbGVQYXRoLCBsaW5lTnVtYmVyfSA9IHRoaXMuZ2V0RWRpdG9yRGV0YWlscygpXG4gICAgICBvcGVuZXIub3BlbihyZXN1bHQub3V0cHV0RmlsZVBhdGgsIGZpbGVQYXRoLCBsaW5lTnVtYmVyKVxuICAgIH1cbiAgfVxuXG4gIHNob3dFcnJvciAoc3RhdHVzQ29kZSwgcmVzdWx0LCBidWlsZGVyKSB7XG4gICAgdGhpcy5zaG93RXJyb3JJbmRpY2F0b3IocmVzdWx0KVxuICAgIHRoaXMuc2hvd0Vycm9yTWFya2VycyhyZXN1bHQpXG4gICAgbGF0ZXgubG9nLmVycm9yKHN0YXR1c0NvZGUsIHJlc3VsdCwgYnVpbGRlcilcbiAgfVxuXG4gIHNob3dQcm9ncmVzc0luZGljYXRvciAoKSB7XG4gICAgaWYgKCF0aGlzLnN0YXR1c0JhcikgeyByZXR1cm4gbnVsbCB9XG4gICAgaWYgKHRoaXMuaW5kaWNhdG9yKSB7IHJldHVybiB0aGlzLmluZGljYXRvciB9XG5cbiAgICBjb25zdCBQcm9ncmVzc0luZGljYXRvciA9IHJlcXVpcmUoJy4vc3RhdHVzLWJhci9wcm9ncmVzcy1pbmRpY2F0b3InKVxuICAgIHRoaXMuaW5kaWNhdG9yID0gbmV3IFByb2dyZXNzSW5kaWNhdG9yKClcbiAgICB0aGlzLnN0YXR1c0Jhci5hZGRSaWdodFRpbGUoe1xuICAgICAgaXRlbTogdGhpcy5pbmRpY2F0b3IsXG4gICAgICBwcmlvcml0eTogOTAwMVxuICAgIH0pXG4gIH1cblxuICBzaG93RXJyb3JJbmRpY2F0b3IgKHJlc3VsdCkge1xuICAgIGlmICghdGhpcy5zdGF0dXNCYXIpIHsgcmV0dXJuIG51bGwgfVxuICAgIGlmICh0aGlzLmVycm9ySW5kaWNhdG9yKSB7IHJldHVybiB0aGlzLmVycm9ySW5kaWNhdG9yIH1cblxuICAgIGNvbnN0IEVycm9ySW5kaWNhdG9yID0gcmVxdWlyZSgnLi9zdGF0dXMtYmFyL2Vycm9yLWluZGljYXRvcicpXG4gICAgdGhpcy5lcnJvckluZGljYXRvciA9IG5ldyBFcnJvckluZGljYXRvcihyZXN1bHQpXG4gICAgdGhpcy5zdGF0dXNCYXIuYWRkUmlnaHRUaWxlKHtcbiAgICAgIGl0ZW06IHRoaXMuZXJyb3JJbmRpY2F0b3IsXG4gICAgICBwcmlvcml0eTogOTAwMVxuICAgIH0pXG4gIH1cblxuICBzaG93RXJyb3JNYXJrZXJzIChyZXN1bHQpIHtcbiAgICBpZiAodGhpcy5lcnJvck1hcmtlcnMgJiYgdGhpcy5lcnJvck1hcmtlcnMubGVuZ3RoID4gMCkgeyB0aGlzLmRlc3Ryb3lFcnJvck1hcmtlcnMoKSB9XG4gICAgaWYgKCFyZXN1bHQgfHwgIXJlc3VsdC5lcnJvcnMpIHsgcmV0dXJuIH1cblxuICAgIGNvbnN0IEVycm9yTWFya2VyID0gcmVxdWlyZSgnLi9lcnJvci1tYXJrZXInKVxuXG4gICAgdGhpcy5lcnJvck1hcmtlcnMgPSBbXVxuICAgIGZvciAoY29uc3QgZWRpdG9yIG9mIHRoaXMuZ2V0QWxsRWRpdG9ycygpKSB7XG4gICAgICBpZiAoZWRpdG9yLmdldFBhdGgoKSkge1xuICAgICAgICBjb25zdCBlcnJvcnMgPSBfLmZpbHRlcihyZXN1bHQuZXJyb3JzLCBlcnJvciA9PiB7XG4gICAgICAgICAgcmV0dXJuIGVkaXRvci5nZXRQYXRoKCkuaW5jbHVkZXMoZXJyb3IuZmlsZVBhdGgpXG4gICAgICAgIH0pXG4gICAgICAgIGNvbnN0IHdhcm5pbmdzID0gXy5maWx0ZXIocmVzdWx0Lndhcm5pbmdzLCB3YXJuaW5nID0+IHtcbiAgICAgICAgICByZXR1cm4gZWRpdG9yLmdldFBhdGgoKS5pbmNsdWRlcyh3YXJuaW5nLmZpbGVQYXRoKVxuICAgICAgICB9KVxuICAgICAgICBpZiAoZXJyb3JzLmxlbmd0aCB8fCB3YXJuaW5ncy5sZW5ndGgpIHtcbiAgICAgICAgICB0aGlzLmVycm9yTWFya2Vycy5wdXNoKG5ldyBFcnJvck1hcmtlcihlZGl0b3IsIGVycm9ycywgd2FybmluZ3MpKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZGVzdHJveVByb2dyZXNzSW5kaWNhdG9yICgpIHtcbiAgICBpZiAodGhpcy5pbmRpY2F0b3IpIHtcbiAgICAgIHRoaXMuaW5kaWNhdG9yLmVsZW1lbnQucmVtb3ZlKClcbiAgICAgIHRoaXMuaW5kaWNhdG9yID0gbnVsbFxuICAgIH1cbiAgfVxuXG4gIGRlc3Ryb3lFcnJvckluZGljYXRvciAoKSB7XG4gICAgaWYgKHRoaXMuZXJyb3JJbmRpY2F0b3IpIHtcbiAgICAgIHRoaXMuZXJyb3JJbmRpY2F0b3IuZWxlbWVudC5yZW1vdmUoKVxuICAgICAgdGhpcy5lcnJvckluZGljYXRvciA9IG51bGxcbiAgICB9XG4gIH1cblxuICBkZXN0cm95RXJyb3JNYXJrZXJzICgpIHtcbiAgICBpZiAodGhpcy5lcnJvck1hcmtlcnMpIHtcbiAgICAgIGZvciAobGV0IGVycm9yTWFya2VyIG9mIHRoaXMuZXJyb3JNYXJrZXJzKSB7XG4gICAgICAgIGVycm9yTWFya2VyLmNsZWFyKClcbiAgICAgICAgZXJyb3JNYXJrZXIgPSBudWxsXG4gICAgICB9XG4gICAgICB0aGlzLmVycm9yTWFya2VycyA9IFtdXG4gICAgfVxuICB9XG5cbiAgaXNUZXhGaWxlIChmaWxlUGF0aCkge1xuICAgIC8vIFRPRE86IEltcHJvdmUgd2lsbCBzdWZmaWNlIGZvciB0aGUgdGltZSBiZWluZy5cbiAgICByZXR1cm4gIWZpbGVQYXRoIHx8IGZpbGVQYXRoLnNlYXJjaCgvXFwuKHRleHxsaHMpJC8pID4gMFxuICB9XG5cbiAgZ2V0QnVpbGRlciAoZmlsZVBhdGgpIHtcbiAgICBjb25zdCBCdWlsZGVySW1wbCA9IHRoaXMuYnVpbGRlclJlZ2lzdHJ5LmdldEJ1aWxkZXIoZmlsZVBhdGgpXG4gICAgcmV0dXJuIChCdWlsZGVySW1wbCAhPSBudWxsKSA/IG5ldyBCdWlsZGVySW1wbCgpIDogbnVsbFxuICB9XG5cbiAgZ2V0RWRpdG9yRGV0YWlscyAoKSB7XG4gICAgY29uc3QgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgbGV0IGZpbGVQYXRoLCBsaW5lTnVtYmVyXG4gICAgaWYgKGVkaXRvcikge1xuICAgICAgZmlsZVBhdGggPSBlZGl0b3IuZ2V0UGF0aCgpXG4gICAgICBsaW5lTnVtYmVyID0gZWRpdG9yLmdldEN1cnNvckJ1ZmZlclBvc2l0aW9uKCkucm93ICsgMVxuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBlZGl0b3I6IGVkaXRvcixcbiAgICAgIGZpbGVQYXRoOiBmaWxlUGF0aCxcbiAgICAgIGxpbmVOdW1iZXI6IGxpbmVOdW1iZXJcbiAgICB9XG4gIH1cblxuICBnZXRBbGxFZGl0b3JzICgpIHtcbiAgICByZXR1cm4gYXRvbS53b3Jrc3BhY2UuZ2V0VGV4dEVkaXRvcnMoKVxuICB9XG5cbiAgYWx0ZXJQYXJlbnRQYXRoICh0YXJnZXRQYXRoLCBvcmlnaW5hbFBhdGgpIHtcbiAgICBjb25zdCB0YXJnZXREaXIgPSBwYXRoLmRpcm5hbWUodGFyZ2V0UGF0aClcbiAgICByZXR1cm4gcGF0aC5qb2luKHRhcmdldERpciwgcGF0aC5iYXNlbmFtZShvcmlnaW5hbFBhdGgpKVxuICB9XG5cbiAgc2hvdWxkTW92ZVJlc3VsdCAoKSB7XG4gICAgY29uc3QgbW92ZVJlc3VsdCA9IGF0b20uY29uZmlnLmdldCgnbGF0ZXgubW92ZVJlc3VsdFRvU291cmNlRGlyZWN0b3J5JylcbiAgICBjb25zdCBvdXRwdXREaXJlY3RvcnkgPSBhdG9tLmNvbmZpZy5nZXQoJ2xhdGV4Lm91dHB1dERpcmVjdG9yeScpXG4gICAgcmV0dXJuIG1vdmVSZXN1bHQgJiYgb3V0cHV0RGlyZWN0b3J5Lmxlbmd0aCA+IDBcbiAgfVxuXG4gIHNob3VsZE9wZW5SZXN1bHQgKCkgeyByZXR1cm4gYXRvbS5jb25maWcuZ2V0KCdsYXRleC5vcGVuUmVzdWx0QWZ0ZXJCdWlsZCcpIH1cbn1cbiJdfQ==
//# sourceURL=/home/cin_chalic/.atom/packages/latex/lib/composer.js
