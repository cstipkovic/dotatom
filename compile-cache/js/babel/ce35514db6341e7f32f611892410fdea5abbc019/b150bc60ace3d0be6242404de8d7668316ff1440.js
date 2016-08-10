Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

var _werkzeug = require('../werkzeug');

var _opener = require('../opener');

var _opener2 = _interopRequireDefault(_opener);

'use babel';

var SkimOpener = (function (_Opener) {
  _inherits(SkimOpener, _Opener);

  function SkimOpener() {
    _classCallCheck(this, SkimOpener);

    _get(Object.getPrototypeOf(SkimOpener.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(SkimOpener, [{
    key: 'open',
    value: function open(filePath, texPath, lineNumber, callback) {
      var skimPath = atom.config.get('latex.skimPath');
      var shouldActivate = !this.shouldOpenInBackground();
      var command = (0, _werkzeug.heredoc)('\n      osascript -e       "\n      set theLine to \\"' + lineNumber + '\\" as integer\n      set theFile to POSIX file \\"' + filePath + '\\"\n      set theSource to POSIX file \\"' + texPath + '\\"\n      set thePath to POSIX path of (theFile as alias)\n      tell application \\"' + skimPath + '\\"\n        if ' + shouldActivate + ' then activate\n        try\n          set theDocs to get documents whose path is thePath\n          if (count of theDocs) > 0 then revert theDocs\n        end try\n        open theFile\n        tell front document to go to TeX line theLine from theSource\n      end tell\n      "\n      ');

      _child_process2['default'].exec(command, function (error) {
        if (callback) {
          callback(error ? error.code : 0);
        }
      });
    }
  }]);

  return SkimOpener;
})(_opener2['default']);

exports['default'] = SkimOpener;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL29wZW5lcnMvc2tpbS1vcGVuZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7NkJBRXlCLGVBQWU7Ozs7d0JBQ2xCLGFBQWE7O3NCQUNoQixXQUFXOzs7O0FBSjlCLFdBQVcsQ0FBQTs7SUFNVSxVQUFVO1lBQVYsVUFBVTs7V0FBVixVQUFVOzBCQUFWLFVBQVU7OytCQUFWLFVBQVU7OztlQUFWLFVBQVU7O1dBQ3hCLGNBQUMsUUFBUSxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFO0FBQzdDLFVBQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLENBQUE7QUFDbEQsVUFBTSxjQUFjLEdBQUcsQ0FBQyxJQUFJLENBQUMsc0JBQXNCLEVBQUUsQ0FBQTtBQUNyRCxVQUFNLE9BQU8sR0FBRyxrRkFHTyxVQUFVLDJEQUNDLFFBQVEsa0RBQ04sT0FBTyw4RkFFbEIsUUFBUSx3QkFDeEIsY0FBYyxzU0FTbkIsQ0FBQTs7QUFFSixpQ0FBYSxJQUFJLENBQUMsT0FBTyxFQUFFLFVBQUMsS0FBSyxFQUFLO0FBQ3BDLFlBQUksUUFBUSxFQUFFO0FBQ1osa0JBQVEsQ0FBQyxBQUFDLEtBQUssR0FBSSxLQUFLLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFBO1NBQ25DO09BQ0YsQ0FBQyxDQUFBO0tBQ0g7OztTQTVCa0IsVUFBVTs7O3FCQUFWLFVBQVUiLCJmaWxlIjoiL2hvbWUvY2luX2NoYWxpYy8uYXRvbS9wYWNrYWdlcy9sYXRleC9saWIvb3BlbmVycy9za2ltLW9wZW5lci5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmltcG9ydCBjaGlsZFByb2Nlc3MgZnJvbSAnY2hpbGRfcHJvY2VzcydcbmltcG9ydCB7aGVyZWRvY30gZnJvbSAnLi4vd2Vya3pldWcnXG5pbXBvcnQgT3BlbmVyIGZyb20gJy4uL29wZW5lcidcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2tpbU9wZW5lciBleHRlbmRzIE9wZW5lciB7XG4gIG9wZW4gKGZpbGVQYXRoLCB0ZXhQYXRoLCBsaW5lTnVtYmVyLCBjYWxsYmFjaykge1xuICAgIGNvbnN0IHNraW1QYXRoID0gYXRvbS5jb25maWcuZ2V0KCdsYXRleC5za2ltUGF0aCcpXG4gICAgY29uc3Qgc2hvdWxkQWN0aXZhdGUgPSAhdGhpcy5zaG91bGRPcGVuSW5CYWNrZ3JvdW5kKClcbiAgICBjb25zdCBjb21tYW5kID0gaGVyZWRvYyhgXG4gICAgICBvc2FzY3JpcHQgLWUgXFxcbiAgICAgIFwiXG4gICAgICBzZXQgdGhlTGluZSB0byBcXFxcXFxcIiR7bGluZU51bWJlcn1cXFxcXFxcIiBhcyBpbnRlZ2VyXG4gICAgICBzZXQgdGhlRmlsZSB0byBQT1NJWCBmaWxlIFxcXFxcXFwiJHtmaWxlUGF0aH1cXFxcXFxcIlxuICAgICAgc2V0IHRoZVNvdXJjZSB0byBQT1NJWCBmaWxlIFxcXFxcXFwiJHt0ZXhQYXRofVxcXFxcXFwiXG4gICAgICBzZXQgdGhlUGF0aCB0byBQT1NJWCBwYXRoIG9mICh0aGVGaWxlIGFzIGFsaWFzKVxuICAgICAgdGVsbCBhcHBsaWNhdGlvbiBcXFxcXFxcIiR7c2tpbVBhdGh9XFxcXFxcXCJcbiAgICAgICAgaWYgJHtzaG91bGRBY3RpdmF0ZX0gdGhlbiBhY3RpdmF0ZVxuICAgICAgICB0cnlcbiAgICAgICAgICBzZXQgdGhlRG9jcyB0byBnZXQgZG9jdW1lbnRzIHdob3NlIHBhdGggaXMgdGhlUGF0aFxuICAgICAgICAgIGlmIChjb3VudCBvZiB0aGVEb2NzKSA+IDAgdGhlbiByZXZlcnQgdGhlRG9jc1xuICAgICAgICBlbmQgdHJ5XG4gICAgICAgIG9wZW4gdGhlRmlsZVxuICAgICAgICB0ZWxsIGZyb250IGRvY3VtZW50IHRvIGdvIHRvIFRlWCBsaW5lIHRoZUxpbmUgZnJvbSB0aGVTb3VyY2VcbiAgICAgIGVuZCB0ZWxsXG4gICAgICBcIlxuICAgICAgYClcblxuICAgIGNoaWxkUHJvY2Vzcy5leGVjKGNvbW1hbmQsIChlcnJvcikgPT4ge1xuICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgIGNhbGxiYWNrKChlcnJvcikgPyBlcnJvci5jb2RlIDogMClcbiAgICAgIH1cbiAgICB9KVxuICB9XG59XG4iXX0=
//# sourceURL=/home/cin_chalic/.atom/packages/latex/lib/openers/skim-opener.js
