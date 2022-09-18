const fs = require('fs');
const { writeFile, urlsFile, doneURLsFile } = require("./crawler/helper");
function setupGlobal() {
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