//imports
import document from "document";
import * as storage from "./storage";
import clock from "clock";
import * as timeCalc from "./timeCalc";
import { display } from "display";

//get all interactive DOM elements
let screens = document.getElementById("panoramaView");
let paginationDots = document.getElementById("pagination-dots");
let timeFeed = document.getElementById("timeFeed");
let timeSleepStart = document.getElementById("timeSleepStart");
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
//feed log DOM elements
let listFeedDOM = new Array(10);
for (let i=0; i<listFeedDOM.length; i++) {
    let symbol = document.getElementById("listFeedItem" + i);
    listFeedDOM[i] = [symbol.getElementById("txtTime"), 
                      symbol.getElementById("txtDuration")];
}
//input mask correction of times DOM
let clickTargetFeed = document.getElementById("clickTargetFeed");
let clickTargetSleepStart = document.getElementById("clickTargetSleepStart");
let clickTargetSleepEnd = document.getElementById("clickTargetSleepEnd");
let screenInputMask = screens.getElementById("screen3");
let inpCorrectionLabel = document.getElementById("inpCorrectionLabel");
let tumblerLeft = document.getElementById("tumblerLeft");
let tumblerRight = document.getElementById("tumblerRight");
let btnAccept = document.getElementById("btnAccept");
let btnCancel = document.getElementById("btnCancel");

//initialize clock / refresh
clock.granularity = "minutes";

//initialize latest saved data
let times = storage.loadTimes();
let sleepLog = storage.loadSleepLog();
let feedLog = storage.loadFeedLog();
let correctionType = ""; //module variable to store which time shall be corrected
updateFeedText();
updateSleepText();
updateSleepLog();
updateFeedLog();
toggleSleepButton();

