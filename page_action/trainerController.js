/**
 * this is a client part of trainerOne
 */

pAction.controller('trainerController', ['postman', function (postman) {
    var that = this;
    that.result = null;
    that.tests = [];
    that.test_index = 0;
    that.settingsEndpoint = {
        'Mod I': {
            name: 'ModOne',
            template: 'trainerOne.html'
        },
        'Mod II': {
            name: 'ModTwo',
            template: 'trainerTwo.html'
        },
    }

    function getTest(name) {
        postman(name).send().then(function (res) {
            that.test_index = 0;
            that.tests = res.tests;
            that.template = res.template;
            console.log(that.test_index);
            console.log(that.tests);
            that.result = null;
        });
    }

    that.showAnswer = function () {
        that.tests[that.test_index].answer.isCorrect = -1;
        that.tests[that.test_index].answer.selected = that.result = that.tests[that.test_index].definition;
    };
    that.isCorrect = function () {
        return that.result == that.tests[that.test_index].definition
    };

    that.getTestModOne = function () {
        getTest('getTestModOne');
    };

    that.getTestModTwo = function () {
        getTest('getTestModTwo');
    };

    that.getSettingsFor = function (index) {
        postman('getSettings' + that.settingsEndpoint[index].name)
            .send()
            .then(function (res) {
                that.settingsParams = res;
                console.log('settings:')
                console.log(res);
            })
    };

    that.returnToMenu = function () {
        that.tests = [];
        that.template = null;
        that.result = null;
    };

    that.setAnswerTrOne = function (check) {
        if (that.tests[that.test_index].answer.isCorrect == 0) {
            that.tests[that.test_index].answer.isCorrect = check.isCorrect ? 1 : -1;
            that.tests[that.test_index].answer.selected = that.result;
        }
    };

    that.checkAnswerTrTwo = function (check) {
        if (check == that.tests[that.test_index].definition) {
            that.tests[that.test_index].answer.isCorrect = 1;
            that.tests[that.test_index].answer.selected = that.result;
        }
    };

    that.prevTest = function () {
        that.setTestIndex(that.test_index <= 0 ? that.test_index : --that.test_index);
    };

    that.nextTest = function () {
        that.setTestIndex(that.test_index <= 19 ? ++that.test_index : that.test_index);
    };

    that.setTestIndex = function (index) {
        that.test_index = index;
        that.result = that.tests[that.test_index].answer.selected;
    };

    that.openSettings = function () {
        that.template = 'settings/main.html';
    };

    that.checkResult = function () {
        //postman('recordResult').send(result);
    };

    that.applyChanges = function (index) {
        console.log('sendBody: ');
        console.log(that.settingsParams);
        postman('setSettings' + that.settingsEndpoint[index].name).send(that.settingsParams).then(function (res) {
            console.log('res:');
            console.log(res);
        });
    }
}]);