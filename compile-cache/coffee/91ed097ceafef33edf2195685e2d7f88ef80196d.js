(function() {
  var AutoIndentView, WorkspaceView;

  AutoIndentView = require('../lib/auto-indent-view');

  WorkspaceView = require('atom').WorkspaceView;

  describe("AutoIndentView", function() {
    return it("has one valid test", function() {
      return expect("life").toBe("easy");
    });
  });

}).call(this);
