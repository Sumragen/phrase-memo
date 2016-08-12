/**
 * Created by sumragen on 01.08.16.
 */
pAction.controller('modOneController', [
    'postman',
    '$scope',
    'mainService',
    function (postman, $scope, mainService) {
        var that = this;
        that.amountOfCorrectAnswers = 0;
        that.test_index = 0;
        that.result = null;
        that.tests = mainService.getTests();
        that.amountOfFinishedTests = 0;
        that.incorrectAnswers = [];
        var unsuccessfulTestsFromLS = [];
        (function () {
            chrome.storage.sync.get('PHRASE-MEMO', function (res) {
                unsuccessfulTestsFromLS = res['PHRASE-MEMO'].unsuccessful.modOne || [];
            })
        })();

        $scope.prevTest = function () {
            $scope.setTestIndex(that.test_index <= 0 ? that.test_index : --that.test_index);
        };

        $scope.nextTest = function () {
            $scope.setTestIndex(that.test_index < that.tests.length - 1 ? ++that.test_index : that.test_index);
        };

        $scope.setTestIndex = function (index) {
            that.test_index = index;
            that.result = that.tests[that.test_index].answer.selected || null;
        };

        $scope.setAnswer = function (check) {
            var currentTest = that.tests[that.test_index];
            if (currentTest.answer.isCorrect == 0) {
                currentTest.answer.selected = that.result;
                if (check.isCorrect) {
                    ++that.amountOfCorrectAnswers;
                    currentTest.answer.isCorrect = 1;
                    utils.forEach(unsuccessfulTestsFromLS, function (test, index) {
                        if (currentTest.id == test) {
                            unsuccessfulTestsFromLS.splice(index, 1);
                        }
                    })
                } else {
                    that.incorrectAnswers.push({
                        id: currentTest.id,
                        test: that.test_index,
                        from: currentTest.phrase,
                        to: currentTest.correct,
                        answer: currentTest.answer.selected.choice
                    });
                    currentTest.answer.isCorrect = -1;
                }
                if (++that.amountOfFinishedTests == that.tests.length) {
                    chrome.storage.sync.get('PHRASE-MEMO', function (res) {
                        var _phrase_memo = res['PHRASE-MEMO'];
                        utils.forEach(that.incorrectAnswers, function (answer) {
                            unsuccessfulTestsFromLS.push(answer.id);
                        });
                        _phrase_memo.unsuccessful.modOne = unsuccessfulTestsFromLS;
                        chrome.storage.sync.set({'PHRASE-MEMO': _phrase_memo});
                    });
                }
            }
        };

        $scope.checkResult = function () {
            //postman('recordResult').send(result);
        };

        $scope.returnToMenu = function () {
            mainService.returnToMenu();
        };

        $scope.getTests = function () {
            return mainService.getTests();
        };
    }]);