'use babel';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.consumeStatusBar = consumeStatusBar;
exports.deactivate = deactivate;
var model = null;

function consumeStatusBar(statusBar) {
  var IndentationStatus = require('./indentation-status');
  model = new IndentationStatus(statusBar);
}

function deactivate() {
  if (model) {
    model.destroy();
    model = null;
  }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvaW5kZW50YXRpb24taW5kaWNhdG9yL2xpYi9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFdBQVcsQ0FBQTs7Ozs7OztBQUVYLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQTs7QUFFVCxTQUFTLGdCQUFnQixDQUFFLFNBQVMsRUFBRTtBQUMzQyxNQUFNLGlCQUFpQixHQUFHLE9BQU8sQ0FBQyxzQkFBc0IsQ0FBQyxDQUFBO0FBQ3pELE9BQUssR0FBRyxJQUFJLGlCQUFpQixDQUFDLFNBQVMsQ0FBQyxDQUFBO0NBQ3pDOztBQUVNLFNBQVMsVUFBVSxHQUFJO0FBQzVCLE1BQUksS0FBSyxFQUFFO0FBQ1QsU0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFBO0FBQ2YsU0FBSyxHQUFHLElBQUksQ0FBQTtHQUNiO0NBQ0YiLCJmaWxlIjoiL2hvbWUvY2luX2NoYWxpYy8uYXRvbS9wYWNrYWdlcy9pbmRlbnRhdGlvbi1pbmRpY2F0b3IvbGliL21haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5sZXQgbW9kZWwgPSBudWxsXG5cbmV4cG9ydCBmdW5jdGlvbiBjb25zdW1lU3RhdHVzQmFyIChzdGF0dXNCYXIpIHtcbiAgY29uc3QgSW5kZW50YXRpb25TdGF0dXMgPSByZXF1aXJlKCcuL2luZGVudGF0aW9uLXN0YXR1cycpXG4gIG1vZGVsID0gbmV3IEluZGVudGF0aW9uU3RhdHVzKHN0YXR1c0Jhcilcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlYWN0aXZhdGUgKCkge1xuICBpZiAobW9kZWwpIHtcbiAgICBtb2RlbC5kZXN0cm95KClcbiAgICBtb2RlbCA9IG51bGxcbiAgfVxufVxuIl19
//# sourceURL=/home/cin_chalic/.atom/packages/indentation-indicator/lib/main.js
