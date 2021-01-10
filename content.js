
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log(request.greeting);

        if(request.command === 'new_note') {
            var buttonXPath = "//div[text()='New page']";
            var buttonElement = document.evaluate(buttonXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

            buttonElement.click();

            sendResponse({status: "done"});
        }
    }
);

function getPageItems() {
    var itemXPath = "//div[contains(@class, 'notion-page-block')]//div[@class='notranslate']";
    var items = document.evaluate(buttonXPath, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
    return items;
}

function getPageTitles(pageItems) {
    var titles = [];
    while(node = pageItems.iterateNext()) {
        titles.push(node.textContent);
    }
    return titles;
}

function getLabels(pageTitles) {

    var re = /\[(.+?)\]/g;

    labels = pageTitles.reduce((acc, title) => {
        var results = [...title.matchAll(re)];
        var allCaptures = results.map(result => result[1].toLowerCase());
        return new Set([...acc, ...allCaptures]);
    }, new Set());

    var labelsList = [...labels];
    labelsList.sort();
    return labelsList;
}

module.exports = {
    getPageTitles: getPageTitles,
    getLabels: getLabels,
}
