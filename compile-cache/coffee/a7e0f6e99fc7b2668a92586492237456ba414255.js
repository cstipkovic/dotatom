(function() {
  var CompositeDisposable, Point, RowMap, createElementsForGuides, getGuides, styleGuide, _, _ref, _ref1;

  _ref = require('atom'), CompositeDisposable = _ref.CompositeDisposable, Point = _ref.Point;

  _ = require('lodash');

  _ref1 = require('./indent-guide-improved-element'), createElementsForGuides = _ref1.createElementsForGuides, styleGuide = _ref1.styleGuide;

  getGuides = require('./guides.coffee').getGuides;

  RowMap = require('./row-map.coffee');

  module.exports = {
    activate: function(state) {
      var handleEvents, msg, updateGuide;
      atom.config.set('editor.showIndentGuide', false);
      if (!atom.config.get('editor.useShadowDOM')) {
        msg = 'To use indent-guide-improved package, please check "Use Shadow DOM" in Settings.';
        atom.notifications.addError(msg, {
          dismissable: true
        });
        return;
      }
      updateGuide = function(editor, editorElement) {
        var basePixelPos, getIndent, guides, lineHeightPixel, rowMap, scrollLeft, scrollTop, visibleRange, visibleScreenRange;
        visibleScreenRange = editor.getVisibleRowRange();
        basePixelPos = editorElement.pixelPositionForScreenPosition(new Point(visibleScreenRange[0], 0)).top;
        visibleRange = visibleScreenRange.map(function(row) {
          return editor.bufferPositionForScreenPosition(new Point(row, 0)).row;
        });
        getIndent = function(row) {
          if (editor.lineTextForBufferRow(row).match(/^\s*$/)) {
            return null;
          } else {
            return editor.indentationForBufferRow(row);
          }
        };
        scrollTop = editor.getScrollTop();
        scrollLeft = editor.getScrollLeft();
        rowMap = new RowMap(editor.displayBuffer.rowMap.getRegions());
        guides = getGuides(visibleRange[0], visibleRange[1], editor.getLastBufferRow(), editor.getCursorBufferPositions().map(function(point) {
          return point.row;
        }), getIndent);
        lineHeightPixel = editor.getLineHeightInPixels();
        return createElementsForGuides(editorElement, guides.map(function(g) {
          return function(el) {
            return styleGuide(el, g.point.translate(new Point(visibleRange[0], 0)), g.length, g.stack, g.active, editor, rowMap, basePixelPos, lineHeightPixel, visibleScreenRange[0], scrollTop, scrollLeft);
          };
        }));
      };
      handleEvents = function(editor, editorElement) {
        var subscriptions, up, update;
        up = function() {
          return updateGuide(editor, editorElement);
        };
        update = _.throttle(up, 30);
        subscriptions = new CompositeDisposable;
        subscriptions.add(editor.onDidChangeCursorPosition(update));
        subscriptions.add(editor.onDidChangeScrollTop(update));
        subscriptions.add(editor.onDidChangeScrollLeft(update));
        subscriptions.add(editor.onDidStopChanging(update));
        return subscriptions.add(editor.onDidDestroy(function() {
          return subscriptions.dispose();
        }));
      };
      return atom.workspace.observeTextEditors(function(editor) {
        var editorElement;
        editorElement = atom.views.getView(editor);
        return handleEvents(editor, editorElement);
      });
    }
  };

}).call(this);
