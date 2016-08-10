function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _specHelpers = require('./spec-helpers');

var _specHelpers2 = _interopRequireDefault(_specHelpers);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _libBuilder = require('../lib/builder');

var _libBuilder2 = _interopRequireDefault(_libBuilder);

'use babel';

describe('Builder', function () {
  var builder = undefined,
      fixturesPath = undefined,
      filePath = undefined,
      logFilePath = undefined;

  beforeEach(function () {
    builder = new _libBuilder2['default']();
    fixturesPath = _specHelpers2['default'].cloneFixtures();
    filePath = _path2['default'].join(fixturesPath, 'file.tex');
    logFilePath = _path2['default'].join(fixturesPath, 'file.log');
  });

  describe('constructPath', function () {
    it('reads `latex.texPath` as configured', function () {
      spyOn(atom.config, 'get').andReturn();
      builder.constructPath();

      expect(atom.config.get).toHaveBeenCalledWith('latex.texPath');
    });

    it('uses platform default when `latex.texPath` is not configured', function () {
      var defaultTexPath = '/foo/bar';
      var expectedPath = [defaultTexPath, process.env.PATH].join(_path2['default'].delimiter);
      atom.config.set('latex.texPath', '');
      spyOn(builder, 'defaultTexPath').andReturn(defaultTexPath);

      var constructedPath = builder.constructPath();
      expect(constructedPath).toBe(expectedPath);
    });

    it('replaces surrounded $PATH with process.env.PATH', function () {
      var texPath = '/foo:$PATH:/bar';
      var expectedPath = texPath.replace('$PATH', process.env.PATH);
      atom.config.set('latex.texPath', texPath);

      var constructedPath = builder.constructPath();
      expect(constructedPath).toBe(expectedPath);
    });

    it('replaces leading $PATH with process.env.PATH', function () {
      var texPath = '$PATH:/bar';
      var expectedPath = texPath.replace('$PATH', process.env.PATH);
      atom.config.set('latex.texPath', texPath);

      var constructedPath = builder.constructPath();
      expect(constructedPath).toBe(expectedPath);
    });

    it('replaces trailing $PATH with process.env.PATH', function () {
      var texPath = '/foo:$PATH';
      var expectedPath = texPath.replace('$PATH', process.env.PATH);
      atom.config.set('latex.texPath', texPath);

      var constructedPath = builder.constructPath();
      expect(constructedPath).toBe(expectedPath);
    });

    it('prepends process.env.PATH with texPath', function () {
      var texPath = '/foo';
      var expectedPath = [texPath, process.env.PATH].join(_path2['default'].delimiter);
      atom.config.set('latex.texPath', texPath);

      var constructedPath = builder.constructPath();
      expect(constructedPath).toBe(expectedPath);
    });
  });

  describe('parseLogFile', function () {
    var logParser = undefined;

    beforeEach(function () {
      logParser = jasmine.createSpyObj('MockLogParser', ['parse']);
      spyOn(builder, 'getLogParser').andReturn(logParser);
    });

    it('resolves the associated log file path by invoking @resolveLogFilePath', function () {
      spyOn(builder, 'resolveLogFilePath').andReturn('foo.log');

      builder.parseLogFile(filePath, null);
      expect(builder.resolveLogFilePath).toHaveBeenCalledWith(filePath, null);
    });

    it('returns null if passed a file path that does not exist', function () {
      filePath = '/foo/bar/quux.tex';
      var result = builder.parseLogFile(filePath, null);

      expect(result).toBeNull();
      expect(logParser.parse).not.toHaveBeenCalled();
    });

    it('attempts to parse the resolved log file', function () {
      builder.parseLogFile(filePath);

      expect(builder.getLogParser).toHaveBeenCalledWith(logFilePath);
      expect(logParser.parse).toHaveBeenCalled();
    });
  });

  describe('getLatexEngineFromMagic', function () {
    it('detects program magic and outputs correct engine', function () {
      var filePath = _path2['default'].join(fixturesPath, 'magic-comments', 'latex-engine.tex');
      expect(builder.getLatexEngineFromMagic(filePath)).toEqual('pdflatex');
    });
  });

  describe('getJobNamesFromMagic', function () {
    it('detects program magic and outputs jobnames', function () {
      var filePath = _path2['default'].join(fixturesPath, 'magic-comments', 'latex-jobnames.tex');
      expect(builder.getJobNamesFromMagic(filePath)).toEqual(['foo', 'bar']);
    });
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvc3BlYy9idWlsZGVyLXNwZWMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7MkJBRW9CLGdCQUFnQjs7OztvQkFDbkIsTUFBTTs7OzswQkFDSCxnQkFBZ0I7Ozs7QUFKcEMsV0FBVyxDQUFBOztBQU1YLFFBQVEsQ0FBQyxTQUFTLEVBQUUsWUFBTTtBQUN4QixNQUFJLE9BQU8sWUFBQTtNQUFFLFlBQVksWUFBQTtNQUFFLFFBQVEsWUFBQTtNQUFFLFdBQVcsWUFBQSxDQUFBOztBQUVoRCxZQUFVLENBQUMsWUFBTTtBQUNmLFdBQU8sR0FBRyw2QkFBYSxDQUFBO0FBQ3ZCLGdCQUFZLEdBQUcseUJBQVEsYUFBYSxFQUFFLENBQUE7QUFDdEMsWUFBUSxHQUFHLGtCQUFLLElBQUksQ0FBQyxZQUFZLEVBQUUsVUFBVSxDQUFDLENBQUE7QUFDOUMsZUFBVyxHQUFHLGtCQUFLLElBQUksQ0FBQyxZQUFZLEVBQUUsVUFBVSxDQUFDLENBQUE7R0FDbEQsQ0FBQyxDQUFBOztBQUVGLFVBQVEsQ0FBQyxlQUFlLEVBQUUsWUFBTTtBQUM5QixNQUFFLENBQUMscUNBQXFDLEVBQUUsWUFBTTtBQUM5QyxXQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQTtBQUNyQyxhQUFPLENBQUMsYUFBYSxFQUFFLENBQUE7O0FBRXZCLFlBQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLGVBQWUsQ0FBQyxDQUFBO0tBQzlELENBQUMsQ0FBQTs7QUFFRixNQUFFLENBQUMsOERBQThELEVBQUUsWUFBTTtBQUN2RSxVQUFNLGNBQWMsR0FBRyxVQUFVLENBQUE7QUFDakMsVUFBTSxZQUFZLEdBQUcsQ0FBQyxjQUFjLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsa0JBQUss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QUFnQixFQUFFLGtCQUFrQixDQUFDLENBQUE7QUFDOUUsWUFBTSxDQUFDLE9BQU8sQ0FBQyx1QkFBdUIsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQTtLQUN0RSxDQUFDLENBQUE7R0FDSCxDQUFDLENBQUE7O0FBRUYsVUFBUSxDQUFDLHNCQUFzQixFQUFFLFlBQU07QUFDckMsTUFBRSxDQUFDLDRDQUE0QyxFQUFFLFlBQU07QUFDckQsVUFBTSxRQUFRLEdBQUcsa0JBQUssSUFBSSxDQUFDLFlBQVksRUFBRSxnQkFBZ0IsRUFBRSxvQkFBb0IsQ0FBQyxDQUFBO0FBQ2hGLFlBQU0sQ0FBQyxPQUFPLENBQUMsb0JBQW9CLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQTtLQUN2RSxDQUFDLENBQUE7R0FDSCxDQUFDLENBQUE7Q0FDSCxDQUFDLENBQUEiLCJmaWxlIjoiL2hvbWUvY2luX2NoYWxpYy8uYXRvbS9wYWNrYWdlcy9sYXRleC9zcGVjL2J1aWxkZXItc3BlYy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmltcG9ydCBoZWxwZXJzIGZyb20gJy4vc3BlYy1oZWxwZXJzJ1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcbmltcG9ydCBCdWlsZGVyIGZyb20gJy4uL2xpYi9idWlsZGVyJ1xuXG5kZXNjcmliZSgnQnVpbGRlcicsICgpID0+IHtcbiAgbGV0IGJ1aWxkZXIsIGZpeHR1cmVzUGF0aCwgZmlsZVBhdGgsIGxvZ0ZpbGVQYXRoXG5cbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgYnVpbGRlciA9IG5ldyBCdWlsZGVyKClcbiAgICBmaXh0dXJlc1BhdGggPSBoZWxwZXJzLmNsb25lRml4dHVyZXMoKVxuICAgIGZpbGVQYXRoID0gcGF0aC5qb2luKGZpeHR1cmVzUGF0aCwgJ2ZpbGUudGV4JylcbiAgICBsb2dGaWxlUGF0aCA9IHBhdGguam9pbihmaXh0dXJlc1BhdGgsICdmaWxlLmxvZycpXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ2NvbnN0cnVjdFBhdGgnLCAoKSA9PiB7XG4gICAgaXQoJ3JlYWRzIGBsYXRleC50ZXhQYXRoYCBhcyBjb25maWd1cmVkJywgKCkgPT4ge1xuICAgICAgc3B5T24oYXRvbS5jb25maWcsICdnZXQnKS5hbmRSZXR1cm4oKVxuICAgICAgYnVpbGRlci5jb25zdHJ1Y3RQYXRoKClcblxuICAgICAgZXhwZWN0KGF0b20uY29uZmlnLmdldCkudG9IYXZlQmVlbkNhbGxlZFdpdGgoJ2xhdGV4LnRleFBhdGgnKVxuICAgIH0pXG5cbiAgICBpdCgndXNlcyBwbGF0Zm9ybSBkZWZhdWx0IHdoZW4gYGxhdGV4LnRleFBhdGhgIGlzIG5vdCBjb25maWd1cmVkJywgKCkgPT4ge1xuICAgICAgY29uc3QgZGVmYXVsdFRleFBhdGggPSAnL2Zvby9iYXInXG4gICAgICBjb25zdCBleHBlY3RlZFBhdGggPSBbZGVmYXVsdFRleFBhdGgsIHByb2Nlc3MuZW52LlBBVEhdLmpvaW4ocGF0aC5kZWxpbWl0ZXIpXG4gICAgICBhdG9tLmNvbmZpZy5zZXQoJ2xhdGV4LnRleFBhdGgnLCAnJylcbiAgICAgIHNweU9uKGJ1aWxkZXIsICdkZWZhdWx0VGV4UGF0aCcpLmFuZFJldHVybihkZWZhdWx0VGV4UGF0aClcblxuICAgICAgY29uc3QgY29uc3RydWN0ZWRQYXRoID0gYnVpbGRlci5jb25zdHJ1Y3RQYXRoKClcbiAgICAgIGV4cGVjdChjb25zdHJ1Y3RlZFBhdGgpLnRvQmUoZXhwZWN0ZWRQYXRoKVxuICAgIH0pXG5cbiAgICBpdCgncmVwbGFjZXMgc3Vycm91bmRlZCAkUEFUSCB3aXRoIHByb2Nlc3MuZW52LlBBVEgnLCAoKSA9PiB7XG4gICAgICBjb25zdCB0ZXhQYXRoID0gJy9mb286JFBBVEg6L2JhcidcbiAgICAgIGNvbnN0IGV4cGVjdGVkUGF0aCA9IHRleFBhdGgucmVwbGFjZSgnJFBBVEgnLCBwcm9jZXNzLmVudi5QQVRIKVxuICAgICAgYXRvbS5jb25maWcuc2V0KCdsYXRleC50ZXhQYXRoJywgdGV4UGF0aClcblxuICAgICAgY29uc3QgY29uc3RydWN0ZWRQYXRoID0gYnVpbGRlci5jb25zdHJ1Y3RQYXRoKClcbiAgICAgIGV4cGVjdChjb25zdHJ1Y3RlZFBhdGgpLnRvQmUoZXhwZWN0ZWRQYXRoKVxuICAgIH0pXG5cbiAgICBpdCgncmVwbGFjZXMgbGVhZGluZyAkUEFUSCB3aXRoIHByb2Nlc3MuZW52LlBBVEgnLCAoKSA9PiB7XG4gICAgICBjb25zdCB0ZXhQYXRoID0gJyRQQVRIOi9iYXInXG4gICAgICBjb25zdCBleHBlY3RlZFBhdGggPSB0ZXhQYXRoLnJlcGxhY2UoJyRQQVRIJywgcHJvY2Vzcy5lbnYuUEFUSClcbiAgICAgIGF0b20uY29uZmlnLnNldCgnbGF0ZXgudGV4UGF0aCcsIHRleFBhdGgpXG5cbiAgICAgIGNvbnN0IGNvbnN0cnVjdGVkUGF0aCA9IGJ1aWxkZXIuY29uc3RydWN0UGF0aCgpXG4gICAgICBleHBlY3QoY29uc3RydWN0ZWRQYXRoKS50b0JlKGV4cGVjdGVkUGF0aClcbiAgICB9KVxuXG4gICAgaXQoJ3JlcGxhY2VzIHRyYWlsaW5nICRQQVRIIHdpdGggcHJvY2Vzcy5lbnYuUEFUSCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHRleFBhdGggPSAnL2ZvbzokUEFUSCdcbiAgICAgIGNvbnN0IGV4cGVjdGVkUGF0aCA9IHRleFBhdGgucmVwbGFjZSgnJFBBVEgnLCBwcm9jZXNzLmVudi5QQVRIKVxuICAgICAgYXRvbS5jb25maWcuc2V0KCdsYXRleC50ZXhQYXRoJywgdGV4UGF0aClcblxuICAgICAgY29uc3QgY29uc3RydWN0ZWRQYXRoID0gYnVpbGRlci5jb25zdHJ1Y3RQYXRoKClcbiAgICAgIGV4cGVjdChjb25zdHJ1Y3RlZFBhdGgpLnRvQmUoZXhwZWN0ZWRQYXRoKVxuICAgIH0pXG5cbiAgICBpdCgncHJlcGVuZHMgcHJvY2Vzcy5lbnYuUEFUSCB3aXRoIHRleFBhdGgnLCAoKSA9PiB7XG4gICAgICBjb25zdCB0ZXhQYXRoID0gJy9mb28nXG4gICAgICBjb25zdCBleHBlY3RlZFBhdGggPSBbdGV4UGF0aCwgcHJvY2Vzcy5lbnYuUEFUSF0uam9pbihwYXRoLmRlbGltaXRlcilcbiAgICAgIGF0b20uY29uZmlnLnNldCgnbGF0ZXgudGV4UGF0aCcsIHRleFBhdGgpXG5cbiAgICAgIGNvbnN0IGNvbnN0cnVjdGVkUGF0aCA9IGJ1aWxkZXIuY29uc3RydWN0UGF0aCgpXG4gICAgICBleHBlY3QoY29uc3RydWN0ZWRQYXRoKS50b0JlKGV4cGVjdGVkUGF0aClcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdwYXJzZUxvZ0ZpbGUnLCAoKSA9PiB7XG4gICAgbGV0IGxvZ1BhcnNlclxuXG4gICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICBsb2dQYXJzZXIgPSBqYXNtaW5lLmNyZWF0ZVNweU9iaignTW9ja0xvZ1BhcnNlcicsIFsncGFyc2UnXSlcbiAgICAgIHNweU9uKGJ1aWxkZXIsICdnZXRMb2dQYXJzZXInKS5hbmRSZXR1cm4obG9nUGFyc2VyKVxuICAgIH0pXG5cbiAgICBpdCgncmVzb2x2ZXMgdGhlIGFzc29jaWF0ZWQgbG9nIGZpbGUgcGF0aCBieSBpbnZva2luZyBAcmVzb2x2ZUxvZ0ZpbGVQYXRoJywgKCkgPT4ge1xuICAgICAgc3B5T24oYnVpbGRlciwgJ3Jlc29sdmVMb2dGaWxlUGF0aCcpLmFuZFJldHVybignZm9vLmxvZycpXG5cbiAgICAgIGJ1aWxkZXIucGFyc2VMb2dGaWxlKGZpbGVQYXRoLCBudWxsKVxuICAgICAgZXhwZWN0KGJ1aWxkZXIucmVzb2x2ZUxvZ0ZpbGVQYXRoKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChmaWxlUGF0aCwgbnVsbClcbiAgICB9KVxuXG4gICAgaXQoJ3JldHVybnMgbnVsbCBpZiBwYXNzZWQgYSBmaWxlIHBhdGggdGhhdCBkb2VzIG5vdCBleGlzdCcsICgpID0+IHtcbiAgICAgIGZpbGVQYXRoID0gJy9mb28vYmFyL3F1dXgudGV4J1xuICAgICAgY29uc3QgcmVzdWx0ID0gYnVpbGRlci5wYXJzZUxvZ0ZpbGUoZmlsZVBhdGgsIG51bGwpXG5cbiAgICAgIGV4cGVjdChyZXN1bHQpLnRvQmVOdWxsKClcbiAgICAgIGV4cGVjdChsb2dQYXJzZXIucGFyc2UpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICB9KVxuXG4gICAgaXQoJ2F0dGVtcHRzIHRvIHBhcnNlIHRoZSByZXNvbHZlZCBsb2cgZmlsZScsICgpID0+IHtcbiAgICAgIGJ1aWxkZXIucGFyc2VMb2dGaWxlKGZpbGVQYXRoKVxuXG4gICAgICBleHBlY3QoYnVpbGRlci5nZXRMb2dQYXJzZXIpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKGxvZ0ZpbGVQYXRoKVxuICAgICAgZXhwZWN0KGxvZ1BhcnNlci5wYXJzZSkudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnZ2V0TGF0ZXhFbmdpbmVGcm9tTWFnaWMnLCAoKSA9PiB7XG4gICAgaXQoJ2RldGVjdHMgcHJvZ3JhbSBtYWdpYyBhbmQgb3V0cHV0cyBjb3JyZWN0IGVuZ2luZScsICgpID0+IHtcbiAgICAgIGNvbnN0IGZpbGVQYXRoID0gcGF0aC5qb2luKGZpeHR1cmVzUGF0aCwgJ21hZ2ljLWNvbW1lbnRzJywgJ2xhdGV4LWVuZ2luZS50ZXgnKVxuICAgICAgZXhwZWN0KGJ1aWxkZXIuZ2V0TGF0ZXhFbmdpbmVGcm9tTWFnaWMoZmlsZVBhdGgpKS50b0VxdWFsKCdwZGZsYXRleCcpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnZ2V0Sm9iTmFtZXNGcm9tTWFnaWMnLCAoKSA9PiB7XG4gICAgaXQoJ2RldGVjdHMgcHJvZ3JhbSBtYWdpYyBhbmQgb3V0cHV0cyBqb2JuYW1lcycsICgpID0+IHtcbiAgICAgIGNvbnN0IGZpbGVQYXRoID0gcGF0aC5qb2luKGZpeHR1cmVzUGF0aCwgJ21hZ2ljLWNvbW1lbnRzJywgJ2xhdGV4LWpvYm5hbWVzLnRleCcpXG4gICAgICBleHBlY3QoYnVpbGRlci5nZXRKb2JOYW1lc0Zyb21NYWdpYyhmaWxlUGF0aCkpLnRvRXF1YWwoWydmb28nLCAnYmFyJ10pXG4gICAgfSlcbiAgfSlcbn0pXG4iXX0=
//# sourceURL=/home/cin_chalic/.atom/packages/latex/spec/builder-spec.js