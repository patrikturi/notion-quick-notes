chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log(`Command: ${request.command}`);

  if (request.command === 'new_note') {
    var buttonElement = getNewPageButton();

    click(buttonElement);

    sendResponse({ status: 'done' });
  } else if (request.command === 'get_labels_content') {
    var pageItems = getPageItems();
    var pageTtiles = getPageTitles(pageItems);
    var labels = getLabels(pageTtiles);

    sendResponse({ data: labels });
  } else if (request.command === 'go_to_label') {
    var searchButton = getSearchButton();
    searchButton.click();
    setTimeout(function () {
      var input = getSearchInput();
      setInputValue(input, '[' + request.label + ']');

      sendResponse({ status: 'done' });
    }, 750);
  }
});

function click(element) {
  var event = document.createEvent('HTMLEvents');
  event.initEvent('click', true, true);
  element.dispatchEvent(event);
}

function getSearchInput() {
  var xpath = '//input';
  return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE)
    .singleNodeValue;
}

// https://lifesaver.codes/answer/trigger-simulated-input-value-change-for-react-16-(after-react-dom-15-6-0-updated)
function setInputValue(input, new_value) {
  if (!input) {
    return;
  }
  input.value = new_value;
  var event = new Event('input', { bubbles: true });
  // Hack for React15
  event.simulated = true;
  // Hack for React16 descriptor value
  var tracker = input._valueTracker;
  if (tracker) {
    tracker.setValue(lastValue);
  }
  input.dispatchEvent(event);
}

function getNewPageButton() {
  var xpath = "//div[text()='New page']";
  return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE)
    .singleNodeValue;
}

function getSearchButton() {
  var xpath = "//div[text()='Quick Find']";
  return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE)
    .singleNodeValue;
}

function getPageItems() {
  var xpath = "//div[contains(@class, 'notion-page-block')]//div[@class='notranslate']";
  var items = document.evaluate(xpath, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE);
  return items;
}

function getPageTitles(pageItems) {
  var titles = [];
  while ((listItem = pageItems.iterateNext())) {
    titles.push(listItem.textContent);
  }
  return titles;
}

function getLabels(pageTitles) {
  var re = /\[(.+?)\]/g;

  labels = pageTitles.reduce((acc, title) => {
    var results = [...title.matchAll(re)];
    var allCaptures = results.map((result) => result[1].toLowerCase());
    return new Set([...acc, ...allCaptures]);
  }, new Set());

  var labelsList = [...labels];
  labelsList.sort();
  return labelsList;
}

if (typeof exports !== 'undefined') {
  module.exports = {
    getPageTitles: getPageTitles,
    getLabels: getLabels,
  };
}
