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
      this.projects = this.CSON.readFileSync(this.file()) || {};
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
