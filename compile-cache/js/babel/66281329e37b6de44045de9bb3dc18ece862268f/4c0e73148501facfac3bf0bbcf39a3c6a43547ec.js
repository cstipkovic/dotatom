Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL2NvbXBvc2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztzQkFFZSxTQUFTOzs7O29CQUNQLE1BQU07Ozs7d0JBQ0QsWUFBWTs7QUFKbEMsV0FBVyxDQUFBOztJQU1VLFFBQVE7V0FBUixRQUFROzBCQUFSLFFBQVE7OztlQUFSLFFBQVE7O1dBQ25CLG1CQUFHO0FBQ1QsVUFBSSxDQUFDLHdCQUF3QixFQUFFLENBQUE7QUFDL0IsVUFBSSxDQUFDLHFCQUFxQixFQUFFLENBQUE7S0FDN0I7Ozs2QkFFVyxhQUFHOzs7OEJBQ2MsSUFBSSxDQUFDLGdCQUFnQixFQUFFOztVQUEzQyxNQUFNLHFCQUFOLE1BQU07VUFBRSxRQUFRLHFCQUFSLFFBQVE7O0FBRXZCLFVBQUksQ0FBQyxRQUFRLEVBQUU7QUFDYixhQUFLLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQywyREFBMkQsQ0FBQyxDQUFBO0FBQzlFLGVBQU8sT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQTtPQUM3Qjs7QUFFRCxVQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsRUFBRTtBQUM3QixhQUFLLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxpR0FDUyxrQkFBSyxPQUFPLENBQUMsUUFBUSxDQUFDLFNBQUssQ0FBQyxDQUFBO0FBQ3ZELGVBQU8sT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQTtPQUM3Qjs7QUFFRCxVQUFJLE1BQU0sQ0FBQyxVQUFVLEVBQUUsRUFBRTtBQUN2QixjQUFNLENBQUMsSUFBSSxFQUFFLENBQUE7T0FDZDs7QUFFRCxVQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsVUFBVSxFQUFFLENBQUE7QUFDbEMsVUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLFFBQVEsQ0FBQyxDQUFBOztBQUV2RCxVQUFJLENBQUMscUJB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anMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5pbXBvcnQgZnMgZnJvbSAnZnMtcGx1cydcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5pbXBvcnQge2hlcmVkb2N9IGZyb20gJy4vd2Vya3pldWcnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbXBvc2VyIHtcbiAgZGVzdHJveSAoKSB7XG4gICAgdGhpcy5kZXN0cm95UHJvZ3Jlc3NJbmRpY2F0b3IoKVxuICAgIHRoaXMuZGVzdHJveUVycm9ySW5kaWNhdG9yKClcbiAgfVxuXG4gIGFzeW5jIGJ1aWxkICgpIHtcbiAgICBjb25zdCB7ZWRpdG9yLCBmaWxlUGF0aH0gPSB0aGlzLmdldEVkaXRvckRldGFpbHMoKVxuXG4gICAgaWYgKCFmaWxlUGF0aCkge1xuICAgICAgbGF0ZXgubG9nLndhcm5pbmcoJ0ZpbGUgbmVlZHMgdG8gYmUgc2F2ZWQgdG8gZGlzayBiZWZvcmUgaXQgY2FuIGJlIFRlWGlmaWVkLicpXG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoZmFsc2UpXG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLmlzVGV4RmlsZShmaWxlUGF0aCkpIHtcbiAgICAgIGxhdGV4LmxvZy53YXJuaW5nKGhlcmVkb2MoYEZpbGUgZG9lcyBub3Qgc2VlbSB0byBiZSBhIFRlWCBmaWxlXG4gICAgICAgIHVuc3VwcG9ydGVkIGV4dGVuc2lvbiAnJHtwYXRoLmV4dG5hbWUoZmlsZVBhdGgpfScuYCkpXG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoZmFsc2UpXG4gICAgfVxuXG4gICAgaWYgKGVkaXRvci5pc01vZGlmaWVkKCkpIHtcbiAgICAgIGVkaXRvci5zYXZlKCkgLy8gVE9ETzogTWFrZSB0aGlzIGNvbmZpZ3VyYWJsZT9cbiAgICB9XG5cbiAgICBjb25zdCBidWlsZGVyID0gbGF0ZXguZ2V0QnVpbGRlcigpXG4gICAgY29uc3Qgcm9vdEZpbGVQYXRoID0gdGhpcy5yZXNvbHZlUm9vdEZpbGVQYXRoKGZpbGVQYXRoKVxuXG4gICAgdGhpcy5kZXN0cm95RXJyb3JJbmRpY2F0b3IoKVxuICAgIHRoaXMuc2hvd1Byb2dyZXNzSW5kaWNhdG9yKClcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBsZXQgc3RhdHVzQ29kZSwgcmVzdWx0XG5cbiAgICAgIGNvbnN0IHNob3dCdWlsZEVycm9yID0gKCkgPT4ge1xuICAgICAgICB0aGlzLnNob3dFcnJvcihzdGF0dXNDb2RlLCByZXN1bHQsIGJ1aWxkZXIpXG4gICAgICAgIHJlamVjdChzdGF0dXNDb2RlKVxuICAgICAgfVxuXG4gICAgICB0cnkge1xuICAgICAgICBzdGF0dXNDb2RlID0gYXdhaXQgYnVpbGRlci5ydW4ocm9vdEZpbGVQYXRoKVxuICAgICAgICByZXN1bHQgPSBidWlsZGVyLnBhcnNlTG9nRmlsZShyb290RmlsZVBhdGgpXG4gICAgICAgIGlmIChzdGF0dXNDb2RlID4gMCB8fCAhcmVzdWx0IHx8ICFyZXN1bHQub3V0cHV0RmlsZVBhdGgpIHtcbiAgICAgICAgICBzaG93QnVpbGRFcnJvcihzdGF0dXNDb2RlLCByZXN1bHQsIGJ1aWxkZXIpXG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5zaG91bGRNb3ZlUmVzdWx0KCkpIHtcbiAgICAgICAgICB0aGlzLm1vdmVSZXN1bHQocmVzdWx0LCByb290RmlsZVBhdGgpXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNob3dSZXN1bHQocmVzdWx0KVxuICAgICAgICByZXNvbHZlKHN0YXR1c0NvZGUpXG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yLm1lc3NhZ2UpXG4gICAgICAgIHJlamVjdChlcnJvci5tZXNzYWdlKVxuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgdGhpcy5kZXN0cm95UHJvZ3Jlc3NJbmRpY2F0b3IoKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBzeW5jICgpIHtcbiAgICBjb25zdCB7ZmlsZVBhdGgsIGxpbmVOdW1iZXJ9ID0gdGhpcy5nZXRFZGl0b3JEZXRhaWxzKClcbiAgICBpZiAoIWZpbGVQYXRoIHx8ICF0aGlzLmlzVGV4RmlsZShmaWxlUGF0aCkpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGNvbnN0IG91dHB1dEZpbGVQYXRoID0gdGhpcy5yZXNvbHZlT3V0cHV0RmlsZVBhdGgoZmlsZVBhdGgpXG4gICAgaWYgKCFvdXRwdXRGaWxlUGF0aCkge1xuICAgICAgbGF0ZXgubG9nLndhcm5pbmcoJ0NvdWxkIG5vdCByZXNvbHZlIHBhdGggdG8gb3V0cHV0IGZpbGUgYXNzb2NpYXRlZCB3aXRoIHRoZSBjdXJyZW50IGZpbGUuJylcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGNvbnN0IG9wZW5lciA9IGxhdGV4LmdldE9wZW5lcigpXG4gICAgaWYgKG9wZW5lcikge1xuICAgICAgb3BlbmVyLm9wZW4ob3V0cHV0RmlsZVBhdGgsIGZpbGVQYXRoLCBsaW5lTnVtYmVyKVxuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGNsZWFuICgpIHtcbiAgICBjb25zdCB7ZmlsZVBhdGh9ID0gdGhpcy5nZXRFZGl0b3JEZXRhaWxzKClcbiAgICBpZiAoIWZpbGVQYXRoIHx8ICF0aGlzLmlzVGV4RmlsZShmaWxlUGF0aCkpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdCgpXG4gICAgfVxuXG4gICAgY29uc3Qgcm9vdEZpbGVQYXRoID0gdGhpcy5yZXNvbHZlUm9vdEZpbGVQYXRoKGZpbGVQYXRoKVxuICAgIGxldCByb290UGF0aCA9IHBhdGguZGlybmFtZShyb290RmlsZVBhdGgpXG4gICAgXG4gICAgbGV0IG91dGRpciA9IGF0b20uY29uZmlnLmdldCgnbGF0ZXgub3V0cHV0RGlyZWN0b3J5JylcbiAgICBpZiAob3V0ZGlyKSB7XG4gICAgICByb290UGF0aCA9IHBhdGguam9pbihyb290UGF0aCwgb3V0ZGlyKVxuICAgIH1cbiAgICBcbiAgICBsZXQgcm9vdEZpbGUgPSBwYXRoLmJhc2VuYW1lKHJvb3RGaWxlUGF0aClcbiAgICByb290RmlsZSA9IHJvb3RGaWxlLnN1YnN0cmluZygwLCByb290RmlsZS5sYXN0SW5kZXhPZignLicpKVxuXG4gICAgY29uc3QgY2xlYW5FeHRlbnNpb25zID0gYXRvbS5jb25maWcuZ2V0KCdsYXRleC5jbGVhbkV4dGVuc2lvbnMnKVxuICAgIHJldHVybiBhd2FpdCogY2xlYW5FeHRlbnNpb25zLm1hcChhc3luYyAoZXh0ZW5zaW9uKSA9PiB7XG4gICAgICBjb25zdCBjYW5kaWRhdGVQYXRoID0gcGF0aC5qb2luKHJvb3RQYXRoLCByb290RmlsZSArIGV4dGVuc2lvbilcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAocmVzb2x2ZSkgPT4ge1xuICAgICAgICBmcy5yZW1vdmUoY2FuZGlkYXRlUGF0aCwgKGVycm9yKSA9PiB7XG4gICAgICAgICAgcmVzb2x2ZSh7ZmlsZVBhdGg6IGNhbmRpZGF0ZVBhdGgsIGVycm9yOiBlcnJvcn0pXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH0pXG4gIH1cblxuICBzZXRTdGF0dXNCYXIgKHN0YXR1c0Jhcikge1xuICAgIHRoaXMuc3RhdHVzQmFyID0gc3RhdHVzQmFyXG4gIH1cblxuICBtb3ZlUmVzdWx0IChyZXN1bHQsIGZpbGVQYXRoKSB7XG4gICAgY29uc3Qgb3JpZ2luYWxPdXRwdXRGaWxlUGF0aCA9IHJlc3VsdC5vdXRwdXRGaWxlUGF0aFxuICAgIHJlc3VsdC5vdXRwdXRGaWxlUGF0aCA9IHRoaXMuYWx0ZXJQYXJlbnRQYXRoKGZpbGVQYXRoLCBvcmlnaW5hbE91dHB1dEZpbGVQYXRoKVxuICAgIGlmIChmcy5leGlzdHNTeW5jKG9yaWdpbmFsT3V0cHV0RmlsZVBhdGgpKSB7XG4gICAgICBmcy5yZW1vdmVTeW5jKHJlc3VsdC5vdXRwdXRGaWxlUGF0aClcbiAgICAgIGZzLm1vdmVTeW5jKG9yaWdpbmFsT3V0cHV0RmlsZVBhdGgsIHJlc3VsdC5vdXRwdXRGaWxlUGF0aClcbiAgICB9XG5cbiAgICBjb25zdCBvcmlnaW5hbFN5bmNGaWxlUGF0aCA9IG9yaWdpbmFsT3V0cHV0RmlsZVBhdGgucmVwbGFjZSgvXFwucGRmJC8sICcuc3luY3RleC5neicpXG4gICAgaWYgKGZzLmV4aXN0c1N5bmMob3JpZ2luYWxTeW5jRmlsZVBhdGgpKSB7XG4gICAgICBjb25zdCBzeW5jRmlsZVBhdGggPSB0aGlzLmFsdGVyUGFyZW50UGF0aChmaWxlUGF0aCwgb3JpZ2luYWxTeW5jRmlsZVBhdGgpXG4gICAgICBmcy5yZW1vdmVTeW5jKHN5bmNGaWxlUGF0aClcbiAgICAgIGZzLm1vdmVTeW5jKG9yaWdpbmFsU3luY0ZpbGVQYXRoLCBzeW5jRmlsZVBhdGgpXG4gICAgfVxuICB9XG5cbiAgcmVzb2x2ZVJvb3RGaWxlUGF0aCAoZmlsZVBhdGgpIHtcbiAgICBjb25zdCBNYXN0ZXJUZXhGaW5kZXIgPSByZXF1aXJlKCcuL21hc3Rlci10ZXgtZmluZGVyJylcbiAgICBjb25zdCBmaW5kZXIgPSBuZXcgTWFzdGVyVGV4RmluZGVyKGZpbGVQYXRoKVxuICAgIHJldHVybiBmaW5kZXIuZ2V0TWFzdGVyVGV4UGF0aCgpXG4gIH1cblxuICByZXNvbHZlT3V0cHV0RmlsZVBhdGggKGZpbGVQYXRoKSB7XG4gICAgbGV0IG91dHB1dEZpbGVQYXRoLCByb290RmlsZVBhdGhcblxuICAgIGlmICh0aGlzLm91dHB1dExvb2t1cCkge1xuICAgICAgb3V0cHV0RmlsZVBhdGggPSB0aGlzLm91dHB1dExvb2t1cFtmaWxlUGF0aF1cbiAgICB9XG5cbiAgICBpZiAoIW91dHB1dEZpbGVQYXRoKSB7XG4gICAgICByb290RmlsZVBhdGggPSB0aGlzLnJlc29sdmVSb290RmlsZVBhdGgoZmlsZVBhdGgpXG5cbiAgICAgIGNvbnN0IGJ1aWxkZXIgPSBsYXRleC5nZXRCdWlsZGVyKClcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGJ1aWxkZXIucGFyc2VMb2dGaWxlKHJvb3RGaWxlUGF0aClcbiAgICAgIGlmICghcmVzdWx0IHx8ICFyZXN1bHQub3V0cHV0RmlsZVBhdGgpIHtcbiAgICAgICAgbGF0ZXgubG9nLndhcm5pbmcoJ0xvZyBmaWxlIHBhcnNpbmcgZmFpbGVkIScpXG4gICAgICAgIHJldHVybiBudWxsXG4gICAgICB9XG5cbiAgICAgIHRoaXMub3V0cHV0TG9va3VwID0gdGhpcy5vdXRwdXRMb29rdXAgfHwge31cbiAgICAgIHRoaXMub3V0cHV0TG9va3VwW2ZpbGVQYXRoXSA9IHJlc3VsdC5vdXRwdXRGaWxlUGF0aFxuICAgIH1cblxuICAgIGlmICh0aGlzLnNob3VsZE1vdmVSZXN1bHQoKSkge1xuICAgICAgb3V0cHV0RmlsZVBhdGggPSB0aGlzLmFsdGVyUGFyZW50UGF0aChyb290RmlsZVBhdGgsIG91dHB1dEZpbGVQYXRoKVxuICAgIH1cblxuICAgIHJldHVybiBvdXRwdXRGaWxlUGF0aFxuICB9XG5cbiAgc2hvd1Jlc3VsdCAocmVzdWx0KSB7XG4gICAgaWYgKCF0aGlzLnNob3VsZE9wZW5SZXN1bHQoKSkgeyByZXR1cm4gfVxuXG4gICAgY29uc3Qgb3BlbmVyID0gbGF0ZXguZ2V0T3BlbmVyKClcbiAgICBpZiAob3BlbmVyKSB7XG4gICAgICBjb25zdCB7ZmlsZVBhdGgsIGxpbmVOdW1iZXJ9ID0gdGhpcy5nZXRFZGl0b3JEZXRhaWxzKClcbiAgICAgIG9wZW5lci5vcGVuKHJlc3VsdC5vdXRwdXRGaWxlUGF0aCwgZmlsZVBhdGgsIGxpbmVOdW1iZXIpXG4gICAgfVxuICB9XG5cbiAgc2hvd0Vycm9yIChzdGF0dXNDb2RlLCByZXN1bHQsIGJ1aWxkZXIpIHtcbiAgICB0aGlzLnNob3dFcnJvckluZGljYXRvcihyZXN1bHQpXG4gICAgbGF0ZXgubG9nLmVycm9yKHN0YXR1c0NvZGUsIHJlc3VsdCwgYnVpbGRlcilcbiAgfVxuXG4gIHNob3dQcm9ncmVzc0luZGljYXRvciAoKSB7XG4gICAgaWYgKCF0aGlzLnN0YXR1c0JhcikgeyByZXR1cm4gbnVsbCB9XG4gICAgaWYgKHRoaXMuaW5kaWNhdG9yKSB7IHJldHVybiB0aGlzLmluZGljYXRvciB9XG5cbiAgICBjb25zdCBQcm9ncmVzc0luZGljYXRvciA9IHJlcXVpcmUoJy4vc3RhdHVzLWJhci9wcm9ncmVzcy1pbmRpY2F0b3InKVxuICAgIHRoaXMuaW5kaWNhdG9yID0gbmV3IFByb2dyZXNzSW5kaWNhdG9yKClcbiAgICB0aGlzLnN0YXR1c0Jhci5hZGRSaWdodFRpbGUoe1xuICAgICAgaXRlbTogdGhpcy5pbmRpY2F0b3IsXG4gICAgICBwcmlvcml0eTogOTAwMVxuICAgIH0pXG4gIH1cblxuICBzaG93RXJyb3JJbmRpY2F0b3IgKHJlc3VsdCkge1xuICAgIGlmICghdGhpcy5zdGF0dXNCYXIpIHsgcmV0dXJuIG51bGwgfVxuICAgIGlmICh0aGlzLmVycm9ySW5kaWNhdG9yKSB7IHJldHVybiB0aGlzLmVycm9ySW5kaWNhdG9yIH1cblxuICAgIGNvbnN0IEVycm9ySW5kaWNhdG9yID0gcmVxdWlyZSgnLi9zdGF0dXMtYmFyL2Vycm9yLWluZGljYXRvcicpXG4gICAgdGhpcy5lcnJvckluZGljYXRvciA9IG5ldyBFcnJvckluZGljYXRvcihyZXN1bHQpXG4gICAgdGhpcy5zdGF0dXNCYXIuYWRkUmlnaHRUaWxlKHtcbiAgICAgIGl0ZW06IHRoaXMuZXJyb3JJbmRpY2F0b3IsXG4gICAgICBwcmlvcml0eTogOTAwMVxuICAgIH0pXG4gIH1cblxuICBkZXN0cm95UHJvZ3Jlc3NJbmRpY2F0b3IgKCkge1xuICAgIGlmICh0aGlzLmluZGljYXRvcikge1xuICAgICAgdGhpcy5pbmRpY2F0b3IuZWxlbWVudC5yZW1vdmUoKVxuICAgICAgdGhpcy5pbmRpY2F0b3IgPSBudWxsXG4gICAgfVxuICB9XG5cbiAgZGVzdHJveUVycm9ySW5kaWNhdG9yICgpIHtcbiAgICBpZiAodGhpcy5lcnJvckluZGljYXRvcikge1xuICAgICAgdGhpcy5lcnJvckluZGljYXRvci5lbGVtZW50LnJlbW92ZSgpXG4gICAgICB0aGlzLmVycm9ySW5kaWNhdG9yID0gbnVsbFxuICAgIH1cbiAgfVxuXG4gIGlzVGV4RmlsZSAoZmlsZVBhdGgpIHtcbiAgICAvLyBUT0RPOiBJbXByb3ZlIHdpbGwgc3VmZmljZSBmb3IgdGhlIHRpbWUgYmVpbmcuXG4gICAgcmV0dXJuICFmaWxlUGF0aCB8fCBmaWxlUGF0aC5zZWFyY2goL1xcLih0ZXh8bGhzKSQvKSA+IDBcbiAgfVxuXG4gIGdldEVkaXRvckRldGFpbHMgKCkge1xuICAgIGNvbnN0IGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgIGxldCBmaWxlUGF0aCwgbGluZU51bWJlclxuICAgIGlmIChlZGl0b3IpIHtcbiAgICAgIGZpbGVQYXRoID0gZWRpdG9yLmdldFBhdGgoKVxuICAgICAgbGluZU51bWJlciA9IGVkaXRvci5nZXRDdXJzb3JCdWZmZXJQb3NpdGlvbigpLnJvdyArIDFcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgZWRpdG9yOiBlZGl0b3IsXG4gICAgICBmaWxlUGF0aDogZmlsZVBhdGgsXG4gICAgICBsaW5lTnVtYmVyOiBsaW5lTnVtYmVyXG4gICAgfVxuICB9XG5cbiAgYWx0ZXJQYXJlbnRQYXRoICh0YXJnZXRQYXRoLCBvcmlnaW5hbFBhdGgpIHtcbiAgICBjb25zdCB0YXJnZXREaXIgPSBwYXRoLmRpcm5hbWUodGFyZ2V0UGF0aClcbiAgICByZXR1cm4gcGF0aC5qb2luKHRhcmdldERpciwgcGF0aC5iYXNlbmFtZShvcmlnaW5hbFBhdGgpKVxuICB9XG5cbiAgc2hvdWxkTW92ZVJlc3VsdCAoKSB7XG4gICAgY29uc3QgbW92ZVJlc3VsdCA9IGF0b20uY29uZmlnLmdldCgnbGF0ZXgubW92ZVJlc3VsdFRvU291cmNlRGlyZWN0b3J5JylcbiAgICBjb25zdCBvdXRwdXREaXJlY3RvcnkgPSBhdG9tLmNvbmZpZy5nZXQoJ2xhdGV4Lm91dHB1dERpcmVjdG9yeScpXG4gICAgcmV0dXJuIG1vdmVSZXN1bHQgJiYgb3V0cHV0RGlyZWN0b3J5Lmxlbmd0aCA+IDBcbiAgfVxuXG4gIHNob3VsZE9wZW5SZXN1bHQgKCkgeyByZXR1cm4gYXRvbS5jb25maWcuZ2V0KCdsYXRleC5vcGVuUmVzdWx0QWZ0ZXJCdWlsZCcpIH1cbn1cbiJdfQ==
//# sourceURL=/home/cin_chalic/.atom/packages/latex/lib/composer.js
