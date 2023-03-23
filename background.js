
chrome.contextMenus.create({
  id: "extract-text",
  title: "Extract text content from page",
  contexts: ["page"]
});


function extractText() {

  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    var url = tabs[0].url;


    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status === 200) {
        var parser = new DOMParser();
        var htmlDoc = parser.parseFromString(xhr.responseText, 'text/html');
        var paragraphs = htmlDoc.getElementsByTagName('p');
        var text = '';
        for (var i = 0; i < paragraphs.length; i++) {
          text += paragraphs[i].textContent + '\n';
        }

        var newWindow = window.open('', 'Extracted Text', 'width=800,height=600,resizable,scrollbars');
        newWindow.document.write('<html><head><style>pre { white-space: pre-wrap; overflow: hidden; }</style></head><body><pre>' + text + '</pre></body></html>');
        newWindow.document.close();
      }
    };
    xhr.send();
  });
}


chrome.contextMenus.onClicked.addListener(function(info, tab) {
  if (info.menuItemId === "extract-text") {
    extractText();
  }
});
