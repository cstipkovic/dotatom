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
      atom.config.onDidChange("latex.okularPath", callback);
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

        case "linux":
          if (this.okularExecutableExists()) {
            return require("./openers/okular-opener");
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
    key: "okularExecutableExists",
    value: function okularExecutableExists() {
      return _fsPlus2["default"].existsSync(atom.config.get("latex.okularPath"));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL2xhdGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7c0JBRWUsU0FBUzs7OztzQkFDVixRQUFROzs7O3dCQUNBLFlBQVk7O0FBSmxDLFdBQVcsQ0FBQzs7QUFNWixTQUFTLHFCQUFxQixDQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUU7QUFDL0MsTUFBTSxjQUFjLFVBQVEsUUFBUSxBQUFFLENBQUM7QUFDdkMsTUFBTSxhQUFhLGtCQUFnQixvQkFBRSxVQUFVLENBQUMsUUFBUSxDQUFDLEFBQUUsQ0FBQzs7QUFFNUQsUUFBTSxDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUUsUUFBUSxFQUFFO0FBQ3RDLE9BQUcsRUFBRSxlQUFXO0FBQ2QsVUFBSSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsRUFBRTtBQUMzQixjQUFNLENBQUMsY0FBYyxDQUFDLEdBQUcsTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztPQUM5RDtBQUNELGFBQU8sTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0tBQy9COztBQUVELE9BQUcsRUFBRSxhQUFTLEtBQUssRUFBRTtBQUFFLFlBQU0sQ0FBQyxjQUFjLENBQUMsR0FBRyxLQUFLLENBQUM7S0FBRTtHQUN6RCxDQUFDLENBQUM7Q0FDSjs7SUFFb0IsS0FBSztBQUNiLFdBRFEsS0FBSyxHQUNWOzBCQURLLEtBQUs7O0FBRXRCLFFBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQzs7QUFFdEIseUJBQXFCLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBQ3ZDLHlCQUFxQixDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztBQUN0Qyx5QkFBcUIsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7O0FBRXRDLFFBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO0FBQzNCLFFBQUksQ0FBQyxvQkFBb0Is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SUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDO0tBQzVEOzs7V0FFcUIsa0NBQUc7QUFDdkIsYUFBTyxvQkFBRyxVQUFVLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDO0tBQzNEOzs7V0FFcUIsa0NBQUc7QUFDdkIsYUFBTyxvQkFBRyxVQUFVLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDO0tBQzNEOzs7V0FFUyxzQkFBRztBQUNYLGFBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLEtBQUssU0FBUyxDQUFDO0tBQ3ZEOzs7U0EzSWtCLEtBQUs7OztxQkFBTCxLQUFLIiwiZmlsZSI6Ii9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL2xhdGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2UgYmFiZWxcIjtcblxuaW1wb3J0IGZzIGZyb20gXCJmcy1wbHVzXCI7XG5pbXBvcnQgXyBmcm9tIFwibG9kYXNoXCI7XG5pbXBvcnQge2hlcmVkb2N9IGZyb20gXCIuL3dlcmt6ZXVnXCI7XG5cbmZ1bmN0aW9uIGRlZmluZURlZmF1bHRQcm9wZXJ0eSh0YXJnZXQsIHByb3BlcnR5KSB7XG4gIGNvbnN0IHNoYWRvd1Byb3BlcnR5ID0gYF9fJHtwcm9wZXJ0eX1gO1xuICBjb25zdCBkZWZhdWx0R2V0dGVyID0gYGdldERlZmF1bHQke18uY2FwaXRhbGl6ZShwcm9wZXJ0eSl9YDtcblxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBwcm9wZXJ0eSwge1xuICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoIXRhcmdldFtzaGFkb3dQcm9wZXJ0eV0pIHtcbiAgICAgICAgdGFyZ2V0W3NoYWRvd1Byb3BlcnR5XSA9IHRhcmdldFtkZWZhdWx0R2V0dGVyXS5hcHBseSh0YXJnZXQpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRhcmdldFtzaGFkb3dQcm9wZXJ0eV07XG4gICAgfSxcblxuICAgIHNldDogZnVuY3Rpb24odmFsdWUpIHsgdGFyZ2V0W3NoYWRvd1Byb3BlcnR5XSA9IHZhbHVlOyB9LFxuICB9KTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGF0ZXgge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmNyZWF0ZUxvZ1Byb3h5KCk7XG5cbiAgICBkZWZpbmVEZWZhdWx0UHJvcGVydHkodGhpcywgXCJidWlsZGVyXCIpO1xuICAgIGRlZmluZURlZmF1bHRQcm9wZXJ0eSh0aGlzLCBcImxvZ2dlclwiKTtcbiAgICBkZWZpbmVEZWZhdWx0UHJvcGVydHkodGhpcywgXCJvcGVuZXJcIik7XG5cbiAgICB0aGlzLm9ic2VydmVPcGVuZXJDb25maWcoKTtcbiAgICB0aGlzLm9ic2VydmVCdWlsZGVyQ29uZmlnKCk7XG4gIH1cblxuICBnZXRCdWlsZGVyKCkgeyByZXR1cm4gdGhpcy5idWlsZGVyOyB9XG4gIGdldExvZ2dlcigpIHsgcmV0dXJuIHRoaXMubG9nZ2VyOyB9XG4gIGdldE9wZW5lcigpIHsgcmV0dXJuIHRoaXMub3BlbmVyOyB9XG5cbiAgc2V0TG9nZ2VyKGxvZ2dlcikge1xuICAgIHRoaXMubG9nZ2VyID0gbG9nZ2VyO1xuICB9XG5cbiAgZ2V0RGVmYXVsdEJ1aWxkZXIoKSB7XG4gICAgbGV0IEJ1aWxkZXJDbGFzcyA9IG51bGw7XG4gICAgaWYgKHRoaXMudXNlTGF0ZXhtaygpKSB7XG4gICAgICBCdWlsZGVyQ2xhc3MgPSByZXF1aXJlKFwiLi9idWlsZGVycy9sYXRleG1rXCIpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIEJ1aWxkZXJDbGFzcyA9IHJlcXVpcmUoXCIuL2J1aWxkZXJzL3RleGlmeVwiKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBCdWlsZGVyQ2xhc3MoKTtcbiAgfVxuXG4gIGdldERlZmF1bHRMb2dnZXIoKSB7XG4gICAgY29uc3QgQ29uc29sZUxvZ2dlciA9IHJlcXVpcmUoXCIuL2xvZ2dlcnMvY29uc29sZS1sb2dnZXJcIik7XG4gICAgcmV0dXJuIG5ldyBDb25zb2xlTG9nZ2VyKCk7XG4gIH1cblxuICBnZXREZWZhdWx0T3BlbmVyKCkge1xuICAgIGNvbnN0IE9wZW5lckltcGwgPSB0aGlzLnJlc29sdmVPcGVuZXJJbXBsZW1lbnRhdGlvbihwcm9jZXNzLnBsYXRmb3JtKTtcbiAgICBpZiAoT3BlbmVySW1wbCkge1xuICAgICAgcmV0dXJuIG5ldyBPcGVuZXJJbXBsKCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXNbXCJfX2xvZ2dlclwiXSAmJiB0aGlzLmxvZykge1xuICAgICAgdGhpcy5sb2cud2FybmluZyhoZXJlZG9jKGBcbiAgICAgICAgTm8gUERGIG9wZW5lciBmb3VuZC5cbiAgICAgICAgRm9yIGNyb3NzLXBsYXRmb3JtIHZpZXdpbmcsIGNvbnNpZGVyIGluc3RhbGxpbmcgdGhlIHBkZi12aWV3IHBhY2thZ2UuXG4gICAgICAgIGApXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIGNyZWF0ZUxvZ1Byb3h5KCkge1xuICAgIHRoaXMubG9nID0ge1xuICAgICAgZXJyb3I6IChzdGF0dXNDb2RlLCByZXN1bHQsIGJ1aWxkZXIpID0+IHtcbiAgICAgICAgdGhpcy5sb2dnZXIuZXJyb3Ioc3RhdHVzQ29kZSwgcmVzdWx0LCBidWlsZGVyKTtcbiAgICAgIH0sXG4gICAgICB3YXJuaW5nOiAobWVzc2FnZSkgPT4ge1xuICAgICAgICB0aGlzLmxvZ2dlci53YXJuaW5nKG1lc3NhZ2UpO1xuICAgICAgfSxcbiAgICAgIGluZm86IChtZXNzYWdlKSA9PiB7XG4gICAgICAgIHRoaXMubG9nZ2VyLmluZm8obWVzc2FnZSk7XG4gICAgICB9LFxuICAgIH07XG4gIH1cblxuICBvYnNlcnZlT3BlbmVyQ29uZmlnKCkge1xuICAgIGNvbnN0IGNhbGxiYWNrID0gKCkgPT4geyB0aGlzW1wiX19vcGVuZXJcIl0gPSB0aGlzLmdldERlZmF1bHRPcGVuZXIoKTsgfTtcbiAgICBhdG9tLmNvbmZpZy5vbkRpZENoYW5nZShcImxhdGV4LmFsd2F5c09wZW5SZXN1bHRJbkF0b21cIiwgY2FsbGJhY2spO1xuICAgIGF0b20uY29uZmlnLm9uRGlkQ2hhbmdlKFwibGF0ZXguc2tpbVBhdGhcIiwgY2FsbGJhY2spO1xuICAgIGF0b20uY29uZmlnLm9uRGlkQ2hhbmdlKFwibGF0ZXguc3VtYXRyYVBhdGhcIiwgY2FsbGJhY2spO1xuICAgIGF0b20uY29uZmlnLm9uRGlkQ2hhbmdlKFwibGF0ZXgub2t1bGFyUGF0aFwiLCBjYWxsYmFjayk7XG4gIH1cblxuICBvYnNlcnZlQnVpbGRlckNvbmZpZygpIHtcbiAgICBjb25zdCBjYWxsYmFjayA9ICgpID0+IHsgdGhpc1tcIl9fYnVpbGRlclwiXSA9IHRoaXMuZ2V0RGVmYXVsdEJ1aWxkZXIoKTsgfTtcbiAgICBhdG9tLmNvbmZpZy5vbkRpZENoYW5nZShcImxhdGV4LmJ1aWxkZXJcIiwgY2FsbGJhY2spO1xuICB9XG5cbiAgcmVzb2x2ZU9wZW5lckltcGxlbWVudGF0aW9uKHBsYXRmb3JtKSB7XG4gICAgaWYgKHRoaXMuaGFzUGRmVmlld2VyUGFja2FnZSgpICYmIHRoaXMuc2hvdWxkT3BlblJlc3VsdEluQXRvbSgpKSB7XG4gICAgICByZXR1cm4gcmVxdWlyZShcIi4vb3BlbmVycy9hdG9tcGRmLW9wZW5lclwiKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy52aWV3ZXJFeGVjdXRhYmxlRXhpc3RzKCkpIHtcbiAgICAgIHJldHVybiByZXF1aXJlKFwiLi9vcGVuZXJzL2N1c3RvbS1vcGVuZXJcIik7XG4gICAgfVxuXG4gICAgc3dpdGNoIChwbGF0Zm9ybSkge1xuICAgICAgY2FzZSBcImRhcndpblwiOlxuICAgICAgICBpZiAodGhpcy5za2ltRXhlY3V0YWJsZUV4aXN0cygpKSB7XG4gICAgICAgICAgcmV0dXJuIHJlcXVpcmUoXCIuL29wZW5lcnMvc2tpbS1vcGVuZXJcIik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVxdWlyZShcIi4vb3BlbmVycy9wcmV2aWV3LW9wZW5lclwiKTtcblxuICAgICAgY2FzZSBcIndpbjMyXCI6XG4gICAgICAgIGlmICh0aGlzLnN1bWF0cmFFeGVjdXRhYmxlRXhpc3RzKCkpIHtcbiAgICAgICAgICByZXR1cm4gcmVxdWlyZShcIi4vb3BlbmVycy9zdW1hdHJhLW9wZW5lclwiKTtcbiAgICAgICAgfVxuXG4gICAgICBjYXNlIFwibGludXhcIjpcbiAgICAgICAgaWYgKHRoaXMub2t1bGFyRXhlY3V0YWJsZUV4aXN0cygpKSB7XG4gICAgICAgICAgcmV0dXJuIHJlcXVpcmUoXCIuL29wZW5lcnMvb2t1bGFyLW9wZW5lclwiKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLmhhc1BkZlZpZXdlclBhY2thZ2UoKSkge1xuICAgICAgcmV0dXJuIHJlcXVpcmUoXCIuL29wZW5lcnMvYXRvbXBkZi1vcGVuZXJcIik7XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBoYXNQZGZWaWV3ZXJQYWNrYWdlKCkge1xuICAgIHJldHVybiAhIWF0b20ucGFja2FnZXMucmVzb2x2ZVBhY2thZ2VQYXRoKFwicGRmLXZpZXdcIik7XG4gIH1cblxuICBzaG91bGRPcGVuUmVzdWx0SW5BdG9tKCkge1xuICAgIHJldHVybiBhdG9tLmNvbmZpZy5nZXQoXCJsYXRleC5hbHdheXNPcGVuUmVzdWx0SW5BdG9tXCIpO1xuICB9XG5cbiAgc2tpbUV4ZWN1dGFibGVFeGlzdHMoKSB7XG4gICAgcmV0dXJuIGZzLmV4aXN0c1N5bmMoYXRvbS5jb25maWcuZ2V0KFwibGF0ZXguc2tpbVBhdGhcIikpO1xuICB9XG5cbiAgc3VtYXRyYUV4ZWN1dGFibGVFeGlzdHMoKSB7XG4gICAgcmV0dXJuIGZzLmV4aXN0c1N5bmMoYXRvbS5jb25maWcuZ2V0KFwibGF0ZXguc3VtYXRyYVBhdGhcIikpO1xuICB9XG5cbiAgb2t1bGFyRXhlY3V0YWJsZUV4aXN0cygpIHtcbiAgICByZXR1cm4gZnMuZXhpc3RzU3luYyhhdG9tLmNvbmZpZy5nZXQoXCJsYXRleC5va3VsYXJQYXRoXCIpKTtcbiAgfVxuXG4gIHZpZXdlckV4ZWN1dGFibGVFeGlzdHMoKSB7XG4gICAgcmV0dXJuIGZzLmV4aXN0c1N5bmMoYXRvbS5jb25maWcuZ2V0KFwibGF0ZXgudmlld2VyUGF0aFwiKSk7XG4gIH1cblxuICB1c2VMYXRleG1rKCkge1xuICAgIHJldHVybiBhdG9tLmNvbmZpZy5nZXQoXCJsYXRleC5idWlsZGVyXCIpID09PSBcImxhdGV4bWtcIjtcbiAgfVxufVxuIl19
//# sourceURL=/home/cin_chalic/.atom/packages/latex/lib/latex.js
