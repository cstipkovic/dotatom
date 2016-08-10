(function() {
  var IndentationIndicatorView,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  IndentationIndicatorView = (function(_super) {
    __extends(IndentationIndicatorView, _super);

    function IndentationIndicatorView() {
      return IndentationIndicatorView.__super__.constructor.apply(this, arguments);
    }

    IndentationIndicatorView.prototype.initialize = function(statusBar) {
      this.statusBar = statusBar;
      this.classList.add('indentation-indicator', 'inline-block');
      this.activeItemSubscription = atom.workspace.onDidChangeActivePaneItem((function(_this) {
        return function() {
          return _this.update();
        };
      })(this));
      return this.update();
    };

    IndentationIndicatorView.prototype.destroy = function() {
      return this.activeItemSubscription.dispose();
    };

    IndentationIndicatorView.prototype.update = function() {
      var editor;
      editor = atom.workspace.getActiveTextEditor();
      if (editor) {
        return this.textContent = this.formatText(editor.getSoftTabs(), editor.getTabLength());
      } else {
        return this.textContent = '';
      }
    };

    IndentationIndicatorView.prototype.formatText = function(softTabs, length) {
      var space, type;
      type = softTabs ? 'Spaces' : 'Tabs';
      space = atom.config.get('indentation-indicator.spaceAfterColon') ? ' ' : '';
      return "" + type + ":" + space + length;
    };

    return IndentationIndicatorView;

  })(HTMLElement);

  module.exports = document.registerElement('status-bar-indentation', {
    prototype: IndentationIndicatorView.prototype,
    "extends": 'div'
  });

}).call(this);
