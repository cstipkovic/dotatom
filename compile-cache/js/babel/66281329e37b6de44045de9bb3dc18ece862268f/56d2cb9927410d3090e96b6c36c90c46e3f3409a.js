Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _opener = require('../opener');

var _opener2 = _interopRequireDefault(_opener);

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

'use babel';

var CustomOpener = (function (_Opener) {
  _inherits(CustomOpener, _Opener);

  function CustomOpener() {
    _classCallCheck(this, CustomOpener);

    _get(Object.getPrototypeOf(CustomOpener.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(CustomOpener, [{
    key: 'open',

    // Custom PDF viewer cannot support texPath and lineNumber
    value: function open(filePath, texPath, lineNumber, callback) {
      var command = '"' + atom.config.get('latex.viewerPath') + '" "' + filePath + '"';

      _child_process2['default'].exec(command, function (error) {
        if (callback) {
          callback(error ? error.code : 0);
        }
      });
    }
  }]);

  return CustomOpener;
})(_opener2['default']);

exports['default'] = CustomOpener;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL29wZW5lcnMvY3VzdG9tLW9wZW5lci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztzQkFFbUIsV0FBVzs7Ozs2QkFDSixlQUFlOzs7O0FBSHpDLFdBQVcsQ0FBQTs7SUFLVSxZQUFZO1lBQVosWUFBWTs7V0FBWixZQUFZOzBCQUFaLFlBQVk7OytCQUFaLFlBQVk7OztlQUFaLFlBQVk7Ozs7V0FFMUIsY0FBQyxRQUFRLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUU7QUFDN0MsVUFBTSxPQUFPLFNBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLENBQUMsV0FBTSxRQUFRLE1BQUcsQ0FBQTs7QUFFeEUsaUNBQWMsSUFBSSxDQUFDLE9BQU8sRUFBRSxVQUFDLEtBQUssRUFBSztBQUNyQyxZQUFJLFFBQVEsRUFBRTtBQUNaLGtCQUFRLENBQUMsQUFBQyxLQUFLLEdBQUksS0FBSyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQTtTQUNuQztPQUNGLENBQUMsQ0FBQTtLQUNIOzs7U0FWa0IsWUFBWTs7O3FCQUFaLFlBQVkiLCJmaWxlIjoiL2hvbWUvY2luX2NoYWxpYy8uYXRvbS9wYWNrYWdlcy9sYXRleC9saWIvb3BlbmVycy9jdXN0b20tb3BlbmVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuaW1wb3J0IE9wZW5lciBmcm9tICcuLi9vcGVuZXInXG5pbXBvcnQgY2hpbGRfcHJvY2VzcyBmcm9tICdjaGlsZF9wcm9jZXNzJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDdXN0b21PcGVuZXIgZXh0ZW5kcyBPcGVuZXIge1xuICAvLyBDdXN0b20gUERGIHZpZXdlciBjYW5ub3Qgc3VwcG9ydCB0ZXhQYXRoIGFuZCBsaW5lTnVtYmVyXG4gIG9wZW4gKGZpbGVQYXRoLCB0ZXhQYXRoLCBsaW5lTnVtYmVyLCBjYWxsYmFjaykge1xuICAgIGNvbnN0IGNvbW1hbmQgPSBgXCIke2F0b20uY29uZmlnLmdldCgnbGF0ZXgudmlld2VyUGF0aCcpfVwiIFwiJHtmaWxlUGF0aH1cImBcblxuICAgIGNoaWxkX3Byb2Nlc3MuZXhlYyhjb21tYW5kLCAoZXJyb3IpID0+IHtcbiAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICBjYWxsYmFjaygoZXJyb3IpID8gZXJyb3IuY29kZSA6IDApXG4gICAgICB9XG4gICAgfSlcbiAgfVxufVxuIl19
//# sourceURL=/home/cin_chalic/.atom/packages/latex/lib/openers/custom-opener.js
