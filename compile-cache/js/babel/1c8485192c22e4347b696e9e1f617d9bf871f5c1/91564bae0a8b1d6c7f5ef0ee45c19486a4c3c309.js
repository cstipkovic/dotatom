Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _fsPlus = require("fs-plus");

var _fsPlus2 = _interopRequireDefault(_fsPlus);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _parsersMagicParser = require("./parsers/magic-parser");

var _parsersMagicParser2 = _interopRequireDefault(_parsersMagicParser);

"use babel";

var masterFilePattern = new RegExp("" + "^\\s*" // Optional whitespace.
+ "\\\\documentclass" // Command.
+ "(\\[.*\\])?" // Optional command options.
+ "\\{.*\\}" // Class name.
);

var MasterTexFinder = (function () {
  // Create a new MasterTexFinder.
  // this.param filePath: a file name in the directory to be searched

  function MasterTexFinder(filePath) {
    _classCallCheck(this, MasterTexFinder);

    this.filePath = filePath;
    this.fileName = _path2["default"].basename(filePath);
    this.projectPath = _path2["default"].dirname(filePath);
  }

  _createClass(MasterTexFinder, [{
    key: "getTexFilesList",

    // Returns the list of tex files in the project directory
    value: function getTexFilesList() {
      return _fsPlus2["default"].listSync(this.projectPath, [".tex"]);
    }
  }, {
    key: "isMasterFile",

    // Returns true iff path is a master file (contains the documentclass declaration)
    value: function isMasterFile(filePath) {
      if (!_fsPlus2["default"].existsSync(filePath)) {
        return false;
      }

      var rawFile = _fsPlus2["default"].readFileSync(filePath, { encoding: "utf-8" });
      return masterFilePattern.test(rawFile);
    }
  }, {
    key: "getMagicCommentMasterFile",

    // Returns an array containing the path to the root file indicated by a magic
    // comment in this.filePath.
    // Returns null if no magic comment can be found in this.filePath.
    value: function getMagicCommentMasterFile() {
      var magic = new _parsersMagicParser2["default"](this.filePath).parse();
      if (!magic || !magic.root) {
        return null;
      }
      return _path2["default"].resolve(this.projectPath, magic.root);
    }
  }, {
    key: "searchForMasterFile",

    // Returns the list of tex files in the directory where this.filePath lives that
    // contain a documentclass declaration.
    value: function searchForMasterFile() {
      var _this = this;

      var files = this.getTexFilesList();
      if (!files) {
        return null;
      }
      if (files.length === 0) {
        return this.filePath;
      }
      if (files.length === 1) {
        return files[0];
      }

      var result = files.filter(function (p) {
        return _this.isMasterFile(p);
      });
      if (result.length === 1) {
        return result[0];
      }

      // TODO: Nuke warning?
      latex.log.warning("Cannot find latex master file");
      return this.filePath;
    }
  }, {
    key: "getMasterTexPath",

    // Returns the a latex master file.
    //
    // If this.filePath contains a magic comment uses that comment to determine the master file.
    // Else if master file search is disabled, returns this.filePath.
    // Else if the this.filePath is itself a master file, returns this.filePath.
    // Otherwise it searches the directory where this.filePath is contained for files having a
    //   "documentclass" declaration.
    value: function getMasterTexPath() {
      var masterPath = this.getMagicCommentMasterFile();
      if (masterPath) {
        return masterPath;
      }
      if (!this.isMasterFileSearchEnabled()) {
        return this.filePath;
      }
      if (this.isMasterFile(this.filePath)) {
        return this.filePath;
      }

      return this.searchForMasterFile();
    }
  }, {
    key: "isMasterFileSearchEnabled",
    value: function isMasterFileSearchEnabled() {
      return atom.config.get("latex.useMasterFileSearch");
    }
  }]);

  return MasterTexFinder;
})();

