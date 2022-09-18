const fs = require("fs");
const firebase = require("firebase/app");
const { signInWithEmailAndPassword, getAuth } = require("firebase/auth");
const { getDatabase, ref, update } = require("firebase/database");
const path = require("path");
require("dotenv").config();

const getResultsFile = (file) =>
  path.resolve(path.join(process.cwd(), "results", "txt", `${file}.txt`));

function config() {
  firebase.initializeApp({
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID,
  });
}

function signIn(cb) {
  const auth = getAuth();
  signInWithEmailAndPassword(
    auth,
    process.env.FIREBASE_AUTH_EMAIL,
    process.env.FIREBASE_AUTH_PASS
  )
    .then(({ user }) => {
      console.log(`Logged in as: <${user.email}>`);
      cb();
    })
    .catch((err) => console.log(err));
}

function websiteDataExport() {
  const dataLines = fs
    .readFileSync(getResultsFile("data"), "utf-8")
    .trim()
    .split("\n");

  const data = dataLines.map((d) => {
    const lineSplit = d.split(" |#####| ");
    return {
      url: lineSplit[0].trim(),
      title: lineSplit[1].trim(),
      description: lineSplit[2].trim(),
      keywords: lineSplit[3].trim(),
    };
  });

  let objectData = {};
  data.forEach((d) => (objectData[d.url] = d));
  return objectData;
}

function websiteConnectionExport() {
  const dataLines = fs
    .readFileSync(getResultsFile("connections"), "utf-8")
    .trim()
    .split("\n");

  const data = dataLines.map((d) => {
    const lineSplit = d.split(" |#####| ");
    return {
      url: lineSplit[0].trim(),
      count: Number(lineSplit[1].trim()),
    };
  });

  let objectConnections = {};
  data.forEach((d) => (objectConnections[d.url] = d));
  return objectConnections;
}

function dbHandlerSiteData() {
  const db = getDatabase();
  const objectWebsiteData = websiteDataExport();
  Object.keys(objectWebsiteData).forEach((owd, i) => {
    update(ref(db, `w/${i}`), objectWebsiteData[owd]);
  });
}

function dbHandlerSiteConnections() {
  const db = getDatabase();
  const objectWebsiteConnections = websiteConnectionExport();
  Object.keys(objectWebsiteConnections).forEach((owd, i) => {
    update(ref(db, `c/${i}`), objectWebsiteConnections[owd]);
  });
}

function handlerWraper() {
  dbHandlerSiteData();
  dbHandlerSiteConnections();
}

module.exports = () => {
  setInterval(() => {
    config();
    signIn(handlerWraper);
  }, 60000);
};
