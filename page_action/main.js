"use strict";

$(function () {
    var $logger = $('#logger');

    var log = function(message){
        var $item  = $('<div></div>');
        $item.text(message);
        $logger.append($item);
    };

    $('#init').click(function(){
        chrome.runtime.sendMessage({type: 'popShown'});
    });

    chrome.runtime.onMessage.addListener(function(request){
        if (isMessageOfType('deployTrainer', request)){
            log(request.message);
        }
    });
});
