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
        var unsuccessfulTestsFromLS = [];
        (function () {
            chrome.storage.sync.get('PHRASE-MEMO', function (res) {
                unsuccessfulTestsFromLS = res['PHRASE-MEMO'].unsuccessful.modOne || [];
            })
        })();

        var _incorrectAnswers = [];

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
            if (that.tests[that.test_index].answer.isCorrect == 0) {
                if (check.isCorrect) {
                    that.tests[that.test_index].answer.isCorrect = 1;
                    utils.forEach(unsuccessfulTestsFromLS, function (test, index) {
                        if (that.tests[that.test_index].id == test) {
                            unsuccessfulTestsFromLS.splice(index, 1);
                        }
                    })
                } else {
                    _incorrectAnswers.push(that.tests[that.test_index].id);
                    that.tests[that.test_index].answer.isCorrect = -1;
                }
                that.tests[that.test_index].answer.selected = that.result;
                if (check.isCorrect) {
                    ++that.amountOfCorrectAnswers;
                }
                ++that.amountOfFinishedTests;
                if (that.amountOfFinishedTests == that.tests.length) {
                    chrome.storage.sync.get('PHRASE-MEMO', function (res) {
                        var _phrase_memo = res['PHRASE-MEMO'];
                        utils.forEach(_incorrectAnswers, function (answer) {
                            unsuccessfulTestsFromLS.push(answer);
                        });
                        _phrase_memo.unsuccessful.modOne = unsuccessfulTestsFromLS;
                        chrome.storage.sync.set({'PHRASE-MEMO' : _phrase_memo});
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