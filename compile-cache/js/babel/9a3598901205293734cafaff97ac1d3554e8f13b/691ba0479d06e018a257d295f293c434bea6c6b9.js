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
      var args = ['-interaction=nonstopmode', '-f', '-cd', '-pdf', '-synctex=1', '-file-line-error'];

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL2J1aWxkZXJzL2xhdGV4bWsuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7NkJBRTBCLGVBQWU7Ozs7b0JBQ3hCLE1BQU07Ozs7dUJBQ0gsWUFBWTs7OztBQUpoQyxXQUFXLENBQUE7O0lBTVUsY0FBYztZQUFkLGNBQWM7O0FBQ3JCLFdBRE8sY0FBYyxHQUNsQjswQkFESSxjQUFjOztBQUUvQiwrQkFGaUIsY0FBYyw2Q0FFeEI7QUFDUCxRQUFJLENBQUMsVUFBVSxHQUFHLFNBQVMsQ0FBQTtHQUM1Qjs7ZUFKa0IsY0FBYzs7V0FNN0IsYUFBQyxRQUFRLEVBQUU7QUFDYixVQUFNLElBQUksR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFBO0FBQ3pDLFVBQU0sT0FBTyxHQUFNLElBQUksQ0FBQyxVQUFVLFNBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQUFBRSxDQUFBO0FBQ3RELFVBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyw0QkFBNEIsRUFBRSxDQUFBOztBQUVuRCxhQUFPLENBQUMsR0FBRyxHQUFHLGtCQUFLLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQTtBQUNwQyxhQUFPLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQTtBQUM1QixhQUFPLENBQUMsR0FBRyxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUE7O0FBRWpDLGFBQU8sSUFBSSxPQUFPLENBQUMsVUFBQyxPQUFPLEVBQUs7O0FBRTlCLG1DQUFjLElBQUksQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLFVBQUMsS0FBSyxFQUFLO0FBQzlDLGlCQUFPLENBQUMsQUFBQyxLQUFLLEdBQUksS0FBSyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQTtTQUNsQyxDQUFDLENBQUE7T0FDSCxDQUFDLENBQUE7S0FDSDs7O1dBRWEsdUJBQUMsUUFBUSxFQUFFO0FBQ3ZCLFVBQU0sSUFBSSxHQUFHLENBQ1gsMEJBQTBCLEVBQzFCLElBQUksRUFDSixLQUFLLEVBQ0wsTUFBTSxFQUNOLFlBQVksRUFDWixrQkFBa0IsQ0FDbkIsQ0FBQTs7QUFFRCxVQUFNLGlCQUFpQixHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLHlCQUF5QixDQUFDLENBQUE7QUFDcEUsVUFBTSxlQUFlLEdBQUcsSUFBSSxDQUFDLHVCQUF1QixDQUFDLFFBQVEsQ0FBQyxDQUFBO0FBQzlELFVBQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLG9CQUFvQixDQUFDLENBQUE7QUFDMUQsVUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUE7O0FBRTlDLFVBQUksaUJBQWlCLEVBQUU7QUFDckIsWUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQTtPQUMzQjs7QUFFRCxVQUFJLGVBQWUsRUFBRTtBQUNuQixZQUFJLENBQUMsSUFBSSxpQkFBZSxlQUFlLE9BQUksQ0FBQTtPQUM1QyxNQUFNLElBQUksWUFBWSxFQUFFO0FBQ3ZCLFlBQUksQ0FBQyxJQUFJLGlCQUFlLFlBQVksT0FBSSxDQUFBO09BQ3pDLE1BQU0sSUFBSSxNQUFNLElBQUksTUFBTSxLQUFLLFVBQVUsRUFBRTtBQUMxQyxZQUFJLENBQUMsSUFBSSxPQUFLLE1BQU0sQ0FBRyxDQUFBO09BQ3hCOztBQUVELFVBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxRQUFRLENBQUMsQ0FBQTtBQUM5QyxVQUFJLE1BQU0sRUFBRTtBQUNWLFlBQUksQ0FBQyxJQUFJLGVBQWEsTUFBTSxPQUFJLENBQUE7T0FDakM7O0FBRUQsVUFBSSxDQUFDLElBQUksT0FBSyxRQUFRLE9BQUksQ0FBQTtBQUMxQixhQUFPLElBQUksQ0FBQTtLQUNaOzs7U0F6RGtCLGNBQWM7OztxQkFBZCxjQUFjIiwiZmlsZSI6Ii9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL2J1aWxkZXJzL2xhdGV4bWsuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5pbXBvcnQgY2hpbGRfcHJvY2VzcyBmcm9tICdjaGlsZF9wcm9jZXNzJ1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcbmltcG9ydCBCdWlsZGVyIGZyb20gJy4uL2J1aWxkZXInXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExhdGV4bWtCdWlsZGVyIGV4dGVuZHMgQnVpbGRlciB7XG4gIGNvbnN0cnVjdG9yICgpIHtcbiAgICBzdXBlcigpXG4gICAgdGhpcy5leGVjdXRhYmxlID0gJ2xhdGV4bWsnXG4gIH1cblxuICBydW4gKGZpbGVQYXRoKSB7XG4gICAgY29uc3QgYXJncyA9IHRoaXMuY29uc3RydWN0QXJncyhmaWxlUGF0aClcbiAgICBjb25zdCBjb21tYW5kID0gYCR7dGhpcy5leGVjdXRhYmxlfSAke2FyZ3Muam9pbignICcpfWBcbiAgICBjb25zdCBvcHRpb25zID0gdGhpcy5jb25zdHJ1Y3RDaGlsZFByb2Nlc3NPcHRpb25zKClcblxuICAgIG9wdGlvbnMuY3dkID0gcGF0aC5kaXJuYW1lKGZpbGVQYXRoKSAvLyBSdW4gcHJvY2VzcyB3aXRoIHNlbnNpYmxlIENXRC5cbiAgICBvcHRpb25zLm1heEJ1ZmZlciA9IDUyNDI4ODAwIC8vIFNldCBwcm9jZXNzJyBtYXggYnVmZmVyIHNpemUgdG8gNTAgTUIuXG4gICAgb3B0aW9ucy5lbnYubWF4X3ByaW50X2xpbmUgPSAxMDAwIC8vIE1heCBsb2cgZmlsZSBsaW5lIGxlbmd0aC5cblxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgLy8gVE9ETzogQWRkIHN1cHBvcnQgZm9yIGtpbGxpbmcgdGhlIHByb2Nlc3MuXG4gICAgICBjaGlsZF9wcm9jZXNzLmV4ZWMoY29tbWFuZCwgb3B0aW9ucywgKGVycm9yKSA9PiB7XG4gICAgICAgIHJlc29sdmUoKGVycm9yKSA/IGVycm9yLmNvZGUgOiAwKVxuICAgICAgfSlcbiAgICB9KVxuICB9XG5cbiAgY29uc3RydWN0QXJncyAoZmlsZVBhdGgpIHtcbiAgICBjb25zdCBhcmdzID0gW1xuICAgICAgJy1pbnRlcmFjdGlvbj1ub25zdG9wbW9kZScsXG4gICAgICAnLWYnLFxuICAgICAgJy1jZCcsXG4gICAgICAnLXBkZicsXG4gICAgICAnLXN5bmN0ZXg9MScsXG4gICAgICAnLWZpbGUtbGluZS1lcnJvcidcbiAgICBdXG5cbiAgICBjb25zdCBlbmFibGVTaGVsbEVzY2FwZSA9IGF0b20uY29uZmlnLmdldCgnbGF0ZXguZW5hYmxlU2hlbGxFc2NhcGUnKVxuICAgIGNvbnN0IGVuZ2luZUZyb21NYWdpYyA9IHRoaXMuZ2V0TGF0ZXhFbmdpbmVGcm9tTWFnaWMoZmlsZVBhdGgpXG4gICAgY29uc3QgY3VzdG9tRW5naW5lID0gYXRvbS5jb25maWcuZ2V0KCdsYXRleC5jdXN0b21FbmdpbmUnKVxuICAgIGNvbnN0IGVuZ2luZSA9IGF0b20uY29uZmlnLmdldCgnbGF0ZXguZW5naW5lJylcblxuICAgIGlmIChlbmFibGVTaGVsbEVzY2FwZSkge1xuICAgICAgYXJncy5wdXNoKCctc2hlbGwtZXNjYXBlJylcbiAgICB9XG5cbiAgICBpZiAoZW5naW5lRnJvbU1hZ2ljKSB7XG4gICAgICBhcmdzLnB1c2goYC1wZGZsYXRleD1cIiR7ZW5naW5lRnJvbU1hZ2ljfVwiYClcbiAgICB9IGVsc2UgaWYgKGN1c3RvbUVuZ2luZSkge1xuICAgICAgYXJncy5wdXNoKGAtcGRmbGF0ZXg9XCIke2N1c3RvbUVuZ2luZX1cImApXG4gICAgfSBlbHNlIGlmIChlbmdpbmUgJiYgZW5naW5lICE9PSAncGRmbGF0ZXgnKSB7XG4gICAgICBhcmdzLnB1c2goYC0ke2VuZ2luZX1gKVxuICAgIH1cblxuICAgIGxldCBvdXRkaXIgPSB0aGlzLmdldE91dHB1dERpcmVjdG9yeShmaWxlUGF0aClcbiAgICBpZiAob3V0ZGlyKSB7XG4gICAgICBhcmdzLnB1c2goYC1vdXRkaXI9XCIke291dGRpcn1cImApXG4gICAgfVxuXG4gICAgYXJncy5wdXNoKGBcIiR7ZmlsZVBhdGh9XCJgKVxuICAgIHJldHVybiBhcmdzXG4gIH1cbn1cbiJdfQ==
//# sourceURL=/home/cin_chalic/.atom/packages/latex/lib/builders/latexmk.js
