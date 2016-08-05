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

        var unsuccessfulTestsFromLS = JSON.parse(localStorage.getItem('phrase-memo')).unsuccessful.modTwo || [];
        var _incorrectAnswers = [];

        var checkIsDone = function () {
            if (that.amountOfFinishedTests == that.tests.length) {
                var _phrase_memo = JSON.parse(localStorage.getItem('phrase-memo'));
                utils.forEach(_incorrectAnswers, function (answer) {
                    unsuccessfulTestsFromLS.push(answer);
                });
                _phrase_memo.unsuccessful.modTwo = unsuccessfulTestsFromLS;
                localStorage.setItem('phrase-memo', JSON.stringify(_phrase_memo))
            }
        };

        that.showAnswer = function () {
            if(that.tests[that.test_index].answer.isCorrect == 0){
                that.tests[that.test_index].answer.isCorrect = -1;
                that.tests[that.test_index].answer.selected = that.result = that.tests[that.test_index].definition;
                ++that.amountOfFinishedTests;

                _incorrectAnswers.push(that.tests[that.test_index].id);
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
            if (check == that.tests[that.test_index].definition) {
                that.tests[that.test_index].answer.isCorrect = 1;
                that.tests[that.test_index].answer.selected = that.result;
                ++that.amountOfCorrectAnswers;
                ++that.amountOfFinishedTests;
                utils.forEach(unsuccessfulTestsFromLS, function (test, index) {
                    if (that.tests[that.test_index].id == test) {
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