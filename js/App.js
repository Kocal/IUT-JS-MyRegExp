/**
 * The app!
 * @param {MyRegExp} myRegExp Instance of `MyRegExp`
 * @param {HTMLElement} $regex HTML element for regex input
 * @param {HTMLElement} $text HTML element for text input
 * @param {HTMLElement} $resultCircuitRegex HTML element to display the regex built by Circuit.js
 * @param {HTMLElement} $resultTest HTML element which will display the result of MyRegExp.test()
 * @param {HTMLElement} $resultExec HTML element which will display the result of MyRegExp.exec()
 * @constructor
 */
function App(myRegExp, $regex, $text, $resultCircuitRegex, $resultTest, $resultExec) {

    var els = [$regex, $text, $resultCircuitRegex, $resultTest, $resultExec];

    if (!(myRegExp instanceof MyRegExp)) {
        throw new Error("Expected an instance of `MyRegExp`");
    }

    for (var i = 0, len = els.length; i < len; i++) {
        if (els[i] == null) {
            throw new Error("One of elements cannot be found");
        }
    }

    this.myRegExp = myRegExp;
    this.$regex = $regex;
    this.$text = $text;
    this.$resultCircuitRegex = $resultCircuitRegex;
    this.$resultTest = $resultTest;
    this.$resultExec = $resultExec;
}

/**
 * Initialise the application
 */
App.prototype.init = function () {
    this.update();
    this.bindEvents();
};

/**
 * Should be called after a modification on the regex or the text
 */
App.prototype.update = function () {
    var self = this;
    var regex = this.$regex.value;
    var text = this.$text.value;

    var resultCircuitRegex = '';
    var resultTest = '';
    var resultExec = '';

    this.myRegExp.validate(regex, function (err) {
        resultCircuitRegex = self.myRegExp.circuit.regex;
        resultTest = self.myRegExp.test(regex, text);
        resultExec = self.myRegExp.exec(regex, text);

        if (err) {
            self.$regex.classList.add('input-error');
            self.$resultCircuitRegex.textContent =
                self.$resultTest.textContent =
                self.$resultExec.textContent = err;

            console.error(err);
            return;
        }

        self.$regex.classList.remove('input-error');
        self.$resultCircuitRegex.textContent = resultCircuitRegex;
        self.$resultTest.textContent = resultTest;
        self.$resultExec.textContent = resultExec;
    });
};

/**
 * Bind events to HTML elements
 */
App.prototype.bindEvents = function () {
    var self = this;

    // Prevent the call to an handler if the user is just moving the cursor with his keyboard
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

/**
 * Called when the regex value has changed
 * @param {Event} e
 */
App.prototype.onRegexChange = function (e) {
    this.update();
};

/**
 * Callend when the text value has changed
 * @param {Event} e
 */
App.prototype.onTextChange = function (e) {
    this.update();
};
