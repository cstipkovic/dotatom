(function() {
  var Citation, CiteView, FindLabels, LabelView, Latexer, fs;

  Latexer = require('../lib/latexer');

  LabelView = require('../lib/label-view');

  CiteView = require('../lib/cite-view');

  Citation = require('../lib/citation');

  FindLabels = require('../lib/find-labels');

  fs = require('fs-plus');

  describe("Latexer", function() {
    describe("finding labels", function() {
      return it("gets the correct labels", function() {
        var i, label, labels, text, _i, _len, _results;
        text = "\\label{value0} some text \\label{value1} \\other{things} \\label{value2}";
        labels = FindLabels.getLabelsByText(text);
        _results = [];
        for (i = _i = 0, _len = labels.length; _i < _len; i = ++_i) {
          label = labels[i];
          _results.push(expect(label.label).toBe("value" + i));
        }
        return _results;
      });
    });
    describe("new citation is created", function() {
      return it("extracts the correct values", function() {
        var cite, i, testCite, _i, _len, _ref, _results;
        testCite = "@test {key,\nfield0 = {vfield0},\nfield1 = {vfield1},\nfield2 = \"vfield2\",\nfield3 = \"vfield3\"\n}";
        cite = new Citation;
        cite.parse(testCite);
        expect(cite.get("key")).toBe("key");
        _ref = [0, 1, 2, 3];
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          i = _ref[_i];
          _results.push(expect(cite.get("field" + i)).toBe("vfield" + i));
        }
        return _results;
      });
    });
    return describe("the views", function() {
      var bibText, citeText, editor, labelText, workspaceElement, _ref;
      _ref = [], workspaceElement = _ref[0], editor = _ref[1];
      citeText = "\\bibliography{bibfile.bib}\\cite{";
      labelText = "\\label{value}\\ref{";
      bibText = "@{key0, title = {title0}, author = {author0} } comments here @{key1, title = {title1}, author = {author1} }";
      beforeEach(function() {
        runs(function() {
          return workspaceElement = atom.views.getView(atom.workspace);
        });
        waitsFor(function() {
          return workspaceElement;
        });
        runs(function() {
          return jasmine.attachToDOM(workspaceElement);
        });
        waitsForPromise(function() {
          return atom.workspace.open("sample.tex");
        });
        waitsFor(function() {
          return editor = atom.workspace.getActiveTextEditor();
        });
        waitsForPromise(function() {
          return atom.packages.activatePackage("latexer");
        });
        return runs(function() {
          spyOn(FindLabels, "getAbsolutePath").andReturn("bibfile.bib");
          return spyOn(fs, "readFileSync").andReturn(bibText);
        });
      });
      describe("typing \\ref{", function() {
        return it("shows the labels to select from", function() {
          var displayedLabels, labelElement;
          editor.setText(labelText);
          advanceClock(editor.getBuffer().getStoppedChangingDelay());
          labelElement = workspaceElement.querySelector('.label-view');
          expect(labelElement).toExist();
          displayedLabels = labelElement.querySelectorAll('li');
          expect(displayedLabels.length).toBe(1);
          return expect(displayedLabels[0].textContent).toBe("value");
        });
      });
      return describe("typing \\cite{", function() {
        return it("show the bibliography", function() {
          var cite, citeElement, displayedCites, i, info, _i, _len, _results;
          editor.setText(citeText);
          advanceClock(editor.getBuffer().getStoppedChangingDelay());
          expect(fs.readFileSync).toHaveBeenCalledWith("bibfile.bib");
          citeElement = workspaceElement.querySelector('.cite-view');
          expect(citeElement).toExist();
          displayedCites = citeElement.querySelectorAll('li');
          expect(displayedCites.length).toBe(2);
          _results = [];
          for (i = _i = 0, _len = displayedCites.length; _i < _len; i = ++_i) {
            cite = displayedCites[i];
            info = cite.querySelectorAll("span");
            expect(info.length).toBe(2);
            expect(info[0].textContent).toBe("title" + i);
            _results.push(expect(info[1].textContent).toBe("author" + i));
          }
          return _results;
        });
      });
    });
  });

}).call(this);
