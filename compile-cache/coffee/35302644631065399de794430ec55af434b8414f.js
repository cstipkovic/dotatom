(function() {
  var RowMap, its;

  RowMap = require('../lib/row-map');

  its = function(f) {
    return it(f.toString(), f);
  };

  describe("RowMap", function() {
    var rowMap, setRowMap;
    rowMap = null;
    setRowMap = function() {
      return rowMap = new RowMap(Array.prototype.slice.call(arguments).map(function(item) {
        return {
          bufferRows: item[0],
          screenRows: item[1]
        };
      }));
    };
    return describe("firstBufferRowForBufferRow", function() {
      return describe("simplest", function() {
        beforeEach(function() {
          return setRowMap([3, 3], [1, 3], [3, 1], [2, 2]);
        });
        its(function() {
          return expect(rowMap.firstScreenRowForBufferRow(0)).toBe(0);
        });
        its(function() {
          return expect(rowMap.firstScreenRowForBufferRow(1)).toBe(1);
        });
        its(function() {
          return expect(rowMap.firstScreenRowForBufferRow(2)).toBe(2);
        });
        its(function() {
          return expect(rowMap.firstScreenRowForBufferRow(3)).toBe(5);
        });
        its(function() {
          return expect(rowMap.firstScreenRowForBufferRow(4)).toBe(6);
        });
        its(function() {
          return expect(rowMap.firstScreenRowForBufferRow(5)).toBe(6);
        });
        its(function() {
          return expect(rowMap.firstScreenRowForBufferRow(6)).toBe(6);
        });
        its(function() {
          return expect(rowMap.firstScreenRowForBufferRow(7)).toBe(7);
        });
        its(function() {
          return expect(rowMap.firstScreenRowForBufferRow(8)).toBe(8);
        });
        its(function() {
          return expect(rowMap.firstScreenRowForBufferRow(9)).toBe(8);
        });
        return its(function() {
          return expect(rowMap.firstScreenRowForBufferRow(10)).toBe(8);
        });
      });
    });
  });

}).call(this);
