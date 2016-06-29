let ast = require('./ast');

module.exports = {
  capitalize: (s) => {
    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
  },

  capitalizeClass: (s) => {
    return s.split("::").map(module.exports.capitalize).join("::");
  },

  regexpEscape: (s) => {
    return String(s).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, '\\$1').
      replace(/\x08/g, '\\x08');
  },

  loc: (loc) => {
    let b = ast.builders;
    return b.sourceLocation(
      b.position(loc.first_line, loc.first_column),
      b.position(loc.last_line, loc.last_column)
    );
  },

  formatLocation: (astnode) => {
    if (astnode.loc != null) {
      let l = astnode.loc;
      if (l.start.line === l.end.line && l.start.column === l.end.column) {
        return `line ${l.start.line}:${l.start.column}`;
      } else {
        return `line ${l.start.line}:${l.start.column} - line ${l.end.line}:${l.end.column}`;
      }
    } else {
      return '';
    }
  },
};
