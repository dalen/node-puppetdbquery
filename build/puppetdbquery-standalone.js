(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function() {
  var Type, builtin, def, defaults, geq, isBoolean, isNumber, isString, shared, types;

  types = require('ast-types/lib/types');

  Type = types.Type;

  def = Type.def;

  builtin = types.builtInTypes;

  isString = builtin.string;

  isNumber = builtin.number;

  isBoolean = builtin.boolean;

  shared = require('ast-types/lib/shared');

  defaults = shared.defaults;

  geq = shared.geq;

  def('Node').field('type', isString).field('loc', Type.or(def('SourceLocation'), null), defaults['null'], true);

  def('SourceLocation').build('start', 'end', 'source').field('start', def('Position')).field('end', def('Position')).field('source', Type.or(isString, null), defaults['null']);

  def('Position').build('line', 'column').field('line', geq(1)).field('column', geq(0));

  def('Literal').bases('Node');

  def('Boolean').bases('Literal').build('value').field('value', isBoolean);

  def('String').bases('Literal').build('value').field('value', isString);

  def('Number').bases('Literal').build('value').field('value', isNumber);

  def('Date').bases('Literal').build('value').field('value', isString);

  def('Expression').bases('Node');

  def('BinaryExpression').bases('Expression').field('left', def('Expression')).field('right', def('Expression'));

  def('UnaryExpression').bases('Expression').field('expression', def('Expression'));

  def('AndExpression').bases('BinaryExpression').build('left', 'right');

  def('OrExpression').bases('BinaryExpression').build('left', 'right');

  def('NotExpression').bases('UnaryExpression').build('expression');

  def('ParentesizedExpression').bases('UnaryExpression').build('expression');

  def('BlockExpression').bases('UnaryExpression').build('expression');

  def('Comparison').bases('Expression').build('operator', 'left', 'right').field('operator', Type.or('=', '>=', '<=', '<', '>', '!=', '~', '!~')).field('left', def('IdentifierPath')).field('right', def('Literal'));

  def('Identifier').bases('Node').build('name').field('name', Type.or(isString, isNumber));

  def('RegexIdentifier').bases('Identifier').build('name');

  def('IdentifierPath').bases('Node').build('components').field('components', [Type.or(def('Identifier'), null)]).field('regex', isBoolean, defaults['false']);

  def('Query').bases('Node').build('expression').field('expression', Type.or(def('Expression'), null), defaults['null']);

  def('Subquery').bases('Expression').build('endpoint', 'expression').field('endpoint', isString).field('expression', def('Expression'));

  def('Resource').bases('Expression').build('res_type', 'title', 'exported', 'parameters').field('res_type', isString).field('title', def('Identifier')).field('exported', isBoolean).field('parameters', Type.or(def('BlockExpression'), null), defaults['null']).field('regex', isBoolean, defaults['false']);

  def('RegexNodeMatch').bases('Expression').build('value').field('value', def('IdentifierPath'));

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

  exports.traverse = require('ast-types/lib/traverse');

  exports.finalize = types.finalize;

  exports.NodePath = require('ast-types/lib/node-path');

  exports.PathVisitor = require('ast-types/lib/path-visitor');

  exports.visit = exports.PathVisitor.visit;

}).call(this);

},{"ast-types/lib/node-path":5,"ast-types/lib/path-visitor":6,"ast-types/lib/shared":9,"ast-types/lib/traverse":10,"ast-types/lib/types":11}],2:[function(require,module,exports){
(function() {
  var evaluate, util, visit;

  visit = require('./ast').visit;

  util = require('./util');

  evaluate = function(ast) {
    var mode;
    mode = ['fact'];
    return visit(ast, {
      visitComparison: function(path) {
        var left;
        this.traverse(path);
        if (mode[0] === 'fact') {
          return ['in', 'certname', ['extract', 'certname', ['select-fact-contents', ['and', path.node.left, [path.node.operator, 'value', path.node.right]]]]];
        } else if (mode[0] === 'subquery') {
          if (path.node.left.length === 1) {
            left = path.node.left[0];
          } else {
            left = path.node.left;
          }
          return [path.node.operator, left, path.node.right];
        } else if (mode[0] === 'resource') {
          return [path.node.operator, ['parameter', path.node.left[0]], path.node.right];
        }
      },
      visitBoolean: function(path) {
        return path.node.value;
      },
      visitString: function(path) {
        return path.node.value;
      },
      visitNumber: function(path) {
        return path.node.value;
      },
      visitAndExpression: function(path) {
        this.traverse(path);
        return ['and', path.node.left, path.node.right];
      },
      visitOrExpression: function(path) {
        this.traverse(path);
        return ['or', path.node.left, path.node.right];
      },
      visitNotExpression: function(path) {
        this.traverse(path);
        return ['not', path.node.expression];
      },
      visitQuery: function(path) {
        this.traverse(path);
        return path.node.expression;
      },
      visitParentesizedExpression: function(path) {
        this.traverse(path);
        return path.node.expression;
      },
      visitBlockExpression: function(path) {
        this.traverse(path);
        return path.node.expression;
      },
      visitSubquery: function(path) {
        mode.unshift('subquery');
        this.traverse(path);
        mode.shift();
        return ['in', 'certname', ['extract', 'certname', ["select-" + path.node.endpoint + "s", path.node.expression]]];
      },
      visitRegexNodeMatch: function(path) {
        mode.unshift('regex');
        this.traverse(path);
        mode.shift();
        return ['~', 'certname', util.regExpEscape(path.node.value.join('.'))];
      },
      visitIdentifierPath: function(path) {
        this.traverse(path);
        if (mode[0] === 'fact') {
          return [(path.node.regex ? '~>' : '='), 'path', path.node.components];
        } else {
          return path.node.components;
        }
      },
      visitIdentifier: function(path) {
        return path.node.name;
      },
      visitRegexIdentifier: function(path) {
        path.parentPath.node.regex = true;
        return path.node.name;
      },
      visitResource: function(path) {
        var and_expr, title;
        mode.unshift('resource');
        this.traverse(path);
        mode.shift();
        title = path.node.title;
        if (!path.node.regex && util.capitalize(path.node.res_type) === 'Class') {
          title = util.capitalizeClass(title);
        }
        and_expr = ['and', ['=', 'type', util.capitalize(path.node.res_type)], [(path.node.regex ? '~' : '='), 'title', title], ['=', 'exported', path.node.exported]];
        if (path.node.parameters) {
          and_expr.push(path.node.parameters);
        }
        return ['in', 'certname', ['extract', 'certname', ['select-resources', and_expr]]];
      }
    });
  };

  exports.evaluate = evaluate;

}).call(this);

},{"./ast":1,"./util":4}],3:[function(require,module,exports){
(function (process){
/* parser generated by jison 0.4.13 */
/*
  Returns a Parser object of the following structure:

  Parser: {
    yy: {}
  }

  Parser.prototype: {
    yy: {},
    trace: function(),
    symbols_: {associative list: name ==> number},
    terminals_: {associative list: number ==> name},
    productions_: [...],
    performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$),
    table: [...],
    defaultActions: {...},
    parseError: function(str, hash),
    parse: function(input),

    lexer: {
        EOF: 1,
        parseError: function(str, hash),
        setInput: function(input),
        input: function(),
        unput: function(str),
        more: function(),
        less: function(n),
        pastInput: function(),
        upcomingInput: function(),
        showPosition: function(),
        test_match: function(regex_match_array, rule_index),
        next: function(),
        lex: function(),
        begin: function(condition),
        popState: function(),
        _currentRules: function(),
        topState: function(),
        pushState: function(condition),

        options: {
            ranges: boolean           (optional: true ==> token location info will include a .range[] member)
            flex: boolean             (optional: true ==> flex-like lexing behaviour where the rules are tested exhaustively to find the longest match)
            backtrack_lexer: boolean  (optional: true ==> lexer regexes are tested in order and for each matching regex the action code is invoked; the lexer terminates the scan when a token is returned by the action code)
        },

        performAction: function(yy, yy_, $avoiding_name_collisions, YY_START),
        rules: [...],
        conditions: {associative list: name ==> set},
    }
  }


  token location info (@$, _$, etc.): {
    first_line: n,
    last_line: n,
    first_column: n,
    last_column: n,
    range: [start_number, end_number]       (where the numbers are indexes into the input string, regular zero-based)
  }


  the parseError function receives a 'hash' object with these members for lexer and parser errors: {
    text:        (matched text)
    token:       (the produced terminal token, if any)
    line:        (yylineno)
  }
  while parser (grammar) errors will also provide these members, i.e. parser errors deliver a superset of attributes: {
    loc:         (yylloc)
    expected:    (string describing the set of expected tokens)
    recoverable: (boolean: TRUE when the parser has a error recovery rule available for this particular error)
  }
*/
var parser = (function(){
var parser = {trace: function trace() { },
yy: {},
symbols_: {"error":2,"query":3,"expression":4,"EOF":5,"identifier_path":6,"not":7,"and":8,"or":9,"(":10,")":11,"resource_expression":12,"comparison_expression":13,"subquery":14,"literal":15,"boolean":16,"string":17,"integer":18,"float":19,"comparison_op":20,"~":21,"!~":22,"=":23,"!=":24,">":25,">=":26,"<":27,"<=":28,"identifier":29,"*":30,".":31,"#":32,"block_expression":33,"{":34,"}":35,"[":36,"]":37,"@@":38,"Boolean":39,"Number":40,"String":41,"$accept":0,"$end":1},
terminals_: {2:"error",5:"EOF",7:"not",8:"and",9:"or",10:"(",11:")",21:"~",22:"!~",23:"=",24:"!=",25:">",26:">=",27:"<",28:"<=",30:"*",31:".",32:"#",34:"{",35:"}",36:"[",37:"]",38:"@@",39:"Boolean",40:"Number",41:"String"},
productions_: [0,[3,2],[3,1],[4,1],[4,2],[4,3],[4,3],[4,3],[4,1],[4,1],[4,1],[15,1],[15,1],[15,1],[15,1],[20,1],[20,1],[20,1],[20,1],[20,1],[20,1],[20,1],[20,1],[13,3],[29,1],[29,1],[29,2],[29,1],[6,1],[6,3],[14,4],[14,3],[33,3],[12,4],[12,5],[12,5],[12,6],[16,1],[18,1],[17,1],[19,3]],
performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */) {
/* this == yyval */

var $0 = $$.length - 1;
switch (yystate) {
case 1: return evaluator.evaluate(ast.query($$[$0-1])); 
break;
case 2: return evaluator.evaluate(ast.query()); 
break;
case 3: this.$ = ast.regexNodeMatch($$[$0]); 
break;
case 4: this.$ = ast.notExpression($$[$0]); 
break;
case 5: this.$ = ast.andExpression($$[$0-2], $$[$0]); 
break;
case 6: this.$ = ast.orExpression($$[$0-2], $$[$0]); 
break;
case 7: this.$ = ast.parentesizedExpression($$[$0-1]); 
break;
case 11: this.$ = ast.boolean($$[$0]); 
break;
case 12: this.$ = ast.string($$[$0]); 
break;
case 13: this.$ = ast.number($$[$0]); 
break;
case 14: this.$ = ast.number($$[$0]); 
break;
case 23: this.$ = ast.comparison($$[$0-1], $$[$0-2], $$[$0]); 
break;
case 24: this.$ = ast.identifier($$[$0]); 
break;
case 25: this.$ = ast.identifier($$[$0]); 
break;
case 26: this.$ = ast.regexIdentifier($$[$0]); 
break;
case 27: this.$ = ast.regexIdentifier(".*"); 
break;
case 28: this.$ = ast.identifierPath([$$[$0]]); 
break;
case 29: $$[$0-2].components.push($$[$0]); this.$ = $$[$0-2]; 
break;
case 30: this.$ = ast.subquery($$[$0-2], $$[$0]); 
break;
case 31: this.$ = ast.subquery($$[$0-1], $$[$0]); 
break;
case 32: this.$ = ast.blockExpression($$[$0-1]); 
break;
case 33: this.$ = ast.resource($$[$0-3], $$[$0-1], false); 
break;
case 34: this.$ = ast.resource($$[$0-4], $$[$0-2], false, $$[$0]); 
break;
case 35: this.$ = ast.resource($$[$0-3], $$[$0-1], true); 
break;
case 36: this.$ = ast.resource($$[$0-4], $$[$0-2], true, $$[$0]); 
break;
case 37: this.$ = yytext === 'true' ? true: false; 
break;
case 38: this.$ = parseInt(yytext, 10); 
break;
case 39: this.$ = yytext; 
break;
case 40: this.$ = parseFloat($$[$0-2] + '.' + $$[$0]) 
break;
}
},
table: [{3:1,4:2,5:[1,3],6:4,7:[1,5],10:[1,6],12:7,13:8,14:9,17:11,18:14,21:[1,15],29:10,30:[1,16],32:[1,13],38:[1,12],40:[1,18],41:[1,17]},{1:[3]},{5:[1,19],8:[1,20],9:[1,21]},{1:[2,2]},{5:[2,3],8:[2,3],9:[2,3],11:[2,3],20:23,21:[1,24],22:[1,25],23:[1,26],24:[1,27],25:[1,28],26:[1,29],27:[1,30],28:[1,31],31:[1,22],35:[2,3]},{4:32,6:4,7:[1,5],10:[1,6],12:7,13:8,14:9,17:11,18:14,21:[1,15],29:10,30:[1,16],32:[1,13],38:[1,12],40:[1,18],41:[1,17]},{4:33,6:4,7:[1,5],10:[1,6],12:7,13:8,14:9,17:11,18:14,21:[1,15],29:10,30:[1,16],32:[1,13],38:[1,12],40:[1,18],41:[1,17]},{5:[2,8],8:[2,8],9:[2,8],11:[2,8],35:[2,8]},{5:[2,9],8:[2,9],9:[2,9],11:[2,9],35:[2,9]},{5:[2,10],8:[2,10],9:[2,10],11:[2,10],35:[2,10]},{5:[2,28],8:[2,28],9:[2,28],11:[2,28],21:[2,28],22:[2,28],23:[2,28],24:[2,28],25:[2,28],26:[2,28],27:[2,28],28:[2,28],31:[2,28],35:[2,28]},{5:[2,24],8:[2,24],9:[2,24],11:[2,24],21:[2,24],22:[2,24],23:[2,24],24:[2,24],25:[2,24],26:[2,24],27:[2,24],28:[2,24],31:[2,24],35:[2,24],36:[1,34]},{17:35,41:[1,17]},{17:36,41:[1,17]},{5:[2,25],8:[2,25],9:[2,25],11:[2,25],21:[2,25],22:[2,25],23:[2,25],24:[2,25],25:[2,25],26:[2,25],27:[2,25],28:[2,25],31:[2,25],35:[2,25],37:[2,25]},{17:37,41:[1,17]},{5:[2,27],8:[2,27],9:[2,27],11:[2,27],21:[2,27],22:[2,27],23:[2,27],24:[2,27],25:[2,27],26:[2,27],27:[2,27],28:[2,27],31:[2,27],35:[2,27],37:[2,27]},{5:[2,39],8:[2,39],9:[2,39],11:[2,39],21:[2,39],22:[2,39],23:[2,39],24:[2,39],25:[2,39],26:[2,39],27:[2,39],28:[2,39],31:[2,39],34:[2,39],35:[2,39],36:[2,39],37:[2,39]},{5:[2,38],8:[2,38],9:[2,38],11:[2,38],21:[2,38],22:[2,38],23:[2,38],24:[2,38],25:[2,38],26:[2,38],27:[2,38],28:[2,38],31:[2,38],35:[2,38],37:[2,38]},{1:[2,1]},{4:38,6:4,7:[1,5],10:[1,6],12:7,13:8,14:9,17:11,18:14,21:[1,15],29:10,30:[1,16],32:[1,13],38:[1,12],40:[1,18],41:[1,17]},{4:39,6:4,7:[1,5],10:[1,6],12:7,13:8,14:9,17:11,18:14,21:[1,15],29:10,30:[1,16],32:[1,13],38:[1,12],40:[1,18],41:[1,17]},{17:41,18:14,21:[1,15],29:40,30:[1,16],40:[1,18],41:[1,17]},{15:42,16:43,17:44,18:45,19:46,39:[1,47],40:[1,48],41:[1,17]},{39:[2,15],40:[2,15],41:[2,15]},{39:[2,16],40:[2,16],41:[2,16]},{39:[2,17],40:[2,17],41:[2,17]},{39:[2,18],40:[2,18],41:[2,18]},{39:[2,19],40:[2,19],41:[2,19]},{39:[2,20],40:[2,20],41:[2,20]},{39:[2,21],40:[2,21],41:[2,21]},{39:[2,22],40:[2,22],41:[2,22]},{5:[2,4],8:[2,4],9:[2,4],11:[2,4],35:[2,4]},{8:[1,20],9:[1,21],11:[1,49]},{17:41,18:14,21:[1,15],29:50,30:[1,16],40:[1,18],41:[1,17]},{36:[1,51]},{31:[1,52],33:53,34:[1,54]},{5:[2,26],8:[2,26],9:[2,26],11:[2,26],21:[2,26],22:[2,26],23:[2,26],24:[2,26],25:[2,26],26:[2,26],27:[2,26],28:[2,26],31:[2,26],35:[2,26],37:[2,26]},{5:[2,5],8:[2,5],9:[2,5],11:[2,5],35:[2,5]},{5:[2,6],8:[1,20],9:[2,6],11:[2,6],35:[2,6]},{5:[2,29],8:[2,29],9:[2,29],11:[2,29],21:[2,29],22:[2,29],23:[2,29],24:[2,29],25:[2,29],26:[2,29],27:[2,29],28:[2,29],31:[2,29],35:[2,29]},{5:[2,24],8:[2,24],9:[2,24],11:[2,24],21:[2,24],22:[2,24],23:[2,24],24:[2,24],25:[2,24],26:[2,24],27:[2,24],28:[2,24],31:[2,24],35:[2,24],37:[2,24]},{5:[2,23],8:[2,23],9:[2,23],11:[2,23],35:[2,23]},{5:[2,11],8:[2,11],9:[2,11],11:[2,11],35:[2,11]},{5:[2,12],8:[2,12],9:[2,12],11:[2,12],35:[2,12]},{5:[2,13],8:[2,13],9:[2,13],11:[2,13],35:[2,13]},{5:[2,14],8:[2,14],9:[2,14],11:[2,14],35:[2,14]},{5:[2,37],8:[2,37],9:[2,37],11:[2,37],35:[2,37]},{5:[2,38],8:[2,38],9:[2,38],11:[2,38],31:[1,55],35:[2,38]},{5:[2,7],8:[2,7],9:[2,7],11:[2,7],35:[2,7]},{37:[1,56]},{17:41,18:14,21:[1,15],29:57,30:[1,16],40:[1,18],41:[1,17]},{6:59,13:58,17:41,18:14,21:[1,15],29:10,30:[1,16],40:[1,18],41:[1,17]},{5:[2,31],8:[2,31],9:[2,31],11:[2,31],35:[2,31]},{4:60,6:4,7:[1,5],10:[1,6],12:7,13:8,14:9,17:11,18:14,21:[1,15],29:10,30:[1,16],32:[1,13],38:[1,12],40:[1,18],41:[1,17]},{40:[1,61]},{5:[2,33],8:[2,33],9:[2,33],11:[2,33],33:62,34:[1,54],35:[2,33]},{37:[1,63]},{5:[2,30],8:[2,30],9:[2,30],11:[2,30],35:[2,30]},{20:23,21:[1,24],22:[1,25],23:[1,26],24:[1,27],25:[1,28],26:[1,29],27:[1,30],28:[1,31],31:[1,22]},{8:[1,20],9:[1,21],35:[1,64]},{5:[2,40],8:[2,40],9:[2,40],11:[2,40],35:[2,40]},{5:[2,34],8:[2,34],9:[2,34],11:[2,34],35:[2,34]},{5:[2,35],8:[2,35],9:[2,35],11:[2,35],33:65,34:[1,54],35:[2,35]},{5:[2,32],8:[2,32],9:[2,32],11:[2,32],35:[2,32]},{5:[2,36],8:[2,36],9:[2,36],11:[2,36],35:[2,36]}],
defaultActions: {3:[2,2],19:[2,1]},
parseError: function parseError(str, hash) {
    if (hash.recoverable) {
        this.trace(str);
    } else {
        throw new Error(str);
    }
},
parse: function parse(input) {
    var self = this, stack = [0], vstack = [null], lstack = [], table = this.table, yytext = '', yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
    var args = lstack.slice.call(arguments, 1);
    this.lexer.setInput(input);
    this.lexer.yy = this.yy;
    this.yy.lexer = this.lexer;
    this.yy.parser = this;
    if (typeof this.lexer.yylloc == 'undefined') {
        this.lexer.yylloc = {};
    }
    var yyloc = this.lexer.yylloc;
    lstack.push(yyloc);
    var ranges = this.lexer.options && this.lexer.options.ranges;
    if (typeof this.yy.parseError === 'function') {
        this.parseError = this.yy.parseError;
    } else {
        this.parseError = Object.getPrototypeOf(this).parseError;
    }
    function popStack(n) {
        stack.length = stack.length - 2 * n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }
    function lex() {
        var token;
        token = self.lexer.lex() || EOF;
        if (typeof token !== 'number') {
            token = self.symbols_[token] || token;
        }
        return token;
    }
    var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
    while (true) {
        state = stack[stack.length - 1];
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol === null || typeof symbol == 'undefined') {
                symbol = lex();
            }
            action = table[state] && table[state][symbol];
        }
                    if (typeof action === 'undefined' || !action.length || !action[0]) {
                var errStr = '';
                expected = [];
                for (p in table[state]) {
                    if (this.terminals_[p] && p > TERROR) {
                        expected.push('\'' + this.terminals_[p] + '\'');
                    }
                }
                if (this.lexer.showPosition) {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ':\n' + this.lexer.showPosition() + '\nExpecting ' + expected.join(', ') + ', got \'' + (this.terminals_[symbol] || symbol) + '\'';
                } else {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ': Unexpected ' + (symbol == EOF ? 'end of input' : '\'' + (this.terminals_[symbol] || symbol) + '\'');
                }
                this.parseError(errStr, {
                    text: this.lexer.match,
                    token: this.terminals_[symbol] || symbol,
                    line: this.lexer.yylineno,
                    loc: yyloc,
                    expected: expected
                });
            }
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error('Parse Error: multiple actions possible at state: ' + state + ', token: ' + symbol);
        }
        switch (action[0]) {
        case 1:
            stack.push(symbol);
            vstack.push(this.lexer.yytext);
            lstack.push(this.lexer.yylloc);
            stack.push(action[1]);
            symbol = null;
            if (!preErrorSymbol) {
                yyleng = this.lexer.yyleng;
                yytext = this.lexer.yytext;
                yylineno = this.lexer.yylineno;
                yyloc = this.lexer.yylloc;
                if (recovering > 0) {
                    recovering--;
                }
            } else {
                symbol = preErrorSymbol;
                preErrorSymbol = null;
            }
            break;
        case 2:
            len = this.productions_[action[1]][1];
            yyval.$ = vstack[vstack.length - len];
            yyval._$ = {
                first_line: lstack[lstack.length - (len || 1)].first_line,
                last_line: lstack[lstack.length - 1].last_line,
                first_column: lstack[lstack.length - (len || 1)].first_column,
                last_column: lstack[lstack.length - 1].last_column
            };
            if (ranges) {
                yyval._$.range = [
                    lstack[lstack.length - (len || 1)].range[0],
                    lstack[lstack.length - 1].range[1]
                ];
            }
            r = this.performAction.apply(yyval, [
                yytext,
                yyleng,
                yylineno,
                this.yy,
                action[1],
                vstack,
                lstack
            ].concat(args));
            if (typeof r !== 'undefined') {
                return r;
            }
            if (len) {
                stack = stack.slice(0, -1 * len * 2);
                vstack = vstack.slice(0, -1 * len);
                lstack = lstack.slice(0, -1 * len);
            }
            stack.push(this.productions_[action[1]][0]);
            vstack.push(yyval.$);
            lstack.push(yyval._$);
            newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
            stack.push(newState);
            break;
        case 3:
            return true;
        }
    }
    return true;
}};

  var astlib = require('./ast');
  var ast = astlib.builders;
  var evaluator = require('./evaluator');
/* generated by jison-lex 0.2.1 */
var lexer = (function(){
var lexer = {

EOF:1,

parseError:function parseError(str, hash) {
        if (this.yy.parser) {
            this.yy.parser.parseError(str, hash);
        } else {
            throw new Error(str);
        }
    },

// resets the lexer, sets new input
setInput:function (input) {
        this._input = input;
        this._more = this._backtrack = this.done = false;
        this.yylineno = this.yyleng = 0;
        this.yytext = this.matched = this.match = '';
        this.conditionStack = ['INITIAL'];
        this.yylloc = {
            first_line: 1,
            first_column: 0,
            last_line: 1,
            last_column: 0
        };
        if (this.options.ranges) {
            this.yylloc.range = [0,0];
        }
        this.offset = 0;
        return this;
    },

// consumes and returns one char from the input
input:function () {
        var ch = this._input[0];
        this.yytext += ch;
        this.yyleng++;
        this.offset++;
        this.match += ch;
        this.matched += ch;
        var lines = ch.match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno++;
            this.yylloc.last_line++;
        } else {
            this.yylloc.last_column++;
        }
        if (this.options.ranges) {
            this.yylloc.range[1]++;
        }

        this._input = this._input.slice(1);
        return ch;
    },

// unshifts one char (or a string) into the input
unput:function (ch) {
        var len = ch.length;
        var lines = ch.split(/(?:\r\n?|\n)/g);

        this._input = ch + this._input;
        this.yytext = this.yytext.substr(0, this.yytext.length - len - 1);
        //this.yyleng -= len;
        this.offset -= len;
        var oldLines = this.match.split(/(?:\r\n?|\n)/g);
        this.match = this.match.substr(0, this.match.length - 1);
        this.matched = this.matched.substr(0, this.matched.length - 1);

        if (lines.length - 1) {
            this.yylineno -= lines.length - 1;
        }
        var r = this.yylloc.range;

        this.yylloc = {
            first_line: this.yylloc.first_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.first_column,
            last_column: lines ?
                (lines.length === oldLines.length ? this.yylloc.first_column : 0)
                 + oldLines[oldLines.length - lines.length].length - lines[0].length :
              this.yylloc.first_column - len
        };

        if (this.options.ranges) {
            this.yylloc.range = [r[0], r[0] + this.yyleng - len];
        }
        this.yyleng = this.yytext.length;
        return this;
    },

// When called from action, caches matched text and appends it on next action
more:function () {
        this._more = true;
        return this;
    },

// When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.
reject:function () {
        if (this.options.backtrack_lexer) {
            this._backtrack = true;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });

        }
        return this;
    },

// retain first n characters of the match
less:function (n) {
        this.unput(this.match.slice(n));
    },

// displays already matched input, i.e. for error messages
pastInput:function () {
        var past = this.matched.substr(0, this.matched.length - this.match.length);
        return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
    },

// displays upcoming input, i.e. for error messages
upcomingInput:function () {
        var next = this.match;
        if (next.length < 20) {
            next += this._input.substr(0, 20-next.length);
        }
        return (next.substr(0,20) + (next.length > 20 ? '...' : '')).replace(/\n/g, "");
    },

// displays the character position where the lexing error occurred, i.e. for error messages
showPosition:function () {
        var pre = this.pastInput();
        var c = new Array(pre.length + 1).join("-");
        return pre + this.upcomingInput() + "\n" + c + "^";
    },

// test the lexed token: return FALSE when not a match, otherwise return token
test_match:function (match, indexed_rule) {
        var token,
            lines,
            backup;

        if (this.options.backtrack_lexer) {
            // save context
            backup = {
                yylineno: this.yylineno,
                yylloc: {
                    first_line: this.yylloc.first_line,
                    last_line: this.last_line,
                    first_column: this.yylloc.first_column,
                    last_column: this.yylloc.last_column
                },
                yytext: this.yytext,
                match: this.match,
                matches: this.matches,
                matched: this.matched,
                yyleng: this.yyleng,
                offset: this.offset,
                _more: this._more,
                _input: this._input,
                yy: this.yy,
                conditionStack: this.conditionStack.slice(0),
                done: this.done
            };
            if (this.options.ranges) {
                backup.yylloc.range = this.yylloc.range.slice(0);
            }
        }

        lines = match[0].match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno += lines.length;
        }
        this.yylloc = {
            first_line: this.yylloc.last_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.last_column,
            last_column: lines ?
                         lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length :
                         this.yylloc.last_column + match[0].length
        };
        this.yytext += match[0];
        this.match += match[0];
        this.matches = match;
        this.yyleng = this.yytext.length;
        if (this.options.ranges) {
            this.yylloc.range = [this.offset, this.offset += this.yyleng];
        }
        this._more = false;
        this._backtrack = false;
        this._input = this._input.slice(match[0].length);
        this.matched += match[0];
        token = this.performAction.call(this, this.yy, this, indexed_rule, this.conditionStack[this.conditionStack.length - 1]);
        if (this.done && this._input) {
            this.done = false;
        }
        if (token) {
            return token;
        } else if (this._backtrack) {
            // recover context
            for (var k in backup) {
                this[k] = backup[k];
            }
            return false; // rule action called reject() implying the next rule should be tested instead.
        }
        return false;
    },

// return next match in input
next:function () {
        if (this.done) {
            return this.EOF;
        }
        if (!this._input) {
            this.done = true;
        }

        var token,
            match,
            tempMatch,
            index;
        if (!this._more) {
            this.yytext = '';
            this.match = '';
        }
        var rules = this._currentRules();
        for (var i = 0; i < rules.length; i++) {
            tempMatch = this._input.match(this.rules[rules[i]]);
            if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                match = tempMatch;
                index = i;
                if (this.options.backtrack_lexer) {
                    token = this.test_match(tempMatch, rules[i]);
                    if (token !== false) {
                        return token;
                    } else if (this._backtrack) {
                        match = false;
                        continue; // rule action called reject() implying a rule MISmatch.
                    } else {
                        // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
                        return false;
                    }
                } else if (!this.options.flex) {
                    break;
                }
            }
        }
        if (match) {
            token = this.test_match(match, rules[index]);
            if (token !== false) {
                return token;
            }
            // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
            return false;
        }
        if (this._input === "") {
            return this.EOF;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. Unrecognized text.\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });
        }
    },

