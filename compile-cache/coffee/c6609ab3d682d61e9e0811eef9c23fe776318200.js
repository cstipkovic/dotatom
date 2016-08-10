(function() {
  var TodoRegex;

  module.exports = TodoRegex = (function() {
    function TodoRegex(regex, todoList) {
      this.regex = regex;
      this.error = false;
      this.regexp = this.createRegexp(this.regex, todoList);
    }

    TodoRegex.prototype.makeRegexObj = function(regexStr) {
      var flags, pattern, _ref, _ref1;
      if (regexStr == null) {
        regexStr = '';
      }
      pattern = (_ref = regexStr.match(/\/(.+)\//)) != null ? _ref[1] : void 0;
      flags = (_ref1 = regexStr.match(/\/(\w+$)/)) != null ? _ref1[1] : void 0;
      if (!pattern) {
        this.error = true;
        return false;
      }
      return new RegExp(pattern, flags);
    };

    TodoRegex.prototype.createRegexp = function(regexStr, todoList) {
      if (!(Object.prototype.toString.call(todoList) === '[object Array]' && todoList.length > 0 && regexStr)) {
        this.error = true;
        return false;
      }
      return this.makeRegexObj(regexStr.replace('${TODOS}', todoList.join('|')));
    };

    return TodoRegex;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2luX2NoYWxpYy8uYXRvbS9wYWNrYWdlcy90b2RvLXNob3cvbGliL3RvZG8tcmVnZXguY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLFNBQUE7O0FBQUEsRUFBQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ1MsSUFBQSxtQkFBRSxLQUFGLEVBQVMsUUFBVCxHQUFBO0FBQ1gsTUFEWSxJQUFDLENBQUEsUUFBQSxLQUNiLENBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxLQUFELEdBQVMsS0FBVCxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsTUFBRCxHQUFVLElBQUMsQ0FBQSxZQUFELENBQWMsSUFBQyxDQUFBLEtBQWYsRUFBc0IsUUFBdEIsQ0FEVixDQURXO0lBQUEsQ0FBYjs7QUFBQSx3QkFJQSxZQUFBLEdBQWMsU0FBQyxRQUFELEdBQUE7QUFFWixVQUFBLDJCQUFBOztRQUZhLFdBQVc7T0FFeEI7QUFBQSxNQUFBLE9BQUEscURBQXNDLENBQUEsQ0FBQSxVQUF0QyxDQUFBO0FBQUEsTUFFQSxLQUFBLHVEQUFvQyxDQUFBLENBQUEsVUFGcEMsQ0FBQTtBQUlBLE1BQUEsSUFBQSxDQUFBLE9BQUE7QUFDRSxRQUFBLElBQUMsQ0FBQSxLQUFELEdBQVMsSUFBVCxDQUFBO0FBQ0EsZUFBTyxLQUFQLENBRkY7T0FKQTthQU9JLElBQUEsTUFBQSxDQUFPLE9BQVAsRUFBZ0IsS0FBaEIsRUFUUTtJQUFBLENBSmQsQ0FBQTs7QUFBQSx3QkFlQSxZQUFBLEdBQWMsU0FBQyxRQUFELEVBQVcsUUFBWCxHQUFBO0FBQ1osTUFBQSxJQUFBLENBQUEsQ0FBTyxNQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxJQUExQixDQUErQixRQUEvQixDQUFBLEtBQTRDLGdCQUE1QyxJQUNQLFFBQVEsQ0FBQyxNQUFULEdBQWtCLENBRFgsSUFFUCxRQUZBLENBQUE7QUFHRSxRQUFBLElBQUMsQ0FBQSxLQUFELEdBQVMsSUFBVCxDQUFBO0FBQ0EsZUFBTyxLQUFQLENBSkY7T0FBQTthQUtBLElBQUMsQ0FBQSxZQUFELENBQWMsUUFBUSxDQUFDLE9BQVQsQ0FBaUIsVUFBakIsRUFBNkIsUUFBUSxDQUFDLElBQVQsQ0FBYyxHQUFkLENBQTdCLENBQWQsRUFOWTtJQUFBLENBZmQsQ0FBQTs7cUJBQUE7O01BRkYsQ0FBQTtBQUFBIgp9

//# sourceURL=/home/cin_chalic/.atom/packages/todo-show/lib/todo-regex.coffee
