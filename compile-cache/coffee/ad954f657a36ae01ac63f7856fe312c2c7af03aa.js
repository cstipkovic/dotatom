(function() {
  var CompositeDisposable, path,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  path = require('path');

  CompositeDisposable = require('atom').CompositeDisposable;

  module.exports = {
    config: {
      executablePath: {
        "default": path.join(__dirname, '..', 'node_modules', 'htmlhint', 'bin', 'htmlhint'),
        type: 'string',
        description: 'HTMLHint Executable Path'
      }
    },
    activate: function() {
      console.log('activate linter-htmlhint');
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.config.observe('linter-htmlhint.executablePath', (function(_this) {
        return function(executablePath) {
          return _this.executablePath = executablePath;
        };
      })(this)));
      return this.scopes = ['text.html.angular', 'text.html.basic', 'text.html.erb', 'text.html.gohtml', 'text.html.jsp', 'text.html.mustache', 'text.html.handlebars', 'text.html.php', 'text.html.ruby'];
    },
    deactivate: function() {
      return this.subscriptions.dispose();
    },
    provideLinter: function() {
      var helpers, provider;
      helpers = require('atom-linter');
      return provider = {
        grammarScopes: this.scopes,
        scope: 'file',
        lintOnFly: true,
        lint: function(textEditor) {
          var filePath, htmlhintrc, parameters, text;
          filePath = textEditor.getPath();
          htmlhintrc = helpers.findFile(filePath, '.htmlhintrc');
          text = textEditor.getText();
          parameters = [filePath, '--format', 'json'];
          if (htmlhintrc && __indexOf.call(parameters, '-c') < 0) {
            parameters = parameters.concat(['-c', htmlhintrc]);
          }
          return helpers.execNode(atom.config.get('linter-htmlhint.executablePath'), parameters, {}).then(function(output) {
            var linterMessages, linterResults;
            linterResults = JSON.parse(output);
            if (!linterResults.length) {
              return [];
            }
            linterMessages = linterResults[0].messages;
            return linterMessages.map(function(msg) {
              return {
                range: [[msg.line - 1, msg.col - 1], [msg.line - 1, msg.col - 1]],
                type: msg.type,
                text: msg.message,
                filePath: filePath
              };
            });
          });
        }
      };
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2luX2NoYWxpYy8uYXRvbS9wYWNrYWdlcy9saW50ZXItaHRtbGhpbnQvbGliL2luaXQuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHlCQUFBO0lBQUEscUpBQUE7O0FBQUEsRUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FBUCxDQUFBOztBQUFBLEVBRUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSLEVBQXZCLG1CQUZELENBQUE7O0FBQUEsRUFJQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxNQUFBLEVBQ0U7QUFBQSxNQUFBLGNBQUEsRUFDRTtBQUFBLFFBQUEsU0FBQSxFQUFTLElBQUksQ0FBQyxJQUFMLENBQVUsU0FBVixFQUFxQixJQUFyQixFQUEyQixjQUEzQixFQUEyQyxVQUEzQyxFQUF1RCxLQUF2RCxFQUE4RCxVQUE5RCxDQUFUO0FBQUEsUUFDQSxJQUFBLEVBQU0sUUFETjtBQUFBLFFBRUEsV0FBQSxFQUFhLDBCQUZiO09BREY7S0FERjtBQUFBLElBS0EsUUFBQSxFQUFVLFNBQUEsR0FBQTtBQUNOLE1BQUEsT0FBTyxDQUFDLEdBQVIsQ0FBWSwwQkFBWixDQUFBLENBQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxhQUFELEdBQWlCLEdBQUEsQ0FBQSxtQkFIakIsQ0FBQTtBQUFBLE1BSUEsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBWixDQUFvQixnQ0FBcEIsRUFDakIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsY0FBRCxHQUFBO2lCQUNFLEtBQUMsQ0FBQSxjQUFELEdBQWtCLGVBRHBCO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FEaUIsQ0FBbkIsQ0FKQSxDQUFBO2FBT0EsSUFBQyxDQUFB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

//# sourceURL=/home/cin_chalic/.atom/packages/linter-htmlhint/lib/init.coffee
