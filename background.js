// Save a file from a given URL
// TODO: might be dumb to do this per file, maybe better to do it in bulk, like a list of URLs
// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/downloads/download
function saveFile(tab, destinationPath) {
    var url = tab.url;
    console.log("Saving file from " + url);
    var options = {
      url : url,
      conflictAction : 'uniquify'
    }

    if (destinationPath != "null" && destinationPath != null) options.filename = `${destinationPath}/${tab.fileName}`;
    
    browser.downloads.download(options);  
}

function handleMessage(request, sender, sendResponse) {
    console.log("message received " + request);
    request = JSON.parse(request);
    console.log("parsed request: " + JSON.stringify(request));
    saveFile(request.tab, request.path);
  }

browser.runtime.onMessage.addListener(handleMessage);
