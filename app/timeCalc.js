// used for simple calculation of elapsed time, returns formatted string hh:mm

import * as utils from "./utils";

export function elapsed(inpTime) {
    if (!(Object.prototype.toString.call(inpTime) === "[object Date]")) {
        return "--";
    }
    let myNow = new Date();
    let elapsed = myNow - inpTime;
    let hours = Math.round(elapsed/(1000*60*60))
    let min = Math.round(elapsed/(1000*60))
    let returnString = utils.zeroPad(hours) + ":" + utils.zeroPad(min);
    return returnString;
}

export function hoursMin(inpTime) {
    if (!(Object.prototype.toString.call(inpTime) === "[object Date]")) {
        return "--:--";
    }
    return ( utils.zeroPad(inpTime.getHours()) + ":" + utils.zeroPad(inpTime.getMinutes()));
}