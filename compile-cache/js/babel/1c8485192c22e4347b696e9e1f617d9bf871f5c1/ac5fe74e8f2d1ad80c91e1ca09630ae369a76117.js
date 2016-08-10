Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _opener = require("../opener");

var _opener2 = _interopRequireDefault(_opener);

var _child_process = require("child_process");

var _child_process2 = _interopRequireDefault(_child_process);

"use babel";

var OkularOpener = (function (_Opener) {
  function OkularOpener() {
    _classCallCheck(this, OkularOpener);

    _get(Object.getPrototypeOf(OkularOpener.prototype), "constructor", this).apply(this, arguments);
  }

  _inherits(OkularOpener, _Opener);

  _createClass(OkularOpener, [{
    key: "open",
    value: function open(filePath, texPath, lineNumber, callback) {
      var command = "\"" + atom.config.get("latex.okularPath") + "\" --unique \"" + filePath + "#src:" + lineNumber + " " + texPath + "\"";

      _child_process2["default"].exec(command, function (error) {
        if (callback) {
          callback(error ? error.code : 0);
        }
      });
    }
  }]);

  return OkularOpener;
})(_opener2["default"]);

exports["default"] = OkularOpener;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL29wZW5lcnMvb2t1bGFyLW9wZW5lci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztzQkFFbUIsV0FBVzs7Ozs2QkFDSixlQUFlOzs7O0FBSHpDLFdBQVcsQ0FBQzs7SUFLUyxZQUFZO1dBQVosWUFBWTswQkFBWixZQUFZOzsrQkFBWixZQUFZOzs7WUFBWixZQUFZOztlQUFaLFlBQVk7O1dBQzNCLGNBQUMsUUFBUSxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFO0FBQzVDLFVBQU0sT0FBTyxVQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGtCQUFrQixDQUFDLHNCQUFnQixRQUFRLGFBQVEsVUFBVSxTQUFJLE9BQU8sT0FBRyxDQUFDOztBQUVoSCxpQ0FBYyxJQUFJLENBQUMsT0FBTyxFQUFFLFVBQUMsS0FBSyxFQUFLO0FBQ3JDLFlBQUksUUFBUSxFQUFFO0FBQ1osa0JBQVEsQ0FBQyxBQUFDLEtBQUssR0FBSSxLQUFLLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDO1NBQ3BDO09BQ0YsQ0FBQyxDQUFDO0tBQ0o7OztTQVRrQixZQUFZOzs7cUJBQVosWUFBWSIsImZpbGUiOiIvaG9tZS9jaW5fY2hhbGljLy5hdG9tL3BhY2thZ2VzL2xhdGV4L2xpYi9vcGVuZXJzL29rdWxhci1vcGVuZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBiYWJlbFwiO1xuXG5pbXBvcnQgT3BlbmVyIGZyb20gXCIuLi9vcGVuZXJcIjtcbmltcG9ydCBjaGlsZF9wcm9jZXNzIGZyb20gXCJjaGlsZF9wcm9jZXNzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE9rdWxhck9wZW5lciBleHRlbmRzIE9wZW5lciB7XG4gIG9wZW4oZmlsZVBhdGgsIHRleFBhdGgsIGxpbmVOdW1iZXIsIGNhbGxiYWNrKSB7XG4gICAgY29uc3QgY29tbWFuZCA9IGBcIiR7YXRvbS5jb25maWcuZ2V0KFwibGF0ZXgub2t1bGFyUGF0aFwiKX1cXFwiIC0tdW5pcXVlIFwiJHtmaWxlUGF0aH0jc3JjOiR7bGluZU51bWJlcn0gJHt0ZXhQYXRofVwiYDtcblxuICAgIGNoaWxkX3Byb2Nlc3MuZXhlYyhjb21tYW5kLCAoZXJyb3IpID0+IHtcbiAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICBjYWxsYmFjaygoZXJyb3IpID8gZXJyb3IuY29kZSA6IDApO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG4iXX0=