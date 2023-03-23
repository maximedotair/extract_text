// Créer une option de menu contextuel
chrome.contextMenus.create({
  id: "extract-text",
  title: "Extraire le contenu texte de la page",
  contexts: ["page"]
});

// Fonction pour extraire le texte d'une page
function extractText() {
  // Récupérer l'URL de la page courante
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    var url = tabs[0].url;

    // Envoyer une requête HTTP pour récupérer le contenu HTML de la page
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status === 200) {
        // Utiliser la bibliothèque DOMParser pour extraire le texte de la réponse HTTP
        var parser = new DOMParser();
        var htmlDoc = parser.parseFromString(xhr.responseText, 'text/html');
        var paragraphs = htmlDoc.getElementsByTagName('p');
        var text = '';
        for (var i = 0; i < paragraphs.length; i++) {
          text += paragraphs[i].textContent + '\n';
        }

        // Créer une fenêtre pour afficher le texte extrait
        var newWindow = window.open('', 'Extracted Text', 'width=800,height=600,resizable,scrollbars');
        newWindow.document.write('<html><head><style>pre { white-space: pre-wrap; overflow: hidden; }</style></head><body><pre>' + text + '</pre></body></html>');
        newWindow.document.close();
      }
    };
    xhr.send();
  });
}

// Ajouter un écouteur d'événements pour le clic sur l'option du menu contextuel
chrome.contextMenus.onClicked.addListener(function(info, tab) {
  if (info.menuItemId === "extract-text") {
    extractText();
  }
});
