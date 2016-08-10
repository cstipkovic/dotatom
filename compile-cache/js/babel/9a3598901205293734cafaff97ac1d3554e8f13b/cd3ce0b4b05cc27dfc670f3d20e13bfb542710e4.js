"use babel";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Logger = (function () {
  function Logger() {
    _classCallCheck(this, Logger);
  }

  _createClass(Logger, [{
    key: "error",
    value: function error() /* statusCode, result, builder */{}
  }, {
    key: "warning",
    value: function warning() /* message */{}
  }, {
    key: "info",
    value: function info() /* message */{}
  }]);

  return Logger;
})();

exports["default"] = Logger;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL2xvZ2dlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxXQUFXLENBQUM7Ozs7Ozs7Ozs7SUFFUyxNQUFNO1dBQU4sTUFBTTswQkFBTixNQUFNOzs7ZUFBTixNQUFNOztXQUNwQixrREFBb0MsRUFBRTs7O1dBQ3BDLGdDQUFnQixFQUFFOzs7V0FDckIsNkJBQWdCLEVBQUU7OztTQUhILE1BQU07OztxQkFBTixNQUFNIiwiZmlsZSI6Ii9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL2xvZ2dlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIGJhYmVsXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExvZ2dlciB7XG4gIGVycm9yKC8qIHN0YXR1c0NvZGUsIHJlc3VsdCwgYnVpbGRlciAqLykge31cbiAgd2FybmluZygvKiBtZXNzYWdlICovKSB7fVxuICBpbmZvKC8qIG1lc3NhZ2UgKi8pIHt9XG59XG4iXX0=
//# sourceURL=/home/cin_chalic/.atom/packages/latex/lib/logger.js
