(function() {
  var $, $$, Citation, CiteView, FindLabels, SelectListView, fs, pathModule, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), SelectListView = _ref.SelectListView, $ = _ref.$, $$ = _ref.$$;

  Citation = require('./citation');

  FindLabels = require('./find-labels');

  fs = require('fs-plus');

  pathModule = require('path');

  module.exports = CiteView = (function(_super) {
    __extends(CiteView, _super);

    function CiteView() {
      return CiteView.__super__.constructor.apply(this, arguments);
    }

    CiteView.prototype.editor = null;

    CiteView.prototype.panel = null;

    CiteView.prototype.initialize = function() {
      CiteView.__super__.initialize.apply(this, arguments);
      return this.addClass('overlay from-top cite-view');
    };

    CiteView.prototype.show = function(editor) {
      var cites;
      if (editor == null) {
        return;
      }
      this.editor = editor;
      cites = this.getCitations();
      this.setItems(cites);
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.panel.show();
      this.storeFocusedElement();
      return this.focusFilterEditor();
    };

    CiteView.prototype.getEmptyMessage = function() {
      return "No citations found";
    };

    CiteView.prototype.getFilterKey = function() {
      return "filterKey";
    };

    CiteView.prototype.viewForItem = function(_arg) {
      var author, key, title;
      title = _arg.title, key = _arg.key, author = _arg.author;
      return "<li><span style='display:block;'>" + title + "</span><span style='display:block;font-size:xx-small;'>" + author + "</span></li>";
    };

    CiteView.prototype.hide = function() {
      var _ref1;
      return (_ref1 = this.panel) != null ? _ref1.hide() : void 0;
    };

    CiteView.prototype.confirmed = function(_arg) {
      var author, key, title;
      title = _arg.title, key = _arg.key, author = _arg.author;
      this.editor.insertText(key);
      this.restoreFocus();
      return this.hide();
    };

    CiteView.prototype.cancel = function() {
      CiteView.__super__.cancel.apply(this, arguments);
      return this.hide();
    };

    CiteView.prototype.getCitations = function() {
      var bibFile, bibFiles, cites, _i, _len;
      cites = [];
      bibFiles = this.getBibFiles();
      for (_i = 0, _len = bibFiles.length; _i < _len; _i++) {
        bibFile = bibFiles[_i];
        cites = cites.concat(this.getCitationsFromPath(bibFile));
      }
      return cites;
    };

    CiteView.prototype.getBibFiles = function() {
      var absolutFilePath, basePath, bfpath, bibFiles, error, match, result, texRootRex, text, _i, _len;
      basePath = this.editor.getPath();
      if (basePath.lastIndexOf("/") !== -1) {
        basePath = basePath.substring(0, basePath.lastIndexOf("/"));
      }
      bibFiles = this.getBibFileFromText(this.editor.getText());
      if (bibFiles === null || bibFiles.length === 0) {
        texRootRex = /%!TEX root = (.+)/g;
        while ((match = texRootRex.exec(this.editor.getText()))) {
          absolutFilePath = FindLabels.getAbsolutePath(this.editor.getPath(), match[1]);
          basePath = pathModule.dirname(absolutFilePath);
          try {
            text = fs.readFileSync(absolutFilePath).toString();
            bibFiles = this.getBibFileFromText(text);
            if (bibFiles !== null && bibFiles.length !== 0) {
              break;
            }
          } catch (_error) {
            error = _error;
            atom.notifications.addError('could not load content ' + match[1], {
              dismissable: true
            });
            console.log(error);
          }
        }
      }
      result = [];
      basePath = basePath + pathModule.sep;
      for (_i = 0, _len = bibFiles.length; _i < _len; _i++) {
        bfpath = bibFiles[_i];
        result = result.concat(FindLabels.getAbsolutePath(basePath, bfpath));
      }
      return result;
    };

    CiteView.prototype.getBibFileFromText = function(text) {
      var bibFiles, bibRex, found, foundBibs, match, _i, _len;
      bibFiles = [];
      bibRex = /\\(?:bibliography|addbibresource|addglobalbib){([^}]+)}/g;
      while ((match = bibRex.exec(text))) {
        foundBibs = match[1].split(",");
        for (_i = 0, _len = foundBibs.length; _i < _len; _i++) {
          found = foundBibs[_i];
          if (!/\.bib$/.test(found)) {
            found += ".bib";
          }
          bibFiles = bibFiles.concat(found);
        }
      }
      return bibFiles;
    };

    CiteView.prototype.getCitationsFromPath = function(path) {
      var cite, cites, ct, error, text, textSplit, _i, _len;
      cites = [];
      text = null;
      try {
        text = fs.readFileSync(path).toString();
      } catch (_error) {
        error = _error;
        console.log(error);
        return [];
      }
      if (text == null) {
        return [];
      }
      text = text.replace(/(\r\n|\n|\r)/gm, "");
      textSplit = text.split("@");
      textSplit.shift();
      for (_i = 0, _len = textSplit.length; _i < _len; _i++) {
        cite = textSplit[_i];
        if (cite == null) {
          continue;
        }
        ct = new Citation;
        ct.parse(cite);
        cites.push({
          title: ct.get("title"),
          key: ct.get("key"),
          author: ct.get("author"),
          filterKey: ct.get("author") + " " + ct.get("title")
        });
      }
      return cites;
    };

    return CiteView;

  })(SelectListView);

}).call(this);
