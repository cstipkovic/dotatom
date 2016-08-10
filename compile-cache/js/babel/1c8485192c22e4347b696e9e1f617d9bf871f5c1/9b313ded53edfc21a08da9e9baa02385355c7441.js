Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _child_process = require("child_process");

var _child_process2 = _interopRequireDefault(_child_process);

var _werkzeug = require("../werkzeug");

var _opener = require("../opener");

var _opener2 = _interopRequireDefault(_opener);

"use babel";

var SkimOpener = (function (_Opener) {
  function SkimOpener() {
    _classCallCheck(this, SkimOpener);

    _get(Object.getPrototypeOf(SkimOpener.prototype), "constructor", this).apply(this, arguments);
  }

  _inherits(SkimOpener, _Opener);

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL29wZW5lcnMvc2tpbS1vcGVuZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7NkJBRTBCLGVBQWU7Ozs7d0JBQ25CLGFBQWE7O3NCQUNoQixXQUFXOzs7O0FBSjlCLFdBQVcsQ0FBQzs7SUFNUyxVQUFVO1dBQVYsVUFBVTswQkFBVixVQUFVOzsrQkFBVixVQUFVOzs7WUFBVixVQUFVOztlQUFWLFVBQVU7O1dBQ3pCLGNBQUMsUUFBUSxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFO0FBQzVDLFVBQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLENBQUM7QUFDbkQsVUFBTSxjQUFjLEdBQUcsQ0FBQyxJQUFJLENBQUMsc0JBQXNCLEVBQUUsQ0FBQztBQUN0RCxVQUFNLE9BQU8sR0FBRyxjQVBaLE9BQU8sK0RBVVksVUFBVSw2REFDQyxRQUFRLG9EQUNOLE9BQU8sZ0dBRWxCLFFBQVEseUJBQ3hCLGNBQWMsdVNBU25CLENBQUM7O0FBRUwsaUNBQWMsSUFBSSxDQUFDLE9BQU8sRUFBRSxVQUFDLEtBQUssRUFBSztBQUNyQyxZQUFJLFFBQVEsRUFBRTtBQUNaLGtCQUFRLENBQUMsQUFBQyxLQUFLLEdBQUksS0FBSyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQztTQUNwQztPQUNGLENBQUMsQ0FBQztLQUNKOzs7U0E1QmtCLFVBQVU7OztxQkFBVixVQUFVIiwiZmlsZSI6Ii9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL29wZW5lcnMvc2tpbS1vcGVuZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBiYWJlbFwiO1xuXG5pbXBvcnQgY2hpbGRfcHJvY2VzcyBmcm9tIFwiY2hpbGRfcHJvY2Vzc1wiO1xuaW1wb3J0IHtoZXJlZG9jfSBmcm9tIFwiLi4vd2Vya3pldWdcIjtcbmltcG9ydCBPcGVuZXIgZnJvbSBcIi4uL29wZW5lclwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTa2ltT3BlbmVyIGV4dGVuZHMgT3BlbmVyIHtcbiAgb3BlbihmaWxlUGF0aCwgdGV4UGF0aCwgbGluZU51bWJlciwgY2FsbGJhY2spIHtcbiAgICBjb25zdCBza2ltUGF0aCA9IGF0b20uY29uZmlnLmdldChcImxhdGV4LnNraW1QYXRoXCIpO1xuICAgIGNvbnN0IHNob3VsZEFjdGl2YXRlID0gIXRoaXMuc2hvdWxkT3BlbkluQmFja2dyb3VuZCgpO1xuICAgIGNvbnN0IGNvbW1hbmQgPSBoZXJlZG9jKGBcbiAgICAgIG9zYXNjcmlwdCAtZSBcXFxuICAgICAgXCJcbiAgICAgIHNldCB0aGVMaW5lIHRvIFxcXFxcXFwiJHtsaW5lTnVtYmVyfVxcXFxcXFwiIGFzIGludGVnZXJcbiAgICAgIHNldCB0aGVGaWxlIHRvIFBPU0lYIGZpbGUgXFxcXFxcXCIke2ZpbGVQYXRofVxcXFxcXFwiXG4gICAgICBzZXQgdGhlU291cmNlIHRvIFBPU0lYIGZpbGUgXFxcXFxcXCIke3RleFBhdGh9XFxcXFxcXCJcbiAgICAgIHNldCB0aGVQYXRoIHRvIFBPU0lYIHBhdGggb2YgKHRoZUZpbGUgYXMgYWxpYXMpXG4gICAgICB0ZWxsIGFwcGxpY2F0aW9uIFxcXFxcXFwiJHtza2ltUGF0aH1cXFxcXFxcIlxuICAgICAgICBpZiAke3Nob3VsZEFjdGl2YXRlfSB0aGVuIGFjdGl2YXRlXG4gICAgICAgIHRyeVxuICAgICAgICAgIHNldCB0aGVEb2NzIHRvIGdldCBkb2N1bWVudHMgd2hvc2UgcGF0aCBpcyB0aGVQYXRoXG4gICAgICAgICAgaWYgKGNvdW50IG9mIHRoZURvY3MpID4gMCB0aGVuIHJldmVydCB0aGVEb2NzXG4gICAgICAgIGVuZCB0cnlcbiAgICAgICAgb3BlbiB0aGVGaWxlXG4gICAgICAgIHRlbGwgZnJvbnQgZG9jdW1lbnQgdG8gZ28gdG8gVGVYIGxpbmUgdGhlTGluZSBmcm9tIHRoZVNvdXJjZVxuICAgICAgZW5kIHRlbGxcbiAgICAgIFwiXG4gICAgICBgKTtcblxuICAgIGNoaWxkX3Byb2Nlc3MuZXhlYyhjb21tYW5kLCAoZXJyb3IpID0+IHtcbiAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICBjYWxsYmFjaygoZXJyb3IpID8gZXJyb3IuY29kZSA6IDApO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG4iXX0=