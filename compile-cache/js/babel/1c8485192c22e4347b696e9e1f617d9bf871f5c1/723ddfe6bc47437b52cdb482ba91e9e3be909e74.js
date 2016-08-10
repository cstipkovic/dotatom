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

var _fsPlus = require("fs-plus");

var _fsPlus2 = _interopRequireDefault(_fsPlus);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _builder = require("../builder");

var _builder2 = _interopRequireDefault(_builder);

var _parsersLogParser = require("../parsers/log-parser");

var _parsersLogParser2 = _interopRequireDefault(_parsersLogParser);

"use babel";

var LatexmkBuilder = (function (_Builder) {
  function LatexmkBuilder() {
    _classCallCheck(this, LatexmkBuilder);

    _get(Object.getPrototypeOf(LatexmkBuilder.prototype), "constructor", this).call(this);
    this.executable = "latexmk";
  }

  _inherits(LatexmkBuilder, _Builder);

  _createClass(LatexmkBuilder, [{
    key: "run",
    value: function run(filePath) {
      var args = this.constructArgs(filePath);
      var command = "latexmk " + args.join(" ");
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

      var outdir = atom.config.get("latex.outputDirectory");
      if (outdir) {
        var dir = _path2["default"].dirname(filePath);
        outdir = _path2["default"].join(dir, outdir);
        args.push("-outdir=\"" + outdir + "\"");
      }

      args.push("\"" + filePath + "\"");
      return args;
    }
  }, {
    key: "parseLogFile",
    value: function parseLogFile(texFilePath) {
      var logFilePath = this.resolveLogFilePath(texFilePath);
      if (!_fsPlus2["default"].existsSync(logFilePath)) {
        return null;
      }

      var parser = this.getLogParser(logFilePath);
      return parser.parse();
    }
  }, {
    key: "getLogParser",
    value: function getLogParser(logFilePath) {
      return new _parsersLogParser2["default"](logFilePath);
    }
  }]);

  return LatexmkBuilder;
})(_builder2["default"]);

