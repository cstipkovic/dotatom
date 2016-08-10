(function() {
  var Main, OpenedFiles, compile, log, logger, pkgName, reloader,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  OpenedFiles = null;

  log = null;

  logger = null;

  reloader = null;

  compile = null;

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
        description: "works only in conjunction with the color-tabs package",
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
      }
    };

    Main.prototype.activate = function() {
      var compileAndLoad;
      if (atom.inDevMode()) {
        setTimeout((function() {
          var reloaderSettings;
          reloaderSettings = {
            pkg: pkgName,
            folders: ["lib", "styles", "components"]
          };
          try {
            return reloader != null ? reloader : reloader = require("atom-package-reloader")(reloaderSettings);
          } catch (_error) {}
        }), 500);
      }
      if (log == null) {
        if (logger == null) {
          logger = require("atom-simple-logger")({
            pkg: pkgName
          });
        }
        log = logger("main");
        log("activating");
      }
      if (atom.inDevMode()) {
        log("compiling components");
        try {
          if (compile == null) {
            compile = require("atom-vue-component-compiler")({
              packageName: pkgName
            });
          }
        } catch (_error) {}
        if (compile != null) {
          this.compiling = compile(["app", "file", "folder"]);
        }
      }
      if (this.openedFiles == null) {
        compileAndLoad = (function(_this) {
          return function() {
            var load;
            load = function() {
              var e, _ref, _ref1;
              log("loading core");
              try {
                if (OpenedFiles == null) {
                  OpenedFiles = require("./" + pkgName);
                }
                _this.openedFiles = new OpenedFiles(logger);
              } catch (_error) {
                e = _error;
                if (atom.inDevMode()) {
                  log("loading core failed");
                  if ((e != null ? e.message : void 0) != null) {
                    log(e.message);
                  }
                } else {
                  throw e;
                }
              }
              if (((_ref = _this.openedFiles) != null ? (_ref1 = _ref.comps) != null ? _ref1.app : void 0 : void 0) != null) {
                _this.openedFiles.comps.app.colorPicker = _this.colorPicker;
                _this.openedFiles.comps.app.changeColor = _this.changeColor;
                return _this.cbHandler = typeof _this.colorChangeCb === "function" ? _this.colorChangeCb(_this.openedFiles.comps.app.colorChangeCb) : void 0;
              }
            };
            if (_this.compiling != null) {
              return _this.compiling.then(load)["catch"](function(e) {
                throw e;
              });
            } else {
              return load();
            }
          };
        })(this);
        if (atom.packages.isPackageActive("tree-view")) {
          log("tree-view already loaded");
          return compileAndLoad();
        } else {
          log("waiting for tree-view to load");
          return this.onceActivated = atom.packages.onDidActivatePackage((function(_this) {
            return function(p) {
              if (p.name === "tree-view") {
                compileAndLoad();
                return _this.onceActivated.dispose();
              }
            };
          })(this));
        }
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
      if (atom.inDevMode()) {
        if (reloader != null) {
          reloader.dispose();
        }
        reloader = null;
        log = null;
        logger = null;
        compile = null;
        return OpenedFiles = null;
      }
    };

    Main.prototype.consumeColorPicker = function(colorPicker) {
      var _ref, _ref1, _ref2;
      if (typeof log === "function") {
        log("consuming colorPicker");
      }
      this.colorPicker = colorPicker;
      return (_ref = this.openedFiles) != null ? (_ref1 = _ref.comps) != null ? (_ref2 = _ref1.app) != null ? _ref2.colorPicker = this.colorPicker : void 0 : void 0 : void 0;
    };

    Main.prototype.consumeChangeColor = function(changeColor) {
      var _ref, _ref1, _ref2;
      if (typeof log === "function") {
        log("consuming changeColor");
      }
      this.changeColor = changeColor;
      return (_ref = this.openedFiles) != null ? (_ref1 = _ref.comps) != null ? (_ref2 = _ref1.app) != null ? _ref2.changeColor = this.changeColor : void 0 : void 0 : void 0;
    };

    Main.prototype.consumeColorChangeCb = function(colorChangeCb) {
      var _ref, _ref1, _ref2;
      if (typeof log === "function") {
        log("consuming colorChangeCb");
      }
      this.colorChangeCb = colorChangeCb;
      if ((_ref = this.cbHandler) != null) {
        if (typeof _ref.dispose === "function") {
          _ref.dispose();
        }
      }
      if (((_ref1 = this.openedFiles) != null ? (_ref2 = _ref1.comps) != null ? _ref2.app : void 0 : void 0) != null) {
        return this.cbHandler = this.colorChangeCb(this.openedFiles.comps.app.colorChangeCb);
      }
    };

    return Main;

  })());

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2luX2NoYWxpYy8uYXRvbS9wYWNrYWdlcy9vcGVuZWQtZmlsZXMvbGliL21haW4uY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDBEQUFBO0lBQUEsa0ZBQUE7O0FBQUEsRUFBQSxXQUFBLEdBQWMsSUFBZCxDQUFBOztBQUFBLEVBQ0EsR0FBQSxHQUFNLElBRE4sQ0FBQTs7QUFBQSxFQUVBLE1BQUEsR0FBUyxJQUZULENBQUE7O0FBQUEsRUFHQSxRQUFBLEdBQVcsSUFIWCxDQUFBOztBQUFBLEVBSUEsT0FBQSxHQUFVLElBSlYsQ0FBQTs7QUFBQSxFQU1BLE9BQUEsR0FBVSxjQU5WLENBQUE7O0FBQUEsRUFRQSxNQUFNLENBQUMsT0FBUCxHQUFpQixHQUFBLENBQUEsQ0FBVTs7Ozs7S0FDekI7O0FBQUEsbUJBQUEsV0FBQSxHQUFhLElBQWIsQ0FBQTs7QUFBQSxtQkFDQSxNQUFBLEdBQ0U7QUFBQSxNQUFBLGdCQUFBLEVBQ0U7QUFBQSxRQUFBLEtBQUEsRUFBTyxjQUFQO0FBQUEsUUFDQSxXQUFBLEVBQWEsMkNBRGI7QUFBQSxRQUVBLElBQUEsRUFBTSxTQUZOO0FBQUEsUUFHQSxTQUFBLEVBQVMsSUFIVDtPQURGO0FBQUEsTUFLQSxNQUFBLEVBQ0U7QUFBQSxRQUFBLEtBQUEsRUFBTyxxQkFBUDtBQUFBLFFBQ0EsV0FBQSxFQUFhLHVDQURiO0FBQUEsUUFFQSxJQUFBLEVBQU0sU0FGTjtBQUFBLFFBR0EsU0FBQSxFQUFTLElBSFQ7T0FORjtBQUFBLE1BVUEsVUFBQSxFQUNFO0FBQUEsUUFBQSxLQUFBLEVBQU8sYUFBUDtBQUFBLFFBQ0EsV0FBQSxFQUFhLHVEQURiO0FBQUEsUUFFQSxJQUFBLEVBQU0sUUFGTjtBQUFBLFFBR0EsU0FBQSxFQUFTLFVBSFQ7QUFBQSxRQUlBLE1BQUEsRUFBTSxDQUFDLFVB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

//# sourceURL=/home/cin_chalic/.atom/packages/opened-files/lib/main.coffee
