(function() {
  var CiteView, CompositeDisposable, LabelView, Latexer, LatexerHook, TextEditor, _ref;

  LabelView = require('./label-view');

  CiteView = require('./cite-view');

  LatexerHook = require('./latexer-hook');

  _ref = require('atom'), TextEditor = _ref.TextEditor, CompositeDisposable = _ref.CompositeDisposable;

  module.exports = Latexer = {
    activate: function() {
      return atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          return new LatexerHook(editor);
        };
      })(this));
    },
    deactivate: function() {},
    serialize: function() {
      return {
        latexerViewState: this.latexerView.serialize()
      };
    }
  };

}).call(this);
