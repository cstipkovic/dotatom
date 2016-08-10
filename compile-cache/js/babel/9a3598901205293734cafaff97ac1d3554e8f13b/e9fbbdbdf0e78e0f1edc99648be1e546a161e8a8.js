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

var _parsersLogParser = require('./parsers/log-parser');

var _parsersLogParser2 = _interopRequireDefault(_parsersLogParser);

var _parsersMagicParser = require('./parsers/magic-parser');

var _parsersMagicParser2 = _interopRequireDefault(_parsersMagicParser);

'use babel';

var Builder = (function () {
  function Builder() {
    _classCallCheck(this, Builder);

    this.envPathKey = this.getEnvironmentPathKey(process.platform);
  }

  _createClass(Builder, [{
    key: 'run',
    value: function run() /* filePath */{}
  }, {
    key: 'constructArgs',
    value: function constructArgs() /* filePath */{}
  }, {
    key: 'parseLogFile',
    value: function parseLogFile(texFilePath) {
      var logFilePath = this.resolveLogFilePath(texFilePath);
      if (!_fsPlus2['default'].existsSync(logFilePath)) {
        return null;
      }

      var parser = this.getLogParser(logFilePath);
      return parser.parse();
    }
  }, {
    key: 'getLogParser',
    value: function getLogParser(logFilePath) {
      return new _parsersLogParser2['default'](logFilePath);
    }
  }, {
    key: 'constructChildProcessOptions',
    value: function constructChildProcessOptions() {
      var env = _lodash2['default'].clone(process.env);
      var childPath = this.constructPath();
      if (childPath) {
        env[this.envPathKey] = childPath;
      }

      return { env: env };
    }
  }, {
    key: 'constructPath',
    value: function constructPath() {
      var texPath = (atom.config.get('latex.texPath') || '').trim();
      if (texPath.length === 0) {
        texPath = this.defaultTexPath(process.platform);
      }

      var processPath = process.env[this.envPathKey];
      var match = texPath.match(/^(.*)(\$PATH)(.*)$/);
      if (match) {
        return '' + match[1] + processPath + match[3];
      }

      return [texPath, processPath].filter(function (str) {
        return str && str.length > 0;
      }).join(_path2['default'].delimiter);
    }
  }, {
    key: 'defaultTexPath',
    value: function defaultTexPath(platform) {
      if (platform === 'win32') {
        return ['%SystemDrive%\\texlive\\2015\\bin\\win32', '%SystemDrive%\\texlive\\2014\\bin\\win32', '%ProgramFiles%\\MiKTeX 2.9\\miktex\\bin\\x64', '%ProgramFiles(x86)%\\MiKTeX 2.9\\miktex\\bin'].join(';');
      }

      return ['/usr/texbin', '/Library/TeX/texbin'].join(':');
    }
  }, {
    key: 'resolveLogFilePath',
    value: function resolveLogFilePath(texFilePath) {
      var outputDirectory = atom.config.get('latex.outputDirectory') || '';
      var currentDirectory = _path2['default'].dirname(texFilePath);
      var fileName = _path2['default'].basename(texFilePath).replace(/\.\w+$/, '.log');

      return _path2['default'].join(currentDirectory, outputDirectory, fileName);
    }
  }, {
    key: 'getEnvironmentPathKey',
    value: function getEnvironmentPathKey(platform) {
      if (platform === 'win32') {
        return 'Path';
      }
      return 'PATH';
    }
  }, {
    key: 'getOutputDirectory',
    value: function getOutputDirectory(filePath) {
      var outdir = atom.config.get('latex.outputDirectory');
      if (outdir) {
        var dir = _path2['default'].dirname(filePath);
        outdir = _path2['default'].join(dir, outdir);
      }

      return outdir;
    }
  }, {
    key: 'getLatexEngineFromMagic',
    value: function getLatexEngineFromMagic(filePath) {
      var magic = new _parsersMagicParser2['default'](filePath).parse();
      if (magic && magic.program) {
        return magic.program;
      }

      return null;
    }
  }]);

  return Builder;
})();

