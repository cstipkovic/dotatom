Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _fsPlus = require("fs-plus");

var _fsPlus2 = _interopRequireDefault(_fsPlus);

"use babel";

var magicCommentPattern = new RegExp("" + "^%\\s*" // Optional whitespace.
 + "!TEX" // Magic marker.
 + "\\s+" // Semi-optional whitespace.
 + "(\\w+)" // [1] Captures the magic keyword. E.g. "root".
 + "\\s*=\\s*" // Equal sign wrapped in optional whitespace.
 + "(.*)" // [2] Captures everything following the equal sign.
 + "$" // EOL.
);

var MagicParser = (function () {
  function MagicParser(filePath) {
    _classCallCheck(this, MagicParser);

    this.filePath = filePath;
  }

  _createClass(MagicParser, [{
    key: "parse",
    value: function parse() {
      var result = {};
      var lines = this.getLines();
      for (var line of lines) {
        var match = line.match(magicCommentPattern);
        if (!match) {
          break;
        } // Stop parsing unless line is a magic comment.
        result[match[1]] = match[2];
      }

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

  return MagicParser;
})();

exports["default"] = MagicParser;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL3BhcnNlcnMvbWFnaWMtcGFyc2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7c0JBRWUsU0FBUzs7OztBQUZ4QixXQUFXLENBQUM7O0FBSVosSUFBTSxtQkFBbUIsR0FBRyxJQUFJLE1BQU0sQ0FBQyxFQUFFLEdBQ3JDLFFBQVE7R0FDUixNQUFNO0dBQ04sTUFBTTtHQUNOLFFBQVE7R0FDUixXQUFXO0dBQ1gsTUFBTTtHQUNOLEdBQUc7Q0FDTixDQUFDOztJQUVtQixXQUFXO0FBQ25CLFdBRFEsV0FBVyxDQUNsQixRQUFRLEVBQUU7MEJBREgsV0FBVzs7QUFFNUIsUUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7R0FDMUI7O2VBSGtCLFdBQVc7O1dBS3pCLGlCQUFHO0FBQ04sVUFBTSxNQUFNLEdBQUcsRUFBRSxDQUFDO0FBQ2xCLFVBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztBQUM5QixXQUFLLElBQU0sSUFBSSxJQUFJLEtBQUssRUFBRTtBQUN4QixZQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLG1CQUFtQixDQUFDLENBQUM7QUFDOUMsWUFBSSxDQUFDLEtBQUssRUFBRTtBQUFFLGdCQUFNO1NBQUU7QUFDdEIsY0FBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztPQUM3Qjs7QUFFRCxhQUFPLE1BQU0sQ0FBQztLQUNmOzs7V0FFTyxvQkFBRztBQUNULFVBQUksQ0FBQyxvQkFBRyxVQUFVLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFO0FBQ2pDLGNBQU0sSUFBSSxLQUFLLG9CQUFrQixJQUFJLENBQUMsUUFBUSxDQUFHLENBQUM7T0FDbkQ7O0FBRUQsVUFBTSxPQUFPLEdBQUcsb0JBQUcsWUFBWSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsRUFBQyxRQUFRLEVBQUUsT0FBTyxFQUFDLENBQUMsQ0FBQztBQUNwRSxVQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDOUQsYUFBTyxLQUFLLENBQUM7S0FDZDs7O1NBekJrQixXQUFXOzs7cUJBQVgsV0FBVyIsImZpbGUiOiIvaG9tZS9jaW5fY2hhbGljLy5hdG9tL3BhY2thZ2VzL2xhdGV4L2xpYi9wYXJzZXJzL21hZ2ljLXBhcnNlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIGJhYmVsXCI7XG5cbmltcG9ydCBmcyBmcm9tIFwiZnMtcGx1c1wiO1xuXG5jb25zdCBtYWdpY0NvbW1lbnRQYXR0ZXJuID0gbmV3IFJlZ0V4cChcIlwiXG4gICsgXCJeJVxcXFxzKlwiICAgIC8vIE9wdGlvbmFsIHdoaXRlc3BhY2UuXG4gICsgXCIhVEVYXCIgICAgICAvLyBNYWdpYyBtYXJrZXIuXG4gICsgXCJcXFxccytcIiAgICAgIC8vIFNlbWktb3B0aW9uYWwgd2hpdGVzcGFjZS5cbiAgKyBcIihcXFxcdyspXCIgICAgLy8gWzFdIENhcHR1cmVzIHRoZSBtYWdpYyBrZXl3b3JkLiBFLmcuIFwicm9vdFwiLlxuICArIFwiXFxcXHMqPVxcXFxzKlwiIC8vIEVxdWFsIHNpZ24gd3JhcHBlZCBpbiBvcHRpb25hbCB3aGl0ZXNwYWNlLlxuICArIFwiKC4qKVwiICAgICAgLy8gWzJdIENhcHR1cmVzIGV2ZXJ5dGhpbmcgZm9sbG93aW5nIHRoZSBlcXVhbCBzaWduLlxuICArIFwiJFwiICAgICAgICAgLy8gRU9MLlxuKTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWFnaWNQYXJzZXIge1xuICBjb25zdHJ1Y3RvcihmaWxlUGF0aCkge1xuICAgIHRoaXMuZmlsZVBhdGggPSBmaWxlUGF0aDtcbiAgfVxuXG4gIHBhcnNlKCkge1xuICAgIGNvbnN0IHJlc3VsdCA9IHt9O1xuICAgIGNvbnN0IGxpbmVzID0gdGhpcy5nZXRMaW5lcygpO1xuICAgIGZvciAoY29uc3QgbGluZSBvZiBsaW5lcykge1xuICAgICAgY29uc3QgbWF0Y2ggPSBsaW5lLm1hdGNoKG1hZ2ljQ29tbWVudFBhdHRlcm4pO1xuICAgICAgaWYgKCFtYXRjaCkgeyBicmVhazsgfSAvLyBTdG9wIHBhcnNpbmcgdW5sZXNzIGxpbmUgaXMgYSBtYWdpYyBjb21tZW50LlxuICAgICAgcmVzdWx0W21hdGNoWzFdXSA9IG1hdGNoWzJdO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBnZXRMaW5lcygpIHtcbiAgICBpZiAoIWZzLmV4aXN0c1N5bmModGhpcy5maWxlUGF0aCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgTm8gc3VjaCBmaWxlOiAke3RoaXMuZmlsZVBhdGh9YCk7XG4gICAgfVxuXG4gICAgY29uc3QgcmF3RmlsZSA9IGZzLnJlYWRGaWxlU3luYyh0aGlzLmZpbGVQYXRoLCB7ZW5jb2Rpbmc6IFwidXRmLThcIn0pO1xuICAgIGNvbnN0IGxpbmVzID0gcmF3RmlsZS5yZXBsYWNlKC8oXFxyXFxuKXxcXHIvZywgXCJcXG5cIikuc3BsaXQoXCJcXG5cIik7XG4gICAgcmV0dXJuIGxpbmVzO1xuICB9XG59XG4iXX0=
//# sourceURL=/home/cin_chalic/.atom/packages/latex/lib/parsers/magic-parser.js
