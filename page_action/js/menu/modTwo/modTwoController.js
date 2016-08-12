/**
 * Created by sumragen on 01.08.16.
 */

pAction.controller('modTwoController', [
    'postman',
    'mainService',
    function (postman, mainService) {
        var that = this;
        that.result = null;
        that.tests = mainService.getTests();
        that.test_index = 0;
        that.amountOfFinishedTests = 0;
        that.amountOfCorrectAnswers = 0;
        that.incorrectAnswers = [];
        var unsuccessfulTestsFromLS = [];
        (function () {
            chrome.storage.sync.get('PHRASE-MEMO', function (res) {
                unsuccessfulTestsFromLS = res['PHRASE-MEMO'].unsuccessful.modTwo || [];
            })
        })();

        var checkIsDone = function () {
            if (that.amountOfFinishedTests == that.tests.length) {
                var unsuccessfulTestsFromLS = [];
                chrome.storage.sync.get('PHRASE-MEMO', function (res) {
                    var _phrase_memo = res['PHRASE-MEMO'];
                    utils.forEach(that.incorrectAnswers, function (answer) {
                        unsuccessfulTestsFromLS.push(answer.id);
                    });
                    _phrase_memo.unsuccessful.modTwo = unsuccessfulTestsFromLS;
                    chrome.storage.sync.set({'PHRASE-MEMO': _phrase_memo});
                });
            }
        };

        that.showAnswer = function () {
            var currentTest = that.tests[that.test_index];
            var currentAnswer = currentTest.answer;

            if (currentAnswer.isCorrect == 0) {
                currentAnswer.isCorrect = -1;
                currentAnswer.selected = that.result = currentTest.definition;
                ++that.amountOfFinishedTests;

                that.incorrectAnswers.push({
                    id: currentTest.id,
                    test: that.test_index,
                    from: currentTest.phrase,
                    to: currentTest.definition
                });
                checkIsDone();
            }
        };
        that.isCorrect = function () {
            return that.result == that.tests[that.test_index].definition
        };

        that.returnToMenu = function () {
            mainService.returnToMenu();
        };

        that.checkAnswer = function (check) {
            var currentTest = that.tests[that.test_index];
            var currentAnswer = currentTest.answer;

            if (check == currentTest.definition) {
                currentAnswer.isCorrect = 1;
                currentAnswer.selected = that.result;
                ++that.amountOfCorrectAnswers;
                ++that.amountOfFinishedTests;
                utils.forEach(unsuccessfulTestsFromLS, function (test, index) {
                    if (currentTest.id == test) {
                        unsuccessfulTestsFromLS.splice(index, 1);
                    }
                });
                checkIsDone();
            }
        };

        that.prevTest = function () {
            that.setTestIndex(that.test_index <= 0 ? that.test_index : --that.test_index);
        };

        that.nextTest = function () {
            that.setTestIndex(that.test_index < that.tests.length - 1 ? ++that.test_index : that.test_index);
        };

        that.setTestIndex = function (index) {
            that.test_index = index;
            that.result = that.tests[that.test_index].answer.selected;
        };

        that.checkResult = function () {
            //postman('recordResult').send(result);
        };
    }]);