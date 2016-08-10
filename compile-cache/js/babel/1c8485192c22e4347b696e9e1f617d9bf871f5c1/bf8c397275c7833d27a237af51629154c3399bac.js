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

      var ProgressIndicator = require("./status-bar/progress-indicator");
      this.indicator = new ProgressIndicator();
      this.statusBar.addRightTile({
        item: this.indicator.element,
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
        item: this.errorIndicator.element,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL2NvbXBvc2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztzQkFFZSxTQUFTOzs7O29CQUNQLE1BQU07Ozs7d0JBQ0QsWUFBWTs7QUFKbEMsV0FBVyxDQUFDOztJQU1TLFFBQVE7V0FBUixRQUFROzBCQUFSLFFBQVE7OztlQUFSLFFBQVE7O1dBQ3BCLG1CQUFHO0FBQ1IsVUFBSSxDQUFDLHdCQUF3QixFQUFFLENBQUM7QUFDaEMsVUFBSSxDQUFDLHFCQUFxQixFQUFFLENBQUM7S0FDOUI7Ozs2QkFFVSxhQUFHOzs7OEJBQ2UsSUFBSSxDQUFDLGdCQUFnQixFQUFFOztVQUEzQyxNQUFNLHFCQUFOLE1BQU07VUFBRSxRQUFRLHFCQUFSLFFBQVE7O0FBRXZCLFVBQUksQ0FBQyxRQUFRLEVBQUU7QUFDYixhQUFLLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQywyREFBMkQsQ0FBQyxDQUFDO0FBQy9FLGVBQU8sT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztPQUM5Qjs7QUFFRCxVQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsRUFBRTtBQUM3QixhQUFLLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxjQWpCaEIsT0FBTyw2RUFrQmtCLGtCQUFLLE9BQU8sQ0FBQyxRQUFRLENBQUMsU0FBSyxDQUFDLENBQUM7QUFDeEQsZUFBTyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO09BQzlCOztBQUVELFVBQUksTUFBTSxDQUFDLFVBQVUsRUFBRSxFQUFFO0FBQ3ZCLGNBQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztPQUNmOztBQUVELFVBQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxVQUFVLEVBQUUsQ0FBQztBQUNuQyxVQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUMsUUFBUSxDQUFDLENBQUM7O0FBRXhE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LFlBQUE7VUFBRSxVQUFVLFlBQUEsQ0FBQztBQUN6QixVQUFJLE1BQU0sRUFBRTtBQUNWLGdCQUFRLEdBQUcsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQzVCLGtCQUFVLEdBQUcsTUFBTSxDQUFDLHVCQUF1QixFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQztPQUN2RDs7QUFFRCxhQUFPO0FBQ0wsY0FBTSxFQUFFLE1BQU07QUFDZCxnQkFBUSxFQUFFLFFBQVE7QUFDbEIsa0JBQVUsRUFBRSxVQUFVO09BQ3ZCLENBQUM7S0FDSDs7O1dBRWMseUJBQUMsVUFBVSxFQUFFLFlBQVksRUFBRTtBQUN4QyxVQUFNLFNBQVMsR0FBRyxrQkFBSyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDM0MsYUFBTyxrQkFBSyxJQUFJLENBQUMsU0FBUyxFQUFFLGtCQUFLLFFBQVEsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO0tBQzFEOzs7V0FFZSw0QkFBRztBQUNqQixVQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDO0FBQ3hFLFVBQU0sZUFBZSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLHVCQUF1QixDQUFDLENBQUM7QUFDakUsYUFBTyxVQUFVLElBQUksZUFBZSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7S0FDakQ7OztXQUVlLDRCQUFHO0FBQUUsYUFBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO0tBQUU7OztTQWxQekQsUUFBUTs7O3FCQUFSLFFBQVEiLCJmaWxlIjoiL2hvbWUvY2luX2NoYWxpYy8uYXRvbS9wYWNrYWdlcy9sYXRleC9saWIvY29tcG9zZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBiYWJlbFwiO1xuXG5pbXBvcnQgZnMgZnJvbSBcImZzLXBsdXNcIjtcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQge2hlcmVkb2N9IGZyb20gXCIuL3dlcmt6ZXVnXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbXBvc2VyIHtcbiAgZGVzdHJveSgpIHtcbiAgICB0aGlzLmRlc3Ryb3lQcm9ncmVzc0luZGljYXRvcigpO1xuICAgIHRoaXMuZGVzdHJveUVycm9ySW5kaWNhdG9yKCk7XG4gIH1cblxuICBhc3luYyBidWlsZCgpIHtcbiAgICBjb25zdCB7ZWRpdG9yLCBmaWxlUGF0aH0gPSB0aGlzLmdldEVkaXRvckRldGFpbHMoKTtcblxuICAgIGlmICghZmlsZVBhdGgpIHtcbiAgICAgIGxhdGV4LmxvZy53YXJuaW5nKFwiRmlsZSBuZWVkcyB0byBiZSBzYXZlZCB0byBkaXNrIGJlZm9yZSBpdCBjYW4gYmUgVGVYaWZpZWQuXCIpO1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KGZhbHNlKTtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuaXNUZXhGaWxlKGZpbGVQYXRoKSkge1xuICAgICAgbGF0ZXgubG9nLndhcm5pbmcoaGVyZWRvYyhgRmlsZSBkb2VzIG5vdCBzZWVtIHRvIGJlIGEgVGVYIGZpbGU7XG4gICAgICAgIHVuc3VwcG9ydGVkIGV4dGVuc2lvbiBcIiR7cGF0aC5leHRuYW1lKGZpbGVQYXRoKX1cIi5gKSk7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoZmFsc2UpO1xuICAgIH1cblxuICAgIGlmIChlZGl0b3IuaXNNb2RpZmllZCgpKSB7XG4gICAgICBlZGl0b3Iuc2F2ZSgpOyAvLyBUT0RPOiBNYWtlIHRoaXMgY29uZmlndXJhYmxlP1xuICAgIH1cblxuICAgIGNvbnN0IGJ1aWxkZXIgPSBsYXRleC5nZXRCdWlsZGVyKCk7XG4gICAgY29uc3Qgcm9vdEZpbGVQYXRoID0gdGhpcy5yZXNvbHZlUm9vdEZpbGVQYXRoKGZpbGVQYXRoKTtcblxuICAgIHRoaXMuZGVzdHJveUVycm9ySW5kaWNhdG9yKCk7XG4gICAgdGhpcy5zaG93UHJvZ3Jlc3NJbmRpY2F0b3IoKTtcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBsZXQgc3RhdHVzQ29kZSwgcmVzdWx0O1xuXG4gICAgICBjb25zdCBzaG93QnVpbGRFcnJvciA9ICgpID0+IHtcbiAgICAgICAgdGhpcy5zaG93RXJyb3Ioc3RhdHVzQ29kZSwgcmVzdWx0LCBidWlsZGVyKTtcbiAgICAgICAgcmVqZWN0KHN0YXR1c0NvZGUpO1xuICAgICAgfTtcblxuICAgICAgdHJ5IHtcbiAgICAgICAgc3RhdHVzQ29kZSA9IGF3YWl0IGJ1aWxkZXIucnVuKHJvb3RGaWxlUGF0aCk7XG4gICAgICAgIHJlc3VsdCA9IGJ1aWxkZXIucGFyc2VMb2dGaWxlKHJvb3RGaWxlUGF0aCk7XG4gICAgICAgIGlmIChzdGF0dXNDb2RlID4gMCB8fCAhcmVzdWx0IHx8ICFyZXN1bHQub3V0cHV0RmlsZVBhdGgpIHtcbiAgICAgICAgICBzaG93QnVpbGRFcnJvcihzdGF0dXNDb2RlLCByZXN1bHQsIGJ1aWxkZXIpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLnNob3VsZE1vdmVSZXN1bHQoKSkge1xuICAgICAgICAgIHRoaXMubW92ZVJlc3VsdChyZXN1bHQsIHJvb3RGaWxlUGF0aCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNob3dSZXN1bHQocmVzdWx0KTtcbiAgICAgICAgcmVzb2x2ZShzdGF0dXNDb2RlKTtcbiAgICAgIH1cbiAgICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yLm1lc3NhZ2UpO1xuICAgICAgICByZWplY3QoZXJyb3IubWVzc2FnZSk7XG4gICAgICB9XG4gICAgICBmaW5hbGx5IHtcbiAgICAgICAgdGhpcy5kZXN0cm95UHJvZ3Jlc3NJbmRpY2F0b3IoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHN5bmMoKSB7XG4gICAgY29uc3Qge2ZpbGVQYXRoLCBsaW5lTnVtYmVyfSA9IHRoaXMuZ2V0RWRpdG9yRGV0YWlscygpO1xuICAgIGlmICghZmlsZVBhdGggfHwgIXRoaXMuaXNUZXhGaWxlKGZpbGVQYXRoKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IG91dHB1dEZpbGVQYXRoID0gdGhpcy5yZXNvbHZlT3V0cHV0RmlsZVBhdGgoZmlsZVBhdGgpO1xuICAgIGlmICghb3V0cHV0RmlsZVBhdGgpIHtcbiAgICAgIGxhdGV4LmxvZy53YXJuaW5nKFwiQ291bGQgbm90IHJlc29sdmUgcGF0aCB0byBvdXRwdXQgZmlsZSBhc3NvY2lhdGVkIHdpdGggdGhlIGN1cnJlbnQgZmlsZS5cIik7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qgb3BlbmVyID0gbGF0ZXguZ2V0T3BlbmVyKCk7XG4gICAgaWYgKG9wZW5lcikge1xuICAgICAgb3BlbmVyLm9wZW4ob3V0cHV0RmlsZVBhdGgsIGZpbGVQYXRoLCBsaW5lTnVtYmVyKTtcbiAgICB9XG4gIH1cblxuICAvLyBOT1RFOiBEb2VzIG5vdCBzdXBwb3J0IGBsYXRleC5vdXRwdXREaXJlY3RvcnlgIHNldHRpbmchXG4gIGFzeW5jIGNsZWFuKCkge1xuICAgIGNvbnN0IHtmaWxlUGF0aH0gPSB0aGlzLmdldEVkaXRvckRldGFpbHMoKTtcbiAgICBpZiAoIWZpbGVQYXRoIHx8ICF0aGlzLmlzVGV4RmlsZShmaWxlUGF0aCkpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdCgpO1xuICAgIH1cblxuICAgIGNvbnN0IHJvb3RGaWxlUGF0aCA9IHRoaXMucmVzb2x2ZVJvb3RGaWxlUGF0aChmaWxlUGF0aCk7XG4gICAgY29uc3Qgcm9vdFBhdGggPSBwYXRoLmRpcm5hbWUocm9vdEZpbGVQYXRoKTtcbiAgICBsZXQgcm9vdEZpbGUgPSBwYXRoLmJhc2VuYW1lKHJvb3RGaWxlUGF0aCk7XG4gICAgcm9vdEZpbGUgPSByb290RmlsZS5zdWJzdHJpbmcoMCwgcm9vdEZpbGUubGFzdEluZGV4T2YoXCIuXCIpKTtcblxuICAgIGNvbnN0IGNsZWFuRXh0ZW5zaW9ucyA9IGF0b20uY29uZmlnLmdldChcImxhdGV4LmNsZWFuRXh0ZW5zaW9uc1wiKTtcbiAgICByZXR1cm4gYXdhaXQqIGNsZWFuRXh0ZW5zaW9ucy5tYXAoYXN5bmMgKGV4dGVuc2lvbikgPT4ge1xuICAgICAgY29uc3QgY2FuZGlkYXRlUGF0aCA9IHBhdGguam9pbihyb290UGF0aCwgcm9vdEZpbGUgKyBleHRlbnNpb24pO1xuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChyZXNvbHZlKSA9PiB7XG4gICAgICAgIGZzLnJlbW92ZShjYW5kaWRhdGVQYXRoLCAoZXJyb3IpID0+IHtcbiAgICAgICAgICByZXNvbHZlKHtmaWxlUGF0aDogY2FuZGlkYXRlUGF0aCwgZXJyb3I6IGVycm9yfSk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBzZXRTdGF0dXNCYXIoc3RhdHVzQmFyKSB7XG4gICAgdGhpcy5zdGF0dXNCYXIgPSBzdGF0dXNCYXI7XG4gIH1cblxuICBtb3ZlUmVzdWx0KHJlc3VsdCwgZmlsZVBhdGgpIHtcbiAgICBjb25zdCBvcmlnaW5hbE91dHB1dEZpbGVQYXRoID0gcmVzdWx0Lm91dHB1dEZpbGVQYXRoO1xuICAgIHJlc3VsdC5vdXRwdXRGaWxlUGF0aCA9IHRoaXMuYWx0ZXJQYXJlbnRQYXRoKGZpbGVQYXRoLCBvcmlnaW5hbE91dHB1dEZpbGVQYXRoKTtcbiAgICBpZiAoZnMuZXhpc3RzU3luYyhvcmlnaW5hbE91dHB1dEZpbGVQYXRoKSkge1xuICAgICAgZnMucmVtb3ZlU3luYyhyZXN1bHQub3V0cHV0RmlsZVBhdGgpO1xuICAgICAgZnMubW92ZVN5bmMob3JpZ2luYWxPdXRwdXRGaWxlUGF0aCwgcmVzdWx0Lm91dHB1dEZpbGVQYXRoKTtcbiAgICB9XG5cbiAgICBjb25zdCBvcmlnaW5hbFN5bmNGaWxlUGF0aCA9IG9yaWdpbmFsT3V0cHV0RmlsZVBhdGgucmVwbGFjZSgvXFwucGRmJC8sIFwiLnN5bmN0ZXguZ3pcIik7XG4gICAgaWYgKGZzLmV4aXN0c1N5bmMob3JpZ2luYWxTeW5jRmlsZVBhdGgpKSB7XG4gICAgICBjb25zdCBzeW5jRmlsZVBhdGggPSB0aGlzLmFsdGVyUGFyZW50UGF0aChmaWxlUGF0aCwgb3JpZ2luYWxTeW5jRmlsZVBhdGgpO1xuICAgICAgZnMucmVtb3ZlU3luYyhzeW5jRmlsZVBhdGgpO1xuICAgICAgZnMubW92ZVN5bmMob3JpZ2luYWxTeW5jRmlsZVBhdGgsIHN5bmNGaWxlUGF0aCk7XG4gICAgfVxuICB9XG5cbiAgcmVzb2x2ZVJvb3RGaWxlUGF0aChmaWxlUGF0aCkge1xuICAgIGNvbnN0IE1hc3RlclRleEZpbmRlciA9IHJlcXVpcmUoXCIuL21hc3Rlci10ZXgtZmluZGVyXCIpO1xuICAgIGNvbnN0IGZpbmRlciA9IG5ldyBNYXN0ZXJUZXhGaW5kZXIoZmlsZVBhdGgpO1xuICAgIHJldHVybiBmaW5kZXIuZ2V0TWFzdGVyVGV4UGF0aCgpO1xuICB9XG5cbiAgcmVzb2x2ZU91dHB1dEZpbGVQYXRoKGZpbGVQYXRoKSB7XG4gICAgbGV0IG91dHB1dEZpbGVQYXRoLCByb290RmlsZVBhdGg7XG5cbiAgICBpZiAodGhpcy5vdXRwdXRMb29rdXApIHtcbiAgICAgIG91dHB1dEZpbGVQYXRoID0gdGhpcy5vdXRwdXRMb29rdXBbZmlsZVBhdGhdO1xuICAgIH1cblxuICAgIGlmICghb3V0cHV0RmlsZVBhdGgpIHtcbiAgICAgIHJvb3RGaWxlUGF0aCA9IHRoaXMucmVzb2x2ZVJvb3RGaWxlUGF0aChmaWxlUGF0aCk7XG5cbiAgICAgIGNvbnN0IGJ1aWxkZXIgPSBsYXRleC5nZXRCdWlsZGVyKCk7XG4gICAgICBjb25zdCByZXN1bHQgPSBidWlsZGVyLnBhcnNlTG9nRmlsZShyb290RmlsZVBhdGgpO1xuICAgICAgaWYgKCFyZXN1bHQgfHwgIXJlc3VsdC5vdXRwdXRGaWxlUGF0aCkge1xuICAgICAgICBsYXRleC5sb2cud2FybmluZyhcIkxvZyBmaWxlIHBhcnNpbmcgZmFpbGVkIVwiKTtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG5cbiAgICAgIHRoaXMub3V0cHV0TG9va3VwID0gdGhpcy5vdXRwdXRMb29rdXAgfHwge307XG4gICAgICB0aGlzLm91dHB1dExvb2t1cFtmaWxlUGF0aF0gPSByZXN1bHQub3V0cHV0RmlsZVBhdGg7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuc2hvdWxkTW92ZVJlc3VsdCgpKSB7XG4gICAgICBvdXRwdXRGaWxlUGF0aCA9IHRoaXMuYWx0ZXJQYXJlbnRQYXRoKHJvb3RGaWxlUGF0aCwgb3V0cHV0RmlsZVBhdGgpO1xuICAgIH1cblxuICAgIHJldHVybiBvdXRwdXRGaWxlUGF0aDtcbiAgfVxuXG4gIHNob3dSZXN1bHQocmVzdWx0KSB7XG4gICAgaWYgKCF0aGlzLnNob3VsZE9wZW5SZXN1bHQoKSkgeyByZXR1cm47IH1cblxuICAgIGNvbnN0IG9wZW5lciA9IGxhdGV4LmdldE9wZW5lcigpO1xuICAgIGlmIChvcGVuZXIpIHtcbiAgICAgIGNvbnN0IHtmaWxlUGF0aCwgbGluZU51bWJlcn0gPSB0aGlzLmdldEVkaXRvckRldGFpbHMoKTtcbiAgICAgIG9wZW5lci5vcGVuKHJlc3VsdC5vdXRwdXRGaWxlUGF0aCwgZmlsZVBhdGgsIGxpbmVOdW1iZXIpO1xuICAgIH1cbiAgfVxuXG4gIHNob3dFcnJvcihzdGF0dXNDb2RlLCByZXN1bHQsIGJ1aWxkZXIpIHtcbiAgICB0aGlzLnNob3dFcnJvckluZGljYXRvcihyZXN1bHQpO1xuICAgIGxhdGV4LmxvZy5lcnJvcihzdGF0dXNDb2RlLCByZXN1bHQsIGJ1aWxkZXIpO1xuICB9XG5cbiAgc2hvd1Byb2dyZXNzSW5kaWNhdG9yKCkge1xuICAgIGlmICghdGhpcy5zdGF0dXNCYXIpIHsgcmV0dXJuIG51bGw7IH1cbiAgICBpZiAodGhpcy5pbmRpY2F0b3IpIHsgcmV0dXJuIHRoaXMuaW5kaWNhdG9yOyB9XG5cbiAgICBjb25zdCBQcm9ncmVzc0luZGljYXRvciA9IHJlcXVpcmUoXCIuL3N0YXR1cy1iYXIvcHJvZ3Jlc3MtaW5kaWNhdG9yXCIpO1xuICAgIHRoaXMuaW5kaWNhdG9yID0gbmV3IFByb2dyZXNzSW5kaWNhdG9yKCk7XG4gICAgdGhpcy5zdGF0dXNCYXIuYWRkUmlnaHRUaWxlKHtcbiAgICAgIGl0ZW06IHRoaXMuaW5kaWNhdG9yLmVsZW1lbnQsXG4gICAgICBwcmlvcml0eTogOTAwMSxcbiAgICB9KTtcbiAgfVxuXG4gIHNob3dFcnJvckluZGljYXRvcihyZXN1bHQpIHtcbiAgICBpZiAoIXRoaXMuc3RhdHVzQmFyKSB7IHJldHVybiBudWxsOyB9XG4gICAgaWYgKHRoaXMuZXJyb3JJbmRpY2F0b3IpIHsgcmV0dXJuIHRoaXMuZXJyb3JJbmRpY2F0b3I7IH1cblxuICAgIGNvbnN0IEVycm9ySW5kaWNhdG9yID0gcmVxdWlyZShcIi4vc3RhdHVzLWJhci9lcnJvci1pbmRpY2F0b3JcIik7XG4gICAgdGhpcy5lcnJvckluZGljYXRvciA9IG5ldyBFcnJvckluZGljYXRvcihyZXN1bHQpO1xuICAgIHRoaXMuc3RhdHVzQmFyLmFkZFJpZ2h0VGlsZSh7XG4gICAgICBpdGVtOiB0aGlzLmVycm9ySW5kaWNhdG9yLmVsZW1lbnQsXG4gICAgICBwcmlvcml0eTogOTAwMSxcbiAgICB9KTtcbiAgfVxuXG4gIGRlc3Ryb3lQcm9ncmVzc0luZGljYXRvcigpIHtcbiAgICBpZiAodGhpcy5pbmRpY2F0b3IpIHtcbiAgICAgIHRoaXMuaW5kaWNhdG9yLmVsZW1lbnQucmVtb3ZlKCk7XG4gICAgICB0aGlzLmluZGljYXRvciA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgZGVzdHJveUVycm9ySW5kaWNhdG9yKCkge1xuICAgIGlmICh0aGlzLmVycm9ySW5kaWNhdG9yKSB7XG4gICAgICB0aGlzLmVycm9ySW5kaWNhdG9yLmVsZW1lbnQucmVtb3ZlKCk7XG4gICAgICB0aGlzLmVycm9ySW5kaWNhdG9yID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICBpc1RleEZpbGUoZmlsZVBhdGgpIHtcbiAgICAvLyBUT0RPOiBJbXByb3ZlOyB3aWxsIHN1ZmZpY2UgZm9yIHRoZSB0aW1lIGJlaW5nLlxuICAgIHJldHVybiAhZmlsZVBhdGggfHwgZmlsZVBhdGguc2VhcmNoKC9cXC4odGV4fGxocykkLykgPiAwO1xuICB9XG5cbiAgZ2V0RWRpdG9yRGV0YWlscygpIHtcbiAgICBjb25zdCBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCk7XG4gICAgbGV0IGZpbGVQYXRoLCBsaW5lTnVtYmVyO1xuICAgIGlmIChlZGl0b3IpIHtcbiAgICAgIGZpbGVQYXRoID0gZWRpdG9yLmdldFBhdGgoKTtcbiAgICAgIGxpbmVOdW1iZXIgPSBlZGl0b3IuZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oKS5yb3cgKyAxO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBlZGl0b3I6IGVkaXRvcixcbiAgICAgIGZpbGVQYXRoOiBmaWxlUGF0aCxcbiAgICAgIGxpbmVOdW1iZXI6IGxpbmVOdW1iZXIsXG4gICAgfTtcbiAgfVxuXG4gIGFsdGVyUGFyZW50UGF0aCh0YXJnZXRQYXRoLCBvcmlnaW5hbFBhdGgpIHtcbiAgICBjb25zdCB0YXJnZXREaXIgPSBwYXRoLmRpcm5hbWUodGFyZ2V0UGF0aCk7XG4gICAgcmV0dXJuIHBhdGguam9pbih0YXJnZXREaXIsIHBhdGguYmFzZW5hbWUob3JpZ2luYWxQYXRoKSk7XG4gIH1cblxuICBzaG91bGRNb3ZlUmVzdWx0KCkge1xuICAgIGNvbnN0IG1vdmVSZXN1bHQgPSBhdG9tLmNvbmZpZy5nZXQoXCJsYXRleC5tb3ZlUmVzdWx0VG9Tb3VyY2VEaXJlY3RvcnlcIik7XG4gICAgY29uc3Qgb3V0cHV0RGlyZWN0b3J5ID0gYXRvbS5jb25maWcuZ2V0KFwibGF0ZXgub3V0cHV0RGlyZWN0b3J5XCIpO1xuICAgIHJldHVybiBtb3ZlUmVzdWx0ICYmIG91dHB1dERpcmVjdG9yeS5sZW5ndGggPiAwO1xuICB9XG5cbiAgc2hvdWxkT3BlblJlc3VsdCgpIHsgcmV0dXJuIGF0b20uY29uZmlnLmdldChcImxhdGV4Lm9wZW5SZXN1bHRBZnRlckJ1aWxkXCIpOyB9XG59XG4iXX0=