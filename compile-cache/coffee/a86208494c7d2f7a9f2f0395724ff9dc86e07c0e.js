(function() {
  var AutoIndent;

  AutoIndent = require('../lib/auto-indent');

  describe("AutoIndent", function() {
    var activationPromise;
    activationPromise = null;
    beforeEach(function() {
      atom.workspaceView = new WorkspaceView;
      return activationPromise = atom.packages.activatePackage('autoIndent');
    });
    return describe("when the auto-indent:toggle event is triggered", function() {
      return it("attaches and then detaches the view", function() {
        expect(atom.workspaceView.find('.auto-indent')).not.toExist();
        atom.workspaceView.trigger('auto-indent:toggle');
        waitsForPromise(function() {
          return activationPromise;
        });
        return runs(function() {
          expect(atom.workspaceView.find('.auto-indent')).toExist();
          atom.workspaceView.trigger('auto-indent:toggle');
          return expect(atom.workspaceView.find('.auto-indent')).not.toExist();
        });
      });
    });
  });

}).call(this);
