Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

'use babel';

var MockConfig = (function () {
  function MockConfig(config) {
    _classCallCheck(this, MockConfig);

    this.config = config;
  }

  _createClass(MockConfig, [{
    key: 'get',
    value: function get(key) {
      return this.config[key];
    }
  }, {
    key: 'onDidChange',
    value: function onDidChange() {
      return new _atom.Disposable();
    }
  }]);

  return MockConfig;
})();

exports['default'] = MockConfig;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvaW5kZW50YXRpb24taW5kaWNhdG9yL3NwZWMvbW9jay1jb25maWcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7b0JBRXlCLE1BQU07O0FBRi9CLFdBQVcsQ0FBQTs7SUFJVSxVQUFVO0FBQ2pCLFdBRE8sVUFBVSxDQUNoQixNQUFNLEVBQUU7MEJBREYsVUFBVTs7QUFFM0IsUUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUE7R0FDckI7O2VBSGtCLFVBQVU7O1dBS3pCLGFBQUMsR0FBRyxFQUFFO0FBQ1IsYUFBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFBO0tBQ3hCOzs7V0FFVyx1QkFBRztBQUNiLGFBQU8sc0JBQWdCLENBQUE7S0FDeEI7OztTQVhrQixVQUFVOzs7cUJBQVYsVUFBVSIsImZpbGUiOiIvaG9tZS9jaW5fY2hhbGljLy5hdG9tL3BhY2thZ2VzL2luZGVudGF0aW9uLWluZGljYXRvci9zcGVjL21vY2stY29uZmlnLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuaW1wb3J0IHtEaXNwb3NhYmxlfSBmcm9tICdhdG9tJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNb2NrQ29uZmlnIHtcbiAgY29uc3RydWN0b3IgKGNvbmZpZykge1xuICAgIHRoaXMuY29uZmlnID0gY29uZmlnXG4gIH1cblxuICBnZXQgKGtleSkge1xuICAgIHJldHVybiB0aGlzLmNvbmZpZ1trZXldXG4gIH1cblxuICBvbkRpZENoYW5nZSAoKSB7XG4gICAgcmV0dXJuIG5ldyBEaXNwb3NhYmxlKClcbiAgfVxufVxuIl19
//# sourceURL=/home/cin_chalic/.atom/packages/indentation-indicator/spec/mock-config.js
