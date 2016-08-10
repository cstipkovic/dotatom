Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _logger = require("../logger");

var _logger2 = _interopRequireDefault(_logger);

var _werkzeug = require("../werkzeug");

"use babel";

var ConsoleLogger = (function (_Logger) {
  function ConsoleLogger() {
    _classCallCheck(this, ConsoleLogger);

    _get(Object.getPrototypeOf(ConsoleLogger.prototype), "constructor", this).apply(this, arguments);
  }

  _inherits(ConsoleLogger, _Logger);

  _createClass(ConsoleLogger, [{
    key: "error",
    value: function error(statusCode, result, builder) {
      console.group("LaTeX errors");
      switch (statusCode) {
        case 127:
          {
            var executable = builder.executable;
            console.log((0, _werkzeug.heredoc)("\n          %cTeXification failed! Builder executable \"" + executable + "\" not found.\n\n            latex.texPath\n              as configured: " + atom.config.get("latex.texPath") + "\n              when resolved: " + builder.constructPath() + "\n\n          Make sure latex.texPath is configured correctly; either adjust it           via the settings view, or directly in your config.cson file.\n          "), "color: red");
            break;
          }
        default:
          {
            if (result && result.errors) {
              console.group("TeXification failed with status code " + statusCode);
              var _iteratorNormalCompletion = true;
              var _didIteratorError = false;
              var _iteratorError = undefined;

              try {
                for (var _iterator = result.errors[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                  var error = _step.value;

                  console.log("%c" + error.filePath + ":" + error.lineNumber + ": " + error.message, "color: red");
                }
              } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
              } finally {
                try {
                  if (!_iteratorNormalCompletion && _iterator["return"]) {
                    _iterator["return"]();
                  }
                } finally {
                  if (_didIteratorError) {
                    throw _iteratorError;
                  }
                }
              }

              console.groupEnd();
            } else {
              console.log("%cTeXification failed with status code " + statusCode, "color: red");
            }
          }
      }
      console.groupEnd();
    }
  }, {
    key: "warning",
    value: function warning(message) {
      console.group("LaTeX warnings");
      console.log(message);
      console.groupEnd();
    }
  }]);

  return ConsoleLogger;
})(_logger2["default"]);

