function MyRegExp() {
    this._debug = false;
    this.circuit = new Circuit();

    if (this._debug) {
        console.log("MyRegExp::constructor()");
    }
}

MyRegExp.prototype.isValid = function (regex) {
    if (this._debug) {
        console.log("MyRegExp::isValid");
    }

    var circuit = null;

    try {
        circuit = this.circuit.parse(regex);
    } catch (e) {
        console.error(e);
        return false;
    }

    return true;
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
