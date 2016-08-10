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
    value: function run(filePath, jobname) {
      var args = this.constructArgs(filePath, jobname);
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
    value: function constructArgs(filePath, jobname) {
      var outputFormat = atom.config.get('latex.outputFormat') || 'pdf';

      var args = ['-interaction=nonstopmode', '-f', '-cd', '-' + outputFormat, '-file-line-error'];

      var enableShellEscape = atom.config.get('latex.enableShellEscape');
      var enableSynctex = atom.config.get('latex.enableSynctex') !== false;
      var engineFromMagic = this.getLatexEngineFromMagic(filePath);
      var customEngine = atom.config.get('latex.customEngine');
      var engine = atom.config.get('latex.engine');

      if (jobname) {
        args.push('-jobname=' + jobname);
      }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL2J1aWxkZXJzL2xhdGV4bWsuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7NkJBRXlCLGVBQWU7Ozs7b0JBQ3ZCLE1BQU07Ozs7dUJBQ0gsWUFBWTs7OztBQUpoQyxXQUFXLENBQUE7O0lBTVUsY0FBYztZQUFkLGNBQWM7O1dBQWQsY0FBYzswQkFBZCxjQUFjOzsrQkFBZCxjQUFjOztTQUNqQyxVQUFVLEdBQUcsU0FBUzs7O2VBREgsY0FBYzs7V0FPN0IsYUFBQyxRQUFRLEVBQUUsT0FBTyxFQUFFO0FBQ3RCLFVBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFBO0FBQ2xELFVBQU0sT0FBTyxHQUFNLElBQUksQ0FBQyxVQUFVLFNBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQUFBRSxDQUFBO0FBQ3RELFVBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyw0QkFBNEIsQ0FBQyxRQUFRLENBQUMsQ0FBQTs7QUFFM0QsYUFBTyxDQUFDLEdBQUcsQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFBOztBQUVqQyxhQUFPLElBQUksT0FBTyxDQUFDLFVBQUMsT0FBTyxFQUFLOztBQUU5QixtQ0FBYSxJQUFJLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxVQUFDLEtBQUssRUFBSztBQUM3QyxpQkFBTyxDQUFDLEFBQUMsS0FBSyxHQUFJLEtBQUssQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUE7U0FDbEMsQ0FBQyxDQUFBO09BQ0gsQ0FBQyxDQUFBO0tBQ0g7OztXQUVhLHVCQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUU7QUFDaEMsVUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsb0JBQW9CLENBQUMsSUFBSSxLQUFLLENBQUE7O0FBRW5FLFVBQU0sSUFBSSxHQUFHLENBQ1gsMEJBQTBCLEVBQzFCLElBQUksRUFDSixLQUFLLFFBQ0QsWUFBWSxFQUNoQixrQkFBa0IsQ0FDbkIsQ0FBQTs7QUFFRCxVQUFNLGlCQUFpQixHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLHlCQUF5QixDQUFDLENBQUE7QUFDcEUsVUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMscUJBQXFCLENBQUMsS0FBSyxLQUFLLENBQUE7QUFDdEUsVUFBTSxlQUFlLEdBQUcsSUFBSSxDQUFDLHVCQUF1QixDQUFDLFFBQVEsQ0FBQyxDQUFBO0FBQzlELFVBQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLG9CQUFvQixDQUFDLENBQUE7QUFDMUQsVUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUE7O0FBRTlDLFVBQUksT0FBTyxFQUFFO0FBQ1gsWUFBSSxDQUFDLElBQUksZUFBYSxPQUFPLENBQUcsQ0FBQTtPQUNqQztBQUNELFVBQUksaUJBQWlCLEVBQUU7QUFDckIsWUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQTtPQUMzQjtBQUNELFVBQUksYUFBYSxFQUFFO0FBQ2pCLFlBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUE7T0FDeEI7O0FBRUQsVUFBSSxlQUFlLEVBQUU7QUFDbkIsWUFBSSxDQUFDLElBQUksaUJBQWUsZUFBZSxPQUFJLENBQUE7T0FDNUMsTUFBTSxJQUFJLFlBQVksRUFBRTtBQUN2QixZQUFJLENBQUMsSUFBSSxpQkFBZSxZQUFZLE9BQUksQ0FBQTtPQUN6QyxNQUFNLElBQUksTUFBTSxJQUFJLE1BQU0sS0FBSyxVQUFVLEVBQUU7QUFDMUMsWUFBSSxDQUFDLElBQUksT0FBSyxNQUFNLENBQUcsQ0FBQTtPQUN4Qjs7QUFFRCxVQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsUUFBUSxDQUFDLENBQUE7QUFDOUMsVUFBSSxNQUFNLEVBQUU7QUFDVixZQUFJLENBQUMsSUFBSSxlQUFhLE1BQU0sT0FBSSxDQUFBO09BQ2pDOztBQUVELFVBQUksQ0FBQyxJQUFJLE9BQUssUUFBUSxPQUFJLENBQUE7QUFDMUIsYUFBTyxJQUFJLENBQUE7S0FDWjs7O1dBN0RpQixvQkFBQyxRQUFRLEVBQUU7QUFDM0IsYUFBTyxrQkFBSyxPQUFPLENBQUMsUUFBUSxDQUFDLEtBQUssTUFBTSxDQUFBO0tBQ3pDOzs7U0FMa0IsY0FBYzs7O3FCQUFkLGNBQWMiLCJmaWxlIjoiL2hvbWUvY2luX2NoYWxpYy8uYXRvbS9wYWNrYWdlcy9sYXRleC9saWIvYnVpbGRlcnMvbGF0ZXhtay5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmltcG9ydCBjaGlsZFByb2Nlc3MgZnJvbSAnY2hpbGRfcHJvY2VzcydcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5pbXBvcnQgQnVpbGRlciBmcm9tICcuLi9idWlsZGVyJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMYXRleG1rQnVpbGRlciBleHRlbmRzIEJ1aWxkZXIge1xuICBleGVjdXRhYmxlID0gJ2xhdGV4bWsnXG5cbiAgc3RhdGljIGNhblByb2Nlc3MgKGZpbGVQYXRoKSB7XG4gICAgcmV0dXJuIHBhdGguZXh0bmFtZShmaWxlUGF0aCkgPT09ICcudGV4J1xuICB9XG5cbiAgcnVuIChmaWxlUGF0aCwgam9ibmFtZSkge1xuICAgIGNvbnN0IGFyZ3MgPSB0aGlzLmNvbnN0cnVjdEFyZ3MoZmlsZVBhdGgsIGpvYm5hbWUpXG4gICAgY29uc3QgY29tbWFuZCA9IGAke3RoaXMuZXhlY3V0YWJsZX0gJHthcmdzLmpvaW4oJyAnKX1gXG4gICAgY29uc3Qgb3B0aW9ucyA9IHRoaXMuY29uc3RydWN0Q2hpbGRQcm9jZXNzT3B0aW9ucyhmaWxlUGF0aClcblxuICAgIG9wdGlvbnMuZW52Lm1heF9wcmludF9saW5lID0gMTAwMCAvLyBNYXggbG9nIGZpbGUgbGluZSBsZW5ndGguXG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgIC8vIFRPRE86IEFkZCBzdXBwb3J0IGZvciBraWxsaW5nIHRoZSBwcm9jZXNzLlxuICAgICAgY2hpbGRQcm9jZXNzLmV4ZWMoY29tbWFuZCwgb3B0aW9ucywgKGVycm9yKSA9PiB7XG4gICAgICAgIHJlc29sdmUoKGVycm9yKSA/IGVycm9yLmNvZGUgOiAwKVxuICAgICAgfSlcbiAgICB9KVxuICB9XG5cbiAgY29uc3RydWN0QXJncyAoZmlsZVBhdGgsIGpvYm5hbWUpIHtcbiAgICBjb25zdCBvdXRwdXRGb3JtYXQgPSBhdG9tLmNvbmZpZy5nZXQoJ2xhdGV4Lm91dHB1dEZvcm1hdCcpIHx8ICdwZGYnXG5cbiAgICBjb25zdCBhcmdzID0gW1xuICAgICAgJy1pbnRlcmFjdGlvbj1ub25zdG9wbW9kZScsXG4gICAgICAnLWYnLFxuICAgICAgJy1jZCcsXG4gICAgICBgLSR7b3V0cHV0Rm9ybWF0fWAsXG4gICAgICAnLWZpbGUtbGluZS1lcnJvcidcbiAgICBdXG5cbiAgICBjb25zdCBlbmFibGVTaGVsbEVzY2FwZSA9IGF0b20uY29uZmlnLmdldCgnbGF0ZXguZW5hYmxlU2hlbGxFc2NhcGUnKVxuICAgIGNvbnN0IGVuYWJsZVN5bmN0ZXggPSBhdG9tLmNvbmZpZy5nZXQoJ2xhdGV4LmVuYWJsZVN5bmN0ZXgnKSAhPT0gZmFsc2VcbiAgICBjb25zdCBlbmdpbmVGcm9tTWFnaWMgPSB0aGlzLmdldExhdGV4RW5naW5lRnJvbU1hZ2ljKGZpbGVQYXRoKVxuICAgIGNvbnN0IGN1c3RvbUVuZ2luZSA9IGF0b20uY29uZmlnLmdldCgnbGF0ZXguY3VzdG9tRW5naW5lJylcbiAgICBjb25zdCBlbmdpbmUgPSBhdG9tLmNvbmZpZy5nZXQoJ2xhdGV4LmVuZ2luZScpXG5cbiAgICBpZiAoam9ibmFtZSkge1xuICAgICAgYXJncy5wdXNoKGAtam9ibmFtZT0ke2pvYm5hbWV9YClcbiAgICB9XG4gICAgaWYgKGVuYWJsZVNoZWxsRXNjYXBlKSB7XG4gICAgICBhcmdzLnB1c2goJy1zaGVsbC1lc2NhcGUnKVxuICAgIH1cbiAgICBpZiAoZW5hYmxlU3luY3RleCkge1xuICAgICAgYXJncy5wdXNoKCctc3luY3RleD0xJylcbiAgICB9XG5cbiAgICBpZiAoZW5naW5lRnJvbU1hZ2ljKSB7XG4gICAgICBhcmdzLnB1c2goYC1wZGZsYXRleD1cIiR7ZW5naW5lRnJvbU1hZ2ljfVwiYClcbiAgICB9IGVsc2UgaWYgKGN1c3RvbUVuZ2luZSkge1xuICAgICAgYXJncy5wdXNoKGAtcGRmbGF0ZXg9XCIke2N1c3RvbUVuZ2luZX1cImApXG4gICAgfSBlbHNlIGlmIChlbmdpbmUgJiYgZW5naW5lICE9PSAncGRmbGF0ZXgnKSB7XG4gICAgICBhcmdzLnB1c2goYC0ke2VuZ2luZX1gKVxuICAgIH1cblxuICAgIGxldCBvdXRkaXIgPSB0aGlzLmdldE91dHB1dERpcmVjdG9yeShmaWxlUGF0aClcbiAgICBpZiAob3V0ZGlyKSB7XG4gICAgICBhcmdzLnB1c2goYC1vdXRkaXI9XCIke291dGRpcn1cImApXG4gICAgfVxuXG4gICAgYXJncy5wdXNoKGBcIiR7ZmlsZVBhdGh9XCJgKVxuICAgIHJldHVybiBhcmdzXG4gIH1cbn1cbiJdfQ==
//# sourceURL=/home/cin_chalic/.atom/packages/latex/lib/builders/latexmk.js
