"use babel";

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Manager = require('./atom-ternjs-manager');
var Provider = require('./atom-ternjs-provider');
var LinterTern = undefined;

var AtomTernjs = (function () {
  function AtomTernjs() {
    _classCallCheck(this, AtomTernjs);

    this.manager = undefined;
    this.provider = undefined;
    this.useLint = undefined;
    this.providerLinter = undefined;

    this.config = require('./config.json');
  }

  _createClass(AtomTernjs, [{
    key: 'activate',
    value: function activate() {

      this.provider = new Provider();
      this.manager = new Manager(this.provider);
      this.useLint = atom.config.get('atom-ternjs.lint');

      if (!this.useLint) {

        return;
      }

      LinterTern = require('./linter');
      this.providerLinter = new LinterTern(this.manager);
    }
  }, {
    key: 'deactivate',
    value: function deactivate() {

      this.manager.destroy();
      this.manager = undefined;
      this.provider = undefined;
      this.useLint = undefined;
      this.providerLinter = undefined;
    }
  }, {
    key: 'provide',
    value: function provide() {

      return this.provider;
    }
  }, {
    key: 'provideLinter',
    value: function provideLinter() {

      if (!this.useLint) {

        return;
      }

      return this.providerLinter;
    }
  }]);

  return AtomTernjs;
})();

exports['default'] = new AtomTernjs();
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvYXRvbS10ZXJuanMvbGliL2F0b20tdGVybmpzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFdBQVcsQ0FBQzs7Ozs7Ozs7OztBQUVaLElBQUksT0FBTyxHQUFHLE9BQU8sQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO0FBQy9DLElBQUksUUFBUSxHQUFHLE9BQU8sQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO0FBQ2pELElBQUksVUFBVSxZQUFBLENBQUM7O0lBRVQsVUFBVTtBQUVILFdBRlAsVUFBVSxHQUVBOzBCQUZWLFVBQVU7O0FBSVosUUFBSSxDQUFDLE9BQU8sR0FBRyxTQUFTLENBQUM7QUFDekIsUUFBSSxDQUFDLFFBQVEsR0FBRyxTQUFTLENBQUM7QUFDMUIsUUFBSSxDQUFDLE9BQU8sR0FBRyxTQUFTLENBQUM7QUFDekIsUUFBSSxDQUFDLGNBQWMsR0FBRyxTQUFTLENBQUM7O0FBRWhDLFFBQUksQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0dBQ3hDOztlQVZHLFVBQVU7O1dBWU4sb0JBQUc7O0FBRVQsVUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLFFBQVEsRUFBRSxDQUFDO0FBQy9CLFVBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQzFDLFVBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLENBQUMsQ0FBQzs7QUFFbkQsVUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUU7O0FBRWpCLGVBQU87T0FDUjs7QUFFRCxnQkFBVSxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNqQyxVQUFJLENBQUMsY0FBYyxHQUFHLElBQUksVUFBVSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztLQUNwRDs7O1dBRVMsc0JBQUc7O0FBRVgsVUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUN2QixVQUFJLENBQUMsT0FBTyxHQUFHLFNBQVMsQ0FBQztBQUN6QixVQUFJLENBQUMsUUFBUSxHQUFHLFNBQVMsQ0FBQztBQUMxQixVQUFJLENBQUMsT0FBTyxHQUFHLFNBQVMsQ0FBQztBQUN6QixVQUFJLENBQUMsY0FBYyxHQUFHLFNBQVMsQ0FBQztLQUNqQzs7O1dBRU0sbUJBQUc7O0FBRVIsYUFBTyxJQUFJLENBQUMsUUFBUSxDQUFDO0tBQ3RCOzs7V0FFWSx5QkFBRzs7QUFFZCxVQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRTs7QUFFakIsZUFBTztPQUNSOztBQUVELGFBQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQztLQUM1Qjs7O1NBakRHLFVBQVU7OztxQkFvREQsSUFBSSxVQUFVLEVBQUUiLCJmaWxlIjoiL2hvbWUvY2luX2NoYWxpYy8uYXRvbS9wYWNrYWdlcy9hdG9tLXRlcm5qcy9saWIvYXRvbS10ZXJuanMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBiYWJlbFwiO1xuXG5sZXQgTWFuYWdlciA9IHJlcXVpcmUoJy4vYXRvbS10ZXJuanMtbWFuYWdlcicpO1xubGV0IFByb3ZpZGVyID0gcmVxdWlyZSgnLi9hdG9tLXRlcm5qcy1wcm92aWRlcicpO1xubGV0IExpbnRlclRlcm47XG5cbmNsYXNzIEF0b21UZXJuanMge1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuXG4gICAgdGhpcy5tYW5hZ2VyID0gdW5kZWZpbmVkO1xuICAgIHRoaXMucHJvdmlkZXIgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy51c2VMaW50ID0gdW5kZWZpbmVkO1xuICAgIHRoaXMucHJvdmlkZXJMaW50ZXIgPSB1bmRlZmluZWQ7XG5cbiAgICB0aGlzLmNvbmZpZyA9IHJlcXVpcmUoJy4vY29uZmlnLmpzb24nKTtcbiAgfVxuXG4gIGFjdGl2YXRlKCkge1xuXG4gICAgdGhpcy5wcm92aWRlciA9IG5ldyBQcm92aWRlcigpO1xuICAgIHRoaXMubWFuYWdlciA9IG5ldyBNYW5hZ2VyKHRoaXMucHJvdmlkZXIpO1xuICAgIHRoaXMudXNlTGludCA9IGF0b20uY29uZmlnLmdldCgnYXRvbS10ZXJuanMubGludCcpO1xuXG4gICAgaWYgKCF0aGlzLnVzZUxpbnQpIHtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIExpbnRlclRlcm4gPSByZXF1aXJlKCcuL2xpbnRlcicpO1xuICAgIHRoaXMucHJvdmlkZXJMaW50ZXIgPSBuZXcgTGludGVyVGVybih0aGlzLm1hbmFnZXIpO1xuICB9XG5cbiAgZGVhY3RpdmF0ZSgpIHtcblxuICAgIHRoaXMubWFuYWdlci5kZXN0cm95KCk7XG4gICAgdGhpcy5tYW5hZ2VyID0gdW5kZWZpbmVkO1xuICAgIHRoaXMucHJvdmlkZXIgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy51c2VMaW50ID0gdW5kZWZpbmVkO1xuICAgIHRoaXMucHJvdmlkZXJMaW50ZXIgPSB1bmRlZmluZWQ7XG4gIH1cblxuICBwcm92aWRlKCkge1xuXG4gICAgcmV0dXJuIHRoaXMucHJvdmlkZXI7XG4gIH1cblxuICBwcm92aWRlTGludGVyKCkge1xuXG4gICAgaWYgKCF0aGlzLnVzZUxpbnQpIHtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnByb3ZpZGVyTGludGVyO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBBdG9tVGVybmpzKCk7XG4iXX0=
//# sourceURL=/home/cin_chalic/.atom/packages/atom-ternjs/lib/atom-ternjs.js
