(function() {
  var formatSql, sql;

  sql = null;

  module.exports = {
    activate: function(state) {
      return atom.commands.add('atom-workspace', {
        'format:sql': function() {
          return formatSql();
        }
      });
    }
  };

  formatSql = function() {
    var editor, error, lastChar, selectedText, text, tokens;
    editor = atom.workspace.getActiveTextEditor();
    if (editor == null) {
      return;
    }
    if (sql == null) {
      sql = require('sql-parser');
    }
    selectedText = editor.getSelectedText();
    lastChar = '';
    if (selectedText) {
      if (selectedText.substr(selectedText.length - 1) === ';') {
        lastChar = ';';
        text = selectedText.substring(0, editor.getText().length - 1);
      } else {
        text = selectedText;
      }
      try {
        tokens = sql.lexer.tokenize(text);
        return editor.insertText(sql.parser.parse(tokens).toString() + lastChar);
      } catch (_error) {
        error = _error;
        return console.warn(error);
      }
    } else {
      if (editor.getText().substr(editor.getText().length - 1) === ';') {
        lastChar = ';';
        text = editor.getText().substring(0, editor.getText().length - 1);
      } else {
        text = editor.getText();
      }
      try {
        tokens = sql.lexer.tokenize(text);
        return editor.setText(sql.parser.parse(tokens).toString() + lastChar);
      } catch (_error) {
        error = _error;
        return console.warn(error);
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2luX2NoYWxpYy8uYXRvbS9wYWNrYWdlcy9mb3JtYXQtc3FsL2xpYi9mb3JtYXQtc3FsLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxjQUFBOztBQUFBLEVBQUEsR0FBQSxHQUFNLElBQU4sQ0FBQTs7QUFBQSxFQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLFFBQUEsRUFBVSxTQUFDLEtBQUQsR0FBQTthQUNSLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFDRTtBQUFBLFFBQUEsWUFBQSxFQUFjLFNBQUEsR0FBQTtpQkFDWixTQUFBLENBQUEsRUFEWTtRQUFBLENBQWQ7T0FERixFQURRO0lBQUEsQ0FBVjtHQUhGLENBQUE7O0FBQUEsRUFRQSxTQUFBLEdBQVksU0FBQSxHQUFBO0FBQ1YsUUFBQSxtREFBQTtBQUFBLElBQUEsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQUFULENBQUE7QUFDQSxJQUFBLElBQWMsY0FBZDtBQUFBLFlBQUEsQ0FBQTtLQURBOztNQUdBLE1BQU8sT0FBQSxDQUFRLFlBQVI7S0FIUDtBQUFBLElBS0EsWUFBQSxHQUFlLE1BQU0sQ0FBQyxlQUFQLENBQUEsQ0FMZixDQUFBO0FBQUEsSUFPQSxRQUFBLEdBQVcsRUFQWCxDQUFBO0FBUUEsSUFBQSxJQUFHLFlBQUg7QUFDRSxNQUFBLElBQUcsWUFBWSxDQUFDLE1BQWIsQ0FBb0IsWUFBWSxDQUFDLE1BQWIsR0FBc0IsQ0FBMUMsQ0FBQSxLQUFnRCxHQUFuRDtBQUNFLFFBQUEsUUFBQSxHQUFXLEdBQVgsQ0FBQTtBQUFBLFFBQ0EsSUFBQSxHQUFPLFlBQVksQ0FBQyxTQUFiLENBQXVCLENBQXZCLEVBQTBCLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBZ0IsQ0FBQyxNQUFqQixHQUEwQixDQUFwRCxDQURQLENBREY7T0FBQSxNQUFBO0FBSUUsUUFBQSxJQUFBLEdBQU8sWUFBUCxDQUpGO09BQUE7QUFNQTtBQUNFLFFBQUEsTUFBQSxHQUFTLEdBQUcsQ0FBQyxLQUFLLENBQUMsUUFBVixDQUFtQixJQUFuQixDQUFULENBQUE7ZUFDQSxNQUFNLENBQUMsVUFBUCxDQUFrQixHQUFHLENBQUMsTUFBTSxDQUFDLEtBQVgsQ0FBaUIsTUFBakIsQ0FBd0IsQ0FBQyxRQUF6QixDQUFBLENBQUEsR0FBc0MsUUFBeEQsRUFGRjtPQUFBLGNBQUE7QUFJRSxRQURJLGNBQ0osQ0FBQTtlQUFBLE9BQU8sQ0FBQyxJQUFSLENBQWEsS0FBYixFQUpGO09BUEY7S0FBQSxNQUFBO0FBY0UsTUFBQSxJQUFHLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBZ0IsQ0FBQyxNQUFqQixDQUF3QixNQUFNLENBQUMsT0FBUCxDQUFBLENBQWdCLENBQUMsTUFBakIsR0FBMEIsQ0FBbEQsQ0FBQSxLQUF3RCxHQUEzRDtBQUNFLFFBQUEsUUFBQSxHQUFXLEdBQVgsQ0FBQTtBQUFBLFFBQ0EsSUFBQSxHQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBZ0IsQ0FBQyxTQUFqQixDQUEyQixDQUEzQixFQUE4QixNQUFNLENBQUMsT0FBUCxDQUFBLENBQWdCLENBQUMsTUFBakIsR0FBMEIsQ0FBeEQsQ0FEUCxDQURGO09BQUEsTUFBQTtBQUlFLFFBQUEsSUFBQSxHQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUpGO09BQUE7QUFNQTtBQUNFLFFBQUEsTUFBQSxHQUFTLEdBQUcsQ0FBQyxLQUFLLENBQUMsUUFBVixDQUFtQixJQUFuQixDQUFULENBQUE7ZUFDQSxNQUFNLENBQUMsT0FBUCxDQUFlLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBWCxDQUFpQixNQUFqQixDQUF3QixDQUFDLFFBQXpCLENBQUEsQ0FBQSxHQUFzQyxRQUFyRCxFQUZGO09BQUEsY0FBQTtBQUlFLFFBREksY0FDSixDQUFBO2VBQUEsT0FBTyxDQUFDLElBQVIsQ0FBYSxLQUFiLEVBSkY7T0FwQkY7S0FUVTtFQUFBLENBUlosQ0FBQTtBQUFBIgp9

//# sourceURL=/home/cin_chalic/.atom/packages/format-sql/lib/format-sql.coffee
