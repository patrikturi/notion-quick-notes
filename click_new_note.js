

var buttonXPath = "//div[text()='New page']";
var buttonElement = document.evaluate(buttonXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

buttonElement.click();
