"use babel";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DocumentationView = (function (_HTMLElement) {
  _inherits(DocumentationView, _HTMLElement);

  function DocumentationView() {
    _classCallCheck(this, DocumentationView);

    _get(Object.getPrototypeOf(DocumentationView.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(DocumentationView, [{
    key: 'createdCallback',
    value: function createdCallback() {
      var _this = this;

      this.getModel();
      this.addEventListener('click', function () {

        _this.getModel().destroyOverlay();
      }, false);

      this.container = document.createElement('div');

      this.container.onmousewheel = function (e) {

        e.stopPropagation();
      };

      this.appendChild(this.container);
    }
  }, {
    key: 'initialize',
    value: function initialize(model) {

      this.setModel(model);

      return this;
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
    key: 'setData',
    value: function setData(data) {

      this.container.innerHTML = '\n\n      <h3>' + data.type + '</h3>\n      <p>' + data.doc + '</p>\n      <a href="' + data.url + '">' + data.url + '</p>\n    ';
    }
  }, {
    key: 'destroy',
    value: function destroy() {

      this.remove();
    }
  }]);

  return DocumentationView;
})(HTMLElement);

module.exports = document.registerElement('atom-ternjs-documentation', {

  prototype: DocumentationView.prototype
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvYXRvbS10ZXJuanMvbGliL2F0b20tdGVybmpzLWRvY3VtZW50YXRpb24tdmlldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxXQUFXLENBQUM7Ozs7Ozs7Ozs7SUFFTixpQkFBaUI7WUFBakIsaUJBQWlCOztXQUFqQixpQkFBaUI7MEJBQWpCLGlCQUFpQjs7K0JBQWpCLGlCQUFpQjs7O2VBQWpCLGlCQUFpQjs7V0FFTiwyQkFBRzs7O0FBRWhCLFVBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztBQUNoQixVQUFJLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLFlBQU07O0FBRW5DLGNBQUssUUFBUSxFQUFFLENBQUMsY0FBYyxFQUFFLENBQUM7T0FFbEMsRUFBRSxLQUFLLENBQUMsQ0FBQzs7QUFFVixVQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7O0FBRS9DLFVBQUksQ0FBQyxTQUFTLENBQUMsWUFBWSxHQUFHLFVBQUMsQ0FBQyxFQUFLOztBQUVuQyxTQUFDLENBQUMsZUFBZSxFQUFFLENBQUM7T0FDckIsQ0FBQzs7QUFFRixVQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztLQUNsQzs7O1dBRVMsb0JBQUMsS0FBSyxFQUFFOztBQUVoQixVQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDOztBQUVyQixhQUFPLElBQUksQ0FBQztLQUNiOzs7V0FFTyxvQkFBRzs7QUFFVCxhQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7S0FDbkI7OztXQUVPLGtCQUFDLEtBQUssRUFBRTs7QUFFZCxVQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztLQUNwQjs7O1dBRU0saUJBQUMsSUFBSSxFQUFFOztBQUVaLFVBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxzQkFFaEIsSUFBSSxDQUFDLElBQUksd0JBQ1YsSUFBSSxDQUFDLEdBQUcsNkJBQ0YsSUFBSSxDQUFDLEdBQUcsVUFBSyxJQUFJLENBQUMsR0FBRyxlQUNqQyxDQUFDO0tBQ0g7OztXQUVNLG1CQUFHOztBQUVSLFVBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztLQUNmOzs7U0FuREcsaUJBQWlCO0dBQVMsV0FBVzs7QUFzRDNDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQywyQkFBMkIsRUFBRTs7QUFFckUsV0FBUyxFQUFFLGlCQUFpQixDQUFDLFNBQVM7Q0FDdkMsQ0FBQyxDQUFDIiwiZmlsZSI6Ii9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvYXRvbS10ZXJuanMvbGliL2F0b20tdGVybmpzLWRvY3VtZW50YXRpb24tdmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIGJhYmVsXCI7XG5cbmNsYXNzIERvY3VtZW50YXRpb25WaWV3IGV4dGVuZHMgSFRNTEVsZW1lbnQge1xuXG4gIGNyZWF0ZWRDYWxsYmFjaygpIHtcblxuICAgIHRoaXMuZ2V0TW9kZWwoKTtcbiAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuXG4gICAgICB0aGlzLmdldE1vZGVsKCkuZGVzdHJveU92ZXJsYXkoKTtcblxuICAgIH0sIGZhbHNlKTtcblxuICAgIHRoaXMuY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cbiAgICB0aGlzLmNvbnRhaW5lci5vbm1vdXNld2hlZWwgPSAoZSkgPT4ge1xuXG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIH07XG5cbiAgICB0aGlzLmFwcGVuZENoaWxkKHRoaXMuY29udGFpbmVyKTtcbiAgfVxuXG4gIGluaXRpYWxpemUobW9kZWwpIHtcblxuICAgIHRoaXMuc2V0TW9kZWwobW9kZWwpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBnZXRNb2RlbCgpIHtcblxuICAgIHJldHVybiB0aGlzLm1vZGVsO1xuICB9XG5cbiAgc2V0TW9kZWwobW9kZWwpIHtcblxuICAgIHRoaXMubW9kZWwgPSBtb2RlbDtcbiAgfVxuXG4gIHNldERhdGEoZGF0YSkge1xuXG4gICAgdGhpcy5jb250YWluZXIuaW5uZXJIVE1MID0gYFxuXG4gICAgICA8aDM+JHtkYXRhLnR5cGV9PC9oMz5cbiAgICAgIDxwPiR7ZGF0YS5kb2N9PC9wPlxuICAgICAgPGEgaHJlZj1cIiR7ZGF0YS51cmx9XCI+JHtkYXRhLnVybH08L3A+XG4gICAgYDtcbiAgfVxuXG4gIGRlc3Ryb3koKSB7XG5cbiAgICB0aGlzLnJlbW92ZSgpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KCdhdG9tLXRlcm5qcy1kb2N1bWVudGF0aW9uJywge1xuXG4gIHByb3RvdHlwZTogRG9jdW1lbnRhdGlvblZpZXcucHJvdG90eXBlXG59KTtcbiJdfQ==
//# sourceURL=/home/cin_chalic/.atom/packages/atom-ternjs/lib/atom-ternjs-documentation-view.js
