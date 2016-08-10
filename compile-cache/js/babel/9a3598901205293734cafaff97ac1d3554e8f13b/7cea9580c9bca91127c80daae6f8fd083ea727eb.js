Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

require('./spec-bootstrap');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _fsPlus = require('fs-plus');

var _fsPlus2 = _interopRequireDefault(_fsPlus);

var _temp = require('temp');

var _temp2 = _interopRequireDefault(_temp);

var _wrench = require('wrench');

var _wrench2 = _interopRequireDefault(_wrench);

'use babel';

exports['default'] = {
  cloneFixtures: function cloneFixtures() {
    var tempPath = _fsPlus2['default'].realpathSync(_temp2['default'].mkdirSync('latex'));
    var fixturesPath = atom.project.getPaths()[0];
    _wrench2['default'].copyDirSyncRecursive(fixturesPath, tempPath, { forceDelete: true });
    atom.project.setPaths([tempPath]);
    fixturesPath = tempPath;

    return fixturesPath;
  },

  overridePlatform: function overridePlatform(name) {
    Object.defineProperty(process, 'platform', { __proto__: null, value: name });
  },

  spyOnConfig: function spyOnConfig(key, value) {
    var get = atom.config.get;
    if (!jasmine.isSpy(get)) {
      spyOn(atom.config, 'get').andCallFake(function (requestedKey) {
        var fakeValue = _lodash2['default'].get(atom.config.get.values, requestedKey, null);
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
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvc3BlYy9zcGVjLWhlbHBlcnMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O1FBRU8sa0JBQWtCOztzQkFFWCxRQUFROzs7O3NCQUNQLFNBQVM7Ozs7b0JBQ1AsTUFBTTs7OztzQkFDSixRQUFROzs7O0FBUDNCLFdBQVcsQ0FBQTs7cUJBU0k7QUFDYixlQUFhLEVBQUMseUJBQUc7QUFDZixRQUFNLFFBQVEsR0FBRyxvQkFBRyxZQUFZLENBQUMsa0JBQUssU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUE7QUFDekQsUUFBSSxZQUFZLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUM3Qyx3QkFBTyxvQkFBb0IsQ0FBQyxZQUFZLEVBQUUsUUFBUSxFQUFFLEVBQUMsV0FBVyxFQUFFLElBQUksRUFBQyxDQUFDLENBQUE7QUFDeEUsUUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFBO0FBQ2pDLGdCQUFZLEdBQUcsUUFBUSxDQUFBOztBQUV2QixXQUFPLFlBQVksQ0FBQTtHQUNwQjs7QUFFRCxrQkFBZ0IsRUFBQywwQkFBQyxJQUFJLEVBQUU7QUFDdEIsVUFBTSxDQUFDLGNBQWMsQ0FBQyxPQUFPLEVBQUUsVUFBVSxFQUFFLEVBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQTtHQUMzRTs7QUFFRCxhQUFXLEVBQUMscUJBQUMsR0FBRyxFQUFFLEtBQUssRUFBRTtBQUN2QixRQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQTtBQUMzQixRQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRTtBQUN2QixXQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQyxXQUFXLENBQUMsVUFBQSxZQUFZLEVBQUk7QUFDcEQsWUFBTSxTQUFTLEdBQUcsb0JBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxZQUFZLEVBQUUsSUFBSSxDQUFDLENBQUE7QUFDbkUsWUFBSSxTQUFTLEtBQUssSUFBSSxFQUFFO0FBQUUsaUJBQU8sU0FBUyxDQUFBO1NBQUU7QUFDNUMsZUFBTyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsWUFBWSxDQUFDLENBQUE7T0FDM0MsQ0FBQyxDQUFBOztBQUVGLFVBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUE7S0FDNUI7O0FBRUQsUUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEtBQUssQ0FBQTtHQUNwQzs7QUFFRCxvQkFBa0IsRUFBQyw0QkFBQyxRQUFRLEVBQUU7QUFDNUIsUUFBTSxHQUFHLEdBQUcsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFBO0FBQzVCLFFBQU0sZ0JBQWdCLEdBQUcsR0FBRyxDQUFDLHNCQUFzQixDQUFBO0FBQ25ELE9BQUcsQ0FBQyxzQkFBc0IsR0FBRyxRQUFRLENBQUE7O0FBRXJDLFdBQU8sZ0JBQWdCLENBQUE7R0FDeEI7Q0FDRiIsImZpbGUiOiIvaG9tZS9jaW5fY2hhbGljLy5hdG9tL3BhY2thZ2VzL2xhdGV4L3NwZWMvc3BlYy1oZWxwZXJzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuaW1wb3J0ICcuL3NwZWMtYm9vdHN0cmFwJ1xuXG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnXG5pbXBvcnQgZnMgZnJvbSAnZnMtcGx1cydcbmltcG9ydCB0ZW1wIGZyb20gJ3RlbXAnXG5pbXBvcnQgd3JlbmNoIGZyb20gJ3dyZW5jaCdcblxuZXhwb3J0IGRlZmF1bHQge1xuICBjbG9uZUZpeHR1cmVzICgpIHtcbiAgICBjb25zdCB0ZW1wUGF0aCA9IGZzLnJlYWxwYXRoU3luYyh0ZW1wLm1rZGlyU3luYygnbGF0ZXgnKSlcbiAgICBsZXQgZml4dHVyZXNQYXRoID0gYXRvbS5wcm9qZWN0LmdldFBhdGhzKClbMF1cbiAgICB3cmVuY2guY29weURpclN5bmNSZWN1cnNpdmUoZml4dHVyZXNQYXRoLCB0ZW1wUGF0aCwge2ZvcmNlRGVsZXRlOiB0cnVlfSlcbiAgICBhdG9tLnByb2plY3Quc2V0UGF0aHMoW3RlbXBQYXRoXSlcbiAgICBmaXh0dXJlc1BhdGggPSB0ZW1wUGF0aFxuXG4gICAgcmV0dXJuIGZpeHR1cmVzUGF0aFxuICB9LFxuXG4gIG92ZXJyaWRlUGxhdGZvcm0gKG5hbWUpIHtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkocHJvY2VzcywgJ3BsYXRmb3JtJywge19fcHJvdG9fXzogbnVsbCwgdmFsdWU6IG5hbWV9KVxuICB9LFxuXG4gIHNweU9uQ29uZmlnIChrZXksIHZhbHVlKSB7XG4gICAgY29uc3QgZ2V0ID0gYXRvbS5jb25maWcuZ2V0XG4gICAgaWYgKCFqYXNtaW5lLmlzU3B5KGdldCkpIHtcbiAgICAgIHNweU9uKGF0b20uY29uZmlnLCAnZ2V0JykuYW5kQ2FsbEZha2UocmVxdWVzdGVkS2V5ID0+IHtcbiAgICAgICAgY29uc3QgZmFrZVZhbHVlID0gXy5nZXQoYXRvbS5jb25maWcuZ2V0LnZhbHVlcywgcmVxdWVzdGVkS2V5LCBudWxsKVxuICAgICAgICBpZiAoZmFrZVZhbHVlICE9PSBudWxsKSB7IHJldHVybiBmYWtlVmFsdWUgfVxuICAgICAgICByZXR1cm4gZ2V0LmNhbGwoYXRvbS5jb25maWcsIHJlcXVlc3RlZEtleSlcbiAgICAgIH0pXG5cbiAgICAgIGF0b20uY29uZmlnLmdldC52YWx1ZXMgPSB7fVxuICAgIH1cblxuICAgIGF0b20uY29uZmlnLmdldC52YWx1ZXNba2V5XSA9IHZhbHVlXG4gIH0sXG5cbiAgc2V0VGltZW91dEludGVydmFsIChpbnRlcnZhbCkge1xuICAgIGNvbnN0IGVudiA9IGphc21pbmUuZ2V0RW52KClcbiAgICBjb25zdCBvcmlnaW5hbEludGVydmFsID0gZW52LmRlZmF1bHRUaW1lb3V0SW50ZXJ2YWxcbiAgICBlbnYuZGVmYXVsdFRpbWVvdXRJbnRlcnZhbCA9IGludGVydmFsXG5cbiAgICByZXR1cm4gb3JpZ2luYWxJbnRlcnZhbFxuICB9XG59XG4iXX0=
//# sourceURL=/home/cin_chalic/.atom/packages/latex/spec/spec-helpers.js
