Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, "next"); var callThrow = step.bind(null, "throw"); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _fsPlus = require("fs-plus");

var _fsPlus2 = _interopRequireDefault(_fsPlus);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _werkzeug = require("./werkzeug");

"use babel";

var Composer = (function () {
  function Composer() {
    _classCallCheck(this, Composer);
  }

  _createClass(Composer, [{
    key: "destroy",
    value: function destroy() {
      this.destroyProgressIndicator();
      this.destroyErrorIndicator();
    }
  }, {
    key: "build",
    value: _asyncToGenerator(function* () {
      var _getEditorDetails = this.getEditorDetails();

      var editor = _getEditorDetails.editor;
      var filePath = _getEditorDetails.filePath;

      if (!filePath) {
        latex.log.warning("File needs to be saved to disk before it can be TeXified.");
        return Promise.reject(false);
      }

      if (!this.isTexFile(filePath)) {
        latex.log.warning((0, _werkzeug.heredoc)("File does not seem to be a TeX file;\n        unsupported extension \"" + _path2["default"].extname(filePath) + "\"."));
        return Promise.reject(false);
      }

      if (editor.isModified()) {
        editor.save(); // TODO: Make this configurable?
      }

      var builder = latex.getBuilder();
      var rootFilePath = this.resolveRootFilePath(filePath);

      this.destroyErrorIndicator();
      this.showProgressIndicator();

      var self = this;
      return new Promise(_asyncToGenerator(function* (resolve, reject) {
        var statusCode = undefined,
            result = undefined;

        var showBuildError = function showBuildError() {
          self.showError(statusCode, result, builder);
          reject(statusCode);
        };

        try {
          statusCode = yield builder.run(rootFilePath);
          result = builder.parseLogFile(rootFilePath);
          if (statusCode > 0 || !result || !result.outputFilePath) {
            showBuildError(statusCode, result, builder);
            return;
          }

          if (self.shouldMoveResult()) {
            self.moveResult(result, rootFilePath);
          }

          self.showResult(result);
          resolve(statusCode);
        } catch (error) {
          console.error(error.message);
          reject(error.message);
        } finally {
          self.destroyProgressIndicator();
        }
      }));
    })
  }, {
    key: "sync",
    value: function sync() {
      var _getEditorDetails2 = this.getEditorDetails();

      var filePath = _getEditorDetails2.filePath;
      var lineNumber = _getEditorDetails2.lineNumber;

      if (!filePath || !this.isTexFile(filePath)) {
        return;
      }

      var outputFilePath = this.resolveOutputFilePath(filePath);
      if (!outputFilePath) {
        latex.log.warning("Could not resolve path to output file associated with the current file.");
        return;
      }

      var opener = latex.getOpener();
      if (opener) {
        opener.open(outputFilePath, filePath, lineNumber);
      }
    }
  }, {
    key: "clean",

    // NOTE: Does not support `latex.outputDirectory` setting!
    value: _asyncToGenerator(function* () {
      var _getEditorDetails3 = this.getEditorDetails();

      var filePath = _getEditorDetails3.filePath;

      if (!filePath || !this.isTexFile(filePath)) {
        return Promise.reject();
      }

      var rootFilePath = this.resolveRootFilePath(filePath);
      var rootPath = _path2["default"].dirname(rootFilePath);
      var rootFile = _path2["default"].basename(rootFilePath);
      rootFile = rootFile.substring(0, rootFile.lastIndexOf("."));

      var cleanExtensions = atom.config.get("latex.cleanExtensions");
      return yield Promise.all(cleanExtensions.map(_asyncToGenerator(function* (extension) {
        var candidatePath = _path2["default"].join(rootPath, rootFile + extension);
        return new Promise(_asyncToGenerator(function* (resolve) {
          _fsPlus2["default"].remove(candidatePath, function (error) {
            resolve({ filePath: candidatePath, error: error });
          });
        }));
      })));
    })
  }, {
    key: "setStatusBar",
    value: function setStatusBar(statusBar) {
      this.statusBar = statusBar;
    }
  }, {
    key: "moveResult",
    value: function moveResult(result, filePath) {
      var originalOutputFilePath = result.outputFilePath;
      result.outputFilePath = this.alterParentPath(filePath, originalOutputFilePath);
      if (_fsPlus2["default"].existsSync(originalOutputFilePath)) {
        _fsPlus2["default"].removeSync(result.outputFilePath);
        _fsPlus2["default"].moveSync(originalOutputFilePath, result.outputFilePath);
      }

      var originalSyncFilePath = originalOutputFilePath.replace(/\.pdf$/, ".synctex.gz");
      if (_fsPlus2["default"].existsSync(originalSyncFilePath)) {
        var syncFilePath = this.alterParentPath(filePath, originalSyncFilePath);
        _fsPlus2["default"].removeSync(syncFilePath);
        _fsPlus2["default"].moveSync(originalSyncFilePath, syncFilePath);
      }
    }
  }, {
    key: "resolveRootFilePath",
    value: function resolveRootFilePath(filePath) {
      var MasterTexFinder = require("./master-tex-finder");
      var finder = new MasterTexFinder(filePath);
      return finder.getMasterTexPath();
    }
  }, {
    key: "resolveOutputFilePath",
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
          latex.log.warning("Log file parsing failed!");
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
    key: "showResult",
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
    key: "showError",
    value: function showError(statusCode, result, builder) {
      this.showErrorIndicator(result);
      latex.log.error(statusCode, result, builder);
    }
  }, {
    key: "showProgressIndicator",
    value: function showProgressIndicator() {
      if (!this.statusBar) {
        return null;
      }
      if (this.indicator) {
        return this.indicator;
      }

      var ProgressIndicatorView = require("./views/progress-indicator-view");
      this.indicator = new ProgressIndicatorView();
      this.statusBar.addRightTile({ item: this.indicator, priority: 9001 });

      return this.indicator;
    }
  }, {
    key: "showErrorIndicator",
    value: function showErrorIndicator(result) {
      if (!this.statusBar) {
        return null;
      }
      if (this.errorIndicator) {
        return this.errorIndicator;
      }

      var ErrorIndicatorView = require("./views/error-indicator-view");
      this.errorIndicator = new ErrorIndicatorView();
      this.errorIndicator.initialize(result);
      this.statusBar.addRightTile({ item: this.errorIndicator, priority: 9001 });

      return this.errorIndicator;
    }
  }, {
    key: "destroyProgressIndicator",
    value: function destroyProgressIndicator() {
      if (this.indicator) {
        this.indicator.remove();
        this.indicator = null;
      }
    }
  }, {
    key: "destroyErrorIndicator",
    value: function destroyErrorIndicator() {
      if (this.errorIndicator) {
        this.errorIndicator.remove();
        this.errorIndicator = null;
      }
    }
  }, {
    key: "isTexFile",
    value: function isTexFile(filePath) {
      // TODO: Improve; will suffice for the time being.
      return !filePath || filePath.search(/\.(tex|lhs)$/) > 0;
    }
  }, {
    key: "getEditorDetails",
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
    key: "alterParentPath",
    value: function alterParentPath(targetPath, originalPath) {
      var targetDir = _path2["default"].dirname(targetPath);
      return _path2["default"].join(targetDir, _path2["default"].basename(originalPath));
    }
  }, {
    key: "shouldMoveResult",
    value: function shouldMoveResult() {
      var moveResult = atom.config.get("latex.moveResultToSourceDirectory");
      var outputDirectory = atom.config.get("latex.outputDirectory");
      return moveResult && outputDirectory.length > 0;
    }
  }, {
    key: "shouldOpenResult",
    value: function shouldOpenResult() {
      return atom.config.get("latex.openResultAfterBuild");
    }
  }]);

  return Composer;
})();

