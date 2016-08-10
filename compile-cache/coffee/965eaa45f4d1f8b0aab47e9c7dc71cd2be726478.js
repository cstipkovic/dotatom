(function() {
  var Emitter, TodoModel, maxLength, path, _;

  path = require('path');

  Emitter = require('atom').Emitter;

  _ = require('underscore-plus');

  maxLength = 120;

  module.exports = TodoModel = (function() {
    function TodoModel(match, _arg) {
      var plain;
      plain = (_arg != null ? _arg : []).plain;
      if (plain) {
        return _.extend(this, match);
      }
      this.handleScanMatch(match);
    }

    TodoModel.prototype.getAllKeys = function() {
      return atom.config.get('todo-show.showInTable') || ['Text'];
    };

    TodoModel.prototype.get = function(key) {
      var value;
      if (key == null) {
        key = '';
      }
      if ((value = this[key.toLowerCase()]) || value === '') {
        return value;
      }
      return this.text || 'No details';
    };

    TodoModel.prototype.getMarkdown = function(key) {
      var value;
      if (key == null) {
        key = '';
      }
      if (!(value = this[key.toLowerCase()])) {
        return '';
      }
      switch (key) {
        case 'All':
        case 'Text':
          return " " + value;
        case 'Type':
        case 'Project':
          return " __" + value + "__";
        case 'Range':
        case 'Line':
          return " _:" + value + "_";
        case 'Regex':
          return " _'" + value + "'_";
        case 'Path':
        case 'File':
          return " [" + value + "](" + value + ")";
        case 'Tags':
        case 'Id':
          return " _" + value + "_";
      }
    };

    TodoModel.prototype.getMarkdownArray = function(keys) {
      var key, _i, _len, _ref, _results;
      _ref = keys || this.getAllKeys();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        key = _ref[_i];
        _results.push(this.getMarkdown(key));
      }
      return _results;
    };

    TodoModel.prototype.keyIsNumber = function(key) {
      return key === 'Range' || key === 'Line';
    };

    TodoModel.prototype.contains = function(string) {
      var item, key, _i, _len, _ref;
      if (string == null) {
        string = '';
      }
      _ref = this.getAllKeys();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        key = _ref[_i];
        if (!(item = this.get(key))) {
          break;
        }
        if (item.toLowerCase().indexOf(string.toLowerCase()) !== -1) {
          return true;
        }
      }
      return false;
    };

    TodoModel.prototype.handleScanMatch = function(match) {
      var loc, matchText, matches, pos, project, relativePath, tag, _matchText, _ref, _ref1, _ref2;
      matchText = match.text || match.all || '';
      while ((_matchText = (_ref = match.regexp) != null ? _ref.exec(matchText) : void 0)) {
        if (!match.type) {
          match.type = _matchText[1];
        }
        matchText = _matchText.pop();
      }
      if (matchText.indexOf('(') === 0) {
        if (matches = matchText.match(/\((.*?)\):?(.*)/)) {
          matchText = matches.pop();
          match.id = matches.pop();
        }
      }
      matchText = this.stripCommentEnd(matchText);
      match.tags = ((function() {
        var _results;
        _results = [];
        while ((tag = /\s*#(\w+)[,.]?$/.exec(matchText))) {
          if (tag.length !== 2) {
            break;
          }
          matchText = matchText.slice(0, -tag.shift().length);
          _results.push(tag.shift());
        }
        return _results;
      })()).sort().join(', ');
      if (!matchText && match.all && (pos = (_ref1 = match.position) != null ? (_ref2 = _ref1[0]) != null ? _ref2[1] : void 0 : void 0)) {
        matchText = match.all.substr(0, pos);
        matchText = this.stripCommentStart(matchText);
      }
      if (matchText.length >= maxLength) {
        matchText = "" + (matchText.substr(0, maxLength - 3)) + "...";
      }
      if (!(match.position && match.position.length > 0)) {
        match.position = [[0, 0]];
      }
      if (match.position.serialize) {
        match.range = match.position.serialize().toString();
      } else {
        match.range = match.position.toString();
      }
      relativePath = atom.project.relativizePath(match.loc);
      match.path = relativePath[1] || '';
      if ((loc = path.basename(match.loc)) !== 'undefined') {
        match.file = loc;
      } else {
        match.file = 'untitled';
      }
      if ((project = path.basename(relativePath[0])) !== 'null') {
        match.project = project;
      } else {
        match.project = '';
      }
      match.text = matchText || "No details";
      match.line = (parseInt(match.range.split(',')[0]) + 1).toString();
      match.regex = match.regex.replace('${TODOS}', match.type);
      match.id = match.id || '';
      return _.extend(this, match);
    };

    TodoModel.prototype.stripCommentStart = function(text) {
      var startRegex;
      if (text == null) {
        text = '';
      }
      startRegex = /(\/\*|<\?|<!--|<#|{-|\[\[|\/\/|#)\s*$/;
      return text.replace(startRegex, '').trim();
    };

    TodoModel.prototype.stripCommentEnd = function(text) {
      var endRegex;
      if (text == null) {
        text = '';
      }
      endRegex = /(\*\/}?|\?>|-->|#>|-}|\]\])\s*$/;
      return text.replace(endRegex, '').trim();
    };

    return TodoModel;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2luX2NoYWxpYy8uYXRvbS9wYWNrYWdlcy90b2RvLXNob3cvbGliL3RvZG8tbW9kZWwuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHNDQUFBOztBQUFBLEVBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBQVAsQ0FBQTs7QUFBQSxFQUVDLFVBQVcsT0FBQSxDQUFRLE1BQVIsRUFBWCxPQUZELENBQUE7O0FBQUEsRUFHQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSLENBSEosQ0FBQTs7QUFBQSxFQUtBLFNBQUEsR0FBWSxHQUxaLENBQUE7O0FBQUEsRUFPQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ1MsSUFBQSxtQkFBQyxLQUFELEVBQVEsSUFBUixHQUFBO0FBQ1gsVUFBQSxLQUFBO0FBQUEsTUFEb0Isd0JBQUQsT0FBVSxJQUFULEtBQ3BCLENBQUE7QUFBQSxNQUFBLElBQWdDLEtBQWhDO0FBQUEsZUFBTyxDQUFDLENBQUMsTUFBRixDQUFTLElBQVQsRUFBZSxLQUFmLENBQVAsQ0FBQTtPQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsZUFBRCxDQUFpQixLQUFqQixDQURBLENBRFc7SUFBQSxDQUFiOztBQUFBLHdCQUlBLFVBQUEsR0FBWSxTQUFBLEdBQUE7YUFDVixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsdUJBQWhCLENBQUEsSUFBNEMsQ0FBQyxNQUFELEVBRGxDO0lBQUEsQ0FKWixDQUFBOztBQUFBLHdCQU9BLEdBQUEsR0FBSyxTQUFDLEdBQUQsR0FBQTtBQUNILFVBQUEsS0FBQTs7UUFESSxNQUFNO09BQ1Y7QUFBQSxNQUFBLElBQWdCLENBQUMsS0FBQSxHQUFRLElBQUUsQ0FBQSxHQUFHLENBQUMsV0FBSixDQUFBLENBQUEsQ0FBWCxDQUFBLElBQWtDLEtBQUEsS0FBUyxF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

//# sourceURL=/home/cin_chalic/.atom/packages/todo-show/lib/todo-model.coffee
