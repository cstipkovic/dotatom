var __vue_template__ = "<ol class=\"full-menu list-tree has-collapsable-children\" tabindex=\"-1\" v-on=\"mouseenter: hover, mouseleave: unhover\">\n    <div v-class=\"hidden: !isHovered\" class=\"save icon icon-bookmark\" v-on=\"click: save\">\n    </div>\n      <folder v-repeat=\"entry: filesTree\" track-by=\"path\">\n      </folder>\n    </ol>";
var abbreviate, addFileToTree, addFolderToTree, getElementFromTree, projectManager, sep, settings, sortByName, treeManager, wherePath;

wherePath = function (array, path) {
  var j, len, obj;
  for (j = 0, len = array.length; j < len; j++) {
    obj = array[j];
    if (obj.path === path) {
      return obj;
    }
  }
  return null;
};

sortByName = function (array) {
  return array.sort(function (a, b) {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  });
};

sep = null;

projectManager = null;

settings = null;

treeManager = null;

abbreviate = null;

getElementFromTree = function (tree, path, sort, createElement) {
  var element;
  element = wherePath(tree, path);
  if (createElement != null) {
    if (element == null) {
      element = createElement();
      tree.push(element);
      if (sort) {
        sortByName(tree);
      }
    }
  }
  return [element, tree];
};

addFileToTree = function (tree, path, name) {
  var element, mfpIdent, pathIdentifier, projectPaths, ref, result, sort, splittedPath;
  pathIdentifier = "";
  sort = true;
  if (name == null) {
    sort = false;
    result = atom.project.relativizePath(path);
    splittedPath = result[1].split(sep);
    name = splittedPath.pop();
    if (result[0] != null) {
      projectPaths = atom.project.getPaths();
      if (projectPaths.length > 1) {
        mfpIdent = atom.config.get("opened-files.mfpIdent");
        if (mfpIdent <= 0) {
          pathIdentifier += "" + (projectPaths.indexOf(result[0]) + 1);
        } else {
          pathIdentifier += abbreviate(result[0].split(sep).pop(), {
            length: mfpIdent,
            keepSeparators: true,
            strict: false
          });
        }
        if (splittedPath.length > 0) {
          pathIdentifier += sep;
        }
      }
    }
    pathIdentifier += splittedPath.join(sep);
  }
  ref = getElementFromTree(tree, path, sort, function () {
    return {
      name: name,
      path: path,
      pathIdentifier: pathIdentifier
    };
  }), element = ref[0], tree = ref[1];
  return tree;
};

addFolderToTree = function (tree, splittedPath, index, path) {
  var calculatedPath, element, ref;
  calculatedPath = splittedPath.slice(0, index + 1).join("/");
  ref = getElementFromTree(tree, calculatedPath, true, function () {
    return {
      name: splittedPath[index],
      folders: [],
      files: [],
      path: calculatedPath
    };
  }), element = ref[0], tree = ref[1];
  if (splittedPath.length === index + 2) {
    element.files = addFileToTree(element.files, path, splittedPath[index + 1]);
  } else {
    element.folders = addFolderToTree(element.folders, splittedPath, index + 1, path);
  }
  return tree;
};

