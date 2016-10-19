import astlib from './ast';
import './util';
import parser from './parser.jison';
import evaluator from './evaluator';

const parse = (query) => {
  const ast = parser.parse(query);
  return evaluator(ast);
};

export {
  evaluator,
  parser,
  parse,
};
