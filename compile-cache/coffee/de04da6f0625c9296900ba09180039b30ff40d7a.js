(function() {
  var IndentationIndicator;

  IndentationIndicator = require('../lib/indentation-indicator');

  describe('IndentationIndicator', function() {
    var indicator, statusBar, workspaceElement, _ref;
    _ref = [], indicator = _ref[0], workspaceElement = _ref[1], statusBar = _ref[2];
    beforeEach(function() {
      workspaceElement = atom.views.getView(atom.workspace);
      jasmine.attachToDOM(workspaceElement);
      atom.config.set('indentation-indicator.indicatorPosition', 'left');
      waitsForPromise(function() {
        return atom.packages.activatePackage('status-bar');
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage('indentation-indicator');
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage('language-gfm');
      });
      return runs(function() {
        atom.config.set('editor', {
          softTabs: false,
          tabLength: 3
        });
        atom.packages.emitter.emit('did-activate-all');
        return indicator = IndentationIndicator.view;
      });
    });
    describe('::initialize', function() {
      it('displays in the status bar', function() {
        expect(indicator).toBeDefined();
        return expect(indicator.classList.contains('indentation-indicator')).toBeTruthy();
      });
      describe('when there is no file open', function() {
        return it('has no text', function() {
          return expect(indicator.textContent).toEqual('');
        });
      });
      describe('when indicatorPosition is "left"', function() {
        return it('displays to the left in the status bar', function() {
          atom.config.set('indentation-indicator.indicatorPosition', 'left');
          atom.packages.deactivatePackage('indentation-indicator');
          waitsForPromise(function() {
            return atom.packages.activatePackage('indentation-indicator');
          });
          return runs(function() {
            indicator = IndentationIndicator.view;
            expect(indicator).toBeDefined();
            return expect(indicator.parentNode.classList.contains('status-bar-left')).toBeTruthy();
          });
        });
      });
      return describe('when indicatorPosition is "right"', function() {
        return it('displays to the right in the status bar', function() {
          atom.config.set('indentation-indicator.indicatorPosition', 'right');
          atom.packages.deactivatePackage('indentation-indicator');
          waitsForPromise(function() {
            return atom.packages.activatePackage('indentation-indicator');
          });
          return runs(function() {
            indicator = IndentationIndicator.view;
            expect(indicator).toBeDefined();
            return expect(indicator.parentNode.classList.contains('status-bar-right')).toBeTruthy();
          });
        });
      });
    });
    describe('::deactivate', function() {
      it('removes the indicator view', function() {
        expect(indicator).toExist();
        atom.packages.deactivatePackage('indentation-indicator');
        return expect(IndentationIndicator.view).toBeNull();
      });
      it('can be executed twice', function() {
        atom.packages.deactivatePackage('indentation-indicator');
        return atom.packages.deactivatePackage('indentation-indicator');
      });
      return it('disposes of subscriptions', function() {
        spyOn(IndentationIndicator.subscriptions, 'dispose');
        atom.packages.deactivatePackage('indentation-indicator');
        return expect(IndentationIndicator.subscriptions.dispose).toHaveBeenCalled();
      });
    });
    describe('when the configuration changes', function() {
      return it('moves the indicator', function() {
        atom.config.set('indentation-indicator.indicatorPosition', 'right');
        indicator = IndentationIndicator.view;
        return expect(indicator.parentNode.classList.contains('status-bar-right')).toBeTruthy();
      });
    });
    describe('when a file is open', function() {
      it('reflects the editor settings', function() {
        waitsForPromise(function() {
          return atom.workspace.open('sample.js');
        });
        return runs(function() {
          return expect(indicator.textContent).toBe('Tabs:3');
        });
      });
      it('represents softTabs true as "Spaces"', function() {
        atom.config.set('editor', {
          softTabs: true,
          tabLength: 6
        });
        waitsForPromise(function() {
          return atom.workspace.open('sample.js');
        });
        return runs(function() {
          return expect(indicator.textContent).toBe('Spaces:6');
        });
      });
      it('uses the defaults if no editor settings are available', function() {
        atom.config.set('editor', {});
        waitsForPromise(function() {
          return atom.workspace.open('sample.js');
        });
        return runs(function() {
          return expect(indicator.textContent).toBe('Spaces:2');
        });
      });
      return describe('and the grammar changes', function() {
        return it('updates the indicator', function() {
          var editor;
          editor = null;
          atom.config.set('editor.softTabs', true, {
            scopeSelector: '.source.gfm'
          });
          atom.config.set('editor.tabLength', 4, {
            scopeSelector: '.source.gfm'
          });
          waitsForPromise(function() {
            return atom.workspace.open('sample.txt').then(function(e) {
              return editor = e;
            });
          });
          return runs(function() {
            var grammar;
            grammar = atom.grammars.grammarForScopeName('source.gfm');
            editor.setGrammar(grammar);
            return expect(indicator.textContent).toEqual('Tabs:4');
          });
        });
      });
    });
    return describe('when spaceAfterColon is true', function() {
      return it('has a space after the colon in the indicator', function() {
        atom.config.set('editor', {
          softTabs: true,
          tabLength: 6
        });
        atom.config.set('indentation-indicator', {
          spaceAfterColon: true
        });
        waitsForPromise(function() {
          return atom.workspace.open('sample.js');
        });
        return runs(function() {
          return expect(indicator.textContent).toBe('Spaces: 6');
        });
      });
    });
  });

}).call(this);
