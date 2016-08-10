var __vue_template__ = "<li class=\"directory list-nested-item\" v-on=\"mouseenter: hover, mouseleave: unhover,mouseover: highlight, mouseout: unhighlight\" v-class=\"\n      selected: isSelected,\n      collapsed: isCollapsed,\n      expanded: !isCollapsed,\n      of-highlight:isHighlight &amp;&amp; shouldHighlight\n    \">\n    <div class=\"header list-item folder\" v-on=\"click: onClick\">\n      <span class=\"name\" data-name=\"{{entry.name}}\" data-path=\"{{entry.path}}\">{{entry.name}}</span>\n\n      <span v-class=\"hidden: !isHovered\" class=\"icon icon-x\" v-on=\"click: close\">\n      </span>\n    </div>\n    <ol class=\"entries list-tree\" v-on=\"mouseover: unhighlight\">\n      <folder v-repeat=\"entry: entry.folders\" track-by=\"path\">\n      </folder>\n      <file v-repeat=\"entry: entry.files\" track-by=\"path\">\n      </file>\n    </ol>\n  </li>";
var treeManager;

treeManager = null;

module.exports = {
  replace: true,
  data: function data() {
    return {
      isSelected: false,
      isCollapsed: false,
      isHovered: false,
      shouldHighlight: atom.config.get("opened-files.highlightOnHover"),
      isHighlight: false,
      color: false
    };
  },
  methods: {
    hover: function hover(e) {
      return this.isHovered = true;
    },
    unhover: function unhover(e) {
      e.stopPropagation();
      return this.isHovered = false;
    },
    highlight: function highlight(e) {
      return this.isHighlight = true;
    },
    unhighlight: function unhighlight(e) {
      e.stopPropagation();
      return this.isHighlight = false;
    },
    close: function close(e) {
      this.$root.logFolder("closing", 2);
      e.stopPropagation();
      return this.$broadcast("close");
    },
    onClick: function onClick(e) {
      this.$root.logFolder("selecting", 2);
      this.$root.selected(this.entry.path);
      this.toggleFolder();
      return e.stopPropagation();
    },
    toggleFolder: function toggleFolder() {
      this.isCollapsed = !this.isCollapsed;
      return setTimeout(this.$root.resize, 1);
    },
    isEmpty: function isEmpty() {
      if (typeof this === "undefined" || this === null) {
        return true;
      }
      return this.entry.files.length === 0 && this.entry.folders.length === 0;
    }
  },
  created: function created() {
    this.$root.logFolder("created", 2);
    this.$on("selected", (function (_this) {
      return function (path) {
        _this.isSelected = path === _this.entry.path;
        return true;
      };
    })(this));
    this.$on("removeFile", (function (_this) {
      return function (entry) {
        var ref;
        _this.$root.logFolder("removing " + entry.path);
        try {
          _this.entry.files.$remove(entry);
        } catch (_error) {}
        setTimeout((ref = _this.$root) != null ? ref.resize : void 0, 1);
        if (_this.isEmpty()) {
          if (_this != null) {
            _this.$dispatch("removeFolder", _this.entry);
          }
        }
        return false;
      };
    })(this));
    return this.$on("removeFolder", (function (_this) {
      return function (entry) {
        var ref;
        try {
          _this.entry.folders.$remove(entry);
        } catch (_error) {}
        setTimeout((ref = _this.$root) != null ? ref.resize : void 0, 1);
        if (_this.isEmpty()) {
          if (_this != null) {
            _this.$dispatch("removeFolder", _this.entry);
          }
        }
        return false;
      };
    })(this));
  },
  destroyed: function destroyed() {
    var ref;
    return (ref = this.$root) != null ? ref.resize() : void 0;
  }
};

