"use babel";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Opener = (function () {
  function Opener() {
    _classCallCheck(this, Opener);
  }

  _createClass(Opener, [{
    key: "open",
    value: function open() {}
  }, {
    key: "shouldOpenInBackground",
    value: function shouldOpenInBackground() {
      return atom.config.get("latex.openResultInBackground");
    }
  }]);

  return Opener;
})();

exports["default"] = Opener;
module.exports = exports["default"];
/* filePath, texPath, lineNumber, callback */
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL29wZW5lci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxXQUFXLENBQUM7Ozs7Ozs7Ozs7SUFFUyxNQUFNO1dBQU4sTUFBTTswQkFBTixNQUFNOzs7ZUFBTixNQUFNOztXQUNyQixnQkFBZ0QsRUFBRTs7O1dBRWhDLGtDQUFHO0FBQ3ZCLGFBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsOEJBQThCLENBQUMsQ0FBQztLQUN4RDs7O1NBTGtCLE1BQU07OztxQkFBTixNQUFNIiwiZmlsZSI6Ii9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL29wZW5lci5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIGJhYmVsXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE9wZW5lciB7XG4gIG9wZW4oLyogZmlsZVBhdGgsIHRleFBhdGgsIGxpbmVOdW1iZXIsIGNhbGxiYWNrICovKSB7fVxuXG4gIHNob3VsZE9wZW5JbkJhY2tncm91bmQoKSB7XG4gICAgcmV0dXJuIGF0b20uY29uZmlnLmdldChcImxhdGV4Lm9wZW5SZXN1bHRJbkJhY2tncm91bmRcIik7XG4gIH1cbn1cbiJdfQ==