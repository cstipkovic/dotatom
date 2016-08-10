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
    value: function run() /* filePath, jobname */{}
  }, {
    key: 'constructArgs',
    value: function constructArgs() /* filePath, jobname */{}
  }, {
    key: 'parseLogFile',
    value: function parseLogFile(texFilePath, jobname) {
      var logFilePath = this.resolveLogFilePath(texFilePath, jobname);
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
    value: function constructChildProcessOptions(filePath) {
      var env = _lodash2['default'].clone(process.env);
      var childPath = this.constructPath();
      if (childPath) {
        env[this.envPathKey] = childPath;
      }

      return {
        encoding: 'utf8',
        maxBuffer: 52428800, // Set process' max buffer size to 50 MB.
        cwd: _path2['default'].dirname(filePath), // Run process with sensible CWD.
        env: env
      };
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
    value: function resolveLogFilePath(texFilePath, jobname) {
      var outputDirectory = atom.config.get('latex.outputDirectory') || '';
      var currentDirectory = _path2['default'].dirname(texFilePath);
      var fileName = jobname ? jobname + '.log' : _path2['default'].basename(texFilePath).replace(/\.\w+$/, '.log');

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
  }, {
    key: 'getJobNamesFromMagic',
    value: function getJobNamesFromMagic(filePath) {
      var magic = new _parsersMagicParser2['default'](filePath).parse();
      if (magic && magic.jobnames) {
        return magic.jobnames.split(/\s+/);
      }

      return [null];
    }
  }], [{
    key: 'canProcess',
    value: function canProcess() /* filePath */{}
  }]);

  return Builder;
})();

