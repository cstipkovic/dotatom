(function() {
  var BetaAdater;

  module.exports = BetaAdater = (function() {
    function BetaAdater(textEditor) {
      this.textEditor = textEditor;
      this.textEditorElement = atom.views.getView(this.textEditor);
    }

    BetaAdater.prototype.onDidChangeScrollTop = function(callback) {
      return this.textEditorElement.onDidChangeScrollTop(callback);
    };

    BetaAdater.prototype.onDidChangeScrollLeft = function(callback) {
      return this.textEditorElement.onDidChangeScrollLeft(callback);
    };

    BetaAdater.prototype.getHeight = function() {
      return this.textEditorElement.getHeight();
    };

    BetaAdater.prototype.getScrollTop = function() {
      return this.textEditorElement.getScrollTop();
    };

    BetaAdater.prototype.setScrollTop = function(scrollTop) {
      return this.textEditorElement.setScrollTop(scrollTop);
    };

    BetaAdater.prototype.getScrollLeft = function() {
      return this.textEditorElement.getScrollLeft();
    };

    BetaAdater.prototype.getHeightWithoutScrollPastEnd = function() {
      return this.textEditor.displayBuffer.getLineHeightInPixels();
    };

    BetaAdater.prototype.getMaxScrollTop = function() {
      var lineHeight, maxScrollTop;
      maxScrollTop = this.textEditorElement.getScrollHeight() - this.getHeight();
      lineHeight = this.textEditor.getLineHeightInPixels();
      if (this.scrollPastEnd) {
        maxScrollTop -= this.getHeight() - 3 * lineHeight;
      }
      return maxScrollTop;
    };

    return BetaAdater;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2luX2NoYWxpYy8uYXRvbS9wYWNrYWdlcy9taW5pbWFwL2xpYi9hZGFwdGVycy9iZXRhLWFkYXB0ZXIuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLFVBQUE7O0FBQUEsRUFBQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ1MsSUFBQSxvQkFBRSxVQUFGLEdBQUE7QUFDWCxNQURZLElBQUMsQ0FBQSxhQUFBLFVBQ2IsQ0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLGlCQUFELEdBQXFCLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBWCxDQUFtQixJQUFDLENBQUEsVUFBcEIsQ0FBckIsQ0FEVztJQUFBLENBQWI7O0FBQUEseUJBR0Esb0JBQUEsR0FBc0IsU0FBQyxRQUFELEdBQUE7YUFDcEIsSUFBQyxDQUFBLGlCQUFpQixDQUFDLG9CQUFuQixDQUF3QyxRQUF4QyxFQURvQjtJQUFBLENBSHRCLENBQUE7O0FBQUEseUJBTUEscUJBQUEsR0FBdUIsU0FBQyxRQUFELEdBQUE7YUFDckIsSUFBQyxDQUFBLGlCQUFpQixDQUFDLHFCQUFuQixDQUF5QyxRQUF6QyxFQURxQjtJQUFBLENBTnZCLENBQUE7O0FBQUEseUJBU0EsU0FBQSxHQUFXLFNBQUEsR0FBQTthQUNULElBQUMsQ0FBQSxpQkFBaUIsQ0FBQyxTQUFuQixDQUFBLEVBRFM7SUFBQSxDQVRYLENBQUE7O0FBQUEseUJBWUEsWUFBQSxHQUFjLFNBQUEsR0FBQTthQUNaLElBQUMsQ0FBQSxpQkFBaUIsQ0FBQyxZQUFuQixDQUFBLEVBRFk7SUFBQSxDQVpkLENBQUE7O0FBQUEseUJBZUEsWUFBQSxHQUFjLFNBQUMsU0FBRCxHQUFBO2FBQ1osSUFBQyxDQUFBLGlCQUFpQixDQUFDLFlBQW5CLENBQWdDLFNBQWhDLEVBRFk7SUFBQSxDQWZkLENBQUE7O0FBQUEseUJBa0JBLGFBQUEsR0FBZSxTQUFBLEdBQUE7YUFDYixJQUFDLENBQUEsaUJBQWlCLENBQUMsYUFBbkIsQ0FBQSxFQURhO0lBQUEsQ0FsQmYsQ0FBQTs7QUFBQSx5QkFxQkEsNkJBQUEsR0FBK0IsU0FBQSxHQUFBO2FBQzdCLElBQUMsQ0FBQSxVQUFVLENBQUMsYUFBYSxDQUFDLHFCQUExQixDQUFBLEVBRDZCO0lBQUEsQ0FyQi9CLENBQUE7O0FBQUEseUJBd0JBLGVBQUEsR0FBaUIsU0FBQSxHQUFBO0FBQ2YsVUFBQSx3QkFBQTtBQUFBLE1BQUEsWUFBQSxHQUFlLElBQUMsQ0FBQSxpQkFBaUIsQ0FBQyxlQUFuQixDQUFBLENBQUEsR0FBdUMsSUFBQyxDQUFBLFNBQUQsQ0FBQSxDQUF0RCxDQUFBO0FBQUEsTUFDQSxVQUFBLEdBQWEsSUFBQyxDQUFBLFVBQVUsQ0FBQyxxQkFBWixDQUFBLENBRGIsQ0FBQTtBQUdBLE1BQUEsSUFBaUQsSUFBQyxDQUFBLGFBQWxEO0FBQUEsUUFBQSxZQUFBLElBQWdCLElBQUMsQ0FBQSxTQUFELENBQUEsQ0FBQSxHQUFlLENBQUEsR0FBSSxVQUFuQyxDQUFBO09BSEE7YUFJQSxhQUxlO0lBQUEsQ0F4QmpCLENBQUE7O3NCQUFBOztNQUZGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/home/cin_chalic/.atom/packages/minimap/lib/adapters/beta-adapter.coffee
