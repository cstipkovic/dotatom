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
      var expectedArgs = ['-interaction=nonstopmode', '-f', '-cd', '-pdf', '-file-line-error', '-synctex=1', '"' + filePath + '"'];
      var args = builder.constructArgs(filePath);

      expect(args).toEqual(expectedArgs);
    });

    it('adds -shell-escape flag when package config value is set', function () {
      atom.config.set('latex.enableShellEscape', true);
      expect(builder.constructArgs(filePath)).toContain('-shell-escape');
    });

    it('disables synctex according to package config', function () {
      atom.config.set('latex.enableSynctex', false);
      expect(builder.constructArgs(filePath)).not.toContain('-synctex=1');
    });

    it('adds -outdir=<path> argument according to package config', function () {
      var outdir = 'bar';
      var expectedArg = '-outdir="' + _path2['default'].join(fixturesPath, outdir) + '"';
      atom.config.set('latex.outputDirectory', outdir);

      expect(builder.constructArgs(filePath)).toContain(expectedArg);
    });

    it('adds engine argument according to package config', function () {
      atom.config.set('latex.engine', 'lualatex');
      expect(builder.constructArgs(filePath)).toContain('-lualatex');
    });

    it('adds a custom engine string according to package config', function () {
      atom.config.set('latex.customEngine', 'pdflatex %O %S');
      expect(builder.constructArgs(filePath)).toContain('-pdflatex="pdflatex %O %S"');
    });

    it('adds -ps or -dvi and removes -pdf arguments according to package config', function () {
      atom.config.set('latex.outputFormat', 'ps');
      expect(builder.constructArgs(filePath)).toContain('-ps');
      expect(builder.constructArgs(filePath)).not.toContain('-pdf');
      atom.config.set('latex.outputFormat', 'dvi');
      expect(builder.constructArgs(filePath)).toContain('-dvi');
      expect(builder.constructArgs(filePath)).not.toContain('-pdf');
    });
  });

  describe('run', function () {
    var exitCode = undefined;

    it('successfully executes latexmk when given a valid TeX file', function () {
      waitsForPromise(function () {
        return builder.run(filePath).then(function (code) {
          exitCode = code;
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
          exitCode = code;
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
          exitCode = code;
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
          exitCode = code;
        });
      });

      runs(function () {
        expect(exitCode).toBe(11);
      });
    });
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvc3BlYy9idWlsZGVycy9sYXRleG1rLXNwZWMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7MkJBRW9CLGlCQUFpQjs7OztvQkFDcEIsTUFBTTs7OztrQ0FDSSw0QkFBNEI7Ozs7QUFKdkQsV0FBVyxDQUFBOztBQU1YLFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRSxZQUFNO0FBQy9CLE1BQUksT0FBTyxZQUFBO01BQUUsWUFBWSxZQUFBO01BQUUsUUFBUSxZQUFBLENBQUE7O0FBRW5DLFlBQVUsQ0FBQyxZQUFNO0FBQ2YsV0FBTyxHQUFHLHFDQUFvQixDQUFBO0FBQzlCLGdCQUFZLEdBQUcseUJBQVEsYUFBYSxFQUFFLENBQUE7QUFDdEMsWUFBUSxHQUFHLGtCQUFLLElBQUksQ0FBQyxZQUFZLEVBQUUsVUFBVSxDQUFDLENBQUE7R0FDL0MsQ0FBQyxDQUFBOztBQUVGLFVBQVEsQ0FBQyxlQUFlLEVBQUUsWUFBTTtBQUM5QixNQUFFLENBQUMsbUVBQW1FLEVBQUUsWUFBTTtBQUM1RSxVQUFNLFlBQVksR0FBRyxDQUNuQiwwQkFBMEIsRUFDMUIsSUFBSSxFQUNKLEtBQUssRUFDTCxNQUFNLEVBQ04sa0JBQWtCLEVBQ2xCLFlBQVksUUFDUixRQUFRLE9BQ2IsQ0FBQTtBQUNELFVBQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUE7O0FBRTVDLFlBQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUE7S0FDbkMsQ0FBQyxDQUFBOztBQUVGLE1BQUUsQ0FBQywwREFBMEQsRUFBRSxZQUFNO0FBQ25FLFVBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLHlCQUF5QixFQUFFLElBQUksQ0FBQyxDQUFBO0FBQ2hELFlBQU0sQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLGVBQWUs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QUFDLEVBQUUsQ0FBQyxDQUFDLENBQUE7QUFDakMsWUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUE7O0FBRS9CLFdBQUssQ0FBQyxPQUFPLEVBQUUsZUFBZSxDQUFDLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFBOztBQUUvQyxxQkFBZSxDQUFDLFlBQU07QUFDcEIsZUFBTyxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFBLElBQUksRUFBSTtBQUFFLGtCQUFRLEdBQUcsSUFBSSxDQUFBO1NBQUUsQ0FBQyxDQUFBO09BQy9ELENBQUMsQ0FBQTs7QUFFRixVQUFJLENBQUMsWUFBTTtBQUNULGNBQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUE7T0FDMUIsQ0FBQyxDQUFBO0tBQ0gsQ0FBQyxDQUFBO0dBQ0gsQ0FBQyxDQUFBO0NBQ0gsQ0FBQyxDQUFBIiwiZmlsZSI6Ii9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvc3BlYy9idWlsZGVycy9sYXRleG1rLXNwZWMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5pbXBvcnQgaGVscGVycyBmcm9tICcuLi9zcGVjLWhlbHBlcnMnXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IExhdGV4bWtCdWlsZGVyIGZyb20gJy4uLy4uL2xpYi9idWlsZGVycy9sYXRleG1rJ1xuXG5kZXNjcmliZSgnTGF0ZXhta0J1aWxkZXInLCAoKSA9PiB7XG4gIGxldCBidWlsZGVyLCBmaXh0dXJlc1BhdGgsIGZpbGVQYXRoXG5cbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgYnVpbGRlciA9IG5ldyBMYXRleG1rQnVpbGRlcigpXG4gICAgZml4dHVyZXNQYXRoID0gaGVscGVycy5jbG9uZUZpeHR1cmVzKClcbiAgICBmaWxlUGF0aCA9IHBhdGguam9pbihmaXh0dXJlc1BhdGgsICdmaWxlLnRleCcpXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ2NvbnN0cnVjdEFyZ3MnLCAoKSA9PiB7XG4gICAgaXQoJ3Byb2R1Y2VzIGRlZmF1bHQgYXJndW1lbnRzIHdoZW4gcGFja2FnZSBoYXMgZGVmYXVsdCBjb25maWcgdmFsdWVzJywgKCkgPT4ge1xuICAgICAgY29uc3QgZXhwZWN0ZWRBcmdzID0gW1xuICAgICAgICAnLWludGVyYWN0aW9uPW5vbnN0b3Btb2RlJyxcbiAgICAgICAgJy1mJyxcbiAgICAgICAgJy1jZCcsXG4gICAgICAgICctcGRmJyxcbiAgICAgICAgJy1maWxlLWxpbmUtZXJyb3InLFxuICAgICAgICAnLXN5bmN0ZXg9MScsXG4gICAgICAgIGBcIiR7ZmlsZVBhdGh9XCJgXG4gICAgICBdXG4gICAgICBjb25zdCBhcmdzID0gYnVpbGRlci5jb25zdHJ1Y3RBcmdzKGZpbGVQYXRoKVxuXG4gICAgICBleHBlY3QoYXJncykudG9FcXVhbChleHBlY3RlZEFyZ3MpXG4gICAgfSlcblxuICAgIGl0KCdhZGRzIC1zaGVsbC1lc2NhcGUgZmxhZyB3aGVuIHBhY2thZ2UgY29uZmlnIHZhbHVlIGlzIHNldCcsICgpID0+IHtcbiAgICAgIGF0b20uY29uZmlnLnNldCgnbGF0ZXguZW5hYmxlU2hlbGxFc2NhcGUnLCB0cnVlKVxuICAgICAgZXhwZWN0KGJ1aWxkZXIuY29uc3RydWN0QXJncyhmaWxlUGF0aCkpLnRvQ29udGFpbignLXNoZWxsLWVzY2FwZScpXG4gICAgfSlcblxuICAgIGl0KCdkaXNhYmxlcyBzeW5jdGV4IGFjY29yZGluZyB0byBwYWNrYWdlIGNvbmZpZycsICgpID0+IHtcbiAgICAgIGF0b20uY29uZmlnLnNldCgnbGF0ZXguZW5hYmxlU3luY3RleCcsIGZhbHNlKVxuICAgICAgZXhwZWN0KGJ1aWxkZXIuY29uc3RydWN0QXJncyhmaWxlUGF0aCkpLm5vdC50b0NvbnRhaW4oJy1zeW5jdGV4PTEnKVxuICAgIH0pXG5cbiAgICBpdCgnYWRkcyAtb3V0ZGlyPTxwYXRoPiBhcmd1bWVudCBhY2NvcmRpbmcgdG8gcGFja2FnZSBjb25maWcnLCAoKSA9PiB7XG4gICAgICBjb25zdCBvdXRkaXIgPSAnYmFyJ1xuICAgICAgY29uc3QgZXhwZWN0ZWRBcmcgPSBgLW91dGRpcj1cIiR7cGF0aC5qb2luKGZpeHR1cmVzUGF0aCwgb3V0ZGlyKX1cImBcbiAgICAgIGF0b20uY29uZmlnLnNldCgnbGF0ZXgub3V0cHV0RGlyZWN0b3J5Jywgb3V0ZGlyKVxuXG4gICAgICBleHBlY3QoYnVpbGRlci5jb25zdHJ1Y3RBcmdzKGZpbGVQYXRoKSkudG9Db250YWluKGV4cGVjdGVkQXJnKVxuICAgIH0pXG5cbiAgICBpdCgnYWRkcyBlbmdpbmUgYXJndW1lbnQgYWNjb3JkaW5nIHRvIHBhY2thZ2UgY29uZmlnJywgKCkgPT4ge1xuICAgICAgYXRvbS5jb25maWcuc2V0KCdsYXRleC5lbmdpbmUnLCAnbHVhbGF0ZXgnKVxuICAgICAgZXhwZWN0KGJ1aWxkZXIuY29uc3RydWN0QXJncyhmaWxlUGF0aCkpLnRvQ29udGFpbignLWx1YWxhdGV4JylcbiAgICB9KVxuXG4gICAgaXQoJ2FkZHMgYSBjdXN0b20gZW5naW5lIHN0cmluZyBhY2NvcmRpbmcgdG8gcGFja2FnZSBjb25maWcnLCAoKSA9PiB7XG4gICAgICBhdG9tLmNvbmZpZy5zZXQoJ2xhdGV4LmN1c3RvbUVuZ2luZScsICdwZGZsYXRleCAlTyAlUycpXG4gICAgICBleHBlY3QoYnVpbGRlci5jb25zdHJ1Y3RBcmdzKGZpbGVQYXRoKSkudG9Db250YWluKCctcGRmbGF0ZXg9XCJwZGZsYXRleCAlTyAlU1wiJylcbiAgICB9KVxuXG4gICAgaXQoJ2FkZHMgLXBzIG9yIC1kdmkgYW5kIHJlbW92ZXMgLXBkZiBhcmd1bWVudHMgYWNjb3JkaW5nIHRvIHBhY2thZ2UgY29uZmlnJywgKCkgPT4ge1xuICAgICAgYXRvbS5jb25maWcuc2V0KCdsYXRleC5vdXRwdXRGb3JtYXQnLCAncHMnKVxuICAgICAgZXhwZWN0KGJ1aWxkZXIuY29uc3RydWN0QXJncyhmaWxlUGF0aCkpLnRvQ29udGFpbignLXBzJylcbiAgICAgIGV4cGVjdChidWlsZGVyLmNvbnN0cnVjdEFyZ3MoZmlsZVBhdGgpKS5ub3QudG9Db250YWluKCctcGRmJylcbiAgICAgIGF0b20uY29uZmlnLnNldCgnbGF0ZXgub3V0cHV0Rm9ybWF0JywgJ2R2aScpXG4gICAgICBleHBlY3QoYnVpbGRlci5jb25zdHJ1Y3RBcmdzKGZpbGVQYXRoKSkudG9Db250YWluKCctZHZpJylcbiAgICAgIGV4cGVjdChidWlsZGVyLmNvbnN0cnVjdEFyZ3MoZmlsZVBhdGgpKS5ub3QudG9Db250YWluKCctcGRmJylcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdydW4nLCAoKSA9PiB7XG4gICAgbGV0IGV4aXRDb2RlXG5cbiAgICBpdCgnc3VjY2Vzc2Z1bGx5IGV4ZWN1dGVzIGxhdGV4bWsgd2hlbiBnaXZlbiBhIHZhbGlkIFRlWCBmaWxlJywgKCkgPT4ge1xuICAgICAgd2FpdHNGb3JQcm9taXNlKCgpID0+IHtcbiAgICAgICAgcmV0dXJuIGJ1aWxkZXIucnVuKGZpbGVQYXRoKS50aGVuKGNvZGUgPT4geyBleGl0Q29kZSA9IGNvZGUgfSlcbiAgICAgIH0pXG5cbiAgICAgIHJ1bnMoKCkgPT4ge1xuICAgICAgICBleHBlY3QoZXhpdENvZGUpLnRvQmUoMClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzdWNjZXNzZnVsbHkgZXhlY3V0ZXMgbGF0ZXhtayB3aGVuIGdpdmVuIGEgZmlsZSBwYXRoIGNvbnRhaW5pbmcgc3BhY2VzJywgKCkgPT4ge1xuICAgICAgZmlsZVBhdGggPSBwYXRoLmpvaW4oZml4dHVyZXNQYXRoLCAnZmlsZW5hbWUgd2l0aCBzcGFjZXMudGV4JylcblxuICAgICAgd2FpdHNGb3JQcm9taXNlKCgpID0+IHtcbiAgICAgICAgcmV0dXJuIGJ1aWxkZXIucnVuKGZpbGVQYXRoKS50aGVuKGNvZGUgPT4geyBleGl0Q29kZSA9IGNvZGUgfSlcbiAgICAgIH0pXG5cbiAgICAgIHJ1bnMoKCkgPT4ge1xuICAgICAgICBleHBlY3QoZXhpdENvZGUpLnRvQmUoMClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdmYWlscyB0byBleGVjdXRlIGxhdGV4bWsgd2hlbiBnaXZlbiBpbnZhbGlkIGFyZ3VtZW50cycsICgpID0+IHtcbiAgICAgIHNweU9uKGJ1aWxkZXIsICdjb25zdHJ1Y3RBcmdzJykuYW5kUmV0dXJuKFsnLWludmFsaWQtYXJndW1lbnQnXSlcblxuICAgICAgd2FpdHNGb3JQcm9taXNlKCgpID0+IHtcbiAgICAgICAgcmV0dXJuIGJ1aWxkZXIucnVuKGZpbGVQYXRoKS50aGVuKGNvZGUgPT4geyBleGl0Q29kZSA9IGNvZGUgfSlcbiAgICAgIH0pXG5cbiAgICAgIHJ1bnMoKCkgPT4ge1xuICAgICAgICBleHBlY3QoZXhpdENvZGUpLnRvQmUoMTApXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnZmFpbHMgdG8gZXhlY3V0ZSBsYXRleG1rIHdoZW4gZ2l2ZW4gaW52YWxpZCBmaWxlIHBhdGgnLCAoKSA9PiB7XG4gICAgICBmaWxlUGF0aCA9IHBhdGguam9pbihmaXh0dXJlc1BhdGgsICdmb28udGV4JylcbiAgICAgIGNvbnN0IGFyZ3MgPSBidWlsZGVyLmNvbnN0cnVjdEFyZ3MoZmlsZVBhdGgpXG5cbiAgICAgIC8vIE5lZWQgdG8gcmVtb3ZlIHRoZSAnZm9yY2UnIGZsYWcgdG8gdHJpZ2dlciB0aGUgZGVzaXJlZCBmYWlsdXJlLlxuICAgICAgY29uc3QgcmVtb3ZlZCA9IGFyZ3Muc3BsaWNlKDEsIDEpXG4gICAgICBleHBlY3QocmVtb3ZlZCkudG9FcXVhbChbJy1mJ10pXG5cbiAgICAgIHNweU9uKGJ1aWxkZXIsICdjb25zdHJ1Y3RBcmdzJykuYW5kUmV0dXJuKGFyZ3MpXG5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZSgoKSA9PiB7XG4gICAgICAgIHJldHVybiBidWlsZGVyLnJ1bihmaWxlUGF0aCkudGhlbihjb2RlID0+IHsgZXhpdENvZGUgPSBjb2RlIH0pXG4gICAgICB9KVxuXG4gICAgICBydW5zKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KGV4aXRDb2RlKS50b0JlKDExKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxufSlcbiJdfQ==
//# sourceURL=/home/cin_chalic/.atom/packages/latex/spec/builders/latexmk-spec.js
