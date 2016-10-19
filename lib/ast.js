const types = require('ast-types/lib/types');
const shared = require('ast-types/lib/shared');

const def = types.Type.def;
const or = types.Type.or;
const builtin = types.builtInTypes;
const isString = builtin.string;
const isNumber = builtin.number;
const isBoolean = builtin.boolean;
const defaults = shared.defaults;
const geq = shared.geq;

def('Printable')
  .field('loc',
    or(def('SourceLocation'), null),
    defaults.null,
    true);

def('Node')
  .bases('Printable')
  .field('type', isString);

def('SourceLocation')
  .build('start', 'end', 'source')
  .field('start', def('Position'))
  .field('end', def('Position'))
  .field('source', or(isString, null), defaults.null);

def('Position')
  .build('line', 'column')
  .field('line', geq(1))
  .field('column', geq(0));

def('Literal')
  .bases('Node');

// Merge literals into Literal type?
def('Boolean')
  .bases('Literal')
  .build('value')
  .field('value', isBoolean);

def('String')
  .bases('Literal')
  .build('value')
  .field('value', isString);

def('Number')
  .bases('Literal')
  .build('value')
  .field('value', isNumber);

def('Date')
  .bases('Literal')
  .build('value')
  .field('value', isString);

def('Expression')
  .bases('Node');

def('BinaryExpression')
  .bases('Expression')
  .field('left', def('Expression'))
  .field('right', def('Expression'));

def('UnaryExpression')
  .bases('Expression')
  .field('expression', def('Expression'));

def('AndExpression')
  .bases('BinaryExpression')
  .build('left', 'right');

def('OrExpression')
  .bases('BinaryExpression')
  .build('left', 'right');

def('NotExpression')
  .bases('UnaryExpression')
  .build('expression');

def('ParentesizedExpression')
  .bases('UnaryExpression')
  .build('expression');

def('BlockExpression')
  .bases('UnaryExpression')
  .build('expression');

def('Comparison')
  .bases('Expression')
  .build('operator', 'left', 'right')
  .field('operator', or('=', '>=', '<=', '<', '>', '!=', '~', '!~'))
  .field('left', def('IdentifierPath'))
  .field('right', def('Literal'));

def('Identifier')
  .bases('Node')
  .build('name')
  .field('name', or(isString, isNumber));

def('RegexpIdentifier')
  .bases('Identifier')
  .build('name');

def('IdentifierPath')
  .bases('Node')
  .build('components', 'regexp')
  .field('components', [or(def('Identifier'), null)])
  .field('regexp', isBoolean, defaults.false);

def('Query')
  .bases('Node')
  .build('expression')
  .field('expression',
    or(def('Expression'), null),
    defaults.null);

def('Subquery')
  .bases('Expression')
  .build('endpoint', 'expression')
  .field('endpoint', isString)
  .field('expression', def('Expression'));

def('Resource')
  .bases('Expression')
  .build('res_type', 'title', 'exported', 'parameters')
  .field('res_type', isString)
  .field('title', def('Identifier'))
  .field('exported', isBoolean)
  .field('parameters',
    or(def('BlockExpression'), null),
    defaults.null);

def('RegexpNodeMatch')
  .bases('Expression')
  .build('value')
  // TODO: his is a bit silly, should just have the string directly here
  .field('value', def('IdentifierPath'));

types.finalize();

exports.Type = types.Type;
exports.builtInTypes = types.builtInTypes;
exports.namedTypes = types.namedTypes;
exports.builders = types.builders;
exports.defineMethod = types.defineMethod;
exports.getFieldNames = types.getFieldNames;
exports.getFieldValue = types.getFieldValue;
exports.eachField = types.eachField;
exports.someField = types.someField;
exports.getSupertypeNames = types.getSupertypeNames;
exports.finalize = types.finalize;
exports.NodePath = require('ast-types/lib/node-path');
exports.PathVisitor = require('ast-types/lib/path-visitor');

exports.visit = exports.PathVisitor.visit;
