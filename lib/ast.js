const types = require('ast-types/lib/types');
const { Type } = types;
const { def } = Type;
const builtin = types.builtInTypes;
const isString = builtin.string;
const isNumber = builtin.number;
const isBoolean = builtin.boolean;
const shared = require('ast-types/lib/shared');
const { defaults } = shared;
const { geq } = shared;

def('Printable')
  .field('loc',
    Type.or(def('SourceLocation'), null),
    defaults.null,
    true);

def('Node')
  .bases('Printable')
  .field('type', isString);

def('SourceLocation')
  .build('start', 'end', 'source')
  .field('start', def('Position'))
  .field('end', def('Position'))
  .field('source', Type.or(isString, null), defaults.null);

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
  .field('operator', Type.or('=', '>=', '<=', '<', '>', '!=', '~', '!~'))
  .field('left', def('IdentifierPath'))
  .field('right', def('Literal'));

def('Identifier')
  .bases('Node')
  .build('name')
  .field('name', Type.or(isString, isNumber));

def('RegexpIdentifier')
  .bases('Identifier')
  .build('name');

def('IdentifierPath')
  .bases('Node')
  .build('components', 'regexp')
  .field('components', [Type.or(def('Identifier'), null)])
  .field('regexp', isBoolean, defaults.false);

def('Query')
  .bases('Node')
  .build('expression')
  .field('expression',
    Type.or(def('Expression'), null),
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
    Type.or(def('BlockExpression'), null),
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
// exports.astNodesAreEquivalent = require('ast-types/lib/equiv');
exports.finalize = types.finalize;
exports.NodePath = require('ast-types/lib/node-path');
exports.PathVisitor = require('ast-types/lib/path-visitor');
exports.visit = exports.PathVisitor.visit;
