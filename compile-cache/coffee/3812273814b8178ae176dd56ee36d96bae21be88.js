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
                log("loading core failed");
                if ((e != null ? e.message : void 0) != null) {
                  log(e.message);
                }
              }
              if (((_ref = _this.openedFiles) != null ? (_ref1 = _ref.comps) != null ? _ref1.app : void 0 : void 0) != null) {
                _this.openedFiles.comps.app.colorPicker = _this.colorPicker;
                _this.openedFiles.comps.app.changeColor = _this.changeColor;
                return _this.cbHandler = typeof _this.colorChangeCb === "function" ? _this.colorChangeCb(_this.openedFiles.comps.app.colorChangeCb) : void 0;
              }
            };
            if (_this.compiling != null) {
              return _this.compiling.then(load);
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
