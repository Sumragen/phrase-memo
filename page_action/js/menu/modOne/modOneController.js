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
                that.tests[that.test_index].answer.isCorrect = check.isCorrect ? 1 : -1;
                that.tests[that.test_index].answer.selected = that.result;
                if(check.isCorrect){
                    ++that.amountOfCorrectAnswers;
                }
                ++that.amountOfFinishedTests;
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