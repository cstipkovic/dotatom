function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _specHelpers = require("./spec-helpers");

var _specHelpers2 = _interopRequireDefault(_specHelpers);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _libBuilder = require("../lib/builder");

var _libBuilder2 = _interopRequireDefault(_libBuilder);

"use babel";

describe("Builder", function () {
  var builder = undefined;

  beforeEach(function () {
    builder = new _libBuilder2["default"]();
  });

  describe("constructPath", function () {
    it("reads `latex.texPath` as configured", function () {
      spyOn(atom.config, "get").andReturn();
      builder.constructPath();

      expect(atom.config.get).toHaveBeenCalledWith("latex.texPath");
    });

    it("uses platform default when `latex.texPath` is not configured", function () {
      var defaultTexPath = "/foo/bar";
      var expectedPath = [defaultTexPath, process.env.PATH].join(_path2["default"].delimiter);
      _specHelpers2["default"].spyOnConfig("latex.texPath", "");
      spyOn(builder, "defaultTexPath").andReturn(defaultTexPath);

      var constructedPath = builder.constructPath();

      expect(constructedPath).toBe(expectedPath);
    });

    it("replaces surrounded $PATH with process.env.PATH", function () {
      var texPath = "/foo:$PATH:/bar";
      var expectedPath = texPath.replace("$PATH", process.env.PATH);
      _specHelpers2["default"].spyOnConfig("latex.texPath", texPath);

      var constructedPath = builder.constructPath();

      expect(constructedPath).toBe(expectedPath);
    });

    it("replaces leading $PATH with process.env.PATH", function () {
      var texPath = "$PATH:/bar";
      var expectedPath = texPath.replace("$PATH", process.env.PATH);
      _specHelpers2["default"].spyOnConfig("latex.texPath", texPath);

      var constructedPath = builder.constructPath();

      expect(constructedPath).toBe(expectedPath);
    });

    it("replaces trailing $PATH with process.env.PATH", function () {
      var texPath = "/foo:$PATH";
      var expectedPath = texPath.replace("$PATH", process.env.PATH);
      _specHelpers2["default"].spyOnConfig("latex.texPath", texPath);

      var constructedPath = builder.constructPath();

      expect(constructedPath).toBe(expectedPath);
    });

    it("prepends process.env.PATH with texPath", function () {
      var texPath = "/foo";
      var expectedPath = [texPath, process.env.PATH].join(_path2["default"].delimiter);
      _specHelpers2["default"].spyOnConfig("latex.texPath", texPath);

      var constructedPath = builder.constructPath();

      expect(constructedPath).toBe(expectedPath);
    });
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvc3BlYy9idWlsZGVyLXNwZWMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7MkJBRW9CLGdCQUFnQjs7OztvQkFDbkIsTUFBTTs7OzswQkFDSCxnQkFBZ0I7Ozs7QUFKcEMsV0FBVyxDQUFDOztBQU1aLFFBQVEsQ0FBQyxTQUFTLEVBQUUsWUFBVztBQUM3QixNQUFJLE9BQU8sWUFBQSxDQUFDOztBQUVaLFlBQVUsQ0FBQyxZQUFXO0FBQ3BCLFdBQU8sR0FBRyw2QkFBYSxDQUFDO0dBQ3pCLENBQUMsQ0FBQzs7QUFFSCxVQUFRLENBQUMsZUFBZSxFQUFFLFlBQVc7QUFDbkMsTUFBRSxDQUFDLHFDQUFxQyxFQUFFLFlBQVc7QUFDbkQsV0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUM7QUFDdEMsYUFBTyxDQUFDLGFBQWEsRUFBRSxDQUFDOztBQUV4QixZQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxlQUFlLENBQUMsQ0FBQztLQUMvRCxDQUFDLENBQUM7O0FBRUgsTUFBRSxDQUFDLDhEQUE4RCxFQUFFLFlBQVc7QUFDNUUsVUFBTSxjQUFjLEdBQUcsVUFBVSxDQUFDO0FBQ2xDLFVBQU0sWUFBWSxHQUFHLENBQUMsY0FBYyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLGtCQUFLLFNBQVMsQ0FBQyxDQUFDO0FBQzdFLCtCQUFRLFdBQVcsQ0FBQyxlQUFlLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDekMsV0FBSyxDQUFDLE9BQU8sRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsQ0FBQzs7QUFFM0QsVUFBTSxlQUFlLEdBQUcsT0FBTyxDQUFDLGFBQWEsRUFBRSxDQUFDOztBQUVoRCxZQUFNLENBQUMsZUFBZSxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO0tBQzVDLENBQUMsQ0FBQzs7QUFFSCxNQUFFLENBQUMsaURBQWlELEVBQUUsWUFBVztBQUMvRCxVQUFNLE9BQU8sR0FBRyxpQkFBaUIsQ0FBQztBQUNsQyxVQUFNLFlBQVksR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2hFLCtCQUFRLFdBQVcsQ0FBQyxlQUFlLEVBQUUsT0FBTyxDQUFDLENBQUM7O0FBRTlDLFVBQU0sZUFBZSxHQUFHLE9BQU8sQ0FBQyxhQUFhLEVBQUUsQ0FBQzs7QUFFaEQsWUFBTSxDQUFDLGVBQWUsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztLQUM1QyxDQUFDLENBQUM7O0FBRUgsTUFBRSxDQUFDLDhDQUE4QyxFQUFFLFlBQVc7QUFDNUQsVUFBTSxPQUFPLEdBQUcsWUFBWSxDQUFDO0FBQzdCLFVBQU0sWUFBWSxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDaEUsK0JBQVEsV0FBVyxDQUFDLGVBQWUsRUFBRSxPQUFPLENBQUMsQ0FBQzs7QUFFOUMsVUFBTSxlQUFlLEdBQUcsT0FBTyxDQUFDLGFBQWEsRUFBRSxDQUFDOztBQUVoRCxZQUFNLENBQUMsZUFBZSxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO0tBQzVDLENBQUMsQ0FBQzs7QUFFSCxNQUFFLENBQUMsK0NBQStDLEVBQUUsWUFBVztBQUM3RCxVQUFNLE9BQU8sR0FBRyxZQUFZLENBQUM7QUFDN0IsVUFBTSxZQUFZLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNoRSwrQkFBUSxXQUFXLENBQUMsZUFBZSxFQUFFLE9BQU8sQ0FBQyxDQUFDOztBQUU5QyxVQUFNLGVBQWUsR0FBRyxPQUFPLENBQUMsYUFBYSxFQUFFLENBQUM7O0FBRWhELFlBQU0sQ0FBQyxlQUFlLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7S0FDNUMsQ0FBQyxDQUFDOztBQUVILE1BQUUsQ0FBQyx3Q0FBd0MsRUFBRSxZQUFXO0FBQ3RELFVBQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQztBQUN2QixVQUFNLFlBQVksR0FBRyxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxrQkFBSyxTQUFTLENBQUMsQ0FBQztBQUN0RSwrQkFBUSxXQUFXLENBQUMsZUFBZSxFQUFFLE9BQU8sQ0FBQyxDQUFDOztBQUU5QyxVQUFNLGVBQWUsR0FBRyxPQUFPLENBQUMsYUFBYSxFQUFFLENBQUM7O0FBRWhELFlBQU0sQ0FBQyxlQUFlLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7S0FDNUMsQ0FBQyxDQUFDO0dBQ0osQ0FBQyxDQUFDO0NBQ0osQ0FBQyxDQUFDIiwiZmlsZSI6Ii9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvc3BlYy9idWlsZGVyLXNwZWMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBiYWJlbFwiO1xuXG5pbXBvcnQgaGVscGVycyBmcm9tIFwiLi9zcGVjLWhlbHBlcnNcIjtcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgQnVpbGRlciBmcm9tIFwiLi4vbGliL2J1aWxkZXJcIjtcblxuZGVzY3JpYmUoXCJCdWlsZGVyXCIsIGZ1bmN0aW9uKCkge1xuICBsZXQgYnVpbGRlcjtcblxuICBiZWZvcmVFYWNoKGZ1bmN0aW9uKCkge1xuICAgIGJ1aWxkZXIgPSBuZXcgQnVpbGRlcigpO1xuICB9KTtcblxuICBkZXNjcmliZShcImNvbnN0cnVjdFBhdGhcIiwgZnVuY3Rpb24oKSB7XG4gICAgaXQoXCJyZWFkcyBgbGF0ZXgudGV4UGF0aGAgYXMgY29uZmlndXJlZFwiLCBmdW5jdGlvbigpIHtcbiAgICAgIHNweU9uKGF0b20uY29uZmlnLCBcImdldFwiKS5hbmRSZXR1cm4oKTtcbiAgICAgIGJ1aWxkZXIuY29uc3RydWN0UGF0aCgpO1xuXG4gICAgICBleHBlY3QoYXRvbS5jb25maWcuZ2V0KS50b0hhdmVCZWVuQ2FsbGVkV2l0aChcImxhdGV4LnRleFBhdGhcIik7XG4gICAgfSk7XG5cbiAgICBpdChcInVzZXMgcGxhdGZvcm0gZGVmYXVsdCB3aGVuIGBsYXRleC50ZXhQYXRoYCBpcyBub3QgY29uZmlndXJlZFwiLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IGRlZmF1bHRUZXhQYXRoID0gXCIvZm9vL2JhclwiO1xuICAgICAgY29uc3QgZXhwZWN0ZWRQYXRoID0gW2RlZmF1bHRUZXhQYXRoLCBwcm9jZXNzLmVudi5QQVRIXS5qb2luKHBhdGguZGVsaW1pdGVyKTtcbiAgICAgIGhlbHBlcnMuc3B5T25Db25maWcoXCJsYXRleC50ZXhQYXRoXCIsIFwiXCIpO1xuICAgICAgc3B5T24oYnVpbGRlciwgXCJkZWZhdWx0VGV4UGF0aFwiKS5hbmRSZXR1cm4oZGVmYXVsdFRleFBhdGgpO1xuXG4gICAgICBjb25zdCBjb25zdHJ1Y3RlZFBhdGggPSBidWlsZGVyLmNvbnN0cnVjdFBhdGgoKTtcblxuICAgICAgZXhwZWN0KGNvbnN0cnVjdGVkUGF0aCkudG9CZShleHBlY3RlZFBhdGgpO1xuICAgIH0pO1xuXG4gICAgaXQoXCJyZXBsYWNlcyBzdXJyb3VuZGVkICRQQVRIIHdpdGggcHJvY2Vzcy5lbnYuUEFUSFwiLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IHRleFBhdGggPSBcIi9mb286JFBBVEg6L2JhclwiO1xuICAgICAgY29uc3QgZXhwZWN0ZWRQYXRoID0gdGV4UGF0aC5yZXBsYWNlKFwiJFBBVEhcIiwgcHJvY2Vzcy5lbnYuUEFUSCk7XG4gICAgICBoZWxwZXJzLnNweU9uQ29uZmlnKFwibGF0ZXgudGV4UGF0aFwiLCB0ZXhQYXRoKTtcblxuICAgICAgY29uc3QgY29uc3RydWN0ZWRQYXRoID0gYnVpbGRlci5jb25zdHJ1Y3RQYXRoKCk7XG5cbiAgICAgIGV4cGVjdChjb25zdHJ1Y3RlZFBhdGgpLnRvQmUoZXhwZWN0ZWRQYXRoKTtcbiAgICB9KTtcblxuICAgIGl0KFwicmVwbGFjZXMgbGVhZGluZyAkUEFUSCB3aXRoIHByb2Nlc3MuZW52LlBBVEhcIiwgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCB0ZXhQYXRoID0gXCIkUEFUSDovYmFyXCI7XG4gICAgICBjb25zdCBleHBlY3RlZFBhdGggPSB0ZXhQYXRoLnJlcGxhY2UoXCIkUEFUSFwiLCBwcm9jZXNzLmVudi5QQVRIKTtcbiAgICAgIGhlbHBlcnMuc3B5T25Db25maWcoXCJsYXRleC50ZXhQYXRoXCIsIHRleFBhdGgpO1xuXG4gICAgICBjb25zdCBjb25zdHJ1Y3RlZFBhdGggPSBidWlsZGVyLmNvbnN0cnVjdFBhdGgoKTtcblxuICAgICAgZXhwZWN0KGNvbnN0cnVjdGVkUGF0aCkudG9CZShleHBlY3RlZFBhdGgpO1xuICAgIH0pO1xuXG4gICAgaXQoXCJyZXBsYWNlcyB0cmFpbGluZyAkUEFUSCB3aXRoIHByb2Nlc3MuZW52LlBBVEhcIiwgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCB0ZXhQYXRoID0gXCIvZm9vOiRQQVRIXCI7XG4gICAgICBjb25zdCBleHBlY3RlZFBhdGggPSB0ZXhQYXRoLnJlcGxhY2UoXCIkUEFUSFwiLCBwcm9jZXNzLmVudi5QQVRIKTtcbiAgICAgIGhlbHBlcnMuc3B5T25Db25maWcoXCJsYXRleC50ZXhQYXRoXCIsIHRleFBhdGgpO1xuXG4gICAgICBjb25zdCBjb25zdHJ1Y3RlZFBhdGggPSBidWlsZGVyLmNvbnN0cnVjdFBhdGgoKTtcblxuICAgICAgZXhwZWN0KGNvbnN0cnVjdGVkUGF0aCkudG9CZShleHBlY3RlZFBhdGgpO1xuICAgIH0pO1xuXG4gICAgaXQoXCJwcmVwZW5kcyBwcm9jZXNzLmVudi5QQVRIIHdpdGggdGV4UGF0aFwiLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IHRleFBhdGggPSBcIi9mb29cIjtcbiAgICAgIGNvbnN0IGV4cGVjdGVkUGF0aCA9IFt0ZXhQYXRoLCBwcm9jZXNzLmVudi5QQVRIXS5qb2luKHBhdGguZGVsaW1pdGVyKTtcbiAgICAgIGhlbHBlcnMuc3B5T25Db25maWcoXCJsYXRleC50ZXhQYXRoXCIsIHRleFBhdGgpO1xuXG4gICAgICBjb25zdCBjb25zdHJ1Y3RlZFBhdGggPSBidWlsZGVyLmNvbnN0cnVjdFBhdGgoKTtcblxuICAgICAgZXhwZWN0KGNvbnN0cnVjdGVkUGF0aCkudG9CZShleHBlY3RlZFBhdGgpO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuIl19