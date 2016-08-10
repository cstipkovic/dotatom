(function() {
  var Main, Vue, app, log, logger, pkgName,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  log = function() {};

  logger = function() {
    return function() {};
  };

  Vue = null;

  app = null;

  pkgName = "opened-files";

  module.exports = new (Main = (function() {
    function Main() {
      this.consumeColorChangeCb = __bind(this.consumeColorChangeCb, this);
      this.consumeChangeColor = __bind(this.consumeChangeColor, this);
      this.consumeColorPicker = __bind(this.consumeColorPicker, this);
    }

    Main.prototype.openedFiles = null;

    Main.prototype.config = {
      highlightOnHover: {
        title: "Highlighting",
        description: "Highlights file entry and tab on hovering",
        type: "boolean",
        "default": true
      },
      asList: {
        title: "Opened file as List",
        description: "If unchecked will display a tree view",
        type: "boolean",
        "default": true
      },
      colorStyle: {
        title: "Color style",
        description: "Works only in conjunction with the color-tabs package",
        type: "string",
        "default": "gradient",
        "enum": ["gradient", "border", "solid"]
      },
      debug: {
        type: "integer",
        "default": 0,
        minimum: 0
      },
      mfpIdent: {
        title: "Multi-folder project identifier",
        type: "integer",
        "default": "0",
        description: "length of the identifier, if set to 0 will use numbers instead"
      },
      removeOnClose: {
        title: "Remove entries on close",
        type: "boolean",
        "default": false,
        description: "Should entries be removed when all instances of the file are closed?"
      }
    };

    Main.prototype.activate = function() {
      var activate, e;
      activate = (function(_this) {
        return function() {
          var load;
          log("activating");
          load = function() {
            var tv, _ref, _ref1, _ref2;
            log("loading core");
            Vue = require("vue");
            app = Vue.extend(require("../components_compiled/app.js"));
            app = new app({
              data: {
                logger: logger,
                colorPicker: _this.colorPicker,
                changeColor: _this.changeColor
              }
            });
            _this.cbHandler = typeof _this.colorChangeCb === "function" ? _this.colorChangeCb(app.colorChangeCb) : void 0;
            tv = (_ref = atom.packages.getActivePackage("tree-view")) != null ? (_ref1 = _ref.mainModule) != null ? (_ref2 = _ref1.treeView) != null ? _ref2.element : void 0 : void 0 : void 0;
            if (tv != null) {
              return app.$before(tv.firstChild);
            } else {
              return atom.notifications.addError("tree-view not found, make sure the tree-view package is enabled. CTRL+ALT+R to reload");
            }
          };
          if (atom.packages.isPackageActive("tree-view")) {
            log("tree-view already loaded");
            return load();
          } else {
            log("waiting for tree-view to load");
            return _this.onceActivated = atom.packages.onDidActivatePackage(function(p) {
              if (p.name === "tree-view") {
                load();
                return _this.onceActivated.dispose();
              }
            });
          }
        };
      })(this);
      if (atom.inDevMode()) {
        try {
          return setTimeout(activate, 100);
        } catch (_error) {
          e = _error;
          if ((e != null ? e.message : void 0) != null) {
            return console.log(e.message);
          }
        }
      } else {
        return setTimeout(activate, 100);
      }
    };

    Main.prototype.deactivate = function() {
      var _ref, _ref1, _ref2;
      log("deactivating");
      if ((_ref = this.onceActivated) != null) {
        if (typeof _ref.dispose === "function") {
          _ref.dispose();
        }
      }
      if ((_ref1 = this.openedFiles) != null) {
        _ref1.destroy();
      }
      this.openedFiles = null;
      this.colorPicker = null;
      this.changeColor = null;
      if ((_ref2 = this.cbHandler) != null) {
        if (typeof _ref2.dispose === "function") {
          _ref2.dispose();
        }
      }
      this.colorChangeCb = null;
      if (app != null) {
        if (typeof app.$destroy === "function") {
          app.$destroy(true);
        }
      }
      if (atom.inDevMode()) {
        log = null;
        logger = null;
        return Vue = null;
      }
    };

    Main.prototype.consumeDebug = function(debugSetup) {
      logger = debugSetup({
        pkg: pkgName
      });
      log = logger("main");
      return log("consuming debug");
    };

    Main.prototype.consumeColorPicker = function(colorPicker) {
      log("consuming colorPicker");
      this.colorPicker = colorPicker;
      return app != null ? app.colorPicker = this.colorPicker : void 0;
    };

    Main.prototype.consumeChangeColor = function(changeColor) {
      log("consuming changeColor");
      this.changeColor = changeColor;
      return app != null ? app.changeColor = this.changeColor : void 0;
    };

    Main.prototype.consumeColorChangeCb = function(colorChangeCb) {
      var _ref;
      log("consuming colorChangeCb");
      this.colorChangeCb = colorChangeCb;
      if ((_ref = this.cbHandler) != null) {
        if (typeof _ref.dispose === "function") {
          _ref.dispose();
        }
      }
      if (app != null) {
        return this.cbHandler = this.colorChangeCb(app.colorChangeCb);
      }
    };

    Main.prototype.consumeAutoreload = function(reloader) {
      log("consuming consumeAutoreload");
      return reloader({
        pkg: pkgName,
        folders: ["lib/", "components_compiled/"]
      });
    };

    return Main;

  })());

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2luX2NoYWxpYy8uYXRvbS9wYWNrYWdlcy9vcGVuZWQtZmlsZXMvbGliL21haW4uY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG9DQUFBO0lBQUEsa0ZBQUE7O0FBQUEsRUFBQSxHQUFBLEdBQU0sU0FBQSxHQUFBLENBQU4sQ0FBQTs7QUFBQSxFQUNBLE1BQUEsR0FBUyxTQUFBLEdBQUE7V0FBTSxTQUFBLEdBQUEsRUFBTjtFQUFBLENBRFQsQ0FBQTs7QUFBQSxFQUVBLEdBQUEsR0FBTSxJQUZOLENBQUE7O0FBQUEsRUFHQSxHQUFBLEdBQU0sSUFITixDQUFBOztBQUFBLEVBSUEsT0FBQSxHQUFVLGNBSlYsQ0FBQTs7QUFBQSxFQU1BLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLEdBQUEsQ0FBQSxDQUFVOzs7OztLQUN6Qjs7QUFBQSxtQkFBQSxXQUFBLEdBQWEsSUFBYixDQUFBOztBQUFBLG1CQUNBLE1BQUEsR0FDRTtBQUFBLE1BQUEsZ0JBQUEsRUFDRTtBQUFBLFFBQUEsS0FBQSxFQUFPLGNBQVA7QUFBQSxRQUNBLFdBQUEsRUFBYSwyQ0FEYjtBQUFBLFFBRUEsSUFBQSxFQUFNLFNBRk47QUFBQSxRQUdBLFNBQUEsRUFBUyxJQUhUO09BREY7QUFBQSxNQUtBLE1BQUEsRUFDRTtBQUFBLFFBQUEsS0FBQSxFQUFPLHFCQUFQO0FBQUEsUUFDQSxXQUFBLEVBQWEsdUNBRGI7QUFBQSxRQUVBLElBQUEsRUFBTSxTQUZOO0FBQUEsUUFHQSxTQUFBLEVBQVMsSUFIVDtPQU5GO0FBQUEsTUFVQSxVQUFBLEVBQ0U7QUFBQSxRQUFBLEtBQUEsRUFBTyxhQUFQO0FBQUEsUUFDQSxXQUFBLEVBQWEsdURBRGI7QUFBQSxRQUVBLElBQUEsRUFBTSxRQUZOO0FBQUEsUUFHQSxTQUFBLEVBQVMsVUFIVDtBQUFBLFFBSUEsTUFBQSxFQUFNLENBQUMsVUFBRCxFQUFZLFFBQVosRUFBcUIsT0FBckIsQ0FKTjtPQVhGO0FBQUEsTUFnQkEsS0FBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLENBRFQ7QUFBQSxRQUVBLE9BQUEsRUFBUyxDQUZUO09BakJGO0FBQUEsTUFvQkEsUUFBQSxFQUNFO0FBQUEsUUFBQSxLQUFBLEVBQU8saUNBQVA7QUFBQSxRQUNBLElBQUEsRUFBTSxTQUROO0FBQUEsUUFFQSxTQUFBLEVBQVMsR0FGVDtBQUFBLFFBR0EsV0FBQSxFQUFhLGdFQUhiO09BckJGO0FBQUEsTUF5QkEsYUFBQSxFQUNFO0FBQUEsUUFBQSxLQUFBLEVBQU8seUJBQVA7QUFBQSxRQUNBLElBQUEsRUFBTSxTQUROO0FBQUEsUUFFQSxTQUFBLEVBQVMsS0FGVDtBQUFBLFFBR0EsV0FBQSxFQUFhLHNFQUhiO09BMUJGO0tBRkYsQ0FBQTs7QUFBQSxtQkFpQ0EsUUFBQSxHQUFVLFNBQUEsR0FBQTtBQUNSLFVBQUEsV0FBQTtBQUFBLE1BQUEsUUFBQSxHQUFXLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7QUFDVCxjQUFBLElBQUE7QUFBQSxVQUFBLEdBQUEsQ0FBSSxZQUFKLENBQUEsQ0FBQTtBQUFBLFVBQ0EsSUFBQSxHQUFPLFNBQUEsR0FBQTtBQUNMLGdCQUFBLHNCQUFBO0FBQUEsWUFBQSxHQUFBLENBQUksY0FBSixDQUFBLENBQUE7QUFBQSxZQUNBLEdBQUEsR0FBTSxPQUFBLENBQVEsS0FBUixDQUROLENBQUE7QUFBQSxZQUVBLEdBQUEsR0FBTSxHQUFHLENBQUMsTUFBSixDQUFXLE9BQUEsQ0FBUSwrQkFBUixDQUFYLENBRk4sQ0FBQTtBQUFBLFlBR0EsR0FBQSxHQUFVLElBQUEsR0FBQSxDQUFJO0FBQUEsY0FDWixJQUFBLEVBQ0U7QUFBQSxnQkFBQSxNQUFBLEVBQVEsTUFBUjtBQUFBLGdCQUNBLFdBQUEsRUFBYSxLQUFDLENBQUEsV0FEZDtBQUFBLGdCQUVBLFdBQUEsRUFBYSxLQUFDLENBQUEsV0FGZDtlQUZVO2FBQUosQ0FIVixDQUFBO0FBQUEsWUFTQSxLQUFDLENBQUEsU0FBRCwrQ0FBYSxLQUFDLENBQUEsY0FBZSxHQUFHLENBQUMsdUJBVGpDLENBQUE7QUFBQSxZQVVBLEVBQUEsOElBQXNFLENBQUUsa0NBVnhFLENBQUE7QUFXQSxZQUFBLElBQUcsVUFBSDtxQkFDRSxHQUFHLENBQUMsT0FBSixDQUFZLEVBQUUsQ0FBQyxVQUFmLEVBREY7YUFBQSxNQUFBO3FCQUdFLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBbkIsQ0FBNEIsdUZBQTVCLEVBSEY7YUFaSztVQUFBLENBRFAsQ0FBQTtBQWlCQSxVQUFBLElBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFkLENBQThCLFdBQTlCLENBQUg7QUFDRSxZQUFBLEdBQUEsQ0FBSSwwQkFBSixDQUFBLENBQUE7bUJBQ0EsSUFBQSxDQUFBLEVBRkY7V0FBQSxNQUFBO0FBSUUsWUFBQSxHQUFBLENBQUksK0JBQUosQ0FBQSxDQUFBO21CQUNBLEtBQUMsQ0FBQSxhQUFELEdBQWlCLElBQUksQ0FBQyxRQUFRLENBQUMsb0JBQWQsQ0FBbUMsU0FBQyxDQUFELEdBQUE7QUFDbEQsY0FBQSxJQUFHLENBQUMsQ0FBQyxJQUFGLEtBQVUsV0FBYjtBQUNFLGdCQUFBLElBQUEsQ0FBQSxDQUFBLENBQUE7dUJBQ0EsS0FBQyxDQUFBLGFBQWEsQ0FBQyxPQUFmLENBQUEsRUFGRjtlQURrRDtZQUFBLENBQW5DLEVBTG5CO1dBbEJTO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBWCxDQUFBO0FBMkJBLE1BQUEsSUFBRyxJQUFJLENBQUMsU0FBTCxDQUFBLENBQUg7QUFDRTtpQkFDRSxVQUFBLENBQVcsUUFBWCxFQUFvQixHQUFwQixFQURGO1NBQUEsY0FBQTtBQUdFLFVBREksVUFDSixDQUFBO0FBQUEsVUFBQSxJQUF5Qix3Q0FBekI7bUJBQUEsT0FBTyxDQUFDLEdBQVIsQ0FBWSxDQUFDLENBQUMsT0FBZCxFQUFBO1dBSEY7U0FERjtPQUFBLE1BQUE7ZUFNRSxVQUFBLENBQVcsUUFBWCxFQUFvQixHQUFwQixFQU5GO09BNUJRO0lBQUEsQ0FqQ1YsQ0FBQTs7QUFBQSxtQkFxRUEsVUFBQSxHQUFZLFNBQUEsR0FBQTtBQUNWLFVBQUEsa0JBQUE7QUFBQSxNQUFBLEdBQUEsQ0FBSSxjQUFKLENBQUEsQ0FBQTs7O2NBQ2MsQ0FBRTs7T0FEaEI7O2FBRVksQ0FBRSxPQUFkLENBQUE7T0FGQTtBQUFBLE1BR0EsSUFBQyxDQUFBLFdBQUQsR0FBZSxJQUhmLENBQUE7QUFBQSxNQUlBLElBQUMsQ0FBQSxXQUFELEdBQWUsSUFKZixDQUFBO0FBQUEsTUFLQSxJQUFDLENBQUEsV0FBRCxHQUFlLElBTGYsQ0FBQTs7O2VBTVUsQ0FBRTs7T0FOWjtBQUFBLE1BT0EsSUFBQyxDQUFBLGFBQUQsR0FBaUIsSUFQakIsQ0FBQTs7O1VBUUEsR0FBRyxDQUFFLFNBQVU7O09BUmY7QUFTQSxNQUFBLElBQUcsSUFBSSxDQUFDLFNBQUwsQ0FBQSxDQUFIO0FBQ0UsUUFBQSxHQUFBLEdBQU0sSUFBTixDQUFBO0FBQUEsUUFDQSxNQUFBLEdBQVMsSUFEVCxDQUFBO2VBRUEsR0FBQSxHQUFNLEtBSFI7T0FWVTtJQUFBLENBckVaLENBQUE7O0FBQUEsbUJBb0ZBLFlBQUEsR0FBYyxTQUFDLFVBQUQsR0FBQTtBQUNaLE1BQUEsTUFBQSxHQUFTLFVBQUEsQ0FBVztBQUFBLFFBQUEsR0FBQSxFQUFLLE9BQUw7T0FBWCxDQUFULENBQUE7QUFBQSxNQUNBLEdBQUEsR0FBTSxNQUFBLENBQU8sTUFBUCxDQUROLENBQUE7YUFFQSxHQUFBLENBQUksaUJBQUosRUFIWTtJQUFBLENBcEZkLENBQUE7O0FBQUEsbUJBd0ZBLGtCQUFBLEdBQW9CLFNBQUMsV0FBRCxHQUFBO0FBQ2xCLE1BQUEsR0FBQSxDQUFJLHVCQUFKLENBQUEsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLFdBQUQsR0FBZSxXQURmLENBQUE7MkJBRUEsR0FBRyxDQUFFLFdBQUwsR0FBbUIsSUFBQyxDQUFBLHFCQUhGO0lBQUEsQ0F4RnBCLENBQUE7O0FBQUEsbUJBNEZBLGtCQUFBLEdBQW9CLFNBQUMsV0FBRCxHQUFBO0FBQ2xCLE1BQUEsR0FBQSxDQUFJLHVCQUFKLENBQUEsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLFdBQUQsR0FBZSxXQURmLENBQUE7MkJBRUEsR0FBRyxDQUFFLFdBQUwsR0FBbUIsSUFBQyxDQUFBLHFCQUhGO0lBQUEsQ0E1RnBCLENBQUE7O0FBQUEsbUJBZ0dBLG9CQUFBLEdBQXNCLFNBQUMsYUFBRCxHQUFBO0FBQ3BCLFVBQUEsSUFBQTtBQUFBLE1BQUEsR0FBQSxDQUFJLHlCQUFKLENBQUEsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLGFBQUQsR0FBaUIsYUFEakIsQ0FBQTs7O2NBRVUsQ0FBRTs7T0FGWjtBQUdBLE1BQUEsSUFBRyxXQUFIO2VBQ0UsSUFBQyxDQUFBLFNBQUQsR0FBYSxJQUFDLENBQUEsYUFBRCxDQUFlLEdBQUcsQ0FBQyxhQUFuQixFQURmO09BSm9CO0lBQUEsQ0FoR3RCLENBQUE7O0FBQUEsbUJBc0dBLGlCQUFBLEdBQW1CLFNBQUMsUUFBRCxHQUFBO0FBQ2pCLE1BQUEsR0FBQSxDQUFJLDZCQUFKLENBQUEsQ0FBQTthQUNBLFFBQUEsQ0FBUztBQUFBLFFBQUEsR0FBQSxFQUFJLE9BQUo7QUFBQSxRQUFZLE9BQUEsRUFBUSxDQUFDLE1BQUQsRUFBUSxzQkFBUixDQUFwQjtPQUFULEVBRmlCO0lBQUEsQ0F0R25CLENBQUE7O2dCQUFBOztPQVBGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/home/cin_chalic/.atom/packages/opened-files/lib/main.coffee
