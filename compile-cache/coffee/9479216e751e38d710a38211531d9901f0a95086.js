(function() {
  var NpmDocsView, ScrollView,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  ScrollView = require('atom').ScrollView;

  module.exports = NpmDocsView = (function(_super) {
    __extends(NpmDocsView, _super);

    atom.deserializers.add(NpmDocsView);

    NpmDocsView.deserialize = function(_arg) {
      var path;
      path = _arg.path;
      return new NpmDocsView(path);
    };

    NpmDocsView.content = function() {
      return this.div({
        "class": 'npm-docs native-key-bindings',
        tabindex: -1
      });
    };

    function NpmDocsView(path) {
      this.path = path;
      NpmDocsView.__super__.constructor.apply(this, arguments);
      this.handleEvents();
    }

    NpmDocsView.prototype.renderContents = function(html) {
      return this.html(html);
    };

    NpmDocsView.prototype.serialize = function() {
      return {
        deserializer: 'NpmDocsView',
        path: this.path
      };
    };

    NpmDocsView.prototype.handleEvents = function() {
      this.subscribe(this, 'core:move-up', (function(_this) {
        return function() {
          return _this.scrollUp();
        };
      })(this));
      return this.subscribe(this, 'core:move-down', (function(_this) {
        return function() {
          return _this.scrollDown();
        };
      })(this));
    };

    NpmDocsView.prototype.destroy = function() {
      return this.unsubscribe();
    };

    NpmDocsView.prototype.getTitle = function() {
      return "npm-docs: " + this.path;
    };

    return NpmDocsView;

  })(ScrollView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2luX2NoYWxpYy8uYXRvbS9wYWNrYWdlcy9ucG0tZG9jcy9saWIvbnBtLWRvY3Mtdmlldy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsdUJBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFDLGFBQWMsT0FBQSxDQUFRLE1BQVIsRUFBZCxVQUFELENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osa0NBQUEsQ0FBQTs7QUFBQSxJQUFBLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBbkIsQ0FBdUIsV0FBdkIsQ0FBQSxDQUFBOztBQUFBLElBRUEsV0FBQyxDQUFBLFdBQUQsR0FBYyxTQUFDLElBQUQsR0FBQTtBQUNaLFVBQUEsSUFBQTtBQUFBLE1BRGMsT0FBRCxLQUFDLElBQ2QsQ0FBQTthQUFJLElBQUEsV0FBQSxDQUFZLElBQVosRUFEUTtJQUFBLENBRmQsQ0FBQTs7QUFBQSxJQUtBLFdBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQSxHQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFFBQUEsT0FBQSxFQUFPLDhCQUFQO0FBQUEsUUFBdUMsUUFBQSxFQUFVLENBQUEsQ0FBakQ7T0FBTCxFQURRO0lBQUEsQ0FMVixDQUFBOztBQVFhLElBQUEscUJBQUUsSUFBRixHQUFBO0FBQ1gsTUFEWSxJQUFDLENBQUEsT0FBQSxJQUNiLENBQUE7QUFBQSxNQUFBLDhDQUFBLFNBQUEsQ0FBQSxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsWUFBRCxDQUFBLENBREEsQ0FEVztJQUFBLENBUmI7O0FBQUEsMEJBWUEsY0FBQSxHQUFnQixTQUFDLElBQUQsR0FBQTthQUNkLElBQUMsQ0FBQSxJQUFELENBQU0sSUFBTixFQURjO0lBQUEsQ0FaaEIsQ0FBQTs7QUFBQSwwQkFlQSxTQUFBLEdBQVcsU0FBQSxHQUFBO2FBQ1Q7QUFBQSxRQUFBLFlBQUEsRUFBYyxhQUFkO0FBQUEsUUFDQSxJQUFBLEVBQU0sSUFBQyxDQUFBLElBRFA7UUFEUztJQUFBLENBZlgsQ0FBQTs7QUFBQSwwQkFtQkEsWUFBQSxHQUFjLFNBQUEsR0FBQTtBQUNaLE1BQUEsSUFBQyxDQUFBLFNBQUQsQ0FBVyxJQUFYLEVBQWlCLGNBQWpCLEVBQW1DLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQUcsS0FBQyxDQUFBLFFBQUQsQ0FBQSxFQUFIO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBbkMsQ0FBQSxDQUFBO2FBQ0EsSUFBQyxDQUFBLFNBQUQsQ0FBVyxJQUFYLEVBQWlCLGdCQUFqQixFQUFtQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUFHLEtBQUMsQ0FBQSxVQUFELENBQUEsRUFBSDtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQW5DLEVBRlk7SUFBQSxDQW5CZCxDQUFBOztBQUFBLDBCQXdCQSxPQUFBLEdBQVMsU0FBQSxHQUFBO2FBQ1AsSUFBQyxDQUFBLFdBQUQsQ0FBQSxFQURPO0lBQUEsQ0F4QlQsQ0FBQTs7QUFBQSwwQkEyQkEsUUFBQSxHQUFVLFNBQUEsR0FBQTthQUNQLFlBQUEsR0FBWSxJQUFDLENBQUEsS0FETjtJQUFBLENBM0JWLENBQUE7O3VCQUFBOztLQUR3QixXQUgxQixDQUFBO0FBQUEiCn0=

//# sourceURL=/home/cin_chalic/.atom/packages/npm-docs/lib/npm-docs-view.coffee