exports['default'] = Builder;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL2J1aWxkZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztzQkFFYyxRQUFROzs7O3NCQUNQLFNBQVM7Ozs7b0JBQ1AsTUFBTTs7OztnQ0FDRCxzQkFBc0I7Ozs7a0NBQ3BCLHdCQUF3Qjs7OztBQU5oRCxXQUFXLENBQUE7O0lBUVUsT0FBTztBQUNkLFdBRE8sT0FBTyxHQUNYOzBCQURJLE9BQU87O0FBRXhCLFFBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLHFCQUFxQixDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQTtHQUMvRDs7ZUFIa0IsT0FBTzs7V0FLdEIsNkJBQWlCLEVBQUU7OztXQUNULHVDQUFpQixFQUFFOzs7V0FFcEIsc0JBQUMsV0FBVyxFQUFFO0FBQ3pCLFVBQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxXQUFXLENBQUMsQ0FBQTtBQUN4RCxVQUFJLENBQUMsb0JBQUcsVUFBVSxDQUFDLFdBQVcsQ0FBQyxFQUFFO0FBQUUsZUFBTyxJQUFJLENBQUE7T0FBRTs7QUFFaEQsVUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUMsQ0FBQTtBQUM3QyxhQUFPLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQTtLQUN0Qjs7O1dBRVksc0JBQUMsV0FBVyxFQUFFO0FBQ3pCLGFBQU8sa0NBQWMsV0FBVyxDQUFDLENBQUE7S0FDbEM7OztXQUU0Qix3Q0FBRztBQUM5QixVQUFNLEdBQUcsR0FBRyxvQkFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFBO0FBQ2hDLFVBQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQTtBQUN0QyxVQUFJLFNBQVMsRUFBRTtBQUNiLFdBQUcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsU0FBUyxDQUFBO09BQ2pDOztBQUVELGFBQU8s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L2J1aWxkZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnXG5pbXBvcnQgZnMgZnJvbSAnZnMtcGx1cydcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5pbXBvcnQgTG9nUGFyc2VyIGZyb20gJy4vcGFyc2Vycy9sb2ctcGFyc2VyJ1xuaW1wb3J0IE1hZ2ljUGFyc2VyIGZyb20gJy4vcGFyc2Vycy9tYWdpYy1wYXJzZXInXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJ1aWxkZXIge1xuICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgdGhpcy5lbnZQYXRoS2V5ID0gdGhpcy5nZXRFbnZpcm9ubWVudFBhdGhLZXkocHJvY2Vzcy5wbGF0Zm9ybSlcbiAgfVxuXG4gIHJ1biAoLyogZmlsZVBhdGggKi8pIHt9XG4gIGNvbnN0cnVjdEFyZ3MgKC8qIGZpbGVQYXRoICovKSB7fVxuXG4gIHBhcnNlTG9nRmlsZSAodGV4RmlsZVBhdGgpIHtcbiAgICBjb25zdCBsb2dGaWxlUGF0aCA9IHRoaXMucmVzb2x2ZUxvZ0ZpbGVQYXRoKHRleEZpbGVQYXRoKVxuICAgIGlmICghZnMuZXhpc3RzU3luYyhsb2dGaWxlUGF0aCkpIHsgcmV0dXJuIG51bGwgfVxuXG4gICAgY29uc3QgcGFyc2VyID0gdGhpcy5nZXRMb2dQYXJzZXIobG9nRmlsZVBhdGgpXG4gICAgcmV0dXJuIHBhcnNlci5wYXJzZSgpXG4gIH1cblxuICBnZXRMb2dQYXJzZXIgKGxvZ0ZpbGVQYXRoKSB7XG4gICAgcmV0dXJuIG5ldyBMb2dQYXJzZXIobG9nRmlsZVBhdGgpXG4gIH1cblxuICBjb25zdHJ1Y3RDaGlsZFByb2Nlc3NPcHRpb25zICgpIHtcbiAgICBjb25zdCBlbnYgPSBfLmNsb25lKHByb2Nlc3MuZW52KVxuICAgIGNvbnN0IGNoaWxkUGF0aCA9IHRoaXMuY29uc3RydWN0UGF0aCgpXG4gICAgaWYgKGNoaWxkUGF0aCkge1xuICAgICAgZW52W3RoaXMuZW52UGF0aEtleV0gPSBjaGlsZFBhdGhcbiAgICB9XG5cbiAgICByZXR1cm4ge2Vudn1cbiAgfVxuXG4gIGNvbnN0cnVjdFBhdGggKCkge1xuICAgIGxldCB0ZXhQYXRoID0gKGF0b20uY29uZmlnLmdldCgnbGF0ZXgudGV4UGF0aCcpIHx8ICcnKS50cmltKClcbiAgICBpZiAodGV4UGF0aC5sZW5ndGggPT09IDApIHtcbiAgICAgIHRleFBhdGggPSB0aGlzLmRlZmF1bHRUZXhQYXRoKHByb2Nlc3MucGxhdGZvcm0pXG4gICAgfVxuXG4gICAgY29uc3QgcHJvY2Vzc1BhdGggPSBwcm9jZXNzLmVudlt0aGlzLmVudlBhdGhLZXldXG4gICAgY29uc3QgbWF0Y2ggPSB0ZXhQYXRoLm1hdGNoKC9eKC4qKShcXCRQQVRIKSguKikkLylcbiAgICBpZiAobWF0Y2gpIHtcbiAgICAgIHJldHVybiBgJHttYXRjaFsxXX0ke3Byb2Nlc3NQYXRofSR7bWF0Y2hbM119YFxuICAgIH1cblxuICAgIHJldHVybiBbdGV4UGF0aCwgcHJvY2Vzc1BhdGhdXG4gICAgICAuZmlsdGVyKHN0ciA9PiBzdHIgJiYgc3RyLmxlbmd0aCA+IDApXG4gICAgICAuam9pbihwYXRoLmRlbGltaXRlcilcbiAgfVxuXG4gIGRlZmF1bHRUZXhQYXRoIChwbGF0Zm9ybSkge1xuICAgIGlmIChwbGF0Zm9ybSA9PT0gJ3dpbjMyJykge1xuICAgICAgcmV0dXJuIFtcbiAgICAgICAgJyVTeXN0ZW1Ecml2ZSVcXFxcdGV4bGl2ZVxcXFwyMDE1XFxcXGJpblxcXFx3aW4zMicsXG4gICAgICAgICclU3lzdGVtRHJpdmUlXFxcXHRleGxpdmVcXFxcMjAxNFxcXFxiaW5cXFxcd2luMzInLFxuICAgICAgICAnJVByb2dyYW1GaWxlcyVcXFxcTWlLVGVYIDIuOVxcXFxtaWt0ZXhcXFxcYmluXFxcXHg2NCcsXG4gICAgICAgICclUHJvZ3JhbUZpbGVzKHg4NiklXFxcXE1pS1RlWCAyLjlcXFxcbWlrdGV4XFxcXGJpbidcbiAgICAgIF0uam9pbignOycpXG4gICAgfVxuXG4gICAgcmV0dXJuIFtcbiAgICAgICcvdXNyL3RleGJpbicsXG4gICAgICAnL0xpYnJhcnkvVGVYL3RleGJpbidcbiAgICBdLmpvaW4oJzonKVxuICB9XG5cbiAgcmVzb2x2ZUxvZ0ZpbGVQYXRoICh0ZXhGaWxlUGF0aCkge1xuICAgIGNvbnN0IG91dHB1dERpcmVjdG9yeSA9IGF0b20uY29uZmlnLmdldCgnbGF0ZXgub3V0cHV0RGlyZWN0b3J5JykgfHwgJydcbiAgICBjb25zdCBjdXJyZW50RGlyZWN0b3J5ID0gcGF0aC5kaXJuYW1lKHRleEZpbGVQYXRoKVxuICAgIGNvbnN0IGZpbGVOYW1lID0gcGF0aC5iYXNlbmFtZSh0ZXhGaWxlUGF0aCkucmVwbGFjZSgvXFwuXFx3KyQvLCAnLmxvZycpXG5cbiAgICByZXR1cm4gcGF0aC5qb2luKGN1cnJlbnREaXJlY3RvcnksIG91dHB1dERpcmVjdG9yeSwgZmlsZU5hbWUpXG4gIH1cblxuICBnZXRFbnZpcm9ubWVudFBhdGhLZXkgKHBsYXRmb3JtKSB7XG4gICAgaWYgKHBsYXRmb3JtID09PSAnd2luMzInKSB7IHJldHVybiAnUGF0aCcgfVxuICAgIHJldHVybiAnUEFUSCdcbiAgfVxuXG4gIGdldE91dHB1dERpcmVjdG9yeSAoZmlsZVBhdGgpIHtcbiAgICBsZXQgb3V0ZGlyID0gYXRvbS5jb25maWcuZ2V0KCdsYXRleC5vdXRwdXREaXJlY3RvcnknKVxuICAgIGlmIChvdXRkaXIpIHtcbiAgICAgIGNvbnN0IGRpciA9IHBhdGguZGlybmFtZShmaWxlUGF0aClcbiAgICAgIG91dGRpciA9IHBhdGguam9pbihkaXIsIG91dGRpcilcbiAgICB9XG5cbiAgICByZXR1cm4gb3V0ZGlyXG4gIH1cblxuICBnZXRMYXRleEVuZ2luZUZyb21NYWdpYyAoZmlsZVBhdGgpIHtcbiAgICBjb25zdCBtYWdpYyA9IG5ldyBNYWdpY1BhcnNlcihmaWxlUGF0aCkucGFyc2UoKVxuICAgIGlmIChtYWdpYyAmJiBtYWdpYy5wcm9ncmFtKSB7XG4gICAgICByZXR1cm4gbWFnaWMucHJvZ3JhbVxuICAgIH1cblxuICAgIHJldHVybiBudWxsXG4gIH1cbn1cbiJdfQ==
//# sourceURL=/home/cin_chalic/.atom/packages/latex/lib/builder.js
