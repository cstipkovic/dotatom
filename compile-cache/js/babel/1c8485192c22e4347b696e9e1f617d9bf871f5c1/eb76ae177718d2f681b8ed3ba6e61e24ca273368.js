Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _child_process = require("child_process");

var _child_process2 = _interopRequireDefault(_child_process);

var _opener = require("../opener");

var _opener2 = _interopRequireDefault(_opener);

"use babel";

var SumatraOpener = (function (_Opener) {
  function SumatraOpener() {
    _classCallCheck(this, SumatraOpener);

    _get(Object.getPrototypeOf(SumatraOpener.prototype), "constructor", this).apply(this, arguments);
  }

  _inherits(SumatraOpener, _Opener);

  _createClass(SumatraOpener, [{
    key: "open",
    value: function open(filePath, texPath, lineNumber, callback) {
      var sumatraPath = atom.config.get("latex.sumatraPath");
      var args = ["-forward-search", texPath, lineNumber, filePath];

      _child_process2["default"].execFile(sumatraPath, args, function (error) {
        if (callback) {
          callback(error ? error.code : 0);
        }
      });
    }
  }]);

  return SumatraOpener;
})(_opener2["default"]);

exports["default"] = SumatraOpener;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL29wZW5lcnMvc3VtYXRyYS1vcGVuZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7NkJBRTBCLGVBQWU7Ozs7c0JBQ3RCLFdBQVc7Ozs7QUFIOUIsV0FBVyxDQUFDOztJQUtTLGFBQWE7V0FBYixhQUFhOzBCQUFiLGFBQWE7OytCQUFiLGFBQWE7OztZQUFiLGFBQWE7O2VBQWIsYUFBYTs7V0FDNUIsY0FBQyxRQUFRLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUU7QUFDNUMsVUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsbUJBQW1CLENBQUMsQ0FBQztBQUN6RCxVQUFNLElBQUksR0FBRyxDQUNYLGlCQUFpQixFQUNqQixPQUFPLEVBQ1AsVUFBVSxFQUNWLFFBQVEsQ0FDVCxDQUFDOztBQUVGLGlDQUFjLFFBQVEsQ0FBQyxXQUFXLEVBQUUsSUFBSSxFQUFFLFVBQUMsS0FBSyxFQUFLO0FBQ25ELFlBQUksUUFBUSxFQUFFO0FBQ1osa0JBQVEsQ0FBQyxBQUFDLEtBQUssR0FBSSxLQUFLLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDO1NBQ3BDO09BQ0YsQ0FBQyxDQUFDO0tBQ0o7OztTQWZrQixhQUFhOzs7cUJBQWIsYUFBYSIsImZpbGUiOiIvaG9tZS9jaW5fY2hhbGljLy5hdG9tL3BhY2thZ2VzL2xhdGV4L2xpYi9vcGVuZXJzL3N1bWF0cmEtb3BlbmVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2UgYmFiZWxcIjtcblxuaW1wb3J0IGNoaWxkX3Byb2Nlc3MgZnJvbSBcImNoaWxkX3Byb2Nlc3NcIjtcbmltcG9ydCBPcGVuZXIgZnJvbSBcIi4uL29wZW5lclwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTdW1hdHJhT3BlbmVyIGV4dGVuZHMgT3BlbmVyIHtcbiAgb3BlbihmaWxlUGF0aCwgdGV4UGF0aCwgbGluZU51bWJlciwgY2FsbGJhY2spIHtcbiAgICBjb25zdCBzdW1hdHJhUGF0aCA9IGF0b20uY29uZmlnLmdldChcImxhdGV4LnN1bWF0cmFQYXRoXCIpO1xuICAgIGNvbnN0IGFyZ3MgPSBbXG4gICAgICBcIi1mb3J3YXJkLXNlYXJjaFwiLFxuICAgICAgdGV4UGF0aCxcbiAgICAgIGxpbmVOdW1iZXIsXG4gICAgICBmaWxlUGF0aCxcbiAgICBdO1xuXG4gICAgY2hpbGRfcHJvY2Vzcy5leGVjRmlsZShzdW1hdHJhUGF0aCwgYXJncywgKGVycm9yKSA9PiB7XG4gICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgY2FsbGJhY2soKGVycm9yKSA/IGVycm9yLmNvZGUgOiAwKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuIl19