(function() {
  var Citation;

  module.exports = Citation = (function() {
    function Citation() {}

    Citation.key = null;

    Citation.properties = null;

    Citation.prototype.get = function(field) {
      var property, _i, _len, _ref;
      if (this.properties == null) {
        return null;
      }
      if (field === "key") {
        return this.key;
      }
      _ref = this.properties;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        property = _ref[_i];
        if (property.name === field) {
          return property.content;
        }
      }
      return null;
    };

    Citation.prototype.splitBib = function(text) {
      var balance, ch, delim, i, last, splits, _i, _len;
      splits = [];
      balance = 0;
      last = -1;
      for (i = _i = 0, _len = text.length; _i < _len; i = ++_i) {
        ch = text[i];
        if ((ch === ',') && (balance === 0)) {
          splits.push(text.substring(last + 1, i));
          last = i;
        } else if ((ch === '\"') && (balance === 0)) {
          delim = "\"";
          balance++;
        } else if ((ch === '{') && (balance === 0)) {
          delim = '{';
          balance++;
        } else if (balance !== 0) {
          if ((ch === delim) && (delim === '{')) {
            balance++;
          }
          if ((ch === '}') && (delim === '{')) {
            balance--;
          }
          if ((ch === delim) && (delim === "\"")) {
            balance = 0;
          }
        }
      }
      if ((last + 1) !== (text.length - 1)) {
        splits.push(text.substring(last + 1, text.length));
      }
      return splits;
    };

    Citation.prototype.parse = function(text) {
      var bInd, balance, ch, content, eq, i, it, item, items, name, qInd, term, termInd, _i, _j, _len, _len1, _results;
      if (text == null) {
        return;
      }
      text = text.replace(/\n|\r/g, " ");
      if (text.indexOf("}") === -1) {
        return;
      }
      balance = 1;
      it = text.indexOf("{") + 1;
      if (it === 0) {
        return;
      }
      text = text.substring(it);
      balance = 1;
      for (i = _i = 0, _len = text.length; _i < _len; i = ++_i) {
        ch = text[i];
        if (ch === '{') {
          balance++;
        }
        if (ch === '}') {
          balance--;
        }
        if (balance === 0) {
          break;
        }
      }
      if (balance !== 0) {
        return;
      }
      text = text.substring(0, i);
      items = this.splitBib(text);
      if (items.length === 0) {
        return;
      }
      this.key = items[0];
      items.splice(0, 1);
      this.key = this.key.replace(/\s+/g, "");
      this.properties = [];
      _results = [];
      for (_j = 0, _len1 = items.length; _j < _len1; _j++) {
        item = items[_j];
        eq = item.indexOf("=");
        if (eq === -1 || eq === (item.length - 1)) {
          continue;
        }
        name = item.substring(0, eq).replace(/\s+/g, "").toLowerCase();
        content = item.substring(eq + 1);
        qInd = content.indexOf("\"");
        bInd = content.indexOf("{");
        if ((qInd < 0) && (bInd < 0)) {
          continue;
        }
        if ((qInd !== -1 && qInd < bInd) || (bInd === -1)) {
          content = content.substring(qInd + 1);
          term = "\"";
        } else {
          content = content.substring(bInd + 1);
          term = "}";
        }
        termInd = content.lastIndexOf(term);
        if (termInd < 0) {
          continue;
        }
        content = content.substring(0, termInd);
        content = content.replace(/\s+/g, " ");
        _results.push(this.properties.push({
          name: name,
          content: content
        }));
      }
      return _results;
    };

    return Citation;

  })();

}).call(this);
