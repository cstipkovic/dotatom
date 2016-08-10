(function() {
  var clangSourceScopeDictionary;

  clangSourceScopeDictionary = {
    'source.cpp': 'c++',
    'source.c': 'c',
    'source.objc': 'objective-c',
    'source.objcpp': 'objective-c++',
    'source.c++': 'c++',
    'source.objc++': 'objective-c++'
  };

  module.exports = {
    getFirstCursorSourceScopeLang: function(editor) {
      var scopes;
      scopes = this.getFirstCursorScopes(editor);
      return this.getSourceScopeLang(scopes);
    },
    getFirstCursorScopes: function(editor) {
      var firstPosition, scopeDescriptor, scopes;
      if (editor.getCursors) {
        firstPosition = editor.getCursors()[0].getBufferPosition();
        scopeDescriptor = editor.scopeDescriptorForBufferPosition(firstPosition);
        return scopes = scopeDescriptor.getScopesArray();
      } else {
        return scopes = [];
      }
    },
    getSourceScopeLang: function(scopes, scopeDictionary) {
      var lang, scope, _i, _len;
      if (scopeDictionary == null) {
        scopeDictionary = clangSourceScopeDictionary;
      }
      lang = null;
      for (_i = 0, _len = scopes.length; _i < _len; _i++) {
        scope = scopes[_i];
        if (scope in scopeDictionary) {
          return scopeDictionary[scope];
        }
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2luX2NoYWxpYy8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtY2xhbmcvbGliL3V0aWwuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDBCQUFBOztBQUFBLEVBQUEsMEJBQUEsR0FBNkI7QUFBQSxJQUMzQixZQUFBLEVBQWtCLEtBRFM7QUFBQSxJQUUzQixVQUFBLEVBQWtCLEdBRlM7QUFBQSxJQUczQixhQUFBLEVBQWtCLGFBSFM7QUFBQSxJQUkzQixlQUFBLEVBQWtCLGVBSlM7QUFBQSxJQU8zQixZQUFBLEVBQWtCLEtBUFM7QUFBQSxJQVEzQixlQUFBLEVBQWtCLGVBUlM7R0FBN0IsQ0FBQTs7QUFBQSxFQVdBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLDZCQUFBLEVBQStCLFNBQUMsTUFBRCxHQUFBO0FBQzdCLFVBQUEsTUFBQTtBQUFBLE1BQUEsTUFBQSxHQUFTLElBQUMsQ0FBQSxvQkFBRCxDQUFzQixNQUF0QixDQUFULENBQUE7QUFDQSxhQUFPLElBQUMsQ0FBQSxrQkFBRCxDQUFvQixNQUFwQixDQUFQLENBRjZCO0lBQUEsQ0FBL0I7QUFBQSxJQUlBLG9CQUFBLEVBQXNCLFNBQUMsTUFBRCxHQUFBO0FBQ3BCLFVBQUEsc0NBQUE7QUFBQSxNQUFBLElBQUcsTUFBTSxDQUFDLFVBQVY7QUFDRSxRQUFBLGFBQUEsR0FBZ0IsTUFBTSxDQUFDLFVBQVAsQ0FBQSxDQUFvQixDQUFBLENBQUEsQ0FBRSxDQUFDLGlCQUF2QixDQUFBLENBQWhCLENBQUE7QUFBQSxRQUNBLGVBQUEsR0FBa0IsTUFBTSxDQUFDLGdDQUFQLENBQXdDLGFBQXhDLENBRGxCLENBQUE7ZUFFQSxNQUFBLEdBQVMsZUFBZSxDQUFDLGNBQWhCLENBQUEsRUFIWDtPQUFBLE1BQUE7ZUFLRSxNQUFBLEdBQVMsR0FMWDtPQURvQjtJQUFBLENBSnRCO0FBQUEsSUFZQSxrQkFBQSxFQUFvQixTQUFDLE1BQUQsRUFBUyxlQUFULEdBQUE7QUFDbEIsVUFBQSxxQkFBQTs7UUFEMkIsa0JBQWdCO09BQzNDO0FBQUEsTUFBQSxJQUFBLEdBQU8sSUFBUCxDQUFBO0FBQ0EsV0FBQSw2Q0FBQTsyQkFBQTtBQUNFLFFBQUEsSUFBRyxLQUFBLElBQVMsZUFBWjtBQUNFLGlCQUFPLGVBQWdCLENBQUEsS0FBQSxDQUF2QixDQURGO1NBREY7QUFBQSxPQUZrQjtJQUFBLENBWnBCO0dBWkYsQ0FBQTtBQUFBIgp9

//# sourceURL=/home/cin_chalic/.atom/packages/autocomplete-clang/lib/util.coffee
