Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _fsPlus = require('fs-plus');

var _fsPlus2 = _interopRequireDefault(_fsPlus);

'use babel';

var magicCommentPattern = new RegExp('' + '^%\\s*' + // Optional whitespace.
'!TEX' + // Magic marker.
'\\s+' + // Semi-optional whitespace.
'(\\w+)' + // [1] Captures the magic keyword. E.g. 'root'.
'\\s*=\\s*' + // Equal sign wrapped in optional whitespace.
'(.*)' + // [2] Captures everything following the equal sign.
'$' // EOL.
);

var latexCommandPattern = new RegExp('' + '\\' + // starting command \
'\\w+' + // command name e.g. input
'(\\{|\\w|\\}|/|\\]|\\[)*' // options to the command
);

var MagicParser = (function () {
  function MagicParser(filePath) {
    _classCallCheck(this, MagicParser);

    this.filePath = filePath;
  }

  _createClass(MagicParser, [{
    key: 'parse',
    value: function parse() {
      var result = {};
      var lines = this.getLines();
      for (var line of lines) {
        var match = line.match(magicCommentPattern);
        var latexCommandMatch = line.match(latexCommandPattern);

        if (latexCommandMatch) {
          break;
        } // Stop parsing if a latex command was found
        if (match != null) {
          result[match[1]] = match[2];
        }
      }

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

  return MagicParser;
})();

exports['default'] = MagicParser;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL3BhcnNlcnMvbWFnaWMtcGFyc2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7c0JBRWUsU0FBUzs7OztBQUZ4QixXQUFXLENBQUE7O0FBSVgsSUFBTSxtQkFBbUIsR0FBRyxJQUFJLE1BQU0sQ0FBQyxFQUFFLEdBQ3ZDLFFBQVE7QUFDUixNQUFNO0FBQ04sTUFBTTtBQUNOLFFBQVE7QUFDUixXQUFXO0FBQ1gsTUFBTTtBQUNOLEdBQUc7Q0FDSixDQUFBOztBQUVELElBQU0sbUJBQW1CLEdBQUcsSUFBSSxNQUFNLENBQUMsRUFBRSxHQUN2QyxJQUFJO0FBQ0osTUFBTTtBQUNOLDBCQUEwQjtDQUMzQixDQUFBOztJQUVvQixXQUFXO0FBQ2xCLFdBRE8sV0FBVyxDQUNqQixRQUFRLEVBQUU7MEJBREosV0FBVzs7QUFFNUIsUUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUE7R0FDekI7O2VBSGtCLFdBQVc7O1dBS3hCLGlCQUFHO0FBQ1AsVUFBTSxNQUFNLEdBQUcsRUFBRSxDQUFBO0FBQ2pCLFVBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQTtBQUM3QixXQUFLLElBQU0sSUFBSSxJQUFJLEtBQUssRUFBRTtBQUN4QixZQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLG1CQUFtQixDQUFDLENBQUE7QUFDN0MsWUFBTSxpQkFBaUIsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLG1CQUFtQixDQUFDLENBQUE7O0FBRXpELFlBQUksaUJBQWlCLEVBQUU7QUFBRSxnQkFBSztTQUFFO0FBQ2hDLFlBQUksS0FBSyxJQUFJLElBQUksRUFBRTtBQUNqQixnQkFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQTtTQUM1QjtPQUNGOztBQUVELGFBQU8sTUFBTSxDQUFBO0tBQ2Q7OztXQUVRLG9CQUFHO0FBQ1YsVUFBSSxDQUFDLG9CQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUU7QUFDakMsY0FBTSxJQUFJLEtBQUssb0JBQWtCLElBQUksQ0FBQyxRQUFRLENBQUcsQ0FBQTtPQUNsRDs7QUFFRCxVQUFNLE9BQU8sR0FBRyxvQkFBRyxZQUFZLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxFQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUMsQ0FBQyxDQUFBO0FBQ25FLFVBQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQTtBQUM3RCxhQUFPLEtBQUssQ0FBQTtLQUNiOzs7U0E3QmtCLFdBQVc7OztxQkFBWCxXQUFXIiwiZmlsZSI6Ii9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL3BhcnNlcnMvbWFnaWMtcGFyc2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuaW1wb3J0IGZzIGZyb20gJ2ZzLXBsdXMnXG5cbmNvbnN0IG1hZ2ljQ29tbWVudFBhdHRlcm4gPSBuZXcgUmVnRXhwKCcnICtcbiAgJ14lXFxcXHMqJyArICAgIC8vIE9wdGlvbmFsIHdoaXRlc3BhY2UuXG4gICchVEVYJyArICAgICAgLy8gTWFnaWMgbWFya2VyLlxuICAnXFxcXHMrJyArICAgICAgLy8gU2VtaS1vcHRpb25hbCB3aGl0ZXNwYWNlLlxuICAnKFxcXFx3KyknICsgICAgLy8gWzFdIENhcHR1cmVzIHRoZSBtYWdpYyBrZXl3b3JkLiBFLmcuICdyb290Jy5cbiAgJ1xcXFxzKj1cXFxccyonICsgLy8gRXF1YWwgc2lnbiB3cmFwcGVkIGluIG9wdGlvbmFsIHdoaXRlc3BhY2UuXG4gICcoLiopJyArICAgICAgLy8gWzJdIENhcHR1cmVzIGV2ZXJ5dGhpbmcgZm9sbG93aW5nIHRoZSBlcXVhbCBzaWduLlxuICAnJCcgICAgICAgICAgIC8vIEVPTC5cbilcblxuY29uc3QgbGF0ZXhDb21tYW5kUGF0dGVybiA9IG5ldyBSZWdFeHAoJycgK1xuICAnXFxcXCcgKyAgICAgICAgICAgICAgICAgICAgICAvLyBzdGFydGluZyBjb21tYW5kIFxcXG4gICdcXFxcdysnICsgICAgICAgICAgICAgICAgICAgIC8vIGNvbW1hbmQgbmFtZSBlLmcuIGlucHV0XG4gICcoXFxcXHt8XFxcXHd8XFxcXH18L3xcXFxcXXxcXFxcWykqJyAgLy8gb3B0aW9ucyB0byB0aGUgY29tbWFuZFxuKVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNYWdpY1BhcnNlciB7XG4gIGNvbnN0cnVjdG9yIChmaWxlUGF0aCkge1xuICAgIHRoaXMuZmlsZVBhdGggPSBmaWxlUGF0aFxuICB9XG5cbiAgcGFyc2UgKCkge1xuICAgIGNvbnN0IHJlc3VsdCA9IHt9XG4gICAgY29uc3QgbGluZXMgPSB0aGlzLmdldExpbmVzKClcbiAgICBmb3IgKGNvbnN0IGxpbmUgb2YgbGluZXMpIHtcbiAgICAgIGNvbnN0IG1hdGNoID0gbGluZS5tYXRjaChtYWdpY0NvbW1lbnRQYXR0ZXJuKVxuICAgICAgY29uc3QgbGF0ZXhDb21tYW5kTWF0Y2ggPSBsaW5lLm1hdGNoKGxhdGV4Q29tbWFuZFBhdHRlcm4pXG5cbiAgICAgIGlmIChsYXRleENvbW1hbmRNYXRjaCkgeyBicmVhayB9IC8vIFN0b3AgcGFyc2luZyBpZiBhIGxhdGV4IGNvbW1hbmQgd2FzIGZvdW5kXG4gICAgICBpZiAobWF0Y2ggIT0gbnVsbCkge1xuICAgICAgICByZXN1bHRbbWF0Y2hbMV1dID0gbWF0Y2hbMl1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0XG4gIH1cblxuICBnZXRMaW5lcyAoKSB7XG4gICAgaWYgKCFmcy5leGlzdHNTeW5jKHRoaXMuZmlsZVBhdGgpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYE5vIHN1Y2ggZmlsZTogJHt0aGlzLmZpbGVQYXRofWApXG4gICAgfVxuXG4gICAgY29uc3QgcmF3RmlsZSA9IGZzLnJlYWRGaWxlU3luYyh0aGlzLmZpbGVQYXRoLCB7ZW5jb2Rpbmc6ICd1dGYtOCd9KVxuICAgIGNvbnN0IGxpbmVzID0gcmF3RmlsZS5yZXBsYWNlKC8oXFxyXFxuKXxcXHIvZywgJ1xcbicpLnNwbGl0KCdcXG4nKVxuICAgIHJldHVybiBsaW5lc1xuICB9XG59XG4iXX0=
//# sourceURL=/home/cin_chalic/.atom/packages/latex/lib/parsers/magic-parser.js
