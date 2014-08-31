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
'*'                 { return '*'; }
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

  function comparisonOp(op, left, right, inResource){
    if (left[0] == '.') {
      return [op, left.slice(1), right];
    } else {
       if (inResource) {
        return [op, ["parameter", left.slice(1).join('.')], right];
      } else {
        return ["in", "certname",
                  ["extract", "certname",
                    ["select-fact-contents",
                     ["and",
                       [left[0], "path", left.slice(1)],
                       [op, "value", right]]]]];
      }
    }
  }

  function regExpEscape(s) {
    return String(s).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, '\\$1').
      replace(/\x08/g, '\\x08');
  };
%}

/* operator precedence */
%left 'or'
%left 'and'
%left '=' '!=' '~' '!~' '<' '<=' '>' '>='
%right 'not'

%start query

%% /* grammar */

query
  : expression EOF { return $1; }
  | EOF { return null; }
  ;

expression
  : lhs_expression      '~'   literal_expression { $$ = comparisonOp("~", $1, $3, yy.inResource); }
  | lhs_expression      '!~'  literal_expression { $$ = ["not", comparisonOp("~", $1, $3, yy.inResource)]; }
  | lhs_expression      '='   literal_expression { $$ = comparisonOp("=", $1, $3, yy.inResource); }
  | lhs_expression      '!='  literal_expression { $$ = ["not", comparisonOp("=", $1, $3, yy.inResource)]; }
  | lhs_expression      '>'   literal_expression { $$ = comparisonOp(">", $1, $3, yy.inResource); }
  | lhs_expression      '>='  literal_expression { $$ = comparisonOp(">=", $1, $3, yy.inResource); }
  | lhs_expression      '<'   literal_expression { $$ = comparisonOp("<", $1, $3, yy.inResource); }
  | lhs_expression      '<='  literal_expression { $$ = comparisonOp("<=", $1, $3, yy.inResource); }
  | lhs_expression                               { $$ = ["~", "certname", regExpEscape($1.slice(1).join('.'))]; }
  |                     'not' expression         { $$ = ["not", $2]; }
  | expression          'and' expression         { $$ = ["and", $1, $3]; }
  | expression          'or'  expression         { $$ = ["or", $1, $3]; }
  |                     '('   expression ')'     { $$ = $2; }
  | resource_expression                          { $$ = ["in", "certname", ["extract", "certname", ["select-resources", $1 ]]]; }
  ;

literal_expression
  : boolean
  | string
  | integer
  | float
  ;

lhs_expression
  : fact_name
  | '.' fact_name            { $$ = '.' + $2.slice(1).join('.'); }
  ;

fact_name
  : string                   { $$ = ['=', $1]; }
  | integer                  { $$ = ['=', $1]; }
  | '~' string               { $$ = ['~>', $1]; }
  | '*'                      { $$ = ['~>', '.*']; }
  // TODO: regexp escape facts if it is a regexp match
  | fact_name '.' string     { $$ = $1.concat($3); }
  | fact_name '.' integer    { $$ = $1.concat($3); }
  | fact_name '.' '~' string { $$ = ['~>'].concat($1.slice(1)).concat($4); }
  | fact_name '.' '*'        { $$ = ['~>'].concat($1.slice(1)).concat('.*'); }
  ;

boolean  : Boolean  { $$ = yytext === 'true' ? true: false; } ;
integer  : Number   { $$ = Number(yytext); } ;
string   : String   { $$ = yytext; } ;
float    : Number '.' Number { $$ = Number($1 + '.' + $3) } ;

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
  : '@@'
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
