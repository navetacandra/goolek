const express = require("express");
const fs = require("fs");
const path = require("path");
const exportConnection = require("../export_data/export_connections");
const exportWebsitesData = require("../export_data/export_data");
const fetch = (...args) =>
  import("node-fetch")
    .then(({ default: fetch }) => fetch(...args))
    .catch((err) => console.log(err));
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
const getFilePath = (...args) => path.join(process.cwd(), "server", ...args);
const getTXTPath = (...args) => path.join(process.cwd(), "results", "txt", ...args);

function logging_req(req) {
  const ip =
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
  const before = fs.readFileSync(getFilePath('request_log'));
  fs.writeFileSync(getFilePath('request_log'), `${before}[${req.method}] ${req.url} from ${ip}\n`)
}

function expressServer() {
  app.get("/", (req, res) => {
    logging_req(req);
    res.json({
      message: "Hello from /"
    })
  });
  
  app.get('/get/sql/conn', (req, res) => {
    logging_req(req);
    const sqlPath = exportConnection();
    res.format({'text/plain': () => res.send(fs.readFileSync(sqlPath, 'utf-8'))})
  })

  app.get('/get/sql/site', (req, res) => {
    logging_req(req);
    const sqlPath = exportWebsitesData();
    res.format({'text/plain': () => res.send(fs.readFileSync(sqlPath, 'utf-8'))})
  })
  
  app.get('/get/txt/conn', (req, res) => {
    logging_req(req);
    const txtPath = getTXTPath('connections.txt');
    res.format({'text/plain': () => res.send(fs.readFileSync(txtPath, 'utf-8'))})
  })

  app.get('/get/txt/site', (req, res) => {
    logging_req(req);
    const txtPath = getTXTPath('data.txt');
    res.format({'text/plain': () => res.send(fs.readFileSync(txtPath, 'utf-8'))})
  })

  app.get('/get/server_req_log', (req, res) => {
    logging_req(req);
    const txtPath = getFilePath('request_log');
    res.format({'text/plain': () => res.send(fs.readFileSync(txtPath, 'utf-8'))})
  })

  setInterval(async () => {
    try {
      await (await fetch(`http://${process.env.HOST}/`))
    } catch (err) {
      
    }
  }, 30000);

  app.listen(port, () => {
    if (!fs.existsSync(getFilePath("request_log")))
      fs.writeFileSync(getFilePath("request_log"), "");
    console.log("Listening on port:", port);
  });
};

module.exports = expressServer;