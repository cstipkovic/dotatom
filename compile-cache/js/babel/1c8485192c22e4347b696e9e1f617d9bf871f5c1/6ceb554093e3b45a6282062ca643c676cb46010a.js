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
      filePath = undefined;

  beforeEach(function () {
    builder = new _libBuildersLatexmk2["default"]();
    fixturesPath = _specHelpers2["default"].cloneFixtures();
    filePath = _path2["default"].join(fixturesPath, "file.tex");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvc3BlYy9idWlsZGVycy9sYXRleG1rLXNwZWMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7MkJBRW9CLGlCQUFpQjs7OztvQkFDcEIsTUFBTTs7OztrQ0FDSSw0QkFBNEI7Ozs7QUFKdkQsV0FBVyxDQUFDOztBQU1aLFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRSxZQUFXO0FBQ3BDLE1BQUksT0FBTyxZQUFBO01BQUUsWUFBWSxZQUFBO01BQUUsUUFBUSxZQUFBLENBQUM7O0FBRXBDLFlBQVUsQ0FBQyxZQUFXO0FBQ3BCLFdBQU8sR0FBRyxxQ0FBb0IsQ0FBQztBQUMvQixnQkFBWSxHQUFHLHlCQUFRLGFBQWEsRUFBRSxDQUFDO0FBQ3ZDLFlBQVEsR0FBRyxrQkFBSyxJQUFJLENBQUMsWUFBWSxFQUFFLFVBQVUsQ0FBQyxDQUFDO0dBQ2hELENBQUMsQ0FBQzs7QUFFSCxVQUFRLENBQUMsZUFBZSxFQUFFLFlBQVc7QUFDbkMsTUFBRSxDQUFDLG1FQUFtRSxFQUFFLFlBQVc7QUFDakYsVUFBTSxZQUFZLEdBQUcsQ0FDbkIsMEJBQTBCLEVBQzFCLElBQUksRUFDSixLQUFLLEVBQ0wsTUFBTSxFQUNOLFlBQVksRUFDWixrQkFBa0IsU0FDZCxRQUFRLFFBQ2IsQ0FBQztBQUNGLFVBQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7O0FBRTdDLFlBQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7S0FDcEMsQ0FBQyxDQUFDOztBQUVILE1BQUUsQ0FBQywwREFBMEQsRUFBRSxZQUFXO0FBQ3hFLCtCQUFRLFdBQVcsQ0FBQyx5QkFBeUIsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUNyRCxZQUFNLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxlQUFlLENBQUMsQ0FBQztLQUNw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QU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7OztBQUc3QyxVQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNsQyxZQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQzs7QUFFaEMsV0FBSyxDQUFDLE9BQU8sRUFBRSxlQUFlLENBQUMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRWhELHFCQUFlLENBQUMsWUFBVztBQUN6QixlQUFPLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUEsSUFBSTtpQkFBSSxRQUFRLEdBQUcsSUFBSTtTQUFBLENBQUMsQ0FBQztPQUM1RCxDQUFDLENBQUM7O0FBRUgsVUFBSSxDQUFDLFlBQVc7QUFDZCxjQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO09BQzNCLENBQUMsQ0FBQztLQUNKLENBQUMsQ0FBQztHQUNKLENBQUMsQ0FBQztDQUNKLENBQUMsQ0FBQyIsImZpbGUiOiIvaG9tZS9jaW5fY2hhbGljLy5hdG9tL3BhY2thZ2VzL2xhdGV4L3NwZWMvYnVpbGRlcnMvbGF0ZXhtay1zcGVjLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2UgYmFiZWxcIjtcblxuaW1wb3J0IGhlbHBlcnMgZnJvbSBcIi4uL3NwZWMtaGVscGVyc1wiO1xuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcbmltcG9ydCBMYXRleG1rQnVpbGRlciBmcm9tIFwiLi4vLi4vbGliL2J1aWxkZXJzL2xhdGV4bWtcIjtcblxuZGVzY3JpYmUoXCJMYXRleG1rQnVpbGRlclwiLCBmdW5jdGlvbigpIHtcbiAgbGV0IGJ1aWxkZXIsIGZpeHR1cmVzUGF0aCwgZmlsZVBhdGg7XG5cbiAgYmVmb3JlRWFjaChmdW5jdGlvbigpIHtcbiAgICBidWlsZGVyID0gbmV3IExhdGV4bWtCdWlsZGVyKCk7XG4gICAgZml4dHVyZXNQYXRoID0gaGVscGVycy5jbG9uZUZpeHR1cmVzKCk7XG4gICAgZmlsZVBhdGggPSBwYXRoLmpvaW4oZml4dHVyZXNQYXRoLCBcImZpbGUudGV4XCIpO1xuICB9KTtcblxuICBkZXNjcmliZShcImNvbnN0cnVjdEFyZ3NcIiwgZnVuY3Rpb24oKSB7XG4gICAgaXQoXCJwcm9kdWNlcyBkZWZhdWx0IGFyZ3VtZW50cyB3aGVuIHBhY2thZ2UgaGFzIGRlZmF1bHQgY29uZmlnIHZhbHVlc1wiLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IGV4cGVjdGVkQXJncyA9IFtcbiAgICAgICAgXCItaW50ZXJhY3Rpb249bm9uc3RvcG1vZGVcIixcbiAgICAgICAgXCItZlwiLFxuICAgICAgICBcIi1jZFwiLFxuICAgICAgICBcIi1wZGZcIixcbiAgICAgICAgXCItc3luY3RleD0xXCIsXG4gICAgICAgIFwiLWZpbGUtbGluZS1lcnJvclwiLFxuICAgICAgICBgXCIke2ZpbGVQYXRofVwiYCxcbiAgICAgIF07XG4gICAgICBjb25zdCBhcmdzID0gYnVpbGRlci5jb25zdHJ1Y3RBcmdzKGZpbGVQYXRoKTtcblxuICAgICAgZXhwZWN0KGFyZ3MpLnRvRXF1YWwoZXhwZWN0ZWRBcmdzKTtcbiAgICB9KTtcblxuICAgIGl0KFwiYWRkcyAtc2hlbGwtZXNjYXBlIGZsYWcgd2hlbiBwYWNrYWdlIGNvbmZpZyB2YWx1ZSBpcyBzZXRcIiwgZnVuY3Rpb24oKSB7XG4gICAgICBoZWxwZXJzLnNweU9uQ29uZmlnKFwibGF0ZXguZW5hYmxlU2hlbGxFc2NhcGVcIiwgdHJ1ZSk7XG4gICAgICBleHBlY3QoYnVpbGRlci5jb25zdHJ1Y3RBcmdzKGZpbGVQYXRoKSkudG9Db250YWluKFwiLXNoZWxsLWVzY2FwZVwiKTtcbiAgICB9KTtcblxuICAgIGl0KFwiYWRkcyAtb3V0ZGlyPTxwYXRoPiBhcmd1bWVudCBhY2NvcmRpbmcgdG8gcGFja2FnZSBjb25maWdcIiwgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBvdXRkaXIgPSBcImJhclwiO1xuICAgICAgY29uc3QgZXhwZWN0ZWRBcmcgPSBgLW91dGRpcj1cIiR7cGF0aC5qb2luKGZpeHR1cmVzUGF0aCwgb3V0ZGlyKX1cImA7XG4gICAgICBoZWxwZXJzLnNweU9uQ29uZmlnKFwibGF0ZXgub3V0cHV0RGlyZWN0b3J5XCIsIG91dGRpcik7XG5cbiAgICAgIGV4cGVjdChidWlsZGVyLmNvbnN0cnVjdEFyZ3MoZmlsZVBhdGgpKS50b0NvbnRhaW4oZXhwZWN0ZWRBcmcpO1xuICAgIH0pO1xuXG4gICAgaXQoXCJhZGRzIGVuZ2luZSBhcmd1bWVudCBhY2NvcmRpbmcgdG8gcGFja2FnZSBjb25maWdcIiwgZnVuY3Rpb24oKSB7XG4gICAgICBoZWxwZXJzLnNweU9uQ29uZmlnKFwibGF0ZXguZW5naW5lXCIsIFwibHVhbGF0ZXhcIik7XG4gICAgICBleHBlY3QoYnVpbGRlci5jb25zdHJ1Y3RBcmdzKGZpbGVQYXRoKSkudG9Db250YWluKFwiLWx1YWxhdGV4XCIpO1xuICAgIH0pO1xuXG4gICAgaXQoXCJhZGRzIGEgY3VzdG9tIGVuZ2luZSBzdHJpbmcgYWNjb3JkaW5nIHRvIHBhY2thZ2UgY29uZmlnXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgaGVscGVycy5zcHlPbkNvbmZpZyhcImxhdGV4LmN1c3RvbUVuZ2luZVwiLCBcInBkZmxhdGV4ICVPICVTXCIpO1xuICAgICAgZXhwZWN0KGJ1aWxkZXIuY29uc3RydWN0QXJncyhmaWxlUGF0aCkpLnRvQ29udGFpbihcIi1wZGZsYXRleD1cXFwicGRmbGF0ZXggJU8gJVNcXFwiXCIpO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZShcInJ1blwiLCBmdW5jdGlvbigpIHtcbiAgICBsZXQgZXhpdENvZGU7XG5cbiAgICBpdChcInN1Y2Nlc3NmdWxseSBleGVjdXRlcyBsYXRleG1rIHdoZW4gZ2l2ZW4gYSB2YWxpZCBUZVggZmlsZVwiLCBmdW5jdGlvbigpIHtcbiAgICAgIHdhaXRzRm9yUHJvbWlzZShmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIGJ1aWxkZXIucnVuKGZpbGVQYXRoKS50aGVuKGNvZGUgPT4gZXhpdENvZGUgPSBjb2RlKTtcbiAgICAgIH0pO1xuXG4gICAgICBydW5zKGZ1bmN0aW9uKCkge1xuICAgICAgICBleHBlY3QoZXhpdENvZGUpLnRvQmUoMCk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KFwic3VjY2Vzc2Z1bGx5IGV4ZWN1dGVzIGxhdGV4bWsgd2hlbiBnaXZlbiBhIGZpbGUgcGF0aCBjb250YWluaW5nIHNwYWNlc1wiLCBmdW5jdGlvbigpIHtcbiAgICAgIGZpbGVQYXRoID0gcGF0aC5qb2luKGZpeHR1cmVzUGF0aCwgXCJmaWxlbmFtZSB3aXRoIHNwYWNlcy50ZXhcIik7XG5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZShmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIGJ1aWxkZXIucnVuKGZpbGVQYXRoKS50aGVuKGNvZGUgPT4gZXhpdENvZGUgPSBjb2RlKTtcbiAgICAgIH0pO1xuXG4gICAgICBydW5zKGZ1bmN0aW9uKCkge1xuICAgICAgICBleHBlY3QoZXhpdENvZGUpLnRvQmUoMCk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KFwiZmFpbHMgdG8gZXhlY3V0ZSBsYXRleG1rIHdoZW4gZ2l2ZW4gaW52YWxpZCBhcmd1bWVudHNcIiwgZnVuY3Rpb24oKSB7XG4gICAgICBzcHlPbihidWlsZGVyLCBcImNvbnN0cnVjdEFyZ3NcIikuYW5kUmV0dXJuKFtcIi1pbnZhbGlkLWFyZ3VtZW50XCJdKTtcblxuICAgICAgd2FpdHNGb3JQcm9taXNlKGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gYnVpbGRlci5ydW4oZmlsZVBhdGgpLnRoZW4oY29kZSA9PiBleGl0Q29kZSA9IGNvZGUpO1xuICAgICAgfSk7XG5cbiAgICAgIHJ1bnMoZnVuY3Rpb24oKSB7XG4gICAgICAgIGV4cGVjdChleGl0Q29kZSkudG9CZSgxMCk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KFwiZmFpbHMgdG8gZXhlY3V0ZSBsYXRleG1rIHdoZW4gZ2l2ZW4gaW52YWxpZCBmaWxlIHBhdGhcIiwgZnVuY3Rpb24oKSB7XG4gICAgICBmaWxlUGF0aCA9IHBhdGguam9pbihmaXh0dXJlc1BhdGgsIFwiZm9vLnRleFwiKTtcbiAgICAgIGNvbnN0IGFyZ3MgPSBidWlsZGVyLmNvbnN0cnVjdEFyZ3MoZmlsZVBhdGgpO1xuXG4gICAgICAvLyBOZWVkIHRvIHJlbW92ZSB0aGUgXCJmb3JjZVwiIGZsYWcgdG8gdHJpZ2dlciB0aGUgZGVzaXJlZCBmYWlsdXJlLlxuICAgICAgY29uc3QgcmVtb3ZlZCA9IGFyZ3Muc3BsaWNlKDEsIDEpO1xuICAgICAgZXhwZWN0KHJlbW92ZWQpLnRvRXF1YWwoW1wiLWZcIl0pO1xuXG4gICAgICBzcHlPbihidWlsZGVyLCBcImNvbnN0cnVjdEFyZ3NcIikuYW5kUmV0dXJuKGFyZ3MpO1xuXG4gICAgICB3YWl0c0ZvclByb21pc2UoZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBidWlsZGVyLnJ1bihmaWxlUGF0aCkudGhlbihjb2RlID0+IGV4aXRDb2RlID0gY29kZSk7XG4gICAgICB9KTtcblxuICAgICAgcnVucyhmdW5jdGlvbigpIHtcbiAgICAgICAgZXhwZWN0KGV4aXRDb2RlKS50b0JlKDExKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuIl19