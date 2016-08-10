(function() {
  var Logger;

  Logger = (function() {
    function Logger(name) {
      this.levels = {
        'ERROR': 40,
        'WARN': 30,
        'INFO': 20,
        'DEBUG': 10
      };
      this.name = name;
      this.level = 'INFO';
    }

    Logger.prototype.setLevel = function(level) {
      var key, keys;
      try {
        level = level.toUpperCase();
      } catch (_error) {}
      if (this.levels[level] == null) {
        keys = [];
        for (key in this.levels) {
          keys.push(key);
        }
        this._log('ERROR', 'Level must be one of: ' + keys.join(', '));
        return;
      }
      return this.level = level;
    };

    Logger.prototype.log = function(level, msg) {
      level = level.toUpperCase();
      if ((this.levels[level] != null) && this.levels[level] >= this.levels[this.level]) {
        return this._log(level, msg);
      }
    };

    Logger.prototype._log = function(level, msg) {
      var origLine;
      level = level.toUpperCase();
      origLine = this.originalLine();
      if (origLine[0] != null) {
        msg = '[' + origLine[0] + ':' + origLine[1] + '] ' + msg;
      }
      msg = '[' + level + '] ' + msg;
      msg = '[' + this.name + '] ' + msg;
      switch (level) {
        case 'DEBUG':
          return console.log(msg);
        case 'INFO':
          return console.log(msg);
        case 'WARN':
          return console.warn(msg);
        case 'ERROR':
          return console.error(msg);
      }
    };

    Logger.prototype.originalLine = function() {
      var e, file, first, line, m, s, _i, _len, _ref;
      e = new Error('dummy');
      file = null;
      line = null;
      first = true;
      _ref = e.stack.split('\n');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        s = _ref[_i];
        if (!first) {
          if (s.indexOf('at Logger.') === -1) {
            m = s.match(/\(?.+[\/\\]([^:]+):(\d+):\d+\)?$/);
            if (m != null) {
              file = m[1];
              line = m[2];
              break;
            }
          }
        }
        first = false;
      }
      return [file, line];
    };

    Logger.prototype.debug = function(msg) {
      return this.log('DEBUG', msg);
    };

    Logger.prototype.info = function(msg) {
      return this.log('INFO', msg);
    };

    Logger.prototype.warn = function(msg) {
      return this.log('WARN', msg);
    };

    Logger.prototype.error = function(msg) {
      return this.log('ERROR', msg);
    };

    return Logger;

  })();

  module.exports = Logger;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2luX2NoYWxpYy8uYXRvbS9wYWNrYWdlcy93YWthdGltZS9saWIvbG9nZ2VyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxNQUFBOztBQUFBLEVBQU07QUFFUyxJQUFBLGdCQUFDLElBQUQsR0FBQTtBQUNYLE1BQUEsSUFBQyxDQUFBLE1BQUQsR0FDRTtBQUFBLFFBQUEsT0FBQSxFQUFTLEVBQVQ7QUFBQSxRQUNBLE1BQUEsRUFBUSxFQURSO0FBQUEsUUFFQSxNQUFBLEVBQVEsRUFGUjtBQUFBLFFBR0EsT0FBQSxFQUFTLEVBSFQ7T0FERixDQUFBO0FBQUEsTUFLQSxJQUFDLENBQUEsSUFBRCxHQUFRLElBTFIsQ0FBQTtBQUFBLE1BTUEsSUFBQyxDQUFBLEtBQUQsR0FBUyxNQU5ULENBRFc7SUFBQSxDQUFiOztBQUFBLHFCQVNBLFFBQUEsR0FBVSxTQUFDLEtBQUQsR0FBQTtBQUNSLFVBQUEsU0FBQTtBQUFBO0FBQ0UsUUFBQSxLQUFBLEdBQVEsS0FBSyxDQUFDLFdBQU4sQ0FBQSxDQUFSLENBREY7T0FBQSxrQkFBQTtBQUVBLE1BQUEsSUFBTywwQkFBUDtBQUNFLFFBQUEsSUFBQSxHQUFPLEVBQVAsQ0FBQTtBQUNBLGFBQUEsa0JBQUEsR0FBQTtBQUNFLFVBQUEsSUFBSSxDQUFDLElBQUwsQ0FBVSxHQUFWLENBQUEsQ0FERjtBQUFBLFNBREE7QUFBQSxRQUdBLElBQUMsQ0FBQSxJQUFELENBQU0sT0FBTixFQUFlLHdCQUFBLEdBQTJCLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBVixDQUExQyxDQUhBLENBQUE7QUFJQSxjQUFBLENBTEY7T0FGQTthQVFBLElBQUMsQ0FBQSxLQUFELEdBQVMsTUFURDtJQUFBLENBVFYsQ0FBQTs7QUFBQSxxQkFvQkEsR0FBQSxHQUFLLFNBQUMsS0FBRCxFQUFRLEdBQVIs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

//# sourceURL=/home/cin_chalic/.atom/packages/wakatime/lib/logger.coffee
