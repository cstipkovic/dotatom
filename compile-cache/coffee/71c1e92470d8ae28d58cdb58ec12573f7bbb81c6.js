(function() {
  var FindLabels, fs, fsPlus, path;

  fsPlus = require('fs-plus');

  fs = require('fs-plus');

  path = require('path');

  module.exports = FindLabels = {
    getLabelsByText: function(text, file) {
      var inputRex, labelRex, match, matches;
      if (file == null) {
        file = "";
      }
      labelRex = /\\label{([^}]+)}/g;
      matches = [];
      while ((match = labelRex.exec(text))) {
        matches.push({
          label: match[1]
        });
      }
      if (file == null) {
        return matches;
      }
      inputRex = /\\(input|include){([^}]+)}/g;
      while ((match = inputRex.exec(text))) {
        matches = matches.concat(this.getLabels(this.getAbsolutePath(file, match[2])));
      }
      return matches;
    },
    getLabels: function(file) {
      var text;
      if (!fsPlus.isFileSync(file)) {
        file = fsPlus.resolveExtension(file, ['tex']);
      }
      if (!fsPlus.isFileSync(file)) {
        return [];
      }
      text = fs.readFileSync(file).toString();
      return this.getLabelsByText(text, file);
    },
    getAbsolutePath: function(file, relativePath) {
      var ind;
      if ((ind = file.lastIndexOf("/")) !== file.length) {
        file = file.substring(0, ind);
      }
      return path.resolve(file, relativePath);
    }
  };

}).call(this);
