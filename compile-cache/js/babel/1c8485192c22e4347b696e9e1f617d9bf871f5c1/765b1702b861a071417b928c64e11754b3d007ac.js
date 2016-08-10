"use babel";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

function createSpan(html) {
  var span = document.createElement("span");
  span.innerHTML = html;

  for (var _len = arguments.length, classes = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    classes[_key - 1] = arguments[_key];
  }

  span.className = classes.join(" ");

  return span;
}

var ProgressIndicatorView = (function (_HTMLElement) {
  function ProgressIndicatorView() {
    _classCallCheck(this, ProgressIndicatorView);

    _get(Object.getPrototypeOf(ProgressIndicatorView.prototype), "constructor", this).apply(this, arguments);
  }

  _inherits(ProgressIndicatorView, _HTMLElement);

  _createClass(ProgressIndicatorView, [{
    key: "createdCallback",
    value: function createdCallback() {
      this.classList.add("inline-block");

      this.appendChild(createSpan("Compiling TeX file", "inline-block"));
      this.appendChild(createSpan(".", "dot", "one"));
      this.appendChild(createSpan(".", "dot", "two"));
      this.appendChild(createSpan(".", "dot", "three"));
    }
  }]);

  return ProgressIndicatorView;
})(HTMLElement);

exports["default"] = document.registerElement("latex-progress-indicator", {
  prototype: ProgressIndicatorView.prototype
});
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL3ZpZXdzL3Byb2dyZXNzLWluZGljYXRvci12aWV3LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFdBQVcsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7QUFFWixTQUFTLFVBQVUsQ0FBQyxJQUFJLEVBQWM7QUFDcEMsTUFBTSxJQUFJLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUM1QyxNQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQzs7b0NBRkssT0FBTztBQUFQLFdBQU87OztBQUdsQyxNQUFJLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7O0FBRW5DLFNBQU8sSUFBSSxDQUFDO0NBQ2I7O0lBRUsscUJBQXFCO1dBQXJCLHFCQUFxQjswQkFBckIscUJBQXFCOzsrQkFBckIscUJBQXFCOzs7WUFBckIscUJBQXFCOztlQUFyQixxQkFBcUI7O1dBQ1YsMkJBQUc7QUFDaEIsVUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUM7O0FBRW5DLFVBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLG9CQUFvQixFQUFFLGNBQWMsQ0FBQyxDQUFDLENBQUM7QUFDbkUsVUFBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO0FBQ2hELFVBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztBQUNoRCxVQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7S0FDbkQ7OztTQVJHLHFCQUFxQjtHQUFTLFdBQVc7O3FCQVdoQyxRQUFRLENBQUMsZUFBZSxDQUFDLDBCQUEwQixFQUFFO0FBQ2xFLFdBQVMsRUFBRSxxQkFBcUIsQ0FBQyxTQUFTO0NBQzNDLENBQUMiLCJmaWxlIjoiL2hvbWUvY2luX2NoYWxpYy8uYXRvbS9wYWNrYWdlcy9sYXRleC9saWIvdmlld3MvcHJvZ3Jlc3MtaW5kaWNhdG9yLXZpZXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBiYWJlbFwiO1xuXG5mdW5jdGlvbiBjcmVhdGVTcGFuKGh0bWwsIC4uLmNsYXNzZXMpIHtcbiAgY29uc3Qgc3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xuICBzcGFuLmlubmVySFRNTCA9IGh0bWw7XG4gIHNwYW4uY2xhc3NOYW1lID0gY2xhc3Nlcy5qb2luKFwiIFwiKTtcblxuICByZXR1cm4gc3Bhbjtcbn1cblxuY2xhc3MgUHJvZ3Jlc3NJbmRpY2F0b3JWaWV3IGV4dGVuZHMgSFRNTEVsZW1lbnQge1xuICBjcmVhdGVkQ2FsbGJhY2soKSB7XG4gICAgdGhpcy5jbGFzc0xpc3QuYWRkKFwiaW5saW5lLWJsb2NrXCIpO1xuXG4gICAgdGhpcy5hcHBlbmRDaGlsZChjcmVhdGVTcGFuKFwiQ29tcGlsaW5nIFRlWCBmaWxlXCIsIFwiaW5saW5lLWJsb2NrXCIpKTtcbiAgICB0aGlzLmFwcGVuZENoaWxkKGNyZWF0ZVNwYW4oXCIuXCIsIFwiZG90XCIsIFwib25lXCIpKTtcbiAgICB0aGlzLmFwcGVuZENoaWxkKGNyZWF0ZVNwYW4oXCIuXCIsIFwiZG90XCIsIFwidHdvXCIpKTtcbiAgICB0aGlzLmFwcGVuZENoaWxkKGNyZWF0ZVNwYW4oXCIuXCIsIFwiZG90XCIsIFwidGhyZWVcIikpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudChcImxhdGV4LXByb2dyZXNzLWluZGljYXRvclwiLCB7XG4gIHByb3RvdHlwZTogUHJvZ3Jlc3NJbmRpY2F0b3JWaWV3LnByb3RvdHlwZSxcbn0pO1xuIl19