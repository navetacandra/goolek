const startCrawl = require("./crawler/crawler");
const { initializeRequirementFiles } = require("./crawler/helper");
const setupGlobal = require('./global');
const exportConnection = require("./export_data/export_connections");
const exportWebsitesData = require("./export_data/export_data");

// initializeRequirementFiles();
setupGlobal();

exportConnection();
exportWebsitesData();

// startCrawl();
