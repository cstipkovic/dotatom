(function() {
  var ShowTodoView, TodosModel, path;

  path = require('path');

  ShowTodoView = require('../lib/show-todo-view');

  TodosModel = require('../lib/todos-model');

  describe("Show Todo View", function() {
    var model, showTodoView, _ref;
    _ref = [], showTodoView = _ref[0], model = _ref[1];
    beforeEach(function() {
      var regexes, uri;
      regexes = ['TODOs', '/\\bTODO:?\\d*($|\\s.*$)/g'];
      atom.config.set('todo-show.findTheseRegexes', regexes);
      atom.project.setPaths([path.join(__dirname, 'fixtures/sample1')]);
      model = new TodosModel;
      uri = 'atom://todo-show/todos';
      showTodoView = new ShowTodoView(model, uri);
      return waitsFor(function() {
        return !showTodoView.loading;
      });
    });
    describe("Basic view properties", function() {
      return it("has a title, uri, etc.", function() {
        expect(showTodoView.getTitle()).toEqual('Todo-Show Results');
        expect(showTodoView.getIconName()).toEqual('checklist');
        expect(showTodoView.getURI()).toEqual('atom://todo-show/todos');
        return expect(showTodoView.find('.btn-group')).toExist();
      });
    });
    return describe("Automatic update of todos", function() {
      it("refreshes on save", function() {
        waitsForPromise(function() {
          return atom.workspace.open('temp.txt');
        });
        return runs(function() {
          var editor;
          editor = atom.workspace.getActiveTextEditor();
          expect(showTodoView.getTodos()).toHaveLength(3);
          editor.setText("# TODO: Test");
          editor.save();
          waitsFor(function() {
            return !showTodoView.loading;
          });
          return runs(function() {
            expect(showTodoView.getTodos()).toHaveLength(4);
            editor.setText("");
            editor.save();
            waitsFor(function() {
              return !showTodoView.loading;
            });
            return runs(function() {
              return expect(showTodoView.getTodos()).toHaveLength(3);
            });
          });
        });
      });
      it("updates on search scope change", function() {
        expect(showTodoView.loading).toBe(false);
        expect(model.getSearchScope()).toBe('full');
        expect(model.toggleSearchScope()).toBe('open');
        expect(showTodoView.loading).toBe(true);
        waitsFor(function() {
          return !showTodoView.loading;
        });
        return runs(function() {
          expect(model.toggleSearchScope()).toBe('active');
          expect(showTodoView.loading).toBe(true);
          waitsFor(function() {
            return !showTodoView.loading;
          });
          return runs(function() {
            expect(model.toggleSearchScope()).toBe('full');
            return expect(showTodoView.loading).toBe(true);
          });
        });
      });
      return it("handles search scope; full, open, active", function() {
        waitsForPromise(function() {
          return atom.workspace.open('sample.c');
        });
        return runs(function() {
          var pane;
          pane = atom.workspace.getActivePane();
          expect(showTodoView.getTodos()).toHaveLength(3);
          model.setSearchScope('open');
          waitsFor(function() {
            return !showTodoView.loading;
          });
          return runs(function() {
            expect(showTodoView.getTodos()).toHaveLength(1);
            waitsForPromise(function() {
              return atom.workspace.open('temp.txt');
            });
            return runs(function() {
              model.setSearchScope('active');
              waitsFor(function() {
                return !showTodoView.loading;
              });
              return runs(function() {
                expect(showTodoView.getTodos()).toHaveLength(0);
                pane.activateItemAtIndex(0);
                waitsFor(function() {
                  return !showTodoView.loading;
                });
                return runs(function() {
                  return expect(showTodoView.getTodos()).toHaveLength(1);
                });
              });
            });
          });
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2luX2NoYWxpYy8uYXRvbS9wYWNrYWdlcy90b2RvLXNob3cvc3BlYy9zaG93LXRvZG8tdmlldy1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSw4QkFBQTs7QUFBQSxFQUFBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUFQLENBQUE7O0FBQUEsRUFFQSxZQUFBLEdBQWUsT0FBQSxDQUFRLHVCQUFSLENBRmYsQ0FBQTs7QUFBQSxFQUdBLFVBQUEsR0FBYSxPQUFBLENBQVEsb0JBQVIsQ0FIYixDQUFBOztBQUFBLEVBS0EsUUFBQSxDQUFTLGdCQUFULEVBQTJCLFNBQUEsR0FBQTtBQUN6QixRQUFBLHlCQUFBO0FBQUEsSUFBQSxPQUF3QixFQUF4QixFQUFDLHNCQUFELEVBQWUsZUFBZixDQUFBO0FBQUEsSUFFQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsVUFBQSxZQUFBO0FBQUEsTUFBQSxPQUFBLEdBQVUsQ0FDUixPQURRLEVBRVIsNEJBRlEsQ0FBVixDQUFBO0FBQUEsTUFJQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsNEJBQWhCLEVBQThDLE9BQTlDLENBSkEsQ0FBQTtBQUFBLE1BTUEsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFiLENBQXNCLENBQUMsSUFBSSxDQUFDLElBQUwsQ0FBVSxTQUFWLEVBQXFCLGtCQUFyQixDQUFELENBQXRCLENBTkEsQ0FBQTtBQUFBLE1BT0EsS0FBQSxHQUFRLEdBQUEsQ0FBQSxVQVBSLENBQUE7QUFBQSxNQVFBLEdBQUEsR0FBTSx3QkFSTixDQUFBO0FBQUEsTUFTQSxZQUFBLEdBQW1CLElBQUEsWUFBQSxDQUFhLEtBQWIsRUFBb0IsR0FBcEIsQ0FUbkIsQ0FBQTthQVVBLFFBQUEsQ0FBUyxTQUFBLEdBQUE7ZUFBRyxDQUFBLFlBQWEsQ0FB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

//# sourceURL=/home/cin_chalic/.atom/packages/todo-show/spec/show-todo-view-spec.coffee
