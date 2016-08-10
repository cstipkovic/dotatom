function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _srcLinterJscs = require('../src/linter-jscs');

var _srcLinterJscs2 = _interopRequireDefault(_srcLinterJscs);

var _temp = require('temp');

var _temp2 = _interopRequireDefault(_temp);

var _path = require('path');

var path = _interopRequireWildcard(_path);

'use babel';

var sloppyPath = path.join(__dirname, 'files', 'sloppy.js');
var sloppyHTMLPath = path.join(__dirname, 'files', 'sloppy.html');
var goodPath = path.join(__dirname, 'files', 'good.js');
var emptyPath = path.join(__dirname, 'files', 'empty.js');
// const lflPath = path.join(__dirname, 'files', 'long-file-line.js');

describe('The jscs provider for Linter', function () {
  var lint = _srcLinterJscs2['default'].provideLinter().lint;

  beforeEach(function () {
    waitsForPromise(function () {
      return atom.packages.activatePackage('linter-jscs');
    });
    waitsForPromise(function () {
      return atom.packages.activatePackage('language-javascript');
    });
    waitsForPromise(function () {
      return atom.workspace.open(sloppyPath);
    });
  });

  it('should be in the packages list', function () {
    return expect(atom.packages.isPackageLoaded('linter-jscs')).toBe(true);
  });

  it('should be an active package', function () {
    return expect(atom.packages.isPackageActive('linter-jscs')).toBe(true);
  });

  describe('checks sloppy.js and', function () {
    var editor = null;
    beforeEach(function () {
      waitsForPromise(function () {
        return atom.workspace.open(sloppyPath).then(function (openEditor) {
          editor = openEditor;
        });
      });
    });

    it('finds at least one message', function () {
      waitsForPromise(function () {
        return lint(editor).then(function (messages) {
          expect(messages.length).toBeGreaterThan(0);
        });
      });
    });

    it('verifies the first message', function () {
      var message = '<span class=\'badge badge-flexible\'>requireTrailingComma</span>' + ' Missing comma before closing curly brace';
      waitsForPromise(function () {
        return lint(editor).then(function (messages) {
          expect(messages[0].type).toBe('error');
          expect(messages[0].text).not.toBeDefined();
          expect(messages[0].html).toBe(message);
          expect(messages[0].filePath).toBe(sloppyPath);
          expect(messages[0].range).toEqual([[2, 9], [2, 11]]);
        });
      });
    });
  });

  it('finds nothing wrong with an empty file', function () {
    waitsForPromise(function () {
      return atom.workspace.open(emptyPath).then(function (editor) {
        return lint(editor).then(function (messages) {
          expect(messages.length).toBe(0);
        });
      });
    });
  });

  it('finds nothing wrong with a valid file', function () {
    waitsForPromise(function () {
      return atom.workspace.open(goodPath).then(function (editor) {
        return lint(editor).then(function (messages) {
          expect(messages.length).toBe(0);
        });
      });
    });
  });

  describe('checks sloppy.html and', function () {
    var editor = null;
    beforeEach(function () {
      waitsForPromise(function () {
        return atom.workspace.open(sloppyHTMLPath).then(function (openEditor) {
          editor = openEditor;
        });
      });
    });

    it('finds at least one message', function () {
      waitsForPromise(function () {
        return lint(editor).then(function (messages) {
          expect(messages.length).toBeGreaterThan(0);
        });
      });
    });

    it('verifies the first message', function () {
      var message = '<span class=\'badge badge-flexible\'>requireTrailingComma</span> ' + 'Missing comma before closing curly brace';
      waitsForPromise(function () {
        return lint(editor).then(function (messages) {
          expect(messages[0].type).toBe('error');
          expect(messages[0].text).not.toBeDefined();
          expect(messages[0].html).toBe(message);
          expect(messages[0].filePath).toBe(sloppyHTMLPath);
          expect(messages[0].range).toEqual([[11, 15], [11, 17]]);
        });
      });
    });
  });

  describe('provides override options and', function () {
    var editor = null;
    beforeEach(function () {
      waitsForPromise(function () {
        return atom.workspace.open(sloppyPath).then(function (openEditor) {
          editor = openEditor;
        });
      });
    });

    it('should return no errors if the file is excluded', function () {
      waitsForPromise(function () {
        return lint(editor, {}, { excludeFiles: ['sloppy.js'] }).then(function (messages) {
          expect(messages.length).toBe(0);
        });
      });
    });

    it('should return no errors if `requireTrailingComma` is set to null', function () {
      waitsForPromise(function () {
        return lint(editor, {}, { requireTrailingComma: null }).then(function (messages) {
          expect(messages.length).toBe(0);
        });
      });
    });
  });

  describe('save', function () {
    var editor = null;
    beforeEach(function () {
      waitsForPromise(function () {
        return atom.workspace.open(sloppyPath).then(function (openEditor) {
          editor = openEditor;
        });
      });
    });

    it('should fix the file', function () {
      waitsForPromise(function () {
        var tempFile = _temp2['default'].openSync().path;
        editor.saveAs(tempFile);

        return lint(editor, {}, {}, true).then(function (messages) {
          expect(messages.length).toBe(0);
        });
      });
    });
  });

  describe('commands', function () {
    describe('fix command', function () {
      it('fixes sloppy.js', function () {
        var editor = undefined;

        waitsForPromise(function () {
          return atom.workspace.open(sloppyPath).then(function (openEditor) {
            editor = openEditor;
          });
        });

        waitsForPromise(function () {
          var editorView = atom.views.getView(editor);
          atom.commands.dispatch(editorView, 'linter-jscs:fix-file');
          return lint(editor).then(function (messages) {
            expect(messages.length).toBe(0);
          });
        });
      });
    });
  });

  /*
  // FIXME: The custom rule needs to be updated for `jscs` v3!
    describe('custom rules', () => {
      let editor = null;
      beforeEach(() => {
        waitsForPromise(() =>
          atom.workspace.open(lflPath).then(openEditor => {
            editor = openEditor;
          })
        );
      });
  
      it('should throw error for empty function call', () => {
        const config = {
          additionalRules: [
            path.join('.', 'spec', 'rules', '*.js'),
          ],
          lineLength: 40,
        };
        const message = '<span class=\'badge badge-flexible\'>lineLength</span> ' +
          'Line must be at most 40 characters';
        waitsForPromise(() =>
          lint(editor, {}, config).then(messages => {
            expect(messages.length).toBe(1);
            expect(messages[0].html).toBe(message);
          })
        );
      });
    });
  */
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGludGVyLWpzY3Mvc3BlYy9saW50ZXItanNjcy1zcGVjLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7NkJBRW1CLG9CQUFvQjs7OztvQkFDdEIsTUFBTTs7OztvQkFDRCxNQUFNOztJQUFoQixJQUFJOztBQUpoQixXQUFXLENBQUM7O0FBTVosSUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsT0FBTyxFQUFFLFdBQVcsQ0FBQyxDQUFDO0FBQzlELElBQU0sY0FBYyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRSxhQUFhLENBQUMsQ0FBQztBQUNwRSxJQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFDMUQsSUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsT0FBTyxFQUFFLFVBQVUsQ0FBQyxDQUFDOzs7QUFHNUQsUUFBUSxDQUFDLDhCQUE4QixFQUFFLFlBQU07QUFDN0MsTUFBTSxJQUFJLEdBQUcsMkJBQU8sYUFBYSxFQUFFLENBQUMsSUFBSSxDQUFDOztBQUV6QyxZQUFVLENBQUMsWUFBTTtBQUNmLG1CQUFlLENBQUM7YUFDZCxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxhQUFhLENBQUM7S0FBQSxDQUM3QyxDQUFDO0FBQ0YsbUJBQWUsQ0FBQzthQUNkLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLHFCQUFxQixDQUFDO0tBQUEsQ0FDckQsQ0FBQztBQUNGLG1CQUFlLENBQUM7YUFDZCxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUM7S0FBQSxDQUNoQyxDQUFDO0dBQ0gsQ0FBQyxDQUFDOztBQUVILElBQUUsQ0FBQyxnQ0FBZ0MsRUFBRTtXQUNuQyxNQUFNLENBQUMs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LENBQUMsYUFBYSxFQUFFLFlBQU07QUFDNUIsUUFBRSxDQUFDLGlCQUFpQixFQUFFLFlBQU07QUFDMUIsWUFBSSxNQUFNLFlBQUEsQ0FBQzs7QUFFWCx1QkFBZSxDQUFDO2lCQUNkLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFBLFVBQVUsRUFBSTtBQUNqRCxrQkFBTSxHQUFHLFVBQVUsQ0FBQztXQUNyQixDQUFDO1NBQUEsQ0FDSCxDQUFDOztBQUVGLHVCQUFlLENBQUMsWUFBTTtBQUNwQixjQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUM5QyxjQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxVQUFVLEVBQUUsc0JBQXNCLENBQUMsQ0FBQztBQUMzRCxpQkFBTyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUEsUUFBUSxFQUFJO0FBQ25DLGtCQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztXQUNqQyxDQUFDLENBQUM7U0FDSixDQUFDLENBQUM7T0FDSixDQUFDLENBQUM7S0FDSixDQUFDLENBQUM7R0FDSixDQUFDLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0NBZ0NKLENBQUMsQ0FBQyIsImZpbGUiOiIvaG9tZS9jaW5fY2hhbGljLy5hdG9tL3BhY2thZ2VzL2xpbnRlci1qc2NzL3NwZWMvbGludGVyLWpzY3Mtc3BlYy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQgbGludGVyIGZyb20gJy4uL3NyYy9saW50ZXItanNjcyc7XG5pbXBvcnQgdGVtcCBmcm9tICd0ZW1wJztcbmltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5cbmNvbnN0IHNsb3BweVBhdGggPSBwYXRoLmpvaW4oX19kaXJuYW1lLCAnZmlsZXMnLCAnc2xvcHB5LmpzJyk7XG5jb25zdCBzbG9wcHlIVE1MUGF0aCA9IHBhdGguam9pbihfX2Rpcm5hbWUsICdmaWxlcycsICdzbG9wcHkuaHRtbCcpO1xuY29uc3QgZ29vZFBhdGggPSBwYXRoLmpvaW4oX19kaXJuYW1lLCAnZmlsZXMnLCAnZ29vZC5qcycpO1xuY29uc3QgZW1wdHlQYXRoID0gcGF0aC5qb2luKF9fZGlybmFtZSwgJ2ZpbGVzJywgJ2VtcHR5LmpzJyk7XG4vLyBjb25zdCBsZmxQYXRoID0gcGF0aC5qb2luKF9fZGlybmFtZSwgJ2ZpbGVzJywgJ2xvbmctZmlsZS1saW5lLmpzJyk7XG5cbmRlc2NyaWJlKCdUaGUganNjcyBwcm92aWRlciBmb3IgTGludGVyJywgKCkgPT4ge1xuICBjb25zdCBsaW50ID0gbGludGVyLnByb3ZpZGVMaW50ZXIoKS5saW50O1xuXG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHdhaXRzRm9yUHJvbWlzZSgoKSA9PlxuICAgICAgYXRvbS5wYWNrYWdlcy5hY3RpdmF0ZVBhY2thZ2UoJ2xpbnRlci1qc2NzJylcbiAgICApO1xuICAgIHdhaXRzRm9yUHJvbWlzZSgoKSA9PlxuICAgICAgYXRvbS5wYWNrYWdlcy5hY3RpdmF0ZVBhY2thZ2UoJ2xhbmd1YWdlLWphdmFzY3JpcHQnKVxuICAgICk7XG4gICAgd2FpdHNGb3JQcm9taXNlKCgpID0+XG4gICAgICBhdG9tLndvcmtzcGFjZS5vcGVuKHNsb3BweVBhdGgpXG4gICAgKTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCBiZSBpbiB0aGUgcGFja2FnZXMgbGlzdCcsICgpID0+XG4gICAgZXhwZWN0KGF0b20ucGFja2FnZXMuaXNQYWNrYWdlTG9hZGVkKCdsaW50ZXItanNjcycpKS50b0JlKHRydWUpXG4gICk7XG5cbiAgaXQoJ3Nob3VsZCBiZSBhbiBhY3RpdmUgcGFja2FnZScsICgpID0+XG4gICAgZXhwZWN0KGF0b20ucGFja2FnZXMuaXNQYWNrYWdlQWN0aXZlKCdsaW50ZXItanNjcycpKS50b0JlKHRydWUpXG4gICk7XG5cbiAgZGVzY3JpYmUoJ2NoZWNrcyBzbG9wcHkuanMgYW5kJywgKCkgPT4ge1xuICAgIGxldCBlZGl0b3IgPSBudWxsO1xuICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgd2FpdHNGb3JQcm9taXNlKCgpID0+XG4gICAgICAgIGF0b20ud29ya3NwYWNlLm9wZW4oc2xvcHB5UGF0aCkudGhlbihvcGVuRWRpdG9yID0+IHtcbiAgICAgICAgICBlZGl0b3IgPSBvcGVuRWRpdG9yO1xuICAgICAgICB9KVxuICAgICAgKTtcbiAgICB9KTtcblxuICAgIGl0KCdmaW5kcyBhdCBsZWFzdCBvbmUgbWVzc2FnZScsICgpID0+IHtcbiAgICAgIHdhaXRzRm9yUHJvbWlzZSgoKSA9PlxuICAgICAgICBsaW50KGVkaXRvcikudGhlbihtZXNzYWdlcyA9PiB7XG4gICAgICAgICAgZXhwZWN0KG1lc3NhZ2VzLmxlbmd0aCkudG9CZUdyZWF0ZXJUaGFuKDApO1xuICAgICAgICB9KVxuICAgICAgKTtcbiAgICB9KTtcblxuICAgIGl0KCd2ZXJpZmllcyB0aGUgZmlyc3QgbWVzc2FnZScsICgpID0+IHtcbiAgICAgIGNvbnN0IG1lc3NhZ2UgPSAnPHNwYW4gY2xhc3M9XFwnYmFkZ2UgYmFkZ2UtZmxleGlibGVcXCc+cmVxdWlyZVRyYWlsaW5nQ29tbWE8L3NwYW4+JyArXG4gICAgICAgICcgTWlzc2luZyBjb21tYSBiZWZvcmUgY2xvc2luZyBjdXJseSBicmFjZSc7XG4gICAgICB3YWl0c0ZvclByb21pc2UoKCkgPT5cbiAgICAgICAgbGludChlZGl0b3IpLnRoZW4obWVzc2FnZXMgPT4ge1xuICAgICAgICAgIGV4cGVjdChtZXNzYWdlc1swXS50eXBlKS50b0JlKCdlcnJvcicpO1xuICAgICAgICAgIGV4cGVjdChtZXNzYWdlc1swXS50ZXh0KS5ub3QudG9CZURlZmluZWQoKTtcbiAgICAgICAgICBleHBlY3QobWVzc2FnZXNbMF0uaHRtbCkudG9CZShtZXNzYWdlKTtcbiAgICAgICAgICBleHBlY3QobWVzc2FnZXNbMF0uZmlsZVBhdGgpLnRvQmUoc2xvcHB5UGF0aCk7XG4gICAgICAgICAgZXhwZWN0KG1lc3NhZ2VzWzBdLnJhbmdlKS50b0VxdWFsKFtbMiwgOV0sIFsyLCAxMV1dKTtcbiAgICAgICAgfSlcbiAgICAgICk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGl0KCdmaW5kcyBub3RoaW5nIHdyb25nIHdpdGggYW4gZW1wdHkgZmlsZScsICgpID0+IHtcbiAgICB3YWl0c0ZvclByb21pc2UoKCkgPT5cbiAgICAgIGF0b20ud29ya3NwYWNlLm9wZW4oZW1wdHlQYXRoKS50aGVuKGVkaXRvciA9PlxuICAgICAgICBsaW50KGVkaXRvcikudGhlbihtZXNzYWdlcyA9PiB7XG4gICAgICAgICAgZXhwZWN0KG1lc3NhZ2VzLmxlbmd0aCkudG9CZSgwKTtcbiAgICAgICAgfSlcbiAgICAgIClcbiAgICApO1xuICB9KTtcblxuICBpdCgnZmluZHMgbm90aGluZyB3cm9uZyB3aXRoIGEgdmFsaWQgZmlsZScsICgpID0+IHtcbiAgICB3YWl0c0ZvclByb21pc2UoKCkgPT5cbiAgICAgIGF0b20ud29ya3NwYWNlLm9wZW4oZ29vZFBhdGgpLnRoZW4oZWRpdG9yID0+XG4gICAgICAgIGxpbnQoZWRpdG9yKS50aGVuKG1lc3NhZ2VzID0+IHtcbiAgICAgICAgICBleHBlY3QobWVzc2FnZXMubGVuZ3RoKS50b0JlKDApO1xuICAgICAgICB9KVxuICAgICAgKVxuICAgICk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdjaGVja3Mgc2xvcHB5Lmh0bWwgYW5kJywgKCkgPT4ge1xuICAgIGxldCBlZGl0b3IgPSBudWxsO1xuICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgd2FpdHNGb3JQcm9taXNlKCgpID0+XG4gICAgICAgIGF0b20ud29ya3NwYWNlLm9wZW4oc2xvcHB5SFRNTFBhdGgpLnRoZW4ob3BlbkVkaXRvciA9PiB7XG4gICAgICAgICAgZWRpdG9yID0gb3BlbkVkaXRvcjtcbiAgICAgICAgfSlcbiAgICAgICk7XG4gICAgfSk7XG5cbiAgICBpdCgnZmluZHMgYXQgbGVhc3Qgb25lIG1lc3NhZ2UnLCAoKSA9PiB7XG4gICAgICB3YWl0c0ZvclByb21pc2UoKCkgPT5cbiAgICAgICAgbGludChlZGl0b3IpLnRoZW4obWVzc2FnZXMgPT4ge1xuICAgICAgICAgIGV4cGVjdChtZXNzYWdlcy5sZW5ndGgpLnRvQmVHcmVhdGVyVGhhbigwKTtcbiAgICAgICAgfSlcbiAgICAgICk7XG4gICAgfSk7XG5cbiAgICBpdCgndmVyaWZpZXMgdGhlIGZpcnN0IG1lc3NhZ2UnLCAoKSA9PiB7XG4gICAgICBjb25zdCBtZXNzYWdlID0gJzxzcGFuIGNsYXNzPVxcJ2JhZGdlIGJhZGdlLWZsZXhpYmxlXFwnPnJlcXVpcmVUcmFpbGluZ0NvbW1hPC9zcGFuPiAnICtcbiAgICAgICAgJ01pc3NpbmcgY29tbWEgYmVmb3JlIGNsb3NpbmcgY3VybHkgYnJhY2UnO1xuICAgICAgd2FpdHNGb3JQcm9taXNlKCgpID0+XG4gICAgICAgIGxpbnQoZWRpdG9yKS50aGVuKG1lc3NhZ2VzID0+IHtcbiAgICAgICAgICBleHBlY3QobWVzc2FnZXNbMF0udHlwZSkudG9CZSgnZXJyb3InKTtcbiAgICAgICAgICBleHBlY3QobWVzc2FnZXNbMF0udGV4dCkubm90LnRvQmVEZWZpbmVkKCk7XG4gICAgICAgICAgZXhwZWN0KG1lc3NhZ2VzWzBdLmh0bWwpLnRvQmUobWVzc2FnZSk7XG4gICAgICAgICAgZXhwZWN0KG1lc3NhZ2VzWzBdLmZpbGVQYXRoKS50b0JlKHNsb3BweUhUTUxQYXRoKTtcbiAgICAgICAgICBleHBlY3QobWVzc2FnZXNbMF0ucmFuZ2UpLnRvRXF1YWwoW1sxMSwgMTVdLCBbMTEsIDE3XV0pO1xuICAgICAgICB9KVxuICAgICAgKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3Byb3ZpZGVzIG92ZXJyaWRlIG9wdGlvbnMgYW5kJywgKCkgPT4ge1xuICAgIGxldCBlZGl0b3IgPSBudWxsO1xuICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgd2FpdHNGb3JQcm9taXNlKCgpID0+XG4gICAgICAgIGF0b20ud29ya3NwYWNlLm9wZW4oc2xvcHB5UGF0aCkudGhlbihvcGVuRWRpdG9yID0+IHtcbiAgICAgICAgICBlZGl0b3IgPSBvcGVuRWRpdG9yO1xuICAgICAgICB9KVxuICAgICAgKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIG5vIGVycm9ycyBpZiB0aGUgZmlsZSBpcyBleGNsdWRlZCcsICgpID0+IHtcbiAgICAgIHdhaXRzRm9yUHJvbWlzZSgoKSA9PlxuICAgICAgICBsaW50KGVkaXRvciwge30sIHsgZXhjbHVkZUZpbGVzOiBbJ3Nsb3BweS5qcyddIH0pLnRoZW4obWVzc2FnZXMgPT4ge1xuICAgICAgICAgIGV4cGVjdChtZXNzYWdlcy5sZW5ndGgpLnRvQmUoMCk7XG4gICAgICAgIH0pXG4gICAgICApO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gbm8gZXJyb3JzIGlmIGByZXF1aXJlVHJhaWxpbmdDb21tYWAgaXMgc2V0IHRvIG51bGwnLCAoKSA9PiB7XG4gICAgICB3YWl0c0ZvclByb21pc2UoKCkgPT5cbiAgICAgICAgbGludChlZGl0b3IsIHt9LCB7IHJlcXVpcmVUcmFpbGluZ0NvbW1hOiBudWxsIH0pLnRoZW4obWVzc2FnZXMgPT4ge1xuICAgICAgICAgIGV4cGVjdChtZXNzYWdlcy5sZW5ndGgpLnRvQmUoMCk7XG4gICAgICAgIH0pXG4gICAgICApO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnc2F2ZScsICgpID0+IHtcbiAgICBsZXQgZWRpdG9yID0gbnVsbDtcbiAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgIHdhaXRzRm9yUHJvbWlzZSgoKSA9PlxuICAgICAgICBhdG9tLndvcmtzcGFjZS5vcGVuKHNsb3BweVBhdGgpLnRoZW4ob3BlbkVkaXRvciA9PiB7XG4gICAgICAgICAgZWRpdG9yID0gb3BlbkVkaXRvcjtcbiAgICAgICAgfSlcbiAgICAgICk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIGZpeCB0aGUgZmlsZScsICgpID0+IHtcbiAgICAgIHdhaXRzRm9yUHJvbWlzZSgoKSA9PiB7XG4gICAgICAgIGNvbnN0IHRlbXBGaWxlID0gdGVtcC5vcGVuU3luYygpLnBhdGg7XG4gICAgICAgIGVkaXRvci5zYXZlQXModGVtcEZpbGUpO1xuXG4gICAgICAgIHJldHVybiBsaW50KGVkaXRvciwge30sIHsgfSwgdHJ1ZSkudGhlbihtZXNzYWdlcyA9PiB7XG4gICAgICAgICAgZXhwZWN0KG1lc3NhZ2VzLmxlbmd0aCkudG9CZSgwKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2NvbW1hbmRzJywgKCkgPT4ge1xuICAgIGRlc2NyaWJlKCdmaXggY29tbWFuZCcsICgpID0+IHtcbiAgICAgIGl0KCdmaXhlcyBzbG9wcHkuanMnLCAoKSA9PiB7XG4gICAgICAgIGxldCBlZGl0b3I7XG5cbiAgICAgICAgd2FpdHNGb3JQcm9taXNlKCgpID0+XG4gICAgICAgICAgYXRvbS53b3Jrc3BhY2Uub3BlbihzbG9wcHlQYXRoKS50aGVuKG9wZW5FZGl0b3IgPT4ge1xuICAgICAgICAgICAgZWRpdG9yID0gb3BlbkVkaXRvcjtcbiAgICAgICAgICB9KVxuICAgICAgICApO1xuXG4gICAgICAgIHdhaXRzRm9yUHJvbWlzZSgoKSA9PiB7XG4gICAgICAgICAgY29uc3QgZWRpdG9yVmlldyA9IGF0b20udmlld3MuZ2V0VmlldyhlZGl0b3IpO1xuICAgICAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2goZWRpdG9yVmlldywgJ2xpbnRlci1qc2NzOmZpeC1maWxlJyk7XG4gICAgICAgICAgcmV0dXJuIGxpbnQoZWRpdG9yKS50aGVuKG1lc3NhZ2VzID0+IHtcbiAgICAgICAgICAgIGV4cGVjdChtZXNzYWdlcy5sZW5ndGgpLnRvQmUoMCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4vKlxuLy8gRklYTUU6IFRoZSBjdXN0b20gcnVsZSBuZWVkcyB0byBiZSB1cGRhdGVkIGZvciBganNjc2AgdjMhXG4gIGRlc2NyaWJlKCdjdXN0b20gcnVsZXMnLCAoKSA9PiB7XG4gICAgbGV0IGVkaXRvciA9IG51bGw7XG4gICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICB3YWl0c0ZvclByb21pc2UoKCkgPT5cbiAgICAgICAgYXRvbS53b3Jrc3BhY2Uub3BlbihsZmxQYXRoKS50aGVuKG9wZW5FZGl0b3IgPT4ge1xuICAgICAgICAgIGVkaXRvciA9IG9wZW5FZGl0b3I7XG4gICAgICAgIH0pXG4gICAgICApO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCB0aHJvdyBlcnJvciBmb3IgZW1wdHkgZnVuY3Rpb24gY2FsbCcsICgpID0+IHtcbiAgICAgIGNvbnN0IGNvbmZpZyA9IHtcbiAgICAgICAgYWRkaXRpb25hbFJ1bGVzOiBbXG4gICAgICAgICAgcGF0aC5qb2luKCcuJywgJ3NwZWMnLCAncnVsZXMnLCAnKi5qcycpLFxuICAgICAgICBdLFxuICAgICAgICBsaW5lTGVuZ3RoOiA0MCxcbiAgICAgIH07XG4gICAgICBjb25zdCBtZXNzYWdlID0gJzxzcGFuIGNsYXNzPVxcJ2JhZGdlIGJhZGdlLWZsZXhpYmxlXFwnPmxpbmVMZW5ndGg8L3NwYW4+ICcgK1xuICAgICAgICAnTGluZSBtdXN0IGJlIGF0IG1vc3QgNDAgY2hhcmFjdGVycyc7XG4gICAgICB3YWl0c0ZvclByb21pc2UoKCkgPT5cbiAgICAgICAgbGludChlZGl0b3IsIHt9LCBjb25maWcpLnRoZW4obWVzc2FnZXMgPT4ge1xuICAgICAgICAgIGV4cGVjdChtZXNzYWdlcy5sZW5ndGgpLnRvQmUoMSk7XG4gICAgICAgICAgZXhwZWN0KG1lc3NhZ2VzWzBdLmh0bWwpLnRvQmUobWVzc2FnZSk7XG4gICAgICAgIH0pXG4gICAgICApO1xuICAgIH0pO1xuICB9KTtcbiovXG59KTtcbiJdfQ==
//# sourceURL=/home/cin_chalic/.atom/packages/linter-jscs/spec/linter-jscs-spec.js
