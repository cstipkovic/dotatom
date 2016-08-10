(function() {
  var CompositeDisposable, Linter, LinterHtmlhint, findFile, linterPath, warn, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  linterPath = atom.packages.getLoadedPackage("linter").path;

  Linter = require("" + linterPath + "/lib/linter");

  _ref = require("" + linterPath + "/lib/utils"), findFile = _ref.findFile, warn = _ref.warn;

  CompositeDisposable = require("atom").CompositeDisposable;

  LinterHtmlhint = (function(_super) {
    __extends(LinterHtmlhint, _super);

    LinterHtmlhint.syntax = ['text.html.angular', 'text.html.basic', 'text.html.erb', 'text.html.gohtml', 'text.html.jsp', 'text.html.mustache', 'text.html.php', 'text.html.ruby'];

    LinterHtmlhint.prototype.cmd = ['htmlhint', '--verbose', '--extract=auto'];

    LinterHtmlhint.prototype.linterName = 'htmlhint';

    LinterHtmlhint.prototype.regex = 'line (?<line>[0-9]+), col (?<col>[0-9]+): (?<message>.+)';

    LinterHtmlhint.prototype.isNodeExecutable = true;

    LinterHtmlhint.prototype.setupHtmlHintRc = function() {
      var config, fileName, htmlHintRcPath;
      htmlHintRcPath = atom.config.get('linter.linter-htmlhint.htmlhintRcFilePath') || this.cwd;
      fileName = atom.config.get('linter.linter-htmlhint.htmlhintRcFileName') || '.htmlhintrc';
      config = findFile(htmlHintRcPath, [fileName]);
      if (config && __indexOf.call(this.cmd, '-c') < 0) {
        return this.cmd = this.cmd.concat(['-c', config]);
      }
    };

    function LinterHtmlhint(editor) {
      this.formatShellCmd = __bind(this.formatShellCmd, this);
      this.setupHtmlHintRc = __bind(this.setupHtmlHintRc, this);
      LinterHtmlhint.__super__.constructor.call(this, editor);
      this.disposables = new CompositeDisposable;
      this.disposables.add(atom.config.observe('linter-htmlhint.htmlhintExecutablePath', this.formatShellCmd));
      this.disposables.add(atom.config.observe('linter-htmlhint.htmlHintRcFilePath', this.setupHtmlHintRc));
      this.disposables.add(atom.config.observe('linter-htmlhint.htmlHintRcFileName', this.setupHtmlHintRc));
    }

    LinterHtmlhint.prototype.lintFile = function(filePath, callback) {
      return LinterHtmlhint.__super__.lintFile.call(this, filePath, callback);
    };

    LinterHtmlhint.prototype.formatShellCmd = function() {
      var htmlhintExecutablePath;
      htmlhintExecutablePath = atom.config.get('linter-htmlhint.htmlhintExecutablePath');
      return this.executablePath = "" + htmlhintExecutablePath;
    };

    LinterHtmlhint.prototype.formatMessage = function(match) {
      return ("" + match.message).slice(5, -5);
    };

    LinterHtmlhint.prototype.createMessage = function(match) {
      var level;
      if (match.message.slice(1, 5) === "[33m") {
        level = 'warning';
      } else if (match.message.slice(1, 5) === "[31m") {
        level = 'error';
      } else {
        level = 'info';
      }
      return {
        line: match.line,
        col: match.col,
        level: level,
        message: this.formatMessage(match),
        linter: this.linterName,
        range: this.computeRange(match)
      };
    };

    LinterHtmlhint.prototype.destroy = function() {
      LinterHtmlhint.__super__.destroy.apply(this, arguments);
      return this.disposables.dispose();
    };

    return LinterHtmlhint;

  })(Linter);

  module.exports = LinterHtmlhint;

}).call(this);
