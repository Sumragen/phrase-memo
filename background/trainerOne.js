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

    if (!load().settings.modOne) {
        var modOne = {
            nativeDictKey: 'ru',
            choicesLength: 4,
            amountOfTests: 20
        };
        if (!phrase_book.settings) {
            phrase_book.settings = {};
        }
        phrase_book.settings.modOne = modOne;
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
        if (rawPhrase[1] == phrase_book.settings.modOne.nativeDictKey) {
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
     * returns array of phrases where first element is the phrase to train
     * @param len: is needed length of array to be returned
     */
    var getPhrases = function (len, id) {
        var _ids = {};
        var _phrase = getPhrase(id);
        _ids[_phrase.id] = true;
        var _phrases = [_phrase];

        while (_phrases.length < len) {
            var _possiblePhrase = randomBasePhrases.get();
            if (!(_possiblePhrase.id in _ids)) {
                _ids[_possiblePhrase.id] = true;
                _phrases.push(_possiblePhrase);
            }
        }
        return _phrases;
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
        var test = {
            id: null,
            phrase: null,
            choices: [],
            answer: {
                isCorrect: 0,
                selected: null
            }
        };
        var isFirst = true;
        utils.forEach(getPhrases(phrase_book.settings.modOne.choicesLength, id), function (phrase) {
            if (isFirst) {
                test.id = phrase.id;
                test.phrase = phrase.from;
            }
            test.choices.push({
                choice: phrase.to,
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

    var addSomeUnsuccessfulTests = function (tests) {
        var _unsuccessfulTests = JSON.parse(localStorage.getItem('phrase-memo')).unsuccessful.modOne || [];
        var _amount = Math.floor(tests.length / 4);
        utils.forEach(_unsuccessfulTests, function (id) {
            if (_amount > 0) {
                tests[getRandomIndex(tests.length)] = getTest(id);
                _amount--;
            }
        })
    };

    postman('getTestModOne').onMail(function (data, sendResponse) {
        load();
        var responseBody = {
            template: 'trainer/one.html',
            tests: []
        };
        utils.forEach(new Array(phrase_book.settings.modOne.amountOfTests), function () {
            responseBody.tests.push(getTest());
        });
        addSomeUnsuccessfulTests(responseBody.tests);
        sendResponse(responseBody);
    });

    postman('recordResult').onMail(function (result) {
        recordResult(result);
    });
    postman('getSettingsModOne').onMail(function (data, sendResponse) {
        load();
        sendResponse(phrase_book.settings.modOne);
    });
    postman('setSettingsModOne').onMail(function (data, sendResponse) {
        load();
        phrase_book.settings.modOne = {
            nativeDictKey: data.nativeDictKey || phrase_book.settings.modOne.nativeDictKey || 'ru',
            choicesLength: data.choicesLength || phrase_book.settings.modOne.choicesLength || 4,
            amountOfTests: data.amountOfTests || phrase_book.settings.modOne.amountOfTests || 20
        };
        commit();
        sendResponse(phrase_book);
    });
})();