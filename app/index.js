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
//sleep log DOM elements
let listSleepDOM = new Array(10);
for (let i=0; i<listSleepDOM.length; i++) {
    let symbol = document.getElementById("listSleepItem" + i);
    listSleepDOM[i] = [symbol.getElementById("txtTime"), 
                       symbol.getElementById("txtDuration")];
}

//initialize clock / refresh
clock.granularity = "seconds";

//initialize latest saved data
let times = storage.loadTimes();
let sleepLog = storage.loadSleepLog();
updateFeedText();
updateSleepText();
updateSleepLog();
toggleSleepButton();

// event handler: button FEED clicked
btTr.onactivate = function(evt) {
    
    times.feed = new Date();
    
    // save feed time to device
    storage.saveTimes(times);
    
    // refresh display
    updateFeedText();

}

// event handler: button SLEEP clicked
btBr.onactivate = function(evt) {

    // check if currently a sleep is ongoing
    if (!times.sleeping) {
        
        // if not sleeping
        times.sleepStart = new Date();
        times.sleepEnd = null;
        times.sleeping = true;

    } else {

        //if sleeping
        times.sleepEnd = new Date();
        times.sleeping = false;

        //store a new sleep log entry
        let logTimes = timeCalc.hoursMin(times.sleepStart) + " - " + timeCalc.hoursMin(times.sleepEnd);
        let logDuration = timeCalc.elapsed(times.sleepStart);
        sleepLog.unshift([logTimes, logDuration]);
        sleepLog.pop();
        storage.saveSleepLog(sleepLog);
        updateSleepLog();

     }

    // save sleep time to device
    storage.saveTimes(times);

    // refresh display
    updateSleepText(); 
    toggleSleepButton();

}

// event handler: update elapsed time on each clock tick
clock.ontick = (evt) => {
    
    // update elapsed
    updateFeedText();
    updateSleepText();
}

// update feed display
function updateFeedText() {

    timeFeed.text = timeCalc.hoursMin(times.feed);
    elapsedFeed.text = timeCalc.elapsed(times.feed) + " ago";

}

function updateSleepText() {

    // always
    timeSleepStart.text = "start: " + timeCalc.hoursMin(times.sleepStart);

    // depending on sleep status
    if (times.sleeping) {

        // sleep is ongoing
        timeSleepEnd.text = "sleeping";
        timeSleepEnd.style.fill = "fb-indigo";
        elapsedSleep.text = "for " + timeCalc.elapsed(times.sleepStart);

    } else {

        // sleep is not ongoing
        timeSleepEnd.text = "end: " + timeCalc.hoursMin(times.sleepEnd);
        timeSleepEnd.style.fill = "white";
        elapsedSleep.text = "awake for " + timeCalc.elapsed(times.sleepEnd);

    }

}

function updateSleepLog() {

    for (let index = 0; index < sleepLog.length; index++) {
        listSleepDOM[index][0].text = sleepLog[index][0];
        listSleepDOM[index][1].text = "Duration: " + sleepLog[index][1];
    }

}

function toggleSleepButton() {
    
    // change the icon of the sleep combo button depending if a sleep is ongoing or not
    let btIcon = btBr.getElementById("combo-button-icon");
    let btIconPressed = btBr.getElementById("combo-button-icon-press");

    if (times.sleeping) {

        btIcon.image = "icons/btn_combo_pause_p.png";
        btIconPressed.image = "icons/btn_combo_pause_press_p.png";

    } else {
        
        btIcon.image = "icons/btn_combo_sleep.png";
        btIconPressed.image = "icons/btn_combo_sleep.png";

    }

}