// return next match that has a token
lex:function lex() {
        var r = this.next();
        if (r) {
            return r;
        } else {
            return this.lex();
        }
    },

// activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)
begin:function begin(condition) {
        this.conditionStack.push(condition);
    },

// pop the previously active lexer condition state off the condition stack
popState:function popState() {
        var n = this.conditionStack.length - 1;
        if (n > 0) {
            return this.conditionStack.pop();
        } else {
            return this.conditionStack[0];
        }
    },

// produce the lexer rule set which is active for the currently active lexer condition state
_currentRules:function _currentRules() {
        if (this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]) {
            return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
        } else {
            return this.conditions["INITIAL"].rules;
        }
    },

// return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available
topState:function topState(n) {
        n = this.conditionStack.length - 1 - Math.abs(n || 0);
        if (n >= 0) {
            return this.conditionStack[n];
        } else {
            return "INITIAL";
        }
    },

// alias for begin(condition)
pushState:function pushState(condition) {
        this.begin(condition);
    },

// return the number of states currently on the stack
stateStackSize:function stateStackSize() {
        return this.conditionStack.length;
    },
options: {},
performAction: function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {

var YYSTATE=YY_START;
switch($avoiding_name_collisions) {
case 0: /* whitespace no action */ 
break;
case 1: return 10; 
break;
case 2: return 11; 
break;
case 3: return 36; 
break;
case 4: return 37; 
break;
case 5: return 34; 
break;
case 6: return 35; 
break;
case 7: return 23; 
break;
case 8: return 24; 
break;
case 9: return 21; 
break;
case 10: return 27; 
break;
case 11: return 28; 
break;
case 12: return 25; 
break;
case 13: return 26; 
break;
case 14: return 30; 
break;
case 15: return 32; 
break;
case 16: return 7; 
break;
case 17: return 8; 
break;
case 18: return 9; 
break;
case 19: return 39; 
break;
case 20: return 39; 
break;
case 21: return 40; 
break;
case 22: yy_.yytext = eval(yy_.yytext); return 41; 
break;
case 23: yy_.yytext = eval(yy_.yytext); return 41; 
break;
case 24: return 31; 
break;
case 25: return 41; 
break;
case 26: return 38; 
break;
case 27: return 5; 
break;
}
},
rules: [/^(?:\s+)/,/^(?:\()/,/^(?:\))/,/^(?:\[)/,/^(?:\])/,/^(?:\{)/,/^(?:\})/,/^(?:=)/,/^(?:!=)/,/^(?:~)/,/^(?:<)/,/^(?:<=)/,/^(?:>)/,/^(?:>=)/,/^(?:\*)/,/^(?:#)/,/^(?:not\b)/,/^(?:and\b)/,/^(?:or\b)/,/^(?:true\b)/,/^(?:false\b)/,/^(?:-?\d+)/,/^(?:"(\\.|[^\\"])*")/,/^(?:'(\\.|[^\\'])*')/,/^(?:\.)/,/^(?:[-\w_:]+)/,/^(?:@@)/,/^(?:$)/],
conditions: {"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27],"inclusive":true}}
};
return lexer;
})();
parser.lexer = lexer;
function Parser () {
  this.yy = {};
}
Parser.prototype = parser;parser.Parser = Parser;
return new Parser;
})();


