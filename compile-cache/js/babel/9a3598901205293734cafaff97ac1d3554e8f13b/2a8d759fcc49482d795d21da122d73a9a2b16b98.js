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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL3dlcmt6ZXVnLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7c0JBRWMsUUFBUTs7OztBQUZ0QixXQUFXLENBQUM7O0FBSUwsU0FBUyxPQUFPLENBQUMsS0FBSyxFQUFFO0FBQzdCLE1BQUksS0FBSyxLQUFLLElBQUksRUFBRTtBQUFFLFdBQU8sSUFBSSxDQUFDO0dBQUU7O0FBRXBDLE1BQU0sS0FBSyxHQUFHLG9CQUFFLFNBQVMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxFQUFFLFVBQUEsSUFBSTtXQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssQ0FBQztHQUFBLENBQUMsQ0FBQztBQUNoRixNQUFNLFlBQVksR0FBRyxvQkFBRSxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLFVBQUEsSUFBSTtXQUFJLElBQUksS0FBSyxHQUFHO0dBQUEsQ0FBQyxDQUFDLE1BQU0sQ0FBQztBQUN4RSxNQUFNLGNBQWMsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLFVBQUEsSUFBSTtXQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDO0dBQUEsQ0FBQyxDQUFDOztBQUVuRSxTQUFPLGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7Q0FDbEMiLCJmaWxlIjoiL2hvbWUvY2luX2NoYWxpYy8uYXRvbS9wYWNrYWdlcy9sYXRleC9saWIvd2Vya3pldWcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBiYWJlbFwiO1xuXG5pbXBvcnQgXyBmcm9tIFwibG9kYXNoXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBoZXJlZG9jKGlucHV0KSB7XG4gIGlmIChpbnB1dCA9PT0gbnVsbCkgeyByZXR1cm4gbnVsbDsgfVxuXG4gIGNvbnN0IGxpbmVzID0gXy5kcm9wV2hpbGUoaW5wdXQuc3BsaXQoL1xcclxcbnxcXG58XFxyLyksIGxpbmUgPT4gbGluZS5sZW5ndGggPT09IDApO1xuICBjb25zdCBpbmRlbnRMZW5ndGggPSBfLnRha2VXaGlsZShsaW5lc1swXSwgY2hhciA9PiBjaGFyID09PSBcIiBcIikubGVuZ3RoO1xuICBjb25zdCB0cnVuY2F0ZWRMaW5lcyA9IGxpbmVzLm1hcChsaW5lID0+IGxpbmUuc2xpY2UoaW5kZW50TGVuZ3RoKSk7XG5cbiAgcmV0dXJuIHRydW5jYXRlZExpbmVzLmpvaW4oXCJcXG5cIik7XG59XG4iXX0=
//# sourceURL=/home/cin_chalic/.atom/packages/latex/lib/werkzeug.js
