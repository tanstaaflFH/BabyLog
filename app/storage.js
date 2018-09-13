/*
  Responsible for loading and saving the last logged times on the device.
*/

import * as fs from "fs";

const SETTINGS_TYPE = "cbor";
const SETTINGS_FILE = "times.cbor";

// Load settings from filesystem
export function loadTimes() {
  try {
    return fs.readFileSync(SETTINGS_FILE, SETTINGS_TYPE);
  } catch (ex) {
    return {
        feed: 0,
        sleepStart: 0,
        sleepEnd: 0
    };
  }
}

// Save settings to the filesystem
export function saveTimes(settings) {
  console.log("Received for saving: " + JSON.stringify(settings));
  
    fs.writeFileSync(SETTINGS_FILE, settings, SETTINGS_TYPE);
}