if (typeof require !== 'undefined' && typeof exports !== 'undefined') {
exports.parser = parser;
exports.Parser = parser.Parser;
exports.parse = function () { return parser.parse.apply(parser, arguments); };
exports.main = function commonjsMain(args) {
    if (!args[1]) {
        console.log('Usage: '+args[0]+' FILE');
        process.exit(1);
    }
    var source = require('fs').readFileSync(require('path').normalize(args[1]), "utf8");
    return exports.parser.parse(source);
};
if (typeof module !== 'undefined' && require.main === module) {
  exports.main(process.argv.slice(1));
}
}
}).call(this,require('_process'))
},{"./ast":1,"./evaluator":2,"_process":16,"fs":12,"path":15}],4:[function(require,module,exports){
(function() {
  exports.capitalize = function(s) {
    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
  };

  exports.capitalizeClass = function(s) {
    return s.split("::").map(exports.capitalize).join("::");
  };

  exports.regExpEscape = function(s) {
    return String(s).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, '\\$1').replace(/\x08/g, '\\x08');
  };

}).call(this);

},{}],5:[function(require,module,exports){
var assert = require("assert");
var types = require("./types");
var n = types.namedTypes;
var isNumber = types.builtInTypes.number;
var isArray = types.builtInTypes.array;
var Path = require("./path");
var Scope = require("./scope");

function NodePath(value, parentPath, name) {
    assert.ok(this instanceof NodePath);
    Path.call(this, value, parentPath, name);
}

require("util").inherits(NodePath, Path);
var NPp = NodePath.prototype;

Object.defineProperties(NPp, {
    node: {
        get: function() {
            Object.defineProperty(this, "node", {
                configurable: true, // Enable deletion.
                value: this._computeNode()
            });

            return this.node;
        }
    },

    parent: {
        get: function() {
            Object.defineProperty(this, "parent", {
                configurable: true, // Enable deletion.
                value: this._computeParent()
            });

            return this.parent;
        }
    },

    scope: {
        get: function() {
            Object.defineProperty(this, "scope", {
                configurable: true, // Enable deletion.
                value: this._computeScope()
            });

            return this.scope;
        }
    }
});

NPp.replace = function() {
    delete this.node;
    delete this.parent;
    delete this.scope;
    return Path.prototype.replace.apply(this, arguments);
};

// The value of the first ancestor Path whose value is a Node.
NPp._computeNode = function() {
    var value = this.value;
    if (n.Node.check(value)) {
        return value;
    }

    var pp = this.parentPath;
    return pp && pp.node || null;
};

// The first ancestor Path whose value is a Node distinct from this.node.
NPp._computeParent = function() {
    var value = this.value;
    var pp = this.parentPath;

    if (!n.Node.check(value)) {
        while (pp && !n.Node.check(pp.value)) {
            pp = pp.parentPath;
        }

        if (pp) {
            pp = pp.parentPath;
        }
    }

    while (pp && !n.Node.check(pp.value)) {
        pp = pp.parentPath;
    }

    return pp || null;
};

// The closest enclosing scope that governs this node.
NPp._computeScope = function() {
    var value = this.value;
    var pp = this.parentPath;
    var scope = pp && pp.scope;

    if (n.Node.check(value) &&
        Scope.isEstablishedBy(value)) {
        scope = new Scope(this, scope);
    }

    return scope || null;
};

NPp.getValueProperty = function(name) {
    return types.getFieldValue(this.value, name);
};

/**
 * Determine whether this.node needs to be wrapped in parentheses in order
 * for a parser to reproduce the same local AST structure.
 *
 * For instance, in the expression `(1 + 2) * 3`, the BinaryExpression
 * whose operator is "+" needs parentheses, because `1 + 2 * 3` would
 * parse differently.
 *
 * If assumeExpressionContext === true, we don't worry about edge cases
 * like an anonymous FunctionExpression appearing lexically first in its
 * enclosing statement and thus needing parentheses to avoid being parsed
 * as a FunctionDeclaration with a missing name.
 */
NPp.needsParens = function(assumeExpressionContext) {
    if (!this.parent)
        return false;

    var node = this.node;

    // If this NodePath object is not the direct owner of this.node, then
    // we do not need parentheses here, though the direct owner might need
    // parentheses.
    if (node !== this.value)
        return false;

    var parent = this.parent.node;

    assert.notStrictEqual(node, parent);

    if (!n.Expression.check(node))
        return false;

    if (isUnaryLike(node))
        return n.MemberExpression.check(parent)
            && this.name === "object"
            && parent.object === node;

    if (isBinary(node)) {
        if (n.CallExpression.check(parent) &&
            this.name === "callee") {
            assert.strictEqual(parent.callee, node);
            return true;
        }

        if (isUnaryLike(parent))
            return true;

        if (n.MemberExpression.check(parent) &&
            this.name === "object") {
            assert.strictEqual(parent.object, node);
            return true;
        }

        if (isBinary(parent)) {
            var po = parent.operator;
            var pp = PRECEDENCE[po];
            var no = node.operator;
            var np = PRECEDENCE[no];

            if (pp > np) {
                return true;
            }

            if (pp === np && this.name === "right") {
                assert.strictEqual(parent.right, node);
                return true;
            }
        }
    }

    if (n.SequenceExpression.check(node)) {
        if (n.ForStatement.check(parent)) {
            // Although parentheses wouldn't hurt around sequence
            // expressions in the head of for loops, traditional style
            // dictates that e.g. i++, j++ should not be wrapped with
            // parentheses.
            return false;
        }

        if (n.ExpressionStatement.check(parent) &&
            this.name === "expression") {
            return false;
        }

        // Otherwise err on the side of overparenthesization, adding
        // explicit exceptions above if this proves overzealous.
        return true;
    }

    if (n.YieldExpression.check(node))
        return isBinary(parent)
            || n.CallExpression.check(parent)
            || n.MemberExpression.check(parent)
            || n.NewExpression.check(parent)
            || n.ConditionalExpression.check(parent)
            || isUnaryLike(parent)
            || n.YieldExpression.check(parent);

    if (n.NewExpression.check(parent) &&
        this.name === "callee") {
        assert.strictEqual(parent.callee, node);
        return containsCallExpression(node);
    }

    if (n.Literal.check(node) &&
        isNumber.check(node.value) &&
        n.MemberExpression.check(parent) &&
        this.name === "object") {
        assert.strictEqual(parent.object, node);
        return true;
    }

    if (n.AssignmentExpression.check(node) ||
        n.ConditionalExpression.check(node)) {
        if (isUnaryLike(parent))
            return true;

        if (isBinary(parent))
            return true;

        if (n.CallExpression.check(parent) &&
            this.name === "callee") {
            assert.strictEqual(parent.callee, node);
            return true;
        }

        if (n.ConditionalExpression.check(parent) &&
            this.name === "test") {
            assert.strictEqual(parent.test, node);
            return true;
        }

        if (n.MemberExpression.check(parent) &&
            this.name === "object") {
            assert.strictEqual(parent.object, node);
            return true;
        }
    }

    if (assumeExpressionContext !== true &&
        !this.canBeFirstInStatement() &&
        this.firstInStatement())
        return true;

    return false;
};

function isBinary(node) {
    return n.BinaryExpression.check(node)
        || n.LogicalExpression.check(node);
}

function isUnaryLike(node) {
    return n.UnaryExpression.check(node)
        // I considered making SpreadElement and SpreadProperty subtypes
        // of UnaryExpression, but they're not really Expression nodes.
        || (n.SpreadElement && n.SpreadElement.check(node))
        || (n.SpreadProperty && n.SpreadProperty.check(node));
}

var PRECEDENCE = {};
[["||"],
 ["&&"],
 ["|"],
 ["^"],
 ["&"],
 ["==", "===", "!=", "!=="],
 ["<", ">", "<=", ">=", "in", "instanceof"],
 [">>", "<<", ">>>"],
 ["+", "-"],
 ["*", "/", "%"]
].forEach(function(tier, i) {
    tier.forEach(function(op) {
        PRECEDENCE[op] = i;
    });
});

function containsCallExpression(node) {
    if (n.CallExpression.check(node)) {
        return true;
    }

    if (isArray.check(node)) {
        return node.some(containsCallExpression);
    }

    if (n.Node.check(node)) {
        return types.someField(node, function(name, child) {
            return containsCallExpression(child);
        });
    }

    return false;
}

NPp.canBeFirstInStatement = function() {
    var node = this.node;
    return !n.FunctionExpression.check(node)
        && !n.ObjectExpression.check(node);
};

NPp.firstInStatement = function() {
    return firstInStatement(this);
};

function firstInStatement(path) {
    for (var node, parent; path.parent; path = path.parent) {
        node = path.node;
        parent = path.parent.node;

        if (n.BlockStatement.check(parent) &&
            path.parent.name === "body" &&
            path.name === 0) {
            assert.strictEqual(parent.body[0], node);
            return true;
        }

        if (n.ExpressionStatement.check(parent) &&
            path.name === "expression") {
            assert.strictEqual(parent.expression, node);
            return true;
        }

        if (n.SequenceExpression.check(parent) &&
            path.parent.name === "expressions" &&
            path.name === 0) {
            assert.strictEqual(parent.expressions[0], node);
            continue;
        }

        if (n.CallExpression.check(parent) &&
            path.name === "callee") {
            assert.strictEqual(parent.callee, node);
            continue;
        }

        if (n.MemberExpression.check(parent) &&
            path.name === "object") {
            assert.strictEqual(parent.object, node);
            continue;
        }

        if (n.ConditionalExpression.check(parent) &&
            path.name === "test") {
            assert.strictEqual(parent.test, node);
            continue;
        }

        if (isBinary(parent) &&
            path.name === "left") {
            assert.strictEqual(parent.left, node);
            continue;
        }

        if (n.UnaryExpression.check(parent) &&
            !parent.prefix &&
            path.name === "argument") {
            assert.strictEqual(parent.argument, node);
            continue;
        }

        return false;
    }

    return true;
}

module.exports = NodePath;

},{"./path":7,"./scope":8,"./types":11,"assert":13,"util":18}],6:[function(require,module,exports){
var assert = require("assert");
var types = require("./types");
var NodePath = require("./node-path");
var Node = types.namedTypes.Node;
var isArray = types.builtInTypes.array;
var isObject = types.builtInTypes.object;
var isFunction = types.builtInTypes.function;
var hasOwn = Object.prototype.hasOwnProperty;
var undefined;

function PathVisitor() {
    assert.ok(this instanceof PathVisitor);
    this._reusableContextStack = [];
    this._methodNameTable = computeMethodNameTable(this);
    this.Context = makeContextConstructor(this);
}

function computeMethodNameTable(visitor) {
    var typeNames = Object.create(null);

    for (var methodName in visitor) {
        if (/^visit[A-Z]/.test(methodName)) {
            typeNames[methodName.slice("visit".length)] = true;
        }
    }

    var supertypeTable = types.computeSupertypeLookupTable(typeNames);
    var methodNameTable = Object.create(null);

    for (var typeName in supertypeTable) {
        if (hasOwn.call(supertypeTable, typeName)) {
            methodName = "visit" + supertypeTable[typeName];
            if (isFunction.check(visitor[methodName])) {
                methodNameTable[typeName] = methodName;
            }
        }
    }

    return methodNameTable;
}

PathVisitor.fromMethodsObject = function fromMethodsObject(methods) {
    if (methods instanceof PathVisitor) {
        return methods;
    }

    if (!isObject.check(methods)) {
        // An empty visitor?
        return new PathVisitor;
    }

    function Visitor() {
        assert.ok(this instanceof Visitor);
        PathVisitor.call(this);
    }

    var Vp = Visitor.prototype = Object.create(PVp);
    Vp.constructor = Visitor;

    extend(Vp, methods);
    extend(Visitor, PathVisitor);

    isFunction.assert(Visitor.fromMethodsObject);
    isFunction.assert(Visitor.visit);

    return new Visitor;
};

function extend(target, source) {
    for (var property in source) {
        if (hasOwn.call(source, property)) {
            target[property] = source[property];
        }
    }

    return target;
}

PathVisitor.visit = function visit(node, methods) {
    var visitor = PathVisitor.fromMethodsObject(methods);

    if (node instanceof NodePath) {
        visitor.visit(node);
        return node.value;
    }

    var rootPath = new NodePath({ root: node });
    visitor.visit(rootPath.get("root"));
    return rootPath.value.root;
};

var PVp = PathVisitor.prototype;

PVp.visit = function(path) {
    if (this instanceof this.Context) {
        // If we somehow end up calling context.visit, then we need to
        // re-invoke the .visit method against context.visitor.
        return this.visitor.visit(path);
    }

    assert.ok(path instanceof NodePath);
    var value = path.value;

    var methodName = Node.check(value) && this._methodNameTable[value.type];
    if (methodName) {
        var context = this.acquireContext(path);
        try {
            context.invokeVisitorMethod(methodName);
        } finally {
            this.releaseContext(context);
        }

    } else {
        // If there was no visitor method to call, visit the children of
        // this node generically.
        visitChildren(path, this);
    }
};

function visitChildren(path, visitor) {
    assert.ok(path instanceof NodePath);
    assert.ok(visitor instanceof PathVisitor);

    var value = path.value;

    if (isArray.check(value)) {
        path.each(visitor.visit, visitor);
    } else if (!isObject.check(value)) {
        // No children to visit.
    } else {
        var name, names = types.getFieldNames(value);
        for (var i = 0, len = names.length; i < len; ++i) {
            if (!hasOwn.call(value, name = names[i])) {
                value[name] = types.getFieldValue(value, name);
            }
            visitor.visit(path.get(name));
        }
    }
}

PVp.acquireContext = function(path) {
    if (this._reusableContextStack.length === 0) {
        return new this.Context(path);
    }
    return this._reusableContextStack.pop().reset(path);
};

PVp.releaseContext = function(context) {
    assert.ok(context instanceof this.Context);
    this._reusableContextStack.push(context);
    context.currentPath = null;
};

function makeContextConstructor(visitor) {
    function Context(path) {
        assert.ok(this instanceof Context);
        assert.ok(this instanceof PathVisitor);
        assert.ok(path instanceof NodePath);

        Object.defineProperty(this, "visitor", {
            value: visitor,
            writable: false,
            enumerable: true,
            configurable: false
        });

        this.currentPath = path;
        this.needToCallTraverse = true;
    }

    assert.ok(visitor instanceof PathVisitor);

    // Note that the visitor object is the prototype of Context.prototype,
    // so all visitor methods are inherited by context objects.
    var Cp = Context.prototype = Object.create(visitor);

    Cp.constructor = Context;
    extend(Cp, sharedContextProtoMethods);

    return Context;
}

// Every PathVisitor has a different this.Context constructor and
// this.Context.prototype object, but those prototypes can all use the
// same reset, invokeVisitorMethod, and traverse function objects.
var sharedContextProtoMethods = Object.create(null);

sharedContextProtoMethods.reset =
function reset(path) {
    assert.ok(this instanceof this.Context);
    assert.ok(path instanceof NodePath);

    this.currentPath = path;
    this.needToCallTraverse = true;

    return this;
};

sharedContextProtoMethods.invokeVisitorMethod =
function invokeVisitorMethod(methodName) {
    assert.ok(this instanceof this.Context);
    assert.ok(this.currentPath instanceof NodePath);

    var result = this.visitor[methodName].call(this, this.currentPath);

    if (result === false) {
        // Visitor methods return false to indicate that they have handled
        // their own traversal needs, and we should not complain if
        // this.needToCallTraverse is still true.
        this.needToCallTraverse = false;

    } else if (result !== undefined) {
        // Any other non-undefined value returned from the visitor method
        // is interpreted as a replacement value.
        this.currentPath = this.currentPath.replace(result)[0];

        if (this.needToCallTraverse) {
            // If this.traverse still hasn't been called, visit the
            // children of the replacement node.
            this.traverse(this.currentPath);
        }
    }

    assert.strictEqual(
        this.needToCallTraverse, false,
        "Must either call this.traverse or return false in " + methodName
    );
};

sharedContextProtoMethods.traverse =
function traverse(path, newVisitor) {
    assert.ok(this instanceof this.Context);
    assert.ok(path instanceof NodePath);
    assert.ok(this.currentPath instanceof NodePath);

    this.needToCallTraverse = false;

    visitChildren(path, PathVisitor.fromMethodsObject(
        newVisitor || this.visitor
    ));
};

module.exports = PathVisitor;

},{"./node-path":5,"./types":11,"assert":13}],7:[function(require,module,exports){
var assert = require("assert");
var Op = Object.prototype;
var hasOwn = Op.hasOwnProperty;
var types = require("./types");
var isArray = types.builtInTypes.array;
var isNumber = types.builtInTypes.number;
var Ap = Array.prototype;
var slice = Ap.slice;
var map = Ap.map;

function Path(value, parentPath, name) {
    assert.ok(this instanceof Path);

    if (parentPath) {
        assert.ok(parentPath instanceof Path);
    } else {
        parentPath = null;
        name = null;
    }

    // The value encapsulated by this Path, generally equal to
    // parentPath.value[name] if we have a parentPath.
    this.value = value;

    // The immediate parent Path of this Path.
    this.parentPath = parentPath;

    // The name of the property of parentPath.value through which this
    // Path's value was reached.
    this.name = name;

    // Calling path.get("child") multiple times always returns the same
    // child Path object, for both performance and consistency reasons.
    this.__childCache = null;
}

var Pp = Path.prototype;

function getChildCache(path) {
    // Lazily create the child cache. This also cheapens cache
    // invalidation, since you can just reset path.__childCache to null.
    return path.__childCache || (path.__childCache = Object.create(null));
}

function getChildPath(path, name) {
    var cache = getChildCache(path);
    var actualChildValue = path.getValueProperty(name);
    var childPath = cache[name];
    if (!hasOwn.call(cache, name) ||
        // Ensure consistency between cache and reality.
        childPath.value !== actualChildValue) {
        childPath = cache[name] = new path.constructor(
            actualChildValue, path, name
        );
    }
    return childPath;
}

// This method is designed to be overridden by subclasses that need to
// handle missing properties, etc.
Pp.getValueProperty = function getValueProperty(name) {
    return this.value[name];
};

Pp.get = function get(name) {
    var path = this;
    var names = arguments;
    var count = names.length;

    for (var i = 0; i < count; ++i) {
        path = getChildPath(path, names[i]);
    }

    return path;
};

Pp.each = function each(callback, context) {
    var childPaths = [];
    var len = this.value.length;
    var i = 0;

    // Collect all the original child paths before invoking the callback.
    for (var i = 0; i < len; ++i) {
        if (hasOwn.call(this.value, i)) {
            childPaths[i] = this.get(i);
        }
    }

    // Invoke the callback on just the original child paths, regardless of
    // any modifications made to the array by the callback. I chose these
    // semantics over cleverly invoking the callback on new elements because
    // this way is much easier to reason about.
    context = context || this;
    for (i = 0; i < len; ++i) {
        if (hasOwn.call(childPaths, i)) {
            callback.call(context, childPaths[i]);
        }
    }
};

Pp.map = function map(callback, context) {
    var result = [];

    this.each(function(childPath) {
        result.push(callback.call(this, childPath));
    }, context);

    return result;
};

Pp.filter = function filter(callback, context) {
    var result = [];

    this.each(function(childPath) {
        if (callback.call(this, childPath)) {
            result.push(childPath);
        }
    }, context);

    return result;
};

function emptyMoves() {}
function getMoves(path, offset, start, end) {
    isArray.assert(path.value);

    if (offset === 0) {
        return emptyMoves;
    }

    var length = path.value.length;
    if (length < 1) {
        return emptyMoves;
    }

    var argc = arguments.length;
    if (argc === 2) {
        start = 0;
        end = length;
    } else if (argc === 3) {
        start = Math.max(start, 0);
        end = length;
    } else {
        start = Math.max(start, 0);
        end = Math.min(end, length);
    }

    isNumber.assert(start);
    isNumber.assert(end);

    var moves = Object.create(null);
    var cache = getChildCache(path);

    for (var i = start; i < end; ++i) {
        if (hasOwn.call(path.value, i)) {
            var childPath = path.get(i);
            assert.strictEqual(childPath.name, i);
            var newIndex = i + offset;
            childPath.name = newIndex;
            moves[newIndex] = childPath;
            delete cache[i];
        }
    }

    delete cache.length;

    return function() {
        for (var newIndex in moves) {
            var childPath = moves[newIndex];
            assert.strictEqual(childPath.name, +newIndex);
            cache[newIndex] = childPath;
            path.value[newIndex] = childPath.value;
        }
    };
}

Pp.shift = function shift() {
    var move = getMoves(this, -1);
    var result = this.value.shift();
    move();
    return result;
};

Pp.unshift = function unshift(node) {
    var move = getMoves(this, arguments.length);
    var result = this.value.unshift.apply(this.value, arguments);
    move();
    return result;
};

Pp.push = function push(node) {
    isArray.assert(this.value);
    delete getChildCache(this).length
    return this.value.push.apply(this.value, arguments);
};

Pp.pop = function pop() {
    isArray.assert(this.value);
    var cache = getChildCache(this);
    delete cache[this.value.length - 1];
    delete cache.length;
    return this.value.pop();
};

Pp.insertAt = function insertAt(index, node) {
    var argc = arguments.length;
    var move = getMoves(this, argc - 1, index);
    if (move === emptyMoves) {
        return this;
    }

    index = Math.max(index, 0);

    for (var i = 1; i < argc; ++i) {
        this.value[index + i - 1] = arguments[i];
    }

    move();

    return this;
};

Pp.insertBefore = function insertBefore(node) {
    var pp = this.parentPath;
    var argc = arguments.length;
    var insertAtArgs = [this.name];
    for (var i = 0; i < argc; ++i) {
        insertAtArgs.push(arguments[i]);
    }
    return pp.insertAt.apply(pp, insertAtArgs);
};

Pp.insertAfter = function insertAfter(node) {
    var pp = this.parentPath;
    var argc = arguments.length;
    var insertAtArgs = [this.name + 1];
    for (var i = 0; i < argc; ++i) {
        insertAtArgs.push(arguments[i]);
    }
    return pp.insertAt.apply(pp, insertAtArgs);
};

function repairRelationshipWithParent(path) {
    assert.ok(path instanceof Path);

    var pp = path.parentPath;
    if (!pp) {
        // Orphan paths have no relationship to repair.
        return path;
    }

    var parentValue = pp.value;
    var parentCache = getChildCache(pp);

    // Make sure parentCache[path.name] is populated.
    if (parentValue[path.name] === path.value) {
        parentCache[path.name] = path;
    } else if (isArray.check(parentValue)) {
        // Something caused path.name to become out of date, so attempt to
        // recover by searching for path.value in parentValue.
        var i = parentValue.indexOf(path.value);
        if (i >= 0) {
            parentCache[path.name = i] = path;
        }
    } else {
        // If path.value disagrees with parentValue[path.name], and
        // path.name is not an array index, let path.value become the new
        // parentValue[path.name] and update parentCache accordingly.
        parentValue[path.name] = path.value;
        parentCache[path.name] = path;
    }

    assert.strictEqual(parentValue[path.name], path.value);
    assert.strictEqual(path.parentPath.get(path.name), path);

    return path;
}

Pp.replace = function replace(replacement) {
    var results = [];
    var parentValue = this.parentPath.value;
    var parentCache = getChildCache(this.parentPath);
    var count = arguments.length;

    repairRelationshipWithParent(this);

    if (isArray.check(parentValue)) {
        var originalLength = parentValue.length;
        var move = getMoves(this.parentPath, count - 1, this.name + 1);

        var spliceArgs = [this.name, 1];
        for (i = 0; i < count; ++i) {
            spliceArgs.push(arguments[i]);
        }

        var splicedOut = parentValue.splice.apply(parentValue, spliceArgs);

        assert.strictEqual(splicedOut[0], this.value);
        assert.strictEqual(
            parentValue.length,
            originalLength - 1 + count
        );

        move();

        if (count === 0) {
            delete this.value;
            delete parentCache[this.name];
            this.__childCache = null;

        } else {
            assert.strictEqual(parentValue[this.name], replacement);

            if (this.value !== replacement) {
                this.value = replacement;
                this.__childCache = null;
            }

            for (i = 0; i < count; ++i) {
                results.push(this.parentPath.get(this.name + i));
            }

            assert.strictEqual(results[0], this);
        }

    } else if (count === 1) {
        if (this.value !== replacement) {
            this.__childCache = null;
        }
        this.value = parentValue[this.name] = replacement;
        results.push(this);

    } else if (count === 0) {
        delete parentValue[this.name];
        delete this.value;
        this.__childCache = null;

        // Leave this path cached as parentCache[this.name], even though
        // it no longer has a value defined.

    } else {
        assert.ok(false, "Could not replace path");
    }

    return results;
};

module.exports = Path;

},{"./types":11,"assert":13}],8:[function(require,module,exports){
var assert = require("assert");
var types = require("./types");
var Type = types.Type;
var namedTypes = types.namedTypes;
var Node = namedTypes.Node;
var isArray = types.builtInTypes.array;
var hasOwn = Object.prototype.hasOwnProperty;
var b = types.builders;

function Scope(path, parentScope) {
    assert.ok(this instanceof Scope);
    assert.ok(path instanceof require("./node-path"));
    ScopeType.assert(path.value);

    var depth;

    if (parentScope) {
        assert.ok(parentScope instanceof Scope);
        depth = parentScope.depth + 1;
    } else {
        parentScope = null;
        depth = 0;
    }

    Object.defineProperties(this, {
        path: { value: path },
        node: { value: path.value },
        isGlobal: { value: !parentScope, enumerable: true },
        depth: { value: depth },
        parent: { value: parentScope },
        bindings: { value: {} }
    });
}

var scopeTypes = [
    // Program nodes introduce global scopes.
    namedTypes.Program,

    // Function is the supertype of FunctionExpression,
    // FunctionDeclaration, ArrowExpression, etc.
    namedTypes.Function,

    // In case you didn't know, the caught parameter shadows any variable
    // of the same name in an outer scope.
    namedTypes.CatchClause
];

var ScopeType = Type.or.apply(Type, scopeTypes);

Scope.isEstablishedBy = function(node) {
    return ScopeType.check(node);
};

var Sp = Scope.prototype;

// Will be overridden after an instance lazily calls scanScope.
Sp.didScan = false;

Sp.declares = function(name) {
    this.scan();
    return hasOwn.call(this.bindings, name);
};

Sp.declareTemporary = function(prefix) {
    if (prefix) {
        assert.ok(/^[a-z$_]/i.test(prefix), prefix);
    } else {
        prefix = "t$";
    }

    // Include this.depth in the name to make sure the name does not
    // collide with any variables in nested/enclosing scopes.
    prefix += this.depth.toString(36) + "$";

    this.scan();

    var index = 0;
    while (this.declares(prefix + index)) {
        ++index;
    }

    var name = prefix + index;
    return this.bindings[name] = types.builders.identifier(name);
};

Sp.injectTemporary = function(identifier, init) {
    identifier || (identifier = this.declareTemporary());

    var bodyPath = this.path.get("body");
    if (namedTypes.BlockStatement.check(bodyPath.value)) {
        bodyPath = bodyPath.get("body");
    }

    bodyPath.unshift(
        b.variableDeclaration(
            "var",
            [b.variableDeclarator(identifier, init || null)]
        )
    );

    return identifier;
};

Sp.scan = function(force) {
    if (force || !this.didScan) {
        for (var name in this.bindings) {
            // Empty out this.bindings, just in cases.
            delete this.bindings[name];
        }
        scanScope(this.path, this.bindings);
        this.didScan = true;
    }
};

Sp.getBindings = function () {
    this.scan();
    return this.bindings;
};

function scanScope(path, bindings) {
    var node = path.value;
    ScopeType.assert(node);

    if (namedTypes.CatchClause.check(node)) {
        // A catch clause establishes a new scope but the only variable
        // bound in that scope is the catch parameter. Any other
        // declarations create bindings in the outer scope.
        addPattern(path.get("param"), bindings);

    } else {
        recursiveScanScope(path, bindings);
    }
}

function recursiveScanScope(path, bindings) {
    var node = path.value;

    if (path.parent &&
        namedTypes.FunctionExpression.check(path.parent.node) &&
        path.parent.node.id) {
        addPattern(path.parent.get("id"), bindings);

    } else if (isArray.check(node)) {
        path.each(function(childPath) {
            recursiveScanChild(childPath, bindings);
        });

    } else if (namedTypes.Function.check(node)) {
        path.get("params").each(function(paramPath) {
            addPattern(paramPath, bindings);
        });

        recursiveScanChild(path.get("body"), bindings);

    } else if (namedTypes.VariableDeclarator.check(node)) {
        addPattern(path.get("id"), bindings);
        recursiveScanChild(path.get("init"), bindings);

    } else if (namedTypes.ImportSpecifier &&
               namedTypes.ImportSpecifier.check(node)) {
        addPattern(
          node.name ? path.get("name") : path.get("id"),
          bindings
        );

    } else if (namedTypes.ModuleDeclaration &&
               namedTypes.ModuleDeclaration.check(node)) {
        addPattern(path.get("id"), bindings);

    } else if (Node.check(node)) {
        types.eachField(node, function(name, child) {
            var childPath = path.get(name);
            assert.strictEqual(childPath.value, child);
            recursiveScanChild(childPath, bindings);
        });
    }
}

function recursiveScanChild(path, bindings) {
    var node = path.value;

    if (namedTypes.FunctionDeclaration.check(node)) {
        addPattern(path.get("id"), bindings);

    } else if (namedTypes.ClassDeclaration &&
               namedTypes.ClassDeclaration.check(node)) {
        addPattern(path.get("id"), bindings);

    } else if (Scope.isEstablishedBy(node)) {
        if (namedTypes.CatchClause.check(node)) {
            var catchParamName = node.param.name;
            var hadBinding = hasOwn.call(bindings, catchParamName);

            // Any declarations that occur inside the catch body that do
            // not have the same name as the catch parameter should count
            // as bindings in the outer scope.
            recursiveScanScope(path.get("body"), bindings);

            // If a new binding matching the catch parameter name was
            // created while scanning the catch body, ignore it because it
            // actually refers to the catch parameter and not the outer
            // scope that we're currently scanning.
            if (!hadBinding) {
                delete bindings[catchParamName];
            }
        }

    } else {
        recursiveScanScope(path, bindings);
    }
}

function addPattern(patternPath, bindings) {
    var pattern = patternPath.value;
    namedTypes.Pattern.assert(pattern);

    if (namedTypes.Identifier.check(pattern)) {
        if (hasOwn.call(bindings, pattern.name)) {
            bindings[pattern.name].push(patternPath);
        } else {
            bindings[pattern.name] = [patternPath];
        }

    } else if (namedTypes.SpreadElement &&
               namedTypes.SpreadElement.check(pattern)) {
        addPattern(patternPath.get("argument"), bindings);
    }
}

Sp.lookup = function(name) {
    for (var scope = this; scope; scope = scope.parent)
        if (scope.declares(name))
            break;
    return scope;
};

Sp.getGlobalScope = function() {
    var scope = this;
    while (!scope.isGlobal)
        scope = scope.parent;
    return scope;
};

module.exports = Scope;

},{"./node-path":5,"./types":11,"assert":13}],9:[function(require,module,exports){
var types = require("../lib/types");
var Type = types.Type;
var builtin = types.builtInTypes;
var isNumber = builtin.number;

// An example of constructing a new type with arbitrary constraints from
// an existing type.
exports.geq = function(than) {
    return new Type(function(value) {
        return isNumber.check(value) && value >= than;
    }, isNumber + " >= " + than);
};

// Default value-returning functions that may optionally be passed as a
// third argument to Def.prototype.field.
exports.defaults = {
    // Functions were used because (among other reasons) that's the most
    // elegant way to allow for the emptyArray one always to give a new
    // array instance.
    "null": function() { return null },
    "emptyArray": function() { return [] },
    "false": function() { return false },
    "true": function() { return true },
    "undefined": function() {}
};

var naiveIsPrimitive = Type.or(
    builtin.string,
    builtin.number,
    builtin.boolean,
    builtin.null,
    builtin.undefined
);

exports.isPrimitive = new Type(function(value) {
    if (value === null)
        return true;
    var type = typeof value;
    return !(type === "object" ||
             type === "function");
}, naiveIsPrimitive.toString());

},{"../lib/types":11}],10:[function(require,module,exports){
var visit = require("./path-visitor").visit;
var warnedAboutDeprecation = false;

function traverseWithFullPathInfo(node, callback) {
    if (!warnedAboutDeprecation) {
        warnedAboutDeprecation = true;
        console.warn(
            "\033[33m", // yellow
            'DEPRECATED(ast-types): Please use require("ast-types").visit ' +
                "instead of .traverse for syntax tree manipulation." +
            "\033[0m" // reset
        );
    }

    return visit(node, {
        visitNode: function(path) {
            if (callback.call(path, path.value) !== false) {
                this.traverse(path);
            }

            return false;
        }
    });
}

traverseWithFullPathInfo.fast = traverseWithFullPathInfo;
module.exports = traverseWithFullPathInfo;

},{"./path-visitor":6}],11:[function(require,module,exports){
var assert = require("assert");
var Ap = Array.prototype;
var slice = Ap.slice;
var map = Ap.map;
var each = Ap.forEach;
var Op = Object.prototype;
var objToStr = Op.toString;
var funObjStr = objToStr.call(function(){});
var strObjStr = objToStr.call("");
var hasOwn = Op.hasOwnProperty;

// A type is an object with a .check method that takes a value and returns
// true or false according to whether the value matches the type.

function Type(check, name) {
    var self = this;
    assert.ok(self instanceof Type, self);

    // Unfortunately we can't elegantly reuse isFunction and isString,
    // here, because this code is executed while defining those types.
    assert.strictEqual(objToStr.call(check), funObjStr,
                       check + " is not a function");

    // The `name` parameter can be either a function or a string.
    var nameObjStr = objToStr.call(name);
    assert.ok(nameObjStr === funObjStr ||
              nameObjStr === strObjStr,
              name + " is neither a function nor a string");

    Object.defineProperties(self, {
        name: { value: name },
        check: {
            value: function(value, deep) {
                var result = check.call(self, value, deep);
                if (!result && deep && objToStr.call(deep) === funObjStr)
                    deep(self, value);
                return result;
            }
        }
    });
}

var Tp = Type.prototype;

// Throughout this file we use Object.defineProperty to prevent
// redefinition of exported properties.
exports.Type = Type;

// Like .check, except that failure triggers an AssertionError.
Tp.assert = function(value, deep) {
    if (!this.check(value, deep)) {
        var str = shallowStringify(value);
        assert.ok(false, str + " does not match type " + this);
        return false;
    }
    return true;
};

function shallowStringify(value) {
    if (isObject.check(value))
        return "{" + Object.keys(value).map(function(key) {
            return key + ": " + value[key];
        }).join(", ") + "}";

    if (isArray.check(value))
        return "[" + value.map(shallowStringify).join(", ") + "]";

    return JSON.stringify(value);
}

Tp.toString = function() {
    var name = this.name;

    if (isString.check(name))
        return name;

    if (isFunction.check(name))
        return name.call(this) + "";

    return name + " type";
};

var builtInTypes = {};
exports.builtInTypes = builtInTypes;

function defBuiltInType(example, name) {
    var objStr = objToStr.call(example);

    Object.defineProperty(builtInTypes, name, {
        enumerable: true,
        value: new Type(function(value) {
            return objToStr.call(value) === objStr;
        }, name)
    });

    return builtInTypes[name];
}

// These types check the underlying [[Class]] attribute of the given
// value, rather than using the problematic typeof operator. Note however
// that no subtyping is considered; so, for instance, isObject.check
// returns false for [], /./, new Date, and null.
var isString = defBuiltInType("", "string");
var isFunction = defBuiltInType(function(){}, "function");
var isArray = defBuiltInType([], "array");
var isObject = defBuiltInType({}, "object");
var isRegExp = defBuiltInType(/./, "RegExp");
var isDate = defBuiltInType(new Date, "Date");
var isNumber = defBuiltInType(3, "number");
var isBoolean = defBuiltInType(true, "boolean");
var isNull = defBuiltInType(null, "null");
var isUndefined = defBuiltInType(void 0, "undefined");

// There are a number of idiomatic ways of expressing types, so this
// function serves to coerce them all to actual Type objects. Note that
// providing the name argument is not necessary in most cases.
function toType(from, name) {
    // The toType function should of course be idempotent.
    if (from instanceof Type)
        return from;

    // The Def type is used as a helper for constructing compound
    // interface types for AST nodes.
    if (from instanceof Def)
        return from.type;

    // Support [ElemType] syntax.
    if (isArray.check(from))
        return Type.fromArray(from);

    // Support { someField: FieldType, ... } syntax.
    if (isObject.check(from))
        return Type.fromObject(from);

    // If isFunction.check(from), assume that from is a binary predicate
    // function we can use to define the type.
    if (isFunction.check(from))
        return new Type(from, name);

    // As a last resort, toType returns a type that matches any value that
    // is === from. This is primarily useful for literal values like
    // toType(null), but it has the additional advantage of allowing
    // toType to be a total function.
    return new Type(function(value) {
        return value === from;
    }, isUndefined.check(name) ? function() {
        return from + "";
    } : name);
}

// Returns a type that matches the given value iff any of type1, type2,
// etc. match the value.
Type.or = function(/* type1, type2, ... */) {
    var types = [];
    var len = arguments.length;
    for (var i = 0; i < len; ++i)
        types.push(toType(arguments[i]));

    return new Type(function(value, deep) {
        for (var i = 0; i < len; ++i)
            if (types[i].check(value, deep))
                return true;
        return false;
    }, function() {
        return types.join(" | ");
    });
};

Type.fromArray = function(arr) {
    assert.ok(isArray.check(arr));
    assert.strictEqual(
        arr.length, 1,
        "only one element type is permitted for typed arrays");
    return toType(arr[0]).arrayOf();
};

Tp.arrayOf = function() {
    var elemType = this;
    return new Type(function(value, deep) {
        return isArray.check(value) && value.every(function(elem) {
            return elemType.check(elem, deep);
        });
    }, function() {
        return "[" + elemType + "]";
    });
};

Type.fromObject = function(obj) {
    var fields = Object.keys(obj).map(function(name) {
        return new Field(name, obj[name]);
    });

    return new Type(function(value, deep) {
        return isObject.check(value) && fields.every(function(field) {
            return field.type.check(value[field.name], deep);
        });
    }, function() {
        return "{ " + fields.join(", ") + " }";
    });
};

function Field(name, type, defaultFn, hidden) {
    var self = this;

    assert.ok(self instanceof Field);
    isString.assert(name);

    type = toType(type);

    var properties = {
        name: { value: name },
        type: { value: type },
        hidden: { value: !!hidden }
    };

    if (isFunction.check(defaultFn)) {
        properties.defaultFn = { value: defaultFn };
    }

    Object.defineProperties(self, properties);
}

var Fp = Field.prototype;

Fp.toString = function() {
    return JSON.stringify(this.name) + ": " + this.type;
};

Fp.getValue = function(obj) {
    var value = obj[this.name];

    if (!isUndefined.check(value))
        return value;

    if (this.defaultFn)
        value = this.defaultFn.call(obj);

    return value;
};

// Define a type whose name is registered in a namespace (the defCache) so
// that future definitions will return the same type given the same name.
// In particular, this system allows for circular and forward definitions.
// The Def object d returned from Type.def may be used to configure the
// type d.type by calling methods such as d.bases, d.build, and d.field.
Type.def = function(typeName) {
    isString.assert(typeName);
    return hasOwn.call(defCache, typeName)
        ? defCache[typeName]
        : defCache[typeName] = new Def(typeName);
};

// In order to return the same Def instance every time Type.def is called
// with a particular name, those instances need to be stored in a cache.
var defCache = Object.create(null);

function Def(typeName) {
    var self = this;
    assert.ok(self instanceof Def);

    Object.defineProperties(self, {
        typeName: { value: typeName },
        baseNames: { value: [] },
        ownFields: { value: Object.create(null) },

        // These two are populated during finalization.
        allSupertypes: { value: Object.create(null) }, // Includes own typeName.
        supertypeList: { value: [] }, // Linear inheritance hierarchy.
        allFields: { value: Object.create(null) }, // Includes inherited fields.
        fieldNames: { value: [] }, // Non-hidden keys of allFields.

        type: {
            value: new Type(function(value, deep) {
                return self.check(value, deep);
            }, typeName)
        }
    });
}

Def.fromValue = function(value) {
    if (value && typeof value === "object") {
        var type = value.type;
        if (typeof type === "string" &&
            hasOwn.call(defCache, type)) {
            var d = defCache[type];
            if (d.finalized) {
                return d;
            }
        }
    }

    return null;
};

var Dp = Def.prototype;

Dp.isSupertypeOf = function(that) {
    if (that instanceof Def) {
        assert.strictEqual(this.finalized, true);
        assert.strictEqual(that.finalized, true);
        return hasOwn.call(that.allSupertypes, this.typeName);
    } else {
        assert.ok(false, that + " is not a Def");
    }
};

// Note that the list returned by this function is a copy of the internal
// supertypeList, *without* the typeName itself as the first element.
exports.getSupertypeNames = function(typeName) {
    assert.ok(hasOwn.call(defCache, typeName));
    var d = defCache[typeName];
    assert.strictEqual(d.finalized, true);
    return d.supertypeList.slice(1);
};

// Returns an object mapping from every known type in the defCache to the
// most specific supertype whose name is an own property of the candidates
// object.
exports.computeSupertypeLookupTable = function(candidates) {
    var table = {};

    for (var typeName in defCache) {
        if (hasOwn.call(defCache, typeName)) {
            var d = defCache[typeName];
            assert.strictEqual(d.finalized, true);
            for (var i = 0; i < d.supertypeList.length; ++i) {
                var superTypeName = d.supertypeList[i];
                if (hasOwn.call(candidates, superTypeName)) {
                    table[typeName] = superTypeName;
                    break;
                }
            }
        }
    }

    return table;
};

Dp.checkAllFields = function(value, deep) {
    var allFields = this.allFields;
    assert.strictEqual(this.finalized, true);

    function checkFieldByName(name) {
        var field = allFields[name];
        var type = field.type;
        var child = field.getValue(value);
        return type.check(child, deep);
    }

    return isObject.check(value)
        && Object.keys(allFields).every(checkFieldByName);
};

Dp.check = function(value, deep) {
    assert.strictEqual(
        this.finalized, true,
        "prematurely checking unfinalized type " + this.typeName);

    // A Def type can only match an object value.
    if (!isObject.check(value))
        return false;

    var vDef = Def.fromValue(value);
    if (!vDef) {
        // If we couldn't infer the Def associated with the given value,
        // and we expected it to be a SourceLocation or a Position, it was
        // probably just missing a "type" field (because Esprima does not
        // assign a type property to such nodes). Be optimistic and let
        // this.checkAllFields make the final decision.
        if (this.typeName === "SourceLocation" ||
            this.typeName === "Position") {
            return this.checkAllFields(value, deep);
        }

        // Calling this.checkAllFields for any other type of node is both
        // bad for performance and way too forgiving.
        return false;
    }

    // If checking deeply and vDef === this, then we only need to call
    // checkAllFields once. Calling checkAllFields is too strict when deep
    // is false, because then we only care about this.isSupertypeOf(vDef).
    if (deep && vDef === this)
        return this.checkAllFields(value, deep);

    // In most cases we rely exclusively on isSupertypeOf to make O(1)
    // subtyping determinations. This suffices in most situations outside
    // of unit tests, since interface conformance is checked whenever new
    // instances are created using builder functions.
    if (!this.isSupertypeOf(vDef))
        return false;

    // The exception is when deep is true; then, we recursively check all
    // fields.
    if (!deep)
        return true;

    // Use the more specific Def (vDef) to perform the deep check, but
    // shallow-check fields defined by the less specific Def (this).
    return vDef.checkAllFields(value, deep)
        && this.checkAllFields(value, false);
};

Dp.bases = function() {
    var bases = this.baseNames;

    assert.strictEqual(this.finalized, false);

    each.call(arguments, function(baseName) {
        isString.assert(baseName);

        // This indexOf lookup may be O(n), but the typical number of base
        // names is very small, and indexOf is a native Array method.
        if (bases.indexOf(baseName) < 0)
            bases.push(baseName);
    });

    return this; // For chaining.
};

// False by default until .build(...) is called on an instance.
Object.defineProperty(Dp, "buildable", { value: false });

var builders = {};
exports.builders = builders;

// This object is used as prototype for any node created by a builder.
var nodePrototype = {};

// Call this function to define a new method to be shared by all AST
// nodes. The replaced method (if any) is returned for easy wrapping.
exports.defineMethod = function(name, func) {
    var old = nodePrototype[name];

    // Pass undefined as func to delete nodePrototype[name].
    if (isUndefined.check(func)) {
        delete nodePrototype[name];

    } else {
        isFunction.assert(func);

        Object.defineProperty(nodePrototype, name, {
            enumerable: true, // For discoverability.
            configurable: true, // For delete proto[name].
            value: func
        });
    }

    return old;
};

// Calling the .build method of a Def simultaneously marks the type as
// buildable (by defining builders[getBuilderName(typeName)]) and
// specifies the order of arguments that should be passed to the builder
// function to create an instance of the type.
Dp.build = function(/* param1, param2, ... */) {
    var self = this;

    // Calling Def.prototype.build multiple times has the effect of merely
    // redefining this property.
    Object.defineProperty(self, "buildParams", {
        value: slice.call(arguments),
        writable: false,
        enumerable: false,
        configurable: true
    });

    assert.strictEqual(self.finalized, false);
    isString.arrayOf().assert(self.buildParams);

    if (self.buildable) {
        // If this Def is already buildable, update self.buildParams and
        // continue using the old builder function.
        return self;
    }

    // Every buildable type will have its "type" field filled in
    // automatically. This includes types that are not subtypes of Node,
    // like SourceLocation, but that seems harmless (TODO?).
    self.field("type", self.typeName, function() { return self.typeName });

    // Override Dp.buildable for this Def instance.
    Object.defineProperty(self, "buildable", { value: true });

    Object.defineProperty(builders, getBuilderName(self.typeName), {
        enumerable: true,

        value: function() {
            var args = arguments;
            var argc = args.length;
            var built = Object.create(nodePrototype);

            assert.ok(
                self.finalized,
                "attempting to instantiate unfinalized type " + self.typeName);

            function add(param, i) {
                if (hasOwn.call(built, param))
                    return;

                var all = self.allFields;
                assert.ok(hasOwn.call(all, param), param);

                var field = all[param];
                var type = field.type;
                var value;

                if (isNumber.check(i) && i < argc) {
                    value = args[i];
                } else if (field.defaultFn) {
                    // Expose the partially-built object to the default
                    // function as its `this` object.
                    value = field.defaultFn.call(built);
                } else {
                    var message = "no value or default function given for field " +
                        JSON.stringify(param) + " of " + self.typeName + "(" +
                            self.buildParams.map(function(name) {
                                return all[name];
                            }).join(", ") + ")";
                    assert.ok(false, message);
                }

                assert.ok(
                    type.check(value),
                    shallowStringify(value) +
                        " does not match field " + field +
                        " of type " + self.typeName);

                // TODO Could attach getters and setters here to enforce
                // dynamic type safety.
                built[param] = value;
            }

            self.buildParams.forEach(function(param, i) {
                add(param, i);
            });

            Object.keys(self.allFields).forEach(function(param) {
                add(param); // Use the default value.
            });

            // Make sure that the "type" field was filled automatically.
            assert.strictEqual(built.type, self.typeName);

            return built;
        }
    });

    return self; // For chaining.
};

function getBuilderName(typeName) {
    return typeName.replace(/^[A-Z]+/, function(upperCasePrefix) {
        var len = upperCasePrefix.length;
        switch (len) {
        case 0: return "";
        // If there's only one initial capital letter, just lower-case it.
        case 1: return upperCasePrefix.toLowerCase();
        default:
            // If there's more than one initial capital letter, lower-case
            // all but the last one, so that XMLDefaultDeclaration (for
            // example) becomes xmlDefaultDeclaration.
            return upperCasePrefix.slice(
                0, len - 1).toLowerCase() +
                upperCasePrefix.charAt(len - 1);
        }
    });
}

// The reason fields are specified using .field(...) instead of an object
// literal syntax is somewhat subtle: the object literal syntax would
// support only one key and one value, but with .field(...) we can pass
// any number of arguments to specify the field.
Dp.field = function(name, type, defaultFn, hidden) {
    assert.strictEqual(this.finalized, false);
    this.ownFields[name] = new Field(name, type, defaultFn, hidden);
    return this; // For chaining.
};

var namedTypes = {};
exports.namedTypes = namedTypes;

// Like Object.keys, but aware of what fields each AST type should have.
function getFieldNames(object) {
    var d = Def.fromValue(object);
    if (d) {
        return d.fieldNames.slice(0);
    }

    assert.strictEqual(
        "type" in object, false,
        "did not recognize object of type " +
            JSON.stringify(object.type)
    );

    return Object.keys(object);
}
exports.getFieldNames = getFieldNames;

// Get the value of an object property, taking object.type and default
// functions into account.
function getFieldValue(object, fieldName) {
    var d = Def.fromValue(object);
    if (d) {
        var field = d.allFields[fieldName];
        if (field) {
            return field.getValue(object);
        }
    }

    return object[fieldName];
}
exports.getFieldValue = getFieldValue;

// Iterate over all defined fields of an object, including those missing
// or undefined, passing each field name and effective value (as returned
// by getFieldValue) to the callback. If the object has no corresponding
// Def, the callback will never be called.
exports.eachField = function(object, callback, context) {
    getFieldNames(object).forEach(function(name) {
        callback.call(this, name, getFieldValue(object, name));
    }, context);
};

// Similar to eachField, except that iteration stops as soon as the
// callback returns a truthy value. Like Array.prototype.some, the final
// result is either true or false to indicates whether the callback
// returned true for any element or not.
exports.someField = function(object, callback, context) {
    return getFieldNames(object).some(function(name) {
        return callback.call(this, name, getFieldValue(object, name));
    }, context);
};

// This property will be overridden as true by individual Def instances
// when they are finalized.
Object.defineProperty(Dp, "finalized", { value: false });

Dp.finalize = function() {
    // It's not an error to finalize a type more than once, but only the
    // first call to .finalize does anything.
    if (!this.finalized) {
        var allFields = this.allFields;
        var allSupertypes = this.allSupertypes;

        this.baseNames.forEach(function(name) {
            var def = defCache[name];
            def.finalize();
            extend(allFields, def.allFields);
            extend(allSupertypes, def.allSupertypes);
        });

        // TODO Warn if fields are overridden with incompatible types.
        extend(allFields, this.ownFields);
        allSupertypes[this.typeName] = this;

        this.fieldNames.length = 0;
        for (var fieldName in allFields) {
            if (hasOwn.call(allFields, fieldName) &&
                !allFields[fieldName].hidden) {
                this.fieldNames.push(fieldName);
            }
        }

        // Types are exported only once they have been finalized.
        Object.defineProperty(namedTypes, this.typeName, {
            enumerable: true,
            value: this.type
        });

        Object.defineProperty(this, "finalized", { value: true });

        // A linearization of the inheritance hierarchy.
        populateSupertypeList(this.typeName, this.supertypeList);
    }
};

function populateSupertypeList(typeName, list) {
    list.length = 0;
    list.push(typeName);

    var lastSeen = Object.create(null);

    for (var pos = 0; pos < list.length; ++pos) {
        typeName = list[pos];
        var d = defCache[typeName];
        assert.strictEqual(d.finalized, true);

        // If we saw typeName earlier in the breadth-first traversal,
        // delete the last-seen occurrence.
        if (hasOwn.call(lastSeen, typeName)) {
            delete list[lastSeen[typeName]];
        }

        // Record the new index of the last-seen occurrence of typeName.
        lastSeen[typeName] = pos;

        // Enqueue the base names of this type.
        list.push.apply(list, d.baseNames);
    }

    // Compaction loop to remove array holes.
    for (var to = 0, from = to, len = list.length; from < len; ++from) {
        if (hasOwn.call(list, from)) {
            list[to++] = list[from];
        }
    }

    list.length = to;
}

function extend(into, from) {
    Object.keys(from).forEach(function(name) {
        into[name] = from[name];
    });

    return into;
};

exports.finalize = function() {
    Object.keys(defCache).forEach(function(name) {
        defCache[name].finalize();
    });
};

},{"assert":13}],12:[function(require,module,exports){

},{}],13:[function(require,module,exports){
// http://wiki.commonjs.org/wiki/Unit_Testing/1.0
//
// THIS IS NOT TESTED NOR LIKELY TO WORK OUTSIDE V8!
//
// Originally from narwhal.js (http://narwhaljs.org)
// Copyright (c) 2009 Thomas Robinson <280north.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the 'Software'), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
// ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

// when used in node, this will actually load the util module we depend on
// versus loading the builtin util module as happens otherwise
// this is a bug in node module loading as far as I am concerned
var util = require('util/');

var pSlice = Array.prototype.slice;
var hasOwn = Object.prototype.hasOwnProperty;

// 1. The assert module provides functions that throw
// AssertionError's when particular conditions are not met. The
// assert module must conform to the following interface.

var assert = module.exports = ok;

// 2. The AssertionError is defined in assert.
// new assert.AssertionError({ message: message,
//                             actual: actual,
//                             expected: expected })

assert.AssertionError = function AssertionError(options) {
  this.name = 'AssertionError';
  this.actual = options.actual;
  this.expected = options.expected;
  this.operator = options.operator;
  if (options.message) {
    this.message = options.message;
    this.generatedMessage = false;
  } else {
    this.message = getMessage(this);
    this.generatedMessage = true;
  }
  var stackStartFunction = options.stackStartFunction || fail;

  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, stackStartFunction);
  }
  else {
    // non v8 browsers so we can have a stacktrace
    var err = new Error();
    if (err.stack) {
      var out = err.stack;

      // try to strip useless frames
      var fn_name = stackStartFunction.name;
      var idx = out.indexOf('\n' + fn_name);
      if (idx >= 0) {
        // once we have located the function frame
        // we need to strip out everything before it (and its line)
        var next_line = out.indexOf('\n', idx + 1);
        out = out.substring(next_line + 1);
      }

      this.stack = out;
    }
  }
};

