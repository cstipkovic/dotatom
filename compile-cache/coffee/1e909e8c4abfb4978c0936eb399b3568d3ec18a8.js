(function() {
  var ReferenceView,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  ReferenceView = (function(_super) {
    __extends(ReferenceView, _super);

    function ReferenceView() {
      return ReferenceView.__super__.constructor.apply(this, arguments);
    }

    ReferenceView.prototype.createdCallback = function() {
      var container;
      this.classList.add('atom-ternjs-reference');
      container = document.createElement('div');
      this.content = document.createElement('div');
      this.close = document.createElement('button');
      this.close.classList.add('btn', 'atom-ternjs-reference-close');
      this.close.innerHTML = 'Close';
      container.appendChild(this.close);
      container.appendChild(this.content);
      return this.appendChild(container);
    };

    ReferenceView.prototype.initialize = function(model) {
      this.setModel(model);
      return this;
    };

    ReferenceView.prototype.clickHandle = function(i) {
      return this.model.goToReference(i);
    };

    ReferenceView.prototype.buildItems = function(data) {
      var headline, i, item, li, list, _i, _len, _ref;
      this.content.innerHTML = '';
      headline = document.createElement('h2');
      headline.innerHTML = data.name + (" (" + data.type + ")");
      this.content.appendChild(headline);
      list = document.createElement('ul');
      _ref = data.refs;
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        item = _ref[i];
        li = document.createElement('li');
        li.innerHTML = "<h3><span><span class=\"darken\">(" + (item.position.row + 1) + ":" + item.position.column + "):</span> <span>" + item.lineText + "</span></span> <span class=\"darken\">(" + item.file + ")</span><div class=\"clear\"></div></h3>";
        li.addEventListener('click', this.clickHandle.bind(this, i), false);
        list.appendChild(li);
      }
      return this.content.appendChild(list);
    };

    ReferenceView.prototype.destroy = function() {
      return this.remove();
    };

    ReferenceView.prototype.getClose = function() {
      return this.close;
    };

    ReferenceView.prototype.getModel = function() {
      return this.model;
    };

    ReferenceView.prototype.setModel = function(model) {
      return this.model = model;
    };

    return ReferenceView;

  })(HTMLElement);

  module.exports = document.registerElement('atom-ternjs-reference', {
    prototype: ReferenceView.prototype
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2luX2NoYWxpYy8uYXRvbS9wYWNrYWdlcy9hdG9tLXRlcm5qcy9saWIvYXRvbS10ZXJuanMtcmVmZXJlbmNlLXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGFBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFNO0FBRUosb0NBQUEsQ0FBQTs7OztLQUFBOztBQUFBLDRCQUFBLGVBQUEsR0FBaUIsU0FBQSxHQUFBO0FBQ2YsVUFBQSxTQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsU0FBUyxDQUFDLEdBQVgsQ0FBZSx1QkFBZixDQUFBLENBQUE7QUFBQSxNQUNBLFNBQUEsR0FBWSxRQUFRLENBQUMsYUFBVCxDQUF1QixLQUF2QixDQURaLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxPQUFELEdBQVcsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsS0FBdkIsQ0FGWCxDQUFBO0FBQUEsTUFHQSxJQUFDLENBQUEsS0FBRCxHQUFTLFFBQVEsQ0FBQyxhQUFULENBQXVCLFFBQXZCLENBSFQsQ0FBQTtBQUFBLE1BSUEsSUFBQyxDQUFBLEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBakIsQ0FBcUIsS0FBckIsRUFBNEIsNkJBQTVCLENBSkEsQ0FBQTtBQUFBLE1BS0EsSUFBQyxDQUFBLEtBQUssQ0FBQyxTQUFQLEdBQW1CLE9BTG5CLENBQUE7QUFBQSxNQU1BLFNBQVMsQ0FBQyxXQUFWLENBQXNCLElBQUMsQ0FBQSxLQUF2QixDQU5BLENBQUE7QUFBQSxNQU9BLFNBQVMsQ0FBQyxXQUFWLENBQXNCLElBQUMsQ0FBQSxPQUF2QixDQVBBLENBQUE7YUFRQSxJQUFDLENBQUEsV0FBRCxDQUFhLFNBQWIsRUFUZTtJQUFBLENBQWpCLENBQUE7O0FBQUEsNEJBV0EsVUFBQSxHQUFZLFNBQUMsS0FBRCxHQUFBO0FBQ1YsTUFBQSxJQUFD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

//# sourceURL=/home/cin_chalic/.atom/packages/atom-ternjs/lib/atom-ternjs-reference-view.coffee
