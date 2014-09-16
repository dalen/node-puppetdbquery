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
  var loc = require('./util').loc;
%}

/* operator precedence */
%left 'or'
%left 'and'
%left '=' '!=' '~' '!~' '<' '<=' '>' '>='
%right 'not'

%start query

%% /* grammar */

query
  : expression EOF                           { $$ = ast.query($1); $$.loc = loc(@$); return $$; }
  | EOF                                      { $$ = ast.query(); $$.loc = loc(@$); return $$;}
  ;

expression
  : identifier_path                          { $$ = ast.regexpNodeMatch($1); $$.loc = loc(@$); }
  |                     'not' expression     { $$ = ast.notExpression($2); $$.loc = loc(@$); }
  | expression          'and' expression     { $$ = ast.andExpression($1, $3); $$.loc = loc(@$); }
  | expression          'or'  expression     { $$ = ast.orExpression($1, $3); $$.loc = loc(@$); }
  |                     '('   expression ')' { $$ = ast.parentesizedExpression($2); $$.loc = loc(@$); }
  | resource_expression
  | comparison_expression
  | subquery
  ;

literal
  : boolean                                  { $$ = ast.boolean($1); $$.loc = loc(@$); }
  | string                                   { $$ = ast.string($1); $$.loc = loc(@$); }
  | integer                                  { $$ = ast.number($1); $$.loc = loc(@$); }
  | float                                    { $$ = ast.number($1); $$.loc = loc(@$); }
  | '@' string                               { $$ = ast.date($2); $$.loc = loc(@$); }
  ;

comparison_op: '~' | '!~' | '=' | '!=' | '>' | '>=' | '<' | '<=' ;

comparison_expression
  : identifier_path comparison_op literal    { $$ = ast.comparison($2, $1, $3); $$.loc = loc(@$); }
  ;

identifier
  : string                                   { $$ = ast.identifier($1); $$.loc = loc(@$); }
  | integer                                  { $$ = ast.identifier($1); $$.loc = loc(@$); }
  | '~' string                               { $$ = ast.regexpIdentifier($2); $$.loc = loc(@$); }
  | '*'                                      { $$ = ast.regexpIdentifier(".*"); $$.loc = loc(@$); }
  ;

identifier_path
  : identifier                               { $$ = ast.identifierPath([$1]); $$.loc = loc(@$); }
  | identifier_path '.' identifier           { $1.components.push($3); $$ = $1; $$.loc = loc(@$); }
  ;

subquery
  : '#' string '.' comparison_expression     { $$ = ast.subquery($2, $4); $$.loc = loc(@$); }
  | '#' string block_expression              { $$ = ast.subquery($2, $3); $$.loc = loc(@$); }
  ;

block_expression
  :                     '{'   expression '}' { $$ = ast.blockExpression($2); $$.loc = loc(@$); }
  ;

resource_expression
  : string '[' identifier ']'                       { $$ = ast.resource($1, $3, false); $$.loc = loc(@$); }
  | string '[' identifier ']' block_expression      { $$ = ast.resource($1, $3, false, $5); $$.loc = loc(@$); }
  | '@@' string '[' identifier ']'                  { $$ = ast.resource($2, $4, true); $$.loc = loc(@$); }
  | '@@' string '[' identifier ']' block_expression { $$ = ast.resource($2, $4, true, $6); $$.loc = loc(@$); }
  ;

boolean  : Boolean           { $$ = yytext === 'true' ? true: false; } ;
integer  : Number            { $$ = parseInt(yytext, 10); } ;
string   : String            { $$ = yytext; } ;
float    : Number '.' Number { $$ = parseFloat($1 + '.' + $3) } ;
