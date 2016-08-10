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
  }], [{
    key: 'canProcess',
    value: function canProcess() /* filePath */{}
  }]);

  return Builder;
})();

exports['default'] = Builder;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL2J1aWxkZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztzQkFFYyxRQUFROzs7O3NCQUNQLFNBQVM7Ozs7b0JBQ1AsTUFBTTs7OztnQ0FDRCxzQkFBc0I7Ozs7a0NBQ3BCLHdCQUF3Qjs7OztBQU5oRCxXQUFXLENBQUE7O0lBUVUsT0FBTztBQUNkLFdBRE8sT0FBTyxHQUNYOzBCQURJLE9BQU87O0FBRXhCLFFBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLHFCQUFxQixDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQTtHQUMvRDs7ZUFIa0IsT0FBTzs7V0FNdEIsNkJBQWlCLEVBQUU7OztXQUNULHVDQUFpQixFQUFFOzs7V0FFcEIsc0JBQUMsV0FBVyxFQUFFO0FBQ3pCLFVBQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxXQUFXLENBQUMsQ0FBQTtBQUN4RCxVQUFJLENBQUMsb0JBQUcsVUFBVSxDQUFDLFdBQVcsQ0FBQyxFQUFFO0FBQUUsZUFBTyxJQUFJLENBQUE7T0FBRTs7QUFFaEQsVUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUMsQ0FBQTtBQUM3QyxhQUFPLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQTtLQUN0Qjs7O1dBRVksc0JBQUMsV0FBVyxFQUFFO0FBQ3pCLGFBQU8sa0NBQWMsV0FBVyxDQUFDLENBQUE7S0FDbEM7OztXQUU0Qix3Q0FBRztBQUM5QixVQUFNLEdBQUcsR0FBRyxvQkFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFBO0FBQ2hDLFVBQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQTtBQUN0QyxVQUFJLFNBQVMsRUFBRTtBQUNiLFdBQUcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsU0FBUyxDQUFBO09BQ2pDOztBQUVELGFBQU8s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bS9wYWNrYWdlcy9sYXRleC9saWIvYnVpbGRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmltcG9ydCBfIGZyb20gJ2xvZGFzaCdcbmltcG9ydCBmcyBmcm9tICdmcy1wbHVzJ1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcbmltcG9ydCBMb2dQYXJzZXIgZnJvbSAnLi9wYXJzZXJzL2xvZy1wYXJzZXInXG5pbXBvcnQgTWFnaWNQYXJzZXIgZnJvbSAnLi9wYXJzZXJzL21hZ2ljLXBhcnNlcidcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQnVpbGRlciB7XG4gIGNvbnN0cnVjdG9yICgpIHtcbiAgICB0aGlzLmVudlBhdGhLZXkgPSB0aGlzLmdldEVudmlyb25tZW50UGF0aEtleShwcm9jZXNzLnBsYXRmb3JtKVxuICB9XG5cbiAgc3RhdGljIGNhblByb2Nlc3MgKC8qIGZpbGVQYXRoICovKSB7fVxuICBydW4gKC8qIGZpbGVQYXRoICovKSB7fVxuICBjb25zdHJ1Y3RBcmdzICgvKiBmaWxlUGF0aCAqLykge31cblxuICBwYXJzZUxvZ0ZpbGUgKHRleEZpbGVQYXRoKSB7XG4gICAgY29uc3QgbG9nRmlsZVBhdGggPSB0aGlzLnJlc29sdmVMb2dGaWxlUGF0aCh0ZXhGaWxlUGF0aClcbiAgICBpZiAoIWZzLmV4aXN0c1N5bmMobG9nRmlsZVBhdGgpKSB7IHJldHVybiBudWxsIH1cblxuICAgIGNvbnN0IHBhcnNlciA9IHRoaXMuZ2V0TG9nUGFyc2VyKGxvZ0ZpbGVQYXRoKVxuICAgIHJldHVybiBwYXJzZXIucGFyc2UoKVxuICB9XG5cbiAgZ2V0TG9nUGFyc2VyIChsb2dGaWxlUGF0aCkge1xuICAgIHJldHVybiBuZXcgTG9nUGFyc2VyKGxvZ0ZpbGVQYXRoKVxuICB9XG5cbiAgY29uc3RydWN0Q2hpbGRQcm9jZXNzT3B0aW9ucyAoKSB7XG4gICAgY29uc3QgZW52ID0gXy5jbG9uZShwcm9jZXNzLmVudilcbiAgICBjb25zdCBjaGlsZFBhdGggPSB0aGlzLmNvbnN0cnVjdFBhdGgoKVxuICAgIGlmIChjaGlsZFBhdGgpIHtcbiAgICAgIGVudlt0aGlzLmVudlBhdGhLZXldID0gY2hpbGRQYXRoXG4gICAgfVxuXG4gICAgcmV0dXJuIHtlbnZ9XG4gIH1cblxuICBjb25zdHJ1Y3RQYXRoICgpIHtcbiAgICBsZXQgdGV4UGF0aCA9IChhdG9tLmNvbmZpZy5nZXQoJ2xhdGV4LnRleFBhdGgnKSB8fCAnJykudHJpbSgpXG4gICAgaWYgKHRleFBhdGgubGVuZ3RoID09PSAwKSB7XG4gICAgICB0ZXhQYXRoID0gdGhpcy5kZWZhdWx0VGV4UGF0aChwcm9jZXNzLnBsYXRmb3JtKVxuICAgIH1cblxuICAgIGNvbnN0IHByb2Nlc3NQYXRoID0gcHJvY2Vzcy5lbnZbdGhpcy5lbnZQYXRoS2V5XVxuICAgIGNvbnN0IG1hdGNoID0gdGV4UGF0aC5tYXRjaCgvXiguKikoXFwkUEFUSCkoLiopJC8pXG4gICAgaWYgKG1hdGNoKSB7XG4gICAgICByZXR1cm4gYCR7bWF0Y2hbMV19JHtwcm9jZXNzUGF0aH0ke21hdGNoWzNdfWBcbiAgICB9XG5cbiAgICByZXR1cm4gW3RleFBhdGgsIHByb2Nlc3NQYXRoXVxuICAgICAgLmZpbHRlcihzdHIgPT4gc3RyICYmIHN0ci5sZW5ndGggPiAwKVxuICAgICAgLmpvaW4ocGF0aC5kZWxpbWl0ZXIpXG4gIH1cblxuICBkZWZhdWx0VGV4UGF0aCAocGxhdGZvcm0pIHtcbiAgICBpZiAocGxhdGZvcm0gPT09ICd3aW4zMicpIHtcbiAgICAgIHJldHVybiBbXG4gICAgICAgICclU3lzdGVtRHJpdmUlXFxcXHRleGxpdmVcXFxcMjAxNVxcXFxiaW5cXFxcd2luMzInLFxuICAgICAgICAnJVN5c3RlbURyaXZlJVxcXFx0ZXhsaXZlXFxcXDIwMTRcXFxcYmluXFxcXHdpbjMyJyxcbiAgICAgICAgJyVQcm9ncmFtRmlsZXMlXFxcXE1pS1RlWCAyLjlcXFxcbWlrdGV4XFxcXGJpblxcXFx4NjQnLFxuICAgICAgICAnJVByb2dyYW1GaWxlcyh4ODYpJVxcXFxNaUtUZVggMi45XFxcXG1pa3RleFxcXFxiaW4nXG4gICAgICBdLmpvaW4oJzsnKVxuICAgIH1cblxuICAgIHJldHVybiBbXG4gICAgICAnL3Vzci90ZXhiaW4nLFxuICAgICAgJy9MaWJyYXJ5L1RlWC90ZXhiaW4nXG4gICAgXS5qb2luKCc6JylcbiAgfVxuXG4gIHJlc29sdmVMb2dGaWxlUGF0aCAodGV4RmlsZVBhdGgpIHtcbiAgICBjb25zdCBvdXRwdXREaXJlY3RvcnkgPSBhdG9tLmNvbmZpZy5nZXQoJ2xhdGV4Lm91dHB1dERpcmVjdG9yeScpIHx8ICcnXG4gICAgY29uc3QgY3VycmVudERpcmVjdG9yeSA9IHBhdGguZGlybmFtZSh0ZXhGaWxlUGF0aClcbiAgICBjb25zdCBmaWxlTmFtZSA9IHBhdGguYmFzZW5hbWUodGV4RmlsZVBhdGgpLnJlcGxhY2UoL1xcLlxcdyskLywgJy5sb2cnKVxuXG4gICAgcmV0dXJuIHBhdGguam9pbihjdXJyZW50RGlyZWN0b3J5LCBvdXRwdXREaXJlY3RvcnksIGZpbGVOYW1lKVxuICB9XG5cbiAgZ2V0RW52aXJvbm1lbnRQYXRoS2V5IChwbGF0Zm9ybSkge1xuICAgIGlmIChwbGF0Zm9ybSA9PT0gJ3dpbjMyJykgeyByZXR1cm4gJ1BhdGgnIH1cbiAgICByZXR1cm4gJ1BBVEgnXG4gIH1cblxuICBnZXRPdXRwdXREaXJlY3RvcnkgKGZpbGVQYXRoKSB7XG4gICAgbGV0IG91dGRpciA9IGF0b20uY29uZmlnLmdldCgnbGF0ZXgub3V0cHV0RGlyZWN0b3J5JylcbiAgICBpZiAob3V0ZGlyKSB7XG4gICAgICBjb25zdCBkaXIgPSBwYXRoLmRpcm5hbWUoZmlsZVBhdGgpXG4gICAgICBvdXRkaXIgPSBwYXRoLmpvaW4oZGlyLCBvdXRkaXIpXG4gICAgfVxuXG4gICAgcmV0dXJuIG91dGRpclxuICB9XG5cbiAgZ2V0TGF0ZXhFbmdpbmVGcm9tTWFnaWMgKGZpbGVQYXRoKSB7XG4gICAgY29uc3QgbWFnaWMgPSBuZXcgTWFnaWNQYXJzZXIoZmlsZVBhdGgpLnBhcnNlKClcbiAgICBpZiAobWFnaWMgJiYgbWFnaWMucHJvZ3JhbSkge1xuICAgICAgcmV0dXJuIG1hZ2ljLnByb2dyYW1cbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbFxuICB9XG59XG4iXX0=
//# sourceURL=/home/cin_chalic/.atom/packages/latex/lib/builder.js
