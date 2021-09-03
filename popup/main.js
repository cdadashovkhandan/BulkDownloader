var globals = {
    allSelected:false,
    selectedTabs:[],
    downloadableTabs:[],
    excludedFormats:[".asp", ".html", ".htm", ".php"],
    videoFormats:[".mp4", ".mkv", ".webm", ".ogg"],
    destinationPath:null
};
// Basic error handling
function onError(error) { console.error(`Error: ${error}`);}

// Get all the current window's tabs immediately upon activation
getTabs(true);

var downloadButton = document.getElementById('downloadButton');
var selectAllButton = document.getElementById('selectAllButton');

// Download button logic
downloadButton.addEventListener('click', async function() {
    for (let tab of globals.selectedTabs) {
        try {
            await browser.runtime.sendMessage(JSON.stringify({tab: tab, path: globals.destinationPath}));
        } catch (error) {
            console.error("downloadButton error: " + error.message)
        }
    }
});

// Specify a folder name
document.getElementById("fileInput").addEventListener("change", function(event) {
    globals.destinationPath = event.target.value; 
});

// (De-)select all elements
selectAllButton.addEventListener('click', function() {
    if (globals.allSelected) {
        var selectedItems = document.getElementsByClassName("tabData selected");
        while(selectedItems.length) {
            selectedItems[0].className = "tabData deselected";
        }
        
        globals.selectedTabs = [];
    } else {
        var deselectedItems = document.getElementsByClassName("tabData deselected");
        while(deselectedItems.length) {
            deselectedItems[0].className = "tabData selected";
        }
        globals.selectedTabs = [...globals.downloadableTabs];
    } 
    globals.allSelected = !globals.allSelected;
})

// Display a tab's thumbnail and filename as a selectable element in a table
function displayTab(tab, format) {
    var isVideo = globals.videoFormats.includes(format); 
    var table = document.getElementById("backdrop");
    var row = table.insertRow();

    var cell = row.insertCell()
    cell.className = "tabData deselected";
    cell.textContent = tab.fileName;

    // Thumbnail generation
    // Adapted from: https://devtidbits.com/2017/12/06/quick-fix-the-unsafe_var_assignment-warning-in-javascript/

    var thumbnail = row.insertCell();
    const parser = new DOMParser();

    thumbnail.innerHTML = ``;
    let tags;
    let thumb;
    let parsed;

    if (isVideo) { //FIX: Currently displays nothing for me, but works for others.
        thumb = `<video> <source src="${tab.url}" type="video/${format.substring(1)}"> Your browser does not support the video tag</video>`;
        parsed = parser.parseFromString(thumb, 'text/html');
        tags = parsed.getElementsByTagName('video');
    }  else {
        if (format == ".pdf") { // Generic thumbnail for PDF's
            thumb = "<img src = \"pdficon.png\"></img>"
        } else {
            thumb = "<img src = \"" + tab.url + "\"></img>";   
        }
        parsed = parser.parseFromString(thumb, 'text/html');
        tags = parsed.getElementsByTagName('img');
    }

    for (const tag of tags) {
        thumbnail.appendChild(tag);
    }
    //end of thumbnail generation

    // Selection functionality
    cell.addEventListener('click', function() {
        if (cell.className == "tabData selected") {    
            cell.className = "tabData deselected";
            globals.selectedTabs.pop(tab);
        } else {
            cell.className = "tabData selected"
            globals.selectedTabs.push(tab);
        }
        globals.allSelected = (globals.selectedTabs.length == globals.downloadableTabs.length);
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

        if (!globals.excludedFormats.includes(format))  {
            globals.downloadableTabs.push(tab); 
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
