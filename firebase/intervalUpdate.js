const fs = require("fs");
const { getDatabase, ref, update } = require("firebase/database");
const path = require("path");
const signIn = require("./signIn");

const getResultsFile = (file) =>
  path.resolve(path.join(process.cwd(), "results", "txt", `${file}.txt`));

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
