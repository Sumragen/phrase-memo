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

    /**
     * returns an index between 0 and max
     * @param length of an array
     * @returns {number}
     */
    var getRandomIndex = function(length){
       return Math.floor(Math.random() * length);
    };

    var getRandomIndexes = function (count) {
        var _result = [];
        for (var i= 0; i < choicesLength; i++){
            _result.push(getRandomIndex(dictionary.length));
        }
        return _result;
    };

    /**
     * gets first Element in array and inserts it randomly in arr
     * @param arr
     */
    var shakeFirstElem = function(arr){
       var first = arr.shift();
        arr.splice(getRandomIndex(arr.length), 0, first);
    };

    /**
     * returns phrase to learn
     */
    var getPhrase = function(){
        /*todo*/
        return dictionary[getRandomIndex(dictionary.length)];
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
        shakeFirstElem(test.choices);
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