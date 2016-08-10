(function() {
  module.exports = {
    activate: function() {
      return atom.commands.add("atom-text-editor", "auto-indent:apply", (function(_this) {
        return function() {
          return _this.apply();
        };
      })(this));
    },
    apply: function() {
      var cursor, editor, savedPosition;
      editor = atom.workspace.getActivePaneItem();
      cursor = editor.getLastCursor();
      savedPosition = cursor.getScreenPosition();
      if (editor.getSelectedText().length === 0) {
        editor.selectAll();
      }
      editor.autoIndentSelectedRows();
      cursor = editor.getLastCursor();
      return cursor.setScreenPosition(savedPosition);
    }
  };

}).call(this);
