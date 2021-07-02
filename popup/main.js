// extra debug output
var debug = true;


var selectedTabs = []
var downloadableTabs = []

var excludedFormats = [".asp", ".html", ".htm", ".php"]
var videoFormats = [".mp4", ".mkv", ".webm", ".ogg"]

// basic error handling
function onError(error) { console.log(`Error: ${error}`);}

// get all the current window's tabs immediately upon activation
getTabs(true);

// holy god jesus I have no idea how JQuery works
var downloadButton = document.getElementById('downloadButton');

// download button logic
downloadButton.addEventListener('click', async function() {
    console.log("boop");
    for (let tab of selectedTabs) {
        console.log(tab.url);
        try {
            await browser.runtime.sendMessage(tab.url);
        } catch (error) {
            console.error("downloadButton error: " + error.message)
        }
    }
});

function displayTab(tab, format) {
    var isVideo = videoFormats.includes(format); 
    var table = document.getElementById("backdrop");
    var row = table.insertRow();

    var cell = row.insertCell()
    cell.className = "tabData";
    cell.innerHTML = tab.title.substring(0,17) + "...";
    cell.id = "deselected"
    var thumbnail = row.insertCell();
    if (isVideo) {
        thumbnail.innerHTML = `<video> <source src="${tab.url}" type="video/${format.substring(1)}"></video>`;
    } else {
        thumbnail.innerHTML = "<img src = \"" + tab.url + "\"></img>"
    }
    
    cell.addEventListener('click', function() {
        if (cell.id == "selected") {
            cell.id = "deselected";
            selectedTabs.pop(tab);
            cell.style.backgroundColor = "#354952";
        } else {
            cell.id = "selected"
            cell.style.backgroundColor = "#34b4eb";
            selectedTabs.push(tab);
        }
    });
}

// Filter tabs to only the ones that contain files, then display them.
function filterTabs(tabs) { 
    const regex = new RegExp("\\..{3,4}\\b$")
    
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
