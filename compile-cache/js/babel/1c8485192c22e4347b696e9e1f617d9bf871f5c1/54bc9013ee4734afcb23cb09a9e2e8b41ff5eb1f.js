Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/** @jsx etch.dom */

var _etch = require("etch");

var _etch2 = _interopRequireDefault(_etch);

"use babel";
var ProgressIndicator = (function () {
  function ProgressIndicator() {
    _classCallCheck(this, ProgressIndicator);

    _etch2["default"].createElement(this);
  }

  _createClass(ProgressIndicator, [{
    key: "render",
    value: function render() {
      return _etch2["default"].dom(
        "div",
        { className: "latex-progress-indicator inline-block" },
        _etch2["default"].dom(
          "span",
          { className: "inline-block" },
          "Compiling TeX file"
        ),
        _etch2["default"].dom(
          "span",
          { className: "dot one" },
          "."
        ),
        _etch2["default"].dom(
          "span",
          { className: "dot two" },
          "."
        ),
        _etch2["default"].dom(
          "span",
          { className: "dot three" },
          "."
        )
      );
    }
  }]);

  return ProgressIndicator;
})();

exports["default"] = ProgressIndicator;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL3N0YXR1cy1iYXIvcHJvZ3Jlc3MtaW5kaWNhdG9yLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztvQkFHaUIsTUFBTTs7OztBQUh2QixXQUFXLENBQUM7SUFLUyxpQkFBaUI7QUFDekIsV0FEUSxpQkFBaUIsR0FDdEI7MEJBREssaUJBQWlCOztBQUVsQyxzQkFBSyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7R0FDMUI7O2VBSGtCLGlCQUFpQjs7V0FLOUIsa0JBQUc7QUFDUCxhQUNFOztVQUFLLFNBQVMsRUFBQyx1Q0FBdUM7UUFDcEQ7O1lBQU0sU0FBUyxFQUFDLGNBQWM7O1NBQTBCO1FBQ3hEOztZQUFNLFNBQVMsRUFBQyxTQUFTOztTQUFTO1FBQ2xDOztZQUFNLFNBQVMsRUFBQyxTQUFTOztTQUFTO1FBQ2xDOztZQUFNLFNBQVMsRUFBQyxXQUFXOztTQUFTO09BQ2hDLENBQ047S0FDSDs7O1NBZGtCLGlCQUFpQjs7O3FCQUFqQixpQkFBaUIiLCJmaWxlIjoiL2hvbWUvY2luX2NoYWxpYy8uYXRvbS9wYWNrYWdlcy9sYXRleC9saWIvc3RhdHVzLWJhci9wcm9ncmVzcy1pbmRpY2F0b3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBiYWJlbFwiO1xuLyoqIEBqc3ggZXRjaC5kb20gKi9cblxuaW1wb3J0IGV0Y2ggZnJvbSBcImV0Y2hcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUHJvZ3Jlc3NJbmRpY2F0b3Ige1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBldGNoLmNyZWF0ZUVsZW1lbnQodGhpcyk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwibGF0ZXgtcHJvZ3Jlc3MtaW5kaWNhdG9yIGlubGluZS1ibG9ja1wiPlxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJpbmxpbmUtYmxvY2tcIj5Db21waWxpbmcgVGVYIGZpbGU8L3NwYW4+XG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImRvdCBvbmVcIj4uPC9zcGFuPlxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJkb3QgdHdvXCI+Ljwvc3Bhbj5cbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZG90IHRocmVlXCI+Ljwvc3Bhbj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cbiJdfQ==