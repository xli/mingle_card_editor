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
    : paragraphs paragraph              { $$=$1; $$.push($2); }
    | paragraphs delimiter paragraph    { $$=$1; $$.push($3); }
    | paragraph                         { $$=[$1]; }
    ;

paragraph
    : MACRO                   { $$=$1; }
    | text                    { $$=$1; }
    ;

text
    : TEXT                    { $$=$1; }
    ;

delimiter
    : NL NL
    ;