module.exports = {
  data: function data() {
    return {
      filesTree: [],
      colors: {},
      expanded: false,
      saving: false,
      savedSettings: [],
      isHovered: false
    };
  },
  methods: {
    hover: function hover(e) {
      return this.isHovered = true;
    },
    unhover: function unhover(e) {
      return this.isHovered = false;
    },
    addFile: function addFile(path) {
      var result, rootElement, rootName, splittedPath;
      this.log("adding " + path, 2);
      if (atom.config.get("opened-files.asList")) {
        rootElement = this.filesTree[0];
        if (rootElement == null) {
          rootElement = {
            name: "Opened files",
            path: "",
            folders: [],
            files: [],
            isRoot: true
          };
          this.filesTree.push(rootElement);
        }
        return rootElement.files = addFileToTree(rootElement.files, path);
      } else {
        result = atom.project.relativizePath(path);
        if ((result != null ? result[0] : void 0) != null) {
          rootName = result[0].split(sep).pop();
          rootElement = wherePath(this.filesTree, result[0]);
          if (rootElement == null) {
            rootElement = {
              name: rootName,
              path: result[0],
              folders: [],
              files: []
            };
            this.filesTree.push(rootElement);
            sortByName(this.filesTree);
          }
          splittedPath = result[1].split(sep);
          if (splittedPath.length === 1) {
            return rootElement.files = addFileToTree(rootElement.files, path, splittedPath[0]);
          } else {
            return rootElement.folders = addFolderToTree(rootElement.folders, splittedPath, 0, path);
          }
        }
      }
    },
    selected: function selected(path) {
      return this.$broadcast("selected", path);
    },
    resize: function resize() {
      return treeManager.autoHeight();
    },
    colorChangeCb: function colorChangeCb(path, color) {
      if (typeof this !== "undefined" && this !== null && this.colors != null) {
        this.log("colorChangeCb called", 2);
        this.colors[path] = color;
        return this.$broadcast("color", path);
      }
    },
    redraw: function redraw() {
      var j, len, path, results;
      this.filesTree = [];
      results = [];
      for (j = 0, len = settings.length; j < len; j++) {
        path = settings[j];
        results.push(this.addFile(path));
      }
      return results;
    },
    removePath: function removePath(path) {
      var i;
      i = settings.indexOf(path);
      if (i > -1) {
        return settings.splice(i, 1);
      }
    },
    save: function save() {
      if (this.saving === false) {
        this.saving = true;
        this.log("saving", 2);
        projectManager.addToProjectSetting(settings);
        this.savedSettings = settings.slice();
        return this.saving = false;
      } else {
        this.log("delaying save", 2);
        setTimeout((function (_this) {
          return function () {
            return _this.saving = false;
          };
        })(this), 90);
        return setTimeout(this.save, 100);
      }
    },
    closeUnsaved: function closeUnsaved() {
      var j, len, path, results;
      results = [];
      for (j = 0, len = settings.length; j < len; j++) {
        path = settings[j];
        if (this.savedSettings.indexOf(path) === -1) {
          results.push(this.$broadcast("close", path));
        } else {
          results.push(void 0);
        }
      }
      return results;
    }
  },
  beforeCompile: function beforeCompile() {
    sep = require("path").sep;
    if (projectManager == null) {
      projectManager = require("./../lib/project-manager");
    }
    if (treeManager == null) {
      treeManager = require("./../lib/tree-manager");
    }
    if (abbreviate == null) {
      abbreviate = require("abbreviate");
    }
    settings = projectManager.getProjectSetting();
    if (!Array.isArray(settings)) {
      settings = [];
    }
    this.savedSettings = settings.slice();
    return this.log("beforeCompile", 2);
  },
  created: function created() {
    return this.$on("removeFolder", (function (_this) {
      return function (entry) {
        _this.filesTree.$remove(entry);
        return false;
      };
    })(this));
  },
  compiled: function compiled() {
    var j, len, path;
    for (j = 0, len = settings.length; j < len; j++) {
      path = settings[j];
      this.addFile(path);
    }
    this.addDisposable(atom.workspace.observeTextEditors((function (_this) {
      return function (editor) {
        if ((editor != null ? editor.getPath : void 0) != null) {
          path = editor.getPath();
          if (path != null && settings.indexOf(path) === -1) {
            _this.addFile(path);
            return settings.push(path);
          }
        }
      };
    })(this)));
    this.addDisposable(atom.commands.add("atom-workspace", {
      "opened-files:close-all-but-saved": this.closeUnsaved
    }));
    this.addDisposable(atom.config.onDidChange("opened-files.asList", this.redraw));
    this.addDisposable(atom.config.onDidChange("opened-files.highlightOnHover", this.redraw));
    this.addDisposable(atom.config.onDidChange("opened-files.debug", this.redraw));
    this.addDisposable(atom.config.onDidChange("opened-files.mfpIdent", this.redraw));
    this.addDisposable(atom.config.onDidChange("opened-files.colorStyle", this.redraw));
    return this.log("compiled", 2);
  },
  ready: function ready() {
    return this.log("ready", 2);
  },
  attached: function attached() {
    return this.log("attached", 2);
  }
};

