chrome.runtime.sendMessage({ command: 'get_labels_bg' });

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.command === 'send_labels') {
    console.log(request.command);

    const labels = request.data;
    const listElement = document.getElementById('labels-list');

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

    if (labels.length === 0) {
      const noLabelsHelpElement = document.getElementById('help-no-labels');
      noLabelsHelpElement.style.display = 'block';
    }

    sendResponse({ status: 'done' });
  }
});
