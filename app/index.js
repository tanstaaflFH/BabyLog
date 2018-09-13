//imports
import document from "document";
import * as storage from "./storage";
import clock from "clock";
import * as timeCalc from "./timeCalc";

//get all interactive DOM elements
let timeFeed = document.getElementById("timeFeed");
let elapsedFeed = document.getElementById("elapsedFeed");
let timeSleepStart = document.getElementById("timeSleepStart");
let timeSleepEnd = document.getElementById("timeSleepEnd");
let elapsedSleep = document.getElementById("elapsedSleep");
let btTr = document.getElementById("btn-tr");
let btBr = document.getElementById("btn-br");

//initialize clock / refresh
clock.granularity = "seconds";

//initialize latest saved data
let times = storage.loadTimes();
updateDataText();
updateElapsedText();
timeSleepStart.text = times.sleepStart || "--";
timeSleepEnd.text = times.sleepEnd || "--";
elapsedSleep.text = timeCalc.elapsed(times.sleepEnd) + " ago";

// event handler: button FEED clicked
btTr.onactivate = function(evt) {
    
    times.feed = new Date();
    
    // save feed time to device
    storage.saveTimes(times);
    
    // refresh display
    updateDataText();
    updateElapsedText();
}

// event handler: update elapsed time on each clock tick
clock.ontick = (evt) => {
    // update elapsed
    updateElapsedText();
}

// update feed display
function updateDataText() {
    timeFeed.text = timeCalc.hoursMin(times.feed);
}

function updateElapsedText() {
    elapsedFeed.text = timeCalc.elapsed(times.feed) + " ago";
}
