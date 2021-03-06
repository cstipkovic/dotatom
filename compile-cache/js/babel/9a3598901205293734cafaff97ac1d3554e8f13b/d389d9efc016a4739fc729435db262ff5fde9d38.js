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

var PreviewOpener = (function (_Opener) {
  _inherits(PreviewOpener, _Opener);

  function PreviewOpener() {
    _classCallCheck(this, PreviewOpener);

    _get(Object.getPrototypeOf(PreviewOpener.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(PreviewOpener, [{
    key: 'open',
    value: function open(filePath, texPath, lineNumber, callback) {
      // TODO: Nuke this?
      if (typeof texPath === 'function') {
        callback = texPath;
      }

      var command = 'open -g -a Preview.app "' + filePath + '"';
      if (!this.shouldOpenInBackground()) {
        command = command.replace(/\-g\s/, '');
      }

      _child_process2['default'].exec(command, function (error) {
        if (callback) {
          callback(error ? error.code : 0);
        }
      });
    }
  }]);

  return PreviewOpener;
})(_opener2['default']);

exports['default'] = PreviewOpener;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL29wZW5lcnMvcHJldmlldy1vcGVuZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7NkJBRTBCLGVBQWU7Ozs7c0JBQ3RCLFdBQVc7Ozs7QUFIOUIsV0FBVyxDQUFBOztJQUtVLGFBQWE7WUFBYixhQUFhOztXQUFiLGFBQWE7MEJBQWIsYUFBYTs7K0JBQWIsYUFBYTs7O2VBQWIsYUFBYTs7V0FDM0IsY0FBQyxRQUFRLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUU7O0FBRTdDLFVBQUksT0FBTyxPQUFPLEtBQUssVUFBVSxFQUFFO0FBQ2pDLGdCQUFRLEdBQUcsT0FBTyxDQUFBO09BQ25COztBQUVELFVBQUksT0FBTyxnQ0FBOEIsUUFBUSxNQUFHLENBQUE7QUFDcEQsVUFBSSxDQUFDLElBQUksQ0FBQyxzQkFBc0IsRUFBRSxFQUFFO0FBQ2xDLGVBQU8sR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsQ0FBQTtPQUN2Qzs7QUFFRCxpQ0FBYyxJQUFJLENBQUMsT0FBTyxFQUFFLFVBQUMsS0FBSyxFQUFLO0FBQ3JDLFlBQUksUUFBUSxFQUFFO0FBQ1osa0JBQVEsQ0FBQyxBQUFDLEtBQUssR0FBSSxLQUFLLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFBO1NBQ25DO09BQ0YsQ0FBQyxDQUFBO0tBQ0g7OztTQWpCa0IsYUFBYTs7O3FCQUFiLGFBQWEiLCJmaWxlIjoiL2hvbWUvY2luX2NoYWxpYy8uYXRvbS9wYWNrYWdlcy9sYXRleC9saWIvb3BlbmVycy9wcmV2aWV3LW9wZW5lci5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmltcG9ydCBjaGlsZF9wcm9jZXNzIGZyb20gJ2NoaWxkX3Byb2Nlc3MnXG5pbXBvcnQgT3BlbmVyIGZyb20gJy4uL29wZW5lcidcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUHJldmlld09wZW5lciBleHRlbmRzIE9wZW5lciB7XG4gIG9wZW4gKGZpbGVQYXRoLCB0ZXhQYXRoLCBsaW5lTnVtYmVyLCBjYWxsYmFjaykge1xuICAgIC8vIFRPRE86IE51a2UgdGhpcz9cbiAgICBpZiAodHlwZW9mIHRleFBhdGggPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGNhbGxiYWNrID0gdGV4UGF0aFxuICAgIH1cblxuICAgIGxldCBjb21tYW5kID0gYG9wZW4gLWcgLWEgUHJldmlldy5hcHAgXCIke2ZpbGVQYXRofVwiYFxuICAgIGlmICghdGhpcy5zaG91bGRPcGVuSW5CYWNrZ3JvdW5kKCkpIHtcbiAgICAgIGNvbW1hbmQgPSBjb21tYW5kLnJlcGxhY2UoL1xcLWdcXHMvLCAnJylcbiAgICB9XG5cbiAgICBjaGlsZF9wcm9jZXNzLmV4ZWMoY29tbWFuZCwgKGVycm9yKSA9PiB7XG4gICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgY2FsbGJhY2soKGVycm9yKSA/IGVycm9yLmNvZGUgOiAwKVxuICAgICAgfVxuICAgIH0pXG4gIH1cbn1cbiJdfQ==
//# sourceURL=/home/cin_chalic/.atom/packages/latex/lib/openers/preview-opener.js
