function getPhrases(xt) {
    var url = "https://translate.google.com.ua/translate_a/sg?client=t&cm=g&hl=en&xt=" + xt;
    return $.get(url).then(
        function (successData) {
            var result = eval(successData);
            return result[2];
        },
        function (a, b, c) {
            console.warn("Can't fetch phrasebook");
            console.error(c);
        }
    )
}

function deployTrainer(phrases) {
    console.log(phrases);
    chrome.runtime.sendMessage({type: "deployTrainer", message: "Phrases are gotten"});
}

chrome.runtime.onMessage.addListener(function (request) {
    if (isMessageOfType('popShown', request)) {
        console.info("Page Action clicked");
        /*send message about to xt*/
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            if (tabs.length > 0) {
                chrome.tabs.sendMessage(tabs[0].id, {giveXT: true}, function (data) {
                    if ('xt' in data) {
                        getPhrases(data['xt']).done(deployTrainer);
                    }
                });
            }
        });
    }
});