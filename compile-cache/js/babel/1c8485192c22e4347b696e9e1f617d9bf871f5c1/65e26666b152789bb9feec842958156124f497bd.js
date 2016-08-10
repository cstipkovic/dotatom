Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

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
        return ["C:\\texlive\\2014\\bin\\win32", "C:\\Program Files\\MiKTeX 2.9\\miktex\\bin\\x64", "C:\\Program Files (x86)\\MiKTeX 2.9\\miktex\\bin"].join(";");
      }

      return "/usr/texbin";
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
  }]);

  return Builder;
})();

exports["default"] = Builder;
module.exports = exports["default"];
/* filePath */ /* filePath */ /* texFilePath */
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL2J1aWxkZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztzQkFFYyxRQUFROzs7O29CQUNMLE1BQU07Ozs7QUFIdkIsV0FBVyxDQUFDOztJQUtTLE9BQU87QUFDZixXQURRLE9BQU8sR0FDWjswQkFESyxPQUFPOztBQUV4QixRQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7R0FDaEU7O2VBSGtCLE9BQU87O1dBS3ZCLGVBQWlCLEVBQUU7OztXQUNULHlCQUFpQixFQUFFOzs7V0FDcEIsd0JBQW9CLEVBQUU7OztXQUVOLHdDQUFHO0FBQzdCLFVBQU0sR0FBRyxHQUFHLG9CQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDakMsVUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO0FBQ3ZDLFVBQUksU0FBUyxFQUFFO0FBQ2IsV0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxTQUFTLENBQUM7T0FDbEM7O0FBRUQsYUFBTyxFQUFDLEdBQUcsRUFBSCxHQUFHLEVBQUMsQ0FBQztLQUNkOzs7V0FFWSx5QkFBRztBQUNkLFVBQUksT0FBTyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLElBQUksRUFBRSxDQUFBLENBQUUsSUFBSSxFQUFFLENBQUM7QUFDOUQsVUFBSSxPQUFPLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtBQUN4QixlQUFPLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7T0FDakQ7O0FBRUQsVUFBTSxXQUFXLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDakQsVUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO0FBQ2xELFVBQUksS0FBSyxFQUFFO0FBQ1Qsb0JBQVUsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLFdBQVcsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUc7T0FDL0M7O0FBRUQsYUFBTyxDQUFDLE9BQU8sRUFBRSxXQUFXLENBQUMsQ0FDMUIsTUFBTSxDQUFDLFVBQUEsR0FBRztlQUFJLEdBQUcsSUFBSSxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUM7T0FBQSxDQUFDLENBQ3BDLElBQUksQ0FBQyxrQkFBSyxTQUFTLENBQUMsQ0FBQztLQUN6Qjs7O1dBRWEsd0JBQUMsUUFBUSxFQUFFO0FBQ3ZCLFVBQUksUUFBUSxLQUFLLE9BQU8sRUFBRTtBQUN4QixlQUFPLENBQ0wsK0JBQStCLEVBQy9CLGlEQUFpRCxFQUNqRCxrREFBa0QsQ0FDbkQsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7T0FDYjs7QUFFRCxhQUFPLGFBQWEsQ0FBQztLQUN0Qjs7O1dBRWlCLDRCQUFDLFdBQVcsRUFBRTtBQUM5QixVQUFNLGVBQWUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUN2RSxVQUFNLGdCQUFnQixHQUFHLGtCQUFLLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUNuRCxVQUFNLFFBQVEsR0FBRyxrQkFBSyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQzs7QUFFdEUsYUFBTyxrQkFBSyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsZUFBZSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0tBQy9EOzs7V0FFb0IsK0JBQUMsUUFBUSxFQUFFO0FBQzlCLFVBQUksUUFBUSxLQUFLLE9BQU8sRUFBRTtBQUFFLGVBQU8sTUFBTSxDQUFDO09BQUU7QUFDNUMsYUFBTyxNQUFNLENBQUM7S0FDZjs7O1NBM0RrQixPQUFPOzs7cUJBQVAsT0FBTyIsImZpbGUiOiIvaG9tZS9jaW5fY2hhbGljLy5hdG9tL3BhY2thZ2VzL2xhdGV4L2xpYi9idWlsZGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2UgYmFiZWxcIjtcblxuaW1wb3J0IF8gZnJvbSBcImxvZGFzaFwiO1xuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQnVpbGRlciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuZW52UGF0aEtleSA9IHRoaXMuZ2V0RW52aXJvbm1lbnRQYXRoS2V5KHByb2Nlc3MucGxhdGZvcm0pO1xuICB9XG5cbiAgcnVuKC8qIGZpbGVQYXRoICovKSB7fVxuICBjb25zdHJ1Y3RBcmdzKC8qIGZpbGVQYXRoICovKSB7fVxuICBwYXJzZUxvZ0ZpbGUoLyogdGV4RmlsZVBhdGggKi8pIHt9XG5cbiAgY29uc3RydWN0Q2hpbGRQcm9jZXNzT3B0aW9ucygpIHtcbiAgICBjb25zdCBlbnYgPSBfLmNsb25lKHByb2Nlc3MuZW52KTtcbiAgICBjb25zdCBjaGlsZFBhdGggPSB0aGlzLmNvbnN0cnVjdFBhdGgoKTtcbiAgICBpZiAoY2hpbGRQYXRoKSB7XG4gICAgICBlbnZbdGhpcy5lbnZQYXRoS2V5XSA9IGNoaWxkUGF0aDtcbiAgICB9XG5cbiAgICByZXR1cm4ge2Vudn07XG4gIH1cblxuICBjb25zdHJ1Y3RQYXRoKCkge1xuICAgIGxldCB0ZXhQYXRoID0gKGF0b20uY29uZmlnLmdldChcImxhdGV4LnRleFBhdGhcIikgfHwgXCJcIikudHJpbSgpO1xuICAgIGlmICh0ZXhQYXRoLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdGV4UGF0aCA9IHRoaXMuZGVmYXVsdFRleFBhdGgocHJvY2Vzcy5wbGF0Zm9ybSk7XG4gICAgfVxuXG4gICAgY29uc3QgcHJvY2Vzc1BhdGggPSBwcm9jZXNzLmVudlt0aGlzLmVudlBhdGhLZXldO1xuICAgIGNvbnN0IG1hdGNoID0gdGV4UGF0aC5tYXRjaCgvXiguKikoXFwkUEFUSCkoLiopJC8pO1xuICAgIGlmIChtYXRjaCkge1xuICAgICAgcmV0dXJuIGAke21hdGNoWzFdfSR7cHJvY2Vzc1BhdGh9JHttYXRjaFszXX1gO1xuICAgIH1cblxuICAgIHJldHVybiBbdGV4UGF0aCwgcHJvY2Vzc1BhdGhdXG4gICAgICAuZmlsdGVyKHN0ciA9PiBzdHIgJiYgc3RyLmxlbmd0aCA+IDApXG4gICAgICAuam9pbihwYXRoLmRlbGltaXRlcik7XG4gIH1cblxuICBkZWZhdWx0VGV4UGF0aChwbGF0Zm9ybSkge1xuICAgIGlmIChwbGF0Zm9ybSA9PT0gXCJ3aW4zMlwiKSB7XG4gICAgICByZXR1cm4gW1xuICAgICAgICBcIkM6XFxcXHRleGxpdmVcXFxcMjAxNFxcXFxiaW5cXFxcd2luMzJcIixcbiAgICAgICAgXCJDOlxcXFxQcm9ncmFtIEZpbGVzXFxcXE1pS1RlWCAyLjlcXFxcbWlrdGV4XFxcXGJpblxcXFx4NjRcIixcbiAgICAgICAgXCJDOlxcXFxQcm9ncmFtIEZpbGVzICh4ODYpXFxcXE1pS1RlWCAyLjlcXFxcbWlrdGV4XFxcXGJpblwiLFxuICAgICAgXS5qb2luKFwiO1wiKTtcbiAgICB9XG5cbiAgICByZXR1cm4gXCIvdXNyL3RleGJpblwiO1xuICB9XG5cbiAgcmVzb2x2ZUxvZ0ZpbGVQYXRoKHRleEZpbGVQYXRoKSB7XG4gICAgY29uc3Qgb3V0cHV0RGlyZWN0b3J5ID0gYXRvbS5jb25maWcuZ2V0KFwibGF0ZXgub3V0cHV0RGlyZWN0b3J5XCIpIHx8IFwiXCI7XG4gICAgY29uc3QgY3VycmVudERpcmVjdG9yeSA9IHBhdGguZGlybmFtZSh0ZXhGaWxlUGF0aCk7XG4gICAgY29uc3QgZmlsZU5hbWUgPSBwYXRoLmJhc2VuYW1lKHRleEZpbGVQYXRoKS5yZXBsYWNlKC9cXC5cXHcrJC8sIFwiLmxvZ1wiKTtcblxuICAgIHJldHVybiBwYXRoLmpvaW4oY3VycmVudERpcmVjdG9yeSwgb3V0cHV0RGlyZWN0b3J5LCBmaWxlTmFtZSk7XG4gIH1cblxuICBnZXRFbnZpcm9ubWVudFBhdGhLZXkocGxhdGZvcm0pIHtcbiAgICBpZiAocGxhdGZvcm0gPT09IFwid2luMzJcIikgeyByZXR1cm4gXCJQYXRoXCI7IH1cbiAgICByZXR1cm4gXCJQQVRIXCI7XG4gIH1cbn1cbiJdfQ==