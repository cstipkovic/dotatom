(function() {
  describe('HTML Entities Package', function() {
    var editor, workspaceElement, _ref;
    _ref = [], editor = _ref[0], workspaceElement = _ref[1];
    beforeEach(function() {
      workspaceElement = atom.views.getView(atom.workspace);
      waitsForPromise(function() {
        return atom.packages.activatePackage('html-entities');
      });
      waitsForPromise(function() {
        return atom.workspace.open();
      });
      return runs(function() {
        return editor = atom.workspace.getActiveTextEditor();
      });
    });
    describe('html encode', function() {
      beforeEach(function() {
        editor.setText('<html>');
        return atom.commands.dispatch(workspaceElement, 'html-entities:encode');
      });
      return it('encodes html entities', function() {
        return expect(editor.getText()).toBe('&lt;html&gt;');
      });
    });
    return describe('html decode', function() {
      beforeEach(function() {
        editor.setText('&amp;áéí&gt;');
        return atom.commands.dispatch(workspaceElement, 'html-entities:decode');
      });
      return it('decodes html entities', function() {
        return expect(editor.getText()).toBe('&áéí>');
      });
    });
  });

}).call(this);
