/*
  Responsible for loading and saving the last logged times on the device.
*/

import * as fs from "fs";

const SETTINGS_TYPE = "json";
const SETTINGS_FILE = "times.txt";

// Load settings from filesystem
export function loadTimes() {

  let returnObject;

  try { 
    returnObject = JSON.parse(fs.readFileSync(SETTINGS_FILE, SETTINGS_TYPE));
    returnObject.feed = new Date(returnObject.feed);
    returnObject.sleepStart = new Date(returnObject.sleepStart);
    returnObject.sleepEnd = new Date(returnObject.sleepEnd);
  } catch (ex) {
    returnObject = {
      feed: new Date(),
      sleepStart: new Date(),
      sleepEnd: new Date(),
      sleeping: false
    };
    console.log("file read error " + ex);
  }

  return returnObject;

}

// Save settings to the filesystem
export function saveTimes(inpTimes) {
    
  let jsonData = JSON.stringify(inpTimes);

  fs.writeFileSync(SETTINGS_FILE, jsonData, SETTINGS_TYPE);
  
}