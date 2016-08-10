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
      // look in filename for program-tag/
      var magic = new _parsersMagicParser2['default'](filePath).parse();
      if (!magic || !magic.program) {
        return null;
      } else {
        return magic.program;
      }
    }
  }]);

  return Builder;
})();

exports['default'] = Builder;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL2J1aWxkZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztzQkFFYyxRQUFROzs7O3NCQUNQLFNBQVM7Ozs7b0JBQ1AsTUFBTTs7OztnQ0FDRCxzQkFBc0I7Ozs7a0NBQ3BCLHdCQUF3Qjs7OztBQU5oRCxXQUFXLENBQUE7O0lBUVUsT0FBTztBQUNkLFdBRE8sT0FBTyxHQUNYOzBCQURJLE9BQU87O0FBRXhCLFFBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLHFCQUFxQixDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQTtHQUMvRDs7ZUFIa0IsT0FBTzs7V0FLdEIsNkJBQWlCLEVBQUU7OztXQUNULHVDQUFpQixFQUFFOzs7V0FFcEIsc0JBQUMsV0FBVyxFQUFFO0FBQ3pCLFVBQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxXQUFXLENBQUMsQ0FBQTtBQUN4RCxVQUFJLENBQUMsb0JBQUcsVUFBVSxDQUFDLFdBQVcsQ0FBQyxFQUFFO0FBQUUsZUFBTyxJQUFJLENBQUE7T0FBRTs7QUFFaEQsVUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUMsQ0FBQTtBQUM3QyxhQUFPLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQTtLQUN0Qjs7O1dBRVksc0JBQUMsV0FBVyxFQUFFO0FBQ3pCLGFBQU8sa0NBQWMsV0FBVyxDQUFDLENBQUE7S0FDbEM7OztXQUU0Qix3Q0FBRztBQUM5QixVQUFNLEdBQUcsR0FBRyxvQkFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFBO0FBQ2hDLFVBQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQTtBQUN0QyxVQUFJLFNBQVMsRUFBRTtBQUNiLFdBQUcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsU0FBUyxDQUFBO09BQ2pDOztBQUVELGFBQU8sRUFBQyxHQUFHLEVBQUgsR0FBRyxFQUFDLENBQUE7S0FDYjs7O1dBRWEseUJBQUc7QUFDZixVQUFJLE9BQU8sR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxJQUFJLEVBQUUsQ0FBQSxDQUFFLElBQUksRUFBRSxDQUFBO0FBQzdELFVBQUksT0FBTyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7QUFDeEIsZUFBTyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFBO09BQ2hEOztBQUVELFVBQU0sV0FBVyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFBO0FBQ2hELFVBQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsb0JBQW9CLENBQUMsQ0FBQTtBQUNqRCxVQUFJLEtBQUssRUFBRTtBQUNULG9CQUFVLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxXQUFXLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFFO09BQzlDOztBQUVELGFBQU8sQ0FBQyxPQUFPLEVBQUUsV0FBVyxDQUFDLENBQzFCLE1BQU0sQ0FBQyxVQUFBLEdBQUc7ZUFBSSxHQUFHLElBQUksR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDO09BQUEsQ0FBQyxDQUNwQyxJQUFJLENBQUMsa0JBQUssU0FBUyxDQUFDLENBQUE7S0FDeEI7OztXQUVjLHdCQUFDLFFBQVEsRUFBRTtBQUN4QixVQUFJLFFBQVEsS0FBSyxPQUFPLEVBQUU7QUFDeEIsZUFBTyxDQUNMLDBDQUEwQyxFQUMxQywwQ0FBMEMsRUFDMUMsOENBQThDLEVBQzlDLDhDQUE4QyxDQUMvQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQTtPQUNaOztBQUVELGFBQU8sQ0FDTCxhQUFhLEVBQ2IscUJBQXFCLENBQ3RCLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFBO0tBQ1o7OztXQUVrQiw0QkFBQyxXQUFXLEVBQUU7QUFDL0IsVUFBTSxlQUFlLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsdUJBQXVCLENBQUMsSUFBSSxFQUFFLENBQUE7QUFDdEUsVUFBTSxnQkFBZ0IsR0FBRyxrQkFBSyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUE7QUFDbEQsVUFBTSxRQUFRLEdBQUcsa0JBQUssUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUE7O0FBRXJFLGFBQU8sa0JBQUssSUFBSSxDQUFDLGdCQUFnQixFQUFFLGVBQWUsRUFBRSxRQUFRLENBQUMsQ0FBQTtLQUM5RDs7O1dBRXFCLCtCQUFDLFFBQVEsRUFBRTtBQUMvQixVQUFJLFFBQVEsS0FBSyxPQUFPLEVBQUU7QUFBRSxlQUFPLE1BQU0sQ0FBQTtPQUFFO0FBQzNDLGFBQU8sTUFBTSxDQUFBO0tBQ2Q7OztXQUVrQiw0QkFBQyxRQUFRLEVBQUU7QUFDNUIsVUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsdUJBQXVCLENBQUMsQ0FBQTtBQUNyRCxVQUFJLE1BQU0sRUFBRTtBQUNWLFlBQU0sR0FBRyxHQUFHLGtCQUFLLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQTtBQUNsQyxjQUFNLEdBQUcsa0JBQUssSUFBSSxDQUFDLEdBQUcsRUFBRSxNQUFNLENBQUMsQ0FBQTtPQUNoQzs7QUFFRCxhQUFPLE1BQU0sQ0FBQTtLQUNkOzs7V0FFdUIsaUNBQUMsUUFBUSxFQUFFOztBQUVqQyxVQUFNLEtBQUssR0FBRyxvQ0FBZ0IsUUFBUSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUE7QUFDL0MsVUFBSSxDQUFDLEtBQUssSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUU7QUFDNUIsZUFBTyxJQUFJLENBQUE7T0FDWixNQUFNO0FBQUUsZUFBTyxLQUFLLENBQUMsT0FBTyxDQUFBO09BQUU7S0FDaEM7OztTQTVGa0IsT0FBTzs7O3FCQUFQLE9BQU8iLCJmaWxlIjoiL2hvbWUvY2luX2NoYWxpYy8uYXRvbS9wYWNrYWdlcy9sYXRleC9saWIvYnVpbGRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmltcG9ydCBfIGZyb20gJ2xvZGFzaCdcbmltcG9ydCBmcyBmcm9tICdmcy1wbHVzJ1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcbmltcG9ydCBMb2dQYXJzZXIgZnJvbSAnLi9wYXJzZXJzL2xvZy1wYXJzZXInXG5pbXBvcnQgTWFnaWNQYXJzZXIgZnJvbSAnLi9wYXJzZXJzL21hZ2ljLXBhcnNlcidcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQnVpbGRlciB7XG4gIGNvbnN0cnVjdG9yICgpIHtcbiAgICB0aGlzLmVudlBhdGhLZXkgPSB0aGlzLmdldEVudmlyb25tZW50UGF0aEtleShwcm9jZXNzLnBsYXRmb3JtKVxuICB9XG5cbiAgcnVuICgvKiBmaWxlUGF0aCAqLykge31cbiAgY29uc3RydWN0QXJncyAoLyogZmlsZVBhdGggKi8pIHt9XG5cbiAgcGFyc2VMb2dGaWxlICh0ZXhGaWxlUGF0aCkge1xuICAgIGNvbnN0IGxvZ0ZpbGVQYXRoID0gdGhpcy5yZXNvbHZlTG9nRmlsZVBhdGgodGV4RmlsZVBhdGgpXG4gICAgaWYgKCFmcy5leGlzdHNTeW5jKGxvZ0ZpbGVQYXRoKSkgeyByZXR1cm4gbnVsbCB9XG5cbiAgICBjb25zdCBwYXJzZXIgPSB0aGlzLmdldExvZ1BhcnNlcihsb2dGaWxlUGF0aClcbiAgICByZXR1cm4gcGFyc2VyLnBhcnNlKClcbiAgfVxuXG4gIGdldExvZ1BhcnNlciAobG9nRmlsZVBhdGgpIHtcbiAgICByZXR1cm4gbmV3IExvZ1BhcnNlcihsb2dGaWxlUGF0aClcbiAgfVxuXG4gIGNvbnN0cnVjdENoaWxkUHJvY2Vzc09wdGlvbnMgKCkge1xuICAgIGNvbnN0IGVudiA9IF8uY2xvbmUocHJvY2Vzcy5lbnYpXG4gICAgY29uc3QgY2hpbGRQYXRoID0gdGhpcy5jb25zdHJ1Y3RQYXRoKClcbiAgICBpZiAoY2hpbGRQYXRoKSB7XG4gICAgICBlbnZbdGhpcy5lbnZQYXRoS2V5XSA9IGNoaWxkUGF0aFxuICAgIH1cblxuICAgIHJldHVybiB7ZW52fVxuICB9XG5cbiAgY29uc3RydWN0UGF0aCAoKSB7XG4gICAgbGV0IHRleFBhdGggPSAoYXRvbS5jb25maWcuZ2V0KCdsYXRleC50ZXhQYXRoJykgfHwgJycpLnRyaW0oKVxuICAgIGlmICh0ZXhQYXRoLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdGV4UGF0aCA9IHRoaXMuZGVmYXVsdFRleFBhdGgocHJvY2Vzcy5wbGF0Zm9ybSlcbiAgICB9XG5cbiAgICBjb25zdCBwcm9jZXNzUGF0aCA9IHByb2Nlc3MuZW52W3RoaXMuZW52UGF0aEtleV1cbiAgICBjb25zdCBtYXRjaCA9IHRleFBhdGgubWF0Y2goL14oLiopKFxcJFBBVEgpKC4qKSQvKVxuICAgIGlmIChtYXRjaCkge1xuICAgICAgcmV0dXJuIGAke21hdGNoWzFdfSR7cHJvY2Vzc1BhdGh9JHttYXRjaFszXX1gXG4gICAgfVxuXG4gICAgcmV0dXJuIFt0ZXhQYXRoLCBwcm9jZXNzUGF0aF1cbiAgICAgIC5maWx0ZXIoc3RyID0+IHN0ciAmJiBzdHIubGVuZ3RoID4gMClcbiAgICAgIC5qb2luKHBhdGguZGVsaW1pdGVyKVxuICB9XG5cbiAgZGVmYXVsdFRleFBhdGggKHBsYXRmb3JtKSB7XG4gICAgaWYgKHBsYXRmb3JtID09PSAnd2luMzInKSB7XG4gICAgICByZXR1cm4gW1xuICAgICAgICAnJVN5c3RlbURyaXZlJVxcXFx0ZXhsaXZlXFxcXDIwMTVcXFxcYmluXFxcXHdpbjMyJyxcbiAgICAgICAgJyVTeXN0ZW1Ecml2ZSVcXFxcdGV4bGl2ZVxcXFwyMDE0XFxcXGJpblxcXFx3aW4zMicsXG4gICAgICAgICclUHJvZ3JhbUZpbGVzJVxcXFxNaUtUZVggMi45XFxcXG1pa3RleFxcXFxiaW5cXFxceDY0JyxcbiAgICAgICAgJyVQcm9ncmFtRmlsZXMoeDg2KSVcXFxcTWlLVGVYIDIuOVxcXFxtaWt0ZXhcXFxcYmluJ1xuICAgICAgXS5qb2luKCc7JylcbiAgICB9XG5cbiAgICByZXR1cm4gW1xuICAgICAgJy91c3IvdGV4YmluJyxcbiAgICAgICcvTGlicmFyeS9UZVgvdGV4YmluJ1xuICAgIF0uam9pbignOicpXG4gIH1cblxuICByZXNvbHZlTG9nRmlsZVBhdGggKHRleEZpbGVQYXRoKSB7XG4gICAgY29uc3Qgb3V0cHV0RGlyZWN0b3J5ID0gYXRvbS5jb25maWcuZ2V0KCdsYXRleC5vdXRwdXREaXJlY3RvcnknKSB8fCAnJ1xuICAgIGNvbnN0IGN1cnJlbnREaXJlY3RvcnkgPSBwYXRoLmRpcm5hbWUodGV4RmlsZVBhdGgpXG4gICAgY29uc3QgZmlsZU5hbWUgPSBwYXRoLmJhc2VuYW1lKHRleEZpbGVQYXRoKS5yZXBsYWNlKC9cXC5cXHcrJC8sICcubG9nJylcblxuICAgIHJldHVybiBwYXRoLmpvaW4oY3VycmVudERpcmVjdG9yeSwgb3V0cHV0RGlyZWN0b3J5LCBmaWxlTmFtZSlcbiAgfVxuXG4gIGdldEVudmlyb25tZW50UGF0aEtleSAocGxhdGZvcm0pIHtcbiAgICBpZiAocGxhdGZvcm0gPT09ICd3aW4zMicpIHsgcmV0dXJuICdQYXRoJyB9XG4gICAgcmV0dXJuICdQQVRIJ1xuICB9XG5cbiAgZ2V0T3V0cHV0RGlyZWN0b3J5IChmaWxlUGF0aCkge1xuICAgIGxldCBvdXRkaXIgPSBhdG9tLmNvbmZpZy5nZXQoJ2xhdGV4Lm91dHB1dERpcmVjdG9yeScpXG4gICAgaWYgKG91dGRpcikge1xuICAgICAgY29uc3QgZGlyID0gcGF0aC5kaXJuYW1lKGZpbGVQYXRoKVxuICAgICAgb3V0ZGlyID0gcGF0aC5qb2luKGRpciwgb3V0ZGlyKVxuICAgIH1cblxuICAgIHJldHVybiBvdXRkaXJcbiAgfVxuXG4gIGdldExhdGV4RW5naW5lRnJvbU1hZ2ljIChmaWxlUGF0aCkge1xuICAgICAgLy8gbG9vayBpbiBmaWxlbmFtZSBmb3IgcHJvZ3JhbS10YWcvXG4gICAgY29uc3QgbWFnaWMgPSBuZXcgTWFnaWNQYXJzZXIoZmlsZVBhdGgpLnBhcnNlKClcbiAgICBpZiAoIW1hZ2ljIHx8ICFtYWdpYy5wcm9ncmFtKSB7XG4gICAgICByZXR1cm4gbnVsbFxuICAgIH0gZWxzZSB7IHJldHVybiBtYWdpYy5wcm9ncmFtIH1cbiAgfVxufVxuIl19
//# sourceURL=/home/cin_chalic/.atom/packages/latex/lib/builder.js
