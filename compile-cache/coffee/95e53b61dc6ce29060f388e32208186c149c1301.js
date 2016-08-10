(function() {
  var LinterTern;

  LinterTern = (function() {
    LinterTern.prototype.name = 'Tern';

    LinterTern.prototype.grammarScopes = ['source.js'];

    LinterTern.prototype.scope = 'file';

    LinterTern.prototype.lintOnFly = true;

    LinterTern.prototype.manager = null;

    function LinterTern(manager) {
      this.manager = manager;
      if (!this.manager) {
        return;
      }
    }

    LinterTern.prototype.lint = function(textEditor) {
      return new Promise((function(_this) {
        return function(resolve, reject) {
          var URI, buffer, messages, text, _ref, _ref1, _ref2, _ref3;
          if (!((_ref = _this.manager.config) != null ? (_ref1 = _ref.config) != null ? (_ref2 = _ref1.plugins.lint) != null ? _ref2.active : void 0 : void 0 : void 0)) {
            return resolve([]);
          }
          if (!_this.manager.server) {
            return resolve([]);
          }
          messages = [];
          buffer = textEditor.getBuffer();
          URI = atom.project.relativizePath(textEditor.getURI())[1];
          text = textEditor.getText();
          return (_ref3 = _this.manager.client) != null ? _ref3.update(textEditor).then(function(data) {
            if (data.isQueried) {
              return;
            }
            return _this.manager.client.lint(URI, text).then(function(data) {
              var message, positionFrom, positionTo, _i, _len, _ref4;
              if (!(data != null ? data.messages : void 0)) {
                return resolve([]);
              }
              _ref4 = data.messages;
              for (_i = 0, _len = _ref4.length; _i < _len; _i++) {
                message = _ref4[_i];
                positionFrom = buffer.positionForCharacterIndex(message.from);
                positionTo = buffer.positionForCharacterIndex(message.to);
                messages.push({
                  text: message.message,
                  type: message.severity,
                  filePath: buffer.file.path,
                  range: [[positionFrom.row, positionFrom.column], [positionTo.row, positionTo.column]]
                });
              }
              return resolve(messages);
            });
          }) : void 0;
        };
      })(this));
    };

    return LinterTern;

  })();

  module.exports = LinterTern;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2luX2NoYWxpYy8uYXRvbS9wYWNrYWdlcy9hdG9tLXRlcm5qcy9saWIvbGludGVyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxVQUFBOztBQUFBLEVBQU07QUFFSix5QkFBQSxJQUFBLEdBQU0sTUFBTixDQUFBOztBQUFBLHlCQUNBLGFBQUEsR0FBZSxDQUFDLFdBQUQsQ0FEZixDQUFBOztBQUFBLHlCQUVBLEtBQUEsR0FBTyxNQUZQLENBQUE7O0FBQUEseUJBR0EsU0FBQSxHQUFXLElBSFgsQ0FBQTs7QUFBQSx5QkFJQSxPQUFBLEdBQVMsSUFKVCxDQUFBOztBQU1hLElBQUEsb0JBQUMsT0FBRCxHQUFBO0FBQ1gsTUFBQSxJQUFDLENBQUEsT0FBRCxHQUFXLE9BQVgsQ0FBQTtBQUNBLE1BQUEsSUFBQSxDQUFBLElBQWUsQ0FBQSxPQUFmO0FBQUEsY0FBQSxDQUFBO09BRlc7SUFBQSxDQU5iOztBQUFBLHlCQVVBLElBQUEsR0FBTSxTQUFDLFVBQUQsR0FBQTtBQUNKLGFBQVcsSUFBQSxPQUFBLENBQVEsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsT0FBRCxFQUFVLE1BQVYsR0FBQTtBQUNqQixjQUFBLHNEQUFBO0FBQUEsVUFBQSxJQUFBLENBQUEscUhBQThELENBQUUsa0NBQWhFO0FBQUEsbUJBQU8sT0FBQSxDQUFRLEVBQVIsQ0FBUCxDQUFBO1dBQUE7QUFDQSxVQUFBLElBQUEsQ0FBQSxLQUEwQixDQUFBLE9BQU8sQ0FBQyxNQUFsQztBQUFBLG1CQUFPLE9BQUEsQ0FBUSxFQUFSLENBQVAsQ0FBQTtXQURBO0FBQUEsVUFHQSxRQUFBLEdBQVcsRUFIWCxDQUFBO0FBQUEsVUFLQSxNQUFBLEdBQVMsVUFBVSxDQUFDLFNBQVgsQ0FBQSxDQUxULENBQUE7QUFBQSxVQU1BLEdBQUEsR0FBTSxJQUFJLENBQUMsT0FBTyxDQUFDLGNBQWIsQ0FBNEIsVUFBVSxDQUFDLE1BQVgsQ0FBQSxDQUE1QixDQUFpRCxDQUFBLENBQUEsQ0FOdkQsQ0FBQTtBQUFBLFVBUUEsSUFBQSxHQUFPLFVBQVUsQ0FBQyxPQUFYLENBQUEsQ0FSUCxDQUFBOytEQVNlLENBQUUsTUFBakIsQ0FBd0IsVUFBeEIsQ0FBbUMsQ0FBQyxJQUFwQyxDQUF5QyxTQUFDLElBQUQsR0FBQTtBQUN2QyxZQUFBLElBQVUsSUFBSSxDQUFDLFNBQWY7QUFBQSxvQkFBQSxDQUFBO2FBQUE7bUJBQ0EsS0FBQyxDQUFBLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBaEIsQ0FBcUIsR0FBckIsRUFBMEIsSUFBMUIsQ0FBK0IsQ0FBQyxJQUFoQyxDQUFxQyxTQUFDLElBQUQsR0FBQTtBQUNuQyxrQkFBQSxrREFBQTtBQUFBLGNBQUEsSUFBQSxDQUFBLGdCQUF5QixJQUFJLENBQUUsa0JBQS9CO0FBQUEsdUJBQU8sT0FBQSxDQUFRLEVBQVIsQ0FBUCxDQUFBO2VBQUE7QUFDQTtBQUFBLG1CQUFBLDRDQUFBO29DQUFBO0FBQ0UsZ0JBQUEsWUFBQSxHQUFlLE1BQU0sQ0FBQyx5QkFBUCxDQUFpQyxPQUFPLENBQUMsSUFBekMsQ0FBZixDQUFBO0FBQUEsZ0JBQ0EsVUFBQSxHQUFhLE1BQU0sQ0FBQyx5QkFBUCxDQUFpQyxPQUFPLENBQUMsRUFBekMsQ0FEYixDQUFBO0FBQUEsZ0JBRUEsUUFBUSxDQUFDLElBQVQsQ0FDRTtBQUFBLGtCQUFBLElBQUEsRUFBTSxPQUFPLENBQUMsT0FBZDtBQUFBLGtCQUNBLElBQUEsRUFBTSxPQUFPLENBQUMsUUFEZDtBQUFBLGtCQUVBLFFBQUEsRUFBVSxNQUFNLENBQUMsSUFBSSxDQUFDLElBRnRCO0FBQUEsa0JBR0EsS0FBQSxFQUFPLENBQ0wsQ0FBQyxZQUFZLENBQUMsR0FBZCxFQUFtQixZQUFZLENBQUMsTUFBaEMsQ0FESyxFQUVMLENBQUMsVUFBVSxDQUFDLEdBQVosRUFBaUIsVUFBVSxDQUFDLE1BQTVCLENBRkssQ0FIUDtpQkFERixDQUZBLENBREY7QUFBQSxlQURBO0FBWUEscUJBQU8sT0FBQSxDQUFRLFFBQVIsQ0FBUCxDQWJtQztZQUFBLENBQXJDLEVBRnVDO1VBQUEsQ0FBekMsV0FWaUI7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFSLENBQVgsQ0FESTtJQUFBLENBVk4sQ0FBQTs7c0JBQUE7O01BRkYsQ0FBQTs7QUFBQSxFQXdDQSxNQUFNLENBQUMsT0FBUCxHQUFpQixVQXhDakIsQ0FBQTtBQUFBIgp9

//# sourceURL=/home/cin_chalic/.atom/packages/atom-ternjs/lib/linter.coffee
