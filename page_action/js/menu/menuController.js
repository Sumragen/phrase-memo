/**
 * Created by sumragen on 01.08.16.
 */

pAction.controller('menuController', [
    'postman',
    '$scope',
    'mainService',
    function (postman, $scope, mainService) {
        function getTest(name) {
            postman(name).send().then(function (res) {
                mainService.setTests(res.tests);
                mainService.setTemplate(res.template);
            });
        }

        $scope.openTestModOne = function () {
            getTest('getTestModOne');
        };

        $scope.openTestModTwo = function () {
            getTest('getTestModTwo');
        };

        $scope.openSettings = function () {
            mainService.setTemplate('settings/main.html');
        };
    }]);