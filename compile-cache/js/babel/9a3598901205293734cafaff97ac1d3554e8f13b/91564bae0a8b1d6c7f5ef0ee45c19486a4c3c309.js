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

  // Returns the list of tex files in the project directory

  _createClass(MasterTexFinder, [{
    key: "getTexFilesList",
    value: function getTexFilesList() {
      return _fsPlus2["default"].listSync(this.projectPath, [".tex"]);
    }

    // Returns true iff path is a master file (contains the documentclass declaration)
  }, {
    key: "isMasterFile",
    value: function isMasterFile(filePath) {
      if (!_fsPlus2["default"].existsSync(filePath)) {
        return false;
      }

      var rawFile = _fsPlus2["default"].readFileSync(filePath, { encoding: "utf-8" });
      return masterFilePattern.test(rawFile);
    }

    // Returns an array containing the path to the root file indicated by a magic
    // comment in this.filePath.
    // Returns null if no magic comment can be found in this.filePath.
  }, {
    key: "getMagicCommentMasterFile",
    value: function getMagicCommentMasterFile() {
      var magic = new _parsersMagicParser2["default"](this.filePath).parse();
      if (!magic || !magic.root) {
        return null;
      }
      return _path2["default"].resolve(this.projectPath, magic.root);
    }

    // Returns the list of tex files in the directory where this.filePath lives that
    // contain a documentclass declaration.
  }, {
    key: "searchForMasterFile",
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

    // Returns the a latex master file.
    //
    // If this.filePath contains a magic comment uses that comment to determine the master file.
    // Else if master file search is disabled, returns this.filePath.
    // Else if the this.filePath is itself a master file, returns this.filePath.
    // Otherwise it searches the directory where this.filePath is contained for files having a
    //   "documentclass" declaration.
  }, {
    key: "getMasterTexPath",
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL21hc3Rlci10ZXgtZmluZGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7c0JBRWUsU0FBUzs7OztvQkFDUCxNQUFNOzs7O2tDQUNDLHdCQUF3Qjs7OztBQUpoRCxXQUFXLENBQUM7O0FBTVosSUFBTSxpQkFBaUIsR0FBRyxJQUFJLE1BQU0sQ0FBQyxFQUFFLEdBQ25DLE9BQU87R0FDUCxtQkFBbUI7R0FDbkIsYUFBYTtHQUNiLFVBQVU7Q0FDYixDQUFDOztJQUVtQixlQUFlOzs7O0FBR3ZCLFdBSFEsZUFBZSxDQUd0QixRQUFRLEVBQUU7MEJBSEgsZUFBZTs7QUFJaEMsUUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7QUFDekIsUUFBSSxDQUFDLFFBQVEsR0FBRyxrQkFBSyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDeEMsUUFBSSxDQUFDLFdBQVcsR0FBRyxrQkFBSyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7R0FDM0M7Ozs7ZUFQa0IsZUFBZTs7V0FVbkIsMkJBQUc7QUFDaEIsYUFBTyxvQkFBRyxRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7S0FDaEQ7Ozs7O1dBR1csc0JBQUMsUUFBUSxFQUFFO0FBQ3JCLFVBQUksQ0FBQyxvQkFBRyxVQUFVLENBQUMsUUFBUSxDQUFDLEVBQUU7QUFBRSxlQUFPLEtBQUssQ0FBQztPQUFFOztBQUUvQyxVQUFNLE9BQU8sR0FBRyxvQkFBRyxZQUFZLENBQUMsUUFBUSxFQUFFLEVBQUMsUUFBUSxFQUFFLE9BQU8sRUFBQyxDQUFDLENBQUM7QUFDL0QsYUFBTyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7S0FDeEM7Ozs7Ozs7V0FLd0IscUNBQUc7QUFDMUIsVUFBTSxLQUFLLEdBQUcsb0NBQWdCLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUNyRCxVQUFJLENBQUMsS0FBSyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRTtBQUFFLGVBQU8sSUFBSSxDQUFDO09BQUU7QUFDM0MsYUFBTyxrQkFBSyxPQUFPLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDbkQ7Ozs7OztXQUlrQiwrQkFBRzs7O0FBQ3BCLFVBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztBQUNyQyxVQUFJLENBQUMsS0FBSyxFQUFFO0FBQUUsZUFBTyxJQUFJLENBQUM7T0FBRTtBQUM1QixVQUFJLEtBQUssQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO0FBQUUsZUFBTyxJQUFJLENBQUMsUUFBUSxDQUFDO09BQUU7QUFDakQsVUFBSSxLQUFLLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtBQUFFLGVBQU8sS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO09BQUU7O0FBRTVDLFVBQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsVUFBQSxDQUFDO2VBQUksTUFBSyxZQUFZLENBQUMsQ0FBQyxDQUFDO09BQUEsQ0FBQyxDQUFDO0FBQ3ZELFVBQUksTUFBTSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7QUFBRSxlQUFPLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztPQUFFOzs7QUFHOUMsV0FBSyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsK0JBQStCLENBQUMsQ0FBQztBQUNuRCxhQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7S0FDdEI7Ozs7Ozs7Ozs7O1dBU2UsNEJBQUc7QUFDakIsVUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLHlCQUF5QixFQUFFLENBQUM7QUFDcEQsVUFBSSxVQUFVLEVBQUU7QUFBRSxlQUFPLFVBQVUsQ0FBQztPQUFFO0FBQ3RDLFVBQUksQ0FBQyxJQUFJLENBQUMseUJBQXlCLEVBQUUsRUFBRTtBQUFFLGVBQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQztPQUFFO0FBQ2hFLFVBQUksSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUU7QUFBRSxlQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7T0FBRTs7QUFFL0QsYUFBTyxJQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztLQUNuQzs7O1dBRXdCLHFDQUFHO0FBQUUsYUFBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO0tBQUU7OztTQS9EakUsZUFBZTs7O3FCQUFmLGVBQWUiLCJmaWxlIjoiL2hvbWUvY2luX2NoYWxpYy8uYXRvbS9wYWNrYWdlcy9sYXRleC9saWIvbWFzdGVyLXRleC1maW5kZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBiYWJlbFwiO1xuXG5pbXBvcnQgZnMgZnJvbSBcImZzLXBsdXNcIjtcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgTWFnaWNQYXJzZXIgZnJvbSBcIi4vcGFyc2Vycy9tYWdpYy1wYXJzZXJcIjtcblxuY29uc3QgbWFzdGVyRmlsZVBhdHRlcm4gPSBuZXcgUmVnRXhwKFwiXCJcbiAgKyBcIl5cXFxccypcIiAgICAgICAgICAgICAvLyBPcHRpb25hbCB3aGl0ZXNwYWNlLlxuICArIFwiXFxcXFxcXFxkb2N1bWVudGNsYXNzXCIgLy8gQ29tbWFuZC5cbiAgKyBcIihcXFxcWy4qXFxcXF0pP1wiICAgICAgIC8vIE9wdGlvbmFsIGNvbW1hbmQgb3B0aW9ucy5cbiAgKyBcIlxcXFx7LipcXFxcfVwiICAgICAgICAgIC8vIENsYXNzIG5hbWUuXG4pO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNYXN0ZXJUZXhGaW5kZXIge1xuICAvLyBDcmVhdGUgYSBuZXcgTWFzdGVyVGV4RmluZGVyLlxuICAvLyB0aGlzLnBhcmFtIGZpbGVQYXRoOiBhIGZpbGUgbmFtZSBpbiB0aGUgZGlyZWN0b3J5IHRvIGJlIHNlYXJjaGVkXG4gIGNvbnN0cnVjdG9yKGZpbGVQYXRoKSB7XG4gICAgdGhpcy5maWxlUGF0aCA9IGZpbGVQYXRoO1xuICAgIHRoaXMuZmlsZU5hbWUgPSBwYXRoLmJhc2VuYW1lKGZpbGVQYXRoKTtcbiAgICB0aGlzLnByb2plY3RQYXRoID0gcGF0aC5kaXJuYW1lKGZpbGVQYXRoKTtcbiAgfVxuXG4gIC8vIFJldHVybnMgdGhlIGxpc3Qgb2YgdGV4IGZpbGVzIGluIHRoZSBwcm9qZWN0IGRpcmVjdG9yeVxuICBnZXRUZXhGaWxlc0xpc3QoKSB7XG4gICAgcmV0dXJuIGZzLmxpc3RTeW5jKHRoaXMucHJvamVjdFBhdGgsIFtcIi50ZXhcIl0pO1xuICB9XG5cbiAgLy8gUmV0dXJucyB0cnVlIGlmZiBwYXRoIGlzIGEgbWFzdGVyIGZpbGUgKGNvbnRhaW5zIHRoZSBkb2N1bWVudGNsYXNzIGRlY2xhcmF0aW9uKVxuICBpc01hc3RlckZpbGUoZmlsZVBhdGgpIHtcbiAgICBpZiAoIWZzLmV4aXN0c1N5bmMoZmlsZVBhdGgpKSB7IHJldHVybiBmYWxzZTsgfVxuXG4gICAgY29uc3QgcmF3RmlsZSA9IGZzLnJlYWRGaWxlU3luYyhmaWxlUGF0aCwge2VuY29kaW5nOiBcInV0Zi04XCJ9KTtcbiAgICByZXR1cm4gbWFzdGVyRmlsZVBhdHRlcm4udGVzdChyYXdGaWxlKTtcbiAgfVxuXG4gIC8vIFJldHVybnMgYW4gYXJyYXkgY29udGFpbmluZyB0aGUgcGF0aCB0byB0aGUgcm9vdCBmaWxlIGluZGljYXRlZCBieSBhIG1hZ2ljXG4gIC8vIGNvbW1lbnQgaW4gdGhpcy5maWxlUGF0aC5cbiAgLy8gUmV0dXJucyBudWxsIGlmIG5vIG1hZ2ljIGNvbW1lbnQgY2FuIGJlIGZvdW5kIGluIHRoaXMuZmlsZVBhdGguXG4gIGdldE1hZ2ljQ29tbWVudE1hc3RlckZpbGUoKSB7XG4gICAgY29uc3QgbWFnaWMgPSBuZXcgTWFnaWNQYXJzZXIodGhpcy5maWxlUGF0aCkucGFyc2UoKTtcbiAgICBpZiAoIW1hZ2ljIHx8ICFtYWdpYy5yb290KSB7IHJldHVybiBudWxsOyB9XG4gICAgcmV0dXJuIHBhdGgucmVzb2x2ZSh0aGlzLnByb2plY3RQYXRoLCBtYWdpYy5yb290KTtcbiAgfVxuXG4gIC8vIFJldHVybnMgdGhlIGxpc3Qgb2YgdGV4IGZpbGVzIGluIHRoZSBkaXJlY3Rvcnkgd2hlcmUgdGhpcy5maWxlUGF0aCBsaXZlcyB0aGF0XG4gIC8vIGNvbnRhaW4gYSBkb2N1bWVudGNsYXNzIGRlY2xhcmF0aW9uLlxuICBzZWFyY2hGb3JNYXN0ZXJGaWxlKCkge1xuICAgIGNvbnN0IGZpbGVzID0gdGhpcy5nZXRUZXhGaWxlc0xpc3QoKTtcbiAgICBpZiAoIWZpbGVzKSB7IHJldHVybiBudWxsOyB9XG4gICAgaWYgKGZpbGVzLmxlbmd0aCA9PT0gMCkgeyByZXR1cm4gdGhpcy5maWxlUGF0aDsgfVxuICAgIGlmIChmaWxlcy5sZW5ndGggPT09IDEpIHsgcmV0dXJuIGZpbGVzWzBdOyB9XG5cbiAgICBjb25zdCByZXN1bHQgPSBmaWxlcy5maWx0ZXIocCA9PiB0aGlzLmlzTWFzdGVyRmlsZShwKSk7XG4gICAgaWYgKHJlc3VsdC5sZW5ndGggPT09IDEpIHsgcmV0dXJuIHJlc3VsdFswXTsgfVxuXG4gICAgLy8gVE9ETzogTnVrZSB3YXJuaW5nP1xuICAgIGxhdGV4LmxvZy53YXJuaW5nKFwiQ2Fubm90IGZpbmQgbGF0ZXggbWFzdGVyIGZpbGVcIik7XG4gICAgcmV0dXJuIHRoaXMuZmlsZVBhdGg7XG4gIH1cblxuICAvLyBSZXR1cm5zIHRoZSBhIGxhdGV4IG1hc3RlciBmaWxlLlxuICAvL1xuICAvLyBJZiB0aGlzLmZpbGVQYXRoIGNvbnRhaW5zIGEgbWFnaWMgY29tbWVudCB1c2VzIHRoYXQgY29tbWVudCB0byBkZXRlcm1pbmUgdGhlIG1hc3RlciBmaWxlLlxuICAvLyBFbHNlIGlmIG1hc3RlciBmaWxlIHNlYXJjaCBpcyBkaXNhYmxlZCwgcmV0dXJucyB0aGlzLmZpbGVQYXRoLlxuICAvLyBFbHNlIGlmIHRoZSB0aGlzLmZpbGVQYXRoIGlzIGl0c2VsZiBhIG1hc3RlciBmaWxlLCByZXR1cm5zIHRoaXMuZmlsZVBhdGguXG4gIC8vIE90aGVyd2lzZSBpdCBzZWFyY2hlcyB0aGUgZGlyZWN0b3J5IHdoZXJlIHRoaXMuZmlsZVBhdGggaXMgY29udGFpbmVkIGZvciBmaWxlcyBoYXZpbmcgYVxuICAvLyAgIFwiZG9jdW1lbnRjbGFzc1wiIGRlY2xhcmF0aW9uLlxuICBnZXRNYXN0ZXJUZXhQYXRoKCkge1xuICAgIGNvbnN0IG1hc3RlclBhdGggPSB0aGlzLmdldE1hZ2ljQ29tbWVudE1hc3RlckZpbGUoKTtcbiAgICBpZiAobWFzdGVyUGF0aCkgeyByZXR1cm4gbWFzdGVyUGF0aDsgfVxuICAgIGlmICghdGhpcy5pc01hc3RlckZpbGVTZWFyY2hFbmFibGVkKCkpIHsgcmV0dXJuIHRoaXMuZmlsZVBhdGg7IH1cbiAgICBpZiAodGhpcy5pc01hc3RlckZpbGUodGhpcy5maWxlUGF0aCkpIHsgcmV0dXJuIHRoaXMuZmlsZVBhdGg7IH1cblxuICAgIHJldHVybiB0aGlzLnNlYXJjaEZvck1hc3RlckZpbGUoKTtcbiAgfVxuXG4gIGlzTWFzdGVyRmlsZVNlYXJjaEVuYWJsZWQoKSB7IHJldHVybiBhdG9tLmNvbmZpZy5nZXQoXCJsYXRleC51c2VNYXN0ZXJGaWxlU2VhcmNoXCIpOyB9XG59XG4iXX0=
//# sourceURL=/home/cin_chalic/.atom/packages/latex/lib/master-tex-finder.js
