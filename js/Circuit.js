/**
 * Découpe une regex en suite de tokens et en fait un circuit
 * @constructor
 */
function Circuit() {

    // Merci à la doc' de Mozilla pour tous les différents tokens

    /**
     * Représente tous les caractères, sauf \n, \r, \u2028 et \2029
     * @type {string}
     */
    this.TOKEN_CHARACTER_CLASS_DOT = '.';

    /**
     * Représente un chiffre.
     * Équivalent de [0-9]
     * @type {string}
     */
    this.TOKEN_CHARACTER_CLASS_DIGIT = '\\d';

    /**
     * Représente ce qui n'est pas un chiffre.
     * Équivalent à [^0-9]
     * @type {string}
     */
    this.TOKEN_CHARACTER_CLASS_NOT_DIGIT = '\\D';

    /**
     * Représente un caractère alphanumérique, ainsi qu'un underscore.
     * Équivalent à [A-Za-z0-9_]
     * @type {string}
     */
    this.TOKEN_CHARACTER_CLASS_ALPHANUMERIC = '\\w';

    /**
     * Représente un caractère qui n'est pas alphanumérique, ou un underscore.
     * Équivalent à [^A-Za-z0-9_]
     * @type {string}
     */
    this.TOKEN_CHARACTER_CLASS_NOT_ALPHANUMERIC = '\\w';

    /**
     * Représente un caractère blanc.
     * Équivalent à [ \f\n\r\t\v​\u00a0\u1680​\u180e\u2000​-\u200a​\u2028\u2029\u202f\u205f​\u3000\ufeff]
     * @type {string}
     */
    this.TOKEN_CHARACTER_CLASS_WHITESPACE = '\\s';

    /**
     * Représente un caractère autre qu'un caractère blanc
     * Équivalent à [^ \f\n\r\t\v​\u00a0\u1680​\u180e\u2000​-\u200a​\u2028\u2029\u202f\u205f​\u3000\ufeff]
     * @type {string}
     */
    this.TOKEN_CHARACTER_CLASS_NOT_WHITESPACE = '\\S';

    /**
     * Représente une tabulation horizontale
     * @type {string}
     */
    this.TOKEN_CHARACTER_CLASS_HORIZONTAL_TAB = '\\t';

    /**
     * Représente un retour chariot
     * @type {string}
     */
    this.TOKEN_CHARACTER_CLASS_CARRIAGE_RETURN = '\\r';

    /**
     * Représente un saut de ligne
     * @type {string}
     */
    this.TOKEN_CHARACTER_CLASS_LINEFEED = '\\n';

    /**
     * Représente une tabulation verticale (???)
     * @type {string}
     */
    this.TOKEN_CHARACTER_CLASS_VERTICAL_TAB = '\\v';

    /**
     * TODO: Chercher sur une doc
     * ???
     * @type {string}
     */
    this.TOKEN_CHARACTER_CLASS_FORM_FEED= '\\f';

    /**
     * TODO: Chercher sur une doc
     * ???
     * @type {string}
     */
    this.TOKEN_CHARACTER_CLASS_BACKSPACE= '[\\b]';

    /**
     * Représente le caractère nul
     * @type {string}
     */
    this.TOKEN_CHARACTER_CLASS_NUL= '\\0';

    /**
     *
     * @type {string}
     */
    this.TOKEN_CHARACTER_SETS_OPEN = '[';

    /**
     *
     * @type {string}
     */
    this.TOKEN_CHARACTER_SETS_CLOSE = ']';

    /**
     * Représente soit x ou y dans x|y, où x et y sont des expressions
     * @type {string}
     */
    this.TOKEN_ALTERNATION = '|';

    /**
     * Représente le début de l'entrée
     * @type {string}
     */
    this.TOKEN_BOUNDARY_BEGIN = '^';

    /**
     * Représente la fin de la l'entrée (héhé)
     * @type {string}
     */
    this.TOKEN_BOUNDARY_END = '$';

    /**
     * Partie ouvrante d'une capture
     * @type {string}
     */
    this.TOKEN_GROUP_OPEN = '(';

    /**
     * Partie fermante d'une capture
     * @type {string}
     */
    this.TOKEN_GROUP_CLOSE = ')';

    /**
     * Partie ouvrante d'un quantifier
     * @type {string}
     */
    this.TOKEN_QUANTIFIER_OPEN = '{';

    /**
     * Partie fermante d'un quantifier
     * @type {string}
     */
    this.TOKEN_QUANTIFIER_CLOSE = '}';

    /**
     * Représente 0 ou 1 fois le terme précédent
     * @type {string}
     */
    this.TOKEN_QUANTIFIER_ZERO_OR_ONE= '?';

    /**
     * Représente 0 fois ou plus terme précédent
     * @type {string}
     */
    this.TOKEN_QUANTIFIER_ZERO_OR_MORE = '*';

    /**
     * Représente 1 fois ou plus le terme précédent
     * @type {string}
     */
    this.TOKEN_QUANTIFIER_ONE_OR_MORE = '+';
}

Circuit.prototype.parse = function(regex) {
    var cursor = 0;
    var char = '';

    var stack = [];

    while(cursor < regex.length + 1) {
        char = regex[cursor];
        console.log('stack :', stack, 'cursor :', cursor, '; char :', char);

        if(cursor == regex.length) {
            break;
        }

        switch(char) {
            case this.TOKEN_GROUP_OPEN:
                stack.push(this.TOKEN_GROUP_CLOSE);
                break;

            case this.TOKEN_QUANTIFIER_OPEN:
                stack.push(this.TOKEN_QUANTIFIER_CLOSE);
                break;

            case this.TOKEN_CHARACTER_SETS_OPEN:
                stack.push(this.TOKEN_CHARACTER_SETS_CLOSE);
                break;

            case this.TOKEN_GROUP_CLOSE:
            case this.TOKEN_QUANTIFIER_CLOSE:
            case this.TOKEN_CHARACTER_SETS_CLOSE:
                var tokenClose = stack.pop();

                if(tokenClose != char) {
                    throw new Error("Char #" + cursor + ": one token was not closed: `" + tokenClose + "` expected, got `" + char + "`");
                }
        }

        cursor++;
    }

    if(stack.length != 0) {
        throw new Error("One or more token(s) was not correctly closed: `" + stack.reverse().join(', ') + "`");
    }
};
