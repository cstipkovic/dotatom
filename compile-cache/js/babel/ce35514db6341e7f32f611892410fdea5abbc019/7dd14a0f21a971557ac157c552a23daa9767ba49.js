Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

require('./spec-bootstrap');

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

  setTimeoutInterval: function setTimeoutInterval(interval) {
    var env = jasmine.getEnv();
    var originalInterval = env.defaultTimeoutInterval;
    env.defaultTimeoutInterval = interval;

    return originalInterval;
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvc3BlYy9zcGVjLWhlbHBlcnMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O1FBRU8sa0JBQWtCOztzQkFFVixTQUFTOzs7O29CQUNQLE1BQU07Ozs7c0JBQ0osUUFBUTs7OztBQU4zQixXQUFXLENBQUE7O3FCQVFJO0FBQ2IsZUFBYSxFQUFDLHlCQUFHO0FBQ2YsUUFBTSxRQUFRLEdBQUcsb0JBQUcsWUFBWSxDQUFDLGtCQUFLLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFBO0FBQ3pELFFBQUksWUFBWSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDN0Msd0JBQU8sb0JBQW9CLENBQUMsWUFBWSxFQUFFLFFBQVEsRUFBRSxFQUFDLFdBQVcsRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFBO0FBQ3hFLFFBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQTtBQUNqQyxnQkFBWSxHQUFHLFFBQVEsQ0FBQTs7QUFFdkIsV0FBTyxZQUFZLENBQUE7R0FDcEI7O0FBRUQsa0JBQWdCLEVBQUMsMEJBQUMsSUFBSSxFQUFFO0FBQ3RCLFVBQU0sQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFLFVBQVUsRUFBRSxFQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBQyxDQUFDLENBQUE7R0FDM0U7O0FBRUQsb0JBQWtCLEVBQUMsNEJBQUMsUUFBUSxFQUFFO0FBQzVCLFFBQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQTtBQUM1QixRQUFNLGdCQUFnQixHQUFHLEdBQUcsQ0FBQyxzQkFBc0IsQ0FBQTtBQUNuRCxPQUFHLENBQUMsc0JBQXNCLEdBQUcsUUFBUSxDQUFBOztBQUVyQyxXQUFPLGdCQUFnQixDQUFBO0dBQ3hCO0NBQ0YiLCJmaWxlIjoiL2hvbWUvY2luX2NoYWxpYy8uYXRvbS9wYWNrYWdlcy9sYXRleC9zcGVjL3NwZWMtaGVscGVycy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmltcG9ydCAnLi9zcGVjLWJvb3RzdHJhcCdcblxuaW1wb3J0IGZzIGZyb20gJ2ZzLXBsdXMnXG5pbXBvcnQgdGVtcCBmcm9tICd0ZW1wJ1xuaW1wb3J0IHdyZW5jaCBmcm9tICd3cmVuY2gnXG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgY2xvbmVGaXh0dXJlcyAoKSB7XG4gICAgY29uc3QgdGVtcFBhdGggPSBmcy5yZWFscGF0aFN5bmModGVtcC5ta2RpclN5bmMoJ2xhdGV4JykpXG4gICAgbGV0IGZpeHR1cmVzUGF0aCA9IGF0b20ucHJvamVjdC5nZXRQYXRocygpWzBdXG4gICAgd3JlbmNoLmNvcHlEaXJTeW5jUmVjdXJzaXZlKGZpeHR1cmVzUGF0aCwgdGVtcFBhdGgsIHtmb3JjZURlbGV0ZTogdHJ1ZX0pXG4gICAgYXRvbS5wcm9qZWN0LnNldFBhdGhzKFt0ZW1wUGF0aF0pXG4gICAgZml4dHVyZXNQYXRoID0gdGVtcFBhdGhcblxuICAgIHJldHVybiBmaXh0dXJlc1BhdGhcbiAgfSxcblxuICBvdmVycmlkZVBsYXRmb3JtIChuYW1lKSB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHByb2Nlc3MsICdwbGF0Zm9ybScsIHtfX3Byb3RvX186IG51bGwsIHZhbHVlOiBuYW1lfSlcbiAgfSxcblxuICBzZXRUaW1lb3V0SW50ZXJ2YWwgKGludGVydmFsKSB7XG4gICAgY29uc3QgZW52ID0gamFzbWluZS5nZXRFbnYoKVxuICAgIGNvbnN0IG9yaWdpbmFsSW50ZXJ2YWwgPSBlbnYuZGVmYXVsdFRpbWVvdXRJbnRlcnZhbFxuICAgIGVudi5kZWZhdWx0VGltZW91dEludGVydmFsID0gaW50ZXJ2YWxcblxuICAgIHJldHVybiBvcmlnaW5hbEludGVydmFsXG4gIH1cbn1cbiJdfQ==
//# sourceURL=/home/cin_chalic/.atom/packages/latex/spec/spec-helpers.js
