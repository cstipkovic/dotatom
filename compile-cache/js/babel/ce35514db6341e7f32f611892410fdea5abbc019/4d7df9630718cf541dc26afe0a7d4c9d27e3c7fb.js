Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

'use babel';

var MockWorkspace = (function () {
  function MockWorkspace(editor) {
    _classCallCheck(this, MockWorkspace);

    this.editor = editor;
  }

  _createClass(MockWorkspace, [{
    key: 'getActiveTextEditor',
    value: function getActiveTextEditor() {
      return this.editor;
    }
  }, {
    key: 'observeTextEditors',
    value: function observeTextEditors() {
      return new _atom.Disposable();
    }
  }, {
    key: 'onDidChangeActivePaneItem',
    value: function onDidChangeActivePaneItem() {
      return new _atom.Disposable();
    }
  }]);

  return MockWorkspace;
})();

exports['default'] = MockWorkspace;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvaW5kZW50YXRpb24taW5kaWNhdG9yL3NwZWMvbW9jay13b3Jrc3BhY2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7b0JBRXlCLE1BQU07O0FBRi9CLFdBQVcsQ0FBQTs7SUFJVSxhQUFhO0FBQ3BCLFdBRE8sYUFBYSxDQUNuQixNQUFNLEVBQUU7MEJBREYsYUFBYTs7QUFFOUIsUUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUE7R0FDckI7O2VBSGtCLGFBQWE7O1dBS1osK0JBQUc7QUFDckIsYUFBTyxJQUFJLENBQUMsTUFBTSxDQUFBO0tBQ25COzs7V0FFa0IsOEJBQUc7QUFDcEIsYUFBTyxzQkFBZ0IsQ0FBQTtLQUN4Qjs7O1dBRXlCLHFDQUFHO0FBQzNCLGFBQU8sc0JBQWdCLENBQUE7S0FDeEI7OztTQWZrQixhQUFhOzs7cUJBQWIsYUFBYSIsImZpbGUiOiIvaG9tZS9jaW5fY2hhbGljLy5hdG9tL3BhY2thZ2VzL2luZGVudGF0aW9uLWluZGljYXRvci9zcGVjL21vY2std29ya3NwYWNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuaW1wb3J0IHtEaXNwb3NhYmxlfSBmcm9tICdhdG9tJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNb2NrV29ya3NwYWNlIHtcbiAgY29uc3RydWN0b3IgKGVkaXRvcikge1xuICAgIHRoaXMuZWRpdG9yID0gZWRpdG9yXG4gIH1cblxuICBnZXRBY3RpdmVUZXh0RWRpdG9yICgpIHtcbiAgICByZXR1cm4gdGhpcy5lZGl0b3JcbiAgfVxuXG4gIG9ic2VydmVUZXh0RWRpdG9ycyAoKSB7XG4gICAgcmV0dXJuIG5ldyBEaXNwb3NhYmxlKClcbiAgfVxuXG4gIG9uRGlkQ2hhbmdlQWN0aXZlUGFuZUl0ZW0gKCkge1xuICAgIHJldHVybiBuZXcgRGlzcG9zYWJsZSgpXG4gIH1cbn1cbiJdfQ==
//# sourceURL=/home/cin_chalic/.atom/packages/indentation-indicator/spec/mock-workspace.js
