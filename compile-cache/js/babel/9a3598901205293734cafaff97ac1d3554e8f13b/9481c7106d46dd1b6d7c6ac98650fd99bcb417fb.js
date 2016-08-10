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
      var args = ['--batch', '--pdf', '--tex-option="--synctex=1"', '--tex-option="--interaction=nonstopmode"',
      // Set logfile max line length.
      '--tex-option="--max-print-line=1000"'];

      var enableShellEscape = atom.config.get('latex.enableShellEscape');
      var engineFromMagic = this.getLatexEngineFromMagic(filePath);
      var customEngine = atom.config.get('latex.customEngine');
      var engine = atom.config.get('latex.engine');

      if (enableShellEscape) {
        args.push('--tex-option=--enable-write18');
      }

      if (engineFromMagic) {
        args.push('--engine="' + engineFromMagic + '"');
      } else if (customEngine) {
        args.push('--engine="' + customEngine + '"');
      } else if (engine && engine === 'xelatex') {
        args.push('--engine=xetex');
      } else if (engine && engine === 'lualatex') {
        args.push('--engine=luatex');
      }

      var outdir = this.getOutputDirectory(filePath);
      if (outdir) {
        atom.notifications.addWarning('Output directory functionality is poorly supported by texify, ' + 'so this functionality is disabled (for the foreseeable future) ' + 'when using the texify builder.');
      }

      args.push('"' + filePath + '"');
      return args;
    }
  }]);

  return TexifyBuilder;
})(_builder2['default']);

exports['default'] = TexifyBuilder;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL2J1aWxkZXJzL3RleGlmeS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs2QkFFMEIsZUFBZTs7OztvQkFDeEIsTUFBTTs7Ozt1QkFDSCxZQUFZOzs7O0FBSmhDLFdBQVcsQ0FBQTs7SUFNVSxhQUFhO1lBQWIsYUFBYTs7QUFDcEIsV0FETyxhQUFhLEdBQ2pCOzBCQURJLGFBQWE7O0FBRTlCLCtCQUZpQixhQUFhLDZDQUV2QjtBQUNQLFFBQUksQ0FBQyxVQUFVLEdBQUcsUUFBUSxDQUFBO0dBQzNCOztlQUprQixhQUFhOztXQU01QixhQUFDLFFBQVEsRUFBRTtBQUNiLFVBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUE7QUFDekMsVUFBTSxPQUFPLEdBQU0sSUFBSSxDQUFDLFVBQVUsU0FBSSxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxBQUFFLENBQUE7QUFDdEQsVUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLDRCQUE0QixFQUFFLENBQUE7O0FBRW5ELGFBQU8sQ0FBQyxHQUFHLEdBQUcsa0JBQUssT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFBO0FBQ3BDLGFBQU8sQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFBOztBQUU1QixhQUFPLElBQUksT0FBTyxDQUFDLFVBQUMsT0FBTyxFQUFLOztBQUU5QixtQ0FBYyxJQUFJLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxVQUFDLEtBQUssRUFBSztBQUM5QyxpQkFBTyxDQUFDLEFBQUMsS0FBSyxHQUFJLEtBQUssQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUE7U0FDbEMsQ0FBQyxDQUFBO09BQ0gsQ0FBQyxDQUFBO0tBQ0g7OztXQUVhLHVCQUFDLFFBQVEsRUFBRTtBQUN2QixVQUFNLElBQUksR0FBRyxDQUNYLFNBQVMsRUFDVCxPQUFPLEVBQ1AsNEJBQTRCLEVBQzVCLDBDQUEwQzs7QUFFMUMsNENBQXNDLENBQ3ZDLENBQUE7O0FBRUQsVUFBTSxpQkFBaUIsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFBO0FBQ3BFLFVBQU0sZUFBZSxHQUFHLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxRQUFRLENBQUMsQ0FBQTtBQUM5RCxVQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFBO0FBQzFELFVBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFBOztBQUU5QyxVQUFJLGlCQUFpQixFQUFFO0FBQ3JCLFlBQUksQ0FBQyxJQUFJLENBQUMsK0JBQStCLENBQUMsQ0FBQTtPQUMzQzs7QUFFRCxVQUFJLGVBQWUsRUFBRTtBQUNuQixZQUFJLENBQUMsSUFBSSxnQkFBYyxlQUFlLE9BQUksQ0FBQTtPQUMzQyxNQUFNLElBQUksWUFBWSxFQUFFO0FBQ3ZCLFlBQUksQ0FBQyxJQUFJLGdCQUFjLFlBQVksT0FBSSxDQUFBO09BQ3hDLE1BQU0sSUFBSSxNQUFNLElBQUksTUFBTSxLQUFLLFNBQVMsRUFBRTtBQUN6QyxZQUFJLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUE7T0FDNUIsTUFBTSxJQUFJLE1BQU0sSUFBSSxNQUFNLEtBQUssVUFBVSxFQUFFO0FBQzFDLFlBQUksQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQTtPQUM3Qjs7QUFFRCxVQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsUUFBUSxDQUFDLENBQUE7QUFDOUMsVUFBSSxNQUFNLEVBQUU7QUFDVixZQUFJLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FDM0IsZ0VBQWdFLEdBQ2hFLGlFQUFpRSxHQUNqRSxnQ0FBZ0MsQ0FDakMsQ0FBQTtPQUNGOztBQUVELFVBQUksQ0FBQyxJQUFJLE9BQUssUUFBUSxPQUFJLENBQUE7QUFDMUIsYUFBTyxJQUFJLENBQUE7S0FDWjs7O1NBOURrQixhQUFhOzs7cUJBQWIsYUFBYSIsImZpbGUiOiIvaG9tZS9jaW5fY2hhbGljLy5hdG9tL3BhY2thZ2VzL2xhdGV4L2xpYi9idWlsZGVycy90ZXhpZnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5pbXBvcnQgY2hpbGRfcHJvY2VzcyBmcm9tICdjaGlsZF9wcm9jZXNzJ1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcbmltcG9ydCBCdWlsZGVyIGZyb20gJy4uL2J1aWxkZXInXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRleGlmeUJ1aWxkZXIgZXh0ZW5kcyBCdWlsZGVyIHtcbiAgY29uc3RydWN0b3IgKCkge1xuICAgIHN1cGVyKClcbiAgICB0aGlzLmV4ZWN1dGFibGUgPSAndGV4aWZ5J1xuICB9XG5cbiAgcnVuIChmaWxlUGF0aCkge1xuICAgIGNvbnN0IGFyZ3MgPSB0aGlzLmNvbnN0cnVjdEFyZ3MoZmlsZVBhdGgpXG4gICAgY29uc3QgY29tbWFuZCA9IGAke3RoaXMuZXhlY3V0YWJsZX0gJHthcmdzLmpvaW4oJyAnKX1gXG4gICAgY29uc3Qgb3B0aW9ucyA9IHRoaXMuY29uc3RydWN0Q2hpbGRQcm9jZXNzT3B0aW9ucygpXG5cbiAgICBvcHRpb25zLmN3ZCA9IHBhdGguZGlybmFtZShmaWxlUGF0aCkgLy8gUnVuIHByb2Nlc3Mgd2l0aCBzZW5zaWJsZSBDV0QuXG4gICAgb3B0aW9ucy5tYXhCdWZmZXIgPSA1MjQyODgwMCAvLyBTZXQgcHJvY2VzcycgbWF4IGJ1ZmZlciBzaXplIHRvIDUwIE1CLlxuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAvLyBUT0RPOiBBZGQgc3VwcG9ydCBmb3Iga2lsbGluZyB0aGUgcHJvY2Vzcy5cbiAgICAgIGNoaWxkX3Byb2Nlc3MuZXhlYyhjb21tYW5kLCBvcHRpb25zLCAoZXJyb3IpID0+IHtcbiAgICAgICAgcmVzb2x2ZSgoZXJyb3IpID8gZXJyb3IuY29kZSA6IDApXG4gICAgICB9KVxuICAgIH0pXG4gIH1cblxuICBjb25zdHJ1Y3RBcmdzIChmaWxlUGF0aCkge1xuICAgIGNvbnN0IGFyZ3MgPSBbXG4gICAgICAnLS1iYXRjaCcsXG4gICAgICAnLS1wZGYnLFxuICAgICAgJy0tdGV4LW9wdGlvbj1cIi0tc3luY3RleD0xXCInLFxuICAgICAgJy0tdGV4LW9wdGlvbj1cIi0taW50ZXJhY3Rpb249bm9uc3RvcG1vZGVcIicsXG4gICAgICAvLyBTZXQgbG9nZmlsZSBtYXggbGluZSBsZW5ndGguXG4gICAgICAnLS10ZXgtb3B0aW9uPVwiLS1tYXgtcHJpbnQtbGluZT0xMDAwXCInXG4gICAgXVxuXG4gICAgY29uc3QgZW5hYmxlU2hlbGxFc2NhcGUgPSBhdG9tLmNvbmZpZy5nZXQoJ2xhdGV4LmVuYWJsZVNoZWxsRXNjYXBlJylcbiAgICBjb25zdCBlbmdpbmVGcm9tTWFnaWMgPSB0aGlzLmdldExhdGV4RW5naW5lRnJvbU1hZ2ljKGZpbGVQYXRoKVxuICAgIGNvbnN0IGN1c3RvbUVuZ2luZSA9IGF0b20uY29uZmlnLmdldCgnbGF0ZXguY3VzdG9tRW5naW5lJylcbiAgICBjb25zdCBlbmdpbmUgPSBhdG9tLmNvbmZpZy5nZXQoJ2xhdGV4LmVuZ2luZScpXG5cbiAgICBpZiAoZW5hYmxlU2hlbGxFc2NhcGUpIHtcbiAgICAgIGFyZ3MucHVzaCgnLS10ZXgtb3B0aW9uPS0tZW5hYmxlLXdyaXRlMTgnKVxuICAgIH1cblxuICAgIGlmIChlbmdpbmVGcm9tTWFnaWMpIHtcbiAgICAgIGFyZ3MucHVzaChgLS1lbmdpbmU9XCIke2VuZ2luZUZyb21NYWdpY31cImApXG4gICAgfSBlbHNlIGlmIChjdXN0b21FbmdpbmUpIHtcbiAgICAgIGFyZ3MucHVzaChgLS1lbmdpbmU9XCIke2N1c3RvbUVuZ2luZX1cImApXG4gICAgfSBlbHNlIGlmIChlbmdpbmUgJiYgZW5naW5lID09PSAneGVsYXRleCcpIHtcbiAgICAgIGFyZ3MucHVzaCgnLS1lbmdpbmU9eGV0ZXgnKVxuICAgIH0gZWxzZSBpZiAoZW5naW5lICYmIGVuZ2luZSA9PT0gJ2x1YWxhdGV4Jykge1xuICAgICAgYXJncy5wdXNoKCctLWVuZ2luZT1sdWF0ZXgnKVxuICAgIH1cblxuICAgIGxldCBvdXRkaXIgPSB0aGlzLmdldE91dHB1dERpcmVjdG9yeShmaWxlUGF0aClcbiAgICBpZiAob3V0ZGlyKSB7XG4gICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkV2FybmluZyhcbiAgICAgICAgJ091dHB1dCBkaXJlY3RvcnkgZnVuY3Rpb25hbGl0eSBpcyBwb29ybHkgc3VwcG9ydGVkIGJ5IHRleGlmeSwgJyArXG4gICAgICAgICdzbyB0aGlzIGZ1bmN0aW9uYWxpdHkgaXMgZGlzYWJsZWQgKGZvciB0aGUgZm9yZXNlZWFibGUgZnV0dXJlKSAnICtcbiAgICAgICAgJ3doZW4gdXNpbmcgdGhlIHRleGlmeSBidWlsZGVyLidcbiAgICAgIClcbiAgICB9XG5cbiAgICBhcmdzLnB1c2goYFwiJHtmaWxlUGF0aH1cImApXG4gICAgcmV0dXJuIGFyZ3NcbiAgfVxufVxuIl19
//# sourceURL=/home/cin_chalic/.atom/packages/latex/lib/builders/texify.js
