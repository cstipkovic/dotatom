(function() {
  var $;

  $ = require('jquery');

  module.exports = {
    config: {
      fullscreen: {
        type: 'boolean',
        "default": true,
        order: 1
      },
      softWrap: {
        description: 'Enables / Disables soft wrapping when Zen is active.',
        type: 'boolean',
        "default": atom.config.get('editor.softWrap'),
        order: 2
      },
      gutter: {
        description: 'Shows / Hides the gutter when Zen is active.',
        type: 'boolean',
        "default": false,
        order: 3
      },
      typewriter: {
        description: 'Keeps the cursor vertically centered where possible.',
        type: 'boolean',
        "default": false,
        order: 4
      },
      minimap: {
        description: 'Enables / Disables the minimap plugin when Zen is active.',
        type: 'boolean',
        "default": false,
        order: 5
      },
      width: {
        type: 'integer',
        "default": atom.config.get('editor.preferredLineLength'),
        order: 6
      },
      tabs: {
        description: 'Determines the tab style used while Zen is active.',
        type: 'string',
        "default": 'hidden',
        "enum": ['hidden', 'single', 'multiple'],
        order: 7
      },
      showWordCount: {
        description: 'Show the word-count if you have the package installed.',
        type: 'string',
        "default": 'Hidden',
        "enum": ['Hidden', 'Left', 'Right'],
        order: 8
      }
    },
    activate: function(state) {
      return atom.commands.add('atom-workspace', 'zen:toggle', (function(_this) {
        return function() {
          return _this.toggle();
        };
      })(this));
    },
    toggle: function() {
      var body, editor, fullscreen, minimap, panel, panels, softWrap, width, _ref, _ref1, _ref2, _ref3;
      body = document.querySelector('body');
      editor = atom.workspace.getActiveTextEditor();
      fullscreen = atom.config.get('Zen.fullscreen');
      width = atom.config.get('Zen.width');
      softWrap = atom.config.get('Zen.softWrap');
      minimap = atom.config.get('Zen.minimap');
      panels = atom.workspace.getLeftPanels();
      panel = panels[0];
      if (body.getAttribute('data-zen') !== 'true') {
        if (editor === void 0) {
          atom.notifications.addInfo('Zen cannot be achieved in this view.');
          return;
        }
        if (atom.config.get('Zen.tabs')) {
          body.setAttribute('data-zen-tabs', atom.config.get('Zen.tabs'));
        }
        switch (atom.config.get('Zen.showWordCount')) {
          case 'Left':
            body.setAttribute('data-zen-word-count', 'visible');
            body.setAttribute('data-zen-word-count-position', 'left');
            break;
          case 'Right':
            body.setAttribute('data-zen-word-count', 'visible');
            body.setAttribute('data-zen-word-count-position', 'right');
            break;
          case 'Hidden':
            body.setAttribute('data-zen-word-count', 'hidden');
        }
        body.setAttribute('data-zen-gutter', atom.config.get('Zen.gutter'));
        body.setAttribute('data-zen', 'true');
        if (editor.isSoftWrapped() !== softWrap) {
          editor.setSoftWrapped(softWrap);
          this.unSoftWrap = true;
        }
        requestAnimationFrame(function() {
          return $('atom-text-editor:not(.mini)').css('width', editor.getDefaultCharWidth() * width);
        });
        this.fontChanged = atom.config.onDidChange('editor.fontSize', function() {
          return requestAnimationFrame(function() {
            return $('atom-text-editor:not(.mini)').css('width', editor.getDefaultCharWidth() * width);
          });
        });
        this.paneChanged = atom.workspace.onDidChangeActivePaneItem(function() {
          return requestAnimationFrame(function() {
            return $('atom-text-editor:not(.mini)').css('width', editor.getDefaultCharWidth() * width);
          });
        });
        if (atom.config.get('Zen.typewriter')) {
          if (!atom.config.get('editor.scrollPastEnd')) {
            atom.config.set('editor.scrollPastEnd', true);
            this.scrollPastEndReset = true;
          } else {
            this.scrollPastEndReset = false;
          }
          this.lineChanged = editor.onDidChangeCursorPosition(function() {
            var cursor, halfScreen;
            halfScreen = Math.floor(editor.getRowsPerPage() / 2);
            cursor = editor.getCursorScreenPosition();
            return editor.setScrollTop(editor.getLineHeightInPixels() * (cursor.row - halfScreen));
          });
        }
        this.typewriterConfig = atom.config.observe('Zen.typewriter', (function(_this) {
          return function() {
            var _ref, _ref1;
            if (!atom.config.get('Zen.typewriter')) {
              if (_this.scrollPastEndReset) {
                _this.scrollPastEndReset = false;
                atom.config.set('editor.scrollPastEnd', false);
              }
              return (_ref = _this.lineChanged) != null ? _ref.dispose() : void 0;
            } else {
              if (!atom.config.get('editor.scrollPastEnd')) {
                if (!_this.scrollPastEndReset) {
                  atom.config.set('editor.scrollPastEnd', true);
                }
                _this.scrollPastEndReset = true;
              } else {
                _this.scrollPastEndReset = false;
              }
              if ((_ref1 = _this.lineChanged) != null) {
                _ref1.dispose();
              }
              return _this.lineChanged = editor.onDidChangeCursorPosition(function() {
                var cursor, halfScreen;
                halfScreen = Math.floor(editor.getRowsPerPage() / 2);
                cursor = editor.getCursorScreenPosition();
                return editor.setScrollTop(editor.getLineHeightInPixels() * (cursor.row - halfScreen));
              });
            }
          };
        })(this));
        if ($('.nuclide-file-tree').length) {
          if (panel.isVisible()) {
            atom.commands.dispatch(atom.views.getView(atom.workspace), 'nuclide-file-tree:toggle');
            this.restoreTree = true;
          }
        } else if ($('.tree-view').length) {
          atom.commands.dispatch(atom.views.getView(atom.workspace), 'tree-view:toggle');
          this.restoreTree = true;
        }
        if ($('atom-text-editor /deep/ atom-text-editor-minimap').length && !minimap) {
          atom.commands.dispatch(atom.views.getView(atom.workspace), 'minimap:toggle');
          this.restoreMinimap = true;
        }
        if (fullscreen) {
          return atom.setFullScreen(true);
        }
      } else {
        body.setAttribute('data-zen', 'false');
        if (fullscreen) {
          atom.setFullScreen(false);
        }
        if (this.unSoftWrap && editor !== void 0) {
          editor.setSoftWrapped(atom.config.get('editor.softWrap'));
          this.unSoftWrap = null;
        }
        $('atom-text-editor:not(.mini)').css('width', '');
        $('.status-bar-right').css('overflow', 'hidden');
        requestAnimationFrame(function() {
          return $('.status-bar-right').css('overflow', '');
        });
        if (this.restoreTree) {
          if ($('.nuclide-file-tree').length) {
            if (!panel.isVisible()) {
              atom.commands.dispatch(atom.views.getView(atom.workspace), 'nuclide-file-tree:toggle');
            }
          } else {
            atom.commands.dispatch(atom.views.getView(atom.workspace), 'tree-view:show');
          }
          this.restoreTree = false;
        }
        if (this.restoreMinimap && $('atom-text-editor /deep/ atom-text-editor-minimap').length !== 1) {
          atom.commands.dispatch(atom.views.getView(atom.workspace), 'minimap:toggle');
          this.restoreMinimap = false;
        }
        if ((_ref = this.fontChanged) != null) {
          _ref.dispose();
        }
        if ((_ref1 = this.paneChanged) != null) {
          _ref1.dispose();
        }
        if ((_ref2 = this.lineChanged) != null) {
          _ref2.dispose();
        }
        if (this.scrollPastEndReset) {
          atom.config.set('editor.scrollPastEnd', false);
          this.scrollPastEndReset = false;
        }
        return (_ref3 = this.typewriterConfig) != null ? _ref3.dispose() : void 0;
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2luX2NoYWxpYy8uYXRvbS9wYWNrYWdlcy9aZW4vbGliL3plbi5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsQ0FBQTs7QUFBQSxFQUFBLENBQUEsR0FBSSxPQUFBLENBQVEsUUFBUixDQUFKLENBQUE7O0FBQUEsRUFJQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxNQUFBLEVBQ0U7QUFBQSxNQUFBLFVBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFNBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxJQURUO0FBQUEsUUFFQSxLQUFBLEVBQU8sQ0FGUDtPQURGO0FBQUEsTUFJQSxRQUFBLEVBQ0U7QUFBQSxRQUFBLFdBQUEsRUFBYSxzREFBYjtBQUFBLFFBQ0EsSUFBQSxFQUFNLFNBRE47QUFBQSxRQUVBLFNBQUEsRUFBUyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsaUJBQWhCLENBRlQ7QUFBQSxRQUdBLEtBQUEsRUFBTyxDQUhQO09BTEY7QUFBQSxNQVNBLE1BQUEsRUFDRTtBQUFBLFFBQUEsV0FBQSxFQUFhLDhDQUFiO0FBQUEsUUFDQSxJQUFBLEVBQU0sU0FETjtBQUFBLFFBRUEsU0FBQSxFQUFTLEtBRlQ7QUFBQSxRQUdBLEtBQUEsRUFBTyxDQUhQO09BVkY7QUFBQSxNQWNBLFVBQUEsRUFDRTtBQUFBLFFBQUEsV0FBQSxFQUFhLHNEQUFiO0FBQUEsUUFDQSxJQUFBLEVBQU0sU0FETjtBQUFBLFFBRUEsU0FBQSxFQUFTLEtBRlQ7QUFBQSxRQUdBLEtBQUEsRUFBTyxDQUhQO09BZkY7QUFBQSxNQW1CQSxPQUFBLEVBQ0U7QUFBQSxRQUFBLFdBQUEsRUFBYSwyREFBYjtBQUFBLFFBQ0EsSUFBQSxFQUFNLFNBRE47QUFBQSxRQUVBLFNBQUEsRUFBUyxLQUZUO0FBQUEsUUFHQSxL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

//# sourceURL=/home/cin_chalic/.atom/packages/Zen/lib/zen.coffee
