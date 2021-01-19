chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.command === 'new_note') {
    var buttonElement = getNewPageButton();
    buttonElement.click();

    sendResponse({ status: 'done' });
  } else if (request.command === 'get_labels_content') {
    var pageItems = getPageItems();
    var pageTtiles = getPageTitles(pageItems);
    var labels = getLabels(pageTtiles);

    console.log(labels);

    sendResponse({ data: labels });
  }
});

function getNewPageButton() {
  var xpath = "//div[text()='New page']";
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