;(typeof module.exports === "function" ? module.exports.options : module.exports).template = __vue_template__;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvb3BlbmVkLWZpbGVzL2NvbXBvbmVudHNfY29tcGlsZWQvYXBwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLElBQUksZ0JBQWdCLEdBQUcsc1VBQXNVLENBQUM7QUFDOVYsSUFBSSxVQUFVLEVBQUUsYUFBYSxFQUFFLGVBQWUsRUFBRSxrQkFBa0IsRUFBRSxjQUFjLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxVQUFVLEVBQUUsV0FBVyxFQUFFLFNBQVMsQ0FBQzs7QUFFdEksU0FBUyxHQUFHLFVBQVMsS0FBSyxFQUFFLElBQUksRUFBRTtBQUNoQyxNQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDO0FBQ2hCLE9BQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQzVDLE9BQUcsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDZixRQUFJLEdBQUcsQ0FBQyxJQUFJLEtBQUssSUFBSSxFQUFFO0FBQ3JCLGFBQU8sR0FBRyxDQUFDO0tBQ1o7R0FDRjtBQUNELFNBQU8sSUFBSSxDQUFDO0NBQ2IsQ0FBQzs7QUFFRixVQUFVLEdBQUcsVUFBUyxLQUFLLEVBQUU7QUFDM0IsU0FBTyxLQUFLLENBQUMsSUFBSSxDQUFDLFVBQVMsQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUMvQixRQUFJLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRTtBQUNuQixhQUFPLENBQUMsQ0FBQyxDQUFDO0tBQ1g7QUFDRCxRQUFJLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRTtBQUNuQixhQUFPLENBQUMsQ0FBQztLQUNWO0FBQ0QsV0FBTyxDQUFDLENBQUM7R0FDVixDQUFDLENBQUM7Q0FDSixDQUFDOztBQUVGLEdBQUcsR0FBRyxJQUFJ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bl9jaGFsaWMvLmF0b20vcGFja2FnZXMvb3BlbmVkLWZpbGVzL2NvbXBvbmVudHNfY29tcGlsZWQvYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIF9fdnVlX3RlbXBsYXRlX18gPSBcIjxvbCBjbGFzcz1cXFwiZnVsbC1tZW51IGxpc3QtdHJlZSBoYXMtY29sbGFwc2FibGUtY2hpbGRyZW5cXFwiIHRhYmluZGV4PVxcXCItMVxcXCIgdi1vbj1cXFwibW91c2VlbnRlcjogaG92ZXIsIG1vdXNlbGVhdmU6IHVuaG92ZXJcXFwiPlxcbiAgICA8ZGl2IHYtY2xhc3M9XFxcImhpZGRlbjogIWlzSG92ZXJlZFxcXCIgY2xhc3M9XFxcInNhdmUgaWNvbiBpY29uLWJvb2ttYXJrXFxcIiB2LW9uPVxcXCJjbGljazogc2F2ZVxcXCI+XFxuICAgIDwvZGl2PlxcbiAgICAgIDxmb2xkZXIgdi1yZXBlYXQ9XFxcImVudHJ5OiBmaWxlc1RyZWVcXFwiIHRyYWNrLWJ5PVxcXCJwYXRoXFxcIj5cXG4gICAgICA8L2ZvbGRlcj5cXG4gICAgPC9vbD5cIjtcbnZhciBhYmJyZXZpYXRlLCBhZGRGaWxlVG9UcmVlLCBhZGRGb2xkZXJUb1RyZWUsIGdldEVsZW1lbnRGcm9tVHJlZSwgcHJvamVjdE1hbmFnZXIsIHNlcCwgc2V0dGluZ3MsIHNvcnRCeU5hbWUsIHRyZWVNYW5hZ2VyLCB3aGVyZVBhdGg7XG5cbndoZXJlUGF0aCA9IGZ1bmN0aW9uKGFycmF5LCBwYXRoKSB7XG4gIHZhciBqLCBsZW4sIG9iajtcbiAgZm9yIChqID0gMCwgbGVuID0gYXJyYXkubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICBvYmogPSBhcnJheVtqXTtcbiAgICBpZiAob2JqLnBhdGggPT09IHBhdGgpIHtcbiAgICAgIHJldHVybiBvYmo7XG4gICAgfVxuICB9XG4gIHJldHVybiBudWxsO1xufTtcblxuc29ydEJ5TmFtZSA9IGZ1bmN0aW9uKGFycmF5KSB7XG4gIHJldHVybiBhcnJheS5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtcbiAgICBpZiAoYS5uYW1lIDwgYi5uYW1lKSB7XG4gICAgICByZXR1cm4gLTE7XG4gICAgfVxuICAgIGlmIChhLm5hbWUgPiBiLm5hbWUpIHtcbiAgICAgIHJldHVybiAxO1xuICAgIH1cbiAgICByZXR1cm4gMDtcbiAgfSk7XG59O1xuXG5zZXAgPSBudWxsO1xuXG5wcm9qZWN0TWFuYWdlciA9IG51bGw7XG5cbnNldHRpbmdzID0gbnVsbDtcblxudHJlZU1hbmFnZXIgPSBudWxsO1xuXG5hYmJyZXZpYXRlID0gbnVsbDtcblxuZ2V0RWxlbWVudEZyb21UcmVlID0gZnVuY3Rpb24odHJlZSwgcGF0aCwgc29ydCwgY3JlYXRlRWxlbWVudCkge1xuICB2YXIgZWxlbWVudDtcbiAgZWxlbWVudCA9IHdoZXJlUGF0aCh0cmVlLCBwYXRoKTtcbiAgaWYgKGNyZWF0ZUVsZW1lbnQgIT0gbnVsbCkge1xuICAgIGlmIChlbGVtZW50ID09IG51bGwpIHtcbiAgICAgIGVsZW1lbnQgPSBjcmVhdGVFbGVtZW50KCk7XG4gICAgICB0cmVlLnB1c2goZWxlbWVudCk7XG4gICAgICBpZiAoc29ydCkge1xuICAgICAgICBzb3J0QnlOYW1lKHRyZWUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gW2VsZW1lbnQsIHRyZWVdO1xufTtcblxuYWRkRmlsZVRvVHJlZSA9IGZ1bmN0aW9uKHRyZWUsIHBhdGgsIG5hbWUpIHtcbiAgdmFyIGVsZW1lbnQsIG1mcElkZW50LCBwYXRoSWRlbnRpZmllciwgcHJvamVjdFBhdGhzLCByZWYsIHJlc3VsdCwgc29ydCwgc3BsaXR0ZWRQYXRoO1xuICBwYXRoSWRlbnRpZmllciA9IFwiXCI7XG4gIHNvcnQgPSB0cnVlO1xuICBpZiAobmFtZSA9PSBudWxsKSB7XG4gICAgc29ydCA9IGZhbHNlO1xuICAgIHJlc3VsdCA9IGF0b20ucHJvamVjdC5yZWxhdGl2aXplUGF0aChwYXRoKTtcbiAgICBzcGxpdHRlZFBhdGggPSByZXN1bHRbMV0uc3BsaXQoc2VwKTtcbiAgICBuYW1lID0gc3BsaXR0ZWRQYXRoLnBvcCgpO1xuICAgIGlmIChyZXN1bHRbMF0gIT0gbnVsbCkge1xuICAgICAgcHJvamVjdFBhdGhzID0gYXRvbS5wcm9qZWN0LmdldFBhdGhzKCk7XG4gICAgICBpZiAocHJvamVjdFBhdGhzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgbWZwSWRlbnQgPSBhdG9tLmNvbmZpZy5nZXQoXCJvcGVuZWQtZmlsZXMubWZwSWRlbnRcIik7XG4gICAgICAgIGlmIChtZnBJZGVudCA8PSAwKSB7XG4gICAgICAgICAgcGF0aElkZW50aWZpZXIgKz0gXCJcIiArIChwcm9qZWN0UGF0aHMuaW5kZXhPZihyZXN1bHRbMF0pICsgMSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcGF0aElkZW50aWZpZXIgKz0gYWJicmV2aWF0ZShyZXN1bHRbMF0uc3BsaXQoc2VwKS5wb3AoKSwge1xuICAgICAgICAgICAgbGVuZ3RoOiBtZnBJZGVudCxcbiAgICAgICAgICAgIGtlZXBTZXBhcmF0b3JzOiB0cnVlLFxuICAgICAgICAgICAgc3RyaWN0OiBmYWxzZVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzcGxpdHRlZFBhdGgubGVuZ3RoID4gMCkge1xuICAgICAgICAgIHBhdGhJZGVudGlmaWVyICs9IHNlcDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBwYXRoSWRlbnRpZmllciArPSBzcGxpdHRlZFBhdGguam9pbihzZXApO1xuICB9XG4gIHJlZiA9IGdldEVsZW1lbnRGcm9tVHJlZSh0cmVlLCBwYXRoLCBzb3J0LCBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZTogbmFtZSxcbiAgICAgIHBhdGg6IHBhdGgsXG4gICAgICBwYXRoSWRlbnRpZmllcjogcGF0aElkZW50aWZpZXJcbiAgICB9O1xuICB9KSwgZWxlbWVudCA9IHJlZlswXSwgdHJlZSA9IHJlZlsxXTtcbiAgcmV0dXJuIHRyZWU7XG59O1xuXG5hZGRGb2xkZXJUb1RyZWUgPSBmdW5jdGlvbih0cmVlLCBzcGxpdHRlZFBhdGgsIGluZGV4LCBwYXRoKSB7XG4gIHZhciBjYWxjdWxhdGVkUGF0aCwgZWxlbWVudCwgcmVmO1xuICBjYWxjdWxhdGVkUGF0aCA9IHNwbGl0dGVkUGF0aC5zbGljZSgwLCBpbmRleCArIDEpLmpvaW4oXCIvXCIpO1xuICByZWYgPSBnZXRFbGVtZW50RnJvbVRyZWUodHJlZSwgY2FsY3VsYXRlZFBhdGgsIHRydWUsIGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lOiBzcGxpdHRlZFBhdGhbaW5kZXhdLFxuICAgICAgZm9sZGVyczogW10sXG4gICAgICBmaWxlczogW10sXG4gICAgICBwYXRoOiBjYWxjdWxhdGVkUGF0aFxuICAgIH07XG4gIH0pLCBlbGVtZW50ID0gcmVmWzBdLCB0cmVlID0gcmVmWzFdO1xuICBpZiAoc3BsaXR0ZWRQYXRoLmxlbmd0aCA9PT0gaW5kZXggKyAyKSB7XG4gICAgZWxlbWVudC5maWxlcyA9IGFkZEZpbGVUb1RyZWUoZWxlbWVudC5maWxlcywgcGF0aCwgc3BsaXR0ZWRQYXRoW2luZGV4ICsgMV0pO1xuICB9IGVsc2Uge1xuICAgIGVsZW1lbnQuZm9sZGVycyA9IGFkZEZvbGRlclRvVHJlZShlbGVtZW50LmZvbGRlcnMsIHNwbGl0dGVkUGF0aCwgaW5kZXggKyAxLCBwYXRoKTtcbiAgfVxuICByZXR1cm4gdHJlZTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBkYXRhOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4ge1xuICAgICAgZmlsZXNUcmVlOiBbXSxcbiAgICAgIGNvbG9yczoge30sXG4gICAgICBleHBhbmRlZDogZmFsc2UsXG4gICAgICBzYXZpbmc6IGZhbHNlLFxuICAgICAgc2F2ZWRTZXR0aW5nczogW10sXG4gICAgICBpc0hvdmVyZWQ6IGZhbHNlXG4gICAgfTtcbiAgfSxcbiAgbWV0aG9kczoge1xuICAgIGhvdmVyOiBmdW5jdGlvbihlKSB7XG4gICAgICByZXR1cm4gdGhpcy5pc0hvdmVyZWQgPSB0cnVlO1xuICAgIH0sXG4gICAgdW5ob3ZlcjogZnVuY3Rpb24oZSkge1xuICAgICAgcmV0dXJuIHRoaXMuaXNIb3ZlcmVkID0gZmFsc2U7XG4gICAgfSxcbiAgICBhZGRGaWxlOiBmdW5jdGlvbihwYXRoKSB7XG4gICAgICB2YXIgcmVzdWx0LCByb290RWxlbWVudCwgcm9vdE5hbWUsIHNwbGl0dGVkUGF0aDtcbiAgICAgIHRoaXMubG9nKFwiYWRkaW5nIFwiICsgcGF0aCwgMik7XG4gICAgICBpZiAoYXRvbS5jb25maWcuZ2V0KFwib3BlbmVkLWZpbGVzLmFzTGlzdFwiKSkge1xuICAgICAgICByb290RWxlbWVudCA9IHRoaXMuZmlsZXNUcmVlWzBdO1xuICAgICAgICBpZiAocm9vdEVsZW1lbnQgPT0gbnVsbCkge1xuICAgICAgICAgIHJvb3RFbGVtZW50ID0ge1xuICAgICAgICAgICAgbmFtZTogXCJPcGVuZWQgZmlsZXNcIixcbiAgICAgICAgICAgIHBhdGg6IFwiXCIsXG4gICAgICAgICAgICBmb2xkZXJzOiBbXSxcbiAgICAgICAgICAgIGZpbGVzOiBbXSxcbiAgICAgICAgICAgIGlzUm9vdDogdHJ1ZVxuICAgICAgICAgIH07XG4gICAgICAgICAgdGhpcy5maWxlc1RyZWUucHVzaChyb290RWxlbWVudCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJvb3RFbGVtZW50LmZpbGVzID0gYWRkRmlsZVRvVHJlZShyb290RWxlbWVudC5maWxlcywgcGF0aCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXN1bHQgPSBhdG9tLnByb2plY3QucmVsYXRpdml6ZVBhdGgocGF0aCk7XG4gICAgICAgIGlmICgocmVzdWx0ICE9IG51bGwgPyByZXN1bHRbMF0gOiB2b2lkIDApICE9IG51bGwpIHtcbiAgICAgICAgICByb290TmFtZSA9IHJlc3VsdFswXS5zcGxpdChzZXApLnBvcCgpO1xuICAgICAgICAgIHJvb3RFbGVtZW50ID0gd2hlcmVQYXRoKHRoaXMuZmlsZXNUcmVlLCByZXN1bHRbMF0pO1xuICAgICAgICAgIGlmIChyb290RWxlbWVudCA9PSBudWxsKSB7XG4gICAgICAgICAgICByb290RWxlbWVudCA9IHtcbiAgICAgICAgICAgICAgbmFtZTogcm9vdE5hbWUsXG4gICAgICAgICAgICAgIHBhdGg6IHJlc3VsdFswXSxcbiAgICAgICAgICAgICAgZm9sZGVyczogW10sXG4gICAgICAgICAgICAgIGZpbGVzOiBbXVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHRoaXMuZmlsZXNUcmVlLnB1c2gocm9vdEVsZW1lbnQpO1xuICAgICAgICAgICAgc29ydEJ5TmFtZSh0aGlzLmZpbGVzVHJlZSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHNwbGl0dGVkUGF0aCA9IHJlc3VsdFsxXS5zcGxpdChzZXApO1xuICAgICAgICAgIGlmIChzcGxpdHRlZFBhdGgubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICByZXR1cm4gcm9vdEVsZW1lbnQuZmlsZXMgPSBhZGRGaWxlVG9UcmVlKHJvb3RFbGVtZW50LmZpbGVzLCBwYXRoLCBzcGxpdHRlZFBhdGhbMF0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gcm9vdEVsZW1lbnQuZm9sZGVycyA9IGFkZEZvbGRlclRvVHJlZShyb290RWxlbWVudC5mb2xkZXJzLCBzcGxpdHRlZFBhdGgsIDAsIHBhdGgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgc2VsZWN0ZWQ6IGZ1bmN0aW9uKHBhdGgpIHtcbiAgICAgIHJldHVybiB0aGlzLiRicm9hZGNhc3QoXCJzZWxlY3RlZFwiLCBwYXRoKTtcbiAgICB9LFxuICAgIHJlc2l6ZTogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdHJlZU1hbmFnZXIuYXV0b0hlaWdodCgpO1xuICAgIH0sXG4gICAgY29sb3JDaGFuZ2VDYjogZnVuY3Rpb24ocGF0aCwgY29sb3IpIHtcbiAgICAgIGlmICgodHlwZW9mIHRoaXMgIT09IFwidW5kZWZpbmVkXCIgJiYgdGhpcyAhPT0gbnVsbCkgJiYgKHRoaXMuY29sb3JzICE9IG51bGwpKSB7XG4gICAgICAgIHRoaXMubG9nKFwiY29sb3JDaGFuZ2VDYiBjYWxsZWRcIiwgMik7XG4gICAgICAgIHRoaXMuY29sb3JzW3BhdGhdID0gY29sb3I7XG4gICAgICAgIHJldHVybiB0aGlzLiRicm9hZGNhc3QoXCJjb2xvclwiLCBwYXRoKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIHJlZHJhdzogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgaiwgbGVuLCBwYXRoLCByZXN1bHRzO1xuICAgICAgdGhpcy5maWxlc1RyZWUgPSBbXTtcbiAgICAgIHJlc3VsdHMgPSBbXTtcbiAgICAgIGZvciAoaiA9IDAsIGxlbiA9IHNldHRpbmdzLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICAgIHBhdGggPSBzZXR0aW5nc1tqXTtcbiAgICAgICAgcmVzdWx0cy5wdXNoKHRoaXMuYWRkRmlsZShwYXRoKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0cztcbiAgICB9LFxuICAgIHJlbW92ZVBhdGg6IGZ1bmN0aW9uKHBhdGgpIHtcbiAgICAgIHZhciBpO1xuICAgICAgaSA9IHNldHRpbmdzLmluZGV4T2YocGF0aCk7XG4gICAgICBpZiAoaSA+IC0xKSB7XG4gICAgICAgIHJldHVybiBzZXR0aW5ncy5zcGxpY2UoaSwgMSk7XG4gICAgICB9XG4gICAgfSxcbiAgICBzYXZlOiBmdW5jdGlvbigpIHtcbiAgICAgIGlmICh0aGlzLnNhdmluZyA9PT0gZmFsc2UpIHtcbiAgICAgICAgdGhpcy5zYXZpbmcgPSB0cnVlO1xuICAgICAgICB0aGlzLmxvZyhcInNhdmluZ1wiLCAyKTtcbiAgICAgICAgcHJvamVjdE1hbmFnZXIuYWRkVG9Qcm9qZWN0U2V0dGluZyhzZXR0aW5ncyk7XG4gICAgICAgIHRoaXMuc2F2ZWRTZXR0aW5ncyA9IHNldHRpbmdzLnNsaWNlKCk7XG4gICAgICAgIHJldHVybiB0aGlzLnNhdmluZyA9IGZhbHNlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5sb2coXCJkZWxheWluZyBzYXZlXCIsIDIpO1xuICAgICAgICBzZXRUaW1lb3V0KCgoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gX3RoaXMuc2F2aW5nID0gZmFsc2U7XG4gICAgICAgICAgfTtcbiAgICAgICAgfSkodGhpcykpLCA5MCk7XG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KHRoaXMuc2F2ZSwgMTAwKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGNsb3NlVW5zYXZlZDogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgaiwgbGVuLCBwYXRoLCByZXN1bHRzO1xuICAgICAgcmVzdWx0cyA9IFtdO1xuICAgICAgZm9yIChqID0gMCwgbGVuID0gc2V0dGluZ3MubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgICAgcGF0aCA9IHNldHRpbmdzW2pdO1xuICAgICAgICBpZiAodGhpcy5zYXZlZFNldHRpbmdzLmluZGV4T2YocGF0aCkgPT09IC0xKSB7XG4gICAgICAgICAgcmVzdWx0cy5wdXNoKHRoaXMuJGJyb2FkY2FzdChcImNsb3NlXCIsIHBhdGgpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXN1bHRzLnB1c2godm9pZCAwKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgfVxuICB9LFxuICBiZWZvcmVDb21waWxlOiBmdW5jdGlvbigpIHtcbiAgICBzZXAgPSByZXF1aXJlKFwicGF0aFwiKS5zZXA7XG4gICAgaWYgKHByb2plY3RNYW5hZ2VyID09IG51bGwpIHtcbiAgICAgIHByb2plY3RNYW5hZ2VyID0gcmVxdWlyZShcIi4vLi4vbGliL3Byb2plY3QtbWFuYWdlclwiKTtcbiAgICB9XG4gICAgaWYgKHRyZWVNYW5hZ2VyID09IG51bGwpIHtcbiAgICAgIHRyZWVNYW5hZ2VyID0gcmVxdWlyZShcIi4vLi4vbGliL3RyZWUtbWFuYWdlclwiKTtcbiAgICB9XG4gICAgaWYgKGFiYnJldmlhdGUgPT0gbnVsbCkge1xuICAgICAgYWJicmV2aWF0ZSA9IHJlcXVpcmUoXCJhYmJyZXZpYXRlXCIpO1xuICAgIH1cbiAgICBzZXR0aW5ncyA9IHByb2plY3RNYW5hZ2VyLmdldFByb2plY3RTZXR0aW5nKCk7XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KHNldHRpbmdzKSkge1xuICAgICAgc2V0dGluZ3MgPSBbXTtcbiAgICB9XG4gICAgdGhpcy5zYXZlZFNldHRpbmdzID0gc2V0dGluZ3Muc2xpY2UoKTtcbiAgICByZXR1cm4gdGhpcy5sb2coXCJiZWZvcmVDb21waWxlXCIsIDIpO1xuICB9LFxuICBjcmVhdGVkOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy4kb24oXCJyZW1vdmVGb2xkZXJcIiwgKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24oZW50cnkpIHtcbiAgICAgICAgX3RoaXMuZmlsZXNUcmVlLiRyZW1vdmUoZW50cnkpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9O1xuICAgIH0pKHRoaXMpKTtcbiAgfSxcbiAgY29tcGlsZWQ6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBqLCBsZW4sIHBhdGg7XG4gICAgZm9yIChqID0gMCwgbGVuID0gc2V0dGluZ3MubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgIHBhdGggPSBzZXR0aW5nc1tqXTtcbiAgICAgIHRoaXMuYWRkRmlsZShwYXRoKTtcbiAgICB9XG4gICAgdGhpcy5hZGREaXNwb3NhYmxlKGF0b20ud29ya3NwYWNlLm9ic2VydmVUZXh0RWRpdG9ycygoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbihlZGl0b3IpIHtcbiAgICAgICAgaWYgKChlZGl0b3IgIT0gbnVsbCA/IGVkaXRvci5nZXRQYXRoIDogdm9pZCAwKSAhPSBudWxsKSB7XG4gICAgICAgICAgcGF0aCA9IGVkaXRvci5nZXRQYXRoKCk7XG4gICAgICAgICAgaWYgKChwYXRoICE9IG51bGwpICYmIHNldHRpbmdzLmluZGV4T2YocGF0aCkgPT09IC0xKSB7XG4gICAgICAgICAgICBfdGhpcy5hZGRGaWxlKHBhdGgpO1xuICAgICAgICAgICAgcmV0dXJuIHNldHRpbmdzLnB1c2gocGF0aCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0pKHRoaXMpKSk7XG4gICAgdGhpcy5hZGREaXNwb3NhYmxlKGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXdvcmtzcGFjZScsIHtcbiAgICAgICdvcGVuZWQtZmlsZXM6Y2xvc2UtYWxsLWJ1dC1zYXZlZCc6IHRoaXMuY2xvc2VVbnNhdmVkXG4gICAgfSkpO1xuICAgIHRoaXMuYWRkRGlzcG9zYWJsZShhdG9tLmNvbmZpZy5vbkRpZENoYW5nZSgnb3BlbmVkLWZpbGVzLmFzTGlzdCcsIHRoaXMucmVkcmF3KSk7XG4gICAgdGhpcy5hZGREaXNwb3NhYmxlKGF0b20uY29uZmlnLm9uRGlkQ2hhbmdlKCdvcGVuZWQtZmlsZXMuaGlnaGxpZ2h0T25Ib3ZlcicsIHRoaXMucmVkcmF3KSk7XG4gICAgdGhpcy5hZGREaXNwb3NhYmxlKGF0b20uY29uZmlnLm9uRGlkQ2hhbmdlKCdvcGVuZWQtZmlsZXMuZGVidWcnLCB0aGlzLnJlZHJhdykpO1xuICAgIHRoaXMuYWRkRGlzcG9zYWJsZShhdG9tLmNvbmZpZy5vbkRpZENoYW5nZSgnb3BlbmVkLWZpbGVzLm1mcElkZW50JywgdGhpcy5yZWRyYXcpKTtcbiAgICB0aGlzLmFkZERpc3Bvc2FibGUoYXRvbS5jb25maWcub25EaWRDaGFuZ2UoJ29wZW5lZC1maWxlcy5jb2xvclN0eWxlJywgdGhpcy5yZWRyYXcpKTtcbiAgICByZXR1cm4gdGhpcy5sb2coXCJjb21waWxlZFwiLCAyKTtcbiAgfSxcbiAgcmVhZHk6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmxvZyhcInJlYWR5XCIsIDIpO1xuICB9LFxuICBhdHRhY2hlZDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMubG9nKFwiYXR0YWNoZWRcIiwgMik7XG4gIH1cbn07XG5cbjsodHlwZW9mIG1vZHVsZS5leHBvcnRzID09PSBcImZ1bmN0aW9uXCI/IG1vZHVsZS5leHBvcnRzLm9wdGlvbnM6IG1vZHVsZS5leHBvcnRzKS50ZW1wbGF0ZSA9IF9fdnVlX3RlbXBsYXRlX187XG4iXX0=