(function() {
  var AncestorsMethods, CanvasDrawer, CompositeDisposable, DOMStylesReader, Disposable, EventsDelegation, MinimapElement, MinimapQuickSettingsElement, debounce, _ref, _ref1,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  debounce = require('underscore-plus').debounce;

  _ref = require('atom'), CompositeDisposable = _ref.CompositeDisposable, Disposable = _ref.Disposable;

  _ref1 = require('atom-utils'), EventsDelegation = _ref1.EventsDelegation, AncestorsMethods = _ref1.AncestorsMethods;

  DOMStylesReader = require('./mixins/dom-styles-reader');

  CanvasDrawer = require('./mixins/canvas-drawer');

  MinimapQuickSettingsElement = null;

  MinimapElement = (function(_super) {
    __extends(MinimapElement, _super);

    function MinimapElement() {
      this.relayMousewheelEvent = __bind(this.relayMousewheelEvent, this);
      return MinimapElement.__super__.constructor.apply(this, arguments);
    }

    DOMStylesReader.includeInto(MinimapElement);

    CanvasDrawer.includeInto(MinimapElement);

    EventsDelegation.includeInto(MinimapElement);

    AncestorsMethods.includeInto(MinimapElement);


    /* Public */

    MinimapElement.prototype.displayMinimapOnLeft = false;

    MinimapElement.prototype.createdCallback = function() {
      this.subscriptions = new CompositeDisposable;
      this.initializeContent();
      return this.observeConfig({
        'minimap.displayMinimapOnLeft': (function(_this) {
          return function(displayMinimapOnLeft) {
            var swapPosition;
            swapPosition = (_this.minimap != null) && displayMinimapOnLeft !== _this.displayMinimapOnLeft;
            _this.displayMinimapOnLeft = displayMinimapOnLeft;
            return _this.updateMinimapFlexPosition();
          };
        })(this),
        'minimap.minimapScrollIndicator': (function(_this) {
          return function(minimapScrollIndicator) {
            _this.minimapScrollIndicator = minimapScrollIndicator;
            if (_this.minimapScrollIndicator && (_this.scrollIndicator == null)) {
              _this.initializeScrollIndicator();
            } else if (_this.scrollIndicator != null) {
              _this.disposeScrollIndicator();
            }
            if (_this.attached) {
              return _this.requestUpdate();
            }
          };
        })(this),
        'minimap.displayPluginsControls': (function(_this) {
          return function(displayPluginsControls) {
            _this.displayPluginsControls = displayPluginsControls;
            if (_this.displayPluginsControls && (_this.openQuickSettings == null)) {
              return _this.initializeOpenQuickSettings();
            } else if (_this.openQuickSettings != null) {
              return _this.disposeOpenQuickSettings();
            }
          };
        })(this),
        'minimap.textOpacity': (function(_this) {
          return function(textOpacity) {
            _this.textOpacity = textOpacity;
            if (_this.attached) {
              return _this.requestForcedUpdate();
            }
          };
        })(this),
        'minimap.displayCodeHighlights': (function(_this) {
          return function(displayCodeHighlights) {
            _this.displayCodeHighlights = displayCodeHighlights;
            if (_this.attached) {
              return _this.requestForcedUpdate();
            }
          };
        })(this),
        'minimap.adjustMinimapWidthToSoftWrap': (function(_this) {
          return function(adjustToSoftWrap) {
            _this.adjustToSoftWrap = adjustToSoftWrap;
            if (_this.attached) {
              return _this.measureHeightAndWidth();
            }
          };
        })(this),
        'minimap.useHardwareAcceleration': (function(_this) {
          return function(useHardwareAcceleration) {
            _this.useHardwareAcceleration = useHardwareAcceleration;
            if (_this.attached) {
              return _this.requestUpdate();
            }
          };
        })(this),
        'minimap.absoluteMode': (function(_this) {
          return function(absoluteMode) {
            _this.absoluteMode = absoluteMode;
            return _this.classList.toggle('absolute', _this.absoluteMode);
          };
        })(this),
        'editor.preferredLineLength': (function(_this) {
          return function() {
            if (_this.attached) {
              return _this.requestUpdate();
            }
          };
        })(this),
        'editor.softWrap': (function(_this) {
          return function() {
            if (_this.attached) {
              return _this.requestUpdate();
            }
          };
        })(this),
        'editor.softWrapAtPreferredLineLength': (function(_this) {
          return function() {
            if (_this.attached) {
              return _this.requestUpdate();
            }
          };
        })(this)
      });
    };

    MinimapElement.prototype.attachedCallback = function() {
      this.subscriptions.add(atom.views.pollDocument((function(_this) {
        return function() {
          return _this.pollDOM();
        };
      })(this)));
      this.measureHeightAndWidth();
      this.updateMinimapFlexPosition();
      this.attached = true;
      this.attachedToTextEditor = this.parentNode === this.getTextEditorElementRoot();
      return this.subscriptions.add(atom.styles.onDidAddStyleElement((function(_this) {
        return function() {
          _this.invalidateCache();
          return _this.requestForcedUpdate();
        };
      })(this)));
    };

    MinimapElement.prototype.detachedCallback = function() {
      return this.attached = false;
    };

    MinimapElement.prototype.isVisible = function() {
      return this.offsetWidth > 0 || this.offsetHeight > 0;
    };

    MinimapElement.prototype.attach = function(parent) {
      if (this.attached) {
        return;
      }
      return (parent != null ? parent : this.getTextEditorElementRoot()).appendChild(this);
    };

    MinimapElement.prototype.detach = function() {
      if (!this.attached) {
        return;
      }
      if (this.parentNode == null) {
        return;
      }
      return this.parentNode.removeChild(this);
    };

    MinimapElement.prototype.updateMinimapFlexPosition = function() {
      return this.classList.toggle('left', this.displayMinimapOnLeft);
    };

    MinimapElement.prototype.destroy = function() {
      this.subscriptions.dispose();
      this.detach();
      return this.minimap = null;
    };

    MinimapElement.prototype.initializeContent = function() {
      var canvasMousedown, elementMousewheel, visibleAreaMousedown;
      this.initializeCanvas();
      this.shadowRoot = this.createShadowRoot();
      this.shadowRoot.appendChild(this.canvas);
      this.visibleArea = document.createElement('div');
      this.visibleArea.classList.add('minimap-visible-area');
      this.shadowRoot.appendChild(this.visibleArea);
      this.controls = document.createElement('div');
      this.controls.classList.add('minimap-controls');
      this.shadowRoot.appendChild(this.controls);
      elementMousewheel = (function(_this) {
        return function(e) {
          return _this.relayMousewheelEvent(e);
        };
      })(this);
      canvasMousedown = (function(_this) {
        return function(e) {
          return _this.mousePressedOverCanvas(e);
        };
      })(this);
      visibleAreaMousedown = (function(_this) {
        return function(e) {
          return _this.startDrag(e);
        };
      })(this);
      this.addEventListener('mousewheel', elementMousewheel);
      this.canvas.addEventListener('mousedown', canvasMousedown);
      this.visibleArea.addEventListener('mousedown', visibleAreaMousedown);
      this.visibleArea.addEventListener('touchstart', visibleAreaMousedown);
      return this.subscriptions.add(new Disposable((function(_this) {
        return function() {
          _this.removeEventListener('mousewheel', elementMousewheel);
          _this.canvas.removeEventListener('mousedown', canvasMousedown);
          _this.visibleArea.removeEventListener('mousedown', visibleAreaMousedown);
          return _this.visibleArea.removeEventListener('touchstart', visibleAreaMousedown);
        };
      })(this)));
    };

    MinimapElement.prototype.initializeScrollIndicator = function() {
      this.scrollIndicator = document.createElement('div');
      this.scrollIndicator.classList.add('minimap-scroll-indicator');
      return this.controls.appendChild(this.scrollIndicator);
    };

    MinimapElement.prototype.disposeScrollIndicator = function() {
      this.controls.removeChild(this.scrollIndicator);
      return this.scrollIndicator = void 0;
    };

    MinimapElement.prototype.initializeOpenQuickSettings = function() {
      if (this.openQuickSettings != null) {
        return;
      }
      this.openQuickSettings = document.createElement('div');
      this.openQuickSettings.classList.add('open-minimap-quick-settings');
      this.controls.appendChild(this.openQuickSettings);
      return this.openQuickSettingSubscription = this.subscribeTo(this.openQuickSettings, {
        'mousedown': (function(_this) {
          return function(e) {
            var left, right, top, _ref2;
            e.preventDefault();
            e.stopPropagation();
            if (_this.quickSettingsElement != null) {
              _this.quickSettingsElement.destroy();
              return _this.quickSettingsSubscription.dispose();
            } else {
              if (MinimapQuickSettingsElement == null) {
                MinimapQuickSettingsElement = require('./minimap-quick-settings-element');
              }
              _this.quickSettingsElement = new MinimapQuickSettingsElement;
              _this.quickSettingsElement.setModel(_this);
              _this.quickSettingsSubscription = _this.quickSettingsElement.onDidDestroy(function() {
                return _this.quickSettingsElement = null;
              });
              _ref2 = _this.canvas.getBoundingClientRect(), top = _ref2.top, left = _ref2.left, right = _ref2.right;
              _this.quickSettingsElement.style.top = top + 'px';
              _this.quickSettingsElement.attach();
              if (_this.displayMinimapOnLeft) {
                return _this.quickSettingsElement.style.left = right + 'px';
              } else {
                return _this.quickSettingsElement.style.left = (left - _this.quickSettingsElement.clientWidth) + 'px';
              }
            }
          };
        })(this)
      });
    };

    MinimapElement.prototype.disposeOpenQuickSettings = function() {
      if (this.openQuickSettings == null) {
        return;
      }
      this.controls.removeChild(this.openQuickSettings);
      this.openQuickSettingSubscription.dispose();
      return this.openQuickSettings = void 0;
    };

    MinimapElement.prototype.getTextEditor = function() {
      return this.minimap.getTextEditor();
    };

    MinimapElement.prototype.getTextEditorElement = function() {
      return this.editorElement != null ? this.editorElement : this.editorElement = atom.views.getView(this.getTextEditor());
    };

    MinimapElement.prototype.getTextEditorElementRoot = function() {
      var editorElement, _ref2;
      editorElement = this.getTextEditorElement();
      return (_ref2 = editorElement.shadowRoot) != null ? _ref2 : editorElement;
    };

    MinimapElement.prototype.getDummyDOMRoot = function(shadowRoot) {
      if (shadowRoot) {
        return this.getTextEditorElementRoot();
      } else {
        return this.getTextEditorElement();
      }
    };

    MinimapElement.prototype.getModel = function() {
      return this.minimap;
    };

    MinimapElement.prototype.setModel = function(minimap) {
      this.minimap = minimap;
      this.subscriptions.add(this.minimap.onDidChangeScrollTop((function(_this) {
        return function() {
          return _this.requestUpdate();
        };
      })(this)));
      this.subscriptions.add(this.minimap.onDidChangeScrollLeft((function(_this) {
        return function() {
          return _this.requestUpdate();
        };
      })(this)));
      this.subscriptions.add(this.minimap.onDidDestroy((function(_this) {
        return function() {
          return _this.destroy();
        };
      })(this)));
      this.subscriptions.add(this.minimap.onDidChangeConfig((function(_this) {
        return function() {
          if (_this.attached) {
            return _this.requestForcedUpdate();
          }
        };
      })(this)));
      this.subscriptions.add(this.minimap.onDidChangeStandAlone((function(_this) {
        return function() {
          if (_this.minimap.isStandAlone()) {
            _this.setAttribute('stand-alone', true);
          } else {
            _this.removeAttribute('stand-alone');
          }
          return _this.requestUpdate();
        };
      })(this)));
      this.subscriptions.add(this.minimap.onDidChange((function(_this) {
        return function(change) {
          _this.pendingChanges.push(change);
          return _this.requestUpdate();
        };
      })(this)));
      if (this.minimap.isStandAlone()) {
        this.setAttribute('stand-alone', true);
      }
      if ((this.width != null) && (this.height != null)) {
        this.minimap.setScreenHeightAndWidth(this.height, this.width);
      }
      return this.minimap;
    };

    MinimapElement.prototype.requestUpdate = function() {
      if (this.frameRequested) {
        return;
      }
      this.frameRequested = true;
      return requestAnimationFrame((function(_this) {
        return function() {
          _this.update();
          return _this.frameRequested = false;
        };
      })(this));
    };

    MinimapElement.prototype.requestForcedUpdate = function() {
      this.offscreenFirstRow = null;
      this.offscreenLastRow = null;
      return this.requestUpdate();
    };

    MinimapElement.prototype.update = function() {
      var canvasTop, canvasTransform, indicatorHeight, indicatorScroll, minimapScreenHeight, visibleAreaLeft, visibleAreaTop, visibleWidth;
      if (!(this.attached && this.isVisible() && (this.minimap != null))) {
        return;
      }
      if (this.adjustToSoftWrap && (this.marginRight != null)) {
        this.style.marginRight = this.marginRight + 'px';
      } else {
        this.style.marginRight = null;
      }
      visibleAreaLeft = this.minimap.getTextEditorScaledScrollLeft();
      visibleAreaTop = this.minimap.getTextEditorScaledScrollTop() - this.minimap.getScrollTop();
      visibleWidth = Math.min(this.canvas.width / devicePixelRatio, this.width);
      this.applyStyles(this.visibleArea, {
        width: visibleWidth + 'px',
        height: this.minimap.getTextEditorScaledHeight() + 'px',
        transform: this.makeTranslate(visibleAreaLeft, visibleAreaTop)
      });
      this.applyStyles(this.controls, {
        width: visibleWidth + 'px'
      });
      canvasTop = this.minimap.getFirstVisibleScreenRow() * this.minimap.getLineHeight() - this.minimap.getScrollTop();
      canvasTransform = this.makeTranslate(0, canvasTop);
      if (devicePixelRatio !== 1) {
        canvasTransform += " " + this.makeScale(1 / devicePixelRatio);
      }
      this.applyStyles(this.canvas, {
        transform: canvasTransform
      });
      if (this.minimapScrollIndicator && this.minimap.canScroll() && !this.scrollIndicator) {
        this.initializeScrollIndicator();
      }
      if (this.scrollIndicator != null) {
        minimapScreenHeight = this.minimap.getScreenHeight();
        indicatorHeight = minimapScreenHeight * (minimapScreenHeight / this.minimap.getHeight());
        indicatorScroll = (minimapScreenHeight - indicatorHeight) * this.minimap.getCapedTextEditorScrollRatio();
        this.applyStyles(this.scrollIndicator, {
          height: indicatorHeight + 'px',
          transform: this.makeTranslate(0, indicatorScroll)
        });
        if (!this.minimap.canScroll()) {
          this.disposeScrollIndicator();
        }
      }
      return this.updateCanvas();
    };

    MinimapElement.prototype.setDisplayCodeHighlights = function(displayCodeHighlights) {
      this.displayCodeHighlights = displayCodeHighlights;
      if (this.attached) {
        return this.requestForcedUpdate();
      }
    };

    MinimapElement.prototype.pollDOM = function() {
      var visibilityChanged;
      visibilityChanged = this.checkForVisibilityChange();
      if (this.isVisible()) {
        if (!this.wasVisible) {
          this.requestForcedUpdate();
        }
        return this.measureHeightAndWidth(visibilityChanged, false);
      }
    };

    MinimapElement.prototype.checkForVisibilityChange = function() {
      if (this.isVisible()) {
        if (this.wasVisible) {
          return false;
        } else {
          return this.wasVisible = true;
        }
      } else {
        if (this.wasVisible) {
          this.wasVisible = false;
          return true;
        } else {
          return this.wasVisible = false;
        }
      }
    };

    MinimapElement.prototype.measureHeightAndWidth = function(visibilityChanged, forceUpdate) {
      var canvasWidth, lineLength, softWrap, softWrapAtPreferredLineLength, wasResized, width;
      if (forceUpdate == null) {
        forceUpdate = true;
      }
      if (this.minimap == null) {
        return;
      }
      wasResized = this.width !== this.clientWidth || this.height !== this.clientHeight;
      this.height = this.clientHeight;
      this.width = this.clientWidth;
      canvasWidth = this.width;
      if (this.minimap != null) {
        this.minimap.setScreenHeightAndWidth(this.height, this.width);
      }
      if (wasResized || visibilityChanged || forceUpdate) {
        this.requestForcedUpdate();
      }
      if (!this.isVisible()) {
        return;
      }
      if (wasResized || forceUpdate) {
        if (this.adjustToSoftWrap) {
          lineLength = atom.config.get('editor.preferredLineLength');
          softWrap = atom.config.get('editor.softWrap');
          softWrapAtPreferredLineLength = atom.config.get('editor.softWrapAtPreferredLineLength');
          width = lineLength * this.minimap.getCharWidth();
          if (softWrap && softWrapAtPreferredLineLength && lineLength && width < this.width) {
            this.marginRight = width - this.width;
            canvasWidth = width;
          } else {
            this.marginRight = null;
          }
        } else {
          delete this.marginRight;
        }
        if (canvasWidth !== this.canvas.width || this.height !== this.canvas.height) {
          this.canvas.width = canvasWidth * devicePixelRatio;
          return this.canvas.height = (this.height + this.minimap.getLineHeight()) * devicePixelRatio;
        }
      }
    };

    MinimapElement.prototype.observeConfig = function(configs) {
      var callback, config, _results;
      if (configs == null) {
        configs = {};
      }
      _results = [];
      for (config in configs) {
        callback = configs[config];
        _results.push(this.subscriptions.add(atom.config.observe(config, callback)));
      }
      return _results;
    };

    MinimapElement.prototype.mousePressedOverCanvas = function(e) {
      var height, top, _ref2;
      if (this.minimap.isStandAlone()) {
        return;
      }
      if (e.which === 1) {
        return this.leftMousePressedOverCanvas(e);
      } else if (e.which === 2) {
        this.middleMousePressedOverCanvas(e);
        _ref2 = this.visibleArea.getBoundingClientRect(), top = _ref2.top, height = _ref2.height;
        return this.startDrag({
          which: 2,
          pageY: top + height / 2
        });
      } else {

      }
    };

    MinimapElement.prototype.leftMousePressedOverCanvas = function(_arg) {
      var duration, from, pageY, row, scrollTop, step, target, textEditor, to, y;
      pageY = _arg.pageY, target = _arg.target;
      y = pageY - target.getBoundingClientRect().top;
      row = Math.floor(y / this.minimap.getLineHeight()) + this.minimap.getFirstVisibleScreenRow();
      textEditor = this.minimap.getTextEditor();
      scrollTop = row * textEditor.getLineHeightInPixels() - this.minimap.getTextEditorHeight() / 2;
      if (atom.config.get('minimap.scrollAnimation')) {
        from = this.minimap.getTextEditorScrollTop();
        to = scrollTop;
        step = (function(_this) {
          return function(now) {
            return _this.minimap.setTextEditorScrollTop(now);
          };
        })(this);
        duration = atom.config.get('minimap.scrollAnimationDuration');
        return this.animate({
          from: from,
          to: to,
          duration: duration,
          step: step
        });
      } else {
        return this.minimap.setTextEditorScrollTop(scrollTop);
      }
    };

    MinimapElement.prototype.middleMousePressedOverCanvas = function(_arg) {
      var offsetTop, pageY, ratio, y;
      pageY = _arg.pageY;
      offsetTop = this.getBoundingClientRect().top;
      y = pageY - offsetTop - this.minimap.getTextEditorScaledHeight() / 2;
      ratio = y / (this.minimap.getVisibleHeight() - this.minimap.getTextEditorScaledHeight());
      return this.minimap.setTextEditorScrollTop(ratio * this.minimap.getTextEditorMaxScrollTop());
    };

    MinimapElement.prototype.relayMousewheelEvent = function(e) {
      var editorElement;
      editorElement = atom.views.getView(this.minimap.textEditor);
      return editorElement.component.onMouseWheel(e);
    };

    MinimapElement.prototype.startDrag = function(e) {
      var dragOffset, initial, mousemoveHandler, mouseupHandler, offsetTop, pageY, top, which;
      which = e.which, pageY = e.pageY;
      if (!this.minimap) {
        return;
      }
      if (which !== 1 && which !== 2 && (e.touches == null)) {
        return;
      }
      top = this.visibleArea.getBoundingClientRect().top;
      offsetTop = this.getBoundingClientRect().top;
      dragOffset = pageY - top;
      initial = {
        dragOffset: dragOffset,
        offsetTop: offsetTop
      };
      mousemoveHandler = (function(_this) {
        return function(e) {
          return _this.drag(e, initial);
        };
      })(this);
      mouseupHandler = (function(_this) {
        return function(e) {
          return _this.endDrag(e, initial);
        };
      })(this);
      document.body.addEventListener('mousemove', mousemoveHandler);
      document.body.addEventListener('mouseup', mouseupHandler);
      document.body.addEventListener('mouseleave', mouseupHandler);
      document.body.addEventListener('touchmove', mousemoveHandler);
      document.body.addEventListener('touchend', mouseupHandler);
      return this.dragSubscription = new Disposable(function() {
        document.body.removeEventListener('mousemove', mousemoveHandler);
        document.body.removeEventListener('mouseup', mouseupHandler);
        document.body.removeEventListener('mouseleave', mouseupHandler);
        document.body.removeEventListener('touchmove', mousemoveHandler);
        return document.body.removeEventListener('touchend', mouseupHandler);
      });
    };

    MinimapElement.prototype.drag = function(e, initial) {
      var ratio, y;
      if (!this.minimap) {
        return;
      }
      if (e.which !== 1 && e.which !== 2 && (e.touches == null)) {
        return;
      }
      y = e.pageY - initial.offsetTop - initial.dragOffset;
      ratio = y / (this.minimap.getVisibleHeight() - this.minimap.getTextEditorScaledHeight());
      return this.minimap.setTextEditorScrollTop(ratio * this.minimap.getTextEditorMaxScrollTop());
    };

    MinimapElement.prototype.endDrag = function(e, initial) {
      if (!this.minimap) {
        return;
      }
      return this.dragSubscription.dispose();
    };

    MinimapElement.prototype.applyStyles = function(element, styles) {
      var cssText, property, value;
      cssText = '';
      for (property in styles) {
        value = styles[property];
        cssText += "" + property + ": " + value + "; ";
      }
      return element.style.cssText = cssText;
    };

    MinimapElement.prototype.makeTranslate = function(x, y) {
      if (x == null) {
        x = 0;
      }
      if (y == null) {
        y = 0;
      }
      if (this.useHardwareAcceleration) {
        return "translate3d(" + x + "px, " + y + "px, 0)";
      } else {
        return "translate(" + x + "px, " + y + "px)";
      }
    };

    MinimapElement.prototype.makeScale = function(x, y) {
      if (x == null) {
        x = 0;
      }
      if (y == null) {
        y = x;
      }
      if (this.useHardwareAcceleration) {
        return "scale3d(" + x + ", " + y + ", 1)";
      } else {
        return "scale(" + x + ", " + y + ")";
      }
    };

    MinimapElement.prototype.getTime = function() {
      return new Date();
    };

    MinimapElement.prototype.animate = function(_arg) {
      var duration, from, start, step, swing, to, update;
      from = _arg.from, to = _arg.to, duration = _arg.duration, step = _arg.step;
      start = this.getTime();
      swing = function(progress) {
        return 0.5 - Math.cos(progress * Math.PI) / 2;
      };
      update = (function(_this) {
        return function() {
          var delta, passed, progress;
          passed = _this.getTime() - start;
          if (duration === 0) {
            progress = 1;
          } else {
            progress = passed / duration;
          }
          if (progress > 1) {
            progress = 1;
          }
          delta = swing(progress);
          step(from + (to - from) * delta);
          if (progress < 1) {
            return requestAnimationFrame(update);
          }
        };
      })(this);
      return update();
    };

    return MinimapElement;

  })(HTMLElement);

  module.exports = MinimapElement = document.registerElement('atom-text-editor-minimap', {
    prototype: MinimapElement.prototype
  });

  MinimapElement.registerViewProvider = function() {
    return atom.views.addViewProvider(require('./minimap'), function(model) {
      var element;
      element = new MinimapElement;
      element.setModel(model);
      return element;
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2luX2NoYWxpYy8uYXRvbS9wYWNrYWdlcy9taW5pbWFwL2xpYi9taW5pbWFwLWVsZW1lbnQuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHNLQUFBO0lBQUE7O21TQUFBOztBQUFBLEVBQUMsV0FBWSxPQUFBLENBQVEsaUJBQVIsRUFBWixRQUFELENBQUE7O0FBQUEsRUFDQSxPQUFvQyxPQUFBLENBQVEsTUFBUixDQUFwQyxFQUFDLDJCQUFBLG1CQUFELEVBQXNCLGtCQUFBLFVBRHRCLENBQUE7O0FBQUEsRUFFQSxRQUF1QyxPQUFBLENBQVEsWUFBUixDQUF2QyxFQUFDLHlCQUFBLGdCQUFELEVBQW1CLHlCQUFBLGdCQUZuQixDQUFBOztBQUFBLEVBR0EsZUFBQSxHQUFrQixPQUFBLENBQVEsNEJBQVIsQ0FIbEIsQ0FBQTs7QUFBQSxFQUlBLFlBQUEsR0FBZSxPQUFBLENBQVEsd0JBQVIsQ0FKZixDQUFBOztBQUFBLEVBTUEsMkJBQUEsR0FBOEIsSUFOOUIsQ0FBQTs7QUFBQSxFQW9CTTtBQUNKLHFDQUFBLENBQUE7Ozs7O0tBQUE7O0FBQUEsSUFBQSxlQUFlLENBQUMsV0FBaEIsQ0FBNEIsY0FBNUIsQ0FBQSxDQUFBOztBQUFBLElBQ0EsWUFBWSxDQUFDLFdBQWIsQ0FBeUIsY0FBekIsQ0FEQSxDQUFBOztBQUFBLElBRUEsZ0JBQWdCLENBQUMsV0FBakIsQ0FBNkIsY0FBN0IsQ0FGQSxDQUFBOztBQUFBLElBR0EsZ0JBQWdCLENBQUMsV0FBakIsQ0FBNkIsY0FBN0IsQ0FIQSxDQUFBOztBQUtBO0FBQUEsZ0JBTEE7O0FBQUEsNkJBT0Esb0JBQUEsR0FBc0IsS0FQdEIsQ0FBQTs7QUFBQSw2QkFrQkEsZUFBQSxHQUFpQixTQUFBLEdBQUE7QUFDZixNQUFBLElBQUMsQ0FBQSxhQUFELEdBQWlCLEdBQUEsQ0FBQSxtQkFBakIsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLGlCQUFELENBQUEsQ0FEQSxDQUFBO2FBR0EsSUFBQyxDQUFBLGFBQUQsQ0FDRTtBQUFBLFFBQUEsOEJBQUEsRUFBZ0MsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFDLG9CQUFELEdBQUE7QUFDOUIsZ0JBQUEsWUFBQTtBQUFBLFlBQUEsWUFBQSxHQUFlLHVCQUFBLElBQWMsb0JBQUEsS0FBMEIsS0FBQyxDQUFBLG9CQUF4RCxDQUFBO0FBQUEsWUFDQSxLQUFDLENBQUEsb0JBQUQsR0FBd0Isb0JBRHhCLENBQUE7bUJBR0EsS0FBQyxDQUFBLHlCQUFELENBQUEsRUFKOEI7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFoQztBQUFBLFFBTUEsZ0NBQUEsRUFBa0MsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFFLHNCQUFGLEdBQUE7QUFDaEMsWUFEaUMsS0FBQyxDQUFBLHlCQUFBLHNCQUNsQyxDQUFBO0FBQUEsWUFBQSxJQUFHLEtBQUMsQ0FBQSxzQkFBRCxJQUFnQywrQkFBbkM7QUFDRSxjQUFBLEtBQUMsQ0FBQSx5QkFBRCxDQUFBLENBQUEsQ0FERjthQUFBLE1BRUssSUFBRyw2QkFBSDtBQUNILGNBQUEsS0FBQyxDQUFBLHNCQUFELENBQUEsQ0FBQSxDQURHO2FBRkw7QUFLQSxZQUFBLElBQW9CLEtBQUMsQ0FBQSxRQUFyQjtxQkFBQSxLQUFDLENBQUEsYUFBRCxDQUFBLEVBQUE7YUFOZ0M7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQU5sQztBQUFBLFFBY0EsZ0NBQUEsRUFBa0MsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFFLHNCQUFGLEdBQUE7QUFDaEMsWUFEaUMsS0FBQyxDQUFBLHlCQUFBLHNCQUNsQyxDQUFBO0FBQUEsWUFBQSxJQUFHLEtBQUMsQ0FBQSxzQkFBRCxJQUFnQyxpQ0FBbkM7cUJBQ0UsS0FBQyxDQUFBLDJCQUFELENBQUEsRUFERjthQUFBLE1BRUssSUFBRywrQkFBSDtxQkFDSCxLQUFDLENBQUEsd0JBQUQsQ0FBQSxFQURHO2FBSDJCO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FkbEM7QUFBQSxRQW9CQSxxQkFBQSxFQUF1QixDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUUsV0FBRixHQUFBO0FBQ3JCLFlBRHNCLEtBQUMsQ0FBQSxjQUFBLFdBQ3ZCLENBQUE7QUFBQSxZQUFBLElBQTBCLEtBQUMsQ0FBQSxRQUEzQjtxQkFBQSxLQUFDLENBQUEsbUJBQUQsQ0FBQSxFQUFBO2FBRHFCO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FwQnZCO0FBQUEsUUF1QkEsK0JBQUEsRUFBaUMsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFFLHFCQUFGLEdBQUE7QUFDL0IsWUFEZ0MsS0FBQyxDQUFBLHdCQUFBLHFCQUNqQyxDQUFBO0FBQUEsWUFBQSxJQUEwQixLQUFDLENBQUEsUUFBM0I7cUJBQUEsS0FBQyxDQUFBLG1CQUFELENBQUEsRUFBQTthQUQrQjtVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBdkJqQztBQUFBLFFBMEJBLHNDQUFBLEVBQXdDLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBRSxnQkFBRixHQUFBO0FBQ3RDLFlBRHVDLEtBQUMsQ0FBQSxtQkFBQSxnQkFDeEMsQ0FBQTtBQUFBLFlBQUEsSUFBNEIsS0FBQyxDQUFBLFFBQTdCO3FCQUFBLEtBQUMsQ0FBQSxxQkFBRCxDQUFBLEVBQUE7YUFEc0M7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQTFCeEM7QUFBQSxRQTZCQSxpQ0FBQSxFQUFtQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUUsdUJBQUYsR0FBQTtBQUNqQyxZQURrQyxLQUFDLENBQUEsMEJBQUEsdUJBQ25DLENBQUE7QUFBQSxZQUFBLElBQW9CLEtBQUMsQ0FBQSxRQUFyQjtxQkFBQSxLQUFDLENBQUEsYUFBRCxDQUFBLEVBQUE7YUFEaUM7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQTdCbkM7QUFBQSxRQWdDQSxzQkFBQSxFQUF3QixDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUUsWUFBRixHQUFBO0FBQ3RCLFlBRHVCLEtBQUMsQ0FBQSxlQUFBLFlBQ3hCLENBQUE7bUJBQUEsS0FBQyxDQUFBLFNBQVMsQ0FBQyxNQUFYLENBQWtCLFVBQWxCLEVBQThCLEtBQUMsQ0FBQSxZQUEvQixFQURzQjtVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBaEN4QjtBQUFBLFFBbUNBLDRCQUFBLEVBQThCLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQSxHQUFBO0FBQUcsWUFBQSxJQUFvQixLQUFDLENBQUEsUUFBckI7cUJBQUEsS0FBQyxDQUFBLGFBQUQsQ0FBQSxFQUFBO2FBQUg7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQW5DOUI7QUFBQSxRQXFDQSxpQkFBQSxFQUFtQixDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUEsR0FBQTtBQUFHLFlBQUEsSUFBb0IsS0FBQyxDQUFBLFFBQXJCO3FCQUFBLEtBQUMsQ0FBQSxhQUFELENBQUEsRUFBQTthQUFIO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FyQ25CO0FBQUEsUUF1Q0Esc0NBQUEsRUFBd0MsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFBLEdBQUE7QUFBRyxZQUFBLElBQW9CLEtBQUMsQ0FBQSxRQUFyQjtxQkFBQSxLQUFDLENBQUEsYUFBRCxDQUFBLEVBQUE7YUFBSDtVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBdkN4QztPQURGLEVBSmU7SUFBQSxDQWxCakIsQ0FBQTs7QUFBQSw2QkFtRUEsZ0JBQUEsR0FBa0IsU0FBQSxHQUFBO0FBQ2hCLE1BQUEsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWCxDQUF3QixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUFHLEtBQUMsQ0FBQSxPQUFELENBQUEsRUFBSDtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXhCLENBQW5CLENBQUEsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLHFCQUFELENBQUEsQ0FEQSxDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEseUJBQUQsQ0FBQSxDQUZBLENBQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxRQUFELEdBQVksSUFIWixDQUFBO0FBQUEsTUFJQSxJQUFDLENBQUEsb0JBQUQsR0FBd0IsSUFBQyxDQUFBLFVBQUQsS0FBZSxJQUFDLENBQUEsd0JBQUQsQ0FBQSxDQUp2QyxDQUFBO2FBV0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxNQUFNLENBQUMsb0JBQVosQ0FBaUMsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUNsRCxVQUFBLEtBQUMsQ0FBQSxlQUFELENBQUEsQ0FBQSxDQUFBO2lCQUNBLEtBQUMsQ0FBQSxtQkFBRCxDQUFBLEVBRmtEO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBakMsQ0FBbkIsRUFaZ0I7SUFBQSxDQW5FbEIsQ0FBQTs7QUFBQSw2QkFxRkEsZ0JBQUEsR0FBa0IsU0FBQSxHQUFBO2FBQ2hCLElBQUMsQ0FBQSxRQUFELEdBQVksTUFESTtJQUFBLENBckZsQixDQUFBOztBQUFBLDZCQW1HQSxTQUFBLEdBQVcsU0FBQSxHQUFBO2FBQUcsSUFBQyxDQUFBLFdBQUQsR0FBZSxDQUFmLElBQW9CLElBQUMsQ0FBQSxZQUFELEdBQWdCLEVBQXZDO0lBQUEsQ0FuR1gsQ0FBQTs7QUFBQSw2QkF5R0EsTUFBQSxHQUFRLFNBQUMsTUFBRCxHQUFBO0FBQ04sTUFBQSxJQUFVLElBQUMsQ0FBQSxRQUFYO0FBQUEsY0FBQSxDQUFBO09BQUE7YUFDQSxrQkFBQyxTQUFTLElBQUMsQ0FBQSx3QkFBRCxDQUFBLENBQVYsQ0FBc0MsQ0FBQyxXQUF2QyxDQUFtRCxJQUFuRCxFQUZNO0lBQUEsQ0F6R1IsQ0FBQTs7QUFBQSw2QkE4R0EsTUFBQSxHQUFRLFNBQUEsR0FBQTtBQUNOLE1BQUEsSUFBQSxDQUFBLElBQWUsQ0FBQSxRQUFmO0FBQUEsY0FBQSxDQUFBO09BQUE7QUFDQSxNQUFBLElBQWMsdUJBQWQ7QUFBQSxjQUFBLENBQUE7T0FEQTthQUVBLElBQUMsQ0FBQSxVQUFVLENBQUMsV0FBWixDQUF3QixJQUF4QixFQUhNO0lBQUEsQ0E5R1IsQ0FBQTs7QUFBQSw2QkFxSEEseUJBQUEsR0FBMkIsU0FBQSxHQUFBO2FBQ3pCLElBQUMsQ0FBQSxTQUFTLENBQUMsTUFBWCxDQUFrQixNQUFsQixFQUEwQixJQUFDLENBQUEsb0JBQTNCLEVBRHlCO0lBQUEsQ0FySDNCLENBQUE7O0FBQUEsNkJBeUhBLE9BQUEsR0FBUyxTQUFBLEdBQUE7QUFDUCxNQUFBLElBQUMsQ0FBQSxhQUFhLENBQUMsT0FBZixDQUFBLENBQUEsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLE1BQUQsQ0FBQSxDQURBLENBQUE7YUFFQSxJQUFDLENBQUEsT0FBRCxHQUFXLEtBSEo7SUFBQSxDQXpIVCxDQUFBOztBQUFBLDZCQXdJQSxpQkFBQSxHQUFtQixTQUFBLEdBQUE7QUFDakIsVUFBQSx3REFBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLGdCQUFELENBQUEsQ0FBQSxDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsVUFBRCxHQUFjLElBQUMsQ0FBQSxnQkFBRCxDQUFBLENBRmQsQ0FBQTtBQUFBLE1BSUEsSUFBQyxDQUFBLFVBQVUsQ0FBQyxXQUFaLENBQXdCLElBQUMsQ0FBQSxNQUF6QixDQUpBLENBQUE7QUFBQSxNQU1BLElBQUMsQ0FBQSxXQUFELEdBQWUsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsS0FBdkIsQ0FOZixDQUFBO0FBQUEsTUFPQSxJQUFDLENBQUEsV0FBVyxDQUFDLFNBQVMsQ0FBQyxHQUF2QixDQUEyQixzQkFBM0IsQ0FQQSxDQUFBO0FBQUEsTUFRQSxJQUFDLENBQUEsVUFBVSxDQUFDLFdBQVosQ0FBd0IsSUFBQyxDQUFBLFdBQXpCLENBUkEsQ0FBQTtBQUFBLE1BVUEsSUFBQyxDQUFBLFFBQUQsR0FBWSxRQUFRLENBQUMsYUFBVCxDQUF1QixLQUF2QixDQVZaLENBQUE7QUFBQSxNQVdBLElBQUMsQ0FBQSxRQUFRLENBQUMsU0FBUyxDQUFDLEdBQXBCLENBQXdCLGtCQUF4QixDQVhBLENBQUE7QUFBQSxNQVlBLElBQUMsQ0FBQSxVQUFVLENBQUMsV0FBWixDQUF3QixJQUFDLENBQUEsUUFBekIsQ0FaQSxDQUFBO0FBQUEsTUFjQSxpQkFBQSxHQUFvQixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxDQUFELEdBQUE7aUJBQU8sS0FBQyxDQUFBLG9CQUFELENBQXNCLENBQXRCLEVBQVA7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQWRwQixDQUFBO0FBQUEsTUFlQSxlQUFBLEdBQWtCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLENBQUQsR0FBQTtpQkFBTyxLQUFDLENBQUEsc0JBQUQsQ0FBd0IsQ0FBeEIsRUFBUDtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBZmxCLENBQUE7QUFBQSxNQWdCQSxvQkFBQSxHQUF1QixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxDQUFELEdBQUE7aUJBQU8sS0FBQyxDQUFBLFNBQUQsQ0FBVyxDQUFYLEVBQVA7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQWhCdkIsQ0FBQTtBQUFBLE1Ba0JBLElBQUMsQ0FBQSxnQkFBRCxDQUFrQixZQUFsQixFQUFnQyxpQkFBaEMsQ0FsQkEsQ0FBQTtBQUFBLE1BbUJBLElBQUMsQ0FBQSxNQUFNLENBQUMsZ0JBQVIsQ0FBeUIsV0FBekIsRUFBc0MsZUFBdEMsQ0FuQkEsQ0FBQTtBQUFBLE1Bb0JBLElBQUMsQ0FBQSxXQUFXLENBQUMsZ0JBQWIsQ0FBOEIsV0FBOUIsRUFBMkMsb0JBQTNDLENBcEJBLENBQUE7QUFBQSxNQXFCQSxJQUFDLENBQUEsV0FBVyxDQUFDLGdCQUFiLENBQThCLFlBQTlCLEVBQTRDLG9CQUE1QyxDQXJCQSxDQUFBO2FBdUJBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUF1QixJQUFBLFVBQUEsQ0FBVyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO0FBQ2hDLFVBQUEsS0FBQyxDQUFBLG1CQUFELENBQXFCLFlBQXJCLEVBQW1DLGlCQUFuQyxDQUFBLENBQUE7QUFBQSxVQUNBLEtBQUMsQ0FBQSxNQUFNLENBQUMsbUJBQVIsQ0FBNEIsV0FBNUIsRUFBeUMsZUFBekMsQ0FEQSxDQUFBO0FBQUEsVUFFQSxLQUFDLENBQUEsV0FBVyxDQUFDLG1CQUFiLENBQWlDLFdBQWpDLEVBQThDLG9CQUE5QyxDQUZBLENBQUE7aUJBR0EsS0FBQyxDQUFBLFdBQVcsQ0FBQyxtQkFBYixDQUFpQyxZQUFqQyxFQUErQyxvQkFBL0MsRUFKZ0M7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFYLENBQXZCLEVBeEJpQjtJQUFBLENBeEluQixDQUFBOztBQUFBLDZCQXdLQSx5QkFBQSxHQUEyQixTQUFBLEdBQUE7QUFDekIsTUFBQSxJQUFDLENBQUEsZUFBRCxHQUFtQixRQUFRLENBQUMsYUFBVCxDQUF1QixLQUF2QixDQUFuQixDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsZUFBZSxDQUFDLFNBQVMsQ0FBQyxHQUEzQixDQUErQiwwQkFBL0IsQ0FEQSxDQUFBO2FBRUEsSUFBQyxDQUFBLFFBQVEsQ0FBQyxXQUFWLENBQXNCLElBQUMsQ0FBQSxlQUF2QixFQUh5QjtJQUFBLENBeEszQixDQUFBOztBQUFBLDZCQStLQSxzQkFBQSxHQUF3QixTQUFBLEdBQUE7QUFDdEIsTUFBQSxJQUFDLENBQUEsUUFBUSxDQUFDLFdBQVYsQ0FBc0IsSUFBQyxDQUFBLGVBQXZCLENBQUEsQ0FBQTthQUNBLElBQUMsQ0FBQSxlQUFELEdBQW1CLE9BRkc7SUFBQSxDQS9LeEIsQ0FBQTs7QUFBQSw2QkFxTEEsMkJBQUEsR0FBNkIsU0FBQSxHQUFBO0FBQzNCLE1BQUEsSUFBVSw4QkFBVjtBQUFBLGNBQUEsQ0FBQTtPQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsaUJBQUQsR0FBcUIsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsS0FBdkIsQ0FGckIsQ0FBQTtBQUFBLE1BR0EsSUFBQyxDQUFBLGlCQUFpQixDQUFDLFNBQVMsQ0FBQyxHQUE3QixDQUFpQyw2QkFBakMsQ0FIQSxDQUFBO0FBQUEsTUFJQSxJQUFDLENBQUEsUUFBUSxDQUFDLFdBQVYsQ0FBc0IsSUFBQyxDQUFBLGlCQUF2QixDQUpBLENBQUE7YUFLQSxJQUFDLENBQUEsNEJBQUQsR0FBZ0MsSUFBQyxDQUFBLFdBQUQsQ0FBYSxJQUFDLENBQUEsaUJBQWQsRUFDOUI7QUFBQSxRQUFBLFdBQUEsRUFBYSxDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUMsQ0FBRCxHQUFBO0FBQ1gsZ0JBQUEsdUJBQUE7QUFBQSxZQUFBLENBQUMsQ0FBQyxjQUFGLENBQUEsQ0FBQSxDQUFBO0FBQUEsWUFDQSxDQUFDLENBQUMsZUFBRixDQUFBLENBREEsQ0FBQTtBQUdBLFlBQUEsSUFBRyxrQ0FBSDtBQUNFLGNBQUEsS0FBQyxDQUFBLG9CQUFvQixDQUFDLE9BQXRCLENBQUEsQ0FBQSxDQUFBO3FCQUNBLEtBQUMsQ0FBQSx5QkFBeUIsQ0FBQyxPQUEzQixDQUFBLEVBRkY7YUFBQSxNQUFBOztnQkFJRSw4QkFBK0IsT0FBQSxDQUFRLGtDQUFSO2VBQS9CO0FBQUEsY0FDQSxLQUFDLENBQUEsb0JBQUQsR0FBd0IsR0FBQSxDQUFBLDJCQUR4QixDQUFBO0FBQUEsY0FFQSxLQUFDLENBQUEsb0JBQW9CLENBQUMsUUFBdEIsQ0FBK0IsS0FBL0IsQ0FGQSxDQUFBO0FBQUEsY0FHQSxLQUFDLENBQUEseUJBQUQsR0FBNkIsS0FBQyxDQUFBLG9CQUFvQixDQUFDLFlBQXRCLENBQW1DLFNBQUEsR0FBQTt1QkFDOUQsS0FBQyxDQUFBLG9CQUFELEdBQXdCLEtBRHNDO2NBQUEsQ0FBbkMsQ0FIN0IsQ0FBQTtBQUFBLGNBTUEsUUFBcUIsS0FBQyxDQUFBLE1BQU0sQ0FBQyxxQkFBUixDQUFBLENBQXJCLEVBQUMsWUFBQSxHQUFELEVBQU0sYUFBQSxJQUFOLEVBQVksY0FBQSxLQU5aLENBQUE7QUFBQSxjQU9BLEtBQUMsQ0FBQSxvQkFBb0IsQ0FBQyxLQUFLLENBQUMsR0FBNUIsR0FBa0MsR0FBQSxHQUFNLElBUHhDLENBQUE7QUFBQSxjQVFBLEtBQUMsQ0FBQSxvQkFBb0IsQ0FBQyxNQUF0QixDQUFBLENBUkEsQ0FBQTtBQVVBLGNBQUEsSUFBRyxLQUFDLENBQUEsb0JBQUo7dUJBQ0UsS0FBQyxDQUFBLG9CQUFvQixDQUFDLEtBQUssQ0FBQyxJQUE1QixHQUFvQyxLQUFELEdBQVUsS0FEL0M7ZUFBQSxNQUFBO3VCQUdFLEtBQUMsQ0FBQSxvQkFBb0IsQ0FBQyxLQUFLLENBQUMsSUFBNUIsR0FBbUMsQ0FBQyxJQUFBLEdBQU8sS0FBQyxDQUFBLG9CQUFvQixDQUFDLFdBQTlCLENBQUEsR0FBNkMsS0FIbEY7ZUFkRjthQUpXO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBYjtPQUQ4QixFQU5MO0lBQUEsQ0FyTDdCLENBQUE7O0FBQUEsNkJBcU5BLHdCQUFBLEdBQTBCLFNBQUEsR0FBQTtBQUN4QixNQUFBLElBQWMsOEJBQWQ7QUFBQSxjQUFBLENBQUE7T0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLFFBQVEsQ0FBQyxXQUFWLENBQXNCLElBQUMsQ0FBQSxpQkFBdkIsQ0FEQSxDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsNEJBQTRCLENBQUMsT0FBOUIsQ0FBQSxDQUZBLENBQUE7YUFHQSxJQUFDLENBQUEsaUJBQUQsR0FBcUIsT0FKRztJQUFBLENBck4xQixDQUFBOztBQUFBLDZCQThOQSxhQUFBLEdBQWUsU0FBQSxHQUFBO2FBQUcsSUFBQyxDQUFBLE9BQU8sQ0FBQyxhQUFULENBQUEsRUFBSDtJQUFBLENBOU5mLENBQUE7O0FBQUEsNkJBbU9BLG9CQUFBLEdBQXNCLFNBQUEsR0FBQTswQ0FDcEIsSUFBQyxDQUFBLGdCQUFELElBQUMsQ0FBQSxnQkFBaUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQW1CLElBQUMsQ0FBQSxhQUFELENBQUEsQ0FBbkIsRUFERTtJQUFBLENBbk90QixDQUFBOztBQUFBLDZCQTJPQSx3QkFBQSxHQUEwQixTQUFBLEdBQUE7QUFDeEIsVUFBQSxvQkFBQTtBQUFBLE1BQUEsYUFBQSxHQUFnQixJQUFDLENBQUEsb0JBQUQsQ0FBQSxDQUFoQixDQUFBO2tFQUUyQixjQUhIO0lBQUEsQ0EzTzFCLENBQUE7O0FBQUEsNkJBb1BBLGVBQUEsR0FBaUIsU0FBQyxVQUFELEdBQUE7QUFDZixNQUFBLElBQUcsVUFBSDtlQUNFLElBQUMsQ0FBQSx3QkFBRCxDQUFBLEVBREY7T0FBQSxNQUFBO2VBR0UsSUFBQyxDQUFBLG9CQUFELENBQUEsRUFIRjtPQURlO0lBQUEsQ0FwUGpCLENBQUE7O0FBQUEsNkJBcVFBLFFBQUEsR0FBVSxTQUFBLEdBQUE7YUFBRyxJQUFDLENBQUEsUUFBSjtJQUFBLENBclFWLENBQUE7O0FBQUEsNkJBMFFBLFFBQUEsR0FBVSxTQUFFLE9BQUYsR0FBQTtBQUNSLE1BRFMsSUFBQyxDQUFBLFVBQUEsT0FDVixDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBQyxDQUFBLE9BQU8sQ0FBQyxvQkFBVCxDQUE4QixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUFHLEtBQUMsQ0FBQSxhQUFELENBQUEsRUFBSDtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTlCLENBQW5CLENBQUEsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUMsQ0FBQSxPQUFPLENBQUMscUJBQVQsQ0FBK0IsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFBRyxLQUFDLENBQUEsYUFBRCxDQUFBLEVBQUg7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUEvQixDQUFuQixDQURBLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFDLENBQUEsT0FBTyxDQUFDLFlBQVQsQ0FBc0IsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFBRyxLQUFDLENBQUEsT0FBRCxDQUFBLEVBQUg7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF0QixDQUFuQixDQUZBLENBQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFDLENBQUEsT0FBTyxDQUFDLGlCQUFULENBQTJCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7QUFDNUMsVUFBQSxJQUEwQixLQUFDLENBQUEsUUFBM0I7bUJBQUEsS0FBQyxDQUFBLG1CQUFELENBQUEsRUFBQTtXQUQ0QztRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTNCLENBQW5CLENBSEEsQ0FBQTtBQUFBLE1BS0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUMsQ0FBQSxPQUFPLENBQUMscUJBQVQsQ0FBK0IsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUNoRCxVQUFBLElBQUcsS0FBQyxDQUFBLE9BQU8sQ0FBQyxZQUFULENBQUEsQ0FBSDtBQUNFLFlBQUEsS0FBQyxDQUFBLFlBQUQsQ0FBYyxhQUFkLEVBQTZCLElBQTdCLENBQUEsQ0FERjtXQUFBLE1BQUE7QUFHRSxZQUFBLEtBQUMsQ0FBQSxlQUFELENBQWlCLGFBQWpCLENBQUEsQ0FIRjtXQUFBO2lCQUlBLEtBQUMsQ0FBQSxhQUFELENBQUEsRUFMZ0Q7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUEvQixDQUFuQixDQUxBLENBQUE7QUFBQSxNQVdBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFDLENBQUEsT0FBTyxDQUFDLFdBQVQsQ0FBcUIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsTUFBRCxHQUFBO0FBQ3RDLFVBQUEsS0FBQyxDQUFBLGNBQWMsQ0FBQyxJQUFoQixDQUFxQixNQUFyQixDQUFBLENBQUE7aUJBQ0EsS0FBQyxDQUFBLGFBQUQsQ0FBQSxFQUZzQztRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXJCLENBQW5CLENBWEEsQ0FBQTtBQWVBLE1BQUEsSUFBc0MsSUFBQyxDQUFBLE9BQU8sQ0FBQyxZQUFULENBQUEsQ0FBdEM7QUFBQSxRQUFBLElBQUMsQ0FBQSxZQUFELENBQWMsYUFBZCxFQUE2QixJQUE3QixDQUFBLENBQUE7T0FmQTtBQWdCQSxNQUFBLElBQXFELG9CQUFBLElBQVkscUJBQWpFO0FBQUEsUUFBQSxJQUFDLENBQUEsT0FBTyxDQUFDLHVCQUFULENBQWlDLElBQUMsQ0FBQSxNQUFsQyxFQUEwQyxJQUFDLENBQUEsS0FBM0MsQ0FBQSxDQUFBO09BaEJBO2FBa0JBLElBQUMsQ0FBQSxRQW5CTztJQUFBLENBMVFWLENBQUE7O0FBQUEsNkJBd1NBLGFBQUEsR0FBZSxTQUFBLEdBQUE7QUFDYixNQUFBLElBQVUsSUFBQyxDQUFBLGNBQVg7QUFBQSxjQUFBLENBQUE7T0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLGNBQUQsR0FBa0IsSUFGbEIsQ0FBQTthQUdBLHFCQUFBLENBQXNCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7QUFDcEIsVUFBQSxLQUFDLENBQUEsTUFBRCxDQUFBLENBQUEsQ0FBQTtpQkFDQSxLQUFDLENBQUEsY0FBRCxHQUFrQixNQUZFO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBdEIsRUFKYTtJQUFBLENBeFNmLENBQUE7O0FBQUEsNkJBa1RBLG1CQUFBLEdBQXFCLFNBQUEsR0FBQTtBQUNuQixNQUFBLElBQUMsQ0FBQSxpQkFBRCxHQUFxQixJQUFyQixDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsZ0JBQUQsR0FBb0IsSUFEcEIsQ0FBQTthQUVBLElBQUMsQ0FBQSxhQUFELENBQUEsRUFIbUI7SUFBQSxDQWxUckIsQ0FBQTs7QUFBQSw2QkF3VEEsTUFBQSxHQUFRLFNBQUEsR0FBQTtBQUNOLFVBQUEsZ0lBQUE7QUFBQSxNQUFBLElBQUEsQ0FBQSxDQUFjLElBQUMsQ0FBQSxRQUFELElBQWMsSUFBQyxDQUFBLFNBQUQsQ0FBQSxDQUFkLElBQStCLHNCQUE3QyxDQUFBO0FBQUEsY0FBQSxDQUFBO09BQUE7QUFFQSxNQUFBLElBQUcsSUFBQyxDQUFBLGdCQUFELElBQXNCLDBCQUF6QjtBQUNFLFFBQUEsSUFBQyxDQUFBLEtBQUssQ0FBQyxXQUFQLEdBQXFCLElBQUMsQ0FBQSxXQUFELEdBQWUsSUFBcEMsQ0FERjtPQUFBLE1BQUE7QUFHRSxRQUFBLElBQUMsQ0FBQSxLQUFLLENBQUMsV0FBUCxHQUFxQixJQUFyQixDQUhGO09BRkE7QUFBQSxNQU9BLGVBQUEsR0FBa0IsSUFBQyxDQUFBLE9BQU8sQ0FBQyw2QkFBVCxDQUFBLENBUGxCLENBQUE7QUFBQSxNQVFBLGNBQUEsR0FBaUIsSUFBQyxDQUFBLE9BQU8sQ0FBQyw0QkFBVCxDQUFBLENBQUEsR0FBMEMsSUFBQyxDQUFBLE9BQU8sQ0FBQyxZQUFULENBQUEsQ0FSM0QsQ0FBQTtBQUFBLE1BU0EsWUFBQSxHQUFlLElBQUksQ0FBQyxHQUFMLENBQVMsSUFBQyxDQUFBLE1BQU0sQ0FBQyxLQUFSLEdBQWdCLGdCQUF6QixFQUEyQyxJQUFDLENBQUEsS0FBNUMsQ0FUZixDQUFBO0FBQUEsTUFXQSxJQUFDLENBQUEsV0FBRCxDQUFhLElBQUMsQ0FBQSxXQUFkLEVBQ0U7QUFBQSxRQUFBLEtBQUEsRUFBTyxZQUFBLEdBQWUsSUFBdEI7QUFBQSxRQUNBLE1BQUEsRUFBUSxJQUFDLENBQUEsT0FBTyxDQUFDLHlCQUFULENBQUEsQ0FBQSxHQUF1QyxJQUQvQztBQUFBLFFBRUEsU0FBQSxFQUFXLElBQUMsQ0FBQSxhQUFELENBQWUsZUFBZixFQUFnQyxjQUFoQyxDQUZYO09BREYsQ0FYQSxDQUFBO0FBQUEsTUFnQkEsSUFBQyxDQUFBLFdBQUQsQ0FBYSxJQUFDLENBQUEsUUFBZCxFQUNFO0FBQUEsUUFBQSxLQUFBLEVBQU8sWUFBQSxHQUFlLElBQXRCO09BREYsQ0FoQkEsQ0FBQTtBQUFBLE1BbUJBLFNBQUEsR0FBWSxJQUFDLENBQUEsT0FBTyxDQUFDLHdCQUFULENBQUEsQ0FBQSxHQUFzQyxJQUFDLENBQUEsT0FBTyxDQUFDLGFBQVQsQ0FBQSxDQUF0QyxHQUFpRSxJQUFDLENBQUEsT0FBTyxDQUFDLFlBQVQsQ0FBQSxDQW5CN0UsQ0FBQTtBQUFBLE1BcUJBLGVBQUEsR0FBa0IsSUFBQyxDQUFBLGFBQUQsQ0FBZSxDQUFmLEVBQWtCLFNBQWxCLENBckJsQixDQUFBO0FBc0JBLE1BQUEsSUFBNkQsZ0JBQUEsS0FBc0IsQ0FBbkY7QUFBQSxRQUFBLGVBQUEsSUFBbUIsR0FBQSxHQUFNLElBQUMsQ0FBQSxTQUFELENBQVcsQ0FBQSxHQUFJLGdCQUFmLENBQXpCLENBQUE7T0F0QkE7QUFBQSxNQXVCQSxJQUFDLENBQUEsV0FBRCxDQUFhLElBQUMsQ0FBQSxNQUFkLEVBQXNCO0FBQUEsUUFBQSxTQUFBLEVBQVcsZUFBWDtPQUF0QixDQXZCQSxDQUFBO0FBeUJBLE1BQUEsSUFBRyxJQUFDLENBQUEsc0JBQUQsSUFBNEIsSUFBQyxDQUFBLE9BQU8sQ0FBQyxTQUFULENBQUEsQ0FBNUIsSUFBcUQsQ0FBQSxJQUFLLENBQUEsZUFBN0Q7QUFDRSxRQUFBLElBQUMsQ0FBQSx5QkFBRCxDQUFBLENBQUEsQ0FERjtPQXpCQTtBQTRCQSxNQUFBLElBQUcsNEJBQUg7QUFDRSxRQUFBLG1CQUFBLEdBQXNCLElBQUMsQ0FBQSxPQUFPLENBQUMsZUFBVCxDQUFBLENBQXRCLENBQUE7QUFBQSxRQUNBLGVBQUEsR0FBa0IsbUJBQUEsR0FBc0IsQ0FBQyxtQkFBQSxHQUFzQixJQUFDLENBQUEsT0FBTyxDQUFDLFNBQVQsQ0FBQSxDQUF2QixDQUR4QyxDQUFBO0FBQUEsUUFFQSxlQUFBLEdBQWtCLENBQUMsbUJBQUEsR0FBc0IsZUFBdkIsQ0FBQSxHQUEwQyxJQUFDLENBQUEsT0FBTyxDQUFDLDZCQUFULENBQUEsQ0FGNUQsQ0FBQTtBQUFBLFFBSUEsSUFBQyxDQUFBLFdBQUQsQ0FBYSxJQUFDLENBQUEsZUFBZCxFQUNFO0FBQUEsVUFBQSxNQUFBLEVBQVEsZUFBQSxHQUFrQixJQUExQjtBQUFBLFVBQ0EsU0FBQSxFQUFXLElBQUMsQ0FBQSxhQUFELENBQWUsQ0FBZixFQUFrQixlQUFsQixDQURYO1NBREYsQ0FKQSxDQUFBO0FBUUEsUUFBQSxJQUE2QixDQUFBLElBQUssQ0FBQSxPQUFPLENBQUMsU0FBVCxDQUFBLENBQWpDO0FBQUEsVUFBQSxJQUFDLENBQUEsc0JBQUQsQ0FBQSxDQUFBLENBQUE7U0FURjtPQTVCQTthQXVDQSxJQUFDLENBQUEsWUFBRCxDQUFBLEVBeENNO0lBQUEsQ0F4VFIsQ0FBQTs7QUFBQSw2QkFxV0Esd0JBQUEsR0FBMEIsU0FBRSxxQkFBRixHQUFBO0FBQ3hCLE1BRHlCLElBQUMsQ0FBQSx3QkFBQSxxQkFDMUIsQ0FBQTtBQUFBLE1BQUEsSUFBMEIsSUFBQyxDQUFBLFFBQTNCO2VBQUEsSUFBQyxDQUFBLG1CQUFELENBQUEsRUFBQTtPQUR3QjtJQUFBLENBclcxQixDQUFBOztBQUFBLDZCQXlXQSxPQUFBLEdBQVMsU0FBQSxHQUFBO0FBQ1AsVUFBQSxpQkFBQTtBQUFBLE1BQUEsaUJBQUEsR0FBb0IsSUFBQyxDQUFBLHdCQUFELENBQUEsQ0FBcEIsQ0FBQTtBQUNBLE1BQUEsSUFBRyxJQUFDLENBQUEsU0FBRCxDQUFBLENBQUg7QUFDRSxRQUFBLElBQUEsQ0FBQSxJQUErQixDQUFBLFVBQS9CO0FBQUEsVUFBQSxJQUFDLENBQUEsbUJBQUQsQ0FBQSxDQUFBLENBQUE7U0FBQTtlQUVBLElBQUMsQ0FBQSxxQkFBRCxDQUF1QixpQkFBdkIsRUFBMEMsS0FBMUMsRUFIRjtPQUZPO0lBQUEsQ0F6V1QsQ0FBQTs7QUFBQSw2QkFxWEEsd0JBQUEsR0FBMEIsU0FBQSxHQUFBO0FBQ3hCLE1BQUEsSUFBRyxJQUFDLENBQUEsU0FBRCxDQUFBLENBQUg7QUFDRSxRQUFBLElBQUcsSUFBQyxDQUFBLFVBQUo7aUJBQ0UsTUFERjtTQUFBLE1BQUE7aUJBR0UsSUFBQyxDQUFBLFVBQUQsR0FBYyxLQUhoQjtTQURGO09BQUEsTUFBQTtBQU1FLFFBQUEsSUFBRyxJQUFDLENBQUEsVUFBSjtBQUNFLFVBQUEsSUFBQyxDQUFBLFVBQUQsR0FBYyxLQUFkLENBQUE7aUJBQ0EsS0FGRjtTQUFBLE1BQUE7aUJBSUUsSUFBQyxDQUFBLFVBQUQsR0FBYyxNQUpoQjtTQU5GO09BRHdCO0lBQUEsQ0FyWDFCLENBQUE7O0FBQUEsNkJBdVlBLHFCQUFBLEdBQXVCLFNBQUMsaUJBQUQsRUFBb0IsV0FBcEIsR0FBQTtBQUNyQixVQUFBLG1GQUFBOztRQUR5QyxjQUFZO09BQ3JEO0FBQUEsTUFBQSxJQUFjLG9CQUFkO0FBQUEsY0FBQSxDQUFBO09BQUE7QUFBQSxNQUVBLFVBQUEsR0FBYSxJQUFDLENBQUEsS0FBRCxLQUFZLElBQUMsQ0FBQSxXQUFiLElBQTRCLElBQUMsQ0FBQSxNQUFELEtBQWEsSUFBQyxDQUFBLFlBRnZELENBQUE7QUFBQSxNQUlBLElBQUMsQ0FBQSxNQUFELEdBQVUsSUFBQyxDQUFBLFlBSlgsQ0FBQTtBQUFBLE1BS0EsSUFBQyxDQUFBLEtBQUQsR0FBUyxJQUFDLENBQUEsV0FMVixDQUFBO0FBQUEsTUFNQSxXQUFBLEdBQWMsSUFBQyxDQUFBLEtBTmYsQ0FBQTtBQVFBLE1BQUEsSUFBcUQsb0JBQXJEO0FBQUEsUUFBQSxJQUFDLENBQUEsT0FBTyxDQUFDLHVCQUFULENBQWlDLElBQUMsQ0FBQSxNQUFsQyxFQUEwQyxJQUFDLENBQUEsS0FBM0MsQ0FBQSxDQUFBO09BUkE7QUFVQSxNQUFBLElBQTBCLFVBQUEsSUFBYyxpQkFBZCxJQUFtQyxXQUE3RDtBQUFBLFFBQUEsSUFBQyxDQUFBLG1CQUFELENBQUEsQ0FBQSxDQUFBO09BVkE7QUFZQSxNQUFBLElBQUEsQ0FBQSxJQUFlLENBQUEsU0FBRCxDQUFBLENBQWQ7QUFBQSxjQUFBLENBQUE7T0FaQTtBQWNBLE1BQUEsSUFBRyxVQUFBLElBQWMsV0FBakI7QUFDRSxRQUFBLElBQUcsSUFBQyxDQUFBLGdCQUFKO0FBQ0UsVUFBQSxVQUFBLEdBQWEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDRCQUFoQixDQUFiLENBQUE7QUFBQSxVQUNBLFFBQUEsR0FBVyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsaUJBQWhCLENBRFgsQ0FBQTtBQUFBLFVBRUEsNkJBQUEsR0FBZ0MsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHNDQUFoQixDQUZoQyxDQUFBO0FBQUEsVUFHQSxLQUFBLEdBQVEsVUFBQSxHQUFhLElBQUMsQ0FBQSxPQUFPLENBQUMsWUFBVCxDQUFBLENBSHJCLENBQUE7QUFLQSxVQUFBLElBQUcsUUFBQSxJQUFhLDZCQUFiLElBQStDLFVBQS9DLElBQThELEtBQUEsR0FBUSxJQUFDLENBQUEsS0FBMUU7QUFDRSxZQUFBLElBQUMsQ0FBQSxXQUFELEdBQWUsS0FBQSxHQUFRLElBQUMsQ0FBQSxLQUF4QixDQUFBO0FBQUEsWUFDQSxXQUFBLEdBQWMsS0FEZCxDQURGO1dBQUEsTUFBQTtBQUlFLFlBQUEsSUFBQyxDQUFBLFdBQUQsR0FBZSxJQUFmLENBSkY7V0FORjtTQUFBLE1BQUE7QUFZRSxVQUFBLE1BQUEsQ0FBQSxJQUFRLENBQUEsV0FBUixDQVpGO1NBQUE7QUFjQSxRQUFBLElBQUcsV0FBQSxLQUFpQixJQUFDLENBQUEsTUFBTSxDQUFDLEtBQXpCLElBQWtDLElBQUMsQ0FBQSxNQUFELEtBQWEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxNQUExRDtBQUNFLFVBQUEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxLQUFSLEdBQWdCLFdBQUEsR0FBYyxnQkFBOUIsQ0FBQTtpQkFDQSxJQUFDLENBQUEsTUFBTSxDQUFDLE1BQVIsR0FBaUIsQ0FBQyxJQUFDLENBQUEsTUFBRCxHQUFVLElBQUMsQ0FBQSxPQUFPLENBQUMsYUFBVCxDQUFBLENBQVgsQ0FBQSxHQUF1QyxpQkFGMUQ7U0FmRjtPQWZxQjtJQUFBLENBdll2QixDQUFBOztBQUFBLDZCQXFiQSxhQUFBLEdBQWUsU0FBQyxPQUFELEdBQUE7QUFDYixVQUFBLDBCQUFBOztRQURjLFVBQVE7T0FDdEI7QUFBQTtXQUFBLGlCQUFBO21DQUFBO0FBQ0Usc0JBQUEsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBWixDQUFvQixNQUFwQixFQUE0QixRQUE1QixDQUFuQixFQUFBLENBREY7QUFBQTtzQkFEYTtJQUFBLENBcmJmLENBQUE7O0FBQUEsNkJBNmJBLHNCQUFBLEdBQXdCLFNBQUMsQ0FBRCxHQUFBO0FBQ3RCLFVBQUEsa0JBQUE7QUFBQSxNQUFBLElBQVUsSUFBQyxDQUFBLE9BQU8sQ0FBQyxZQUFULENBQUEsQ0FBVjtBQUFBLGNBQUEsQ0FBQTtPQUFBO0FBQ0EsTUFBQSxJQUFHLENBQUMsQ0FBQyxLQUFGLEtBQVcsQ0FBZDtlQUNFLElBQUMsQ0FBQSwwQkFBRCxDQUE0QixDQUE1QixFQURGO09BQUEsTUFFSyxJQUFHLENBQUMsQ0FBQyxLQUFGLEtBQVcsQ0FBZDtBQUNILFFBQUEsSUFBQyxDQUFBLDRCQUFELENBQThCLENBQTlCLENBQUEsQ0FBQTtBQUFBLFFBRUEsUUFBZ0IsSUFBQyxDQUFBLFdBQVcsQ0FBQyxxQkFBYixDQUFBLENBQWhCLEVBQUMsWUFBQSxHQUFELEVBQU0sZUFBQSxNQUZOLENBQUE7ZUFHQSxJQUFDLENBQUEsU0FBRCxDQUFXO0FBQUEsVUFBQyxLQUFBLEVBQU8sQ0FBUjtBQUFBLFVBQVcsS0FBQSxFQUFPLEdBQUEsR0FBTSxNQUFBLEdBQU8sQ0FBL0I7U0FBWCxFQUpHO09BQUEsTUFBQTtBQUFBO09BSmlCO0lBQUEsQ0E3YnhCLENBQUE7O0FBQUEsNkJBd2NBLDBCQUFBLEdBQTRCLFNBQUMsSUFBRCxHQUFBO0FBQzFCLFVBQUEsc0VBQUE7QUFBQSxNQUQ0QixhQUFBLE9BQU8sY0FBQSxNQUNuQyxDQUFBO0FBQUEsTUFBQSxDQUFBLEdBQUksS0FBQSxHQUFRLE1BQU0sQ0FBQyxxQkFBUCxDQUFBLENBQThCLENBQUMsR0FBM0MsQ0FBQTtBQUFBLE1BQ0EsR0FBQSxHQUFNLElBQUksQ0FBQyxLQUFMLENBQVcsQ0FBQSxHQUFJLElBQUMsQ0FBQSxPQUFPLENBQUMsYUFBVCxDQUFBLENBQWYsQ0FBQSxHQUEyQyxJQUFDLENBQUEsT0FBTyxDQUFDLHdCQUFULENBQUEsQ0FEakQsQ0FBQTtBQUFBLE1BR0EsVUFBQSxHQUFhLElBQUMsQ0FBQSxPQUFPLENBQUMsYUFBVCxDQUFBLENBSGIsQ0FBQTtBQUFBLE1BS0EsU0FBQSxHQUFZLEdBQUEsR0FBTSxVQUFVLENBQUMscUJBQVgsQ0FBQSxDQUFOLEdBQTJDLElBQUMsQ0FBQSxPQUFPLENBQUMsbUJBQVQsQ0FBQSxDQUFBLEdBQWlDLENBTHhGLENBQUE7QUFPQSxNQUFBLElBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHlCQUFoQixDQUFIO0FBQ0UsUUFBQSxJQUFBLEdBQU8sSUFBQyxDQUFBLE9BQU8sQ0FBQyxzQkFBVCxDQUFBLENBQVAsQ0FBQTtBQUFBLFFBQ0EsRUFBQSxHQUFLLFNBREwsQ0FBQTtBQUFBLFFBRUEsSUFBQSxHQUFPLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQyxHQUFELEdBQUE7bUJBQVMsS0FBQyxDQUFBLE9BQU8sQ0FBQyxzQkFBVCxDQUFnQyxHQUFoQyxFQUFUO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FGUCxDQUFBO0FBQUEsUUFHQSxRQUFBLEdBQVcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLGlDQUFoQixDQUhYLENBQUE7ZUFJQSxJQUFDLENBQUEsT0FBRCxDQUFTO0FBQUEsVUFBQSxJQUFBLEVBQU0sSUFBTjtBQUFBLFVBQVksRUFBQSxFQUFJLEVBQWhCO0FBQUEsVUFBb0IsUUFBQSxFQUFVLFFBQTlCO0FBQUEsVUFBd0MsSUFBQSxFQUFNLElBQTlDO1NBQVQsRUFMRjtPQUFBLE1BQUE7ZUFPRSxJQUFDLENBQUEsT0FBTyxDQUFDLHNCQUFULENBQWdDLFNBQWhDLEVBUEY7T0FSMEI7SUFBQSxDQXhjNUIsQ0FBQTs7QUFBQSw2QkF5ZEEsNEJBQUEsR0FBOEIsU0FBQyxJQUFELEdBQUE7QUFDNUIsVUFBQSwwQkFBQTtBQUFBLE1BRDhCLFFBQUQsS0FBQyxLQUM5QixDQUFBO0FBQUEsTUFBTSxZQUFhLElBQUMsQ0FBQSxxQkFBRCxDQUFBLEVBQWxCLEdBQUQsQ0FBQTtBQUFBLE1BQ0EsQ0FBQSxHQUFJLEtBQUEsR0FBUSxTQUFSLEdBQW9CLElBQUMsQ0FBQSxPQUFPLENBQUMseUJBQVQsQ0FBQSxDQUFBLEdBQXFDLENBRDdELENBQUE7QUFBQSxNQUdBLEtBQUEsR0FBUSxDQUFBLEdBQ04sQ0FBQyxJQUFDLENBQUEsT0FBTyxDQUFDLGdCQUFULENBQUEsQ0FBQSxHQUE4QixJQUFDLENBQUEsT0FBTyxDQUFDLHlCQUFULENBQUEsQ0FBL0IsQ0FKRixDQUFBO2FBTUEsSUFBQyxDQUFBLE9BQU8sQ0FBQyxzQkFBVCxDQUNFLEtBQUEsR0FBUSxJQUFDLENBQUEsT0FBTyxDQUFDLHlCQUFULENBQUEsQ0FEVixFQVA0QjtJQUFBLENBemQ5QixDQUFBOztBQUFBLDZCQXVlQSxvQkFBQSxHQUFzQixTQUFDLENBQUQsR0FBQTtBQUNwQixVQUFBLGFBQUE7QUFBQSxNQUFBLGFBQUEsR0FBZ0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQW1CLElBQUMsQ0FBQSxPQUFPLENBQUMsVUFBNUIsQ0FBaEIsQ0FBQTthQUVBLGFBQWEsQ0FBQyxTQUFTLENBQUMsWUFBeEIsQ0FBcUMsQ0FBckMsRUFIb0I7SUFBQSxDQXZldEIsQ0FBQTs7QUFBQSw2QkF3ZkEsU0FBQSxHQUFXLFNBQUMsQ0FBRCxHQUFBO0FBQ1QsVUFBQSxtRkFBQTtBQUFBLE1BQUMsVUFBQSxLQUFELEVBQVEsVUFBQSxLQUFSLENBQUE7QUFDQSxNQUFBLElBQUEsQ0FBQSxJQUFlLENBQUEsT0FBZjtBQUFBLGNBQUEsQ0FBQTtPQURBO0FBRUEsTUFBQSxJQUFVLEtBQUEsS0FBVyxDQUFYLElBQWlCLEtBQUEsS0FBVyxDQUE1QixJQUFzQyxtQkFBaEQ7QUFBQSxjQUFBLENBQUE7T0FGQTtBQUFBLE1BSUMsTUFBTyxJQUFDLENBQUEsV0FBVyxDQUFDLHFCQUFiLENBQUEsRUFBUCxHQUpELENBQUE7QUFBQSxNQUtNLFlBQWEsSUFBQyxDQUFBLHFCQUFELENBQUEsRUFBbEIsR0FMRCxDQUFBO0FBQUEsTUFPQSxVQUFBLEdBQWEsS0FBQSxHQUFRLEdBUHJCLENBQUE7QUFBQSxNQVNBLE9BQUEsR0FBVTtBQUFBLFFBQUMsWUFBQSxVQUFEO0FBQUEsUUFBYSxXQUFBLFNBQWI7T0FUVixDQUFBO0FBQUEsTUFXQSxnQkFBQSxHQUFtQixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxDQUFELEdBQUE7aUJBQU8sS0FBQyxDQUFBLElBQUQsQ0FBTSxDQUFOLEVBQVMsT0FBVCxFQUFQO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FYbkIsQ0FBQTtBQUFBLE1BWUEsY0FBQSxHQUFpQixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxDQUFELEdBQUE7aUJBQU8sS0FBQyxDQUFBLE9BQUQsQ0FBUyxDQUFULEVBQVksT0FBWixFQUFQO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FaakIsQ0FBQTtBQUFBLE1BY0EsUUFBUSxDQUFDLElBQUksQ0FBQyxnQkFBZCxDQUErQixXQUEvQixFQUE0QyxnQkFBNUMsQ0FkQSxDQUFBO0FBQUEsTUFlQSxRQUFRLENBQUMsSUFBSSxDQUFDLGdCQUFkLENBQStCLFNBQS9CLEVBQTBDLGNBQTFDLENBZkEsQ0FBQTtBQUFBLE1BZ0JBLFFBQVEsQ0FBQyxJQUFJLENBQUMsZ0JBQWQsQ0FBK0IsWUFBL0IsRUFBNkMsY0FBN0MsQ0FoQkEsQ0FBQTtBQUFBLE1Ba0JBLFFBQVEsQ0FBQyxJQUFJLENBQUMsZ0JBQWQsQ0FBK0IsV0FBL0IsRUFBNEMsZ0JBQTVDLENBbEJBLENBQUE7QUFBQSxNQW1CQSxRQUFRLENBQUMsSUFBSSxDQUFDLGdCQUFkLENBQStCLFVBQS9CLEVBQTJDLGNBQTNDLENBbkJBLENBQUE7YUFxQkEsSUFBQyxDQUFBLGdCQUFELEdBQXdCLElBQUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNqQyxRQUFBLFFBQVEsQ0FBQyxJQUFJLENBQUMsbUJBQWQsQ0FBa0MsV0FBbEMsRUFBK0MsZ0JBQS9DLENBQUEsQ0FBQTtBQUFBLFFBQ0EsUUFBUSxDQUFDLElBQUksQ0FBQyxtQkFBZCxDQUFrQyxTQUFsQyxFQUE2QyxjQUE3QyxDQURBLENBQUE7QUFBQSxRQUVBLFFBQVEsQ0FBQyxJQUFJLENBQUMsbUJBQWQsQ0FBa0MsWUFBbEMsRUFBZ0QsY0FBaEQsQ0FGQSxDQUFBO0FBQUEsUUFJQSxRQUFRLENBQUMsSUFBSSxDQUFDLG1CQUFkLENBQWtDLFdBQWxDLEVBQStDLGdCQUEvQyxDQUpBLENBQUE7ZUFLQSxRQUFRLENBQUMsSUFBSSxDQUFDLG1CQUFkLENBQWtDLFVBQWxDLEVBQThDLGNBQTlDLEVBTmlDO01BQUEsQ0FBWCxFQXRCZjtJQUFBLENBeGZYLENBQUE7O0FBQUEsNkJBOGhCQSxJQUFBLEdBQU0sU0FBQyxDQUFELEVBQUksT0FBSixHQUFBO0FBQ0osVUFBQSxRQUFBO0FBQUEsTUFBQSxJQUFBLENBQUEsSUFBZSxDQUFBLE9BQWY7QUFBQSxjQUFBLENBQUE7T0FBQTtBQUNBLE1BQUEsSUFBVSxDQUFDLENBQUMsS0FBRixLQUFhLENBQWIsSUFBbUIsQ0FBQyxDQUFDLEtBQUYsS0FBYSxDQUFoQyxJQUEwQyxtQkFBcEQ7QUFBQSxjQUFBLENBQUE7T0FEQTtBQUFBLE1BRUEsQ0FBQSxHQUFJLENBQUMsQ0FBQyxLQUFGLEdBQVUsT0FBTyxDQUFDLFNBQWxCLEdBQThCLE9BQU8sQ0FBQyxVQUYxQyxDQUFBO0FBQUEsTUFJQSxLQUFBLEdBQVEsQ0FBQSxHQUFJLENBQUMsSUFBQyxDQUFBLE9BQU8sQ0FBQyxnQkFBVCxDQUFBLENBQUEsR0FBOEIsSUFBQyxDQUFBLE9BQU8sQ0FBQyx5QkFBVCxDQUFBLENBQS9CLENBSlosQ0FBQTthQU1BLElBQUMsQ0FBQSxPQUFPLENBQUMsc0JBQVQsQ0FBZ0MsS0FBQSxHQUFRLElBQUMsQ0FBQSxPQUFPLENBQUMseUJBQVQsQ0FBQSxDQUF4QyxFQVBJO0lBQUEsQ0E5aEJOLENBQUE7O0FBQUEsNkJBK2lCQSxPQUFBLEdBQVMsU0FBQyxDQUFELEVBQUksT0FBSixHQUFBO0FBQ1AsTUFBQSxJQUFBLENBQUEsSUFBZSxDQUFBLE9BQWY7QUFBQSxjQUFBLENBQUE7T0FBQTthQUNBLElBQUMsQ0FBQSxnQkFBZ0IsQ0FBQyxPQUFsQixDQUFBLEVBRk87SUFBQSxDQS9pQlQsQ0FBQTs7QUFBQSw2QkFna0JBLFdBQUEsR0FBYSxTQUFDLE9BQUQsRUFBVSxNQUFWLEdBQUE7QUFDWCxVQUFBLHdCQUFBO0FBQUEsTUFBQSxPQUFBLEdBQVUsRUFBVixDQUFBO0FBRUEsV0FBQSxrQkFBQTtpQ0FBQTtBQUNFLFFBQUEsT0FBQSxJQUFXLEVBQUEsR0FBRyxRQUFILEdBQVksSUFBWixHQUFnQixLQUFoQixHQUFzQixJQUFqQyxDQURGO0FBQUEsT0FGQTthQUtBLE9BQU8sQ0FBQyxLQUFLLENBQUMsT0FBZCxHQUF3QixRQU5iO0lBQUEsQ0Foa0JiLENBQUE7O0FBQUEsNkJBOGtCQSxhQUFBLEdBQWUsU0FBQyxDQUFELEVBQUssQ0FBTCxHQUFBOztRQUFDLElBQUU7T0FDaEI7O1FBRGtCLElBQUU7T0FDcEI7QUFBQSxNQUFBLElBQUcsSUFBQyxDQUFBLHVCQUFKO2VBQ0csY0FBQSxHQUFjLENBQWQsR0FBZ0IsTUFBaEIsR0FBc0IsQ0FBdEIsR0FBd0IsU0FEM0I7T0FBQSxNQUFBO2VBR0csWUFBQSxHQUFZLENBQVosR0FBYyxNQUFkLEdBQW9CLENBQXBCLEdBQXNCLE1BSHpCO09BRGE7SUFBQSxDQTlrQmYsQ0FBQTs7QUFBQSw2QkEwbEJBLFNBQUEsR0FBVyxTQUFDLENBQUQsRUFBSyxDQUFMLEdBQUE7O1FBQUMsSUFBRTtPQUNaOztRQURjLElBQUU7T0FDaEI7QUFBQSxNQUFBLElBQUcsSUFBQyxDQUFBLHVCQUFKO2VBQ0csVUFBQSxHQUFVLENBQVYsR0FBWSxJQUFaLEdBQWdCLENBQWhCLEdBQWtCLE9BRHJCO09BQUEsTUFBQTtlQUdHLFFBQUEsR0FBUSxDQUFSLEdBQVUsSUFBVixHQUFjLENBQWQsR0FBZ0IsSUFIbkI7T0FEUztJQUFBLENBMWxCWCxDQUFBOztBQUFBLDZCQXFtQkEsT0FBQSxHQUFTLFNBQUEsR0FBQTthQUFPLElBQUEsSUFBQSxDQUFBLEVBQVA7SUFBQSxDQXJtQlQsQ0FBQTs7QUFBQSw2QkFpbkJBLE9BQUEsR0FBUyxTQUFDLElBQUQsR0FBQTtBQUNQLFVBQUEsOENBQUE7QUFBQSxNQURTLFlBQUEsTUFBTSxVQUFBLElBQUksZ0JBQUEsVUFBVSxZQUFBLElBQzdCLENBQUE7QUFBQSxNQUFBLEtBQUEsR0FBUSxJQUFDLENBQUEsT0FBRCxDQUFBLENBQVIsQ0FBQTtBQUFBLE1BRUEsS0FBQSxHQUFRLFNBQUMsUUFBRCxHQUFBO0FBQ04sZUFBTyxHQUFBLEdBQU0sSUFBSSxDQUFDLEdBQUwsQ0FBVSxRQUFBLEdBQVcsSUFBSSxDQUFDLEVBQTFCLENBQUEsR0FBaUMsQ0FBOUMsQ0FETTtNQUFBLENBRlIsQ0FBQTtBQUFBLE1BS0EsTUFBQSxHQUFTLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7QUFDUCxjQUFBLHVCQUFBO0FBQUEsVUFBQSxNQUFBLEdBQVMsS0FBQyxDQUFBLE9BQUQsQ0FBQSxDQUFBLEdBQWEsS0FBdEIsQ0FBQTtBQUNBLFVBQUEsSUFBRyxRQUFBLEtBQVksQ0FBZjtBQUNFLFlBQUEsUUFBQSxHQUFXLENBQVgsQ0FERjtXQUFBLE1BQUE7QUFHRSxZQUFBLFFBQUEsR0FBVyxNQUFBLEdBQVMsUUFBcEIsQ0FIRjtXQURBO0FBS0EsVUFBQSxJQUFnQixRQUFBLEdBQVcsQ0FBM0I7QUFBQSxZQUFBLFFBQUEsR0FBVyxDQUFYLENBQUE7V0FMQTtBQUFBLFVBTUEsS0FBQSxHQUFRLEtBQUEsQ0FBTSxRQUFOLENBTlIsQ0FBQTtBQUFBLFVBT0EsSUFBQSxDQUFLLElBQUEsR0FBTyxDQUFDLEVBQUEsR0FBRyxJQUFKLENBQUEsR0FBVSxLQUF0QixDQVBBLENBQUE7QUFTQSxVQUFBLElBQUcsUUFBQSxHQUFXLENBQWQ7bUJBQ0UscUJBQUEsQ0FBc0IsTUFBdEIsRUFERjtXQVZPO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FMVCxDQUFBO2FBa0JBLE1BQUEsQ0FBQSxFQW5CTztJQUFBLENBam5CVCxDQUFBOzswQkFBQTs7S0FEMkIsWUFwQjdCLENBQUE7O0FBQUEsRUFtcUJBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLGNBQUEsR0FBaUIsUUFBUSxDQUFDLGVBQVQsQ0FBeUIsMEJBQXpCLEVBQXFEO0FBQUEsSUFBQSxTQUFBLEVBQVcsY0FBYyxDQUFDLFNBQTFCO0dBQXJELENBbnFCbEMsQ0FBQTs7QUFBQSxFQXlxQkEsY0FBYyxDQUFDLG9CQUFmLEdBQXNDLFNBQUEsR0FBQTtXQUNwQyxJQUFJLENBQUMsS0FBSyxDQUFDLGVBQVgsQ0FBMkIsT0FBQSxDQUFRLFdBQVIsQ0FBM0IsRUFBaUQsU0FBQyxLQUFELEdBQUE7QUFDL0MsVUFBQSxPQUFBO0FBQUEsTUFBQSxPQUFBLEdBQVUsR0FBQSxDQUFBLGNBQVYsQ0FBQTtBQUFBLE1BQ0EsT0FBTyxDQUFDLFFBQVIsQ0FBaUIsS0FBakIsQ0FEQSxDQUFBO2FBRUEsUUFIK0M7SUFBQSxDQUFqRCxFQURvQztFQUFBLENBenFCdEMsQ0FBQTtBQUFBIgp9

//# sourceURL=/home/cin_chalic/.atom/packages/minimap/lib/minimap-element.coffee
