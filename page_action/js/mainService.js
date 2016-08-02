/**
 * Created by sumragen on 01.08.16.
 */

pAction.service('mainService', [function () {
    var that = this;
    that.template = null;
    that.tests = [];

    that.setTemplate = function (value) {
        return that.template = value;
    };
    that.getTemplate = function () {
        return that.template;
    };
    
    that.setTests = function (data) {
        return that.tests = data;
    };
    that.getTests = function () {
        return that.tests;
    };
    
    that.returnToMenu = function () {
        that.template = null;
        that.tests = [];
    };
}]);