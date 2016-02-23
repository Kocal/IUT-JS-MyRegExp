/**
 * Split a regex into tokens and make a circuit with them
 * @constructor
 */
function Circuit() {

    this.debug = true;

    // Thanks to Mozilla's docs for listing tokens and equivalent

    /**
     * Match all characters, but not \n, \r, \u2028 and \2029
     * @type {string}
     */
    this.TOKEN_CHARACTER_CLASS_DOT = '.';

    /**
     * Match a digit, equivalent to [0-9]
     * @type {string}
     */
    this.TOKEN_CHARACTER_CLASS_DIGIT = '\\d';

    /**
     * Do not match a digit, equivalent to [^0-9]
     * @type {string}
     */
    this.TOKEN_CHARACTER_CLASS_NOT_DIGIT = '\\D';

    /**
     * Match an alphanumeric character and an underscore too, equivalent to [A-Za-z0-9_]
     * @type {string}
     */
    this.TOKEN_CHARACTER_CLASS_ALPHANUMERIC = '\\w';

    /**
     * Do not match an alphanumeric character and underscore, equivalent to [^A-Za-z0-9_]
     * @type {string}
     */
    this.TOKEN_CHARACTER_CLASS_NOT_ALPHANUMERIC = '\\W';

    /**
     * Match a white character, equivalent to [ \f\n\r\t\v​\u00a0\u1680​\u180e\u2000​-\u200a​\u2028\u2029\u202f\u205f​\u3000\ufeff]
     * @type {string}
     */
    this.TOKEN_CHARACTER_CLASS_WHITESPACE = '\\s';

    /**
     * Do not match a white character, equivalent to [^ \f\n\r\t\v​\u00a0\u1680​\u180e\u2000​-\u200a​\u2028\u2029\u202f\u205f​\u3000\ufeff]
     * @type {string}
     */
    this.TOKEN_CHARACTER_CLASS_NOT_WHITESPACE = '\\S';

    /**
     * Match an horizontal tabulation
     * @type {string}
     */
    this.TOKEN_CHARACTER_CLASS_HORIZONTAL_TAB = '\\t';

    /**
     * Match a carriage return
     * @type {string}
     */
    this.TOKEN_CHARACTER_CLASS_CARRIAGE_RETURN = '\\r';

    /**
     * Match a linefeed
     * @type {string}
     */
    this.TOKEN_CHARACTER_CLASS_LINEFEED = '\\n';

    /**
     * Match a vertical tabulation
     * @type {string}
     */
    this.TOKEN_CHARACTER_CLASS_VERTICAL_TAB = '\\v';

    /**
     * TODO: Search on the Internet
     * ???
     * @type {string}
     */
    this.TOKEN_CHARACTER_CLASS_FORM_FEED = '\\f';

    /**
     * TODO: Search on the Internet
     * ???
     * @type {string}
     */
    this.TOKEN_CHARACTER_CLASS_BACKSPACE = '[\\b]';

    /**
     * Match the character NUL
     * @type {string}
     */
    this.TOKEN_CHARACTER_CLASS_NUL = '\\0';

    /**
     * Used to match x or y in x|y
     * @type {string}
     */
    this.TOKEN_ALTERNATION = '|';

    /**
     * Match input begin
     * @type {string}
     */
    this.TOKEN_BOUNDARY_BEGIN = '^';

    /**
     * Match input end
     * @type {string}
     */
    this.TOKEN_BOUNDARY_END = '$';

    /**
     * Token which opens a character set
     * @type {string}
     */
    this.TOKEN_CHARACTER_SETS_OPEN = '[';

    /**
     * Token which closes a character set
     * @type {string}
     */
    this.TOKEN_CHARACTER_SETS_CLOSE = ']';

    /**
     * Token which opens a capture group
     * @type {string}
     */
    this.TOKEN_GROUP_OPEN = '(';

    /**
     * Token which indicates to a "capture" group to do not "capture" (???)
     * @type {string}
     */
    this.TOKEN_GROUP_DONT_CAPTURE = '?:';

    /**
     * Token which closes a capture group
     * @type {string}
     */
    this.TOKEN_GROUP_CLOSE = ')';

    /**
     * Token which opens a quantifier
     * @type {string}
     */
    this.TOKEN_QUANTIFIER_OPEN = '{';

    /**
     * Token which makes the user able to define a range for a quantifier
     * @type {string}
     */
    this.TOKEN_QUANTIFIER_SEPARATOR = ',';

    /**
     * Token which closes a quantifier
     * @type {string}
     */
    this.TOKEN_QUANTIFIER_CLOSE = '}';

    /**
     * Repeat 0 or 1 time the previous term
     * @type {string}
     */
    this.TOKEN_QUANTIFIER_ZERO_OR_ONE = '?';

    /**
     * Repeat 0 or more time the previous term
     * @type {string}
     */
    this.TOKEN_QUANTIFIER_ZERO_OR_MORE = '*';

    /**
     * Repeat 0 or 1 time the previous term
     * @type {string}
     */
    this.TOKEN_QUANTIFIER_ONE_OR_MORE = '+';

    /**
     * Found character is a number
     * @type {number}
     */
    this.TYPE_NUMBER = 1;

    /**
     * Found character belongs to Latin alphabet (does not depends of the case)
     * @type {number}
     */
    this.TYPE_LETTER = 2;

    /**
     * Found character that is not a number or a letter
     * @type {number}
     */
    this.TYPE_OTHER = 3;

    /**
     * A node will be identified as a capture group
     * @type {number}
     */
    this.NODE_CAPTURE_GROUP = 4;

    /**
     * A node will be identified as a character set
     * @type {number}
     */
    this.NODE_CHARACTER_SET = 5;

    /**
     * A node will be identified as a quantifier
     * @type {number}
     */
    this.NODE_QUANTIFIER = 6;

    // The parser will be easier to write with this array
    this.equivalent = {};

    this.equivalent[this.TOKEN_CHARACTER_CLASS_ALPHANUMERIC] = '[A-Za-z0-9_]';
    this.equivalent[this.TOKEN_CHARACTER_CLASS_NOT_ALPHANUMERIC] = '[^A-Za-z0-9_]';

    this.equivalent[this.TOKEN_CHARACTER_CLASS_DIGIT] = '[0-9]';
    this.equivalent[this.TOKEN_CHARACTER_CLASS_NOT_DIGIT] = '[^0-9]';

    this.equivalent[this.TOKEN_CHARACTER_CLASS_WHITESPACE] = '[ \\f\\n\\r\\t\\v\\u00a0\\u1680​\\u180e\\u2000​-\\u200a​\\u2028\\u2029\\u202f\\u205f​\\u3000\\ufeff]';
    this.equivalent[this.TOKEN_CHARACTER_CLASS_NOT_WHITESPACE] = '[^ \\f\\n\\r\\t\\v\\u00a0\\u1680​\\u180e\\u2000​-\\u200a​\\u2028\\u2029\\u202f\\u205f​\\u3000\\ufeff]';

    this.equivalent[this.TOKEN_QUANTIFIER_ZERO_OR_ONE] = '{0,1}';
    this.equivalent[this.TOKEN_QUANTIFIER_ZERO_OR_MORE] = '{0,}';
    this.equivalent[this.TOKEN_QUANTIFIER_ONE_OR_MORE] = '{1,}';

    /**
     * A token
     * @type {string}
     */
    this.token = '';

    /**
     * Position of the cursor in the regex
     * @type {number}
     */
    this.cursor = 0;

    /**
     * TODO: use it?
     * Level of deepness of capture groups
     * @type {number}
     */
    this.deepLevel = 0;

    /**
     * Circuit built after parsing of the regex
     * @type {Array}
     */
    this.circuit = [];
}

