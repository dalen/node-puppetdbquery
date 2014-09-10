/* lexer tokens */
/* The single character tokens don't have any special names
 * This is to make error messages easier to understand. */

%lex
%%
\s+                 { /* whitespace no action */ }
'('                 { return '('; }
')'                 { return ')'; }
'['                 { return '['; }
']'                 { return ']'; }
'{'                 { return '{'; }
'}'                 { return '}'; }
'='                 { return '='; }
'!='                { return '!='; }
'~'                 { return '~'; }
'<'                 { return '<'; }
'<='                { return '<='; }
'>'                 { return '>'; }
'>='                { return '>='; }
'*'                 { return '*'; }
'#'                 { return '#'; }
'not'               { return 'not'; }
'and'               { return 'and'; }
'or'                { return 'or'; }
'true'              { return 'Boolean'; }
'false'             { return 'Boolean'; }
"-"?\d+             { return 'Number'; }
\"(\\.|[^\\"])*\"   { yytext = eval(yytext); return 'String'; }
"'"(\\.|[^\\'])*"'" { yytext = eval(yytext); return 'String'; }
'.'                 { return '.'; }
[-\w_:]+            { return 'String'; }
'@@'                { return '@@'; }
'@'                 { return '@'; }
<<EOF>>             { return 'EOF'; }

/lex

/* Helper functions */

%{
  var astlib = require('./ast');
  var ast = astlib.builders;
  var evaluator = require('./evaluator');
%}

/* operator precedence */
%left 'or'
%left 'and'
%left '=' '!=' '~' '!~' '<' '<=' '>' '>='
%right 'not'

%start query

%% /* grammar */

query
  : expression EOF                           { return evaluator.evaluate(ast.query($1)); }
  | EOF                                      { return evaluator.evaluate(ast.query()); }
  ;

expression
  : identifier_path                          { $$ = ast.regexpNodeMatch($1); }
  |                     'not' expression     { $$ = ast.notExpression($2); }
  | expression          'and' expression     { $$ = ast.andExpression($1, $3); }
  | expression          'or'  expression     { $$ = ast.orExpression($1, $3); }
  |                     '('   expression ')' { $$ = ast.parentesizedExpression($2); }
  | resource_expression
  | comparison_expression
  | subquery
  ;

literal
  : boolean                                  { $$ = ast.boolean($1); }
  | string                                   { $$ = ast.string($1); }
  | integer                                  { $$ = ast.number($1); }
  | float                                    { $$ = ast.number($1); }
  | '@' string                               { $$ = ast.date($2); }
  ;

comparison_op: '~' | '!~' | '=' | '!=' | '>' | '>=' | '<' | '<=' ;

comparison_expression
  : identifier_path comparison_op literal    { $$ = ast.comparison($2, $1, $3); }
  ;

identifier
  : string                                   { $$ = ast.identifier($1); }
  | integer                                  { $$ = ast.identifier($1); }
  | '~' string                               { $$ = ast.regexpIdentifier($2); }
  | '*'                                      { $$ = ast.regexpIdentifier(".*"); }
  ;

identifier_path
  : identifier                               { $$ = ast.identifierPath([$1]); }
  | identifier_path '.' identifier           { $1.components.push($3); $$ = $1; }
  ;

subquery
  : '#' string '.' comparison_expression     { $$ = ast.subquery($2, $4); }
  | '#' string block_expression              { $$ = ast.subquery($2, $3); }
  ;

block_expression
  :                     '{'   expression '}' { $$ = ast.blockExpression($2); }
  ;

resource_expression
  : string '[' identifier ']'                       { $$ = ast.resource($1, $3, false); }
  | string '[' identifier ']' block_expression      { $$ = ast.resource($1, $3, false, $5); }
  | '@@' string '[' identifier ']'                  { $$ = ast.resource($2, $4, true); }
  | '@@' string '[' identifier ']' block_expression { $$ = ast.resource($2, $4, true, $6); }
  ;

boolean  : Boolean           { $$ = yytext === 'true' ? true: false; } ;
integer  : Number            { $$ = parseInt(yytext, 10); } ;
string   : String            { $$ = yytext; } ;
float    : Number '.' Number { $$ = parseFloat($1 + '.' + $3) } ;
