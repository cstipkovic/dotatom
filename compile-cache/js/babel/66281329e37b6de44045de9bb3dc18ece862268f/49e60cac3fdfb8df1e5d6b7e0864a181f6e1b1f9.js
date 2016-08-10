function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _libParsersMagicParser = require('../../lib/parsers/magic-parser');

var _libParsersMagicParser2 = _interopRequireDefault(_libParsersMagicParser);

'use babel';

describe('MagicParser', function () {
  var fixturesPath = undefined;

  beforeEach(function () {
    fixturesPath = atom.project.getPaths()[0];
  });

  describe('parse', function () {
    it('returns an empty object when file contains no magic comments', function () {
      var filePath = _path2['default'].join(fixturesPath, 'file.tex');
      var parser = new _libParsersMagicParser2['default'](filePath);
      var result = parser.parse();

      expect(result).toEqual({});
    });

    it('returns path to root file when file contains magic root comment', function () {
      var filePath = _path2['default'].join(fixturesPath, 'magic-comments', 'root-comment.tex');
      var parser = new _libParsersMagicParser2['default'](filePath);
      var result = parser.parse();

      expect(result).toEqual({
        'root': '../file.tex'
      });
    });

    it('returns path to root file when file contains magic root comment when magic comment is not on the first line', function () {
      var filePath = _path2['default'].join(fixturesPath, 'magic-comments', 'not-first-line.tex');
      var parser = new _libParsersMagicParser2['default'](filePath);
      var result = parser.parse();

      expect(result).toEqual({
        'root': '../file.tex'
      });
    });

    it('handles magic comments without optional whitespace', function () {
      var filePath = _path2['default'].join(fixturesPath, 'magic-comments', 'no-whitespace.tex');
      var parser = new _libParsersMagicParser2['default'](filePath);
      var result = parser.parse();

      expect(result).not.toEqual({});
    });
    it('detects multiple object information when multiple magice comments are defined', function () {
      var filePath = _path2['default'].join(fixturesPath, 'magic-comments', 'multiple-magic-comments.tex');
      var parser = new _libParsersMagicParser2['default'](filePath);
      var result = parser.parse();

      expect(result).toEqual({
        'root': '../file.tex',
        'program': 'pdflatex'
      });
    });
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvc3BlYy9wYXJzZXJzL21hZ2ljLXBhcnNlci1zcGVjLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O29CQUVpQixNQUFNOzs7O3FDQUNDLGdDQUFnQzs7OztBQUh4RCxXQUFXLENBQUE7O0FBS1gsUUFBUSxDQUFDLGFBQWEsRUFBRSxZQUFNO0FBQzVCLE1BQUksWUFBWSxZQUFBLENBQUE7O0FBRWhCLFlBQVUsQ0FBQyxZQUFNO0FBQ2YsZ0JBQVksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFBO0dBQzFDLENBQUMsQ0FBQTs7QUFFRixVQUFRLENBQUMsT0FBTyxFQUFFLFlBQU07QUFDdEIsTUFBRSxDQUFDLDhEQUE4RCxFQUFFLFlBQU07QUFDdkUsVUFBTSxRQUFRLEdBQUcsa0JBQUssSUFBSSxDQUFDLFlBQVksRUFBRSxVQUFVLENBQUMsQ0FBQTtBQUNwRCxVQUFNLE1BQU0sR0FBRyx1Q0FBZ0IsUUFBUSxDQUFDLENBQUE7QUFDeEMsVUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFBOztBQUU3QixZQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFBO0tBQzNCLENBQUMsQ0FBQTs7QUFFRixNQUFFLENBQUMsaUVBQWlFLEVBQUUsWUFBTTtBQUMxRSxVQUFNLFFBQVEsR0FBRyxrQkFBSyxJQUFJLENBQUMsWUFBWSxFQUFFLGdCQUFnQixFQUFFLGtCQUFrQixDQUFDLENBQUE7QUFDOUUsVUFBTSxNQUFNLEdBQUcsdUNBQWdCLFFBQVEsQ0FBQyxDQUFBO0FBQ3hDLFVBQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQTs7QUFFN0IsWUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQztBQUNyQixjQUFNLEVBQUUsYUFBYTtPQUN0QixDQUFDLENBQUE7S0FDSCxDQUFDLENBQUE7O0FBRUYsTUFBRSxDQUFDLDZHQUE2RyxFQUFFLFlBQU07QUFDdEgsVUFBTSxRQUFRLEdBQUcsa0JBQUssSUFBSSxDQUFDLFlBQVksRUFBRSxnQkFBZ0IsRUFBRSxvQkFBb0IsQ0FBQyxDQUFBO0FBQ2hGLFVBQU0sTUFBTSxHQUFHLHVDQUFnQixRQUFRLENBQUMsQ0FBQTtBQUN4QyxVQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUE7O0FBRTdCLFlBQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUM7QUFDckIsY0FBTSxFQUFFLGFBQWE7T0FDdEIsQ0FBQyxDQUFBO0tBQ0gsQ0FBQyxDQUFBOztBQUVGLE1BQUUsQ0FBQyxvREFBb0QsRUFBRSxZQUFNO0FBQzdELFVBQU0sUUFBUSxHQUFHLGtCQUFLLElBQUksQ0FBQyxZQUFZLEVBQUUsZ0JBQWdCLEVBQUUsbUJBQW1CLENBQUMsQ0FBQTtBQUMvRSxVQUFNLE1BQU0sR0FBRyx1Q0FBZ0IsUUFBUSxDQUFDLENBQUE7QUFDeEMsVUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFBOztBQUU3QixZQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQTtLQUMvQixDQUFDLENBQUE7QUFDRixNQUFFLENBQUMsK0VBQStFLEVBQUUsWUFBTTtBQUN4RixVQUFNLFFBQVEsR0FBRyxrQkFBSyxJQUFJLENBQUMsWUFBWSxFQUFFLGdCQUFnQixFQUFFLDZCQUE2QixDQUFDLENBQUE7QUFDekYsVUFBTSxNQUFNLEdBQUcsdUNBQWdCLFFBQVEsQ0FBQyxDQUFBO0FBQ3hDLFVBQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQTs7QUFFN0IsWUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQztBQUNyQixjQUFNLEVBQUUsYUFBYTtBQUNyQixpQkFBUyxFQUFFLFVBQVU7T0FDdEIsQ0FBQyxDQUFBO0tBQ0gsQ0FBQyxDQUFBO0dBQ0gsQ0FBQyxDQUFBO0NBQ0gsQ0FBQyxDQUFBIiwiZmlsZSI6Ii9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvc3BlYy9wYXJzZXJzL21hZ2ljLXBhcnNlci1zcGVjLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcbmltcG9ydCBNYWdpY1BhcnNlciBmcm9tICcuLi8uLi9saWIvcGFyc2Vycy9tYWdpYy1wYXJzZXInXG5cbmRlc2NyaWJlKCdNYWdpY1BhcnNlcicsICgpID0+IHtcbiAgbGV0IGZpeHR1cmVzUGF0aFxuXG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIGZpeHR1cmVzUGF0aCA9IGF0b20ucHJvamVjdC5nZXRQYXRocygpWzBdXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ3BhcnNlJywgKCkgPT4ge1xuICAgIGl0KCdyZXR1cm5zIGFuIGVtcHR5IG9iamVjdCB3aGVuIGZpbGUgY29udGFpbnMgbm8gbWFnaWMgY29tbWVudHMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBmaWxlUGF0aCA9IHBhdGguam9pbihmaXh0dXJlc1BhdGgsICdmaWxlLnRleCcpXG4gICAgICBjb25zdCBwYXJzZXIgPSBuZXcgTWFnaWNQYXJzZXIoZmlsZVBhdGgpXG4gICAgICBjb25zdCByZXN1bHQgPSBwYXJzZXIucGFyc2UoKVxuXG4gICAgICBleHBlY3QocmVzdWx0KS50b0VxdWFsKHt9KVxuICAgIH0pXG5cbiAgICBpdCgncmV0dXJucyBwYXRoIHRvIHJvb3QgZmlsZSB3aGVuIGZpbGUgY29udGFpbnMgbWFnaWMgcm9vdCBjb21tZW50JywgKCkgPT4ge1xuICAgICAgY29uc3QgZmlsZVBhdGggPSBwYXRoLmpvaW4oZml4dHVyZXNQYXRoLCAnbWFnaWMtY29tbWVudHMnLCAncm9vdC1jb21tZW50LnRleCcpXG4gICAgICBjb25zdCBwYXJzZXIgPSBuZXcgTWFnaWNQYXJzZXIoZmlsZVBhdGgpXG4gICAgICBjb25zdCByZXN1bHQgPSBwYXJzZXIucGFyc2UoKVxuXG4gICAgICBleHBlY3QocmVzdWx0KS50b0VxdWFsKHtcbiAgICAgICAgJ3Jvb3QnOiAnLi4vZmlsZS50ZXgnXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgncmV0dXJucyBwYXRoIHRvIHJvb3QgZmlsZSB3aGVuIGZpbGUgY29udGFpbnMgbWFnaWMgcm9vdCBjb21tZW50IHdoZW4gbWFnaWMgY29tbWVudCBpcyBub3Qgb24gdGhlIGZpcnN0IGxpbmUnLCAoKSA9PiB7XG4gICAgICBjb25zdCBmaWxlUGF0aCA9IHBhdGguam9pbihmaXh0dXJlc1BhdGgsICdtYWdpYy1jb21tZW50cycsICdub3QtZmlyc3QtbGluZS50ZXgnKVxuICAgICAgY29uc3QgcGFyc2VyID0gbmV3IE1hZ2ljUGFyc2VyKGZpbGVQYXRoKVxuICAgICAgY29uc3QgcmVzdWx0ID0gcGFyc2VyLnBhcnNlKClcblxuICAgICAgZXhwZWN0KHJlc3VsdCkudG9FcXVhbCh7XG4gICAgICAgICdyb290JzogJy4uL2ZpbGUudGV4J1xuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ2hhbmRsZXMgbWFnaWMgY29tbWVudHMgd2l0aG91dCBvcHRpb25hbCB3aGl0ZXNwYWNlJywgKCkgPT4ge1xuICAgICAgY29uc3QgZmlsZVBhdGggPSBwYXRoLmpvaW4oZml4dHVyZXNQYXRoLCAnbWFnaWMtY29tbWVudHMnLCAnbm8td2hpdGVzcGFjZS50ZXgnKVxuICAgICAgY29uc3QgcGFyc2VyID0gbmV3IE1hZ2ljUGFyc2VyKGZpbGVQYXRoKVxuICAgICAgY29uc3QgcmVzdWx0ID0gcGFyc2VyLnBhcnNlKClcblxuICAgICAgZXhwZWN0KHJlc3VsdCkubm90LnRvRXF1YWwoe30pXG4gICAgfSlcbiAgICBpdCgnZGV0ZWN0cyBtdWx0aXBsZSBvYmplY3QgaW5mb3JtYXRpb24gd2hlbiBtdWx0aXBsZSBtYWdpY2UgY29tbWVudHMgYXJlIGRlZmluZWQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBmaWxlUGF0aCA9IHBhdGguam9pbihmaXh0dXJlc1BhdGgsICdtYWdpYy1jb21tZW50cycsICdtdWx0aXBsZS1tYWdpYy1jb21tZW50cy50ZXgnKVxuICAgICAgY29uc3QgcGFyc2VyID0gbmV3IE1hZ2ljUGFyc2VyKGZpbGVQYXRoKVxuICAgICAgY29uc3QgcmVzdWx0ID0gcGFyc2VyLnBhcnNlKClcblxuICAgICAgZXhwZWN0KHJlc3VsdCkudG9FcXVhbCh7XG4gICAgICAgICdyb290JzogJy4uL2ZpbGUudGV4JyxcbiAgICAgICAgJ3Byb2dyYW0nOiAncGRmbGF0ZXgnXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG59KVxuIl19
//# sourceURL=/home/cin_chalic/.atom/packages/latex/spec/parsers/magic-parser-spec.js
