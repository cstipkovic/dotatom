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

var OkularOpener = (function (_Opener) {
  _inherits(OkularOpener, _Opener);

  function OkularOpener() {
    _classCallCheck(this, OkularOpener);

    _get(Object.getPrototypeOf(OkularOpener.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(OkularOpener, [{
    key: 'open',
    value: function open(filePath, texPath, lineNumber, callback) {
      var command = '"' + atom.config.get('latex.okularPath') + '" --unique "' + filePath + '#src:' + lineNumber + ' ' + texPath + '"';

      _child_process2['default'].exec(command, function (error) {
        if (callback) {
          callback(error ? error.code : 0);
        }
      });
    }
  }]);

  return OkularOpener;
})(_opener2['default']);

exports['default'] = OkularOpener;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL29wZW5lcnMvb2t1bGFyLW9wZW5lci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztzQkFFbUIsV0FBVzs7Ozs2QkFDSixlQUFlOzs7O0FBSHpDLFdBQVcsQ0FBQTs7SUFLVSxZQUFZO1lBQVosWUFBWTs7V0FBWixZQUFZOzBCQUFaLFlBQVk7OytCQUFaLFlBQVk7OztlQUFaLFlBQVk7O1dBQzFCLGNBQUMsUUFBUSxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFO0FBQzdDLFVBQU0sT0FBTyxTQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGtCQUFrQixDQUFDLG9CQUFlLFFBQVEsYUFBUSxVQUFVLFNBQUksT0FBTyxNQUFHLENBQUE7O0FBRTlHLGlDQUFjLElBQUksQ0FBQyxPQUFPLEVBQUUsVUFBQyxLQUFLLEVBQUs7QUFDckMsWUFBSSxRQUFRLEVBQUU7QUFDWixrQkFBUSxDQUFDLEFBQUMsS0FBSyxHQUFJLEtBQUssQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUE7U0FDbkM7T0FDRixDQUFDLENBQUE7S0FDSDs7O1NBVGtCLFlBQVk7OztxQkFBWixZQUFZIiwiZmlsZSI6Ii9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL29wZW5lcnMvb2t1bGFyLW9wZW5lci5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmltcG9ydCBPcGVuZXIgZnJvbSAnLi4vb3BlbmVyJ1xuaW1wb3J0IGNoaWxkX3Byb2Nlc3MgZnJvbSAnY2hpbGRfcHJvY2VzcydcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgT2t1bGFyT3BlbmVyIGV4dGVuZHMgT3BlbmVyIHtcbiAgb3BlbiAoZmlsZVBhdGgsIHRleFBhdGgsIGxpbmVOdW1iZXIsIGNhbGxiYWNrKSB7XG4gICAgY29uc3QgY29tbWFuZCA9IGBcIiR7YXRvbS5jb25maWcuZ2V0KCdsYXRleC5va3VsYXJQYXRoJyl9XCIgLS11bmlxdWUgXCIke2ZpbGVQYXRofSNzcmM6JHtsaW5lTnVtYmVyfSAke3RleFBhdGh9XCJgXG5cbiAgICBjaGlsZF9wcm9jZXNzLmV4ZWMoY29tbWFuZCwgKGVycm9yKSA9PiB7XG4gICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgY2FsbGJhY2soKGVycm9yKSA/IGVycm9yLmNvZGUgOiAwKVxuICAgICAgfVxuICAgIH0pXG4gIH1cbn1cbiJdfQ==
//# sourceURL=/home/cin_chalic/.atom/packages/latex/lib/openers/okular-opener.js
