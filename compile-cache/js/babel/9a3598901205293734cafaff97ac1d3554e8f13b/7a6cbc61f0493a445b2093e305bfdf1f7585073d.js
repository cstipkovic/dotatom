Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

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
      var args = ['-reuse-instance', '-forward-search', '"' + texPath + '"', '"' + lineNumber + '"', '"' + filePath + '"'];

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL29wZW5lcnMvc3VtYXRyYS1vcGVuZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7NkJBRTBCLGVBQWU7Ozs7c0JBQ3RCLFdBQVc7Ozs7QUFIOUIsV0FBVyxDQUFBOztJQUtVLGFBQWE7WUFBYixhQUFhOztXQUFiLGFBQWE7MEJBQWIsYUFBYTs7K0JBQWIsYUFBYTs7O2VBQWIsYUFBYTs7V0FDM0IsY0FBQyxRQUFRLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUU7QUFDN0MsVUFBTSxXQUFXLFNBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsbUJBQW1CLENBQUMsTUFBRyxDQUFBO0FBQy9ELFVBQU0sSUFBSSxHQUFHLENBQ1gsaUJBQWlCLEVBQ2pCLGlCQUFpQixRQUNiLE9BQU8sY0FDUCxVQUFVLGNBQ1YsUUFBUSxPQUNiLENBQUE7O0FBRUQsVUFBTSxPQUFPLEdBQU0sV0FBVyxTQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEFBQUUsQ0FBQTs7QUFFbEQsaUNBQWMsSUFBSSxDQUFDLE9BQU8sRUFBRSxVQUFDLEtBQUssRUFBSztBQUNyQyxZQUFJLFFBQVEsRUFBRTtBQUNaLGtCQUFRLENBQUMsQUFBQyxLQUFLLEdBQUksS0FBSyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQTtTQUNuQztPQUNGLENBQUMsQ0FBQTtLQUNIOzs7U0FsQmtCLGFBQWE7OztxQkFBYixhQUFhIiwiZmlsZSI6Ii9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL29wZW5lcnMvc3VtYXRyYS1vcGVuZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5pbXBvcnQgY2hpbGRfcHJvY2VzcyBmcm9tICdjaGlsZF9wcm9jZXNzJ1xuaW1wb3J0IE9wZW5lciBmcm9tICcuLi9vcGVuZXInXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFN1bWF0cmFPcGVuZXIgZXh0ZW5kcyBPcGVuZXIge1xuICBvcGVuIChmaWxlUGF0aCwgdGV4UGF0aCwgbGluZU51bWJlciwgY2FsbGJhY2spIHtcbiAgICBjb25zdCBzdW1hdHJhUGF0aCA9IGBcIiR7YXRvbS5jb25maWcuZ2V0KCdsYXRleC5zdW1hdHJhUGF0aCcpfVwiYFxuICAgIGNvbnN0IGFyZ3MgPSBbXG4gICAgICAnLXJldXNlLWluc3RhbmNlJyxcbiAgICAgICctZm9yd2FyZC1zZWFyY2gnLFxuICAgICAgYFwiJHt0ZXhQYXRofVwiYCxcbiAgICAgIGBcIiR7bGluZU51bWJlcn1cImAsXG4gICAgICBgXCIke2ZpbGVQYXRofVwiYFxuICAgIF1cblxuICAgIGNvbnN0IGNvbW1hbmQgPSBgJHtzdW1hdHJhUGF0aH0gJHthcmdzLmpvaW4oJyAnKX1gXG5cbiAgICBjaGlsZF9wcm9jZXNzLmV4ZWMoY29tbWFuZCwgKGVycm9yKSA9PiB7XG4gICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgY2FsbGJhY2soKGVycm9yKSA/IGVycm9yLmNvZGUgOiAwKVxuICAgICAgfVxuICAgIH0pXG4gIH1cbn1cbiJdfQ==
//# sourceURL=/home/cin_chalic/.atom/packages/latex/lib/openers/sumatra-opener.js
