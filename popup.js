chrome.runtime.sendMessage({ command: 'get_labels_bg' });

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.command === 'send_labels') {
    console.log(request.command);

    var labels = request.data;
    var listElement = document.getElementById('labels-list');

    labels.forEach(function (label) {
      var listItem = document.createElement('li');
      var textNode = document.createTextNode(label);
      listItem.appendChild(textNode);
      listElement.appendChild(listItem);
    });
    sendResponse({ status: 'done' });
  }
});
