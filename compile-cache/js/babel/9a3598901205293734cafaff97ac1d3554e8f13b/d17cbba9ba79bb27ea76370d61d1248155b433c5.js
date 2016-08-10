Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _fsPlus = require("fs-plus");

var _fsPlus2 = _interopRequireDefault(_fsPlus);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _parsersLogParser = require("./parsers/log-parser");

var _parsersLogParser2 = _interopRequireDefault(_parsersLogParser);

"use babel";

var Builder = (function () {
  function Builder() {
    _classCallCheck(this, Builder);

    this.envPathKey = this.getEnvironmentPathKey(process.platform);
  }

  _createClass(Builder, [{
    key: "run",
    value: function run() /* filePath */{}
  }, {
    key: "constructArgs",
    value: function constructArgs() /* filePath */{}
  }, {
    key: "parseLogFile",
    value: function parseLogFile() /* texFilePath */{}
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
  }, {
    key: "constructChildProcessOptions",
    value: function constructChildProcessOptions() {
      var env = _lodash2["default"].clone(process.env);
      var childPath = this.constructPath();
      if (childPath) {
        env[this.envPathKey] = childPath;
      }

      return { env: env };
    }
  }, {
    key: "constructPath",
    value: function constructPath() {
      var texPath = (atom.config.get("latex.texPath") || "").trim();
      if (texPath.length === 0) {
        texPath = this.defaultTexPath(process.platform);
      }

      var processPath = process.env[this.envPathKey];
      var match = texPath.match(/^(.*)(\$PATH)(.*)$/);
      if (match) {
        return "" + match[1] + processPath + match[3];
      }

      return [texPath, processPath].filter(function (str) {
        return str && str.length > 0;
      }).join(_path2["default"].delimiter);
    }
  }, {
    key: "defaultTexPath",
    value: function defaultTexPath(platform) {
      if (platform === "win32") {
        return ["%SystemDrive%\\texlive\\2015\\bin\\win32", "%SystemDrive%\\texlive\\2014\\bin\\win32", "%ProgramFiles%\\MiKTeX 2.9\\miktex\\bin\\x64", "%ProgramFiles(x86)%\\MiKTeX 2.9\\miktex\\bin"].join(";");
      }

      return ["/usr/texbin", "/Library/TeX/texbin"].join(":");
    }
  }, {
    key: "resolveLogFilePath",
    value: function resolveLogFilePath(texFilePath) {
      var outputDirectory = atom.config.get("latex.outputDirectory") || "";
      var currentDirectory = _path2["default"].dirname(texFilePath);
      var fileName = _path2["default"].basename(texFilePath).replace(/\.\w+$/, ".log");

      return _path2["default"].join(currentDirectory, outputDirectory, fileName);
    }
  }, {
    key: "getEnvironmentPathKey",
    value: function getEnvironmentPathKey(platform) {
      if (platform === "win32") {
        return "Path";
      }
      return "PATH";
    }
  }, {
    key: "getOutputDirectory",
    value: function getOutputDirectory(filePath) {
      var outdir = atom.config.get("latex.outputDirectory");
      if (outdir) {
        var dir = _path2["default"].dirname(filePath);
        outdir = _path2["default"].join(dir, outdir);
      }

      return outdir;
    }
  }]);

  return Builder;
})();

