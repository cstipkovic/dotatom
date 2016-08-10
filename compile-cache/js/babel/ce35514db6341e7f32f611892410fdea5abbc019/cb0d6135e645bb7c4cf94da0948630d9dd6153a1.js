function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _specHelpers = require('./spec-helpers');

var _specHelpers2 = _interopRequireDefault(_specHelpers);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _libBuilderRegistry = require('../lib/builder-registry');

var _libBuilderRegistry2 = _interopRequireDefault(_libBuilderRegistry);

var _stubs = require('./stubs');

'use babel';

describe('BuilderRegistry', function () {
  var registry = undefined,
      fixturesPath = undefined,
      filePath = undefined;

  beforeEach(function () {
    registry = new _libBuilderRegistry2['default']();
    fixturesPath = _specHelpers2['default'].cloneFixtures();
    filePath = _path2['default'].join(fixturesPath, 'file.tex');
  });

  describe('getBuilder', function () {
    beforeEach(function () {
      atom.config.set('latex.builder', 'latexmk');
    });

    it('returns null when no builders are associated with the given file', function () {
      var filePath = _path2['default'].join('foo', 'quux.txt');
      expect(registry.getBuilder(filePath)).toBeNull();
    });

    it('returns the configured builder when given a regular .tex file', function () {
      var filePath = _path2['default'].join('foo', 'bar.tex');
      expect(registry.getBuilder(filePath).name).toEqual('LatexmkBuilder');

      atom.config.set('latex.builder', 'texify');
      expect(registry.getBuilder(filePath).name).toEqual('TexifyBuilder');
    });

    it('throws an error when unable to resolve ambigious builder registration', function () {
      var allBuilders = registry.getAllBuilders().push(_stubs.NullBuilder);
      spyOn(registry, 'getAllBuilders').andReturn(allBuilders);
      expect(function () {
        registry.getBuilder(filePath);
      }).toThrow();
    });
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvc3BlYy9idWlsZC1yZWdpc3RyeS1zcGVjLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OzJCQUVvQixnQkFBZ0I7Ozs7b0JBQ25CLE1BQU07Ozs7a0NBQ0sseUJBQXlCOzs7O3FCQUMzQixTQUFTOztBQUxuQyxXQUFXLENBQUE7O0FBT1gsUUFBUSxDQUFDLGlCQUFpQixFQUFFLFlBQU07QUFDaEMsTUFBSSxRQUFRLFlBQUE7TUFBRSxZQUFZLFlBQUE7TUFBRSxRQUFRLFlBQUEsQ0FBQTs7QUFFcEMsWUFBVSxDQUFDLFlBQU07QUFDZixZQUFRLEdBQUcscUNBQXFCLENBQUE7QUFDaEMsZ0JBQVksR0FBRyx5QkFBUSxhQUFhLEVBQUUsQ0FBQTtBQUN0QyxZQUFRLEdBQUcsa0JBQUssSUFBSSxDQUFDLFlBQVksRUFBRSxVQUFVLENBQUMsQ0FBQTtHQUMvQyxDQUFDLENBQUE7O0FBRUYsVUFBUSxDQUFDLFlBQVksRUFBRSxZQUFNO0FBQzNCLGNBQVUsQ0FBQyxZQUFNO0FBQ2YsVUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsZUFBZSxFQUFFLFNBQVMsQ0FBQyxDQUFBO0tBQzVDLENBQUMsQ0FBQTs7QUFFRixNQUFFLENBQUMsa0VBQWtFLEVBQUUsWUFBTTtBQUMzRSxVQUFNLFFBQVEsR0FBRyxrQkFBSyxJQUFJLENBQUMsS0FBSyxFQUFFLFVBQVUsQ0FBQyxDQUFBO0FBQzdDLFlBQU0sQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUE7S0FDakQsQ0FBQyxDQUFBOztBQUVGLE1BQUUsQ0FBQywrREFBK0QsRUFBRSxZQUFNO0FBQ3hFLFVBQU0sUUFBUSxHQUFHLGtCQUFLLElBQUksQ0FBQyxLQUFLLEVBQUUsU0FBUyxDQUFDLENBQUE7QUFDNUMsWUFBTSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUE7O0FBRXBFLFVBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGVBQWUsRUFBRSxRQUFRLENBQUMsQ0FBQTtBQUMxQyxZQUFNLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUE7S0FDcEUsQ0FBQyxDQUFBOztBQUVGLE1BQUUsQ0FBQyx1RUFBdUUsRUFBRSxZQUFNO0FBQ2hGLFVBQU0sV0FBVyxHQUFHLFFBQVEsQ0FBQyxjQUFjLEVBQUUsQ0FBQyxJQUFJLG9CQUFhLENBQUE7QUFDL0QsV0FBSyxDQUFDLFFBQVEsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsQ0FBQTtBQUN4RCxZQUFNLENBQUMsWUFBTTtBQUFFLGdCQUFRLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFBO09BQUUsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFBO0tBQzFELENBQUMsQ0FBQTtHQUNILENBQUMsQ0FBQTtDQUNILENBQUMsQ0FBQSIsImZpbGUiOiIvaG9tZS9jaW5fY2hhbGljLy5hdG9tL3BhY2thZ2VzL2xhdGV4L3NwZWMvYnVpbGQtcmVnaXN0cnktc3BlYy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmltcG9ydCBoZWxwZXJzIGZyb20gJy4vc3BlYy1oZWxwZXJzJ1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcbmltcG9ydCBCdWlsZGVyUmVnaXN0cnkgZnJvbSAnLi4vbGliL2J1aWxkZXItcmVnaXN0cnknXG5pbXBvcnQge051bGxCdWlsZGVyfSBmcm9tICcuL3N0dWJzJ1xuXG5kZXNjcmliZSgnQnVpbGRlclJlZ2lzdHJ5JywgKCkgPT4ge1xuICBsZXQgcmVnaXN0cnksIGZpeHR1cmVzUGF0aCwgZmlsZVBhdGhcblxuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICByZWdpc3RyeSA9IG5ldyBCdWlsZGVyUmVnaXN0cnkoKVxuICAgIGZpeHR1cmVzUGF0aCA9IGhlbHBlcnMuY2xvbmVGaXh0dXJlcygpXG4gICAgZmlsZVBhdGggPSBwYXRoLmpvaW4oZml4dHVyZXNQYXRoLCAnZmlsZS50ZXgnKVxuICB9KVxuXG4gIGRlc2NyaWJlKCdnZXRCdWlsZGVyJywgKCkgPT4ge1xuICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgYXRvbS5jb25maWcuc2V0KCdsYXRleC5idWlsZGVyJywgJ2xhdGV4bWsnKVxuICAgIH0pXG5cbiAgICBpdCgncmV0dXJucyBudWxsIHdoZW4gbm8gYnVpbGRlcnMgYXJlIGFzc29jaWF0ZWQgd2l0aCB0aGUgZ2l2ZW4gZmlsZScsICgpID0+IHtcbiAgICAgIGNvbnN0IGZpbGVQYXRoID0gcGF0aC5qb2luKCdmb28nLCAncXV1eC50eHQnKVxuICAgICAgZXhwZWN0KHJlZ2lzdHJ5LmdldEJ1aWxkZXIoZmlsZVBhdGgpKS50b0JlTnVsbCgpXG4gICAgfSlcblxuICAgIGl0KCdyZXR1cm5zIHRoZSBjb25maWd1cmVkIGJ1aWxkZXIgd2hlbiBnaXZlbiBhIHJlZ3VsYXIgLnRleCBmaWxlJywgKCkgPT4ge1xuICAgICAgY29uc3QgZmlsZVBhdGggPSBwYXRoLmpvaW4oJ2ZvbycsICdiYXIudGV4JylcbiAgICAgIGV4cGVjdChyZWdpc3RyeS5nZXRCdWlsZGVyKGZpbGVQYXRoKS5uYW1lKS50b0VxdWFsKCdMYXRleG1rQnVpbGRlcicpXG5cbiAgICAgIGF0b20uY29uZmlnLnNldCgnbGF0ZXguYnVpbGRlcicsICd0ZXhpZnknKVxuICAgICAgZXhwZWN0KHJlZ2lzdHJ5LmdldEJ1aWxkZXIoZmlsZVBhdGgpLm5hbWUpLnRvRXF1YWwoJ1RleGlmeUJ1aWxkZXInKVxuICAgIH0pXG5cbiAgICBpdCgndGhyb3dzIGFuIGVycm9yIHdoZW4gdW5hYmxlIHRvIHJlc29sdmUgYW1iaWdpb3VzIGJ1aWxkZXIgcmVnaXN0cmF0aW9uJywgKCkgPT4ge1xuICAgICAgY29uc3QgYWxsQnVpbGRlcnMgPSByZWdpc3RyeS5nZXRBbGxCdWlsZGVycygpLnB1c2goTnVsbEJ1aWxkZXIpXG4gICAgICBzcHlPbihyZWdpc3RyeSwgJ2dldEFsbEJ1aWxkZXJzJykuYW5kUmV0dXJuKGFsbEJ1aWxkZXJzKVxuICAgICAgZXhwZWN0KCgpID0+IHsgcmVnaXN0cnkuZ2V0QnVpbGRlcihmaWxlUGF0aCkgfSkudG9UaHJvdygpXG4gICAgfSlcbiAgfSlcbn0pXG4iXX0=
//# sourceURL=/home/cin_chalic/.atom/packages/latex/spec/build-registry-spec.js
