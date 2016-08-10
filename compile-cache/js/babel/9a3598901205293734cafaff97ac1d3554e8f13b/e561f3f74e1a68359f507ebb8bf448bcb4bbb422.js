Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _child_process = require("child_process");

var _child_process2 = _interopRequireDefault(_child_process);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _builder = require("../builder");

var _builder2 = _interopRequireDefault(_builder);

"use babel";

var LatexmkBuilder = (function (_Builder) {
  _inherits(LatexmkBuilder, _Builder);

  function LatexmkBuilder() {
    _classCallCheck(this, LatexmkBuilder);

    _get(Object.getPrototypeOf(LatexmkBuilder.prototype), "constructor", this).call(this);
    this.executable = "latexmk";
  }

  _createClass(LatexmkBuilder, [{
    key: "run",
    value: function run(filePath) {
      var args = this.constructArgs(filePath);
      var command = this.executable + " " + args.join(" ");
      var options = this.constructChildProcessOptions();

      options.cwd = _path2["default"].dirname(filePath); // Run process with sensible CWD.
      options.maxBuffer = 52428800; // Set process' max buffer size to 50 MB.
      options.env.max_print_line = 1000; // Max log file line length.

      return new Promise(function (resolve) {
        // TODO: Add support for killing the process.
        _child_process2["default"].exec(command, options, function (error) {
          resolve(error ? error.code : 0);
        });
      });
    }
  }, {
    key: "constructArgs",
    value: function constructArgs(filePath) {
      var args = ["-interaction=nonstopmode", "-f", "-cd", "-pdf", "-synctex=1", "-file-line-error"];

      var enableShellEscape = atom.config.get("latex.enableShellEscape");
      var customEngine = atom.config.get("latex.customEngine");
      var engine = atom.config.get("latex.engine");

      if (enableShellEscape) {
        args.push("-shell-escape");
      }

      if (customEngine) {
        args.push("-pdflatex=\"" + customEngine + "\"");
      } else if (engine && engine !== "pdflatex") {
        args.push("-" + engine);
      }

      var outdir = this.getOutputDirectory(filePath);
      if (outdir) {
        args.push("-outdir=\"" + outdir + "\"");
      }

      args.push("\"" + filePath + "\"");
      return args;
    }
  }]);

  return LatexmkBuilder;
})(_builder2["default"]);

