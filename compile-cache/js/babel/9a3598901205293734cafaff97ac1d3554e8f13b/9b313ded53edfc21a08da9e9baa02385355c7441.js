Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _child_process = require("child_process");

var _child_process2 = _interopRequireDefault(_child_process);

var _werkzeug = require("../werkzeug");

var _opener = require("../opener");

var _opener2 = _interopRequireDefault(_opener);

"use babel";

var SkimOpener = (function (_Opener) {
  _inherits(SkimOpener, _Opener);

  function SkimOpener() {
    _classCallCheck(this, SkimOpener);

    _get(Object.getPrototypeOf(SkimOpener.prototype), "constructor", this).apply(this, arguments);
  }

  _createClass(SkimOpener, [{
    key: "open",
    value: function open(filePath, texPath, lineNumber, callback) {
      var skimPath = atom.config.get("latex.skimPath");
      var shouldActivate = !this.shouldOpenInBackground();
      var command = (0, _werkzeug.heredoc)("\n      osascript -e       \"\n      set theLine to \\\"" + lineNumber + "\\\" as integer\n      set theFile to POSIX file \\\"" + filePath + "\\\"\n      set theSource to POSIX file \\\"" + texPath + "\\\"\n      set thePath to POSIX path of (theFile as alias)\n      tell application \\\"" + skimPath + "\\\"\n        if " + shouldActivate + " then activate\n        try\n          set theDocs to get documents whose path is thePath\n          if (count of theDocs) > 0 then revert theDocs\n        end try\n        open theFile\n        tell front document to go to TeX line theLine from theSource\n      end tell\n      \"\n      ");

      _child_process2["default"].exec(command, function (error) {
        if (callback) {
          callback(error ? error.code : 0);
        }
      });
    }
  }]);

  return SkimOpener;
})(_opener2["default"]);

exports["default"] = SkimOpener;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL29wZW5lcnMvc2tpbS1vcGVuZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7NkJBRTBCLGVBQWU7Ozs7d0JBQ25CLGFBQWE7O3NCQUNoQixXQUFXOzs7O0FBSjlCLFdBQVcsQ0FBQzs7SUFNUyxVQUFVO1lBQVYsVUFBVTs7V0FBVixVQUFVOzBCQUFWLFVBQVU7OytCQUFWLFVBQVU7OztlQUFWLFVBQVU7O1dBQ3pCLGNBQUMsUUFBUSxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFO0FBQzVDLFVBQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLENBQUM7QUFDbkQsVUFBTSxjQUFjLEdBQUcsQ0FBQyxJQUFJLENBQUMsc0JBQXNCLEVBQUUsQ0FBQztBQUN0RCxVQUFNLE9BQU8sR0FBRyxvRkFHTyxVQUFVLDZEQUNDLFFBQVEsb0RBQ04sT0FBTyxnR0FFbEIsUUFBUSx5QkFDeEIsY0FBYyx1U0FTbkIsQ0FBQzs7QUFFTCxpQ0FBYyxJQUFJLENBQUMsT0FBTyxFQUFFLFVBQUMsS0FBSyxFQUFLO0FBQ3JDLFlBQUksUUFBUSxFQUFFO0FBQ1osa0JBQVEsQ0FBQyxBQUFDLEtBQUssR0FBSSxLQUFLLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDO1NBQ3BDO09BQ0YsQ0FBQyxDQUFDO0tBQ0o7OztTQTVCa0IsVUFBVTs7O3FCQUFWLFVBQVUiLCJmaWxlIjoiL2hvbWUvY2luX2NoYWxpYy8uYXRvbS9wYWNrYWdlcy9sYXRleC9saWIvb3BlbmVycy9za2ltLW9wZW5lci5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIGJhYmVsXCI7XG5cbmltcG9ydCBjaGlsZF9wcm9jZXNzIGZyb20gXCJjaGlsZF9wcm9jZXNzXCI7XG5pbXBvcnQge2hlcmVkb2N9IGZyb20gXCIuLi93ZXJremV1Z1wiO1xuaW1wb3J0IE9wZW5lciBmcm9tIFwiLi4vb3BlbmVyXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNraW1PcGVuZXIgZXh0ZW5kcyBPcGVuZXIge1xuICBvcGVuKGZpbGVQYXRoLCB0ZXhQYXRoLCBsaW5lTnVtYmVyLCBjYWxsYmFjaykge1xuICAgIGNvbnN0IHNraW1QYXRoID0gYXRvbS5jb25maWcuZ2V0KFwibGF0ZXguc2tpbVBhdGhcIik7XG4gICAgY29uc3Qgc2hvdWxkQWN0aXZhdGUgPSAhdGhpcy5zaG91bGRPcGVuSW5CYWNrZ3JvdW5kKCk7XG4gICAgY29uc3QgY29tbWFuZCA9IGhlcmVkb2MoYFxuICAgICAgb3Nhc2NyaXB0IC1lIFxcXG4gICAgICBcIlxuICAgICAgc2V0IHRoZUxpbmUgdG8gXFxcXFxcXCIke2xpbmVOdW1iZXJ9XFxcXFxcXCIgYXMgaW50ZWdlclxuICAgICAgc2V0IHRoZUZpbGUgdG8gUE9TSVggZmlsZSBcXFxcXFxcIiR7ZmlsZVBhdGh9XFxcXFxcXCJcbiAgICAgIHNldCB0aGVTb3VyY2UgdG8gUE9TSVggZmlsZSBcXFxcXFxcIiR7dGV4UGF0aH1cXFxcXFxcIlxuICAgICAgc2V0IHRoZVBhdGggdG8gUE9TSVggcGF0aCBvZiAodGhlRmlsZSBhcyBhbGlhcylcbiAgICAgIHRlbGwgYXBwbGljYXRpb24gXFxcXFxcXCIke3NraW1QYXRofVxcXFxcXFwiXG4gICAgICAgIGlmICR7c2hvdWxkQWN0aXZhdGV9IHRoZW4gYWN0aXZhdGVcbiAgICAgICAgdHJ5XG4gICAgICAgICAgc2V0IHRoZURvY3MgdG8gZ2V0IGRvY3VtZW50cyB3aG9zZSBwYXRoIGlzIHRoZVBhdGhcbiAgICAgICAgICBpZiAoY291bnQgb2YgdGhlRG9jcykgPiAwIHRoZW4gcmV2ZXJ0IHRoZURvY3NcbiAgICAgICAgZW5kIHRyeVxuICAgICAgICBvcGVuIHRoZUZpbGVcbiAgICAgICAgdGVsbCBmcm9udCBkb2N1bWVudCB0byBnbyB0byBUZVggbGluZSB0aGVMaW5lIGZyb20gdGhlU291cmNlXG4gICAgICBlbmQgdGVsbFxuICAgICAgXCJcbiAgICAgIGApO1xuXG4gICAgY2hpbGRfcHJvY2Vzcy5leGVjKGNvbW1hbmQsIChlcnJvcikgPT4ge1xuICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgIGNhbGxiYWNrKChlcnJvcikgPyBlcnJvci5jb2RlIDogMCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==
//# sourceURL=/home/cin_chalic/.atom/packages/latex/lib/openers/skim-opener.js
