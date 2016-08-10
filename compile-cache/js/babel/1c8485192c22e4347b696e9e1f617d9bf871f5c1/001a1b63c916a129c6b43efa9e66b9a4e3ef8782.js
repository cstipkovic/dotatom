function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _specHelpers = require("../spec-helpers");

var _specHelpers2 = _interopRequireDefault(_specHelpers);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _libBuildersLatexmk = require("../../lib/builders/latexmk");

var _libBuildersLatexmk2 = _interopRequireDefault(_libBuildersLatexmk);

"use babel";

describe("LatexmkBuilder", function () {
  var builder = undefined,
      fixturesPath = undefined,
      filePath = undefined,
      logFilePath = undefined;

  beforeEach(function () {
    builder = new _libBuildersLatexmk2["default"]();
    fixturesPath = _specHelpers2["default"].cloneFixtures();
    filePath = _path2["default"].join(fixturesPath, "file.tex");
    logFilePath = _path2["default"].join(fixturesPath, "file.log");
  });

  describe("constructArgs", function () {
    it("produces default arguments when package has default config values", function () {
      var expectedArgs = ["-interaction=nonstopmode", "-f", "-cd", "-pdf", "-synctex=1", "-file-line-error", "\"" + filePath + "\""];
      var args = builder.constructArgs(filePath);

      expect(args).toEqual(expectedArgs);
    });

    it("adds -shell-escape flag when package config value is set", function () {
      _specHelpers2["default"].spyOnConfig("latex.enableShellEscape", true);
      expect(builder.constructArgs(filePath)).toContain("-shell-escape");
    });

    it("adds -outdir=<path> argument according to package config", function () {
      var outdir = "bar";
      var expectedArg = "-outdir=\"" + _path2["default"].join(fixturesPath, outdir) + "\"";
      _specHelpers2["default"].spyOnConfig("latex.outputDirectory", outdir);

      expect(builder.constructArgs(filePath)).toContain(expectedArg);
    });

    it("adds engine argument according to package config", function () {
      _specHelpers2["default"].spyOnConfig("latex.engine", "lualatex");
      expect(builder.constructArgs(filePath)).toContain("-lualatex");
    });

    it("adds a custom engine string according to package config", function () {
      _specHelpers2["default"].spyOnConfig("latex.customEngine", "pdflatex %O %S");
      expect(builder.constructArgs(filePath)).toContain("-pdflatex=\"pdflatex %O %S\"");
    });
  });

  describe("parseLogFile", function () {
    var logParser = undefined;

    beforeEach(function () {
      logParser = jasmine.createSpyObj("MockLogParser", ["parse"]);
      spyOn(builder, "getLogParser").andReturn(logParser);
    });

    it("resolves the associated log file path by invoking @resolveLogFilePath", function () {
      spyOn(builder, "resolveLogFilePath").andReturn("foo.log");
      builder.parseLogFile(filePath);

      expect(builder.resolveLogFilePath).toHaveBeenCalledWith(filePath);
    });

    it("returns null if passed a file path that does not exist", function () {
      filePath = "/foo/bar/quux.tex";
      var result = builder.parseLogFile(filePath);

      expect(result).toBeNull();
      expect(logParser.parse).not.toHaveBeenCalled();
    });

    it("attempts to parse the resolved log file", function () {
      builder.parseLogFile(filePath);

      expect(builder.getLogParser).toHaveBeenCalledWith(logFilePath);
      expect(logParser.parse).toHaveBeenCalled();
    });
  });

  describe("run", function () {
    var exitCode = undefined;

    it("successfully executes latexmk when given a valid TeX file", function () {
      waitsForPromise(function () {
        return builder.run(filePath).then(function (code) {
          return exitCode = code;
        });
      });

      runs(function () {
        expect(exitCode).toBe(0);
      });
    });

    it("successfully executes latexmk when given a file path containing spaces", function () {
      filePath = _path2["default"].join(fixturesPath, "filename with spaces.tex");

      waitsForPromise(function () {
        return builder.run(filePath).then(function (code) {
          return exitCode = code;
        });
      });

      runs(function () {
        expect(exitCode).toBe(0);
      });
    });

    it("fails to execute latexmk when given invalid arguments", function () {
      spyOn(builder, "constructArgs").andReturn(["-invalid-argument"]);

      waitsForPromise(function () {
        return builder.run(filePath).then(function (code) {
          return exitCode = code;
        });
      });

      runs(function () {
        expect(exitCode).toBe(10);
      });
    });

    it("fails to execute latexmk when given invalid file path", function () {
      filePath = _path2["default"].join(fixturesPath, "foo.tex");
      var args = builder.constructArgs(filePath);

      // Need to remove the "force" flag to trigger the desired failure.
      var removed = args.splice(1, 1);
      expect(removed).toEqual(["-f"]);

      spyOn(builder, "constructArgs").andReturn(args);

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvc3BlYy9idWlsZGVycy9sYXRleG1rLXNwZWMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7MkJBRW9CLGlCQUFpQjs7OztvQkFDcEIsTUFBTTs7OztrQ0FDSSw0QkFBNEI7Ozs7QUFKdkQsV0FBVyxDQUFDOztBQU1aLFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRSxZQUFXO0FBQ3BDLE1BQUksT0FBTyxZQUFBO01BQUUsWUFBWSxZQUFBO01BQUUsUUFBUSxZQUFBO01BQUUsV0FBVyxZQUFBLENBQUM7O0FBRWpELFlBQVUsQ0FBQyxZQUFXO0FBQ3BCLFdBQU8sR0FBRyxxQ0FBb0IsQ0FBQztBQUMvQixnQkFBWSxHQUFHLHlCQUFRLGFBQWEsRUFBRSxDQUFDO0FBQ3ZDLFlBQVEsR0FBRyxrQkFBSyxJQUFJLENBQUMsWUFBWSxFQUFFLFVBQVUsQ0FBQyxDQUFDO0FBQy9DLGVBQVcsR0FBRyxrQkFBSyxJQUFJLENBQUMsWUFBWSxFQUFFLFVBQVUsQ0FBQyxDQUFDO0dBQ25ELENBQUMsQ0FBQzs7QUFFSCxVQUFRLENBQUMsZUFBZSxFQUFFLFlBQVc7QUFDbkMsTUFBRSxDQUFDLG1FQUFtRSxFQUFFLFlBQVc7QUFDakYsVUFBTSxZQUFZLEdBQUcsQ0FDbkIsMEJBQTBCLEVBQzFCLElBQUksRUFDSixLQUFLLEVBQ0wsTUFBTSxFQUNOLFlBQVksRUFDWixrQkFBa0IsU0FDZCxRQUFRLFFBQ2IsQ0FBQztBQUNGLFVBQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7O0FBRTdDLFlBQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7S0FDcEMsQ0FBQyxDQUFDOztBQUVILE1BQUUsQ0FBQywwREFBMEQsRUFBRSxZQUFXO0FBQ3hFLCtCQUFRLFdBQVcsQ0FBQyx5QkFBeUIsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUNyRCxZQUFNLENB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QUNKLENBQUMsQ0FBQzs7QUFFSCxNQUFFLENBQUMsdURBQXVELEVBQUUsWUFBVztBQUNyRSxjQUFRLEdBQUcsa0JBQUssSUFBSSxDQUFDLFlBQVksRUFBRSxTQUFTLENBQUMsQ0FBQztBQUM5QyxVQUFNLElBQUksR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDOzs7QUFHN0MsVUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDbEMsWUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7O0FBRWhDLFdBQUssQ0FBQyxPQUFPLEVBQUUsZUFBZSxDQUFDLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDOztBQUVoRCxxQkFBZSxDQUFDLFlBQVc7QUFDekIsZUFBTyxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFBLElBQUk7aUJBQUksUUFBUSxHQUFHLElBQUk7U0FBQSxDQUFDLENBQUM7T0FDNUQsQ0FBQyxDQUFDOztBQUVILFVBQUksQ0FBQyxZQUFXO0FBQ2QsY0FBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztPQUMzQixDQUFDLENBQUM7S0FDSixDQUFDLENBQUM7R0FDSixDQUFDLENBQUM7Q0FDSixDQUFDLENBQUMiLCJmaWxlIjoiL2hvbWUvY2luX2NoYWxpYy8uYXRvbS9wYWNrYWdlcy9sYXRleC9zcGVjL2J1aWxkZXJzL2xhdGV4bWstc3BlYy5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIGJhYmVsXCI7XG5cbmltcG9ydCBoZWxwZXJzIGZyb20gXCIuLi9zcGVjLWhlbHBlcnNcIjtcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgTGF0ZXhta0J1aWxkZXIgZnJvbSBcIi4uLy4uL2xpYi9idWlsZGVycy9sYXRleG1rXCI7XG5cbmRlc2NyaWJlKFwiTGF0ZXhta0J1aWxkZXJcIiwgZnVuY3Rpb24oKSB7XG4gIGxldCBidWlsZGVyLCBmaXh0dXJlc1BhdGgsIGZpbGVQYXRoLCBsb2dGaWxlUGF0aDtcblxuICBiZWZvcmVFYWNoKGZ1bmN0aW9uKCkge1xuICAgIGJ1aWxkZXIgPSBuZXcgTGF0ZXhta0J1aWxkZXIoKTtcbiAgICBmaXh0dXJlc1BhdGggPSBoZWxwZXJzLmNsb25lRml4dHVyZXMoKTtcbiAgICBmaWxlUGF0aCA9IHBhdGguam9pbihmaXh0dXJlc1BhdGgsIFwiZmlsZS50ZXhcIik7XG4gICAgbG9nRmlsZVBhdGggPSBwYXRoLmpvaW4oZml4dHVyZXNQYXRoLCBcImZpbGUubG9nXCIpO1xuICB9KTtcblxuICBkZXNjcmliZShcImNvbnN0cnVjdEFyZ3NcIiwgZnVuY3Rpb24oKSB7XG4gICAgaXQoXCJwcm9kdWNlcyBkZWZhdWx0IGFyZ3VtZW50cyB3aGVuIHBhY2thZ2UgaGFzIGRlZmF1bHQgY29uZmlnIHZhbHVlc1wiLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IGV4cGVjdGVkQXJncyA9IFtcbiAgICAgICAgXCItaW50ZXJhY3Rpb249bm9uc3RvcG1vZGVcIixcbiAgICAgICAgXCItZlwiLFxuICAgICAgICBcIi1jZFwiLFxuICAgICAgICBcIi1wZGZcIixcbiAgICAgICAgXCItc3luY3RleD0xXCIsXG4gICAgICAgIFwiLWZpbGUtbGluZS1lcnJvclwiLFxuICAgICAgICBgXCIke2ZpbGVQYXRofVwiYCxcbiAgICAgIF07XG4gICAgICBjb25zdCBhcmdzID0gYnVpbGRlci5jb25zdHJ1Y3RBcmdzKGZpbGVQYXRoKTtcblxuICAgICAgZXhwZWN0KGFyZ3MpLnRvRXF1YWwoZXhwZWN0ZWRBcmdzKTtcbiAgICB9KTtcblxuICAgIGl0KFwiYWRkcyAtc2hlbGwtZXNjYXBlIGZsYWcgd2hlbiBwYWNrYWdlIGNvbmZpZyB2YWx1ZSBpcyBzZXRcIiwgZnVuY3Rpb24oKSB7XG4gICAgICBoZWxwZXJzLnNweU9uQ29uZmlnKFwibGF0ZXguZW5hYmxlU2hlbGxFc2NhcGVcIiwgdHJ1ZSk7XG4gICAgICBleHBlY3QoYnVpbGRlci5jb25zdHJ1Y3RBcmdzKGZpbGVQYXRoKSkudG9Db250YWluKFwiLXNoZWxsLWVzY2FwZVwiKTtcbiAgICB9KTtcblxuICAgIGl0KFwiYWRkcyAtb3V0ZGlyPTxwYXRoPiBhcmd1bWVudCBhY2NvcmRpbmcgdG8gcGFja2FnZSBjb25maWdcIiwgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBvdXRkaXIgPSBcImJhclwiO1xuICAgICAgY29uc3QgZXhwZWN0ZWRBcmcgPSBgLW91dGRpcj1cIiR7cGF0aC5qb2luKGZpeHR1cmVzUGF0aCwgb3V0ZGlyKX1cImA7XG4gICAgICBoZWxwZXJzLnNweU9uQ29uZmlnKFwibGF0ZXgub3V0cHV0RGlyZWN0b3J5XCIsIG91dGRpcik7XG5cbiAgICAgIGV4cGVjdChidWlsZGVyLmNvbnN0cnVjdEFyZ3MoZmlsZVBhdGgpKS50b0NvbnRhaW4oZXhwZWN0ZWRBcmcpO1xuICAgIH0pO1xuXG4gICAgaXQoXCJhZGRzIGVuZ2luZSBhcmd1bWVudCBhY2NvcmRpbmcgdG8gcGFja2FnZSBjb25maWdcIiwgZnVuY3Rpb24oKSB7XG4gICAgICBoZWxwZXJzLnNweU9uQ29uZmlnKFwibGF0ZXguZW5naW5lXCIsIFwibHVhbGF0ZXhcIik7XG4gICAgICBleHBlY3QoYnVpbGRlci5jb25zdHJ1Y3RBcmdzKGZpbGVQYXRoKSkudG9Db250YWluKFwiLWx1YWxhdGV4XCIpO1xuICAgIH0pO1xuXG4gICAgaXQoXCJhZGRzIGEgY3VzdG9tIGVuZ2luZSBzdHJpbmcgYWNjb3JkaW5nIHRvIHBhY2thZ2UgY29uZmlnXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgaGVscGVycy5zcHlPbkNvbmZpZyhcImxhdGV4LmN1c3RvbUVuZ2luZVwiLCBcInBkZmxhdGV4ICVPICVTXCIpO1xuICAgICAgZXhwZWN0KGJ1aWxkZXIuY29uc3RydWN0QXJncyhmaWxlUGF0aCkpLnRvQ29udGFpbihcIi1wZGZsYXRleD1cXFwicGRmbGF0ZXggJU8gJVNcXFwiXCIpO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZShcInBhcnNlTG9nRmlsZVwiLCBmdW5jdGlvbigpIHtcbiAgICBsZXQgbG9nUGFyc2VyO1xuXG4gICAgYmVmb3JlRWFjaChmdW5jdGlvbigpIHtcbiAgICAgIGxvZ1BhcnNlciA9IGphc21pbmUuY3JlYXRlU3B5T2JqKFwiTW9ja0xvZ1BhcnNlclwiLCBbXCJwYXJzZVwiXSk7XG4gICAgICBzcHlPbihidWlsZGVyLCBcImdldExvZ1BhcnNlclwiKS5hbmRSZXR1cm4obG9nUGFyc2VyKTtcbiAgICB9KTtcblxuICAgIGl0KFwicmVzb2x2ZXMgdGhlIGFzc29jaWF0ZWQgbG9nIGZpbGUgcGF0aCBieSBpbnZva2luZyBAcmVzb2x2ZUxvZ0ZpbGVQYXRoXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgc3B5T24oYnVpbGRlciwgXCJyZXNvbHZlTG9nRmlsZVBhdGhcIikuYW5kUmV0dXJuKFwiZm9vLmxvZ1wiKTtcbiAgICAgIGJ1aWxkZXIucGFyc2VMb2dGaWxlKGZpbGVQYXRoKTtcblxuICAgICAgZXhwZWN0KGJ1aWxkZXIucmVzb2x2ZUxvZ0ZpbGVQYXRoKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChmaWxlUGF0aCk7XG4gICAgfSk7XG5cbiAgICBpdChcInJldHVybnMgbnVsbCBpZiBwYXNzZWQgYSBmaWxlIHBhdGggdGhhdCBkb2VzIG5vdCBleGlzdFwiLCBmdW5jdGlvbigpIHtcbiAgICAgIGZpbGVQYXRoID0gXCIvZm9vL2Jhci9xdXV4LnRleFwiO1xuICAgICAgY29uc3QgcmVzdWx0ID0gYnVpbGRlci5wYXJzZUxvZ0ZpbGUoZmlsZVBhdGgpO1xuXG4gICAgICBleHBlY3QocmVzdWx0KS50b0JlTnVsbCgpO1xuICAgICAgZXhwZWN0KGxvZ1BhcnNlci5wYXJzZSkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKTtcbiAgICB9KTtcblxuICAgIGl0KFwiYXR0ZW1wdHMgdG8gcGFyc2UgdGhlIHJlc29sdmVkIGxvZyBmaWxlXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgYnVpbGRlci5wYXJzZUxvZ0ZpbGUoZmlsZVBhdGgpO1xuXG4gICAgICBleHBlY3QoYnVpbGRlci5nZXRMb2dQYXJzZXIpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKGxvZ0ZpbGVQYXRoKTtcbiAgICAgIGV4cGVjdChsb2dQYXJzZXIucGFyc2UpLnRvSGF2ZUJlZW5DYWxsZWQoKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoXCJydW5cIiwgZnVuY3Rpb24oKSB7XG4gICAgbGV0IGV4aXRDb2RlO1xuXG4gICAgaXQoXCJzdWNjZXNzZnVsbHkgZXhlY3V0ZXMgbGF0ZXhtayB3aGVuIGdpdmVuIGEgdmFsaWQgVGVYIGZpbGVcIiwgZnVuY3Rpb24oKSB7XG4gICAgICB3YWl0c0ZvclByb21pc2UoZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBidWlsZGVyLnJ1bihmaWxlUGF0aCkudGhlbihjb2RlID0+IGV4aXRDb2RlID0gY29kZSk7XG4gICAgICB9KTtcblxuICAgICAgcnVucyhmdW5jdGlvbigpIHtcbiAgICAgICAgZXhwZWN0KGV4aXRDb2RlKS50b0JlKDApO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdChcInN1Y2Nlc3NmdWxseSBleGVjdXRlcyBsYXRleG1rIHdoZW4gZ2l2ZW4gYSBmaWxlIHBhdGggY29udGFpbmluZyBzcGFjZXNcIiwgZnVuY3Rpb24oKSB7XG4gICAgICBmaWxlUGF0aCA9IHBhdGguam9pbihmaXh0dXJlc1BhdGgsIFwiZmlsZW5hbWUgd2l0aCBzcGFjZXMudGV4XCIpO1xuXG4gICAgICB3YWl0c0ZvclByb21pc2UoZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBidWlsZGVyLnJ1bihmaWxlUGF0aCkudGhlbihjb2RlID0+IGV4aXRDb2RlID0gY29kZSk7XG4gICAgICB9KTtcblxuICAgICAgcnVucyhmdW5jdGlvbigpIHtcbiAgICAgICAgZXhwZWN0KGV4aXRDb2RlKS50b0JlKDApO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdChcImZhaWxzIHRvIGV4ZWN1dGUgbGF0ZXhtayB3aGVuIGdpdmVuIGludmFsaWQgYXJndW1lbnRzXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgc3B5T24oYnVpbGRlciwgXCJjb25zdHJ1Y3RBcmdzXCIpLmFuZFJldHVybihbXCItaW52YWxpZC1hcmd1bWVudFwiXSk7XG5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZShmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIGJ1aWxkZXIucnVuKGZpbGVQYXRoKS50aGVuKGNvZGUgPT4gZXhpdENvZGUgPSBjb2RlKTtcbiAgICAgIH0pO1xuXG4gICAgICBydW5zKGZ1bmN0aW9uKCkge1xuICAgICAgICBleHBlY3QoZXhpdENvZGUpLnRvQmUoMTApO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdChcImZhaWxzIHRvIGV4ZWN1dGUgbGF0ZXhtayB3aGVuIGdpdmVuIGludmFsaWQgZmlsZSBwYXRoXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgZmlsZVBhdGggPSBwYXRoLmpvaW4oZml4dHVyZXNQYXRoLCBcImZvby50ZXhcIik7XG4gICAgICBjb25zdCBhcmdzID0gYnVpbGRlci5jb25zdHJ1Y3RBcmdzKGZpbGVQYXRoKTtcblxuICAgICAgLy8gTmVlZCB0byByZW1vdmUgdGhlIFwiZm9yY2VcIiBmbGFnIHRvIHRyaWdnZXIgdGhlIGRlc2lyZWQgZmFpbHVyZS5cbiAgICAgIGNvbnN0IHJlbW92ZWQgPSBhcmdzLnNwbGljZSgxLCAxKTtcbiAgICAgIGV4cGVjdChyZW1vdmVkKS50b0VxdWFsKFtcIi1mXCJdKTtcblxuICAgICAgc3B5T24oYnVpbGRlciwgXCJjb25zdHJ1Y3RBcmdzXCIpLmFuZFJldHVybihhcmdzKTtcblxuICAgICAgd2FpdHNGb3JQcm9taXNlKGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gYnVpbGRlci5ydW4oZmlsZVBhdGgpLnRoZW4oY29kZSA9PiBleGl0Q29kZSA9IGNvZGUpO1xuICAgICAgfSk7XG5cbiAgICAgIHJ1bnMoZnVuY3Rpb24oKSB7XG4gICAgICAgIGV4cGVjdChleGl0Q29kZSkudG9CZSgxMSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==