Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

/** @jsx etch.dom */

var _etch = require('etch');

var _etch2 = _interopRequireDefault(_etch);

'use babel';
var ProgressIndicator = (function () {
  function ProgressIndicator() {
    _classCallCheck(this, ProgressIndicator);

    _etch2['default'].initialize(this);
  }

  _createClass(ProgressIndicator, [{
    key: 'render',
    value: function render() {
      return _etch2['default'].dom(
        'div',
        { className: 'latex-progress-indicator inline-block' },
        _etch2['default'].dom(
          'span',
          { className: 'inline-block' },
          'Compiling TeX file'
        ),
        _etch2['default'].dom(
          'span',
          { className: 'dot one' },
          '.'
        ),
        _etch2['default'].dom(
          'span',
          { className: 'dot two' },
          '.'
        ),
        _etch2['default'].dom(
          'span',
          { className: 'dot three' },
          '.'
        )
      );
    }
  }, {
    key: 'update',
    value: function update() {
      return _etch2['default'].update(this);
    }
  }]);

  return ProgressIndicator;
})();

exports['default'] = ProgressIndicator;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL3N0YXR1cy1iYXIvcHJvZ3Jlc3MtaW5kaWNhdG9yLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztvQkFHaUIsTUFBTTs7OztBQUh2QixXQUFXLENBQUE7SUFLVSxpQkFBaUI7QUFDeEIsV0FETyxpQkFBaUIsR0FDckI7MEJBREksaUJBQWlCOztBQUVsQyxzQkFBSyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUE7R0FDdEI7O2VBSGtCLGlCQUFpQjs7V0FLN0Isa0JBQUc7QUFDUixhQUNFOztVQUFLLFNBQVMsRUFBQyx1Q0FBdUM7UUFDcEQ7O1lBQU0sU0FBUyxFQUFDLGNBQWM7O1NBQTBCO1FBQ3hEOztZQUFNLFNBQVMsRUFBQyxTQUFTOztTQUFTO1FBQ2xDOztZQUFNLFNBQVMsRUFBQyxTQUFTOztTQUFTO1FBQ2xDOztZQUFNLFNBQVMsRUFBQyxXQUFXOztTQUFTO09BQ2hDLENBQ1A7S0FDRjs7O1dBRU0sa0JBQUc7QUFDUixhQUFPLGtCQUFLLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQTtLQUN6Qjs7O1NBbEJrQixpQkFBaUI7OztxQkFBakIsaUJBQWlCIiwiZmlsZSI6Ii9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL3N0YXR1cy1iYXIvcHJvZ3Jlc3MtaW5kaWNhdG9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcbi8qKiBAanN4IGV0Y2guZG9tICovXG5cbmltcG9ydCBldGNoIGZyb20gJ2V0Y2gnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFByb2dyZXNzSW5kaWNhdG9yIHtcbiAgY29uc3RydWN0b3IgKCkge1xuICAgIGV0Y2guaW5pdGlhbGl6ZSh0aGlzKVxuICB9XG5cbiAgcmVuZGVyICgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9J2xhdGV4LXByb2dyZXNzLWluZGljYXRvciBpbmxpbmUtYmxvY2snPlxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9J2lubGluZS1ibG9jayc+Q29tcGlsaW5nIFRlWCBmaWxlPC9zcGFuPlxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9J2RvdCBvbmUnPi48L3NwYW4+XG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT0nZG90IHR3byc+Ljwvc3Bhbj5cbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPSdkb3QgdGhyZWUnPi48L3NwYW4+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICB1cGRhdGUgKCkge1xuICAgIHJldHVybiBldGNoLnVwZGF0ZSh0aGlzKVxuICB9XG59XG4iXX0=
//# sourceURL=/home/cin_chalic/.atom/packages/latex/lib/status-bar/progress-indicator.js
