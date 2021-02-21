const MAX_RETRIES = 10;
let retryCount = 0;
let prevLabels = [];

chrome.runtime.sendMessage({ command: 'get_labels_bg' });

const timerId = setInterval(() => {
  retryCount++;
  chrome.runtime.sendMessage({ command: 'get_labels_bg' });
}, 1000);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.command === 'send_labels') {
    console.log(request.command);

    const labels = request.data;
    const listElement = document.getElementById('labels-list');

    while (listElement.lastElementChild) {
      listElement.removeChild(listElement.lastElementChild);
    }

    labels.forEach((label) => {
      const listItem = document.createElement('li');
      const textNode = document.createTextNode(label);
      listItem.appendChild(textNode);
      listItem.addEventListener('click', (e) => {
        e.preventDefault();
        chrome.runtime.sendMessage({ command: 'go_to_label', label: label });
        window.close();
      });
      listElement.appendChild(listItem);
    });

    const noLabelsHelpElement = document.getElementById('help-no-labels');
    noLabelsHelpElement.style.display = labels.length === 0 ? 'block' : 'none';
    if ((labels.length > 1 && prevLabels.length === labels.length) || retryCount >= MAX_RETRIES) {
      clearTimeout(timerId);
    }
    prevLabels = labels;

    sendResponse({ status: 'done' });
  }
});
