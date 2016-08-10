var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _atomTernjsHelperJs = require('./atom-ternjs-helper.js');

"use babel";

var ReferenceView = (function (_HTMLElement) {
  _inherits(ReferenceView, _HTMLElement);

  function ReferenceView() {
    _classCallCheck(this, ReferenceView);

    _get(Object.getPrototypeOf(ReferenceView.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(ReferenceView, [{
    key: 'createdCallback',
    value: function createdCallback() {

      var container = document.createElement('div');

      this.content = document.createElement('div');
      this.closeButton = document.createElement('button');

      this.classList.add('atom-ternjs-reference');
      this.closeButton.classList.add('btn', 'atom-ternjs-reference-close');
      this.closeButton.innerHTML = 'Close';

      container.appendChild(this.closeButton);
      container.appendChild(this.content);

      this.appendChild(container);
    }
  }, {
    key: 'initialize',
    value: function initialize(model) {

      this.setModel(model);

      return this;
    }
  }, {
    key: 'clickHandle',
    value: function clickHandle(i) {

      this.getModel().goToReference(i);
    }
  }, {
    key: 'buildItems',
    value: function buildItems(data) {

      var headline = document.createElement('h2');
      var list = document.createElement('ul');
      var i = 0;

      this.content.innerHTML = '';
      headline.innerHTML = data.name + ' (' + data.type + ')';
      this.content.appendChild(headline);

      for (var item of data.refs) {

        var li = document.createElement('li');
        var lineText = (0, _atomTernjsHelperJs.replaceTags)(item.lineText);
        lineText = lineText.replace(data.name, '<strong>' + data.name + '</strong>');

        li.innerHTML = '\n        <h3>\n          <span>\n            <span class="darken">\n              (' + (item.position.row + 1) + ':' + item.position.column + '):\n            </span>\n            <span> ' + lineText + '</span>\n          </span>\n          <span class="darken"> (' + item.file + ')</span>\n          <div class="clear"></div>\n        </h3>\n      ';

        li.addEventListener('click', this.clickHandle.bind(this, i), false);
        list.appendChild(li);

        i++;
      }

      this.content.appendChild(list);
    }
  }, {
    key: 'getClose',
    value: function getClose() {

      return this.closeButton;
    }
  }, {
    key: 'getModel',
    value: function getModel() {

      return this.model;
    }
  }, {
    key: 'setModel',
    value: function setModel(model) {

      this.model = model;
    }
  }, {
    key: 'destroy',
    value: function destroy() {

      this.remove();
    }
  }]);

  return ReferenceView;
})(HTMLElement);

module.exports = document.registerElement('atom-ternjs-reference', {

  prototype: ReferenceView.prototype
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvYXRvbS10ZXJuanMvbGliL2F0b20tdGVybmpzLXJlZmVyZW5jZS12aWV3LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O2tDQUUwQix5QkFBeUI7O0FBRm5ELFdBQVcsQ0FBQzs7SUFJTixhQUFhO1lBQWIsYUFBYTs7V0FBYixhQUFhOzBCQUFiLGFBQWE7OytCQUFiLGFBQWE7OztlQUFiLGFBQWE7O1dBRUYsMkJBQUc7O0FBRWhCLFVBQU0sU0FBUyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7O0FBRWhELFVBQUksQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUM3QyxVQUFJLENBQUMsV0FBVyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7O0FBRXBELFVBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLHVCQUF1QixDQUFDLENBQUM7QUFDNUMsVUFBSSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSw2QkFBNkIsQ0FBQyxDQUFDO0FBQ3JFLFVBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQzs7QUFFckMsZUFBUyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDeEMsZUFBUyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7O0FBRXBDLFVBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUM7S0FDN0I7OztXQUVTLG9CQUFDLEtBQUssRUFBRTs7QUFFaEIsVUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQzs7QUFFckIsYUFBTyxJQUFJLENBQUM7S0FDYjs7O1dBRVUscUJBQUMsQ0FBQyxFQUFFOztBQUViLFVBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDbEM7OztXQUVTLG9CQUFDLElBQUksRUFBRTs7QUFFZixVQUFJLFFBQVEsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzVDLFVBQUksSUFBSSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDeEMsVUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDOztBQUVWLFVBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQztBQUM1QixjQUFRLENBQUMsU0FBUyxHQUFNLElBQUksQ0FBQyxJQUFJLFVBQUssSUFBSSxDQUFDLElBQUksTUFBRyxDQUFDO0FBQ25ELFVBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDOztBQUVuQyxXQUFLLElBQU0sSUFBSSxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUU7O0FBRTVCLFlBQUksRUFBRSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDdEMsWUFBSSxRQUFRLEdBQUcscUNBQVksSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQzFDLGdCQUFRLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxlQUFhLElBQUksQ0FBQyxJQUFJLGVBQVksQ0FBQzs7QUFFeEUsVUFBRSxDQUFDLFNBQVMsNkZBSUQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFBLFNBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLG9EQUV6QyxRQUFRLHFFQUVNLElBQUksQ0FBQyxJQUFJLHlFQUdyQyxDQUFDOztBQUVGLFVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQ3BFLFlBQUksQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUM7O0FBRXJCLFNBQUMsRUFBRSxDQUFDO09BQ0w7O0FBRUQsVUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDaEM7OztXQUVPLG9CQUFHOztBQUVULGFBQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQztLQUN6Qjs7O1dBRU8sb0JBQUc7O0FBRVQsYUFBTyxJQUFJLENBQUMsS0FBSyxDQUFDO0tBQ25COzs7V0FFTyxrQkFBQyxLQUFLLEVBQUU7O0FBRWQsVUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7S0FDcEI7OztXQUVNLG1CQUFHOztBQUVSLFVBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztLQUNmOzs7U0F2RkcsYUFBYTtHQUFTLFdBQVc7O0FBMEZ2QyxNQUFNLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQyxlQUFlLENBQUMsdUJBQXVCLEVBQUU7O0FBRWpFLFdBQVMsRUFBRSxhQUFhLENBQUMsU0FBUztDQUNuQyxDQUFDLENBQUMiLCJmaWxlIjoiL2hvbWUvY2luX2NoYWxpYy8uYXRvbS9wYWNrYWdlcy9hdG9tLXRlcm5qcy9saWIvYXRvbS10ZXJuanMtcmVmZXJlbmNlLXZpZXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBiYWJlbFwiO1xuXG5pbXBvcnQge3JlcGxhY2VUYWdzfSBmcm9tICcuL2F0b20tdGVybmpzLWhlbHBlci5qcyc7XG5cbmNsYXNzIFJlZmVyZW5jZVZpZXcgZXh0ZW5kcyBIVE1MRWxlbWVudCB7XG5cbiAgY3JlYXRlZENhbGxiYWNrKCkge1xuXG4gICAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cbiAgICB0aGlzLmNvbnRlbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB0aGlzLmNsb3NlQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG5cbiAgICB0aGlzLmNsYXNzTGlzdC5hZGQoJ2F0b20tdGVybmpzLXJlZmVyZW5jZScpO1xuICAgIHRoaXMuY2xvc2VCdXR0b24uY2xhc3NMaXN0LmFkZCgnYnRuJywgJ2F0b20tdGVybmpzLXJlZmVyZW5jZS1jbG9zZScpO1xuICAgIHRoaXMuY2xvc2VCdXR0b24uaW5uZXJIVE1MID0gJ0Nsb3NlJztcblxuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLmNsb3NlQnV0dG9uKTtcbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5jb250ZW50KTtcblxuICAgIHRoaXMuYXBwZW5kQ2hpbGQoY29udGFpbmVyKTtcbiAgfVxuXG4gIGluaXRpYWxpemUobW9kZWwpIHtcblxuICAgIHRoaXMuc2V0TW9kZWwobW9kZWwpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBjbGlja0hhbmRsZShpKSB7XG5cbiAgICB0aGlzLmdldE1vZGVsKCkuZ29Ub1JlZmVyZW5jZShpKTtcbiAgfVxuXG4gIGJ1aWxkSXRlbXMoZGF0YSkge1xuXG4gICAgbGV0IGhlYWRsaW5lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaDInKTtcbiAgICBsZXQgbGlzdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3VsJyk7XG4gICAgbGV0IGkgPSAwO1xuXG4gICAgdGhpcy5jb250ZW50LmlubmVySFRNTCA9ICcnO1xuICAgIGhlYWRsaW5lLmlubmVySFRNTCA9IGAke2RhdGEubmFtZX0gKCR7ZGF0YS50eXBlfSlgO1xuICAgIHRoaXMuY29udGVudC5hcHBlbmRDaGlsZChoZWFkbGluZSk7XG5cbiAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgZGF0YS5yZWZzKSB7XG5cbiAgICAgIGxldCBsaSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG4gICAgICBsZXQgbGluZVRleHQgPSByZXBsYWNlVGFncyhpdGVtLmxpbmVUZXh0KTtcbiAgICAgIGxpbmVUZXh0ID0gbGluZVRleHQucmVwbGFjZShkYXRhLm5hbWUsIGA8c3Ryb25nPiR7ZGF0YS5uYW1lfTwvc3Ryb25nPmApO1xuXG4gICAgICBsaS5pbm5lckhUTUwgPSBgXG4gICAgICAgIDxoMz5cbiAgICAgICAgICA8c3Bhbj5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiZGFya2VuXCI+XG4gICAgICAgICAgICAgICgke2l0ZW0ucG9zaXRpb24ucm93ICsgMX06JHtpdGVtLnBvc2l0aW9uLmNvbHVtbn0pOlxuICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgPHNwYW4+ICR7bGluZVRleHR9PC9zcGFuPlxuICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICA8c3BhbiBjbGFzcz1cImRhcmtlblwiPiAoJHtpdGVtLmZpbGV9KTwvc3Bhbj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwiY2xlYXJcIj48L2Rpdj5cbiAgICAgICAgPC9oMz5cbiAgICAgIGA7XG5cbiAgICAgIGxpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5jbGlja0hhbmRsZS5iaW5kKHRoaXMsIGkpLCBmYWxzZSk7XG4gICAgICBsaXN0LmFwcGVuZENoaWxkKGxpKTtcblxuICAgICAgaSsrO1xuICAgIH1cblxuICAgIHRoaXMuY29udGVudC5hcHBlbmRDaGlsZChsaXN0KTtcbiAgfVxuXG4gIGdldENsb3NlKCkge1xuXG4gICAgcmV0dXJuIHRoaXMuY2xvc2VCdXR0b247XG4gIH1cblxuICBnZXRNb2RlbCgpIHtcblxuICAgIHJldHVybiB0aGlzLm1vZGVsO1xuICB9XG5cbiAgc2V0TW9kZWwobW9kZWwpIHtcblxuICAgIHRoaXMubW9kZWwgPSBtb2RlbDtcbiAgfVxuXG4gIGRlc3Ryb3koKSB7XG5cbiAgICB0aGlzLnJlbW92ZSgpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KCdhdG9tLXRlcm5qcy1yZWZlcmVuY2UnLCB7XG5cbiAgcHJvdG90eXBlOiBSZWZlcmVuY2VWaWV3LnByb3RvdHlwZVxufSk7XG4iXX0=
//# sourceURL=/home/cin_chalic/.atom/packages/atom-ternjs/lib/atom-ternjs-reference-view.js
