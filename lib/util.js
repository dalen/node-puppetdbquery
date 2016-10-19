const ast = require('./ast');

module.exports = {
  capitalize: s => s[0].toUpperCase() + s.slice(1).toLowerCase(),

  capitalizeClass: s => s.split('::').map(module.exports.capitalize)
    .join('::'),

  regexpEscape: s => String(s).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, '\\$1'),

  loc: (loc) => {
    const b = ast.builders;
    return b.sourceLocation(
      b.position(loc.first_line, loc.first_column),
      b.position(loc.last_line, loc.last_column)
    );
  },

  formatLocation: (astnode) => {
    if (astnode.loc != null) {
      const l = astnode.loc;
      if (l.start.line === l.end.line && l.start.column === l.end.column) {
        return `line ${l.start.line}:${l.start.column}`;
      }
      return `line ${l.start.line}:${l.start.column} - line ${l.end.line}:${l.end.column}`;
    }
    return '';
  },
};
