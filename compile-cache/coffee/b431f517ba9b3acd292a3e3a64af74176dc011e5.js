(function() {
  var RenameView,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  RenameView = (function(_super) {
    __extends(RenameView, _super);

    function RenameView() {
      return RenameView.__super__.constructor.apply(this, arguments);
    }

    RenameView.prototype.createdCallback = function() {
      var buttonClose, buttonRename, container, sub, title, wrapper;
      this.classList.add('atom-ternjs-rename');
      container = document.createElement('div');
      wrapper = document.createElement('div');
      title = document.createElement('h1');
      title.innerHTML = 'Rename';
      sub = document.createElement('h2');
      sub.innerHTML = 'Rename a variable in a scope-aware way. (experimental)';
      buttonClose = document.createElement('button');
      buttonClose.innerHTML = 'Close';
      buttonClose.id = 'close';
      buttonClose.classList.add('btn');
      buttonClose.classList.add('atom-ternjs-rename-close');
      buttonClose.addEventListener('click', (function(_this) {
        return function(e) {
          _this.model.hide();
        };
      })(this));
      this.nameEditor = document.createElement('atom-text-editor');
      this.nameEditor.setAttribute('mini', true);
      this.nameEditor.addEventListener('core:confirm', (function(_this) {
        return function(e) {
          return _this.rename();
        };
      })(this));
      buttonRename = document.createElement('button');
      buttonRename.innerHTML = 'Rename';
      buttonRename.id = 'close';
      buttonRename.classList.add('btn');
      buttonRename.classList.add('mt');
      buttonRename.addEventListener('click', (function(_this) {
        return function(e) {
          return _this.rename();
        };
      })(this));
      wrapper.appendChild(title);
      wrapper.appendChild(sub);
      wrapper.appendChild(this.nameEditor);
      wrapper.appendChild(buttonClose);
      wrapper.appendChild(buttonRename);
      container.appendChild(wrapper);
      return this.appendChild(container);
    };

    RenameView.prototype.initialize = function(model) {
      this.setModel(model);
      return this;
    };

    RenameView.prototype.getModel = function() {
      return this.model;
    };

    RenameView.prototype.setModel = function(model) {
      return this.model = model;
    };

    RenameView.prototype.rename = function() {
      var text;
      text = this.nameEditor.getModel().getBuffer().getText();
      if (!text) {
        return;
      }
      return this.model.updateAllAndRename(text);
    };

    RenameView.prototype.destroy = function() {
      return this.remove();
    };

    return RenameView;

  })(HTMLElement);

  module.exports = document.registerElement('atom-ternjs-rename', {
    prototype: RenameView.prototype
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2luX2NoYWxpYy8uYXRvbS9wYWNrYWdlcy9hdG9tLXRlcm5qcy9saWIvYXRvbS10ZXJuanMtcmVuYW1lLXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLFVBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFNO0FBRUosaUNBQUEsQ0FBQTs7OztLQUFBOztBQUFBLHlCQUFBLGVBQUEsR0FBaUIsU0FBQSxHQUFBO0FBRWYsVUFBQSx5REFBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLFNBQVMsQ0FBQyxHQUFYLENBQWUsb0JBQWYsQ0FBQSxDQUFBO0FBQUEsTUFFQSxTQUFBLEdBQVksUUFBUSxDQUFDLGFBQVQsQ0FBdUIsS0FBdkIsQ0FGWixDQUFBO0FBQUEsTUFHQSxPQUFBLEdBQVUsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsS0FBdkIsQ0FIVixDQUFBO0FBQUEsTUFLQSxLQUFBLEdBQVEsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsSUFBdkIsQ0FMUixDQUFBO0FBQUEsTUFNQSxLQUFLLENBQUMsU0FBTixHQUFrQixRQU5sQixDQUFBO0FBQUEsTUFRQSxHQUFBLEdBQU0sUUFBUSxDQUFDLGFBQVQsQ0FBdUIsSUFBdkIsQ0FSTixDQUFBO0FBQUEsTUFTQSxHQUFHLENBQUMsU0FBSixHQUFnQix3REFUaEIsQ0FBQTtBQUFBLE1BV0EsV0FBQSxHQUFjLFFBQVEsQ0FBQyxhQUFULENBQXVCLFFBQXZCLENBWGQsQ0FBQTtBQUFBLE1BWUEsV0FBVyxDQUFDLFNBQVosR0FBd0IsT0FaeEIsQ0FBQTtBQUFBLE1BYUEsV0FBVyxDQUFDLEVBQVosR0FBaUIsT0FiakIsQ0FBQTtBQUFBLE1BY0EsV0FBVyxDQUFDLFNBQVMsQ0FBQyxHQUF0QixDQUEwQixLQUExQixDQWRBLENBQUE7QUFBQSxNQWVBLFdBQVcsQ0FBQyxTQUFTLENBQUMs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

//# sourceURL=/home/cin_chalic/.atom/packages/atom-ternjs/lib/atom-ternjs-rename-view.coffee
