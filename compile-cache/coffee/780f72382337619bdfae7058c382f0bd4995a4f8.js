(function() {
  var TreeManager, treeManager,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  treeManager = null;

  module.exports = new (TreeManager = (function() {
    TreeManager.prototype.treeViewElement = null;

    TreeManager.prototype.openedFilesElement = null;

    TreeManager.prototype.disposables = null;

    function TreeManager() {
      this.destroy = __bind(this.destroy, this);
      this.resize = __bind(this.resize, this);
      this.autoHeight = __bind(this.autoHeight, this);
      this.setOpenedFilesElement = __bind(this.setOpenedFilesElement, this);
      if (treeManager != null) {
        return treeManager;
      }
      this.treeViewElement = document.querySelector("div.tree-view-scroller");
      window.addEventListener("resize", this.resize);
      return this;
    }

    TreeManager.prototype.setOpenedFilesElement = function(element) {
      return this.openedFilesElement = element;
    };

    TreeManager.prototype.autoHeight = function() {
      var containerHeight, ofHeight, tvHeight;
      this.log("resizing");
      if (this.treeViewElement != null) {
        if (this.openedFilesElement == null) {
          this.treeViewElement.setAttribute("style", "height: 100%");
          return;
        }
        this.openedFilesElement.removeAttribute("style");
        containerHeight = this.treeViewElement.parentElement.clientHeight;
        ofHeight = this.openedFilesElement.scrollHeight;
        tvHeight = containerHeight - ofHeight;
        if (tvHeight < containerHeight / 2) {
          this.log("half/half resizing");
          tvHeight = containerHeight / 2;
          this.openedFilesElement.setAttribute("style", "height: " + tvHeight + "px");
        }
        this.treeViewElement.setAttribute("style", "height: " + tvHeight + "px");
      }
      return this.resizeRunning = false;
    };

    TreeManager.prototype.resizeRunning = false;

    TreeManager.prototype.resize = function() {
      if (!this.resizeRunning) {
        this.resizeRunning = true;
        if (window.requestAnimationFrame) {
          return window.requestAnimationFrame(this.autoHeight);
        } else {
          return setTimeout(this.autoHeight, 66);
        }
      }
    };

    TreeManager.prototype.destroy = function() {
      this.treeViewElement.removeAttribute("style");
      return window.removeEventListener("resize", this.resize);
    };

    return TreeManager;

  })());

}).call(this);
