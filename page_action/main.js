"use strict";

var log = function(){};

var pAction = angular.module('pAction', []);

pAction.service('Logger', ['$interval', function($interval){
    var that = this;
    that.logs = [];
    var timeToShow = 2000;
    var clearFirstMessage = function(){
        that.logs.shift();
    };
    this.log = function(message){
        that.logs.push(message);
        $interval(clearFirstMessage, timeToShow);
    };
}]);

pAction.factory('postman', function(){return postman;});

pAction.controller('mainController', ['postman', '$scope', function(postman, $scope){
    var that = this;
    that.isReady = false;
    postman('popShown').send().then(function(){
        that.isReady = true;
        $scope.$apply();
    });
}]);

pAction.controller('messageController', ['Logger', function(logger){
    this.logs = logger.logs;
}]);
