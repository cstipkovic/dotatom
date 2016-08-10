(function() {
  var TodosMarkdown;

  module.exports = TodosMarkdown = (function() {
    function TodosMarkdown() {
      this.showInTable = atom.config.get('todo-show.showInTable');
    }

    TodosMarkdown.prototype.getTable = function(todos) {
      var key, md, out, todo;
      md = "| " + (((function() {
        var _i, _len, _ref, _results;
        _ref = this.showInTable;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          key = _ref[_i];
          _results.push(key);
        }
        return _results;
      }).call(this)).join(' | ')) + " |\n";
      md += "|" + (Array(md.length - 2).join('-')) + "|\n";
      return md + ((function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = todos.length; _i < _len; _i++) {
          todo = todos[_i];
          out = '|' + todo.getMarkdownArray(this.showInTable).join(' |');
          _results.push("" + out + " |\n");
        }
        return _results;
      }).call(this)).join('');
    };

    TodosMarkdown.prototype.getList = function(todos) {
      var out, todo;
      return ((function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = todos.length; _i < _len; _i++) {
          todo = todos[_i];
          out = '-' + todo.getMarkdownArray(this.showInTable).join('');
          if (out === '-') {
            out = "- No details";
          }
          _results.push("" + out + "\n");
        }
        return _results;
      }).call(this)).join('');
    };

    TodosMarkdown.prototype.markdown = function(todos) {
      if (atom.config.get('todo-show.saveOutputAs') === 'Table') {
        return this.getTable(todos);
      } else {
        return this.getList(todos);
      }
    };

    return TodosMarkdown;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2luX2NoYWxpYy8uYXRvbS9wYWNrYWdlcy90b2RvLXNob3cvbGliL3RvZG8tbWFya2Rvd24uY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGFBQUE7O0FBQUEsRUFBQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ1MsSUFBQSx1QkFBQSxHQUFBO0FBQ1gsTUFBQSxJQUFDLENBQUEsV0FBRCxHQUFlLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQix1QkFBaEIsQ0FBZixDQURXO0lBQUEsQ0FBYjs7QUFBQSw0QkFHQSxRQUFBLEdBQVUsU0FBQyxLQUFELEdBQUE7QUFDUixVQUFBLGtCQUFBO0FBQUEsTUFBQSxFQUFBLEdBQU8sSUFBQSxHQUFHLENBQUM7O0FBQUM7QUFBQTthQUFBLDJDQUFBO3lCQUFBO0FBQTZCLHdCQUFBLElBQUEsQ0FBN0I7QUFBQTs7bUJBQUQsQ0FBa0MsQ0FBQyxJQUFuQyxDQUF3QyxLQUF4QyxDQUFELENBQUgsR0FBbUQsTUFBMUQsQ0FBQTtBQUFBLE1BQ0EsRUFBQSxJQUFPLEdBQUEsR0FBRSxDQUFDLEtBQUEsQ0FBTSxFQUFFLENBQUMsTUFBSCxHQUFVLENBQWhCLENBQWtCLENBQUMsSUFBbkIsQ0FBd0IsR0FBeEIsQ0FBRCxDQUFGLEdBQWdDLEtBRHZDLENBQUE7YUFFQSxFQUFBLEdBQUs7O0FBQUM7YUFBQSw0Q0FBQTsyQkFBQTtBQUNKLFVBQUEsR0FBQSxHQUFNLEdBQUEsR0FBTSxJQUFJLENBQUMsZ0JBQUwsQ0FBc0IsSUFBQyxDQUFBLFdBQXZCLENBQW1DLENBQUMsSUFBcEMsQ0FBeUMsSUFBekMsQ0FBWixDQUFBO0FBQUEsd0JBQ0EsRUFBQSxHQUFHLEdBQUgsR0FBTyxPQURQLENBREk7QUFBQTs7bUJBQUQsQ0FHSixDQUFDLElBSEcsQ0FHRSxFQUhGLEVBSEc7SUFBQSxDQUhWLENBQUE7O0FBQUEsNEJBV0EsT0FBQSxHQUFTLFNBQUMsS0FBRCxHQUFBO0FBQ1AsVUFBQSxTQUFBO2FBQUE7O0FBQUM7YUFBQSw0Q0FBQTsyQkFBQTtBQUNDLFVBQUEsR0FBQSxHQUFNLEdBQUEsR0FBTSxJQUFJLENBQUMsZ0JBQUwsQ0FBc0IsSUFBQyxDQUFBLFdBQXZCLENBQW1DLENBQUMsSUFBcEMsQ0FBeUMsRUFBekMsQ0FBWixDQUFBO0FBQ0EsVUFBQSxJQUF3QixHQUFBLEtBQU8sR0FBL0I7QUFBQSxZQUFBLEdBQUEsR0FBTSxjQUFOLENBQUE7V0FEQTtBQUFBLHdCQUVBLEVBQUEsR0FBRyxHQUFILEdBQU8sS0FGUCxDQUREO0FBQUE7O21CQUFELENBSUMsQ0FBQyxJQUpGLENBSU8sRUFKUCxFQURPO0lBQUEsQ0FYVCxDQUFBOztBQUFBLDRCQWtCQSxRQUFBLEdBQVUsU0FBQyxLQUFELEdBQUE7QUFDUixNQUFBLElBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHdCQUFoQixDQUFBLEtBQTZDLE9BQWhEO2VBQ0UsSUFBQyxDQUFBLFFBQUQsQ0FBVSxLQUFWLEVBREY7T0FBQSxNQUFBO2VBR0UsSUFBQyxDQUFBLE9BQUQsQ0FBUyxLQUFULEVBSEY7T0FEUTtJQUFBLENBbEJWLENBQUE7O3lCQUFBOztNQUZGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/home/cin_chalic/.atom/packages/todo-show/lib/todo-markdown.coffee
