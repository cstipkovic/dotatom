Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _opener = require("../opener");

var _opener2 = _interopRequireDefault(_opener);

"use babel";

var AtomPdfOpener = (function (_Opener) {
  function AtomPdfOpener() {
    _classCallCheck(this, AtomPdfOpener);

    _get(Object.getPrototypeOf(AtomPdfOpener.prototype), "constructor", this).apply(this, arguments);
  }

  _inherits(AtomPdfOpener, _Opener);

  _createClass(AtomPdfOpener, [{
    key: "open",
    value: function open(filePath, texPath, lineNumber, callback) {
      // Opens PDF in a new pane -- requires pdf-view module
      var openPanes = atom.workspace.getPaneItems();
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = openPanes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var openPane = _step.value;

          // File is already open in another pane
          if (openPane.filePath === filePath) {
            return;
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator["return"]) {
            _iterator["return"]();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      var pane = atom.workspace.getActivePane();
      // TODO: Make this configurable?
      // FIXME: Migrate to Pane::splitRight.
      var newPane = pane.split("horizontal", "after");
      // FIXME: Use public API instead.
      atom.workspace.openURIInPane(filePath, newPane);

      // TODO: Check for actual success?
      if (callback) {
        callback(0);
      }
    }
  }]);

  return AtomPdfOpener;
})(_opener2["default"]);

exports["default"] = AtomPdfOpener;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL29wZW5lcnMvYXRvbXBkZi1vcGVuZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7c0JBRW1CLFdBQVc7Ozs7QUFGOUIsV0FBVyxDQUFDOztJQUlTLGFBQWE7V0FBYixhQUFhOzBCQUFiLGFBQWE7OytCQUFiLGFBQWE7OztZQUFiLGFBQWE7O2VBQWIsYUFBYTs7V0FDNUIsY0FBQyxRQUFRLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUU7O0FBRTVDLFVBQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsWUFBWSxFQUFFLENBQUM7Ozs7OztBQUNoRCw2QkFBdUIsU0FBUyw4SEFBRTtjQUF2QixRQUFROzs7QUFFakIsY0FBSSxRQUFRLENBQUMsUUFBUSxLQUFLLFFBQVEsRUFBRTtBQUFFLG1CQUFPO1dBQUU7U0FDaEQ7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFRCxVQUFNLElBQUksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsRUFBRSxDQUFDOzs7QUFHNUMsVUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLEVBQUUsT0FBTyxDQUFDLENBQUM7O0FBRWxELFVBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQzs7O0FBR2hELFVBQUksUUFBUSxFQUFFO0FBQ1osZ0JBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztPQUNiO0tBQ0Y7OztTQXBCa0IsYUFBYTs7O3FCQUFiLGFBQWEiLCJmaWxlIjoiL2hvbWUvY2luX2NoYWxpYy8uYXRvbS9wYWNrYWdlcy9sYXRleC9saWIvb3BlbmVycy9hdG9tcGRmLW9wZW5lci5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIGJhYmVsXCI7XG5cbmltcG9ydCBPcGVuZXIgZnJvbSBcIi4uL29wZW5lclwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBdG9tUGRmT3BlbmVyIGV4dGVuZHMgT3BlbmVyIHtcbiAgb3BlbihmaWxlUGF0aCwgdGV4UGF0aCwgbGluZU51bWJlciwgY2FsbGJhY2spIHtcbiAgICAvLyBPcGVucyBQREYgaW4gYSBuZXcgcGFuZSAtLSByZXF1aXJlcyBwZGYtdmlldyBtb2R1bGVcbiAgICBjb25zdCBvcGVuUGFuZXMgPSBhdG9tLndvcmtzcGFjZS5nZXRQYW5lSXRlbXMoKTtcbiAgICBmb3IgKGNvbnN0IG9wZW5QYW5lIG9mIG9wZW5QYW5lcykge1xuICAgICAgLy8gRmlsZSBpcyBhbHJlYWR5IG9wZW4gaW4gYW5vdGhlciBwYW5lXG4gICAgICBpZiAob3BlblBhbmUuZmlsZVBhdGggPT09IGZpbGVQYXRoKSB7IHJldHVybjsgfVxuICAgIH1cblxuICAgIGNvbnN0IHBhbmUgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lKCk7XG4gICAgLy8gVE9ETzogTWFrZSB0aGlzIGNvbmZpZ3VyYWJsZT9cbiAgICAvLyBGSVhNRTogTWlncmF0ZSB0byBQYW5lOjpzcGxpdFJpZ2h0LlxuICAgIGNvbnN0IG5ld1BhbmUgPSBwYW5lLnNwbGl0KFwiaG9yaXpvbnRhbFwiLCBcImFmdGVyXCIpO1xuICAgIC8vIEZJWE1FOiBVc2UgcHVibGljIEFQSSBpbnN0ZWFkLlxuICAgIGF0b20ud29ya3NwYWNlLm9wZW5VUklJblBhbmUoZmlsZVBhdGgsIG5ld1BhbmUpO1xuXG4gICAgLy8gVE9ETzogQ2hlY2sgZm9yIGFjdHVhbCBzdWNjZXNzP1xuICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgY2FsbGJhY2soMCk7XG4gICAgfVxuICB9XG59XG4iXX0=