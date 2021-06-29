// Save a file from a given URL
// TODO: might be dumb to do this per file, maybe better to do it in bulk, like a list of URLs
// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/downloads/download
function saveFile(url, destinationPath) {
    console.log("Saving file from " + url);
}

// retreive all the current tabs that are open for the user
// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/windows/getAll
function getTabs(currentOnly) {
    
    // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/windows/Window
    var allTabs;
    
    // get a collection of browser windows, or only the current one
    if (currentOnly) {
        allTabs = browser.windows.getCurrent();
    } else {
        allTabs = browser.windows.getAll(true);
    }


}