exports["default"] = LatexmkBuilder;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL2J1aWxkZXJzL2xhdGV4bWsuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7NkJBRTBCLGVBQWU7Ozs7c0JBQzFCLFNBQVM7Ozs7b0JBQ1AsTUFBTTs7Ozt1QkFDSCxZQUFZOzs7O2dDQUNWLHVCQUF1Qjs7OztBQU43QyxXQUFXLENBQUM7O0lBUVMsY0FBYztBQUN0QixXQURRLGNBQWMsR0FDbkI7MEJBREssY0FBYzs7QUFFL0IsK0JBRmlCLGNBQWMsNkNBRXZCO0FBQ1IsUUFBSSxDQUFDLFVBQVUsR0FBRyxTQUFTLENBQUM7R0FDN0I7O1lBSmtCLGNBQWM7O2VBQWQsY0FBYzs7V0FNOUIsYUFBQyxRQUFRLEVBQUU7QUFDWixVQUFNLElBQUksR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQzFDLFVBQU0sT0FBTyxnQkFBYyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxBQUFFLENBQUM7QUFDNUMsVUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLDRCQUE0QixFQUFFLENBQUM7O0FBRXBELGFBQU8sQ0FBQyxHQUFHLEdBQUcsa0JBQUssT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ3JDLGFBQU8sQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDO0FBQzdCLGFBQU8sQ0FBQyxHQUFHLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQzs7QUFFbEMsYUFBTyxJQUFJLE9BQU8sQ0FBQyxVQUFDLE9BQU8sRUFBSzs7QUFFOUIsbUNBQWMsSUFBSSxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsVUFBQyxLQUFLLEVBQUs7QUFDOUMsaUJBQU8sQ0FBQyxBQUFDLEtBQUssR0FBSSxLQUFLLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDO1NBQ25DLENBQUMsQ0FBQztPQUNKLENBQUMsQ0FBQztLQUNKOzs7V0FFWSx1QkFBQyxRQUFRLEVBQUU7QUFDdEIsVUFBTSxJQUFJLEdBQUcsQ0FDWCwwQkFBMEIsRUFDMUIsSUFBSSxFQUNKLEtBQUssRUFDTCxNQUFNLEVBQ04sWUFBWSxFQUNaLGtCQUFrQixDQUNuQixDQUFDOztBQUVGLFVBQU0saUJBQWlCLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMseUJBQXlCLENBQUMsQ0FBQztBQUNyRSxVQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO0FBQzNELFVBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDOztBQUUvQyxVQUFJLGlCQUFpQixFQUFFO0FBQ3JCLFlBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7T0FDNUI7O0FBRUQsVUFBSSxZQUFZLEVBQUU7QUFDaEIsWUFBSSxDQUFDLElBQUksa0JBQWdCLFlBQVksUUFBSyxDQUFDO09BQzVDLE1BQ0ksSUFBSSxNQUFNLElBQUksTUFBTSxLQUFLLFVBQVUsRUFBRTtBQUN4QyxZQUFJLENBQUMsSUFBSSxPQUFLLE1BQU0sQ0FBRyxDQUFDO09BQ3pCOztBQUVELFVBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLHVCQUF1QixDQUFDLENBQUM7QUFDdEQsVUFBSSxNQUFNLEVBQUU7QUFDVixZQUFNLEdBQUcsR0FBRyxrQkFBSyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDbkMsY0FBTSxHQUFHLGtCQUFLLElBQUksQ0FBQyxHQUFHLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDaEMsWUFBSSxDQUFDLElBQUksZ0JBQWMsTUFBTSxRQUFLLENBQUM7T0FDcEM7O0FBRUQsVUFBSSxDQUFDLElBQUksUUFBTSxRQUFRLFFBQUssQ0FBQztBQUM3QixhQUFPLElBQUksQ0FBQztLQUNiOzs7V0FFVyxzQkFBQyxXQUFXLEVBQUU7QUFDeEIsVUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQ3pELFVBQUksQ0FBQyxvQkFBRyxVQUFVLENBQUMsV0FBVyxDQUFDLEVBQUU7QUFBRSxlQUFPLElBQUksQ0FBQztPQUFFOztBQUVqRCxVQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQzlDLGFBQU8sTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO0tBQ3ZCOzs7V0FFVyxzQkFBQyxXQUFXLEVBQUU7QUFDeEIsYUFBTyxrQ0FBYyxXQUFXLENBQUMsQ0FBQztLQUNuQzs7O1NBckVrQixjQUFjOzs7cUJBQWQsY0FBYyIsImZpbGUiOiIvaG9tZS9jaW5fY2hhbGljLy5hdG9tL3BhY2thZ2VzL2xhdGV4L2xpYi9idWlsZGVycy9sYXRleG1rLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2UgYmFiZWxcIjtcblxuaW1wb3J0IGNoaWxkX3Byb2Nlc3MgZnJvbSBcImNoaWxkX3Byb2Nlc3NcIjtcbmltcG9ydCBmcyBmcm9tIFwiZnMtcGx1c1wiO1xuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcbmltcG9ydCBCdWlsZGVyIGZyb20gXCIuLi9idWlsZGVyXCI7XG5pbXBvcnQgTG9nUGFyc2VyIGZyb20gXCIuLi9wYXJzZXJzL2xvZy1wYXJzZXJcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGF0ZXhta0J1aWxkZXIgZXh0ZW5kcyBCdWlsZGVyIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLmV4ZWN1dGFibGUgPSBcImxhdGV4bWtcIjtcbiAgfVxuXG4gIHJ1bihmaWxlUGF0aCkge1xuICAgIGNvbnN0IGFyZ3MgPSB0aGlzLmNvbnN0cnVjdEFyZ3MoZmlsZVBhdGgpO1xuICAgIGNvbnN0IGNvbW1hbmQgPSBgbGF0ZXhtayAke2FyZ3Muam9pbihcIiBcIil9YDtcbiAgICBjb25zdCBvcHRpb25zID0gdGhpcy5jb25zdHJ1Y3RDaGlsZFByb2Nlc3NPcHRpb25zKCk7XG5cbiAgICBvcHRpb25zLmN3ZCA9IHBhdGguZGlybmFtZShmaWxlUGF0aCk7IC8vIFJ1biBwcm9jZXNzIHdpdGggc2Vuc2libGUgQ1dELlxuICAgIG9wdGlvbnMubWF4QnVmZmVyID0gNTI0Mjg4MDA7IC8vIFNldCBwcm9jZXNzJyBtYXggYnVmZmVyIHNpemUgdG8gNTAgTUIuXG4gICAgb3B0aW9ucy5lbnYubWF4X3ByaW50X2xpbmUgPSAxMDAwOyAvLyBNYXggbG9nIGZpbGUgbGluZSBsZW5ndGguXG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgIC8vIFRPRE86IEFkZCBzdXBwb3J0IGZvciBraWxsaW5nIHRoZSBwcm9jZXNzLlxuICAgICAgY2hpbGRfcHJvY2Vzcy5leGVjKGNvbW1hbmQsIG9wdGlvbnMsIChlcnJvcikgPT4ge1xuICAgICAgICByZXNvbHZlKChlcnJvcikgPyBlcnJvci5jb2RlIDogMCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIGNvbnN0cnVjdEFyZ3MoZmlsZVBhdGgpIHtcbiAgICBjb25zdCBhcmdzID0gW1xuICAgICAgXCItaW50ZXJhY3Rpb249bm9uc3RvcG1vZGVcIixcbiAgICAgIFwiLWZcIixcbiAgICAgIFwiLWNkXCIsXG4gICAgICBcIi1wZGZcIixcbiAgICAgIFwiLXN5bmN0ZXg9MVwiLFxuICAgICAgXCItZmlsZS1saW5lLWVycm9yXCIsXG4gICAgXTtcblxuICAgIGNvbnN0IGVuYWJsZVNoZWxsRXNjYXBlID0gYXRvbS5jb25maWcuZ2V0KFwibGF0ZXguZW5hYmxlU2hlbGxFc2NhcGVcIik7XG4gICAgY29uc3QgY3VzdG9tRW5naW5lID0gYXRvbS5jb25maWcuZ2V0KFwibGF0ZXguY3VzdG9tRW5naW5lXCIpO1xuICAgIGNvbnN0IGVuZ2luZSA9IGF0b20uY29uZmlnLmdldChcImxhdGV4LmVuZ2luZVwiKTtcblxuICAgIGlmIChlbmFibGVTaGVsbEVzY2FwZSkge1xuICAgICAgYXJncy5wdXNoKFwiLXNoZWxsLWVzY2FwZVwiKTtcbiAgICB9XG5cbiAgICBpZiAoY3VzdG9tRW5naW5lKSB7XG4gICAgICBhcmdzLnB1c2goYC1wZGZsYXRleD1cXFwiJHtjdXN0b21FbmdpbmV9XFxcImApO1xuICAgIH1cbiAgICBlbHNlIGlmIChlbmdpbmUgJiYgZW5naW5lICE9PSBcInBkZmxhdGV4XCIpIHtcbiAgICAgIGFyZ3MucHVzaChgLSR7ZW5naW5lfWApO1xuICAgIH1cblxuICAgIGxldCBvdXRkaXIgPSBhdG9tLmNvbmZpZy5nZXQoXCJsYXRleC5vdXRwdXREaXJlY3RvcnlcIik7XG4gICAgaWYgKG91dGRpcikge1xuICAgICAgY29uc3QgZGlyID0gcGF0aC5kaXJuYW1lKGZpbGVQYXRoKTtcbiAgICAgIG91dGRpciA9IHBhdGguam9pbihkaXIsIG91dGRpcik7XG4gICAgICBhcmdzLnB1c2goYC1vdXRkaXI9XFxcIiR7b3V0ZGlyfVxcXCJgKTtcbiAgICB9XG5cbiAgICBhcmdzLnB1c2goYFxcXCIke2ZpbGVQYXRofVxcXCJgKTtcbiAgICByZXR1cm4gYXJncztcbiAgfVxuXG4gIHBhcnNlTG9nRmlsZSh0ZXhGaWxlUGF0aCkge1xuICAgIGNvbnN0IGxvZ0ZpbGVQYXRoID0gdGhpcy5yZXNvbHZlTG9nRmlsZVBhdGgodGV4RmlsZVBhdGgpO1xuICAgIGlmICghZnMuZXhpc3RzU3luYyhsb2dGaWxlUGF0aCkpIHsgcmV0dXJuIG51bGw7IH1cblxuICAgIGNvbnN0IHBhcnNlciA9IHRoaXMuZ2V0TG9nUGFyc2VyKGxvZ0ZpbGVQYXRoKTtcbiAgICByZXR1cm4gcGFyc2VyLnBhcnNlKCk7XG4gIH1cblxuICBnZXRMb2dQYXJzZXIobG9nRmlsZVBhdGgpIHtcbiAgICByZXR1cm4gbmV3IExvZ1BhcnNlcihsb2dGaWxlUGF0aCk7XG4gIH1cbn1cbiJdfQ==