/**
 * Reset the circuit
 */
Circuit.prototype.reset = function () {
    this.token = '';
    this.cursor = 0;
    this.deepLevel = 0;
    this.circuit = [];
};

/**
 * Parse the regex
 * @param {String} regex Regex to parse
 */
Circuit.prototype.parse = function (regex) {

    /**
     * Stacks close operators for elements in order to validate the syntax of the regex
     * @type {Array}
     */
    var stack = [];

    /**
     * Current regex which is parsed
     * @type {string}
     */
    this.regex = this.TOKEN_GROUP_OPEN + this.TOKEN_GROUP_DONT_CAPTURE + regex + this.TOKEN_GROUP_CLOSE;

    this.reset();

    // Parsing
    while (this.cursor < this.regex.length + 1) {

        this.token = this.getNextToken();

        switch (this.token) {
            // First we replace token which has equivalent, with their equivalent, then rewind
            case this.TOKEN_CHARACTER_CLASS_ALPHANUMERIC:
            case this.TOKEN_CHARACTER_CLASS_NOT_ALPHANUMERIC:
            case this.TOKEN_CHARACTER_CLASS_DIGIT:
            case this.TOKEN_CHARACTER_CLASS_NOT_DIGIT:
            case this.TOKEN_CHARACTER_CLASS_WHITESPACE:
            case this.TOKEN_CHARACTER_CLASS_NOT_WHITESPACE:
            case this.TOKEN_QUANTIFIER_ZERO_OR_ONE:
            case this.TOKEN_QUANTIFIER_ZERO_OR_MORE:
            case this.TOKEN_QUANTIFIER_ONE_OR_MORE:
                this.replace(this.token, this.equivalent[this.token]);
                break;

            // We found a capture group
            case this.TOKEN_GROUP_OPEN:
                stack.push(this.TOKEN_GROUP_CLOSE);
                this.openCaptureGroup();
                //TODO: use it
                this.deepLevel++;
                break;

            // We found a quantifier
            case this.TOKEN_QUANTIFIER_OPEN:
                stack.push(this.TOKEN_QUANTIFIER_CLOSE);
                this.openQuantifier();
                break;

            case this.TOKEN_GROUP_DONT_CAPTURE:
                this.doNotCapture();
                break;

            // We found a character set
            case this.TOKEN_CHARACTER_SETS_OPEN:
                stack.push(this.TOKEN_CHARACTER_SETS_CLOSE);
                this.openCharacterSet();
                break;

            case this.TOKEN_ALTERNATION:
                console.log('Alternation');
                break;

            // We found a closing character
            case this.TOKEN_GROUP_CLOSE:
            case this.TOKEN_QUANTIFIER_CLOSE:
            case this.TOKEN_CHARACTER_SETS_CLOSE:
                var tokenClose = stack.pop();

                if(!tokenClose) {
                    throw new Error("Char #" + this.cursor + ": found a close character `" + this.token + "`, but it cannot close anything");
                }

                // Nodes were not closed in the good order
                if (tokenClose != this.token) {
                    throw new Error("Char #" + this.cursor + ": one node was not closed in the good order: `"
                                    + tokenClose + "` expected, got `" + this.token + "`");
                }

                switch (this.token) {
                    case this.TOKEN_GROUP_CLOSE:
                        this.closeCaptureGroup();
                        //TODO: use it
                        this.deepLevel--;
                        break;

                    case this.TOKEN_QUANTIFIER_CLOSE:
                        this.closeQuantifier();
                        break;

                    case this.TOKEN_CHARACTER_SETS_CLOSE:
                        this.closeCharacterSet();
                        break;
                }

                break;

            default:
        }

        if (this.debug) {
            console.log('stack :', stack, 'cursor :', this.cursor, '; token :', this.token);
        }
    }

    if (this.debug) {
        console.log(stack);
        console.log(+new Date());
    }

    if (stack.length != 0) {
        throw new Error("One or more nodes were not closed : `" + stack.reverse().join(', ') + "`");
    }

    return this.circuit;
};

