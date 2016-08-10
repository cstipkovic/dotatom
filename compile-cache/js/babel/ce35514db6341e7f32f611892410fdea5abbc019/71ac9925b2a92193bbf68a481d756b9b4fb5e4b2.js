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
var IndentationStatusView = (function () {
  function IndentationStatusView(model) {
    _classCallCheck(this, IndentationStatusView);

    this.model = model;

    _etch2['default'].initialize(this);
  }

  _createClass(IndentationStatusView, [{
    key: 'render',
    value: function render() {
      return _etch2['default'].dom(
        'div',
        { className: 'indentation-status-view inline-block' },
        this.model.getText()
      );
    }
  }, {
    key: 'update',
    value: function update() {
      return _etch2['default'].update(this);
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      return _etch2['default'].destroy(this);
    }
  }]);

  return IndentationStatusView;
})();

exports['default'] = IndentationStatusView;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvaW5kZW50YXRpb24taW5kaWNhdG9yL2xpYi9pbmRlbnRhdGlvbi1zdGF0dXMtdmlldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7b0JBR2lCLE1BQU07Ozs7QUFIdkIsV0FBVyxDQUFBO0lBS1UscUJBQXFCO0FBQzVCLFdBRE8scUJBQXFCLENBQzNCLEtBQUssRUFBRTswQkFERCxxQkFBcUI7O0FBRXRDLFFBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFBOztBQUVsQixzQkFBSyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUE7R0FDdEI7O2VBTGtCLHFCQUFxQjs7V0FPakMsa0JBQUc7QUFDUixhQUNFOztVQUFLLFNBQVMsRUFBQyxzQ0FBc0M7UUFDbEQsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUU7T0FDakIsQ0FDUDtLQUNGOzs7V0FFTSxrQkFBRztBQUNSLGFBQU8sa0JBQUssTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFBO0tBQ3pCOzs7V0FFTyxtQkFBRztBQUNULGFBQU8sa0JBQUssT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFBO0tBQzFCOzs7U0FyQmtCLHFCQUFxQjs7O3FCQUFyQixxQkFBcUIiLCJmaWxlIjoiL2hvbWUvY2luX2NoYWxpYy8uYXRvbS9wYWNrYWdlcy9pbmRlbnRhdGlvbi1pbmRpY2F0b3IvbGliL2luZGVudGF0aW9uLXN0YXR1cy12aWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcbi8qKiBAanN4IGV0Y2guZG9tICovXG5cbmltcG9ydCBldGNoIGZyb20gJ2V0Y2gnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEluZGVudGF0aW9uU3RhdHVzVmlldyB7XG4gIGNvbnN0cnVjdG9yIChtb2RlbCkge1xuICAgIHRoaXMubW9kZWwgPSBtb2RlbFxuXG4gICAgZXRjaC5pbml0aWFsaXplKHRoaXMpXG4gIH1cblxuICByZW5kZXIgKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImluZGVudGF0aW9uLXN0YXR1cy12aWV3IGlubGluZS1ibG9ja1wiPlxuICAgICAgICB7dGhpcy5tb2RlbC5nZXRUZXh0KCl9XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICB1cGRhdGUgKCkge1xuICAgIHJldHVybiBldGNoLnVwZGF0ZSh0aGlzKVxuICB9XG5cbiAgZGVzdHJveSAoKSB7XG4gICAgcmV0dXJuIGV0Y2guZGVzdHJveSh0aGlzKVxuICB9XG59XG4iXX0=
//# sourceURL=/home/cin_chalic/.atom/packages/indentation-indicator/lib/indentation-status-view.js
