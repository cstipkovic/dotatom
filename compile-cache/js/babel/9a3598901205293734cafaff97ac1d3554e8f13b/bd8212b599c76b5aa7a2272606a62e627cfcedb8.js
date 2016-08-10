Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _builder = require('../builder');

var _builder2 = _interopRequireDefault(_builder);

'use babel';

var TexifyBuilder = (function (_Builder) {
  _inherits(TexifyBuilder, _Builder);

  function TexifyBuilder() {
    _classCallCheck(this, TexifyBuilder);

    _get(Object.getPrototypeOf(TexifyBuilder.prototype), 'constructor', this).call(this);
    this.executable = 'texify';
  }

  _createClass(TexifyBuilder, [{
    key: 'run',
    value: function run(filePath) {
      var args = this.constructArgs(filePath);
      var command = this.executable + ' ' + args.join(' ');
      var options = this.constructChildProcessOptions();

      options.cwd = _path2['default'].dirname(filePath); // Run process with sensible CWD.
      options.maxBuffer = 52428800; // Set process' max buffer size to 50 MB.

      return new Promise(function (resolve) {
        // TODO: Add support for killing the process.
        _child_process2['default'].exec(command, options, function (error) {
          resolve(error ? error.code : 0);
        });
      });
    }
  }, {
    key: 'constructArgs',
    value: function constructArgs(filePath) {
      var args = ['--batch', '--pdf', '--tex-option=--synctex=1',
      // Set logfile max line length.
      '--tex-option=--max-print-line=1000'];

      var enableShellEscape = atom.config.get('latex.enableShellEscape');
      if (enableShellEscape) {
        args.push('--tex-option=--enable-write18');
      }

      var customEngine = atom.config.get('latex.customEngine');
      var engine = atom.config.get('latex.engine');
      if (customEngine || engine !== 'pdflatex') {
        atom.notifications.addWarning('Engine customization is not supported by texify, ' + 'so this functionality is disabled when using the texify builder.');
      }

      var outdir = this.getOutputDirectory(filePath);
      if (outdir) {
        atom.notifications.addWarning('Output directory functionality is poorly supported by texify, ' + 'so this functionality is disabled (for the foreseeable future) ' + 'when using the texify builder.');
      }

      args.push('\'' + filePath + '\'');
      return args;
    }
  }]);

  return TexifyBuilder;
})(_builder2['default']);

