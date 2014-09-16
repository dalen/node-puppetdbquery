(function() {
  var ast;

  ast = require('../build/ast');

  exports.capitalize = function(s) {
    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
  };

  exports.capitalizeClass = function(s) {
    return s.split("::").map(exports.capitalize).join("::");
  };

  exports.regexpEscape = function(s) {
    return String(s).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, '\\$1').replace(/\x08/g, '\\x08');
  };

  exports.loc = function(loc) {
    var b;
    b = ast.builders;
    return b.sourceLocation(b.position(loc.first_line, loc.first_column), b.position(loc.last_line, loc.last_column));
  };

  exports.formatLocation = function(astnode) {
    var l;
    if (astnode.loc != null) {
      l = astnode.loc;
      if (l.start.line === l.end.line && l.start.column === l.end.column) {
        return "line " + l.start.line + ":" + l.start.column;
      } else {
        return "line " + l.start.line + ":" + l.start.column + " - line " + l.end.line + ":" + l.end.column;
      }
    } else {
      return '';
    }
  };

}).call(this);
