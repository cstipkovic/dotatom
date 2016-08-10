(function() {
  var TypeView,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  TypeView = (function(_super) {
    __extends(TypeView, _super);

    function TypeView() {
      return TypeView.__super__.constructor.apply(this, arguments);
    }

    TypeView.prototype.createdCallback = function() {
      this.getModel();
      this.addEventListener('click', (function(_this) {
        return function() {
          return _this.getModel().destroyOverlay();
        };
      })(this), false);
      this.container = document.createElement('div');
      return this.appendChild(this.container);
    };

    TypeView.prototype.initialize = function(model) {
      this.setModel(model);
      return this;
    };

    TypeView.prototype.getModel = function() {
      return this.model;
    };

    TypeView.prototype.setModel = function(model) {
      return this.model = model;
    };

    TypeView.prototype.setData = function(data) {
      return this.container.innerHTML = data.label;
    };

    TypeView.prototype.destroy = function() {
      return this.remove();
    };

    return TypeView;

  })(HTMLElement);

  module.exports = document.registerElement('atom-ternjs-type', {
    prototype: TypeView.prototype
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2luX2NoYWxpYy8uYXRvbS9wYWNrYWdlcy9hdG9tLXRlcm5qcy9saWIvYXRvbS10ZXJuanMtdHlwZS12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxRQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBTTtBQUVKLCtCQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSx1QkFBQSxlQUFBLEdBQWlCLFNBQUEsR0FBQTtBQUNmLE1BQUEsSUFBQyxDQUFBLFFBQUQsQ0FBQSxDQUFBLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxnQkFBRCxDQUFrQixPQUFsQixFQUEyQixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUN6QixLQUFDLENBQUEsUUFBRCxDQUFBLENBQVcsQ0FBQyxjQUFaLENBQUEsRUFEeUI7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUEzQixFQUVFLEtBRkYsQ0FEQSxDQUFBO0FBQUEsTUFJQSxJQUFDLENBQUEsU0FBRCxHQUFhLFFBQVEsQ0FBQyxhQUFULENBQXVCLEtBQXZCLENBSmIsQ0FBQTthQUtBLElBQUMsQ0FBQSxXQUFELENBQWEsSUFBQyxDQUFBLFNBQWQsRUFOZTtJQUFBLENBQWpCLENBQUE7O0FBQUEsdUJBUUEsVUFBQSxHQUFZLFNBQUMsS0FBRCxHQUFBO0FBQ1YsTUFBQSxJQUFDLENBQUEsUUFBRCxDQUFVLEtBQVYsQ0FBQSxDQUFBO2FBQ0EsS0FGVTtJQUFBLENBUlosQ0FBQTs7QUFBQSx1QkFZQSxRQUFBLEdBQVUsU0FBQSxHQUFBO2FBQ1IsSUFBQyxDQUFBLE1BRE87SUFBQSxDQVpWLENBQUE7O0FBQUEsdUJBZUEsUUFBQSxHQUFVLFNBQUMsS0FBRCxHQUFBO2FBQ1IsSUFBQyxDQUFBLEtBQUQsR0FBUyxNQUREO0lBQUEsQ0FmVixDQUFBOztBQUFBLHVCQWtCQSxPQUFBLEdBQVMsU0FBQyxJQUFELEdBQUE7YUFDUCxJQUFDLENBQUEsU0FBUyxDQUFDLFNBQVgsR0FBdUIsSUFBSSxDQUFDLE1BRHJCO0lBQUEsQ0FsQlQsQ0FBQTs7QUFBQSx1QkFxQkEsT0FBQSxHQUFTLFNBQUEsR0FBQTthQUNQLElBQUMsQ0FBQSxNQUFELENBQUEsRUFETztJQUFBLENBckJULENBQUE7O29CQUFBOztLQUZxQixZQUF2QixDQUFBOztBQUFBLEVBMEJBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFFBQVEsQ0FBQyxlQUFULENBQXlCLGtCQUF6QixFQUE2QztBQUFBLElBQUEsU0FBQSxFQUFXLFFBQVEsQ0FBQyxTQUFwQjtHQUE3QyxDQTFCakIsQ0FBQTtBQUFBIgp9

//# sourceURL=/home/cin_chalic/.atom/packages/atom-ternjs/lib/atom-ternjs-type-view.coffee
