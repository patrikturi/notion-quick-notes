
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
