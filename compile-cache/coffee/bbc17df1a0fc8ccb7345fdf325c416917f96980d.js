(function() {
  var Disposable, StatusBarTileView, element_name, path,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Disposable = require('atom').Disposable;

  path = require('path');

  element_name = 'waka-status-bar' + Date.now();

  StatusBarTileView = (function(_super) {
    __extends(StatusBarTileView, _super);

    function StatusBarTileView() {
      return StatusBarTileView.__super__.constructor.apply(this, arguments);
    }

    StatusBarTileView.prototype.init = function() {
      this.classList.add(element_name, 'inline-block');
      this.link = document.createElement('a');
      this.link.classList.add('inline-block');
      this.link.href = 'https://wakatime.com/';
      this.appendChild(this.link);
      this.icon = document.createElement('img');
      this.icon.classList.add('inline-block');
      this.icon.setAttribute('src', __dirname + path.sep + 'icon.png');
      this.icon.style.width = '1.4555em';
      this.icon.style.height = '1.4555em';
      this.icon.style.verticalAlign = 'middle';
      this.icon.style.marginRight = '0.3em';
      this.link.appendChild(this.icon);
      this.msg = document.createElement('span');
      this.msg.classList.add('inline-block');
      this.link.appendChild(this.msg);
      return this.setStatus("initializing...");
    };

    StatusBarTileView.prototype.destroy = function() {
      var _ref;
      if ((_ref = this.tooltip) != null) {
        _ref.dispose();
      }
      return this.classList = '';
    };

    StatusBarTileView.prototype.setStatus = function(content) {
      var _ref;
      return (_ref = this.msg) != null ? _ref.textContent = content || '' : void 0;
    };

    StatusBarTileView.prototype.setTitle = function(text) {
      var _ref;
      if ((_ref = this.tooltip) != null) {
        _ref.dispose();
      }
      return this.tooltip = atom.tooltips.add(this, {
        title: text
      });
    };

    return StatusBarTileView;

  })(HTMLElement);

  module.exports = document.registerElement(element_name, {
    prototype: StatusBarTileView.prototype,
    "extends": 'div'
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2luX2NoYWxpYy8uYXRvbS9wYWNrYWdlcy93YWthdGltZS9saWIvc3RhdHVzLWJhci10aWxlLXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGlEQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQyxhQUFjLE9BQUEsQ0FBUSxNQUFSLEVBQWQsVUFBRCxDQUFBOztBQUFBLEVBQ0EsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBRFAsQ0FBQTs7QUFBQSxFQUdBLFlBQUEsR0FBZSxpQkFBQSxHQUFvQixJQUFJLENBQUMsR0FBTCxDQUFBLENBSG5DLENBQUE7O0FBQUEsRUFLTTtBQUVKLHdDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxnQ0FBQSxJQUFBLEdBQU0sU0FBQSxHQUFBO0FBQ0osTUFBQSxJQUFDLENBQUEsU0FBUyxDQUFDLEdBQVgsQ0FBZSxZQUFmLEVBQTZCLGNBQTdCLENBQUEsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLElBQUQsR0FBUSxRQUFRLENBQUMsYUFBVCxDQUF1QixHQUF2QixDQUZSLENBQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQWhCLENBQW9CLGNBQXBCLENBSEEsQ0FBQTtBQUFBLE1BSUEsSUFBQyxDQUFBLElBQUksQ0FBQyxJQUFOLEdBQWEsdUJBSmIsQ0FBQTtBQUFBLE1BS0EsSUFBQyxDQUFBLFdBQUQsQ0FBYSxJQUFDLENBQUEsSUFBZCxDQUxBLENBQUE7QUFBQSxNQU9BLElBQUMsQ0FBQSxJQUFELEdBQVEsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsS0FBdkIsQ0FQUixDQUFBO0FBQUEsTUFRQSxJQUFDLENBQUEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFoQixDQUFvQixjQUFwQixDQVJBLENBQUE7QUFBQSxNQVNBLElBQUMsQ0FBQSxJQUFJLENBQUMsWUFBTixDQUFtQixLQUFuQixFQUEwQixTQUFBLEdBQVksSUFBSSxDQUFDLEdBQWpCLEdBQXVCLFVBQWpELENBVEEsQ0FBQTtBQUFBLE1BVUEsSUFBQyxDQUFBLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBWixHQUFvQixVQVZwQixDQUFBO0FBQUEsTUFXQSxJQUFDLENBQUEsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFaLEdBQXFCLFVBWHJCLENBQUE7QUFBQSxNQVlBLElBQUMsQ0FBQSxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQVosR0FBNEIsUUFaNUIsQ0FBQTtBQUFBLE1BYUEsSUFBQyxDQUFBLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBWixHQUEwQixPQWIxQixDQUFBO0FBQUEsTUFjQSxJQUFDLENBQUEsSUFBSSxDQUFDLFdBQU4sQ0FBa0IsSUFBQyxDQUFBLElBQW5CLENBZEEsQ0FBQTtBQUFBLE1BZ0JBLElBQUMsQ0FBQSxHQUFELEdBQU8sUUFBUSxDQUFDLGFBQVQsQ0FBdUIsTUFBdkIsQ0FoQlAsQ0FBQTtBQUFBLE1BaUJBLElBQUMsQ0FBQSxHQUFHLENBQUMsU0FBUyxDQUFDLEdBQWYsQ0FBbUIsY0FBbkIsQ0FqQkEsQ0FBQTtBQUFBLE1Ba0JBLElBQUMsQ0FBQSxJQUFJLENBQUMsV0FBTixDQUFrQixJQUFDLENBQUEsR0FBbkIsQ0FsQkEsQ0FBQTthQW9CQSxJQUFDLENBQUEsU0FBRCxDQUFXLGlCQUFYLEVBckJJO0lBQUEsQ0FBTixDQUFBOztBQUFBLGdDQXVCQSxPQUFBLEdBQVMsU0FBQSxHQUFBO0FBQ1AsVUFBQSxJQUFBOztZQUFRLENBQUUsT0FBVixDQUFBO09BQUE7YUFDQSxJQUFDLENBQUEsU0FBRCxHQUFhLEdBRk47SUFBQSxDQXZCVCxDQUFBOztBQUFBLGdDQTJCQSxTQUFBLEdBQVcsU0FBQyxPQUFELEdBQUE7QUFDVCxVQUFBLElBQUE7NkNBQUksQ0FBRSxXQUFOLEdBQW9CLE9BQUEsSUFBVyxZQUR0QjtJQUFBLENBM0JYLENBQUE7O0FBQUEsZ0NBOEJBLFFBQUEsR0FBVSxTQUFDLElBQUQsR0FBQTtBQUNSLFVBQUEsSUFBQTs7WUFBUSxDQUFFLE9BQVYsQ0FBQTtPQUFBO2FBQ0EsSUFBQyxDQUFBLE9BQUQsR0FBVyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsSUFBbEIsRUFDVDtBQUFBLFFBQUEsS0FBQSxFQUFPLElBQVA7T0FEUyxFQUZIO0lBQUEsQ0E5QlYsQ0FBQTs7NkJBQUE7O0tBRjhCLFlBTGhDLENBQUE7O0FBQUEsRUEwQ0EsTUFBTSxDQUFDLE9BQVAsR0FBaUIsUUFBUSxDQUFDLGVBQVQsQ0FBeUIsWUFBekIsRUFBdUM7QUFBQSxJQUFBLFNBQUEsRUFBVyxpQkFBaUIsQ0FBQyxTQUE3QjtBQUFBLElBQXdDLFNBQUEsRUFBUyxLQUFqRDtHQUF2QyxDQTFDakIsQ0FBQTtBQUFBIgp9

//# sourceURL=/home/cin_chalic/.atom/packages/wakatime/lib/status-bar-tile-view.coffee
