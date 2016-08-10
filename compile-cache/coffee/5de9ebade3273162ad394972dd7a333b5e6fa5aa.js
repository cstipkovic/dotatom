(function() {
  var NpmDocsView, open, request, roaster, url;

  open = require('open');

  roaster = require('roaster');

  request = require('request');

  url = require('url');

  NpmDocsView = require('./npm-docs-view');

  module.exports = {
    npmDocsView: null,
    activate: function(state) {
      atom.workspace.registerOpener(function(uriToOpen) {
        var host, protocol, _ref;
        _ref = url.parse(uriToOpen), protocol = _ref.protocol, host = _ref.host;
        if (protocol !== 'npm-docs:') {
          return;
        }
        return new NpmDocsView(host);
      });
      atom.workspaceView.command("npm-docs:open", (function(_this) {
        return function() {
          return open("https://npmjs.org/package/" + (_this.getSelection()));
        };
      })(this));
      atom.workspaceView.command("npm-docs:homepage", (function(_this) {
        return function() {
          return _this.search(function(err, json, selection) {
            if (err) {
              throw err;
            }
            return open(json.homepage);
          });
        };
      })(this));
      return atom.workspaceView.command("npm-docs:readme", (function(_this) {
        return function() {
          return _this.search(function(err, json, selection) {
            var markdown;
            if (err) {
              throw err;
            }
            markdown = json.readme;
            if (!markdown) {
              return;
            }
            return roaster(markdown, {}, function(err, contents) {
              var previousActivePane, uri;
              if (err) {
                throw err;
              }
              uri = "npm-docs://" + selection;
              previousActivePane = atom.workspace.getActivePane();
              return atom.workspace.open(uri, {
                split: 'right',
                searchAllPanes: true
              }).done(function(npmDocsView) {
                npmDocsView.renderContents(contents);
                return previousActivePane.activate();
              });
            });
          });
        };
      })(this));
    },
    getSelection: function() {
      var editor;
      editor = atom.workspace.getActiveEditor();
      return editor.getSelection().getText() || editor.getWordUnderCursor();
    },
    search: function(cb) {
      var selection;
      selection = this.getSelection();
      return request.get("https://registry.npmjs.org/" + selection, function(err, res) {
        var json;
        if (err) {
          throw err;
        }
        if (res.statusCode === 200) {
          json = JSON.parse(res.body);
          return cb(null, json, selection);
        } else {
          return cb('not found');
        }
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2luX2NoYWxpYy8uYXRvbS9wYWNrYWdlcy9ucG0tZG9jcy9saWIvbnBtLWRvY3MuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHdDQUFBOztBQUFBLEVBQUEsSUFBQSxHQUFjLE9BQUEsQ0FBUSxNQUFSLENBQWQsQ0FBQTs7QUFBQSxFQUNBLE9BQUEsR0FBYyxPQUFBLENBQVEsU0FBUixDQURkLENBQUE7O0FBQUEsRUFFQSxPQUFBLEdBQWMsT0FBQSxDQUFRLFNBQVIsQ0FGZCxDQUFBOztBQUFBLEVBR0EsR0FBQSxHQUFjLE9BQUEsQ0FBUSxLQUFSLENBSGQsQ0FBQTs7QUFBQSxFQUlBLFdBQUEsR0FBYyxPQUFBLENBQVEsaUJBQVIsQ0FKZCxDQUFBOztBQUFBLEVBTUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsV0FBQSxFQUFhLElBQWI7QUFBQSxJQUVBLFFBQUEsRUFBVSxTQUFDLEtBQUQsR0FBQTtBQUNSLE1BQUEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxjQUFmLENBQThCLFNBQUMsU0FBRCxHQUFBO0FBQzVCLFlBQUEsb0JBQUE7QUFBQSxRQUFBLE9BQW1CLEdBQUcsQ0FBQyxLQUFKLENBQVUsU0FBVixDQUFuQixFQUFDLGdCQUFBLFFBQUQsRUFBVyxZQUFBLElBQVgsQ0FBQTtBQUNBLFFBQUEsSUFBYyxRQUFBLEtBQVksV0FBMUI7QUFBQSxnQkFBQSxDQUFBO1NBREE7ZUFFSSxJQUFBLFdBQUEsQ0FBWSxJQUFaLEVBSHdCO01BQUEsQ0FBOUIsQ0FBQSxDQUFBO0FBQUEsTUFLQSxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQW5CLENBQTJCLGVBQTNCLEVBQTRDLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQzFDLElBQUEsQ0FBTSw0QkFBQSxHQUEyQixDQUFDLEtBQUMs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

//# sourceURL=/home/cin_chalic/.atom/packages/npm-docs/lib/npm-docs.coffee
