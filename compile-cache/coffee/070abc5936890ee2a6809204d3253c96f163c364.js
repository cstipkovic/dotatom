(function() {
  var CompositeDisposable, ConfigSchema, defaultGrammars, isOpeningTagLikePattern,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  isOpeningTagLikePattern = /<(?![\!\/])([a-z]{1}[^>\s=\'\"]*)[^>]*$/i;

  defaultGrammars = ['HTML', 'HTML (Go)', 'HTML (Rails)', 'HTML (Angular)', 'HTML (Mustache)', 'HTML (Handlebars)', 'HTML (Ruby - ERB)', 'HTML (Jinja Templates)', 'Ember HTMLBars', 'JavaScript with JSX', 'PHP'];

  ConfigSchema = require('./configuration.coffee');

  CompositeDisposable = require('atom').CompositeDisposable;

  module.exports = {
    config: ConfigSchema.config,
    neverClose: [],
    forceInline: [],
    forceBlock: [],
    grammars: defaultGrammars,
    makeNeverCloseSelfClosing: false,
    ignoreGrammar: false,
    activate: function() {
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
      atom.config.observe('autoclose-html.additionalGrammars', (function(_this) {
        return function(value) {
          if (__indexOf.call(value, '*') >= 0) {
            return _this.ignoreGrammar = true;
          } else {
            return _this.grammars = defaultGrammars.concat(value);
          }
        };
      })(this));
      atom.config.observe('autoclose-html.makeNeverCloseSelfClosing', (function(_this) {
        return function(value) {
          return _this.makeNeverCloseSelfClosing = value;
        };
      })(this));
      return this._events();
    },
    deactivate: function() {
      return this.autocloseHTMLEvents.dispose();
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
    execAutoclose: function(changedEvent, editor) {
      var doubleQuotes, eleTag, index, isInline, line, matches, oddDoubleQuotes, oddSingleQuotes, partial, singleQuotes;
      if ((changedEvent != null ? changedEvent.newText : void 0) === '>' && editor === atom.workspace.getActiveTextEditor()) {
        line = editor.buffer.getLines()[changedEvent.newRange.end.row];
        partial = line.substr(0, changedEvent.newRange.start.column);
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
            setTimeout(function() {
              var tag;
              tag = '/>';
              if (partial.substr(partial.length - 1, 1 !== ' ')) {
                tag = ' ' + tag;
              }
              editor.backspace();
              return editor.insertText(tag);
            });
          }
          return;
        }
        isInline = this.isInline(eleTag);
        return setTimeout(function() {
          if (!isInline) {
            editor.insertNewline();
            editor.insertNewline();
          }
          editor.insertText('</' + eleTag + '>');
          if (isInline) {
            return editor.setCursorBufferPosition(changedEvent.newRange.end);
          } else {
            editor.autoIndentBufferRow(changedEvent.newRange.end.row + 1);
            return editor.setCursorBufferPosition([changedEvent.newRange.end.row + 1, atom.workspace.getActivePaneItem().getTabText().length * atom.workspace.getActivePaneItem().indentationForBufferRow(changedEvent.newRange.end.row + 1)]);
          }
        });
      }
    },
    _events: function() {
      if (this.autocloseHTMLEvents == null) {
        this.autocloseHTMLEvents = new CompositeDisposable;
      }
      return atom.workspace.observeTextEditors((function(_this) {
        return function(textEditor) {
          return textEditor.observeGrammar(function(grammar) {
            var _ref, _ref1;
            if (typeof bufferEvent !== "undefined" && bufferEvent !== null) {
              textEditor.autocloseHTMLbufferEvent.dispose();
            }
            if (((_ref = grammar.name) != null ? _ref.length : void 0) > 0 && (_this.ignoreGrammar || (_ref1 = grammar.name, __indexOf.call(_this.grammars, _ref1) >= 0))) {
              return _this.autocloseHTMLEvents.add(textEditor.buffer.onDidChange(function(e) {
                return _this.execAutoclose(e, textEditor);
              }));
            }
          });
        };
      })(this));
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2luX2NoYWxpYy8uYXRvbS9wYWNrYWdlcy9hdXRvY2xvc2UtaHRtbC9saWIvYXV0b2Nsb3NlLWh0bWwuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDJFQUFBO0lBQUEscUpBQUE7O0FBQUEsRUFBQSx1QkFBQSxHQUEwQiwwQ0FBMUIsQ0FBQTs7QUFBQSxFQUNBLGVBQUEsR0FBa0IsQ0FBQyxNQUFELEVBQVMsV0FBVCxFQUFzQixjQUF0QixFQUFzQyxnQkFBdEMsRUFBd0QsaUJBQXhELEVBQTJFLG1CQUEzRSxFQUFnRyxtQkFBaEcsRUFBcUgsd0JBQXJILEVBQStJLGdCQUEvSSxFQUFpSyxxQkFBakssRUFBd0wsS0FBeEwsQ0FEbEIsQ0FBQTs7QUFBQSxFQUdBLFlBQUEsR0FBZSxPQUFBLENBQVEsd0JBQVIsQ0FIZixDQUFBOztBQUFBLEVBSUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSLEVBQXZCLG1CQUpELENBQUE7O0FBQUEsRUFNQSxNQUFNLENBQUMsT0FBUCxHQUNJO0FBQUEsSUFBQSxNQUFBLEVBQVEsWUFBWSxDQUFDLE1BQXJCO0FBQUEsSUFFQSxVQUFBLEVBQVcsRUFGWDtBQUFBLElBR0EsV0FBQSxFQUFhLEVBSGI7QUFBQSxJQUlBLFVBQUEsRUFBWSxFQUpaO0FBQUEsSUFLQSxRQUFBLEVBQVUsZUFMVjtBQUFBLElBTUEseUJBQUEsRUFBMkIsS0FOM0I7QUFBQSxJQU9BLGFBQUEsRUFBZSxLQVBmO0FBQUEsSUFTQSxRQUFBLEVBQVUsU0FBQSxHQUFBO0FBRU4sTUFBQSxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQVosQ0FBb0IsMkJBQXBCLEVBQWlELENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLEtBQUQsR0FBQTtpQkFDN0MsS0FBQyxDQUFBLFVBQUQsR0FBYyxNQUQrQjtRQUFBLEVBQUE7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

//# sourceURL=/home/cin_chalic/.atom/packages/autoclose-html/lib/autoclose-html.coffee
