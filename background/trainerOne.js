/**
 * trainerOne is our first trainer
 *
 * functionality:
 * * proposes phrase populated with translated variants
 * * todo
 */

(function () {
    "use strict";

    var nativeDictKey = 'ru';
    var choicesLength = 4;
    /**
     * array of {id, from, to, toDictKey}
     * @type {Array}
     */
    var dictionary = [];

    var writePhrase = function (rawPhrase) {
        /*rawPhrase example:
        * ["j0YwJe6T61w", "ru", "en", "произвольный", "arbitrary", 1413313880579293]
        * */
        var native = null;
        var to = null;
        var toDictKey = null;
        if (rawPhrase[1] == nativeDictKey){
            native = rawPhrase[3];
            to = rawPhrase[4];
            toDictKey = rawPhrase[2];
        } else {
            native = rawPhrase[4];
            to = rawPhrase[3];
            toDictKey = rawPhrase[1];
        }
        dictionary.push({
            id: rawPhrase[0],
            from: native,
            to: to,
            toDictKey: toDictKey
        });
    };

    var prepareDictionary = function () {
        if (phrases == null) {
            console.error("Can't prepare phrases");
            return;
        }
        utils.forEach(phrases, writePhrase);
        console.debug("Dictionary: ");
        console.debug(dictionary);
    };

    var getRandomIndexes = function (count) {
        /*todo*/
        return [1, 2, 3, 4];
    };

    /**
     * returns random element from dictionary
     *
     * test = {
     *  'phrase': str,
     *  'choices': [{
     *      'choice: str,
     *      'isCorrect': bool
     *  },]
     * }
     */
    var getTest = function () {
        if (dictionary.length == 0) {
            prepareDictionary();
        }
        var test = {
            phrase: null,
            choices: []
        };
        var isFirst = true;
        utils.forEach(getRandomIndexes(choicesLength), function(i){
            if (isFirst){
                test.phrase = dictionary[i].from;
            }
            test.choices.push({
                choice: dictionary[i].to,
                isCorrect: isFirst
            });
            isFirst = false;
        });
        return test;
    };

    var recordResult = function (result) {
        /*todo*/
    };

    postman('getTest').onMail(function (data, sendResponse) {
        sendResponse(getTest());
    });

    postman('recordResult').onMail(function (result) {
        recordResult(result);
    })
})();