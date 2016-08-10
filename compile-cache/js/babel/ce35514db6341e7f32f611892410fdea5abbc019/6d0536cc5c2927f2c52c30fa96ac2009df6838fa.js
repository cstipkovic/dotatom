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

    _etch2['default'].initialize(this);
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
    key: 'update',
    value: function update(model) {
      return _etch2['default'].update(this);
    }
  }, {
    key: 'subscribeToEvents',
    value: function subscribeToEvents() {
      var _this = this;

      console.debug(this);
      var clickHandler = function clickHandler() {
        return _this.openLogFile();
      };
      this.element.querySelector('a').addEventListener('click', clickHandler);
    }
  }, {
    key: 'openLogFile',
    value: function openLogFile() {
      var _this2 = this;

      if (!this.model || !this.model.errors) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL3N0YXR1cy1iYXIvZXJyb3ItaW5kaWNhdG9yLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztzQkFHYyxRQUFROzs7O29CQUNMLE1BQU07Ozs7QUFKdkIsV0FBVyxDQUFBO0lBTVUsY0FBYztBQUNyQixXQURPLGNBQWMsQ0FDcEIsS0FBSyxFQUFFOzBCQURELGNBQWM7O0FBRS9CLFFBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFBOztBQUVsQixzQkFBSyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUE7QUFDckIsUUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUE7R0FDekI7O2VBTmtCLGNBQWM7O1dBUTFCLGtCQUFHO0FBQ1IsYUFDRTs7VUFBSyxTQUFTLEVBQUMsb0NBQW9DO1FBQ2pEOzs7O1NBQThCO09BQzFCLENBQ1A7S0FDRjs7O1dBRU0sZ0JBQUMsS0FBSyxFQUFFO0FBQ2IsYUFBTyxrQkFBSyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUE7S0FDekI7OztXQUVpQiw2QkFBRzs7O0FBQ25CLGFBQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUE7QUFDbkIsVUFBTSxZQUFZLEdBQUcsU0FBZixZQUFZO2VBQVMsTUFBSyxXQUFXLEVBQUU7T0FBQSxDQUFBO0FBQzdDLFVBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxZQUFZLENBQUMsQ0FBQTtLQUN4RTs7O1dBRVcsdUJBQUc7OztBQUNiLFVBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUU7QUFBRSxlQUFNO09BQUU7O0FBRWpELFVBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUEsTUFBTSxFQUFJO0FBQ3pELFlBQU0sUUFBUSxHQUFHLE9BQUsscUJBQXFCLEVBQUUsQ0FBQTtBQUM3QyxjQUFNLENBQUMsc0JBQXNCLENBQUMsUUFBUSxFQUFFLEVBQUMsTUFBTSxFQUFFLElBQUksRUFBQyxDQUFDLENBQUE7T0FDeEQsQ0FBQyxDQUFBO0tBQ0g7OztXQUVxQixpQ0FBRztBQUN2QixVQUFNLFFBQVEsR0FBRyxvQkFBRSxLQUFLLENBQUMsb0JBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLGFBQWEsQ0FBQyxDQUFDLENBQUE7QUFDakUsYUFBTyxRQUFRLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUE7S0FDMUI7OztTQXRDa0IsY0FBYzs7O3FCQUFkLGNBQWMiLCJmaWxlIjoiL2hvbWUvY2luX2NoYWxpYy8uYXRvbS9wYWNrYWdlcy9sYXRleC9saWIvc3RhdHVzLWJhci9lcnJvci1pbmRpY2F0b3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuLyoqIEBqc3ggZXRjaC5kb20gKi9cblxuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJ1xuaW1wb3J0IGV0Y2ggZnJvbSAnZXRjaCdcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRXJyb3JJbmRpY2F0b3Ige1xuICBjb25zdHJ1Y3RvciAobW9kZWwpIHtcbiAgICB0aGlzLm1vZGVsID0gbW9kZWxcblxuICAgIGV0Y2guaW5pdGlhbGl6ZSh0aGlzKVxuICAgIHRoaXMuc3Vic2NyaWJlVG9FdmVudHMoKVxuICB9XG5cbiAgcmVuZGVyICgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9J2xhdGV4LWVycm9yLWluZGljYXRvciBpbmxpbmUtYmxvY2snPlxuICAgICAgICA8YT5MYVRlWCBjb21waWxhdGlvbiBlcnJvcjwvYT5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHVwZGF0ZSAobW9kZWwpIHtcbiAgICByZXR1cm4gZXRjaC51cGRhdGUodGhpcylcbiAgfVxuXG4gIHN1YnNjcmliZVRvRXZlbnRzICgpIHtcbiAgICBjb25zb2xlLmRlYnVnKHRoaXMpXG4gICAgY29uc3QgY2xpY2tIYW5kbGVyID0gKCkgPT4gdGhpcy5vcGVuTG9nRmlsZSgpXG4gICAgdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ2EnKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGNsaWNrSGFuZGxlcilcbiAgfVxuXG4gIG9wZW5Mb2dGaWxlICgpIHtcbiAgICBpZiAoIXRoaXMubW9kZWwgfHwgIXRoaXMubW9kZWwuZXJyb3JzKSB7IHJldHVybiB9XG5cbiAgICBhdG9tLndvcmtzcGFjZS5vcGVuKHRoaXMubW9kZWwubG9nRmlsZVBhdGgpLnRoZW4oZWRpdG9yID0+IHtcbiAgICAgIGNvbnN0IHBvc2l0aW9uID0gdGhpcy5nZXRGaXJzdEVycm9yUG9zaXRpb24oKVxuICAgICAgZWRpdG9yLnNjcm9sbFRvQnVmZmVyUG9zaXRpb24ocG9zaXRpb24sIHtjZW50ZXI6IHRydWV9KVxuICAgIH0pXG4gIH1cblxuICBnZXRGaXJzdEVycm9yUG9zaXRpb24gKCkge1xuICAgIGNvbnN0IHBvc2l0aW9uID0gXy5maXJzdChfLm1hcCh0aGlzLm1vZGVsLmVycm9ycywgJ2xvZ1Bvc2l0aW9uJykpXG4gICAgcmV0dXJuIHBvc2l0aW9uIHx8IFswLCAwXVxuICB9XG59XG4iXX0=
//# sourceURL=/home/cin_chalic/.atom/packages/latex/lib/status-bar/error-indicator.js
