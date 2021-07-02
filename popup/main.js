// extra debug output
var debug = true;

var allSelected = false;

var selectedTabs = []
var downloadableTabs = []

var excludedFormats = [".asp", ".html", ".htm", ".php"]
var videoFormats = [".mp4", ".mkv", ".webm", ".ogg"]

var destinationPath = null;
// basic error handling
function onError(error) { console.log(`Error: ${error}`);}

// get all the current window's tabs immediately upon activation
getTabs(true);

// holy god jesus I have no idea how JQuery works
var downloadButton = document.getElementById('downloadButton');
var selectAllButton = document.getElementById('selectAllButton');

// download button logic
downloadButton.addEventListener('click', async function() {
    console.log("Download button clicked");
    for (let tab of selectedTabs) {
        console.log(tab.url);
        try {
            await browser.runtime.sendMessage(JSON.stringify({tab: tab, path: destinationPath}));
        } catch (error) {
            console.error("downloadButton error: " + error.message)
        }
    }
});

document.getElementById("fileInput").addEventListener("change", function(event) {
    destinationPath = event.target;  
});

selectAllButton.addEventListener('click', function() {
    console.log("All files selected");
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

function displayTab(tab, format) {
    var isVideo = videoFormats.includes(format); 
    var table = document.getElementById("backdrop");
    var row = table.insertRow();

    var cell = row.insertCell()
    cell.className = "tabData deselected";
    cell.innerHTML = tab.fileName;

    // Thumbnail generation
    var thumbnail = row.insertCell();
    if (isVideo) {
        thumbnail.innerHTML = `<video> <source src="${tab.url}" type="video/${format.substring(1)}"></video>`;
    } else if (format == ".pdf") { // generic thumbnail for pdf, as they don't have thumbnails on their own.
        thumbnail.innerHTML = "<img src = \"pdficon.png\"></img>"
    } else {
        thumbnail.innerHTML = "<img src = \"" + tab.url + "\"></img>"
    }
    
    cell.addEventListener('click', function() {
        if (cell.className == "tabData selected") {    
        cell.className = "tabData deselected";
            selectedTabs.pop(tab);
        } else {
            cell.className = "tabData selected"
            selectedTabs.push(tab);
            if (selectedTabs.length == downloadableTabs.length) allSelected = true;
        }
    });
}

// Filter tabs to only the ones that contain files, then display them.
function filterTabs(tabs) { 
    const regex = new RegExp("\\..{3,4}\\b$")
    const fileNameRegex = new RegExp("[a-zA-Z0-9_.]*\\..{3,4}$")
    for (let tab of tabs) {
        console.log("[DEBUG] TAB URL IS " + tab.url);
        var format = tab.url.match(regex);
        if (format != null) {
            format = format[0].toLowerCase();
        } else continue;

        console.log("format = " + format);
        // TODO: might be a little bit naive with the magic number index
        if (format != null && !excludedFormats.includes(format) )  {
            downloadableTabs.push(tab); 
            tab.fileName = tab.url.match(fileNameRegex)[0];
            displayTab(tab, format)
        }
    }
    
    if (debug) {
        console.log("------TABS DETECTED------")
        for (let tab of downloadableTabs) {
            console.log(tab.url);
        }
    }
}

// retrieve all the current tabs that are open for the user
// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/windows/getAll
function getTabs(currentOnly) {

    let querying = browser.tabs.query({currentWindow:  currentOnly});

    querying.then(filterTabs, onError)
}
