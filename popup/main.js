// holy god jesus I have no idea how JQuery works
var downloadButton = document.getElementById('downloadButton');
// onClick's logic below:
downloadButton.addEventListener('click', function() {
    getTabs(true);
    console.log("download button clicked");
});

console.log("BULKDOWNLOADER STARTED")

// Save a file from a given URL
// TODO: might be dumb to do this per file, maybe better to do it in bulk, like a list of URLs
// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/downloads/download
function saveFile(url, destinationPath) {
    console.log("Saving file from " + url);
}

// retrieve all the current tabs that are open for the user
// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/windows/getAll
function getTabs(currentOnly) {
    console.log("getTabs called");
    // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/windows/Window
    var browserWindows;
    
    // get a collection of all browser windows, or only the current one
    if (currentOnly) {
        browserWindows = browser.windows.getCurrent();
    } else {
        browserWindows = browser.windows.getAll(true);
    }
    var allTabs;

    // build list of all tabs
    browserWindows.forEach(function (window) {
        allTabs.push(...window.tabs);
    })

    alltabs.forEach(tab => console.log(tab.title))


}