exports['default'] = TexifyBuilder;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL2J1aWxkZXJzL3RleGlmeS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs2QkFFMEIsZUFBZTs7OztvQkFDeEIsTUFBTTs7Ozt1QkFDSCxZQUFZOzs7O0FBSmhDLFdBQVcsQ0FBQTs7SUFNVSxhQUFhO1lBQWIsYUFBYTs7QUFDcEIsV0FETyxhQUFhLEdBQ2pCOzBCQURJLGFBQWE7O0FBRTlCLCtCQUZpQixhQUFhLDZDQUV2QjtBQUNQLFFBQUksQ0FBQyxVQUFVLEdBQUcsUUFBUSxDQUFBO0dBQzNCOztlQUprQixhQUFhOztXQU01QixhQUFDLFFBQVEsRUFBRTtBQUNiLFVBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUE7QUFDekMsVUFBTSxPQUFPLEdBQU0sSUFBSSxDQUFDLFVBQVUsU0FBSSxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxBQUFFLENBQUE7QUFDdEQsVUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLDRCQUE0QixFQUFFLENBQUE7O0FBRW5ELGFBQU8sQ0FBQyxHQUFHLEdBQUcsa0JBQUssT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFBO0FBQ3BDLGFBQU8sQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFBOztBQUU1QixhQUFPLElBQUksT0FBTyxDQUFDLFVBQUMsT0FBTyxFQUFLOztBQUU5QixtQ0FBYyxJQUFJLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxVQUFDLEtBQUssRUFBSztBQUM5QyxpQkFBTyxDQUFDLEFBQUMsS0FBSyxHQUFJLEtBQUssQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUE7U0FDbEMsQ0FBQyxDQUFBO09BQ0gsQ0FBQyxDQUFBO0tBQ0g7OztXQUVhLHVCQUFDLFFBQVEsRUFBRTtBQUN2QixVQUFNLElBQUksR0FBRyxDQUNYLFNBQVMsRUFDVCxPQUFPLEVBQ1AsMEJBQTBCOztBQUUxQiwwQ0FBb0MsQ0FDckMsQ0FBQTs7QUFFRCxVQUFNLGlCQUFpQixHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLHlCQUF5QixDQUFDLENBQUE7QUFDcEUsVUFBSSxpQkFBaUIsRUFBRTtBQUNyQixZQUFJLENBQUMsSUFBSSxDQUFDLCtCQUErQixDQUFDLENBQUE7T0FDM0M7O0FBRUQsVUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsb0JBQW9CLENBQUMsQ0FBQTtBQUMxRCxVQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQTtBQUM5QyxVQUFJLFlBQVksSUFBSSxNQUFNLEtBQUssVUFBVSxFQUFFO0FBQ3pDLFlBQUksQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUMzQixtREFBbUQsR0FDbkQsa0VBQWtFLENBQ25FLENBQUE7T0FDRjs7QUFFRCxVQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsUUFBUSxDQUFDLENBQUE7QUFDOUMsVUFBSSxNQUFNLEVBQUU7QUFDVixZQUFJLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FDM0IsZ0VBQWdFLEdBQ2hFLGlFQUFpRSxHQUNqRSxnQ0FBZ0MsQ0FDakMsQ0FBQTtPQUNGOztBQUVELFVBQUksQ0FBQyxJQUFJLFFBQU0sUUFBUSxRQUFLLENBQUE7QUFDNUIsYUFBTyxJQUFJLENBQUE7S0FDWjs7O1NBeERrQixhQUFhOzs7cUJBQWIsYUFBYSIsImZpbGUiOiIvaG9tZS9jaW5fY2hhbGljLy5hdG9tL3BhY2thZ2VzL2xhdGV4L2xpYi9idWlsZGVycy90ZXhpZnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5pbXBvcnQgY2hpbGRfcHJvY2VzcyBmcm9tICdjaGlsZF9wcm9jZXNzJ1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcbmltcG9ydCBCdWlsZGVyIGZyb20gJy4uL2J1aWxkZXInXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRleGlmeUJ1aWxkZXIgZXh0ZW5kcyBCdWlsZGVyIHtcbiAgY29uc3RydWN0b3IgKCkge1xuICAgIHN1cGVyKClcbiAgICB0aGlzLmV4ZWN1dGFibGUgPSAndGV4aWZ5J1xuICB9XG5cbiAgcnVuIChmaWxlUGF0aCkge1xuICAgIGNvbnN0IGFyZ3MgPSB0aGlzLmNvbnN0cnVjdEFyZ3MoZmlsZVBhdGgpXG4gICAgY29uc3QgY29tbWFuZCA9IGAke3RoaXMuZXhlY3V0YWJsZX0gJHthcmdzLmpvaW4oJyAnKX1gXG4gICAgY29uc3Qgb3B0aW9ucyA9IHRoaXMuY29uc3RydWN0Q2hpbGRQcm9jZXNzT3B0aW9ucygpXG5cbiAgICBvcHRpb25zLmN3ZCA9IHBhdGguZGlybmFtZShmaWxlUGF0aCkgLy8gUnVuIHByb2Nlc3Mgd2l0aCBzZW5zaWJsZSBDV0QuXG4gICAgb3B0aW9ucy5tYXhCdWZmZXIgPSA1MjQyODgwMCAvLyBTZXQgcHJvY2VzcycgbWF4IGJ1ZmZlciBzaXplIHRvIDUwIE1CLlxuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAvLyBUT0RPOiBBZGQgc3VwcG9ydCBmb3Iga2lsbGluZyB0aGUgcHJvY2Vzcy5cbiAgICAgIGNoaWxkX3Byb2Nlc3MuZXhlYyhjb21tYW5kLCBvcHRpb25zLCAoZXJyb3IpID0+IHtcbiAgICAgICAgcmVzb2x2ZSgoZXJyb3IpID8gZXJyb3IuY29kZSA6IDApXG4gICAgICB9KVxuICAgIH0pXG4gIH1cblxuICBjb25zdHJ1Y3RBcmdzIChmaWxlUGF0aCkge1xuICAgIGNvbnN0IGFyZ3MgPSBbXG4gICAgICAnLS1iYXRjaCcsXG4gICAgICAnLS1wZGYnLFxuICAgICAgJy0tdGV4LW9wdGlvbj0tLXN5bmN0ZXg9MScsXG4gICAgICAvLyBTZXQgbG9nZmlsZSBtYXggbGluZSBsZW5ndGguXG4gICAgICAnLS10ZXgtb3B0aW9uPS0tbWF4LXByaW50LWxpbmU9MTAwMCdcbiAgICBdXG5cbiAgICBjb25zdCBlbmFibGVTaGVsbEVzY2FwZSA9IGF0b20uY29uZmlnLmdldCgnbGF0ZXguZW5hYmxlU2hlbGxFc2NhcGUnKVxuICAgIGlmIChlbmFibGVTaGVsbEVzY2FwZSkge1xuICAgICAgYXJncy5wdXNoKCctLXRleC1vcHRpb249LS1lbmFibGUtd3JpdGUxOCcpXG4gICAgfVxuXG4gICAgY29uc3QgY3VzdG9tRW5naW5lID0gYXRvbS5jb25maWcuZ2V0KCdsYXRleC5jdXN0b21FbmdpbmUnKVxuICAgIGNvbnN0IGVuZ2luZSA9IGF0b20uY29uZmlnLmdldCgnbGF0ZXguZW5naW5lJylcbiAgICBpZiAoY3VzdG9tRW5naW5lIHx8IGVuZ2luZSAhPT0gJ3BkZmxhdGV4Jykge1xuICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZFdhcm5pbmcoXG4gICAgICAgICdFbmdpbmUgY3VzdG9taXphdGlvbiBpcyBub3Qgc3VwcG9ydGVkIGJ5IHRleGlmeSwgJyArXG4gICAgICAgICdzbyB0aGlzIGZ1bmN0aW9uYWxpdHkgaXMgZGlzYWJsZWQgd2hlbiB1c2luZyB0aGUgdGV4aWZ5IGJ1aWxkZXIuJ1xuICAgICAgKVxuICAgIH1cblxuICAgIGxldCBvdXRkaXIgPSB0aGlzLmdldE91dHB1dERpcmVjdG9yeShmaWxlUGF0aClcbiAgICBpZiAob3V0ZGlyKSB7XG4gICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkV2FybmluZyhcbiAgICAgICAgJ091dHB1dCBkaXJlY3RvcnkgZnVuY3Rpb25hbGl0eSBpcyBwb29ybHkgc3VwcG9ydGVkIGJ5IHRleGlmeSwgJyArXG4gICAgICAgICdzbyB0aGlzIGZ1bmN0aW9uYWxpdHkgaXMgZGlzYWJsZWQgKGZvciB0aGUgZm9yZXNlZWFibGUgZnV0dXJlKSAnICtcbiAgICAgICAgJ3doZW4gdXNpbmcgdGhlIHRleGlmeSBidWlsZGVyLidcbiAgICAgIClcbiAgICB9XG5cbiAgICBhcmdzLnB1c2goYFxcJyR7ZmlsZVBhdGh9XFwnYClcbiAgICByZXR1cm4gYXJnc1xuICB9XG59XG4iXX0=
//# sourceURL=/home/cin_chalic/.atom/packages/latex/lib/builders/texify.js
