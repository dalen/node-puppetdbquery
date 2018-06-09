import ast from './ast';

const capitalize = s => s[0].toUpperCase() + s.slice(1).toLowerCase();
const capitalizeClass = s =>
  s
    .split('::')
    .map(module.exports.capitalize)
    .join('::');

const regexpEscape = s =>
  String(s).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, '\\$1');

const loc = location => {
  const b = ast.builders;
  return b.sourceLocation(
    b.position(location.first_line, location.first_column),
    b.position(location.last_line, location.last_column),
  );
};

const formatLocation = astnode => {
  if (astnode.loc != null) {
    const l = astnode.loc;
    if (l.start.line === l.end.line && l.start.column === l.end.column) {
      return `line ${l.start.line}:${l.start.column}`;
    }
    return `line ${l.start.line}:${l.start.column} - line ${l.end.line}:${
      l.end.column
    }`;
  }
  return '';
};

export { capitalize, capitalizeClass, regexpEscape, loc, formatLocation };
