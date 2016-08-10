(function() {
  var Emitter, TodoModel, maxLength, _;

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
      if (value = this[key.toLowerCase()]) {
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
          return " " + value;
        case 'Text':
          return " " + value;
        case 'Type':
          return " __" + value + "__";
        case 'Range':
          return " _:" + value + "_";
        case 'Line':
          return " _:" + value + "_";
        case 'Regex':
          return " _'" + value + "'_";
        case 'File':
          return " [" + value + "](" + value + ")";
        case 'Tags':
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
        if (item.indexOf(string) !== -1) {
          return true;
        }
      }
      return false;
    };

    TodoModel.prototype.handleScanMatch = function(match) {
      var matchText, tag, _matchText, _ref;
      matchText = match.text || match.all || '';
      while ((_matchText = (_ref = match.regexp) != null ? _ref.exec(matchText) : void 0)) {
        matchText = _matchText.pop();
      }
      matchText = matchText.replace(/(\*\/|\?>|-->|#>|-}|\]\])\s*$/, '').trim();
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
      match.text = matchText || "No details";
      match.line = (parseInt(match.range.split(',')[0]) + 1).toString();
      if (match.file == null) {
        match.file = atom.project.relativize(match.path);
      }
      return _.extend(this, match);
    };

    return TodoModel;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2luX2NoYWxpYy8uYXRvbS9wYWNrYWdlcy90b2RvLXNob3cvbGliL3RvZG8tbW9kZWwuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGdDQUFBOztBQUFBLEVBQUMsVUFBVyxPQUFBLENBQVEsTUFBUixFQUFYLE9BQUQsQ0FBQTs7QUFBQSxFQUNBLENBQUEsR0FBSSxPQUFBLENBQVEsaUJBQVIsQ0FESixDQUFBOztBQUFBLEVBR0EsU0FBQSxHQUFZLEdBSFosQ0FBQTs7QUFBQSxFQUtBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDUyxJQUFBLG1CQUFDLEtBQUQsRUFBUSxJQUFSLEdBQUE7QUFDWCxVQUFBLEtBQUE7QUFBQSxNQURvQix3QkFBRCxPQUFVLElBQVQsS0FDcEIsQ0FBQTtBQUFBLE1BQUEsSUFBZ0MsS0FBaEM7QUFBQSxlQUFPLENBQUMsQ0FBQyxNQUFGLENBQVMsSUFBVCxFQUFlLEtBQWYsQ0FBUCxDQUFBO09BQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxlQUFELENBQWlCLEtBQWpCLENBREEsQ0FEVztJQUFBLENBQWI7O0FBQUEsd0JBSUEsVUFBQSxHQUFZLFNBQUEsR0FBQTthQUNWLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQix1QkFBaEIsQ0FBQSxJQUE0QyxDQUFDLE1BQUQsRUFEbEM7SUFBQSxDQUpaLENBQUE7O0FBQUEsd0JBT0EsR0FBQSxHQUFLLFNBQUMsR0FBRCxHQUFBO0FBQ0gsVUFBQSxLQUFBOztRQURJLE1BQU07T0FDVjtBQUFBLE1BQUEsSUFBZ0IsS0FBQSxHQUFRLElBQUUsQ0FBQSxHQUFHLENBQUMsV0FBSixDQUFBLENBQUEsQ0FBMUI7QUFBQSxlQUFPLEtBQVAsQ0FBQTtPQUFBO2FBQ0EsSUFBQyxDQUFBLElBQUQsSUFBUyxhQUZOO0lBQUEsQ0FQTCxDQUFBOztB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

//# sourceURL=/home/cin_chalic/.atom/packages/todo-show/lib/todo-model.coffee
