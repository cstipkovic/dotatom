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
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = lines[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var line = _step.value;

          var match = line.match(magicCommentPattern);
          if (!match) {
            break;
          } // Stop parsing unless line is a magic comment.
          result[match[1]] = match[2];
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator["return"]) {
            _iterator["return"]();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL3BhcnNlcnMvbWFnaWMtcGFyc2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7c0JBRWUsU0FBUzs7OztBQUZ4QixXQUFXLENBQUM7O0FBSVosSUFBTSxtQkFBbUIsR0FBRyxJQUFJLE1BQU0sQ0FBQyxFQUFFLEdBQ3JDLFFBQVE7QUFBQSxFQUNSLE1BQU07QUFBQSxFQUNOLE1BQU07QUFBQSxFQUNOLFFBQVE7QUFBQSxFQUNSLFdBQVc7QUFBQSxFQUNYLE1BQU07QUFBQSxFQUNOLEdBQUc7QUFBQSxDQUNOLENBQUM7O0lBRW1CLFdBQVc7QUFDbkIsV0FEUSxXQUFXLENBQ2xCLFFBQVEsRUFBRTswQkFESCxXQUFXOztBQUU1QixRQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztHQUMxQjs7ZUFIa0IsV0FBVzs7V0FLekIsaUJBQUc7QUFDTixVQUFNLE1BQU0sR0FBRyxFQUFFLENBQUM7QUFDbEIsVUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDOzs7Ozs7QUFDOUIsNkJBQW1CLEtBQUssOEhBQUU7Y0FBZixJQUFJOztBQUNiLGNBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsbUJBQW1CLENBQUMsQ0FBQztBQUM5QyxjQUFJLENBQUMsS0FBSyxFQUFFO0FBQUUsa0JBQU07V0FBRTtBQUN0QixnQkFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUM3Qjs7Ozs7Ozs7Ozs7Ozs7OztBQUVELGFBQU8sTUFBTSxDQUFDO0tBQ2Y7OztXQUVPLG9CQUFHO0FBQ1QsVUFBSSxDQUFDLG9CQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUU7QUFDakMsY0FBTSxJQUFJLEtBQUssb0JBQWtCLElBQUksQ0FBQyxRQUFRLENBQUcsQ0FBQztPQUNuRDs7QUFFRCxVQUFNLE9BQU8sR0FBRyxvQkFBRyxZQUFZLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxFQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUMsQ0FBQyxDQUFDO0FBQ3BFLFVBQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUM5RCxhQUFPLEtBQUssQ0FBQztLQUNkOzs7U0F6QmtCLFdBQVc7OztxQkFBWCxXQUFXIiwiZmlsZSI6Ii9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL3BhcnNlcnMvbWFnaWMtcGFyc2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2UgYmFiZWxcIjtcblxuaW1wb3J0IGZzIGZyb20gXCJmcy1wbHVzXCI7XG5cbmNvbnN0IG1hZ2ljQ29tbWVudFBhdHRlcm4gPSBuZXcgUmVnRXhwKFwiXCJcbiAgKyBcIl4lXFxcXHMqXCIgICAgLy8gT3B0aW9uYWwgd2hpdGVzcGFjZS5cbiAgKyBcIiFURVhcIiAgICAgIC8vIE1hZ2ljIG1hcmtlci5cbiAgKyBcIlxcXFxzK1wiICAgICAgLy8gU2VtaS1vcHRpb25hbCB3aGl0ZXNwYWNlLlxuICArIFwiKFxcXFx3KylcIiAgICAvLyBbMV0gQ2FwdHVyZXMgdGhlIG1hZ2ljIGtleXdvcmQuIEUuZy4gXCJyb290XCIuXG4gICsgXCJcXFxccyo9XFxcXHMqXCIgLy8gRXF1YWwgc2lnbiB3cmFwcGVkIGluIG9wdGlvbmFsIHdoaXRlc3BhY2UuXG4gICsgXCIoLiopXCIgICAgICAvLyBbMl0gQ2FwdHVyZXMgZXZlcnl0aGluZyBmb2xsb3dpbmcgdGhlIGVxdWFsIHNpZ24uXG4gICsgXCIkXCIgICAgICAgICAvLyBFT0wuXG4pO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNYWdpY1BhcnNlciB7XG4gIGNvbnN0cnVjdG9yKGZpbGVQYXRoKSB7XG4gICAgdGhpcy5maWxlUGF0aCA9IGZpbGVQYXRoO1xuICB9XG5cbiAgcGFyc2UoKSB7XG4gICAgY29uc3QgcmVzdWx0ID0ge307XG4gICAgY29uc3QgbGluZXMgPSB0aGlzLmdldExpbmVzKCk7XG4gICAgZm9yIChjb25zdCBsaW5lIG9mIGxpbmVzKSB7XG4gICAgICBjb25zdCBtYXRjaCA9IGxpbmUubWF0Y2gobWFnaWNDb21tZW50UGF0dGVybik7XG4gICAgICBpZiAoIW1hdGNoKSB7IGJyZWFrOyB9IC8vIFN0b3AgcGFyc2luZyB1bmxlc3MgbGluZSBpcyBhIG1hZ2ljIGNvbW1lbnQuXG4gICAgICByZXN1bHRbbWF0Y2hbMV1dID0gbWF0Y2hbMl07XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIGdldExpbmVzKCkge1xuICAgIGlmICghZnMuZXhpc3RzU3luYyh0aGlzLmZpbGVQYXRoKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBObyBzdWNoIGZpbGU6ICR7dGhpcy5maWxlUGF0aH1gKTtcbiAgICB9XG5cbiAgICBjb25zdCByYXdGaWxlID0gZnMucmVhZEZpbGVTeW5jKHRoaXMuZmlsZVBhdGgsIHtlbmNvZGluZzogXCJ1dGYtOFwifSk7XG4gICAgY29uc3QgbGluZXMgPSByYXdGaWxlLnJlcGxhY2UoLyhcXHJcXG4pfFxcci9nLCBcIlxcblwiKS5zcGxpdChcIlxcblwiKTtcbiAgICByZXR1cm4gbGluZXM7XG4gIH1cbn1cbiJdfQ==