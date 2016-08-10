function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

require('../spec-helpers');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _libParsersLogParser = require('../../lib/parsers/log-parser');

var _libParsersLogParser2 = _interopRequireDefault(_libParsersLogParser);

'use babel';

describe('LogParser', function () {
  var fixturesPath = undefined;

  beforeEach(function () {
    fixturesPath = atom.project.getPaths()[0];
  });

  describe('parse', function () {
    it('returns the expected output path', function () {
      var logFile = _path2['default'].join(fixturesPath, 'file.log');
      var parser = new _libParsersLogParser2['default'](logFile);
      var result = parser.parse();
      var outputFilePath = _path2['default'].posix.resolve(result.outputFilePath);

      expect(outputFilePath).toBe('/foo/output/file.pdf');
    });

    it('returns the expected output path when the compiled file contained spaces', function () {
      var logFile = _path2['default'].join(fixturesPath, 'filename with spaces.log');
      var parser = new _libParsersLogParser2['default'](logFile);
      var result = parser.parse();
      var outputFilePath = _path2['default'].posix.resolve(result.outputFilePath);

      expect(outputFilePath).toBe('/foo/output/filename with spaces.pdf');
    });

    it('parses and returns all errors', function () {
      var logFile = _path2['default'].join(fixturesPath, 'errors.log');
      var parser = new _libParsersLogParser2['default'](logFile);
      var result = parser.parse();

      expect(result.errors.length).toBe(3);
    });

    it('associates an error with a file path, line number, and message', function () {
      var logFile = _path2['default'].join(fixturesPath, 'errors.log');
      var parser = new _libParsersLogParser2['default'](logFile);
      var result = parser.parse();
      var error = result.errors[0];

      expect(error).toEqual({
        logPosition: [196, 0],
        filePath: './errors.tex',
        lineNumber: 10,
        message: '\\begin{gather*} on input line 8 ended by \\end{gather}'
      });
    });
  });

  describe('getLines', function () {
    it('returns the expected number of lines', function () {
      var logFile = _path2['default'].join(fixturesPath, 'file.log');
      var parser = new _libParsersLogParser2['default'](logFile);
      var lines = parser.getLines();

      expect(lines.length).toBe(63);
    });

    it('throws an error when passed a filepath that does not exist', function () {
      var logFile = _path2['default'].join(fixturesPath, 'nope.log');
      var parser = new _libParsersLogParser2['default'](logFile);

      expect(parser.getLines).toThrow();
    });
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvc3BlYy9wYXJzZXJzL2xvZy1wYXJzZXItc3BlYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztRQUVPLGlCQUFpQjs7b0JBRVAsTUFBTTs7OzttQ0FDRCw4QkFBOEI7Ozs7QUFMcEQsV0FBVyxDQUFBOztBQU9YLFFBQVEsQ0FBQyxXQUFXLEVBQUUsWUFBTTtBQUMxQixNQUFJLFlBQVksWUFBQSxDQUFBOztBQUVoQixZQUFVLENBQUMsWUFBTTtBQUNmLGdCQUFZLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQTtHQUMxQyxDQUFDLENBQUE7O0FBRUYsVUFBUSxDQUFDLE9BQU8sRUFBRSxZQUFNO0FBQ3RCLE1BQUUsQ0FBQyxrQ0FBa0MsRUFBRSxZQUFNO0FBQzNDLFVBQU0sT0FBTyxHQUFHLGtCQUFLLElBQUksQ0FBQyxZQUFZLEVBQUUsVUFBVSxDQUFDLENBQUE7QUFDbkQsVUFBTSxNQUFNLEdBQUcscUNBQWMsT0FBTyxDQUFDLENBQUE7QUFDckMsVUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFBO0FBQzdCLFVBQU0sY0FBYyxHQUFHLGtCQUFLLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFBOztBQUVoRSxZQUFNLENBQUMsY0FBYyxDQUFDLENBQUMsSUFBSSxDQUFDLHNCQUFzQixDQUFDLENBQUE7S0FDcEQsQ0FBQyxDQUFBOztBQUVGLE1BQUUsQ0FBQywwRUFBMEUsRUFBRSxZQUFNO0FBQ25GLFVBQU0sT0FBTyxHQUFHLGtCQUFLLElBQUksQ0FBQyxZQUFZLEVBQUUsMEJBQTBCLENBQUMsQ0FBQTtBQUNuRSxVQUFNLE1BQU0sR0FBRyxxQ0FBYyxPQUFPLENBQUMsQ0FBQTtBQUNyQyxVQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUE7QUFDN0IsVUFBTSxjQUFjLEdBQUcsa0JBQUssS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUE7O0FBRWhFLFlBQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQyxJQUFJLENBQUMsc0NBQXNDLENBQUMsQ0FBQTtLQUNwRSxDQUFDLENBQUE7O0FBRUYsTUFBRSxDQUFDLCtCQUErQixFQUFFLFlBQU07QUFDeEMsVUFBTSxPQUFPLEdBQUcsa0JBQUssSUFBSSxDQUFDLFlBQVksRUFBRSxZQUFZLENBQUMsQ0FBQTtBQUNyRCxVQUFNLE1BQU0sR0FBRyxxQ0FBYyxPQUFPLENBQUMsQ0FBQTtBQUNyQyxVQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUE7O0FBRTdCLFlBQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtLQUNyQyxDQUFDLENBQUE7O0FBRUYsTUFBRSxDQUFDLGdFQUFnRSxFQUFFLFlBQU07QUFDekUsVUFBTSxPQUFPLEdBQUcsa0JBQUssSUFBSSxDQUFDLFlBQVksRUFBRSxZQUFZLENBQUMsQ0FBQTtBQUNyRCxVQUFNLE1BQU0sR0FBRyxxQ0FBYyxPQUFPLENBQUMsQ0FBQTtBQUNyQyxVQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUE7QUFDN0IsVUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQTs7QUFFOUIsWUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQztBQUNwQixtQkFBVyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQztBQUNyQixnQkFBUSxFQUFFLGNBQWM7QUFDeEIsa0JBQVUsRUFBRSxFQUFFO0FBQ2QsZUFBTyxFQUFFLHlEQUF5RDtPQUNuRSxDQUFDLENBQUE7S0FDSCxDQUFDLENBQUE7R0FDSCxDQUFDLENBQUE7O0FBRUYsVUFBUSxDQUFDLFVBQVUsRUFBRSxZQUFNO0FBQ3pCLE1BQUUsQ0FBQyxzQ0FBc0MsRUFBRSxZQUFNO0FBQy9DLFVBQU0sT0FBTyxHQUFHLGtCQUFLLElBQUksQ0FBQyxZQUFZLEVBQUUsVUFBVSxDQUFDLENBQUE7QUFDbkQsVUFBTSxNQUFNLEdBQUcscUNBQWMsT0FBTyxDQUFDLENBQUE7QUFDckMsVUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFBOztBQUUvQixZQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQTtLQUM5QixDQUFDLENBQUE7O0FBRUYsTUFBRSxDQUFDLDREQUE0RCxFQUFFLFlBQU07QUFDckUsVUFBTSxPQUFPLEdBQUcsa0JBQUssSUFBSSxDQUFDLFlBQVksRUFBRSxVQUFVLENBQUMsQ0FBQTtBQUNuRCxVQUFNLE1BQU0sR0FBRyxxQ0FBYyxPQUFPLENBQUMsQ0FBQTs7QUFFckMsWUFBTSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtLQUNsQyxDQUFDLENBQUE7R0FDSCxDQUFDLENBQUE7Q0FDSCxDQUFDLENBQUEiLCJmaWxlIjoiL2hvbWUvY2luX2NoYWxpYy8uYXRvbS9wYWNrYWdlcy9sYXRleC9zcGVjL3BhcnNlcnMvbG9nLXBhcnNlci1zcGVjLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuaW1wb3J0ICcuLi9zcGVjLWhlbHBlcnMnXG5cbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5pbXBvcnQgTG9nUGFyc2VyIGZyb20gJy4uLy4uL2xpYi9wYXJzZXJzL2xvZy1wYXJzZXInXG5cbmRlc2NyaWJlKCdMb2dQYXJzZXInLCAoKSA9PiB7XG4gIGxldCBmaXh0dXJlc1BhdGhcblxuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICBmaXh0dXJlc1BhdGggPSBhdG9tLnByb2plY3QuZ2V0UGF0aHMoKVswXVxuICB9KVxuXG4gIGRlc2NyaWJlKCdwYXJzZScsICgpID0+IHtcbiAgICBpdCgncmV0dXJucyB0aGUgZXhwZWN0ZWQgb3V0cHV0IHBhdGgnLCAoKSA9PiB7XG4gICAgICBjb25zdCBsb2dGaWxlID0gcGF0aC5qb2luKGZpeHR1cmVzUGF0aCwgJ2ZpbGUubG9nJylcbiAgICAgIGNvbnN0IHBhcnNlciA9IG5ldyBMb2dQYXJzZXIobG9nRmlsZSlcbiAgICAgIGNvbnN0IHJlc3VsdCA9IHBhcnNlci5wYXJzZSgpXG4gICAgICBjb25zdCBvdXRwdXRGaWxlUGF0aCA9IHBhdGgucG9zaXgucmVzb2x2ZShyZXN1bHQub3V0cHV0RmlsZVBhdGgpXG5cbiAgICAgIGV4cGVjdChvdXRwdXRGaWxlUGF0aCkudG9CZSgnL2Zvby9vdXRwdXQvZmlsZS5wZGYnKVxuICAgIH0pXG5cbiAgICBpdCgncmV0dXJucyB0aGUgZXhwZWN0ZWQgb3V0cHV0IHBhdGggd2hlbiB0aGUgY29tcGlsZWQgZmlsZSBjb250YWluZWQgc3BhY2VzJywgKCkgPT4ge1xuICAgICAgY29uc3QgbG9nRmlsZSA9IHBhdGguam9pbihmaXh0dXJlc1BhdGgsICdmaWxlbmFtZSB3aXRoIHNwYWNlcy5sb2cnKVxuICAgICAgY29uc3QgcGFyc2VyID0gbmV3IExvZ1BhcnNlcihsb2dGaWxlKVxuICAgICAgY29uc3QgcmVzdWx0ID0gcGFyc2VyLnBhcnNlKClcbiAgICAgIGNvbnN0IG91dHB1dEZpbGVQYXRoID0gcGF0aC5wb3NpeC5yZXNvbHZlKHJlc3VsdC5vdXRwdXRGaWxlUGF0aClcblxuICAgICAgZXhwZWN0KG91dHB1dEZpbGVQYXRoKS50b0JlKCcvZm9vL291dHB1dC9maWxlbmFtZSB3aXRoIHNwYWNlcy5wZGYnKVxuICAgIH0pXG5cbiAgICBpdCgncGFyc2VzIGFuZCByZXR1cm5zIGFsbCBlcnJvcnMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBsb2dGaWxlID0gcGF0aC5qb2luKGZpeHR1cmVzUGF0aCwgJ2Vycm9ycy5sb2cnKVxuICAgICAgY29uc3QgcGFyc2VyID0gbmV3IExvZ1BhcnNlcihsb2dGaWxlKVxuICAgICAgY29uc3QgcmVzdWx0ID0gcGFyc2VyLnBhcnNlKClcblxuICAgICAgZXhwZWN0KHJlc3VsdC5lcnJvcnMubGVuZ3RoKS50b0JlKDMpXG4gICAgfSlcblxuICAgIGl0KCdhc3NvY2lhdGVzIGFuIGVycm9yIHdpdGggYSBmaWxlIHBhdGgsIGxpbmUgbnVtYmVyLCBhbmQgbWVzc2FnZScsICgpID0+IHtcbiAgICAgIGNvbnN0IGxvZ0ZpbGUgPSBwYXRoLmpvaW4oZml4dHVyZXNQYXRoLCAnZXJyb3JzLmxvZycpXG4gICAgICBjb25zdCBwYXJzZXIgPSBuZXcgTG9nUGFyc2VyKGxvZ0ZpbGUpXG4gICAgICBjb25zdCByZXN1bHQgPSBwYXJzZXIucGFyc2UoKVxuICAgICAgY29uc3QgZXJyb3IgPSByZXN1bHQuZXJyb3JzWzBdXG5cbiAgICAgIGV4cGVjdChlcnJvcikudG9FcXVhbCh7XG4gICAgICAgIGxvZ1Bvc2l0aW9uOiBbMTk2LCAwXSxcbiAgICAgICAgZmlsZVBhdGg6ICcuL2Vycm9ycy50ZXgnLFxuICAgICAgICBsaW5lTnVtYmVyOiAxMCxcbiAgICAgICAgbWVzc2FnZTogJ1xcXFxiZWdpbntnYXRoZXIqfSBvbiBpbnB1dCBsaW5lIDggZW5kZWQgYnkgXFxcXGVuZHtnYXRoZXJ9J1xuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdnZXRMaW5lcycsICgpID0+IHtcbiAgICBpdCgncmV0dXJucyB0aGUgZXhwZWN0ZWQgbnVtYmVyIG9mIGxpbmVzJywgKCkgPT4ge1xuICAgICAgY29uc3QgbG9nRmlsZSA9IHBhdGguam9pbihmaXh0dXJlc1BhdGgsICdmaWxlLmxvZycpXG4gICAgICBjb25zdCBwYXJzZXIgPSBuZXcgTG9nUGFyc2VyKGxvZ0ZpbGUpXG4gICAgICBjb25zdCBsaW5lcyA9IHBhcnNlci5nZXRMaW5lcygpXG5cbiAgICAgIGV4cGVjdChsaW5lcy5sZW5ndGgpLnRvQmUoNjMpXG4gICAgfSlcblxuICAgIGl0KCd0aHJvd3MgYW4gZXJyb3Igd2hlbiBwYXNzZWQgYSBmaWxlcGF0aCB0aGF0IGRvZXMgbm90IGV4aXN0JywgKCkgPT4ge1xuICAgICAgY29uc3QgbG9nRmlsZSA9IHBhdGguam9pbihmaXh0dXJlc1BhdGgsICdub3BlLmxvZycpXG4gICAgICBjb25zdCBwYXJzZXIgPSBuZXcgTG9nUGFyc2VyKGxvZ0ZpbGUpXG5cbiAgICAgIGV4cGVjdChwYXJzZXIuZ2V0TGluZXMpLnRvVGhyb3coKVxuICAgIH0pXG4gIH0pXG59KVxuIl19
//# sourceURL=/home/cin_chalic/.atom/packages/latex/spec/parsers/log-parser-spec.js
