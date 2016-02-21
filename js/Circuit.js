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
    this.TOKEN_CHARACTER_CLASS_NOT_ALPHANUMERIC = '\\W';

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
    this.TOKEN_CHARACTER_CLASS_FORM_FEED = '\\f';

    /**
     * TODO: Chercher sur une doc
     * ???
     * @type {string}
     */
    this.TOKEN_CHARACTER_CLASS_BACKSPACE = '[\\b]';

    /**
     * Représente le caractère nul
     * @type {string}
     */
    this.TOKEN_CHARACTER_CLASS_NUL = '\\0';

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
    this.TOKEN_QUANTIFIER_ZERO_OR_ONE = '?';

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

    /**
     * Le caractère trouvé est un nombre
     * @type {number}
     */
    this.TYPE_NUMBER = 1;

    /**
     * Le caractère trouvé est une compris dans l'alphabet (minuscule ou majuscule)
     * @type {number}
     */
    this.TYPE_LETTER = 2;

    /**
     * Le caractère trouvé est quelque chose d'autre qu'un nombre ou lettre
     * @type {number}
     */
    this.TYPE_OTHER = 3;
}

Circuit.prototype.reset = function() {
    /**
     * Un token
     * @type {string}
     */
    this.token = '';

    /**
     * Position où se trouve le curseur dans la regex
     * @type {number}
     */
    this.cursor = 0;

    /**
     * Niveau de profondeur par rapport aux groupes de capture
     * @type {number}
     */
    this.deepLevel = 0;

    /**
     * Pile de groupes de capture
     * @type {Array}
     */
    this.stackCaptureGroups = [];

    /**
     * Pile de jeux de caractères
     * @type {Array}
     */
    this.stackCharacterSets = [];
};

Circuit.prototype.parse = function (regex) {
    var stack = [];

    /**
     * Regex en cours de traitement
     * @type {string}
     */
    this.regex = regex;

    this.reset();

    while (this.cursor < this.regex.length + 1) {
        this.token = this.getNextToken(this.regex);

        console.log('stack :', stack, 'cursor :', this.cursor, '; token :', this.token);

        switch (this.token) {
            case this.TOKEN_GROUP_OPEN:
                stack.push(this.TOKEN_GROUP_CLOSE);
                this.openCaptureGroup();
                this.deepLevel++;
                break;

            case this.TOKEN_QUANTIFIER_OPEN:
                stack.push(this.TOKEN_QUANTIFIER_CLOSE);
                break;

            case this.TOKEN_CHARACTER_SETS_OPEN:
                stack.push(this.TOKEN_CHARACTER_SETS_CLOSE);
                this.openCharacterSet();
                break;

            case this.TOKEN_CHARACTER_CLASS_ALPHANUMERIC:
                this.regex = this.regex.replace(this.TOKEN_CHARACTER_CLASS_ALPHANUMERIC, '[a-zA-Z0-9_]');
                this.cursor -= this.TOKEN_CHARACTER_CLASS_ALPHANUMERIC.length;
                break;

            case this.TOKEN_GROUP_CLOSE:
            case this.TOKEN_QUANTIFIER_CLOSE:
            case this.TOKEN_CHARACTER_SETS_CLOSE:
                var tokenClose = stack.pop();

                if (tokenClose != this.token) {
                    throw new Error("Char #" + this.cursor + ": one token was not closed: `"
                                    + tokenClose + "` expected, got `" + this.token + "`");
                }

                switch (this.token) {
                    case this.TOKEN_GROUP_CLOSE:
                        this.closeCaptureGroup();
                        this.deepLevel--;
                        break;

                    case this.TOKEN_CHARACTER_SETS_CLOSE:
                        this.closeCharacterSet();
                        break;
                }
        }
    }

    console.log(stack);
    console.log(+new Date());

    if (stack.length != 0) {
        throw new Error("One or more token(s) was not correctly closed: `" + stack.reverse().join(', ') + "`");
    }
};

/**
 * Récupère le token suivant dans la regex
 * @param regex
 * @returns {string}
 */
Circuit.prototype.getNextToken = function (regex) {
    var token = regex.substr(this.cursor++, 1);

    if (token == '\\') {
        token += this.getNextToken(regex);
        return token;
    }

    return token;
};

/**
 * Ouvre un groupe de capture
 */
Circuit.prototype.openCaptureGroup = function () {
    this.stackCaptureGroups.push({
        from: this.cursor - 1
    });
};

/**
 * Ferme un groupe de capture
 */
Circuit.prototype.closeCaptureGroup = function () {
    var lastGroup = this.stackCaptureGroups[this.stackCaptureGroups.length - 1];

    lastGroup.to = this.cursor;
    lastGroup.capture = this.regex.substring(lastGroup.from, lastGroup.to);
};

/**
 * Ouvre un jeu de caractères
 */
Circuit.prototype.openCharacterSet = function () {
    this.stackCharacterSets.push({
        from: this.cursor - 1
    });
};

/**
 * Ferme un jeu de caractères
 */
Circuit.prototype.closeCharacterSet = function () {
    var self = this;
    var lastSet = this.stackCharacterSets[this.stackCharacterSets.length - 1];

    lastSet.to = this.cursor;
    // +1 & -1 pour supprimer les []
    lastSet.characterSet = this.regex.substring(lastSet.from + 1, lastSet.to - 1);
    lastSet.possibleChars = [];

    for (var cursor = 0; cursor < lastSet.characterSet.length; cursor++) {
        // range! e.g.
        if (lastSet.characterSet[cursor + 1] == '-' && lastSet.characterSet[cursor + 2] != null) {
            // début de la range
            var from = lastSet.characterSet[cursor];
            // fin de la range
            var to = lastSet.characterSet[cursor + 2];
            // callback en fonction du type de caractère
            var cb = function () {
            };

            var fromType = this.getType(from);
            var toType = this.getType(to);

            // types différents ...
            if (fromType != toType) {
                throw new Error("Impossible to generate an array from a range of two incompatible types")
            }

            switch (fromType) {
                // Les deux caractères qui constituent la range sont des nombres
                case this.TYPE_NUMBER:
                    from = parseInt(from);
                    to = parseInt(to);

                    cb = function (c) {
                        self.pushTo(lastSet.possibleChars, c);
                    };

                    break;

                case this.TYPE_LETTER:
                    from = from.charCodeAt();
                    to = to.charCodeAt();

                    cb = function (c) {
                        self.pushTo(lastSet.possibleChars, String.fromCharCode(c));
                    };

                    break;
            }

            this.generateRange(from, to, cb);
            cursor += 2; // on a déjà traité "-" et "to"

        } else { // pas range
            this.pushTo(lastSet.possibleChars, lastSet.characterSet[cursor]);
        }
    }
};

/**
 * Retourne le type d'un caractère
 * @param char
 * @returns {number}
 */
Circuit.prototype.getType = function (char) {
    if (char * 1 == char) {
        return this.TYPE_NUMBER;
    }

    char = char.toLowerCase();

    if (char.charCodeAt() >= 'a'.charCodeAt() && char.charCodeAt() <= 'z'.charCodeAt()) {
        return this.TYPE_LETTER;
    }

    return this.TYPE_OTHER;
};

Circuit.prototype.pushTo = function (array, char) {
    if(array.indexOf(char) == -1) {
        array.push(char);
        return true;
    }

    return false;
};

Circuit.prototype.generateRange = function (from, to, cb) {
    // wow
    if (from > to) {
        from ^= to ^= from;
    }

    for (var i = from; i < to + 1; i++) {
        cb(i);
    }
};
