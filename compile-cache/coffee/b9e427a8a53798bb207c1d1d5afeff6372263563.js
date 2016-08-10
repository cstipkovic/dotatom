(function() {
  var Point, fits, getGuides, gs, its, statesAboveVisible, statesBelowVisible, toGuides, uniq;

  gs = require('../lib/guides');

  toGuides = gs.toGuides, uniq = gs.uniq, statesAboveVisible = gs.statesAboveVisible, statesBelowVisible = gs.statesBelowVisible, getGuides = gs.getGuides;

  Point = require('atom').Point;

  its = function(f) {
    return it(f.toString(), f);
  };

  fits = function(f) {
    return fit(f.toString(), f);
  };

  describe("toGuides", function() {
    var guides;
    guides = null;
    describe("step-by-step indent", function() {
      beforeEach(function() {
        return guides = toGuides([0, 1, 2, 2, 1, 2, 1, 0], []);
      });
      its(function() {
        return expect(guides.length).toBe(3);
      });
      its(function() {
        return expect(guides[0].length).toBe(6);
      });
      its(function() {
        return expect(guides[0].point).toEqual(new Point(1, 0));
      });
      its(function() {
        return expect(guides[1].length).toBe(2);
      });
      its(function() {
        return expect(guides[1].point).toEqual(new Point(2, 1));
      });
      its(function() {
        return expect(guides[2].length).toBe(1);
      });
      return its(function() {
        return expect(guides[2].point).toEqual(new Point(5, 1));
      });
    });
    describe("steep indent", function() {
      beforeEach(function() {
        return guides = toGuides([0, 3, 2, 1, 0], []);
      });
      its(function() {
        return expect(guides.length).toBe(3);
      });
      its(function() {
        return expect(guides[0].length).toBe(3);
      });
      its(function() {
        return expect(guides[0].point).toEqual(new Point(1, 0));
      });
      its(function() {
        return expect(guides[1].length).toBe(2);
      });
      its(function() {
        return expect(guides[1].point).toEqual(new Point(1, 1));
      });
      its(function() {
        return expect(guides[2].length).toBe(1);
      });
      return its(function() {
        return expect(guides[2].point).toEqual(new Point(1, 2));
      });
    });
    describe("steep dedent", function() {
      guides = null;
      beforeEach(function() {
        return guides = toGuides([0, 1, 2, 3, 0], []);
      });
      its(function() {
        return expect(guides.length).toBe(3);
      });
      its(function() {
        return expect(guides[0].length).toBe(3);
      });
      its(function() {
        return expect(guides[0].point).toEqual(new Point(1, 0));
      });
      its(function() {
        return expect(guides[1].length).toBe(2);
      });
      its(function() {
        return expect(guides[1].point).toEqual(new Point(2, 1));
      });
      its(function() {
        return expect(guides[2].length).toBe(1);
      });
      return its(function() {
        return expect(guides[2].point).toEqual(new Point(3, 2));
      });
    });
    describe("recurring indent", function() {
      guides = null;
      beforeEach(function() {
        return guides = toGuides([0, 1, 1, 0, 1, 0], []);
      });
      its(function() {
        return expect(guides.length).toBe(2);
      });
      its(function() {
        return expect(guides[0].length).toBe(2);
      });
      its(function() {
        return expect(guides[0].point).toEqual(new Point(1, 0));
      });
      its(function() {
        return expect(guides[1].length).toBe(1);
      });
      return its(function() {
        return expect(guides[1].point).toEqual(new Point(4, 0));
      });
    });
    describe("no indent", function() {
      guides = null;
      beforeEach(function() {
        return guides = toGuides([0, 0, 0], []);
      });
      return its(function() {
        return expect(guides.length).toBe(0);
      });
    });
    describe("same indent", function() {
      guides = null;
      beforeEach(function() {
        return guides = toGuides([1, 1, 1], []);
      });
      its(function() {
        return expect(guides.length).toBe(1);
      });
      its(function() {
        return expect(guides[0].length).toBe(3);
      });
      return its(function() {
        return expect(guides[0].point).toEqual(new Point(0, 0));
      });
    });
    describe("stack and active", function() {
      describe("simple", function() {
        beforeEach(function() {
          return guides = toGuides([1, 2, 2, 1, 2, 1, 0], [2]);
        });
        its(function() {
          return expect(guides[0].stack).toBe(true);
        });
        its(function() {
          return expect(guides[0].active).toBe(false);
        });
        its(function() {
          return expect(guides[1].stack).toBe(true);
        });
        its(function() {
          return expect(guides[1].active).toBe(true);
        });
        its(function() {
          return expect(guides[2].stack).toBe(false);
        });
        return its(function() {
          return expect(guides[2].active).toBe(false);
        });
      });
      describe("cursor not on deepest", function() {
        beforeEach(function() {
          return guides = toGuides([1, 2, 1], [0]);
        });
        its(function() {
          return expect(guides[0].stack).toBe(true);
        });
        its(function() {
          return expect(guides[0].active).toBe(true);
        });
        its(function() {
          return expect(guides[1].stack).toBe(false);
        });
        return its(function() {
          return expect(guides[1].active).toBe(false);
        });
      });
      describe("no cursor", function() {
        beforeEach(function() {
          return guides = toGuides([1, 2, 1], []);
        });
        its(function() {
          return expect(guides[0].stack).toBe(false);
        });
        its(function() {
          return expect(guides[0].active).toBe(false);
        });
        its(function() {
          return expect(guides[1].stack).toBe(false);
        });
        return its(function() {
          return expect(guides[1].active).toBe(false);
        });
      });
      return describe("multiple cursors", function() {
        beforeEach(function() {
          return guides = toGuides([1, 2, 1, 2, 0, 1], [1, 2]);
        });
        its(function() {
          return expect(guides[0].stack).toBe(true);
        });
        its(function() {
          return expect(guides[0].active).toBe(true);
        });
        its(function() {
          return expect(guides[1].stack).toBe(true);
        });
        its(function() {
          return expect(guides[1].active).toBe(true);
        });
        its(function() {
          return expect(guides[2].stack).toBe(false);
        });
        its(function() {
          return expect(guides[2].active).toBe(false);
        });
        its(function() {
          return expect(guides[3].stack).toBe(false);
        });
        return its(function() {
          return expect(guides[3].active).toBe(false);
        });
      });
    });
    describe("empty lines", function() {
      describe("between the same indents", function() {
        beforeEach(function() {
          return guides = toGuides([1, null, 1], []);
        });
        its(function() {
          return expect(guides.length).toBe(1);
        });
        its(function() {
          return expect(guides[0].length).toBe(3);
        });
        return its(function() {
          return expect(guides[0].point).toEqual(new Point(0, 0));
        });
      });
      describe("starts with a null", function() {
        beforeEach(function() {
          return guides = toGuides([null, 1], []);
        });
        its(function() {
          return expect(guides.length).toBe(1);
        });
        its(function() {
          return expect(guides[0].length).toBe(2);
        });
        return its(function() {
          return expect(guides[0].point).toEqual(new Point(0, 0));
        });
      });
      describe("starts with nulls", function() {
        beforeEach(function() {
          return guides = toGuides([null, null, 1], []);
        });
        its(function() {
          return expect(guides.length).toBe(1);
        });
        its(function() {
          return expect(guides[0].length).toBe(3);
        });
        return its(function() {
          return expect(guides[0].point).toEqual(new Point(0, 0));
        });
      });
      describe("ends with a null", function() {
        beforeEach(function() {
          return guides = toGuides([1, null], []);
        });
        its(function() {
          return expect(guides.length).toBe(1);
        });
        its(function() {
          return expect(guides[0].length).toBe(1);
        });
        return its(function() {
          return expect(guides[0].point).toEqual(new Point(0, 0));
        });
      });
      describe("ends with nulls", function() {
        beforeEach(function() {
          return guides = toGuides([1, null, null], []);
        });
        its(function() {
          return expect(guides.length).toBe(1);
        });
        its(function() {
          return expect(guides[0].length).toBe(1);
        });
        return its(function() {
          return expect(guides[0].point).toEqual(new Point(0, 0));
        });
      });
      describe("large to small", function() {
        beforeEach(function() {
          return guides = toGuides([2, null, 1], []);
        });
        its(function() {
          return expect(guides.length).toBe(2);
        });
        its(function() {
          return expect(guides[0].length).toBe(3);
        });
        its(function() {
          return expect(guides[0].point).toEqual(new Point(0, 0));
        });
        its(function() {
          return expect(guides[1].length).toBe(1);
        });
        return its(function() {
          return expect(guides[1].point).toEqual(new Point(0, 1));
        });
      });
      describe("small to large", function() {
        beforeEach(function() {
          return guides = toGuides([1, null, 2], []);
        });
        its(function() {
          return expect(guides.length).toBe(2);
        });
        its(function() {
          return expect(guides[0].length).toBe(3);
        });
        its(function() {
          return expect(guides[0].point).toEqual(new Point(0, 0));
        });
        its(function() {
          return expect(guides[1].length).toBe(2);
        });
        return its(function() {
          return expect(guides[1].point).toEqual(new Point(1, 1));
        });
      });
      return describe("continuous", function() {
        beforeEach(function() {
          return guides = toGuides([1, null, null, 1], []);
        });
        its(function() {
          return expect(guides.length).toBe(1);
        });
        its(function() {
          return expect(guides[0].length).toBe(4);
        });
        return its(function() {
          return expect(guides[0].point).toEqual(new Point(0, 0));
        });
      });
    });
    return describe("incomplete indent", function() {
      guides = null;
      beforeEach(function() {
        return guides = toGuides([1, 1.5, 1], []);
      });
      its(function() {
        return expect(guides.length).toBe(1);
      });
      its(function() {
        return expect(guides[0].length).toBe(3);
      });
      return its(function() {
        return expect(guides[0].point).toEqual(new Point(0, 0));
      });
    });
  });

  describe("uniq", function() {
    its(function() {
      return expect(uniq([1, 1, 1, 2, 2, 3, 3])).toEqual([1, 2, 3]);
    });
    its(function() {
      return expect(uniq([1, 1, 2])).toEqual([1, 2]);
    });
    its(function() {
      return expect(uniq([1, 2])).toEqual([1, 2]);
    });
    its(function() {
      return expect(uniq([1, 1])).toEqual([1]);
    });
    its(function() {
      return expect(uniq([1])).toEqual([1]);
    });
    return its(function() {
      return expect(uniq([])).toEqual([]);
    });
  });

  describe("statesAboveVisible", function() {
    var getLastRow, getRowIndents, guides, rowIndents, run;
    run = statesAboveVisible;
    guides = null;
    rowIndents = null;
    getRowIndents = function(r) {
      return rowIndents[r];
    };
    getLastRow = function() {
      return rowIndents.length - 1;
    };
    describe("only stack", function() {
      beforeEach(function() {
        rowIndents = [0, 1, 2, 3, 2, 3];
        return guides = run([3], 4, getRowIndents, getLastRow());
      });
      its(function() {
        return expect(guides.stack).toEqual([0, 1]);
      });
      return its(function() {
        return expect(guides.active).toEqual([]);
      });
    });
    describe("active and stack", function() {
      beforeEach(function() {
        rowIndents = [0, 1, 2, 2, 2, 3];
        return guides = run([3], 4, getRowIndents, getLastRow());
      });
      its(function() {
        return expect(guides.stack).toEqual([0, 1]);
      });
      return its(function() {
        return expect(guides.active).toEqual([1]);
      });
    });
    describe("cursor on null row", function() {
      beforeEach(function() {
        rowIndents = [0, 1, 2, null, 2, 3];
        return guides = run([3], 4, getRowIndents, getLastRow());
      });
      its(function() {
        return expect(guides.stack).toEqual([0, 1]);
      });
      return its(function() {
        return expect(guides.active).toEqual([1]);
      });
    });
    describe("continuous nulls", function() {
      beforeEach(function() {
        rowIndents = [0, 1, 2, null, null, 3];
        return guides = run([3], 4, getRowIndents, getLastRow());
      });
      its(function() {
        return expect(guides.stack).toEqual([0, 1, 2]);
      });
      return its(function() {
        return expect(guides.active).toEqual([2]);
      });
    });
    describe("no effect", function() {
      beforeEach(function() {
        rowIndents = [0, 1, 2, 0, 1, 3];
        return guides = run([2], 4, getRowIndents, getLastRow());
      });
      its(function() {
        return expect(guides.stack).toEqual([]);
      });
      return its(function() {
        return expect(guides.active).toEqual([]);
      });
    });
    describe("no rows", function() {
      beforeEach(function() {
        rowIndents = [];
        return guides = run([], -1, getRowIndents, getLastRow());
      });
      its(function() {
        return expect(guides.stack).toEqual([]);
      });
      return its(function() {
        return expect(guides.active).toEqual([]);
      });
    });
    describe("no rows above", function() {
      beforeEach(function() {
        rowIndents = [0];
        return guides = run([], -1, getRowIndents, getLastRow());
      });
      its(function() {
        return expect(guides.stack).toEqual([]);
      });
      return its(function() {
        return expect(guides.active).toEqual([]);
      });
    });
    describe("multiple cursors", function() {
      beforeEach(function() {
        rowIndents = [0, 1, 2, 3, 2, 3];
        return guides = run([2, 3], 4, getRowIndents, getLastRow());
      });
      its(function() {
        return expect(guides.stack).toEqual([0, 1]);
      });
      return its(function() {
        return expect(guides.active).toEqual([1]);
      });
    });
    describe("multiple cursors 2", function() {
      beforeEach(function() {
        rowIndents = [0, 1, 2, 3, 2, 3];
        return guides = run([1, 2], 4, getRowIndents, getLastRow());
      });
      its(function() {
        return expect(guides.stack).toEqual([0, 1]);
      });
      return its(function() {
        return expect(guides.active).toEqual([0, 1]);
      });
    });
    return describe("multiple cursors on the same level", function() {
      beforeEach(function() {
        rowIndents = [0, 1, 2, 3, 2, 3];
        return guides = run([2, 4], 4, getRowIndents, getLastRow());
      });
      its(function() {
        return expect(guides.stack).toEqual([0, 1]);
      });
      return its(function() {
        return expect(guides.active).toEqual([1]);
      });
    });
  });

  describe("statesBelowVisible", function() {
    var getLastRow, getRowIndents, guides, rowIndents, run;
    run = statesBelowVisible;
    guides = null;
    rowIndents = null;
    getRowIndents = function(r) {
      return rowIndents[r];
    };
    getLastRow = function() {
      return rowIndents.length - 1;
    };
    describe("only stack", function() {
      beforeEach(function() {
        rowIndents = [3, 2, 3, 2, 1, 0];
        return guides = run([2], 1, getRowIndents, getLastRow());
      });
      its(function() {
        return expect(guides.stack).toEqual([0, 1]);
      });
      return its(function() {
        return expect(guides.active).toEqual([]);
      });
    });
    describe("active and stack", function() {
      beforeEach(function() {
        rowIndents = [3, 2, 2, 2, 1, 0];
        return guides = run([2], 1, getRowIndents, getLastRow());
      });
      its(function() {
        return expect(guides.stack).toEqual([0, 1]);
      });
      return its(function() {
        return expect(guides.active).toEqual([1]);
      });
    });
    describe("cursor on null row", function() {
      beforeEach(function() {
        rowIndents = [3, 2, null, 2, 1, 0];
        return guides = run([2], 1, getRowIndents, getLastRow());
      });
      its(function() {
        return expect(guides.stack).toEqual([0, 1]);
      });
      return its(function() {
        return expect(guides.active).toEqual([1]);
      });
    });
    describe("continuous nulls", function() {
      beforeEach(function() {
        rowIndents = [3, null, null, 2];
        return guides = run([1], 1, getRowIndents, getLastRow());
      });
      its(function() {
        return expect(guides.stack).toEqual([0, 1]);
      });
      return its(function() {
        return expect(guides.active).toEqual([1]);
      });
    });
    describe("no effect", function() {
      beforeEach(function() {
        rowIndents = [3, 0, 1, 0];
        return guides = run([3], 4, getRowIndents, getLastRow());
      });
      its(function() {
        return expect(guides.stack).toEqual([]);
      });
      return its(function() {
        return expect(guides.active).toEqual([]);
      });
    });
    describe("no rows", function() {
      beforeEach(function() {
        rowIndents = [];
        return guides = run([], -1, getRowIndents, getLastRow());
      });
      its(function() {
        return expect(guides.stack).toEqual([]);
      });
      return its(function() {
        return expect(guides.active).toEqual([]);
      });
    });
    describe("no rows below", function() {
      beforeEach(function() {
        rowIndents = [0];
        return guides = run([], 1, getRowIndents, getLastRow());
      });
      its(function() {
        return expect(guides.stack).toEqual([]);
      });
      return its(function() {
        return expect(guides.active).toEqual([]);
      });
    });
    describe("multiple cursors", function() {
      beforeEach(function() {
        rowIndents = [3, 2, 3, 2, 1, 0];
        return guides = run([2, 3], 1, getRowIndents, getLastRow());
      });
      its(function() {
        return expect(guides.stack).toEqual([0, 1]);
      });
      return its(function() {
        return expect(guides.active).toEqual([1]);
      });
    });
    describe("multiple cursors 2", function() {
      beforeEach(function() {
        rowIndents = [3, 2, 3, 2, 1, 0];
        return guides = run([3, 4], 1, getRowIndents, getLastRow());
      });
      its(function() {
        return expect(guides.stack).toEqual([0, 1]);
      });
      return its(function() {
        return expect(guides.active).toEqual([0, 1]);
      });
    });
    return describe("multiple cursors on the same level", function() {
      beforeEach(function() {
        rowIndents = [3, 2, 3, 2, 1, 0];
        return guides = run([1, 3], 1, getRowIndents, getLastRow());
      });
      its(function() {
        return expect(guides.stack).toEqual([0, 1]);
      });
      return its(function() {
        return expect(guides.active).toEqual([1]);
      });
    });
  });

  describe("getGuides", function() {
    var getLastRow, getRowIndents, guides, rowIndents, run;
    run = getGuides;
    guides = null;
    rowIndents = null;
    getRowIndents = function(r) {
      return rowIndents[r];
    };
    getLastRow = function() {
      return rowIndents.length - 1;
    };
    describe("typical", function() {
      beforeEach(function() {
        rowIndents = [0, 1, 2, 2, 3, 0, 1, 2, 0, 1, 1, 0];
        return guides = run(3, 9, getLastRow(), [2, 6, 10], getRowIndents);
      });
      its(function() {
        return expect(guides.length).toBe(6);
      });
      its(function() {
        return expect(guides[0].length).toBe(2);
      });
      its(function() {
        return expect(guides[0].point).toEqual(new Point(0, 0));
      });
      its(function() {
        return expect(guides[0].active).toBe(false);
      });
      its(function() {
        return expect(guides[0].stack).toBe(true);
      });
      its(function() {
        return expect(guides[1].length).toBe(2);
      });
      its(function() {
        return expect(guides[1].point).toEqual(new Point(0, 1));
      });
      its(function() {
        return expect(guides[1].active).toBe(true);
      });
      its(function() {
        return expect(guides[1].stack).toBe(true);
      });
      its(function() {
        return expect(guides[2].length).toBe(1);
      });
      its(function() {
        return expect(guides[2].point).toEqual(new Point(1, 2));
      });
      its(function() {
        return expect(guides[2].active).toBe(false);
      });
      its(function() {
        return expect(guides[2].stack).toBe(false);
      });
      its(function() {
        return expect(guides[3].length).toBe(2);
      });
      its(function() {
        return expect(guides[3].point).toEqual(new Point(3, 0));
      });
      its(function() {
        return expect(guides[3].active).toBe(true);
      });
      its(function() {
        return expect(guides[3].stack).toBe(true);
      });
      its(function() {
        return expect(guides[4].length).toBe(1);
      });
      its(function() {
        return expect(guides[4].point).toEqual(new Point(4, 1));
      });
      its(function() {
        return expect(guides[4].active).toBe(false);
      });
      its(function() {
        return expect(guides[4].stack).toBe(false);
      });
      its(function() {
        return expect(guides[5].length).toBe(1);
      });
      its(function() {
        return expect(guides[5].point).toEqual(new Point(6, 0));
      });
      its(function() {
        return expect(guides[5].active).toBe(true);
      });
      return its(function() {
        return expect(guides[5].stack).toBe(true);
      });
    });
    describe("when last line is null", function() {
      beforeEach(function() {
        rowIndents = [0, 1, 2, 2, 2, null, 2, 0];
        return guides = run(3, 5, getLastRow(), [6], getRowIndents);
      });
      its(function() {
        return expect(guides.length).toBe(2);
      });
      its(function() {
        return expect(guides[0].length).toBe(4);
      });
      its(function() {
        return expect(guides[0].point).toEqual(new Point(0, 0));
      });
      its(function() {
        return expect(guides[0].active).toBe(false);
      });
      its(function() {
        return expect(guides[0].stack).toBe(true);
      });
      its(function() {
        return expect(guides[1].length).toBe(4);
      });
      its(function() {
        return expect(guides[1].point).toEqual(new Point(0, 1));
      });
      its(function() {
        return expect(guides[1].active).toBe(true);
      });
      return its(function() {
        return expect(guides[1].stack).toBe(true);
      });
    });
    describe("when last line is null and the following line is also null", function() {
      beforeEach(function() {
        rowIndents = [0, 1, 2, 2, 2, null, null, 2, 0];
        return guides = run(3, 5, getLastRow(), [7], getRowIndents);
      });
      its(function() {
        return expect(guides.length).toBe(2);
      });
      its(function() {
        return expect(guides[0].length).toBe(5);
      });
      its(function() {
        return expect(guides[0].point).toEqual(new Point(0, 0));
      });
      its(function() {
        return expect(guides[0].active).toBe(false);
      });
      its(function() {
        return expect(guides[0].stack).toBe(true);
      });
      its(function() {
        return expect(guides[1].length).toBe(5);
      });
      its(function() {
        return expect(guides[1].point).toEqual(new Point(0, 1));
      });
      its(function() {
        return expect(guides[1].active).toBe(true);
      });
      return its(function() {
        return expect(guides[1].stack).toBe(true);
      });
    });
    return describe("when last line is null and the cursor doesnt follow", function() {
      beforeEach(function() {
        rowIndents = [0, 1, 2, 2, 2, null, null, 2, 1, 0];
        return guides = run(3, 5, getLastRow(), [8], getRowIndents);
      });
      its(function() {
        return expect(guides.length).toBe(2);
      });
      its(function() {
        return expect(guides[0].length).toBe(5);
      });
      its(function() {
        return expect(guides[0].point).toEqual(new Point(0, 0));
      });
      its(function() {
        return expect(guides[0].active).toBe(true);
      });
      its(function() {
        return expect(guides[0].stack).toBe(true);
      });
      its(function() {
        return expect(guides[1].length).toBe(5);
      });
      its(function() {
        return expect(guides[1].point).toEqual(new Point(0, 1));
      });
      its(function() {
        return expect(guides[1].active).toBe(false);
      });
      return its(function() {
        return expect(guides[1].stack).toBe(false);
      });
    });
  });

}).call(this);
