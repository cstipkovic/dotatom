(function() {
  var CompositeDisposable, TreeViewOpenFilesPaneView, TreeViewOpenFilesView, requirePackages, _;

  requirePackages = require('atom-utils').requirePackages;

  CompositeDisposable = require('event-kit').CompositeDisposable;

  _ = require('lodash');

  TreeViewOpenFilesPaneView = require('./tree-view-open-files-pane-view');

  module.exports = TreeViewOpenFilesView = (function() {
    function TreeViewOpenFilesView(serializeState) {
      this.element = document.createElement('div');
      this.element.classList.add('tree-view-open-files');
      this.groups = [];
      this.paneSub = new CompositeDisposable;
      this.paneSub.add(atom.workspace.observePanes((function(_this) {
        return function(pane) {
          var destroySub;
          _this.addTabGroup(pane);
          destroySub = pane.onDidDestroy(function() {
            destroySub.dispose();
            return _this.removeTabGroup(pane);
          });
          return _this.paneSub.add(destroySub);
        };
      })(this)));
      this.configSub = atom.config.observe('tree-view-open-files.maxHeight', (function(_this) {
        return function(maxHeight) {
          return _this.element.style.maxHeight = maxHeight > 0 ? "" + maxHeight + "px" : 'none';
        };
      })(this));
    }

    TreeViewOpenFilesView.prototype.addTabGroup = function(pane) {
      var group;
      group = new TreeViewOpenFilesPaneView;
      group.setPane(pane);
      this.groups.push(group);
      return this.element.appendChild(group.element);
    };

    TreeViewOpenFilesView.prototype.removeTabGroup = function(pane) {
      var group;
      group = _.findIndex(this.groups, function(group) {
        return group.pane === pane;
      });
      this.groups[group].destroy();
      return this.groups.splice(group, 1);
    };

    TreeViewOpenFilesView.prototype.serialize = function() {};

    TreeViewOpenFilesView.prototype.destroy = function() {
      this.element.remove();
      this.paneSub.dispose();
      return this.configSub.dispose();
    };

    TreeViewOpenFilesView.prototype.toggle = function() {
      if (this.element.parentElement != null) {
        return this.hide();
      } else {
        return this.show();
      }
    };

    TreeViewOpenFilesView.prototype.hide = function() {
      return this.element.remove();
    };

    TreeViewOpenFilesView.prototype.show = function() {
      return requirePackages('tree-view').then((function(_this) {
        return function(_arg) {
          var treeView;
          treeView = _arg[0];
          treeView.treeView.find('.tree-view-scroller').css('background', treeView.treeView.find('.tree-view').css('background'));
          return treeView.treeView.prepend(_this.element);
        };
      })(this));
    };

    return TreeViewOpenFilesView;

  })();

}).call(this);
