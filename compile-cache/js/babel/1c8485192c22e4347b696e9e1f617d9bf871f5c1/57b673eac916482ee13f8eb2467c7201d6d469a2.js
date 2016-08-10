Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

"use babel";

var ErrorIndicatorView = (function (_HTMLElement) {
  function ErrorIndicatorView() {
    _classCallCheck(this, ErrorIndicatorView);

    _get(Object.getPrototypeOf(ErrorIndicatorView.prototype), "constructor", this).apply(this, arguments);

    this.model = null;
  }

  _inherits(ErrorIndicatorView, _HTMLElement);

  _createClass(ErrorIndicatorView, [{
    key: "createdCallback",
    value: function createdCallback() {
      var _this = this;

      this.classList.add("inline-block");

      var messageElement = document.createElement("a");
      this.appendChild(messageElement);
      messageElement.innerText = "LaTeX compilation error";
      messageElement.addEventListener("click", function () {
        _this.openLogFile();
      });
    }
  }, {
    key: "initialize",
    value: function initialize(model) {
      this.setModel(model);
    }
  }, {
    key: "setModel",
    value: function setModel(model) {
      this.model = model;
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

  return ErrorIndicatorView;
})(HTMLElement);

exports["default"] = document.registerElement("latex-error-indicator", {
  prototype: ErrorIndicatorView.prototype
});
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL3ZpZXdzL2Vycm9yLWluZGljYXRvci12aWV3LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O3NCQUVjLFFBQVE7Ozs7QUFGdEIsV0FBVyxDQUFDOztJQUlOLGtCQUFrQjtXQUFsQixrQkFBa0I7MEJBQWxCLGtCQUFrQjs7K0JBQWxCLGtCQUFrQjs7U0FDdEIsS0FBSyxHQUFHLElBQUk7OztZQURSLGtCQUFrQjs7ZUFBbEIsa0JBQWtCOztXQUdQLDJCQUFHOzs7QUFDaEIsVUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUM7O0FBRW5DLFVBQU0sY0FBYyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDbkQsVUFBSSxDQUFDLFdBQVcsQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUNqQyxvQkFBYyxDQUFDLFNBQVMsR0FBRyx5QkFBeUIsQ0FBQztBQUNyRCxvQkFBYyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxZQUFNO0FBQUUsY0FBSyxXQUFXLEVBQUUsQ0FBQztPQUFFLENBQUMsQ0FBQztLQUN6RTs7O1dBRVMsb0JBQUMsS0FBSyxFQUFFO0FBQ2hCLFVBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDdEI7OztXQUVPLGtCQUFDLEtBQUssRUFBRTtBQUNkLFVBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0tBQ3BCOzs7V0FFVSx1QkFBRzs7O0FBQ1osVUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUU7QUFBRSxlQUFPO09BQUU7O0FBRTVCLFVBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUEsTUFBTSxFQUFJO0FBQ3pELFlBQU0sUUFBUSxHQUFHLE9BQUsscUJBQXFCLEVBQUUsQ0FBQztBQUM5QyxjQUFNLENBQUMsc0JBQXNCLENBQUMsUUFBUSxFQUFFLEVBQUMsTUFBTSxFQUFFLElBQUksRUFBQyxDQUFDLENBQUM7T0FDekQsQ0FBQyxDQUFDO0tBQ0o7OztXQUVvQixpQ0FBRztBQUN0QixVQUFNLFFBQVEsR0FBRyxvQkFBRSxLQUFLLENBQUMsb0JBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLGFBQWEsQ0FBQyxDQUFDLENBQUM7QUFDcEUsYUFBTyxRQUFRLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7S0FDM0I7OztTQWhDRyxrQkFBa0I7R0FBUyxXQUFXOztxQkFtQzdCLFFBQVEsQ0FBQyxlQUFlLENBQUMsdUJBQXVCLEVBQUU7QUFDL0QsV0FBUyxFQUFFLGtCQUFrQixDQUFDLFNBQVM7Q0FDeEMsQ0FBQyIsImZpbGUiOiIvaG9tZS9jaW5fY2hhbGljLy5hdG9tL3BhY2thZ2VzL2xhdGV4L2xpYi92aWV3cy9lcnJvci1pbmRpY2F0b3Itdmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIGJhYmVsXCI7XG5cbmltcG9ydCBfIGZyb20gXCJsb2Rhc2hcIjtcblxuY2xhc3MgRXJyb3JJbmRpY2F0b3JWaWV3IGV4dGVuZHMgSFRNTEVsZW1lbnQge1xuICBtb2RlbCA9IG51bGw7XG5cbiAgY3JlYXRlZENhbGxiYWNrKCkge1xuICAgIHRoaXMuY2xhc3NMaXN0LmFkZChcImlubGluZS1ibG9ja1wiKTtcblxuICAgIGNvbnN0IG1lc3NhZ2VFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7XG4gICAgdGhpcy5hcHBlbmRDaGlsZChtZXNzYWdlRWxlbWVudCk7XG4gICAgbWVzc2FnZUVsZW1lbnQuaW5uZXJUZXh0ID0gXCJMYVRlWCBjb21waWxhdGlvbiBlcnJvclwiO1xuICAgIG1lc3NhZ2VFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7IHRoaXMub3BlbkxvZ0ZpbGUoKTsgfSk7XG4gIH1cblxuICBpbml0aWFsaXplKG1vZGVsKSB7XG4gICAgdGhpcy5zZXRNb2RlbChtb2RlbCk7XG4gIH1cblxuICBzZXRNb2RlbChtb2RlbCkge1xuICAgIHRoaXMubW9kZWwgPSBtb2RlbDtcbiAgfVxuXG4gIG9wZW5Mb2dGaWxlKCkge1xuICAgIGlmICghdGhpcy5tb2RlbCkgeyByZXR1cm47IH1cblxuICAgIGF0b20ud29ya3NwYWNlLm9wZW4odGhpcy5tb2RlbC5sb2dGaWxlUGF0aCkudGhlbihlZGl0b3IgPT4ge1xuICAgICAgY29uc3QgcG9zaXRpb24gPSB0aGlzLmdldEZpcnN0RXJyb3JQb3NpdGlvbigpO1xuICAgICAgZWRpdG9yLnNjcm9sbFRvQnVmZmVyUG9zaXRpb24ocG9zaXRpb24sIHtjZW50ZXI6IHRydWV9KTtcbiAgICB9KTtcbiAgfVxuXG4gIGdldEZpcnN0RXJyb3JQb3NpdGlvbigpIHtcbiAgICBjb25zdCBwb3NpdGlvbiA9IF8uZmlyc3QoXy5wbHVjayh0aGlzLm1vZGVsLmVycm9ycywgXCJsb2dQb3NpdGlvblwiKSk7XG4gICAgcmV0dXJuIHBvc2l0aW9uIHx8IFswLCAwXTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBkb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoXCJsYXRleC1lcnJvci1pbmRpY2F0b3JcIiwge1xuICBwcm90b3R5cGU6IEVycm9ySW5kaWNhdG9yVmlldy5wcm90b3R5cGUsXG59KTtcbiJdfQ==