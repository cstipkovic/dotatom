(function() {
  var CompositeDisposable, IndentationIndicator, IndentationIndicatorView;

  CompositeDisposable = require('atom').CompositeDisposable;

  IndentationIndicatorView = require('./indentation-indicator-view');

  IndentationIndicator = (function() {
    function IndentationIndicator() {}

    IndentationIndicator.prototype.config = {
      spaceAfterColon: {
        type: 'boolean',
        "default": false
      },
      indicatorPosition: {
        type: 'string',
        "default": 'left',
        "enum": ['left', 'right']
      }
    };

    IndentationIndicator.prototype.view = null;

    IndentationIndicator.prototype.activate = function() {
      return this.observeEvents();
    };

    IndentationIndicator.prototype.consumeStatusBar = function(statusBar) {
      this.statusBar = statusBar;
      return this.updateTile();
    };

    IndentationIndicator.prototype.deactivate = function() {
      var _ref;
      if ((_ref = this.subscriptions) != null) {
        _ref.dispose();
      }
      return this.destroyTile();
    };

    IndentationIndicator.prototype.destroyTile = function() {
      var _ref, _ref1;
      if ((_ref = this.view) != null) {
        _ref.destroy();
      }
      this.view = null;
      if ((_ref1 = this.tile) != null) {
        _ref1.destroy();
      }
      return this.tile = null;
    };

    IndentationIndicator.prototype.observeEvents = function() {
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          var disposable;
          disposable = editor.onDidChangeGrammar(function() {
            var _ref;
            return (_ref = _this.view) != null ? _ref.update() : void 0;
          });
          return editor.onDidDestroy(function() {
            return disposable.dispose();
          });
        };
      })(this)));
      return this.subscriptions.add(atom.config.onDidChange('indentation-indicator.indicatorPosition', (function(_this) {
        return function() {
          _this.destroyTile();
          return _this.updateTile();
        };
      })(this)));
    };

    IndentationIndicator.prototype.updateTile = function() {
      var priority;
      priority = 100;
      this.view = new IndentationIndicatorView;
      this.view.initialize(this.statusBar);
      if (atom.config.get('indentation-indicator.indicatorPosition') === 'right') {
        return this.tile = this.statusBar.addRightTile({
          item: this.view,
          priority: priority
        });
      } else {
        return this.tile = this.statusBar.addLeftTile({
          item: this.view,
          priority: priority
        });
      }
    };

    return IndentationIndicator;

  })();

  module.exports = new IndentationIndicator;

}).call(this);
