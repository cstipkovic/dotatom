Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _opener = require('../opener');

var _opener2 = _interopRequireDefault(_opener);

'use babel';

var AtomPdfOpener = (function (_Opener) {
  _inherits(AtomPdfOpener, _Opener);

  function AtomPdfOpener() {
    _classCallCheck(this, AtomPdfOpener);

    _get(Object.getPrototypeOf(AtomPdfOpener.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(AtomPdfOpener, [{
    key: 'open',
    value: function open(filePath, texPath, lineNumber, callback) {
      // Opens PDF in a new pane -- requires pdf-view module

      function forwardSync(pdfView) {
        if (pdfView != null && pdfView.forwardSync != null) {
          pdfView.forwardSync(texPath, lineNumber);
        }
      }

      var openPaneItems = atom.workspace.getPaneItems();
      for (var openPaneItem of openPaneItems) {
        // File is already open in another pane
        if (openPaneItem.filePath === filePath) {
          forwardSync(openPaneItem);
          return;
        }
      }

      // TODO: Make this configurable?
      atom.workspace.open(filePath, { 'split': 'right' }).then(forwardSync);

      // TODO: Check for actual success?
      if (callback) {
        callback(0);
      }
    }
  }]);

  return AtomPdfOpener;
})(_opener2['default']);

exports['default'] = AtomPdfOpener;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL29wZW5lcnMvYXRvbXBkZi1vcGVuZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7c0JBRW1CLFdBQVc7Ozs7QUFGOUIsV0FBVyxDQUFBOztJQUlVLGFBQWE7WUFBYixhQUFhOztXQUFiLGFBQWE7MEJBQWIsYUFBYTs7K0JBQWIsYUFBYTs7O2VBQWIsYUFBYTs7V0FDM0IsY0FBQyxRQUFRLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUU7OztBQUc3QyxlQUFTLFdBQVcsQ0FBRSxPQUFPLEVBQUU7QUFDN0IsWUFBSSxPQUFPLElBQUksSUFBSSxJQUFJLE9BQU8sQ0FBQyxXQUFXLElBQUksSUFBSSxFQUFFO0FBQ2xELGlCQUFPLENBQUMsV0FBVyxDQUFDLE9BQU8sRUFBRSxVQUFVLENBQUMsQ0FBQTtTQUN6QztPQUNGOztBQUVELFVBQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsWUFBWSxFQUFFLENBQUE7QUFDbkQsV0FBSyxJQUFNLFlBQVksSUFBSSxhQUFhLEVBQUU7O0FBRXhDLFlBQUksWUFBWSxDQUFDLFFBQVEsS0FBSyxRQUFRLEVBQUU7QUFDdEMscUJBQVcsQ0FBQyxZQUFZLENBQUMsQ0FBQTtBQUN6QixpQkFBTTtTQUNQO09BQ0Y7OztBQUdELFVBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxFQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQTs7O0FBR25FLFVBQUksUUFBUSxFQUFFO0FBQ1osZ0JBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQTtPQUNaO0tBQ0Y7OztTQTFCa0IsYUFBYTs7O3FCQUFiLGFBQWEiLCJmaWxlIjoiL2hvbWUvY2luX2NoYWxpYy8uYXRvbS9wYWNrYWdlcy9sYXRleC9saWIvb3BlbmVycy9hdG9tcGRmLW9wZW5lci5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmltcG9ydCBPcGVuZXIgZnJvbSAnLi4vb3BlbmVyJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBdG9tUGRmT3BlbmVyIGV4dGVuZHMgT3BlbmVyIHtcbiAgb3BlbiAoZmlsZVBhdGgsIHRleFBhdGgsIGxpbmVOdW1iZXIsIGNhbGxiYWNrKSB7XG4gICAgLy8gT3BlbnMgUERGIGluIGEgbmV3IHBhbmUgLS0gcmVxdWlyZXMgcGRmLXZpZXcgbW9kdWxlXG5cbiAgICBmdW5jdGlvbiBmb3J3YXJkU3luYyAocGRmVmlldykge1xuICAgICAgaWYgKHBkZlZpZXcgIT0gbnVsbCAmJiBwZGZWaWV3LmZvcndhcmRTeW5jICE9IG51bGwpIHtcbiAgICAgICAgcGRmVmlldy5mb3J3YXJkU3luYyh0ZXhQYXRoLCBsaW5lTnVtYmVyKVxuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IG9wZW5QYW5lSXRlbXMgPSBhdG9tLndvcmtzcGFjZS5nZXRQYW5lSXRlbXMoKVxuICAgIGZvciAoY29uc3Qgb3BlblBhbmVJdGVtIG9mIG9wZW5QYW5lSXRlbXMpIHtcbiAgICAgIC8vIEZpbGUgaXMgYWxyZWFkeSBvcGVuIGluIGFub3RoZXIgcGFuZVxuICAgICAgaWYgKG9wZW5QYW5lSXRlbS5maWxlUGF0aCA9PT0gZmlsZVBhdGgpIHtcbiAgICAgICAgZm9yd2FyZFN5bmMob3BlblBhbmVJdGVtKVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBUT0RPOiBNYWtlIHRoaXMgY29uZmlndXJhYmxlP1xuICAgIGF0b20ud29ya3NwYWNlLm9wZW4oZmlsZVBhdGgsIHsnc3BsaXQnOiAncmlnaHQnfSkudGhlbihmb3J3YXJkU3luYylcblxuICAgIC8vIFRPRE86IENoZWNrIGZvciBhY3R1YWwgc3VjY2Vzcz9cbiAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgIGNhbGxiYWNrKDApXG4gICAgfVxuICB9XG59XG4iXX0=
//# sourceURL=/home/cin_chalic/.atom/packages/latex/lib/openers/atompdf-opener.js
