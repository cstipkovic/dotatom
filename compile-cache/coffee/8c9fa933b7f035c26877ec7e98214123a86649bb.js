(function() {
  var CompositeDisposable, ConfigSchema, isOpeningTagLikePattern,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  isOpeningTagLikePattern = /<(?![\!\/])([a-z]{1}[^>\s=\'\"]*)[^>]*>$/i;

  ConfigSchema = require('./configuration.coffee');

  CompositeDisposable = require('atom').CompositeDisposable;

  module.exports = {
    config: ConfigSchema.config,
    neverClose: [],
    forceInline: [],
    forceBlock: [],
    makeNeverCloseSelfClosing: false,
    ignoreGrammar: false,
    legacyMode: false,
    activate: function() {
      this.autocloseHTMLEvents = new CompositeDisposable;
      atom.commands.add('atom-text-editor', {
        'autoclose-html:close-and-complete': (function(_this) {
          return function(e) {
            if (_this.legacyMode) {
              console.log(e);
              return e.abortKeyBinding();
            } else {
              atom.workspace.getActiveTextEditor().insertText(">");
              return _this.execAutoclose();
            }
          };
        })(this)
      });
      atom.config.observe('autoclose-html.neverClose', (function(_this) {
        return function(value) {
          return _this.neverClose = value;
        };
      })(this));
      atom.config.observe('autoclose-html.forceInline', (function(_this) {
        return function(value) {
          return _this.forceInline = value;
        };
      })(this));
      atom.config.observe('autoclose-html.forceBlock', (function(_this) {
        return function(value) {
          return _this.forceBlock = value;
        };
      })(this));
      atom.config.observe('autoclose-html.makeNeverCloseSelfClosing', (function(_this) {
        return function(value) {
          return _this.makeNeverCloseSelfClosing = value;
        };
      })(this));
      return atom.config.observe('autoclose-html.legacyMode', (function(_this) {
        return function(value) {
          _this.legacyMode = value;
          if (_this.legacyMode) {
            return _this._events();
          } else {
            return _this._unbindEvents();
          }
        };
      })(this));
    },
    deactivate: function() {
      if (this.legacyMode) {
        return this._unbindEvents();
      }
    },
    isInline: function(eleTag) {
      var ele, ret, _ref, _ref1, _ref2;
      if (this.forceInline.indexOf("*") > -1) {
        return true;
      }
      try {
        ele = document.createElement(eleTag);
      } catch (_error) {
        return false;
      }
      if (_ref = eleTag.toLowerCase(), __indexOf.call(this.forceBlock, _ref) >= 0) {
        return false;
      } else if (_ref1 = eleTag.toLowerCase(), __indexOf.call(this.forceInline, _ref1) >= 0) {
        return true;
      }
      document.body.appendChild(ele);
      ret = (_ref2 = window.getComputedStyle(ele).getPropertyValue('display')) === 'inline' || _ref2 === 'inline-block' || _ref2 === 'none';
      document.body.removeChild(ele);
      return ret;
    },
    isNeverClosed: function(eleTag) {
      var _ref;
      return _ref = eleTag.toLowerCase(), __indexOf.call(this.neverClose, _ref) >= 0;
    },
    execAutoclose: function() {
      var doubleQuotes, editor, eleTag, index, isInline, line, matches, oddDoubleQuotes, oddSingleQuotes, partial, range, singleQuotes, tag;
      editor = atom.workspace.getActiveTextEditor();
      range = editor.selections[0].getBufferRange();
      line = editor.buffer.getLines()[range.end.row];
      partial = line.substr(0, range.start.column);
      partial = partial.substr(partial.lastIndexOf('<'));
      if (partial.substr(partial.length - 1, 1) === '/') {
        return;
      }
      singleQuotes = partial.match(/\'/g);
      doubleQuotes = partial.match(/\"/g);
      oddSingleQuotes = singleQuotes && (singleQuotes.length % 2);
      oddDoubleQuotes = doubleQuotes && (doubleQuotes.length % 2);
      if (oddSingleQuotes || oddDoubleQuotes) {
        return;
      }
      index = -1;
      while ((index = partial.indexOf('"')) !== -1) {
        partial = partial.slice(0, index) + partial.slice(partial.indexOf('"', index + 1) + 1);
      }
      while ((index = partial.indexOf("'")) !== -1) {
        partial = partial.slice(0, index) + partial.slice(partial.indexOf("'", index + 1) + 1);
      }
      if ((matches = partial.match(isOpeningTagLikePattern)) == null) {
        return;
      }
      eleTag = matches[matches.length - 1];
      if (this.isNeverClosed(eleTag)) {
        if (this.makeNeverCloseSelfClosing) {
          tag = '/>';
          if (partial.substr(partial.length - 1, 1 !== ' ')) {
            tag = ' ' + tag;
          }
          editor.backspace();
          editor.insertText(tag);
        }
        return;
      }
      isInline = this.isInline(eleTag);
      if (!isInline) {
        editor.insertNewline();
        editor.insertNewline();
      }
      editor.insertText('</' + eleTag + '>');
      if (isInline) {
        return editor.setCursorBufferPosition(range.end);
      } else {
        editor.autoIndentBufferRow(range.end.row + 1);
        return editor.setCursorBufferPosition([range.end.row + 1, atom.workspace.getActivePaneItem().getTabText().length * atom.workspace.getActivePaneItem().indentationForBufferRow(range.end.row + 1)]);
      }
    },
    _events: function() {
      return atom.workspace.observeTextEditors((function(_this) {
        return function(textEditor) {
          return textEditor.observeGrammar(function(grammar) {
            if (textEditor.autocloseHTMLbufferEvent != null) {
              textEditor.autocloseHTMLbufferEvent.dispose();
            }
            if (atom.views.getView(textEditor).getAttribute('data-grammar').split(' ').indexOf('html') > -1) {
              textEditor.autocloseHTMLbufferEvent = textEditor.buffer.onDidChange(function(e) {
                if ((e != null ? e.newText : void 0) === '>' && textEditor === atom.workspace.getActiveTextEditor()) {
                  return setTimeout(function() {
                    return _this.execAutoclose();
                  });
                }
              });
              return _this.autocloseHTMLEvents.add(textEditor.autocloseHTMLbufferEvent);
            }
          });
        };
      })(this));
    },
    _unbindEvents: function() {
      return this.autocloseHTMLEvents.dispose();
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2luX2NoYWxpYy8uYXRvbS9wYWNrYWdlcy9hdXRvY2xvc2UtaHRtbC9saWIvYXV0b2Nsb3NlLWh0bWwuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDBEQUFBO0lBQUEscUpBQUE7O0FBQUEsRUFBQSx1QkFBQSxHQUEwQiwyQ0FBMUIsQ0FBQTs7QUFBQSxFQUVBLFlBQUEsR0FBZSxPQUFBLENBQVEsd0JBQVIsQ0FGZixDQUFBOztBQUFBLEVBR0Msc0JBQXVCLE9BQUEsQ0FBUSxNQUFSLEVBQXZCLG1CQUhELENBQUE7O0FBQUEsRUFLQSxNQUFNLENBQUMsT0FBUCxHQUNJO0FBQUEsSUFBQSxNQUFBLEVBQVEsWUFBWSxDQUFDLE1BQXJCO0FBQUEsSUFFQSxVQUFBLEVBQVcsRUFGWDtBQUFBLElBR0EsV0FBQSxFQUFhLEVBSGI7QUFBQSxJQUlBLFVBQUEsRUFBWSxFQUpaO0FBQUEsSUFLQSx5QkFBQSxFQUEyQixLQUwzQjtBQUFBLElBTUEsYUFBQSxFQUFlLEtBTmY7QUFBQSxJQU9BLFVBQUEsRUFBWSxLQVBaO0FBQUEsSUFTQSxRQUFBLEVBQVUsU0FBQSxHQUFBO0FBRU4sTUFBQSxJQUFDLENBQUEsbUJBQUQsR0FBdUIsR0FBQSxDQUFBLG1CQUF2QixDQUFBO0FBQUEsTUFFQSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0Isa0JBQWxCLEVBQ0k7QUFBQSxRQUFBLG1DQUFBLEVBQXFDLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQyxDQUFELEdBQUE7QUFDakMsWUFBQSxJQUFHLEtBQUMsQ0FBQSxVQUFKO0FBQ0ksY0FBQSxPQUFPLENBQUMsR0FBUixDQUFZLENBQVosQ0FBQSxDQUFBO3FCQUNBLENBQUMsQ0FBQyxlQUFGLENBQUEsRUFGSjthQUFBLE1BQUE7QUFJSSxjQUFBLElBQUksQ0FB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

//# sourceURL=/home/cin_chalic/.atom/packages/autoclose-html/lib/autoclose-html.coffee
