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

var TexifyBuilder = (function (_Builder) {
  _inherits(TexifyBuilder, _Builder);

  function TexifyBuilder() {
    _classCallCheck(this, TexifyBuilder);

    _get(Object.getPrototypeOf(TexifyBuilder.prototype), "constructor", this).call(this);
    this.executable = "texify";
  }

  _createClass(TexifyBuilder, [{
    key: "run",
    value: function run(filePath) {
      var args = this.constructArgs(filePath);
      var command = this.executable + " " + args.join(" ");
      var options = this.constructChildProcessOptions();

      options.cwd = _path2["default"].dirname(filePath); // Run process with sensible CWD.
      options.maxBuffer = 52428800; // Set process' max buffer size to 50 MB.

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
      var args = ["--batch", "--pdf", "--tex-option=--synctex=1",
      // Set logfile max line length.
      "--tex-option=--max-print-line=1000"];

      var enableShellEscape = atom.config.get("latex.enableShellEscape");
      if (enableShellEscape) {
        args.push("--tex-option=--enable-write18");
      }

      var customEngine = atom.config.get("latex.customEngine");
      var engine = atom.config.get("latex.engine");
      if (customEngine || engine !== "pdflatex") {
        atom.notifications.addWarning("Engine customization is not supported by texify, " + "so this functionality is disabled when using the texify builder.");
      }

      var outdir = this.getOutputDirectory(filePath);
      if (outdir) {
        atom.notifications.addWarning("Output directory functionality is poorly supported by texify, " + "so this functionality is disabled (for the foreseeable future) " + "when using the texify builder.");
      }

      args.push("\"" + filePath + "\"");
      return args;
    }
  }]);

  return TexifyBuilder;
})(_builder2["default"]);

