function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _specHelpers = require('../spec-helpers');

var _specHelpers2 = _interopRequireDefault(_specHelpers);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _libBuildersLatexmk = require('../../lib/builders/latexmk');

var _libBuildersLatexmk2 = _interopRequireDefault(_libBuildersLatexmk);

'use babel';

describe('LatexmkBuilder', function () {
  var builder = undefined,
      fixturesPath = undefined,
      filePath = undefined;

  beforeEach(function () {
    builder = new _libBuildersLatexmk2['default']();
    fixturesPath = _specHelpers2['default'].cloneFixtures();
    filePath = _path2['default'].join(fixturesPath, 'file.tex');
  });

  describe('constructArgs', function () {
    it('produces default arguments when package has default config values', function () {
      var expectedArgs = ['-interaction=nonstopmode', '-f', '-cd', '-pdf', '-synctex=1', '-file-line-error', '"' + filePath + '"'];
      var args = builder.constructArgs(filePath);

      expect(args).toEqual(expectedArgs);
    });

    it('adds -shell-escape flag when package config value is set', function () {
      _specHelpers2['default'].spyOnConfig('latex.enableShellEscape', true);
      expect(builder.constructArgs(filePath)).toContain('-shell-escape');
    });

    it('adds -outdir=<path> argument according to package config', function () {
      var outdir = 'bar';
      var expectedArg = '-outdir="' + _path2['default'].join(fixturesPath, outdir) + '"';
      _specHelpers2['default'].spyOnConfig('latex.outputDirectory', outdir);

      expect(builder.constructArgs(filePath)).toContain(expectedArg);
    });

    it('adds engine argument according to package config', function () {
      _specHelpers2['default'].spyOnConfig('latex.engine', 'lualatex');
      expect(builder.constructArgs(filePath)).toContain('-lualatex');
    });

    it('adds a custom engine string according to package config', function () {
      _specHelpers2['default'].spyOnConfig('latex.customEngine', 'pdflatex %O %S');
      expect(builder.constructArgs(filePath)).toContain('-pdflatex="pdflatex %O %S"');
    });
  });

  describe('run', function () {
    var exitCode = undefined;

    it('successfully executes latexmk when given a valid TeX file', function () {
      waitsForPromise(function () {
        return builder.run(filePath).then(function (code) {
          return exitCode = code;
        });
      });

      runs(function () {
        expect(exitCode).toBe(0);
      });
    });

    it('successfully executes latexmk when given a file path containing spaces', function () {
      filePath = _path2['default'].join(fixturesPath, 'filename with spaces.tex');

      waitsForPromise(function () {
        return builder.run(filePath).then(function (code) {
          return exitCode = code;
        });
      });

      runs(function () {
        expect(exitCode).toBe(0);
      });
    });

    it('fails to execute latexmk when given invalid arguments', function () {
      spyOn(builder, 'constructArgs').andReturn(['-invalid-argument']);

      waitsForPromise(function () {
        return builder.run(filePath).then(function (code) {
          return exitCode = code;
        });
      });

      runs(function () {
        expect(exitCode).toBe(10);
      });
    });

    it('fails to execute latexmk when given invalid file path', function () {
      filePath = _path2['default'].join(fixturesPath, 'foo.tex');
      var args = builder.constructArgs(filePath);

      // Need to remove the 'force' flag to trigger the desired failure.
      var removed = args.splice(1, 1);
      expect(removed).toEqual(['-f']);

      spyOn(builder, 'constructArgs').andReturn(args);

      waitsForPromise(function () {
        return builder.run(filePath).then(function (code) {
          return exitCode = code;
        });
      });

      runs(function () {
        expect(exitCode).toBe(11);
      });
    });
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvc3BlYy9idWlsZGVycy9sYXRleG1rLXNwZWMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7MkJBRW9CLGlCQUFpQjs7OztvQkFDcEIsTUFBTTs7OztrQ0FDSSw0QkFBNEI7Ozs7QUFKdkQsV0FBVyxDQUFBOztBQU1YLFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRSxZQUFNO0FBQy9CLE1BQUksT0FBTyxZQUFBO01BQUUsWUFBWSxZQUFBO01BQUUsUUFBUSxZQUFBLENBQUE7O0FBRW5DLFlBQVUsQ0FBQyxZQUFNO0FBQ2YsV0FBTyxHQUFHLHFDQUFvQixDQUFBO0FBQzlCLGdCQUFZLEdBQUcseUJBQVEsYUFBYSxFQUFFLENBQUE7QUFDdEMsWUFBUSxHQUFHLGtCQUFLLElBQUksQ0FBQyxZQUFZLEVBQUUsVUFBVSxDQUFDLENBQUE7R0FDL0MsQ0FBQyxDQUFBOztBQUVGLFVBQVEsQ0FBQyxlQUFlLEVBQUUsWUFBTTtBQUM5QixNQUFFLENBQUMsbUVBQW1FLEVBQUUsWUFBTTtBQUM1RSxVQUFNLFlBQVksR0FBRyxDQUNuQiwwQkFBMEIsRUFDMUIsSUFBSSxFQUNKLEtBQUssRUFDTCxNQUFNLEVBQ04sWUFBWSxFQUNaLGtCQUFrQixRQUNkLFFBQVEsT0FDYixDQUFBO0FBQ0QsVUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQTs7QUFFNUMsWUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQTtLQUNuQyxDQUFDLENBQUE7O0FBRUYsTUFBRSxDQUFDLDBEQUEwRCxFQUFFLFlBQU07QUFDbkUsK0JBQVEsV0FBVyxDQUFDLHlCQUF5QixFQUFFLElBQUksQ0FBQyxDQUFBO0FBQ3BELFlBQU0sQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLGVBQWUsQ0FBQyxDQUFBO0tBQ25F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TSxJQUFJLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQTs7O0FBRzVDLFVBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFBO0FBQ2pDLFlBQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFBOztBQUUvQixXQUFLLENBQUMsT0FBTyxFQUFFLGVBQWUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQTs7QUFFL0MscUJBQWUsQ0FBQyxZQUFNO0FBQ3BCLGVBQU8sT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQSxJQUFJO2lCQUFJLFFBQVEsR0FBRyxJQUFJO1NBQUEsQ0FBQyxDQUFBO09BQzNELENBQUMsQ0FBQTs7QUFFRixVQUFJLENBQUMsWUFBTTtBQUNULGNBQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUE7T0FDMUIsQ0FBQyxDQUFBO0tBQ0gsQ0FBQyxDQUFBO0dBQ0gsQ0FBQyxDQUFBO0NBQ0gsQ0FBQyxDQUFBIiwiZmlsZSI6Ii9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvc3BlYy9idWlsZGVycy9sYXRleG1rLXNwZWMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5pbXBvcnQgaGVscGVycyBmcm9tICcuLi9zcGVjLWhlbHBlcnMnXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IExhdGV4bWtCdWlsZGVyIGZyb20gJy4uLy4uL2xpYi9idWlsZGVycy9sYXRleG1rJ1xuXG5kZXNjcmliZSgnTGF0ZXhta0J1aWxkZXInLCAoKSA9PiB7XG4gIGxldCBidWlsZGVyLCBmaXh0dXJlc1BhdGgsIGZpbGVQYXRoXG5cbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgYnVpbGRlciA9IG5ldyBMYXRleG1rQnVpbGRlcigpXG4gICAgZml4dHVyZXNQYXRoID0gaGVscGVycy5jbG9uZUZpeHR1cmVzKClcbiAgICBmaWxlUGF0aCA9IHBhdGguam9pbihmaXh0dXJlc1BhdGgsICdmaWxlLnRleCcpXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ2NvbnN0cnVjdEFyZ3MnLCAoKSA9PiB7XG4gICAgaXQoJ3Byb2R1Y2VzIGRlZmF1bHQgYXJndW1lbnRzIHdoZW4gcGFja2FnZSBoYXMgZGVmYXVsdCBjb25maWcgdmFsdWVzJywgKCkgPT4ge1xuICAgICAgY29uc3QgZXhwZWN0ZWRBcmdzID0gW1xuICAgICAgICAnLWludGVyYWN0aW9uPW5vbnN0b3Btb2RlJyxcbiAgICAgICAgJy1mJyxcbiAgICAgICAgJy1jZCcsXG4gICAgICAgICctcGRmJyxcbiAgICAgICAgJy1zeW5jdGV4PTEnLFxuICAgICAgICAnLWZpbGUtbGluZS1lcnJvcicsXG4gICAgICAgIGBcIiR7ZmlsZVBhdGh9XCJgXG4gICAgICBdXG4gICAgICBjb25zdCBhcmdzID0gYnVpbGRlci5jb25zdHJ1Y3RBcmdzKGZpbGVQYXRoKVxuXG4gICAgICBleHBlY3QoYXJncykudG9FcXVhbChleHBlY3RlZEFyZ3MpXG4gICAgfSlcblxuICAgIGl0KCdhZGRzIC1zaGVsbC1lc2NhcGUgZmxhZyB3aGVuIHBhY2thZ2UgY29uZmlnIHZhbHVlIGlzIHNldCcsICgpID0+IHtcbiAgICAgIGhlbHBlcnMuc3B5T25Db25maWcoJ2xhdGV4LmVuYWJsZVNoZWxsRXNjYXBlJywgdHJ1ZSlcbiAgICAgIGV4cGVjdChidWlsZGVyLmNvbnN0cnVjdEFyZ3MoZmlsZVBhdGgpKS50b0NvbnRhaW4oJy1zaGVsbC1lc2NhcGUnKVxuICAgIH0pXG5cbiAgICBpdCgnYWRkcyAtb3V0ZGlyPTxwYXRoPiBhcmd1bWVudCBhY2NvcmRpbmcgdG8gcGFja2FnZSBjb25maWcnLCAoKSA9PiB7XG4gICAgICBjb25zdCBvdXRkaXIgPSAnYmFyJ1xuICAgICAgY29uc3QgZXhwZWN0ZWRBcmcgPSBgLW91dGRpcj1cIiR7cGF0aC5qb2luKGZpeHR1cmVzUGF0aCwgb3V0ZGlyKX1cImBcbiAgICAgIGhlbHBlcnMuc3B5T25Db25maWcoJ2xhdGV4Lm91dHB1dERpcmVjdG9yeScsIG91dGRpcilcblxuICAgICAgZXhwZWN0KGJ1aWxkZXIuY29uc3RydWN0QXJncyhmaWxlUGF0aCkpLnRvQ29udGFpbihleHBlY3RlZEFyZylcbiAgICB9KVxuXG4gICAgaXQoJ2FkZHMgZW5naW5lIGFyZ3VtZW50IGFjY29yZGluZyB0byBwYWNrYWdlIGNvbmZpZycsICgpID0+IHtcbiAgICAgIGhlbHBlcnMuc3B5T25Db25maWcoJ2xhdGV4LmVuZ2luZScsICdsdWFsYXRleCcpXG4gICAgICBleHBlY3QoYnVpbGRlci5jb25zdHJ1Y3RBcmdzKGZpbGVQYXRoKSkudG9Db250YWluKCctbHVhbGF0ZXgnKVxuICAgIH0pXG5cbiAgICBpdCgnYWRkcyBhIGN1c3RvbSBlbmdpbmUgc3RyaW5nIGFjY29yZGluZyB0byBwYWNrYWdlIGNvbmZpZycsICgpID0+IHtcbiAgICAgIGhlbHBlcnMuc3B5T25Db25maWcoJ2xhdGV4LmN1c3RvbUVuZ2luZScsICdwZGZsYXRleCAlTyAlUycpXG4gICAgICBleHBlY3QoYnVpbGRlci5jb25zdHJ1Y3RBcmdzKGZpbGVQYXRoKSkudG9Db250YWluKCctcGRmbGF0ZXg9XCJwZGZsYXRleCAlTyAlU1wiJylcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdydW4nLCAoKSA9PiB7XG4gICAgbGV0IGV4aXRDb2RlXG5cbiAgICBpdCgnc3VjY2Vzc2Z1bGx5IGV4ZWN1dGVzIGxhdGV4bWsgd2hlbiBnaXZlbiBhIHZhbGlkIFRlWCBmaWxlJywgKCkgPT4ge1xuICAgICAgd2FpdHNGb3JQcm9taXNlKCgpID0+IHtcbiAgICAgICAgcmV0dXJuIGJ1aWxkZXIucnVuKGZpbGVQYXRoKS50aGVuKGNvZGUgPT4gZXhpdENvZGUgPSBjb2RlKVxuICAgICAgfSlcblxuICAgICAgcnVucygoKSA9PiB7XG4gICAgICAgIGV4cGVjdChleGl0Q29kZSkudG9CZSgwKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3N1Y2Nlc3NmdWxseSBleGVjdXRlcyBsYXRleG1rIHdoZW4gZ2l2ZW4gYSBmaWxlIHBhdGggY29udGFpbmluZyBzcGFjZXMnLCAoKSA9PiB7XG4gICAgICBmaWxlUGF0aCA9IHBhdGguam9pbihmaXh0dXJlc1BhdGgsICdmaWxlbmFtZSB3aXRoIHNwYWNlcy50ZXgnKVxuXG4gICAgICB3YWl0c0ZvclByb21pc2UoKCkgPT4ge1xuICAgICAgICByZXR1cm4gYnVpbGRlci5ydW4oZmlsZVBhdGgpLnRoZW4oY29kZSA9PiBleGl0Q29kZSA9IGNvZGUpXG4gICAgICB9KVxuXG4gICAgICBydW5zKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KGV4aXRDb2RlKS50b0JlKDApXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnZmFpbHMgdG8gZXhlY3V0ZSBsYXRleG1rIHdoZW4gZ2l2ZW4gaW52YWxpZCBhcmd1bWVudHMnLCAoKSA9PiB7XG4gICAgICBzcHlPbihidWlsZGVyLCAnY29uc3RydWN0QXJncycpLmFuZFJldHVybihbJy1pbnZhbGlkLWFyZ3VtZW50J10pXG5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZSgoKSA9PiB7XG4gICAgICAgIHJldHVybiBidWlsZGVyLnJ1bihmaWxlUGF0aCkudGhlbihjb2RlID0+IGV4aXRDb2RlID0gY29kZSlcbiAgICAgIH0pXG5cbiAgICAgIHJ1bnMoKCkgPT4ge1xuICAgICAgICBleHBlY3QoZXhpdENvZGUpLnRvQmUoMTApXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnZmFpbHMgdG8gZXhlY3V0ZSBsYXRleG1rIHdoZW4gZ2l2ZW4gaW52YWxpZCBmaWxlIHBhdGgnLCAoKSA9PiB7XG4gICAgICBmaWxlUGF0aCA9IHBhdGguam9pbihmaXh0dXJlc1BhdGgsICdmb28udGV4JylcbiAgICAgIGNvbnN0IGFyZ3MgPSBidWlsZGVyLmNvbnN0cnVjdEFyZ3MoZmlsZVBhdGgpXG5cbiAgICAgIC8vIE5lZWQgdG8gcmVtb3ZlIHRoZSAnZm9yY2UnIGZsYWcgdG8gdHJpZ2dlciB0aGUgZGVzaXJlZCBmYWlsdXJlLlxuICAgICAgY29uc3QgcmVtb3ZlZCA9IGFyZ3Muc3BsaWNlKDEsIDEpXG4gICAgICBleHBlY3QocmVtb3ZlZCkudG9FcXVhbChbJy1mJ10pXG5cbiAgICAgIHNweU9uKGJ1aWxkZXIsICdjb25zdHJ1Y3RBcmdzJykuYW5kUmV0dXJuKGFyZ3MpXG5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZSgoKSA9PiB7XG4gICAgICAgIHJldHVybiBidWlsZGVyLnJ1bihmaWxlUGF0aCkudGhlbihjb2RlID0+IGV4aXRDb2RlID0gY29kZSlcbiAgICAgIH0pXG5cbiAgICAgIHJ1bnMoKCkgPT4ge1xuICAgICAgICBleHBlY3QoZXhpdENvZGUpLnRvQmUoMTEpXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG59KVxuIl19
//# sourceURL=/home/cin_chalic/.atom/packages/latex/spec/builders/latexmk-spec.js
