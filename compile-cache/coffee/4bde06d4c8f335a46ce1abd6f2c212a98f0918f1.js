(function() {
  var CiteView, CompositeDisposable, LabelView, LatexerHook;

  CompositeDisposable = require('atom').CompositeDisposable;

  LabelView = require('./label-view');

  CiteView = require('./cite-view');

  module.exports = LatexerHook = (function() {
    LatexerHook.prototype.beginRex = /\\begin{([^}]+)}/;

    LatexerHook.prototype.refRex = /\\(ref|eqref|cref){$/;

    LatexerHook.prototype.citeRex = /\\(cite|textcite|citet|citep|citet\*|citep\*)(\[[^\]]+\])?{$/;

    function LatexerHook(editor) {
      this.editor = editor;
      this.disposables = new CompositeDisposable;
      this.disposables.add(this.editor.onDidChangeTitle((function(_this) {
        return function() {
          return _this.subscribeBuffer();
        };
      })(this)));
      this.disposables.add(this.editor.onDidChangePath((function(_this) {
        return function() {
          return _this.subscribeBuffer();
        };
      })(this)));
      this.disposables.add(this.editor.onDidSave((function(_this) {
        return function() {
          return _this.subscribeBuffer();
        };
      })(this)));
      this.disposables.add(this.editor.onDidDestroy(this.destroy.bind(this)));
      this.subscribeBuffer();
      this.lv = new LabelView;
      this.cv = new CiteView;
    }

    LatexerHook.prototype.destroy = function() {
      var _ref, _ref1;
      this.unsubscribeBuffer();
      this.disposables.dispose();
      if ((_ref = this.lv) != null) {
        _ref.hide();
      }
      return (_ref1 = this.cv) != null ? _ref1.hide() : void 0;
    };

    LatexerHook.prototype.subscribeBuffer = function() {
      var title, _ref;
      this.unsubscribeBuffer();
      if (this.editor == null) {
        return;
      }
      title = (_ref = this.editor) != null ? _ref.getTitle() : void 0;
      if (!((title != null) && title.match(/\.tex$/))) {
        return;
      }
      this.buffer = this.editor.getBuffer();
      return this.disposableBuffer = this.buffer.onDidStopChanging((function(_this) {
        return function() {
          return _this.checkText();
        };
      })(this));
    };

    LatexerHook.prototype.unsubscribeBuffer = function() {
      var _ref;
      if ((_ref = this.disposableBuffer) != null) {
        _ref.dispose();
      }
      return this.buffer = null;
    };

    LatexerHook.prototype.checkText = function() {
      var beginText, endText, line, lineCount, match, pos, previousLine, remainingOnPrevLine, remainingText;
      pos = this.editor.getCursorBufferPosition().toArray();
      line = this.editor.getTextInBufferRange([[pos[0], 0], pos]);
      if ((match = line.match(this.refRex))) {
        return this.lv.show(this.editor);
      } else if ((match = line.match(this.citeRex))) {
        return this.cv.show(this.editor);
      } else if (pos[0] > 1) {
        previousLine = this.editor.lineTextForBufferRow(pos[0] - 1);
        if ((match = this.beginRex.exec(previousLine)) || (match = /\\\[/.exec(previousLine))) {
          lineCount = this.editor.getLineCount();
          remainingText = this.editor.getTextInBufferRange([[pos[0], 0], [lineCount + 1, 0]]);
          if (match[0] === "\\[") {
            beginText = "\\[";
            endText = "\\]";
          } else {
            beginText = "\\begin{" + match[1] + "}";
            endText = "\\end{" + match[1] + "}";
          }
          remainingOnPrevLine = previousLine.substring(previousLine.indexOf(beginText));
          if (remainingOnPrevLine.indexOf(endText) !== -1) {
            return;
          }
          if ((remainingText == null) || (remainingText.indexOf(endText) < 0) || ((remainingText.indexOf(beginText) < remainingText.indexOf(endText)) && (remainingText.indexOf(beginText) > 0))) {
            this.editor.insertText("\n");
            this.editor.insertText(endText);
            return this.editor.moveUp(1);
          }
        }
      }
    };

    return LatexerHook;

  })();

}).call(this);