exports["default"] = ConsoleLogger;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL2xvZ2dlcnMvY29uc29sZS1sb2dnZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7c0JBRW1CLFdBQVc7Ozs7d0JBQ1IsYUFBYTs7QUFIbkMsV0FBVyxDQUFDOztJQUtTLGFBQWE7V0FBYixhQUFhOzBCQUFiLGFBQWE7OytCQUFiLGFBQWE7OztZQUFiLGFBQWE7O2VBQWIsYUFBYTs7V0FDM0IsZUFBQyxVQUFVLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRTtBQUNqQyxhQUFPLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQzlCLGNBQVEsVUFBVTtBQUNoQixhQUFLLEdBQUc7QUFBRTtBQUNSLGdCQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDO0FBQ3RDLG1CQUFPLENBQUMsR0FBRyxDQUFDLGNBUlosT0FBTywrREFTd0MsVUFBVSxpRkFHbEMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLHVDQUNoQyxPQUFPLENBQUMsYUFBYSxFQUFFLHdLQUkxQyxFQUFFLFlBQVksQ0FBQyxDQUFDO0FBQ3BCLGtCQUFNO1dBQ1A7QUFBQSxBQUNEO0FBQVM7QUFDUCxnQkFBSSxNQUFNLElBQUksTUFBTSxDQUFDLE1BQU0sRUFBRTtBQUMzQixxQkFBTyxDQUFDLEtBQUssMkNBQXlDLFVBQVUsQ0FBRyxDQUFDOzs7Ozs7QUFDcEUscUNBQW9CLE1BQU0sQ0FBQyxNQUFNLDhIQUFFO3NCQUF4QixLQUFLOztBQUNkLHlCQUFPLENBQUMsR0FBRyxRQUFNLEtBQUssQ0FBQyxRQUFRLFNBQUksS0FBSyxDQUFDLFVBQVUsVUFBSyxLQUFLLENBQUMsT0FBTyxFQUFJLFlBQVksQ0FBQyxDQUFDO2lCQUN4Rjs7Ozs7Ozs7Ozs7Ozs7OztBQUNELHFCQUFPLENBQUMsUUFBUSxFQUFFLENBQUM7YUFDcEIsTUFDSTtBQUNILHFCQUFPLENBQUMsR0FBRyw2Q0FBMkMsVUFBVSxFQUFJLFlBQVksQ0FBQyxDQUFDO2FBQ25GO1dBQ0Y7QUFBQSxPQUNGO0FBQ0QsYUFBTyxDQUFDLFFBQVEsRUFBRSxDQUFDO0tBQ3BCOzs7V0FFTSxpQkFBQyxPQUFPLEVBQUU7QUFDZixhQUFPLENBQUMsS0FBSyxDQUFDLGdCQUFnQixDQUFDLENBQUM7QUFDaEMsYUFBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUNyQixhQUFPLENBQUMsUUFBUSxFQUFFLENBQUM7S0FDcEI7OztTQXRDa0IsYUFBYTs7O3FCQUFiLGFBQWEiLCJmaWxlIjoiL2hvbWUvY2luX2NoYWxpYy8uYXRvbS9wYWNrYWdlcy9sYXRleC9saWIvbG9nZ2Vycy9jb25zb2xlLWxvZ2dlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIGJhYmVsXCI7XG5cbmltcG9ydCBMb2dnZXIgZnJvbSBcIi4uL2xvZ2dlclwiO1xuaW1wb3J0IHtoZXJlZG9jfSBmcm9tIFwiLi4vd2Vya3pldWdcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29uc29sZUxvZ2dlciBleHRlbmRzIExvZ2dlciB7XG4gIGVycm9yKHN0YXR1c0NvZGUsIHJlc3VsdCwgYnVpbGRlcikge1xuICAgIGNvbnNvbGUuZ3JvdXAoXCJMYVRlWCBlcnJvcnNcIik7XG4gICAgc3dpdGNoIChzdGF0dXNDb2RlKSB7XG4gICAgICBjYXNlIDEyNzoge1xuICAgICAgICBjb25zdCBleGVjdXRhYmxlID0gYnVpbGRlci5leGVjdXRhYmxlO1xuICAgICAgICBjb25zb2xlLmxvZyhoZXJlZG9jKGBcbiAgICAgICAgICAlY1RlWGlmaWNhdGlvbiBmYWlsZWQhIEJ1aWxkZXIgZXhlY3V0YWJsZSBcIiR7ZXhlY3V0YWJsZX1cIiBub3QgZm91bmQuXG5cbiAgICAgICAgICAgIGxhdGV4LnRleFBhdGhcbiAgICAgICAgICAgICAgYXMgY29uZmlndXJlZDogJHthdG9tLmNvbmZpZy5nZXQoXCJsYXRleC50ZXhQYXRoXCIpfVxuICAgICAgICAgICAgICB3aGVuIHJlc29sdmVkOiAke2J1aWxkZXIuY29uc3RydWN0UGF0aCgpfVxuXG4gICAgICAgICAgTWFrZSBzdXJlIGxhdGV4LnRleFBhdGggaXMgY29uZmlndXJlZCBjb3JyZWN0bHk7IGVpdGhlciBhZGp1c3QgaXQgXFxcbiAgICAgICAgICB2aWEgdGhlIHNldHRpbmdzIHZpZXcsIG9yIGRpcmVjdGx5IGluIHlvdXIgY29uZmlnLmNzb24gZmlsZS5cbiAgICAgICAgICBgKSwgXCJjb2xvcjogcmVkXCIpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGRlZmF1bHQ6IHtcbiAgICAgICAgaWYgKHJlc3VsdCAmJiByZXN1bHQuZXJyb3JzKSB7XG4gICAgICAgICAgY29uc29sZS5ncm91cChgVGVYaWZpY2F0aW9uIGZhaWxlZCB3aXRoIHN0YXR1cyBjb2RlICR7c3RhdHVzQ29kZX1gKTtcbiAgICAgICAgICBmb3IgKGNvbnN0IGVycm9yIG9mIHJlc3VsdC5lcnJvcnMpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGAlYyR7ZXJyb3IuZmlsZVBhdGh9OiR7ZXJyb3IubGluZU51bWJlcn06ICR7ZXJyb3IubWVzc2FnZX1gLCBcImNvbG9yOiByZWRcIik7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnNvbGUuZ3JvdXBFbmQoKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhgJWNUZVhpZmljYXRpb24gZmFpbGVkIHdpdGggc3RhdHVzIGNvZGUgJHtzdGF0dXNDb2RlfWAsIFwiY29sb3I6IHJlZFwiKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBjb25zb2xlLmdyb3VwRW5kKCk7XG4gIH1cblxuICB3YXJuaW5nKG1lc3NhZ2UpIHtcbiAgICBjb25zb2xlLmdyb3VwKFwiTGFUZVggd2FybmluZ3NcIik7XG4gICAgY29uc29sZS5sb2cobWVzc2FnZSk7XG4gICAgY29uc29sZS5ncm91cEVuZCgpO1xuICB9XG59XG4iXX0=