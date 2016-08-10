"use babel";

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.replaceTag = replaceTag;
exports.replaceTags = replaceTags;
var tags = {

  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;'
};

function replaceTag(tag) {

  return tags[tag];
}

function replaceTags(str) {

  if (!str) {

    return '';
  }

  return str.replace(/[&<>]/g, replaceTag);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvYXRvbS10ZXJuanMvbGliL2F0b20tdGVybmpzLWhlbHBlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxXQUFXLENBQUM7Ozs7Ozs7QUFFWixJQUFNLElBQUksR0FBRzs7QUFFWCxLQUFHLEVBQUUsT0FBTztBQUNaLEtBQUcsRUFBRSxNQUFNO0FBQ1gsS0FBRyxFQUFFLE1BQU07Q0FDWixDQUFDOztBQUVLLFNBQVMsVUFBVSxDQUFDLEdBQUcsRUFBRTs7QUFFOUIsU0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7Q0FDbEI7O0FBRU0sU0FBUyxXQUFXLENBQUMsR0FBRyxFQUFFOztBQUUvQixNQUFJLENBQUMsR0FBRyxFQUFFOztBQUVSLFdBQU8sRUFBRSxDQUFDO0dBQ1g7O0FBRUQsU0FBTyxHQUFHLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxVQUFVLENBQUMsQ0FBQztDQUMxQyIsImZpbGUiOiIvaG9tZS9jaW5fY2hhbGljLy5hdG9tL3BhY2thZ2VzL2F0b20tdGVybmpzL2xpYi9hdG9tLXRlcm5qcy1oZWxwZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBiYWJlbFwiO1xuXG5jb25zdCB0YWdzID0ge1xuXG4gICcmJzogJyZhbXA7JyxcbiAgJzwnOiAnJmx0OycsXG4gICc+JzogJyZndDsnXG59O1xuXG5leHBvcnQgZnVuY3Rpb24gcmVwbGFjZVRhZyh0YWcpIHtcblxuICByZXR1cm4gdGFnc1t0YWddO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVwbGFjZVRhZ3Moc3RyKSB7XG5cbiAgaWYgKCFzdHIpIHtcblxuICAgIHJldHVybiAnJztcbiAgfVxuXG4gIHJldHVybiBzdHIucmVwbGFjZSgvWyY8Pl0vZywgcmVwbGFjZVRhZyk7XG59XG4iXX0=
//# sourceURL=/home/cin_chalic/.atom/packages/atom-ternjs/lib/atom-ternjs-helper.js
