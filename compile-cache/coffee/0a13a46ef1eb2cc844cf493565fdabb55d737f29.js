(function() {
  var TodosMarkdown;

  module.exports = TodosMarkdown = (function() {
    function TodosMarkdown() {
      this.showInTable = atom.config.get('todo-show.showInTable');
    }

    TodosMarkdown.prototype.getItemOutput = function(todo, key) {
      var item;
      if (item = todo[key.toLowerCase()]) {
        switch (key) {
          case 'All':
            return " " + item;
          case 'Text':
            return " " + item;
          case 'Type':
            return " __" + item + "__";
          case 'Range':
            return " _:" + item + "_";
          case 'Line':
            return " _:" + item + "_";
          case 'Regex':
            return " _'" + item + "'_";
          case 'File':
            return " [" + item + "](" + item + ")";
          case 'Tags':
            return " _" + item + "_";
        }
      }
    };

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
          out = '|' + ((function() {
            var _j, _len1, _ref, _results1;
            _ref = this.showInTable;
            _results1 = [];
            for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
              key = _ref[_j];
              _results1.push(this.getItemOutput(todo, key));
            }
            return _results1;
          }).call(this)).join(' |');
          _results.push("" + out + " |\n");
        }
        return _results;
      }).call(this)).join('');
    };

    TodosMarkdown.prototype.getList = function(todos) {
      var key, out, todo;
      return ((function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = todos.length; _i < _len; _i++) {
          todo = todos[_i];
          out = '-' + ((function() {
            var _j, _len1, _ref, _results1;
            _ref = this.showInTable;
            _results1 = [];
            for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
              key = _ref[_j];
              _results1.push(this.getItemOutput(todo, key));
            }
            return _results1;
          }).call(this)).join('');
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2luX2NoYWxpYy8uYXRvbS9wYWNrYWdlcy90b2RvLXNob3cvbGliL3RvZG9zLW1hcmtkb3duLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxhQUFBOztBQUFBLEVBQUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNTLElBQUEsdUJBQUEsR0FBQTtBQUNYLE1BQUEsSUFBQyxDQUFBLFdBQUQsR0FBZSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsdUJBQWhCLENBQWYsQ0FEVztJQUFBLENBQWI7O0FBQUEsNEJBR0EsYUFBQSxHQUFlLFNBQUMsSUFBRCxFQUFPLEdBQVAsR0FBQTtBQUNiLFVBQUEsSUFBQTtBQUFBLE1BQUEsSUFBRyxJQUFBLEdBQU8sSUFBSyxDQUFBLEdBQUcsQ0FBQyxXQUFKLENBQUEsQ0FBQSxDQUFmO0FBQ0UsZ0JBQU8sR0FBUDtBQUFBLGVBQ08sS0FEUDttQkFDbUIsR0FBQSxHQUFHLEtBRHRCO0FBQUEsZUFFTyxNQUZQO21CQUVvQixHQUFBLEdBQUcsS0FGdkI7QUFBQSxlQUdPLE1BSFA7bUJBR29CLEtBQUEsR0FBSyxJQUFMLEdBQVUsS0FIOUI7QUFBQSxlQUlPLE9BSlA7bUJBSXFCLEtBQUEsR0FBSyxJQUFMLEdBQVUsSUFKL0I7QUFBQSxlQUtPLE1BTFA7bUJBS29CLEtBQUEsR0FBSyxJQUFMLEdBQVUsSUFMOUI7QUFBQSxlQU1PLE9BTlA7bUJBTXFCLEtBQUEsR0FBSyxJQUFMLEdBQVUsS0FOL0I7QUFBQSxlQU9PLE1BUFA7bUJBT29CLElBQUEsR0FBSSxJQUFKLEdBQVMsSUFBVCxHQUFhLElBQWIsR0FBa0IsSUFQdEM7QUFBQSxlQVFPLE1BUlA7bUJBUW9CLElBQUEsR0FBSSxJQUFKLEdBQVMsSUFSN0I7QUFBQSxTQURGO09BRGE7SUFBQSxDQUhmLENBQUE7O0FBQUEsNEJBZUEsUUFBQSxHQUFVLFNBQUMsS0FBRCxHQUFBO0FBQ1IsVUFBQSxrQkFBQTtBQUFBLE1BQUEsRUFBQSxHQUFPLElBQUEsR0FBRyxDQUFDOztBQUFDO0FBQUE7YUFBQSwyQ0FBQTt5QkFBQTtBQUE2Qix3QkFBQSxJQUFBLENBQTdCO0FBQUE7O21CQUFELENBQWtDLENBQUMsSUFBbkMsQ0FBd0MsS0FBeEMsQ0FBRCxDQUFILEdBQW1ELE1BQTFELENBQUE7QUFBQSxNQUNBLEVBQUEsSUFBTyxHQUFBLEdBQUUsQ0FBQyxLQUFBLENBQU0sRUFBRSxDQUFDLE1BQUgsR0FBVSxDQUFoQixDQUFrQixDQUFDLElBQW5CLENBQXdCLEdBQXhCLENBQUQsQ0FBRixHQUFnQyxLQUR2QyxDQUFBO2FBRUEsRUFBQSxHQUFLOztBQUFDO2FBQUEsNENBQUE7MkJBQUE7QUFDSixVQUFBLEdBQUEsR0FBTSxHQUFBLEdBQU07O0FBQUM7QUFBQTtpQkFBQSw2Q0FBQTs2QkFBQTtBQUNYLDZCQUFBLElBQUMsQ0FBQSxhQUFELENBQWUsSUFBZixFQUFxQixHQUFyQixFQUFBLENBRFc7QUFBQTs7dUJBQUQsQ0FFWCxDQUFDLElBRlUsQ0FFTCxJQUZLLENBQVosQ0FBQTtBQUFBLHdCQUdBLEVBQUEsR0FBRyxHQUFILEdBQU8sT0FIUCxDQURJO0FBQUE7O21CQUFELENBS0osQ0FBQyxJQUxHLENBS0UsRUFMRixFQUhHO0lBQUEsQ0FmVixDQUFBOztBQUFBLDRCQXlCQSxPQUFBLEdBQVMsU0FBQyxLQUFELEdBQUE7QUFDUCxVQUFBLGNBQUE7YUFBQTs7QUFBQzthQUFBLDRDQUFBOzJCQUFBO0FBQ0MsVUFBQSxHQUFBLEdBQU0sR0FBQSxHQUFNOztBQUFDO0FBQUE7aUJBQUEsNkNBQUE7NkJBQUE7QUFDWCw2QkFBQSxJQUFDLENBQUEsYUFBRCxDQUFlLElBQWYsRUFBcUIsR0FBckIsRUFBQSxDQURXO0FBQUE7O3VCQUFELENBRVgsQ0FBQyxJQUZVLENBRUwsRUFGSyxDQUFaLENBQUE7QUFHQSxVQUFBLElBQXdCLEdBQUEsS0FBTyxHQUEvQjtBQUFBLFlBQUEsR0FBQSxHQUFNLGNBQU4sQ0FBQTtXQUhBO0FBQUEsd0JBSUEsRUFBQSxHQUFHLEdBQUgsR0FBTyxLQUpQLENBREQ7QUFBQTs7bUJBQUQsQ0FNQyxDQUFDLElBTkYsQ0FNTyxFQU5QLEVBRE87SUFBQSxDQXpCVCxDQUFBOztBQUFBLDRCQWtDQSxRQUFBLEdBQVUsU0FBQyxLQUFELEdBQUE7QUFDUixNQUFBLElBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHdCQUFoQixDQUFBLEtBQTZDLE9BQWhEO2VBQ0UsSUFBQyxDQUFBLFFBQUQsQ0FBVSxLQUFWLEVBREY7T0FBQSxNQUFBO2VBR0UsSUFBQyxDQUFBLE9BQUQsQ0FBUyxLQUFULEVBSEY7T0FEUTtJQUFBLENBbENWLENBQUE7O3lCQUFBOztNQUZGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/home/cin_chalic/.atom/packages/todo-show/lib/todos-markdown.coffee
