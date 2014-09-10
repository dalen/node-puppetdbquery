exports.capitalize = (s) ->
  s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()

exports.capitalizeClass = (s) ->
  s.split("::").map(exports.capitalize).join("::")

exports.regexpEscape = (s) ->
  String(s).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, '\\$1').
    replace(/\x08/g, '\\x08')
