// used for simple calculation of elapsed time, returns formatted string hh:mm

import * as utils from "./utils";

export function elapsed(inpTime) {

    // check if input is a Date
    if (!(Object.prototype.toString.call(inpTime) === "[object Date]")) {
        return "--";
    }

    // calculate difference to now and calculate hours and minutes
    let myNow = new Date();
    let elapsed = myNow - inpTime;
    let hours = Math.floor((elapsed % 86400000) / 3600000);
    let min = Math.round(((elapsed % 86400000) % 3600000) / 60000);

    // build return string, show if data is older than 24 hours
    let returnString = hours + ":" + utils.zeroPad(min);
    if (hours>24) { returnString = "old data"};

    return returnString;
}

export function elapsedBetween(inpTime1, inpTime2) {

    // check if input is a Date
    if (!(Object.prototype.toString.call(inpTime1) === "[object Date]")) {
        return "--";
    }
    if (!(Object.prototype.toString.call(inpTime2) === "[object Date]")) {
        return "--";
    }

    // calculate difference to now and calculate hours and minutes
    let elapsed = inpTime2 - inpTime1;
    let hours = Math.floor((elapsed % 86400000) / 3600000);
    let min = Math.round(((elapsed % 86400000) % 3600000) / 60000);

    // build return string, show if data is older than 24 hours
    let returnString = hours + ":" + utils.zeroPad(min);
    if (hours>24) { returnString = "old data"};

    return returnString;
}

export function hoursMin(inpTime) {

    // check if input is a Date
    if (!(Object.prototype.toString.call(inpTime) === "[object Date]")) {
        return "--:--";
    }

    return ( inpTime.getHours() + ":" + utils.zeroPad(inpTime.getMinutes()));
    
}