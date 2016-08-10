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

    _get(Object.getPrototypeOf(LatexmkBuilder.prototype), 'constructor', this).call(this);
    this.executable = 'latexmk';
  }

  _createClass(LatexmkBuilder, [{
    key: 'run',
    value: function run(filePath) {
      var args = this.constructArgs(filePath);
      var command = this.executable + ' ' + args.join(' ');
      var options = this.constructChildProcessOptions();

      options.cwd = _path2['default'].dirname(filePath); // Run process with sensible CWD.
      options.maxBuffer = 52428800; // Set process' max buffer size to 50 MB.
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

      var args = ['-interaction=nonstopmode', '-f', '-cd', '-' + outputFormat, '-synctex=1', '-file-line-error'];

      var enableShellEscape = atom.config.get('latex.enableShellEscape');
      var engineFromMagic = this.getLatexEngineFromMagic(filePath);
      var customEngine = atom.config.get('latex.customEngine');
      var engine = atom.config.get('latex.engine');

      if (enableShellEscape) {
        args.push('-shell-escape');
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
  }]);

  return LatexmkBuilder;
})(_builder2['default']);

exports['default'] = LatexmkBuilder;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL2J1aWxkZXJzL2xhdGV4bWsuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7NkJBRTBCLGVBQWU7Ozs7b0JBQ3hCLE1BQU07Ozs7dUJBQ0gsWUFBWTs7OztBQUpoQyxXQUFXLENBQUE7O0lBTVUsY0FBYztZQUFkLGNBQWM7O0FBQ3JCLFdBRE8sY0FBYyxHQUNsQjswQkFESSxjQUFjOztBQUUvQiwrQkFGaUIsY0FBYyw2Q0FFeEI7QUFDUCxRQUFJLENBQUMsVUFBVSxHQUFHLFNBQVMsQ0FBQTtHQUM1Qjs7ZUFKa0IsY0FBYzs7V0FNN0IsYUFBQyxRQUFRLEVBQUU7QUFDYixVQUFNLElBQUksR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFBO0FBQ3pDLFVBQU0sT0FBTyxHQUFNLElBQUksQ0FBQyxVQUFVLFNBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQUFBRSxDQUFBO0FBQ3RELFVBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyw0QkFBNEIsRUFBRSxDQUFBOztBQUVuRCxhQUFPLENBQUMsR0FBRyxHQUFHLGtCQUFLLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQTtBQUNwQyxhQUFPLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQTtBQUM1QixhQUFPLENBQUMsR0FBRyxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUE7O0FBRWpDLGFBQU8sSUFBSSxPQUFPLENBQUMsVUFBQyxPQUFPLEVBQUs7O0FBRTlCLG1DQUFjLElBQUksQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLFVBQUMsS0FBSyxFQUFLO0FBQzlDLGlCQUFPLENBQUMsQUFBQyxLQUFLLEdBQUksS0FBSyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQTtTQUNsQyxDQUFDLENBQUE7T0FDSCxDQUFDLENBQUE7S0FDSDs7O1dBRWEsdUJBQUMsUUFBUSxFQUFFO0FBQ3ZCLFVBQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLG9CQUFvQixDQUFDLElBQUksS0FBSyxDQUFBOztBQUVuRSxVQUFNLElBQUksR0FBRyxDQUNYLDBCQUEwQixFQUMxQixJQUFJLEVBQ0osS0FBSyxRQUNELFlBQVksRUFDaEIsWUFBWSxFQUNaLGtCQUFrQixDQUNuQixDQUFBOztBQUVELFVBQU0saUJBQWlCLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMseUJBQXlCLENBQUMsQ0FBQTtBQUNwRSxVQUFNLGVBQWUsR0FBRyxJQUFJLENBQUMsdUJBQXVCLENBQUMsUUFBUSxDQUFDLENBQUE7QUFDOUQsVUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsb0JBQW9CLENBQUMsQ0FBQTtBQUMxRCxVQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQTs7QUFFOUMsVUFBSSxpQkFBaUIsRUFBRTtBQUNyQixZQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFBO09BQzNCOztBQUVELFVBQUksZUFBZSxFQUFFO0FBQ25CLFlBQUksQ0FBQyxJQUFJLGlCQUFlLGVBQWUsT0FBSSxDQUFBO09BQzVDLE1BQU0sSUFBSSxZQUFZLEVBQUU7QUFDdkIsWUFBSSxDQUFDLElBQUksaUJBQWUsWUFBWSxPQUFJLENBQUE7T0FDekMsTUFBTSxJQUFJLE1BQU0sSUFBSSxNQUFNLEtBQUssVUFBVSxFQUFFO0FBQzFDLFlBQUksQ0FBQyxJQUFJLE9BQUssTUFBTSxDQUFHLENBQUE7T0FDeEI7O0FBRUQsVUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFFBQVEsQ0FBQyxDQUFBO0FBQzlDLFVBQUksTUFBTSxFQUFFO0FBQ1YsWUFBSSxDQUFDLElBQUksZUFBYSxNQUFNLE9BQUksQ0FBQTtPQUNqQzs7QUFFRCxVQUFJLENBQUMsSUFBSSxPQUFLLFFBQVEsT0FBSSxDQUFBO0FBQzFCLGFBQU8sSUFBSSxDQUFBO0tBQ1o7OztTQTNEa0IsY0FBYzs7O3FCQUFkLGNBQWMiLCJmaWxlIjoiL2hvbWUvY2luX2NoYWxpYy8uYXRvbS9wYWNrYWdlcy9sYXRleC9saWIvYnVpbGRlcnMvbGF0ZXhtay5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmltcG9ydCBjaGlsZF9wcm9jZXNzIGZyb20gJ2NoaWxkX3Byb2Nlc3MnXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IEJ1aWxkZXIgZnJvbSAnLi4vYnVpbGRlcidcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGF0ZXhta0J1aWxkZXIgZXh0ZW5kcyBCdWlsZGVyIHtcbiAgY29uc3RydWN0b3IgKCkge1xuICAgIHN1cGVyKClcbiAgICB0aGlzLmV4ZWN1dGFibGUgPSAnbGF0ZXhtaydcbiAgfVxuXG4gIHJ1biAoZmlsZVBhdGgpIHtcbiAgICBjb25zdCBhcmdzID0gdGhpcy5jb25zdHJ1Y3RBcmdzKGZpbGVQYXRoKVxuICAgIGNvbnN0IGNvbW1hbmQgPSBgJHt0aGlzLmV4ZWN1dGFibGV9ICR7YXJncy5qb2luKCcgJyl9YFxuICAgIGNvbnN0IG9wdGlvbnMgPSB0aGlzLmNvbnN0cnVjdENoaWxkUHJvY2Vzc09wdGlvbnMoKVxuXG4gICAgb3B0aW9ucy5jd2QgPSBwYXRoLmRpcm5hbWUoZmlsZVBhdGgpIC8vIFJ1biBwcm9jZXNzIHdpdGggc2Vuc2libGUgQ1dELlxuICAgIG9wdGlvbnMubWF4QnVmZmVyID0gNTI0Mjg4MDAgLy8gU2V0IHByb2Nlc3MnIG1heCBidWZmZXIgc2l6ZSB0byA1MCBNQi5cbiAgICBvcHRpb25zLmVudi5tYXhfcHJpbnRfbGluZSA9IDEwMDAgLy8gTWF4IGxvZyBmaWxlIGxpbmUgbGVuZ3RoLlxuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAvLyBUT0RPOiBBZGQgc3VwcG9ydCBmb3Iga2lsbGluZyB0aGUgcHJvY2Vzcy5cbiAgICAgIGNoaWxkX3Byb2Nlc3MuZXhlYyhjb21tYW5kLCBvcHRpb25zLCAoZXJyb3IpID0+IHtcbiAgICAgICAgcmVzb2x2ZSgoZXJyb3IpID8gZXJyb3IuY29kZSA6IDApXG4gICAgICB9KVxuICAgIH0pXG4gIH1cblxuICBjb25zdHJ1Y3RBcmdzIChmaWxlUGF0aCkge1xuICAgIGNvbnN0IG91dHB1dEZvcm1hdCA9IGF0b20uY29uZmlnLmdldCgnbGF0ZXgub3V0cHV0Rm9ybWF0JykgfHwgJ3BkZidcblxuICAgIGNvbnN0IGFyZ3MgPSBbXG4gICAgICAnLWludGVyYWN0aW9uPW5vbnN0b3Btb2RlJyxcbiAgICAgICctZicsXG4gICAgICAnLWNkJyxcbiAgICAgIGAtJHtvdXRwdXRGb3JtYXR9YCxcbiAgICAgICctc3luY3RleD0xJyxcbiAgICAgICctZmlsZS1saW5lLWVycm9yJ1xuICAgIF1cblxuICAgIGNvbnN0IGVuYWJsZVNoZWxsRXNjYXBlID0gYXRvbS5jb25maWcuZ2V0KCdsYXRleC5lbmFibGVTaGVsbEVzY2FwZScpXG4gICAgY29uc3QgZW5naW5lRnJvbU1hZ2ljID0gdGhpcy5nZXRMYXRleEVuZ2luZUZyb21NYWdpYyhmaWxlUGF0aClcbiAgICBjb25zdCBjdXN0b21FbmdpbmUgPSBhdG9tLmNvbmZpZy5nZXQoJ2xhdGV4LmN1c3RvbUVuZ2luZScpXG4gICAgY29uc3QgZW5naW5lID0gYXRvbS5jb25maWcuZ2V0KCdsYXRleC5lbmdpbmUnKVxuXG4gICAgaWYgKGVuYWJsZVNoZWxsRXNjYXBlKSB7XG4gICAgICBhcmdzLnB1c2goJy1zaGVsbC1lc2NhcGUnKVxuICAgIH1cblxuICAgIGlmIChlbmdpbmVGcm9tTWFnaWMpIHtcbiAgICAgIGFyZ3MucHVzaChgLXBkZmxhdGV4PVwiJHtlbmdpbmVGcm9tTWFnaWN9XCJgKVxuICAgIH0gZWxzZSBpZiAoY3VzdG9tRW5naW5lKSB7XG4gICAgICBhcmdzLnB1c2goYC1wZGZsYXRleD1cIiR7Y3VzdG9tRW5naW5lfVwiYClcbiAgICB9IGVsc2UgaWYgKGVuZ2luZSAmJiBlbmdpbmUgIT09ICdwZGZsYXRleCcpIHtcbiAgICAgIGFyZ3MucHVzaChgLSR7ZW5naW5lfWApXG4gICAgfVxuXG4gICAgbGV0IG91dGRpciA9IHRoaXMuZ2V0T3V0cHV0RGlyZWN0b3J5KGZpbGVQYXRoKVxuICAgIGlmIChvdXRkaXIpIHtcbiAgICAgIGFyZ3MucHVzaChgLW91dGRpcj1cIiR7b3V0ZGlyfVwiYClcbiAgICB9XG5cbiAgICBhcmdzLnB1c2goYFwiJHtmaWxlUGF0aH1cImApXG4gICAgcmV0dXJuIGFyZ3NcbiAgfVxufVxuIl19
//# sourceURL=/home/cin_chalic/.atom/packages/latex/lib/builders/latexmk.js
