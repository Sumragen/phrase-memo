
function getXT(){
    /*look for script with USAGE and send it to background*/
    $('script').each(function () {
        var text = $(this).text();
        if (text.indexOf('USAGE') > -1) {
            eval(text);
        }
    });

    if (typeof USAGE != 'undefined') {
        return USAGE;
    }
    return null;
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    console.info("Got message: " + request);
    if ('giveXT' in request){
        sendResponse({xt: getXT()});
    }
});