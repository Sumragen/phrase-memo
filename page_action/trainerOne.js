/**
 * this is a client part of trainerOne
 */

pAction.controller('trainerOneController', ['postman', function (postman) {
    var that = this;
    that.currentTest = null;
    that.result = null;

    that.getTest = function () {
        postman('getTest').send().then(function (test) {
            that.currentTest = test;
            that.result = null;
            console.log(test);
        });
    };

    that.checkResult = function () {
        //postman('recordResult').send(result);
    };
}]);