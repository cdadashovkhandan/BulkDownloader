// Save a file from a given URL
// TODO: might be dumb to do this per file, maybe better to do it in bulk, like a list of URLs
// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/downloads/download
function saveFile(iurl, destinationPath) {
    console.log("Saving file from " + iurl);
    browser.downloads.download({
      url : iurl,
      conflictAction : 'uniquify'
    });
}

function handleMessage(request, sender, sendResponse) {
    console.log("message received " + request);
    saveFile(request, "asdfsddf");
    sendResponse({response: "ACK"}); // TODO: this is redundant
  }

browser.runtime.onMessage.addListener(handleMessage);