exports["default"] = TexifyBuilder;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL2J1aWxkZXJzL3RleGlmeS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs2QkFFMEIsZUFBZTs7OztvQkFDeEIsTUFBTTs7Ozt1QkFDSCxZQUFZOzs7O0FBSmhDLFdBQVcsQ0FBQzs7SUFNUyxhQUFhO1lBQWIsYUFBYTs7QUFDckIsV0FEUSxhQUFhLEdBQ2xCOzBCQURLLGFBQWE7O0FBRTlCLCtCQUZpQixhQUFhLDZDQUV0QjtBQUNSLFFBQUksQ0FBQyxVQUFVLEdBQUcsUUFBUSxDQUFDO0dBQzVCOztlQUprQixhQUFhOztXQU03QixhQUFDLFFBQVEsRUFBRTtBQUNaLFVBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDMUMsVUFBTSxPQUFPLEdBQU0sSUFBSSxDQUFDLFVBQVUsU0FBSSxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxBQUFFLENBQUM7QUFDdkQsVUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLDRCQUE0QixFQUFFLENBQUM7O0FBRXBELGFBQU8sQ0FBQyxHQUFHLEdBQUcsa0JBQUssT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ3JDLGFBQU8sQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDOztBQUU3QixhQUFPLElBQUksT0FBTyxDQUFDLFVBQUMsT0FBTyxFQUFLOztBQUU5QixtQ0FBYyxJQUFJLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxVQUFDLEtBQUssRUFBSztBQUM5QyxpQkFBTyxDQUFDLEFBQUMsS0FBSyxHQUFJLEtBQUssQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUM7U0FDbkMsQ0FBQyxDQUFDO09BQ0osQ0FBQyxDQUFDO0tBQ0o7OztXQUVZLHVCQUFDLFFBQVEsRUFBRTtBQUN0QixVQUFNLElBQUksR0FBRyxDQUNYLFNBQVMsRUFDVCxPQUFPLEVBQ1AsMEJBQTBCOztBQUUxQiwwQ0FBb0MsQ0FDckMsQ0FBQzs7QUFFRixVQUFNLGlCQUFpQixHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLHlCQUF5QixDQUFDLENBQUM7QUFDckUsVUFBSSxpQkFBaUIsRUFBRTtBQUNyQixZQUFJLENBQUMsSUFBSSxDQUFDLCtCQUErQixDQUFDLENBQUM7T0FDNUM7O0FBRUQsVUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsb0JBQW9CLENBQUMsQ0FBQztBQUMzRCxVQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUMvQyxVQUFJLFlBQVksSUFBSSxNQUFNLEtBQUssVUFBVSxFQUFFO0FBQ3pDLFlBQUksQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUMzQixtREFBbUQsR0FDbkQsa0VBQWtFLENBQ25FLENBQUM7T0FDSDs7QUFFRCxVQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDL0MsVUFBSSxNQUFNLEVBQUU7QUFDVixZQUFJLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FDM0IsZ0VBQWdFLEdBQ2hFLGlFQUFpRSxHQUNqRSxnQ0FBZ0MsQ0FDakMsQ0FBQztPQUNIOztBQUVELFVBQUksQ0FBQyxJQUFJLFFBQU0sUUFBUSxRQUFLLENBQUM7QUFDN0IsYUFBTyxJQUFJLENBQUM7S0FDYjs7O1NBeERrQixhQUFhOzs7cUJBQWIsYUFBYSIsImZpbGUiOiIvaG9tZS9jaW5fY2hhbGljLy5hdG9tL3BhY2thZ2VzL2xhdGV4L2xpYi9idWlsZGVycy90ZXhpZnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBiYWJlbFwiO1xuXG5pbXBvcnQgY2hpbGRfcHJvY2VzcyBmcm9tIFwiY2hpbGRfcHJvY2Vzc1wiO1xuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcbmltcG9ydCBCdWlsZGVyIGZyb20gXCIuLi9idWlsZGVyXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRleGlmeUJ1aWxkZXIgZXh0ZW5kcyBCdWlsZGVyIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLmV4ZWN1dGFibGUgPSBcInRleGlmeVwiO1xuICB9XG5cbiAgcnVuKGZpbGVQYXRoKSB7XG4gICAgY29uc3QgYXJncyA9IHRoaXMuY29uc3RydWN0QXJncyhmaWxlUGF0aCk7XG4gICAgY29uc3QgY29tbWFuZCA9IGAke3RoaXMuZXhlY3V0YWJsZX0gJHthcmdzLmpvaW4oXCIgXCIpfWA7XG4gICAgY29uc3Qgb3B0aW9ucyA9IHRoaXMuY29uc3RydWN0Q2hpbGRQcm9jZXNzT3B0aW9ucygpO1xuXG4gICAgb3B0aW9ucy5jd2QgPSBwYXRoLmRpcm5hbWUoZmlsZVBhdGgpOyAvLyBSdW4gcHJvY2VzcyB3aXRoIHNlbnNpYmxlIENXRC5cbiAgICBvcHRpb25zLm1heEJ1ZmZlciA9IDUyNDI4ODAwOyAvLyBTZXQgcHJvY2VzcycgbWF4IGJ1ZmZlciBzaXplIHRvIDUwIE1CLlxuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAvLyBUT0RPOiBBZGQgc3VwcG9ydCBmb3Iga2lsbGluZyB0aGUgcHJvY2Vzcy5cbiAgICAgIGNoaWxkX3Byb2Nlc3MuZXhlYyhjb21tYW5kLCBvcHRpb25zLCAoZXJyb3IpID0+IHtcbiAgICAgICAgcmVzb2x2ZSgoZXJyb3IpID8gZXJyb3IuY29kZSA6IDApO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBjb25zdHJ1Y3RBcmdzKGZpbGVQYXRoKSB7XG4gICAgY29uc3QgYXJncyA9IFtcbiAgICAgIFwiLS1iYXRjaFwiLFxuICAgICAgXCItLXBkZlwiLFxuICAgICAgXCItLXRleC1vcHRpb249LS1zeW5jdGV4PTFcIixcbiAgICAgIC8vIFNldCBsb2dmaWxlIG1heCBsaW5lIGxlbmd0aC5cbiAgICAgIFwiLS10ZXgtb3B0aW9uPS0tbWF4LXByaW50LWxpbmU9MTAwMFwiLFxuICAgIF07XG5cbiAgICBjb25zdCBlbmFibGVTaGVsbEVzY2FwZSA9IGF0b20uY29uZmlnLmdldChcImxhdGV4LmVuYWJsZVNoZWxsRXNjYXBlXCIpO1xuICAgIGlmIChlbmFibGVTaGVsbEVzY2FwZSkge1xuICAgICAgYXJncy5wdXNoKFwiLS10ZXgtb3B0aW9uPS0tZW5hYmxlLXdyaXRlMThcIik7XG4gICAgfVxuXG4gICAgY29uc3QgY3VzdG9tRW5naW5lID0gYXRvbS5jb25maWcuZ2V0KFwibGF0ZXguY3VzdG9tRW5naW5lXCIpO1xuICAgIGNvbnN0IGVuZ2luZSA9IGF0b20uY29uZmlnLmdldChcImxhdGV4LmVuZ2luZVwiKTtcbiAgICBpZiAoY3VzdG9tRW5naW5lIHx8IGVuZ2luZSAhPT0gXCJwZGZsYXRleFwiKSB7XG4gICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkV2FybmluZyhcbiAgICAgICAgXCJFbmdpbmUgY3VzdG9taXphdGlvbiBpcyBub3Qgc3VwcG9ydGVkIGJ5IHRleGlmeSwgXCIgK1xuICAgICAgICBcInNvIHRoaXMgZnVuY3Rpb25hbGl0eSBpcyBkaXNhYmxlZCB3aGVuIHVzaW5nIHRoZSB0ZXhpZnkgYnVpbGRlci5cIlxuICAgICAgKTtcbiAgICB9XG5cbiAgICBsZXQgb3V0ZGlyID0gdGhpcy5nZXRPdXRwdXREaXJlY3RvcnkoZmlsZVBhdGgpO1xuICAgIGlmIChvdXRkaXIpIHtcbiAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRXYXJuaW5nKFxuICAgICAgICBcIk91dHB1dCBkaXJlY3RvcnkgZnVuY3Rpb25hbGl0eSBpcyBwb29ybHkgc3VwcG9ydGVkIGJ5IHRleGlmeSwgXCIgK1xuICAgICAgICBcInNvIHRoaXMgZnVuY3Rpb25hbGl0eSBpcyBkaXNhYmxlZCAoZm9yIHRoZSBmb3Jlc2VlYWJsZSBmdXR1cmUpIFwiICtcbiAgICAgICAgXCJ3aGVuIHVzaW5nIHRoZSB0ZXhpZnkgYnVpbGRlci5cIlxuICAgICAgKTtcbiAgICB9XG5cbiAgICBhcmdzLnB1c2goYFxcXCIke2ZpbGVQYXRofVxcXCJgKTtcbiAgICByZXR1cm4gYXJncztcbiAgfVxufVxuIl19
//# sourceURL=/home/cin_chalic/.atom/packages/latex/lib/builders/texify.js
