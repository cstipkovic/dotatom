var __vue_template__ = "<li class=\"file list-item\" v-on=\"click: onClick, mouseenter: highlight, mouseleave: unhighlight\" v-class=\"\n    selected: isSelected,\n      of-highlight:isHovered &amp;&amp; shouldHighlight,\n      of-hovered: isHovered\n      \">\n    <span class=\"icon icon-x\" v-class=\"notHovered:!isHovered\" v-on=\"click: close\">\n    </span>\n    <span class=\"name\">\n      {{entry.name}}\n    </span>\n    <span class=\"path\" v-if=\"entry.pathIdentifier\">\n      {{entry.pathIdentifier}}\n    </span>\n    <span class=\"icon icon-paintcan\" v-if=\"isHovered &amp;&amp; hasColorPicker\" v-on=\"click: colorPicker\">\n    </span>\n  </li>";
module.exports = {
  replace: true,
  data: function data() {
    return {
      isSelected: false,
      hasColorPicker: false,
      isHovered: false,
      shouldHighlight: atom.config.get("opened-files.highlightOnHover"),
      colorStyle: atom.config.get("opened-files.colorStyle"),
      disposable: null
    };
  },
  methods: {
    highlight: function highlight(e) {
      var i, len, tab, tabs;
      if (this.shouldHighlight) {
        tabs = document.querySelectorAll(".tab-bar>li.tab[data-type='TextEditor']>div.title[data-path='" + this.entry.path.replace(/\\/g, "\\\\") + "']");
        for (i = 0, len = tabs.length; i < len; i++) {
          tab = tabs[i];
          tab.parentNode.classList.add("of-highlight");
        }
      }
      return this.isHovered = true;
    },
    unhighlight: function unhighlight(e) {
      var i, len, tab, tabs;
      e.stopPropagation();
      if (this.shouldHighlight) {
        tabs = document.querySelectorAll(".tab-bar>li.tab[data-type='TextEditor']>div.title[data-path='" + this.entry.path.replace(/\\/g, "\\\\") + "']");
        for (i = 0, len = tabs.length; i < len; i++) {
          tab = tabs[i];
          tab.parentNode.classList.remove("of-highlight");
        }
      }
      return this.isHovered = false;
    },
    close: function close(e) {
      var i, len, pane, paneItem, paneItems, panePath, path;
      if (e != null) {
        e.stopPropagation();
      }
      paneItems = atom.workspace.getPaneItems();
      path = this.entry.path;
      for (i = 0, len = paneItems.length; i < len; i++) {
        paneItem = paneItems[i];
        if (paneItem.getPath) {
          panePath = paneItem.getPath();
          if (panePath === path) {
            this.$root.logFile("destroying " + panePath);
            pane = atom.workspace.paneForItem(paneItem);
            if (pane != null ? pane.promptToSaveItem(paneItem) : void 0) {
              if (typeof paneItem.destroy === "function") {
                paneItem.destroy();
              }
              true;
            }
          }
        }
      }
      this.$dispatch("removeFile", this.entry);
      return this.$root.removePath(this.entry.path);
    },
    color: function color() {
      var color, css, ref, ref1, text_color;
      color = (ref = this.$root) != null ? (ref1 = ref.colors) != null ? ref1[this.entry.path] : void 0 : void 0;
      if (color != null) {
        if (color) {
          css = (function () {
            switch (this.colorStyle) {
              case "gradient":
                return "background-image: -webkit-linear-gradient(right, " + color + " 0%, rgba(0,0,0,0) 100%);";
              case "border":
                return "border-right: solid 6px " + color + ";";
              case "solid":
                return "background: " + color + ";";
              default:
                return "";
            }
          }).call(this);
          if (this.colorStyle === "solid") {
            if (parseInt(color.replace("#", ""), 16) > 0xffffff / 2) {
              text_color = "black";
            } else {
              text_color = "white";
            }
            css += "color: " + text_color + ";";
          }
          return this.$el.setAttribute("style", css);
        } else {
          return this.$el.removeAttribute("style");
        }
      }
    },
    colorPicker: function colorPicker(e) {
      var ref, ref1;
      e.stopPropagation();
      if (!(this.$root.colorPicker != null && this.$root.changeColor != null)) {
        this.$root.$broadcast("noColorPicker");
        atom.notifications.addError("package missing: `color-tabs` or `color-picker-service`");
        return;
      }
      return this.$root.colorPicker({
        x: e.x,
        y: e.y,
        color: (ref = this.$root) != null ? (ref1 = ref.colors) != null ? ref1[this.entry.path] : void 0 : void 0
      }, (function (_this) {
        return function (newColor) {
          var base;
          return typeof (base = _this.$root).changeColor === "function" ? base.changeColor(_this.entry.path, newColor) : void 0;
        };
      })(this));
    },
    onClick: function onClick(e) {
      this.$root.selected(this.entry.path);
      atom.workspace.open(this.entry.path, {
        searchAllPanes: true
      });
      return e.stopPropagation();
    }
  },
  beforeDestroy: function beforeDestroy() {
    var ref;
    this.$root.logFile("beforeDestroy", 2);
    return (ref = this.disposable) != null ? ref.dispose() : void 0;
  },
  created: function created() {
    this.$root.logFile("created", 2);
    this.$on("selected", (function (_this) {
      return function (path) {
        _this.isSelected = path === _this.entry.path;
        return true;
      };
    })(this));
    this.$on("close", (function (_this) {
      return function (path) {
        if (path != null) {
          if (path === _this.entry.path) {
            return _this.close();
          }
        } else {
          return _this.close();
        }
      };
    })(this));
    this.$on("noColorPicker", (function (_this) {
      return function () {
        return _this.hasColorPicker = false;
      };
    })(this));
    this.hasColorPicker = this.$root.colorPicker != null;
    return this.$on("color", (function (_this) {
      return function (path) {
        var ref;
        if (path === _this.entry.path) {
          if ((ref = _this.$root) != null) {
            ref.logFile("got new color", 2);
          }
          return _this.color();
        }
      };
    })(this));
  },
  compiled: function compiled() {
    var ref;
    if ((ref = this.$root) != null) {
      ref.logFile("compiled", 2);
    }
    return this.color();
  },
  destroyed: function destroyed() {
    var ref, ref1;
    if ((ref = this.$root) != null) {
      ref.logFile("destroyed", 2);
    }
    return (ref1 = this.$root) != null ? ref1.resize() : void 0;
  },
  attached: function attached() {
    this.$root.logFile("attached", 2);
    return this.$root.resize();
  }
};

