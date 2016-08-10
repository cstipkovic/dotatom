(function() {
  var fs, getClangFlagsCompDB, getClangFlagsDotClangComplete, getFileContents, path;

  path = require('path');

  fs = require('fs');

  module.exports = {
    getClangFlags: function(fileName) {
      var flags;
      flags = getClangFlagsCompDB(fileName);
      if (flags.length === 0) {
        flags = getClangFlagsDotClangComplete(fileName);
      }
      return flags;
    },
    activate: function(state) {}
  };

  getFileContents = function(startFile, fileName) {
    var contents, error, parentDir, searchDir, searchFilePath, searchFileStats;
    searchDir = path.dirname(startFile);
    while (searchDir) {
      searchFilePath = path.join(searchDir, fileName);
      try {
        searchFileStats = fs.statSync(searchFilePath);
        if (searchFileStats.isFile()) {
          try {
            contents = fs.readFileSync(searchFilePath, 'utf8');
            return [searchDir, contents];
          } catch (_error) {
            error = _error;
            console.log("clang-flags for " + fileName + " couldn't read file " + searchFilePath);
            console.log(error);
          }
          return [null, null];
        }
      } catch (_error) {}
      parentDir = path.dirname(searchDir);
      if (parentDir === searchDir) {
        break;
      }
      searchDir = parentDir;
    }
    return [null, null];
  };

  getClangFlagsCompDB = function(fileName) {
    var allArgs, args, compDB, compDBContents, config, doubleArgs, i, it, nextArg, relativeName, searchDir, singleArgs, _i, _j, _k, _len, _len1, _ref, _ref1;
    _ref = getFileContents(fileName, "compile_commands.json"), searchDir = _ref[0], compDBContents = _ref[1];
    args = [];
    if (compDBContents !== null && compDBContents.length > 0) {
      compDB = JSON.parse(compDBContents);
      for (_i = 0, _len = compDB.length; _i < _len; _i++) {
        config = compDB[_i];
        relativeName = fileName.slice(searchDir.length + 1, +fileName.length + 1 || 9e9);
        if (fileName === config['file'] || relativeName === config['file']) {
          allArgs = config.command.replace(/\s+/g, " ").split(' ');
          singleArgs = [];
          doubleArgs = [];
          for (i = _j = 0, _ref1 = allArgs.length - 1; 0 <= _ref1 ? _j <= _ref1 : _j >= _ref1; i = 0 <= _ref1 ? ++_j : --_j) {
            nextArg = allArgs[i + 1];
            if (allArgs[i][0] === '-' && (!nextArg || nextArg[0] === '-')) {
              singleArgs.push(allArgs[i]);
            }
            if (allArgs[i][0] === '-' && nextArg && (nextArg[0] !== '-')) {
              doubleArgs.push(allArgs[i] + " " + nextArg);
            }
          }
          args = singleArgs;
          for (_k = 0, _len1 = doubleArgs.length; _k < _len1; _k++) {
            it = doubleArgs[_k];
            if (it.slice(0, 8) === '-isystem') {
              args.push(it);
            }
          }
          args = args.concat(["-working-directory=" + searchDir]);
          break;
        }
      }
    }
    return args;
  };

  getClangFlagsDotClangComplete = function(fileName) {
    var args, clangCompleteContents, searchDir, _ref;
    _ref = getFileContents(fileName, ".clang_complete"), searchDir = _ref[0], clangCompleteContents = _ref[1];
    args = [];
    if (clangCompleteContents !== null && clangCompleteContents.length > 0) {
      args = clangCompleteContents.trim().split("\n");
      args = args.concat(["-working-directory=" + searchDir]);
    }
    return args;
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2luX2NoYWxpYy8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtY2xhbmcvbm9kZV9tb2R1bGVzL2NsYW5nLWZsYWdzL2xpYi9jbGFuZy1mbGFncy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFDQTtBQUFBLE1BQUEsNkVBQUE7O0FBQUEsRUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FBUCxDQUFBOztBQUFBLEVBQ0EsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSLENBREwsQ0FBQTs7QUFBQSxFQUdBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLGFBQUEsRUFBZSxTQUFDLFFBQUQsR0FBQTtBQUNiLFVBQUEsS0FBQTtBQUFBLE1BQUEsS0FBQSxHQUFRLG1CQUFBLENBQW9CLFFBQXBCLENBQVIsQ0FBQTtBQUNBLE1BQUEsSUFBRyxLQUFLLENBQUMsTUFBTixLQUFnQixDQUFuQjtBQUNFLFFBQUEsS0FBQSxHQUFRLDZCQUFBLENBQThCLFFBQTlCLENBQVIsQ0FERjtPQURBO0FBR0EsYUFBTyxLQUFQLENBSmE7SUFBQSxDQUFmO0FBQUEsSUFLQSxRQUFBLEVBQVUsU0FBQyxLQUFELEdBQUEsQ0FMVjtHQUpGLENBQUE7O0FBQUEsRUFXQSxlQUFBLEdBQWtCLFNBQUMsU0FBRCxFQUFZLFFBQVosR0FBQTtBQUNoQixRQUFBLHNFQUFBO0FBQUEsSUFBQSxTQUFBLEdBQVksSUFBSSxDQUFDLE9BQUwsQ0FBYSxTQUFiLENBQVosQ0FBQTtBQUNBLFdBQU0sU0FBTixHQUFBO0FBQ0UsTUFBQSxjQUFBLEdBQWlCLElBQUksQ0FBQyxJQUFMLENBQVUsU0FBVixFQUFxQixRQUFyQixDQUFqQixDQUFBO0FBQ0E7QUFDRSxRQUFBLGVBQUEsR0FBa0IsRUFBRSxDQUFDLFFBQUgsQ0FBWSxjQUFaLENBQWxCLENBQUE7QUFDQSxR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

//# sourceURL=/home/cin_chalic/.atom/packages/autocomplete-clang/node_modules/clang-flags/lib/clang-flags.coffee
