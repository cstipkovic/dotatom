Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _fsPlus = require("fs-plus");

var _fsPlus2 = _interopRequireDefault(_fsPlus);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

"use babel";

var outputPattern = new RegExp("" + "^Output\\swritten\\son\\s" // Leading text.
+ "(.*)" // Output path.
+ "\\s\\(.*\\)\\.$" // Trailing text.
);

var errorPattern = new RegExp("" + "^(.*):" // File path.
+ "(\\d+):" // Line number.
+ "\\sLaTeX\\sError:\\s" // Marker.
+ "(.*)\\.$" // Error message.
);

var LogParser = (function () {
  function LogParser(filePath) {
    _classCallCheck(this, LogParser);

    this.filePath = filePath;
    this.projectPath = _path2["default"].dirname(filePath);
  }

  _createClass(LogParser, [{
    key: "parse",
    value: function parse() {
      var _this = this;

      var result = {
        logFilePath: this.filePath,
        outputFilePath: null,
        errors: [],
        warnings: []
      };

      var lines = this.getLines();
      _lodash2["default"].forEach(lines, function (line, index) {
        // Simplest Thing That Works™ and KISS®
        var match = line.match(outputPattern);
        if (match) {
          var filePath = match[1].replace(/\"/g, ""); // TODO: Fix with improved regex.
          result.outputFilePath = _path2["default"].resolve(_this.projectPath, filePath);
          return;
        }

        match = line.match(errorPattern);
        if (match) {
          result.errors.push({
            logPosition: [index, 0],
            filePath: match[1],
            lineNumber: parseInt(match[2], 10),
            message: match[3]
          });
          return;
        }
      });

      return result;
    }
  }, {
    key: "getLines",
    value: function getLines() {
      if (!_fsPlus2["default"].existsSync(this.filePath)) {
        throw new Error("No such file: " + this.filePath);
      }

      var rawFile = _fsPlus2["default"].readFileSync(this.filePath, { encoding: "utf-8" });
      var lines = rawFile.replace(/(\r\n)|\r/g, "\n").split("\n");
      return lines;
    }
  }]);

  return LogParser;
})();

exports["default"] = LogParser;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL3BhcnNlcnMvbG9nLXBhcnNlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O3NCQUVjLFFBQVE7Ozs7c0JBQ1AsU0FBUzs7OztvQkFDUCxNQUFNOzs7O0FBSnZCLFdBQVcsQ0FBQzs7QUFNWixJQUFNLGFBQWEsR0FBRyxJQUFJLE1BQU0sQ0FBQyxFQUFFLEdBQy9CLDJCQUEyQjtBQUFBLEVBQzNCLE1BQU07QUFBQSxFQUNOLGlCQUFpQjtBQUFBLENBQ3BCLENBQUM7O0FBRUYsSUFBTSxZQUFZLEdBQUcsSUFBSSxNQUFNLENBQUMsRUFBRSxHQUM5QixRQUFRO0FBQUEsRUFDUixTQUFTO0FBQUEsRUFDVCxzQkFBc0I7QUFBQSxFQUN0QixVQUFVO0FBQUEsQ0FDYixDQUFDOztJQUVtQixTQUFTO0FBQ2pCLFdBRFEsU0FBUyxDQUNoQixRQUFRLEVBQUU7MEJBREgsU0FBUzs7QUFFMUIsUUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7QUFDekIsUUFBSSxDQUFDLFdBQVcsR0FBRyxrQkFBSyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7R0FDM0M7O2VBSmtCLFNBQVM7O1dBTXZCLGlCQUFHOzs7QUFDTixVQUFNLE1BQU0sR0FBRztBQUNiLG1CQUFXLEVBQUUsSUFBSSxDQUFDLFFBQVE7QUFDMUIsc0JBQWMsRUFBRSxJQUFJO0FBQ3BCLGNBQU0sRUFBRSxFQUFFO0FBQ1YsZ0JBQVEsRUFBRSxFQUFFO09BQ2IsQ0FBQzs7QUFFRixVQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7QUFDOUIsMEJBQUUsT0FBTyxDQUFDLEtBQUssRUFBRSxVQUFDLElBQUksRUFBRSxLQUFLLEVBQUs7O0FBRWhDLFlBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDdEMsWUFBSSxLQUFLLEVBQUU7QUFDVCxjQUFNLFFBQVEsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztBQUM3QyxnQkFBTSxDQUFDLGNBQWMsR0FBRyxrQkFBSyxPQUFPLENBQUMsTUFBSyxXQUFXLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFDakUsaUJBQU87U0FDUjs7QUFFRCxhQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUNqQyxZQUFJLEtBQUssRUFBRTtBQUNULGdCQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztBQUNqQix1QkFBVyxFQUFFLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQztBQUN2QixvQkFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7QUFDbEIsc0JBQVUsRUFBRSxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQztBQUNsQyxtQkFBTyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7V0FDbEIsQ0FBQyxDQUFDO0FBQ0gsaUJBQU87U0FDUjtPQUNGLENBQUMsQ0FBQzs7QUFFSCxhQUFPLE1BQU0sQ0FBQztLQUNmOzs7V0FFTyxvQkFBRztBQUNULFVBQUksQ0FBQyxvQkFBRyxVQUFVLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFO0FBQ2pDLGNBQU0sSUFBSSxLQUFLLG9CQUFrQixJQUFJLENBQUMsUUFBUSxDQUFHLENBQUM7T0FDbkQ7O0FBRUQsVUFBTSxPQUFPLEdBQUcsb0JBQUcsWUFBWSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsRUFBQyxRQUFRLEVBQUUsT0FBTyxFQUFDLENBQUMsQ0FBQztBQUNwRSxVQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDOUQsYUFBTyxLQUFLLENBQUM7S0FDZDs7O1NBL0NrQixTQUFTOzs7cUJBQVQsU0FBUyIsImZpbGUiOiIvaG9tZS9jaW5fY2hhbGljLy5hdG9tL3BhY2thZ2VzL2xhdGV4L2xpYi9wYXJzZXJzL2xvZy1wYXJzZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBiYWJlbFwiO1xuXG5pbXBvcnQgXyBmcm9tIFwibG9kYXNoXCI7XG5pbXBvcnQgZnMgZnJvbSBcImZzLXBsdXNcIjtcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG5cbmNvbnN0IG91dHB1dFBhdHRlcm4gPSBuZXcgUmVnRXhwKFwiXCJcbiAgKyBcIl5PdXRwdXRcXFxcc3dyaXR0ZW5cXFxcc29uXFxcXHNcIiAvLyBMZWFkaW5nIHRleHQuXG4gICsgXCIoLiopXCIgICAgICAgICAgICAgICAgICAgICAgLy8gT3V0cHV0IHBhdGguXG4gICsgXCJcXFxcc1xcXFwoLipcXFxcKVxcXFwuJFwiICAgICAgICAgICAvLyBUcmFpbGluZyB0ZXh0LlxuKTtcblxuY29uc3QgZXJyb3JQYXR0ZXJuID0gbmV3IFJlZ0V4cChcIlwiXG4gICsgXCJeKC4qKTpcIiAgICAgICAgICAgICAgIC8vIEZpbGUgcGF0aC5cbiAgKyBcIihcXFxcZCspOlwiICAgICAgICAgICAgICAvLyBMaW5lIG51bWJlci5cbiAgKyBcIlxcXFxzTGFUZVhcXFxcc0Vycm9yOlxcXFxzXCIgLy8gTWFya2VyLlxuICArIFwiKC4qKVxcXFwuJFwiICAgICAgICAgICAgIC8vIEVycm9yIG1lc3NhZ2UuXG4pO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMb2dQYXJzZXIge1xuICBjb25zdHJ1Y3RvcihmaWxlUGF0aCkge1xuICAgIHRoaXMuZmlsZVBhdGggPSBmaWxlUGF0aDtcbiAgICB0aGlzLnByb2plY3RQYXRoID0gcGF0aC5kaXJuYW1lKGZpbGVQYXRoKTtcbiAgfVxuXG4gIHBhcnNlKCkge1xuICAgIGNvbnN0IHJlc3VsdCA9IHtcbiAgICAgIGxvZ0ZpbGVQYXRoOiB0aGlzLmZpbGVQYXRoLFxuICAgICAgb3V0cHV0RmlsZVBhdGg6IG51bGwsXG4gICAgICBlcnJvcnM6IFtdLFxuICAgICAgd2FybmluZ3M6IFtdLFxuICAgIH07XG5cbiAgICBjb25zdCBsaW5lcyA9IHRoaXMuZ2V0TGluZXMoKTtcbiAgICBfLmZvckVhY2gobGluZXMsIChsaW5lLCBpbmRleCkgPT4ge1xuICAgICAgLy8gU2ltcGxlc3QgVGhpbmcgVGhhdCBXb3Jrc+KEoiBhbmQgS0lTU8KuXG4gICAgICBsZXQgbWF0Y2ggPSBsaW5lLm1hdGNoKG91dHB1dFBhdHRlcm4pO1xuICAgICAgaWYgKG1hdGNoKSB7XG4gICAgICAgIGNvbnN0IGZpbGVQYXRoID0gbWF0Y2hbMV0ucmVwbGFjZSgvXFxcIi9nLCBcIlwiKTsgLy8gVE9ETzogRml4IHdpdGggaW1wcm92ZWQgcmVnZXguXG4gICAgICAgIHJlc3VsdC5vdXRwdXRGaWxlUGF0aCA9IHBhdGgucmVzb2x2ZSh0aGlzLnByb2plY3RQYXRoLCBmaWxlUGF0aCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgbWF0Y2ggPSBsaW5lLm1hdGNoKGVycm9yUGF0dGVybik7XG4gICAgICBpZiAobWF0Y2gpIHtcbiAgICAgICAgcmVzdWx0LmVycm9ycy5wdXNoKHtcbiAgICAgICAgICBsb2dQb3NpdGlvbjogW2luZGV4LCAwXSxcbiAgICAgICAgICBmaWxlUGF0aDogbWF0Y2hbMV0sXG4gICAgICAgICAgbGluZU51bWJlcjogcGFyc2VJbnQobWF0Y2hbMl0sIDEwKSxcbiAgICAgICAgICBtZXNzYWdlOiBtYXRjaFszXSxcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBnZXRMaW5lcygpIHtcbiAgICBpZiAoIWZzLmV4aXN0c1N5bmModGhpcy5maWxlUGF0aCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgTm8gc3VjaCBmaWxlOiAke3RoaXMuZmlsZVBhdGh9YCk7XG4gICAgfVxuXG4gICAgY29uc3QgcmF3RmlsZSA9IGZzLnJlYWRGaWxlU3luYyh0aGlzLmZpbGVQYXRoLCB7ZW5jb2Rpbmc6IFwidXRmLThcIn0pO1xuICAgIGNvbnN0IGxpbmVzID0gcmF3RmlsZS5yZXBsYWNlKC8oXFxyXFxuKXxcXHIvZywgXCJcXG5cIikuc3BsaXQoXCJcXG5cIik7XG4gICAgcmV0dXJuIGxpbmVzO1xuICB9XG59XG4iXX0=