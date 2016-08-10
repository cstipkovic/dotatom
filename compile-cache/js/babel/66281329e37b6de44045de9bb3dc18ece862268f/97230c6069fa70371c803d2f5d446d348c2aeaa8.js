'use babel';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var ErrorMarker = (function () {
  function ErrorMarker(editor, errors, warnings) {
    _classCallCheck(this, ErrorMarker);

    this.editor = editor;
    this.errors = errors;
    this.warnings = warnings;
    this.markers = [];
    this.mark();
  }

  _createClass(ErrorMarker, [{
    key: 'mark',
    value: function mark() {
      for (var error of this.errors) {
        this.markRow(error.lineNumber - 1, 'latex-error');
      }
      for (var warning of this.warnings) {
        this.markRow(warning.lineNumber - 1, 'latex-warning');
      }
    }
  }, {
    key: 'markRow',
    value: function markRow(row, colour) {
      var column = this.editor.buffer.lineLengthForRow(row);
      var marker = this.editor.markBufferRange([[row, 0], [row, column]], { invalidate: 'touch' });
      this.editor.decorateMarker(marker, { type: 'line-number', 'class': colour });
      this.markers.push(marker);
    }
  }, {
    key: 'clear',
    value: function clear() {
      for (var marker of this.markers) {
        marker.destroy();
      }
    }
  }]);

  return ErrorMarker;
})();

exports['default'] = ErrorMarker;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL2Vycm9yLW1hcmtlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxXQUFXLENBQUE7Ozs7Ozs7Ozs7SUFFVSxXQUFXO0FBQ2xCLFdBRE8sV0FBVyxDQUNqQixNQUFNLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRTswQkFEcEIsV0FBVzs7QUFFNUIsUUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUE7QUFDcEIsUUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUE7QUFDcEIsUUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUE7QUFDeEIsUUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUE7QUFDakIsUUFBSSxDQUFDLElBQUksRUFBRSxDQUFBO0dBQ1o7O2VBUGtCLFdBQVc7O1dBU3pCLGdCQUFHO0FBQ04sV0FBSyxJQUFJLEtBQUssSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO0FBQzdCLFlBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLFVBQVUsR0FBRyxDQUFDLEVBQUUsYUFBYSxDQUFDLENBQUE7T0FDbEQ7QUFDRCxXQUFLLElBQUksT0FBTyxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7QUFDakMsWUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsVUFBVSxHQUFHLENBQUMsRUFBRSxlQUFlLENBQUMsQ0FBQTtPQUN0RDtLQUNGOzs7V0FFTyxpQkFBQyxHQUFHLEVBQUUsTUFBTSxFQUFFO0FBQ3BCLFVBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxDQUFBO0FBQ3ZELFVBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsTUFBTSxDQUFDLENBQUMsRUFBRSxFQUFDLFVBQVUsRUFBRSxPQUFPLEVBQUMsQ0FBQyxDQUFBO0FBQzVGLFVBQUksQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFBRSxFQUFDLElBQUksRUFBRSxhQUFhLEVBQUUsU0FBTyxNQUFNLEVBQUMsQ0FBQyxDQUFBO0FBQ3hFLFVBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFBO0tBQzFCOzs7V0FFSyxpQkFBRztBQUNQLFdBQUssSUFBSSxNQUFNLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtBQUMvQixjQUFNLENBQUMsT0FBTyxFQUFFLENBQUE7T0FDakI7S0FDRjs7O1NBN0JrQixXQUFXOzs7cUJBQVgsV0FBVyIsImZpbGUiOiIvaG9tZS9jaW5fY2hhbGljLy5hdG9tL3BhY2thZ2VzL2xhdGV4L2xpYi9lcnJvci1tYXJrZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFcnJvck1hcmtlciB7XG4gIGNvbnN0cnVjdG9yIChlZGl0b3IsIGVycm9ycywgd2FybmluZ3MpIHtcbiAgICB0aGlzLmVkaXRvciA9IGVkaXRvclxuICAgIHRoaXMuZXJyb3JzID0gZXJyb3JzXG4gICAgdGhpcy53YXJuaW5ncyA9IHdhcm5pbmdzXG4gICAgdGhpcy5tYXJrZXJzID0gW11cbiAgICB0aGlzLm1hcmsoKVxuICB9XG5cbiAgbWFyayAoKSB7XG4gICAgZm9yIChsZXQgZXJyb3Igb2YgdGhpcy5lcnJvcnMpIHtcbiAgICAgIHRoaXMubWFya1JvdyhlcnJvci5saW5lTnVtYmVyIC0gMSwgJ2xhdGV4LWVycm9yJylcbiAgICB9XG4gICAgZm9yIChsZXQgd2FybmluZyBvZiB0aGlzLndhcm5pbmdzKSB7XG4gICAgICB0aGlzLm1hcmtSb3cod2FybmluZy5saW5lTnVtYmVyIC0gMSwgJ2xhdGV4LXdhcm5pbmcnKVxuICAgIH1cbiAgfVxuXG4gIG1hcmtSb3cgKHJvdywgY29sb3VyKSB7XG4gICAgY29uc3QgY29sdW1uID0gdGhpcy5lZGl0b3IuYnVmZmVyLmxpbmVMZW5ndGhGb3JSb3cocm93KVxuICAgIGNvbnN0IG1hcmtlciA9IHRoaXMuZWRpdG9yLm1hcmtCdWZmZXJSYW5nZShbW3JvdywgMF0sIFtyb3csIGNvbHVtbl1dLCB7aW52YWxpZGF0ZTogJ3RvdWNoJ30pXG4gICAgdGhpcy5lZGl0b3IuZGVjb3JhdGVNYXJrZXIobWFya2VyLCB7dHlwZTogJ2xpbmUtbnVtYmVyJywgY2xhc3M6IGNvbG91cn0pXG4gICAgdGhpcy5tYXJrZXJzLnB1c2gobWFya2VyKVxuICB9XG5cbiAgY2xlYXIgKCkge1xuICAgIGZvciAobGV0IG1hcmtlciBvZiB0aGlzLm1hcmtlcnMpIHtcbiAgICAgIG1hcmtlci5kZXN0cm95KClcbiAgICB9XG4gIH1cbn1cbiJdfQ==
//# sourceURL=/home/cin_chalic/.atom/packages/latex/lib/error-marker.js
