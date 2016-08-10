Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _fsPlus = require('fs-plus');

var _fsPlus2 = _interopRequireDefault(_fsPlus);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

'use babel';

var BuilderRegistry = (function () {
  function BuilderRegistry() {
    _classCallCheck(this, BuilderRegistry);
  }

  _createClass(BuilderRegistry, [{
    key: 'getBuilder',
    value: function getBuilder(filePath) {
      var builders = this.getAllBuilders();
      var candidates = builders.filter(function (builder) {
        return builder.canProcess(filePath);
      });
      switch (candidates.length) {
        case 0:
          return null;
        case 1:
          return candidates[0];
      }

      return this.resolveAmbigiousBuilders(candidates);
    }
  }, {
    key: 'getAllBuilders',
    value: function getAllBuilders() {
      var moduleDir = _path2['default'].join(__dirname, 'builders');
      var entries = _fsPlus2['default'].readdirSync(moduleDir);
      var builders = entries.map(function (entry) {
        return require(_path2['default'].join(moduleDir, entry));
      });

      return builders;
    }
  }, {
    key: 'resolveAmbigiousBuilders',
    value: function resolveAmbigiousBuilders(builders) {
      var names = builders.map(function (builder) {
        return builder.name;
      });
      var indexOfLatexmk = names.indexOf('LatexmkBuilder');
      var indexOfTexify = names.indexOf('TexifyBuilder');
      if (names.length === 2 && indexOfLatexmk >= 0 && indexOfTexify >= 0) {
        switch (atom.config.get('latex.builder')) {
          case 'latexmk':
            return builders[indexOfLatexmk];
          case 'texify':
            return builders[indexOfTexify];
        }
      }

      throw Error('Unable to resolve ambigous builder registration');
    }
  }]);

  return BuilderRegistry;
})();

