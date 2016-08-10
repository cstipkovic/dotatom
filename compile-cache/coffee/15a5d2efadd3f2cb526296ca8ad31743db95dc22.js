(function() {
  var IndentGuideImprovedElement, Point, createElementsForGuides, realLength, styleGuide;

  Point = require('atom').Point;

  styleGuide = function(element, point, length, stack, active, editor, rowMap, basePixelPos, lineHeightPixel, baseScreenRow, scrollTop, scrollLeft) {
    var indentSize, left, row, top;
    element.classList.add('indent-guide-improved');
    element.classList[stack ? 'add' : 'remove']('indent-guide-stack');
    element.classList[active ? 'add' : 'remove']('indent-guide-active');
    if (editor.isFoldedAtBufferRow(Math.max(point.row - 1, 0))) {
      return;
    }
    row = rowMap.firstScreenRowForBufferRow(point.row);
    indentSize = editor.getTabLength();
    left = point.column * indentSize * editor.getDefaultCharWidth() - scrollLeft;
    top = basePixelPos + lineHeightPixel * (row - baseScreenRow) - scrollTop;
    element.style.left = "" + left + "px";
    element.style.top = "" + top + "px";
    element.style.height = "" + (editor.getLineHeightInPixels() * realLength(point.row, length, rowMap)) + "px";
    return element.style.display = 'block';
  };

  realLength = function(row, length, rowMap) {
    var row1, row2;
    row1 = rowMap.firstScreenRowForBufferRow(row);
    row2 = rowMap.firstScreenRowForBufferRow(row + length);
    return row2 - row1;
  };

  IndentGuideImprovedElement = document.registerElement('indent-guide-improved');

  createElementsForGuides = function(editorElement, fns) {
    var count, createNum, existNum, items, neededNum, recycleNum, _i, _j, _results, _results1;
    items = editorElement.querySelectorAll('.indent-guide-improved');
    existNum = items.length;
    neededNum = fns.length;
    createNum = Math.max(neededNum - existNum, 0);
    recycleNum = Math.min(neededNum, existNum);
    count = 0;
    (function() {
      _results = [];
      for (var _i = 0; 0 <= existNum ? _i < existNum : _i > existNum; 0 <= existNum ? _i++ : _i--){ _results.push(_i); }
      return _results;
    }).apply(this).forEach(function(i) {
      var node;
      node = items.item(i);
      if (i < recycleNum) {
        return fns[count++](node);
      } else {
        return node.parentNode.removeChild(node);
      }
    });
    (function() {
      _results1 = [];
      for (var _j = 0; 0 <= createNum ? _j < createNum : _j > createNum; 0 <= createNum ? _j++ : _j--){ _results1.push(_j); }
      return _results1;
    }).apply(this).forEach(function(i) {
      var newNode;
      newNode = new IndentGuideImprovedElement();
      newNode.classList.add('overlayer');
      fns[count++](newNode);
      return editorElement.appendChild(newNode);
    });
    if (count !== neededNum) {
      throw 'System Error';
    }
  };

  module.exports = {
    createElementsForGuides: createElementsForGuides,
    styleGuide: styleGuide
  };

}).call(this);
