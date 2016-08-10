(function() {
  describe('IndieRegistry', function() {
    var IndieRegistry, indieRegistry;
    IndieRegistry = require('../lib/indie-registry');
    indieRegistry = null;
    beforeEach(function() {
      if (indieRegistry != null) {
        indieRegistry.dispose();
      }
      return indieRegistry = new IndieRegistry();
    });
    describe('register', function() {
      return it('validates the args', function() {
        expect(function() {
          return indieRegistry.register({
            name: 2
          });
        }).toThrow();
        indieRegistry.register({});
        return indieRegistry.register({
          name: 'wow'
        });
      });
    });
    return describe('all of it', function() {
      return it('works', function() {
        var indie, listener, messages, observeListener;
        indie = indieRegistry.register({
          name: 'Wow'
        });
        expect(indieRegistry.has(indie)).toBe(false);
        expect(indieRegistry.has(0)).toBe(false);
        listener = jasmine.createSpy('linter.indie.messaging');
        observeListener = jasmine.createSpy('linter.indie.observe');
        messages = [{}];
        indieRegistry.onDidUpdateMessages(listener);
        indieRegistry.observe(observeListener);
        indie.setMessages(messages);
        expect(observeListener).toHaveBeenCalled();
        expect(observeListener).toHaveBeenCalledWith(indie);
        expect(listener).toHaveBeenCalled();
        expect(listener.mostRecentCall.args[0].linter.toBe(indie));
        expect(listener.mostRecentCall.args[0].messages.toBe(messages));
        indie.dispose();
        return expect(indieRegistry.has(indie)).toBe(false);
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2luX2NoYWxpYy8uYXRvbS9wYWNrYWdlcy9saW50ZXIvc3BlYy9pbmRpZS1yZWdpc3RyeS5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLEVBQUEsUUFBQSxDQUFTLGVBQVQsRUFBMEIsU0FBQSxHQUFBO0FBQ3hCLFFBQUEsNEJBQUE7QUFBQSxJQUFBLGFBQUEsR0FBZ0IsT0FBQSxDQUFRLHVCQUFSLENBQWhCLENBQUE7QUFBQSxJQUNBLGFBQUEsR0FBZ0IsSUFEaEIsQ0FBQTtBQUFBLElBR0EsVUFBQSxDQUFXLFNBQUEsR0FBQTs7UUFDVCxhQUFhLENBQUUsT0FBZixDQUFBO09BQUE7YUFDQSxhQUFBLEdBQW9CLElBQUEsYUFBQSxDQUFBLEVBRlg7SUFBQSxDQUFYLENBSEEsQ0FBQTtBQUFBLElBT0EsUUFBQSxDQUFTLFVBQVQsRUFBcUIsU0FBQSxHQUFBO2FBQ25CLEVBQUEsQ0FBRyxvQkFBSCxFQUF5QixTQUFBLEdBQUE7QUFDdkIsUUFBQSxNQUFBLENBQU8sU0FBQSxHQUFBO2lCQUNMLGFBQWEsQ0FBQyxRQUFkLENBQXVCO0FBQUEsWUFBQyxJQUFBLEVBQU0sQ0FBUDtXQUF2QixFQURLO1FBQUEsQ0FBUCxDQUVBLENBQUMsT0FGRCxDQUFBLENBQUEsQ0FBQTtBQUFBLFFBR0EsYUFBYSxDQUFDLFFBQWQsQ0FBdUIsRUFBdkIsQ0FIQSxDQUFBO2VBSUEsYUFBYSxDQUFDLFFBQWQsQ0FBdUI7QUFBQSxVQUFDLElBQUEsRUFBTSxLQUFQO1NBQXZCLEVBTHVCO01BQUEsQ0FBekIsRUFEbUI7SUFBQSxDQUFyQixDQVBBLENBQUE7V0FlQSxRQUFBLENBQVMsV0FBVCxFQUFzQixTQUFBLEdBQUE7YUFDcEIsRUFBQSxDQUFHLE9BQUgsRUFBWSxTQUFBLEdBQUE7QUFDVixZQUFBLDBDQUFBO0FBQUEsUUFBQSxLQUFBLEdBQVEsYUFBYSxDQUFDLFFBQWQsQ0FBdUI7QUFBQSxVQUFDLElBQUEsRUFBTSxLQUFQO1NBQXZCLENBQVIsQ0FBQTtBQUFBLFFBQ0EsTUFBQSxDQUFPLGFBQWEsQ0FBQyxHQUFkLENBQWtCLEtBQWxCLENBQVAsQ0FBZ0MsQ0FBQyxJQUFqQyxDQUFzQyxLQUF0QyxDQURBLENBQUE7QUFBQSxRQUVBLE1BQUEsQ0FBTyxhQUFhLENBQUMsR0FBZCxDQUFrQixDQUFsQixDQUFQLENBQTRCLENBQUMsSUFBN0IsQ0FBa0MsS0FBbEMsQ0FGQSxDQUFBO0FBQUEsUUFJQSxRQUFBLEdBQVcsT0FBTyxDQUFDLFNBQVIsQ0FBa0Isd0JBQWxCLENBSlgsQ0FBQTtBQUFBLFFBS0EsZUFBQSxHQUFrQixPQUFPLENBQUMsU0FBUixDQUFrQixzQkFBbEIsQ0FMbEIsQ0FBQTtBQUFBLFFBTUEsUUFBQSxHQUFXLENBQUMsRUFBRCxDQU5YLENBQUE7QUFBQSxRQU9BLGFBQWEsQ0FBQyxtQkFBZCxDQUFrQyxRQUFsQyxDQVBBLENBQUE7QUFBQSxRQVFBLGFBQWEsQ0FBQyxPQUFkLENBQXNCLGVBQXRCLENBUkEsQ0FBQTtBQUFBLFFBU0EsS0FBSyxDQUFDLFdBQU4sQ0FBa0IsUUFBbEIsQ0FUQSxDQUFBO0FBQUEsUUFVQSxNQUFBLENBQU8sZUFBUCxDQUF1QixDQUFDLGdCQUF4QixDQUFBLENBVkEsQ0FBQTtBQUFBLFFBV0EsTUFBQSxDQUFPLGVBQVAsQ0FBdUIsQ0FBQyxvQkFBeEIsQ0FBNkMsS0FBN0MsQ0FYQSxDQUFBO0FBQUEsUUFZQSxNQUFBLENBQU8sUUFBUCxDQUFnQixDQUFDLGdCQUFqQixDQUFBLENBWkEsQ0FBQTtBQUFBLFFBYUEsTUFBQSxDQUFPLFFBQVEsQ0FBQyxjQUFjLENBQUMsSUFBSyxDQUFBLENBQUEsQ0FBRSxDQUFDLE1BQU0sQ0FBQyxJQUF2QyxDQUE0QyxLQUE1QyxDQUFQLENBYkEsQ0FBQTtBQUFBLFFBY0EsTUFBQSxDQUFPLFFBQVEsQ0FBQyxjQUFjLENBQUMsSUFBSyxDQUFBLENBQUEsQ0FBRSxDQUFDLFFBQVEsQ0FBQyxJQUF6QyxDQUE4QyxRQUE5QyxDQUFQLENBZEEsQ0FBQTtBQUFBLFFBZUEsS0FBSyxDQUFDLE9BQU4sQ0FBQSxDQWZBLENBQUE7ZUFnQkEsTUFBQSxDQUFPLGFBQWEsQ0FBQyxHQUFkLENBQWtCLEtBQWxCLENBQVAsQ0FBZ0MsQ0FBQyxJQUFqQyxDQUFzQyxLQUF0QyxFQWpCVTtNQUFBLENBQVosRUFEb0I7SUFBQSxDQUF0QixFQWhCd0I7RUFBQSxDQUExQixDQUFBLENBQUE7QUFBQSIKfQ==

//# sourceURL=/home/cin_chalic/.atom/packages/linter/spec/indie-registry.coffee
