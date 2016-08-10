(function() {
  var ProjectManager, fs,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  fs = require('fs');

  module.exports = new (ProjectManager = (function() {
    function ProjectManager() {
      this.addToProjectSetting = __bind(this.addToProjectSetting, this);
      this.getProjectSetting = __bind(this.getProjectSetting, this);
      this.getProject = __bind(this.getProject, this);
    }

    ProjectManager.prototype.file = function(update) {
      var filedir, filename, hostname, os;
      if (update == null) {
        update = false;
      }
      if (update) {
        this.filepath = null;
      }
      if (this.filepath == null) {
        filename = 'projects.cson';
        filedir = atom.getConfigDirPath();
        if (atom.config.get('project-manager.environmentSpecificProjects')) {
          os = require('os');
          hostname = os.hostname().split('.').shift().toLowerCase();
          filename = "projects." + hostname + ".cson";
        }
        this.filepath = "" + filedir + "/" + filename;
      }
      return this.filepath;
    };

    ProjectManager.prototype.getProject = function() {
      var count, found, path, project, projectPaths, title, _i, _len, _ref, _ref1;
      if (this.CSON == null) {
        this.CSON = require('season');
      }
      try {
        this.projects = this.CSON.readFileSync(this.file()) || {};
      } catch (_error) {
        return false;
      }
      projectPaths = atom.project.getPaths();
      found = false;
      _ref = this.projects;
      for (title in _ref) {
        project = _ref[title];
        if (project.paths == null) {
          continue;
        }
        count = 0;
        _ref1 = project.paths;
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          path = _ref1[_i];
          if (__indexOf.call(projectPaths, path) >= 0) {
            count++;
          }
        }
        if (count === projectPaths.length) {
          found = true;
          break;
        }
      }
      if (found) {
        return project;
      } else {
        return false;
      }
    };

    ProjectManager.prototype.getProjectSetting = function() {
      var project;
      project = this.getProject();
      if (project && project["opened-files"]) {
        return project["opened-files"];
      } else {
        return [];
      }
    };

    ProjectManager.prototype.addToProjectSetting = function(settings, notifications) {
      var project, _ref, _ref1, _ref2;
      if (notifications == null) {
        notifications = true;
      }
      project = this.getProject();
      if (project) {
        project["opened-files"] = settings;
        try {
          this.CSON.writeFileSync(this.file(), this.projects);
          if (notifications) {
            return (_ref = atom.notifications) != null ? _ref.addSuccess("Opened files have been saved") : void 0;
          }
        } catch (_error) {
          if (notifications) {
            return (_ref1 = atom.notifications) != null ? _ref1.addError("Opened files could not be saved to " + (this.file())) : void 0;
          }
        }
      } else if (notifications) {
        return (_ref2 = atom.notifications) != null ? _ref2.addError("Current project wasn't found in " + (this.file())) : void 0;
      }
    };

    return ProjectManager;

  })());

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2luX2NoYWxpYy8uYXRvbS9wYWNrYWdlcy9vcGVuZWQtZmlsZXMvbGliL3Byb2plY3QtbWFuYWdlci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsa0JBQUE7SUFBQTt5SkFBQTs7QUFBQSxFQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUixDQUFMLENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUFpQixHQUFBLENBQUEsQ0FBVTs7Ozs7S0FDekI7O0FBQUEsNkJBQUEsSUFBQSxHQUFNLFNBQUMsTUFBRCxHQUFBO0FBQ0osVUFBQSwrQkFBQTs7UUFESyxTQUFTO09BQ2Q7QUFBQSxNQUFBLElBQW9CLE1BQXBCO0FBQUEsUUFBQSxJQUFDLENBQUEsUUFBRCxHQUFZLElBQVosQ0FBQTtPQUFBO0FBQ0EsTUFBQSxJQUFPLHFCQUFQO0FBQ0UsUUFBQSxRQUFBLEdBQVcsZUFBWCxDQUFBO0FBQUEsUUFDQSxPQUFBLEdBQVUsSUFBSSxDQUFDLGdCQUFMLENBQUEsQ0FEVixDQUFBO0FBRUEsUUFBQSxJQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiw2Q0FBaEIsQ0FBSDtBQUNFLFVBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSLENBQUwsQ0FBQTtBQUFBLFVBQ0EsUUFBQSxHQUFXLEVBQUUsQ0FBQyxRQUFILENBQUEsQ0FBYSxDQUFDLEtBQWQsQ0FBb0IsR0FBcEIsQ0FBd0IsQ0FBQyxLQUF6QixDQUFBLENBQWdDLENBQUMsV0FBakMsQ0FBQSxDQURYLENBQUE7QUFBQSxVQUVBLFFBQUEsR0FBWSxXQUFBLEdBQVcsUUFBWCxHQUFvQixPQUZoQyxDQURGO1NBRkE7QUFBQSxRQU1BLElBQUMsQ0FBQSxRQUFELEdBQVksRUFBQSxHQUFHLE9BQUgsR0FBVyxHQUFYLEdBQWMsUUFOMUIs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

//# sourceURL=/home/cin_chalic/.atom/packages/opened-files/lib/project-manager.coffee
