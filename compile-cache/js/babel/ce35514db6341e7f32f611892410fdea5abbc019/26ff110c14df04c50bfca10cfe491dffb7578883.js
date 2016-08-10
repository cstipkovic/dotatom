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
      return Promise.all(cleanExtensions.map(_asyncToGenerator(function* (extension) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL2NvbXBvc2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztzQkFFYyxRQUFROzs7O3NCQUNQLFNBQVM7Ozs7b0JBQ1AsTUFBTTs7OzsrQkFDSyxvQkFBb0I7Ozs7QUFMaEQsV0FBVyxDQUFBOztJQU9VLFFBQVE7QUFDZixXQURPLFFBQVEsR0FDWjswQkFESSxRQUFROztBQUV6QixRQUFJLENBQUMsZUFBZSxHQUFHLGtDQUFxQixDQUFBO0dBQzdDOztlQUhrQixRQUFROztXQUtuQixtQkFBRztBQUNULFVBQUksQ0FBQyx3QkFBd0IsRUFBRSxDQUFBO0FBQy9CLFVBQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFBO0FBQzVCLFVBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFBO0tBQzNCOzs7NkJBRVcsYUFBRzs7OzhCQUNjLElBQUksQ0FBQyxnQkFBZ0IsRUFBRTs7VUFBM0MsTUFBTSxxQkFBTixNQUFNO1VBQUUsUUFBUSxxQkFBUixRQUFROztBQUV2QixVQUFJLENBQUMsUUFBUSxFQUFFO0FBQ2IsYUFBSyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsMkRBQTJELENBQUMsQ0FBQTtBQUM5RSxlQUFPLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUE7T0FDN0I7O0FBRUQsVUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQTtBQUN6QyxVQUFJLE9BQU8sSUFBSSxJQUFJLEVBQUU7QUFDbkIsYUFBSyxDQUFDLEdBQUcsQ0FBQyxPQUFPLDhDQUE0QyxRQUFRLE9BQUksQ0FBQTtBQUN6RSxlQUFPLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUE7T0FDN0I7O0FBRUQsVUFBSSxNQUFNLENBQUMsVUFBVSxFQUFFLEVBQUU7QUFDdkIsY0FBTSxDQUFDLElBQUksRUFBRSxDQUFBO09BQ2Q7O0FBRUQsVUFBTSxZ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QUFVLEVBQUUsWUFBWSxFQUFFO0FBQ3pDLFVBQU0sU0FBUyxHQUFHLGtCQUFLLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQTtBQUMxQyxhQUFPLGtCQUFLLElBQUksQ0FBQyxTQUFTLEVBQUUsa0JBQUssUUFBUSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUE7S0FDekQ7OztXQUVnQiw0QkFBRztBQUNsQixVQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFBO0FBQ3ZFLFVBQU0sZUFBZSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLHVCQUF1QixDQUFDLENBQUE7QUFDaEUsYUFBTyxVQUFVLElBQUksZUFBZSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUE7S0FDaEQ7OztXQUVnQiw0QkFBRztBQUFFLGFBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsNEJBQTRCLENBQUMsQ0FBQTtLQUFFOzs7U0FsU3pELFFBQVE7OztxQkFBUixRQUFRIiwiZmlsZSI6Ii9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL2NvbXBvc2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJ1xuaW1wb3J0IGZzIGZyb20gJ2ZzLXBsdXMnXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IEJ1aWxkZXJSZWdpc3RyeSBmcm9tICcuL2J1aWxkZXItcmVnaXN0cnknXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbXBvc2VyIHtcbiAgY29uc3RydWN0b3IgKCkge1xuICAgIHRoaXMuYnVpbGRlclJlZ2lzdHJ5ID0gbmV3IEJ1aWxkZXJSZWdpc3RyeSgpXG4gIH1cblxuICBkZXN0cm95ICgpIHtcbiAgICB0aGlzLmRlc3Ryb3lQcm9ncmVzc0luZGljYXRvcigpXG4gICAgdGhpcy5kZXN0cm95RXJyb3JJbmRpY2F0b3IoKVxuICAgIHRoaXMuZGVzdHJveUVycm9yTWFya2VycygpXG4gIH1cblxuICBhc3luYyBidWlsZCAoKSB7XG4gICAgY29uc3Qge2VkaXRvciwgZmlsZVBhdGh9ID0gdGhpcy5nZXRFZGl0b3JEZXRhaWxzKClcblxuICAgIGlmICghZmlsZVBhdGgpIHtcbiAgICAgIGxhdGV4LmxvZy53YXJuaW5nKCdGaWxlIG5lZWRzIHRvIGJlIHNhdmVkIHRvIGRpc2sgYmVmb3JlIGl0IGNhbiBiZSBUZVhpZmllZC4nKVxuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KGZhbHNlKVxuICAgIH1cblxuICAgIGNvbnN0IGJ1aWxkZXIgPSB0aGlzLmdldEJ1aWxkZXIoZmlsZVBhdGgpXG4gICAgaWYgKGJ1aWxkZXIgPT0gbnVsbCkge1xuICAgICAgbGF0ZXgubG9nLndhcm5pbmcoYE5vIHJlZ2lzdGVyZWQgTGFUZVggYnVpbGRlciBjYW4gcHJvY2VzcyAke2ZpbGVQYXRofS5gKVxuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KGZhbHNlKVxuICAgIH1cblxuICAgIGlmIChlZGl0b3IuaXNNb2RpZmllZCgpKSB7XG4gICAgICBlZGl0b3Iuc2F2ZSgpIC8vIFRPRE86IE1ha2UgdGhpcyBjb25maWd1cmFibGU/XG4gICAgfVxuXG4gICAgY29uc3Qgcm9vdEZpbGVQYXRoID0gdGhpcy5yZXNvbHZlUm9vdEZpbGVQYXRoKGZpbGVQYXRoKVxuXG4gICAgdGhpcy5kZXN0cm95RXJyb3JNYXJrZXJzKClcbiAgICB0aGlzLmRlc3Ryb3lFcnJvckluZGljYXRvcigpXG4gICAgdGhpcy5zaG93UHJvZ3Jlc3NJbmRpY2F0b3IoKVxuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGxldCBzdGF0dXNDb2RlLCByZXN1bHRcblxuICAgICAgY29uc3Qgc2hvd0J1aWxkRXJyb3IgPSAoKSA9PiB7XG4gICAgICAgIHRoaXMuc2hvd0Vycm9yKHN0YXR1c0NvZGUsIHJlc3VsdCwgYnVpbGRlcilcbiAgICAgICAgcmVqZWN0KHN0YXR1c0NvZGUpXG4gICAgICB9XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIHN0YXR1c0NvZGUgPSBhd2FpdCBidWlsZGVyLnJ1bihyb290RmlsZVBhdGgpXG4gICAgICAgIHJlc3VsdCA9IGJ1aWxkZXIucGFyc2VMb2dGaWxlKHJvb3RGaWxlUGF0aClcbiAgICAgICAgaWYgKHN0YXR1c0NvZGUgPiAwIHx8ICFyZXN1bHQgfHwgIXJlc3VsdC5vdXRwdXRGaWxlUGF0aCkge1xuICAgICAgICAgIHNob3dCdWlsZEVycm9yKHN0YXR1c0NvZGUsIHJlc3VsdCwgYnVpbGRlcilcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLnNob3VsZE1vdmVSZXN1bHQoKSkge1xuICAgICAgICAgIHRoaXMubW92ZVJlc3VsdChyZXN1bHQsIHJvb3RGaWxlUGF0aClcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2hvd1Jlc3VsdChyZXN1bHQpXG4gICAgICAgIHJlc29sdmUoc3RhdHVzQ29kZSlcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IubWVzc2FnZSlcbiAgICAgICAgcmVqZWN0KGVycm9yLm1lc3NhZ2UpXG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICB0aGlzLmRlc3Ryb3lQcm9ncmVzc0luZGljYXRvcigpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIHN5bmMgKCkge1xuICAgIGNvbnN0IHtmaWxlUGF0aCwgbGluZU51bWJlcn0gPSB0aGlzLmdldEVkaXRvckRldGFpbHMoKVxuICAgIGlmICghZmlsZVBhdGggfHwgIXRoaXMuaXNUZXhGaWxlKGZpbGVQYXRoKSkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgY29uc3Qgb3V0cHV0RmlsZVBhdGggPSB0aGlzLnJlc29sdmVPdXRwdXRGaWxlUGF0aChmaWxlUGF0aClcbiAgICBpZiAoIW91dHB1dEZpbGVQYXRoKSB7XG4gICAgICBsYXRleC5sb2cud2FybmluZygnQ291bGQgbm90IHJlc29sdmUgcGF0aCB0byBvdXRwdXQgZmlsZSBhc3NvY2lhdGVkIHdpdGggdGhlIGN1cnJlbnQgZmlsZS4nKVxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgY29uc3Qgb3BlbmVyID0gbGF0ZXguZ2V0T3BlbmVyKClcbiAgICBpZiAob3BlbmVyKSB7XG4gICAgICBvcGVuZXIub3BlbihvdXRwdXRGaWxlUGF0aCwgZmlsZVBhdGgsIGxpbmVOdW1iZXIpXG4gICAgfVxuICB9XG5cbiAgYXN5bmMgY2xlYW4gKCkge1xuICAgIGNvbnN0IHtmaWxlUGF0aH0gPSB0aGlzLmdldEVkaXRvckRldGFpbHMoKVxuICAgIGlmICghZmlsZVBhdGggfHwgIXRoaXMuaXNUZXhGaWxlKGZpbGVQYXRoKSkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KClcbiAgICB9XG5cbiAgICBjb25zdCByb290RmlsZVBhdGggPSB0aGlzLnJlc29sdmVSb290RmlsZVBhdGgoZmlsZVBhdGgpXG4gICAgbGV0IHJvb3RQYXRoID0gcGF0aC5kaXJuYW1lKHJvb3RGaWxlUGF0aClcblxuICAgIGxldCBvdXRkaXIgPSBhdG9tLmNvbmZpZy5nZXQoJ2xhdGV4Lm91dHB1dERpcmVjdG9yeScpXG4gICAgaWYgKG91dGRpcikge1xuICAgICAgcm9vdFBhdGggPSBwYXRoLmpvaW4ocm9vdFBhdGgsIG91dGRpcilcbiAgICB9XG5cbiAgICBsZXQgcm9vdEZpbGUgPSBwYXRoLmJhc2VuYW1lKHJvb3RGaWxlUGF0aClcbiAgICByb290RmlsZSA9IHJvb3RGaWxlLnN1YnN0cmluZygwLCByb290RmlsZS5sYXN0SW5kZXhPZignLicpKVxuXG4gICAgY29uc3QgY2xlYW5FeHRlbnNpb25zID0gYXRvbS5jb25maWcuZ2V0KCdsYXRleC5jbGVhbkV4dGVuc2lvbnMnKVxuICAgIHJldHVybiBQcm9taXNlLmFsbChjbGVhbkV4dGVuc2lvbnMubWFwKGFzeW5jIChleHRlbnNpb24pID0+IHtcbiAgICAgIGNvbnN0IGNhbmRpZGF0ZVBhdGggPSBwYXRoLmpvaW4ocm9vdFBhdGgsIHJvb3RGaWxlICsgZXh0ZW5zaW9uKVxuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChyZXNvbHZlKSA9PiB7XG4gICAgICAgIGZzLnJlbW92ZShjYW5kaWRhdGVQYXRoLCAoZXJyb3IpID0+IHtcbiAgICAgICAgICByZXNvbHZlKHtmaWxlUGF0aDogY2FuZGlkYXRlUGF0aCwgZXJyb3I6IGVycm9yfSlcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgfSkpXG4gIH1cblxuICBzZXRTdGF0dXNCYXIgKHN0YXR1c0Jhcikge1xuICAgIHRoaXMuc3RhdHVzQmFyID0gc3RhdHVzQmFyXG4gIH1cblxuICBtb3ZlUmVzdWx0IChyZXN1bHQsIGZpbGVQYXRoKSB7XG4gICAgY29uc3Qgb3JpZ2luYWxPdXRwdXRGaWxlUGF0aCA9IHJlc3VsdC5vdXRwdXRGaWxlUGF0aFxuICAgIHJlc3VsdC5vdXRwdXRGaWxlUGF0aCA9IHRoaXMuYWx0ZXJQYXJlbnRQYXRoKGZpbGVQYXRoLCBvcmlnaW5hbE91dHB1dEZpbGVQYXRoKVxuICAgIGlmIChmcy5leGlzdHNTeW5jKG9yaWdpbmFsT3V0cHV0RmlsZVBhdGgpKSB7XG4gICAgICBmcy5yZW1vdmVTeW5jKHJlc3VsdC5vdXRwdXRGaWxlUGF0aClcbiAgICAgIGZzLm1vdmVTeW5jKG9yaWdpbmFsT3V0cHV0RmlsZVBhdGgsIHJlc3VsdC5vdXRwdXRGaWxlUGF0aClcbiAgICB9XG5cbiAgICBjb25zdCBvcmlnaW5hbFN5bmNGaWxlUGF0aCA9IG9yaWdpbmFsT3V0cHV0RmlsZVBhdGgucmVwbGFjZSgvXFwucGRmJC8sICcuc3luY3RleC5neicpXG4gICAgaWYgKGZzLmV4aXN0c1N5bmMob3JpZ2luYWxTeW5jRmlsZVBhdGgpKSB7XG4gICAgICBjb25zdCBzeW5jRmlsZVBhdGggPSB0aGlzLmFsdGVyUGFyZW50UGF0aChmaWxlUGF0aCwgb3JpZ2luYWxTeW5jRmlsZVBhdGgpXG4gICAgICBmcy5yZW1vdmVTeW5jKHN5bmNGaWxlUGF0aClcbiAgICAgIGZzLm1vdmVTeW5jKG9yaWdpbmFsU3luY0ZpbGVQYXRoLCBzeW5jRmlsZVBhdGgpXG4gICAgfVxuICB9XG5cbiAgcmVzb2x2ZVJvb3RGaWxlUGF0aCAoZmlsZVBhdGgpIHtcbiAgICBjb25zdCBNYXN0ZXJUZXhGaW5kZXIgPSByZXF1aXJlKCcuL21hc3Rlci10ZXgtZmluZGVyJylcbiAgICBjb25zdCBmaW5kZXIgPSBuZXcgTWFzdGVyVGV4RmluZGVyKGZpbGVQYXRoKVxuICAgIHJldHVybiBmaW5kZXIuZ2V0TWFzdGVyVGV4UGF0aCgpXG4gIH1cblxuICByZXNvbHZlT3V0cHV0RmlsZVBhdGggKGZpbGVQYXRoKSB7XG4gICAgbGV0IG91dHB1dEZpbGVQYXRoLCByb290RmlsZVBhdGhcblxuICAgIGlmICh0aGlzLm91dHB1dExvb2t1cCkge1xuICAgICAgb3V0cHV0RmlsZVBhdGggPSB0aGlzLm91dHB1dExvb2t1cFtmaWxlUGF0aF1cbiAgICB9XG5cbiAgICBpZiAoIW91dHB1dEZpbGVQYXRoKSB7XG4gICAgICByb290RmlsZVBhdGggPSB0aGlzLnJlc29sdmVSb290RmlsZVBhdGgoZmlsZVBhdGgpXG5cbiAgICAgIGNvbnN0IGJ1aWxkZXIgPSBsYXRleC5nZXRCdWlsZGVyKClcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGJ1aWxkZXIucGFyc2VMb2dGaWxlKHJvb3RGaWxlUGF0aClcbiAgICAgIGlmICghcmVzdWx0IHx8ICFyZXN1bHQub3V0cHV0RmlsZVBhdGgpIHtcbiAgICAgICAgbGF0ZXgubG9nLndhcm5pbmcoJ0xvZyBmaWxlIHBhcnNpbmcgZmFpbGVkIScpXG4gICAgICAgIHJldHVybiBudWxsXG4gICAgICB9XG5cbiAgICAgIHRoaXMub3V0cHV0TG9va3VwID0gdGhpcy5vdXRwdXRMb29rdXAgfHwge31cbiAgICAgIHRoaXMub3V0cHV0TG9va3VwW2ZpbGVQYXRoXSA9IHJlc3VsdC5vdXRwdXRGaWxlUGF0aFxuICAgIH1cblxuICAgIGlmICh0aGlzLnNob3VsZE1vdmVSZXN1bHQoKSkge1xuICAgICAgb3V0cHV0RmlsZVBhdGggPSB0aGlzLmFsdGVyUGFyZW50UGF0aChyb290RmlsZVBhdGgsIG91dHB1dEZpbGVQYXRoKVxuICAgIH1cblxuICAgIHJldHVybiBvdXRwdXRGaWxlUGF0aFxuICB9XG5cbiAgc2hvd1Jlc3VsdCAocmVzdWx0KSB7XG4gICAgaWYgKCF0aGlzLnNob3VsZE9wZW5SZXN1bHQoKSkgeyByZXR1cm4gfVxuXG4gICAgY29uc3Qgb3BlbmVyID0gbGF0ZXguZ2V0T3BlbmVyKClcbiAgICBpZiAob3BlbmVyKSB7XG4gICAgICBjb25zdCB7ZmlsZVBhdGgsIGxpbmVOdW1iZXJ9ID0gdGhpcy5nZXRFZGl0b3JEZXRhaWxzKClcbiAgICAgIG9wZW5lci5vcGVuKHJlc3VsdC5vdXRwdXRGaWxlUGF0aCwgZmlsZVBhdGgsIGxpbmVOdW1iZXIpXG4gICAgfVxuICB9XG5cbiAgc2hvd0Vycm9yIChzdGF0dXNDb2RlLCByZXN1bHQsIGJ1aWxkZXIpIHtcbiAgICB0aGlzLnNob3dFcnJvckluZGljYXRvcihyZXN1bHQpXG4gICAgdGhpcy5zaG93RXJyb3JNYXJrZXJzKHJlc3VsdClcbiAgICBsYXRleC5sb2cuZXJyb3Ioc3RhdHVzQ29kZSwgcmVzdWx0LCBidWlsZGVyKVxuICB9XG5cbiAgc2hvd1Byb2dyZXNzSW5kaWNhdG9yICgpIHtcbiAgICBpZiAoIXRoaXMuc3RhdHVzQmFyKSB7IHJldHVybiBudWxsIH1cbiAgICBpZiAodGhpcy5pbmRpY2F0b3IpIHsgcmV0dXJuIHRoaXMuaW5kaWNhdG9yIH1cblxuICAgIGNvbnN0IFByb2dyZXNzSW5kaWNhdG9yID0gcmVxdWlyZSgnLi9zdGF0dXMtYmFyL3Byb2dyZXNzLWluZGljYXRvcicpXG4gICAgdGhpcy5pbmRpY2F0b3IgPSBuZXcgUHJvZ3Jlc3NJbmRpY2F0b3IoKVxuICAgIHRoaXMuc3RhdHVzQmFyLmFkZFJpZ2h0VGlsZSh7XG4gICAgICBpdGVtOiB0aGlzLmluZGljYXRvcixcbiAgICAgIHByaW9yaXR5OiA5MDAxXG4gICAgfSlcbiAgfVxuXG4gIHNob3dFcnJvckluZGljYXRvciAocmVzdWx0KSB7XG4gICAgaWYgKCF0aGlzLnN0YXR1c0JhcikgeyByZXR1cm4gbnVsbCB9XG4gICAgaWYgKHRoaXMuZXJyb3JJbmRpY2F0b3IpIHsgcmV0dXJuIHRoaXMuZXJyb3JJbmRpY2F0b3IgfVxuXG4gICAgY29uc3QgRXJyb3JJbmRpY2F0b3IgPSByZXF1aXJlKCcuL3N0YXR1cy1iYXIvZXJyb3ItaW5kaWNhdG9yJylcbiAgICB0aGlzLmVycm9ySW5kaWNhdG9yID0gbmV3IEVycm9ySW5kaWNhdG9yKHJlc3VsdClcbiAgICB0aGlzLnN0YXR1c0Jhci5hZGRSaWdodFRpbGUoe1xuICAgICAgaXRlbTogdGhpcy5lcnJvckluZGljYXRvcixcbiAgICAgIHByaW9yaXR5OiA5MDAxXG4gICAgfSlcbiAgfVxuXG4gIHNob3dFcnJvck1hcmtlcnMgKHJlc3VsdCkge1xuICAgIGlmICh0aGlzLmVycm9yTWFya2VycyAmJiB0aGlzLmVycm9yTWFya2Vycy5sZW5ndGggPiAwKSB7IHRoaXMuZGVzdHJveUVycm9yTWFya2VycygpIH1cbiAgICBjb25zdCBlZGl0b3JzID0gdGhpcy5nZXRBbGxFZGl0b3JzKClcbiAgICB0aGlzLmVycm9yTWFya2VycyA9IFtdXG4gICAgY29uc3QgRXJyb3JNYXJrZXIgPSByZXF1aXJlKCcuL2Vycm9yLW1hcmtlcicpXG4gICAgZm9yIChsZXQgZWRpdG9yIG9mIGVkaXRvcnMpIHtcbiAgICAgIGlmIChlZGl0b3IuZ2V0UGF0aCgpKSB7XG4gICAgICAgIGxldCBlcnJvcnMgPSBfLmZpbHRlcihyZXN1bHQuZXJyb3JzLCBlcnJvciA9PiB7XG4gICAgICAgICAgcmV0dXJuIGVkaXRvci5nZXRQYXRoKCkuaW5jbHVkZXMoZXJyb3IuZmlsZVBhdGgpXG4gICAgICAgIH0pXG4gICAgICAgIGxldCB3YXJuaW5ncyA9IF8uZmlsdGVyKHJlc3VsdC53YXJuaW5ncywgd2FybmluZyA9PiB7XG4gICAgICAgICAgcmV0dXJuIGVkaXRvci5nZXRQYXRoKCkuaW5jbHVkZXMod2FybmluZy5maWxlUGF0aClcbiAgICAgICAgfSlcbiAgICAgICAgaWYgKGVycm9ycy5sZW5ndGggfHwgd2FybmluZ3MubGVuZ3RoKSB7XG4gICAgICAgICAgdGhpcy5lcnJvck1hcmtlcnMucHVzaChuZXcgRXJyb3JNYXJrZXIoZWRpdG9yLCBlcnJvcnMsIHdhcm5pbmdzKSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGRlc3Ryb3lQcm9ncmVzc0luZGljYXRvciAoKSB7XG4gICAgaWYgKHRoaXMuaW5kaWNhdG9yKSB7XG4gICAgICB0aGlzLmluZGljYXRvci5lbGVtZW50LnJlbW92ZSgpXG4gICAgICB0aGlzLmluZGljYXRvciA9IG51bGxcbiAgICB9XG4gIH1cblxuICBkZXN0cm95RXJyb3JJbmRpY2F0b3IgKCkge1xuICAgIGlmICh0aGlzLmVycm9ySW5kaWNhdG9yKSB7XG4gICAgICB0aGlzLmVycm9ySW5kaWNhdG9yLmVsZW1lbnQucmVtb3ZlKClcbiAgICAgIHRoaXMuZXJyb3JJbmRpY2F0b3IgPSBudWxsXG4gICAgfVxuICB9XG5cbiAgZGVzdHJveUVycm9yTWFya2VycyAoKSB7XG4gICAgaWYgKHRoaXMuZXJyb3JNYXJrZXJzKSB7XG4gICAgICBmb3IgKGxldCBlcnJvck1hcmtlciBvZiB0aGlzLmVycm9yTWFya2Vycykge1xuICAgICAgICBlcnJvck1hcmtlci5jbGVhcigpXG4gICAgICAgIGVycm9yTWFya2VyID0gbnVsbFxuICAgICAgfVxuICAgICAgdGhpcy5lcnJvck1hcmtlcnMgPSBbXVxuICAgIH1cbiAgfVxuXG4gIGlzVGV4RmlsZSAoZmlsZVBhdGgpIHtcbiAgICAvLyBUT0RPOiBJbXByb3ZlIHdpbGwgc3VmZmljZSBmb3IgdGhlIHRpbWUgYmVpbmcuXG4gICAgcmV0dXJuICFmaWxlUGF0aCB8fCBmaWxlUGF0aC5zZWFyY2goL1xcLih0ZXh8bGhzKSQvKSA+IDBcbiAgfVxuXG4gIGdldEJ1aWxkZXIgKGZpbGVQYXRoKSB7XG4gICAgY29uc3QgQnVpbGRlckltcGwgPSB0aGlzLmJ1aWxkZXJSZWdpc3RyeS5nZXRCdWlsZGVyKGZpbGVQYXRoKVxuICAgIHJldHVybiAoQnVpbGRlckltcGwgIT0gbnVsbCkgPyBuZXcgQnVpbGRlckltcGwoKSA6IG51bGxcbiAgfVxuXG4gIGdldEVkaXRvckRldGFpbHMgKCkge1xuICAgIGNvbnN0IGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgIGxldCBmaWxlUGF0aCwgbGluZU51bWJlclxuICAgIGlmIChlZGl0b3IpIHtcbiAgICAgIGZpbGVQYXRoID0gZWRpdG9yLmdldFBhdGgoKVxuICAgICAgbGluZU51bWJlciA9IGVkaXRvci5nZXRDdXJzb3JCdWZmZXJQb3NpdGlvbigpLnJvdyArIDFcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgZWRpdG9yOiBlZGl0b3IsXG4gICAgICBmaWxlUGF0aDogZmlsZVBhdGgsXG4gICAgICBsaW5lTnVtYmVyOiBsaW5lTnVtYmVyXG4gICAgfVxuICB9XG5cbiAgZ2V0QWxsRWRpdG9ycyAoKSB7XG4gICAgcmV0dXJuIGF0b20ud29ya3NwYWNlLmdldFRleHRFZGl0b3JzKClcbiAgfVxuXG4gIGFsdGVyUGFyZW50UGF0aCAodGFyZ2V0UGF0aCwgb3JpZ2luYWxQYXRoKSB7XG4gICAgY29uc3QgdGFyZ2V0RGlyID0gcGF0aC5kaXJuYW1lKHRhcmdldFBhdGgpXG4gICAgcmV0dXJuIHBhdGguam9pbih0YXJnZXREaXIsIHBhdGguYmFzZW5hbWUob3JpZ2luYWxQYXRoKSlcbiAgfVxuXG4gIHNob3VsZE1vdmVSZXN1bHQgKCkge1xuICAgIGNvbnN0IG1vdmVSZXN1bHQgPSBhdG9tLmNvbmZpZy5nZXQoJ2xhdGV4Lm1vdmVSZXN1bHRUb1NvdXJjZURpcmVjdG9yeScpXG4gICAgY29uc3Qgb3V0cHV0RGlyZWN0b3J5ID0gYXRvbS5jb25maWcuZ2V0KCdsYXRleC5vdXRwdXREaXJlY3RvcnknKVxuICAgIHJldHVybiBtb3ZlUmVzdWx0ICYmIG91dHB1dERpcmVjdG9yeS5sZW5ndGggPiAwXG4gIH1cblxuICBzaG91bGRPcGVuUmVzdWx0ICgpIHsgcmV0dXJuIGF0b20uY29uZmlnLmdldCgnbGF0ZXgub3BlblJlc3VsdEFmdGVyQnVpbGQnKSB9XG59XG4iXX0=
//# sourceURL=/home/cin_chalic/.atom/packages/latex/lib/composer.js