/**
 * Found the next token in the regex
 * @returns {string}
 */
Circuit.prototype.getNextToken = function () {
    var token = this.regex.substr(this.cursor++, 1);

    // Special char, should not be interpreted as a "real" token but as a simple char
    if (token == '\\') {
        token += this.getNextToken();
        return token;
    }

    if (token == '?') {
        token += this.getNextToken();

        switch (token) {
            case this.TOKEN_GROUP_DONT_CAPTURE:
                break;
            default:
                this.cursor--;
                return '?';
        }
    }

    return token;
};

/**
 * Replace a token by its equivalent and then rewind the cursor of token's equivalent length
 * @param {String} token Token
 * @param {String} equivalent Token's equivalent
 */
Circuit.prototype.replace = function (token, equivalent) {
    var length = token.length;

    this.regex =
        this.regex.substr(0, this.cursor - length)
        + equivalent
        + this.regex.substr(this.cursor);

    this.cursor -= length;
};

/**
 * Opens a capture group node
 */
Circuit.prototype.openCaptureGroup = function () {
    this.circuit.push({
        type: this.NODE_CAPTURE_GROUP,
        from: this.cursor - 1,
        shouldCapture: true
    });
};

/**
 * Closes a capture group node
 */
Circuit.prototype.closeCaptureGroup = function () {
    var lastCapture = this.getLast(this.NODE_CAPTURE_GROUP);

    lastCapture.to = this.cursor;
    lastCapture.capture = this.regex.substring(lastCapture.from, lastCapture.to);
};

