const startCrawl = require("./crawler/crawler");
const setupGlobal = require("./global");
const intervalUpdate = require("./firebase/intervalUpdate");
const expressServer = require("./server/app");

(function () {
  const mode = process.argv.slice(2)[0];
  if (mode == "--run-server") {
    expressServer(); // run express server
  }
  if (mode == "--run-worker") {
    setupGlobal(); // declare all global variable
    startCrawl(); // start crawling
    intervalUpdate(); // intervaling update/backup to firebase db
  }
})();
