Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

/** @jsx etch.dom */

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _etch = require('etch');

var _etch2 = _interopRequireDefault(_etch);

'use babel';
var ErrorIndicator = (function () {
  function ErrorIndicator(model) {
    _classCallCheck(this, ErrorIndicator);

    this.model = model;

    _etch2['default'].createElement(this);
    this.subscribeToEvents();
  }

  _createClass(ErrorIndicator, [{
    key: 'render',
    value: function render() {
      return _etch2['default'].dom(
        'div',
        { className: 'latex-error-indicator inline-block' },
        _etch2['default'].dom(
          'a',
          null,
          'LaTeX compilation error'
        )
      );
    }
  }, {
    key: 'subscribeToEvents',
    value: function subscribeToEvents() {
      var _this = this;

      var clickHandler = function clickHandler() {
        return _this.openLogFile();
      };
      this.element.querySelector('a').addEventListener('click', clickHandler);
    }
  }, {
    key: 'openLogFile',
    value: function openLogFile() {
      var _this2 = this;

      if (!this.model) {
        return;
      }

      atom.workspace.open(this.model.logFilePath).then(function (editor) {
        var position = _this2.getFirstErrorPosition();
        editor.scrollToBufferPosition(position, { center: true });
      });
    }
  }, {
    key: 'getFirstErrorPosition',
    value: function getFirstErrorPosition() {
      var position = _lodash2['default'].first(_lodash2['default'].map(this.model.errors, 'logPosition'));
      return position || [0, 0];
    }
  }]);

  return ErrorIndicator;
})();

exports['default'] = ErrorIndicator;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL3N0YXR1cy1iYXIvZXJyb3ItaW5kaWNhdG9yLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztzQkFHYyxRQUFROzs7O29CQUNMLE1BQU07Ozs7QUFKdkIsV0FBVyxDQUFBO0lBTVUsY0FBYztBQUNyQixXQURPLGNBQWMsQ0FDcEIsS0FBSyxFQUFFOzBCQURELGNBQWM7O0FBRS9CLFFBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFBOztBQUVsQixzQkFBSyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUE7QUFDeEIsUUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUE7R0FDekI7O2VBTmtCLGNBQWM7O1dBUTFCLGtCQUFHO0FBQ1IsYUFDRTs7VUFBSyxTQUFTLEVBQUMsb0NBQW9DO1FBQ2pEOzs7O1NBQThCO09BQzFCLENBQ1A7S0FDRjs7O1dBRWlCLDZCQUFHOzs7QUFDbkIsVUFBTSxZQUFZLEdBQUcsU0FBZixZQUFZO2VBQVMsTUFBSyxXQUFXLEVBQUU7T0FBQSxDQUFBO0FBQzdDLFVBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxZQUFZLENBQUMsQ0FBQTtLQUN4RTs7O1dBRVcsdUJBQUc7OztBQUNiLFVBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFO0FBQUUsZUFBTTtPQUFFOztBQUUzQixVQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFBLE1BQU0sRUFBSTtBQUN6RCxZQUFNLFFBQVEsR0FBRyxPQUFLLHFCQUFxQixFQUFFLENBQUE7QUFDN0MsY0FBTSxDQUFDLHNCQUFzQixDQUFDLFFBQVEsRUFBRSxFQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFBO09BQ3hELENBQUMsQ0FBQTtLQUNIOzs7V0FFcUIsaUNBQUc7QUFDdkIsVUFBTSxRQUFRLEdBQUcsb0JBQUUsS0FBSyxDQUFDLG9CQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxhQUFhLENBQUMsQ0FBQyxDQUFBO0FBQ2pFLGFBQU8sUUFBUSxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFBO0tBQzFCOzs7U0FqQ2tCLGNBQWM7OztxQkFBZCxjQUFjIiwiZmlsZSI6Ii9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL3N0YXR1cy1iYXIvZXJyb3ItaW5kaWNhdG9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcbi8qKiBAanN4IGV0Y2guZG9tICovXG5cbmltcG9ydCBfIGZyb20gJ2xvZGFzaCdcbmltcG9ydCBldGNoIGZyb20gJ2V0Y2gnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVycm9ySW5kaWNhdG9yIHtcbiAgY29uc3RydWN0b3IgKG1vZGVsKSB7XG4gICAgdGhpcy5tb2RlbCA9IG1vZGVsXG5cbiAgICBldGNoLmNyZWF0ZUVsZW1lbnQodGhpcylcbiAgICB0aGlzLnN1YnNjcmliZVRvRXZlbnRzKClcbiAgfVxuXG4gIHJlbmRlciAoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPSdsYXRleC1lcnJvci1pbmRpY2F0b3IgaW5saW5lLWJsb2NrJz5cbiAgICAgICAgPGE+TGFUZVggY29tcGlsYXRpb24gZXJyb3I8L2E+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICBzdWJzY3JpYmVUb0V2ZW50cyAoKSB7XG4gICAgY29uc3QgY2xpY2tIYW5kbGVyID0gKCkgPT4gdGhpcy5vcGVuTG9nRmlsZSgpXG4gICAgdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ2EnKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGNsaWNrSGFuZGxlcilcbiAgfVxuXG4gIG9wZW5Mb2dGaWxlICgpIHtcbiAgICBpZiAoIXRoaXMubW9kZWwpIHsgcmV0dXJuIH1cblxuICAgIGF0b20ud29ya3NwYWNlLm9wZW4odGhpcy5tb2RlbC5sb2dGaWxlUGF0aCkudGhlbihlZGl0b3IgPT4ge1xuICAgICAgY29uc3QgcG9zaXRpb24gPSB0aGlzLmdldEZpcnN0RXJyb3JQb3NpdGlvbigpXG4gICAgICBlZGl0b3Iuc2Nyb2xsVG9CdWZmZXJQb3NpdGlvbihwb3NpdGlvbiwge2NlbnRlcjogdHJ1ZX0pXG4gICAgfSlcbiAgfVxuXG4gIGdldEZpcnN0RXJyb3JQb3NpdGlvbiAoKSB7XG4gICAgY29uc3QgcG9zaXRpb24gPSBfLmZpcnN0KF8ubWFwKHRoaXMubW9kZWwuZXJyb3JzLCAnbG9nUG9zaXRpb24nKSlcbiAgICByZXR1cm4gcG9zaXRpb24gfHwgWzAsIDBdXG4gIH1cbn1cbiJdfQ==
//# sourceURL=/home/cin_chalic/.atom/packages/latex/lib/status-bar/error-indicator.js
