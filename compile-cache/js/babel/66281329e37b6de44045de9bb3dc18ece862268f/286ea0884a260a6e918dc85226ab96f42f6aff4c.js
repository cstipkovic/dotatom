Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _fsPlus = require('fs-plus');

var _fsPlus2 = _interopRequireDefault(_fsPlus);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _parsersMagicParser = require('./parsers/magic-parser');

var _parsersMagicParser2 = _interopRequireDefault(_parsersMagicParser);

'use babel';

var masterFilePattern = new RegExp('' + '^\\s*' + // Optional whitespace.
'\\\\documentclass' + // Command.
'(\\[.*\\])?' + // Optional command options.
'\\{.*\\}' // Class name.
);

var MasterTexFinder = (function () {
  // Create a new MasterTexFinder.
  // this.param filePath: a file name in the directory to be searched

  function MasterTexFinder(filePath) {
    _classCallCheck(this, MasterTexFinder);

    this.filePath = filePath;
    this.fileName = _path2['default'].basename(filePath);
    this.projectPath = _path2['default'].dirname(filePath);
  }

  // Returns the list of tex files in the project directory

  _createClass(MasterTexFinder, [{
    key: 'getTexFilesList',
    value: function getTexFilesList() {
      return _fsPlus2['default'].listSync(this.projectPath, ['.tex']);
    }

    // Returns true iff path is a master file (contains the documentclass declaration)
  }, {
    key: 'isMasterFile',
    value: function isMasterFile(filePath) {
      if (!_fsPlus2['default'].existsSync(filePath)) {
        return false;
      }

      var rawFile = _fsPlus2['default'].readFileSync(filePath, { encoding: 'utf-8' });
      return masterFilePattern.test(rawFile);
    }

    // Returns an array containing the path to the root file indicated by a magic
    // comment in this.filePath.
    // Returns null if no magic comment can be found in this.filePath.
  }, {
    key: 'getMagicCommentMasterFile',
    value: function getMagicCommentMasterFile() {
      var magic = new _parsersMagicParser2['default'](this.filePath).parse();
      if (!magic || !magic.root) {
        return null;
      }
      return _path2['default'].resolve(this.projectPath, magic.root);
    }

    // Returns the list of tex files in the directory where this.filePath lives that
    // contain a documentclass declaration.
  }, {
    key: 'searchForMasterFile',
    value: function searchForMasterFile() {
      var _this = this;

      var files = this.getTexFilesList();
      if (!files) {
        return null;
      }
      if (files.length === 0) {
        return this.filePath;
      }
      if (files.length === 1) {
        return files[0];
      }

      var result = files.filter(function (p) {
        return _this.isMasterFile(p);
      });
      if (result.length === 1) {
        return result[0];
      }

      // TODO: Nuke warning?
      latex.log.warning('Cannot find latex master file');
      return this.filePath;
    }

    // Returns the a latex master file.
    //
    // If this.filePath contains a magic comment uses that comment to determine the master file.
    // Else if master file search is disabled, returns this.filePath.
    // Else if the this.filePath is itself a master file, returns this.filePath.
    // Otherwise it searches the directory where this.filePath is contained for files having a
    //   'documentclass' declaration.
  }, {
    key: 'getMasterTexPath',
    value: function getMasterTexPath() {
      var masterPath = this.getMagicCommentMasterFile();
      if (masterPath) {
        return masterPath;
      }
      if (!this.isMasterFileSearchEnabled()) {
        return this.filePath;
      }
      if (this.isMasterFile(this.filePath)) {
        return this.filePath;
      }

      return this.searchForMasterFile();
    }
  }, {
    key: 'isMasterFileSearchEnabled',
    value: function isMasterFileSearchEnabled() {
      return atom.config.get('latex.useMasterFileSearch');
    }
  }]);

  return MasterTexFinder;
})();

