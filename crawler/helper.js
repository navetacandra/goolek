const fs = require("fs");
const path = require("path");

// function

const connectionsFile = path
  .join(process.cwd(), "results", "txt", `connections.txt`)
  .replace(/\\/g, '/');
const doneURLsFile = path
  .join(process.cwd(), "results", "txt", `done_urls.txt`)
  .replace(/\\/g, '/');
const dataFile = path
  .join(process.cwd(), "results", "txt", `data.txt`)
  .replace(/\\/g, '/');
const urlsFile = path
  .join(process.cwd(), "results", "txt", `urls.txt`)
  .replace(/\\/g, '/');
const disFile = path
  .join(process.cwd(), "results", "txt", `dis.txt`)
  .replace(/\\/g, '/');

const crawler_helper = {
  // getPath: ,
  writeFile: (filePath = "", data = "") => {
    let before = fs.readFileSync(filePath, "utf-8");
    fs.writeFileSync(filePath, `${before}${data}`);
  },
  connectionsFile: connectionsFile,
  doneURLsFile: doneURLsFile,
  dataFile: dataFile,
  urlsFile: urlsFile,
  disFile: disFile,
  initializeRequirementFiles: () => {
    console.log(connectionsFile);
    if (!fs.existsSync(connectionsFile)) fs.writeFileSync(connectionsFile, "");
    if (!fs.existsSync(doneURLsFile)) fs.writeFileSync(doneURLsFile, "");
    if (!fs.existsSync(dataFile)) fs.writeFileSync(dataFile, "");
    if (!fs.existsSync(urlsFile)) fs.writeFileSync(urlsFile, "");
    if (!fs.existsSync(disFile)) fs.writeFileSync(disFile, "");
  },
};

module.exports = crawler_helper;