Circuit.prototype.doNotCapture = function () {
    var lastCapture = this.getLast(this.NODE_CAPTURE_GROUP);

    lastCapture.shouldCapture = false;
};

/**
 * Opens a quantifier node
 */
Circuit.prototype.openQuantifier = function () {
    this.circuit.push({
        type: this.NODE_QUANTIFIER,
        from: this.cursor - 1
    });
};

/**
 * Closes a quantifier node
 */
Circuit.prototype.closeQuantifier = function () {
    var lastQuantifier = this.getLast(this.NODE_QUANTIFIER);
    var prevChar = this.regex.substr(lastQuantifier.from - 1, 1);
    // We need to know what this quantifier will repeats
    var lastNode = null;

    lastQuantifier.to = this.cursor;
    lastQuantifier.capture = this.regex.substring(lastQuantifier.from, lastQuantifier.to);

    switch (prevChar) {
        case this.TOKEN_CHARACTER_SETS_CLOSE:
            lastNode = this.getLast(this.NODE_CHARACTER_SET);
            break;

        case this.TOKEN_GROUP_CLOSE:
            lastNode = this.getLast(this.NODE_CAPTURE_GROUP);
            break;

        default:
            // /!\ Magick Trick /!\
            // we transform a single character into a character set with only one character
            this.cursor = lastQuantifier.from;
            this.openCharacterSet();
            this.closeCharacterSet();
            this.cursor = lastQuantifier.to;
            lastNode = this.getLast(this.NODE_CHARACTER_SET);
    }

    if (lastNode.type == this.TOKEN_CHARACTER_SETS_CLOSE && lastNode.characterSet.length == 0) {
        throw new Error('Can not set a quantifier for an empty node');
    }

    var repeat = {
        from: null,
        to: null
    };

    // Extracts datas from quantifier
    var buffer = '';

    for (var internalCursor = 0, len = lastQuantifier.capture.length; internalCursor < len;
         internalCursor++) {
        var char = lastQuantifier.capture[internalCursor];

        switch (char) {
            case this.TOKEN_QUANTIFIER_OPEN:
                break;

            case this.TOKEN_QUANTIFIER_SEPARATOR:
                repeat.from = buffer;
                buffer = '';
                break;

            case this.TOKEN_QUANTIFIER_CLOSE:
                if (internalCursor == 1) {
                    throw new Error('A quantifier class should at least has one value');
                }

                // We did not found a max limit, so... GO FOR MAX_VALUE!!!
                if (buffer.length == 0) {
                    buffer = Number.MAX_VALUE;
                }

                if (repeat.from == null) {
                    repeat.from = buffer;
                }

                repeat.to = buffer;
                break;

            default:
                buffer += char;
        }
    }

    // We are checking types of `repeat` values
    for (var prop in repeat) {
        var value = repeat[prop];

        if (this.getType(value) == this.TYPE_NUMBER) {
            // n * 1 does not "cut" a number like parseInt does
            repeat[prop] = value * 1
        } else {
            throw new Error('Values of a quantifier class should be a number');
        }
    }

    if (repeat.from < 0 || repeat.to < 0) {
        throw new Error('Values of a quantifier class should be positive');
    }

    // We are not tolerant...
    if (repeat.from > repeat.to) {
        throw new Error('First value of quantifier class should be leather than the second value');
    }

    lastNode.repeat = repeat;
};

/**
 * Opens a character set
 */
Circuit.prototype.openCharacterSet = function () {
    this.circuit.push({
        type: this.NODE_CHARACTER_SET,
        from: this.cursor - 1
    });
};

/**
 * Closes a character set
 */
