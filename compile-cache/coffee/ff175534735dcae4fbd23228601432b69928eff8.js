(function() {
  var Entities, entitiesCoderDecoder;

  Entities = null;

  module.exports = {
    activate: function(state) {
      atom.commands.add('atom-workspace', 'html-entities:encode', function() {
        return entitiesCoderDecoder('encode');
      });
      return atom.commands.add('atom-workspace', 'html-entities:decode', function() {
        return entitiesCoderDecoder('decode');
      });
    }
  };

  entitiesCoderDecoder = function(action) {
    var editor, entities, selectedText;
    editor = atom.workspace.getActiveTextEditor();
    if (editor == null) {
      return;
    }
    if (Entities == null) {
      Entities = require('html-entities').AllHtmlEntities;
    }
    entities = new Entities();
    selectedText = editor.getSelectedText();
    if (selectedText && action === 'decode') {
      return editor.insertText(entities.decode(selectedText));
    } else if (selectedText) {
      return editor.insertText(entities.encode(selectedText));
    } else if (action === 'decode') {
      return editor.setText(entities.decode(editor.getText()));
    } else {
      return editor.setText(entities.encode(editor.getText()));
    }
  };

}).call(this);
