Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

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
      var openPanes = atom.workspace.getPaneItems();
      for (var openPane of openPanes) {
        // File is already open in another pane
        if (openPane.filePath === filePath) {
          return;
        }
      }

      var pane = atom.workspace.getActivePane();
      // TODO: Make this configurable?
      // FIXME: Migrate to Pane::splitRight.
      var newPane = pane.split('horizontal', 'after');
      // FIXME: Use public API instead.
      atom.workspace.openURIInPane(filePath, newPane);

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL29wZW5lcnMvYXRvbXBkZi1vcGVuZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7c0JBRW1CLFdBQVc7Ozs7QUFGOUIsV0FBVyxDQUFBOztJQUlVLGFBQWE7WUFBYixhQUFhOztXQUFiLGFBQWE7MEJBQWIsYUFBYTs7K0JBQWIsYUFBYTs7O2VBQWIsYUFBYTs7V0FDM0IsY0FBQyxRQUFRLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUU7O0FBRTdDLFVBQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsWUFBWSxFQUFFLENBQUE7QUFDL0MsV0FBSyxJQUFNLFFBQVEsSUFBSSxTQUFTLEVBQUU7O0FBRWhDLFlBQUksUUFBUSxDQUFDLFFBQVEsS0FBSyxRQUFRLEVBQUU7QUFBRSxpQkFBTTtTQUFFO09BQy9DOztBQUVELFVBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxFQUFFLENBQUE7OztBQUczQyxVQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksRUFBRSxPQUFPLENBQUMsQ0FBQTs7QUFFakQsVUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFBOzs7QUFHL0MsVUFBSSxRQUFRLEVBQUU7QUFDWixnQkFBUSxDQUFDLENBQUMsQ0FBQyxDQUFBO09BQ1o7S0FDRjs7O1NBcEJrQixhQUFhOzs7cUJBQWIsYUFBYSIsImZpbGUiOiIvaG9tZS9jaW5fY2hhbGljLy5hdG9tL3BhY2thZ2VzL2xhdGV4L2xpYi9vcGVuZXJzL2F0b21wZGYtb3BlbmVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuaW1wb3J0IE9wZW5lciBmcm9tICcuLi9vcGVuZXInXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEF0b21QZGZPcGVuZXIgZXh0ZW5kcyBPcGVuZXIge1xuICBvcGVuIChmaWxlUGF0aCwgdGV4UGF0aCwgbGluZU51bWJlciwgY2FsbGJhY2spIHtcbiAgICAvLyBPcGVucyBQREYgaW4gYSBuZXcgcGFuZSAtLSByZXF1aXJlcyBwZGYtdmlldyBtb2R1bGVcbiAgICBjb25zdCBvcGVuUGFuZXMgPSBhdG9tLndvcmtzcGFjZS5nZXRQYW5lSXRlbXMoKVxuICAgIGZvciAoY29uc3Qgb3BlblBhbmUgb2Ygb3BlblBhbmVzKSB7XG4gICAgICAvLyBGaWxlIGlzIGFscmVhZHkgb3BlbiBpbiBhbm90aGVyIHBhbmVcbiAgICAgIGlmIChvcGVuUGFuZS5maWxlUGF0aCA9PT0gZmlsZVBhdGgpIHsgcmV0dXJuIH1cbiAgICB9XG5cbiAgICBjb25zdCBwYW5lID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZSgpXG4gICAgLy8gVE9ETzogTWFrZSB0aGlzIGNvbmZpZ3VyYWJsZT9cbiAgICAvLyBGSVhNRTogTWlncmF0ZSB0byBQYW5lOjpzcGxpdFJpZ2h0LlxuICAgIGNvbnN0IG5ld1BhbmUgPSBwYW5lLnNwbGl0KCdob3Jpem9udGFsJywgJ2FmdGVyJylcbiAgICAvLyBGSVhNRTogVXNlIHB1YmxpYyBBUEkgaW5zdGVhZC5cbiAgICBhdG9tLndvcmtzcGFjZS5vcGVuVVJJSW5QYW5lKGZpbGVQYXRoLCBuZXdQYW5lKVxuXG4gICAgLy8gVE9ETzogQ2hlY2sgZm9yIGFjdHVhbCBzdWNjZXNzP1xuICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgY2FsbGJhY2soMClcbiAgICB9XG4gIH1cbn1cbiJdfQ==
//# sourceURL=/home/cin_chalic/.atom/packages/latex/lib/openers/atompdf-opener.js
