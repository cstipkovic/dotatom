(function() {
  var $, FindLabels, LabelView, SelectListView, fs, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), $ = _ref.$, SelectListView = _ref.SelectListView;

  FindLabels = require('./find-labels');

  fs = require('fs-plus');

  module.exports = LabelView = (function(_super) {
    __extends(LabelView, _super);

    function LabelView() {
      return LabelView.__super__.constructor.apply(this, arguments);
    }

    LabelView.prototype.editor = null;

    LabelView.prototype.panel = null;

    LabelView.prototype.initialize = function() {
      LabelView.__super__.initialize.apply(this, arguments);
      return this.addClass('overlay from-top label-view');
    };

    LabelView.prototype.show = function(editor) {
      var absolutFilePath, basePath, error, file, labels, match, texRootRex, text, _ref1;
      if (editor == null) {
        return;
      }
      this.editor = editor;
      file = editor != null ? (_ref1 = editor.buffer) != null ? _ref1.file : void 0 : void 0;
      basePath = file != null ? file.path : void 0;
      texRootRex = /%!TEX root = (.+)/g;
      while ((match = texRootRex.exec(this.editor.getText()))) {
        absolutFilePath = FindLabels.getAbsolutePath(basePath, match[1]);
        try {
          text = fs.readFileSync(absolutFilePath).toString();
          labels = FindLabels.getLabelsByText(text, absolutFilePath);
        } catch (_error) {
          error = _error;
          atom.notifications.addError('could not load content of ' + absolutFilePath, {
            dismissable: true
          });
          console.log(error);
        }
      }
      if (labels === void 0 || labels.length === 0) {
        labels = FindLabels.getLabelsByText(this.editor.getText(), basePath);
      }
      this.setItems(labels);
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.panel.show();
      this.storeFocusedElement();
      return this.focusFilterEditor();
    };

    LabelView.prototype.hide = function() {
      var _ref1;
      return (_ref1 = this.panel) != null ? _ref1.hide() : void 0;
    };

    LabelView.prototype.getEmptyMessage = function() {
      return "No labels found";
    };

    LabelView.prototype.getFilterKey = function() {
      return "label";
    };

    LabelView.prototype.viewForItem = function(_arg) {
      var label;
      label = _arg.label;
      return "<li>" + label + "</li>";
    };

    LabelView.prototype.confirmed = function(_arg) {
      var label;
      label = _arg.label;
      this.editor.insertText(label);
      this.restoreFocus();
      return this.hide();
    };

    LabelView.prototype.cancel = function() {
      LabelView.__super__.cancel.apply(this, arguments);
      return this.hide();
    };

    return LabelView;

  })(SelectListView);

}).call(this);
