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
      this.engineFromMagic = null;
      try {
        this.engineFromMagic = this.getLatexEngineFromMagic(filePath);
      } catch (err) {
        console.warn('Couldn\'t parse "' + filePath + '" file not Found: ' + err);
      }
      var enableShellEscape = atom.config.get('latex.enableShellEscape');
      var customEngine = atom.config.get('latex.customEngine');
      var engine = atom.config.get('latex.engine');

      if (enableShellEscape) {
        args.push('-shell-escape');
      }

      if (this.engineFromMagic) {
        args.push('-pdflatex="' + this.engineFromMagic + '"');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL2J1aWxkZXJzL2xhdGV4bWsuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7NkJBRTBCLGVBQWU7Ozs7b0JBQ3hCLE1BQU07Ozs7dUJBQ0gsWUFBWTs7OztBQUpoQyxXQUFXLENBQUE7O0lBTVUsY0FBYztZQUFkLGNBQWM7O0FBQ3JCLFdBRE8sY0FBYyxHQUNsQjswQkFESSxjQUFjOztBQUUvQiwrQkFGaUIsY0FBYyw2Q0FFeEI7QUFDUCxRQUFJLENBQUMsVUFBVSxHQUFHLFNBQVMsQ0FBQTtHQUM1Qjs7ZUFKa0IsY0FBYzs7V0FNN0IsYUFBQyxRQUFRLEVBQUU7QUFDYixVQUFNLElBQUksR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFBO0FBQ3pDLFVBQU0sT0FBTyxHQUFNLElBQUksQ0FBQyxVQUFVLFNBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQUFBRSxDQUFBO0FBQ3RELFVBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyw0QkFBNEIsRUFBRSxDQUFBOztBQUVuRCxhQUFPLENBQUMsR0FBRyxHQUFHLGtCQUFLLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQTtBQUNwQyxhQUFPLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQTtBQUM1QixhQUFPLENBQUMsR0FBRyxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUE7O0FBRWpDLGFBQU8sSUFBSSxPQUFPLENBQUMsVUFBQyxPQUFPLEVBQUs7O0FBRTlCLG1DQUFjLElBQUksQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLFVBQUMsS0FBSyxFQUFLO0FBQzlDLGlCQUFPLENBQUMsQUFBQyxLQUFLLEdBQUksS0FBSyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQTtTQUNsQyxDQUFDLENBQUE7T0FDSCxDQUFDLENBQUE7S0FDSDs7O1dBRWEsdUJBQUMsUUFBUSxFQUFFO0FBQ3ZCLFVBQU0sSUFBSSxHQUFHLENBQ1gsMEJBQTBCLEVBQzFCLElBQUksRUFDSixLQUFLLEVBQ0wsTUFBTSxFQUNOLFlBQVksRUFDWixrQkFBa0IsQ0FDbkIsQ0FBQTtBQUNELFVBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFBO0FBQzNCLFVBQUk7QUFDRixZQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxRQUFRLENBQUMsQ0FBQTtPQUM5RCxDQUFDLE9BQU8sR0FBRyxFQUFFO0FBQ1osZUFBTyxDQUFDLElBQUksQ0FBQyxzQkFBbUIsUUFBUSwwQkFBdUIsR0FBRyxDQUFDLENBQUE7T0FDcEU7QUFDRCxVQUFNLGlCQUFpQixHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLHlCQUF5QixDQUFDLENBQUE7QUFDcEUsVUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsb0JBQW9CLENBQUMsQ0FBQTtBQUMxRCxVQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQTs7QUFFOUMsVUFBSSxpQkFBaUIsRUFBRTtBQUNyQixZQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFBO09BQzNCOztBQUVELFVBQUksSUFBSSxDQUFDLGVBQWUsRUFBRTtBQUN4QixZQUFJLENBQUMsSUFBSSxpQkFBZSxJQUFJLENBQUMsZUFBZSxPQUFJLENBQUE7T0FDakQsTUFBTSxJQUFJLFlBQVksRUFBRTtBQUN2QixZQUFJLENBQUMsSUFBSSxpQkFBZSxZQUFZLE9BQUksQ0FBQTtPQUN6QyxNQUFNLElBQUksTUFBTSxJQUFJLE1BQU0sS0FBSyxVQUFVLEVBQUU7QUFDMUMsWUFBSSxDQUFDLElBQUksT0FBSyxNQUFNLENBQUcsQ0FBQTtPQUN4Qjs7QUFFRCxVQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsUUFBUSxDQUFDLENBQUE7QUFDOUMsVUFBSSxNQUFNLEVBQUU7QUFDVixZQUFJLENBQUMsSUFBSSxlQUFhLE1BQU0sT0FBSSxDQUFBO09BQ2pDOztBQUVELFVBQUksQ0FBQyxJQUFJLE9BQUssUUFBUSxPQUFJLENBQUE7QUFDMUIsYUFBTyxJQUFJLENBQUE7S0FDWjs7O1NBN0RrQixjQUFjOzs7cUJBQWQsY0FBYyIsImZpbGUiOiIvaG9tZS9jaW5fY2hhbGljLy5hdG9tL3BhY2thZ2VzL2xhdGV4L2xpYi9idWlsZGVycy9sYXRleG1rLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuaW1wb3J0IGNoaWxkX3Byb2Nlc3MgZnJvbSAnY2hpbGRfcHJvY2VzcydcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5pbXBvcnQgQnVpbGRlciBmcm9tICcuLi9idWlsZGVyJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMYXRleG1rQnVpbGRlciBleHRlbmRzIEJ1aWxkZXIge1xuICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgc3VwZXIoKVxuICAgIHRoaXMuZXhlY3V0YWJsZSA9ICdsYXRleG1rJ1xuICB9XG5cbiAgcnVuIChmaWxlUGF0aCkge1xuICAgIGNvbnN0IGFyZ3MgPSB0aGlzLmNvbnN0cnVjdEFyZ3MoZmlsZVBhdGgpXG4gICAgY29uc3QgY29tbWFuZCA9IGAke3RoaXMuZXhlY3V0YWJsZX0gJHthcmdzLmpvaW4oJyAnKX1gXG4gICAgY29uc3Qgb3B0aW9ucyA9IHRoaXMuY29uc3RydWN0Q2hpbGRQcm9jZXNzT3B0aW9ucygpXG5cbiAgICBvcHRpb25zLmN3ZCA9IHBhdGguZGlybmFtZShmaWxlUGF0aCkgLy8gUnVuIHByb2Nlc3Mgd2l0aCBzZW5zaWJsZSBDV0QuXG4gICAgb3B0aW9ucy5tYXhCdWZmZXIgPSA1MjQyODgwMCAvLyBTZXQgcHJvY2VzcycgbWF4IGJ1ZmZlciBzaXplIHRvIDUwIE1CLlxuICAgIG9wdGlvbnMuZW52Lm1heF9wcmludF9saW5lID0gMTAwMCAvLyBNYXggbG9nIGZpbGUgbGluZSBsZW5ndGguXG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgIC8vIFRPRE86IEFkZCBzdXBwb3J0IGZvciBraWxsaW5nIHRoZSBwcm9jZXNzLlxuICAgICAgY2hpbGRfcHJvY2Vzcy5leGVjKGNvbW1hbmQsIG9wdGlvbnMsIChlcnJvcikgPT4ge1xuICAgICAgICByZXNvbHZlKChlcnJvcikgPyBlcnJvci5jb2RlIDogMClcbiAgICAgIH0pXG4gICAgfSlcbiAgfVxuXG4gIGNvbnN0cnVjdEFyZ3MgKGZpbGVQYXRoKSB7XG4gICAgY29uc3QgYXJncyA9IFtcbiAgICAgICctaW50ZXJhY3Rpb249bm9uc3RvcG1vZGUnLFxuICAgICAgJy1mJyxcbiAgICAgICctY2QnLFxuICAgICAgJy1wZGYnLFxuICAgICAgJy1zeW5jdGV4PTEnLFxuICAgICAgJy1maWxlLWxpbmUtZXJyb3InXG4gICAgXVxuICAgIHRoaXMuZW5naW5lRnJvbU1hZ2ljID0gbnVsbFxuICAgIHRyeSB7XG4gICAgICB0aGlzLmVuZ2luZUZyb21NYWdpYyA9IHRoaXMuZ2V0TGF0ZXhFbmdpbmVGcm9tTWFnaWMoZmlsZVBhdGgpXG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBjb25zb2xlLndhcm4oYENvdWxkbid0IHBhcnNlIFwiJHtmaWxlUGF0aH1cIiBmaWxlIG5vdCBGb3VuZDogYCArIGVycilcbiAgICB9XG4gICAgY29uc3QgZW5hYmxlU2hlbGxFc2NhcGUgPSBhdG9tLmNvbmZpZy5nZXQoJ2xhdGV4LmVuYWJsZVNoZWxsRXNjYXBlJylcbiAgICBjb25zdCBjdXN0b21FbmdpbmUgPSBhdG9tLmNvbmZpZy5nZXQoJ2xhdGV4LmN1c3RvbUVuZ2luZScpXG4gICAgY29uc3QgZW5naW5lID0gYXRvbS5jb25maWcuZ2V0KCdsYXRleC5lbmdpbmUnKVxuXG4gICAgaWYgKGVuYWJsZVNoZWxsRXNjYXBlKSB7XG4gICAgICBhcmdzLnB1c2goJy1zaGVsbC1lc2NhcGUnKVxuICAgIH1cblxuICAgIGlmICh0aGlzLmVuZ2luZUZyb21NYWdpYykge1xuICAgICAgYXJncy5wdXNoKGAtcGRmbGF0ZXg9XCIke3RoaXMuZW5naW5lRnJvbU1hZ2ljfVwiYClcbiAgICB9IGVsc2UgaWYgKGN1c3RvbUVuZ2luZSkge1xuICAgICAgYXJncy5wdXNoKGAtcGRmbGF0ZXg9XCIke2N1c3RvbUVuZ2luZX1cImApXG4gICAgfSBlbHNlIGlmIChlbmdpbmUgJiYgZW5naW5lICE9PSAncGRmbGF0ZXgnKSB7XG4gICAgICBhcmdzLnB1c2goYC0ke2VuZ2luZX1gKVxuICAgIH1cblxuICAgIGxldCBvdXRkaXIgPSB0aGlzLmdldE91dHB1dERpcmVjdG9yeShmaWxlUGF0aClcbiAgICBpZiAob3V0ZGlyKSB7XG4gICAgICBhcmdzLnB1c2goYC1vdXRkaXI9XCIke291dGRpcn1cImApXG4gICAgfVxuXG4gICAgYXJncy5wdXNoKGBcIiR7ZmlsZVBhdGh9XCJgKVxuICAgIHJldHVybiBhcmdzXG4gIH1cbn1cbiJdfQ==
//# sourceURL=/home/cin_chalic/.atom/packages/latex/lib/builders/latexmk.js
