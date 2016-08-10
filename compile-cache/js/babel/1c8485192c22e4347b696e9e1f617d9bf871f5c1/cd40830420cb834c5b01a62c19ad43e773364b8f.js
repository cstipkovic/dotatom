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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL2NvbXBvc2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztzQkFFZSxTQUFTOzs7O29CQUNQLE1BQU07Ozs7d0JBQ0QsWUFBWTs7QUFKbEMsV0FBVyxDQUFDOztJQU1TLFFBQVE7V0FBUixRQUFROzBCQUFSLFFBQVE7OztlQUFSLFFBQVE7O1dBQ3BCLG1CQUFHO0FBQ1IsVUFBSSxDQUFDLHdCQUF3QixFQUFFLENBQUM7QUFDaEMsVUFBSSxDQUFDLHFCQUFxQixFQUFFLENBQUM7S0FDOUI7Ozs2QkFFVSxhQUFHOzs7OEJBQ2UsSUFBSSxDQUFDLGdCQUFnQixFQUFFOztVQUEzQyxNQUFNLHFCQUFOLE1BQU07VUFBRSxRQUFRLHFCQUFSLFFBQVE7O0FBRXZCLFVBQUksQ0FBQyxRQUFRLEVBQUU7QUFDYixhQUFLLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQywyREFBMkQsQ0FBQyxDQUFDO0FBQy9FLGVBQU8sT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztPQUM5Qjs7QUFFRCxVQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsRUFBRTtBQUM3QixhQUFLLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxjQWpCaEIsT0FBTyw2RUFrQmtCLGtCQUFLLE9BQU8sQ0FBQyxRQUFRLENBQUMsU0FBSyxDQUFDLENBQUM7QUFDeEQsZUFBTyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO09BQzlCOztBQUVELFVBQUksTUFBTSxDQUFDLFVBQVUsRUFBRSxFQUFFO0FBQ3ZCLGNBQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztPQUNmOztBQUVELFVBQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxVQUFVLEVBQUUsQ0FBQztBQUNuQyxVQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUMsUUFBUSxDQUFDLENBQUM7O0FBRXhE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LENBQUM7QUFDekIsVUFBSSxNQUFNLEVBQUU7QUFDVixnQkFBUSxHQUFHLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUM1QixrQkFBVSxHQUFHLE1BQU0sQ0FBQyx1QkFBdUIsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUM7T0FDdkQ7O0FBRUQsYUFBTztBQUNMLGNBQU0sRUFBRSxNQUFNO0FBQ2QsZ0JBQVEsRUFBRSxRQUFRO0FBQ2xCLGtCQUFVLEVBQUUsVUFBVTtPQUN2QixDQUFDO0tBQ0g7OztXQUVjLHlCQUFDLFVBQVUsRUFBRSxZQUFZLEVBQUU7QUFDeEMsVUFBTSxTQUFTLEdBQUcsa0JBQUssT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQzNDLGFBQU8sa0JBQUssSUFBSSxDQUFDLFNBQVMsRUFBRSxrQkFBSyxRQUFRLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztLQUMxRDs7O1dBRWUsNEJBQUc7QUFDakIsVUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsbUNBQW1DLENBQUMsQ0FBQztBQUN4RSxVQUFNLGVBQWUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO0FBQ2pFLGFBQU8sVUFBVSxJQUFJLGVBQWUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0tBQ2pEOzs7V0FFZSw0QkFBRztBQUFFLGFBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsNEJBQTRCLENBQUMsQ0FBQztLQUFFOzs7U0FsUHpELFFBQVE7OztxQkFBUixRQUFRIiwiZmlsZSI6Ii9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL2NvbXBvc2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2UgYmFiZWxcIjtcblxuaW1wb3J0IGZzIGZyb20gXCJmcy1wbHVzXCI7XG5pbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IHtoZXJlZG9jfSBmcm9tIFwiLi93ZXJremV1Z1wiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb21wb3NlciB7XG4gIGRlc3Ryb3koKSB7XG4gICAgdGhpcy5kZXN0cm95UHJvZ3Jlc3NJbmRpY2F0b3IoKTtcbiAgICB0aGlzLmRlc3Ryb3lFcnJvckluZGljYXRvcigpO1xuICB9XG5cbiAgYXN5bmMgYnVpbGQoKSB7XG4gICAgY29uc3Qge2VkaXRvciwgZmlsZVBhdGh9ID0gdGhpcy5nZXRFZGl0b3JEZXRhaWxzKCk7XG5cbiAgICBpZiAoIWZpbGVQYXRoKSB7XG4gICAgICBsYXRleC5sb2cud2FybmluZyhcIkZpbGUgbmVlZHMgdG8gYmUgc2F2ZWQgdG8gZGlzayBiZWZvcmUgaXQgY2FuIGJlIFRlWGlmaWVkLlwiKTtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChmYWxzZSk7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLmlzVGV4RmlsZShmaWxlUGF0aCkpIHtcbiAgICAgIGxhdGV4LmxvZy53YXJuaW5nKGhlcmVkb2MoYEZpbGUgZG9lcyBub3Qgc2VlbSB0byBiZSBhIFRlWCBmaWxlO1xuICAgICAgICB1bnN1cHBvcnRlZCBleHRlbnNpb24gXCIke3BhdGguZXh0bmFtZShmaWxlUGF0aCl9XCIuYCkpO1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KGZhbHNlKTtcbiAgICB9XG5cbiAgICBpZiAoZWRpdG9yLmlzTW9kaWZpZWQoKSkge1xuICAgICAgZWRpdG9yLnNhdmUoKTsgLy8gVE9ETzogTWFrZSB0aGlzIGNvbmZpZ3VyYWJsZT9cbiAgICB9XG5cbiAgICBjb25zdCBidWlsZGVyID0gbGF0ZXguZ2V0QnVpbGRlcigpO1xuICAgIGNvbnN0IHJvb3RGaWxlUGF0aCA9IHRoaXMucmVzb2x2ZVJvb3RGaWxlUGF0aChmaWxlUGF0aCk7XG5cbiAgICB0aGlzLmRlc3Ryb3lFcnJvckluZGljYXRvcigpO1xuICAgIHRoaXMuc2hvd1Byb2dyZXNzSW5kaWNhdG9yKCk7XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgbGV0IHN0YXR1c0NvZGUsIHJlc3VsdDtcblxuICAgICAgY29uc3Qgc2hvd0J1aWxkRXJyb3IgPSAoKSA9PiB7XG4gICAgICAgIHRoaXMuc2hvd0Vycm9yKHN0YXR1c0NvZGUsIHJlc3VsdCwgYnVpbGRlcik7XG4gICAgICAgIHJlamVjdChzdGF0dXNDb2RlKTtcbiAgICAgIH07XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIHN0YXR1c0NvZGUgPSBhd2FpdCBidWlsZGVyLnJ1bihyb290RmlsZVBhdGgpO1xuICAgICAgICByZXN1bHQgPSBidWlsZGVyLnBhcnNlTG9nRmlsZShyb290RmlsZVBhdGgpO1xuICAgICAgICBpZiAoc3RhdHVzQ29kZSA+IDAgfHwgIXJlc3VsdCB8fCAhcmVzdWx0Lm91dHB1dEZpbGVQYXRoKSB7XG4gICAgICAgICAgc2hvd0J1aWxkRXJyb3Ioc3RhdHVzQ29kZSwgcmVzdWx0LCBidWlsZGVyKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5zaG91bGRNb3ZlUmVzdWx0KCkpIHtcbiAgICAgICAgICB0aGlzLm1vdmVSZXN1bHQocmVzdWx0LCByb290RmlsZVBhdGgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zaG93UmVzdWx0KHJlc3VsdCk7XG4gICAgICAgIHJlc29sdmUoc3RhdHVzQ29kZSk7XG4gICAgICB9XG4gICAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihlcnJvci5tZXNzYWdlKTtcbiAgICAgICAgcmVqZWN0KGVycm9yLm1lc3NhZ2UpO1xuICAgICAgfVxuICAgICAgZmluYWxseSB7XG4gICAgICAgIHRoaXMuZGVzdHJveVByb2dyZXNzSW5kaWNhdG9yKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBzeW5jKCkge1xuICAgIGNvbnN0IHtmaWxlUGF0aCwgbGluZU51bWJlcn0gPSB0aGlzLmdldEVkaXRvckRldGFpbHMoKTtcbiAgICBpZiAoIWZpbGVQYXRoIHx8ICF0aGlzLmlzVGV4RmlsZShmaWxlUGF0aCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBvdXRwdXRGaWxlUGF0aCA9IHRoaXMucmVzb2x2ZU91dHB1dEZpbGVQYXRoKGZpbGVQYXRoKTtcbiAgICBpZiAoIW91dHB1dEZpbGVQYXRoKSB7XG4gICAgICBsYXRleC5sb2cud2FybmluZyhcIkNvdWxkIG5vdCByZXNvbHZlIHBhdGggdG8gb3V0cHV0IGZpbGUgYXNzb2NpYXRlZCB3aXRoIHRoZSBjdXJyZW50IGZpbGUuXCIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IG9wZW5lciA9IGxhdGV4LmdldE9wZW5lcigpO1xuICAgIGlmIChvcGVuZXIpIHtcbiAgICAgIG9wZW5lci5vcGVuKG91dHB1dEZpbGVQYXRoLCBmaWxlUGF0aCwgbGluZU51bWJlcik7XG4gICAgfVxuICB9XG5cbiAgLy8gTk9URTogRG9lcyBub3Qgc3VwcG9ydCBgbGF0ZXgub3V0cHV0RGlyZWN0b3J5YCBzZXR0aW5nIVxuICBhc3luYyBjbGVhbigpIHtcbiAgICBjb25zdCB7ZmlsZVBhdGh9ID0gdGhpcy5nZXRFZGl0b3JEZXRhaWxzKCk7XG4gICAgaWYgKCFmaWxlUGF0aCB8fCAhdGhpcy5pc1RleEZpbGUoZmlsZVBhdGgpKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoKTtcbiAgICB9XG5cbiAgICBjb25zdCByb290RmlsZVBhdGggPSB0aGlzLnJlc29sdmVSb290RmlsZVBhdGgoZmlsZVBhdGgpO1xuICAgIGNvbnN0IHJvb3RQYXRoID0gcGF0aC5kaXJuYW1lKHJvb3RGaWxlUGF0aCk7XG4gICAgbGV0IHJvb3RGaWxlID0gcGF0aC5iYXNlbmFtZShyb290RmlsZVBhdGgpO1xuICAgIHJvb3RGaWxlID0gcm9vdEZpbGUuc3Vic3RyaW5nKDAsIHJvb3RGaWxlLmxhc3RJbmRleE9mKFwiLlwiKSk7XG5cbiAgICBjb25zdCBjbGVhbkV4dGVuc2lvbnMgPSBhdG9tLmNvbmZpZy5nZXQoXCJsYXRleC5jbGVhbkV4dGVuc2lvbnNcIik7XG4gICAgcmV0dXJuIGF3YWl0KiBjbGVhbkV4dGVuc2lvbnMubWFwKGFzeW5jIChleHRlbnNpb24pID0+IHtcbiAgICAgIGNvbnN0IGNhbmRpZGF0ZVBhdGggPSBwYXRoLmpvaW4ocm9vdFBhdGgsIHJvb3RGaWxlICsgZXh0ZW5zaW9uKTtcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAocmVzb2x2ZSkgPT4ge1xuICAgICAgICBmcy5yZW1vdmUoY2FuZGlkYXRlUGF0aCwgKGVycm9yKSA9PiB7XG4gICAgICAgICAgcmVzb2x2ZSh7ZmlsZVBhdGg6IGNhbmRpZGF0ZVBhdGgsIGVycm9yOiBlcnJvcn0pO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgc2V0U3RhdHVzQmFyKHN0YXR1c0Jhcikge1xuICAgIHRoaXMuc3RhdHVzQmFyID0gc3RhdHVzQmFyO1xuICB9XG5cbiAgbW92ZVJlc3VsdChyZXN1bHQsIGZpbGVQYXRoKSB7XG4gICAgY29uc3Qgb3JpZ2luYWxPdXRwdXRGaWxlUGF0aCA9IHJlc3VsdC5vdXRwdXRGaWxlUGF0aDtcbiAgICByZXN1bHQub3V0cHV0RmlsZVBhdGggPSB0aGlzLmFsdGVyUGFyZW50UGF0aChmaWxlUGF0aCwgb3JpZ2luYWxPdXRwdXRGaWxlUGF0aCk7XG4gICAgaWYgKGZzLmV4aXN0c1N5bmMob3JpZ2luYWxPdXRwdXRGaWxlUGF0aCkpIHtcbiAgICAgIGZzLnJlbW92ZVN5bmMocmVzdWx0Lm91dHB1dEZpbGVQYXRoKTtcbiAgICAgIGZzLm1vdmVTeW5jKG9yaWdpbmFsT3V0cHV0RmlsZVBhdGgsIHJlc3VsdC5vdXRwdXRGaWxlUGF0aCk7XG4gICAgfVxuXG4gICAgY29uc3Qgb3JpZ2luYWxTeW5jRmlsZVBhdGggPSBvcmlnaW5hbE91dHB1dEZpbGVQYXRoLnJlcGxhY2UoL1xcLnBkZiQvLCBcIi5zeW5jdGV4Lmd6XCIpO1xuICAgIGlmIChmcy5leGlzdHNTeW5jKG9yaWdpbmFsU3luY0ZpbGVQYXRoKSkge1xuICAgICAgY29uc3Qgc3luY0ZpbGVQYXRoID0gdGhpcy5hbHRlclBhcmVudFBhdGgoZmlsZVBhdGgsIG9yaWdpbmFsU3luY0ZpbGVQYXRoKTtcbiAgICAgIGZzLnJlbW92ZVN5bmMoc3luY0ZpbGVQYXRoKTtcbiAgICAgIGZzLm1vdmVTeW5jKG9yaWdpbmFsU3luY0ZpbGVQYXRoLCBzeW5jRmlsZVBhdGgpO1xuICAgIH1cbiAgfVxuXG4gIHJlc29sdmVSb290RmlsZVBhdGgoZmlsZVBhdGgpIHtcbiAgICBjb25zdCBNYXN0ZXJUZXhGaW5kZXIgPSByZXF1aXJlKFwiLi9tYXN0ZXItdGV4LWZpbmRlclwiKTtcbiAgICBjb25zdCBmaW5kZXIgPSBuZXcgTWFzdGVyVGV4RmluZGVyKGZpbGVQYXRoKTtcbiAgICByZXR1cm4gZmluZGVyLmdldE1hc3RlclRleFBhdGgoKTtcbiAgfVxuXG4gIHJlc29sdmVPdXRwdXRGaWxlUGF0aChmaWxlUGF0aCkge1xuICAgIGxldCBvdXRwdXRGaWxlUGF0aCwgcm9vdEZpbGVQYXRoO1xuXG4gICAgaWYgKHRoaXMub3V0cHV0TG9va3VwKSB7XG4gICAgICBvdXRwdXRGaWxlUGF0aCA9IHRoaXMub3V0cHV0TG9va3VwW2ZpbGVQYXRoXTtcbiAgICB9XG5cbiAgICBpZiAoIW91dHB1dEZpbGVQYXRoKSB7XG4gICAgICByb290RmlsZVBhdGggPSB0aGlzLnJlc29sdmVSb290RmlsZVBhdGgoZmlsZVBhdGgpO1xuXG4gICAgICBjb25zdCBidWlsZGVyID0gbGF0ZXguZ2V0QnVpbGRlcigpO1xuICAgICAgY29uc3QgcmVzdWx0ID0gYnVpbGRlci5wYXJzZUxvZ0ZpbGUocm9vdEZpbGVQYXRoKTtcbiAgICAgIGlmICghcmVzdWx0IHx8ICFyZXN1bHQub3V0cHV0RmlsZVBhdGgpIHtcbiAgICAgICAgbGF0ZXgubG9nLndhcm5pbmcoXCJMb2cgZmlsZSBwYXJzaW5nIGZhaWxlZCFcIik7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuXG4gICAgICB0aGlzLm91dHB1dExvb2t1cCA9IHRoaXMub3V0cHV0TG9va3VwIHx8IHt9O1xuICAgICAgdGhpcy5vdXRwdXRMb29rdXBbZmlsZVBhdGhdID0gcmVzdWx0Lm91dHB1dEZpbGVQYXRoO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnNob3VsZE1vdmVSZXN1bHQoKSkge1xuICAgICAgb3V0cHV0RmlsZVBhdGggPSB0aGlzLmFsdGVyUGFyZW50UGF0aChyb290RmlsZVBhdGgsIG91dHB1dEZpbGVQYXRoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gb3V0cHV0RmlsZVBhdGg7XG4gIH1cblxuICBzaG93UmVzdWx0KHJlc3VsdCkge1xuICAgIGlmICghdGhpcy5zaG91bGRPcGVuUmVzdWx0KCkpIHsgcmV0dXJuOyB9XG5cbiAgICBjb25zdCBvcGVuZXIgPSBsYXRleC5nZXRPcGVuZXIoKTtcbiAgICBpZiAob3BlbmVyKSB7XG4gICAgICBjb25zdCB7ZmlsZVBhdGgsIGxpbmVOdW1iZXJ9ID0gdGhpcy5nZXRFZGl0b3JEZXRhaWxzKCk7XG4gICAgICBvcGVuZXIub3BlbihyZXN1bHQub3V0cHV0RmlsZVBhdGgsIGZpbGVQYXRoLCBsaW5lTnVtYmVyKTtcbiAgICB9XG4gIH1cblxuICBzaG93RXJyb3Ioc3RhdHVzQ29kZSwgcmVzdWx0LCBidWlsZGVyKSB7XG4gICAgdGhpcy5zaG93RXJyb3JJbmRpY2F0b3IocmVzdWx0KTtcbiAgICBsYXRleC5sb2cuZXJyb3Ioc3RhdHVzQ29kZSwgcmVzdWx0LCBidWlsZGVyKTtcbiAgfVxuXG4gIHNob3dQcm9ncmVzc0luZGljYXRvcigpIHtcbiAgICBpZiAoIXRoaXMuc3RhdHVzQmFyKSB7IHJldHVybiBudWxsOyB9XG4gICAgaWYgKHRoaXMuaW5kaWNhdG9yKSB7IHJldHVybiB0aGlzLmluZGljYXRvcjsgfVxuXG4gICAgY29uc3QgUHJvZ3Jlc3NJbmRpY2F0b3IgPSByZXF1aXJlKFwiLi9zdGF0dXMtYmFyL3Byb2dyZXNzLWluZGljYXRvclwiKTtcbiAgICB0aGlzLmluZGljYXRvciA9IG5ldyBQcm9ncmVzc0luZGljYXRvcigpO1xuICAgIHRoaXMuc3RhdHVzQmFyLmFkZFJpZ2h0VGlsZSh7XG4gICAgICBpdGVtOiB0aGlzLmluZGljYXRvcixcbiAgICAgIHByaW9yaXR5OiA5MDAxLFxuICAgIH0pO1xuICB9XG5cbiAgc2hvd0Vycm9ySW5kaWNhdG9yKHJlc3VsdCkge1xuICAgIGlmICghdGhpcy5zdGF0dXNCYXIpIHsgcmV0dXJuIG51bGw7IH1cbiAgICBpZiAodGhpcy5lcnJvckluZGljYXRvcikgeyByZXR1cm4gdGhpcy5lcnJvckluZGljYXRvcjsgfVxuXG4gICAgY29uc3QgRXJyb3JJbmRpY2F0b3IgPSByZXF1aXJlKFwiLi9zdGF0dXMtYmFyL2Vycm9yLWluZGljYXRvclwiKTtcbiAgICB0aGlzLmVycm9ySW5kaWNhdG9yID0gbmV3IEVycm9ySW5kaWNhdG9yKHJlc3VsdCk7XG4gICAgdGhpcy5zdGF0dXNCYXIuYWRkUmlnaHRUaWxlKHtcbiAgICAgIGl0ZW06IHRoaXMuZXJyb3JJbmRpY2F0b3IsXG4gICAgICBwcmlvcml0eTogOTAwMSxcbiAgICB9KTtcbiAgfVxuXG4gIGRlc3Ryb3lQcm9ncmVzc0luZGljYXRvcigpIHtcbiAgICBpZiAodGhpcy5pbmRpY2F0b3IpIHtcbiAgICAgIHRoaXMuaW5kaWNhdG9yLmVsZW1lbnQucmVtb3ZlKCk7XG4gICAgICB0aGlzLmluZGljYXRvciA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgZGVzdHJveUVycm9ySW5kaWNhdG9yKCkge1xuICAgIGlmICh0aGlzLmVycm9ySW5kaWNhdG9yKSB7XG4gICAgICB0aGlzLmVycm9ySW5kaWNhdG9yLmVsZW1lbnQucmVtb3ZlKCk7XG4gICAgICB0aGlzLmVycm9ySW5kaWNhdG9yID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICBpc1RleEZpbGUoZmlsZVBhdGgpIHtcbiAgICAvLyBUT0RPOiBJbXByb3ZlOyB3aWxsIHN1ZmZpY2UgZm9yIHRoZSB0aW1lIGJlaW5nLlxuICAgIHJldHVybiAhZmlsZVBhdGggfHwgZmlsZVBhdGguc2VhcmNoKC9cXC4odGV4fGxocykkLykgPiAwO1xuICB9XG5cbiAgZ2V0RWRpdG9yRGV0YWlscygpIHtcbiAgICBjb25zdCBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCk7XG4gICAgbGV0IGZpbGVQYXRoLCBsaW5lTnVtYmVyO1xuICAgIGlmIChlZGl0b3IpIHtcbiAgICAgIGZpbGVQYXRoID0gZWRpdG9yLmdldFBhdGgoKTtcbiAgICAgIGxpbmVOdW1iZXIgPSBlZGl0b3IuZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oKS5yb3cgKyAxO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBlZGl0b3I6IGVkaXRvcixcbiAgICAgIGZpbGVQYXRoOiBmaWxlUGF0aCxcbiAgICAgIGxpbmVOdW1iZXI6IGxpbmVOdW1iZXIsXG4gICAgfTtcbiAgfVxuXG4gIGFsdGVyUGFyZW50UGF0aCh0YXJnZXRQYXRoLCBvcmlnaW5hbFBhdGgpIHtcbiAgICBjb25zdCB0YXJnZXREaXIgPSBwYXRoLmRpcm5hbWUodGFyZ2V0UGF0aCk7XG4gICAgcmV0dXJuIHBhdGguam9pbih0YXJnZXREaXIsIHBhdGguYmFzZW5hbWUob3JpZ2luYWxQYXRoKSk7XG4gIH1cblxuICBzaG91bGRNb3ZlUmVzdWx0KCkge1xuICAgIGNvbnN0IG1vdmVSZXN1bHQgPSBhdG9tLmNvbmZpZy5nZXQoXCJsYXRleC5tb3ZlUmVzdWx0VG9Tb3VyY2VEaXJlY3RvcnlcIik7XG4gICAgY29uc3Qgb3V0cHV0RGlyZWN0b3J5ID0gYXRvbS5jb25maWcuZ2V0KFwibGF0ZXgub3V0cHV0RGlyZWN0b3J5XCIpO1xuICAgIHJldHVybiBtb3ZlUmVzdWx0ICYmIG91dHB1dERpcmVjdG9yeS5sZW5ndGggPiAwO1xuICB9XG5cbiAgc2hvdWxkT3BlblJlc3VsdCgpIHsgcmV0dXJuIGF0b20uY29uZmlnLmdldChcImxhdGV4Lm9wZW5SZXN1bHRBZnRlckJ1aWxkXCIpOyB9XG59XG4iXX0=