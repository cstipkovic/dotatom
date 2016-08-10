(function() {
  var CompositeDisposable, OpenedFiles, compTree, compile, load, path, reload,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  compile = null;

  load = null;

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
      return this.log = null;
    };

    OpenedFiles.prototype.toggle = function() {
      if (this.element != null) {
        this.log("toggling visibility");
        return this.element.classList.toggle("hidden");
      }
    };

    return OpenedFiles;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2luX2NoYWxpYy8uYXRvbS9wYWNrYWdlcy9vcGVuZWQtZmlsZXMvbGliL29wZW5lZC1maWxlcy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsdUVBQUE7SUFBQSxrRkFBQTs7QUFBQSxFQUFBLE9BQUEsR0FBVSxJQUFWLENBQUE7O0FBQUEsRUFDQSxJQUFBLEdBQU8sSUFEUCxDQUFBOztBQUFBLEVBRUEsTUFBQSxHQUFTLElBRlQsQ0FBQTs7QUFBQSxFQUlBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUpQLENBQUE7O0FBQUEsRUFNQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVIsRUFBdkIsbUJBTkQsQ0FBQTs7QUFBQSxFQVFBLFFBQUEsR0FBVztBQUFBLElBQ1QsR0FBQSxFQUNFO0FBQUEsTUFBQSxNQUFBLEVBQVEsSUFBUjtBQUFBLE1BQ0EsUUFBQSxFQUFVLElBRFY7S0FGTztHQVJYLENBQUE7O0FBQUEsRUFjQSxNQUFNLENBQUMsT0FBUCxHQUF1QjtBQUNyQiwwQkFBQSxPQUFBLEdBQVMsSUFBVCxDQUFBOztBQUFBLDBCQUNBLEtBQUEsR0FBTyxJQURQLENBQUE7O0FBQUEsMEJBRUEsR0FBQSxHQUFLLElBRkwsQ0FBQTs7QUFBQSwwQkFHQSxXQUFBLEdBQWEsSUFIYixDQUFBOztBQUlhLElBQUEscUJBQUMsTUFBRCxHQUFBO0FBQ1gsNkNBQUEsQ0FBQTtBQUFBLFVBQUEsV0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLEdBQUQsR0FBTyxNQUFBLENBQU8sTUFBUCxDQUFQLENBQUE7QUFDQSxNQUFBLElBQU8sb0JBQVA7QUFDRSxRQUFBLElBQUMsQ0FBQSxPQUFELEdBQVcsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsS0FBdkIsQ0FBWCxDQUFBO0FBQUEsUUFDQSxJQUFDLENBQUEsT0FBTyxDQUFDLFNBQVMs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

//# sourceURL=/home/cin_chalic/.atom/packages/opened-files/lib/opened-files.coffee
