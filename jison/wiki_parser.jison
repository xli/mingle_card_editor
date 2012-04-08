/* lexical grammar */
%lex
%%

'{{'[^}]*'}}'                { return 'MACRO'; }
[^{\n]+                      { return 'TEXT'; }
[\n]                         { return 'NL'; }
<<EOF>>                      { return 'EOF'; }

/lex


%start expressions

%% /* language grammar */

expressions
    : paragraphs EOF          { return $1; }
    ;

paragraphs
    : paragraphs NL NL paragraph      { $$=$1; $$.push($4); }
    | paragraphs paragraph            { $$=$1; $$.push($2); }
    | paragraph                       { $$=[$1]; }
    ;

paragraph
    : text                    { $$=$1; }
    | MACRO                   { $$=$1; }
    | paragraph NL            { $$=$1; }
    | NL paragraph            { $$=$2; }
    ;

text
    : TEXT                    { $$=$1; }
    | text (?=delimiter)      { $$=$1; }
    | text NL TEXT            { $$=$1+$2+$3; }
    ;

delimiter
    : NL NL
    ;