exports["default"] = LatexmkBuilder;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL2J1aWxkZXJzL2xhdGV4bWsuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7NkJBRTBCLGVBQWU7Ozs7b0JBQ3hCLE1BQU07Ozs7dUJBQ0gsWUFBWTs7OztBQUpoQyxXQUFXLENBQUM7O0lBTVMsY0FBYztZQUFkLGNBQWM7O0FBQ3RCLFdBRFEsY0FBYyxHQUNuQjswQkFESyxjQUFjOztBQUUvQiwrQkFGaUIsY0FBYyw2Q0FFdkI7QUFDUixRQUFJLENBQUMsVUFBVSxHQUFHLFNBQVMsQ0FBQztHQUM3Qjs7ZUFKa0IsY0FBYzs7V0FNOUIsYUFBQyxRQUFRLEVBQUU7QUFDWixVQUFNLElBQUksR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQzFDLFVBQU0sT0FBTyxHQUFNLElBQUksQ0FBQyxVQUFVLFNBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQUFBRSxDQUFDO0FBQ3ZELFVBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyw0QkFBNEIsRUFBRSxDQUFDOztBQUVwRCxhQUFPLENBQUMsR0FBRyxHQUFHLGtCQUFLLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUNyQyxhQUFPLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQztBQUM3QixhQUFPLENBQUMsR0FBRyxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUM7O0FBRWxDLGFBQU8sSUFBSSxPQUFPLENBQUMsVUFBQyxPQUFPLEVBQUs7O0FBRTlCLG1DQUFjLElBQUksQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLFVBQUMsS0FBSyxFQUFLO0FBQzlDLGlCQUFPLENBQUMsQUFBQyxLQUFLLEdBQUksS0FBSyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQztTQUNuQyxDQUFDLENBQUM7T0FDSixDQUFDLENBQUM7S0FDSjs7O1dBRVksdUJBQUMsUUFBUSxFQUFFO0FBQ3RCLFVBQU0sSUFBSSxHQUFHLENBQ1gsMEJBQTBCLEVBQzFCLElBQUksRUFDSixLQUFLLEVBQ0wsTUFBTSxFQUNOLFlBQVksRUFDWixrQkFBa0IsQ0FDbkIsQ0FBQzs7QUFFRixVQUFNLGlCQUFpQixHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLHlCQUF5QixDQUFDLENBQUM7QUFDckUsVUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsb0JBQW9CLENBQUMsQ0FBQztBQUMzRCxVQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQzs7QUFFL0MsVUFBSSxpQkFBaUIsRUFBRTtBQUNyQixZQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO09BQzVCOztBQUVELFVBQUksWUFBWSxFQUFFO0FBQ2hCLFlBQUksQ0FBQyxJQUFJLGtCQUFnQixZQUFZLFFBQUssQ0FBQztPQUM1QyxNQUNJLElBQUksTUFBTSxJQUFJLE1BQU0sS0FBSyxVQUFVLEVBQUU7QUFDeEMsWUFBSSxDQUFDLElBQUksT0FBSyxNQUFNLENBQUcsQ0FBQztPQUN6Qjs7QUFFRCxVQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDL0MsVUFBSSxNQUFNLEVBQUU7QUFDVixZQUFJLENBQUMsSUFBSSxnQkFBYyxNQUFNLFFBQUssQ0FBQztPQUNwQzs7QUFFRCxVQUFJLENBQUMsSUFBSSxRQUFNLFFBQVEsUUFBSyxDQUFDO0FBQzdCLGFBQU8sSUFBSSxDQUFDO0tBQ2I7OztTQXZEa0IsY0FBYzs7O3FCQUFkLGNBQWMiLCJmaWxlIjoiL2hvbWUvY2luX2NoYWxpYy8uYXRvbS9wYWNrYWdlcy9sYXRleC9saWIvYnVpbGRlcnMvbGF0ZXhtay5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIGJhYmVsXCI7XG5cbmltcG9ydCBjaGlsZF9wcm9jZXNzIGZyb20gXCJjaGlsZF9wcm9jZXNzXCI7XG5pbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IEJ1aWxkZXIgZnJvbSBcIi4uL2J1aWxkZXJcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGF0ZXhta0J1aWxkZXIgZXh0ZW5kcyBCdWlsZGVyIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLmV4ZWN1dGFibGUgPSBcImxhdGV4bWtcIjtcbiAgfVxuXG4gIHJ1bihmaWxlUGF0aCkge1xuICAgIGNvbnN0IGFyZ3MgPSB0aGlzLmNvbnN0cnVjdEFyZ3MoZmlsZVBhdGgpO1xuICAgIGNvbnN0IGNvbW1hbmQgPSBgJHt0aGlzLmV4ZWN1dGFibGV9ICR7YXJncy5qb2luKFwiIFwiKX1gO1xuICAgIGNvbnN0IG9wdGlvbnMgPSB0aGlzLmNvbnN0cnVjdENoaWxkUHJvY2Vzc09wdGlvbnMoKTtcblxuICAgIG9wdGlvbnMuY3dkID0gcGF0aC5kaXJuYW1lKGZpbGVQYXRoKTsgLy8gUnVuIHByb2Nlc3Mgd2l0aCBzZW5zaWJsZSBDV0QuXG4gICAgb3B0aW9ucy5tYXhCdWZmZXIgPSA1MjQyODgwMDsgLy8gU2V0IHByb2Nlc3MnIG1heCBidWZmZXIgc2l6ZSB0byA1MCBNQi5cbiAgICBvcHRpb25zLmVudi5tYXhfcHJpbnRfbGluZSA9IDEwMDA7IC8vIE1heCBsb2cgZmlsZSBsaW5lIGxlbmd0aC5cblxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgLy8gVE9ETzogQWRkIHN1cHBvcnQgZm9yIGtpbGxpbmcgdGhlIHByb2Nlc3MuXG4gICAgICBjaGlsZF9wcm9jZXNzLmV4ZWMoY29tbWFuZCwgb3B0aW9ucywgKGVycm9yKSA9PiB7XG4gICAgICAgIHJlc29sdmUoKGVycm9yKSA/IGVycm9yLmNvZGUgOiAwKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgY29uc3RydWN0QXJncyhmaWxlUGF0aCkge1xuICAgIGNvbnN0IGFyZ3MgPSBbXG4gICAgICBcIi1pbnRlcmFjdGlvbj1ub25zdG9wbW9kZVwiLFxuICAgICAgXCItZlwiLFxuICAgICAgXCItY2RcIixcbiAgICAgIFwiLXBkZlwiLFxuICAgICAgXCItc3luY3RleD0xXCIsXG4gICAgICBcIi1maWxlLWxpbmUtZXJyb3JcIixcbiAgICBdO1xuXG4gICAgY29uc3QgZW5hYmxlU2hlbGxFc2NhcGUgPSBhdG9tLmNvbmZpZy5nZXQoXCJsYXRleC5lbmFibGVTaGVsbEVzY2FwZVwiKTtcbiAgICBjb25zdCBjdXN0b21FbmdpbmUgPSBhdG9tLmNvbmZpZy5nZXQoXCJsYXRleC5jdXN0b21FbmdpbmVcIik7XG4gICAgY29uc3QgZW5naW5lID0gYXRvbS5jb25maWcuZ2V0KFwibGF0ZXguZW5naW5lXCIpO1xuXG4gICAgaWYgKGVuYWJsZVNoZWxsRXNjYXBlKSB7XG4gICAgICBhcmdzLnB1c2goXCItc2hlbGwtZXNjYXBlXCIpO1xuICAgIH1cblxuICAgIGlmIChjdXN0b21FbmdpbmUpIHtcbiAgICAgIGFyZ3MucHVzaChgLXBkZmxhdGV4PVxcXCIke2N1c3RvbUVuZ2luZX1cXFwiYCk7XG4gICAgfVxuICAgIGVsc2UgaWYgKGVuZ2luZSAmJiBlbmdpbmUgIT09IFwicGRmbGF0ZXhcIikge1xuICAgICAgYXJncy5wdXNoKGAtJHtlbmdpbmV9YCk7XG4gICAgfVxuXG4gICAgbGV0IG91dGRpciA9IHRoaXMuZ2V0T3V0cHV0RGlyZWN0b3J5KGZpbGVQYXRoKTtcbiAgICBpZiAob3V0ZGlyKSB7XG4gICAgICBhcmdzLnB1c2goYC1vdXRkaXI9XFxcIiR7b3V0ZGlyfVxcXCJgKTtcbiAgICB9XG5cbiAgICBhcmdzLnB1c2goYFxcXCIke2ZpbGVQYXRofVxcXCJgKTtcbiAgICByZXR1cm4gYXJncztcbiAgfVxufVxuIl19
//# sourceURL=/home/cin_chalic/.atom/packages/latex/lib/builders/latexmk.js