// assert.AssertionError instanceof Error
util.inherits(assert.AssertionError, Error);

function replacer(key, value) {
  if (util.isUndefined(value)) {
    return '' + value;
  }
  if (util.isNumber(value) && (isNaN(value) || !isFinite(value))) {
    return value.toString();
  }
  if (util.isFunction(value) || util.isRegExp(value)) {
    return value.toString();
  }
  return value;
}

function truncate(s, n) {
  if (util.isString(s)) {
    return s.length < n ? s : s.slice(0, n);
  } else {
    return s;
  }
}

function getMessage(self) {
  return truncate(JSON.stringify(self.actual, replacer), 128) + ' ' +
         self.operator + ' ' +
         truncate(JSON.stringify(self.expected, replacer), 128);
}

// At present only the three keys mentioned above are used and
// understood by the spec. Implementations or sub modules can pass
// other keys to the AssertionError's constructor - they will be
// ignored.

// 3. All of the following functions must throw an AssertionError
// when a corresponding condition is not met, with a message that
// may be undefined if not provided.  All assertion methods provide
// both the actual and expected values to the assertion error for
// display purposes.

function fail(actual, expected, message, operator, stackStartFunction) {
  throw new assert.AssertionError({
    message: message,
    actual: actual,
    expected: expected,
    operator: operator,
    stackStartFunction: stackStartFunction
  });
}

