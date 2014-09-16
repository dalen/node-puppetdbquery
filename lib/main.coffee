parser = require '../build/parser'
evaluator = require '../build/evaluator'

exports.evaluator = evaluator
exports.parser = parser
exports.parse = (query) ->
  ast = parser.parse(query)
  evaluator.evaluate(ast)
