var allSelected = false;

var selectedTabs = []
var downloadableTabs = []

var excludedFormats = [".asp", ".html", ".htm", ".php"]
var videoFormats = [".mp4", ".mkv", ".webm", ".ogg"]

var destinationPath = null;
// Basic error handling
function onError(error) { console.error(`Error: ${error}`);}

// Get all the current window's tabs immediately upon activation
getTabs(true);

var downloadButton = document.getElementById('downloadButton');
var selectAllButton = document.getElementById('selectAllButton');

// Download button logic
downloadButton.addEventListener('click', async function() {
    for (let tab of selectedTabs) {
        try {
            await browser.runtime.sendMessage(JSON.stringify({tab: tab, path: destinationPath}));
        } catch (error) {
            console.error("downloadButton error: " + error.message)
        }
    }
});

// Specify a folder name
document.getElementById("fileInput").addEventListener("change", function(event) {
    destinationPath = event.target.value; 
});

// (De-)select all elements
selectAllButton.addEventListener('click', function() {
    if (allSelected) {
        var selectedItems = document.getElementsByClassName("tabData selected");
        while(selectedItems.length) {
            selectedItems[0].className = "tabData deselected";
        }
        
        selectedTabs = [];
    } else {
        var deselectedItems = document.getElementsByClassName("tabData deselected");
        while(deselectedItems.length) {
            deselectedItems[0].className = "tabData selected";
        }
        selectedTabs = [...downloadableTabs];
    } 
    allSelected = !allSelected;
})

// Display a tab's thumbnail and filename as a selectable element in a table
function displayTab(tab, format) {
    var isVideo = videoFormats.includes(format); 
    var table = document.getElementById("backdrop");
    var row = table.insertRow();

    var cell = row.insertCell()
    cell.className = "tabData deselected";
    cell.innerHTML = tab.fileName;

    // Thumbnail generation
    var thumbnail = row.insertCell();
    if (isVideo) { //FIX: Currently displays nothing.
        thumbnail.innerHTML = `<video> <source src="${tab.url}" type="video/${format.substring(1)}"> Your browser does not support the video tag</video>`;
    } else if (format == ".pdf") { // Generic thumbnail for pdf, as they don't have thumbnails on their own.
        thumbnail.innerHTML = "<img src = \"pdficon.png\"></img>"
    } else {
        thumbnail.innerHTML = "<img src = \"" + tab.url + "\"></img>"
    }
    
    // Selection functionality
    cell.addEventListener('click', function() {
        if (cell.className == "tabData selected") {    
            cell.className = "tabData deselected";
            selectedTabs.pop(tab);
        } else {
            cell.className = "tabData selected"
            selectedTabs.push(tab);
        }
        allSelected = (selectedTabs.length == downloadableTabs.length);
    });
}

// Filter tabs to only the ones that contain files, then display them.
function filterTabs(tabs) { 
    const fileTypeRegex = new RegExp("\\..{3,4}\\b$") // Regex for seeing if the link is a file
    const fileNameRegex = new RegExp("[a-zA-Z0-9_.]*\\..{3,4}$") // Regex for extracting the filename
    //TODO: Maybe the functionality of both could be merged?

    for (let tab of tabs) {
        var format = tab.url.match(fileTypeRegex);
        if (format != null) {
            format = format[0].toLowerCase();
        } else continue;

        if (format != null && !excludedFormats.includes(format) )  {
            downloadableTabs.push(tab); 
            tab.fileName = tab.url.match(fileNameRegex)[0];
            displayTab(tab, format)
        }
    }
}

// Retrieve all the current tabs that are open for the user
// Beginning point for displaying all tabs in the popup
function getTabs(currentOnly) {

    let querying = browser.tabs.query({currentWindow:  currentOnly});

    querying.then(filterTabs, onError)
}
