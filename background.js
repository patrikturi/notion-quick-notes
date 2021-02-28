const loadGAScript = () => {
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=UA-190272445-1';
  script.onload = () => {
    const gtag = function () {
      dataLayer.push(arguments);
    };
    window.dataLayer = window.dataLayer || [];
    gtag('js', new Date());

    gtag('config', 'UA-190272445-1', {
      send_page_view: false,
    });
    gtag('event', 'page_view', {
      page_title: 'BackgroundScript',
      page_location: 'https://notion-quick-notes.com/background/',
      page_path: '/background/',
      send_to: 'UA-190272445-1',
    });
  };
  const s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(script, s);
};

chrome.runtime.onInstalled.addListener(() => {
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log(`Command: ${request.command}`);

    if (request.command === 'get_labels_bg') {
      queryActiveTab((tabId) => {
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
      queryActiveTab((tabId) => {
        chrome.tabs.sendMessage(tabId, request);
      });
    }
  });

  chrome.commands.onCommand.addListener((command) => {
    console.log('Command:', command);
    queryActiveTab((tabId) => {
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
});

const queryActiveTab = (callback) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    callback(tabs[0].id);
  });
};

loadGAScript();
