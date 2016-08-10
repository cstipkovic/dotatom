(function() {
  var TableHeaderView, TodoEmptyView, TodoView, View,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  View = require('atom-space-pen-views').View;

  TableHeaderView = (function(_super) {
    __extends(TableHeaderView, _super);

    function TableHeaderView() {
      return TableHeaderView.__super__.constructor.apply(this, arguments);
    }

    TableHeaderView.content = function(showInTable, _arg) {
      var sortAsc, sortBy;
      if (showInTable == null) {
        showInTable = [];
      }
      sortBy = _arg.sortBy, sortAsc = _arg.sortAsc;
      return this.tr((function(_this) {
        return function() {
          var item, _i, _len, _results;
          _results = [];
          for (_i = 0, _len = showInTable.length; _i < _len; _i++) {
            item = showInTable[_i];
            _results.push(_this.th(item, function() {
              if (item === sortBy && sortAsc) {
                _this.div({
                  "class": 'sort-asc icon-triangle-down active'
                });
              } else {
                _this.div({
                  "class": 'sort-asc icon-triangle-down'
                });
              }
              if (item === sortBy && !sortAsc) {
                return _this.div({
                  "class": 'sort-desc icon-triangle-up active'
                });
              } else {
                return _this.div({
                  "class": 'sort-desc icon-triangle-up'
                });
              }
            }));
          }
          return _results;
        };
      })(this));
    };

    return TableHeaderView;

  })(View);

  TodoView = (function(_super) {
    __extends(TodoView, _super);

    function TodoView() {
      this.openPath = __bind(this.openPath, this);
      return TodoView.__super__.constructor.apply(this, arguments);
    }

    TodoView.content = function(showInTable, todo) {
      if (showInTable == null) {
        showInTable = [];
      }
      return this.tr((function(_this) {
        return function() {
          var item, _i, _len, _results;
          _results = [];
          for (_i = 0, _len = showInTable.length; _i < _len; _i++) {
            item = showInTable[_i];
            _results.push(_this.td(function() {
              switch (item) {
                case 'All':
                  return _this.span(todo.all);
                case 'Text':
                  return _this.span(todo.text);
                case 'Type':
                  return _this.i(todo.type);
                case 'Range':
                  return _this.i(todo.range);
                case 'Line':
                  return _this.i(todo.line);
                case 'Regex':
                  return _this.code(todo.regex);
                case 'File':
                  return _this.a(todo.file);
                case 'Tags':
                  return _this.i(todo.tags);
              }
            }));
          }
          return _results;
        };
      })(this));
    };

    TodoView.prototype.initialize = function(showInTable, todo) {
      this.todo = todo;
      return this.handleEvents();
    };

    TodoView.prototype.destroy = function() {
      return this.detach();
    };

    TodoView.prototype.handleEvents = function() {
      return this.on('click', 'td', this.openPath);
    };

    TodoView.prototype.openPath = function() {
      var todo;
      if (!(todo = this.todo)) {
        return;
      }
      return atom.workspace.open(todo.path, {
        split: 'left'
      }).then(function() {
        var position, textEditor;
        if (textEditor = atom.workspace.getActiveTextEditor()) {
          position = [todo.position[0][0], todo.position[0][1]];
          textEditor.setCursorBufferPosition(position, {
            autoscroll: false
          });
          return textEditor.scrollToCursorPosition({
            center: true
          });
        }
      });
    };

    return TodoView;

  })(View);

  TodoEmptyView = (function(_super) {
    __extends(TodoEmptyView, _super);

    function TodoEmptyView() {
      return TodoEmptyView.__super__.constructor.apply(this, arguments);
    }

    TodoEmptyView.content = function(showInTable) {
      if (showInTable == null) {
        showInTable = [];
      }
      return this.tr((function(_this) {
        return function() {
          return _this.td({
            colspan: showInTable.length
          }, function() {
            return _this.p("No results...");
          });
        };
      })(this));
    };

    return TodoEmptyView;

  })(View);

  module.exports = {
    TableHeaderView: TableHeaderView,
    TodoView: TodoView,
    TodoEmptyView: TodoEmptyView
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2luX2NoYWxpYy8uYXRvbS9wYWNrYWdlcy90b2RvLXNob3cvbGliL3RvZG8taXRlbS12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSw4Q0FBQTtJQUFBOztzRkFBQTs7QUFBQSxFQUFDLE9BQVEsT0FBQSxDQUFRLHNCQUFSLEVBQVIsSUFBRCxDQUFBOztBQUFBLEVBRU07QUFDSixzQ0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsSUFBQSxlQUFDLENBQUEsT0FBRCxHQUFVLFNBQUMsV0FBRCxFQUFtQixJQUFuQixHQUFBO0FBQ1IsVUFBQSxlQUFBOztRQURTLGNBQWM7T0FDdkI7QUFBQSxNQUQ0QixjQUFBLFFBQVEsZUFBQSxPQUNwQyxDQUFBO2FBQUEsSUFBQyxDQUFBLEVBQUQsQ0FBSSxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO0FBQ0YsY0FBQSx3QkFBQTtBQUFBO2VBQUEsa0RBQUE7bUNBQUE7QUFDRSwwQkFBQSxLQUFDLENBQUEsRUFBRCxDQUFJLElBQUosRUFBVSxTQUFBLEdBQUE7QUFDUixjQUFBLElBQUcsSUFBQSxLQUFRLE1BQVIsSUFBbUIsT0FBdEI7QUFDRSxnQkFBQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsa0JBQUEsT0FBQSxFQUFPLG9DQUFQO2lCQUFMLENBQUEsQ0FERjtlQUFBLE1BQUE7QUFHRSxnQkFBQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsa0JBQUEsT0FBQSxFQUFPLDZCQUFQO2lCQUFMLENBQUEsQ0FIRjtlQUFBO0FBSUEsY0FBQSxJQUFHLElBQUEsS0FBUSxNQUFSLElBQW1CLENBQUEsT0FBdEI7dUJBQ0UsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLGtCQUFBLE9BQUEsRUFBTyxtQ0FBUDtpQkFBTCxFQURGO2VBQUEsTUFBQTt1QkFHRSxL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

//# sourceURL=/home/cin_chalic/.atom/packages/todo-show/lib/todo-item-view.coffee
