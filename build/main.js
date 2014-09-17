(function() {
  var evaluator, parser;

  parser = require('../build/parser.min');

  evaluator = require('../build/evaluator');

  exports.evaluator = evaluator;

  exports.parser = parser;

  exports.parse = function(query) {
    var ast;
    ast = parser.parse(query);
    return evaluator.evaluate(ast);
  };

}).call(this);
