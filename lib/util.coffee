exports.capitalize = (s) ->
  s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()

exports.capitalizeClass = (s) ->
  s.split("::").map(exports.capitalize).join("::")

exports.regexpEscape = (s) ->
  String(s).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, '\\$1').
    replace(/\x08/g, '\\x08')

#   function comparisonOp(op, left, right, mode){
#    if (left[0] === '.') {
#      return [op, left.slice(1), right];
#    } else {
#       if (mode === 'resource') {
#        return [op, ["parameter", left.slice(1).join('.')], right];
#      } else if (mode === 'subquery') {
#        return [ "in", "certname",
#                 [ "extract", "certname",
#                   [ "select-" + left[0] + "s",
#                     [ op, left[1], right ] ] ] ];
#      } else if (mode === 'simple') {
#        return [op, left[1], right];
#      } else {
#        return ["in", "certname",
#                  ["extract", "certname",
#                    ["select-fact-contents",
#                     ["and",
#                       [left[0], "path", left.slice(1)],
#                       [op, "value", right] ] ] ] ];
#      }
#    }
#  } */