;(typeof module.exports === "function" ? module.exports.options : module.exports).template = __vue_template__;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvb3BlbmVkLWZpbGVzL2NvbXBvbmVudHNfY29tcGlsZWQvZm9sZGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLElBQUksZ0JBQWdCLEdBQUcscTFCQUFxMUIsQ0FBQztBQUM3MkIsSUFBSSxXQUFXLENBQUM7O0FBRWhCLFdBQVcsR0FBRyxJQUFJLENBQUM7O0FBRW5CLE1BQU0sQ0FBQyxPQUFPLEdBQUc7QUFDZixTQUFPLEVBQUUsSUFBSTtBQUNiLE1BQUksRUFBRSxnQkFBVztBQUNmLFdBQU87QUFDTCxnQkFBVSxFQUFFLEtBQUs7QUFDakIsaUJBQVcsRUFBRSxLQUFLO0FBQ2xCLGVBQVMsRUFBRSxLQUFLO0FBQ2hCLHFCQUFlLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsK0JBQStCLENBQUM7QUFDakUsaUJBQVcsRUFBRSxLQUFLO0FBQ2xCLFdBQUssRUFBRSxLQUFLO0tBQ2IsQ0FBQztHQUNIO0FBQ0QsU0FBTyxFQUFFO0FBQ1AsU0FBSyxFQUFFLGVBQVMsQ0FBQyxFQUFFO0FBQ2pCLGFBQU8sSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7S0FDOUI7QUFDRCxXQUFPLEVBQUUsaUJBQVMsQ0FBQyxFQUFFO0FBQ25CLE9BQUMsQ0FBQyxlQUFlLEVBQUUsQ0FBQztBQUNwQixhQUFPLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO0tBQy9CO0FBQ0QsYUFBUyxFQUFFLG1CQUFTLENBQUMsRUFBRTtBQUNyQixhQUFPLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO0tBQ2hDO0FBQ0QsZUFBVyxFQUFFLHFCQUFTLENBQUMsRUFBRTtBQUN2QixPQUFDLENBQUMsZUFBZSxFQUFFLENBQUM7QUFDcEIsYUFBTyxJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztLQUNqQztBQUNELFNBQUssRUFBRSxlQUFTLENBQUMsRUFBRTtBQUNqQixVQUFJLENB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Q0FBQztTQUNwQyxDQUFDLE9BQU8sTUFBTSxFQUFFLEVBQUU7QUFDbkIsa0JBQVUsQ0FBQyxDQUFDLEdBQUcsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFBLElBQUssSUFBSSxHQUFHLEdBQUcsQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDakUsWUFBSSxLQUFLLENBQUMsT0FBTyxFQUFFLEVBQUU7QUFDbkIsY0FBSSxLQUFLLElBQUksSUFBSSxFQUFFO0FBQ2pCLGlCQUFLLENBQUMsU0FBUyxDQUFDLGNBQWMsRUFBRSxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7V0FDOUM7U0FDRjtBQUNELGVBQU8sS0FBSyxDQUFDO09BQ2QsQ0FBQztLQUNILENBQUEsQ0FBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO0dBQ1g7QUFDRCxXQUFTLEVBQUUscUJBQVc7QUFDcEIsUUFBSSxHQUFHLENBQUM7QUFDUixXQUFPLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUEsSUFBSyxJQUFJLEdBQUcsR0FBRyxDQUFDLE1BQU0sRUFBRSxHQUFHLEtBQUssQ0FBQyxDQUFDO0dBQzNEO0NBQ0YsQ0FBQzs7QUFFRixDQUFDLENBQUMsT0FBTyxNQUFNLENBQUMsT0FBTyxLQUFLLFVBQVUsR0FBRSxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sR0FBRSxNQUFNLENBQUMsT0FBTyxDQUFBLENBQUUsUUFBUSxHQUFHLGdCQUFnQixDQUFDIiwiZmlsZSI6Ii9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvb3BlbmVkLWZpbGVzL2NvbXBvbmVudHNfY29tcGlsZWQvZm9sZGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIF9fdnVlX3RlbXBsYXRlX18gPSBcIjxsaSBjbGFzcz1cXFwiZGlyZWN0b3J5IGxpc3QtbmVzdGVkLWl0ZW1cXFwiIHYtb249XFxcIm1vdXNlZW50ZXI6IGhvdmVyLCBtb3VzZWxlYXZlOiB1bmhvdmVyLG1vdXNlb3ZlcjogaGlnaGxpZ2h0LCBtb3VzZW91dDogdW5oaWdobGlnaHRcXFwiIHYtY2xhc3M9XFxcIlxcbiAgICAgIHNlbGVjdGVkOiBpc1NlbGVjdGVkLFxcbiAgICAgIGNvbGxhcHNlZDogaXNDb2xsYXBzZWQsXFxuICAgICAgZXhwYW5kZWQ6ICFpc0NvbGxhcHNlZCxcXG4gICAgICBvZi1oaWdobGlnaHQ6aXNIaWdobGlnaHQgJmFtcDsmYW1wOyBzaG91bGRIaWdobGlnaHRcXG4gICAgXFxcIj5cXG4gICAgPGRpdiBjbGFzcz1cXFwiaGVhZGVyIGxpc3QtaXRlbSBmb2xkZXJcXFwiIHYtb249XFxcImNsaWNrOiBvbkNsaWNrXFxcIj5cXG4gICAgICA8c3BhbiBjbGFzcz1cXFwibmFtZVxcXCIgZGF0YS1uYW1lPVxcXCJ7e2VudHJ5Lm5hbWV9fVxcXCIgZGF0YS1wYXRoPVxcXCJ7e2VudHJ5LnBhdGh9fVxcXCI+e3tlbnRyeS5uYW1lfX08L3NwYW4+XFxuXFxuICAgICAgPHNwYW4gdi1jbGFzcz1cXFwiaGlkZGVuOiAhaXNIb3ZlcmVkXFxcIiBjbGFzcz1cXFwiaWNvbiBpY29uLXhcXFwiIHYtb249XFxcImNsaWNrOiBjbG9zZVxcXCI+XFxuICAgICAgPC9zcGFuPlxcbiAgICA8L2Rpdj5cXG4gICAgPG9sIGNsYXNzPVxcXCJlbnRyaWVzIGxpc3QtdHJlZVxcXCIgdi1vbj1cXFwibW91c2VvdmVyOiB1bmhpZ2hsaWdodFxcXCI+XFxuICAgICAgPGZvbGRlciB2LXJlcGVhdD1cXFwiZW50cnk6IGVudHJ5LmZvbGRlcnNcXFwiIHRyYWNrLWJ5PVxcXCJwYXRoXFxcIj5cXG4gICAgICA8L2ZvbGRlcj5cXG4gICAgICA8ZmlsZSB2LXJlcGVhdD1cXFwiZW50cnk6IGVudHJ5LmZpbGVzXFxcIiB0cmFjay1ieT1cXFwicGF0aFxcXCI+XFxuICAgICAgPC9maWxlPlxcbiAgICA8L29sPlxcbiAgPC9saT5cIjtcbnZhciB0cmVlTWFuYWdlcjtcblxudHJlZU1hbmFnZXIgPSBudWxsO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgcmVwbGFjZTogdHJ1ZSxcbiAgZGF0YTogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGlzU2VsZWN0ZWQ6IGZhbHNlLFxuICAgICAgaXNDb2xsYXBzZWQ6IGZhbHNlLFxuICAgICAgaXNIb3ZlcmVkOiBmYWxzZSxcbiAgICAgIHNob3VsZEhpZ2hsaWdodDogYXRvbS5jb25maWcuZ2V0KFwib3BlbmVkLWZpbGVzLmhpZ2hsaWdodE9uSG92ZXJcIiksXG4gICAgICBpc0hpZ2hsaWdodDogZmFsc2UsXG4gICAgICBjb2xvcjogZmFsc2VcbiAgICB9O1xuICB9LFxuICBtZXRob2RzOiB7XG4gICAgaG92ZXI6IGZ1bmN0aW9uKGUpIHtcbiAgICAgIHJldHVybiB0aGlzLmlzSG92ZXJlZCA9IHRydWU7XG4gICAgfSxcbiAgICB1bmhvdmVyOiBmdW5jdGlvbihlKSB7XG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgcmV0dXJuIHRoaXMuaXNIb3ZlcmVkID0gZmFsc2U7XG4gICAgfSxcbiAgICBoaWdobGlnaHQ6IGZ1bmN0aW9uKGUpIHtcbiAgICAgIHJldHVybiB0aGlzLmlzSGlnaGxpZ2h0ID0gdHJ1ZTtcbiAgICB9LFxuICAgIHVuaGlnaGxpZ2h0OiBmdW5jdGlvbihlKSB7XG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgcmV0dXJuIHRoaXMuaXNIaWdobGlnaHQgPSBmYWxzZTtcbiAgICB9LFxuICAgIGNsb3NlOiBmdW5jdGlvbihlKSB7XG4gICAgICB0aGlzLiRyb290LmxvZ0ZvbGRlcihcImNsb3NpbmdcIiwgMik7XG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgcmV0dXJuIHRoaXMuJGJyb2FkY2FzdChcImNsb3NlXCIpO1xuICAgIH0sXG4gICAgb25DbGljazogZnVuY3Rpb24oZSkge1xuICAgICAgdGhpcy4kcm9vdC5sb2dGb2xkZXIoXCJzZWxlY3RpbmdcIiwgMik7XG4gICAgICB0aGlzLiRyb290LnNlbGVjdGVkKHRoaXMuZW50cnkucGF0aCk7XG4gICAgICB0aGlzLnRvZ2dsZUZvbGRlcigpO1xuICAgICAgcmV0dXJuIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgfSxcbiAgICB0b2dnbGVGb2xkZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5pc0NvbGxhcHNlZCA9ICF0aGlzLmlzQ29sbGFwc2VkO1xuICAgICAgcmV0dXJuIHNldFRpbWVvdXQodGhpcy4kcm9vdC5yZXNpemUsIDEpO1xuICAgIH0sXG4gICAgaXNFbXB0eTogZnVuY3Rpb24oKSB7XG4gICAgICBpZiAodHlwZW9mIHRoaXMgPT09IFwidW5kZWZpbmVkXCIgfHwgdGhpcyA9PT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLmVudHJ5LmZpbGVzLmxlbmd0aCA9PT0gMCAmJiB0aGlzLmVudHJ5LmZvbGRlcnMubGVuZ3RoID09PSAwO1xuICAgIH1cbiAgfSxcbiAgY3JlYXRlZDogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy4kcm9vdC5sb2dGb2xkZXIoXCJjcmVhdGVkXCIsIDIpO1xuICAgIHRoaXMuJG9uKFwic2VsZWN0ZWRcIiwgKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24ocGF0aCkge1xuICAgICAgICBfdGhpcy5pc1NlbGVjdGVkID0gcGF0aCA9PT0gX3RoaXMuZW50cnkucGF0aDtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9O1xuICAgIH0pKHRoaXMpKTtcbiAgICB0aGlzLiRvbihcInJlbW92ZUZpbGVcIiwgKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24oZW50cnkpIHtcbiAgICAgICAgdmFyIHJlZjtcbiAgICAgICAgX3RoaXMuJHJvb3QubG9nRm9sZGVyKFwicmVtb3ZpbmcgXCIgKyBlbnRyeS5wYXRoKTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBfdGhpcy5lbnRyeS5maWxlcy4kcmVtb3ZlKGVudHJ5KTtcbiAgICAgICAgfSBjYXRjaCAoX2Vycm9yKSB7fVxuICAgICAgICBzZXRUaW1lb3V0KChyZWYgPSBfdGhpcy4kcm9vdCkgIT0gbnVsbCA/IHJlZi5yZXNpemUgOiB2b2lkIDAsIDEpO1xuICAgICAgICBpZiAoX3RoaXMuaXNFbXB0eSgpKSB7XG4gICAgICAgICAgaWYgKF90aGlzICE9IG51bGwpIHtcbiAgICAgICAgICAgIF90aGlzLiRkaXNwYXRjaChcInJlbW92ZUZvbGRlclwiLCBfdGhpcy5lbnRyeSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH07XG4gICAgfSkodGhpcykpO1xuICAgIHJldHVybiB0aGlzLiRvbihcInJlbW92ZUZvbGRlclwiLCAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbihlbnRyeSkge1xuICAgICAgICB2YXIgcmVmO1xuICAgICAgICB0cnkge1xuICAgICAgICAgIF90aGlzLmVudHJ5LmZvbGRlcnMuJHJlbW92ZShlbnRyeSk7XG4gICAgICAgIH0gY2F0Y2ggKF9lcnJvcikge31cbiAgICAgICAgc2V0VGltZW91dCgocmVmID0gX3RoaXMuJHJvb3QpICE9IG51bGwgPyByZWYucmVzaXplIDogdm9pZCAwLCAxKTtcbiAgICAgICAgaWYgKF90aGlzLmlzRW1wdHkoKSkge1xuICAgICAgICAgIGlmIChfdGhpcyAhPSBudWxsKSB7XG4gICAgICAgICAgICBfdGhpcy4kZGlzcGF0Y2goXCJyZW1vdmVGb2xkZXJcIiwgX3RoaXMuZW50cnkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9O1xuICAgIH0pKHRoaXMpKTtcbiAgfSxcbiAgZGVzdHJveWVkOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgcmVmO1xuICAgIHJldHVybiAocmVmID0gdGhpcy4kcm9vdCkgIT0gbnVsbCA/IHJlZi5yZXNpemUoKSA6IHZvaWQgMDtcbiAgfVxufTtcblxuOyh0eXBlb2YgbW9kdWxlLmV4cG9ydHMgPT09IFwiZnVuY3Rpb25cIj8gbW9kdWxlLmV4cG9ydHMub3B0aW9uczogbW9kdWxlLmV4cG9ydHMpLnRlbXBsYXRlID0gX192dWVfdGVtcGxhdGVfXztcbiJdfQ==