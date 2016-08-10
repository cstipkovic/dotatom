Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _fsPlus = require("fs-plus");

var _fsPlus2 = _interopRequireDefault(_fsPlus);

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _werkzeug = require("./werkzeug");

"use babel";

function defineDefaultProperty(target, property) {
  var shadowProperty = "__" + property;
  var defaultGetter = "getDefault" + _lodash2["default"].capitalize(property);

  Object.defineProperty(target, property, {
    get: function get() {
      if (!target[shadowProperty]) {
        target[shadowProperty] = target[defaultGetter].apply(target);
      }
      return target[shadowProperty];
    },

    set: function set(value) {
      target[shadowProperty] = value;
    }
  });
}

var Latex = (function () {
  function Latex() {
    _classCallCheck(this, Latex);

    this.createLogProxy();

    defineDefaultProperty(this, "builder");
    defineDefaultProperty(this, "logger");
    defineDefaultProperty(this, "opener");

    this.observeOpenerConfig();
    this.observeBuilderConfig();
  }

  _createClass(Latex, [{
    key: "getBuilder",
    value: function getBuilder() {
      return this.builder;
    }
  }, {
    key: "getLogger",
    value: function getLogger() {
      return this.logger;
    }
  }, {
    key: "getOpener",
    value: function getOpener() {
      return this.opener;
    }
  }, {
    key: "setLogger",
    value: function setLogger(logger) {
      this.logger = logger;
    }
  }, {
    key: "getDefaultBuilder",
    value: function getDefaultBuilder() {
      var BuilderClass = null;
      if (this.useLatexmk()) {
        BuilderClass = require("./builders/latexmk");
      } else {
        BuilderClass = require("./builders/texify");
      }
      return new BuilderClass();
    }
  }, {
    key: "getDefaultLogger",
    value: function getDefaultLogger() {
      var ConsoleLogger = require("./loggers/console-logger");
      return new ConsoleLogger();
    }
  }, {
    key: "getDefaultOpener",
    value: function getDefaultOpener() {
      var OpenerImpl = this.resolveOpenerImplementation(process.platform);
      if (OpenerImpl) {
        return new OpenerImpl();
      }

      if (this["__logger"] && this.log) {
        this.log.warning((0, _werkzeug.heredoc)("\n        No PDF opener found.\n        For cross-platform viewing, consider installing the pdf-view package.\n        "));
      }
    }
  }, {
    key: "createLogProxy",
    value: function createLogProxy() {
      var _this = this;

      this.log = {
        error: function error(statusCode, result, builder) {
          _this.logger.error(statusCode, result, builder);
        },
        warning: function warning(message) {
          _this.logger.warning(message);
        },
        info: function info(message) {
          _this.logger.info(message);
        }
      };
    }
  }, {
    key: "observeOpenerConfig",
    value: function observeOpenerConfig() {
      var _this2 = this;

      var callback = function callback() {
        _this2["__opener"] = _this2.getDefaultOpener();
      };
      atom.config.onDidChange("latex.alwaysOpenResultInAtom", callback);
      atom.config.onDidChange("latex.skimPath", callback);
      atom.config.onDidChange("latex.sumatraPath", callback);
    }
  }, {
    key: "observeBuilderConfig",
    value: function observeBuilderConfig() {
      var _this3 = this;

      var callback = function callback() {
        _this3["__builder"] = _this3.getDefaultBuilder();
      };
      atom.config.onDidChange("latex.builder", callback);
    }
  }, {
    key: "resolveOpenerImplementation",
    value: function resolveOpenerImplementation(platform) {
      if (this.hasPdfViewerPackage() && this.shouldOpenResultInAtom()) {
        return require("./openers/atompdf-opener");
      }

      if (this.viewerExecutableExists()) {
        return require("./openers/custom-opener");
      }

      switch (platform) {
        case "darwin":
          if (this.skimExecutableExists()) {
            return require("./openers/skim-opener");
          }

          return require("./openers/preview-opener");

        case "win32":
          if (this.sumatraExecutableExists()) {
            return require("./openers/sumatra-opener");
          }
      }

      if (this.hasPdfViewerPackage()) {
        return require("./openers/atompdf-opener");
      }

      return null;
    }
  }, {
    key: "hasPdfViewerPackage",
    value: function hasPdfViewerPackage() {
      return !!atom.packages.resolvePackagePath("pdf-view");
    }
  }, {
    key: "shouldOpenResultInAtom",
    value: function shouldOpenResultInAtom() {
      return atom.config.get("latex.alwaysOpenResultInAtom");
    }
  }, {
    key: "skimExecutableExists",
    value: function skimExecutableExists() {
      return _fsPlus2["default"].existsSync(atom.config.get("latex.skimPath"));
    }
  }, {
    key: "sumatraExecutableExists",
    value: function sumatraExecutableExists() {
      return _fsPlus2["default"].existsSync(atom.config.get("latex.sumatraPath"));
    }
  }, {
    key: "viewerExecutableExists",
    value: function viewerExecutableExists() {
      return _fsPlus2["default"].existsSync(atom.config.get("latex.viewerPath"));
    }
  }, {
    key: "useLatexmk",
    value: function useLatexmk() {
      return atom.config.get("latex.builder") === "latexmk";
    }
  }]);

  return Latex;
})();

