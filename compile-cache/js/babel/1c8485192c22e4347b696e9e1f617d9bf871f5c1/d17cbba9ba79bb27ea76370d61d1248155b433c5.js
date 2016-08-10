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
    value: function run() {}
  }, {
    key: "constructArgs",
    value: function constructArgs() {}
  }, {
    key: "parseLogFile",
    value: function parseLogFile() {}
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
/* filePath */ /* filePath */ /* texFilePath */
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL2J1aWxkZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztzQkFFYyxRQUFROzs7O3NCQUNQLFNBQVM7Ozs7b0JBQ1AsTUFBTTs7OztnQ0FDRCxzQkFBc0I7Ozs7QUFMNUMsV0FBVyxDQUFDOztJQU9TLE9BQU87QUFDZixXQURRLE9BQU8sR0FDWjswQkFESyxPQUFPOztBQUV4QixRQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7R0FDaEU7O2VBSGtCLE9BQU87O1dBS3ZCLGVBQWlCLEVBQUU7OztXQUNULHlCQUFpQixFQUFFOzs7V0FDcEIsd0JBQW9CLEVBQUU7OztXQUV0QixzQkFBQyxXQUFXLEVBQUU7QUFDeEIsVUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQ3pELFVBQUksQ0FBQyxvQkFBRyxVQUFVLENBQUMsV0FBVyxDQUFDLEVBQUU7QUFBRSxlQUFPLElBQUksQ0FBQztPQUFFOztBQUVqRCxVQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQzlDLGFBQU8sTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO0tBQ3ZCOzs7V0FFVyxzQkFBQyxXQUFXLEVBQUU7QUFDeEIsYUFBTyxrQ0FBYyxXQUFXLENBQUMsQ0FBQztLQUNuQzs7O1dBRTJCLHdDQUFHO0FBQzdCLFVBQU0sR0FBRyxHQUFHLG9CQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDakMsVUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO0FBQ3ZDLFVBQUksU0FBUyxFQUFFO0FBQ2IsV0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxTQUFTLENBQUM7T0FDbEM7O0FBRUQsYUFBTyxFQUFDLEdBQUcsRUFBSCxHQUFHLEVBQUMsQ0FBQztLQUNkOzs7V0FFWSx5QkFBRztBQUNkLFVBQUksT0FBTyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLElBQUksRUFBRSxDQUFBLENBQUUsSUFBSSxFQUFFLENBQUM7QUFDOUQsVUFBSSxPQUFPLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtBQUN4QixlQUFPLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7T0FDakQ7O0FBRUQsVUFBTSxXQUFXLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDakQsVUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO0FBQ2xELFVBQUksS0FBSyxFQUFFO0FBQ1Qsb0JBQVUsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLFdBQVcsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUc7T0FDL0M7O0FBRUQsYUFBTyxDQUFDLE9BQU8sRUFBRSxXQUFXLENBQUMsQ0FDMUIsTUFBTSxDQUFDLFVBQUEsR0FBRztlQUFJLEdBQUcsSUFBSSxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUM7T0FBQSxDQUFDLENBQ3BDLElBQUksQ0FBQyxrQkFBSyxTQUFTLENBQUMsQ0FBQztLQUN6Qjs7O1dBRWEsd0JBQUMsUUFBUSxFQUFFO0FBQ3ZCLFVBQUksUUFBUSxLQUFLLE9BQU8sRUFBRTtBQUN4QixlQUFPLENBQ0wsMENBQTBDLEVBQzFDLDBDQUEwQyxFQUMxQyw4Q0FBOEMsRUFDOUMsOENBQThDLENBQy9DLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO09BQ2I7O0FBRUQsYUFBTyxDQUNMLGFBQWEsRUFDYixxQkFBcUIsQ0FDdEIsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7S0FDYjs7O1dBRWlCLDRCQUFDLFdBQVcsRUFBRTtBQUM5QixVQUFNLGVBQWUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUN2RSxVQUFNLGdCQUFnQixHQUFHLGtCQUFLLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUNuRCxVQUFNLFFBQVEsR0FBRyxrQkFBSyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQzs7QUFFdEUsYUFBTyxrQkFBSyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsZUFBZSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0tBQy9EOzs7V0FFb0IsK0JBQUMsUUFBUSxFQUFFO0FBQzlCLFVBQUksUUFBUSxLQUFLLE9BQU8sRUFBRTtBQUFFLGVBQU8sTUFBTSxDQUFDO09BQUU7QUFDNUMsYUFBTyxNQUFNLENBQUM7S0FDZjs7O1dBRWlCLDRCQUFDLFFBQVEsRUFBRTtBQUMzQixVQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO0FBQ3RELFVBQUksTUFBTSxFQUFFO0FBQ1YsWUFBTSxHQUFHLEdBQUcsa0JBQUssT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ25DLGNBQU0sR0FBRyxrQkFBSyxJQUFJLENBQUMsR0FBRyxFQUFFLE1BQU0sQ0FBQyxDQUFDO09BQ2pDOztBQUVELGFBQU8sTUFBTSxDQUFDO0tBQ2Y7OztTQXJGa0IsT0FBTzs7O3FCQUFQLE9BQU8iLCJmaWxlIjoiL2hvbWUvY2luX2NoYWxpYy8uYXRvbS9wYWNrYWdlcy9sYXRleC9saWIvYnVpbGRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIGJhYmVsXCI7XG5cbmltcG9ydCBfIGZyb20gXCJsb2Rhc2hcIjtcbmltcG9ydCBmcyBmcm9tIFwiZnMtcGx1c1wiO1xuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcbmltcG9ydCBMb2dQYXJzZXIgZnJvbSBcIi4vcGFyc2Vycy9sb2ctcGFyc2VyXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJ1aWxkZXIge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmVudlBhdGhLZXkgPSB0aGlzLmdldEVudmlyb25tZW50UGF0aEtleShwcm9jZXNzLnBsYXRmb3JtKTtcbiAgfVxuXG4gIHJ1bigvKiBmaWxlUGF0aCAqLykge31cbiAgY29uc3RydWN0QXJncygvKiBmaWxlUGF0aCAqLykge31cbiAgcGFyc2VMb2dGaWxlKC8qIHRleEZpbGVQYXRoICovKSB7fVxuXG4gIHBhcnNlTG9nRmlsZSh0ZXhGaWxlUGF0aCkge1xuICAgIGNvbnN0IGxvZ0ZpbGVQYXRoID0gdGhpcy5yZXNvbHZlTG9nRmlsZVBhdGgodGV4RmlsZVBhdGgpO1xuICAgIGlmICghZnMuZXhpc3RzU3luYyhsb2dGaWxlUGF0aCkpIHsgcmV0dXJuIG51bGw7IH1cblxuICAgIGNvbnN0IHBhcnNlciA9IHRoaXMuZ2V0TG9nUGFyc2VyKGxvZ0ZpbGVQYXRoKTtcbiAgICByZXR1cm4gcGFyc2VyLnBhcnNlKCk7XG4gIH1cblxuICBnZXRMb2dQYXJzZXIobG9nRmlsZVBhdGgpIHtcbiAgICByZXR1cm4gbmV3IExvZ1BhcnNlcihsb2dGaWxlUGF0aCk7XG4gIH1cblxuICBjb25zdHJ1Y3RDaGlsZFByb2Nlc3NPcHRpb25zKCkge1xuICAgIGNvbnN0IGVudiA9IF8uY2xvbmUocHJvY2Vzcy5lbnYpO1xuICAgIGNvbnN0IGNoaWxkUGF0aCA9IHRoaXMuY29uc3RydWN0UGF0aCgpO1xuICAgIGlmIChjaGlsZFBhdGgpIHtcbiAgICAgIGVudlt0aGlzLmVudlBhdGhLZXldID0gY2hpbGRQYXRoO1xuICAgIH1cblxuICAgIHJldHVybiB7ZW52fTtcbiAgfVxuXG4gIGNvbnN0cnVjdFBhdGgoKSB7XG4gICAgbGV0IHRleFBhdGggPSAoYXRvbS5jb25maWcuZ2V0KFwibGF0ZXgudGV4UGF0aFwiKSB8fCBcIlwiKS50cmltKCk7XG4gICAgaWYgKHRleFBhdGgubGVuZ3RoID09PSAwKSB7XG4gICAgICB0ZXhQYXRoID0gdGhpcy5kZWZhdWx0VGV4UGF0aChwcm9jZXNzLnBsYXRmb3JtKTtcbiAgICB9XG5cbiAgICBjb25zdCBwcm9jZXNzUGF0aCA9IHByb2Nlc3MuZW52W3RoaXMuZW52UGF0aEtleV07XG4gICAgY29uc3QgbWF0Y2ggPSB0ZXhQYXRoLm1hdGNoKC9eKC4qKShcXCRQQVRIKSguKikkLyk7XG4gICAgaWYgKG1hdGNoKSB7XG4gICAgICByZXR1cm4gYCR7bWF0Y2hbMV19JHtwcm9jZXNzUGF0aH0ke21hdGNoWzNdfWA7XG4gICAgfVxuXG4gICAgcmV0dXJuIFt0ZXhQYXRoLCBwcm9jZXNzUGF0aF1cbiAgICAgIC5maWx0ZXIoc3RyID0+IHN0ciAmJiBzdHIubGVuZ3RoID4gMClcbiAgICAgIC5qb2luKHBhdGguZGVsaW1pdGVyKTtcbiAgfVxuXG4gIGRlZmF1bHRUZXhQYXRoKHBsYXRmb3JtKSB7XG4gICAgaWYgKHBsYXRmb3JtID09PSBcIndpbjMyXCIpIHtcbiAgICAgIHJldHVybiBbXG4gICAgICAgIFwiJVN5c3RlbURyaXZlJVxcXFx0ZXhsaXZlXFxcXDIwMTVcXFxcYmluXFxcXHdpbjMyXCIsXG4gICAgICAgIFwiJVN5c3RlbURyaXZlJVxcXFx0ZXhsaXZlXFxcXDIwMTRcXFxcYmluXFxcXHdpbjMyXCIsXG4gICAgICAgIFwiJVByb2dyYW1GaWxlcyVcXFxcTWlLVGVYIDIuOVxcXFxtaWt0ZXhcXFxcYmluXFxcXHg2NFwiLFxuICAgICAgICBcIiVQcm9ncmFtRmlsZXMoeDg2KSVcXFxcTWlLVGVYIDIuOVxcXFxtaWt0ZXhcXFxcYmluXCIsXG4gICAgICBdLmpvaW4oXCI7XCIpO1xuICAgIH1cblxuICAgIHJldHVybiBbXG4gICAgICBcIi91c3IvdGV4YmluXCIsXG4gICAgICBcIi9MaWJyYXJ5L1RlWC90ZXhiaW5cIixcbiAgICBdLmpvaW4oXCI6XCIpO1xuICB9XG5cbiAgcmVzb2x2ZUxvZ0ZpbGVQYXRoKHRleEZpbGVQYXRoKSB7XG4gICAgY29uc3Qgb3V0cHV0RGlyZWN0b3J5ID0gYXRvbS5jb25maWcuZ2V0KFwibGF0ZXgub3V0cHV0RGlyZWN0b3J5XCIpIHx8IFwiXCI7XG4gICAgY29uc3QgY3VycmVudERpcmVjdG9yeSA9IHBhdGguZGlybmFtZSh0ZXhGaWxlUGF0aCk7XG4gICAgY29uc3QgZmlsZU5hbWUgPSBwYXRoLmJhc2VuYW1lKHRleEZpbGVQYXRoKS5yZXBsYWNlKC9cXC5cXHcrJC8sIFwiLmxvZ1wiKTtcblxuICAgIHJldHVybiBwYXRoLmpvaW4oY3VycmVudERpcmVjdG9yeSwgb3V0cHV0RGlyZWN0b3J5LCBmaWxlTmFtZSk7XG4gIH1cblxuICBnZXRFbnZpcm9ubWVudFBhdGhLZXkocGxhdGZvcm0pIHtcbiAgICBpZiAocGxhdGZvcm0gPT09IFwid2luMzJcIikgeyByZXR1cm4gXCJQYXRoXCI7IH1cbiAgICByZXR1cm4gXCJQQVRIXCI7XG4gIH1cblxuICBnZXRPdXRwdXREaXJlY3RvcnkoZmlsZVBhdGgpIHtcbiAgICBsZXQgb3V0ZGlyID0gYXRvbS5jb25maWcuZ2V0KFwibGF0ZXgub3V0cHV0RGlyZWN0b3J5XCIpO1xuICAgIGlmIChvdXRkaXIpIHtcbiAgICAgIGNvbnN0IGRpciA9IHBhdGguZGlybmFtZShmaWxlUGF0aCk7XG4gICAgICBvdXRkaXIgPSBwYXRoLmpvaW4oZGlyLCBvdXRkaXIpO1xuICAgIH1cblxuICAgIHJldHVybiBvdXRkaXI7XG4gIH1cbn1cbiJdfQ==