'use babel';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var MockStatusBar = (function () {
  function MockStatusBar() {
    _classCallCheck(this, MockStatusBar);
  }

  _createClass(MockStatusBar, [{
    key: 'addLeftTile',
    value: function addLeftTile() {
      this.position = 'left';

      return new Object();
    }
  }, {
    key: 'addRightTile',
    value: function addRightTile() {
      this.position = 'right';

      return new Object();
    }
  }, {
    key: 'getPosition',
    value: function getPosition() {
      return this.position;
    }
  }]);

  return MockStatusBar;
})();

exports['default'] = MockStatusBar;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvaW5kZW50YXRpb24taW5kaWNhdG9yL3NwZWMvbW9jay1zdGF0dXMtYmFyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFdBQVcsQ0FBQTs7Ozs7Ozs7OztJQUVVLGFBQWE7V0FBYixhQUFhOzBCQUFiLGFBQWE7OztlQUFiLGFBQWE7O1dBQ3BCLHVCQUFHO0FBQ2IsVUFBSSxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUE7O0FBRXRCLGFBQU8sSUFBSSxNQUFNLEVBQUUsQ0FBQTtLQUNwQjs7O1dBRVksd0JBQUc7QUFDZCxVQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQTs7QUFFdkIsYUFBTyxJQUFJLE1BQU0sRUFBRSxDQUFBO0tBQ3BCOzs7V0FFVyx1QkFBRztBQUNiLGFBQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQTtLQUNyQjs7O1NBZmtCLGFBQWE7OztxQkFBYixhQUFhIiwiZmlsZSI6Ii9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvaW5kZW50YXRpb24taW5kaWNhdG9yL3NwZWMvbW9jay1zdGF0dXMtYmFyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTW9ja1N0YXR1c0JhciB7XG4gIGFkZExlZnRUaWxlICgpIHtcbiAgICB0aGlzLnBvc2l0aW9uID0gJ2xlZnQnXG5cbiAgICByZXR1cm4gbmV3IE9iamVjdCgpXG4gIH1cblxuICBhZGRSaWdodFRpbGUgKCkge1xuICAgIHRoaXMucG9zaXRpb24gPSAncmlnaHQnXG5cbiAgICByZXR1cm4gbmV3IE9iamVjdCgpXG4gIH1cblxuICBnZXRQb3NpdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMucG9zaXRpb25cbiAgfVxufVxuIl19
//# sourceURL=/home/cin_chalic/.atom/packages/indentation-indicator/spec/mock-status-bar.js
