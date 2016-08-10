(function() {
  var OpenedFiles;

  OpenedFiles = require('../lib/opened-files');

  describe("OpenedFiles", function() {
    var activationPromise, workspaceElement, _ref;
    _ref = [], workspaceElement = _ref[0], activationPromise = _ref[1];
    beforeEach(function() {
      workspaceElement = atom.views.getView(atom.workspace);
      return activationPromise = atom.packages.activatePackage('opened-files');
    });
    return describe("when the opened-files:toggle event is triggered", function() {
      it("hides and shows the modal panel", function() {
        expect(workspaceElement.querySelector('.opened-files')).not.toExist();
        atom.commands.dispatch(workspaceElement, 'opened-files:toggle');
        waitsForPromise(function() {
          return activationPromise;
        });
        return runs(function() {
          var openedFilesElement, openedFilesPanel;
          expect(workspaceElement.querySelector('.opened-files')).toExist();
          openedFilesElement = workspaceElement.querySelector('.opened-files');
          expect(openedFilesElement).toExist();
          openedFilesPanel = atom.workspace.panelForItem(openedFilesElement);
          expect(openedFilesPanel.isVisible()).toBe(true);
          atom.commands.dispatch(workspaceElement, 'opened-files:toggle');
          return expect(openedFilesPanel.isVisible()).toBe(false);
        });
      });
      return it("hides and shows the view", function() {
        jasmine.attachToDOM(workspaceElement);
        expect(workspaceElement.querySelector('.opened-files')).not.toExist();
        atom.commands.dispatch(workspaceElement, 'opened-files:toggle');
        waitsForPromise(function() {
          return activationPromise;
        });
        return runs(function() {
          var openedFilesElement;
          openedFilesElement = workspaceElement.querySelector('.opened-files');
          expect(openedFilesElement).toBeVisible();
          atom.commands.dispatch(workspaceElement, 'opened-files:toggle');
          return expect(openedFilesElement).not.toBeVisible();
        });
      });
    });
  });

}).call(this);
