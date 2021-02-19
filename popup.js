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
      listItem.addEventListener('click', function (e) {
        e.preventDefault();
        chrome.runtime.sendMessage({ command: 'go_to_label', label: label });
        window.close();
      });
      listElement.appendChild(listItem);
    });

    if (labels.length === 0) {
      var noLabelsHelpElement = document.getElementById('help-no-labels');
      noLabelsHelpElement.style.display = 'block';

      // var helpElement = document.getElementById('help');

      // var helpText = 'Did not find any labels';
      // var element = document.createElement('div');
      // var textNode = document.createTextNode(helpText);
      // element.appendChild(textNode);
      // helpElement.appendChild(element);

      // helpText =
      //   'You can create a label by using square brakets in the title of a page, eg: [books]';
      // element = document.createElement('div');
      // textNode = document.createTextNode(helpText);
      // element.appendChild(textNode);
      // helpElement.appendChild(element);
    }

    sendResponse({ status: 'done' });
  }
});
