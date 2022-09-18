const startCrawl = require("./crawler/crawler");
const setupGlobal = require("./global");
const expressServer = require("./server/app");

setupGlobal();
expressServer();
startCrawl();
