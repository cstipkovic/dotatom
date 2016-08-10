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
      var expectedPath = _path2['default'].resolve('/foo/output/file.pdf');
      var logFile = _path2['default'].join(fixturesPath, 'file.log');
      var parser = new _libParsersLogParser2['default'](logFile);
      var result = parser.parse();

      expect(result.outputFilePath).toBe(expectedPath);
    });

    it('returns the expected output path when the compiled file contained spaces', function () {
      var expectedPath = _path2['default'].resolve('/foo/output/filename with spaces.pdf');
      var logFile = _path2['default'].join(fixturesPath, 'filename with spaces.log');
      var parser = new _libParsersLogParser2['default'](logFile);
      var result = parser.parse();

      expect(result.outputFilePath).toBe(expectedPath);
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
        filePath: 'errors.tex',
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvc3BlYy9wYXJzZXJzL2xvZy1wYXJzZXItc3BlYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztRQUVPLGlCQUFpQjs7b0JBRVAsTUFBTTs7OzttQ0FDRCw4QkFBOEI7Ozs7QUFMcEQsV0FBVyxDQUFBOztBQU9YLFFBQVEsQ0FBQyxXQUFXLEVBQUUsWUFBTTtBQUMxQixNQUFJLFlBQVksWUFBQSxDQUFBOztBQUVoQixZQUFVLENBQUMsWUFBTTtBQUNmLGdCQUFZLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQTtHQUMxQyxDQUFDLENBQUE7O0FBRUYsVUFBUSxDQUFDLE9BQU8sRUFBRSxZQUFNO0FBQ3RCLE1BQUUsQ0FBQyxrQ0FBa0MsRUFBRSxZQUFNO0FBQzNDLFVBQU0sWUFBWSxHQUFHLGtCQUFLLE9BQU8sQ0FBQyxzQkFBc0IsQ0FBQyxDQUFBO0FBQ3pELFVBQU0sT0FBTyxHQUFHLGtCQUFLLElBQUksQ0FBQyxZQUFZLEVBQUUsVUFBVSxDQUFDLENBQUE7QUFDbkQsVUFBTSxNQUFNLEdBQUcscUNBQWMsT0FBTyxDQUFDLENBQUE7QUFDckMsVUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFBOztBQUU3QixZQUFNLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQTtLQUNqRCxDQUFDLENBQUE7O0FBRUYsTUFBRSxDQUFDLDBFQUEwRSxFQUFFLFlBQU07QUFDbkYsVUFBTSxZQUFZLEdBQUcsa0JBQUssT0FBTyxDQUFDLHNDQUFzQyxDQUFDLENBQUE7QUFDekUsVUFBTSxPQUFPLEdBQUcsa0JBQUssSUFBSSxDQUFDLFlBQVksRUFBRSwwQkFBMEIsQ0FBQyxDQUFBO0FBQ25FLFVBQU0sTUFBTSxHQUFHLHFDQUFjLE9BQU8sQ0FBQyxDQUFBO0FBQ3JDLFVBQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQTs7QUFFN0IsWUFBTSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUE7S0FDakQsQ0FBQyxDQUFBOztBQUVGLE1BQUUsQ0FBQywrQkFBK0IsRUFBRSxZQUFNO0FBQ3hDLFVBQU0sT0FBTyxHQUFHLGtCQUFLLElBQUksQ0FBQyxZQUFZLEVBQUUsWUFBWSxDQUFDLENBQUE7QUFDckQsVUFBTSxNQUFNLEdBQUcscUNBQWMsT0FBTyxDQUFDLENBQUE7QUFDckMsVUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFBOztBQUU3QixZQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7S0FDckMsQ0FBQyxDQUFBOztBQUVGLE1BQUUsQ0FBQyxnRUFBZ0UsRUFBRSxZQUFNO0FBQ3pFLFVBQU0sT0FBTyxHQUFHLGtCQUFLLElBQUksQ0FBQyxZQUFZLEVBQUUsWUFBWSxDQUFDLENBQUE7QUFDckQsVUFBTSxNQUFNLEdBQUcscUNBQWMsT0FBTyxDQUFDLENBQUE7QUFDckMsVUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFBO0FBQzdCLFVBQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUE7O0FBRTlCLFlBQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUM7QUFDcEIsbUJBQVcsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7QUFDckIsZ0JBQVEsRUFBRSxZQUFZO0FBQ3RCLGtCQUFVLEVBQUUsRUFBRTtBQUNkLGVBQU8sRUFBRSx5REFBeUQ7T0FDbkUsQ0FBQyxDQUFBO0tBQ0gsQ0FBQyxDQUFBO0dBQ0gsQ0FBQyxDQUFBOztBQUVGLFVBQVEsQ0FBQyxVQUFVLEVBQUUsWUFBTTtBQUN6QixNQUFFLENBQUMsc0NBQXNDLEVBQUUsWUFBTTtBQUMvQyxVQUFNLE9BQU8sR0FBRyxrQkFBSyxJQUFJLENBQUMsWUFBWSxFQUFFLFVBQVUsQ0FBQyxDQUFBO0FBQ25ELFVBQU0sTUFBTSxHQUFHLHFDQUFjLE9BQU8sQ0FBQyxDQUFBO0FBQ3JDLFVBQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQTs7QUFFL0IsWUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUE7S0FDOUIsQ0FBQyxDQUFBOztBQUVGLE1BQUUsQ0FBQyw0REFBNEQsRUFBRSxZQUFNO0FBQ3JFLFVBQU0sT0FBTyxHQUFHLGtCQUFLLElBQUksQ0FBQyxZQUFZLEVBQUUsVUFBVSxDQUFDLENBQUE7QUFDbkQsVUFBTSxNQUFNLEdBQUcscUNBQWMsT0FBTyxDQUFDLENBQUE7O0FBRXJDLFlBQU0sQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUE7S0FDbEMsQ0FBQyxDQUFBO0dBQ0gsQ0FBQyxDQUFBO0NBQ0gsQ0FBQyxDQUFBIiwiZmlsZSI6Ii9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvc3BlYy9wYXJzZXJzL2xvZy1wYXJzZXItc3BlYy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmltcG9ydCAnLi4vc3BlYy1oZWxwZXJzJ1xuXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IExvZ1BhcnNlciBmcm9tICcuLi8uLi9saWIvcGFyc2Vycy9sb2ctcGFyc2VyJ1xuXG5kZXNjcmliZSgnTG9nUGFyc2VyJywgKCkgPT4ge1xuICBsZXQgZml4dHVyZXNQYXRoXG5cbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgZml4dHVyZXNQYXRoID0gYXRvbS5wcm9qZWN0LmdldFBhdGhzKClbMF1cbiAgfSlcblxuICBkZXNjcmliZSgncGFyc2UnLCAoKSA9PiB7XG4gICAgaXQoJ3JldHVybnMgdGhlIGV4cGVjdGVkIG91dHB1dCBwYXRoJywgKCkgPT4ge1xuICAgICAgY29uc3QgZXhwZWN0ZWRQYXRoID0gcGF0aC5yZXNvbHZlKCcvZm9vL291dHB1dC9maWxlLnBkZicpXG4gICAgICBjb25zdCBsb2dGaWxlID0gcGF0aC5qb2luKGZpeHR1cmVzUGF0aCwgJ2ZpbGUubG9nJylcbiAgICAgIGNvbnN0IHBhcnNlciA9IG5ldyBMb2dQYXJzZXIobG9nRmlsZSlcbiAgICAgIGNvbnN0IHJlc3VsdCA9IHBhcnNlci5wYXJzZSgpXG5cbiAgICAgIGV4cGVjdChyZXN1bHQub3V0cHV0RmlsZVBhdGgpLnRvQmUoZXhwZWN0ZWRQYXRoKVxuICAgIH0pXG5cbiAgICBpdCgncmV0dXJucyB0aGUgZXhwZWN0ZWQgb3V0cHV0IHBhdGggd2hlbiB0aGUgY29tcGlsZWQgZmlsZSBjb250YWluZWQgc3BhY2VzJywgKCkgPT4ge1xuICAgICAgY29uc3QgZXhwZWN0ZWRQYXRoID0gcGF0aC5yZXNvbHZlKCcvZm9vL291dHB1dC9maWxlbmFtZSB3aXRoIHNwYWNlcy5wZGYnKVxuICAgICAgY29uc3QgbG9nRmlsZSA9IHBhdGguam9pbihmaXh0dXJlc1BhdGgsICdmaWxlbmFtZSB3aXRoIHNwYWNlcy5sb2cnKVxuICAgICAgY29uc3QgcGFyc2VyID0gbmV3IExvZ1BhcnNlcihsb2dGaWxlKVxuICAgICAgY29uc3QgcmVzdWx0ID0gcGFyc2VyLnBhcnNlKClcblxuICAgICAgZXhwZWN0KHJlc3VsdC5vdXRwdXRGaWxlUGF0aCkudG9CZShleHBlY3RlZFBhdGgpXG4gICAgfSlcblxuICAgIGl0KCdwYXJzZXMgYW5kIHJldHVybnMgYWxsIGVycm9ycycsICgpID0+IHtcbiAgICAgIGNvbnN0IGxvZ0ZpbGUgPSBwYXRoLmpvaW4oZml4dHVyZXNQYXRoLCAnZXJyb3JzLmxvZycpXG4gICAgICBjb25zdCBwYXJzZXIgPSBuZXcgTG9nUGFyc2VyKGxvZ0ZpbGUpXG4gICAgICBjb25zdCByZXN1bHQgPSBwYXJzZXIucGFyc2UoKVxuXG4gICAgICBleHBlY3QocmVzdWx0LmVycm9ycy5sZW5ndGgpLnRvQmUoMylcbiAgICB9KVxuXG4gICAgaXQoJ2Fzc29jaWF0ZXMgYW4gZXJyb3Igd2l0aCBhIGZpbGUgcGF0aCwgbGluZSBudW1iZXIsIGFuZCBtZXNzYWdlJywgKCkgPT4ge1xuICAgICAgY29uc3QgbG9nRmlsZSA9IHBhdGguam9pbihmaXh0dXJlc1BhdGgsICdlcnJvcnMubG9nJylcbiAgICAgIGNvbnN0IHBhcnNlciA9IG5ldyBMb2dQYXJzZXIobG9nRmlsZSlcbiAgICAgIGNvbnN0IHJlc3VsdCA9IHBhcnNlci5wYXJzZSgpXG4gICAgICBjb25zdCBlcnJvciA9IHJlc3VsdC5lcnJvcnNbMF1cblxuICAgICAgZXhwZWN0KGVycm9yKS50b0VxdWFsKHtcbiAgICAgICAgbG9nUG9zaXRpb246IFsxOTYsIDBdLFxuICAgICAgICBmaWxlUGF0aDogJ2Vycm9ycy50ZXgnLFxuICAgICAgICBsaW5lTnVtYmVyOiAxMCxcbiAgICAgICAgbWVzc2FnZTogJ1xcXFxiZWdpbntnYXRoZXIqfSBvbiBpbnB1dCBsaW5lIDggZW5kZWQgYnkgXFxcXGVuZHtnYXRoZXJ9J1xuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdnZXRMaW5lcycsICgpID0+IHtcbiAgICBpdCgncmV0dXJucyB0aGUgZXhwZWN0ZWQgbnVtYmVyIG9mIGxpbmVzJywgKCkgPT4ge1xuICAgICAgY29uc3QgbG9nRmlsZSA9IHBhdGguam9pbihmaXh0dXJlc1BhdGgsICdmaWxlLmxvZycpXG4gICAgICBjb25zdCBwYXJzZXIgPSBuZXcgTG9nUGFyc2VyKGxvZ0ZpbGUpXG4gICAgICBjb25zdCBsaW5lcyA9IHBhcnNlci5nZXRMaW5lcygpXG5cbiAgICAgIGV4cGVjdChsaW5lcy5sZW5ndGgpLnRvQmUoNjMpXG4gICAgfSlcblxuICAgIGl0KCd0aHJvd3MgYW4gZXJyb3Igd2hlbiBwYXNzZWQgYSBmaWxlcGF0aCB0aGF0IGRvZXMgbm90IGV4aXN0JywgKCkgPT4ge1xuICAgICAgY29uc3QgbG9nRmlsZSA9IHBhdGguam9pbihmaXh0dXJlc1BhdGgsICdub3BlLmxvZycpXG4gICAgICBjb25zdCBwYXJzZXIgPSBuZXcgTG9nUGFyc2VyKGxvZ0ZpbGUpXG5cbiAgICAgIGV4cGVjdChwYXJzZXIuZ2V0TGluZXMpLnRvVGhyb3coKVxuICAgIH0pXG4gIH0pXG59KVxuIl19
//# sourceURL=/home/cin_chalic/.atom/packages/latex/spec/parsers/log-parser-spec.js
