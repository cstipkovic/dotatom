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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvc3BlYy9wYXJzZXJzL2xvZy1wYXJzZXItc3BlYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztRQUVPLGlCQUFpQjs7b0JBRVAsTUFBTTs7OzttQ0FDRCw4QkFBOEI7Ozs7QUFMcEQsV0FBVyxDQUFBOztBQU9YLFFBQVEsQ0FBQyxXQUFXLEVBQUUsWUFBTTtBQUMxQixNQUFJLFlBQVksWUFBQSxDQUFBOztBQUVoQixZQUFVLENBQUMsWUFBTTtBQUNmLGdCQUFZLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQTtHQUMxQyxDQUFDLENBQUE7O0FBRUYsVUFBUSxDQUFDLE9BQU8sRUFBRSxZQUFNO0FBQ3RCLE1BQUUsQ0FBQyxrQ0FBa0MsRUFBRSxZQUFNO0FBQzNDLFVBQU0sT0FBTyxHQUFHLGtCQUFLLElBQUksQ0FBQyxZQUFZLEVBQUUsVUFBVSxDQUFDLENBQUE7QUFDbkQsVUFBTSxNQUFNLEdBQUcscUNBQWMsT0FBTyxDQUFDLENBQUE7QUFDckMsVUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFBO0FBQzdCLFVBQU0sY0FBYyxHQUFHLGtCQUFLLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFBOztBQUVoRSxZQUFNLENBQUMsY0FBYyxDQUFDLENBQUMsSUFBSSxDQUFDLHNCQUFzQixDQUFDLENBQUE7S0FDcEQsQ0FBQyxDQUFBOztBQUVGLE1BQUUsQ0FBQywrQkFBK0IsRUFBRSxZQUFNO0FBQ3hDLFVBQU0sT0FBTyxHQUFHLGtCQUFLLElBQUksQ0FBQyxZQUFZLEVBQUUsWUFBWSxDQUFDLENBQUE7QUFDckQsVUFBTSxNQUFNLEdBQUcscUNBQWMsT0FBTyxDQUFDLENBQUE7QUFDckMsVUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFBOztBQUU3QixZQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7S0FDckMsQ0FBQyxDQUFBOztBQUVGLE1BQUUsQ0FBQyxnRUFBZ0UsRUFBRSxZQUFNO0FBQ3pFLFVBQU0sT0FBTyxHQUFHLGtCQUFLLElBQUksQ0FBQyxZQUFZLEVBQUUsWUFBWSxDQUFDLENBQUE7QUFDckQsVUFBTSxNQUFNLEdBQUcscUNBQWMsT0FBTyxDQUFDLENBQUE7QUFDckMsVUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFBO0FBQzdCLFVBQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUE7O0FBRTlCLFlBQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUM7QUFDcEIsbUJBQVcsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7QUFDckIsZ0JBQVEsRUFBRSxjQUFjO0FBQ3hCLGtCQUFVLEVBQUUsRUFBRTtBQUNkLGVBQU8sRUFBRSx5REFBeUQ7T0FDbkUsQ0FBQyxDQUFBO0tBQ0gsQ0FBQyxDQUFBO0dBQ0gsQ0FBQyxDQUFBOztBQUVGLFVBQVEsQ0FBQyxVQUFVLEVBQUUsWUFBTTtBQUN6QixNQUFFLENBQUMsc0NBQXNDLEVBQUUsWUFBTTtBQUMvQyxVQUFNLE9BQU8sR0FBRyxrQkFBSyxJQUFJLENBQUMsWUFBWSxFQUFFLFVBQVUsQ0FBQyxDQUFBO0FBQ25ELFVBQU0sTUFBTSxHQUFHLHFDQUFjLE9BQU8sQ0FBQyxDQUFBO0FBQ3JDLFVBQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQTs7QUFFL0IsWUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUE7S0FDOUIsQ0FBQyxDQUFBOztBQUVGLE1BQUUsQ0FBQyw0REFBNEQsRUFBRSxZQUFNO0FBQ3JFLFVBQU0sT0FBTyxHQUFHLGtCQUFLLElBQUksQ0FBQyxZQUFZLEVBQUUsVUFBVSxDQUFDLENBQUE7QUFDbkQsVUFBTSxNQUFNLEdBQUcscUNBQWMsT0FBTyxDQUFDLENBQUE7O0FBRXJDLFlBQU0sQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUE7S0FDbEMsQ0FBQyxDQUFBO0dBQ0gsQ0FBQyxDQUFBO0NBQ0gsQ0FBQyxDQUFBIiwiZmlsZSI6Ii9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvc3BlYy9wYXJzZXJzL2xvZy1wYXJzZXItc3BlYy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmltcG9ydCAnLi4vc3BlYy1oZWxwZXJzJ1xuXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IExvZ1BhcnNlciBmcm9tICcuLi8uLi9saWIvcGFyc2Vycy9sb2ctcGFyc2VyJ1xuXG5kZXNjcmliZSgnTG9nUGFyc2VyJywgKCkgPT4ge1xuICBsZXQgZml4dHVyZXNQYXRoXG5cbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgZml4dHVyZXNQYXRoID0gYXRvbS5wcm9qZWN0LmdldFBhdGhzKClbMF1cbiAgfSlcblxuICBkZXNjcmliZSgncGFyc2UnLCAoKSA9PiB7XG4gICAgaXQoJ3JldHVybnMgdGhlIGV4cGVjdGVkIG91dHB1dCBwYXRoJywgKCkgPT4ge1xuICAgICAgY29uc3QgbG9nRmlsZSA9IHBhdGguam9pbihmaXh0dXJlc1BhdGgsICdmaWxlLmxvZycpXG4gICAgICBjb25zdCBwYXJzZXIgPSBuZXcgTG9nUGFyc2VyKGxvZ0ZpbGUpXG4gICAgICBjb25zdCByZXN1bHQgPSBwYXJzZXIucGFyc2UoKVxuICAgICAgY29uc3Qgb3V0cHV0RmlsZVBhdGggPSBwYXRoLnBvc2l4LnJlc29sdmUocmVzdWx0Lm91dHB1dEZpbGVQYXRoKVxuXG4gICAgICBleHBlY3Qob3V0cHV0RmlsZVBhdGgpLnRvQmUoJy9mb28vb3V0cHV0L2ZpbGUucGRmJylcbiAgICB9KVxuXG4gICAgaXQoJ3BhcnNlcyBhbmQgcmV0dXJucyBhbGwgZXJyb3JzJywgKCkgPT4ge1xuICAgICAgY29uc3QgbG9nRmlsZSA9IHBhdGguam9pbihmaXh0dXJlc1BhdGgsICdlcnJvcnMubG9nJylcbiAgICAgIGNvbnN0IHBhcnNlciA9IG5ldyBMb2dQYXJzZXIobG9nRmlsZSlcbiAgICAgIGNvbnN0IHJlc3VsdCA9IHBhcnNlci5wYXJzZSgpXG5cbiAgICAgIGV4cGVjdChyZXN1bHQuZXJyb3JzLmxlbmd0aCkudG9CZSgzKVxuICAgIH0pXG5cbiAgICBpdCgnYXNzb2NpYXRlcyBhbiBlcnJvciB3aXRoIGEgZmlsZSBwYXRoLCBsaW5lIG51bWJlciwgYW5kIG1lc3NhZ2UnLCAoKSA9PiB7XG4gICAgICBjb25zdCBsb2dGaWxlID0gcGF0aC5qb2luKGZpeHR1cmVzUGF0aCwgJ2Vycm9ycy5sb2cnKVxuICAgICAgY29uc3QgcGFyc2VyID0gbmV3IExvZ1BhcnNlcihsb2dGaWxlKVxuICAgICAgY29uc3QgcmVzdWx0ID0gcGFyc2VyLnBhcnNlKClcbiAgICAgIGNvbnN0IGVycm9yID0gcmVzdWx0LmVycm9yc1swXVxuXG4gICAgICBleHBlY3QoZXJyb3IpLnRvRXF1YWwoe1xuICAgICAgICBsb2dQb3NpdGlvbjogWzE5NiwgMF0sXG4gICAgICAgIGZpbGVQYXRoOiAnLi9lcnJvcnMudGV4JyxcbiAgICAgICAgbGluZU51bWJlcjogMTAsXG4gICAgICAgIG1lc3NhZ2U6ICdcXFxcYmVnaW57Z2F0aGVyKn0gb24gaW5wdXQgbGluZSA4IGVuZGVkIGJ5IFxcXFxlbmR7Z2F0aGVyfSdcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnZ2V0TGluZXMnLCAoKSA9PiB7XG4gICAgaXQoJ3JldHVybnMgdGhlIGV4cGVjdGVkIG51bWJlciBvZiBsaW5lcycsICgpID0+IHtcbiAgICAgIGNvbnN0IGxvZ0ZpbGUgPSBwYXRoLmpvaW4oZml4dHVyZXNQYXRoLCAnZmlsZS5sb2cnKVxuICAgICAgY29uc3QgcGFyc2VyID0gbmV3IExvZ1BhcnNlcihsb2dGaWxlKVxuICAgICAgY29uc3QgbGluZXMgPSBwYXJzZXIuZ2V0TGluZXMoKVxuXG4gICAgICBleHBlY3QobGluZXMubGVuZ3RoKS50b0JlKDYzKVxuICAgIH0pXG5cbiAgICBpdCgndGhyb3dzIGFuIGVycm9yIHdoZW4gcGFzc2VkIGEgZmlsZXBhdGggdGhhdCBkb2VzIG5vdCBleGlzdCcsICgpID0+IHtcbiAgICAgIGNvbnN0IGxvZ0ZpbGUgPSBwYXRoLmpvaW4oZml4dHVyZXNQYXRoLCAnbm9wZS5sb2cnKVxuICAgICAgY29uc3QgcGFyc2VyID0gbmV3IExvZ1BhcnNlcihsb2dGaWxlKVxuXG4gICAgICBleHBlY3QocGFyc2VyLmdldExpbmVzKS50b1Rocm93KClcbiAgICB9KVxuICB9KVxufSlcbiJdfQ==
//# sourceURL=/home/cin_chalic/.atom/packages/latex/spec/parsers/log-parser-spec.js
