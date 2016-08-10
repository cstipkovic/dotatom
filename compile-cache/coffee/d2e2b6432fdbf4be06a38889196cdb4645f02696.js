(function() {
  var Emitter, TodosMarkdown, TodosModel;

  Emitter = require('atom').Emitter;

  TodosMarkdown = require('./todos-markdown');

  module.exports = TodosModel = (function() {
    function TodosModel() {
      this.emitter = new Emitter;
      this.maxLength = 120;
      this.scope = 'full';
      this.todos = [];
    }

    TodosModel.prototype.onDidAddTodo = function(cb) {
      return this.emitter.on('did-add-todo', cb);
    };

    TodosModel.prototype.onDidRemoveTodo = function(cb) {
      return this.emitter.on('did-remove-todo', cb);
    };

    TodosModel.prototype.onDidClear = function(cb) {
      return this.emitter.on('did-clear-todos', cb);
    };

    TodosModel.prototype.onDidStartSearch = function(cb) {
      return this.emitter.on('did-start-search', cb);
    };

    TodosModel.prototype.onDidSearchPaths = function(cb) {
      return this.emitter.on('did-search-paths', cb);
    };

    TodosModel.prototype.onDidFinishSearch = function(cb) {
      return this.emitter.on('did-finish-search', cb);
    };

    TodosModel.prototype.onDidFailSearch = function(cb) {
      return this.emitter.on('did-fail-search', cb);
    };

    TodosModel.prototype.onDidSortTodos = function(cb) {
      return this.emitter.on('did-sort-todos', cb);
    };

    TodosModel.prototype.onDidFilterTodos = function(cb) {
      return this.emitter.on('did-filter-todos', cb);
    };

    TodosModel.prototype.onDidChangeSearchScope = function(cb) {
      return this.emitter.on('did-change-scope', cb);
    };

    TodosModel.prototype.clear = function() {
      this.cancelSearch();
      this.todos = [];
      return this.emitter.emit('did-clear-todos');
    };

    TodosModel.prototype.addTodo = function(todo) {
      this.todos.push(todo);
      return this.emitter.emit('did-add-todo', todo);
    };

    TodosModel.prototype.getTodos = function() {
      return this.todos;
    };

    TodosModel.prototype.sortTodos = function(_arg) {
      var sortAsc, sortBy;
      sortBy = _arg.sortBy, sortAsc = _arg.sortAsc;
      if (!sortBy) {
        return;
      }
      this.todos = this.todos.sort(function(a, b) {
        var aItem, bItem;
        if (!(aItem = a[sortBy.toLowerCase()])) {
          return -1;
        }
        if (!(bItem = b[sortBy.toLowerCase()])) {
          return 1;
        }
        if (aItem === bItem) {
          aItem = a.text;
          bItem = b.text;
        }
        if (sortAsc) {
          return aItem.localeCompare(bItem);
        } else {
          return bItem.localeCompare(aItem);
        }
      });
      if (this.filter) {
        return this.filterTodos(this.filter);
      }
      return this.emitter.emit('did-sort-todos', this.todos);
    };

    TodosModel.prototype.filterTodos = function(filter) {
      var item, key, result, todo, _i, _j, _len, _len1, _ref, _ref1;
      this.filter = filter;
      if (filter) {
        result = [];
        _ref = this.todos;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          todo = _ref[_i];
          _ref1 = atom.config.get('todo-show.showInTable');
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            key = _ref1[_j];
            item = todo[key.toLowerCase()];
            if (item && item.indexOf(filter) !== -1) {
              result.push(todo);
              break;
            }
          }
        }
      } else {
        result = this.todos;
      }
      return this.emitter.emit('did-filter-todos', result);
    };

    TodosModel.prototype.getAvailableTableItems = function() {
      return this.availableItems;
    };

    TodosModel.prototype.setAvailableTableItems = function(availableItems) {
      this.availableItems = availableItems;
    };

    TodosModel.prototype.isSearching = function() {
      return this.searching;
    };

    TodosModel.prototype.getSearchScope = function() {
      return this.scope;
    };

    TodosModel.prototype.setSearchScope = function(scope) {
      return this.emitter.emit('did-change-scope', this.scope = scope);
    };

    TodosModel.prototype.toggleSearchScope = function() {
      var scope;
      scope = (function() {
        switch (this.scope) {
          case 'full':
            return 'open';
          case 'open':
            return 'active';
          default:
            return 'full';
        }
      }).call(this);
      this.setSearchScope(scope);
      return scope;
    };

    TodosModel.prototype.buildRegexLookups = function(regexes) {
      var i, regex, _i, _len, _results;
      if (regexes.length % 2) {
        this.emitter.emit('did-fail-search', "Invalid number of regexes: " + regexes.length);
        return [];
      }
      _results = [];
      for (i = _i = 0, _len = regexes.length; _i < _len; i = _i += 2) {
        regex = regexes[i];
        _results.push({
          'title': regex,
          'regex': regexes[i + 1]
        });
      }
      return _results;
    };

    TodosModel.prototype.makeRegexObj = function(regexStr) {
      var flags, pattern, _ref, _ref1;
      if (regexStr == null) {
        regexStr = "";
      }
      pattern = (_ref = regexStr.match(/\/(.+)\//)) != null ? _ref[1] : void 0;
      flags = (_ref1 = regexStr.match(/\/(\w+$)/)) != null ? _ref1[1] : void 0;
      if (!pattern) {
        this.emitter.emit('did-fail-search', "Invalid regex: " + (regexStr || 'empty'));
        return false;
      }
      return new RegExp(pattern, flags);
    };

    TodosModel.prototype.handleScanMatch = function(match) {
      var matchText, tag, _matchText, _ref;
      matchText = match.text || match.all;
      while ((_matchText = (_ref = match.regexp) != null ? _ref.exec(matchText) : void 0)) {
        matchText = _matchText.pop();
      }
      match.tags = ((function() {
        var _results;
        _results = [];
        while ((tag = /\s#(\w+)[,.]?$/.exec(matchText))) {
          if (tag.length !== 2) {
            break;
          }
          matchText = matchText.slice(0, tag.shift().length * -1);
          _results.push(tag.shift());
        }
        return _results;
      })()).sort().join(', ');
      matchText = matchText.replace(/(\*\/|\?>|-->|#>|-}|\]\])\s*$/, '').trim();
      if (matchText.length >= this.maxLength) {
        matchText = "" + (matchText.substr(0, this.maxLength - 3)) + "...";
      }
      if (!(match.position && match.position.length > 0)) {
        match.position = [[0, 0]];
      }
      if (match.position.serialize) {
        match.range = match.position.serialize().toString();
      } else {
        match.range = match.position.toString();
      }
      match.text = matchText || "No details";
      match.file = atom.project.relativize(match.path);
      match.line = parseInt(match.range.split(',')[0]) + 1;
      return match;
    };

    TodosModel.prototype.fetchRegexItem = function(regexLookup) {
      var options, regex;
      regex = this.makeRegexObj(regexLookup.regex);
      if (!regex) {
        return false;
      }
      options = {
        paths: this.getIgnorePaths()
      };
      if (!this.firstRegex) {
        this.firstRegex = true;
        options.onPathsSearched = (function(_this) {
          return function(nPaths) {
            if (_this.searching) {
              return _this.emitter.emit('did-search-paths', nPaths);
            }
          };
        })(this);
      }
      return atom.workspace.scan(regex, options, (function(_this) {
        return function(result, error) {
          var match, _i, _len, _ref, _results;
          if (error) {
            console.debug(error.message);
          }
          if (!result) {
            return;
          }
          _ref = result.matches;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            match = _ref[_i];
            _results.push(_this.addTodo(_this.handleScanMatch({
              all: match.lineText,
              text: match.matchText,
              path: result.filePath,
              position: match.range,
              type: regexLookup.title,
              regex: regexLookup.regex,
              regexp: regex
            })));
          }
          return _results;
        };
      })(this));
    };

    TodosModel.prototype.fetchOpenRegexItem = function(regexLookup, activeEditorOnly) {
      var editor, editors, regex, _i, _len, _ref;
      regex = this.makeRegexObj(regexLookup.regex);
      if (!regex) {
        return false;
      }
      editors = [];
      if (activeEditorOnly) {
        if (editor = (_ref = atom.workspace.getPanes()[0]) != null ? _ref.getActiveEditor() : void 0) {
          editors = [editor];
        }
      } else {
        editors = atom.workspace.getTextEditors();
      }
      for (_i = 0, _len = editors.length; _i < _len; _i++) {
        editor = editors[_i];
        editor.scan(regex, (function(_this) {
          return function(match, error) {
            var range;
            if (error) {
              console.debug(error.message);
            }
            if (!match) {
              return;
            }
            range = [[match.computedRange.start.row, match.computedRange.start.column], [match.computedRange.end.row, match.computedRange.end.column]];
            return _this.addTodo(_this.handleScanMatch({
              all: match.lineText,
              text: match.matchText,
              path: editor.getPath(),
              position: range,
              type: regexLookup.title,
              regex: regexLookup.regex,
              regexp: regex
            }));
          };
        })(this));
      }
      return Promise.resolve();
    };

    TodosModel.prototype.search = function() {
      var findTheseRegexes, promise, regexObj, regexes, _i, _len;
      this.clear();
      this.searching = true;
      this.emitter.emit('did-start-search');
      if (!(findTheseRegexes = atom.config.get('todo-show.findTheseRegexes'))) {
        return;
      }
      regexes = this.buildRegexLookups(findTheseRegexes);
      for (_i = 0, _len = regexes.length; _i < _len; _i++) {
        regexObj = regexes[_i];
        promise = (function() {
          switch (this.scope) {
            case 'open':
              return this.fetchOpenRegexItem(regexObj, false);
            case 'active':
              return this.fetchOpenRegexItem(regexObj, true);
            default:
              return this.fetchRegexItem(regexObj);
          }
        }).call(this);
        this.searchPromises.push(promise);
      }
      return Promise.all(this.searchPromises).then((function(_this) {
        return function() {
          _this.searching = false;
          return _this.emitter.emit('did-finish-search');
        };
      })(this))["catch"]((function(_this) {
        return function(err) {
          _this.searching = false;
          return _this.emitter.emit('did-fail-search', err);
        };
      })(this));
    };

    TodosModel.prototype.getIgnorePaths = function() {
      var ignore, ignores, _i, _len, _results;
      ignores = atom.config.get('todo-show.ignoreThesePaths');
      if (ignores == null) {
        return ['*'];
      }
      if (Object.prototype.toString.call(ignores) !== '[object Array]') {
        this.emitter.emit('did-fail-search', "ignoreThesePaths must be an array");
        return ['*'];
      }
      _results = [];
      for (_i = 0, _len = ignores.length; _i < _len; _i++) {
        ignore = ignores[_i];
        _results.push("!" + ignore);
      }
      return _results;
    };

    TodosModel.prototype.getMarkdown = function() {
      var todosMarkdown;
      todosMarkdown = new TodosMarkdown;
      return todosMarkdown.markdown(this.getTodos());
    };

    TodosModel.prototype.cancelSearch = function() {
      var promise, _i, _len, _ref, _results;
      if (this.searchPromises == null) {
        this.searchPromises = [];
      }
      _ref = this.searchPromises;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        promise = _ref[_i];
        if (promise) {
          _results.push(typeof promise.cancel === "function" ? promise.cancel() : void 0);
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    return TodosModel;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2luX2NoYWxpYy8uYXRvbS9wYWNrYWdlcy90b2RvLXNob3cvbGliL3RvZG9zLW1vZGVsLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxrQ0FBQTs7QUFBQSxFQUFDLFVBQVcsT0FBQSxDQUFRLE1BQVIsRUFBWCxPQUFELENBQUE7O0FBQUEsRUFDQSxhQUFBLEdBQWdCLE9BQUEsQ0FBUSxrQkFBUixDQURoQixDQUFBOztBQUFBLEVBR0EsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNTLElBQUEsb0JBQUEsR0FBQTtBQUNYLE1BQUEsSUFBQyxDQUFBLE9BQUQsR0FBVyxHQUFBLENBQUEsT0FBWCxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsU0FBRCxHQUFhLEdBRGIsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLEtBQUQsR0FBUyxNQUZULENBQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxLQUFELEdBQVMsRUFIVCxDQURXO0lBQUEsQ0FBYjs7QUFBQSx5QkFNQSxZQUFBLEdBQWMsU0FBQyxFQUFELEdBQUE7YUFBUSxJQUFDLENBQUEsT0FBTyxDQUFDLEVBQVQsQ0FBWSxjQUFaLEVBQTRCLEVBQTVCLEVBQVI7SUFBQSxDQU5kLENBQUE7O0FBQUEseUJBT0EsZUFBQSxHQUFpQixTQUFDLEVBQUQsR0FBQTthQUFRLElBQUMsQ0FBQSxPQUFPLENBQUMsRUFBVCxDQUFZLGlCQUFaLEVBQStCLEVBQS9CLEVBQVI7SUFBQSxDQVBqQixDQUFBOztBQUFBLHlCQVFBLFVBQUEsR0FBWSxTQUFDLEVBQUQsR0FBQTthQUFRLElBQUMsQ0FBQSxPQUFPLENBQUMsRUFBVCxDQUFZLGlCQUFaLEVBQStCLEVBQS9CLEVBQVI7SUFBQSxDQVJaLENBQUE7O0FBQUEseUJBU0EsZ0JBQUEsR0FBa0IsU0FBQyxFQUFELEdBQUE7YUFBUSxJQUFD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

//# sourceURL=/home/cin_chalic/.atom/packages/todo-show/lib/todos-model.coffee
