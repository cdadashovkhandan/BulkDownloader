// Save a file from a given URL
// TODO: might be dumb to do this per file, maybe better to do it in bulk, like a list of URLs
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


// Handle incoming download request
function handleMessage(request, sender, sendResponse) {
    request = JSON.parse(request);
    saveFile(request.tab, request.path);
  }

browser.runtime.onMessage.addListener(handleMessage);
