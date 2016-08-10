Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/** @jsx etch.dom */

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _etch = require("etch");

var _etch2 = _interopRequireDefault(_etch);

"use babel";
var ErrorIndicator = (function () {
  function ErrorIndicator(model) {
    _classCallCheck(this, ErrorIndicator);

    this.model = model;

    _etch2["default"].createElement(this);
    this.subscribeToEvents();
  }

  _createClass(ErrorIndicator, [{
    key: "render",
    value: function render() {
      return _etch2["default"].dom(
        "div",
        { className: "latex-error-indicator inline-block" },
        _etch2["default"].dom(
          "a",
          null,
          "LaTeX compilation error"
        )
      );
    }
  }, {
    key: "subscribeToEvents",
    value: function subscribeToEvents() {
      var _this = this;

      var clickHandler = function clickHandler() {
        return _this.openLogFile();
      };
      this.element.querySelector("a").addEventListener("click", clickHandler);
    }
  }, {
    key: "openLogFile",
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
    key: "getFirstErrorPosition",
    value: function getFirstErrorPosition() {
      var position = _lodash2["default"].first(_lodash2["default"].pluck(this.model.errors, "logPosition"));
      return position || [0, 0];
    }
  }]);

  return ErrorIndicator;
})();

exports["default"] = ErrorIndicator;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL3N0YXR1cy1iYXIvZXJyb3ItaW5kaWNhdG9yLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztzQkFHYyxRQUFROzs7O29CQUNMLE1BQU07Ozs7QUFKdkIsV0FBVyxDQUFDO0lBTVMsY0FBYztBQUN0QixXQURRLGNBQWMsQ0FDckIsS0FBSyxFQUFFOzBCQURBLGNBQWM7O0FBRS9CLFFBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDOztBQUVuQixzQkFBSyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDekIsUUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7R0FDMUI7O2VBTmtCLGNBQWM7O1dBUTNCLGtCQUFHO0FBQ1AsYUFDRTs7VUFBSyxTQUFTLEVBQUMsb0NBQW9DO1FBQ2pEOzs7O1NBQThCO09BQzFCLENBQ047S0FDSDs7O1dBRWdCLDZCQUFHOzs7QUFDbEIsVUFBTSxZQUFZLEdBQUcsU0FBZixZQUFZO2VBQVMsTUFBSyxXQUFXLEVBQUU7T0FBQSxDQUFDO0FBQzlDLFVBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxZQUFZLENBQUMsQ0FBQztLQUN6RTs7O1dBRVUsdUJBQUc7OztBQUNaLFVBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFO0FBQUUsZUFBTztPQUFFOztBQUU1QixVQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFBLE1BQU0sRUFBSTtBQUN6RCxZQUFNLFFBQVEsR0FBRyxPQUFLLHFCQUFxQixFQUFFLENBQUM7QUFDOUMsY0FBTSxDQUFDLHNCQUFzQixDQUFDLFFBQVEsRUFBRSxFQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDO09BQ3pELENBQUMsQ0FBQztLQUNKOzs7V0FFb0IsaUNBQUc7QUFDdEIsVUFBTSxRQUFRLEdBQUcsb0JBQUUsS0FBSyxDQUFDLG9CQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxhQUFhLENBQUMsQ0FBQyxDQUFDO0FBQ3BFLGFBQU8sUUFBUSxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0tBQzNCOzs7U0FqQ2tCLGNBQWM7OztxQkFBZCxjQUFjIiwiZmlsZSI6Ii9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL3N0YXR1cy1iYXIvZXJyb3ItaW5kaWNhdG9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2UgYmFiZWxcIjtcbi8qKiBAanN4IGV0Y2guZG9tICovXG5cbmltcG9ydCBfIGZyb20gXCJsb2Rhc2hcIjtcbmltcG9ydCBldGNoIGZyb20gXCJldGNoXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVycm9ySW5kaWNhdG9yIHtcbiAgY29uc3RydWN0b3IobW9kZWwpIHtcbiAgICB0aGlzLm1vZGVsID0gbW9kZWw7XG5cbiAgICBldGNoLmNyZWF0ZUVsZW1lbnQodGhpcyk7XG4gICAgdGhpcy5zdWJzY3JpYmVUb0V2ZW50cygpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImxhdGV4LWVycm9yLWluZGljYXRvciBpbmxpbmUtYmxvY2tcIj5cbiAgICAgICAgPGE+TGFUZVggY29tcGlsYXRpb24gZXJyb3I8L2E+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG5cbiAgc3Vic2NyaWJlVG9FdmVudHMoKSB7XG4gICAgY29uc3QgY2xpY2tIYW5kbGVyID0gKCkgPT4gdGhpcy5vcGVuTG9nRmlsZSgpO1xuICAgIHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiYVwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgY2xpY2tIYW5kbGVyKTtcbiAgfVxuXG4gIG9wZW5Mb2dGaWxlKCkge1xuICAgIGlmICghdGhpcy5tb2RlbCkgeyByZXR1cm47IH1cblxuICAgIGF0b20ud29ya3NwYWNlLm9wZW4odGhpcy5tb2RlbC5sb2dGaWxlUGF0aCkudGhlbihlZGl0b3IgPT4ge1xuICAgICAgY29uc3QgcG9zaXRpb24gPSB0aGlzLmdldEZpcnN0RXJyb3JQb3NpdGlvbigpO1xuICAgICAgZWRpdG9yLnNjcm9sbFRvQnVmZmVyUG9zaXRpb24ocG9zaXRpb24sIHtjZW50ZXI6IHRydWV9KTtcbiAgICB9KTtcbiAgfVxuXG4gIGdldEZpcnN0RXJyb3JQb3NpdGlvbigpIHtcbiAgICBjb25zdCBwb3NpdGlvbiA9IF8uZmlyc3QoXy5wbHVjayh0aGlzLm1vZGVsLmVycm9ycywgXCJsb2dQb3NpdGlvblwiKSk7XG4gICAgcmV0dXJuIHBvc2l0aW9uIHx8IFswLCAwXTtcbiAgfVxufVxuIl19
//# sourceURL=/home/cin_chalic/.atom/packages/latex/lib/status-bar/error-indicator.js
