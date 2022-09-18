const fs = require('fs');
const path = require('path');
const { writeFile, connectionsFile, doneURLsFile, dataFile, urlsFile, disFile } = require("./crawler/helper");

const _dir = (...args) => path.join(process.cwd(), ...args);

function initializeRequirementFiles() {
  if (!fs.existsSync(_dir('results')))
    fs.mkdirSync(_dir('results'))
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

  global.initURL = "https://google.com";
  global.urlQueue = [];
  global.urlList = [];
  global.urlLines = fs.readFileSync(urlsFile, "utf-8").split("\n");
  global.doneUrlLines = fs.readFileSync(doneURLsFile, "utf-8").split("\n");
  global.urlConn = {};

  global.urlLines.forEach((u) => {
    if (!global.doneUrlLines.includes(u)) global.urlQueue.push(u);
    global.urlList.push(u);
  });

  const setupConn = fs.readFileSync(connectionsFile, 'utf-8').split('\n');
  if (setupConn.length > 0) {
    setupConn.forEach(c => {
      const lineSplit = c.split(' |#####| ');
      if (lineSplit.length != 2) return;
      global.urlConn[lineSplit[0]] = Number(lineSplit[1]);
    })
  }

  if (global.urlQueue.length == 0) {
    global.urlQueue.push(global.initURL);
    global.urlList.push(global.initURL);
    writeFile(urlsFile, `${global.initURL}\n`);
  }
};

module.exports = setupGlobal;