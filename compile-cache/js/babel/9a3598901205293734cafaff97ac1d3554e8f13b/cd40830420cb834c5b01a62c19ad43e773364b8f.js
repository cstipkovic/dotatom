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
      var _this = this;

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

    // NOTE: Does not support `latex.outputDirectory` setting!
  }, {
    key: "clean",
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

      var ProgressIndicator = require("./status-bar/progress-indicator");
      this.indicator = new ProgressIndicator();
      this.statusBar.addRightTile({
        item: this.indicator,
        priority: 9001
      });
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

      var ErrorIndicator = require("./status-bar/error-indicator");
      this.errorIndicator = new ErrorIndicator(result);
      this.statusBar.addRightTile({
        item: this.errorIndicator,
        priority: 9001
      });
    }
  }, {
    key: "destroyProgressIndicator",
    value: function destroyProgressIndicator() {
      if (this.indicator) {
        this.indicator.element.remove();
        this.indicator = null;
      }
    }
  }, {
    key: "destroyErrorIndicator",
    value: function destroyErrorIndicator() {
      if (this.errorIndicator) {
        this.errorIndicator.element.remove();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL2NvbXBvc2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztzQkFFZSxTQUFTOzs7O29CQUNQLE1BQU07Ozs7d0JBQ0QsWUFBWTs7QUFKbEMsV0FBVyxDQUFDOztJQU1TLFFBQVE7V0FBUixRQUFROzBCQUFSLFFBQVE7OztlQUFSLFFBQVE7O1dBQ3BCLG1CQUFHO0FBQ1IsVUFBSSxDQUFDLHdCQUF3QixFQUFFLENBQUM7QUFDaEMsVUFBSSxDQUFDLHFCQUFxQixFQUFFLENBQUM7S0FDOUI7Ozs2QkFFVSxhQUFHOzs7OEJBQ2UsSUFBSSxDQUFDLGdCQUFnQixFQUFFOztVQUEzQyxNQUFNLHFCQUFOLE1BQU07VUFBRSxRQUFRLHFCQUFSLFFBQVE7O0FBRXZCLFVBQUksQ0FBQyxRQUFRLEVBQUU7QUFDYixhQUFLLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQywyREFBMkQsQ0FBQyxDQUFDO0FBQy9FLGVBQU8sT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztPQUM5Qjs7QUFFRCxVQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsRUFBRTtBQUM3QixhQUFLLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxrR0FDUyxrQkFBSyxPQUFPLENBQUMsUUFBUSxDQUFDLFNBQUssQ0FBQyxDQUFDO0FBQ3hELGVBQU8sT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztPQUM5Qjs7QUFFRCxVQUFJLE1BQU0sQ0FBQyxVQUFVLEVBQUUsRUFBRTtBQUN2QixjQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7T0FDZjs7QUFFRCxVQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsVUFBVSxFQUFFLENBQUM7QUFDbkMsVUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLFFBQVEsQ0FBQyxDQUFDOztBQUV4RCxVQUFJLENBQUMscUJB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QUksTUFBTSxFQUFFO0FBQ1YsZ0JBQVEsR0FBRyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDNUIsa0JBQVUsR0FBRyxNQUFNLENBQUMsdUJBQXVCLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDO09BQ3ZEOztBQUVELGFBQU87QUFDTCxjQUFNLEVBQUUsTUFBTTtBQUNkLGdCQUFRLEVBQUUsUUFBUTtBQUNsQixrQkFBVSxFQUFFLFVBQVU7T0FDdkIsQ0FBQztLQUNIOzs7V0FFYyx5QkFBQyxVQUFVLEVBQUUsWUFBWSxFQUFFO0FBQ3hDLFVBQU0sU0FBUyxHQUFHLGtCQUFLLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUMzQyxhQUFPLGtCQUFLLElBQUksQ0FBQyxTQUFTLEVBQUUsa0JBQUssUUFBUSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7S0FDMUQ7OztXQUVlLDRCQUFHO0FBQ2pCLFVBQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLG1DQUFtQyxDQUFDLENBQUM7QUFDeEUsVUFBTSxlQUFlLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsdUJBQXVCLENBQUMsQ0FBQztBQUNqRSxhQUFPLFVBQVUsSUFBSSxlQUFlLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztLQUNqRDs7O1dBRWUsNEJBQUc7QUFBRSxhQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLDRCQUE0QixDQUFDLENBQUM7S0FBRTs7O1NBbFB6RCxRQUFROzs7cUJBQVIsUUFBUSIsImZpbGUiOiIvaG9tZS9jaW5fY2hhbGljLy5hdG9tL3BhY2thZ2VzL2xhdGV4L2xpYi9jb21wb3Nlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIGJhYmVsXCI7XG5cbmltcG9ydCBmcyBmcm9tIFwiZnMtcGx1c1wiO1xuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcbmltcG9ydCB7aGVyZWRvY30gZnJvbSBcIi4vd2Vya3pldWdcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29tcG9zZXIge1xuICBkZXN0cm95KCkge1xuICAgIHRoaXMuZGVzdHJveVByb2dyZXNzSW5kaWNhdG9yKCk7XG4gICAgdGhpcy5kZXN0cm95RXJyb3JJbmRpY2F0b3IoKTtcbiAgfVxuXG4gIGFzeW5jIGJ1aWxkKCkge1xuICAgIGNvbnN0IHtlZGl0b3IsIGZpbGVQYXRofSA9IHRoaXMuZ2V0RWRpdG9yRGV0YWlscygpO1xuXG4gICAgaWYgKCFmaWxlUGF0aCkge1xuICAgICAgbGF0ZXgubG9nLndhcm5pbmcoXCJGaWxlIG5lZWRzIHRvIGJlIHNhdmVkIHRvIGRpc2sgYmVmb3JlIGl0IGNhbiBiZSBUZVhpZmllZC5cIik7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoZmFsc2UpO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5pc1RleEZpbGUoZmlsZVBhdGgpKSB7XG4gICAgICBsYXRleC5sb2cud2FybmluZyhoZXJlZG9jKGBGaWxlIGRvZXMgbm90IHNlZW0gdG8gYmUgYSBUZVggZmlsZTtcbiAgICAgICAgdW5zdXBwb3J0ZWQgZXh0ZW5zaW9uIFwiJHtwYXRoLmV4dG5hbWUoZmlsZVBhdGgpfVwiLmApKTtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChmYWxzZSk7XG4gICAgfVxuXG4gICAgaWYgKGVkaXRvci5pc01vZGlmaWVkKCkpIHtcbiAgICAgIGVkaXRvci5zYXZlKCk7IC8vIFRPRE86IE1ha2UgdGhpcyBjb25maWd1cmFibGU/XG4gICAgfVxuXG4gICAgY29uc3QgYnVpbGRlciA9IGxhdGV4LmdldEJ1aWxkZXIoKTtcbiAgICBjb25zdCByb290RmlsZVBhdGggPSB0aGlzLnJlc29sdmVSb290RmlsZVBhdGgoZmlsZVBhdGgpO1xuXG4gICAgdGhpcy5kZXN0cm95RXJyb3JJbmRpY2F0b3IoKTtcbiAgICB0aGlzLnNob3dQcm9ncmVzc0luZGljYXRvcigpO1xuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGxldCBzdGF0dXNDb2RlLCByZXN1bHQ7XG5cbiAgICAgIGNvbnN0IHNob3dCdWlsZEVycm9yID0gKCkgPT4ge1xuICAgICAgICB0aGlzLnNob3dFcnJvcihzdGF0dXNDb2RlLCByZXN1bHQsIGJ1aWxkZXIpO1xuICAgICAgICByZWplY3Qoc3RhdHVzQ29kZSk7XG4gICAgICB9O1xuXG4gICAgICB0cnkge1xuICAgICAgICBzdGF0dXNDb2RlID0gYXdhaXQgYnVpbGRlci5ydW4ocm9vdEZpbGVQYXRoKTtcbiAgICAgICAgcmVzdWx0ID0gYnVpbGRlci5wYXJzZUxvZ0ZpbGUocm9vdEZpbGVQYXRoKTtcbiAgICAgICAgaWYgKHN0YXR1c0NvZGUgPiAwIHx8ICFyZXN1bHQgfHwgIXJlc3VsdC5vdXRwdXRGaWxlUGF0aCkge1xuICAgICAgICAgIHNob3dCdWlsZEVycm9yKHN0YXR1c0NvZGUsIHJlc3VsdCwgYnVpbGRlcik7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuc2hvdWxkTW92ZVJlc3VsdCgpKSB7XG4gICAgICAgICAgdGhpcy5tb3ZlUmVzdWx0KHJlc3VsdCwgcm9vdEZpbGVQYXRoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2hvd1Jlc3VsdChyZXN1bHQpO1xuICAgICAgICByZXNvbHZlKHN0YXR1c0NvZGUpO1xuICAgICAgfVxuICAgICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IubWVzc2FnZSk7XG4gICAgICAgIHJlamVjdChlcnJvci5tZXNzYWdlKTtcbiAgICAgIH1cbiAgICAgIGZpbmFsbHkge1xuICAgICAgICB0aGlzLmRlc3Ryb3lQcm9ncmVzc0luZGljYXRvcigpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgc3luYygpIHtcbiAgICBjb25zdCB7ZmlsZVBhdGgsIGxpbmVOdW1iZXJ9ID0gdGhpcy5nZXRFZGl0b3JEZXRhaWxzKCk7XG4gICAgaWYgKCFmaWxlUGF0aCB8fCAhdGhpcy5pc1RleEZpbGUoZmlsZVBhdGgpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qgb3V0cHV0RmlsZVBhdGggPSB0aGlzLnJlc29sdmVPdXRwdXRGaWxlUGF0aChmaWxlUGF0aCk7XG4gICAgaWYgKCFvdXRwdXRGaWxlUGF0aCkge1xuICAgICAgbGF0ZXgubG9nLndhcm5pbmcoXCJDb3VsZCBub3QgcmVzb2x2ZSBwYXRoIHRvIG91dHB1dCBmaWxlIGFzc29jaWF0ZWQgd2l0aCB0aGUgY3VycmVudCBmaWxlLlwiKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBvcGVuZXIgPSBsYXRleC5nZXRPcGVuZXIoKTtcbiAgICBpZiAob3BlbmVyKSB7XG4gICAgICBvcGVuZXIub3BlbihvdXRwdXRGaWxlUGF0aCwgZmlsZVBhdGgsIGxpbmVOdW1iZXIpO1xuICAgIH1cbiAgfVxuXG4gIC8vIE5PVEU6IERvZXMgbm90IHN1cHBvcnQgYGxhdGV4Lm91dHB1dERpcmVjdG9yeWAgc2V0dGluZyFcbiAgYXN5bmMgY2xlYW4oKSB7XG4gICAgY29uc3Qge2ZpbGVQYXRofSA9IHRoaXMuZ2V0RWRpdG9yRGV0YWlscygpO1xuICAgIGlmICghZmlsZVBhdGggfHwgIXRoaXMuaXNUZXhGaWxlKGZpbGVQYXRoKSkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KCk7XG4gICAgfVxuXG4gICAgY29uc3Qgcm9vdEZpbGVQYXRoID0gdGhpcy5yZXNvbHZlUm9vdEZpbGVQYXRoKGZpbGVQYXRoKTtcbiAgICBjb25zdCByb290UGF0aCA9IHBhdGguZGlybmFtZShyb290RmlsZVBhdGgpO1xuICAgIGxldCByb290RmlsZSA9IHBhdGguYmFzZW5hbWUocm9vdEZpbGVQYXRoKTtcbiAgICByb290RmlsZSA9IHJvb3RGaWxlLnN1YnN0cmluZygwLCByb290RmlsZS5sYXN0SW5kZXhPZihcIi5cIikpO1xuXG4gICAgY29uc3QgY2xlYW5FeHRlbnNpb25zID0gYXRvbS5jb25maWcuZ2V0KFwibGF0ZXguY2xlYW5FeHRlbnNpb25zXCIpO1xuICAgIHJldHVybiBhd2FpdCogY2xlYW5FeHRlbnNpb25zLm1hcChhc3luYyAoZXh0ZW5zaW9uKSA9PiB7XG4gICAgICBjb25zdCBjYW5kaWRhdGVQYXRoID0gcGF0aC5qb2luKHJvb3RQYXRoLCByb290RmlsZSArIGV4dGVuc2lvbik7XG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHJlc29sdmUpID0+IHtcbiAgICAgICAgZnMucmVtb3ZlKGNhbmRpZGF0ZVBhdGgsIChlcnJvcikgPT4ge1xuICAgICAgICAgIHJlc29sdmUoe2ZpbGVQYXRoOiBjYW5kaWRhdGVQYXRoLCBlcnJvcjogZXJyb3J9KTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIHNldFN0YXR1c0JhcihzdGF0dXNCYXIpIHtcbiAgICB0aGlzLnN0YXR1c0JhciA9IHN0YXR1c0JhcjtcbiAgfVxuXG4gIG1vdmVSZXN1bHQocmVzdWx0LCBmaWxlUGF0aCkge1xuICAgIGNvbnN0IG9yaWdpbmFsT3V0cHV0RmlsZVBhdGggPSByZXN1bHQub3V0cHV0RmlsZVBhdGg7XG4gICAgcmVzdWx0Lm91dHB1dEZpbGVQYXRoID0gdGhpcy5hbHRlclBhcmVudFBhdGgoZmlsZVBhdGgsIG9yaWdpbmFsT3V0cHV0RmlsZVBhdGgpO1xuICAgIGlmIChmcy5leGlzdHNTeW5jKG9yaWdpbmFsT3V0cHV0RmlsZVBhdGgpKSB7XG4gICAgICBmcy5yZW1vdmVTeW5jKHJlc3VsdC5vdXRwdXRGaWxlUGF0aCk7XG4gICAgICBmcy5tb3ZlU3luYyhvcmlnaW5hbE91dHB1dEZpbGVQYXRoLCByZXN1bHQub3V0cHV0RmlsZVBhdGgpO1xuICAgIH1cblxuICAgIGNvbnN0IG9yaWdpbmFsU3luY0ZpbGVQYXRoID0gb3JpZ2luYWxPdXRwdXRGaWxlUGF0aC5yZXBsYWNlKC9cXC5wZGYkLywgXCIuc3luY3RleC5nelwiKTtcbiAgICBpZiAoZnMuZXhpc3RzU3luYyhvcmlnaW5hbFN5bmNGaWxlUGF0aCkpIHtcbiAgICAgIGNvbnN0IHN5bmNGaWxlUGF0aCA9IHRoaXMuYWx0ZXJQYXJlbnRQYXRoKGZpbGVQYXRoLCBvcmlnaW5hbFN5bmNGaWxlUGF0aCk7XG4gICAgICBmcy5yZW1vdmVTeW5jKHN5bmNGaWxlUGF0aCk7XG4gICAgICBmcy5tb3ZlU3luYyhvcmlnaW5hbFN5bmNGaWxlUGF0aCwgc3luY0ZpbGVQYXRoKTtcbiAgICB9XG4gIH1cblxuICByZXNvbHZlUm9vdEZpbGVQYXRoKGZpbGVQYXRoKSB7XG4gICAgY29uc3QgTWFzdGVyVGV4RmluZGVyID0gcmVxdWlyZShcIi4vbWFzdGVyLXRleC1maW5kZXJcIik7XG4gICAgY29uc3QgZmluZGVyID0gbmV3IE1hc3RlclRleEZpbmRlcihmaWxlUGF0aCk7XG4gICAgcmV0dXJuIGZpbmRlci5nZXRNYXN0ZXJUZXhQYXRoKCk7XG4gIH1cblxuICByZXNvbHZlT3V0cHV0RmlsZVBhdGgoZmlsZVBhdGgpIHtcbiAgICBsZXQgb3V0cHV0RmlsZVBhdGgsIHJvb3RGaWxlUGF0aDtcblxuICAgIGlmICh0aGlzLm91dHB1dExvb2t1cCkge1xuICAgICAgb3V0cHV0RmlsZVBhdGggPSB0aGlzLm91dHB1dExvb2t1cFtmaWxlUGF0aF07XG4gICAgfVxuXG4gICAgaWYgKCFvdXRwdXRGaWxlUGF0aCkge1xuICAgICAgcm9vdEZpbGVQYXRoID0gdGhpcy5yZXNvbHZlUm9vdEZpbGVQYXRoKGZpbGVQYXRoKTtcblxuICAgICAgY29uc3QgYnVpbGRlciA9IGxhdGV4LmdldEJ1aWxkZXIoKTtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGJ1aWxkZXIucGFyc2VMb2dGaWxlKHJvb3RGaWxlUGF0aCk7XG4gICAgICBpZiAoIXJlc3VsdCB8fCAhcmVzdWx0Lm91dHB1dEZpbGVQYXRoKSB7XG4gICAgICAgIGxhdGV4LmxvZy53YXJuaW5nKFwiTG9nIGZpbGUgcGFyc2luZyBmYWlsZWQhXCIpO1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cblxuICAgICAgdGhpcy5vdXRwdXRMb29rdXAgPSB0aGlzLm91dHB1dExvb2t1cCB8fCB7fTtcbiAgICAgIHRoaXMub3V0cHV0TG9va3VwW2ZpbGVQYXRoXSA9IHJlc3VsdC5vdXRwdXRGaWxlUGF0aDtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5zaG91bGRNb3ZlUmVzdWx0KCkpIHtcbiAgICAgIG91dHB1dEZpbGVQYXRoID0gdGhpcy5hbHRlclBhcmVudFBhdGgocm9vdEZpbGVQYXRoLCBvdXRwdXRGaWxlUGF0aCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG91dHB1dEZpbGVQYXRoO1xuICB9XG5cbiAgc2hvd1Jlc3VsdChyZXN1bHQpIHtcbiAgICBpZiAoIXRoaXMuc2hvdWxkT3BlblJlc3VsdCgpKSB7IHJldHVybjsgfVxuXG4gICAgY29uc3Qgb3BlbmVyID0gbGF0ZXguZ2V0T3BlbmVyKCk7XG4gICAgaWYgKG9wZW5lcikge1xuICAgICAgY29uc3Qge2ZpbGVQYXRoLCBsaW5lTnVtYmVyfSA9IHRoaXMuZ2V0RWRpdG9yRGV0YWlscygpO1xuICAgICAgb3BlbmVyLm9wZW4ocmVzdWx0Lm91dHB1dEZpbGVQYXRoLCBmaWxlUGF0aCwgbGluZU51bWJlcik7XG4gICAgfVxuICB9XG5cbiAgc2hvd0Vycm9yKHN0YXR1c0NvZGUsIHJlc3VsdCwgYnVpbGRlcikge1xuICAgIHRoaXMuc2hvd0Vycm9ySW5kaWNhdG9yKHJlc3VsdCk7XG4gICAgbGF0ZXgubG9nLmVycm9yKHN0YXR1c0NvZGUsIHJlc3VsdCwgYnVpbGRlcik7XG4gIH1cblxuICBzaG93UHJvZ3Jlc3NJbmRpY2F0b3IoKSB7XG4gICAgaWYgKCF0aGlzLnN0YXR1c0JhcikgeyByZXR1cm4gbnVsbDsgfVxuICAgIGlmICh0aGlzLmluZGljYXRvcikgeyByZXR1cm4gdGhpcy5pbmRpY2F0b3I7IH1cblxuICAgIGNvbnN0IFByb2dyZXNzSW5kaWNhdG9yID0gcmVxdWlyZShcIi4vc3RhdHVzLWJhci9wcm9ncmVzcy1pbmRpY2F0b3JcIik7XG4gICAgdGhpcy5pbmRpY2F0b3IgPSBuZXcgUHJvZ3Jlc3NJbmRpY2F0b3IoKTtcbiAgICB0aGlzLnN0YXR1c0Jhci5hZGRSaWdodFRpbGUoe1xuICAgICAgaXRlbTogdGhpcy5pbmRpY2F0b3IsXG4gICAgICBwcmlvcml0eTogOTAwMSxcbiAgICB9KTtcbiAgfVxuXG4gIHNob3dFcnJvckluZGljYXRvcihyZXN1bHQpIHtcbiAgICBpZiAoIXRoaXMuc3RhdHVzQmFyKSB7IHJldHVybiBudWxsOyB9XG4gICAgaWYgKHRoaXMuZXJyb3JJbmRpY2F0b3IpIHsgcmV0dXJuIHRoaXMuZXJyb3JJbmRpY2F0b3I7IH1cblxuICAgIGNvbnN0IEVycm9ySW5kaWNhdG9yID0gcmVxdWlyZShcIi4vc3RhdHVzLWJhci9lcnJvci1pbmRpY2F0b3JcIik7XG4gICAgdGhpcy5lcnJvckluZGljYXRvciA9IG5ldyBFcnJvckluZGljYXRvcihyZXN1bHQpO1xuICAgIHRoaXMuc3RhdHVzQmFyLmFkZFJpZ2h0VGlsZSh7XG4gICAgICBpdGVtOiB0aGlzLmVycm9ySW5kaWNhdG9yLFxuICAgICAgcHJpb3JpdHk6IDkwMDEsXG4gICAgfSk7XG4gIH1cblxuICBkZXN0cm95UHJvZ3Jlc3NJbmRpY2F0b3IoKSB7XG4gICAgaWYgKHRoaXMuaW5kaWNhdG9yKSB7XG4gICAgICB0aGlzLmluZGljYXRvci5lbGVtZW50LnJlbW92ZSgpO1xuICAgICAgdGhpcy5pbmRpY2F0b3IgPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIGRlc3Ryb3lFcnJvckluZGljYXRvcigpIHtcbiAgICBpZiAodGhpcy5lcnJvckluZGljYXRvcikge1xuICAgICAgdGhpcy5lcnJvckluZGljYXRvci5lbGVtZW50LnJlbW92ZSgpO1xuICAgICAgdGhpcy5lcnJvckluZGljYXRvciA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgaXNUZXhGaWxlKGZpbGVQYXRoKSB7XG4gICAgLy8gVE9ETzogSW1wcm92ZTsgd2lsbCBzdWZmaWNlIGZvciB0aGUgdGltZSBiZWluZy5cbiAgICByZXR1cm4gIWZpbGVQYXRoIHx8IGZpbGVQYXRoLnNlYXJjaCgvXFwuKHRleHxsaHMpJC8pID4gMDtcbiAgfVxuXG4gIGdldEVkaXRvckRldGFpbHMoKSB7XG4gICAgY29uc3QgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpO1xuICAgIGxldCBmaWxlUGF0aCwgbGluZU51bWJlcjtcbiAgICBpZiAoZWRpdG9yKSB7XG4gICAgICBmaWxlUGF0aCA9IGVkaXRvci5nZXRQYXRoKCk7XG4gICAgICBsaW5lTnVtYmVyID0gZWRpdG9yLmdldEN1cnNvckJ1ZmZlclBvc2l0aW9uKCkucm93ICsgMTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgZWRpdG9yOiBlZGl0b3IsXG4gICAgICBmaWxlUGF0aDogZmlsZVBhdGgsXG4gICAgICBsaW5lTnVtYmVyOiBsaW5lTnVtYmVyLFxuICAgIH07XG4gIH1cblxuICBhbHRlclBhcmVudFBhdGgodGFyZ2V0UGF0aCwgb3JpZ2luYWxQYXRoKSB7XG4gICAgY29uc3QgdGFyZ2V0RGlyID0gcGF0aC5kaXJuYW1lKHRhcmdldFBhdGgpO1xuICAgIHJldHVybiBwYXRoLmpvaW4odGFyZ2V0RGlyLCBwYXRoLmJhc2VuYW1lKG9yaWdpbmFsUGF0aCkpO1xuICB9XG5cbiAgc2hvdWxkTW92ZVJlc3VsdCgpIHtcbiAgICBjb25zdCBtb3ZlUmVzdWx0ID0gYXRvbS5jb25maWcuZ2V0KFwibGF0ZXgubW92ZVJlc3VsdFRvU291cmNlRGlyZWN0b3J5XCIpO1xuICAgIGNvbnN0IG91dHB1dERpcmVjdG9yeSA9IGF0b20uY29uZmlnLmdldChcImxhdGV4Lm91dHB1dERpcmVjdG9yeVwiKTtcbiAgICByZXR1cm4gbW92ZVJlc3VsdCAmJiBvdXRwdXREaXJlY3RvcnkubGVuZ3RoID4gMDtcbiAgfVxuXG4gIHNob3VsZE9wZW5SZXN1bHQoKSB7IHJldHVybiBhdG9tLmNvbmZpZy5nZXQoXCJsYXRleC5vcGVuUmVzdWx0QWZ0ZXJCdWlsZFwiKTsgfVxufVxuIl19
//# sourceURL=/home/cin_chalic/.atom/packages/latex/lib/composer.js
