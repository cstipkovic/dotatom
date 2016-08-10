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

var TexifyBuilder = (function (_Builder) {
  function TexifyBuilder() {
    _classCallCheck(this, TexifyBuilder);

    _get(Object.getPrototypeOf(TexifyBuilder.prototype), "constructor", this).call(this);
    this.executable = "texify";
  }

  _inherits(TexifyBuilder, _Builder);

  _createClass(TexifyBuilder, [{
    key: "run",
    value: function run(filePath) {
      var args = this.constructArgs(filePath);
      var command = "texify " + args.join(" ");
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
      var args = [
      // "-c", // can't clean if we want to parse log file
      "-b", "--pdf"];

      var enableShellEscape = atom.config.get("latex.enableShellEscape");
      var customEngine = atom.config.get("latex.customEngine");
      var engine = atom.config.get("latex.engine");

      if (enableShellEscape) {
        args.push("--tex-option=--shell-escape");
      }

      if (customEngine) {
        args.push("--engine=\"" + customEngine + "\"");
      } else if (engine && engine !== "pdflatex") {
        args.push("--engine=" + engine);
      }

      var outdir = atom.config.get("latex.outputDirectory");
      if (outdir) {
        var dir = _path2["default"].dirname(filePath);
        outdir = _path2["default"].join(dir, outdir);
        args.push("--tex-option=\"-output-directory=" + outdir + "\"");
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

  return TexifyBuilder;
})(_builder2["default"]);

exports["default"] = TexifyBuilder;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL2J1aWxkZXJzL3RleGlmeS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs2QkFFMEIsZUFBZTs7OztzQkFDMUIsU0FBUzs7OztvQkFDUCxNQUFNOzs7O3VCQUNILFlBQVk7Ozs7Z0NBQ1YsdUJBQXVCOzs7O0FBTjdDLFdBQVcsQ0FBQzs7SUFRUyxhQUFhO0FBQ3JCLFdBRFEsYUFBYSxHQUNsQjswQkFESyxhQUFhOztBQUU5QiwrQkFGaUIsYUFBYSw2Q0FFdEI7QUFDUixRQUFJLENBQUMsVUFBVSxHQUFHLFFBQVEsQ0FBQztHQUM1Qjs7WUFKa0IsYUFBYTs7ZUFBYixhQUFhOztXQU03QixhQUFDLFFBQVEsRUFBRTtBQUNaLFVBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDMUMsVUFBTSxPQUFPLGVBQWEsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQUFBRSxDQUFDO0FBQzNDLFVBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyw0QkFBNEIsRUFBRSxDQUFDOztBQUVwRCxhQUFPLENBQUMsR0FBRyxHQUFHLGtCQUFLLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUNyQyxhQUFPLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQztBQUM3QixhQUFPLENBQUMsR0FBRyxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUM7O0FBRWxDLGFBQU8sSUFBSSxPQUFPLENBQUMsVUFBQyxPQUFPLEVBQUs7O0FBRTlCLG1DQUFjLElBQUksQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLFVBQUMsS0FBSyxFQUFLO0FBQzlDLGlCQUFPLENBQUMsQUFBQyxLQUFLLEdBQUksS0FBSyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQztTQUNuQyxDQUFDLENBQUM7T0FDSixDQUFDLENBQUM7S0FDSjs7O1dBRVksdUJBQUMsUUFBUSxFQUFFO0FBQ3RCLFVBQU0sSUFBSSxHQUFHOztBQUVULFVBQUksRUFDSixPQUFPLENBQ1YsQ0FBQzs7QUFFRixVQUFNLGlCQUFpQixHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLHlCQUF5QixDQUFDLENBQUM7QUFDckUsVUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsb0JBQW9CLENBQUMsQ0FBQztBQUMzRCxVQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQzs7QUFFL0MsVUFBSSxpQkFBaUIsRUFBRTtBQUNyQixZQUFJLENBQUMsSUFBSSxDQUFDLDZCQUE2QixDQUFDLENBQUM7T0FDMUM7O0FBRUQsVUFBSSxZQUFZLEVBQUU7QUFDaEIsWUFBSSxDQUFDLElBQUksaUJBQWUsWUFBWSxRQUFLLENBQUM7T0FDM0MsTUFDSSxJQUFJLE1BQU0sSUFBSSxNQUFNLEtBQUssVUFBVSxFQUFFO0FBQ3hDLFlBQUksQ0FBQyxJQUFJLGVBQWEsTUFBTSxDQUFHLENBQUM7T0FDakM7O0FBRUQsVUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsdUJBQXVCLENBQUMsQ0FBQztBQUN0RCxVQUFJLE1BQU0sRUFBRTtBQUNWLFlBQU0sR0FBRyxHQUFHLGtCQUFLLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUNuQyxjQUFNLEdBQUcsa0JBQUssSUFBSSxDQUFDLEdBQUcsRUFBRSxNQUFNLENBQUMsQ0FBQztBQUNoQyxZQUFJLENBQUMsSUFBSSx1Q0FBcUMsTUFBTSxRQUFLLENBQUM7T0FDM0Q7O0FBRUQsVUFBSSxDQUFDLElBQUksUUFBTSxRQUFRLFFBQUssQ0FBQztBQUM3QixhQUFPLElBQUksQ0FBQztLQUNiOzs7V0FFVyxzQkFBQyxXQUFXLEVBQUU7QUFDeEIsVUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQ3pELFVBQUksQ0FBQyxvQkFBRyxVQUFVLENBQUMsV0FBVyxDQUFDLEVBQUU7QUFBRSxlQUFPLElBQUksQ0FBQztPQUFFOztBQUVqRCxVQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQzlDLGFBQU8sTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO0tBQ3ZCOzs7V0FFVyxzQkFBQyxXQUFXLEVBQUU7QUFDeEIsYUFBTyxrQ0FBYyxXQUFXLENBQUMsQ0FBQztLQUNuQzs7O1NBbEVrQixhQUFhOzs7cUJBQWIsYUFBYSIsImZpbGUiOiIvaG9tZS9jaW5fY2hhbGljLy5hdG9tL3BhY2thZ2VzL2xhdGV4L2xpYi9idWlsZGVycy90ZXhpZnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBiYWJlbFwiO1xuXG5pbXBvcnQgY2hpbGRfcHJvY2VzcyBmcm9tIFwiY2hpbGRfcHJvY2Vzc1wiO1xuaW1wb3J0IGZzIGZyb20gXCJmcy1wbHVzXCI7XG5pbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IEJ1aWxkZXIgZnJvbSBcIi4uL2J1aWxkZXJcIjtcbmltcG9ydCBMb2dQYXJzZXIgZnJvbSBcIi4uL3BhcnNlcnMvbG9nLXBhcnNlclwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUZXhpZnlCdWlsZGVyIGV4dGVuZHMgQnVpbGRlciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5leGVjdXRhYmxlID0gXCJ0ZXhpZnlcIjtcbiAgfVxuXG4gIHJ1bihmaWxlUGF0aCkge1xuICAgIGNvbnN0IGFyZ3MgPSB0aGlzLmNvbnN0cnVjdEFyZ3MoZmlsZVBhdGgpO1xuICAgIGNvbnN0IGNvbW1hbmQgPSBgdGV4aWZ5ICR7YXJncy5qb2luKFwiIFwiKX1gO1xuICAgIGNvbnN0IG9wdGlvbnMgPSB0aGlzLmNvbnN0cnVjdENoaWxkUHJvY2Vzc09wdGlvbnMoKTtcblxuICAgIG9wdGlvbnMuY3dkID0gcGF0aC5kaXJuYW1lKGZpbGVQYXRoKTsgLy8gUnVuIHByb2Nlc3Mgd2l0aCBzZW5zaWJsZSBDV0QuXG4gICAgb3B0aW9ucy5tYXhCdWZmZXIgPSA1MjQyODgwMDsgLy8gU2V0IHByb2Nlc3MnIG1heCBidWZmZXIgc2l6ZSB0byA1MCBNQi5cbiAgICBvcHRpb25zLmVudi5tYXhfcHJpbnRfbGluZSA9IDEwMDA7IC8vIE1heCBsb2cgZmlsZSBsaW5lIGxlbmd0aC5cblxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgLy8gVE9ETzogQWRkIHN1cHBvcnQgZm9yIGtpbGxpbmcgdGhlIHByb2Nlc3MuXG4gICAgICBjaGlsZF9wcm9jZXNzLmV4ZWMoY29tbWFuZCwgb3B0aW9ucywgKGVycm9yKSA9PiB7XG4gICAgICAgIHJlc29sdmUoKGVycm9yKSA/IGVycm9yLmNvZGUgOiAwKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgY29uc3RydWN0QXJncyhmaWxlUGF0aCkge1xuICAgIGNvbnN0IGFyZ3MgPSBbXG4gICAgICAgIC8vIFwiLWNcIiwgLy8gY2FuJ3QgY2xlYW4gaWYgd2Ugd2FudCB0byBwYXJzZSBsb2cgZmlsZVxuICAgICAgICBcIi1iXCIsXG4gICAgICAgIFwiLS1wZGZcIixcbiAgICBdO1xuXG4gICAgY29uc3QgZW5hYmxlU2hlbGxFc2NhcGUgPSBhdG9tLmNvbmZpZy5nZXQoXCJsYXRleC5lbmFibGVTaGVsbEVzY2FwZVwiKTtcbiAgICBjb25zdCBjdXN0b21FbmdpbmUgPSBhdG9tLmNvbmZpZy5nZXQoXCJsYXRleC5jdXN0b21FbmdpbmVcIik7XG4gICAgY29uc3QgZW5naW5lID0gYXRvbS5jb25maWcuZ2V0KFwibGF0ZXguZW5naW5lXCIpO1xuXG4gICAgaWYgKGVuYWJsZVNoZWxsRXNjYXBlKSB7XG4gICAgICBhcmdzLnB1c2goXCItLXRleC1vcHRpb249LS1zaGVsbC1lc2NhcGVcIik7XG4gICAgfVxuXG4gICAgaWYgKGN1c3RvbUVuZ2luZSkge1xuICAgICAgYXJncy5wdXNoKGAtLWVuZ2luZT1cXFwiJHtjdXN0b21FbmdpbmV9XFxcImApO1xuICAgIH1cbiAgICBlbHNlIGlmIChlbmdpbmUgJiYgZW5naW5lICE9PSBcInBkZmxhdGV4XCIpIHtcbiAgICAgIGFyZ3MucHVzaChgLS1lbmdpbmU9JHtlbmdpbmV9YCk7XG4gICAgfVxuXG4gICAgbGV0IG91dGRpciA9IGF0b20uY29uZmlnLmdldChcImxhdGV4Lm91dHB1dERpcmVjdG9yeVwiKTtcbiAgICBpZiAob3V0ZGlyKSB7XG4gICAgICBjb25zdCBkaXIgPSBwYXRoLmRpcm5hbWUoZmlsZVBhdGgpO1xuICAgICAgb3V0ZGlyID0gcGF0aC5qb2luKGRpciwgb3V0ZGlyKTtcbiAgICAgIGFyZ3MucHVzaChgLS10ZXgtb3B0aW9uPVxcXCItb3V0cHV0LWRpcmVjdG9yeT0ke291dGRpcn1cXFwiYCk7XG4gICAgfVxuXG4gICAgYXJncy5wdXNoKGBcXFwiJHtmaWxlUGF0aH1cXFwiYCk7XG4gICAgcmV0dXJuIGFyZ3M7XG4gIH1cblxuICBwYXJzZUxvZ0ZpbGUodGV4RmlsZVBhdGgpIHtcbiAgICBjb25zdCBsb2dGaWxlUGF0aCA9IHRoaXMucmVzb2x2ZUxvZ0ZpbGVQYXRoKHRleEZpbGVQYXRoKTtcbiAgICBpZiAoIWZzLmV4aXN0c1N5bmMobG9nRmlsZVBhdGgpKSB7IHJldHVybiBudWxsOyB9XG5cbiAgICBjb25zdCBwYXJzZXIgPSB0aGlzLmdldExvZ1BhcnNlcihsb2dGaWxlUGF0aCk7XG4gICAgcmV0dXJuIHBhcnNlci5wYXJzZSgpO1xuICB9XG5cbiAgZ2V0TG9nUGFyc2VyKGxvZ0ZpbGVQYXRoKSB7XG4gICAgcmV0dXJuIG5ldyBMb2dQYXJzZXIobG9nRmlsZVBhdGgpO1xuICB9XG59XG4iXX0=