// EXTENSION! allows for well behaved errors defined elsewhere.
assert.fail = fail;

// 4. Pure assertion tests whether a value is truthy, as determined
// by !!guard.
// assert.ok(guard, message_opt);
// This statement is equivalent to assert.equal(true, !!guard,
// message_opt);. To test strictly for the value true, use
// assert.strictEqual(true, guard, message_opt);.

function ok(value, message) {
  if (!value) fail(value, true, message, '==', assert.ok);
}
assert.ok = ok;

// 5. The equality assertion tests shallow, coercive equality with
// ==.
// assert.equal(actual, expected, message_opt);

assert.equal = function equal(actual, expected, message) {
  if (actual != expected) fail(actual, expected, message, '==', assert.equal);
};

// 6. The non-equality assertion tests for whether two objects are not equal
// with != assert.notEqual(actual, expected, message_opt);

assert.notEqual = function notEqual(actual, expected, message) {
  if (actual == expected) {
    fail(actual, expected, message, '!=', assert.notEqual);
  }
};

// 7. The equivalence assertion tests a deep equality relation.
// assert.deepEqual(actual, expected, message_opt);

assert.deepEqual = function deepEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected)) {
    fail(actual, expected, message, 'deepEqual', assert.deepEqual);
  }
};

function _deepEqual(actual, expected) {
  // 7.1. All identical values are equivalent, as determined by ===.
  if (actual === expected) {
    return true;

  } else if (util.isBuffer(actual) && util.isBuffer(expected)) {
    if (actual.length != expected.length) return false;

    for (var i = 0; i < actual.length; i++) {
      if (actual[i] !== expected[i]) return false;
    }

    return true;

  // 7.2. If the expected value is a Date object, the actual value is
  // equivalent if it is also a Date object that refers to the same time.
  } else if (util.isDate(actual) && util.isDate(expected)) {
    return actual.getTime() === expected.getTime();

  // 7.3 If the expected value is a RegExp object, the actual value is
  // equivalent if it is also a RegExp object with the same source and
  // properties (`global`, `multiline`, `lastIndex`, `ignoreCase`).
  } else if (util.isRegExp(actual) && util.isRegExp(expected)) {
    return actual.source === expected.source &&
           actual.global === expected.global &&
           actual.multiline === expected.multiline &&
           actual.lastIndex === expected.lastIndex &&
           actual.ignoreCase === expected.ignoreCase;

  // 7.4. Other pairs that do not both pass typeof value == 'object',
  // equivalence is determined by ==.
  } else if (!util.isObject(actual) && !util.isObject(expected)) {
    return actual == expected;

  // 7.5 For all other Object pairs, including Array objects, equivalence is
  // determined by having the same number of owned properties (as verified
  // with Object.prototype.hasOwnProperty.call), the same set of keys
  // (although not necessarily the same order), equivalent values for every
  // corresponding key, and an identical 'prototype' property. Note: this
  // accounts for both named and indexed properties on Arrays.
  } else {
    return objEquiv(actual, expected);
  }
}