exports["default"] = MasterTexFinder;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL21hc3Rlci10ZXgtZmluZGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7c0JBRWUsU0FBUzs7OztvQkFDUCxNQUFNOzs7O2tDQUNDLHdCQUF3Qjs7OztBQUpoRCxXQUFXLENBQUM7O0FBTVosSUFBTSxpQkFBaUIsR0FBRyxJQUFJLE1BQU0sQ0FBQyxFQUFFLEdBQ25DLE9BQU87QUFBQSxFQUNQLG1CQUFtQjtBQUFBLEVBQ25CLGFBQWE7QUFBQSxFQUNiLFVBQVU7QUFBQSxDQUNiLENBQUM7O0lBRW1CLGVBQWU7Ozs7QUFHdkIsV0FIUSxlQUFlLENBR3RCLFFBQVEsRUFBRTswQkFISCxlQUFlOztBQUloQyxRQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztBQUN6QixRQUFJLENBQUMsUUFBUSxHQUFHLGtCQUFLLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUN4QyxRQUFJLENBQUMsV0FBVyxHQUFHLGtCQUFLLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztHQUMzQzs7ZUFQa0IsZUFBZTs7OztXQVVuQiwyQkFBRztBQUNoQixhQUFPLG9CQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztLQUNoRDs7Ozs7V0FHVyxzQkFBQyxRQUFRLEVBQUU7QUFDckIsVUFBSSxDQUFDLG9CQUFHLFVBQVUsQ0FBQyxRQUFRLENBQUMsRUFBRTtBQUFFLGVBQU8sS0FBSyxDQUFDO09BQUU7O0FBRS9DLFVBQU0sT0FBTyxHQUFHLG9CQUFHLFlBQVksQ0FBQyxRQUFRLEVBQUUsRUFBQyxRQUFRLEVBQUUsT0FBTyxFQUFDLENBQUMsQ0FBQztBQUMvRCxhQUFPLGlCQUFpQixDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztLQUN4Qzs7Ozs7OztXQUt3QixxQ0FBRztBQUMxQixVQUFNLEtBQUssR0FBRyxvQ0FBZ0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO0FBQ3JELFVBQUksQ0FBQyxLQUFLLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFO0FBQUUsZUFBTyxJQUFJLENBQUM7T0FBRTtBQUMzQyxhQUFPLGtCQUFLLE9BQU8sQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUNuRDs7Ozs7O1dBSWtCLCtCQUFHOzs7QUFDcEIsVUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO0FBQ3JDLFVBQUksQ0FBQyxLQUFLLEVBQUU7QUFBRSxlQUFPLElBQUksQ0FBQztPQUFFO0FBQzVCLFVBQUksS0FBSyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7QUFBRSxlQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7T0FBRTtBQUNqRCxVQUFJLEtBQUssQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO0FBQUUsZUFBTyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7T0FBRTs7QUFFNUMsVUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxVQUFBLENBQUM7ZUFBSSxNQUFLLFlBQVksQ0FBQyxDQUFDLENBQUM7T0FBQSxDQUFDLENBQUM7QUFDdkQsVUFBSSxNQUFNLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtBQUFFLGVBQU8sTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO09BQUU7OztBQUc5QyxXQUFLLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO0FBQ25ELGFBQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQztLQUN0Qjs7Ozs7Ozs7Ozs7V0FTZSw0QkFBRztBQUNqQixVQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMseUJBQXlCLEVBQUUsQ0FBQztBQUNwRCxVQUFJLFVBQVUsRUFBRTtBQUFFLGVBQU8sVUFBVSxDQUFDO09BQUU7QUFDdEMsVUFBSSxDQUFDLElBQUksQ0FBQyx5QkFBeUIsRUFBRSxFQUFFO0FBQUUsZUFBTyxJQUFJLENBQUMsUUFBUSxDQUFDO09BQUU7QUFDaEUsVUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRTtBQUFFLGVBQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQztPQUFFOztBQUUvRCxhQUFPLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO0tBQ25DOzs7V0FFd0IscUNBQUc7QUFBRSxhQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLDJCQUEyQixDQUFDLENBQUM7S0FBRTs7O1NBL0RqRSxlQUFlOzs7cUJBQWYsZUFBZSIsImZpbGUiOiIvaG9tZS9jaW5fY2hhbGljLy5hdG9tL3BhY2thZ2VzL2xhdGV4L2xpYi9tYXN0ZXItdGV4LWZpbmRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIGJhYmVsXCI7XG5cbmltcG9ydCBmcyBmcm9tIFwiZnMtcGx1c1wiO1xuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcbmltcG9ydCBNYWdpY1BhcnNlciBmcm9tIFwiLi9wYXJzZXJzL21hZ2ljLXBhcnNlclwiO1xuXG5jb25zdCBtYXN0ZXJGaWxlUGF0dGVybiA9IG5ldyBSZWdFeHAoXCJcIlxuICArIFwiXlxcXFxzKlwiICAgICAgICAgICAgIC8vIE9wdGlvbmFsIHdoaXRlc3BhY2UuXG4gICsgXCJcXFxcXFxcXGRvY3VtZW50Y2xhc3NcIiAvLyBDb21tYW5kLlxuICArIFwiKFxcXFxbLipcXFxcXSk/XCIgICAgICAgLy8gT3B0aW9uYWwgY29tbWFuZCBvcHRpb25zLlxuICArIFwiXFxcXHsuKlxcXFx9XCIgICAgICAgICAgLy8gQ2xhc3MgbmFtZS5cbik7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1hc3RlclRleEZpbmRlciB7XG4gIC8vIENyZWF0ZSBhIG5ldyBNYXN0ZXJUZXhGaW5kZXIuXG4gIC8vIHRoaXMucGFyYW0gZmlsZVBhdGg6IGEgZmlsZSBuYW1lIGluIHRoZSBkaXJlY3RvcnkgdG8gYmUgc2VhcmNoZWRcbiAgY29uc3RydWN0b3IoZmlsZVBhdGgpIHtcbiAgICB0aGlzLmZpbGVQYXRoID0gZmlsZVBhdGg7XG4gICAgdGhpcy5maWxlTmFtZSA9IHBhdGguYmFzZW5hbWUoZmlsZVBhdGgpO1xuICAgIHRoaXMucHJvamVjdFBhdGggPSBwYXRoLmRpcm5hbWUoZmlsZVBhdGgpO1xuICB9XG5cbiAgLy8gUmV0dXJucyB0aGUgbGlzdCBvZiB0ZXggZmlsZXMgaW4gdGhlIHByb2plY3QgZGlyZWN0b3J5XG4gIGdldFRleEZpbGVzTGlzdCgpIHtcbiAgICByZXR1cm4gZnMubGlzdFN5bmModGhpcy5wcm9qZWN0UGF0aCwgW1wiLnRleFwiXSk7XG4gIH1cblxuICAvLyBSZXR1cm5zIHRydWUgaWZmIHBhdGggaXMgYSBtYXN0ZXIgZmlsZSAoY29udGFpbnMgdGhlIGRvY3VtZW50Y2xhc3MgZGVjbGFyYXRpb24pXG4gIGlzTWFzdGVyRmlsZShmaWxlUGF0aCkge1xuICAgIGlmICghZnMuZXhpc3RzU3luYyhmaWxlUGF0aCkpIHsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgICBjb25zdCByYXdGaWxlID0gZnMucmVhZEZpbGVTeW5jKGZpbGVQYXRoLCB7ZW5jb2Rpbmc6IFwidXRmLThcIn0pO1xuICAgIHJldHVybiBtYXN0ZXJGaWxlUGF0dGVybi50ZXN0KHJhd0ZpbGUpO1xuICB9XG5cbiAgLy8gUmV0dXJucyBhbiBhcnJheSBjb250YWluaW5nIHRoZSBwYXRoIHRvIHRoZSByb290IGZpbGUgaW5kaWNhdGVkIGJ5IGEgbWFnaWNcbiAgLy8gY29tbWVudCBpbiB0aGlzLmZpbGVQYXRoLlxuICAvLyBSZXR1cm5zIG51bGwgaWYgbm8gbWFnaWMgY29tbWVudCBjYW4gYmUgZm91bmQgaW4gdGhpcy5maWxlUGF0aC5cbiAgZ2V0TWFnaWNDb21tZW50TWFzdGVyRmlsZSgpIHtcbiAgICBjb25zdCBtYWdpYyA9IG5ldyBNYWdpY1BhcnNlcih0aGlzLmZpbGVQYXRoKS5wYXJzZSgpO1xuICAgIGlmICghbWFnaWMgfHwgIW1hZ2ljLnJvb3QpIHsgcmV0dXJuIG51bGw7IH1cbiAgICByZXR1cm4gcGF0aC5yZXNvbHZlKHRoaXMucHJvamVjdFBhdGgsIG1hZ2ljLnJvb3QpO1xuICB9XG5cbiAgLy8gUmV0dXJucyB0aGUgbGlzdCBvZiB0ZXggZmlsZXMgaW4gdGhlIGRpcmVjdG9yeSB3aGVyZSB0aGlzLmZpbGVQYXRoIGxpdmVzIHRoYXRcbiAgLy8gY29udGFpbiBhIGRvY3VtZW50Y2xhc3MgZGVjbGFyYXRpb24uXG4gIHNlYXJjaEZvck1hc3RlckZpbGUoKSB7XG4gICAgY29uc3QgZmlsZXMgPSB0aGlzLmdldFRleEZpbGVzTGlzdCgpO1xuICAgIGlmICghZmlsZXMpIHsgcmV0dXJuIG51bGw7IH1cbiAgICBpZiAoZmlsZXMubGVuZ3RoID09PSAwKSB7IHJldHVybiB0aGlzLmZpbGVQYXRoOyB9XG4gICAgaWYgKGZpbGVzLmxlbmd0aCA9PT0gMSkgeyByZXR1cm4gZmlsZXNbMF07IH1cblxuICAgIGNvbnN0IHJlc3VsdCA9IGZpbGVzLmZpbHRlcihwID0+IHRoaXMuaXNNYXN0ZXJGaWxlKHApKTtcbiAgICBpZiAocmVzdWx0Lmxlbmd0aCA9PT0gMSkgeyByZXR1cm4gcmVzdWx0WzBdOyB9XG5cbiAgICAvLyBUT0RPOiBOdWtlIHdhcm5pbmc/XG4gICAgbGF0ZXgubG9nLndhcm5pbmcoXCJDYW5ub3QgZmluZCBsYXRleCBtYXN0ZXIgZmlsZVwiKTtcbiAgICByZXR1cm4gdGhpcy5maWxlUGF0aDtcbiAgfVxuXG4gIC8vIFJldHVybnMgdGhlIGEgbGF0ZXggbWFzdGVyIGZpbGUuXG4gIC8vXG4gIC8vIElmIHRoaXMuZmlsZVBhdGggY29udGFpbnMgYSBtYWdpYyBjb21tZW50IHVzZXMgdGhhdCBjb21tZW50IHRvIGRldGVybWluZSB0aGUgbWFzdGVyIGZpbGUuXG4gIC8vIEVsc2UgaWYgbWFzdGVyIGZpbGUgc2VhcmNoIGlzIGRpc2FibGVkLCByZXR1cm5zIHRoaXMuZmlsZVBhdGguXG4gIC8vIEVsc2UgaWYgdGhlIHRoaXMuZmlsZVBhdGggaXMgaXRzZWxmIGEgbWFzdGVyIGZpbGUsIHJldHVybnMgdGhpcy5maWxlUGF0aC5cbiAgLy8gT3RoZXJ3aXNlIGl0IHNlYXJjaGVzIHRoZSBkaXJlY3Rvcnkgd2hlcmUgdGhpcy5maWxlUGF0aCBpcyBjb250YWluZWQgZm9yIGZpbGVzIGhhdmluZyBhXG4gIC8vICAgXCJkb2N1bWVudGNsYXNzXCIgZGVjbGFyYXRpb24uXG4gIGdldE1hc3RlclRleFBhdGgoKSB7XG4gICAgY29uc3QgbWFzdGVyUGF0aCA9IHRoaXMuZ2V0TWFnaWNDb21tZW50TWFzdGVyRmlsZSgpO1xuICAgIGlmIChtYXN0ZXJQYXRoKSB7IHJldHVybiBtYXN0ZXJQYXRoOyB9XG4gICAgaWYgKCF0aGlzLmlzTWFzdGVyRmlsZVNlYXJjaEVuYWJsZWQoKSkgeyByZXR1cm4gdGhpcy5maWxlUGF0aDsgfVxuICAgIGlmICh0aGlzLmlzTWFzdGVyRmlsZSh0aGlzLmZpbGVQYXRoKSkgeyByZXR1cm4gdGhpcy5maWxlUGF0aDsgfVxuXG4gICAgcmV0dXJuIHRoaXMuc2VhcmNoRm9yTWFzdGVyRmlsZSgpO1xuICB9XG5cbiAgaXNNYXN0ZXJGaWxlU2VhcmNoRW5hYmxlZCgpIHsgcmV0dXJuIGF0b20uY29uZmlnLmdldChcImxhdGV4LnVzZU1hc3RlckZpbGVTZWFyY2hcIik7IH1cbn1cbiJdfQ==