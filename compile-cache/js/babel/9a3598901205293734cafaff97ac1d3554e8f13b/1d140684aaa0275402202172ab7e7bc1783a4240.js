Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

require("./spec-bootstrap");

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _fsPlus = require("fs-plus");

var _fsPlus2 = _interopRequireDefault(_fsPlus);

var _temp = require("temp");

var _temp2 = _interopRequireDefault(_temp);

var _wrench = require("wrench");

var _wrench2 = _interopRequireDefault(_wrench);

"use babel";

exports["default"] = {
  cloneFixtures: function cloneFixtures() {
    var tempPath = _fsPlus2["default"].realpathSync(_temp2["default"].mkdirSync("latex"));
    var fixturesPath = atom.project.getPaths()[0];
    _wrench2["default"].copyDirSyncRecursive(fixturesPath, tempPath, { forceDelete: true });
    atom.project.setPaths([tempPath]);
    fixturesPath = tempPath;

    return fixturesPath;
  },

  overridePlatform: function overridePlatform(name) {
    Object.defineProperty(process, "platform", { __proto__: null, value: name });
  },

  spyOnConfig: function spyOnConfig(key, value) {
    var get = atom.config.get;
    if (!jasmine.isSpy(get)) {
      spyOn(atom.config, "get").andCallFake(function (requestedKey) {
        var fakeValue = _lodash2["default"].get(atom.config.get.values, requestedKey, null);
        if (fakeValue !== null) {
          return fakeValue;
        }
        return get.call(atom.config, requestedKey);
      });

      atom.config.get.values = {};
    }

    atom.config.get.values[key] = value;
  },

  setTimeoutInterval: function setTimeoutInterval(interval) {
    var env = jasmine.getEnv();
    var originalInterval = env.defaultTimeoutInterval;
    env.defaultTimeoutInterval = interval;

    return originalInterval;
  }
};
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvc3BlYy9zcGVjLWhlbHBlcnMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O1FBRU8sa0JBQWtCOztzQkFFWCxRQUFROzs7O3NCQUNQLFNBQVM7Ozs7b0JBQ1AsTUFBTTs7OztzQkFDSixRQUFROzs7O0FBUDNCLFdBQVcsQ0FBQzs7cUJBU0c7QUFDYixlQUFhLEVBQUEseUJBQUc7QUFDZCxRQUFNLFFBQVEsR0FBRyxvQkFBRyxZQUFZLENBQUMsa0JBQUssU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7QUFDMUQsUUFBSSxZQUFZLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM5Qyx3QkFBTyxvQkFBb0IsQ0FBQyxZQUFZLEVBQUUsUUFBUSxFQUFFLEVBQUMsV0FBVyxFQUFFLElBQUksRUFBQyxDQUFDLENBQUM7QUFDekUsUUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO0FBQ2xDLGdCQUFZLEdBQUcsUUFBUSxDQUFDOztBQUV4QixXQUFPLFlBQVksQ0FBQztHQUNyQjs7QUFFRCxrQkFBZ0IsRUFBQSwwQkFBQyxJQUFJLEVBQUU7QUFDckIsVUFBTSxDQUFDLGNBQWMsQ0FBQyxPQUFPLEVBQUUsVUFBVSxFQUFFLEVBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQztHQUM1RTs7QUFFRCxhQUFXLEVBQUEscUJBQUMsR0FBRyxFQUFFLEtBQUssRUFBRTtBQUN0QixRQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQztBQUM1QixRQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRTtBQUN2QixXQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQyxXQUFXLENBQUMsVUFBQSxZQUFZLEVBQUk7QUFDcEQsWUFBTSxTQUFTLEdBQUcsb0JBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxZQUFZLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDcEUsWUFBSSxTQUFTLEtBQUssSUFBSSxFQUFFO0FBQUUsaUJBQU8sU0FBUyxDQUFDO1NBQUU7QUFDN0MsZUFBTyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsWUFBWSxDQUFDLENBQUM7T0FDNUMsQ0FBQyxDQUFDOztBQUVILFVBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7S0FDN0I7O0FBRUQsUUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEtBQUssQ0FBQztHQUNyQzs7QUFFRCxvQkFBa0IsRUFBQSw0QkFBQyxRQUFRLEVBQUU7QUFDM0IsUUFBTSxHQUFHLEdBQUcsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQzdCLFFBQU0sZ0JBQWdCLEdBQUcsR0FBRyxDQUFDLHNCQUFzQixDQUFDO0FBQ3BELE9BQUcsQ0FBQyxzQkFBc0IsR0FBRyxRQUFRLENBQUM7O0FBRXRDLFdBQU8sZ0JBQWdCLENBQUM7R0FDekI7Q0FDRiIsImZpbGUiOiIvaG9tZS9jaW5fY2hhbGljLy5hdG9tL3BhY2thZ2VzL2xhdGV4L3NwZWMvc3BlYy1oZWxwZXJzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2UgYmFiZWxcIjtcblxuaW1wb3J0IFwiLi9zcGVjLWJvb3RzdHJhcFwiO1xuXG5pbXBvcnQgXyBmcm9tIFwibG9kYXNoXCI7XG5pbXBvcnQgZnMgZnJvbSBcImZzLXBsdXNcIjtcbmltcG9ydCB0ZW1wIGZyb20gXCJ0ZW1wXCI7XG5pbXBvcnQgd3JlbmNoIGZyb20gXCJ3cmVuY2hcIjtcblxuZXhwb3J0IGRlZmF1bHQge1xuICBjbG9uZUZpeHR1cmVzKCkge1xuICAgIGNvbnN0IHRlbXBQYXRoID0gZnMucmVhbHBhdGhTeW5jKHRlbXAubWtkaXJTeW5jKFwibGF0ZXhcIikpO1xuICAgIGxldCBmaXh0dXJlc1BhdGggPSBhdG9tLnByb2plY3QuZ2V0UGF0aHMoKVswXTtcbiAgICB3cmVuY2guY29weURpclN5bmNSZWN1cnNpdmUoZml4dHVyZXNQYXRoLCB0ZW1wUGF0aCwge2ZvcmNlRGVsZXRlOiB0cnVlfSk7XG4gICAgYXRvbS5wcm9qZWN0LnNldFBhdGhzKFt0ZW1wUGF0aF0pO1xuICAgIGZpeHR1cmVzUGF0aCA9IHRlbXBQYXRoO1xuXG4gICAgcmV0dXJuIGZpeHR1cmVzUGF0aDtcbiAgfSxcblxuICBvdmVycmlkZVBsYXRmb3JtKG5hbWUpIHtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkocHJvY2VzcywgXCJwbGF0Zm9ybVwiLCB7X19wcm90b19fOiBudWxsLCB2YWx1ZTogbmFtZX0pO1xuICB9LFxuXG4gIHNweU9uQ29uZmlnKGtleSwgdmFsdWUpIHtcbiAgICBjb25zdCBnZXQgPSBhdG9tLmNvbmZpZy5nZXQ7XG4gICAgaWYgKCFqYXNtaW5lLmlzU3B5KGdldCkpIHtcbiAgICAgIHNweU9uKGF0b20uY29uZmlnLCBcImdldFwiKS5hbmRDYWxsRmFrZShyZXF1ZXN0ZWRLZXkgPT4ge1xuICAgICAgICBjb25zdCBmYWtlVmFsdWUgPSBfLmdldChhdG9tLmNvbmZpZy5nZXQudmFsdWVzLCByZXF1ZXN0ZWRLZXksIG51bGwpO1xuICAgICAgICBpZiAoZmFrZVZhbHVlICE9PSBudWxsKSB7IHJldHVybiBmYWtlVmFsdWU7IH1cbiAgICAgICAgcmV0dXJuIGdldC5jYWxsKGF0b20uY29uZmlnLCByZXF1ZXN0ZWRLZXkpO1xuICAgICAgfSk7XG5cbiAgICAgIGF0b20uY29uZmlnLmdldC52YWx1ZXMgPSB7fTtcbiAgICB9XG5cbiAgICBhdG9tLmNvbmZpZy5nZXQudmFsdWVzW2tleV0gPSB2YWx1ZTtcbiAgfSxcblxuICBzZXRUaW1lb3V0SW50ZXJ2YWwoaW50ZXJ2YWwpIHtcbiAgICBjb25zdCBlbnYgPSBqYXNtaW5lLmdldEVudigpO1xuICAgIGNvbnN0IG9yaWdpbmFsSW50ZXJ2YWwgPSBlbnYuZGVmYXVsdFRpbWVvdXRJbnRlcnZhbDtcbiAgICBlbnYuZGVmYXVsdFRpbWVvdXRJbnRlcnZhbCA9IGludGVydmFsO1xuXG4gICAgcmV0dXJuIG9yaWdpbmFsSW50ZXJ2YWw7XG4gIH0sXG59O1xuIl19
//# sourceURL=/home/cin_chalic/.atom/packages/latex/spec/spec-helpers.js
