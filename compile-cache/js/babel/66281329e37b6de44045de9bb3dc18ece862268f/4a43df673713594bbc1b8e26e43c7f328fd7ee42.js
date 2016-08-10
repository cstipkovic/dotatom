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

    it('adds -ps or -dvi and removes -pdf arguments according to package config', function () {
      _specHelpers2['default'].spyOnConfig('latex.outputFormat', 'ps');
      expect(builder.constructArgs(filePath)).toContain('-ps');
      expect(builder.constructArgs(filePath)).not.toContain('-pdf');
      _specHelpers2['default'].spyOnConfig('latex.outputFormat', 'dvi');
      expect(builder.constructArgs(filePath)).toContain('-dvi');
      expect(builder.constructArgs(filePath)).not.toContain('-pdf');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvc3BlYy9idWlsZGVycy9sYXRleG1rLXNwZWMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7MkJBRW9CLGlCQUFpQjs7OztvQkFDcEIsTUFBTTs7OztrQ0FDSSw0QkFBNEI7Ozs7QUFKdkQsV0FBVyxDQUFBOztBQU1YLFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRSxZQUFNO0FBQy9CLE1BQUksT0FBTyxZQUFBO01BQUUsWUFBWSxZQUFBO01BQUUsUUFBUSxZQUFBLENBQUE7O0FBRW5DLFlBQVUsQ0FBQyxZQUFNO0FBQ2YsV0FBTyxHQUFHLHFDQUFvQixDQUFBO0FBQzlCLGdCQUFZLEdBQUcseUJBQVEsYUFBYSxFQUFFLENBQUE7QUFDdEMsWUFBUSxHQUFHLGtCQUFLLElBQUksQ0FBQyxZQUFZLEVBQUUsVUFBVSxDQUFDLENBQUE7R0FDL0MsQ0FBQyxDQUFBOztBQUVGLFVBQVEsQ0FBQyxlQUFlLEVBQUUsWUFBTTtBQUM5QixNQUFFLENBQUMsbUVBQW1FLEVBQUUsWUFBTTtBQUM1RSxVQUFNLFlBQVksR0FBRyxDQUNuQiwwQkFBMEIsRUFDMUIsSUFBSSxFQUNKLEtBQUssRUFDTCxNQUFNLEVBQ04sWUFBWSxFQUNaLGtCQUFrQixRQUNkLFFBQVEsT0FDYixDQUFBO0FBQ0QsVUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQTs7QUFFNUMsWUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQTtLQUNuQyxDQUFDLENBQUE7O0FBRUYsTUFBRSxDQUFDLDBEQUEwRCxFQUFFLFlBQU07QUFDbkUsK0JBQVEsV0FBVyxDQUFDLHlCQUF5QixFQUFFLElBQUksQ0FBQyxDQUFBO0FBQ3BELFlBQU0sQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLGVBQWUsQ0FBQyxDQUFBO0tBQ25F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O0FBQ1QsY0FBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQTtPQUMxQixDQUFDLENBQUE7S0FDSCxDQUFDLENBQUE7R0FDSCxDQUFDLENBQUE7Q0FDSCxDQUFDLENBQUEiLCJmaWxlIjoiL2hvbWUvY2luX2NoYWxpYy8uYXRvbS9wYWNrYWdlcy9sYXRleC9zcGVjL2J1aWxkZXJzL2xhdGV4bWstc3BlYy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmltcG9ydCBoZWxwZXJzIGZyb20gJy4uL3NwZWMtaGVscGVycydcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5pbXBvcnQgTGF0ZXhta0J1aWxkZXIgZnJvbSAnLi4vLi4vbGliL2J1aWxkZXJzL2xhdGV4bWsnXG5cbmRlc2NyaWJlKCdMYXRleG1rQnVpbGRlcicsICgpID0+IHtcbiAgbGV0IGJ1aWxkZXIsIGZpeHR1cmVzUGF0aCwgZmlsZVBhdGhcblxuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICBidWlsZGVyID0gbmV3IExhdGV4bWtCdWlsZGVyKClcbiAgICBmaXh0dXJlc1BhdGggPSBoZWxwZXJzLmNsb25lRml4dHVyZXMoKVxuICAgIGZpbGVQYXRoID0gcGF0aC5qb2luKGZpeHR1cmVzUGF0aCwgJ2ZpbGUudGV4JylcbiAgfSlcblxuICBkZXNjcmliZSgnY29uc3RydWN0QXJncycsICgpID0+IHtcbiAgICBpdCgncHJvZHVjZXMgZGVmYXVsdCBhcmd1bWVudHMgd2hlbiBwYWNrYWdlIGhhcyBkZWZhdWx0IGNvbmZpZyB2YWx1ZXMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBleHBlY3RlZEFyZ3MgPSBbXG4gICAgICAgICctaW50ZXJhY3Rpb249bm9uc3RvcG1vZGUnLFxuICAgICAgICAnLWYnLFxuICAgICAgICAnLWNkJyxcbiAgICAgICAgJy1wZGYnLFxuICAgICAgICAnLXN5bmN0ZXg9MScsXG4gICAgICAgICctZmlsZS1saW5lLWVycm9yJyxcbiAgICAgICAgYFwiJHtmaWxlUGF0aH1cImBcbiAgICAgIF1cbiAgICAgIGNvbnN0IGFyZ3MgPSBidWlsZGVyLmNvbnN0cnVjdEFyZ3MoZmlsZVBhdGgpXG5cbiAgICAgIGV4cGVjdChhcmdzKS50b0VxdWFsKGV4cGVjdGVkQXJncylcbiAgICB9KVxuXG4gICAgaXQoJ2FkZHMgLXNoZWxsLWVzY2FwZSBmbGFnIHdoZW4gcGFja2FnZSBjb25maWcgdmFsdWUgaXMgc2V0JywgKCkgPT4ge1xuICAgICAgaGVscGVycy5zcHlPbkNvbmZpZygnbGF0ZXguZW5hYmxlU2hlbGxFc2NhcGUnLCB0cnVlKVxuICAgICAgZXhwZWN0KGJ1aWxkZXIuY29uc3RydWN0QXJncyhmaWxlUGF0aCkpLnRvQ29udGFpbignLXNoZWxsLWVzY2FwZScpXG4gICAgfSlcblxuICAgIGl0KCdhZGRzIC1vdXRkaXI9PHBhdGg+IGFyZ3VtZW50IGFjY29yZGluZyB0byBwYWNrYWdlIGNvbmZpZycsICgpID0+IHtcbiAgICAgIGNvbnN0IG91dGRpciA9ICdiYXInXG4gICAgICBjb25zdCBleHBlY3RlZEFyZyA9IGAtb3V0ZGlyPVwiJHtwYXRoLmpvaW4oZml4dHVyZXNQYXRoLCBvdXRkaXIpfVwiYFxuICAgICAgaGVscGVycy5zcHlPbkNvbmZpZygnbGF0ZXgub3V0cHV0RGlyZWN0b3J5Jywgb3V0ZGlyKVxuXG4gICAgICBleHBlY3QoYnVpbGRlci5jb25zdHJ1Y3RBcmdzKGZpbGVQYXRoKSkudG9Db250YWluKGV4cGVjdGVkQXJnKVxuICAgIH0pXG5cbiAgICBpdCgnYWRkcyBlbmdpbmUgYXJndW1lbnQgYWNjb3JkaW5nIHRvIHBhY2thZ2UgY29uZmlnJywgKCkgPT4ge1xuICAgICAgaGVscGVycy5zcHlPbkNvbmZpZygnbGF0ZXguZW5naW5lJywgJ2x1YWxhdGV4JylcbiAgICAgIGV4cGVjdChidWlsZGVyLmNvbnN0cnVjdEFyZ3MoZmlsZVBhdGgpKS50b0NvbnRhaW4oJy1sdWFsYXRleCcpXG4gICAgfSlcblxuICAgIGl0KCdhZGRzIGEgY3VzdG9tIGVuZ2luZSBzdHJpbmcgYWNjb3JkaW5nIHRvIHBhY2thZ2UgY29uZmlnJywgKCkgPT4ge1xuICAgICAgaGVscGVycy5zcHlPbkNvbmZpZygnbGF0ZXguY3VzdG9tRW5naW5lJywgJ3BkZmxhdGV4ICVPICVTJylcbiAgICAgIGV4cGVjdChidWlsZGVyLmNvbnN0cnVjdEFyZ3MoZmlsZVBhdGgpKS50b0NvbnRhaW4oJy1wZGZsYXRleD1cInBkZmxhdGV4ICVPICVTXCInKVxuICAgIH0pXG5cbiAgICBpdCgnYWRkcyAtcHMgb3IgLWR2aSBhbmQgcmVtb3ZlcyAtcGRmIGFyZ3VtZW50cyBhY2NvcmRpbmcgdG8gcGFja2FnZSBjb25maWcnLCAoKSA9PiB7XG4gICAgICBoZWxwZXJzLnNweU9uQ29uZmlnKCdsYXRleC5vdXRwdXRGb3JtYXQnLCAncHMnKVxuICAgICAgZXhwZWN0KGJ1aWxkZXIuY29uc3RydWN0QXJncyhmaWxlUGF0aCkpLnRvQ29udGFpbignLXBzJylcbiAgICAgIGV4cGVjdChidWlsZGVyLmNvbnN0cnVjdEFyZ3MoZmlsZVBhdGgpKS5ub3QudG9Db250YWluKCctcGRmJylcbiAgICAgIGhlbHBlcnMuc3B5T25Db25maWcoJ2xhdGV4Lm91dHB1dEZvcm1hdCcsICdkdmknKVxuICAgICAgZXhwZWN0KGJ1aWxkZXIuY29uc3RydWN0QXJncyhmaWxlUGF0aCkpLnRvQ29udGFpbignLWR2aScpXG4gICAgICBleHBlY3QoYnVpbGRlci5jb25zdHJ1Y3RBcmdzKGZpbGVQYXRoKSkubm90LnRvQ29udGFpbignLXBkZicpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgncnVuJywgKCkgPT4ge1xuICAgIGxldCBleGl0Q29kZVxuXG4gICAgaXQoJ3N1Y2Nlc3NmdWxseSBleGVjdXRlcyBsYXRleG1rIHdoZW4gZ2l2ZW4gYSB2YWxpZCBUZVggZmlsZScsICgpID0+IHtcbiAgICAgIHdhaXRzRm9yUHJvbWlzZSgoKSA9PiB7XG4gICAgICAgIHJldHVybiBidWlsZGVyLnJ1bihmaWxlUGF0aCkudGhlbihjb2RlID0+IGV4aXRDb2RlID0gY29kZSlcbiAgICAgIH0pXG5cbiAgICAgIHJ1bnMoKCkgPT4ge1xuICAgICAgICBleHBlY3QoZXhpdENvZGUpLnRvQmUoMClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzdWNjZXNzZnVsbHkgZXhlY3V0ZXMgbGF0ZXhtayB3aGVuIGdpdmVuIGEgZmlsZSBwYXRoIGNvbnRhaW5pbmcgc3BhY2VzJywgKCkgPT4ge1xuICAgICAgZmlsZVBhdGggPSBwYXRoLmpvaW4oZml4dHVyZXNQYXRoLCAnZmlsZW5hbWUgd2l0aCBzcGFjZXMudGV4JylcblxuICAgICAgd2FpdHNGb3JQcm9taXNlKCgpID0+IHtcbiAgICAgICAgcmV0dXJuIGJ1aWxkZXIucnVuKGZpbGVQYXRoKS50aGVuKGNvZGUgPT4gZXhpdENvZGUgPSBjb2RlKVxuICAgICAgfSlcblxuICAgICAgcnVucygoKSA9PiB7XG4gICAgICAgIGV4cGVjdChleGl0Q29kZSkudG9CZSgwKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ2ZhaWxzIHRvIGV4ZWN1dGUgbGF0ZXhtayB3aGVuIGdpdmVuIGludmFsaWQgYXJndW1lbnRzJywgKCkgPT4ge1xuICAgICAgc3B5T24oYnVpbGRlciwgJ2NvbnN0cnVjdEFyZ3MnKS5hbmRSZXR1cm4oWyctaW52YWxpZC1hcmd1bWVudCddKVxuXG4gICAgICB3YWl0c0ZvclByb21pc2UoKCkgPT4ge1xuICAgICAgICByZXR1cm4gYnVpbGRlci5ydW4oZmlsZVBhdGgpLnRoZW4oY29kZSA9PiBleGl0Q29kZSA9IGNvZGUpXG4gICAgICB9KVxuXG4gICAgICBydW5zKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KGV4aXRDb2RlKS50b0JlKDEwKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ2ZhaWxzIHRvIGV4ZWN1dGUgbGF0ZXhtayB3aGVuIGdpdmVuIGludmFsaWQgZmlsZSBwYXRoJywgKCkgPT4ge1xuICAgICAgZmlsZVBhdGggPSBwYXRoLmpvaW4oZml4dHVyZXNQYXRoLCAnZm9vLnRleCcpXG4gICAgICBjb25zdCBhcmdzID0gYnVpbGRlci5jb25zdHJ1Y3RBcmdzKGZpbGVQYXRoKVxuXG4gICAgICAvLyBOZWVkIHRvIHJlbW92ZSB0aGUgJ2ZvcmNlJyBmbGFnIHRvIHRyaWdnZXIgdGhlIGRlc2lyZWQgZmFpbHVyZS5cbiAgICAgIGNvbnN0IHJlbW92ZWQgPSBhcmdzLnNwbGljZSgxLCAxKVxuICAgICAgZXhwZWN0KHJlbW92ZWQpLnRvRXF1YWwoWyctZiddKVxuXG4gICAgICBzcHlPbihidWlsZGVyLCAnY29uc3RydWN0QXJncycpLmFuZFJldHVybihhcmdzKVxuXG4gICAgICB3YWl0c0ZvclByb21pc2UoKCkgPT4ge1xuICAgICAgICByZXR1cm4gYnVpbGRlci5ydW4oZmlsZVBhdGgpLnRoZW4oY29kZSA9PiBleGl0Q29kZSA9IGNvZGUpXG4gICAgICB9KVxuXG4gICAgICBydW5zKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KGV4aXRDb2RlKS50b0JlKDExKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxufSlcbiJdfQ==
//# sourceURL=/home/cin_chalic/.atom/packages/latex/spec/builders/latexmk-spec.js
