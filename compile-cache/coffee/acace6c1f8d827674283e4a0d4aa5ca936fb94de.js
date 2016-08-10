(function() {
  var LegacyAdater;

  module.exports = LegacyAdater = (function() {
    function LegacyAdater(textEditor) {
      this.textEditor = textEditor;
    }

    LegacyAdater.prototype.onDidChangeScrollTop = function(callback) {
      return this.textEditor.onDidChangeScrollTop(callback);
    };

    LegacyAdater.prototype.onDidChangeScrollLeft = function(callback) {
      return this.textEditor.onDidChangeScrollLeft(callback);
    };

    LegacyAdater.prototype.getHeight = function() {
      return this.textEditor.getHeight();
    };

    LegacyAdater.prototype.getScrollTop = function() {
      return this.textEditor.getScrollTop();
    };

    LegacyAdater.prototype.setScrollTop = function(scrollTop) {
      return this.textEditor.setScrollTop(scrollTop);
    };

    LegacyAdater.prototype.getScrollLeft = function() {
      return this.textEditor.getScrollLeft();
    };

    LegacyAdater.prototype.getHeightWithoutScrollPastEnd = function() {
      return this.textEditor.displayBuffer.getLineHeightInPixels();
    };

    LegacyAdater.prototype.getMaxScrollTop = function() {
      var lineHeight, maxScrollTop;
      maxScrollTop = this.textEditor.displayBuffer.getMaxScrollTop();
      lineHeight = this.textEditor.getLineHeightInPixels();
      if (this.scrollPastEnd) {
        maxScrollTop -= this.getHeight() - 3 * lineHeight;
      }
      return maxScrollTop;
    };

    return LegacyAdater;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2luX2NoYWxpYy8uYXRvbS9wYWNrYWdlcy9taW5pbWFwL2xpYi9hZGFwdGVycy9sZWdhY3ktYWRhcHRlci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsWUFBQTs7QUFBQSxFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDUyxJQUFBLHNCQUFFLFVBQUYsR0FBQTtBQUFlLE1BQWQsSUFBQyxDQUFBLGFBQUEsVUFBYSxDQUFmO0lBQUEsQ0FBYjs7QUFBQSwyQkFFQSxvQkFBQSxHQUFzQixTQUFDLFFBQUQsR0FBQTthQUNwQixJQUFDLENBQUEsVUFBVSxDQUFDLG9CQUFaLENBQWlDLFFBQWpDLEVBRG9CO0lBQUEsQ0FGdEIsQ0FBQTs7QUFBQSwyQkFLQSxxQkFBQSxHQUF1QixTQUFDLFFBQUQsR0FBQTthQUNyQixJQUFDLENBQUEsVUFBVSxDQUFDLHFCQUFaLENBQWtDLFFBQWxDLEVBRHFCO0lBQUEsQ0FMdkIsQ0FBQTs7QUFBQSwyQkFRQSxTQUFBLEdBQVcsU0FBQSxHQUFBO2FBQ1QsSUFBQyxDQUFBLFVBQVUsQ0FBQyxTQUFaLENBQUEsRUFEUztJQUFBLENBUlgsQ0FBQTs7QUFBQSwyQkFXQSxZQUFBLEdBQWMsU0FBQSxHQUFBO2FBQ1osSUFBQyxDQUFBLFVBQVUsQ0FBQyxZQUFaLENBQUEsRUFEWTtJQUFBLENBWGQsQ0FBQTs7QUFBQSwyQkFjQSxZQUFBLEdBQWMsU0FBQyxTQUFELEdBQUE7YUFDWixJQUFDLENBQUEsVUFBVSxDQUFDLFlBQVosQ0FBeUIsU0FBekIsRUFEWTtJQUFBLENBZGQsQ0FBQTs7QUFBQSwyQkFpQkEsYUFBQSxHQUFlLFNBQUEsR0FBQTthQUNiLElBQUMsQ0FBQSxVQUFVLENBQUMsYUFBWixDQUFBLEVBRGE7SUFBQSxDQWpCZixDQUFBOztBQUFBLDJCQW9CQSw2QkFBQSxHQUErQixTQUFBLEdBQUE7YUFDN0IsSUFBQyxDQUFBLFVBQVUsQ0FBQyxhQUFhLENBQUMscUJBQTFCLENBQUEsRUFENkI7SUFBQSxDQXBCL0IsQ0FBQTs7QUFBQSwyQkF1QkEsZUFBQSxHQUFpQixTQUFBLEdBQUE7QUFDZixVQUFBLHdCQUFBO0FBQUEsTUFBQSxZQUFBLEdBQWUsSUFBQyxDQUFBLFVBQVUsQ0FBQyxhQUFhLENBQUMsZUFBMUIsQ0FBQSxDQUFmLENBQUE7QUFBQSxNQUNBLFVBQUEsR0FBYSxJQUFDLENBQUEsVUFBVSxDQUFDLHFCQUFaLENBQUEsQ0FEYixDQUFBO0FBR0EsTUFBQSxJQUFpRCxJQUFDLENBQUEsYUFBbEQ7QUFBQSxRQUFBLFlBQUEsSUFBZ0IsSUFBQyxDQUFBLFNBQUQsQ0FBQSxDQUFBLEdBQWUsQ0FBQSxHQUFJLFVBQW5DLENBQUE7T0FIQTthQUlBLGFBTGU7SUFBQSxDQXZCakIsQ0FBQTs7d0JBQUE7O01BRkYsQ0FBQTtBQUFBIgp9

//# sourceURL=/home/cin_chalic/.atom/packages/minimap/lib/adapters/legacy-adapter.coffee
