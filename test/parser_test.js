let parser = require('../lib/parser');

exports['it should track source locations'] = (test) => {
  let ast = parser.parse('');
  test.equal(ast.loc.type, 'SourceLocation');
  test.deepEqual(ast.loc.start, {
    type: 'Position',
    line: 1,
    column: 0
  });
  test.deepEqual(ast.loc.end, {
    type: 'Position',
    line: 1,
    column: 0
  });
  return test.done();
};