function isArguments(object) {
  return Object.prototype.toString.call(object) == '[object Arguments]';
}

function objEquiv(a, b) {
  if (util.isNullOrUndefined(a) || util.isNullOrUndefined(b))
    return false;
  // an identical 'prototype' property.
  if (a.prototype !== b.prototype) return false;
  //~~~I've managed to break Object.keys through screwy arguments passing.
  //   Converting to array solves the problem.
  if (isArguments(a)) {
    if (!isArguments(b)) {
      return false;
    }
    a = pSlice.call(a);
    b = pSlice.call(b);
    return _deepEqual(a, b);
  }
  try {
    var ka = objectKeys(a),
        kb = objectKeys(b),
        key, i;
  } catch (e) {//happens when one is a string literal and the other isn't
    return false;
  }
  // having the same number of owned properties (keys incorporates
  // hasOwnProperty)
  if (ka.length != kb.length)
    return false;
  //the same set of keys (although not necessarily the same order),
  ka.sort();
  kb.sort();
  //~~~cheap key test
  for (i = ka.length - 1; i >= 0; i--) {
    if (ka[i] != kb[i])
      return false;
  }
  //equivalent values for every corresponding key, and
  //~~~possibly expensive deep test
  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!_deepEqual(a[key], b[key])) return false;
  }
  return true;
}

