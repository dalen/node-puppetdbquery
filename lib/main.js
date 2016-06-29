let parser = require('./parser');
let evaluate = require ('./evaluator');

module.exports = {
  evaluator: evaluate,
  parser: parser,
  parse: (query) => {
    let ast = parser.parse(query);
    return evaluate(ast);
  }
};
