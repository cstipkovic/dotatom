Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _fsPlus = require('fs-plus');

var _fsPlus2 = _interopRequireDefault(_fsPlus);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

'use babel';

var outputPattern = new RegExp('' + '^Output\\swritten\\son\\s' + // Leading text.
'(.*)' + // Output path.
'\\s\\(.*\\)\\.$' // Trailing text.
);

var errorPattern = new RegExp('' + '^(.*):' + // File path.
'(\\d+):' + // Line number.
'\\sLaTeX\\sError:\\s' + // Marker.
'(.*)\\.$' // Error message.
);

var LogParser = (function () {
  function LogParser(filePath) {
    _classCallCheck(this, LogParser);

    this.filePath = filePath;
    this.projectPath = _path2['default'].dirname(filePath);
  }

  _createClass(LogParser, [{
    key: 'parse',
    value: function parse() {
      var _this = this;

      var result = {
        logFilePath: this.filePath,
        outputFilePath: null,
        errors: [],
        warnings: []
      };

      var lines = this.getLines();
      _lodash2['default'].forEach(lines, function (line, index) {
        // Simplest Thing That Works™ and KISS®
        var match = line.match(outputPattern);
        if (match) {
          var filePath = match[1].replace(/\'/g, ''); // TODO: Fix with improved regex.
          result.outputFilePath = _path2['default'].resolve(_this.projectPath, filePath);
          return;
        }

        match = line.match(errorPattern);
        if (match) {
          result.errors.push({
            logPosition: [index, 0],
            filePath: match[1],
            lineNumber: parseInt(match[2], 10),
            message: match[3]
          });
          return;
        }
      });

      return result;
    }
  }, {
    key: 'getLines',
    value: function getLines() {
      if (!_fsPlus2['default'].existsSync(this.filePath)) {
        throw new Error('No such file: ' + this.filePath);
      }

      var rawFile = _fsPlus2['default'].readFileSync(this.filePath, { encoding: 'utf-8' });
      var lines = rawFile.replace(/(\r\n)|\r/g, '\n').split('\n');
      return lines;
    }
  }]);

  return LogParser;
})();

exports['default'] = LogParser;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL3BhcnNlcnMvbG9nLXBhcnNlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O3NCQUVjLFFBQVE7Ozs7c0JBQ1AsU0FBUzs7OztvQkFDUCxNQUFNOzs7O0FBSnZCLFdBQVcsQ0FBQTs7QUFNWCxJQUFNLGFBQWEsR0FBRyxJQUFJLE1BQU0sQ0FBQyxFQUFFLEdBQ2pDLDJCQUEyQjtBQUMzQixNQUFNO0FBQ04saUJBQWlCO0NBQ2xCLENBQUE7O0FBRUQsSUFBTSxZQUFZLEdBQUcsSUFBSSxNQUFNLENBQUMsRUFBRSxHQUNoQyxRQUFRO0FBQ1IsU0FBUztBQUNULHNCQUFzQjtBQUN0QixVQUFVO0NBQ1gsQ0FBQTs7SUFFb0IsU0FBUztBQUNoQixXQURPLFNBQVMsQ0FDZixRQUFRLEVBQUU7MEJBREosU0FBUzs7QUFFMUIsUUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUE7QUFDeEIsUUFBSSxDQUFDLFdBQVcsR0FBRyxrQkFBSyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUE7R0FDMUM7O2VBSmtCLFNBQVM7O1dBTXRCLGlCQUFHOzs7QUFDUCxVQUFNLE1BQU0sR0FBRztBQUNiLG1CQUFXLEVBQUUsSUFBSSxDQUFDLFFBQVE7QUFDMUIsc0JBQWMsRUFBRSxJQUFJO0FBQ3BCLGNBQU0sRUFBRSxFQUFFO0FBQ1YsZ0JBQVEsRUFBRSxFQUFFO09BQ2IsQ0FBQTs7QUFFRCxVQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUE7QUFDN0IsMEJBQUUsT0FBTyxDQUFDLEtBQUssRUFBRSxVQUFDLElBQUksRUFBRSxLQUFLLEVBQUs7O0FBRWhDLFlBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUE7QUFDckMsWUFBSSxLQUFLLEVBQUU7QUFDVCxjQUFNLFFBQVEsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQTtBQUM1QyxnQkFBTSxDQUFDLGNBQWMsR0FBRyxrQkFBSyxPQUFPLENBQUMsTUFBSyxXQUFXLEVBQUUsUUFBUSxDQUFDLENBQUE7QUFDaEUsaUJBQU07U0FDUDs7QUFFRCxhQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQTtBQUNoQyxZQUFJLEtBQUssRUFBRTtBQUNULGdCQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztBQUNqQix1QkFBVyxFQUFFLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQztBQUN2QixvQkFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7QUFDbEIsc0JBQVUsRUFBRSxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQztBQUNsQyxtQkFBTyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7V0FDbEIsQ0FBQyxDQUFBO0FBQ0YsaUJBQU07U0FDUDtPQUNGLENBQUMsQ0FBQTs7QUFFRixhQUFPLE1BQU0sQ0FBQTtLQUNkOzs7V0FFUSxvQkFBRztBQUNWLFVBQUksQ0FBQyxvQkFBRyxVQUFVLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFO0FBQ2pDLGNBQU0sSUFBSSxLQUFLLG9CQUFrQixJQUFJLENBQUMsUUFBUSxDQUFHLENBQUE7T0FDbEQ7O0FBRUQsVUFBTSxPQUFPLEdBQUcsb0JBQUcsWUFBWSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsRUFBQyxRQUFRLEVBQUUsT0FBTyxFQUFDLENBQUMsQ0FBQTtBQUNuRSxVQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUE7QUFDN0QsYUFBTyxLQUFLLENBQUE7S0FDYjs7O1NBL0NrQixTQUFTOzs7cUJBQVQsU0FBUyIsImZpbGUiOiIvaG9tZS9jaW5fY2hhbGljLy5hdG9tL3BhY2thZ2VzL2xhdGV4L2xpYi9wYXJzZXJzL2xvZy1wYXJzZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnXG5pbXBvcnQgZnMgZnJvbSAnZnMtcGx1cydcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5cbmNvbnN0IG91dHB1dFBhdHRlcm4gPSBuZXcgUmVnRXhwKCcnICtcbiAgJ15PdXRwdXRcXFxcc3dyaXR0ZW5cXFxcc29uXFxcXHMnICsgLy8gTGVhZGluZyB0ZXh0LlxuICAnKC4qKScgKyAgICAgICAgICAgICAgICAgICAgICAvLyBPdXRwdXQgcGF0aC5cbiAgJ1xcXFxzXFxcXCguKlxcXFwpXFxcXC4kJyAgICAgICAgICAgICAvLyBUcmFpbGluZyB0ZXh0LlxuKVxuXG5jb25zdCBlcnJvclBhdHRlcm4gPSBuZXcgUmVnRXhwKCcnICtcbiAgJ14oLiopOicgKyAgICAgICAgICAgICAgIC8vIEZpbGUgcGF0aC5cbiAgJyhcXFxcZCspOicgKyAgICAgICAgICAgICAgLy8gTGluZSBudW1iZXIuXG4gICdcXFxcc0xhVGVYXFxcXHNFcnJvcjpcXFxccycgKyAvLyBNYXJrZXIuXG4gICcoLiopXFxcXC4kJyAgICAgICAgICAgICAgIC8vIEVycm9yIG1lc3NhZ2UuXG4pXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExvZ1BhcnNlciB7XG4gIGNvbnN0cnVjdG9yIChmaWxlUGF0aCkge1xuICAgIHRoaXMuZmlsZVBhdGggPSBmaWxlUGF0aFxuICAgIHRoaXMucHJvamVjdFBhdGggPSBwYXRoLmRpcm5hbWUoZmlsZVBhdGgpXG4gIH1cblxuICBwYXJzZSAoKSB7XG4gICAgY29uc3QgcmVzdWx0ID0ge1xuICAgICAgbG9nRmlsZVBhdGg6IHRoaXMuZmlsZVBhdGgsXG4gICAgICBvdXRwdXRGaWxlUGF0aDogbnVsbCxcbiAgICAgIGVycm9yczogW10sXG4gICAgICB3YXJuaW5nczogW11cbiAgICB9XG5cbiAgICBjb25zdCBsaW5lcyA9IHRoaXMuZ2V0TGluZXMoKVxuICAgIF8uZm9yRWFjaChsaW5lcywgKGxpbmUsIGluZGV4KSA9PiB7XG4gICAgICAvLyBTaW1wbGVzdCBUaGluZyBUaGF0IFdvcmtz4oSiIGFuZCBLSVNTwq5cbiAgICAgIGxldCBtYXRjaCA9IGxpbmUubWF0Y2gob3V0cHV0UGF0dGVybilcbiAgICAgIGlmIChtYXRjaCkge1xuICAgICAgICBjb25zdCBmaWxlUGF0aCA9IG1hdGNoWzFdLnJlcGxhY2UoL1xcJy9nLCAnJykgLy8gVE9ETzogRml4IHdpdGggaW1wcm92ZWQgcmVnZXguXG4gICAgICAgIHJlc3VsdC5vdXRwdXRGaWxlUGF0aCA9IHBhdGgucmVzb2x2ZSh0aGlzLnByb2plY3RQYXRoLCBmaWxlUGF0aClcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIG1hdGNoID0gbGluZS5tYXRjaChlcnJvclBhdHRlcm4pXG4gICAgICBpZiAobWF0Y2gpIHtcbiAgICAgICAgcmVzdWx0LmVycm9ycy5wdXNoKHtcbiAgICAgICAgICBsb2dQb3NpdGlvbjogW2luZGV4LCAwXSxcbiAgICAgICAgICBmaWxlUGF0aDogbWF0Y2hbMV0sXG4gICAgICAgICAgbGluZU51bWJlcjogcGFyc2VJbnQobWF0Y2hbMl0sIDEwKSxcbiAgICAgICAgICBtZXNzYWdlOiBtYXRjaFszXVxuICAgICAgICB9KVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICB9KVxuXG4gICAgcmV0dXJuIHJlc3VsdFxuICB9XG5cbiAgZ2V0TGluZXMgKCkge1xuICAgIGlmICghZnMuZXhpc3RzU3luYyh0aGlzLmZpbGVQYXRoKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBObyBzdWNoIGZpbGU6ICR7dGhpcy5maWxlUGF0aH1gKVxuICAgIH1cblxuICAgIGNvbnN0IHJhd0ZpbGUgPSBmcy5yZWFkRmlsZVN5bmModGhpcy5maWxlUGF0aCwge2VuY29kaW5nOiAndXRmLTgnfSlcbiAgICBjb25zdCBsaW5lcyA9IHJhd0ZpbGUucmVwbGFjZSgvKFxcclxcbil8XFxyL2csICdcXG4nKS5zcGxpdCgnXFxuJylcbiAgICByZXR1cm4gbGluZXNcbiAgfVxufVxuIl19
//# sourceURL=/home/cin_chalic/.atom/packages/latex/lib/parsers/log-parser.js