// 8. The non-equivalence assertion tests for any deep inequality.
// assert.notDeepEqual(actual, expected, message_opt);

assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
  if (_deepEqual(actual, expected)) {
    fail(actual, expected, message, 'notDeepEqual', assert.notDeepEqual);
  }
};

// 9. The strict equality assertion tests strict equality, as determined by ===.
// assert.strictEqual(actual, expected, message_opt);

assert.strictEqual = function strictEqual(actual, expected, message) {
  if (actual !== expected) {
    fail(actual, expected, message, '===', assert.strictEqual);
  }
};

// 10. The strict non-equality assertion tests for strict inequality, as
// determined by !==.  assert.notStrictEqual(actual, expected, message_opt);

assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
  if (actual === expected) {
    fail(actual, expected, message, '!==', assert.notStrictEqual);
  }
};

function expectedException(actual, expected) {
  if (!actual || !expected) {
    return false;
  }

  if (Object.prototype.toString.call(expected) == '[object RegExp]') {
    return expected.test(actual);
  } else if (actual instanceof expected) {
    return true;
  } else if (expected.call({}, actual) === true) {
    return true;
  }

  return false;
}

function _throws(shouldThrow, block, expected, message) {
  var actual;

  if (util.isString(expected)) {
    message = expected;
    expected = null;
  }

  try {
    block();
  } catch (e) {
    actual = e;
  }

  message = (expected && expected.name ? ' (' + expected.name + ').' : '.') +
            (message ? ' ' + message : '.');

  if (shouldThrow && !actual) {
    fail(actual, expected, 'Missing expected exception' + message);
  }

  if (!shouldThrow && expectedException(actual, expected)) {
    fail(actual, expected, 'Got unwanted exception' + message);
  }

  if ((shouldThrow && actual && expected &&
      !expectedException(actual, expected)) || (!shouldThrow && actual)) {
    throw actual;
  }
}

// 11. Expected to throw an error:
// assert.throws(block, Error_opt, message_opt);

assert.throws = function(block, /*optional*/error, /*optional*/message) {
  _throws.apply(this, [true].concat(pSlice.call(arguments)));
};

// EXTENSION! This is annoying to write outside this module.
assert.doesNotThrow = function(block, /*optional*/message) {
  _throws.apply(this, [false].concat(pSlice.call(arguments)));
};

assert.ifError = function(err) { if (err) {throw err;}};

var objectKeys = Object.keys || function (obj) {
  var keys = [];
  for (var key in obj) {
    if (hasOwn.call(obj, key)) keys.push(key);
  }
  return keys;
};

},{"util/":18}],14:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],15:[function(require,module,exports){
(function (process){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function(filename) {
  return splitPathRe.exec(filename).slice(1);
};

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function(path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
};


exports.basename = function(path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPath(path)[3];
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

}).call(this,require('_process'))
},{"_process":16}],16:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],17:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],18:[function(require,module,exports){
(function (process,global){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = require('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = require('inherits');

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./support/isBuffer":17,"_process":16,"inherits":14}]},{},[3]);
