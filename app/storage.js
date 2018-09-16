/*
  Responsible for loading and saving the last logged times on the device.
*/

import * as fs from "fs";

const SETTINGS_TYPE = "json";
const SETTINGS_FILE = "times.txt";
const SLEEP_LOG_FILE = "sleeplog.txt";
const FEED_LOG_FILE = "feedlog.txt";

// Load active data from filesystem
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

// Save active data to the filesystem
export function saveTimes(inpTimes) {
    
  let jsonData = JSON.stringify(inpTimes);

  fs.writeFileSync(SETTINGS_FILE, jsonData, SETTINGS_TYPE);
  
}

// Load sleep log from filesystem
export function loadSleepLog() {

  let returnObject;

  try { 
    returnObject = JSON.parse(fs.readFileSync(SLEEP_LOG_FILE, SETTINGS_TYPE));
  } catch (ex) {
    console.log("file read error " + ex);
    let tempArray = new Array(10);
    for (let index = 0; index < tempArray.length; index++) {
      tempArray[index] = ["xx:xx - xx:xx", "x:xx"];
    }
    returnObject = tempArray;
  }

  console.log(JSON.stringify(returnObject));
  return returnObject;

}

// Save sleep log to the filesystem
export function saveSleepLog(input) {
    
  let jsonData = JSON.stringify(input);
  
  fs.writeFileSync(SLEEP_LOG_FILE, jsonData, SETTINGS_TYPE);
  
}