(function() {
  var BufferedProcess, ClangFlags, ClangProvider, CompositeDisposable, LanguageUtil, Point, Range, existsSync, path, _ref;

  _ref = require('atom'), Point = _ref.Point, Range = _ref.Range, BufferedProcess = _ref.BufferedProcess, CompositeDisposable = _ref.CompositeDisposable;

  path = require('path');

  existsSync = require('fs').existsSync;

  ClangFlags = require('clang-flags');

  module.exports = ClangProvider = (function() {
    function ClangProvider() {}

    ClangProvider.prototype.selector = '.source.cpp, .source.c, .source.objc, .source.objcpp';

    ClangProvider.prototype.inclusionPriority = 1;

    ClangProvider.prototype.scopeSource = {
      'source.cpp': 'c++',
      'source.c': 'c',
      'source.objc': 'objective-c',
      'source.objcpp': 'objective-c++'
    };

    ClangProvider.prototype.getSuggestions = function(_arg) {
      var bufferPosition, editor, language, lastSymbol, line, minimumWordLength, prefix, regex, scopeDescriptor, symbolPosition, _ref1;
      editor = _arg.editor, scopeDescriptor = _arg.scopeDescriptor, bufferPosition = _arg.bufferPosition;
      language = LanguageUtil.getSourceScopeLang(this.scopeSource, scopeDescriptor.getScopesArray());
      prefix = LanguageUtil.prefixAtPosition(editor, bufferPosition);
      _ref1 = LanguageUtil.nearestSymbolPosition(editor, bufferPosition), symbolPosition = _ref1[0], lastSymbol = _ref1[1];
      minimumWordLength = atom.config.get('autocomplete-plus.minimumWordLength');
      if ((minimumWordLength != null) && prefix.length < minimumWordLength) {
        regex = /(?:\.|->|::)\s*\w*$/;
        line = editor.getTextInRange([[bufferPosition.row, 0], bufferPosition]);
        if (!regex.test(line)) {
          return;
        }
      }
      if (language != null) {
        return this.codeCompletionAt(editor, symbolPosition.row, symbolPosition.column, language, prefix);
      }
    };

    ClangProvider.prototype.codeCompletionAt = function(editor, row, column, language, prefix) {
      var args, command, options;
      command = atom.config.get("autocomplete-clang.clangCommand");
      args = this.buildClangArgs(editor, row, column, language);
      options = {
        cwd: path.dirname(editor.getPath()),
        input: editor.getText()
      };
      return new Promise((function(_this) {
        return function(resolve) {
          var allOutput, bufferedProcess, exit, stderr, stdout;
          allOutput = [];
          stdout = function(output) {
            return allOutput.push(output);
          };
          stderr = function(output) {
            return console.log(output);
          };
          exit = function(code) {
            return resolve(_this.handleCompletionResult(allOutput.join('\n'), code, prefix));
          };
          bufferedProcess = new BufferedProcess({
            command: command,
            args: args,
            options: options,
            stdout: stdout,
            stderr: stderr,
            exit: exit
          });
          bufferedProcess.process.stdin.setEncoding = 'utf-8';
          bufferedProcess.process.stdin.write(editor.getText());
          return bufferedProcess.process.stdin.end();
        };
      })(this));
    };

    ClangProvider.prototype.convertCompletionLine = function(line, prefix) {
      var argumentsRe, basicInfo, basicInfoRe, comment, commentRe, completion, completionAndComment, constMemFuncRe, content, contentRe, index, infoTagsRe, isConstMemFunc, match, returnType, returnTypeRe, suggestion, _ref1, _ref2, _ref3;
      contentRe = /^COMPLETION: (.*)/;
      _ref1 = line.match(contentRe), line = _ref1[0], content = _ref1[1];
      basicInfoRe = /^(.*?) : (.*)/;
      match = content.match(basicInfoRe);
      if (match == null) {
        return {
          text: content
        };
      }
      content = match[0], basicInfo = match[1], completionAndComment = match[2];
      commentRe = /(?: : (.*))?$/;
      _ref2 = completionAndComment.split(commentRe), completion = _ref2[0], comment = _ref2[1];
      returnTypeRe = /^\[#(.*?)#\]/;
      returnType = (_ref3 = completion.match(returnTypeRe)) != null ? _ref3[1] : void 0;
      constMemFuncRe = /\[# const#\]$/;
      isConstMemFunc = constMemFuncRe.test(completion);
      infoTagsRe = /\[#(.*?)#\]/g;
      completion = completion.replace(infoTagsRe, '');
      argumentsRe = /<#(.*?)#>/g;
      index = 0;
      completion = completion.replace(argumentsRe, function(match, arg) {
        index++;
        return "${" + index + ":" + arg + "}";
      });
      suggestion = {};
      if (returnType != null) {
        suggestion.leftLabel = returnType;
      }
      if (index > 0) {
        suggestion.snippet = completion;
      } else {
        suggestion.text = completion;
      }
      if (isConstMemFunc) {
        suggestion.displayText = completion + ' const';
      }
      if (comment != null) {
        suggestion.description = comment;
      }
      suggestion.replacementPrefix = prefix;
      return suggestion;
    };

    ClangProvider.prototype.handleCompletionResult = function(result, returnCode, prefix) {
      var completionsRe, line, outputLines;
      if (returnCode === !0) {
        if (!atom.config.get("autocomplete-clang.ignoreClangErrors")) {
          return;
        }
      }
      completionsRe = new RegExp("^COMPLETION: (" + prefix + ".*)$", "mg");
      outputLines = result.match(completionsRe);
      if (outputLines != null) {
        return (function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = outputLines.length; _i < _len; _i++) {
            line = outputLines[_i];
            _results.push(this.convertCompletionLine(line, prefix));
          }
          return _results;
        }).call(this);
      } else {
        return [];
      }
    };

    ClangProvider.prototype.buildClangArgs = function(editor, row, column, language) {
      var args, clangflags, currentDir, error, i, pchFile, pchFilePrefix, pchPath, std, _i, _len, _ref1;
      std = atom.config.get("autocomplete-clang.std " + language);
      currentDir = path.dirname(editor.getPath());
      pchFilePrefix = atom.config.get("autocomplete-clang.pchFilePrefix");
      pchFile = [pchFilePrefix, language, "pch"].join('.');
      pchPath = path.join(currentDir, pchFile);
      args = ["-fsyntax-only"];
      args.push("-x" + language);
      if (std) {
        args.push("-std=" + std);
      }
      args.push("-Xclang", "-code-completion-macros");
      args.push("-Xclang", "-code-completion-at=-:" + (row + 1) + ":" + (column + 1));
      if (existsSync(pchPath)) {
        args.push("-include-pch", pchPath);
      }
      _ref1 = atom.config.get("autocomplete-clang.includePaths");
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        i = _ref1[_i];
        args.push("-I" + i);
      }
      args.push("-I" + currentDir);
      if (atom.config.get("autocomplete-clang.includeDocumentation")) {
        args.push("-Xclang", "-code-completion-brief-comments");
        if (atom.config.get("autocomplete-clang.includeNonDoxygenCommentsAsDocumentation")) {
          args.push("-fparse-all-comments");
        }
      }
      try {
        clangflags = ClangFlags.getClangFlags(editor.getPath());
        if (clangflags) {
          args = args.concat(clangflags);
        }
      } catch (_error) {
        error = _error;
        console.log(error);
      }
      args.push("-");
      return args;
    };

    return ClangProvider;

  })();

  LanguageUtil = {
    getSourceScopeLang: function(scopeSource, scopesArray) {
      var scope, _i, _len;
      for (_i = 0, _len = scopesArray.length; _i < _len; _i++) {
        scope = scopesArray[_i];
        if (scope in scopeSource) {
          return scopeSource[scope];
        }
      }
      return null;
    },
    prefixAtPosition: function(editor, bufferPosition) {
      var line, regex, _ref1;
      regex = /\w+$/;
      line = editor.getTextInRange([[bufferPosition.row, 0], bufferPosition]);
      return ((_ref1 = line.match(regex)) != null ? _ref1[0] : void 0) || '';
    },
    nearestSymbolPosition: function(editor, bufferPosition) {
      var line, matches, regex, symbol, symbolColumn;
      regex = /(\W+)\w*$/;
      line = editor.getTextInRange([[bufferPosition.row, 0], bufferPosition]);
      matches = line.match(regex);
      if (matches) {
        symbol = matches[1];
        symbolColumn = matches[0].indexOf(symbol) + symbol.length + (line.length - matches[0].length);
        return [new Point(bufferPosition.row, symbolColumn), symbol.slice(-1)];
      } else {
        return [bufferPosition, ''];
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2luX2NoYWxpYy8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtY2xhbmcvbGliL2NsYW5nLXByb3ZpZGVyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUlBO0FBQUEsTUFBQSxtSEFBQTs7QUFBQSxFQUFBLE9BQXVELE9BQUEsQ0FBUSxNQUFSLENBQXZELEVBQUMsYUFBQSxLQUFELEVBQVEsYUFBQSxLQUFSLEVBQWUsdUJBQUEsZUFBZixFQUFnQywyQkFBQSxtQkFBaEMsQ0FBQTs7QUFBQSxFQUNBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQURQLENBQUE7O0FBQUEsRUFFQyxhQUFjLE9BQUEsQ0FBUSxJQUFSLEVBQWQsVUFGRCxDQUFBOztBQUFBLEVBR0EsVUFBQSxHQUFhLE9BQUEsQ0FBUSxhQUFSLENBSGIsQ0FBQTs7QUFBQSxFQUtBLE1BQU0sQ0FBQyxPQUFQLEdBQ007K0JBQ0o7O0FBQUEsNEJBQUEsUUFBQSxHQUFVLHNEQUFWLENBQUE7O0FBQUEsNEJBQ0EsaUJBQUEsR0FBbUIsQ0FEbkIsQ0FBQTs7QUFBQSw0QkFHQSxXQUFBLEdBQ0U7QUFBQSxNQUFBLFlBQUEsRUFBYyxLQUFkO0FBQUEsTUFDQSxVQUFBLEVBQVksR0FEWjtBQUFBLE1BRUEsYUFBQSxFQUFlLGFBRmY7QUFBQSxNQUdBLGVBQUEsRUFBaUIsZUFIakI7S0FKRixDQUFBOztBQUFBLDRCQVNBLGNBQUEsR0FBZ0IsU0FBQyxJQUFELEdBQUE7QUFDZCxVQUFBLDRIQUFBO0FBQUEsTUFEZ0IsY0FBQSxRQUFRLHVCQUFBLGlCQUFpQixzQkFBQSxjQUN6QyxDQUFBO0FBQUEsTUFBQSxRQUFBLEdBQVcsWUFBWSxDQUFDLGtCQUFiLENBQWdDLElBQUMsQ0FBQSxXQUFqQyxFQUE4QyxlQUFlLENBQUMsY0FBaEIsQ0FBQSxDQUE5QyxDQUFYLENBQUE7QUFB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

//# sourceURL=/home/cin_chalic/.atom/packages/autocomplete-clang/lib/clang-provider.coffee
