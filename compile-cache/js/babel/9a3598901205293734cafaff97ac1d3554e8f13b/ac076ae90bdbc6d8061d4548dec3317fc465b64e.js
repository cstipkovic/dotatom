function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

require("../spec-helpers");

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _libParsersLogParser = require("../../lib/parsers/log-parser");

var _libParsersLogParser2 = _interopRequireDefault(_libParsersLogParser);

"use babel";

describe("LogParser", function () {
  var fixturesPath = undefined;

  beforeEach(function () {
    fixturesPath = atom.project.getPaths()[0];
  });

  describe("parse", function () {
    it("returns the expected output path", function () {
      var logFile = _path2["default"].join(fixturesPath, "file.log");
      var parser = new _libParsersLogParser2["default"](logFile);
      var result = parser.parse();
      var outputFilePath = _path2["default"].posix.resolve(result.outputFilePath);

      expect(outputFilePath).toBe("/foo/output/file.pdf");
    });

    it("parses and returns all errors", function () {
      var logFile = _path2["default"].join(fixturesPath, "errors.log");
      var parser = new _libParsersLogParser2["default"](logFile);
      var result = parser.parse();

      expect(result.errors.length).toBe(3);
    });

    it("associates an error with a file path, line number, and message", function () {
      var logFile = _path2["default"].join(fixturesPath, "errors.log");
      var parser = new _libParsersLogParser2["default"](logFile);
      var result = parser.parse();
      var error = result.errors[0];

      expect(error).toEqual({
        logPosition: [196, 0],
        filePath: "./errors.tex",
        lineNumber: 10,
        message: "\\begin{gather*} on input line 8 ended by \\end{gather}"
      });
    });
  });

  describe("getLines", function () {
    it("returns the expected number of lines", function () {
      var logFile = _path2["default"].join(fixturesPath, "file.log");
      var parser = new _libParsersLogParser2["default"](logFile);
      var lines = parser.getLines();

      expect(lines.length).toBe(63);
    });

    it("throws an error when passed a filepath that doesn't exist", function () {
      var logFile = _path2["default"].join(fixturesPath, "nope.log");
      var parser = new _libParsersLogParser2["default"](logFile);

      expect(parser.getLines).toThrow();
    });
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvc3BlYy9wYXJzZXJzL2xvZy1wYXJzZXItc3BlYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztRQUVPLGlCQUFpQjs7b0JBRVAsTUFBTTs7OzttQ0FDRCw4QkFBOEI7Ozs7QUFMcEQsV0FBVyxDQUFDOztBQU9aLFFBQVEsQ0FBQyxXQUFXLEVBQUUsWUFBVztBQUMvQixNQUFJLFlBQVksWUFBQSxDQUFDOztBQUVqQixZQUFVLENBQUMsWUFBVztBQUNwQixnQkFBWSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7R0FDM0MsQ0FBQyxDQUFDOztBQUVILFVBQVEsQ0FBQyxPQUFPLEVBQUUsWUFBVztBQUMzQixNQUFFLENBQUMsa0NBQWtDLEVBQUUsWUFBVztBQUNoRCxVQUFNLE9BQU8sR0FBRyxrQkFBSyxJQUFJLENBQUMsWUFBWSxFQUFFLFVBQVUsQ0FBQyxDQUFDO0FBQ3BELFVBQU0sTUFBTSxHQUFHLHFDQUFjLE9BQU8sQ0FBQyxDQUFDO0FBQ3RDLFVBQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUM5QixVQUFNLGNBQWMsR0FBRyxrQkFBSyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQzs7QUFFakUsWUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0tBQ3JELENBQUMsQ0FBQzs7QUFFSCxNQUFFLENBQUMsK0JBQStCLEVBQUUsWUFBVztBQUM3QyxVQUFNLE9BQU8sR0FBRyxrQkFBSyxJQUFJLENBQUMsWUFBWSxFQUFFLFlBQVksQ0FBQyxDQUFDO0FBQ3RELFVBQU0sTUFBTSxHQUFHLHFDQUFjLE9BQU8sQ0FBQyxDQUFDO0FBQ3RDLFVBQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQzs7QUFFOUIsWUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ3RDLENBQUMsQ0FBQzs7QUFFSCxNQUFFLENBQUMsZ0VBQWdFLEVBQUUsWUFBVztBQUM5RSxVQUFNLE9BQU8sR0FBRyxrQkFBSyxJQUFJLENBQUMsWUFBWSxFQUFFLFlBQVksQ0FBQyxDQUFDO0FBQ3RELFVBQU0sTUFBTSxHQUFHLHFDQUFjLE9BQU8sQ0FBQyxDQUFDO0FBQ3RDLFVBQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUM5QixVQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDOztBQUUvQixZQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDO0FBQ3BCLG1CQUFXLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO0FBQ3JCLGdCQUFRLEVBQUUsY0FBYztBQUN4QixrQkFBVSxFQUFFLEVBQUU7QUFDZCxlQUFPLEVBQUUseURBQXlEO09BQ25FLENBQUMsQ0FBQztLQUNKLENBQUMsQ0FBQztHQUNKLENBQUMsQ0FBQzs7QUFFSCxVQUFRLENBQUMsVUFBVSxFQUFFLFlBQVc7QUFDOUIsTUFBRSxDQUFDLHNDQUFzQyxFQUFFLFlBQVc7QUFDcEQsVUFBTSxPQUFPLEdBQUcsa0JBQUssSUFBSSxDQUFDLFlBQVksRUFBRSxVQUFVLENBQUMsQ0FBQztBQUNwRCxVQUFNLE1BQU0sR0FBRyxxQ0FBYyxPQUFPLENBQUMsQ0FBQztBQUN0QyxVQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUM7O0FBRWhDLFlBQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0tBQy9CLENBQUMsQ0FBQzs7QUFFSCxNQUFFLENBQUMsMkRBQTJELEVBQUUsWUFBVztBQUN6RSxVQUFNLE9BQU8sR0FBRyxrQkFBSyxJQUFJLENBQUMsWUFBWSxFQUFFLFVBQVUsQ0FBQyxDQUFDO0FBQ3BELFVBQU0sTUFBTSxHQUFHLHFDQUFjLE9BQU8sQ0FBQyxDQUFDOztBQUV0QyxZQUFNLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO0tBQ25DLENBQUMsQ0FBQztHQUNKLENBQUMsQ0FBQztDQUNKLENBQUMsQ0FBQyIsImZpbGUiOiIvaG9tZS9jaW5fY2hhbGljLy5hdG9tL3BhY2thZ2VzL2xhdGV4L3NwZWMvcGFyc2Vycy9sb2ctcGFyc2VyLXNwZWMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBiYWJlbFwiO1xuXG5pbXBvcnQgXCIuLi9zcGVjLWhlbHBlcnNcIjtcblxuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcbmltcG9ydCBMb2dQYXJzZXIgZnJvbSBcIi4uLy4uL2xpYi9wYXJzZXJzL2xvZy1wYXJzZXJcIjtcblxuZGVzY3JpYmUoXCJMb2dQYXJzZXJcIiwgZnVuY3Rpb24oKSB7XG4gIGxldCBmaXh0dXJlc1BhdGg7XG5cbiAgYmVmb3JlRWFjaChmdW5jdGlvbigpIHtcbiAgICBmaXh0dXJlc1BhdGggPSBhdG9tLnByb2plY3QuZ2V0UGF0aHMoKVswXTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoXCJwYXJzZVwiLCBmdW5jdGlvbigpIHtcbiAgICBpdChcInJldHVybnMgdGhlIGV4cGVjdGVkIG91dHB1dCBwYXRoXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgbG9nRmlsZSA9IHBhdGguam9pbihmaXh0dXJlc1BhdGgsIFwiZmlsZS5sb2dcIik7XG4gICAgICBjb25zdCBwYXJzZXIgPSBuZXcgTG9nUGFyc2VyKGxvZ0ZpbGUpO1xuICAgICAgY29uc3QgcmVzdWx0ID0gcGFyc2VyLnBhcnNlKCk7XG4gICAgICBjb25zdCBvdXRwdXRGaWxlUGF0aCA9IHBhdGgucG9zaXgucmVzb2x2ZShyZXN1bHQub3V0cHV0RmlsZVBhdGgpO1xuXG4gICAgICBleHBlY3Qob3V0cHV0RmlsZVBhdGgpLnRvQmUoXCIvZm9vL291dHB1dC9maWxlLnBkZlwiKTtcbiAgICB9KTtcblxuICAgIGl0KFwicGFyc2VzIGFuZCByZXR1cm5zIGFsbCBlcnJvcnNcIiwgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBsb2dGaWxlID0gcGF0aC5qb2luKGZpeHR1cmVzUGF0aCwgXCJlcnJvcnMubG9nXCIpO1xuICAgICAgY29uc3QgcGFyc2VyID0gbmV3IExvZ1BhcnNlcihsb2dGaWxlKTtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IHBhcnNlci5wYXJzZSgpO1xuXG4gICAgICBleHBlY3QocmVzdWx0LmVycm9ycy5sZW5ndGgpLnRvQmUoMyk7XG4gICAgfSk7XG5cbiAgICBpdChcImFzc29jaWF0ZXMgYW4gZXJyb3Igd2l0aCBhIGZpbGUgcGF0aCwgbGluZSBudW1iZXIsIGFuZCBtZXNzYWdlXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgbG9nRmlsZSA9IHBhdGguam9pbihmaXh0dXJlc1BhdGgsIFwiZXJyb3JzLmxvZ1wiKTtcbiAgICAgIGNvbnN0IHBhcnNlciA9IG5ldyBMb2dQYXJzZXIobG9nRmlsZSk7XG4gICAgICBjb25zdCByZXN1bHQgPSBwYXJzZXIucGFyc2UoKTtcbiAgICAgIGNvbnN0IGVycm9yID0gcmVzdWx0LmVycm9yc1swXTtcblxuICAgICAgZXhwZWN0KGVycm9yKS50b0VxdWFsKHtcbiAgICAgICAgbG9nUG9zaXRpb246IFsxOTYsIDBdLFxuICAgICAgICBmaWxlUGF0aDogXCIuL2Vycm9ycy50ZXhcIixcbiAgICAgICAgbGluZU51bWJlcjogMTAsXG4gICAgICAgIG1lc3NhZ2U6IFwiXFxcXGJlZ2lue2dhdGhlcip9IG9uIGlucHV0IGxpbmUgOCBlbmRlZCBieSBcXFxcZW5ke2dhdGhlcn1cIixcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZShcImdldExpbmVzXCIsIGZ1bmN0aW9uKCkge1xuICAgIGl0KFwicmV0dXJucyB0aGUgZXhwZWN0ZWQgbnVtYmVyIG9mIGxpbmVzXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgbG9nRmlsZSA9IHBhdGguam9pbihmaXh0dXJlc1BhdGgsIFwiZmlsZS5sb2dcIik7XG4gICAgICBjb25zdCBwYXJzZXIgPSBuZXcgTG9nUGFyc2VyKGxvZ0ZpbGUpO1xuICAgICAgY29uc3QgbGluZXMgPSBwYXJzZXIuZ2V0TGluZXMoKTtcblxuICAgICAgZXhwZWN0KGxpbmVzLmxlbmd0aCkudG9CZSg2Myk7XG4gICAgfSk7XG5cbiAgICBpdChcInRocm93cyBhbiBlcnJvciB3aGVuIHBhc3NlZCBhIGZpbGVwYXRoIHRoYXQgZG9lc24ndCBleGlzdFwiLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IGxvZ0ZpbGUgPSBwYXRoLmpvaW4oZml4dHVyZXNQYXRoLCBcIm5vcGUubG9nXCIpO1xuICAgICAgY29uc3QgcGFyc2VyID0gbmV3IExvZ1BhcnNlcihsb2dGaWxlKTtcblxuICAgICAgZXhwZWN0KHBhcnNlci5nZXRMaW5lcykudG9UaHJvdygpO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuIl19
//# sourceURL=/home/cin_chalic/.atom/packages/latex/spec/parsers/log-parser-spec.js
