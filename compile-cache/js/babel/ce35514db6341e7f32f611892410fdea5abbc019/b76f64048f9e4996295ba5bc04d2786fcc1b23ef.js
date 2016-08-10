Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

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

    _get(Object.getPrototypeOf(TexifyBuilder.prototype), 'constructor', this).apply(this, arguments);

    this.executable = 'texify';
  }

  _createClass(TexifyBuilder, [{
    key: 'run',
    value: function run(filePath, jobname) {
      var args = this.constructArgs(filePath, jobname);
      var command = this.executable + ' ' + args.join(' ');
      var options = this.constructChildProcessOptions(filePath);

      return new Promise(function (resolve) {
        // TODO: Add support for killing the process.
        _child_process2['default'].exec(command, options, function (error) {
          resolve(error ? error.code : 0);
        });
      });
    }
  }, {
    key: 'constructArgs',
    value: function constructArgs(filePath, jobname) {
      var args = ['--batch', '--pdf', '--tex-option="--interaction=nonstopmode"',
      // Set logfile max line length.
      '--tex-option="--max-print-line=1000"'];

      var enableShellEscape = atom.config.get('latex.enableShellEscape');
      var enableSynctex = atom.config.get('latex.enableSynctex') !== false;
      var engineFromMagic = this.getLatexEngineFromMagic(filePath);
      var customEngine = atom.config.get('latex.customEngine');
      var engine = atom.config.get('latex.engine');

      if (jobname) {
        args.push('--tex-option="--job-name=' + jobname + '"');
      }
      if (enableShellEscape) {
        args.push('--tex-option=--enable-write18');
      }
      if (enableSynctex) {
        args.push('--tex-option="--synctex=1"');
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
  }], [{
    key: 'canProcess',
    value: function canProcess(filePath) {
      return _path2['default'].extname(filePath) === '.tex';
    }
  }]);

  return TexifyBuilder;
})(_builder2['default']);

exports['default'] = TexifyBuilder;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL2J1aWxkZXJzL3RleGlmeS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs2QkFFeUIsZUFBZTs7OztvQkFDdkIsTUFBTTs7Ozt1QkFDSCxZQUFZOzs7O0FBSmhDLFdBQVcsQ0FBQTs7SUFNVSxhQUFhO1lBQWIsYUFBYTs7V0FBYixhQUFhOzBCQUFiLGFBQWE7OytCQUFiLGFBQWE7O1NBQ2hDLFVBQVUsR0FBRyxRQUFROzs7ZUFERixhQUFhOztXQU81QixhQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUU7QUFDdEIsVUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUE7QUFDbEQsVUFBTSxPQUFPLEdBQU0sSUFBSSxDQUFDLFVBQVUsU0FBSSxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxBQUFFLENBQUE7QUFDdEQsVUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLDRCQUE0QixDQUFDLFFBQVEsQ0FBQyxDQUFBOztBQUUzRCxhQUFPLElBQUksT0FBTyxDQUFDLFVBQUMsT0FBTyxFQUFLOztBQUU5QixtQ0FBYSxJQUFJLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxVQUFDLEtBQUssRUFBSztBQUM3QyxpQkFBTyxDQUFDLEFBQUMsS0FBSyxHQUFJLEtBQUssQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUE7U0FDbEMsQ0FBQyxDQUFBO09BQ0gsQ0FBQyxDQUFBO0tBQ0g7OztXQUVhLHVCQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUU7QUFDaEMsVUFBTSxJQUFJLEdBQUcsQ0FDWCxTQUFTLEVBQ1QsT0FBTyxFQUNQLDBDQUEwQzs7QUFFMUMsNENBQXNDLENBQ3ZDLENBQUE7O0FBRUQsVUFBTSxpQkFBaUIsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFBO0FBQ3BFLFVBQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLHFCQUFxQixDQUFDLEtBQUssS0FBSyxDQUFBO0FBQ3RFLFVBQU0sZUFBZSxHQUFHLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxRQUFRLENBQUMsQ0FBQTtBQUM5RCxVQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFBO0FBQzFELFVBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFBOztBQUU5QyxVQUFJLE9BQU8sRUFBRTtBQUNYLFlBQUksQ0FBQyxJQUFJLCtCQUE2QixPQUFPLE9BQUksQ0FBQTtPQUNsRDtBQUNELFVBQUksaUJBQWlCLEVBQUU7QUFDckIsWUFBSSxDQUFDLElBQUksQ0FBQywrQkFBK0IsQ0FBQyxDQUFBO09BQzNDO0FBQ0QsVUFBSSxhQUFhLEVBQUU7QUFDakIsWUFBSSxDQUFDLElBQUksQ0FBQyw0QkFBNEIsQ0FBQyxDQUFBO09BQ3hDOztBQUVELFVBQUksZUFBZSxFQUFFO0FBQ25CLFlBQUksQ0FBQyxJQUFJLGdCQUFjLGVBQWUsT0FBSSxDQUFBO09BQzNDLE1BQU0sSUFBSSxZQUFZLEVBQUU7QUFDdkIsWUFBSSxDQUFDLElBQUksZ0JBQWMsWUFBWSxPQUFJLENBQUE7T0FDeEMsTUFBTSxJQUFJLE1BQU0sSUFBSSxNQUFNLEtBQUssU0FBUyxFQUFFO0FBQ3pDLFlBQUksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQTtPQUM1QixNQUFNLElBQUksTUFBTSxJQUFJLE1BQU0sS0FBSyxVQUFVLEVBQUU7QUFDMUMsWUFBSSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFBO09BQzdCOztBQUVELFVBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxRQUFRLENBQUMsQ0FBQTtBQUM5QyxVQUFJLE1BQU0sRUFBRTtBQUNWLFlBQUksQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUMzQixnRUFBZ0UsR0FDaEUsaUVBQWlFLEdBQ2pFLGdDQUFnQyxDQUNqQyxDQUFBO09BQ0Y7O0FBRUQsVUFBSSxDQUFDLElBQUksT0FBSyxRQUFRLE9BQUksQ0FBQTtBQUMxQixhQUFPLElBQUksQ0FBQTtLQUNaOzs7V0EvRGlCLG9CQUFDLFFBQVEsRUFBRTtBQUMzQixhQUFPLGtCQUFLLE9BQU8sQ0FBQyxRQUFRLENBQUMsS0FBSyxNQUFNLENBQUE7S0FDekM7OztTQUxrQixhQUFhOzs7cUJBQWIsYUFBYSIsImZpbGUiOiIvaG9tZS9jaW5fY2hhbGljLy5hdG9tL3BhY2thZ2VzL2xhdGV4L2xpYi9idWlsZGVycy90ZXhpZnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5pbXBvcnQgY2hpbGRQcm9jZXNzIGZyb20gJ2NoaWxkX3Byb2Nlc3MnXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IEJ1aWxkZXIgZnJvbSAnLi4vYnVpbGRlcidcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGV4aWZ5QnVpbGRlciBleHRlbmRzIEJ1aWxkZXIge1xuICBleGVjdXRhYmxlID0gJ3RleGlmeSdcblxuICBzdGF0aWMgY2FuUHJvY2VzcyAoZmlsZVBhdGgpIHtcbiAgICByZXR1cm4gcGF0aC5leHRuYW1lKGZpbGVQYXRoKSA9PT0gJy50ZXgnXG4gIH1cblxuICBydW4gKGZpbGVQYXRoLCBqb2JuYW1lKSB7XG4gICAgY29uc3QgYXJncyA9IHRoaXMuY29uc3RydWN0QXJncyhmaWxlUGF0aCwgam9ibmFtZSlcbiAgICBjb25zdCBjb21tYW5kID0gYCR7dGhpcy5leGVjdXRhYmxlfSAke2FyZ3Muam9pbignICcpfWBcbiAgICBjb25zdCBvcHRpb25zID0gdGhpcy5jb25zdHJ1Y3RDaGlsZFByb2Nlc3NPcHRpb25zKGZpbGVQYXRoKVxuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAvLyBUT0RPOiBBZGQgc3VwcG9ydCBmb3Iga2lsbGluZyB0aGUgcHJvY2Vzcy5cbiAgICAgIGNoaWxkUHJvY2Vzcy5leGVjKGNvbW1hbmQsIG9wdGlvbnMsIChlcnJvcikgPT4ge1xuICAgICAgICByZXNvbHZlKChlcnJvcikgPyBlcnJvci5jb2RlIDogMClcbiAgICAgIH0pXG4gICAgfSlcbiAgfVxuXG4gIGNvbnN0cnVjdEFyZ3MgKGZpbGVQYXRoLCBqb2JuYW1lKSB7XG4gICAgY29uc3QgYXJncyA9IFtcbiAgICAgICctLWJhdGNoJyxcbiAgICAgICctLXBkZicsXG4gICAgICAnLS10ZXgtb3B0aW9uPVwiLS1pbnRlcmFjdGlvbj1ub25zdG9wbW9kZVwiJyxcbiAgICAgIC8vIFNldCBsb2dmaWxlIG1heCBsaW5lIGxlbmd0aC5cbiAgICAgICctLXRleC1vcHRpb249XCItLW1heC1wcmludC1saW5lPTEwMDBcIidcbiAgICBdXG5cbiAgICBjb25zdCBlbmFibGVTaGVsbEVzY2FwZSA9IGF0b20uY29uZmlnLmdldCgnbGF0ZXguZW5hYmxlU2hlbGxFc2NhcGUnKVxuICAgIGNvbnN0IGVuYWJsZVN5bmN0ZXggPSBhdG9tLmNvbmZpZy5nZXQoJ2xhdGV4LmVuYWJsZVN5bmN0ZXgnKSAhPT0gZmFsc2VcbiAgICBjb25zdCBlbmdpbmVGcm9tTWFnaWMgPSB0aGlzLmdldExhdGV4RW5naW5lRnJvbU1hZ2ljKGZpbGVQYXRoKVxuICAgIGNvbnN0IGN1c3RvbUVuZ2luZSA9IGF0b20uY29uZmlnLmdldCgnbGF0ZXguY3VzdG9tRW5naW5lJylcbiAgICBjb25zdCBlbmdpbmUgPSBhdG9tLmNvbmZpZy5nZXQoJ2xhdGV4LmVuZ2luZScpXG5cbiAgICBpZiAoam9ibmFtZSkge1xuICAgICAgYXJncy5wdXNoKGAtLXRleC1vcHRpb249XCItLWpvYi1uYW1lPSR7am9ibmFtZX1cImApXG4gICAgfVxuICAgIGlmIChlbmFibGVTaGVsbEVzY2FwZSkge1xuICAgICAgYXJncy5wdXNoKCctLXRleC1vcHRpb249LS1lbmFibGUtd3JpdGUxOCcpXG4gICAgfVxuICAgIGlmIChlbmFibGVTeW5jdGV4KSB7XG4gICAgICBhcmdzLnB1c2goJy0tdGV4LW9wdGlvbj1cIi0tc3luY3RleD0xXCInKVxuICAgIH1cblxuICAgIGlmIChlbmdpbmVGcm9tTWFnaWMpIHtcbiAgICAgIGFyZ3MucHVzaChgLS1lbmdpbmU9XCIke2VuZ2luZUZyb21NYWdpY31cImApXG4gICAgfSBlbHNlIGlmIChjdXN0b21FbmdpbmUpIHtcbiAgICAgIGFyZ3MucHVzaChgLS1lbmdpbmU9XCIke2N1c3RvbUVuZ2luZX1cImApXG4gICAgfSBlbHNlIGlmIChlbmdpbmUgJiYgZW5naW5lID09PSAneGVsYXRleCcpIHtcbiAgICAgIGFyZ3MucHVzaCgnLS1lbmdpbmU9eGV0ZXgnKVxuICAgIH0gZWxzZSBpZiAoZW5naW5lICYmIGVuZ2luZSA9PT0gJ2x1YWxhdGV4Jykge1xuICAgICAgYXJncy5wdXNoKCctLWVuZ2luZT1sdWF0ZXgnKVxuICAgIH1cblxuICAgIGxldCBvdXRkaXIgPSB0aGlzLmdldE91dHB1dERpcmVjdG9yeShmaWxlUGF0aClcbiAgICBpZiAob3V0ZGlyKSB7XG4gICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkV2FybmluZyhcbiAgICAgICAgJ091dHB1dCBkaXJlY3RvcnkgZnVuY3Rpb25hbGl0eSBpcyBwb29ybHkgc3VwcG9ydGVkIGJ5IHRleGlmeSwgJyArXG4gICAgICAgICdzbyB0aGlzIGZ1bmN0aW9uYWxpdHkgaXMgZGlzYWJsZWQgKGZvciB0aGUgZm9yZXNlZWFibGUgZnV0dXJlKSAnICtcbiAgICAgICAgJ3doZW4gdXNpbmcgdGhlIHRleGlmeSBidWlsZGVyLidcbiAgICAgIClcbiAgICB9XG5cbiAgICBhcmdzLnB1c2goYFwiJHtmaWxlUGF0aH1cImApXG4gICAgcmV0dXJuIGFyZ3NcbiAgfVxufVxuIl19
//# sourceURL=/home/cin_chalic/.atom/packages/latex/lib/builders/texify.js