// event handler: button FEED clicked
btTr.onactivate = function(evt) {
    
    //store a new feed log entry
    let tempNow = new Date();
    let logTimes = timeCalc.hoursMin(tempNow);
    let logDuration = timeCalc.elapsed(times.feed);
    feedLog.unshift([logTimes, logDuration, tempNow]);
    feedLog.pop();
    storage.saveFeedLog(feedLog);

    // update current display
    times.feed = new Date();
    
    // save feed time to device
    storage.saveTimes(times);
    
    // refresh display
    updateFeedText();
    updateFeedLog();

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

// event handler: update main screen on display change
display.onchange = function() {

    if (display.on) {

        // update elapsed
        updateFeedText();
        updateSleepText();

    }

}

// event handlers for click targets
clickTargetFeed.onclick = function() {
    correctionType="feed";
    showInputMaskCorrection(correctionType);
}
clickTargetSleepStart.onclick = function() {
    correctionType="sleep start";
    showInputMaskCorrection(correctionType);
}
clickTargetSleepEnd.onclick = function() {
    if (times.sleeping) {
        return;
    }
    correctionType="sleep end";
    showInputMaskCorrection(correctionType);
}

// event handler for buttons during input mask correction
btnAccept.onactivate = function(evt) {
    updateTimeEntry(correctionType);
    hideInputMaskCorrection();
}

btnCancel.onactivate = function(evt) {
    correctionType = "";
    hideInputMaskCorrection();
}

// update feed display
function updateFeedText() {

    timeFeed.text = timeCalc.hoursMin(times.feed) + " / " + timeCalc.elapsed(times.feed) + " ago";

}

function updateSleepText() {

    // depending on sleep status
    if (times.sleeping) {

        // sleep is ongoing
        timeSleepStart.text = timeCalc.hoursMin(times.sleepStart) + " - sleeping";
        elapsedSleep.text = "for " + timeCalc.elapsed(times.sleepStart);

    } else {

        // sleep is not ongoing
        timeSleepStart.text = timeCalc.hoursMin(times.sleepStart) + " - " + timeCalc.hoursMin(times.sleepEnd);
        elapsedSleep.text = "for " + timeCalc.elapsed(times.sleepEnd);

    }

}

function updateSleepLog() {

    for (let index = 0; index < sleepLog.length; index++) {
        listSleepDOM[index][0].text = sleepLog[index][0];
        listSleepDOM[index][1].text = "Duration: " + sleepLog[index][1];
    }

}

function updateFeedLog() {

    for (let index = 0; index < feedLog.length; index++) {
        listFeedDOM[index][0].text = feedLog[index][0];
        listFeedDOM[index][1].text = "Since last: " + feedLog[index][1];
    }

}

function toggleSleepButton() {
    
    // change the icon of the sleep combo button depending if a sleep is ongoing or not
    let btIcon = btBr.getElementById("combo-button-icon");
    let btIconPressed = btBr.getElementById("combo-button-icon-press");
    let iconStatusSleep = document.getElementById("iconStatusSleep");

    if (times.sleeping) {

        btIcon.image = "icons/btn_combo_pause_p.png";
        btIconPressed.image = "icons/btn_combo_pause_press_p.png";
        iconStatusSleep.image = "icons/btn_combo_sleep.png";

    } else {
        
        btIcon.image = "icons/btn_combo_sleep.png";
        btIconPressed.image = "icons/btn_combo_sleep.png";
        iconStatusSleep.image = "icons/baby_awake_status.png";

    }

}

function showInputMaskCorrection(type) {

    // update header label
    inpCorrectionLabel.text = "Update " + type + " time.";

    // initialize tumbler to starting value
    let timeValue;
    switch (type) { 
        
        case "feed":
            timeValue = times.feed;
            break;
        
        case "sleep start":
            timeValue = times.sleepStart;
            break;

        case "sleep end":
            timeValue = times.sleepEnd;
            break;

    }
    let hour = timeValue.getHours();
    let minutes = timeValue.getMinutes();
    tumblerLeft.value = hour;
    tumblerRight.value = minutes;

    // make input mask visible
    screenInputMask.style.display = "inline";
    paginationDots.style.display = "none";
    screens.value = 1;
    screens.value = 2;
    screens.value = 3;

}

function hideInputMaskCorrection() {

    screenInputMask.style.display = "none";
    paginationDots.style.display = "inline";
    screens.value = 0;

}

function updateTimeEntry(type) {

    if (type === "") {
        return;
    }

    // get hours and minutes from tumbler
    let hours = tumblerLeft.value;
    let minutes = tumblerRight.value;

    // depending on which date to be changed
    switch (type) {

        case "feed":
            
            //update the active logged times
            times.feed.setHours(hours);
            times.feed.setMinutes(minutes);
            
            //store a new feed log entry
            let logTimes = timeCalc.hoursMin(times.feed);
            let logDuration = timeCalc.elapsed(feedLog[1][2]) || "x:xx";
            feedLog[0] = [logTimes, logDuration, times.feed]
            storage.saveFeedLog(feedLog);

            //update screen
            updateFeedText();
            updateFeedLog();

            break;

        case "sleep start":

            //update the active logged times
            times.sleepStart.setHours(hours);
            times.sleepStart.setMinutes(minutes);


            //if not sleeping store a new sleep log entry
            if (!times.sleeping) {
                let logTimes = timeCalc.hoursMin(times.sleepStart) + " - " + timeCalc.hoursMin(times.sleepEnd);
                let logDuration = timeCalc.elapsedBetween(times.sleepStart, times.sleepEnd) || "x:xx";
                sleepLog[0] = [logTimes, logDuration]
                storage.saveSleepLog(sleepLog);
            }

            //update screen
            updateSleepText();
            updateSleepLog();

            break;

        case "sleep end":
            
            //update the active logged times
            times.sleepEnd.setHours(hours);
            times.sleepEnd.setMinutes(minutes);

            //if not sleeping store a new sleep log entry
            if (!times.sleeping) {
                let logTimes = timeCalc.hoursMin(times.sleepStart) + " - " + timeCalc.hoursMin(times.sleepEnd);
                let logDuration = timeCalc.elapsedBetween(times.sleepStart, times.sleepEnd) || "x:xx";
                sleepLog[0] = [logTimes, logDuration]
                storage.saveSleepLog(sleepLog);
            }

            //update screen
            updateSleepText();
            updateSleepLog();

            break;

    }
    
    //always save the new current times object
    storage.saveTimes(times);

}