;(typeof module.exports === "function" ? module.exports.options : module.exports).template = __vue_template__;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvb3BlbmVkLWZpbGVzL2NvbXBvbmVudHNfY29tcGlsZWQvZmlsZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxJQUFJLGdCQUFnQixHQUFHLGlvQkFBaW9CLENBQUM7QUFDenBCLE1BQU0sQ0FBQyxPQUFPLEdBQUc7QUFDZixTQUFPLEVBQUUsSUFBSTtBQUNiLE1BQUksRUFBRSxnQkFBVztBQUNmLFdBQU87QUFDTCxnQkFBVSxFQUFFLEtBQUs7QUFDakIsb0JBQWMsRUFBRSxLQUFLO0FBQ3JCLGVBQVMsRUFBRSxLQUFLO0FBQ2hCLHFCQUFlLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsK0JBQStCLENBQUM7QUFDakUsZ0JBQVUsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyx5QkFBeUIsQ0FBQztBQUN0RCxnQkFBVSxFQUFFLElBQUk7S0FDakIsQ0FBQztHQUNIO0FBQ0QsU0FBTyxFQUFFO0FBQ1AsYUFBUyxFQUFFLG1CQUFTLENBQUMsRUFBRTtBQUNyQixVQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQztBQUN0QixVQUFJLElBQUksQ0FBQyxlQUFlLEVBQUU7QUFDeEIsWUFBSSxHQUFHLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQywrREFBK0QsR0FBSSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxBQUFDLEdBQUcsSUFBSSxDQUFDLENBQUM7QUFDcEosYUFBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDM0MsYUFBRyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNkLGFBQUcsQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FB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QUFDRCxXQUFTLEVBQUUscUJBQVc7QUFDcEIsUUFBSSxHQUFHLEVBQUUsSUFBSSxDQUFDO0FBQ2QsUUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFBLElBQUssSUFBSSxFQUFFO0FBQzlCLFNBQUcsQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDO0tBQzdCO0FBQ0QsV0FBTyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFBLElBQUssSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxLQUFLLENBQUMsQ0FBQztHQUM3RDtBQUNELFVBQVEsRUFBRSxvQkFBVztBQUNuQixRQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDbEMsV0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDO0dBQzVCO0NBQ0YsQ0FBQzs7QUFFRixDQUFDLENBQUMsT0FBTyxNQUFNLENBQUMsT0FBTyxLQUFLLFVBQVUsR0FBRSxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sR0FBRSxNQUFNLENBQUMsT0FBTyxDQUFBLENBQUUsUUFBUSxHQUFHLGdCQUFnQixDQUFDIiwiZmlsZSI6Ii9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvb3BlbmVkLWZpbGVzL2NvbXBvbmVudHNfY29tcGlsZWQvZmlsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBfX3Z1ZV90ZW1wbGF0ZV9fID0gXCI8bGkgY2xhc3M9XFxcImZpbGUgbGlzdC1pdGVtXFxcIiB2LW9uPVxcXCJjbGljazogb25DbGljaywgbW91c2VlbnRlcjogaGlnaGxpZ2h0LCBtb3VzZWxlYXZlOiB1bmhpZ2hsaWdodFxcXCIgdi1jbGFzcz1cXFwiXFxuICAgIHNlbGVjdGVkOiBpc1NlbGVjdGVkLFxcbiAgICAgIG9mLWhpZ2hsaWdodDppc0hvdmVyZWQgJmFtcDsmYW1wOyBzaG91bGRIaWdobGlnaHQsXFxuICAgICAgb2YtaG92ZXJlZDogaXNIb3ZlcmVkXFxuICAgICAgXFxcIj5cXG4gICAgPHNwYW4gY2xhc3M9XFxcImljb24gaWNvbi14XFxcIiB2LWNsYXNzPVxcXCJub3RIb3ZlcmVkOiFpc0hvdmVyZWRcXFwiIHYtb249XFxcImNsaWNrOiBjbG9zZVxcXCI+XFxuICAgIDwvc3Bhbj5cXG4gICAgPHNwYW4gY2xhc3M9XFxcIm5hbWVcXFwiPlxcbiAgICAgIHt7ZW50cnkubmFtZX19XFxuICAgIDwvc3Bhbj5cXG4gICAgPHNwYW4gY2xhc3M9XFxcInBhdGhcXFwiIHYtaWY9XFxcImVudHJ5LnBhdGhJZGVudGlmaWVyXFxcIj5cXG4gICAgICB7e2VudHJ5LnBhdGhJZGVudGlmaWVyfX1cXG4gICAgPC9zcGFuPlxcbiAgICA8c3BhbiBjbGFzcz1cXFwiaWNvbiBpY29uLXBhaW50Y2FuXFxcIiB2LWlmPVxcXCJpc0hvdmVyZWQgJmFtcDsmYW1wOyBoYXNDb2xvclBpY2tlclxcXCIgdi1vbj1cXFwiY2xpY2s6IGNvbG9yUGlja2VyXFxcIj5cXG4gICAgPC9zcGFuPlxcbiAgPC9saT5cIjtcbm1vZHVsZS5leHBvcnRzID0ge1xuICByZXBsYWNlOiB0cnVlLFxuICBkYXRhOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4ge1xuICAgICAgaXNTZWxlY3RlZDogZmFsc2UsXG4gICAgICBoYXNDb2xvclBpY2tlcjogZmFsc2UsXG4gICAgICBpc0hvdmVyZWQ6IGZhbHNlLFxuICAgICAgc2hvdWxkSGlnaGxpZ2h0OiBhdG9tLmNvbmZpZy5nZXQoXCJvcGVuZWQtZmlsZXMuaGlnaGxpZ2h0T25Ib3ZlclwiKSxcbiAgICAgIGNvbG9yU3R5bGU6IGF0b20uY29uZmlnLmdldChcIm9wZW5lZC1maWxlcy5jb2xvclN0eWxlXCIpLFxuICAgICAgZGlzcG9zYWJsZTogbnVsbFxuICAgIH07XG4gIH0sXG4gIG1ldGhvZHM6IHtcbiAgICBoaWdobGlnaHQ6IGZ1bmN0aW9uKGUpIHtcbiAgICAgIHZhciBpLCBsZW4sIHRhYiwgdGFicztcbiAgICAgIGlmICh0aGlzLnNob3VsZEhpZ2hsaWdodCkge1xuICAgICAgICB0YWJzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi50YWItYmFyPmxpLnRhYltkYXRhLXR5cGU9J1RleHRFZGl0b3InXT5kaXYudGl0bGVbZGF0YS1wYXRoPSdcIiArICh0aGlzLmVudHJ5LnBhdGgucmVwbGFjZSgvXFxcXC9nLCBcIlxcXFxcXFxcXCIpKSArIFwiJ11cIik7XG4gICAgICAgIGZvciAoaSA9IDAsIGxlbiA9IHRhYnMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICB0YWIgPSB0YWJzW2ldO1xuICAgICAgICAgIHRhYi5wYXJlbnROb2RlLmNsYXNzTGlzdC5hZGQoXCJvZi1oaWdobGlnaHRcIik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLmlzSG92ZXJlZCA9IHRydWU7XG4gICAgfSxcbiAgICB1bmhpZ2hsaWdodDogZnVuY3Rpb24oZSkge1xuICAgICAgdmFyIGksIGxlbiwgdGFiLCB0YWJzO1xuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIGlmICh0aGlzLnNob3VsZEhpZ2hsaWdodCkge1xuICAgICAgICB0YWJzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi50YWItYmFyPmxpLnRhYltkYXRhLXR5cGU9J1RleHRFZGl0b3InXT5kaXYudGl0bGVbZGF0YS1wYXRoPSdcIiArICh0aGlzLmVudHJ5LnBhdGgucmVwbGFjZSgvXFxcXC9nLCBcIlxcXFxcXFxcXCIpKSArIFwiJ11cIik7XG4gICAgICAgIGZvciAoaSA9IDAsIGxlbiA9IHRhYnMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICB0YWIgPSB0YWJzW2ldO1xuICAgICAgICAgIHRhYi5wYXJlbnROb2RlLmNsYXNzTGlzdC5yZW1vdmUoXCJvZi1oaWdobGlnaHRcIik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLmlzSG92ZXJlZCA9IGZhbHNlO1xuICAgIH0sXG4gICAgY2xvc2U6IGZ1bmN0aW9uKGUpIHtcbiAgICAgIHZhciBpLCBsZW4sIHBhbmUsIHBhbmVJdGVtLCBwYW5lSXRlbXMsIHBhbmVQYXRoLCBwYXRoO1xuICAgICAgaWYgKGUgIT0gbnVsbCkge1xuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgfVxuICAgICAgcGFuZUl0ZW1zID0gYXRvbS53b3Jrc3BhY2UuZ2V0UGFuZUl0ZW1zKCk7XG4gICAgICBwYXRoID0gdGhpcy5lbnRyeS5wYXRoO1xuICAgICAgZm9yIChpID0gMCwgbGVuID0gcGFuZUl0ZW1zLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIHBhbmVJdGVtID0gcGFuZUl0ZW1zW2ldO1xuICAgICAgICBpZiAocGFuZUl0ZW0uZ2V0UGF0aCkge1xuICAgICAgICAgIHBhbmVQYXRoID0gcGFuZUl0ZW0uZ2V0UGF0aCgpO1xuICAgICAgICAgIGlmIChwYW5lUGF0aCA9PT0gcGF0aCkge1xuICAgICAgICAgICAgdGhpcy4kcm9vdC5sb2dGaWxlKFwiZGVzdHJveWluZyBcIiArIHBhbmVQYXRoKTtcbiAgICAgICAgICAgIHBhbmUgPSBhdG9tLndvcmtzcGFjZS5wYW5lRm9ySXRlbShwYW5lSXRlbSk7XG4gICAgICAgICAgICBpZiAocGFuZSAhPSBudWxsID8gcGFuZS5wcm9tcHRUb1NhdmVJdGVtKHBhbmVJdGVtKSA6IHZvaWQgMCkge1xuICAgICAgICAgICAgICBpZiAodHlwZW9mIHBhbmVJdGVtLmRlc3Ryb3kgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgIHBhbmVJdGVtLmRlc3Ryb3koKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhpcy4kZGlzcGF0Y2goXCJyZW1vdmVGaWxlXCIsIHRoaXMuZW50cnkpO1xuICAgICAgcmV0dXJuIHRoaXMuJHJvb3QucmVtb3ZlUGF0aCh0aGlzLmVudHJ5LnBhdGgpO1xuICAgIH0sXG4gICAgY29sb3I6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGNvbG9yLCBjc3MsIHJlZiwgcmVmMSwgdGV4dF9jb2xvcjtcbiAgICAgIGNvbG9yID0gKHJlZiA9IHRoaXMuJHJvb3QpICE9IG51bGwgPyAocmVmMSA9IHJlZi5jb2xvcnMpICE9IG51bGwgPyByZWYxW3RoaXMuZW50cnkucGF0aF0gOiB2b2lkIDAgOiB2b2lkIDA7XG4gICAgICBpZiAoY29sb3IgIT0gbnVsbCkge1xuICAgICAgICBpZiAoY29sb3IpIHtcbiAgICAgICAgICBjc3MgPSAoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBzd2l0Y2ggKHRoaXMuY29sb3JTdHlsZSkge1xuICAgICAgICAgICAgICBjYXNlIFwiZ3JhZGllbnRcIjpcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJiYWNrZ3JvdW5kLWltYWdlOiAtd2Via2l0LWxpbmVhci1ncmFkaWVudChyaWdodCwgXCIgKyBjb2xvciArIFwiIDAlLCByZ2JhKDAsMCwwLDApIDEwMCUpO1wiO1xuICAgICAgICAgICAgICBjYXNlIFwiYm9yZGVyXCI6XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiYm9yZGVyLXJpZ2h0OiBzb2xpZCA2cHggXCIgKyBjb2xvciArIFwiO1wiO1xuICAgICAgICAgICAgICBjYXNlIFwic29saWRcIjpcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJiYWNrZ3JvdW5kOiBcIiArIGNvbG9yICsgXCI7XCI7XG4gICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSkuY2FsbCh0aGlzKTtcbiAgICAgICAgICBpZiAodGhpcy5jb2xvclN0eWxlID09PSBcInNvbGlkXCIpIHtcbiAgICAgICAgICAgIGlmIChwYXJzZUludChjb2xvci5yZXBsYWNlKCcjJywgJycpLCAxNikgPiAweGZmZmZmZiAvIDIpIHtcbiAgICAgICAgICAgICAgdGV4dF9jb2xvciA9IFwiYmxhY2tcIjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHRleHRfY29sb3IgPSBcIndoaXRlXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjc3MgKz0gXCJjb2xvcjogXCIgKyB0ZXh0X2NvbG9yICsgXCI7XCI7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiB0aGlzLiRlbC5zZXRBdHRyaWJ1dGUoXCJzdHlsZVwiLCBjc3MpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiB0aGlzLiRlbC5yZW1vdmVBdHRyaWJ1dGUoXCJzdHlsZVwiKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgY29sb3JQaWNrZXI6IGZ1bmN0aW9uKGUpIHtcbiAgICAgIHZhciByZWYsIHJlZjE7XG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgaWYgKCEoKHRoaXMuJHJvb3QuY29sb3JQaWNrZXIgIT0gbnVsbCkgJiYgKHRoaXMuJHJvb3QuY2hhbmdlQ29sb3IgIT0gbnVsbCkpKSB7XG4gICAgICAgIHRoaXMuJHJvb3QuJGJyb2FkY2FzdChcIm5vQ29sb3JQaWNrZXJcIik7XG4gICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcihcInBhY2thZ2UgbWlzc2luZzogYGNvbG9yLXRhYnNgIG9yIGBjb2xvci1waWNrZXItc2VydmljZWBcIik7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLiRyb290LmNvbG9yUGlja2VyKHtcbiAgICAgICAgeDogZS54LFxuICAgICAgICB5OiBlLnksXG4gICAgICAgIGNvbG9yOiAocmVmID0gdGhpcy4kcm9vdCkgIT0gbnVsbCA/IChyZWYxID0gcmVmLmNvbG9ycykgIT0gbnVsbCA/IHJlZjFbdGhpcy5lbnRyeS5wYXRoXSA6IHZvaWQgMCA6IHZvaWQgMFxuICAgICAgfSwgKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbihuZXdDb2xvcikge1xuICAgICAgICAgIHZhciBiYXNlO1xuICAgICAgICAgIHJldHVybiB0eXBlb2YgKGJhc2UgPSBfdGhpcy4kcm9vdCkuY2hhbmdlQ29sb3IgPT09IFwiZnVuY3Rpb25cIiA/IGJhc2UuY2hhbmdlQ29sb3IoX3RoaXMuZW50cnkucGF0aCwgbmV3Q29sb3IpIDogdm9pZCAwO1xuICAgICAgICB9O1xuICAgICAgfSkodGhpcykpO1xuICAgIH0sXG4gICAgb25DbGljazogZnVuY3Rpb24oZSkge1xuICAgICAgdGhpcy4kcm9vdC5zZWxlY3RlZCh0aGlzLmVudHJ5LnBhdGgpO1xuICAgICAgYXRvbS53b3Jrc3BhY2Uub3Blbih0aGlzLmVudHJ5LnBhdGgsIHtcbiAgICAgICAgc2VhcmNoQWxsUGFuZXM6IHRydWVcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgfVxuICB9LFxuICBiZWZvcmVEZXN0cm95OiBmdW5jdGlvbigpIHtcbiAgICB2YXIgcmVmO1xuICAgIHRoaXMuJHJvb3QubG9nRmlsZShcImJlZm9yZURlc3Ryb3lcIiwgMik7XG4gICAgcmV0dXJuIChyZWYgPSB0aGlzLmRpc3Bvc2FibGUpICE9IG51bGwgPyByZWYuZGlzcG9zZSgpIDogdm9pZCAwO1xuICB9LFxuICBjcmVhdGVkOiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLiRyb290LmxvZ0ZpbGUoXCJjcmVhdGVkXCIsIDIpO1xuICAgIHRoaXMuJG9uKFwic2VsZWN0ZWRcIiwgKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24ocGF0aCkge1xuICAgICAgICBfdGhpcy5pc1NlbGVjdGVkID0gcGF0aCA9PT0gX3RoaXMuZW50cnkucGF0aDtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9O1xuICAgIH0pKHRoaXMpKTtcbiAgICB0aGlzLiRvbihcImNsb3NlXCIsIChmdW5jdGlvbihfdGhpcykge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKHBhdGgpIHtcbiAgICAgICAgaWYgKHBhdGggIT0gbnVsbCkge1xuICAgICAgICAgIGlmIChwYXRoID09PSBfdGhpcy5lbnRyeS5wYXRoKSB7XG4gICAgICAgICAgICByZXR1cm4gX3RoaXMuY2xvc2UoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIF90aGlzLmNsb3NlKCk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSkodGhpcykpO1xuICAgIHRoaXMuJG9uKFwibm9Db2xvclBpY2tlclwiLCAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIF90aGlzLmhhc0NvbG9yUGlja2VyID0gZmFsc2U7XG4gICAgICB9O1xuICAgIH0pKHRoaXMpKTtcbiAgICB0aGlzLmhhc0NvbG9yUGlja2VyID0gdGhpcy4kcm9vdC5jb2xvclBpY2tlciAhPSBudWxsO1xuICAgIHJldHVybiB0aGlzLiRvbihcImNvbG9yXCIsIChmdW5jdGlvbihfdGhpcykge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKHBhdGgpIHtcbiAgICAgICAgdmFyIHJlZjtcbiAgICAgICAgaWYgKHBhdGggPT09IF90aGlzLmVudHJ5LnBhdGgpIHtcbiAgICAgICAgICBpZiAoKHJlZiA9IF90aGlzLiRyb290KSAhPSBudWxsKSB7XG4gICAgICAgICAgICByZWYubG9nRmlsZShcImdvdCBuZXcgY29sb3JcIiwgMik7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBfdGhpcy5jb2xvcigpO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0pKHRoaXMpKTtcbiAgfSxcbiAgY29tcGlsZWQ6IGZ1bmN0aW9uKCkge1xuICAgIHZhciByZWY7XG4gICAgaWYgKChyZWYgPSB0aGlzLiRyb290KSAhPSBudWxsKSB7XG4gICAgICByZWYubG9nRmlsZShcImNvbXBpbGVkXCIsIDIpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5jb2xvcigpO1xuICB9LFxuICBkZXN0cm95ZWQ6IGZ1bmN0aW9uKCkge1xuICAgIHZhciByZWYsIHJlZjE7XG4gICAgaWYgKChyZWYgPSB0aGlzLiRyb290KSAhPSBudWxsKSB7XG4gICAgICByZWYubG9nRmlsZShcImRlc3Ryb3llZFwiLCAyKTtcbiAgICB9XG4gICAgcmV0dXJuIChyZWYxID0gdGhpcy4kcm9vdCkgIT0gbnVsbCA/IHJlZjEucmVzaXplKCkgOiB2b2lkIDA7XG4gIH0sXG4gIGF0dGFjaGVkOiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLiRyb290LmxvZ0ZpbGUoXCJhdHRhY2hlZFwiLCAyKTtcbiAgICByZXR1cm4gdGhpcy4kcm9vdC5yZXNpemUoKTtcbiAgfVxufTtcblxuOyh0eXBlb2YgbW9kdWxlLmV4cG9ydHMgPT09IFwiZnVuY3Rpb25cIj8gbW9kdWxlLmV4cG9ydHMub3B0aW9uczogbW9kdWxlLmV4cG9ydHMpLnRlbXBsYXRlID0gX192dWVfdGVtcGxhdGVfXztcbiJdfQ==