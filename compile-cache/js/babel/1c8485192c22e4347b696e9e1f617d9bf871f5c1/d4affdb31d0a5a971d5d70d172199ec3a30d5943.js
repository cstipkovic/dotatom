/**
 * Sample quicksort code
 * TODO: This is the first todo
 *
 * LOONG: Lorem ipsum dolor sit amet, dapibus rhoncus. Scelerisque quam, id ante molestias, ipsum lorem magnis et. A eleifend ipsum. Pellentesque aliquam, proin mollis sed odio, at amet vestibulum velit. Dolor sed, urna integer suspendisse ut a. Pharetra amet dui accumsan elementum, vitae et ac ligula turpis semper donec.
 * LOONG_SpgLE84Ms1K4DSumtJDoNn8ZECZLL+VR0DoGydy54vUoSpgLE84Ms1K4DSumtJDoNn8ZECZLLVR0DoGydy54vUonRClXwLbFhX2gMwZgjx250ay+V0lF7sPZ8AiCVy22sE=SpgL_E84Ms1K4DSumtJDoNn8ZECZLLVR0DoGydy54vUoSpgLE84Ms1K4DSumtJ_DoNn8ZECZLLVR0DoGydy54vUo
 */

var quicksort = function quicksort() {
  var sort = function sort(items) {
    if (items.length <= 1) {
      return items;
    }
    var pivot = items.shift(),
        current,
        left = [],
        right = [];
    while (items.length > 0) {
      current = items.shift();
      current < pivot ? left.push(current) : right.push(current);
    }
    return sort(left).concat(pivot).concat(sort(right));
  };

  // TODO: This is the second todo

  return sort(Array.apply(this, arguments)); // DEBUG

  // FIXME: Add more annnotations :)

  // CHANGED one
  // CHANGED: two
  // @CHANGED three
  // @CHANGED: four
  // changed: non-matching tag

  // XXX one
  // XXX: two
  // @XXX three
  // @XXX: four
  //xxx: non-matching tag

  // IDEA one
  // IDEA: two
  // @IDEA three
  // @IDEA: four
  //idea: non-matching tag

  // HACK one
  // HACK: two
  // @HACK three
  // @HACK: four
  //hack: non-matching tag

  // NOTE one
  // NOTE: two
  // @NOTE three
  // @NOTE: four
  //note: non-matching tag

  // REVIEW one
  // REVIEW: two
  // @REVIEW three
  // @REVIEW: four
  //review: non-matching tag
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvdG9kby1zaG93L3NwZWMvZml4dHVyZXMvc2FtcGxlMS9zYW1wbGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFRQSxJQUFJLFNBQVMsR0FBRyxTQUFaLFNBQVMsR0FBZTtBQUMxQixNQUFJLElBQUksR0FBRyxTQUFQLElBQUksQ0FBWSxLQUFLLEVBQUU7QUFDekIsUUFBSSxLQUFLLENBQUMsTUFBTSxJQUFJLENBQUMsRUFBRTtBQUFFLGFBQU8sS0FBSyxDQUFDO0tBQUU7QUFDeEMsUUFBSSxLQUFLLEdBQUcsS0FBSyxDQUFDLEtBQUssRUFBRTtRQUFFLE9BQU87UUFBRSxJQUFJLEdBQUcsRUFBRTtRQUFFLEtBQUssR0FBRyxFQUFFLENBQUM7QUFDMUQsV0FBTSxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtBQUN0QixhQUFPLEdBQUcsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDO0FBQ3hCLGFBQU8sR0FBRyxLQUFLLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0tBQzVEO0FBQ0QsV0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztHQUNyRCxDQUFDOzs7O0FBSUYsU0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0NBd0MzQyxDQUFDIiwiZmlsZSI6Ii9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvdG9kby1zaG93L3NwZWMvZml4dHVyZXMvc2FtcGxlMS9zYW1wbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFNhbXBsZSBxdWlja3NvcnQgY29kZVxuICogVE9ETzogVGhpcyBpcyB0aGUgZmlyc3QgdG9kb1xuICpcbiAqIExPT05HOiBMb3JlbSBpcHN1bSBkb2xvciBzaXQgYW1ldCwgZGFwaWJ1cyByaG9uY3VzLiBTY2VsZXJpc3F1ZSBxdWFtLCBpZCBhbnRlIG1vbGVzdGlhcywgaXBzdW0gbG9yZW0gbWFnbmlzIGV0LiBBIGVsZWlmZW5kIGlwc3VtLiBQZWxsZW50ZXNxdWUgYWxpcXVhbSwgcHJvaW4gbW9sbGlzIHNlZCBvZGlvLCBhdCBhbWV0IHZlc3RpYnVsdW0gdmVsaXQuIERvbG9yIHNlZCwgdXJuYSBpbnRlZ2VyIHN1c3BlbmRpc3NlIHV0IGEuIFBoYXJldHJhIGFtZXQgZHVpIGFjY3Vtc2FuIGVsZW1lbnR1bSwgdml0YWUgZXQgYWMgbGlndWxhIHR1cnBpcyBzZW1wZXIgZG9uZWMuXG4gKiBMT09OR19TcGdMRTg0TXMxSzREU3VtdEpEb05uOFpFQ1pMTCtWUjBEb0d5ZHk1NHZVb1NwZ0xFODRNczFLNERTdW10SkRvTm44WkVDWkxMVlIwRG9HeWR5NTR2VW9uUkNsWHdMYkZoWDJnTXdaZ2p4MjUwYXkrVjBsRjdzUFo4QWlDVnkyMnNFPVNwZ0xfRTg0TXMxSzREU3VtdEpEb05uOFpFQ1pMTFZSMERvR3lkeTU0dlVvU3BnTEU4NE1zMUs0RFN1bXRKX0RvTm44WkVDWkxMVlIwRG9HeWR5NTR2VW9cbiAqL1xuXG52YXIgcXVpY2tzb3J0ID0gZnVuY3Rpb24gKCkge1xuICB2YXIgc29ydCA9IGZ1bmN0aW9uKGl0ZW1zKSB7XG4gICAgaWYgKGl0ZW1zLmxlbmd0aCA8PSAxKSB7IHJldHVybiBpdGVtczsgfVxuICAgIHZhciBwaXZvdCA9IGl0ZW1zLnNoaWZ0KCksIGN1cnJlbnQsIGxlZnQgPSBbXSwgcmlnaHQgPSBbXTtcbiAgICB3aGlsZShpdGVtcy5sZW5ndGggPiAwKSB7XG4gICAgICBjdXJyZW50ID0gaXRlbXMuc2hpZnQoKTtcbiAgICAgIGN1cnJlbnQgPCBwaXZvdCA/IGxlZnQucHVzaChjdXJyZW50KSA6IHJpZ2h0LnB1c2goY3VycmVudCk7XG4gICAgfVxuICAgIHJldHVybiBzb3J0KGxlZnQpLmNvbmNhdChwaXZvdCkuY29uY2F0KHNvcnQocmlnaHQpKTtcbiAgfTtcblxuICAvLyBUT0RPOiBUaGlzIGlzIHRoZSBzZWNvbmQgdG9kb1xuXG4gIHJldHVybiBzb3J0KEFycmF5LmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpOyAgLy8gREVCVUdcblxuICAvLyBGSVhNRTogQWRkIG1vcmUgYW5ubm90YXRpb25zIDopXG5cbiAgLy8gQ0hBTkdFRCBvbmVcbiAgLy8gQ0hBTkdFRDogdHdvXG4gIC8vIEBDSEFOR0VEIHRocmVlXG4gIC8vIEBDSEFOR0VEOiBmb3VyXG4gIC8vIGNoYW5nZWQ6IG5vbi1tYXRjaGluZyB0YWdcblxuICAvLyBYWFggb25lXG4gIC8vIFhYWDogdHdvXG4gIC8vIEBYWFggdGhyZWVcbiAgLy8gQFhYWDogZm91clxuICAvL3h4eDogbm9uLW1hdGNoaW5nIHRhZ1xuXG4gIC8vIElERUEgb25lXG4gIC8vIElERUE6IHR3b1xuICAvLyBASURFQSB0aHJlZVxuICAvLyBASURFQTogZm91clxuICAvL2lkZWE6IG5vbi1tYXRjaGluZyB0YWdcblxuICAvLyBIQUNLIG9uZVxuICAvLyBIQUNLOiB0d29cbiAgLy8gQEhBQ0sgdGhyZWVcbiAgLy8gQEhBQ0s6IGZvdXJcbiAgLy9oYWNrOiBub24tbWF0Y2hpbmcgdGFnXG5cbiAgLy8gTk9URSBvbmVcbiAgLy8gTk9URTogdHdvXG4gIC8vIEBOT1RFIHRocmVlXG4gIC8vIEBOT1RFOiBmb3VyXG4gIC8vbm90ZTogbm9uLW1hdGNoaW5nIHRhZ1xuXG4gIC8vIFJFVklFVyBvbmVcbiAgLy8gUkVWSUVXOiB0d29cbiAgLy8gQFJFVklFVyB0aHJlZVxuICAvLyBAUkVWSUVXOiBmb3VyXG4gIC8vcmV2aWV3OiBub24tbWF0Y2hpbmcgdGFnXG5cbn07XG4iXX0=