exports["default"] = Builder;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL2J1aWxkZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztzQkFFYyxRQUFROzs7O3NCQUNQLFNBQVM7Ozs7b0JBQ1AsTUFBTTs7OztnQ0FDRCxzQkFBc0I7Ozs7QUFMNUMsV0FBVyxDQUFDOztJQU9TLE9BQU87QUFDZixXQURRLE9BQU8sR0FDWjswQkFESyxPQUFPOztBQUV4QixRQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7R0FDaEU7O2VBSGtCLE9BQU87O1dBS3ZCLDZCQUFpQixFQUFFOzs7V0FDVCx1Q0FBaUIsRUFBRTs7O1dBQ3BCLHlDQUFvQixFQUFFOzs7V0FFdEIsc0JBQUMsV0FBVyxFQUFFO0FBQ3hCLFVBQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUN6RCxVQUFJLENBQUMsb0JBQUcsVUFBVSxDQUFDLFdBQVcsQ0FBQyxFQUFFO0FBQUUsZUFBTyxJQUFJLENBQUM7T0FBRTs7QUFFakQsVUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUM5QyxhQUFPLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztLQUN2Qjs7O1dBRVcsc0JBQUMsV0FBVyxFQUFFO0FBQ3hCLGFBQU8sa0NBQWMsV0FBVyxDQUFDLENBQUM7S0FDbkM7OztXQUUyQix3Q0FBRztBQUM3QixVQUFNLEdBQUcsR0FBRyxvQkFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ2pDLFVBQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztBQUN2QyxVQUFJLFNBQVMsRUFBRTtBQUNiLFdBQUcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsU0FBUyxDQUFDO09BQ2xDOztBQUVELGFBQU8sRUFBQyxHQUFHLEVBQUgsR0FBRyxFQUFDLENBQUM7S0FDZDs7O1dBRVkseUJBQUc7QUFDZCxVQUFJLE9BQU8sR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxJQUFJLEVBQUUsQ0FBQSxDQUFFLElBQUksRUFBRSxDQUFDO0FBQzlELFVBQUksT0FBTyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7QUFDeEIsZUFBTyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO09BQ2pEOztBQUVELFVBQU0sV0FBVyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ2pELFVBQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsb0JBQW9CLENBQUMsQ0FBQztBQUNsRCxVQUFJLEtBQUssRUFBRTtBQUNULG9CQUFVLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxXQUFXLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFHO09BQy9DOztBQUVELGFBQU8sQ0FBQyxPQUFPLEVBQUUsV0FBVyxDQUFDLENBQzFCLE1BQU0sQ0FBQyxVQUFBLEdBQUc7ZUFBSSxHQUFHLElBQUksR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDO09BQUEsQ0FBQyxDQUNwQyxJQUFJLENBQUMsa0JBQUssU0FBUyxDQUFDLENBQUM7S0FDekI7OztXQUVhLHdCQUFDLFFBQVEsRUFBRTtBQUN2QixVQUFJLFFBQVEsS0FBSyxPQUFPLEVBQUU7QUFDeEIsZUFBTyxDQUNMLDBDQUEwQyxFQUMxQywwQ0FBMEMsRUFDMUMsOENBQThDLEVBQzlDLDhDQUE4QyxDQUMvQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztPQUNiOztBQUVELGFBQU8sQ0FDTCxhQUFhLEVBQ2IscUJBQXFCLENBQ3RCLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQ2I7OztXQUVpQiw0QkFBQyxXQUFXLEVBQUU7QUFDOUIsVUFBTSxlQUFlLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsdUJBQXVCLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDdkUsVUFBTSxnQkFBZ0IsR0FBRyxrQkFBSyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDbkQsVUFBTSxRQUFRLEdBQUcsa0JBQUssUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7O0FBRXRFLGFBQU8sa0JBQUssSUFBSSxDQUFDLGdCQUFnQixFQUFFLGVBQWUsRUFBRSxRQUFRLENBQUMsQ0FBQztLQUMvRDs7O1dBRW9CLCtCQUFDLFFBQVEsRUFBRTtBQUM5QixVQUFJLFFBQVEsS0FBSyxPQUFPLEVBQUU7QUFBRSxlQUFPLE1BQU0sQ0FBQztPQUFFO0FBQzVDLGFBQU8sTUFBTSxDQUFDO0tBQ2Y7OztXQUVpQiw0QkFBQyxRQUFRLEVBQUU7QUFDM0IsVUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsdUJBQXVCLENBQUMsQ0FBQztBQUN0RCxVQUFJLE1BQU0sRUFBRTtBQUNWLFlBQU0sR0FBRyxHQUFHLGtCQUFLLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUNuQyxjQUFNLEdBQUcsa0JBQUssSUFBSSxDQUFDLEdBQUcsRUFBRSxNQUFNLENBQUMsQ0FBQztPQUNqQzs7QUFFRCxhQUFPLE1BQU0sQ0FBQztLQUNmOzs7U0FyRmtCLE9BQU87OztxQkFBUCxPQUFPIiwiZmlsZSI6Ii9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL2J1aWxkZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBiYWJlbFwiO1xuXG5pbXBvcnQgXyBmcm9tIFwibG9kYXNoXCI7XG5pbXBvcnQgZnMgZnJvbSBcImZzLXBsdXNcIjtcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgTG9nUGFyc2VyIGZyb20gXCIuL3BhcnNlcnMvbG9nLXBhcnNlclwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCdWlsZGVyIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5lbnZQYXRoS2V5ID0gdGhpcy5nZXRFbnZpcm9ubWVudFBhdGhLZXkocHJvY2Vzcy5wbGF0Zm9ybSk7XG4gIH1cblxuICBydW4oLyogZmlsZVBhdGggKi8pIHt9XG4gIGNvbnN0cnVjdEFyZ3MoLyogZmlsZVBhdGggKi8pIHt9XG4gIHBhcnNlTG9nRmlsZSgvKiB0ZXhGaWxlUGF0aCAqLykge31cblxuICBwYXJzZUxvZ0ZpbGUodGV4RmlsZVBhdGgpIHtcbiAgICBjb25zdCBsb2dGaWxlUGF0aCA9IHRoaXMucmVzb2x2ZUxvZ0ZpbGVQYXRoKHRleEZpbGVQYXRoKTtcbiAgICBpZiAoIWZzLmV4aXN0c1N5bmMobG9nRmlsZVBhdGgpKSB7IHJldHVybiBudWxsOyB9XG5cbiAgICBjb25zdCBwYXJzZXIgPSB0aGlzLmdldExvZ1BhcnNlcihsb2dGaWxlUGF0aCk7XG4gICAgcmV0dXJuIHBhcnNlci5wYXJzZSgpO1xuICB9XG5cbiAgZ2V0TG9nUGFyc2VyKGxvZ0ZpbGVQYXRoKSB7XG4gICAgcmV0dXJuIG5ldyBMb2dQYXJzZXIobG9nRmlsZVBhdGgpO1xuICB9XG5cbiAgY29uc3RydWN0Q2hpbGRQcm9jZXNzT3B0aW9ucygpIHtcbiAgICBjb25zdCBlbnYgPSBfLmNsb25lKHByb2Nlc3MuZW52KTtcbiAgICBjb25zdCBjaGlsZFBhdGggPSB0aGlzLmNvbnN0cnVjdFBhdGgoKTtcbiAgICBpZiAoY2hpbGRQYXRoKSB7XG4gICAgICBlbnZbdGhpcy5lbnZQYXRoS2V5XSA9IGNoaWxkUGF0aDtcbiAgICB9XG5cbiAgICByZXR1cm4ge2Vudn07XG4gIH1cblxuICBjb25zdHJ1Y3RQYXRoKCkge1xuICAgIGxldCB0ZXhQYXRoID0gKGF0b20uY29uZmlnLmdldChcImxhdGV4LnRleFBhdGhcIikgfHwgXCJcIikudHJpbSgpO1xuICAgIGlmICh0ZXhQYXRoLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdGV4UGF0aCA9IHRoaXMuZGVmYXVsdFRleFBhdGgocHJvY2Vzcy5wbGF0Zm9ybSk7XG4gICAgfVxuXG4gICAgY29uc3QgcHJvY2Vzc1BhdGggPSBwcm9jZXNzLmVudlt0aGlzLmVudlBhdGhLZXldO1xuICAgIGNvbnN0IG1hdGNoID0gdGV4UGF0aC5tYXRjaCgvXiguKikoXFwkUEFUSCkoLiopJC8pO1xuICAgIGlmIChtYXRjaCkge1xuICAgICAgcmV0dXJuIGAke21hdGNoWzFdfSR7cHJvY2Vzc1BhdGh9JHttYXRjaFszXX1gO1xuICAgIH1cblxuICAgIHJldHVybiBbdGV4UGF0aCwgcHJvY2Vzc1BhdGhdXG4gICAgICAuZmlsdGVyKHN0ciA9PiBzdHIgJiYgc3RyLmxlbmd0aCA+IDApXG4gICAgICAuam9pbihwYXRoLmRlbGltaXRlcik7XG4gIH1cblxuICBkZWZhdWx0VGV4UGF0aChwbGF0Zm9ybSkge1xuICAgIGlmIChwbGF0Zm9ybSA9PT0gXCJ3aW4zMlwiKSB7XG4gICAgICByZXR1cm4gW1xuICAgICAgICBcIiVTeXN0ZW1Ecml2ZSVcXFxcdGV4bGl2ZVxcXFwyMDE1XFxcXGJpblxcXFx3aW4zMlwiLFxuICAgICAgICBcIiVTeXN0ZW1Ecml2ZSVcXFxcdGV4bGl2ZVxcXFwyMDE0XFxcXGJpblxcXFx3aW4zMlwiLFxuICAgICAgICBcIiVQcm9ncmFtRmlsZXMlXFxcXE1pS1RlWCAyLjlcXFxcbWlrdGV4XFxcXGJpblxcXFx4NjRcIixcbiAgICAgICAgXCIlUHJvZ3JhbUZpbGVzKHg4NiklXFxcXE1pS1RlWCAyLjlcXFxcbWlrdGV4XFxcXGJpblwiLFxuICAgICAgXS5qb2luKFwiO1wiKTtcbiAgICB9XG5cbiAgICByZXR1cm4gW1xuICAgICAgXCIvdXNyL3RleGJpblwiLFxuICAgICAgXCIvTGlicmFyeS9UZVgvdGV4YmluXCIsXG4gICAgXS5qb2luKFwiOlwiKTtcbiAgfVxuXG4gIHJlc29sdmVMb2dGaWxlUGF0aCh0ZXhGaWxlUGF0aCkge1xuICAgIGNvbnN0IG91dHB1dERpcmVjdG9yeSA9IGF0b20uY29uZmlnLmdldChcImxhdGV4Lm91dHB1dERpcmVjdG9yeVwiKSB8fCBcIlwiO1xuICAgIGNvbnN0IGN1cnJlbnREaXJlY3RvcnkgPSBwYXRoLmRpcm5hbWUodGV4RmlsZVBhdGgpO1xuICAgIGNvbnN0IGZpbGVOYW1lID0gcGF0aC5iYXNlbmFtZSh0ZXhGaWxlUGF0aCkucmVwbGFjZSgvXFwuXFx3KyQvLCBcIi5sb2dcIik7XG5cbiAgICByZXR1cm4gcGF0aC5qb2luKGN1cnJlbnREaXJlY3RvcnksIG91dHB1dERpcmVjdG9yeSwgZmlsZU5hbWUpO1xuICB9XG5cbiAgZ2V0RW52aXJvbm1lbnRQYXRoS2V5KHBsYXRmb3JtKSB7XG4gICAgaWYgKHBsYXRmb3JtID09PSBcIndpbjMyXCIpIHsgcmV0dXJuIFwiUGF0aFwiOyB9XG4gICAgcmV0dXJuIFwiUEFUSFwiO1xuICB9XG5cbiAgZ2V0T3V0cHV0RGlyZWN0b3J5KGZpbGVQYXRoKSB7XG4gICAgbGV0IG91dGRpciA9IGF0b20uY29uZmlnLmdldChcImxhdGV4Lm91dHB1dERpcmVjdG9yeVwiKTtcbiAgICBpZiAob3V0ZGlyKSB7XG4gICAgICBjb25zdCBkaXIgPSBwYXRoLmRpcm5hbWUoZmlsZVBhdGgpO1xuICAgICAgb3V0ZGlyID0gcGF0aC5qb2luKGRpciwgb3V0ZGlyKTtcbiAgICB9XG5cbiAgICByZXR1cm4gb3V0ZGlyO1xuICB9XG59XG4iXX0=
//# sourceURL=/home/cin_chalic/.atom/packages/latex/lib/builder.js
