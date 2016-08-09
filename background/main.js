var phrases = null;

function getPhrases(xt) {
    var url = "https://translate.google.com.ua/translate_a/sg?client=t&cm=g&hl=en&xt=" + xt;
    return $.get(url).then(
        function (successData) {
            var result = eval(successData);
            phrases = result[2];
        },
        function (a, b, c) {
            console.warn("Can't fetch phrasebook");
            console.error(c);
        }
    )
}

postman('popShown').onMail(function (data, sendResponse) {
    console.info("Page Action clicked");
    /*send message about to xt*/
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        if (tabs.length > 0) {
            postman('giveXT').send(' ', tabs[0].id).then(function (data) {
                if ('xt' in data) {
                    getPhrases(data['xt']).done(sendResponse);
                }
            });
        }
    });
});
(function () {
    var modOne = {
        nativeDictKey: 'ru',
        choicesLength: 4,
        amountOfTests: 20
    };
    var modTwo = {
        nativeDictKey: 'ru',
        amountOfTests: 20
    };
    var phrase_memo = {
        settings: {
            modOne: modOne,
            modTwo: modTwo
        },
        unsuccessful: {
            modOne: [],
            modTwo: []
        }
    };

    chrome.storage.sync.get('PHRASE-MEMO', function (res) {
        if (!res['PHRASE-MEMO']) {
            chrome.storage.sync.set({'PHRASE-MEMO': phrase_memo}, function () {
                console.info('PHRASE-MEMO saved;');

            });
        }
    });
})();