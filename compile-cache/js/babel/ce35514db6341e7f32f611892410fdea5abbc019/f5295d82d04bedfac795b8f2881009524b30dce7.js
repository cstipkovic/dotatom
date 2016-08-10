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
      var args = ['--batch', '--pdf', '--tex-option="--interaction=nonstopmode"',
      // Set logfile max line length.
      '--tex-option="--max-print-line=1000"'];

      var enableShellEscape = atom.config.get('latex.enableShellEscape');
      var enableSynctex = atom.config.get('latex.enableSynctex') !== false;
      var engineFromMagic = this.getLatexEngineFromMagic(filePath);
      var customEngine = atom.config.get('latex.customEngine');
      var engine = atom.config.get('latex.engine');

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL2J1aWxkZXJzL3RleGlmeS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs2QkFFeUIsZUFBZTs7OztvQkFDdkIsTUFBTTs7Ozt1QkFDSCxZQUFZOzs7O0FBSmhDLFdBQVcsQ0FBQTs7SUFNVSxhQUFhO1lBQWIsYUFBYTs7QUFDcEIsV0FETyxhQUFhLEdBQ2pCOzBCQURJLGFBQWE7O0FBRTlCLCtCQUZpQixhQUFhLDZDQUV2QjtBQUNQLFFBQUksQ0FBQyxVQUFVLEdBQUcsUUFBUSxDQUFBO0dBQzNCOztlQUprQixhQUFhOztXQVU1QixhQUFDLFFBQVEsRUFBRTtBQUNiLFVBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUE7QUFDekMsVUFBTSxPQUFPLEdBQU0sSUFBSSxDQUFDLFVBQVUsU0FBSSxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxBQUFFLENBQUE7QUFDdEQsVUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLDRCQUE0QixFQUFFLENBQUE7O0FBRW5ELGFBQU8sQ0FBQyxHQUFHLEdBQUcsa0JBQUssT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFBO0FBQ3BDLGFBQU8sQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFBOztBQUU1QixhQUFPLElBQUksT0FBTyxDQUFDLFVBQUMsT0FBTyxFQUFLOztBQUU5QixtQ0FBYSxJQUFJLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxVQUFDLEtBQUssRUFBSztBQUM3QyxpQkFBTyxDQUFDLEFBQUMsS0FBSyxHQUFJLEtBQUssQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUE7U0FDbEMsQ0FBQyxDQUFBO09BQ0gsQ0FBQyxDQUFBO0tBQ0g7OztXQUVhLHVCQUFDLFFBQVEsRUFBRTtBQUN2QixVQUFNLElBQUksR0FBRyxDQUNYLFNBQVMsRUFDVCxPQUFPLEVBQ1AsMENBQTBDOztBQUUxQyw0Q0FBc0MsQ0FDdkMsQ0FBQTs7QUFFRCxVQUFNLGlCQUFpQixHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLHlCQUF5QixDQUFDLENBQUE7QUFDcEUsVUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMscUJBQXFCLENBQUMsS0FBSyxLQUFLLENBQUE7QUFDdEUsVUFBTSxlQUFlLEdBQUcsSUFBSSxDQUFDLHVCQUF1QixDQUFDLFFBQVEsQ0FBQyxDQUFBO0FBQzlELFVBQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLG9CQUFvQixDQUFDLENBQUE7QUFDMUQsVUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUE7O0FBRTlDLFVBQUksaUJBQWlCLEVBQUU7QUFDckIsWUFBSSxDQUFDLElBQUksQ0FBQywrQkFBK0IsQ0FBQyxDQUFBO09BQzNDO0FBQ0QsVUFBSSxhQUFhLEVBQUU7QUFDakIsWUFBSSxDQUFDLElBQUksQ0FBQyw0QkFBNEIsQ0FBQyxDQUFBO09BQ3hDOztBQUVELFVBQUksZUFBZSxFQUFFO0FBQ25CLFlBQUksQ0FBQyxJQUFJLGdCQUFjLGVBQWUsT0FBSSxDQUFBO09BQzNDLE1BQU0sSUFBSSxZQUFZLEVBQUU7QUFDdkIsWUFBSSxDQUFDLElBQUksZ0JBQWMsWUFBWSxPQUFJLENBQUE7T0FDeEMsTUFBTSxJQUFJLE1BQU0sSUFBSSxNQUFNLEtBQUssU0FBUyxFQUFFO0FBQ3pDLFlBQUksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQTtPQUM1QixNQUFNLElBQUksTUFBTSxJQUFJLE1BQU0sS0FBSyxVQUFVLEVBQUU7QUFDMUMsWUFBSSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFBO09BQzdCOztBQUVELFVBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxRQUFRLENBQUMsQ0FBQTtBQUM5QyxVQUFJLE1BQU0sRUFBRTtBQUNWLFlBQUksQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUMzQixnRUFBZ0UsR0FDaEUsaUVBQWlFLEdBQ2pFLGdDQUFnQyxDQUNqQyxDQUFBO09BQ0Y7O0FBRUQsVUFBSSxDQUFDLElBQUksT0FBSyxRQUFRLE9BQUksQ0FBQTtBQUMxQixhQUFPLElBQUksQ0FBQTtLQUNaOzs7V0EvRGlCLG9CQUFDLFFBQVEsRUFBRTtBQUMzQixhQUFPLGtCQUFLLE9BQU8sQ0FBQyxRQUFRLENBQUMsS0FBSyxNQUFNLENBQUE7S0FDekM7OztTQVJrQixhQUFhOzs7cUJBQWIsYUFBYSIsImZpbGUiOiIvaG9tZS9jaW5fY2hhbGljLy5hdG9tL3BhY2thZ2VzL2xhdGV4L2xpYi9idWlsZGVycy90ZXhpZnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5pbXBvcnQgY2hpbGRQcm9jZXNzIGZyb20gJ2NoaWxkX3Byb2Nlc3MnXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IEJ1aWxkZXIgZnJvbSAnLi4vYnVpbGRlcidcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGV4aWZ5QnVpbGRlciBleHRlbmRzIEJ1aWxkZXIge1xuICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgc3VwZXIoKVxuICAgIHRoaXMuZXhlY3V0YWJsZSA9ICd0ZXhpZnknXG4gIH1cblxuICBzdGF0aWMgY2FuUHJvY2VzcyAoZmlsZVBhdGgpIHtcbiAgICByZXR1cm4gcGF0aC5leHRuYW1lKGZpbGVQYXRoKSA9PT0gJy50ZXgnXG4gIH1cblxuICBydW4gKGZpbGVQYXRoKSB7XG4gICAgY29uc3QgYXJncyA9IHRoaXMuY29uc3RydWN0QXJncyhmaWxlUGF0aClcbiAgICBjb25zdCBjb21tYW5kID0gYCR7dGhpcy5leGVjdXRhYmxlfSAke2FyZ3Muam9pbignICcpfWBcbiAgICBjb25zdCBvcHRpb25zID0gdGhpcy5jb25zdHJ1Y3RDaGlsZFByb2Nlc3NPcHRpb25zKClcblxuICAgIG9wdGlvbnMuY3dkID0gcGF0aC5kaXJuYW1lKGZpbGVQYXRoKSAvLyBSdW4gcHJvY2VzcyB3aXRoIHNlbnNpYmxlIENXRC5cbiAgICBvcHRpb25zLm1heEJ1ZmZlciA9IDUyNDI4ODAwIC8vIFNldCBwcm9jZXNzJyBtYXggYnVmZmVyIHNpemUgdG8gNTAgTUIuXG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgIC8vIFRPRE86IEFkZCBzdXBwb3J0IGZvciBraWxsaW5nIHRoZSBwcm9jZXNzLlxuICAgICAgY2hpbGRQcm9jZXNzLmV4ZWMoY29tbWFuZCwgb3B0aW9ucywgKGVycm9yKSA9PiB7XG4gICAgICAgIHJlc29sdmUoKGVycm9yKSA/IGVycm9yLmNvZGUgOiAwKVxuICAgICAgfSlcbiAgICB9KVxuICB9XG5cbiAgY29uc3RydWN0QXJncyAoZmlsZVBhdGgpIHtcbiAgICBjb25zdCBhcmdzID0gW1xuICAgICAgJy0tYmF0Y2gnLFxuICAgICAgJy0tcGRmJyxcbiAgICAgICctLXRleC1vcHRpb249XCItLWludGVyYWN0aW9uPW5vbnN0b3Btb2RlXCInLFxuICAgICAgLy8gU2V0IGxvZ2ZpbGUgbWF4IGxpbmUgbGVuZ3RoLlxuICAgICAgJy0tdGV4LW9wdGlvbj1cIi0tbWF4LXByaW50LWxpbmU9MTAwMFwiJ1xuICAgIF1cblxuICAgIGNvbnN0IGVuYWJsZVNoZWxsRXNjYXBlID0gYXRvbS5jb25maWcuZ2V0KCdsYXRleC5lbmFibGVTaGVsbEVzY2FwZScpXG4gICAgY29uc3QgZW5hYmxlU3luY3RleCA9IGF0b20uY29uZmlnLmdldCgnbGF0ZXguZW5hYmxlU3luY3RleCcpICE9PSBmYWxzZVxuICAgIGNvbnN0IGVuZ2luZUZyb21NYWdpYyA9IHRoaXMuZ2V0TGF0ZXhFbmdpbmVGcm9tTWFnaWMoZmlsZVBhdGgpXG4gICAgY29uc3QgY3VzdG9tRW5naW5lID0gYXRvbS5jb25maWcuZ2V0KCdsYXRleC5jdXN0b21FbmdpbmUnKVxuICAgIGNvbnN0IGVuZ2luZSA9IGF0b20uY29uZmlnLmdldCgnbGF0ZXguZW5naW5lJylcblxuICAgIGlmIChlbmFibGVTaGVsbEVzY2FwZSkge1xuICAgICAgYXJncy5wdXNoKCctLXRleC1vcHRpb249LS1lbmFibGUtd3JpdGUxOCcpXG4gICAgfVxuICAgIGlmIChlbmFibGVTeW5jdGV4KSB7XG4gICAgICBhcmdzLnB1c2goJy0tdGV4LW9wdGlvbj1cIi0tc3luY3RleD0xXCInKVxuICAgIH1cblxuICAgIGlmIChlbmdpbmVGcm9tTWFnaWMpIHtcbiAgICAgIGFyZ3MucHVzaChgLS1lbmdpbmU9XCIke2VuZ2luZUZyb21NYWdpY31cImApXG4gICAgfSBlbHNlIGlmIChjdXN0b21FbmdpbmUpIHtcbiAgICAgIGFyZ3MucHVzaChgLS1lbmdpbmU9XCIke2N1c3RvbUVuZ2luZX1cImApXG4gICAgfSBlbHNlIGlmIChlbmdpbmUgJiYgZW5naW5lID09PSAneGVsYXRleCcpIHtcbiAgICAgIGFyZ3MucHVzaCgnLS1lbmdpbmU9eGV0ZXgnKVxuICAgIH0gZWxzZSBpZiAoZW5naW5lICYmIGVuZ2luZSA9PT0gJ2x1YWxhdGV4Jykge1xuICAgICAgYXJncy5wdXNoKCctLWVuZ2luZT1sdWF0ZXgnKVxuICAgIH1cblxuICAgIGxldCBvdXRkaXIgPSB0aGlzLmdldE91dHB1dERpcmVjdG9yeShmaWxlUGF0aClcbiAgICBpZiAob3V0ZGlyKSB7XG4gICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkV2FybmluZyhcbiAgICAgICAgJ091dHB1dCBkaXJlY3RvcnkgZnVuY3Rpb25hbGl0eSBpcyBwb29ybHkgc3VwcG9ydGVkIGJ5IHRleGlmeSwgJyArXG4gICAgICAgICdzbyB0aGlzIGZ1bmN0aW9uYWxpdHkgaXMgZGlzYWJsZWQgKGZvciB0aGUgZm9yZXNlZWFibGUgZnV0dXJlKSAnICtcbiAgICAgICAgJ3doZW4gdXNpbmcgdGhlIHRleGlmeSBidWlsZGVyLidcbiAgICAgIClcbiAgICB9XG5cbiAgICBhcmdzLnB1c2goYFwiJHtmaWxlUGF0aH1cImApXG4gICAgcmV0dXJuIGFyZ3NcbiAgfVxufVxuIl19
//# sourceURL=/home/cin_chalic/.atom/packages/latex/lib/builders/texify.js
