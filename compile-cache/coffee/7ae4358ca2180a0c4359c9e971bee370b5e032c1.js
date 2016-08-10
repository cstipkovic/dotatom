(function() {
  var Disposable, StatusBarTileView, element_name, path, svg,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Disposable = require('atom').Disposable;

  path = require('path');

  element_name = 'waka-status-bar' + Date.now();

  svg = "<svg id=\"wakatime-svg\" width=\"18px\" height=\"18px\" viewBox=\"0 0 256 256\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" preserveAspectRatio=\"xMidYMid\">\n<g><path d=\"M128,0 C57.308,0 0,57.308 0,128 C0,198.693 57.308,256 128,256 C198.693,256 256,198.693 256,128 C256,57.308 198.693,0 128,0 M128,33.805 C179.939,33.805 222.195,76.061 222.195,128 C222.195,179.94 179.939,222.195 128,222.195 C76.061,222.195 33.805,179.94 33.805,128 C33.805,76.061 76.061,33.805 128,33.805 M115.4993,155.6431 L115.3873,155.6431 C113.4353,155.6081 111.6083,154.6751 110.4343,153.1151 L81.5593,114.7321 C79.4553,111.9351 80.0173,107.9611 82.8143,105.8561 C85.6123,103.7511 89.5853,104.3131 91.6903,107.1111 L115.6833,139.0051 L122.5463,130.5271 C123.7493,129.0411 125.5603,128.1771 127.4723,128.1771 L127.4803,128.1771 C129.3973,128.1791 131.2093,129.0471 132.4103,130.5411 L139.0003,138.7281 L176.6923,90.1341 C178.8353,87.3681 182.8173,86.8651 185.5843,89.0111 C188.3493,91.1561 188.8533,95.1371 186.7073,97.9041 L144.1003,152.8371 C142.9143,154.3681 141.0883,155.2721 139.1503,155.2901 L139.0933,155.2901 C137.1743,155.2901 135.3583,154.4221 134.1553,152.9261 L127.4583,144.6071 L120.4253,153.2931 C119.2213,154.7811 117.4103,155.6431 115.4993,155.6431\" fill=\"#000000\"></path></g>\n</svg>";

  StatusBarTileView = (function(_super) {
    __extends(StatusBarTileView, _super);

    function StatusBarTileView() {
      return StatusBarTileView.__super__.constructor.apply(this, arguments);
    }

    StatusBarTileView.prototype.init = function() {
      this.link = document.createElement('a');
      this.link.classList.add('inline-block');
      this.link.href = 'https://wakatime.com/';
      this.appendChild(this.link);
      this.icon = document.createElement('div');
      this.icon.setAttribute('id', 'wakatime-status-bar');
      this.icon.classList.add('inline-block');
      this.icon.innerHTML = svg;
      this.link.appendChild(this.icon);
      this.msg = document.createElement('span');
      this.msg.classList.add('inline-block');
      this.link.appendChild(this.msg);
      return this.setStatus("initializing...");
    };

    StatusBarTileView.prototype.show = function() {
      this.classList.add(element_name, 'inline-block');
      return this.classList.remove(element_name, 'hidden');
    };

    StatusBarTileView.prototype.hide = function() {
      this.classList.remove(element_name, 'inline-block');
      return this.classList.add(element_name, 'hidden');
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2luX2NoYWxpYy8uYXRvbS9wYWNrYWdlcy93YWthdGltZS9saWIvc3RhdHVzLWJhci10aWxlLXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHNEQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQyxhQUFjLE9BQUEsQ0FBUSxNQUFSLEVBQWQsVUFBRCxDQUFBOztBQUFBLEVBQ0EsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBRFAsQ0FBQTs7QUFBQSxFQUdBLFlBQUEsR0FBZSxpQkFBQSxHQUFvQixJQUFJLENBQUMsR0FBTCxDQUFBLENBSG5DLENBQUE7O0FBQUEsRUFLQSxHQUFBLEdBQU0scXpDQUxOLENBQUE7O0FBQUEsRUFVTTtBQUVKLHdDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxnQ0FBQSxJQUFBLEdBQU0sU0FBQSxHQUFBO0FBQ0osTUFBQSxJQUFDLENBQUEsSUFBRCxHQUFRLFFBQVEsQ0FBQyxhQUFULENBQXVCLEdBQXZCLENBQVIsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBaEIsQ0FBb0IsY0FBcEIsQ0FEQSxDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsSUFBSSxDQUFDLElBQU4sR0FBYSx1QkFGYixDQUFBO0FBQUEsTUFHQSxJQUFDLENBQUEsV0FBRCxDQUFhLElBQUMsQ0FBQSxJQUFkLENBSEEsQ0FBQTtBQUFBLE1BS0EsSUFBQyxDQUFBLElBQUQsR0FBUSxRQUFRLENBQUMsYUFBVCxDQUF1QixLQUF2QixDQUxSLENBQUE7QUFBQSxNQU1BLElBQUMsQ0FBQSxJQUFJLENBQUMsWUFBTixDQUFtQixJQUFuQixFQUF5QixxQkFBekIsQ0FOQSxDQUFBO0FBQUEsTUFPQSxJQUFDLENBQUEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFoQixDQUFvQixjQUFwQixDQVBBLENBQUE7QUFBQSxNQVFBLElBQUMsQ0FBQSxJQUFJLENBQUMsU0FBTixHQUFrQixHQVJsQixDQUFBO0FBQUEsTUFTQSxJQUFDLENBQUEsSUFBSSxDQUFDLFdBQU4sQ0FBa0IsSUFBQyxDQUFBLElBQW5CLENBVEEsQ0FBQTtBQUFBLE1BV0EsSUFBQyxDQUFBLEdBQUQsR0FBTyxRQUFRLENBQUMsYUFBVCxDQUF1QixNQUF2QixDQVhQLENBQUE7QUFBQSxNQVlBLElBQUMsQ0FBQSxHQUFHLENBQUMsU0FBUyxDQUFDLEdBQWYsQ0FBbUIsY0FBbkIsQ0FaQSxDQUFBO0FBQUEsTUFhQSxJQUFDLENBQUEsSUFBSSxDQUFDLFdBQU4sQ0FBa0IsSUFBQyxDQUFBLEdBQW5CLENBYkEsQ0FBQTthQWVBLElBQUMsQ0FBQSxTQUFELENBQVcsaUJBQVgsRUFoQkk7SUFBQSxDQUFOLENBQUE7O0FBQUEsZ0NBa0JBLElBQUEsR0FBTSxTQUFBLEdBQUE7QUFDSixNQUFBLElBQUMsQ0FBQSxTQUFTLENBQUMsR0FBWCxDQUFlLFlBQWYsRUFBNkIsY0FBN0IsQ0FBQSxDQUFBO2FBQ0EsSUFBQyxDQUFBLFNBQVMsQ0FBQyxNQUFYLENBQWtCLFlBQWxCLEVBQWdDLFFBQWhDLEVBRkk7SUFBQSxDQWxCTixDQUFBOztBQUFBLGdDQXNCQSxJQUFBLEdBQU0sU0FBQSxHQUFBO0FBQ0osTUFBQSxJQUFDLENBQUEsU0FBUyxDQUFDLE1BQVgsQ0FBa0IsWUFBbEIsRUFBZ0MsY0FBaEMsQ0FBQSxDQUFBO2FBQ0EsSUFBQyxDQUFBLFNBQVMsQ0FBQyxHQUFYLENBQWUsWUFBZixFQUE2QixRQUE3QixFQUZJO0lBQUEsQ0F0Qk4sQ0FBQTs7QUFBQSxnQ0EwQkEsT0FBQSxHQUFTLFNBQUEsR0FBQTtBQUNQLFVBQUEsSUFBQTs7WUFBUSxDQUFFLE9BQVYsQ0FBQTtPQUFBO2FBQ0EsSUFBQyxDQUFBLFNBQUQsR0FBYSxHQUZOO0lBQUEsQ0ExQlQsQ0FBQTs7QUFBQSxnQ0E4QkEsU0FBQSxHQUFXLFNBQUMsT0FBRCxHQUFBO0FBQ1QsVUFBQSxJQUFBOzZDQUFJLENBQUUsV0FBTixHQUFvQixPQUFBLElBQVcsWUFEdEI7SUFBQSxDQTlCWCxDQUFBOztBQUFBLGdDQWlDQSxRQUFBLEdBQVUsU0FBQyxJQUFELEdBQUE7QUFDUixVQUFBLElBQUE7O1lBQVEsQ0FBRSxPQUFWLENBQUE7T0FBQTthQUNBLElBQUMsQ0FBQSxPQUFELEdBQVcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLElBQWxCLEVBQ1Q7QUFBQSxRQUFBLEtBQUEsRUFBTyxJQUFQO09BRFMsRUFGSDtJQUFBLENBakNWLENBQUE7OzZCQUFBOztLQUY4QixZQVZoQyxDQUFBOztBQUFBLEVBa0RBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFFBQVEsQ0FBQyxlQUFULENBQXlCLFlBQXpCLEVBQXVDO0FBQUEsSUFBQSxTQUFBLEVBQVcsaUJBQWlCLENBQUMsU0FBN0I7QUFBQSxJQUF3QyxTQUFBLEVBQVMsS0FBakQ7R0FBdkMsQ0FsRGpCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/home/cin_chalic/.atom/packages/wakatime/lib/status-bar-tile-view.coffee
