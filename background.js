chrome.runtime.onInstalled.addListener(function () {
  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.command === 'get_labels_bg') {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { command: 'get_labels_content' }, function (response) {
          console.log(response.data);
          chrome.runtime.sendMessage({
            command: 'send_labels',
            data: response.data,
          });
        });
      });
    }
  });

  chrome.commands.onCommand.addListener(function (command) {
    console.log('Command:', command);
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { command: command });
    });
  });
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
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
});