exports['default'] = BuilderRegistry;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGF0ZXgvbGliL2J1aWxkZXItcmVnaXN0cnkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztzQkFFZSxTQUFTOzs7O29CQUNQLE1BQU07Ozs7QUFIdkIsV0FBVyxDQUFBOztJQUtVLGVBQWU7V0FBZixlQUFlOzBCQUFmLGVBQWU7OztlQUFmLGVBQWU7O1dBQ3ZCLG9CQUFDLFFBQVEsRUFBRTtBQUNwQixVQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUE7QUFDdEMsVUFBTSxVQUFVLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxVQUFDLE9BQU87ZUFBSyxPQUFPLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQztPQUFBLENBQUMsQ0FBQTtBQUM3RSxjQUFRLFVBQVUsQ0FBQyxNQUFNO0FBQ3ZCLGFBQUssQ0FBQztBQUFFLGlCQUFPLElBQUksQ0FBQTtBQUFBLEFBQ25CLGFBQUssQ0FBQztBQUFFLGlCQUFPLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUFBLE9BQzdCOztBQUVELGFBQU8sSUFBSSxDQUFDLHdCQUF3QixDQUFDLFVBQVUsQ0FBQyxDQUFBO0tBQ2pEOzs7V0FFYywwQkFBRztBQUNoQixVQUFNLFNBQVMsR0FBRyxrQkFBSyxJQUFJLENBQUMsU0FBUyxFQUFFLFVBQVUsQ0FBQyxDQUFBO0FBQ2xELFVBQU0sT0FBTyxHQUFHLG9CQUFHLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQTtBQUN6QyxVQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQUMsS0FBSztlQUFLLE9BQU8sQ0FBQyxrQkFBSyxJQUFJLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxDQUFDO09BQUEsQ0FBQyxDQUFBOztBQUU3RSxhQUFPLFFBQVEsQ0FBQTtLQUNoQjs7O1dBRXdCLGtDQUFDLFFBQVEsRUFBRTtBQUNsQyxVQUFNLEtBQUssR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLFVBQUMsT0FBTztlQUFLLE9BQU8sQ0FBQyxJQUFJO09BQUEsQ0FBQyxDQUFBO0FBQ3JELFVBQU0sY0FBYyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQTtBQUN0RCxVQUFNLGFBQWEsR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFBO0FBQ3BELFVBQUksS0FBSyxDQUFDLE1BQU0sS0FBSyxDQUFDLElBQUksY0FBYyxJQUFJLENBQUMsSUFBSSxhQUFhLElBQUksQ0FBQyxFQUFFO0FBQ25FLGdCQUFRLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQztBQUN0QyxlQUFLLFNBQVM7QUFBRSxtQkFBTyxRQUFRLENBQUMsY0FBYyxDQUFDLENBQUE7QUFBQSxBQUMvQyxlQUFLLFFBQVE7QUFBRSxtQkFBTyxRQUFRLENBQUMsYUFBYSxDQUFDLENBQUE7QUFBQSxTQUM5QztPQUNGOztBQUVELFlBQU0sS0FBSyxDQUFDLGlEQUFpRCxDQUFDLENBQUE7S0FDL0Q7OztTQWhDa0IsZUFBZTs7O3FCQUFmLGVBQWUiLCJmaWxlIjoiL2hvbWUvY2luX2NoYWxpYy8uYXRvbS9wYWNrYWdlcy9sYXRleC9saWIvYnVpbGRlci1yZWdpc3RyeS5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmltcG9ydCBmcyBmcm9tICdmcy1wbHVzJ1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQnVpbGRlclJlZ2lzdHJ5IHtcbiAgZ2V0QnVpbGRlciAoZmlsZVBhdGgpIHtcbiAgICBjb25zdCBidWlsZGVycyA9IHRoaXMuZ2V0QWxsQnVpbGRlcnMoKVxuICAgIGNvbnN0IGNhbmRpZGF0ZXMgPSBidWlsZGVycy5maWx0ZXIoKGJ1aWxkZXIpID0+IGJ1aWxkZXIuY2FuUHJvY2VzcyhmaWxlUGF0aCkpXG4gICAgc3dpdGNoIChjYW5kaWRhdGVzLmxlbmd0aCkge1xuICAgICAgY2FzZSAwOiByZXR1cm4gbnVsbFxuICAgICAgY2FzZSAxOiByZXR1cm4gY2FuZGlkYXRlc1swXVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnJlc29sdmVBbWJpZ2lvdXNCdWlsZGVycyhjYW5kaWRhdGVzKVxuICB9XG5cbiAgZ2V0QWxsQnVpbGRlcnMgKCkge1xuICAgIGNvbnN0IG1vZHVsZURpciA9IHBhdGguam9pbihfX2Rpcm5hbWUsICdidWlsZGVycycpXG4gICAgY29uc3QgZW50cmllcyA9IGZzLnJlYWRkaXJTeW5jKG1vZHVsZURpcilcbiAgICBjb25zdCBidWlsZGVycyA9IGVudHJpZXMubWFwKChlbnRyeSkgPT4gcmVxdWlyZShwYXRoLmpvaW4obW9kdWxlRGlyLCBlbnRyeSkpKVxuXG4gICAgcmV0dXJuIGJ1aWxkZXJzXG4gIH1cblxuICByZXNvbHZlQW1iaWdpb3VzQnVpbGRlcnMgKGJ1aWxkZXJzKSB7XG4gICAgY29uc3QgbmFtZXMgPSBidWlsZGVycy5tYXAoKGJ1aWxkZXIpID0+IGJ1aWxkZXIubmFtZSlcbiAgICBjb25zdCBpbmRleE9mTGF0ZXhtayA9IG5hbWVzLmluZGV4T2YoJ0xhdGV4bWtCdWlsZGVyJylcbiAgICBjb25zdCBpbmRleE9mVGV4aWZ5ID0gbmFtZXMuaW5kZXhPZignVGV4aWZ5QnVpbGRlcicpXG4gICAgaWYgKG5hbWVzLmxlbmd0aCA9PT0gMiAmJiBpbmRleE9mTGF0ZXhtayA+PSAwICYmIGluZGV4T2ZUZXhpZnkgPj0gMCkge1xuICAgICAgc3dpdGNoIChhdG9tLmNvbmZpZy5nZXQoJ2xhdGV4LmJ1aWxkZXInKSkge1xuICAgICAgICBjYXNlICdsYXRleG1rJzogcmV0dXJuIGJ1aWxkZXJzW2luZGV4T2ZMYXRleG1rXVxuICAgICAgICBjYXNlICd0ZXhpZnknOiByZXR1cm4gYnVpbGRlcnNbaW5kZXhPZlRleGlmeV1cbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aHJvdyBFcnJvcignVW5hYmxlIHRvIHJlc29sdmUgYW1iaWdvdXMgYnVpbGRlciByZWdpc3RyYXRpb24nKVxuICB9XG59XG4iXX0=
//# sourceURL=/home/cin_chalic/.atom/packages/latex/lib/builder-registry.js
