const fs = require('fs');
const path = require('path');
const { writeFile, connectionsFile, doneURLsFile, dataFile, urlsFile, disFile } = require("./crawler/helper");

const _dir = (...args) => path.join(process.cwd(), ...args);

function initializeRequirementFiles() {
  if (!fs.existsSync(_dir('results')))
    fs.mkdirSync(_dir('results'))
  if (!fs.existsSync(_dir('results', 'sql')))
    fs.mkdirSync(_dir('results', 'sql'))
  if (!fs.existsSync(_dir('results', 'txt')))
    fs.mkdirSync(_dir('results', 'txt'))
  if (!fs.existsSync(connectionsFile)) fs.writeFileSync(connectionsFile, "");
  if (!fs.existsSync(doneURLsFile)) fs.writeFileSync(doneURLsFile, "");
  if (!fs.existsSync(dataFile)) fs.writeFileSync(dataFile, "");
  if (!fs.existsSync(urlsFile)) fs.writeFileSync(urlsFile, "");
  if (!fs.existsSync(disFile)) fs.writeFileSync(disFile, "");
}

function setupGlobal() {
  initializeRequirementFiles();

  global.initURL = "https://news.kompas.com";
  global.urlQueue = [];
  global.urlList = [];
  global.urlLines = fs.readFileSync(urlsFile, "utf-8").split("\n");
  global.doneUrlLines = fs.readFileSync(doneURLsFile, "utf-8").split("\n");

  global.urlLines.forEach((u) => {
    if (!global.doneUrlLines.includes(u)) global.urlQueue.push(u);
    global.urlList.push(u);
  });

  if (global.urlQueue.length == 0) {
    global.urlQueue.push(global.initURL);
    global.urlList.push(global.initURL);
    writeFile(urlsFile, `${global.initURL}\n`);
  }
};

module.exports = setupGlobal;