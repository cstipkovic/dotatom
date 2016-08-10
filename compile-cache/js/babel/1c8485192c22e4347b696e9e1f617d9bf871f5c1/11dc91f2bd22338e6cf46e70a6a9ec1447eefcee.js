Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _libLogger = require("../lib/logger");

var _libLogger2 = _interopRequireDefault(_libLogger);

var _libOpener = require("../lib/opener");

var _libOpener2 = _interopRequireDefault(_libOpener);

"use babel";

var NullLogger = (function (_Logger) {
  function NullLogger() {
    _classCallCheck(this, NullLogger);

    _get(Object.getPrototypeOf(NullLogger.prototype), "constructor", this).apply(this, arguments);
  }

  _inherits(NullLogger, _Logger);

  _createClass(NullLogger, [{
    key: "error",
    value: function error() {}
  }, {
    key: "warning",
    value: function warning() {}
  }, {
    key: "info",
    value: function info() {}
  }]);

  return NullLogger;
})(_libLogger2["default"]);

exports.NullLogger = NullLogger;

var NullOpener = (function (_Opener) {
  function NullOpener() {
    _classCallCheck(this, NullOpener);

    _get(Object.getPrototypeOf(NullOpener.prototype), "constructor", this).apply(this, arguments);
  }

  _inherits(NullOpener, _Opener);

  _createClass(NullOpener, [{
    key: "open",
    value: function open() {}
  }]);

  return NullOpener;
})(_libOpener2["default"]);

exports.NullOpener = NullOpener;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvc3BlYy9zdHVicy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozt5QkFFbUIsZUFBZTs7Ozt5QkFDZixlQUFlOzs7O0FBSGxDLFdBQVcsQ0FBQzs7SUFLQyxVQUFVO1dBQVYsVUFBVTswQkFBVixVQUFVOzsrQkFBVixVQUFVOzs7WUFBVixVQUFVOztlQUFWLFVBQVU7O1dBQ2hCLGlCQUFHLEVBQUU7OztXQUNILG1CQUFHLEVBQUU7OztXQUNSLGdCQUFHLEVBQUU7OztTQUhFLFVBQVU7OztRQUFWLFVBQVUsR0FBVixVQUFVOztJQU1WLFVBQVU7V0FBVixVQUFVOzBCQUFWLFVBQVU7OytCQUFWLFVBQVU7OztZQUFWLFVBQVU7O2VBQVYsVUFBVTs7V0FDakIsZ0JBQUcsRUFBRTs7O1NBREUsVUFBVTs7O1FBQVYsVUFBVSxHQUFWLFVBQVUiLCJmaWxlIjoiL2hvbWUvY2luX2NoYWxpYy8uYXRvbS9wYWNrYWdlcy9sYXRleC9zcGVjL3N0dWJzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2UgYmFiZWxcIjtcblxuaW1wb3J0IExvZ2dlciBmcm9tIFwiLi4vbGliL2xvZ2dlclwiO1xuaW1wb3J0IE9wZW5lciBmcm9tIFwiLi4vbGliL29wZW5lclwiO1xuXG5leHBvcnQgY2xhc3MgTnVsbExvZ2dlciBleHRlbmRzIExvZ2dlciB7XG4gIGVycm9yKCkge31cbiAgd2FybmluZygpIHt9XG4gIGluZm8oKSB7fVxufVxuXG5leHBvcnQgY2xhc3MgTnVsbE9wZW5lciBleHRlbmRzIE9wZW5lciB7XG4gIG9wZW4oKSB7fVxufVxuIl19