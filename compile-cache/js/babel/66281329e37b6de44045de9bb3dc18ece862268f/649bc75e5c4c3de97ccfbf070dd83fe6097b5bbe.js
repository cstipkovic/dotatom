'use babel';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Opener = (function () {
  function Opener() {
    _classCallCheck(this, Opener);
  }

  _createClass(Opener, [{
    key: 'open',
    value: function open() /* filePath, texPath, lineNumber, callback */{}
  }, {
    key: 'shouldOpenInBackground',
    value: function shouldOpenInBackground() {
      return atom.config.get('latex.openResultInBackground');
    }
  }]);

  return Opener;
})();

exports['default'] = Opener;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL29wZW5lci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxXQUFXLENBQUE7Ozs7Ozs7Ozs7SUFFVSxNQUFNO1dBQU4sTUFBTTswQkFBTixNQUFNOzs7ZUFBTixNQUFNOztXQUNwQiw2REFBZ0QsRUFBRTs7O1dBRWhDLGtDQUFHO0FBQ3hCLGFBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsOEJBQThCLENBQUMsQ0FBQTtLQUN2RDs7O1NBTGtCLE1BQU07OztxQkFBTixNQUFNIiwiZmlsZSI6Ii9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL29wZW5lci5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE9wZW5lciB7XG4gIG9wZW4gKC8qIGZpbGVQYXRoLCB0ZXhQYXRoLCBsaW5lTnVtYmVyLCBjYWxsYmFjayAqLykge31cblxuICBzaG91bGRPcGVuSW5CYWNrZ3JvdW5kICgpIHtcbiAgICByZXR1cm4gYXRvbS5jb25maWcuZ2V0KCdsYXRleC5vcGVuUmVzdWx0SW5CYWNrZ3JvdW5kJylcbiAgfVxufVxuIl19
//# sourceURL=/home/cin_chalic/.atom/packages/latex/lib/opener.js
