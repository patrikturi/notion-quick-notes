chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log(`Command: ${request.command}`);

  if (request.command === 'new_note') {
    const buttonElement = getNewPageButton();

    click(buttonElement);

    sendResponse({ status: 'done' });
  } else if (request.command === 'get_labels_content') {
    const pageItems = getPageItems();
    const pageTtiles = getPageTitles(pageItems);
    const labels = getLabels(pageTtiles);

    sendResponse({ data: labels });
  } else if (request.command === 'go_to_label') {
    const searchButton = getSearchButton();
    searchButton.click();
    setTimeout(() => {
      let input = getSearchInput();
      setInputValue(input, '[' + request.label + ']');

      sendResponse({ status: 'done' });
    }, 750);
  }
});

const click = (element) => {
  const event = new Event('click', { bubbles: true, cancelable: true });
  element.dispatchEvent(event);
};

const getSearchInput = () => {
  const xpath = '//input';
  return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE)
    .singleNodeValue;
};

// https://lifesaver.codes/answer/trigger-simulated-input-value-change-for-react-16-(after-react-dom-15-6-0-updated)
const setInputValue = (input, new_value) => {
  if (!input) {
    return;
  }
  input.value = new_value;
  const event = new Event('input', { bubbles: true });
  // Hack for React15
  event.simulated = true;
  // Hack for React16 descriptor value
  const tracker = input._valueTracker;
  if (tracker) {
    tracker.setValue(lastValue);
  }
  input.dispatchEvent(event);
};

const getNewPageButton = () => {
  const xpath = "//div[text()='New page']";
  return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE)
    .singleNodeValue;
};

const getSearchButton = () => {
  const xpath = "//div[text()='Quick Find']";
  return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE)
    .singleNodeValue;
};

const getPageItems = () => {
  const xpath = "//div[contains(@class, 'notion-page-block')]//div[@class='notranslate']";
  const items = document.evaluate(xpath, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE);
  return items;
};

const getPageTitles = (pageItems) => {
  const titles = [];
  while ((listItem = pageItems.iterateNext())) {
    titles.push(listItem.textContent);
  }
  return titles;
};

const getLabels = (pageTitles) => {
  const re = /\[(.+?)\]/g;

  const labels = pageTitles.reduce((acc, title) => {
    let results = [...title.matchAll(re)];
    let allCaptures = results.map((result) => result[1].toLowerCase());
    return new Set([...acc, ...allCaptures]);
  }, new Set());

  const labelsList = [...labels];
  labelsList.sort();
  return labelsList;
};

if (typeof exports !== 'undefined') {
  module.exports = {
    getPageTitles: getPageTitles,
    getLabels: getLabels,
  };
}
