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

var _opener = require('../opener');

var _opener2 = _interopRequireDefault(_opener);

'use babel';

var SumatraOpener = (function (_Opener) {
  _inherits(SumatraOpener, _Opener);

  function SumatraOpener() {
    _classCallCheck(this, SumatraOpener);

    _get(Object.getPrototypeOf(SumatraOpener.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(SumatraOpener, [{
    key: 'open',
    value: function open(filePath, texPath, lineNumber, callback) {
      var sumatraPath = '"' + atom.config.get('latex.sumatraPath') + '"';
      var atomPath = '"' + process.argv[0] + '"';
      var args = ['-reuse-instance', '-forward-search', '"' + texPath + '"', '"' + lineNumber + '"', '"' + filePath + '"', '-inverse-search', ['"\\"', '' + atomPath, '\\"'].join(''), '\\"%f:%l\\"'];

      var command = sumatraPath + ' ' + args.join(' ');

      _child_process2['default'].exec(command, function (error) {
        if (callback) {
          callback(error ? error.code : 0);
        }
      });
    }
  }]);

  return SumatraOpener;
})(_opener2['default']);

exports['default'] = SumatraOpener;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL29wZW5lcnMvc3VtYXRyYS1vcGVuZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7NkJBRXlCLGVBQWU7Ozs7c0JBQ3JCLFdBQVc7Ozs7QUFIOUIsV0FBVyxDQUFBOztJQUtVLGFBQWE7WUFBYixhQUFhOztXQUFiLGFBQWE7MEJBQWIsYUFBYTs7K0JBQWIsYUFBYTs7O2VBQWIsYUFBYTs7V0FDM0IsY0FBQyxRQUFRLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUU7QUFDN0MsVUFBTSxXQUFXLFNBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsbUJBQW1CLENBQUMsTUFBRyxDQUFBO0FBQy9ELFVBQU0sUUFBUSxTQUFPLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLE1BQUcsQ0FBQTtBQUN2QyxVQUFNLElBQUksR0FBRyxDQUNYLGlCQUFpQixFQUNqQixpQkFBaUIsUUFDYixPQUFPLGNBQ1AsVUFBVSxjQUNWLFFBQVEsUUFDWixpQkFBaUIsRUFDakIsQ0FBQyxNQUFNLE9BQUssUUFBUSxFQUFJLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFDdkMsYUFBYSxDQUNkLENBQUE7O0FBRUQsVUFBTSxPQUFPLEdBQU0sV0FBVyxTQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEFBQUUsQ0FBQTs7QUFFbEQsaUNBQWEsSUFBSSxDQUFDLE9BQU8sRUFBRSxVQUFDLEtBQUssRUFBSztBQUNwQyxZQUFJLFFBQVEsRUFBRTtBQUNaLGtCQUFRLENBQUMsQUFBQyxLQUFLLEdBQUksS0FBSyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQTtTQUNuQztPQUNGLENBQUMsQ0FBQTtLQUNIOzs7U0F0QmtCLGFBQWE7OztxQkFBYixhQUFhIiwiZmlsZSI6Ii9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL29wZW5lcnMvc3VtYXRyYS1vcGVuZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5pbXBvcnQgY2hpbGRQcm9jZXNzIGZyb20gJ2NoaWxkX3Byb2Nlc3MnXG5pbXBvcnQgT3BlbmVyIGZyb20gJy4uL29wZW5lcidcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3VtYXRyYU9wZW5lciBleHRlbmRzIE9wZW5lciB7XG4gIG9wZW4gKGZpbGVQYXRoLCB0ZXhQYXRoLCBsaW5lTnVtYmVyLCBjYWxsYmFjaykge1xuICAgIGNvbnN0IHN1bWF0cmFQYXRoID0gYFwiJHthdG9tLmNvbmZpZy5nZXQoJ2xhdGV4LnN1bWF0cmFQYXRoJyl9XCJgXG4gICAgY29uc3QgYXRvbVBhdGggPSBgXCIke3Byb2Nlc3MuYXJndlswXX1cImBcbiAgICBjb25zdCBhcmdzID0gW1xuICAgICAgJy1yZXVzZS1pbnN0YW5jZScsXG4gICAgICAnLWZvcndhcmQtc2VhcmNoJyxcbiAgICAgIGBcIiR7dGV4UGF0aH1cImAsXG4gICAgICBgXCIke2xpbmVOdW1iZXJ9XCJgLFxuICAgICAgYFwiJHtmaWxlUGF0aH1cImAsXG4gICAgICAnLWludmVyc2Utc2VhcmNoJyxcbiAgICAgIFsnXCJcXFxcXCInLCBgJHthdG9tUGF0aH1gLCAnXFxcXFwiJ10uam9pbignJyksXG4gICAgICAnXFxcXFwiJWY6JWxcXFxcXCInXG4gICAgXVxuXG4gICAgY29uc3QgY29tbWFuZCA9IGAke3N1bWF0cmFQYXRofSAke2FyZ3Muam9pbignICcpfWBcblxuICAgIGNoaWxkUHJvY2Vzcy5leGVjKGNvbW1hbmQsIChlcnJvcikgPT4ge1xuICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgIGNhbGxiYWNrKChlcnJvcikgPyBlcnJvci5jb2RlIDogMClcbiAgICAgIH1cbiAgICB9KVxuICB9XG59XG4iXX0=
//# sourceURL=/home/cin_chalic/.atom/packages/latex/lib/openers/sumatra-opener.js
