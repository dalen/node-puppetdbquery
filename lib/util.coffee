ast = require('../build/ast')

exports.capitalize = (s) ->
  s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()

exports.capitalizeClass = (s) ->
  s.split("::").map(exports.capitalize).join("::")

exports.regexpEscape = (s) ->
  String(s).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, '\\$1').
    replace(/\x08/g, '\\x08')

exports.loc = (loc) ->
  b = ast.builders
  b.sourceLocation(
    b.position(loc.first_line, loc.first_column)
    b.position(loc.last_line, loc.last_column)
  )

exports.formatLocation = (astnode) ->
  if astnode.loc?
    l = astnode.loc
    if l.start.line == l.end.line and l.start.column == l.end.column
      "line #{l.start.line}:#{l.start.column}"
    else
      "line #{l.start.line}:#{l.start.column} - \
       line #{l.end.line}:#{l.end.column}"
  else
    ''
