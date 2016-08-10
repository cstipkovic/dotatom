function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _specHelpers = require('./spec-helpers');

var _specHelpers2 = _interopRequireDefault(_specHelpers);

var _fsPlus = require('fs-plus');

var _fsPlus2 = _interopRequireDefault(_fsPlus);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _libComposer = require('../lib/composer');

var _libComposer2 = _interopRequireDefault(_libComposer);

'use babel';

describe('Composer', function () {
  var composer = undefined;

  beforeEach(function () {
    composer = new _libComposer2['default']();
  });

  describe('build', function () {
    var editor = undefined,
        builder = undefined;

    function initializeSpies(filePath) {
      var statusCode = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

      editor = jasmine.createSpyObj('MockEditor', ['save', 'isModified']);
      spyOn(composer, 'resolveRootFilePath').andReturn(filePath);
      spyOn(composer, 'getEditorDetails').andReturn({
        editor: editor,
        filePath: filePath
      });

      builder = jasmine.createSpyObj('MockBuilder', ['run', 'constructArgs', 'parseLogFile']);
      builder.run.andCallFake(function () {
        switch (statusCode) {
          case 0:
            {
              return Promise.resolve(statusCode);
            }
        }

        return Promise.reject(statusCode);
      });
      spyOn(latex, 'getBuilder').andReturn(builder);
    }

    beforeEach(function () {
      spyOn(composer, 'showResult').andReturn();
      spyOn(composer, 'showError').andReturn();
    });

    it('does nothing for new, unsaved files', function () {
      initializeSpies(null);

      var result = 'aaaaaaaaaaaa';
      waitsForPromise(function () {
        return composer.build()['catch'](function (r) {
          return result = r;
        });
      });

      runs(function () {
        expect(result).toBe(false);
        expect(composer.showResult).not.toHaveBeenCalled();
        expect(composer.showError).not.toHaveBeenCalled();
      });
    });

    it('does nothing for unsupported file extensions', function () {
      initializeSpies('foo.bar');

      var result = undefined;
      waitsForPromise(function () {
        return composer.build()['catch'](function (r) {
          return result = r;
        });
      });

      runs(function () {
        expect(result).toBe(false);
        expect(composer.showResult).not.toHaveBeenCalled();
        expect(composer.showError).not.toHaveBeenCalled();
      });
    });

    it('saves the file before building, if modified', function () {
      initializeSpies('file.tex');
      editor.isModified.andReturn(true);

      builder.parseLogFile.andReturn({
        outputFilePath: 'file.pdf',
        errors: [],
        warnings: []
      });

      waitsForPromise(function () {
        return composer.build();
      });

      runs(function () {
        expect(editor.isModified).toHaveBeenCalled();
        expect(editor.save).toHaveBeenCalled();
      });
    });

    it('invokes `showResult` after a successful build, with expected log parsing result', function () {
      var result = {
        outputFilePath: 'file.pdf',
        errors: [],
        warnings: []
      };

      initializeSpies('file.tex');
      builder.parseLogFile.andReturn(result);

      waitsForPromise(function () {
        return composer.build();
      });

      runs(function () {
        expect(composer.showResult).toHaveBeenCalledWith(result);
      });
    });

    it('treats missing output file data in log file as an error', function () {
      initializeSpies('file.tex');

      builder.parseLogFile.andReturn({
        outputFilePath: null,
        errors: [],
        warnings: []
      });

      waitsForPromise(function () {
        return composer.build()['catch'](function (r) {
          return r;
        });
      });

      runs(function () {
        expect(composer.showError).toHaveBeenCalled();
      });
    });

    it('treats missing result from parser as an error', function () {
      initializeSpies('file.tex');
      builder.parseLogFile.andReturn(null);

      waitsForPromise(function () {
        return composer.build()['catch'](function (r) {
          return r;
        });
      });

      runs(function () {
        expect(composer.showError).toHaveBeenCalled();
      });
    });

    it('handles active item not being a text editor', function () {
      spyOn(atom.workspace, 'getActiveTextEditor').andReturn();
      spyOn(composer, 'getEditorDetails').andCallThrough();

      waitsForPromise(function () {
        return composer.build()['catch'](function (r) {
          return r;
        });
      });

      runs(function () {
        expect(composer.getEditorDetails).toHaveBeenCalled();
      });
    });
  });

  describe('clean', function () {
    var extensions = ['.bar', '.baz', '.quux'];

    function fakeFilePaths(filePath) {
      var filePathSansExtension = filePath.substring(0, filePath.lastIndexOf('.'));
      return extensions.map(function (ext) {
        return filePathSansExtension + ext;
      });
    }

    function initializeSpies(filePath) {
      spyOn(composer, 'getEditorDetails').andReturn({ filePath: filePath });
      spyOn(composer, 'resolveRootFilePath').andReturn(filePath);
    }

    beforeEach(function () {
      spyOn(_fsPlus2['default'], 'remove').andCallThrough();
      _specHelpers2['default'].spyOnConfig('latex.cleanExtensions', extensions);
    });

    it('deletes all files for the current tex document when output has not been redirected', function () {
      var filePath = _path2['default'].normalize('/a/foo.tex');
      var filesToDelete = fakeFilePaths(filePath);
      initializeSpies(filePath);

      var candidatePaths = undefined;
      waitsForPromise(function () {
        return composer.clean().then(function (resolutions) {
          candidatePaths = _lodash2['default'].pluck(resolutions, 'filePath');
        });
      });

      runs(function () {
        expect(candidatePaths).toEqual(filesToDelete);
      });
    });

    it('stops immidiately if the file is not a TeX document', function () {
      var filePath = 'foo.bar';
      initializeSpies(filePath, []);

      waitsForPromise(function () {
        return composer.clean()['catch'](function (r) {
          return r;
        });
      });

      runs(function () {
        expect(composer.resolveRootFilePath).not.toHaveBeenCalled();
        expect(_fsPlus2['default'].remove).not.toHaveBeenCalled();
      });
    });
  });

  describe('shouldMoveResult', function () {
    it('should return false when using neither an output directory, nor the move option', function () {
      _specHelpers2['default'].spyOnConfig('latex.outputDirectory', '');
      _specHelpers2['default'].spyOnConfig('latex.moveResultToSourceDirectory', false);

      expect(composer.shouldMoveResult()).toBe(false);
    });

    it('should return false when not using an output directory, but using the move option', function () {
      _specHelpers2['default'].spyOnConfig('latex.outputDirectory', '');
      _specHelpers2['default'].spyOnConfig('latex.moveResultToSourceDirectory', true);

      expect(composer.shouldMoveResult()).toBe(false);
    });

    it('should return false when not using the move option, but using an output directory', function () {
      _specHelpers2['default'].spyOnConfig('latex.outputDirectory', 'baz');
      _specHelpers2['default'].spyOnConfig('latex.moveResultToSourceDirectory', false);

      expect(composer.shouldMoveResult()).toBe(false);
    });

    it('should return true when using both an output directory and the move option', function () {
      _specHelpers2['default'].spyOnConfig('latex.outputDirectory', 'baz');
      _specHelpers2['default'].spyOnConfig('latex.moveResultToSourceDirectory', true);

      expect(composer.shouldMoveResult()).toBe(true);
    });
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvc3BlYy9jb21wb3Nlci1zcGVjLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OzJCQUVvQixnQkFBZ0I7Ozs7c0JBQ3JCLFNBQVM7Ozs7c0JBQ1YsUUFBUTs7OztvQkFDTCxNQUFNOzs7OzJCQUNGLGlCQUFpQjs7OztBQU50QyxXQUFXLENBQUE7O0FBUVgsUUFBUSxDQUFDLFVBQVUsRUFBRSxZQUFNO0FBQ3pCLE1BQUksUUFBUSxZQUFBLENBQUE7O0FBRVosWUFBVSxDQUFDLFlBQU07QUFDZixZQUFRLEdBQUcsOEJBQWMsQ0FBQTtHQUMxQixDQUFDLENBQUE7O0FBRUYsVUFBUSxDQUFDLE9BQU8sRUFBRSxZQUFNO0FBQ3RCLFFBQUksTUFBTSxZQUFBO1FBQUUsT0FBTyxZQUFBLENBQUE7O0FBRW5CLGFBQVMsZUFBZSxDQUFFLFFBQVEsRUFBa0I7VUFBaEIsVUFBVSx5REFBRyxDQUFDOztBQUNoRCxZQUFNLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxZQUFZLEVBQUUsQ0FBQyxNQUFNLEVBQUUsWUFBWSxDQUFDLENBQUMsQ0FBQTtBQUNuRSxXQUFLLENBQUMsUUFBUSxFQUFFLHFCQUFxQixDQUFDLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFBO0FBQzFELFdBQUssQ0FBQyxRQUFRLEVBQUUsa0JBQWtCLENBQUMsQ0FBQyxTQUFTLENBQUM7QUFDNUMsY0FBTSxFQUFFLE1BQU07QUFDZCxnQkFBUSxFQUFFLFFBQVE7T0FDbkIsQ0FBQyxDQUFBOztBQUVGLGFBQU8sR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDLGFBQWEsRUFBRSxDQUFDLEtBQUssRUFBRSxlQUFlLEVBQUUsY0FBYyxDQUFDLENBQUMsQ0FBQTtBQUN2RixhQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxZQUFNO0FBQzVCLGdCQUFRLFVBQVU7QUFDaEIsZUFBSyxDQUFDO0FBQUU7QUFBRSxxQkFBTyxPQUFPLENB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L0QsWUFBTSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFBO0tBQ2hELENBQUMsQ0FBQTs7QUFFRixNQUFFLENBQUMsNEVBQTRFLEVBQUUsWUFBTTtBQUNyRiwrQkFBUSxXQUFXLENBQUMsdUJBQXVCLEVBQUUsS0FBSyxDQUFDLENBQUE7QUFDbkQsK0JBQVEsV0FBVyxDQUFDLG1DQUFtQyxFQUFFLElBQUksQ0FBQyxDQUFBOztBQUU5RCxZQUFNLENBQUMsUUFBUSxDQUFDLGdCQUFnQixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7S0FDL0MsQ0FBQyxDQUFBO0dBQ0gsQ0FBQyxDQUFBO0NBQ0gsQ0FBQyxDQUFBIiwiZmlsZSI6Ii9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvc3BlYy9jb21wb3Nlci1zcGVjLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuaW1wb3J0IGhlbHBlcnMgZnJvbSAnLi9zcGVjLWhlbHBlcnMnXG5pbXBvcnQgZnMgZnJvbSAnZnMtcGx1cydcbmltcG9ydCBfIGZyb20gJ2xvZGFzaCdcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5pbXBvcnQgQ29tcG9zZXIgZnJvbSAnLi4vbGliL2NvbXBvc2VyJ1xuXG5kZXNjcmliZSgnQ29tcG9zZXInLCAoKSA9PiB7XG4gIGxldCBjb21wb3NlclxuXG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIGNvbXBvc2VyID0gbmV3IENvbXBvc2VyKClcbiAgfSlcblxuICBkZXNjcmliZSgnYnVpbGQnLCAoKSA9PiB7XG4gICAgbGV0IGVkaXRvciwgYnVpbGRlclxuXG4gICAgZnVuY3Rpb24gaW5pdGlhbGl6ZVNwaWVzIChmaWxlUGF0aCwgc3RhdHVzQ29kZSA9IDApIHtcbiAgICAgIGVkaXRvciA9IGphc21pbmUuY3JlYXRlU3B5T2JqKCdNb2NrRWRpdG9yJywgWydzYXZlJywgJ2lzTW9kaWZpZWQnXSlcbiAgICAgIHNweU9uKGNvbXBvc2VyLCAncmVzb2x2ZVJvb3RGaWxlUGF0aCcpLmFuZFJldHVybihmaWxlUGF0aClcbiAgICAgIHNweU9uKGNvbXBvc2VyLCAnZ2V0RWRpdG9yRGV0YWlscycpLmFuZFJldHVybih7XG4gICAgICAgIGVkaXRvcjogZWRpdG9yLFxuICAgICAgICBmaWxlUGF0aDogZmlsZVBhdGhcbiAgICAgIH0pXG5cbiAgICAgIGJ1aWxkZXIgPSBqYXNtaW5lLmNyZWF0ZVNweU9iaignTW9ja0J1aWxkZXInLCBbJ3J1bicsICdjb25zdHJ1Y3RBcmdzJywgJ3BhcnNlTG9nRmlsZSddKVxuICAgICAgYnVpbGRlci5ydW4uYW5kQ2FsbEZha2UoKCkgPT4ge1xuICAgICAgICBzd2l0Y2ggKHN0YXR1c0NvZGUpIHtcbiAgICAgICAgICBjYXNlIDA6IHsgcmV0dXJuIFByb21pc2UucmVzb2x2ZShzdGF0dXNDb2RlKSB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3Qoc3RhdHVzQ29kZSlcbiAgICAgIH0pXG4gICAgICBzcHlPbihsYXRleCwgJ2dldEJ1aWxkZXInKS5hbmRSZXR1cm4oYnVpbGRlcilcbiAgICB9XG5cbiAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgIHNweU9uKGNvbXBvc2VyLCAnc2hvd1Jlc3VsdCcpLmFuZFJldHVybigpXG4gICAgICBzcHlPbihjb21wb3NlciwgJ3Nob3dFcnJvcicpLmFuZFJldHVybigpXG4gICAgfSlcblxuICAgIGl0KCdkb2VzIG5vdGhpbmcgZm9yIG5ldywgdW5zYXZlZCBmaWxlcycsICgpID0+IHtcbiAgICAgIGluaXRpYWxpemVTcGllcyhudWxsKVxuXG4gICAgICBsZXQgcmVzdWx0ID0gJ2FhYWFhYWFhYWFhYSdcbiAgICAgIHdhaXRzRm9yUHJvbWlzZSgoKSA9PiB7XG4gICAgICAgIHJldHVybiBjb21wb3Nlci5idWlsZCgpLmNhdGNoKHIgPT4gcmVzdWx0ID0gcilcbiAgICAgIH0pXG5cbiAgICAgIHJ1bnMoKCkgPT4ge1xuICAgICAgICBleHBlY3QocmVzdWx0KS50b0JlKGZhbHNlKVxuICAgICAgICBleHBlY3QoY29tcG9zZXIuc2hvd1Jlc3VsdCkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgICBleHBlY3QoY29tcG9zZXIuc2hvd0Vycm9yKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnZG9lcyBub3RoaW5nIGZvciB1bnN1cHBvcnRlZCBmaWxlIGV4dGVuc2lvbnMnLCAoKSA9PiB7XG4gICAgICBpbml0aWFsaXplU3BpZXMoJ2Zvby5iYXInKVxuXG4gICAgICBsZXQgcmVzdWx0XG4gICAgICB3YWl0c0ZvclByb21pc2UoKCkgPT4ge1xuICAgICAgICByZXR1cm4gY29tcG9zZXIuYnVpbGQoKS5jYXRjaChyID0+IHJlc3VsdCA9IHIpXG4gICAgICB9KVxuXG4gICAgICBydW5zKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHJlc3VsdCkudG9CZShmYWxzZSlcbiAgICAgICAgZXhwZWN0KGNvbXBvc2VyLnNob3dSZXN1bHQpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgICAgZXhwZWN0KGNvbXBvc2VyLnNob3dFcnJvcikubm90LnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3NhdmVzIHRoZSBmaWxlIGJlZm9yZSBidWlsZGluZywgaWYgbW9kaWZpZWQnLCAoKSA9PiB7XG4gICAgICBpbml0aWFsaXplU3BpZXMoJ2ZpbGUudGV4JylcbiAgICAgIGVkaXRvci5pc01vZGlmaWVkLmFuZFJldHVybih0cnVlKVxuXG4gICAgICBidWlsZGVyLnBhcnNlTG9nRmlsZS5hbmRSZXR1cm4oe1xuICAgICAgICBvdXRwdXRGaWxlUGF0aDogJ2ZpbGUucGRmJyxcbiAgICAgICAgZXJyb3JzOiBbXSxcbiAgICAgICAgd2FybmluZ3M6IFtdXG4gICAgICB9KVxuXG4gICAgICB3YWl0c0ZvclByb21pc2UoKCkgPT4ge1xuICAgICAgICByZXR1cm4gY29tcG9zZXIuYnVpbGQoKVxuICAgICAgfSlcblxuICAgICAgcnVucygoKSA9PiB7XG4gICAgICAgIGV4cGVjdChlZGl0b3IuaXNNb2RpZmllZCkudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICAgIGV4cGVjdChlZGl0b3Iuc2F2ZSkudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnaW52b2tlcyBgc2hvd1Jlc3VsdGAgYWZ0ZXIgYSBzdWNjZXNzZnVsIGJ1aWxkLCB3aXRoIGV4cGVjdGVkIGxvZyBwYXJzaW5nIHJlc3VsdCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IHtcbiAgICAgICAgb3V0cHV0RmlsZVBhdGg6ICdmaWxlLnBkZicsXG4gICAgICAgIGVycm9yczogW10sXG4gICAgICAgIHdhcm5pbmdzOiBbXVxuICAgICAgfVxuXG4gICAgICBpbml0aWFsaXplU3BpZXMoJ2ZpbGUudGV4JylcbiAgICAgIGJ1aWxkZXIucGFyc2VMb2dGaWxlLmFuZFJldHVybihyZXN1bHQpXG5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZSgoKSA9PiB7XG4gICAgICAgIHJldHVybiBjb21wb3Nlci5idWlsZCgpXG4gICAgICB9KVxuXG4gICAgICBydW5zKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KGNvbXBvc2VyLnNob3dSZXN1bHQpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHJlc3VsdClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCd0cmVhdHMgbWlzc2luZyBvdXRwdXQgZmlsZSBkYXRhIGluIGxvZyBmaWxlIGFzIGFuIGVycm9yJywgKCkgPT4ge1xuICAgICAgaW5pdGlhbGl6ZVNwaWVzKCdmaWxlLnRleCcpXG5cbiAgICAgIGJ1aWxkZXIucGFyc2VMb2dGaWxlLmFuZFJldHVybih7XG4gICAgICAgIG91dHB1dEZpbGVQYXRoOiBudWxsLFxuICAgICAgICBlcnJvcnM6IFtdLFxuICAgICAgICB3YXJuaW5nczogW11cbiAgICAgIH0pXG5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZSgoKSA9PiB7XG4gICAgICAgIHJldHVybiBjb21wb3Nlci5idWlsZCgpLmNhdGNoKHIgPT4gcilcbiAgICAgIH0pXG5cbiAgICAgIHJ1bnMoKCkgPT4ge1xuICAgICAgICBleHBlY3QoY29tcG9zZXIuc2hvd0Vycm9yKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCd0cmVhdHMgbWlzc2luZyByZXN1bHQgZnJvbSBwYXJzZXIgYXMgYW4gZXJyb3InLCAoKSA9PiB7XG4gICAgICBpbml0aWFsaXplU3BpZXMoJ2ZpbGUudGV4JylcbiAgICAgIGJ1aWxkZXIucGFyc2VMb2dGaWxlLmFuZFJldHVybihudWxsKVxuXG4gICAgICB3YWl0c0ZvclByb21pc2UoKCkgPT4ge1xuICAgICAgICByZXR1cm4gY29tcG9zZXIuYnVpbGQoKS5jYXRjaChyID0+IHIpXG4gICAgICB9KVxuXG4gICAgICBydW5zKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KGNvbXBvc2VyLnNob3dFcnJvcikudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnaGFuZGxlcyBhY3RpdmUgaXRlbSBub3QgYmVpbmcgYSB0ZXh0IGVkaXRvcicsICgpID0+IHtcbiAgICAgIHNweU9uKGF0b20ud29ya3NwYWNlLCAnZ2V0QWN0aXZlVGV4dEVkaXRvcicpLmFuZFJldHVybigpXG4gICAgICBzcHlPbihjb21wb3NlciwgJ2dldEVkaXRvckRldGFpbHMnKS5hbmRDYWxsVGhyb3VnaCgpXG5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZSgoKSA9PiB7XG4gICAgICAgIHJldHVybiBjb21wb3Nlci5idWlsZCgpLmNhdGNoKHIgPT4gcilcbiAgICAgIH0pXG5cbiAgICAgIHJ1bnMoKCkgPT4ge1xuICAgICAgICBleHBlY3QoY29tcG9zZXIuZ2V0RWRpdG9yRGV0YWlscykudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ2NsZWFuJywgKCkgPT4ge1xuICAgIGNvbnN0IGV4dGVuc2lvbnMgPSBbJy5iYXInLCAnLmJheicsICcucXV1eCddXG5cbiAgICBmdW5jdGlvbiBmYWtlRmlsZVBhdGhzIChmaWxlUGF0aCkge1xuICAgICAgY29uc3QgZmlsZVBhdGhTYW5zRXh0ZW5zaW9uID0gZmlsZVBhdGguc3Vic3RyaW5nKDAsIGZpbGVQYXRoLmxhc3RJbmRleE9mKCcuJykpXG4gICAgICByZXR1cm4gZXh0ZW5zaW9ucy5tYXAoZXh0ID0+IGZpbGVQYXRoU2Fuc0V4dGVuc2lvbiArIGV4dClcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpbml0aWFsaXplU3BpZXMgKGZpbGVQYXRoKSB7XG4gICAgICBzcHlPbihjb21wb3NlciwgJ2dldEVkaXRvckRldGFpbHMnKS5hbmRSZXR1cm4oe2ZpbGVQYXRofSlcbiAgICAgIHNweU9uKGNvbXBvc2VyLCAncmVzb2x2ZVJvb3RGaWxlUGF0aCcpLmFuZFJldHVybihmaWxlUGF0aClcbiAgICB9XG5cbiAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgIHNweU9uKGZzLCAncmVtb3ZlJykuYW5kQ2FsbFRocm91Z2goKVxuICAgICAgaGVscGVycy5zcHlPbkNvbmZpZygnbGF0ZXguY2xlYW5FeHRlbnNpb25zJywgZXh0ZW5zaW9ucylcbiAgICB9KVxuXG4gICAgaXQoJ2RlbGV0ZXMgYWxsIGZpbGVzIGZvciB0aGUgY3VycmVudCB0ZXggZG9jdW1lbnQgd2hlbiBvdXRwdXQgaGFzIG5vdCBiZWVuIHJlZGlyZWN0ZWQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBmaWxlUGF0aCA9IHBhdGgubm9ybWFsaXplKCcvYS9mb28udGV4JylcbiAgICAgIGNvbnN0IGZpbGVzVG9EZWxldGUgPSBmYWtlRmlsZVBhdGhzKGZpbGVQYXRoKVxuICAgICAgaW5pdGlhbGl6ZVNwaWVzKGZpbGVQYXRoKVxuXG4gICAgICBsZXQgY2FuZGlkYXRlUGF0aHNcbiAgICAgIHdhaXRzRm9yUHJvbWlzZSgoKSA9PiB7XG4gICAgICAgIHJldHVybiBjb21wb3Nlci5jbGVhbigpLnRoZW4ocmVzb2x1dGlvbnMgPT4ge1xuICAgICAgICAgIGNhbmRpZGF0ZVBhdGhzID0gXy5wbHVjayhyZXNvbHV0aW9ucywgJ2ZpbGVQYXRoJylcbiAgICAgICAgfSlcbiAgICAgIH0pXG5cbiAgICAgIHJ1bnMoKCkgPT4ge1xuICAgICAgICBleHBlY3QoY2FuZGlkYXRlUGF0aHMpLnRvRXF1YWwoZmlsZXNUb0RlbGV0ZSlcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzdG9wcyBpbW1pZGlhdGVseSBpZiB0aGUgZmlsZSBpcyBub3QgYSBUZVggZG9jdW1lbnQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBmaWxlUGF0aCA9ICdmb28uYmFyJ1xuICAgICAgaW5pdGlhbGl6ZVNwaWVzKGZpbGVQYXRoLCBbXSlcblxuICAgICAgd2FpdHNGb3JQcm9taXNlKCgpID0+IHtcbiAgICAgICAgcmV0dXJuIGNvbXBvc2VyLmNsZWFuKCkuY2F0Y2gociA9PiByKVxuICAgICAgfSlcblxuICAgICAgcnVucygoKSA9PiB7XG4gICAgICAgIGV4cGVjdChjb21wb3Nlci5yZXNvbHZlUm9vdEZpbGVQYXRoKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICAgIGV4cGVjdChmcy5yZW1vdmUpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnc2hvdWxkTW92ZVJlc3VsdCcsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJldHVybiBmYWxzZSB3aGVuIHVzaW5nIG5laXRoZXIgYW4gb3V0cHV0IGRpcmVjdG9yeSwgbm9yIHRoZSBtb3ZlIG9wdGlvbicsICgpID0+IHtcbiAgICAgIGhlbHBlcnMuc3B5T25Db25maWcoJ2xhdGV4Lm91dHB1dERpcmVjdG9yeScsICcnKVxuICAgICAgaGVscGVycy5zcHlPbkNvbmZpZygnbGF0ZXgubW92ZVJlc3VsdFRvU291cmNlRGlyZWN0b3J5JywgZmFsc2UpXG5cbiAgICAgIGV4cGVjdChjb21wb3Nlci5zaG91bGRNb3ZlUmVzdWx0KCkpLnRvQmUoZmFsc2UpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIGZhbHNlIHdoZW4gbm90IHVzaW5nIGFuIG91dHB1dCBkaXJlY3RvcnksIGJ1dCB1c2luZyB0aGUgbW92ZSBvcHRpb24nLCAoKSA9PiB7XG4gICAgICBoZWxwZXJzLnNweU9uQ29uZmlnKCdsYXRleC5vdXRwdXREaXJlY3RvcnknLCAnJylcbiAgICAgIGhlbHBlcnMuc3B5T25Db25maWcoJ2xhdGV4Lm1vdmVSZXN1bHRUb1NvdXJjZURpcmVjdG9yeScsIHRydWUpXG5cbiAgICAgIGV4cGVjdChjb21wb3Nlci5zaG91bGRNb3ZlUmVzdWx0KCkpLnRvQmUoZmFsc2UpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIGZhbHNlIHdoZW4gbm90IHVzaW5nIHRoZSBtb3ZlIG9wdGlvbiwgYnV0IHVzaW5nIGFuIG91dHB1dCBkaXJlY3RvcnknLCAoKSA9PiB7XG4gICAgICBoZWxwZXJzLnNweU9uQ29uZmlnKCdsYXRleC5vdXRwdXREaXJlY3RvcnknLCAnYmF6JylcbiAgICAgIGhlbHBlcnMuc3B5T25Db25maWcoJ2xhdGV4Lm1vdmVSZXN1bHRUb1NvdXJjZURpcmVjdG9yeScsIGZhbHNlKVxuXG4gICAgICBleHBlY3QoY29tcG9zZXIuc2hvdWxkTW92ZVJlc3VsdCgpKS50b0JlKGZhbHNlKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiB0cnVlIHdoZW4gdXNpbmcgYm90aCBhbiBvdXRwdXQgZGlyZWN0b3J5IGFuZCB0aGUgbW92ZSBvcHRpb24nLCAoKSA9PiB7XG4gICAgICBoZWxwZXJzLnNweU9uQ29uZmlnKCdsYXRleC5vdXRwdXREaXJlY3RvcnknLCAnYmF6JylcbiAgICAgIGhlbHBlcnMuc3B5T25Db25maWcoJ2xhdGV4Lm1vdmVSZXN1bHRUb1NvdXJjZURpcmVjdG9yeScsIHRydWUpXG5cbiAgICAgIGV4cGVjdChjb21wb3Nlci5zaG91bGRNb3ZlUmVzdWx0KCkpLnRvQmUodHJ1ZSlcbiAgICB9KVxuICB9KVxufSlcbiJdfQ==
//# sourceURL=/home/cin_chalic/.atom/packages/latex/spec/composer-spec.js