exports['default'] = MasterTexFinder;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL21hc3Rlci10ZXgtZmluZGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7c0JBRWUsU0FBUzs7OztvQkFDUCxNQUFNOzs7O2tDQUNDLHdCQUF3Qjs7OztBQUpoRCxXQUFXLENBQUE7O0FBTVgsSUFBTSxpQkFBaUIsR0FBRyxJQUFJLE1BQU0sQ0FBQyxFQUFFLEdBQ3JDLE9BQU87QUFDUCxtQkFBbUI7QUFDbkIsYUFBYTtBQUNiLFVBQVU7Q0FDWCxDQUFBOztJQUVvQixlQUFlOzs7O0FBR3RCLFdBSE8sZUFBZSxDQUdyQixRQUFRLEVBQUU7MEJBSEosZUFBZTs7QUFJaEMsUUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUE7QUFDeEIsUUFBSSxDQUFDLFFBQVEsR0FBRyxrQkFBSyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUE7QUFDdkMsUUFBSSxDQUFDLFdBQVcsR0FBRyxrQkFBSyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUE7R0FDMUM7Ozs7ZUFQa0IsZUFBZTs7V0FVbEIsMkJBQUc7QUFDakIsYUFBTyxvQkFBRyxRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUE7S0FDL0M7Ozs7O1dBR1ksc0JBQUMsUUFBUSxFQUFFO0FBQ3RCLFVBQUksQ0FBQyxvQkFBRyxVQUFVLENBQUMsUUFBUSxDQUFDLEVBQUU7QUFBRSxlQUFPLEtBQUssQ0FBQTtPQUFFOztBQUU5QyxVQUFNLE9BQU8sR0FBRyxvQkFBRyxZQUFZLENBQUMsUUFBUSxFQUFFLEVBQUMsUUFBUSxFQUFFLE9BQU8sRUFBQyxDQUFDLENBQUE7QUFDOUQsYUFBTyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7S0FDdkM7Ozs7Ozs7V0FLeUIscUNBQUc7QUFDM0IsVUFBTSxLQUFLLEdBQUcsb0NBQWdCLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQTtBQUNwRCxVQUFJLENBQUMsS0FBSyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRTtBQUFFLGVBQU8sSUFBSSxDQUFBO09BQUU7QUFDMUMsYUFBTyxrQkFBSyxPQUFPLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUE7S0FDbEQ7Ozs7OztXQUltQiwrQkFBRzs7O0FBQ3JCLFVBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQTtBQUNwQyxVQUFJLENBQUMsS0FBSyxFQUFFO0FBQUUsZUFBTyxJQUFJLENBQUE7T0FBRTtBQUMzQixVQUFJLEtBQUssQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO0FBQUUsZUFBTyxJQUFJLENBQUMsUUFBUSxDQUFBO09BQUU7QUFDaEQsVUFBSSxLQUFLLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtBQUFFLGVBQU8sS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFBO09BQUU7O0FBRTNDLFVBQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsVUFBQSxDQUFDO2VBQUksTUFBSyxZQUFZLENBQUMsQ0FBQyxDQUFDO09BQUEsQ0FBQyxDQUFBO0FBQ3RELFVBQUksTUFBTSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7QUFBRSxlQUFPLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQTtPQUFFOzs7QUFHN0MsV0FBSyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsK0JBQStCLENBQUMsQ0FBQTtBQUNsRCxhQUFPLElBQUksQ0FBQyxRQUFRLENBQUE7S0FDckI7Ozs7Ozs7Ozs7O1dBU2dCLDRCQUFHO0FBQ2xCLFVBQU0sVUFBVSxHQUFHLElBQUksQ0FBQyx5QkFBeUIsRUFBRSxDQUFBO0FBQ25ELFVBQUksVUFBVSxFQUFFO0FBQUUsZUFBTyxVQUFVLENBQUE7T0FBRTtBQUNyQyxVQUFJLENBQUMsSUFBSSxDQUFDLHlCQUF5QixFQUFFLEVBQUU7QUFBRSxlQUFPLElBQUksQ0FBQyxRQUFRLENBQUE7T0FBRTtBQUMvRCxVQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFO0FBQUUsZUFBTyxJQUFJLENBQUMsUUFBUSxDQUFBO09BQUU7O0FBRTlELGFBQU8sSUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUE7S0FDbEM7OztXQUV5QixxQ0FBRztBQUFFLGFBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsMkJBQTJCLENBQUMsQ0FBQTtLQUFFOzs7U0EvRGpFLGVBQWU7OztxQkFBZixlQUFlIiwiZmlsZSI6Ii9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL21hc3Rlci10ZXgtZmluZGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuaW1wb3J0IGZzIGZyb20gJ2ZzLXBsdXMnXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IE1hZ2ljUGFyc2VyIGZyb20gJy4vcGFyc2Vycy9tYWdpYy1wYXJzZXInXG5cbmNvbnN0IG1hc3RlckZpbGVQYXR0ZXJuID0gbmV3IFJlZ0V4cCgnJyArXG4gICdeXFxcXHMqJyArICAgICAgICAgICAgIC8vIE9wdGlvbmFsIHdoaXRlc3BhY2UuXG4gICdcXFxcXFxcXGRvY3VtZW50Y2xhc3MnICsgLy8gQ29tbWFuZC5cbiAgJyhcXFxcWy4qXFxcXF0pPycgKyAgICAgICAvLyBPcHRpb25hbCBjb21tYW5kIG9wdGlvbnMuXG4gICdcXFxcey4qXFxcXH0nICAgICAgICAgICAgLy8gQ2xhc3MgbmFtZS5cbilcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWFzdGVyVGV4RmluZGVyIHtcbiAgLy8gQ3JlYXRlIGEgbmV3IE1hc3RlclRleEZpbmRlci5cbiAgLy8gdGhpcy5wYXJhbSBmaWxlUGF0aDogYSBmaWxlIG5hbWUgaW4gdGhlIGRpcmVjdG9yeSB0byBiZSBzZWFyY2hlZFxuICBjb25zdHJ1Y3RvciAoZmlsZVBhdGgpIHtcbiAgICB0aGlzLmZpbGVQYXRoID0gZmlsZVBhdGhcbiAgICB0aGlzLmZpbGVOYW1lID0gcGF0aC5iYXNlbmFtZShmaWxlUGF0aClcbiAgICB0aGlzLnByb2plY3RQYXRoID0gcGF0aC5kaXJuYW1lKGZpbGVQYXRoKVxuICB9XG5cbiAgLy8gUmV0dXJucyB0aGUgbGlzdCBvZiB0ZXggZmlsZXMgaW4gdGhlIHByb2plY3QgZGlyZWN0b3J5XG4gIGdldFRleEZpbGVzTGlzdCAoKSB7XG4gICAgcmV0dXJuIGZzLmxpc3RTeW5jKHRoaXMucHJvamVjdFBhdGgsIFsnLnRleCddKVxuICB9XG5cbiAgLy8gUmV0dXJucyB0cnVlIGlmZiBwYXRoIGlzIGEgbWFzdGVyIGZpbGUgKGNvbnRhaW5zIHRoZSBkb2N1bWVudGNsYXNzIGRlY2xhcmF0aW9uKVxuICBpc01hc3RlckZpbGUgKGZpbGVQYXRoKSB7XG4gICAgaWYgKCFmcy5leGlzdHNTeW5jKGZpbGVQYXRoKSkgeyByZXR1cm4gZmFsc2UgfVxuXG4gICAgY29uc3QgcmF3RmlsZSA9IGZzLnJlYWRGaWxlU3luYyhmaWxlUGF0aCwge2VuY29kaW5nOiAndXRmLTgnfSlcbiAgICByZXR1cm4gbWFzdGVyRmlsZVBhdHRlcm4udGVzdChyYXdGaWxlKVxuICB9XG5cbiAgLy8gUmV0dXJucyBhbiBhcnJheSBjb250YWluaW5nIHRoZSBwYXRoIHRvIHRoZSByb290IGZpbGUgaW5kaWNhdGVkIGJ5IGEgbWFnaWNcbiAgLy8gY29tbWVudCBpbiB0aGlzLmZpbGVQYXRoLlxuICAvLyBSZXR1cm5zIG51bGwgaWYgbm8gbWFnaWMgY29tbWVudCBjYW4gYmUgZm91bmQgaW4gdGhpcy5maWxlUGF0aC5cbiAgZ2V0TWFnaWNDb21tZW50TWFzdGVyRmlsZSAoKSB7XG4gICAgY29uc3QgbWFnaWMgPSBuZXcgTWFnaWNQYXJzZXIodGhpcy5maWxlUGF0aCkucGFyc2UoKVxuICAgIGlmICghbWFnaWMgfHwgIW1hZ2ljLnJvb3QpIHsgcmV0dXJuIG51bGwgfVxuICAgIHJldHVybiBwYXRoLnJlc29sdmUodGhpcy5wcm9qZWN0UGF0aCwgbWFnaWMucm9vdClcbiAgfVxuXG4gIC8vIFJldHVybnMgdGhlIGxpc3Qgb2YgdGV4IGZpbGVzIGluIHRoZSBkaXJlY3Rvcnkgd2hlcmUgdGhpcy5maWxlUGF0aCBsaXZlcyB0aGF0XG4gIC8vIGNvbnRhaW4gYSBkb2N1bWVudGNsYXNzIGRlY2xhcmF0aW9uLlxuICBzZWFyY2hGb3JNYXN0ZXJGaWxlICgpIHtcbiAgICBjb25zdCBmaWxlcyA9IHRoaXMuZ2V0VGV4RmlsZXNMaXN0KClcbiAgICBpZiAoIWZpbGVzKSB7IHJldHVybiBudWxsIH1cbiAgICBpZiAoZmlsZXMubGVuZ3RoID09PSAwKSB7IHJldHVybiB0aGlzLmZpbGVQYXRoIH1cbiAgICBpZiAoZmlsZXMubGVuZ3RoID09PSAxKSB7IHJldHVybiBmaWxlc1swXSB9XG5cbiAgICBjb25zdCByZXN1bHQgPSBmaWxlcy5maWx0ZXIocCA9PiB0aGlzLmlzTWFzdGVyRmlsZShwKSlcbiAgICBpZiAocmVzdWx0Lmxlbmd0aCA9PT0gMSkgeyByZXR1cm4gcmVzdWx0WzBdIH1cblxuICAgIC8vIFRPRE86IE51a2Ugd2FybmluZz9cbiAgICBsYXRleC5sb2cud2FybmluZygnQ2Fubm90IGZpbmQgbGF0ZXggbWFzdGVyIGZpbGUnKVxuICAgIHJldHVybiB0aGlzLmZpbGVQYXRoXG4gIH1cblxuICAvLyBSZXR1cm5zIHRoZSBhIGxhdGV4IG1hc3RlciBmaWxlLlxuICAvL1xuICAvLyBJZiB0aGlzLmZpbGVQYXRoIGNvbnRhaW5zIGEgbWFnaWMgY29tbWVudCB1c2VzIHRoYXQgY29tbWVudCB0byBkZXRlcm1pbmUgdGhlIG1hc3RlciBmaWxlLlxuICAvLyBFbHNlIGlmIG1hc3RlciBmaWxlIHNlYXJjaCBpcyBkaXNhYmxlZCwgcmV0dXJucyB0aGlzLmZpbGVQYXRoLlxuICAvLyBFbHNlIGlmIHRoZSB0aGlzLmZpbGVQYXRoIGlzIGl0c2VsZiBhIG1hc3RlciBmaWxlLCByZXR1cm5zIHRoaXMuZmlsZVBhdGguXG4gIC8vIE90aGVyd2lzZSBpdCBzZWFyY2hlcyB0aGUgZGlyZWN0b3J5IHdoZXJlIHRoaXMuZmlsZVBhdGggaXMgY29udGFpbmVkIGZvciBmaWxlcyBoYXZpbmcgYVxuICAvLyAgICdkb2N1bWVudGNsYXNzJyBkZWNsYXJhdGlvbi5cbiAgZ2V0TWFzdGVyVGV4UGF0aCAoKSB7XG4gICAgY29uc3QgbWFzdGVyUGF0aCA9IHRoaXMuZ2V0TWFnaWNDb21tZW50TWFzdGVyRmlsZSgpXG4gICAgaWYgKG1hc3RlclBhdGgpIHsgcmV0dXJuIG1hc3RlclBhdGggfVxuICAgIGlmICghdGhpcy5pc01hc3RlckZpbGVTZWFyY2hFbmFibGVkKCkpIHsgcmV0dXJuIHRoaXMuZmlsZVBhdGggfVxuICAgIGlmICh0aGlzLmlzTWFzdGVyRmlsZSh0aGlzLmZpbGVQYXRoKSkgeyByZXR1cm4gdGhpcy5maWxlUGF0aCB9XG5cbiAgICByZXR1cm4gdGhpcy5zZWFyY2hGb3JNYXN0ZXJGaWxlKClcbiAgfVxuXG4gIGlzTWFzdGVyRmlsZVNlYXJjaEVuYWJsZWQgKCkgeyByZXR1cm4gYXRvbS5jb25maWcuZ2V0KCdsYXRleC51c2VNYXN0ZXJGaWxlU2VhcmNoJykgfVxufVxuIl19
//# sourceURL=/home/cin_chalic/.atom/packages/latex/lib/master-tex-finder.js
