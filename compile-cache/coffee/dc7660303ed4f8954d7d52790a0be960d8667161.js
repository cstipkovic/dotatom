(function() {
  var LocationSelectList, SelectListView, path,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  SelectListView = require('atom-space-pen-views').SelectListView;

  path = require('path');

  module.exports = LocationSelectList = (function(_super) {
    __extends(LocationSelectList, _super);

    function LocationSelectList() {
      return LocationSelectList.__super__.constructor.apply(this, arguments);
    }

    LocationSelectList.prototype.initialize = function(editor, callback) {
      LocationSelectList.__super__.initialize.apply(this, arguments);
      this.addClass('overlay from-top');
      this.editor = editor;
      this.callback = callback;
      this.storeFocusedElement();
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.panel.show();
      return this.focusFilterEditor();
    };

    LocationSelectList.prototype.viewForItem = function(item) {
      var f;
      if (item[0] === '<stdin>') {
        return "<li class=\"event\">" + item[1] + ":" + item[2] + "</li>";
      } else {
        f = path.join(item[0]);
        return "<li class=\"event\">" + f + "  " + item[1] + ":" + item[2] + "</li>";
      }
    };

    LocationSelectList.prototype.hide = function() {
      var _ref;
      return (_ref = this.panel) != null ? _ref.hide() : void 0;
    };

    LocationSelectList.prototype.show = function() {
      this.storeFocusedElement();
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.panel.show();
      return this.focusFilterEditor();
    };

    LocationSelectList.prototype.toggle = function() {
      var _ref;
      if ((_ref = this.panel) != null ? _ref.isVisible() : void 0) {
        return this.cancel();
      } else {
        return this.show();
      }
    };

    LocationSelectList.prototype.confirmed = function(item) {
      this.cancel();
      return this.callback(this.editor, item);
    };

    LocationSelectList.prototype.cancelled = function() {
      return this.hide();
    };

    return LocationSelectList;

  })(SelectListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2luX2NoYWxpYy8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtY2xhbmcvbGliL2xvY2F0aW9uLXNlbGVjdC12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx3Q0FBQTtJQUFBO21TQUFBOztBQUFBLEVBQUMsaUJBQWtCLE9BQUEsQ0FBUSxzQkFBUixFQUFsQixjQUFELENBQUE7O0FBQUEsRUFDQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FEUCxDQUFBOztBQUFBLEVBR0EsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLHlDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxpQ0FBQSxVQUFBLEdBQVksU0FBQyxNQUFELEVBQVMsUUFBVCxHQUFBO0FBQ1YsTUFBQSxvREFBQSxTQUFBLENBQUEsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLFFBQUQsQ0FBVSxrQkFBVixDQURBLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxNQUFELEdBQVUsTUFGVixDQUFBO0FBQUEsTUFHQSxJQUFDLENBQUEsUUFBRCxHQUFZLFFBSFosQ0FBQTtBQUFBLE1BSUEsSUFBQyxDQUFBLG1CQUFELENBQUEsQ0FKQSxDQUFBOztRQUtBLElBQUMsQ0FBQSxRQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBZixDQUE2QjtBQUFBLFVBQUEsSUFBQSxFQUFNLElBQU47U0FBN0I7T0FMVjtBQUFBLE1BTUEsSUFBQyxDQUFBLEtBQUssQ0FBQyxJQUFQLENBQUEsQ0FOQSxDQUFBO2FBT0EsSUFBQyxDQUFBLGlCQUFELENBQUEsRUFSVTtJQUFBLENBQVosQ0FBQTs7QUFBQSxpQ0FVQSxXQUFBLEdBQWEsU0FBQyxJQUFELEdBQUE7QUFDWCxVQUFBLENBQUE7QUFBQSxNQUFBLElBQUcsSUFBSyxDQUFBLENBQUEsQ0FBTCxLQUFXLFNBQWQ7ZUFDRyxzQkFBQSxHQUFzQixJQUFLLENBQUEsQ0FBQSxDQUEzQixHQUE4QixHQUE5QixHQUFpQyxJQUFLLENBQUEsQ0FBQSxDQUF0QyxHQUF5QyxRQUQ1QztPQUFBLE1BQUE7QUFHRSxRQUFBLENBQUEsR0FBSSxJQUFJLENBQUMsSUFBTCxDQUFVLElBQUssQ0FBQSxDQUFBLENBQWYsQ0FBSixDQUFBO2VBQ0Msc0JBQUEsR0FBc0IsQ0FBdEIsR0FBd0IsSUFBeEIsR0FBNEIsSUFBSyxDQUFBLENBQUEsQ0FBakMsR0FBb0MsR0FBcEMsR0FBdUMsSUFBSyxDQUFBLENBQUEsQ0FBNUMsR0FBK0MsUUFKbEQ7T0FEVztJQUFBLENBVmIsQ0FBQTs7QUFBQSxpQ0FpQkEsSUFBQSxHQUFNLFNBQUEsR0FBQTtBQUFHLFVBQUEsSUFBQTsrQ0FBTSxDQUFFLElBQVIsQ0FBQSxXQUFIO0lBQUEsQ0FqQk4sQ0FBQTs7QUFBQSxpQ0FtQkEsSUFBQSxHQUFNLFNBQUEsR0FBQTtBQUNKLE1BQUEsSUFBQyxDQUFBLG1CQUFELENBQUEsQ0FBQSxDQUFBOztRQUNBLElBQUMsQ0FBQSxRQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBZixDQUE2QjtBQUFBLFVBQUEsSUFBQSxFQUFNLElBQU47U0FBN0I7T0FEVjtBQUFBLE1BRUEsSUFBQyxDQUFBLEtBQUssQ0FBQyxJQUFQLENBQUEsQ0FGQSxDQUFBO2FBR0EsSUFBQyxDQUFBLGlCQUFELENBQUEsRUFKSTtJQUFBLENBbkJOLENBQUE7O0FBQUEsaUNBeUJBLE1BQUEsR0FBUSxTQUFBLEdBQUE7QUFDTixVQUFBLElBQUE7QUFBQSxNQUFBLHNDQUFTLENBQUUsU0FBUixDQUFBLFVBQUg7ZUFDRSxJQUFDLENBQUEsTUFBRCxDQUFBLEVBREY7T0FBQSxNQUFBO2VBR0UsSUFBQyxDQUFBLElBQUQsQ0FBQSxFQUhGO09BRE07SUFBQSxDQXpCUixDQUFBOztBQUFBLGlDQStCQSxTQUFBLEdBQVcsU0FBQyxJQUFELEdBQUE7QUFDVCxNQUFBLElBQUMsQ0FBQSxNQUFELENBQUEsQ0FBQSxDQUFBO2FBQ0EsSUFBQyxDQUFBLFFBQUQsQ0FBVSxJQUFDLENBQUEsTUFBWCxFQUFtQixJQUFuQixFQUZTO0lBQUEsQ0EvQlgsQ0FBQTs7QUFBQSxpQ0FtQ0EsU0FBQSxHQUFXLFNBQUEsR0FBQTthQUNULElBQUMsQ0FBQSxJQUFELENBQUEsRUFEUztJQUFBLENBbkNYLENBQUE7OzhCQUFBOztLQUQrQixlQUpqQyxDQUFBO0FBQUEiCn0=

//# sourceURL=/home/cin_chalic/.atom/packages/autocomplete-clang/lib/location-select-view.coffee
