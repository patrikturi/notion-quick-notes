
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
    // while(node = items.iterateNext())
    // node.textContent
    return 'hello';
}

function getLabels(pageTitles) {

}

module.exports = {
    getPageTitles: getPageTitles,
    getLabels: getLabels,
}
