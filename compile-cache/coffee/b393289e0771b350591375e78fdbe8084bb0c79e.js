(function() {
  var CompositeDisposable, OpenedFiles, compTree, compile, load, path, reload, treeManager,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  compile = null;

  load = null;

  treeManager = null;

  reload = null;

  path = require("path");

  CompositeDisposable = require('atom').CompositeDisposable;

  compTree = {
    app: {
      "file": null,
      "folder": null
    }
  };

  module.exports = OpenedFiles = (function() {
    OpenedFiles.prototype.element = null;

    OpenedFiles.prototype.comps = null;

    OpenedFiles.prototype.log = null;

    OpenedFiles.prototype.disposables = null;

    function OpenedFiles(logger) {
      this.toggle = __bind(this.toggle, this);
      var _ref, _ref1;
      this.log = logger("core");
      if (this.element == null) {
        this.element = document.createElement('div');
        this.element.classList.add('file-list');
        this.element.classList.add("opened-files");
        if (treeManager == null) {
          treeManager = require("./tree-manager.coffee");
        }
        treeManager.log = logger("treeManager");
        treeManager.setOpenedFilesElement(this.element);
      }
      if (this.disposables == null) {
        this.disposables = new CompositeDisposable;
        this.disposables.add(atom.commands.add('atom-workspace', {
          'opened-files:toggle': this.toggle
        }));
      }
      if (this.comps == null) {
        if (load == null) {
          load = require("atom-vue-component-loader");
        }
        this.comps = load(compTree, {
          cwd: path.resolve(path.dirname(module.filename), "../components_compiled/"),
          debug: atom.inDevMode(),
          reload: atom.inDevMode()
        });
        this.comps.app.log = logger("app");
        this.comps.app.logFile = logger("file");
        this.comps.app.logFolder = logger("folder");
        this.comps.app.addDisposable = (function(_this) {
          return function(obj) {
            return _this.disposables.add(obj);
          };
        })(this);
        this.log("mounting app", 2);
        this.comps.app.$mount(this.element);
      }
      this.tv = (_ref = atom.packages.getActivePackage("tree-view")) != null ? _ref.mainModule.treeView.element : void 0;
      if ((_ref1 = this.tv) != null) {
        _ref1.insertBefore(this.element, this.tv.firstChild);
      }
      treeManager.autoHeight();
      this.log("loaded");
    }

    OpenedFiles.prototype.destroy = function() {
      var _ref, _ref1, _ref2, _ref3, _ref4, _ref5;
      if ((_ref = this.comps) != null) {
        if ((_ref1 = _ref.app) != null) {
          _ref1.$destroy(true);
        }
      }
      if ((_ref2 = this.comps) != null) {
        _ref2.app = null;
      }
      this.comps = null;
      if ((_ref3 = this.disposables) != null) {
        _ref3.dispose();
      }
      this.disposables = null;
      if ((_ref4 = this.element) != null) {
        if ((_ref5 = _ref4.parentNode) != null) {
          if (typeof _ref5.removeChild === "function") {
            _ref5.removeChild(this.element);
          }
        }
      }
      this.element = null;
      if (treeManager != null) {
        treeManager.autoHeight();
      }
      if (treeManager != null) {
        treeManager.destroy();
      }
      treeManager = null;
      return this.log = null;
    };

    OpenedFiles.prototype.toggle = function() {
      if (this.element != null) {
        this.log("toggling visibility");
        this.element.classList.toggle("hidden");
        return treeManager != null ? treeManager.autoHeight() : void 0;
      }
    };

    return OpenedFiles;

  })();

}).call(this);