exports['default'] = Builder;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL2J1aWxkZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztzQkFFYyxRQUFROzs7O3NCQUNQLFNBQVM7Ozs7b0JBQ1AsTUFBTTs7OztnQ0FDRCxzQkFBc0I7Ozs7a0NBQ3BCLHdCQUF3Qjs7OztBQU5oRCxXQUFXLENBQUE7O0lBUVUsT0FBTztXQUFQLE9BQU87MEJBQVAsT0FBTzs7U0FDMUIsVUFBVSxHQUFHLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDOzs7ZUFEdEMsT0FBTzs7V0FJdEIsc0NBQTBCLEVBQUU7OztXQUNsQixnREFBMEIsRUFBRTs7O1dBRTdCLHNCQUFDLFdBQVcsRUFBRSxPQUFPLEVBQUU7QUFDbEMsVUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFdBQVcsRUFBRSxPQUFPLENBQUMsQ0FBQTtBQUNqRSxVQUFJLENBQUMsb0JBQUcsVUFBVSxDQUFDLFdBQVcsQ0FBQyxFQUFFO0FBQUUsZUFBTyxJQUFJLENBQUE7T0FBRTs7QUFFaEQsVUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUMsQ0FBQTtBQUM3QyxhQUFPLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQTtLQUN0Qjs7O1dBRVksc0JBQUMsV0FBVyxFQUFFO0FBQ3pCLGFBQU8sa0NBQWMsV0FBVyxDQUFDLENBQUE7S0FDbEM7OztXQUU0QixzQ0FBQyxRQUFRLEVBQUU7QUFDdEMsVUFBTSxHQUFHLEdBQUcsb0JBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQTtBQUNoQyxVQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUE7QUFDdEMsVUFBSSxTQUFTLEVBQUU7QUFDYixXQUFHLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLFNBQVMsQ0FBQTtPQUNqQzs7QUFFRCxhQUFP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QU8sQ0FBQTtPQUNyQjs7QUFFRCxhQUFPLElBQUksQ0FBQTtLQUNaOzs7V0FFb0IsOEJBQUMsUUFBUSxFQUFFO0FBQzlCLFVBQU0sS0FBSyxHQUFHLG9DQUFnQixRQUFRLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQTtBQUMvQyxVQUFJLEtBQUssSUFBSSxLQUFLLENBQUMsUUFBUSxFQUFFO0FBQzNCLGVBQU8sS0FBSyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUE7T0FDbkM7O0FBRUQsYUFBTyxDQUFDLElBQUksQ0FBQyxDQUFBO0tBQ2Q7OztXQXZHaUIsb0NBQWlCLEVBQUU7OztTQUhsQixPQUFPOzs7cUJBQVAsT0FBTyIsImZpbGUiOiIvaG9tZS9jaW5fY2hhbGljLy5hdG9tL3BhY2thZ2VzL2xhdGV4L2xpYi9idWlsZGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJ1xuaW1wb3J0IGZzIGZyb20gJ2ZzLXBsdXMnXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IExvZ1BhcnNlciBmcm9tICcuL3BhcnNlcnMvbG9nLXBhcnNlcidcbmltcG9ydCBNYWdpY1BhcnNlciBmcm9tICcuL3BhcnNlcnMvbWFnaWMtcGFyc2VyJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCdWlsZGVyIHtcbiAgZW52UGF0aEtleSA9IHRoaXMuZ2V0RW52aXJvbm1lbnRQYXRoS2V5KHByb2Nlc3MucGxhdGZvcm0pXG5cbiAgc3RhdGljIGNhblByb2Nlc3MgKC8qIGZpbGVQYXRoICovKSB7fVxuICBydW4gKC8qIGZpbGVQYXRoLCBqb2JuYW1lICovKSB7fVxuICBjb25zdHJ1Y3RBcmdzICgvKiBmaWxlUGF0aCwgam9ibmFtZSAqLykge31cblxuICBwYXJzZUxvZ0ZpbGUgKHRleEZpbGVQYXRoLCBqb2JuYW1lKSB7XG4gICAgY29uc3QgbG9nRmlsZVBhdGggPSB0aGlzLnJlc29sdmVMb2dGaWxlUGF0aCh0ZXhGaWxlUGF0aCwgam9ibmFtZSlcbiAgICBpZiAoIWZzLmV4aXN0c1N5bmMobG9nRmlsZVBhdGgpKSB7IHJldHVybiBudWxsIH1cblxuICAgIGNvbnN0IHBhcnNlciA9IHRoaXMuZ2V0TG9nUGFyc2VyKGxvZ0ZpbGVQYXRoKVxuICAgIHJldHVybiBwYXJzZXIucGFyc2UoKVxuICB9XG5cbiAgZ2V0TG9nUGFyc2VyIChsb2dGaWxlUGF0aCkge1xuICAgIHJldHVybiBuZXcgTG9nUGFyc2VyKGxvZ0ZpbGVQYXRoKVxuICB9XG5cbiAgY29uc3RydWN0Q2hpbGRQcm9jZXNzT3B0aW9ucyAoZmlsZVBhdGgpIHtcbiAgICBjb25zdCBlbnYgPSBfLmNsb25lKHByb2Nlc3MuZW52KVxuICAgIGNvbnN0IGNoaWxkUGF0aCA9IHRoaXMuY29uc3RydWN0UGF0aCgpXG4gICAgaWYgKGNoaWxkUGF0aCkge1xuICAgICAgZW52W3RoaXMuZW52UGF0aEtleV0gPSBjaGlsZFBhdGhcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgZW5jb2Rpbmc6ICd1dGY4JyxcbiAgICAgIG1heEJ1ZmZlcjogNTI0Mjg4MDAsIC8vIFNldCBwcm9jZXNzJyBtYXggYnVmZmVyIHNpemUgdG8gNTAgTUIuXG4gICAgICBjd2Q6IHBhdGguZGlybmFtZShmaWxlUGF0aCksIC8vIFJ1biBwcm9jZXNzIHdpdGggc2Vuc2libGUgQ1dELlxuICAgICAgZW52XG4gICAgfVxuICB9XG5cbiAgY29uc3RydWN0UGF0aCAoKSB7XG4gICAgbGV0IHRleFBhdGggPSAoYXRvbS5jb25maWcuZ2V0KCdsYXRleC50ZXhQYXRoJykgfHwgJycpLnRyaW0oKVxuICAgIGlmICh0ZXhQYXRoLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdGV4UGF0aCA9IHRoaXMuZGVmYXVsdFRleFBhdGgocHJvY2Vzcy5wbGF0Zm9ybSlcbiAgICB9XG5cbiAgICBjb25zdCBwcm9jZXNzUGF0aCA9IHByb2Nlc3MuZW52W3RoaXMuZW52UGF0aEtleV1cbiAgICBjb25zdCBtYXRjaCA9IHRleFBhdGgubWF0Y2goL14oLiopKFxcJFBBVEgpKC4qKSQvKVxuICAgIGlmIChtYXRjaCkge1xuICAgICAgcmV0dXJuIGAke21hdGNoWzFdfSR7cHJvY2Vzc1BhdGh9JHttYXRjaFszXX1gXG4gICAgfVxuXG4gICAgcmV0dXJuIFt0ZXhQYXRoLCBwcm9jZXNzUGF0aF1cbiAgICAgIC5maWx0ZXIoc3RyID0+IHN0ciAmJiBzdHIubGVuZ3RoID4gMClcbiAgICAgIC5qb2luKHBhdGguZGVsaW1pdGVyKVxuICB9XG5cbiAgZGVmYXVsdFRleFBhdGggKHBsYXRmb3JtKSB7XG4gICAgaWYgKHBsYXRmb3JtID09PSAnd2luMzInKSB7XG4gICAgICByZXR1cm4gW1xuICAgICAgICAnJVN5c3RlbURyaXZlJVxcXFx0ZXhsaXZlXFxcXDIwMTVcXFxcYmluXFxcXHdpbjMyJyxcbiAgICAgICAgJyVTeXN0ZW1Ecml2ZSVcXFxcdGV4bGl2ZVxcXFwyMDE0XFxcXGJpblxcXFx3aW4zMicsXG4gICAgICAgICclUHJvZ3JhbUZpbGVzJVxcXFxNaUtUZVggMi45XFxcXG1pa3RleFxcXFxiaW5cXFxceDY0JyxcbiAgICAgICAgJyVQcm9ncmFtRmlsZXMoeDg2KSVcXFxcTWlLVGVYIDIuOVxcXFxtaWt0ZXhcXFxcYmluJ1xuICAgICAgXS5qb2luKCc7JylcbiAgICB9XG5cbiAgICByZXR1cm4gW1xuICAgICAgJy91c3IvdGV4YmluJyxcbiAgICAgICcvTGlicmFyeS9UZVgvdGV4YmluJ1xuICAgIF0uam9pbignOicpXG4gIH1cblxuICByZXNvbHZlTG9nRmlsZVBhdGggKHRleEZpbGVQYXRoLCBqb2JuYW1lKSB7XG4gICAgY29uc3Qgb3V0cHV0RGlyZWN0b3J5ID0gYXRvbS5jb25maWcuZ2V0KCdsYXRleC5vdXRwdXREaXJlY3RvcnknKSB8fCAnJ1xuICAgIGNvbnN0IGN1cnJlbnREaXJlY3RvcnkgPSBwYXRoLmRpcm5hbWUodGV4RmlsZVBhdGgpXG4gICAgY29uc3QgZmlsZU5hbWUgPSBqb2JuYW1lID8gYCR7am9ibmFtZX0ubG9nYCA6IHBhdGguYmFzZW5hbWUodGV4RmlsZVBhdGgpLnJlcGxhY2UoL1xcLlxcdyskLywgJy5sb2cnKVxuXG4gICAgcmV0dXJuIHBhdGguam9pbihjdXJyZW50RGlyZWN0b3J5LCBvdXRwdXREaXJlY3RvcnksIGZpbGVOYW1lKVxuICB9XG5cbiAgZ2V0RW52aXJvbm1lbnRQYXRoS2V5IChwbGF0Zm9ybSkge1xuICAgIGlmIChwbGF0Zm9ybSA9PT0gJ3dpbjMyJykgeyByZXR1cm4gJ1BhdGgnIH1cbiAgICByZXR1cm4gJ1BBVEgnXG4gIH1cblxuICBnZXRPdXRwdXREaXJlY3RvcnkgKGZpbGVQYXRoKSB7XG4gICAgbGV0IG91dGRpciA9IGF0b20uY29uZmlnLmdldCgnbGF0ZXgub3V0cHV0RGlyZWN0b3J5JylcbiAgICBpZiAob3V0ZGlyKSB7XG4gICAgICBjb25zdCBkaXIgPSBwYXRoLmRpcm5hbWUoZmlsZVBhdGgpXG4gICAgICBvdXRkaXIgPSBwYXRoLmpvaW4oZGlyLCBvdXRkaXIpXG4gICAgfVxuXG4gICAgcmV0dXJuIG91dGRpclxuICB9XG5cbiAgZ2V0TGF0ZXhFbmdpbmVGcm9tTWFnaWMgKGZpbGVQYXRoKSB7XG4gICAgY29uc3QgbWFnaWMgPSBuZXcgTWFnaWNQYXJzZXIoZmlsZVBhdGgpLnBhcnNlKClcbiAgICBpZiAobWFnaWMgJiYgbWFnaWMucHJvZ3JhbSkge1xuICAgICAgcmV0dXJuIG1hZ2ljLnByb2dyYW1cbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbFxuICB9XG5cbiAgZ2V0Sm9iTmFtZXNGcm9tTWFnaWMgKGZpbGVQYXRoKSB7XG4gICAgY29uc3QgbWFnaWMgPSBuZXcgTWFnaWNQYXJzZXIoZmlsZVBhdGgpLnBhcnNlKClcbiAgICBpZiAobWFnaWMgJiYgbWFnaWMuam9ibmFtZXMpIHtcbiAgICAgIHJldHVybiBtYWdpYy5qb2JuYW1lcy5zcGxpdCgvXFxzKy8pXG4gICAgfVxuXG4gICAgcmV0dXJuIFtudWxsXVxuICB9XG5cbn1cbiJdfQ==
//# sourceURL=/home/cin_chalic/.atom/packages/latex/lib/builder.js
