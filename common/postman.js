/**
 * Created by kostyak on 29.06.15.
 */

/**
 * wraps chrome.runtime sendMessage|onMessage methods
 * uses jQuery Deferred obj
 *
 * motivation: create easy identifiable messages
 * @param name String should b used to identify Postman instance
 */
function postman(name) {
    var deferred = $.Deferred;
    var identityKey = 'postman';
    var getPackage = function (data) {
        /*wraps payload into package*/
        var package = {
            payload: data || ''
        };
        package[identityKey] = name;
        return package;
    };
    var checkDelivery = function (response) {
        /*gets delivery from package*/
        if (typeof response == 'object'
            && identityKey in response
            && 'payload' in response
            && response[identityKey] === name) {
            return response;
        }
        return null;
    };

    /**
     * use:
     *  postman(unique-name).send('data').then(function('response'){});
     *
     * @param data
     * @param tabId not obligatory param. If set message will be sent to tab iw specified tabId
     * @returns {*}
     */
    var send = function (data, tabId) {
        var _deferred = deferred();
        var _package = getPackage(data);
        var _cb = function(response){_deferred.resolve(response)};
        if (typeof tabId === 'undefined') {
            chrome.runtime.sendMessage(_package, _cb);
        } else {
            chrome.tabs.sendMessage(tabId, _package, _cb);
        }

        return _deferred.promise();
    };
    /**
     * use:
     *  postman('unique-name').onMail(function(data, sendResponse){...});
     *
     * @param cb Callback function that should be called with 'data' and sendResponse
     *  'data' is information sent
     *  'sendResponse' Callback function should be used to send response: `sendResponse("response")`
     */
    var onMail = function (cb) {
        chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
            var _delivery = checkDelivery(request);
            if (Boolean(_delivery)) {
                cb(_delivery.payload || undefined, sendResponse);
            }
            return true;
        });
    };

    return {send: send, onMail: onMail};
}