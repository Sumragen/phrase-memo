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

        that.showAnswer = function () {
            that.tests[that.test_index].answer.isCorrect = -1;
            that.tests[that.test_index].answer.selected = that.result = that.tests[that.test_index].definition;
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