exports["default"] = Latex;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL2xhdGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7c0JBRWUsU0FBUzs7OztzQkFDVixRQUFROzs7O3dCQUNBLFlBQVk7O0FBSmxDLFdBQVcsQ0FBQzs7QUFNWixTQUFTLHFCQUFxQixDQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUU7QUFDL0MsTUFBTSxjQUFjLFVBQVEsUUFBUSxBQUFFLENBQUM7QUFDdkMsTUFBTSxhQUFhLGtCQUFnQixvQkFBRSxVQUFVLENBQUMsUUFBUSxDQUFDLEFBQUUsQ0FBQzs7QUFFNUQsUUFBTSxDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUUsUUFBUSxFQUFFO0FBQ3RDLE9BQUcsRUFBRSxlQUFXO0FBQ2QsVUFBSSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsRUFBRTtBQUMzQixjQUFNLENBQUMsY0FBYyxDQUFDLEdBQUcsTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztPQUM5RDtBQUNELGFBQU8sTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0tBQy9COztBQUVELE9BQUcsRUFBRSxhQUFTLEtBQUssRUFBRTtBQUFFLFlBQU0sQ0FBQyxjQUFjLENBQUMsR0FBRyxLQUFLLENBQUM7S0FBRTtHQUN6RCxDQUFDLENBQUM7Q0FDSjs7SUFFb0IsS0FBSztBQUNiLFdBRFEsS0FBSyxHQUNWOzBCQURLLEtBQUs7O0FBRXRCLFFBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQzs7QUFFdEIseUJBQXFCLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBQ3ZDLHlCQUFxQixDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztBQUN0Qyx5QkFBcUIsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7O0FBRXRDLFFBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO0FBQzNCLFFBQUksQ0FBQyxvQkFBb0Is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M0Q7OztXQUVTLHNCQUFHO0FBQ1gsYUFBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsS0FBSyxTQUFTLENBQUM7S0FDdkQ7OztTQWpJa0IsS0FBSzs7O3FCQUFMLEtBQUsiLCJmaWxlIjoiL2hvbWUvY2luX2NoYWxpYy8uYXRvbS9wYWNrYWdlcy9sYXRleC9saWIvbGF0ZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBiYWJlbFwiO1xuXG5pbXBvcnQgZnMgZnJvbSBcImZzLXBsdXNcIjtcbmltcG9ydCBfIGZyb20gXCJsb2Rhc2hcIjtcbmltcG9ydCB7aGVyZWRvY30gZnJvbSBcIi4vd2Vya3pldWdcIjtcblxuZnVuY3Rpb24gZGVmaW5lRGVmYXVsdFByb3BlcnR5KHRhcmdldCwgcHJvcGVydHkpIHtcbiAgY29uc3Qgc2hhZG93UHJvcGVydHkgPSBgX18ke3Byb3BlcnR5fWA7XG4gIGNvbnN0IGRlZmF1bHRHZXR0ZXIgPSBgZ2V0RGVmYXVsdCR7Xy5jYXBpdGFsaXplKHByb3BlcnR5KX1gO1xuXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIHByb3BlcnR5LCB7XG4gICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgIGlmICghdGFyZ2V0W3NoYWRvd1Byb3BlcnR5XSkge1xuICAgICAgICB0YXJnZXRbc2hhZG93UHJvcGVydHldID0gdGFyZ2V0W2RlZmF1bHRHZXR0ZXJdLmFwcGx5KHRhcmdldCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGFyZ2V0W3NoYWRvd1Byb3BlcnR5XTtcbiAgICB9LFxuXG4gICAgc2V0OiBmdW5jdGlvbih2YWx1ZSkgeyB0YXJnZXRbc2hhZG93UHJvcGVydHldID0gdmFsdWU7IH0sXG4gIH0pO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMYXRleCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuY3JlYXRlTG9nUHJveHkoKTtcblxuICAgIGRlZmluZURlZmF1bHRQcm9wZXJ0eSh0aGlzLCBcImJ1aWxkZXJcIik7XG4gICAgZGVmaW5lRGVmYXVsdFByb3BlcnR5KHRoaXMsIFwibG9nZ2VyXCIpO1xuICAgIGRlZmluZURlZmF1bHRQcm9wZXJ0eSh0aGlzLCBcIm9wZW5lclwiKTtcblxuICAgIHRoaXMub2JzZXJ2ZU9wZW5lckNvbmZpZygpO1xuICAgIHRoaXMub2JzZXJ2ZUJ1aWxkZXJDb25maWcoKTtcbiAgfVxuXG4gIGdldEJ1aWxkZXIoKSB7IHJldHVybiB0aGlzLmJ1aWxkZXI7IH1cbiAgZ2V0TG9nZ2VyKCkgeyByZXR1cm4gdGhpcy5sb2dnZXI7IH1cbiAgZ2V0T3BlbmVyKCkgeyByZXR1cm4gdGhpcy5vcGVuZXI7IH1cblxuICBzZXRMb2dnZXIobG9nZ2VyKSB7XG4gICAgdGhpcy5sb2dnZXIgPSBsb2dnZXI7XG4gIH1cblxuICBnZXREZWZhdWx0QnVpbGRlcigpIHtcbiAgICBsZXQgQnVpbGRlckNsYXNzID0gbnVsbDtcbiAgICBpZiAodGhpcy51c2VMYXRleG1rKCkpIHtcbiAgICAgIEJ1aWxkZXJDbGFzcyA9IHJlcXVpcmUoXCIuL2J1aWxkZXJzL2xhdGV4bWtcIik7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgQnVpbGRlckNsYXNzID0gcmVxdWlyZShcIi4vYnVpbGRlcnMvdGV4aWZ5XCIpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IEJ1aWxkZXJDbGFzcygpO1xuICB9XG5cbiAgZ2V0RGVmYXVsdExvZ2dlcigpIHtcbiAgICBjb25zdCBDb25zb2xlTG9nZ2VyID0gcmVxdWlyZShcIi4vbG9nZ2Vycy9jb25zb2xlLWxvZ2dlclwiKTtcbiAgICByZXR1cm4gbmV3IENvbnNvbGVMb2dnZXIoKTtcbiAgfVxuXG4gIGdldERlZmF1bHRPcGVuZXIoKSB7XG4gICAgY29uc3QgT3BlbmVySW1wbCA9IHRoaXMucmVzb2x2ZU9wZW5lckltcGxlbWVudGF0aW9uKHByb2Nlc3MucGxhdGZvcm0pO1xuICAgIGlmIChPcGVuZXJJbXBsKSB7XG4gICAgICByZXR1cm4gbmV3IE9wZW5lckltcGwoKTtcbiAgICB9XG5cbiAgICBpZiAodGhpc1tcIl9fbG9nZ2VyXCJdICYmIHRoaXMubG9nKSB7XG4gICAgICB0aGlzLmxvZy53YXJuaW5nKGhlcmVkb2MoYFxuICAgICAgICBObyBQREYgb3BlbmVyIGZvdW5kLlxuICAgICAgICBGb3IgY3Jvc3MtcGxhdGZvcm0gdmlld2luZywgY29uc2lkZXIgaW5zdGFsbGluZyB0aGUgcGRmLXZpZXcgcGFja2FnZS5cbiAgICAgICAgYClcbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgY3JlYXRlTG9nUHJveHkoKSB7XG4gICAgdGhpcy5sb2cgPSB7XG4gICAgICBlcnJvcjogKHN0YXR1c0NvZGUsIHJlc3VsdCwgYnVpbGRlcikgPT4ge1xuICAgICAgICB0aGlzLmxvZ2dlci5lcnJvcihzdGF0dXNDb2RlLCByZXN1bHQsIGJ1aWxkZXIpO1xuICAgICAgfSxcbiAgICAgIHdhcm5pbmc6IChtZXNzYWdlKSA9PiB7XG4gICAgICAgIHRoaXMubG9nZ2VyLndhcm5pbmcobWVzc2FnZSk7XG4gICAgICB9LFxuICAgICAgaW5mbzogKG1lc3NhZ2UpID0+IHtcbiAgICAgICAgdGhpcy5sb2dnZXIuaW5mbyhtZXNzYWdlKTtcbiAgICAgIH0sXG4gICAgfTtcbiAgfVxuXG4gIG9ic2VydmVPcGVuZXJDb25maWcoKSB7XG4gICAgY29uc3QgY2FsbGJhY2sgPSAoKSA9PiB7IHRoaXNbXCJfX29wZW5lclwiXSA9IHRoaXMuZ2V0RGVmYXVsdE9wZW5lcigpOyB9O1xuICAgIGF0b20uY29uZmlnLm9uRGlkQ2hhbmdlKFwibGF0ZXguYWx3YXlzT3BlblJlc3VsdEluQXRvbVwiLCBjYWxsYmFjayk7XG4gICAgYXRvbS5jb25maWcub25EaWRDaGFuZ2UoXCJsYXRleC5za2ltUGF0aFwiLCBjYWxsYmFjayk7XG4gICAgYXRvbS5jb25maWcub25EaWRDaGFuZ2UoXCJsYXRleC5zdW1hdHJhUGF0aFwiLCBjYWxsYmFjayk7XG4gIH1cblxuICBvYnNlcnZlQnVpbGRlckNvbmZpZygpIHtcbiAgICBjb25zdCBjYWxsYmFjayA9ICgpID0+IHsgdGhpc1tcIl9fYnVpbGRlclwiXSA9IHRoaXMuZ2V0RGVmYXVsdEJ1aWxkZXIoKTsgfTtcbiAgICBhdG9tLmNvbmZpZy5vbkRpZENoYW5nZShcImxhdGV4LmJ1aWxkZXJcIiwgY2FsbGJhY2spO1xuICB9XG5cbiAgcmVzb2x2ZU9wZW5lckltcGxlbWVudGF0aW9uKHBsYXRmb3JtKSB7XG4gICAgaWYgKHRoaXMuaGFzUGRmVmlld2VyUGFja2FnZSgpICYmIHRoaXMuc2hvdWxkT3BlblJlc3VsdEluQXRvbSgpKSB7XG4gICAgICByZXR1cm4gcmVxdWlyZShcIi4vb3BlbmVycy9hdG9tcGRmLW9wZW5lclwiKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy52aWV3ZXJFeGVjdXRhYmxlRXhpc3RzKCkpIHtcbiAgICAgIHJldHVybiByZXF1aXJlKFwiLi9vcGVuZXJzL2N1c3RvbS1vcGVuZXJcIik7XG4gICAgfVxuXG4gICAgc3dpdGNoIChwbGF0Zm9ybSkge1xuICAgICAgY2FzZSBcImRhcndpblwiOlxuICAgICAgICBpZiAodGhpcy5za2ltRXhlY3V0YWJsZUV4aXN0cygpKSB7XG4gICAgICAgICAgcmV0dXJuIHJlcXVpcmUoXCIuL29wZW5lcnMvc2tpbS1vcGVuZXJcIik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVxdWlyZShcIi4vb3BlbmVycy9wcmV2aWV3LW9wZW5lclwiKTtcblxuICAgICAgY2FzZSBcIndpbjMyXCI6XG4gICAgICAgIGlmICh0aGlzLnN1bWF0cmFFeGVjdXRhYmxlRXhpc3RzKCkpIHtcbiAgICAgICAgICByZXR1cm4gcmVxdWlyZShcIi4vb3BlbmVycy9zdW1hdHJhLW9wZW5lclwiKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLmhhc1BkZlZpZXdlclBhY2thZ2UoKSkge1xuICAgICAgcmV0dXJuIHJlcXVpcmUoXCIuL29wZW5lcnMvYXRvbXBkZi1vcGVuZXJcIik7XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBoYXNQZGZWaWV3ZXJQYWNrYWdlKCkge1xuICAgIHJldHVybiAhIWF0b20ucGFja2FnZXMucmVzb2x2ZVBhY2thZ2VQYXRoKFwicGRmLXZpZXdcIik7XG4gIH1cblxuICBzaG91bGRPcGVuUmVzdWx0SW5BdG9tKCkge1xuICAgIHJldHVybiBhdG9tLmNvbmZpZy5nZXQoXCJsYXRleC5hbHdheXNPcGVuUmVzdWx0SW5BdG9tXCIpO1xuICB9XG5cbiAgc2tpbUV4ZWN1dGFibGVFeGlzdHMoKSB7XG4gICAgcmV0dXJuIGZzLmV4aXN0c1N5bmMoYXRvbS5jb25maWcuZ2V0KFwibGF0ZXguc2tpbVBhdGhcIikpO1xuICB9XG5cbiAgc3VtYXRyYUV4ZWN1dGFibGVFeGlzdHMoKSB7XG4gICAgcmV0dXJuIGZzLmV4aXN0c1N5bmMoYXRvbS5jb25maWcuZ2V0KFwibGF0ZXguc3VtYXRyYVBhdGhcIikpO1xuICB9XG5cbiAgdmlld2VyRXhlY3V0YWJsZUV4aXN0cygpIHtcbiAgICByZXR1cm4gZnMuZXhpc3RzU3luYyhhdG9tLmNvbmZpZy5nZXQoXCJsYXRleC52aWV3ZXJQYXRoXCIpKTtcbiAgfVxuXG4gIHVzZUxhdGV4bWsoKSB7XG4gICAgcmV0dXJuIGF0b20uY29uZmlnLmdldChcImxhdGV4LmJ1aWxkZXJcIikgPT09IFwibGF0ZXhta1wiO1xuICB9XG59XG4iXX0=