Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _configSchema = require("./config-schema");

var _configSchema2 = _interopRequireDefault(_configSchema);

"use babel";

exports["default"] = {
  config: _configSchema2["default"],

  activate: function activate() {
    var _this = this;

    this.commands = atom.commands.add("atom-workspace", {
      "latex:build": function latexBuild() {
        _this.bootstrap();
        _this.composer.build();
      },
      "latex:sync": function latexSync() {
        _this.bootstrap();
        _this.composer.sync();
      },
      "latex:clean": function latexClean() {
        _this.bootstrap();
        _this.composer.clean();
      }
    });
  },

  deactivate: function deactivate() {
    if (this.commands) {
      this.commands.dispose();
      delete this.commands;
    }

    if (this.composer) {
      this.composer.destroy();
      delete this.composer;
    }

    if (global.latex) {
      delete global.latex;
    }
  },

  consumeStatusBar: function consumeStatusBar(statusBar) {
    this.bootstrap();
    this.composer.setStatusBar(statusBar);
  },

  bootstrap: function bootstrap() {
    if (this.composer && global.latex) {
      return;
    }

    var Latex = require("./latex");
    var Composer = require("./composer");

    global.latex = new Latex();
    this.composer = new Composer();
  }
};
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL21haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7OzRCQUV5QixpQkFBaUI7Ozs7QUFGMUMsV0FBVyxDQUFDOztxQkFJRztBQUNiLFFBQU0sMkJBQWM7O0FBRXBCLFVBQVEsRUFBQSxvQkFBRzs7O0FBQ1QsUUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRTtBQUNsRCxtQkFBYSxFQUFFLHNCQUFNO0FBQ25CLGNBQUssU0FBUyxFQUFFLENBQUM7QUFDakIsY0FBSyxRQUFRLENBQUMsS0FBSyxFQUFFLENBQUM7T0FDdkI7QUFDRCxrQkFBWSxFQUFFLHFCQUFNO0FBQ2xCLGNBQUssU0FBUyxFQUFFLENBQUM7QUFDakIsY0FBSyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUM7T0FDdEI7QUFDRCxtQkFBYSxFQUFFLHNCQUFNO0FBQ25CLGNBQUssU0FBUyxFQUFFLENBQUM7QUFDakIsY0FBSyxRQUFRLENBQUMsS0FBSyxFQUFFLENBQUM7T0FDdkI7S0FDRixDQUFDLENBQUM7R0FDSjs7QUFFRCxZQUFVLEVBQUEsc0JBQUc7QUFDWCxRQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7QUFDakIsVUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUN4QixhQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7S0FDdEI7O0FBRUQsUUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO0FBQ2pCLFVBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDeEIsYUFBTyxJQUFJLENBQUMsUUFBUSxDQUFDO0tBQ3RCOztBQUVELFFBQUksTUFBTSxDQUFDLEtBQUssRUFBRTtBQUNoQixhQUFPLE1BQU0sQ0FBQyxLQUFLLENBQUM7S0FDckI7R0FDRjs7QUFFRCxrQkFBZ0IsRUFBQSwwQkFBQyxTQUFTLEVBQUU7QUFDMUIsUUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO0FBQ2pCLFFBQUksQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0dBQ3ZDOztBQUVELFdBQVMsRUFBQSxxQkFBRztBQUNWLFFBQUksSUFBSSxDQUFDLFFBQVEsSUFBSSxNQUFNLENBQUMsS0FBSyxFQUFFO0FBQUUsYUFBTztLQUFFOztBQUU5QyxRQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDakMsUUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDOztBQUV2QyxVQUFNLENBQUMsS0FBSyxHQUFHLElBQUksS0FBSyxFQUFFLENBQUM7QUFDM0IsUUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLFFBQVEsRUFBRSxDQUFDO0dBQ2hDO0NBQ0YiLCJmaWxlIjoiL2hvbWUvY2luX2NoYWxpYy8uYXRvbS9wYWNrYWdlcy9sYXRleC9saWIvbWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIGJhYmVsXCI7XG5cbmltcG9ydCBDb25maWdTY2hlbWEgZnJvbSBcIi4vY29uZmlnLXNjaGVtYVwiO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGNvbmZpZzogQ29uZmlnU2NoZW1hLFxuXG4gIGFjdGl2YXRlKCkge1xuICAgIHRoaXMuY29tbWFuZHMgPSBhdG9tLmNvbW1hbmRzLmFkZChcImF0b20td29ya3NwYWNlXCIsIHtcbiAgICAgIFwibGF0ZXg6YnVpbGRcIjogKCkgPT4ge1xuICAgICAgICB0aGlzLmJvb3RzdHJhcCgpO1xuICAgICAgICB0aGlzLmNvbXBvc2VyLmJ1aWxkKCk7XG4gICAgICB9LFxuICAgICAgXCJsYXRleDpzeW5jXCI6ICgpID0+IHtcbiAgICAgICAgdGhpcy5ib290c3RyYXAoKTtcbiAgICAgICAgdGhpcy5jb21wb3Nlci5zeW5jKCk7XG4gICAgICB9LFxuICAgICAgXCJsYXRleDpjbGVhblwiOiAoKSA9PiB7XG4gICAgICAgIHRoaXMuYm9vdHN0cmFwKCk7XG4gICAgICAgIHRoaXMuY29tcG9zZXIuY2xlYW4oKTtcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0sXG5cbiAgZGVhY3RpdmF0ZSgpIHtcbiAgICBpZiAodGhpcy5jb21tYW5kcykge1xuICAgICAgdGhpcy5jb21tYW5kcy5kaXNwb3NlKCk7XG4gICAgICBkZWxldGUgdGhpcy5jb21tYW5kcztcbiAgICB9XG5cbiAgICBpZiAodGhpcy5jb21wb3Nlcikge1xuICAgICAgdGhpcy5jb21wb3Nlci5kZXN0cm95KCk7XG4gICAgICBkZWxldGUgdGhpcy5jb21wb3NlcjtcbiAgICB9XG5cbiAgICBpZiAoZ2xvYmFsLmxhdGV4KSB7XG4gICAgICBkZWxldGUgZ2xvYmFsLmxhdGV4O1xuICAgIH1cbiAgfSxcblxuICBjb25zdW1lU3RhdHVzQmFyKHN0YXR1c0Jhcikge1xuICAgIHRoaXMuYm9vdHN0cmFwKCk7XG4gICAgdGhpcy5jb21wb3Nlci5zZXRTdGF0dXNCYXIoc3RhdHVzQmFyKTtcbiAgfSxcblxuICBib290c3RyYXAoKSB7XG4gICAgaWYgKHRoaXMuY29tcG9zZXIgJiYgZ2xvYmFsLmxhdGV4KSB7IHJldHVybjsgfVxuXG4gICAgY29uc3QgTGF0ZXggPSByZXF1aXJlKFwiLi9sYXRleFwiKTtcbiAgICBjb25zdCBDb21wb3NlciA9IHJlcXVpcmUoXCIuL2NvbXBvc2VyXCIpO1xuXG4gICAgZ2xvYmFsLmxhdGV4ID0gbmV3IExhdGV4KCk7XG4gICAgdGhpcy5jb21wb3NlciA9IG5ldyBDb21wb3NlcigpO1xuICB9LFxufTtcbiJdfQ==