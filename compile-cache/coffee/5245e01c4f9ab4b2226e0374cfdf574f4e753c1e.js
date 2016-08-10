(function() {
  var Point, RowMap;

  Point = require('atom').Point;

  RowMap = (function() {
    function RowMap(regions) {
      this.regions = regions;
    }

    RowMap.prototype.firstScreenRowForBufferRow = function(row) {
      var bufAcc, diff, reg, scrAcc, _i, _len, _ref;
      bufAcc = -1;
      scrAcc = -1;
      _ref = this.regions;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        reg = _ref[_i];
        if (reg.bufferRows === 1 || reg.screenRows === 1) {
          bufAcc += reg.bufferRows;
          scrAcc += reg.screenRows;
          if (row <= bufAcc) {
            break;
          }
          continue;
        }
        if (reg.bufferRows === reg.screenRows) {
          if (row <= bufAcc + reg.bufferRows) {
            diff = row - bufAcc;
            bufAcc += diff;
            scrAcc += diff;
            break;
          }
          bufAcc += reg.bufferRows;
          scrAcc += reg.screenRows;
          continue;
        }
        throw "illegal state";
      }
      return scrAcc;
    };

    return RowMap;

  })();

  module.exports = RowMap;

}).call(this);
