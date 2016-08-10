(function() {
  var TreeViewOpenFilesView, requirePackages;

  requirePackages = require('atom-utils').requirePackages;

  TreeViewOpenFilesView = require('./tree-view-open-files-view');

  module.exports = {
    treeViewOpenFilesView: null,
    config: {
      maxHeight: {
        type: 'integer',
        "default": 250,
        min: 0,
        description: 'Maximum height of the list before scrolling is required. Set to 0 to disable scrolling.'
      }
    },
    activate: function(state) {
      return requirePackages('tree-view').then((function(_this) {
        return function(_arg) {
          var treeView;
          treeView = _arg[0];
          _this.treeViewOpenFilesView = new TreeViewOpenFilesView;
          if (treeView.treeView) {
            _this.treeViewOpenFilesView.show();
          }
          atom.commands.add('atom-workspace', 'tree-view:toggle', function() {
            var _ref;
            if ((_ref = treeView.treeView) != null ? _ref.is(':visible') : void 0) {
              return _this.treeViewOpenFilesView.show();
            } else {
              return _this.treeViewOpenFilesView.hide();
            }
          });
          return atom.commands.add('atom-workspace', 'tree-view:show', function() {
            return _this.treeViewOpenFilesView.show();
          });
        };
      })(this));
    },
    deactivate: function() {
      return this.treeViewOpenFilesView.destroy();
    },
    serialize: function() {}
  };

}).call(this);
