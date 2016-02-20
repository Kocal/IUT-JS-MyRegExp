function App(myRegExp, $regex, $text, $resultTest, $resultExec) {

    var els = [$regex, $text, $resultTest, $resultExec];

    if (!(
        myRegExp instanceof MyRegExp)) {
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
    var self = this;
    var regex = this.$regex.value.trim();
    var text = this.$text.value;

    var resultTest = this.myRegExp.test(regex, text);
    var resultExec = this.myRegExp.exec(regex, text);

    this.myRegExp.validate(regex, function (err) {
        if (err) {
            self.$regex.classList.add('input-error');
            self.$resultTest.textContent =
                self.$resultExec.textContent = err;
            console.error(err);
            return;
        }

        self.$regex.classList.remove('input-error');
        self.$resultTest.textContent = resultTest;
        self.$resultExec.textContent = resultExec;
    });
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
