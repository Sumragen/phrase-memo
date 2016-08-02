/**
 * Created by sumragen on 01.08.16.
 */

pAction.controller('settingsController', [
    'postman',
    '$scope',
    'mainService',
    function (postman, $scope, mainService) {
        var that = this;
        that.settingsEndpoint = {
            'Mod I': {
                name: 'ModOne',
                template: 'trainerOne.html'
            },
            'Mod II': {
                name: 'ModTwo',
                template: 'trainerTwo.html'
            }
        };

        that.getSettingsFor = function (index) {
            postman('getSettings' + that.settingsEndpoint[index].name).send().then(function (res) {
                    that.settingsParams = res;
                })
        };

        that.returnToMenu = function () {
            mainService.returnToMenu();
        };

        that.applyChanges = function (index) {
            postman('setSettings' + that.settingsEndpoint[index].name).send(that.settingsParams).then(function (res) {

            });
        }
    }]);