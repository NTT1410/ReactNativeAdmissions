import { Platform } from "react-native";
import ProfileImage from "../assets/profile.png";
import { HOST } from "./Api";
import moment from "moment";

function log() {
  // Much better console.log function that formats/indents
  // objects for better reabability
  for (let i = 0; i < arguments.length; i++) {
    let arg = arguments[i];
    // Stringify and indent object
    if (typeof arg === "object") {
      arg = JSON.stringify(arg, null, 2);
    }
    console.log(`[${Platform.OS}]`, arg);
  }
}

function thumbnail(url) {
  if (!url) {
    return ProfileImage;
  }
  return {
    uri: "https://res.cloudinary.com/dahe67gl2/" + url,
  };
}

function image(url) {
  const i = `https://res.cloudinary.com/dahe67gl2/${url}`;
  return i;
}

function formatTime(date) {
  if (date === null) {
    return "-";
  }
  return moment(date).fromNow();
}

export default { log, thumbnail, formatTime, image };
