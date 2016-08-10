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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL3BhcnNlcnMvbG9nLXBhcnNlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O3NCQUVjLFFBQVE7Ozs7c0JBQ1AsU0FBUzs7OztvQkFDUCxNQUFNOzs7O0FBSnZCLFdBQVcsQ0FBQzs7QUFNWixJQUFNLGFBQWEsR0FBRyxJQUFJLE1BQU0sQ0FBQyxFQUFFLEdBQy9CLDJCQUEyQjtHQUMzQixNQUFNO0dBQ04saUJBQWlCO0NBQ3BCLENBQUM7O0FBRUYsSUFBTSxZQUFZLEdBQUcsSUFBSSxNQUFNLENBQUMsRUFBRSxHQUM5QixRQUFRO0dBQ1IsU0FBUztHQUNULHNCQUFzQjtHQUN0QixVQUFVO0NBQ2IsQ0FBQzs7SUFFbUIsU0FBUztBQUNqQixXQURRLFNBQVMsQ0FDaEIsUUFBUSxFQUFFOzBCQURILFNBQVM7O0FBRTFCLFFBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO0FBQ3pCLFFBQUksQ0FBQyxXQUFXLEdBQUcsa0JBQUssT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0dBQzNDOztlQUprQixTQUFTOztXQU12QixpQkFBRzs7O0FBQ04sVUFBTSxNQUFNLEdBQUc7QUFDYixtQkFBVyxFQUFFLElBQUksQ0FBQyxRQUFRO0FBQzFCLHNCQUFjLEVBQUUsSUFBSTtBQUNwQixjQUFNLEVBQUUsRUFBRTtBQUNWLGdCQUFRLEVBQUUsRUFBRTtPQUNiLENBQUM7O0FBRUYsVUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO0FBQzlCLDBCQUFFLE9BQU8sQ0FBQyxLQUFLLEVBQUUsVUFBQyxJQUFJLEVBQUUsS0FBSyxFQUFLOztBQUVoQyxZQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQ3RDLFlBQUksS0FBSyxFQUFFO0FBQ1QsY0FBTSxRQUFRLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDN0MsZ0JBQU0sQ0FBQyxjQUFjLEdBQUcsa0JBQUssT0FBTyxDQUFDLE1BQUssV0FBVyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBQ2pFLGlCQUFPO1NBQ1I7O0FBRUQsYUFBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDakMsWUFBSSxLQUFLLEVBQUU7QUFDVCxnQkFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7QUFDakIsdUJBQVcsRUFBRSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7QUFDdkIsb0JBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO0FBQ2xCLHNCQUFVLEVBQUUsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUM7QUFDbEMsbUJBQU8sRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO1dBQ2xCLENBQUMsQ0FBQztBQUNILGlCQUFPO1NBQ1I7T0FDRixDQUFDLENBQUM7O0FBRUgsYUFBTyxNQUFNLENBQUM7S0FDZjs7O1dBRU8sb0JBQUc7QUFDVCxVQUFJLENBQUMsb0JBQUcsVUFBVSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRTtBQUNqQyxjQUFNLElBQUksS0FBSyxvQkFBa0IsSUFBSSxDQUFDLFFBQVEsQ0FBRyxDQUFDO09BQ25EOztBQUVELFVBQU0sT0FBTyxHQUFHLG9CQUFHLFlBQVksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLEVBQUMsUUFBUSxFQUFFLE9BQU8sRUFBQyxDQUFDLENBQUM7QUFDcEUsVUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzlELGFBQU8sS0FBSyxDQUFDO0tBQ2Q7OztTQS9Da0IsU0FBUzs7O3FCQUFULFNBQVMiLCJmaWxlIjoiL2hvbWUvY2luX2NoYWxpYy8uYXRvbS9wYWNrYWdlcy9sYXRleC9saWIvcGFyc2Vycy9sb2ctcGFyc2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2UgYmFiZWxcIjtcblxuaW1wb3J0IF8gZnJvbSBcImxvZGFzaFwiO1xuaW1wb3J0IGZzIGZyb20gXCJmcy1wbHVzXCI7XG5pbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xuXG5jb25zdCBvdXRwdXRQYXR0ZXJuID0gbmV3IFJlZ0V4cChcIlwiXG4gICsgXCJeT3V0cHV0XFxcXHN3cml0dGVuXFxcXHNvblxcXFxzXCIgLy8gTGVhZGluZyB0ZXh0LlxuICArIFwiKC4qKVwiICAgICAgICAgICAgICAgICAgICAgIC8vIE91dHB1dCBwYXRoLlxuICArIFwiXFxcXHNcXFxcKC4qXFxcXClcXFxcLiRcIiAgICAgICAgICAgLy8gVHJhaWxpbmcgdGV4dC5cbik7XG5cbmNvbnN0IGVycm9yUGF0dGVybiA9IG5ldyBSZWdFeHAoXCJcIlxuICArIFwiXiguKik6XCIgICAgICAgICAgICAgICAvLyBGaWxlIHBhdGguXG4gICsgXCIoXFxcXGQrKTpcIiAgICAgICAgICAgICAgLy8gTGluZSBudW1iZXIuXG4gICsgXCJcXFxcc0xhVGVYXFxcXHNFcnJvcjpcXFxcc1wiIC8vIE1hcmtlci5cbiAgKyBcIiguKilcXFxcLiRcIiAgICAgICAgICAgICAvLyBFcnJvciBtZXNzYWdlLlxuKTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTG9nUGFyc2VyIHtcbiAgY29uc3RydWN0b3IoZmlsZVBhdGgpIHtcbiAgICB0aGlzLmZpbGVQYXRoID0gZmlsZVBhdGg7XG4gICAgdGhpcy5wcm9qZWN0UGF0aCA9IHBhdGguZGlybmFtZShmaWxlUGF0aCk7XG4gIH1cblxuICBwYXJzZSgpIHtcbiAgICBjb25zdCByZXN1bHQgPSB7XG4gICAgICBsb2dGaWxlUGF0aDogdGhpcy5maWxlUGF0aCxcbiAgICAgIG91dHB1dEZpbGVQYXRoOiBudWxsLFxuICAgICAgZXJyb3JzOiBbXSxcbiAgICAgIHdhcm5pbmdzOiBbXSxcbiAgICB9O1xuXG4gICAgY29uc3QgbGluZXMgPSB0aGlzLmdldExpbmVzKCk7XG4gICAgXy5mb3JFYWNoKGxpbmVzLCAobGluZSwgaW5kZXgpID0+IHtcbiAgICAgIC8vIFNpbXBsZXN0IFRoaW5nIFRoYXQgV29ya3PihKIgYW5kIEtJU1PCrlxuICAgICAgbGV0IG1hdGNoID0gbGluZS5tYXRjaChvdXRwdXRQYXR0ZXJuKTtcbiAgICAgIGlmIChtYXRjaCkge1xuICAgICAgICBjb25zdCBmaWxlUGF0aCA9IG1hdGNoWzFdLnJlcGxhY2UoL1xcXCIvZywgXCJcIik7IC8vIFRPRE86IEZpeCB3aXRoIGltcHJvdmVkIHJlZ2V4LlxuICAgICAgICByZXN1bHQub3V0cHV0RmlsZVBhdGggPSBwYXRoLnJlc29sdmUodGhpcy5wcm9qZWN0UGF0aCwgZmlsZVBhdGgpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIG1hdGNoID0gbGluZS5tYXRjaChlcnJvclBhdHRlcm4pO1xuICAgICAgaWYgKG1hdGNoKSB7XG4gICAgICAgIHJlc3VsdC5lcnJvcnMucHVzaCh7XG4gICAgICAgICAgbG9nUG9zaXRpb246IFtpbmRleCwgMF0sXG4gICAgICAgICAgZmlsZVBhdGg6IG1hdGNoWzFdLFxuICAgICAgICAgIGxpbmVOdW1iZXI6IHBhcnNlSW50KG1hdGNoWzJdLCAxMCksXG4gICAgICAgICAgbWVzc2FnZTogbWF0Y2hbM10sXG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgZ2V0TGluZXMoKSB7XG4gICAgaWYgKCFmcy5leGlzdHNTeW5jKHRoaXMuZmlsZVBhdGgpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYE5vIHN1Y2ggZmlsZTogJHt0aGlzLmZpbGVQYXRofWApO1xuICAgIH1cblxuICAgIGNvbnN0IHJhd0ZpbGUgPSBmcy5yZWFkRmlsZVN5bmModGhpcy5maWxlUGF0aCwge2VuY29kaW5nOiBcInV0Zi04XCJ9KTtcbiAgICBjb25zdCBsaW5lcyA9IHJhd0ZpbGUucmVwbGFjZSgvKFxcclxcbil8XFxyL2csIFwiXFxuXCIpLnNwbGl0KFwiXFxuXCIpO1xuICAgIHJldHVybiBsaW5lcztcbiAgfVxufVxuIl19
//# sourceURL=/home/cin_chalic/.atom/packages/latex/lib/parsers/log-parser.js
