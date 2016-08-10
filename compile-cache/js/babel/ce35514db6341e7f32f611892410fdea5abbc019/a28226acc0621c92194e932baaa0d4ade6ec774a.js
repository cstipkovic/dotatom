'use babel';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var MockEditor = (function () {
  function MockEditor() {
    var softTabs = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];
    var tabLength = arguments.length <= 1 || arguments[1] === undefined ? 3 : arguments[1];

    _classCallCheck(this, MockEditor);

    this.softTabs = softTabs;
    this.tabLength = tabLength;
  }

  _createClass(MockEditor, [{
    key: 'getSoftTabs',
    value: function getSoftTabs() {
      return this.softTabs;
    }
  }, {
    key: 'getTabLength',
    value: function getTabLength() {
      return this.tabLength;
    }
  }]);

  return MockEditor;
})();

exports['default'] = MockEditor;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvaW5kZW50YXRpb24taW5kaWNhdG9yL3NwZWMvbW9jay1lZGl0b3IuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsV0FBVyxDQUFBOzs7Ozs7Ozs7O0lBRVUsVUFBVTtBQUNqQixXQURPLFVBQVUsR0FDaUI7UUFBakMsUUFBUSx5REFBRyxLQUFLO1FBQUUsU0FBUyx5REFBRyxDQUFDOzswQkFEekIsVUFBVTs7QUFFM0IsUUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUE7QUFDeEIsUUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUE7R0FDM0I7O2VBSmtCLFVBQVU7O1dBTWpCLHVCQUFHO0FBQ2IsYUFBTyxJQUFJLENBQUMsUUFBUSxDQUFBO0tBQ3JCOzs7V0FFWSx3QkFBRztBQUNkLGFBQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQTtLQUN0Qjs7O1NBWmtCLFVBQVU7OztxQkFBVixVQUFVIiwiZmlsZSI6Ii9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvaW5kZW50YXRpb24taW5kaWNhdG9yL3NwZWMvbW9jay1lZGl0b3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNb2NrRWRpdG9yIHtcbiAgY29uc3RydWN0b3IgKHNvZnRUYWJzID0gZmFsc2UsIHRhYkxlbmd0aCA9IDMpIHtcbiAgICB0aGlzLnNvZnRUYWJzID0gc29mdFRhYnNcbiAgICB0aGlzLnRhYkxlbmd0aCA9IHRhYkxlbmd0aFxuICB9XG5cbiAgZ2V0U29mdFRhYnMgKCkge1xuICAgIHJldHVybiB0aGlzLnNvZnRUYWJzXG4gIH1cblxuICBnZXRUYWJMZW5ndGggKCkge1xuICAgIHJldHVybiB0aGlzLnRhYkxlbmd0aFxuICB9XG59XG4iXX0=
//# sourceURL=/home/cin_chalic/.atom/packages/indentation-indicator/spec/mock-editor.js
