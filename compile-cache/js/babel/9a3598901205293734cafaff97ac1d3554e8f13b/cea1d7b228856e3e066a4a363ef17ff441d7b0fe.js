function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _libParsersMagicParser = require("../../lib/parsers/magic-parser");

var _libParsersMagicParser2 = _interopRequireDefault(_libParsersMagicParser);

"use babel";

describe("MagicParser", function () {
  var fixturesPath = undefined;

  beforeEach(function () {
    fixturesPath = atom.project.getPaths()[0];
  });

  describe("parse", function () {
    it("returns an empty object when file contains no magic comments", function () {
      var filePath = _path2["default"].join(fixturesPath, "file.tex");
      var parser = new _libParsersMagicParser2["default"](filePath);
      var result = parser.parse();

      expect(result).toEqual({});
    });

    it("returns path to root file when file contains magic root comment", function () {
      var filePath = _path2["default"].join(fixturesPath, "magic-comments", "root-comment.tex");
      var parser = new _libParsersMagicParser2["default"](filePath);
      var result = parser.parse();

      expect(result).toEqual({
        "root": "../file.tex"
      });
    });

    it("returns an empty object when magic comment is not on the first line", function () {
      var filePath = _path2["default"].join(fixturesPath, "magic-comments", "not-first-line.tex");
      var parser = new _libParsersMagicParser2["default"](filePath);
      var result = parser.parse();

      expect(result).toEqual({});
    });

    it("handles magic comments without optional whitespace", function () {
      var filePath = _path2["default"].join(fixturesPath, "magic-comments", "no-whitespace.tex");
      var parser = new _libParsersMagicParser2["default"](filePath);
      var result = parser.parse();

      expect(result).not.toEqual({});
    });
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvc3BlYy9wYXJzZXJzL21hZ2ljLXBhcnNlci1zcGVjLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O29CQUVpQixNQUFNOzs7O3FDQUNDLGdDQUFnQzs7OztBQUh4RCxXQUFXLENBQUM7O0FBS1osUUFBUSxDQUFDLGFBQWEsRUFBRSxZQUFXO0FBQ2pDLE1BQUksWUFBWSxZQUFBLENBQUM7O0FBRWpCLFlBQVUsQ0FBQyxZQUFXO0FBQ3BCLGdCQUFZLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztHQUMzQyxDQUFDLENBQUM7O0FBRUgsVUFBUSxDQUFDLE9BQU8sRUFBRSxZQUFXO0FBQzNCLE1BQUUsQ0FBQyw4REFBOEQsRUFBRSxZQUFXO0FBQzVFLFVBQU0sUUFBUSxHQUFHLGtCQUFLLElBQUksQ0FBQyxZQUFZLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFDckQsVUFBTSxNQUFNLEdBQUcsdUNBQWdCLFFBQVEsQ0FBQyxDQUFDO0FBQ3pDLFVBQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQzs7QUFFOUIsWUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztLQUM1QixDQUFDLENBQUM7O0FBRUgsTUFBRSxDQUFDLGlFQUFpRSxFQUFFLFlBQVc7QUFDL0UsVUFBTSxRQUFRLEdBQUcsa0JBQUssSUFBSSxDQUFDLFlBQVksRUFBRSxnQkFBZ0IsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO0FBQy9FLFVBQU0sTUFBTSxHQUFHLHVDQUFnQixRQUFRLENBQUMsQ0FBQztBQUN6QyxVQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7O0FBRTlCLFlBQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUM7QUFDckIsY0FBTSxFQUFFLGFBQWE7T0FDdEIsQ0FBQyxDQUFDO0tBQ0osQ0FBQyxDQUFDOztBQUVILE1BQUUsQ0FBQyxxRUFBcUUsRUFBRSxZQUFXO0FBQ25GLFVBQU0sUUFBUSxHQUFHLGtCQUFLLElBQUksQ0FBQyxZQUFZLEVBQUUsZ0JBQWdCLEVBQUUsb0JBQW9CLENBQUMsQ0FBQztBQUNqRixVQUFNLE1BQU0sR0FBRyx1Q0FBZ0IsUUFBUSxDQUFDLENBQUM7QUFDekMsVUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDOztBQUU5QixZQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0tBQzVCLENBQUMsQ0FBQzs7QUFFSCxNQUFFLENBQUMsb0RBQW9ELEVBQUUsWUFBVztBQUNsRSxVQUFNLFFBQVEsR0FBRyxrQkFBSyxJQUFJLENBQUMsWUFBWSxFQUFFLGdCQUFnQixFQUFFLG1CQUFtQixDQUFDLENBQUM7QUFDaEYsVUFBTSxNQUFNLEdBQUcsdUNBQWdCLFFBQVEsQ0FBQyxDQUFDO0FBQ3pDLFVBQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQzs7QUFFOUIsWUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7S0FDaEMsQ0FBQyxDQUFDO0dBQ0osQ0FBQyxDQUFDO0NBQ0osQ0FBQyxDQUFDIiwiZmlsZSI6Ii9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvc3BlYy9wYXJzZXJzL21hZ2ljLXBhcnNlci1zcGVjLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2UgYmFiZWxcIjtcblxuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcbmltcG9ydCBNYWdpY1BhcnNlciBmcm9tIFwiLi4vLi4vbGliL3BhcnNlcnMvbWFnaWMtcGFyc2VyXCI7XG5cbmRlc2NyaWJlKFwiTWFnaWNQYXJzZXJcIiwgZnVuY3Rpb24oKSB7XG4gIGxldCBmaXh0dXJlc1BhdGg7XG5cbiAgYmVmb3JlRWFjaChmdW5jdGlvbigpIHtcbiAgICBmaXh0dXJlc1BhdGggPSBhdG9tLnByb2plY3QuZ2V0UGF0aHMoKVswXTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoXCJwYXJzZVwiLCBmdW5jdGlvbigpIHtcbiAgICBpdChcInJldHVybnMgYW4gZW1wdHkgb2JqZWN0IHdoZW4gZmlsZSBjb250YWlucyBubyBtYWdpYyBjb21tZW50c1wiLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IGZpbGVQYXRoID0gcGF0aC5qb2luKGZpeHR1cmVzUGF0aCwgXCJmaWxlLnRleFwiKTtcbiAgICAgIGNvbnN0IHBhcnNlciA9IG5ldyBNYWdpY1BhcnNlcihmaWxlUGF0aCk7XG4gICAgICBjb25zdCByZXN1bHQgPSBwYXJzZXIucGFyc2UoKTtcblxuICAgICAgZXhwZWN0KHJlc3VsdCkudG9FcXVhbCh7fSk7XG4gICAgfSk7XG5cbiAgICBpdChcInJldHVybnMgcGF0aCB0byByb290IGZpbGUgd2hlbiBmaWxlIGNvbnRhaW5zIG1hZ2ljIHJvb3QgY29tbWVudFwiLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IGZpbGVQYXRoID0gcGF0aC5qb2luKGZpeHR1cmVzUGF0aCwgXCJtYWdpYy1jb21tZW50c1wiLCBcInJvb3QtY29tbWVudC50ZXhcIik7XG4gICAgICBjb25zdCBwYXJzZXIgPSBuZXcgTWFnaWNQYXJzZXIoZmlsZVBhdGgpO1xuICAgICAgY29uc3QgcmVzdWx0ID0gcGFyc2VyLnBhcnNlKCk7XG5cbiAgICAgIGV4cGVjdChyZXN1bHQpLnRvRXF1YWwoe1xuICAgICAgICBcInJvb3RcIjogXCIuLi9maWxlLnRleFwiLFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdChcInJldHVybnMgYW4gZW1wdHkgb2JqZWN0IHdoZW4gbWFnaWMgY29tbWVudCBpcyBub3Qgb24gdGhlIGZpcnN0IGxpbmVcIiwgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBmaWxlUGF0aCA9IHBhdGguam9pbihmaXh0dXJlc1BhdGgsIFwibWFnaWMtY29tbWVudHNcIiwgXCJub3QtZmlyc3QtbGluZS50ZXhcIik7XG4gICAgICBjb25zdCBwYXJzZXIgPSBuZXcgTWFnaWNQYXJzZXIoZmlsZVBhdGgpO1xuICAgICAgY29uc3QgcmVzdWx0ID0gcGFyc2VyLnBhcnNlKCk7XG5cbiAgICAgIGV4cGVjdChyZXN1bHQpLnRvRXF1YWwoe30pO1xuICAgIH0pO1xuXG4gICAgaXQoXCJoYW5kbGVzIG1hZ2ljIGNvbW1lbnRzIHdpdGhvdXQgb3B0aW9uYWwgd2hpdGVzcGFjZVwiLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IGZpbGVQYXRoID0gcGF0aC5qb2luKGZpeHR1cmVzUGF0aCwgXCJtYWdpYy1jb21tZW50c1wiLCBcIm5vLXdoaXRlc3BhY2UudGV4XCIpO1xuICAgICAgY29uc3QgcGFyc2VyID0gbmV3IE1hZ2ljUGFyc2VyKGZpbGVQYXRoKTtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IHBhcnNlci5wYXJzZSgpO1xuXG4gICAgICBleHBlY3QocmVzdWx0KS5ub3QudG9FcXVhbCh7fSk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=
//# sourceURL=/home/cin_chalic/.atom/packages/latex/spec/parsers/magic-parser-spec.js
