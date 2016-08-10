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

var LatexmkBuilder = (function (_Builder) {
  _inherits(LatexmkBuilder, _Builder);

  function LatexmkBuilder() {
    _classCallCheck(this, LatexmkBuilder);

    _get(Object.getPrototypeOf(LatexmkBuilder.prototype), 'constructor', this).apply(this, arguments);

    this.executable = 'latexmk';
  }

  _createClass(LatexmkBuilder, [{
    key: 'run',
    value: function run(filePath) {
      var args = this.constructArgs(filePath);
      var command = this.executable + ' ' + args.join(' ');
      var options = this.constructChildProcessOptions(filePath);

      options.env.max_print_line = 1000; // Max log file line length.

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
      var outputFormat = atom.config.get('latex.outputFormat') || 'pdf';

      var args = ['-interaction=nonstopmode', '-f', '-cd', '-' + outputFormat, '-file-line-error'];

      var enableShellEscape = atom.config.get('latex.enableShellEscape');
      var enableSynctex = atom.config.get('latex.enableSynctex') !== false;
      var engineFromMagic = this.getLatexEngineFromMagic(filePath);
      var customEngine = atom.config.get('latex.customEngine');
      var engine = atom.config.get('latex.engine');

      if (enableShellEscape) {
        args.push('-shell-escape');
      }
      if (enableSynctex) {
        args.push('-synctex=1');
      }

      if (engineFromMagic) {
        args.push('-pdflatex="' + engineFromMagic + '"');
      } else if (customEngine) {
        args.push('-pdflatex="' + customEngine + '"');
      } else if (engine && engine !== 'pdflatex') {
        args.push('-' + engine);
      }

      var outdir = this.getOutputDirectory(filePath);
      if (outdir) {
        args.push('-outdir="' + outdir + '"');
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

  return LatexmkBuilder;
})(_builder2['default']);

exports['default'] = LatexmkBuilder;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL2J1aWxkZXJzL2xhdGV4bWsuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7NkJBRXlCLGVBQWU7Ozs7b0JBQ3ZCLE1BQU07Ozs7dUJBQ0gsWUFBWTs7OztBQUpoQyxXQUFXLENBQUE7O0lBTVUsY0FBYztZQUFkLGNBQWM7O1dBQWQsY0FBYzswQkFBZCxjQUFjOzsrQkFBZCxjQUFjOztTQUNqQyxVQUFVLEdBQUcsU0FBUzs7O2VBREgsY0FBYzs7V0FPN0IsYUFBQyxRQUFRLEVBQUU7QUFDYixVQUFNLElBQUksR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFBO0FBQ3pDLFVBQU0sT0FBTyxHQUFNLElBQUksQ0FBQyxVQUFVLFNBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQUFBRSxDQUFBO0FBQ3RELFVBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyw0QkFBNEIsQ0FBQyxRQUFRLENBQUMsQ0FBQTs7QUFFM0QsYUFBTyxDQUFDLEdBQUcsQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFBOztBQUVqQyxhQUFPLElBQUksT0FBTyxDQUFDLFVBQUMsT0FBTyxFQUFLOztBQUU5QixtQ0FBYSxJQUFJLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxVQUFDLEtBQUssRUFBSztBQUM3QyxpQkFBTyxDQUFDLEFBQUMsS0FBSyxHQUFJLEtBQUssQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUE7U0FDbEMsQ0FBQyxDQUFBO09BQ0gsQ0FBQyxDQUFBO0tBQ0g7OztXQUVhLHVCQUFDLFFBQVEsRUFBRTtBQUN2QixVQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLEtBQUssQ0FBQTs7QUFFbkUsVUFBTSxJQUFJLEdBQUcsQ0FDWCwwQkFBMEIsRUFDMUIsSUFBSSxFQUNKLEtBQUssUUFDRCxZQUFZLEVBQ2hCLGtCQUFrQixDQUNuQixDQUFBOztBQUVELFVBQU0saUJBQWlCLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMseUJBQXlCLENBQUMsQ0FBQTtBQUNwRSxVQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsQ0FBQyxLQUFLLEtBQUssQ0FBQTtBQUN0RSxVQUFNLGVBQWUsR0FBRyxJQUFJLENBQUMsdUJBQXVCLENBQUMsUUFBUSxDQUFDLENBQUE7QUFDOUQsVUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsb0JBQW9CLENBQUMsQ0FBQTtBQUMxRCxVQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQTs7QUFFOUMsVUFBSSxpQkFBaUIsRUFBRTtBQUNyQixZQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFBO09BQzNCO0FBQ0QsVUFBSSxhQUFhLEVBQUU7QUFDakIsWUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQTtPQUN4Qjs7QUFFRCxVQUFJLGVBQWUsRUFBRTtBQUNuQixZQUFJLENBQUMsSUFBSSxpQkFBZSxlQUFlLE9BQUksQ0FBQTtPQUM1QyxNQUFNLElBQUksWUFBWSxFQUFFO0FBQ3ZCLFlBQUksQ0FBQyxJQUFJLGlCQUFlLFlBQVksT0FBSSxDQUFBO09BQ3pDLE1BQU0sSUFBSSxNQUFNLElBQUksTUFBTSxLQUFLLFVBQVUsRUFBRTtBQUMxQyxZQUFJLENBQUMsSUFBSSxPQUFLLE1BQU0sQ0FBRyxDQUFBO09BQ3hCOztBQUVELFVBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxRQUFRLENBQUMsQ0FBQTtBQUM5QyxVQUFJLE1BQU0sRUFBRTtBQUNWLFlBQUksQ0FBQyxJQUFJLGVBQWEsTUFBTSxPQUFJLENBQUE7T0FDakM7O0FBRUQsVUFBSSxDQUFDLElBQUksT0FBSyxRQUFRLE9BQUksQ0FBQTtBQUMxQixhQUFPLElBQUksQ0FBQTtLQUNaOzs7V0ExRGlCLG9CQUFDLFFBQVEsRUFBRTtBQUMzQixhQUFPLGtCQUFLLE9BQU8sQ0FBQyxRQUFRLENBQUMsS0FBSyxNQUFNLENBQUE7S0FDekM7OztTQUxrQixjQUFjOzs7cUJBQWQsY0FBYyIsImZpbGUiOiIvaG9tZS9jaW5fY2hhbGljLy5hdG9tL3BhY2thZ2VzL2xhdGV4L2xpYi9idWlsZGVycy9sYXRleG1rLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuaW1wb3J0IGNoaWxkUHJvY2VzcyBmcm9tICdjaGlsZF9wcm9jZXNzJ1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcbmltcG9ydCBCdWlsZGVyIGZyb20gJy4uL2J1aWxkZXInXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExhdGV4bWtCdWlsZGVyIGV4dGVuZHMgQnVpbGRlciB7XG4gIGV4ZWN1dGFibGUgPSAnbGF0ZXhtaydcblxuICBzdGF0aWMgY2FuUHJvY2VzcyAoZmlsZVBhdGgpIHtcbiAgICByZXR1cm4gcGF0aC5leHRuYW1lKGZpbGVQYXRoKSA9PT0gJy50ZXgnXG4gIH1cblxuICBydW4gKGZpbGVQYXRoKSB7XG4gICAgY29uc3QgYXJncyA9IHRoaXMuY29uc3RydWN0QXJncyhmaWxlUGF0aClcbiAgICBjb25zdCBjb21tYW5kID0gYCR7dGhpcy5leGVjdXRhYmxlfSAke2FyZ3Muam9pbignICcpfWBcbiAgICBjb25zdCBvcHRpb25zID0gdGhpcy5jb25zdHJ1Y3RDaGlsZFByb2Nlc3NPcHRpb25zKGZpbGVQYXRoKVxuXG4gICAgb3B0aW9ucy5lbnYubWF4X3ByaW50X2xpbmUgPSAxMDAwIC8vIE1heCBsb2cgZmlsZSBsaW5lIGxlbmd0aC5cblxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgLy8gVE9ETzogQWRkIHN1cHBvcnQgZm9yIGtpbGxpbmcgdGhlIHByb2Nlc3MuXG4gICAgICBjaGlsZFByb2Nlc3MuZXhlYyhjb21tYW5kLCBvcHRpb25zLCAoZXJyb3IpID0+IHtcbiAgICAgICAgcmVzb2x2ZSgoZXJyb3IpID8gZXJyb3IuY29kZSA6IDApXG4gICAgICB9KVxuICAgIH0pXG4gIH1cblxuICBjb25zdHJ1Y3RBcmdzIChmaWxlUGF0aCkge1xuICAgIGNvbnN0IG91dHB1dEZvcm1hdCA9IGF0b20uY29uZmlnLmdldCgnbGF0ZXgub3V0cHV0Rm9ybWF0JykgfHwgJ3BkZidcblxuICAgIGNvbnN0IGFyZ3MgPSBbXG4gICAgICAnLWludGVyYWN0aW9uPW5vbnN0b3Btb2RlJyxcbiAgICAgICctZicsXG4gICAgICAnLWNkJyxcbiAgICAgIGAtJHtvdXRwdXRGb3JtYXR9YCxcbiAgICAgICctZmlsZS1saW5lLWVycm9yJ1xuICAgIF1cblxuICAgIGNvbnN0IGVuYWJsZVNoZWxsRXNjYXBlID0gYXRvbS5jb25maWcuZ2V0KCdsYXRleC5lbmFibGVTaGVsbEVzY2FwZScpXG4gICAgY29uc3QgZW5hYmxlU3luY3RleCA9IGF0b20uY29uZmlnLmdldCgnbGF0ZXguZW5hYmxlU3luY3RleCcpICE9PSBmYWxzZVxuICAgIGNvbnN0IGVuZ2luZUZyb21NYWdpYyA9IHRoaXMuZ2V0TGF0ZXhFbmdpbmVGcm9tTWFnaWMoZmlsZVBhdGgpXG4gICAgY29uc3QgY3VzdG9tRW5naW5lID0gYXRvbS5jb25maWcuZ2V0KCdsYXRleC5jdXN0b21FbmdpbmUnKVxuICAgIGNvbnN0IGVuZ2luZSA9IGF0b20uY29uZmlnLmdldCgnbGF0ZXguZW5naW5lJylcblxuICAgIGlmIChlbmFibGVTaGVsbEVzY2FwZSkge1xuICAgICAgYXJncy5wdXNoKCctc2hlbGwtZXNjYXBlJylcbiAgICB9XG4gICAgaWYgKGVuYWJsZVN5bmN0ZXgpIHtcbiAgICAgIGFyZ3MucHVzaCgnLXN5bmN0ZXg9MScpXG4gICAgfVxuXG4gICAgaWYgKGVuZ2luZUZyb21NYWdpYykge1xuICAgICAgYXJncy5wdXNoKGAtcGRmbGF0ZXg9XCIke2VuZ2luZUZyb21NYWdpY31cImApXG4gICAgfSBlbHNlIGlmIChjdXN0b21FbmdpbmUpIHtcbiAgICAgIGFyZ3MucHVzaChgLXBkZmxhdGV4PVwiJHtjdXN0b21FbmdpbmV9XCJgKVxuICAgIH0gZWxzZSBpZiAoZW5naW5lICYmIGVuZ2luZSAhPT0gJ3BkZmxhdGV4Jykge1xuICAgICAgYXJncy5wdXNoKGAtJHtlbmdpbmV9YClcbiAgICB9XG5cbiAgICBsZXQgb3V0ZGlyID0gdGhpcy5nZXRPdXRwdXREaXJlY3RvcnkoZmlsZVBhdGgpXG4gICAgaWYgKG91dGRpcikge1xuICAgICAgYXJncy5wdXNoKGAtb3V0ZGlyPVwiJHtvdXRkaXJ9XCJgKVxuICAgIH1cblxuICAgIGFyZ3MucHVzaChgXCIke2ZpbGVQYXRofVwiYClcbiAgICByZXR1cm4gYXJnc1xuICB9XG59XG4iXX0=
//# sourceURL=/home/cin_chalic/.atom/packages/latex/lib/builders/latexmk.js
