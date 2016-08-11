/**
 * Created by sumragen on 01.08.16.
 */

pAction.controller('settingsController', [
    'postman',
    '$scope',
    'mainService',
    function (postman, $scope, mainService) {
        var that = this;
        that.template_index = 'Global';
        that.difficult_index = 'Normal';

        that.defaultDifficults = {
            'Easy': {
                amountOfTests: 10,
                choicesLength: 3
            },
            'Normal': {
                amountOfTests: 20,
                choicesLength: 4
            },
            'Hard': {
                amountOfTests: 30,
                choicesLength: 6
            }
        };

        that.settingsEndpoint = {
            'Mod I': {
                name: 'ModOne',
                template: 'trainerOne.html'
            },
            'Mod II': {
                name: 'ModTwo',
                template: 'trainerTwo.html'
            },
            'Global': {
                name: 'Global',
                template: 'global.html'
            }
        };

        $scope.setDifficultIndex = function (index) {
            that.difficult_index = index;
        };

        that.getSettingsFor = function (index) {
            that.template_index = index;
            postman('getSettings' + that.settingsEndpoint[index].name).send().then(function (res) {
                that.settingsParams = res;
            })
        };

        that.returnToMenu = function () {
            mainService.returnToMenu();
        };

        that.applyChanges = function (index) {
            if (that.settingsEndpoint[index].name == 'Global') {
                postman('setSettingsModOne').send(that.defaultDifficults[that.difficult_index]).then(function (res) {
                    postman('setSettingsModTwo').send(that.defaultDifficults[that.difficult_index])
                });
            } else {
                postman('setSettings' + that.settingsEndpoint[index].name).send(that.settingsParams).then(function (res) {
                });
            }
        }
    }]);