exports["default"] = Composer;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL2NvbXBvc2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztzQkFFZSxTQUFTOzs7O29CQUNQLE1BQU07Ozs7d0JBQ0QsWUFBWTs7QUFKbEMsV0FBVyxDQUFDOztJQU1TLFFBQVE7V0FBUixRQUFROzBCQUFSLFFBQVE7OztlQUFSLFFBQVE7O1dBQ3BCLG1CQUFHO0FBQ1IsVUFBSSxDQUFDLHdCQUF3QixFQUFFLENBQUM7QUFDaEMsVUFBSSxDQUFDLHFCQUFxQixFQUFFLENBQUM7S0FDOUI7Ozs2QkFFVSxhQUFHOzhCQUNlLElBQUksQ0FBQyxnQkFBZ0IsRUFBRTs7VUFBM0MsTUFBTSxxQkFBTixNQUFNO1VBQUUsUUFBUSxxQkFBUixRQUFROztBQUV2QixVQUFJLENBQUMsUUFBUSxFQUFFO0FBQ2IsYUFBSyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsMkRBQTJELENBQUMsQ0FBQztBQUMvRSxlQUFPLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7T0FDOUI7O0FBRUQsVUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLEVBQUU7QUFDN0IsYUFBSyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsY0FqQmhCLE9BQU8sNkVBa0JrQixrQkFBSyxPQUFPLENBQUMsUUFBUSxDQUFDLFNBQUssQ0FBQyxDQUFDO0FBQ3hELGVBQU8sT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztPQUM5Qjs7QUFFRCxVQUFJLE1BQU0sQ0FBQyxVQUFVLEVBQUUsRUFBRTtBQUN2QixjQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7T0FDZjs7QUFFRCxVQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsVUFBVSxFQUFFLENBQUM7QUFDbkMsVUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLFFBQVEsQ0FBQyxDQUFDOztBQUV4RCxV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InNvdXJjZXNDb250ZW50IjpbIlwidXNlIGJhYmVsXCI7XG5cbmltcG9ydCBmcyBmcm9tIFwiZnMtcGx1c1wiO1xuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcbmltcG9ydCB7aGVyZWRvY30gZnJvbSBcIi4vd2Vya3pldWdcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29tcG9zZXIge1xuICBkZXN0cm95KCkge1xuICAgIHRoaXMuZGVzdHJveVByb2dyZXNzSW5kaWNhdG9yKCk7XG4gICAgdGhpcy5kZXN0cm95RXJyb3JJbmRpY2F0b3IoKTtcbiAgfVxuXG4gIGFzeW5jIGJ1aWxkKCkge1xuICAgIGNvbnN0IHtlZGl0b3IsIGZpbGVQYXRofSA9IHRoaXMuZ2V0RWRpdG9yRGV0YWlscygpO1xuXG4gICAgaWYgKCFmaWxlUGF0aCkge1xuICAgICAgbGF0ZXgubG9nLndhcm5pbmcoXCJGaWxlIG5lZWRzIHRvIGJlIHNhdmVkIHRvIGRpc2sgYmVmb3JlIGl0IGNhbiBiZSBUZVhpZmllZC5cIik7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoZmFsc2UpO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5pc1RleEZpbGUoZmlsZVBhdGgpKSB7XG4gICAgICBsYXRleC5sb2cud2FybmluZyhoZXJlZG9jKGBGaWxlIGRvZXMgbm90IHNlZW0gdG8gYmUgYSBUZVggZmlsZTtcbiAgICAgICAgdW5zdXBwb3J0ZWQgZXh0ZW5zaW9uIFwiJHtwYXRoLmV4dG5hbWUoZmlsZVBhdGgpfVwiLmApKTtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChmYWxzZSk7XG4gICAgfVxuXG4gICAgaWYgKGVkaXRvci5pc01vZGlmaWVkKCkpIHtcbiAgICAgIGVkaXRvci5zYXZlKCk7IC8vIFRPRE86IE1ha2UgdGhpcyBjb25maWd1cmFibGU/XG4gICAgfVxuXG4gICAgY29uc3QgYnVpbGRlciA9IGxhdGV4LmdldEJ1aWxkZXIoKTtcbiAgICBjb25zdCByb290RmlsZVBhdGggPSB0aGlzLnJlc29sdmVSb290RmlsZVBhdGgoZmlsZVBhdGgpO1xuXG4gICAgdGhpcy5kZXN0cm95RXJyb3JJbmRpY2F0b3IoKTtcbiAgICB0aGlzLnNob3dQcm9ncmVzc0luZGljYXRvcigpO1xuXG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgbGV0IHN0YXR1c0NvZGUsIHJlc3VsdDtcblxuICAgICAgY29uc3Qgc2hvd0J1aWxkRXJyb3IgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgc2VsZi5zaG93RXJyb3Ioc3RhdHVzQ29kZSwgcmVzdWx0LCBidWlsZGVyKTtcbiAgICAgICAgcmVqZWN0KHN0YXR1c0NvZGUpO1xuICAgICAgfTtcblxuICAgICAgdHJ5IHtcbiAgICAgICAgc3RhdHVzQ29kZSA9IGF3YWl0IGJ1aWxkZXIucnVuKHJvb3RGaWxlUGF0aCk7XG4gICAgICAgIHJlc3VsdCA9IGJ1aWxkZXIucGFyc2VMb2dGaWxlKHJvb3RGaWxlUGF0aCk7XG4gICAgICAgIGlmIChzdGF0dXNDb2RlID4gMCB8fCAhcmVzdWx0IHx8ICFyZXN1bHQub3V0cHV0RmlsZVBhdGgpIHtcbiAgICAgICAgICBzaG93QnVpbGRFcnJvcihzdGF0dXNDb2RlLCByZXN1bHQsIGJ1aWxkZXIpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzZWxmLnNob3VsZE1vdmVSZXN1bHQoKSkge1xuICAgICAgICAgIHNlbGYubW92ZVJlc3VsdChyZXN1bHQsIHJvb3RGaWxlUGF0aCk7XG4gICAgICAgIH1cblxuICAgICAgICBzZWxmLnNob3dSZXN1bHQocmVzdWx0KTtcbiAgICAgICAgcmVzb2x2ZShzdGF0dXNDb2RlKTtcbiAgICAgIH1cbiAgICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yLm1lc3NhZ2UpO1xuICAgICAgICByZWplY3QoZXJyb3IubWVzc2FnZSk7XG4gICAgICB9XG4gICAgICBmaW5hbGx5IHtcbiAgICAgICAgc2VsZi5kZXN0cm95UHJvZ3Jlc3NJbmRpY2F0b3IoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHN5bmMoKSB7XG4gICAgY29uc3Qge2ZpbGVQYXRoLCBsaW5lTnVtYmVyfSA9IHRoaXMuZ2V0RWRpdG9yRGV0YWlscygpO1xuICAgIGlmICghZmlsZVBhdGggfHwgIXRoaXMuaXNUZXhGaWxlKGZpbGVQYXRoKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IG91dHB1dEZpbGVQYXRoID0gdGhpcy5yZXNvbHZlT3V0cHV0RmlsZVBhdGgoZmlsZVBhdGgpO1xuICAgIGlmICghb3V0cHV0RmlsZVBhdGgpIHtcbiAgICAgIGxhdGV4LmxvZy53YXJuaW5nKFwiQ291bGQgbm90IHJlc29sdmUgcGF0aCB0byBvdXRwdXQgZmlsZSBhc3NvY2lhdGVkIHdpdGggdGhlIGN1cnJlbnQgZmlsZS5cIik7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qgb3BlbmVyID0gbGF0ZXguZ2V0T3BlbmVyKCk7XG4gICAgaWYgKG9wZW5lcikge1xuICAgICAgb3BlbmVyLm9wZW4ob3V0cHV0RmlsZVBhdGgsIGZpbGVQYXRoLCBsaW5lTnVtYmVyKTtcbiAgICB9XG4gIH1cblxuICAvLyBOT1RFOiBEb2VzIG5vdCBzdXBwb3J0IGBsYXRleC5vdXRwdXREaXJlY3RvcnlgIHNldHRpbmchXG4gIGFzeW5jIGNsZWFuKCkge1xuICAgIGNvbnN0IHtmaWxlUGF0aH0gPSB0aGlzLmdldEVkaXRvckRldGFpbHMoKTtcbiAgICBpZiAoIWZpbGVQYXRoIHx8ICF0aGlzLmlzVGV4RmlsZShmaWxlUGF0aCkpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdCgpO1xuICAgIH1cblxuICAgIGNvbnN0IHJvb3RGaWxlUGF0aCA9IHRoaXMucmVzb2x2ZVJvb3RGaWxlUGF0aChmaWxlUGF0aCk7XG4gICAgY29uc3Qgcm9vdFBhdGggPSBwYXRoLmRpcm5hbWUocm9vdEZpbGVQYXRoKTtcbiAgICBsZXQgcm9vdEZpbGUgPSBwYXRoLmJhc2VuYW1lKHJvb3RGaWxlUGF0aCk7XG4gICAgcm9vdEZpbGUgPSByb290RmlsZS5zdWJzdHJpbmcoMCwgcm9vdEZpbGUubGFzdEluZGV4T2YoXCIuXCIpKTtcblxuICAgIGNvbnN0IGNsZWFuRXh0ZW5zaW9ucyA9IGF0b20uY29uZmlnLmdldChcImxhdGV4LmNsZWFuRXh0ZW5zaW9uc1wiKTtcbiAgICByZXR1cm4gYXdhaXQqIGNsZWFuRXh0ZW5zaW9ucy5tYXAoYXN5bmMgZnVuY3Rpb24oZXh0ZW5zaW9uKSB7XG4gICAgICBjb25zdCBjYW5kaWRhdGVQYXRoID0gcGF0aC5qb2luKHJvb3RQYXRoLCByb290RmlsZSArIGV4dGVuc2lvbik7XG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgZnVuY3Rpb24ocmVzb2x2ZSkge1xuICAgICAgICBmcy5yZW1vdmUoY2FuZGlkYXRlUGF0aCwgKGVycm9yKSA9PiB7XG4gICAgICAgICAgcmVzb2x2ZSh7ZmlsZVBhdGg6IGNhbmRpZGF0ZVBhdGgsIGVycm9yOiBlcnJvcn0pO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgc2V0U3RhdHVzQmFyKHN0YXR1c0Jhcikge1xuICAgIHRoaXMuc3RhdHVzQmFyID0gc3RhdHVzQmFyO1xuICB9XG5cbiAgbW92ZVJlc3VsdChyZXN1bHQsIGZpbGVQYXRoKSB7XG4gICAgY29uc3Qgb3JpZ2luYWxPdXRwdXRGaWxlUGF0aCA9IHJlc3VsdC5vdXRwdXRGaWxlUGF0aDtcbiAgICByZXN1bHQub3V0cHV0RmlsZVBhdGggPSB0aGlzLmFsdGVyUGFyZW50UGF0aChmaWxlUGF0aCwgb3JpZ2luYWxPdXRwdXRGaWxlUGF0aCk7XG4gICAgaWYgKGZzLmV4aXN0c1N5bmMob3JpZ2luYWxPdXRwdXRGaWxlUGF0aCkpIHtcbiAgICAgIGZzLnJlbW92ZVN5bmMocmVzdWx0Lm91dHB1dEZpbGVQYXRoKTtcbiAgICAgIGZzLm1vdmVTeW5jKG9yaWdpbmFsT3V0cHV0RmlsZVBhdGgsIHJlc3VsdC5vdXRwdXRGaWxlUGF0aCk7XG4gICAgfVxuXG4gICAgY29uc3Qgb3JpZ2luYWxTeW5jRmlsZVBhdGggPSBvcmlnaW5hbE91dHB1dEZpbGVQYXRoLnJlcGxhY2UoL1xcLnBkZiQvLCBcIi5zeW5jdGV4Lmd6XCIpO1xuICAgIGlmIChmcy5leGlzdHNTeW5jKG9yaWdpbmFsU3luY0ZpbGVQYXRoKSkge1xuICAgICAgY29uc3Qgc3luY0ZpbGVQYXRoID0gdGhpcy5hbHRlclBhcmVudFBhdGgoZmlsZVBhdGgsIG9yaWdpbmFsU3luY0ZpbGVQYXRoKTtcbiAgICAgIGZzLnJlbW92ZVN5bmMoc3luY0ZpbGVQYXRoKTtcbiAgICAgIGZzLm1vdmVTeW5jKG9yaWdpbmFsU3luY0ZpbGVQYXRoLCBzeW5jRmlsZVBhdGgpO1xuICAgIH1cbiAgfVxuXG4gIHJlc29sdmVSb290RmlsZVBhdGgoZmlsZVBhdGgpIHtcbiAgICBjb25zdCBNYXN0ZXJUZXhGaW5kZXIgPSByZXF1aXJlKFwiLi9tYXN0ZXItdGV4LWZpbmRlclwiKTtcbiAgICBjb25zdCBmaW5kZXIgPSBuZXcgTWFzdGVyVGV4RmluZGVyKGZpbGVQYXRoKTtcbiAgICByZXR1cm4gZmluZGVyLmdldE1hc3RlclRleFBhdGgoKTtcbiAgfVxuXG4gIHJlc29sdmVPdXRwdXRGaWxlUGF0aChmaWxlUGF0aCkge1xuICAgIGxldCBvdXRwdXRGaWxlUGF0aCwgcm9vdEZpbGVQYXRoO1xuXG4gICAgaWYgKHRoaXMub3V0cHV0TG9va3VwKSB7XG4gICAgICBvdXRwdXRGaWxlUGF0aCA9IHRoaXMub3V0cHV0TG9va3VwW2ZpbGVQYXRoXTtcbiAgICB9XG5cbiAgICBpZiAoIW91dHB1dEZpbGVQYXRoKSB7XG4gICAgICByb290RmlsZVBhdGggPSB0aGlzLnJlc29sdmVSb290RmlsZVBhdGgoZmlsZVBhdGgpO1xuXG4gICAgICBjb25zdCBidWlsZGVyID0gbGF0ZXguZ2V0QnVpbGRlcigpO1xuICAgICAgY29uc3QgcmVzdWx0ID0gYnVpbGRlci5wYXJzZUxvZ0ZpbGUocm9vdEZpbGVQYXRoKTtcbiAgICAgIGlmICghcmVzdWx0IHx8ICFyZXN1bHQub3V0cHV0RmlsZVBhdGgpIHtcbiAgICAgICAgbGF0ZXgubG9nLndhcm5pbmcoXCJMb2cgZmlsZSBwYXJzaW5nIGZhaWxlZCFcIik7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuXG4gICAgICB0aGlzLm91dHB1dExvb2t1cCA9IHRoaXMub3V0cHV0TG9va3VwIHx8IHt9O1xuICAgICAgdGhpcy5vdXRwdXRMb29rdXBbZmlsZVBhdGhdID0gcmVzdWx0Lm91dHB1dEZpbGVQYXRoO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnNob3VsZE1vdmVSZXN1bHQoKSkge1xuICAgICAgb3V0cHV0RmlsZVBhdGggPSB0aGlzLmFsdGVyUGFyZW50UGF0aChyb290RmlsZVBhdGgsIG91dHB1dEZpbGVQYXRoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gb3V0cHV0RmlsZVBhdGg7XG4gIH1cblxuICBzaG93UmVzdWx0KHJlc3VsdCkge1xuICAgIGlmICghdGhpcy5zaG91bGRPcGVuUmVzdWx0KCkpIHsgcmV0dXJuOyB9XG5cbiAgICBjb25zdCBvcGVuZXIgPSBsYXRleC5nZXRPcGVuZXIoKTtcbiAgICBpZiAob3BlbmVyKSB7XG4gICAgICBjb25zdCB7ZmlsZVBhdGgsIGxpbmVOdW1iZXJ9ID0gdGhpcy5nZXRFZGl0b3JEZXRhaWxzKCk7XG4gICAgICBvcGVuZXIub3BlbihyZXN1bHQub3V0cHV0RmlsZVBhdGgsIGZpbGVQYXRoLCBsaW5lTnVtYmVyKTtcbiAgICB9XG4gIH1cblxuICBzaG93RXJyb3Ioc3RhdHVzQ29kZSwgcmVzdWx0LCBidWlsZGVyKSB7XG4gICAgdGhpcy5zaG93RXJyb3JJbmRpY2F0b3IocmVzdWx0KTtcbiAgICBsYXRleC5sb2cuZXJyb3Ioc3RhdHVzQ29kZSwgcmVzdWx0LCBidWlsZGVyKTtcbiAgfVxuXG4gIHNob3dQcm9ncmVzc0luZGljYXRvcigpIHtcbiAgICBpZiAoIXRoaXMuc3RhdHVzQmFyKSB7IHJldHVybiBudWxsOyB9XG4gICAgaWYgKHRoaXMuaW5kaWNhdG9yKSB7IHJldHVybiB0aGlzLmluZGljYXRvcjsgfVxuXG4gICAgY29uc3QgUHJvZ3Jlc3NJbmRpY2F0b3JWaWV3ID0gcmVxdWlyZShcIi4vdmlld3MvcHJvZ3Jlc3MtaW5kaWNhdG9yLXZpZXdcIik7XG4gICAgdGhpcy5pbmRpY2F0b3IgPSBuZXcgUHJvZ3Jlc3NJbmRpY2F0b3JWaWV3KCk7XG4gICAgdGhpcy5zdGF0dXNCYXIuYWRkUmlnaHRUaWxlKHtpdGVtOiB0aGlzLmluZGljYXRvciwgcHJpb3JpdHk6IDkwMDF9KTtcblxuICAgIHJldHVybiB0aGlzLmluZGljYXRvcjtcbiAgfVxuXG4gIHNob3dFcnJvckluZGljYXRvcihyZXN1bHQpIHtcbiAgICBpZiAoIXRoaXMuc3RhdHVzQmFyKSB7IHJldHVybiBudWxsOyB9XG4gICAgaWYgKHRoaXMuZXJyb3JJbmRpY2F0b3IpIHsgcmV0dXJuIHRoaXMuZXJyb3JJbmRpY2F0b3I7IH1cblxuICAgIGNvbnN0IEVycm9ySW5kaWNhdG9yVmlldyA9IHJlcXVpcmUoXCIuL3ZpZXdzL2Vycm9yLWluZGljYXRvci12aWV3XCIpO1xuICAgIHRoaXMuZXJyb3JJbmRpY2F0b3IgPSBuZXcgRXJyb3JJbmRpY2F0b3JWaWV3KCk7XG4gICAgdGhpcy5lcnJvckluZGljYXRvci5pbml0aWFsaXplKHJlc3VsdCk7XG4gICAgdGhpcy5zdGF0dXNCYXIuYWRkUmlnaHRUaWxlKHtpdGVtOiB0aGlzLmVycm9ySW5kaWNhdG9yLCBwcmlvcml0eTogOTAwMX0pO1xuXG4gICAgcmV0dXJuIHRoaXMuZXJyb3JJbmRpY2F0b3I7XG4gIH1cblxuICBkZXN0cm95UHJvZ3Jlc3NJbmRpY2F0b3IoKSB7XG4gICAgaWYgKHRoaXMuaW5kaWNhdG9yKSB7XG4gICAgICB0aGlzLmluZGljYXRvci5yZW1vdmUoKTtcbiAgICAgIHRoaXMuaW5kaWNhdG9yID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICBkZXN0cm95RXJyb3JJbmRpY2F0b3IoKSB7XG4gICAgaWYgKHRoaXMuZXJyb3JJbmRpY2F0b3IpIHtcbiAgICAgIHRoaXMuZXJyb3JJbmRpY2F0b3IucmVtb3ZlKCk7XG4gICAgICB0aGlzLmVycm9ySW5kaWNhdG9yID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICBpc1RleEZpbGUoZmlsZVBhdGgpIHtcbiAgICAvLyBUT0RPOiBJbXByb3ZlOyB3aWxsIHN1ZmZpY2UgZm9yIHRoZSB0aW1lIGJlaW5nLlxuICAgIHJldHVybiAhZmlsZVBhdGggfHwgZmlsZVBhdGguc2VhcmNoKC9cXC4odGV4fGxocykkLykgPiAwO1xuICB9XG5cbiAgZ2V0RWRpdG9yRGV0YWlscygpIHtcbiAgICBjb25zdCBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCk7XG4gICAgbGV0IGZpbGVQYXRoLCBsaW5lTnVtYmVyO1xuICAgIGlmIChlZGl0b3IpIHtcbiAgICAgIGZpbGVQYXRoID0gZWRpdG9yLmdldFBhdGgoKTtcbiAgICAgIGxpbmVOdW1iZXIgPSBlZGl0b3IuZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oKS5yb3cgKyAxO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBlZGl0b3I6IGVkaXRvcixcbiAgICAgIGZpbGVQYXRoOiBmaWxlUGF0aCxcbiAgICAgIGxpbmVOdW1iZXI6IGxpbmVOdW1iZXIsXG4gICAgfTtcbiAgfVxuXG4gIGFsdGVyUGFyZW50UGF0aCh0YXJnZXRQYXRoLCBvcmlnaW5hbFBhdGgpIHtcbiAgICBjb25zdCB0YXJnZXREaXIgPSBwYXRoLmRpcm5hbWUodGFyZ2V0UGF0aCk7XG4gICAgcmV0dXJuIHBhdGguam9pbih0YXJnZXREaXIsIHBhdGguYmFzZW5hbWUob3JpZ2luYWxQYXRoKSk7XG4gIH1cblxuICBzaG91bGRNb3ZlUmVzdWx0KCkge1xuICAgIGNvbnN0IG1vdmVSZXN1bHQgPSBhdG9tLmNvbmZpZy5nZXQoXCJsYXRleC5tb3ZlUmVzdWx0VG9Tb3VyY2VEaXJlY3RvcnlcIik7XG4gICAgY29uc3Qgb3V0cHV0RGlyZWN0b3J5ID0gYXRvbS5jb25maWcuZ2V0KFwibGF0ZXgub3V0cHV0RGlyZWN0b3J5XCIpO1xuICAgIHJldHVybiBtb3ZlUmVzdWx0ICYmIG91dHB1dERpcmVjdG9yeS5sZW5ndGggPiAwO1xuICB9XG5cbiAgc2hvdWxkT3BlblJlc3VsdCgpIHsgcmV0dXJuIGF0b20uY29uZmlnLmdldChcImxhdGV4Lm9wZW5SZXN1bHRBZnRlckJ1aWxkXCIpOyB9XG59XG4iXX0=