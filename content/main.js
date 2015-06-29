
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
postman('giveXT').onMail(function(message, sendResponse){
    console.info("Got message: " + message);
    sendResponse({xt: getXT()});
});