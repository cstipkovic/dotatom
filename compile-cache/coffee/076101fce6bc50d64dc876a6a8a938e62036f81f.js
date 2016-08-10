(function() {
  var LineMessageView, MessagePanelView, PlainMessageView, oMessagesPanel, sCSSPanelTitle, sHTMLPanelTitle, validator, _ref;

  _ref = require("atom-message-panel"), MessagePanelView = _ref.MessagePanelView, LineMessageView = _ref.LineMessageView, PlainMessageView = _ref.PlainMessageView;

  validator = require("w3cvalidator");

  sHTMLPanelTitle = '<span class="icon-microscope"></span> W3C Markup Validation Service Report';

  sCSSPanelTitle = '<span class="icon-microscope"></span> W3C CSS Validation Service Report';

  oMessagesPanel = new MessagePanelView({
    rawTitle: true,
    closeMethod: "destroy"
  });

  module.exports = function() {
    var oEditor, oOptions, sPanelTitle;
    if (!(oEditor = atom.workspace.getActiveTextEditor())) {
      return;
    }
    oMessagesPanel.clear();
    oMessagesPanel.setTitle((sPanelTitle = oEditor.getGrammar().name === "CSS" ? sCSSPanelTitle : sHTMLPanelTitle), true);
    oMessagesPanel.attach();
    if (atom.config.get("w3c-validation.useFoldModeAsDefault") && oMessagesPanel.summary.css("display") === "none") {
      oMessagesPanel.toggle();
    }
    oMessagesPanel.add(new PlainMessageView({
      message: '<span class="icon-hourglass"></span> Validation pending (this can take some time)...',
      raw: true,
      className: "text-info"
    }));
    oOptions = {
      input: oEditor.getText(),
      output: "json",
      charset: oEditor.getEncoding(),
      callback: function(oResponse) {
        var oMessage, _i, _len, _ref1, _ref2;
        oMessagesPanel.clear();
        if (!oResponse.messages) {
          return;
        }
        if (!oResponse.messages.length) {
          if (atom.config.get("w3c-validation.hideOnNoErrors")) {
            return oMessagesPanel.close();
          }
          return oMessagesPanel.add(new PlainMessageView({
            message: '<span class="icon-check"></span> No errors were found !',
            raw: true,
            className: "text-success"
          }));
        }
        oMessagesPanel.setTitle("" + sPanelTitle + " (" + oResponse.messages.length + " messages)", true);
        _ref1 = oResponse.messages;
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          oMessage = _ref1[_i];
          if (!!oMessage) {
            oMessagesPanel.add(new LineMessageView({
              message: oMessage.message,
              line: oMessage.lastLine,
              character: oMessage.lastColumn,
              preview: ((_ref2 = oEditor.lineTextForBufferRow(oMessage.lastLine - 1)) != null ? _ref2 : "").trim(),
              className: "text-" + oMessage.type
            }));
          }
        }
        return atom.workspace.onDidChangeActivePaneItem(function() {
          return oMessagesPanel.close();
        });
      }
    };
    if (oEditor.getGrammar().name === "CSS") {
      oOptions.validate = oEditor.getGrammar().name.toLowerCase();
      oOptions.profile = atom.config.get("w3c-validation.cssProfile");
      oOptions.medium = atom.config.get("w3c-validation.cssMedia");
      oOptions.warnings = (function() {
        switch (atom.config.get("w3c-validation.cssReportType")) {
          case "all":
            return 2;
          case "most important":
            return 0;
          case "no warnings":
            return "no";
          default:
            return 1;
        }
      })();
    }
    return validator.validate(oOptions);
  };

}).call(this);
