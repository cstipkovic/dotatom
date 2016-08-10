Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.heredoc = heredoc;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

"use babel";

function heredoc(input) {
  if (input === null) {
    return null;
  }

  var lines = _lodash2["default"].dropWhile(input.split(/\r\n|\n|\r/), function (line) {
    return line.length === 0;
  });
  var indentLength = _lodash2["default"].takeWhile(lines[0], function (char) {
    return char === " ";
  }).length;
  var truncatedLines = lines.map(function (line) {
    return line.slice(indentLength);
  });

  return truncatedLines.join("\n");
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL3dlcmt6ZXVnLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztRQUlnQixPQUFPLEdBQVAsT0FBTzs7OztzQkFGVCxRQUFROzs7O0FBRnRCLFdBQVcsQ0FBQzs7QUFJTCxTQUFTLE9BQU8sQ0FBQyxLQUFLLEVBQUU7QUFDN0IsTUFBSSxLQUFLLEtBQUssSUFBSSxFQUFFO0FBQUUsV0FBTyxJQUFJLENBQUM7R0FBRTs7QUFFcEMsTUFBTSxLQUFLLEdBQUcsb0JBQUUsU0FBUyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLEVBQUUsVUFBQSxJQUFJO1dBQUksSUFBSSxDQUFDLE1BQU0sS0FBSyxDQUFDO0dBQUEsQ0FBQyxDQUFDO0FBQ2hGLE1BQU0sWUFBWSxHQUFHLG9CQUFFLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsVUFBQSxJQUFJO1dBQUksSUFBSSxLQUFLLEdBQUc7R0FBQSxDQUFDLENBQUMsTUFBTSxDQUFDO0FBQ3hFLE1BQU0sY0FBYyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsVUFBQSxJQUFJO1dBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUM7R0FBQSxDQUFDLENBQUM7O0FBRW5FLFNBQU8sY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztDQUNsQyIsImZpbGUiOiIvaG9tZS9jaW5fY2hhbGljLy5hdG9tL3BhY2thZ2VzL2xhdGV4L2xpYi93ZXJremV1Zy5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIGJhYmVsXCI7XG5cbmltcG9ydCBfIGZyb20gXCJsb2Rhc2hcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIGhlcmVkb2MoaW5wdXQpIHtcbiAgaWYgKGlucHV0ID09PSBudWxsKSB7IHJldHVybiBudWxsOyB9XG5cbiAgY29uc3QgbGluZXMgPSBfLmRyb3BXaGlsZShpbnB1dC5zcGxpdCgvXFxyXFxufFxcbnxcXHIvKSwgbGluZSA9PiBsaW5lLmxlbmd0aCA9PT0gMCk7XG4gIGNvbnN0IGluZGVudExlbmd0aCA9IF8udGFrZVdoaWxlKGxpbmVzWzBdLCBjaGFyID0+IGNoYXIgPT09IFwiIFwiKS5sZW5ndGg7XG4gIGNvbnN0IHRydW5jYXRlZExpbmVzID0gbGluZXMubWFwKGxpbmUgPT4gbGluZS5zbGljZShpbmRlbnRMZW5ndGgpKTtcblxuICByZXR1cm4gdHJ1bmNhdGVkTGluZXMuam9pbihcIlxcblwiKTtcbn1cbiJdfQ==