Circuit.prototype.closeCharacterSet = function () {
    var self = this;
    var lastSet = this.getLast(this.NODE_CHARACTER_SET);

    lastSet.to = this.cursor;
    lastSet.characterSet = this.regex.substring(lastSet.from, lastSet.to);
    lastSet.possibleChars = [];

    // Si on a qu'un caractère, alors on le transforme en character set
    if (lastSet.characterSet.length == 1) {
        lastSet.characterSet = this.TOKEN_CHARACTER_SETS_OPEN + lastSet.characterSet + this.TOKEN_CHARACTER_SETS_CLOSE;
    }

    // cursor = 1 & length -1 to avoid '[' and ']' treatment
    for (var cursor = 1; cursor < lastSet.characterSet.length - 1; cursor++) {

        // It is a range
        if (lastSet.characterSet[cursor + 1] == '-' && lastSet.characterSet[cursor + 2] != null) {
            var from = lastSet.characterSet[cursor];
            var to = lastSet.characterSet[cursor + 2];
            var cb = function () {
            };

            var fromType = this.getType(from);
            var toType = this.getType(to);

            // Types are not equal... (...)
            if (fromType != toType) {
                throw new Error("Impossible to generate an array from a range of two incompatible types")
            }

            switch (fromType) {
                // Both elements of the range are a number
                case this.TYPE_NUMBER:
                    from = parseInt(from);
                    to = parseInt(to);

                    cb = function (c) {
                        self.pushTo(lastSet.possibleChars, c);
                    };

                    break;

                // Both elements of the range are a letter
                case this.TYPE_LETTER:
                    from = from.charCodeAt(0);
                    to = to.charCodeAt(0);

                    cb = function (c) {
                        self.pushTo(lastSet.possibleChars, String.fromCharCode(c));
                    };

                    break;
            }

            this.generateRange(from, to, cb);
            cursor += 2; // '-'.length + to.length = 2

        } else { // Not a range, just a normal char
            this.pushTo(lastSet.possibleChars, lastSet.characterSet[cursor]);
        }
    }
};

/**
 * Get the last node from circuit where its type equals `type`
 * @param {Number} type NODE_CAPTURE_GROUP or NODE_CHARACTER_SET or NODE_QUANTIFIER
 * @returns {{}}
 */
Circuit.prototype.getLast = function (type) {
    var i = 0;
    var circuitComponent = {};

    while (!!circuitComponent && circuitComponent.type != type) {
        circuitComponent = this.circuit[this.circuit.length - ++i]
    }

    return circuitComponent;
};

/**
 * Returns type of `char`
 * @param {Number|String} char
 * @returns {Number}
 */
Circuit.prototype.getType = function (char) {
    if (char * 1 == char) {
        return this.TYPE_NUMBER;
    }

    char = char.toLowerCase();

    if (char >= 'a' && char <= 'z') {
        return this.TYPE_LETTER;
    }

    return this.TYPE_OTHER;
};

/**
 * Push an element in an array, but only if this element is not already in the array
 * @param {Array} array
 * @param {String} char
 * @returns {boolean}
 */
Circuit.prototype.pushTo = function (array, char) {
    if (array.indexOf(char) == -1) {
        array.push(char);
        return true;
    }

    return false;
};

/**
 * Makes a range from `from` to `to`
 * @param {Number} from Start of the range
 * @param {Number} to End of the range
 * @param {Function} callback callback
 */
Circuit.prototype.generateRange = function (from, to, callback) {

    // /!\ Magic trick
    // We are tolerent here. But, just here
    if (from > to) {
        from ^= to ^= from;
    }

    for (var i = from; i < to + 1; i++) {
        callback(i);
    }
};

/**
 * Display the circuit made from current regex
 */
Circuit.prototype.printCircuit = function () {
    var args;
    var node;

    for (var i in this.circuit) {
        args = [];
        node = this.circuit[i];

        args.push('Node #' + i);

        switch (node.type) {

            case this.NODE_QUANTIFIER:
                args.push('QUANTIFIER');
                args.push(node.capture);
                break;

            case this.NODE_CHARACTER_SET:
                var hasRepeat = !!node.repeat;

                args.push('CHARACTER_SET');
                args.push('Repetition : ' + (
                        hasRepeat ? '{' + node.repeat.from + ',' + node.repeat.to + '}' : false
                    ));
                args.push(node.characterSet);
                args.push(node.possibleChars.join(''));
                break;

            case this.NODE_CAPTURE_GROUP:
                args.push('CAPTURE_GROUP');
                console.log(node);
                args.push(node.capture);
                args.push(node.shouldCapture);
        }

        if (args.length != 0) {
            console.info.apply(console, [args]);
        }
    }
};
