/**
 * trainerOne is our first trainer
 *
 * functionality:
 * * proposes phrase populated with translated variants
 * * todo
 */

(function () {
    "use strict";

    var phrase_book = {};

    function commit() {
        localStorage.setItem('phrase-memo', JSON.stringify(phrase_book));
    }

    function load() {
        return phrase_book = JSON.parse(localStorage.getItem('phrase-memo'));
    }

    if (!load().settings.modTwo) {
        var modTwo = {
            nativeDictKey: 'ru',
            amountOfTests: 20
        };
        if (!phrase_book.settings) {
            phrase_book.settings = {};
        }
        phrase_book.settings.modTwo = modTwo;
        commit();
    }
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
        if (rawPhrase[1] == phrase_book.settings.modTwo.nativeDictKey) {
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
    var getRandomIndex = function (length) {
        return Math.floor(Math.random() * length);
    };

    /**
     * gets first Element in array and inserts it randomly in arr
     * @param arr
     */
    var shakeFirstElem = function (arr) {
        var len = arr.length;
        var newIndex = getRandomIndex(len);
        if (newIndex == 0) {
            return;
        }
        var first = arr.shift();
        if (newIndex == len) {
            arr.append();
        } else {
            arr.splice(newIndex, 0, first);
        }
    };

    /**
     * @param arr Array to be shake
     * @returns undefined
     */
    var shakeArray = function (arr) {
        /*todo should define more complicate algorithm*/
        for (var i = 0, l = arr.length; i < l; i++) {
            shakeFirstElem(arr);
        }
    };
    /**
     * holds shaken phrases and returns them one by one as long as it is necessary
     *
     * use:
     *  randomPhrases.get();
     *  todo build more getters for different phrase types
     */
    var randomBasePhrases = (function () {
        var _indexes = [];
        var _getInitialIndexes = function () {
            var _inArr = [];
            utils.forEach(dictionary, function (elem, i) {
                _inArr.push(i);
            });
            return _inArr;
        };
        var _getIndex = function () {
            if (_indexes.length == 0) {
                _indexes = _getInitialIndexes();
                shakeArray(_indexes);
            }
            return _indexes.shift();
        };
        var get = function () {
            return dictionary[_getIndex()];
        };
        return {get: get};
    })();

    var getIndexById = function (id) {
        var res = null;
        utils.forEach(dictionary, function (word, index) {
            if (word.id == id) {
                res = index;
            }
        });
        return res;
    };

    /**
     * returns phrase to learn
     */
    var getPhrase = function (id) {
        /*todo*/
        if (id) {
            return dictionary[getIndexById(id)]
        } else {
            return dictionary[getRandomIndex(dictionary.length)];
        }
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
    var getTest = function (id) {
        if (dictionary.length == 0) {
            prepareDictionary();
        }
        var phrase = getPhrase(id);
        return {
            id: phrase.id,
            phrase: phrase.from,
            definition: phrase.to,
            answer: {
                isCorrect: 0,
                selected: null
            }
        };
    };

    var recordResult = function (result) {
        /*todo*/
    };

    var addSomeUnsuccessfulTests = function (tests) {
        var _unsuccessfulTests = JSON.parse(localStorage.getItem('phrase-memo')).unsuccessful.modTwo || [];
        var _amount = Math.floor(tests.length / 4);
        utils.forEach(_unsuccessfulTests, function (id) {
            if (_amount > 0) {
                tests[getRandomIndex(tests.length)] = getTest(id);
                _amount--;
            }
        })
    };

    postman('getTestModTwo').onMail(function (data, sendResponse) {
        var responseBody = {
            template: 'trainer/two.html',
            tests: []
        };
        utils.forEach(new Array(phrase_book.settings.modTwo.amountOfTests), function () {
            responseBody.tests.push(getTest());
        });
        addSomeUnsuccessfulTests(responseBody.tests);
        sendResponse(responseBody);
    });
    postman('getSettingsModTwo').onMail(function (data, sendResponse) {
        load();
        sendResponse(phrase_book.settings.modTwo);
    });
    postman('setSettingsModTwo').onMail(function (data, sendResponse) {
        load();
        phrase_book.settings.modTwo = {
            nativeDictKey: data.nativeDictKey || phrase_book.settings.modTwo.nativeDictKey || 'ru',
            amountOfTests: data.amountOfTests || phrase_book.settings.modTwo.amountOfTests || 20
        };
        commit();
        sendResponse(phrase_book);
    });

    postman('recordResult').onMail(function (result) {
        recordResult(result);
    })
})();