"use strict";

$(function () {
    var $logger = $('#logger');

    var log = function(message){
        var $item  = $('<div></div>');
        $item.text(message);
        $logger.append($item);
    };

    $('#init').click(function(){
        postman('popShown').send();
    });

    postman('deployTrainer').onMail(function(message){
        log(message);
    });
});
