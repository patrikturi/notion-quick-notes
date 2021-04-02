chrome.runtime.onInstalled.addListener(() => {
  installListener();
});

chrome.runtime.onStartup.addListener(() => {
  installListener();
});


const installListener = () => {
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log(`Command: ${request.command}`);

    if (request.command === 'get_labels_bg') {
      withContentScript((tabId) => {
        chrome.tabs.sendMessage(tabId, { command: 'get_labels_content' }, (response) => {
          if (response) {
            chrome.runtime.sendMessage({
              command: 'send_labels',
              data: response.data,
            });
          }
        });
      });
    } else if (request.command === 'go_to_label') {
      queryActiveTab((tabId) => { // Content script is already injected
        chrome.tabs.sendMessage(tabId, request);
      });
    }
  });

  chrome.commands.onCommand.addListener((command) => {
    console.log('Command:', command);
    withContentScript((tabId) => {
      chrome.tabs.sendMessage(tabId, { command: command });
    });
  });

  chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { hostContains: 'notion.so' },
          }),
        ],
        actions: [new chrome.declarativeContent.ShowPageAction()],
      },
    ]);
  });
};

const queryActiveTab = (callback) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    callback(tabs[0].id);
  });
};

const withContentScript = (callback) => {
  chrome.tabs.executeScript({
    file: 'content.js'
  }, () => {
    queryActiveTab((tabId) => {
      callback(tabId);
    });
  });
};
