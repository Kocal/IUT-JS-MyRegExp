function MyRegExp() {
    this._debug = false;

    if (this._debug) {
        console.log("MyRegExp::constructor()");
    }

}

MyRegExp.prototype.isValid = function (regex) {
    if (this._debug) {
        console.log("MyRegExp::isValid");
    }

    try {
        this._parse(regex);
    } catch (e) {
        console.error(e);
        return false;
    }

    return true;
};

MyRegExp.prototype._parse = function (regex) {
    if (this._debug) {
        console.log("MyRegExp::parse");
    }

    var stack = [];
    var delimiters = {
        '(': ')',
        '[': ']',
        '{': '}'
    };

    for (var i = 0, len = regex.length; i < len; i++) {
        var char = regex[i];

        switch (char) {
            case "(":
            case "{":
            case "[":
                stack.push(delimiters[char]);
                break;

            case ")":
            case "}":
            case "]":
                var closeDelimiter = stack.pop();

                if (char !== closeDelimiter) {
                    throw new Error("MyRegExp: `" + closeDelimiter + "` expected, got `" + char + "`");
                }

                break;
        }
    }

    if (stack.length !== 0) {
        throw new Error("MyRegExp: unexpected end of regex at `" + char + "`");
    }
};

MyRegExp.prototype.test = function (regex, text) {
    if (this._debug) {
        console.log("MyRegExp::test");
    }

    return true;
};

MyRegExp.prototype.exec = function (regex, text) {
    if (this._debug) {
        console.log("MyRegExp::exec");
    }

    return true;
};
