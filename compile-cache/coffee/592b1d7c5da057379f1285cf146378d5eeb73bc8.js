(function() {
  var ConfigSchema, defaultGrammars, isOpeningTagLikePattern,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  isOpeningTagLikePattern = /<(?![\!\/])([a-z]{1}[^>\s=\'\"]*)[^>]*$/i;

  defaultGrammars = ['HTML', 'HTML (Go)', 'HTML (Rails)', 'HTML (Angular)', 'HTML (Mustache)', 'HTML (Handlebars)', 'HTML (Ruby - ERB)', 'PHP'];

  ConfigSchema = require('./configuration.coffee');

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
    isInline: function(eleTag) {
      var ele, ret, _ref, _ref1, _ref2;
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
      return atom.workspace.observeTextEditors((function(_this) {
        return function(textEditor) {
          var bufferEvent;
          bufferEvent = null;
          return textEditor.observeGrammar(function(grammar) {
            var _ref, _ref1;
            if (bufferEvent != null) {
              bufferEvent.dispose();
            }
            if (((_ref = grammar.name) != null ? _ref.length : void 0) > 0 && (_this.ignoreGrammar || (_ref1 = grammar.name, __indexOf.call(_this.grammars, _ref1) >= 0))) {
              return bufferEvent = textEditor.buffer.onDidChange(function(e) {
                return _this.execAutoclose(e, textEditor);
              });
            }
          });
        };
      })(this));
    }
  };

}).call(this);
