(function() {
  var ConfigView,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  ConfigView = (function(_super) {
    __extends(ConfigView, _super);

    function ConfigView() {
      return ConfigView.__super__.constructor.apply(this, arguments);
    }

    ConfigView.prototype.createdCallback = function() {
      var container;
      this.classList.add('atom-ternjs-config');
      container = document.createElement('div');
      this.content = document.createElement('div');
      this.content.classList.add('content');
      this.close = document.createElement('button');
      this.close.classList.add('btn', 'atom-ternjs-config-close');
      this.close.innerHTML = 'Save & Restart Server';
      this.cancel = document.createElement('button');
      this.cancel.classList.add('btn', 'atom-ternjs-config-close');
      this.cancel.innerHTML = 'Cancel';
      container.appendChild(this.content);
      return this.appendChild(container);
    };

    ConfigView.prototype.initialize = function(model) {
      this.setModel(model);
      return this;
    };

    ConfigView.prototype.buildOptionsMarkup = function(manager) {
      var config, header, project, text, title, wrapper, _ref;
      project = (_ref = manager.client) != null ? _ref.projectDir : void 0;
      config = this.getModel().config;
      title = document.createElement('h2');
      title.innerHTML = project;
      this.content.appendChild(title);
      this.content.appendChild(this.buildRadio('ecmaVersion'));
      this.content.appendChild(this.buildBoolean('libs'));
      this.content.appendChild(this.buildStringArray(config.loadEagerly, 'loadEagerly'));
      this.content.appendChild(this.buildStringArray(config.dontLoad, 'dontLoad'));
      wrapper = document.createElement('section');
      header = document.createElement('h2');
      header.innerHTML = 'plugins';
      text = document.createElement('p');
      text.innerHTML = 'This section isn\'t implemented yet.<br />Please add plugins manually by editing your .tern-project file located in your root-path.';
      wrapper.appendChild(header);
      wrapper.appendChild(text);
      this.content.appendChild(wrapper);
      this.content.appendChild(this.close);
      return this.content.appendChild(this.cancel);
    };

    ConfigView.prototype.buildStringArray = function(obj, section) {
      var doc, header, path, wrapper, _i, _len;
      wrapper = document.createElement('section');
      wrapper.dataset.type = section;
      header = document.createElement('h2');
      header.innerHTML = section;
      doc = document.createElement('p');
      doc.innerHTML = this.getModel().config.docs[section].doc;
      wrapper.appendChild(header);
      wrapper.appendChild(doc);
      for (_i = 0, _len = obj.length; _i < _len; _i++) {
        path = obj[_i];
        wrapper.appendChild(this.createInputWrapper(path, section));
      }
      if (obj.length === 0) {
        wrapper.appendChild(this.createInputWrapper(null, section));
      }
      return wrapper;
    };

    ConfigView.prototype.createInputWrapper = function(path, section) {
      var editor, inputWrapper;
      inputWrapper = document.createElement('div');
      inputWrapper.classList.add('input-wrapper');
      editor = this.createTextEditor(path);
      editor.__ternjs_section = section;
      inputWrapper.appendChild(editor);
      inputWrapper.appendChild(this.createAdd(section));
      inputWrapper.appendChild(this.createSub(editor));
      return inputWrapper;
    };

    ConfigView.prototype.createSub = function(editor) {
      var sub;
      sub = document.createElement('span');
      sub.classList.add('sub');
      sub.classList.add('inline-block');
      sub.classList.add('status-removed');
      sub.classList.add('icon');
      sub.classList.add('icon-diff-removed');
      sub.addEventListener('click', (function(_this) {
        return function(e) {
          var inputWrapper;
          _this.getModel().removeEditor(editor);
          inputWrapper = e.target.closest('.input-wrapper');
          return inputWrapper.parentNode.removeChild(inputWrapper);
        };
      })(this), false);
      return sub;
    };

    ConfigView.prototype.createAdd = function(section) {
      var add;
      add = document.createElement('span');
      add.classList.add('add');
      add.classList.add('inline-block');
      add.classList.add('status-added');
      add.classList.add('icon');
      add.classList.add('icon-diff-added');
      add.addEventListener('click', (function(_this) {
        return function(e) {
          return e.target.closest('section').appendChild(_this.createInputWrapper(null, section));
        };
      })(this), false);
      return add;
    };

    ConfigView.prototype.createTextEditor = function(path) {
      var item;
      item = document.createElement('atom-text-editor');
      item.setAttribute('mini', true);
      if (path) {
        item.getModel().getBuffer().setText(path);
      }
      this.getModel().editors.push(item);
      return item;
    };

    ConfigView.prototype.buildRadio = function(section) {
      var doc, header, inputWrapper, key, label, radio, wrapper, _i, _len, _ref;
      wrapper = document.createElement('section');
      wrapper.classList.add(section);
      header = document.createElement('h2');
      header.innerHTML = section;
      doc = document.createElement('p');
      doc.innerHTML = this.getModel().config.docs[section].doc;
      wrapper.appendChild(header);
      wrapper.appendChild(doc);
      _ref = Object.keys(this.getModel().config.ecmaVersions);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        key = _ref[_i];
        inputWrapper = document.createElement('div');
        inputWrapper.classList.add('input-wrapper');
        label = document.createElement('span');
        label.innerHTML = key;
        radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = 'ecmaVersions';
        radio.checked = this.getModel().config.ecmaVersions[key];
        radio.__ternjs_key = key;
        radio.addEventListener('change', (function(_this) {
          return function(e) {
            var _j, _len1, _ref1;
            _ref1 = Object.keys(_this.getModel().config.ecmaVersions);
            for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
              key = _ref1[_j];
              _this.getModel().config.ecmaVersions[key] = false;
            }
            return _this.getModel().config.ecmaVersions[e.target.__ternjs_key] = e.target.checked;
          };
        })(this), false);
        inputWrapper.appendChild(label);
        inputWrapper.appendChild(radio);
        wrapper.appendChild(inputWrapper);
      }
      return wrapper;
    };

    ConfigView.prototype.buildBoolean = function(section) {
      var checkbox, header, inputWrapper, key, label, wrapper, _i, _len, _ref;
      wrapper = document.createElement('section');
      wrapper.classList.add(section);
      header = document.createElement('h2');
      header.innerHTML = section;
      wrapper.appendChild(header);
      _ref = Object.keys(this.getModel().config.libs);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        key = _ref[_i];
        inputWrapper = document.createElement('div');
        inputWrapper.classList.add('input-wrapper');
        label = document.createElement('span');
        label.innerHTML = key;
        checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = this.getModel().config.libs[key];
        checkbox.__ternjs_key = key;
        checkbox.addEventListener('change', (function(_this) {
          return function(e) {
            return _this.getModel().config.libs[e.target.__ternjs_key] = e.target.checked;
          };
        })(this), false);
        inputWrapper.appendChild(label);
        inputWrapper.appendChild(checkbox);
        wrapper.appendChild(inputWrapper);
      }
      return wrapper;
    };

    ConfigView.prototype.removeContent = function() {
      var _ref;
      return (_ref = this.content) != null ? _ref.innerHTML = '' : void 0;
    };

    ConfigView.prototype.getClose = function() {
      return this.close;
    };

    ConfigView.prototype.getCancel = function() {
      return this.cancel;
    };

    ConfigView.prototype.destroy = function() {
      return this.remove();
    };

    ConfigView.prototype.getModel = function() {
      return this.model;
    };

    ConfigView.prototype.setModel = function(model) {
      return this.model = model;
    };

    return ConfigView;

  })(HTMLElement);

  module.exports = document.registerElement('atom-ternjs-config', {
    prototype: ConfigView.prototype
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2luX2NoYWxpYy8uYXRvbS9wYWNrYWdlcy9hdG9tLXRlcm5qcy9saWIvYXRvbS10ZXJuanMtY29uZmlnLXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLFVBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFNO0FBRUosaUNBQUEsQ0FBQTs7OztLQUFBOztBQUFBLHlCQUFBLGVBQUEsR0FBaUIsU0FBQSxHQUFBO0FBQ2YsVUFBQSxTQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsU0FBUyxDQUFDLEdBQVgsQ0FBZSxvQkFBZixDQUFBLENBQUE7QUFBQSxNQUVBLFNBQUEsR0FBWSxRQUFRLENBQUMsYUFBVCxDQUF1QixLQUF2QixDQUZaLENBQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxPQUFELEdBQVcsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsS0FBdkIsQ0FIWCxDQUFBO0FBQUEsTUFJQSxJQUFDLENBQUEsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFuQixDQUF1QixTQUF2QixDQUpBLENBQUE7QUFBQSxNQUtBLElBQUMsQ0FBQSxLQUFELEdBQVMsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsUUFBdkIsQ0FMVCxDQUFBO0FBQUEsTUFNQSxJQUFDLENBQUEsS0FBSyxDQUFDLFNBQVMsQ0FBQyxHQUFqQixDQUFxQixLQUFyQixFQUE0QiwwQkFBNUIsQ0FOQSxDQUFBO0FBQUEsTUFPQSxJQUFDLENBQUEsS0FBSyxDQUFDLFNBQVAsR0FBbUIsdUJBUG5CLENBQUE7QUFBQSxNQVFBLElBQUMsQ0FBQSxNQUFELEdBQVUsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsUUFBdkIsQ0FSVixDQUFBO0FBQUEsTUFTQSxJQUFDLENBQUEsTUFBTSxDQUFDLFNBQVMsQ0FBQyxHQUFsQixDQUFzQixLQUF0QixFQUE2QiwwQkFBN0IsQ0FUQSxDQUFBO0FB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

//# sourceURL=/home/cin_chalic/.atom/packages/atom-ternjs/lib/atom-ternjs-config-view.coffee
