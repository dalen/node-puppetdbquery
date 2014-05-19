/* lexer tokens */

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
'not'               { return 'not'; }
'and'               { return 'and'; }
'or'                { return 'or'; }
'true'              { return 'Boolean'; }
'false'             { return 'Boolean'; }
"-"?\d+("."\d+)?    { return 'Number'; }
\"(\\.|[^\\"])*\"   { yytext = eval(yytext); return 'String'; }
"'"(\\.|[^\\'])*"'" { yytext = eval(yytext); return 'String'; }
[-\w_\\.:]+         { return 'String'; }
"@@"                { return '@@'; }
<<EOF>>             { return 'EOF'; }

/lex

/* Helper functions */

%{
  function capitalize(s){
    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
  }

  function capitalizeClass(s){
    return s.split("::").map(capitalize).join("::");
  }

  function comparisonOp(op, left, right, inResource, nodeQuery){
    if (inResource) {
      return [op, ["parameter", left], right];
    } else {
      if (nodeQuery) {
        return [op, ["fact", left], right];
      } else {
        return ["in", "certname",
                 ["extract", "certname",
                   ["select-facts",
                     ["and",
                       ["=", "name", left],
                       [op, "value", right]]]]];
      }
    }
  }
%}

/* operator precedence */
%left 'or'
%left 'and' AND
%left '=' '!=' '~' '!~' '<' '<=' '>' '>='
%right 'not'

%start query

%% /* grammar */

query
  : expression EOF { return $1; }
  | EOF { return null; }
  ;

expression
  : literal_expression  '~'   literal_expression { $$ = comparisonOp("~", $1, $3, yy.inResource, yy.nodeQuery); }
  | literal_expression  '!~'  literal_expression { $$ = ["not", comparisonOp("~", $1, $3, yy.inResource, yy.nodeQuery)]; }
  | literal_expression  '='   literal_expression { $$ = comparisonOp("=", $1, $3, yy.inResource, yy.nodeQuery); }
  | literal_expression  '!='  literal_expression { $$ = ["not", comparisonOp("=", $1, $3, yy.inResource, yy.nodeQuery)]; }
  | literal_expression  '>'   literal_expression { $$ = comparisonOp(">", $1, $3, yy.inResource, yy.nodeQuery); }
  | literal_expression  '>='  literal_expression { $$ = comparisonOp(">=", $1, $3, yy.inResource, yy.nodeQuery); }
  | literal_expression  '<'   literal_expression { $$ = comparisonOp("<", $1, $3, yy.inResource, yy.nodeQuery); }
  | literal_expression  '<='  literal_expression { $$ = comparisonOp("<=", $1, $3, yy.inResource, yy.nodeQuery); }
  |                     'not' expression         { $$ = ["not", $2]; }
  | expression          'and' expression         { $$ = ["and", $1, $3]; }
  | expression          'or'  expression         { $$ = ["or", $1, $3]; }
  |                     '('   expression ')'     { $$ = $2; }
  | resource_expression                          { $$ = ["in", yy.nodeQuery ? "name" : "certname", ["extract", "certname", ["select-resources", $1 ]]]; }
  ;

literal_expression
  : boolean
  | string
  | number
  ;

boolean  : Boolean  { $$ = yytext === 'true' ? true: false; } ;
number   : Number   { $$ = Number(yytext); } ;
string   : String   { $$ = yytext; } ;

resource_expression
  : resource_type_title {
      $$ = $1.concat([["=", "exported", false]]);
    }
  | resource_type_title resource_parameters {
      $$ = $1.concat([["=", "exported", false], $2]);
    }
  | resource_exported resource_type_title {
      $$ = $2.concat([["=", "exported", true]]);
    }
  | resource_exported resource_type_title resource_parameters {
      $$ = $2.concat([["=", "exported", true], $3]);
    }
  ;

resource_exported
  : ATAT
  ;

resource_type_title
  : string '[' string ']' {
      $$ = ["and",
        ["=", "type", capitalize($1) ],
        ["=", "title", $1.toLowerCase() === "class" ? capitalizeClass($3) : $3]
      ];
    }
  | string '[' '~' string ']'  {
      $$ = ["and",
        ["=", "type", capitalize($1) ],
        ["~", "title", $1.toLowerCase() === "class" ? capitalizeClass($4) : $4]
      ];
    }
  ;

resource_parameters
  : resource_param_start expression resource_param_end   { $$ = $2 }
  ;

// seems like JISON doesn't handle lexical tie-ins
// TODO: rework this to something nicer
resource_param_start : '{' { yy.inResource = true; } ;
resource_param_end   : '}' { yy.inResource = false; } ;
