/* lexical grammar */
%lex
%%

[\n]{2,}                     { return 'DELIMITER'; }
\s*'{{'[^}]*'}}'\s*          { return 'MACRO'; }
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
    : paragraphs DELIMITER paragraph  { $$=$1; $$.push($3); }
    | paragraphs paragraph            { $$=$1; $$.push($2); }
    | paragraph                       { $$=[$1]; }
    ;

paragraph
    : text                    { $$=$1; }
    | MACRO                   { $$=$1; }
    ;

text
    : TEXT                    { $$=$1; }
    | text (?=DELIMITER)      { $$=$1; }
    | text NL TEXT            { $$=$1+$2+$3; }
    ;
