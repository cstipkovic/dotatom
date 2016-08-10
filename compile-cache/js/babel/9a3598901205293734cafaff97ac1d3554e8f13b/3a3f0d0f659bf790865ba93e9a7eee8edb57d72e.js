Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.heredoc = heredoc;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

'use babel';

function heredoc(input) {
  if (input === null) {
    return null;
  }

  var lines = _lodash2['default'].dropWhile(input.split(/\r\n|\n|\r/), function (line) {
    return line.length === 0;
  });
  var indentLength = _lodash2['default'].takeWhile(lines[0], function (char) {
    return char === ' ';
  }).length;
  var truncatedLines = lines.map(function (line) {
    return line.slice(indentLength);
  });

  return truncatedLines.join('\n');
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL3dlcmt6ZXVnLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7c0JBRWMsUUFBUTs7OztBQUZ0QixXQUFXLENBQUE7O0FBSUosU0FBUyxPQUFPLENBQUUsS0FBSyxFQUFFO0FBQzlCLE1BQUksS0FBSyxLQUFLLElBQUksRUFBRTtBQUFFLFdBQU8sSUFBSSxDQUFBO0dBQUU7O0FBRW5DLE1BQU0sS0FBSyxHQUFHLG9CQUFFLFNBQVMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxFQUFFLFVBQUEsSUFBSTtXQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssQ0FBQztHQUFBLENBQUMsQ0FBQTtBQUMvRSxNQUFNLFlBQVksR0FBRyxvQkFBRSxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLFVBQUEsSUFBSTtXQUFJLElBQUksS0FBSyxHQUFHO0dBQUEsQ0FBQyxDQUFDLE1BQU0sQ0FBQTtBQUN2RSxNQUFNLGNBQWMsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLFVBQUEsSUFBSTtXQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDO0dBQUEsQ0FBQyxDQUFBOztBQUVsRSxTQUFPLGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7Q0FDakMiLCJmaWxlIjoiL2hvbWUvY2luX2NoYWxpYy8uYXRvbS9wYWNrYWdlcy9sYXRleC9saWIvd2Vya3pldWcuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnXG5cbmV4cG9ydCBmdW5jdGlvbiBoZXJlZG9jIChpbnB1dCkge1xuICBpZiAoaW5wdXQgPT09IG51bGwpIHsgcmV0dXJuIG51bGwgfVxuXG4gIGNvbnN0IGxpbmVzID0gXy5kcm9wV2hpbGUoaW5wdXQuc3BsaXQoL1xcclxcbnxcXG58XFxyLyksIGxpbmUgPT4gbGluZS5sZW5ndGggPT09IDApXG4gIGNvbnN0IGluZGVudExlbmd0aCA9IF8udGFrZVdoaWxlKGxpbmVzWzBdLCBjaGFyID0+IGNoYXIgPT09ICcgJykubGVuZ3RoXG4gIGNvbnN0IHRydW5jYXRlZExpbmVzID0gbGluZXMubWFwKGxpbmUgPT4gbGluZS5zbGljZShpbmRlbnRMZW5ndGgpKVxuXG4gIHJldHVybiB0cnVuY2F0ZWRMaW5lcy5qb2luKCdcXG4nKVxufVxuIl19
//# sourceURL=/home/cin_chalic/.atom/packages/latex/lib/werkzeug.js
