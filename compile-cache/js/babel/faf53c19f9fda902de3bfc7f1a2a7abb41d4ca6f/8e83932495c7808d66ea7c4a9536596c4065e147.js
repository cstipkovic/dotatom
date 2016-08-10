Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.install = install;

var _helpers = require('./helpers');

// Renamed for backward compatibility
'use babel';
var FS = require('fs');
var Path = require('path');

var _require = require('./view');

var View = _require.View;
if (typeof window.__steelbrain_package_deps === 'undefined') {
  window.__steelbrain_package_deps = new Set();
}

function install() {
  var name = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];
  var enablePackages = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

  if (!name) {
    var filePath = require('sb-callsite').capture()[1].file;
    name = (0, _helpers.guessName)(filePath);
    if (!name) {
      console.log('Unable to get package name for file: ' + filePath);
      return Promise.resolve();
    }
  }

  var _packagesToInstall = (0, _helpers.packagesToInstall)(name);

  var toInstall = _packagesToInstall.toInstall;
  var toEnable = _packagesToInstall.toEnable;

  var promise = Promise.resolve();

  if (enablePackages && toEnable.length) {
    promise = toEnable.reduce(function (promise, name) {
      atom.packages.enablePackage(name);
      return atom.packages.activatePackage(name);
    }, promise);
  }
  if (toInstall.length) {
    (function () {
      var view = new View(name, toInstall);
      promise = Promise.all([view.show(), promise]).then(function () {
        return (0, _helpers.installPackages)(toInstall, function (name, status) {
          if (status) {
            view.advance();
          } else {
            atom.notifications.addError('Error Installing ' + name, { detail: 'Something went wrong. Try installing this package manually.' });
          }
        });
      });
    })();
  }

  return promise;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvbGludGVyLWpzY3Mvbm9kZV9tb2R1bGVzL2F0b20tcGFja2FnZS1kZXBzL2xpYi9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O3VCQUk0RCxXQUFXOzs7QUFKdkUsV0FBVyxDQUFBO0FBQ1gsSUFBTSxFQUFFLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFBO0FBQ3hCLElBQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQTs7ZUFDYixPQUFPLENBQUMsUUFBUSxDQUFDOztJQUF6QixJQUFJLFlBQUosSUFBSTtBQUlYLElBQUksT0FBTyxNQUFNLENBQUMseUJBQXlCLEtBQUssV0FBVyxFQUFFO0FBQzNELFFBQU0sQ0FBQyx5QkFBeUIsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFBO0NBQzdDOztBQUVNLFNBQVMsT0FBTyxHQUFzQztNQUFyQyxJQUFJLHlEQUFHLElBQUk7TUFBRSxjQUFjLHlEQUFHLEtBQUs7O0FBQ3pELE1BQUksQ0FBQyxJQUFJLEVBQUU7QUFDVCxRQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFBO0FBQ3pELFFBQUksR0FBRyx3QkFBVSxRQUFRLENBQUMsQ0FBQTtBQUMxQixRQUFJLENBQUMsSUFBSSxFQUFFO0FBQ1QsYUFBTyxDQUFDLEdBQUcsMkNBQXlDLFFBQVEsQ0FBRyxDQUFBO0FBQy9ELGFBQU8sT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFBO0tBQ3pCO0dBQ0Y7OzJCQUM2QixnQ0FBa0IsSUFBSSxDQUFDOztNQUE5QyxTQUFTLHNCQUFULFNBQVM7TUFBRSxRQUFRLHNCQUFSLFFBQVE7O0FBQzFCLE1BQUksT0FBTyxHQUFHLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQTs7QUFFL0IsTUFBSSxjQUFjLElBQUksUUFBUSxDQUFDLE1BQU0sRUFBRTtBQUNyQyxXQUFPLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxVQUFTLE9BQU8sRUFBRSxJQUFJLEVBQUU7QUFDaEQsVUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUE7QUFDakMsYUFBTyxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQTtLQUMzQyxFQUFFLE9BQU8sQ0FBQyxDQUFBO0dBQ1o7QUFDRCxNQUFJLFNBQVMsQ0FBQyxNQUFNLEVBQUU7O0FBQ3BCLFVBQU0sSUFBSSxHQUFHLElBQUksSUFBSSxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQTtBQUN0QyxhQUFPLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFXO0FBQzVELGVBQU8sOEJBQWdCLFNBQVMsRUFBRSxVQUFTLElBQUksRUFBRSxNQUFNLEVBQUU7QUFDdkQsY0FBSSxNQUFNLEVBQUU7QUFDVixnQkFBSSxDQUFDLE9BQU8sRUFBRSxDQUFBO1dBQ2YsTUFBTTtBQUNMLGdCQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsdUJBQXFCLElBQUksRUFBSSxFQUFDLE1BQU0sRUFBRSw2REFBNkQsRUFBQyxDQUFDLENBQUE7V0FDakk7U0FDRixDQUFDLENBQUE7T0FDSCxDQUFDLENBQUE7O0dBQ0g7O0FBRUQsU0FBTyxPQUFPLENBQUE7Q0FDZiIsImZpbGUiOiIvaG9tZS9jaW5fY2hhbGljLy5hdG9tL3BhY2thZ2VzL2xpbnRlci1qc2NzL25vZGVfbW9kdWxlcy9hdG9tLXBhY2thZ2UtZGVwcy9saWIvbWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5jb25zdCBGUyA9IHJlcXVpcmUoJ2ZzJylcbmNvbnN0IFBhdGggPSByZXF1aXJlKCdwYXRoJylcbmNvbnN0IHtWaWV3fSA9IHJlcXVpcmUoJy4vdmlldycpXG5pbXBvcnQge2d1ZXNzTmFtZSwgaW5zdGFsbFBhY2thZ2VzLCBwYWNrYWdlc1RvSW5zdGFsbH0gZnJvbSAnLi9oZWxwZXJzJ1xuXG4vLyBSZW5hbWVkIGZvciBiYWNrd2FyZCBjb21wYXRpYmlsaXR5XG5pZiAodHlwZW9mIHdpbmRvdy5fX3N0ZWVsYnJhaW5fcGFja2FnZV9kZXBzID09PSAndW5kZWZpbmVkJykge1xuICB3aW5kb3cuX19zdGVlbGJyYWluX3BhY2thZ2VfZGVwcyA9IG5ldyBTZXQoKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gaW5zdGFsbChuYW1lID0gbnVsbCwgZW5hYmxlUGFja2FnZXMgPSBmYWxzZSkge1xuICBpZiAoIW5hbWUpIHtcbiAgICBjb25zdCBmaWxlUGF0aCA9IHJlcXVpcmUoJ3NiLWNhbGxzaXRlJykuY2FwdHVyZSgpWzFdLmZpbGVcbiAgICBuYW1lID0gZ3Vlc3NOYW1lKGZpbGVQYXRoKVxuICAgIGlmICghbmFtZSkge1xuICAgICAgY29uc29sZS5sb2coYFVuYWJsZSB0byBnZXQgcGFja2FnZSBuYW1lIGZvciBmaWxlOiAke2ZpbGVQYXRofWApXG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKClcbiAgICB9XG4gIH1cbiAgY29uc3Qge3RvSW5zdGFsbCwgdG9FbmFibGV9ID0gcGFja2FnZXNUb0luc3RhbGwobmFtZSlcbiAgbGV0IHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKVxuXG4gIGlmIChlbmFibGVQYWNrYWdlcyAmJiB0b0VuYWJsZS5sZW5ndGgpIHtcbiAgICBwcm9taXNlID0gdG9FbmFibGUucmVkdWNlKGZ1bmN0aW9uKHByb21pc2UsIG5hbWUpIHtcbiAgICAgIGF0b20ucGFja2FnZXMuZW5hYmxlUGFja2FnZShuYW1lKVxuICAgICAgcmV0dXJuIGF0b20ucGFja2FnZXMuYWN0aXZhdGVQYWNrYWdlKG5hbWUpXG4gICAgfSwgcHJvbWlzZSlcbiAgfVxuICBpZiAodG9JbnN0YWxsLmxlbmd0aCkge1xuICAgIGNvbnN0IHZpZXcgPSBuZXcgVmlldyhuYW1lLCB0b0luc3RhbGwpXG4gICAgcHJvbWlzZSA9IFByb21pc2UuYWxsKFt2aWV3LnNob3coKSwgcHJvbWlzZV0pLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gaW5zdGFsbFBhY2thZ2VzKHRvSW5zdGFsbCwgZnVuY3Rpb24obmFtZSwgc3RhdHVzKSB7XG4gICAgICAgIGlmIChzdGF0dXMpIHtcbiAgICAgICAgICB2aWV3LmFkdmFuY2UoKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcihgRXJyb3IgSW5zdGFsbGluZyAke25hbWV9YCwge2RldGFpbDogJ1NvbWV0aGluZyB3ZW50IHdyb25nLiBUcnkgaW5zdGFsbGluZyB0aGlzIHBhY2thZ2UgbWFudWFsbHkuJ30pXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSlcbiAgfVxuXG4gIHJldHVybiBwcm9taXNlXG59XG4iXX0=
//# sourceURL=/home/cin_chalic/.atom/packages/linter-jscs/node_modules/atom-package-deps/lib/main.js
