chrome.runtime.onInstalled.addListener(function() {
  
  chrome.commands.onCommand.addListener(function(command) {
    console.log('Command:', command);
    if(command === 'new_note') {
      chrome.tabs.executeScript({
        file: 'click_new_note.js'
      });
    }

  });
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        pageUrl: {hostEquals: 'developer.chrome.com'},
      })
      ],
          actions: [new chrome.declarativeContent.ShowPageAction()]
        }]);
  });
});