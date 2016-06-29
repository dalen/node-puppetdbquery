const parser = require('./parser');
const evaluate = require('./evaluator');

module.exports = {
  evaluator: evaluate,
  parser,
  parse: (query) => {
    const ast = parser.parse(query);
    return evaluate(ast);
  },
};
