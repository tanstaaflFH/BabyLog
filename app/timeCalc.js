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
    let hours = Math.round(elapsed/(1000*60*60))
    let min = Math.round(elapsed/(1000*60))
    
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