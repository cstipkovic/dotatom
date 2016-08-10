(function() {
  var $, CompositeDisposable, TreeViewOpenFilesPaneView, _;

  CompositeDisposable = require('event-kit').CompositeDisposable;

  _ = require('lodash');

  $ = require('space-pen').$;

  module.exports = TreeViewOpenFilesPaneView = (function() {
    function TreeViewOpenFilesPaneView() {
      var header, headerSpan, nested, self;
      this.items = [];
      this.activeItem = null;
      this.paneSub = new CompositeDisposable;
      this.element = document.createElement('ul');
      this.element.classList.add('list-tree', 'has-collapsable-children');
      nested = document.createElement('li');
      nested.classList.add('list-nested-item', 'expanded');
      this.container = document.createElement('ul');
      this.container.classList.add('list-tree');
      header = document.createElement('div');
      header.classList.add('list-item');
      headerSpan = document.createElement('span');
      headerSpan.classList.add('name', 'icon', 'icon-file-directory');
      headerSpan.setAttribute('data-name', 'Pane');
      headerSpan.innerText = 'Pane';
      header.appendChild(headerSpan);
      nested.appendChild(header);
      nested.appendChild(this.container);
      this.element.appendChild(nested);
      $(this.element).on('click', '.list-nested-item > .list-item', function() {
        nested = $(this).closest('.list-nested-item');
        nested.toggleClass('expanded');
        return nested.toggleClass('collapsed');
      });
      self = this;
      $(this.element).on('click', '.list-item[is=tree-view-file]', function() {
        return self.pane.activateItem(self.entryForElement(this).item);
      });
    }

    TreeViewOpenFilesPaneView.prototype.setPane = function(pane) {
      this.pane = pane;
      this.paneSub.add(pane.observeItems((function(_this) {
        return function(item) {
          var closer, listItem, listItemName, titleSub;
          listItem = document.createElement('li');
          listItem.classList.add('file', 'list-item');
          listItem.setAttribute('is', 'tree-view-file');
          closer = document.createElement('button');
          closer.classList.add('close-open-file');
          $(closer).on('click', function() {
            return pane.destroyItem(_this.entryForElement(listItem).item);
          });
          listItem.appendChild(closer);
          listItemName = document.createElement('span');
          listItemName.classList.add('name', 'icon', 'icon-file-text');
          listItemName.setAttribute('data-path', typeof item.getPath === "function" ? item.getPath() : void 0);
          listItemName.setAttribute('data-name', typeof item.getTitle === "function" ? item.getTitle() : void 0);
          listItem.appendChild(listItemName);
          _this.container.appendChild(listItem);
          if (item.onDidChangeTitle != null) {
            titleSub = item.onDidChangeTitle(function() {
              return _this.updateTitle(item);
            });
            _this.paneSub.add(titleSub);
          }
          if (item.onDidChangeModified != null) {
            _this.paneSub.add(item.onDidChangeModified(function(modified) {
              return _this.updateModifiedState(item, modified);
            }));
          }
          _this.items.push({
            item: item,
            element: listItem
          });
          return _this.updateTitle(item);
        };
      })(this)));
      this.paneSub.add(pane.observeActiveItem((function(_this) {
        return function(item) {
          return _this.setActiveEntry(item);
        };
      })(this)));
      this.paneSub.add(pane.onDidRemoveItem((function(_this) {
        return function(_arg) {
          var item;
          item = _arg.item;
          return _this.removeEntry(item);
        };
      })(this)));
      return this.paneSub.add(pane.onDidDestroy((function(_this) {
        return function() {
          return _this.paneSub.dispose();
        };
      })(this)));
    };

    TreeViewOpenFilesPaneView.prototype.updateTitle = function(item, siblings, useLongTitle) {
      var entry, title, _base, _i, _len, _ref;
      if (siblings == null) {
        siblings = true;
      }
      if (useLongTitle == null) {
        useLongTitle = false;
      }
      title = item.getTitle();
      if (siblings) {
        _ref = this.items;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          entry = _ref[_i];
          if (entry.item !== item && (typeof (_base = entry.item).getTitle === "function" ? _base.getTitle() : void 0) === title) {
            useLongTitle = true;
            this.updateTitle(entry.item, false, true);
          }
        }
      }
      if (useLongTitle && (item.getLongTitle != null)) {
        title = item.getLongTitle();
      }
      if (entry = this.entryForItem(item)) {
        return $(entry.element).find('.name').text(title);
      }
    };

    TreeViewOpenFilesPaneView.prototype.updateModifiedState = function(item, modified) {
      var entry;
      entry = this.entryForItem(item);
      return entry != null ? entry.element.classList.toggle('modified', modified) : void 0;
    };

    TreeViewOpenFilesPaneView.prototype.entryForItem = function(item) {
      return _.detect(this.items, function(entry) {
        return entry.item === item;
      });
    };

    TreeViewOpenFilesPaneView.prototype.entryForElement = function(item) {
      return _.detect(this.items, function(entry) {
        return entry.element === item;
      });
    };

    TreeViewOpenFilesPaneView.prototype.setActiveEntry = function(item) {
      var entry, _ref;
      if (item) {
        if ((_ref = this.activeEntry) != null) {
          _ref.classList.remove('selected');
        }
        if (entry = this.entryForItem(item)) {
          entry.element.classList.add('selected');
          return this.activeEntry = entry.element;
        }
      }
    };

    TreeViewOpenFilesPaneView.prototype.removeEntry = function(item) {
      var entry, index, _i, _len, _ref, _results;
      index = _.findIndex(this.items, function(entry) {
        return entry.item === item;
      });
      if (index >= 0) {
        this.items[index].element.remove();
        this.items.splice(index, 1);
      }
      _ref = this.items;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        entry = _ref[_i];
        _results.push(this.updateTitle(entry.item));
      }
      return _results;
    };

    TreeViewOpenFilesPaneView.prototype.serialize = function() {};

    TreeViewOpenFilesPaneView.prototype.destroy = function() {
      this.element.remove();
      return this.paneSub.dispose();
    };

    return TreeViewOpenFilesPaneView;

  })();

}).call(this);
