const startCrawl = require("./crawler/crawler");
const setupGlobal = require("./global");
const intervalUpdate = require("./firebase/intervalUpdate");
const expressServer = require("./server/app");

(function () {
  setupGlobal(); // declare all global variable
  expressServer(); // run express server
  startCrawl(); // start crawling
  intervalUpdate(); // intervaling update/backup to firebase db
})();
