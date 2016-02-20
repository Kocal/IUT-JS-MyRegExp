function App(myRegExp, $regex, $text, $resultTest, $resultExec) {

    var els = [$regex, $text, $resultTest, $resultExec];

    if (!(myRegExp instanceof MyRegExp)) {
        throw new Error("Expected an instance of `MyRegExp`");
    }

    for (var i = 0, len = els.length; i < len; i++) {
        var el = els[i];

        if (el == null) {
            throw new Error("One of elements cannot be found");
        }
    }

    this.myRegExp = myRegExp;
    this.$regex = $regex;
    this.$text = $text;
    this.$resultTest = $resultTest;
    this.$resultExec = $resultExec;
}

App.prototype.init = function () {
    this.update();
    this.bindEvents();
};

App.prototype.update = function () {
    var regex = this.$regex.value.trim();
    var text = this.$text.value;

    var isValid = this.myRegExp.isValid(regex);
    var resultTest = this.myRegExp.test(regex, text);
    var resultExec = this.myRegExp.exec(regex, text);

    if (!isValid) {
        this.$regex.classList.add('input-error');
        this.$resultTest.textContent =
            this.$resultExec.textContent = "Invalid regex";
    } else {
        this.$regex.classList.remove('input-error');
        this.$resultTest.textContent = resultTest;
        this.$resultExec.textContent = resultExec;
    }

};

App.prototype.bindEvents = function () {
    var self = this;

    // On évitera de lancer le parsing de la regex si on ne fait que déplacer
    // le curseur dans les zones de text
    var regexValue = this.$regex.value;
    var textValue = this.$text.value;

    this.$regex.addEventListener('keyup', function (e) {
        if (regexValue == this.value) {
            return;
        }

        regexValue = this.value;
        return self.onRegexChange(e);
    });

    this.$text.addEventListener('keyup', function (e) {
        if (textValue == this.value) {
            return;
        }

        textValue = this.value;
        return self.onTextChange(e);
    });
};

App.prototype.onRegexChange = function (e) {
    this.update();
};

App.prototype.onTextChange = function (e) {
    this.update();
};
