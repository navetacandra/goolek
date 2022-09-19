const path = require("path");
const fs = require("fs");
const { getDatabase, ref, onValue } = require("firebase/database");
require("dotenv").config();

const getResultsFile = (file) =>
  path.resolve(path.join(process.cwd(), "results", "txt", `${file}.txt`));

function writeFile(fileName = "", data = "") {
  let filePath = getResultsFile(fileName);
  let before = fs.readFileSync(filePath, "utf-8");
  fs.writeFileSync(filePath, `${before}${data}`);
}

let savedUrl = fs.existsSync(getResultsFile("urls"))
  ? fs
      .readFileSync(getResultsFile("urls"), "utf-8")
      .trim()
      .split("\n")
      .map((v) => v.split(" |#####| ")[0])
  : [];
let savedDoneUrl = fs.existsSync(getResultsFile("done_urls"))
  ? fs
      .readFileSync(getResultsFile("done_urls"), "utf-8")
      .trim()
      .split("\n")
      .map((v) => v.split(" |#####| ")[0])
  : [];
let savedSiteData = fs.existsSync(getResultsFile("data"))
  ? fs
      .readFileSync(getResultsFile("data"), "utf-8")
      .trim()
      .split("\n")
      .map((v) => v.split(" |#####| ")[0])
  : [];
let savedSiteConn = fs.existsSync(getResultsFile("connections"))
  ? fs
      .readFileSync(getResultsFile("connections"), "utf-8")
      .trim()
      .split("\n")
      .map((v) => v.split(" |#####| ")[0])
  : [];
let listUrl = [];
let doneUrl = [];

function getSavedWebsiteData(db, fun) {
  onValue(
    ref(db, `w`),
    (snap) => {
      let _s = Date.now();
      let val = snap.val();
      console.log("Writting sites data...");
      if (val && val.length >= 1) {
        val.forEach((v) => {
          if (!savedUrl.includes(v.url) && !listUrl.includes(v.url))
            listUrl.push(v.url);
          if (!savedDoneUrl.includes(v.url)) doneUrl.push(v.url);
          if (!savedSiteData.includes(v.url))
            writeFile(
              "data",
              `${v.url} |#####| ${v.title} |#####| ${v.description} |#####| ${v.keywords}\n`
            );
        });
      }
      console.log(`Done writting sites data in: ${Date.now() - _s}ms.\n`);
      fun();
    },
    {
      onlyOnce: true,
    }
  );
}

function getSavedConnectionData(db, fun) {
  onValue(
    ref(db, `c`),
    (snap) => {
      let _s = Date.now();
      console.log("Writting connections...");
      let val = snap.val();
      if (val && val.length >= 1) {
        val.forEach((v) => {
          if (!savedUrl.includes(v.url) && !listUrl.includes(v.url))
            listUrl.push(v.url);
          if (!savedSiteConn.includes(v.url))
            writeFile("connections", `${v.url} |#####| ${v.count}\n`);
        });
      }
      console.log(`Done writting connections in: ${Date.now() - _s}ms.\n`);
      fun();
    },
    {
      onlyOnce: true,
    }
  );
}

function handlerWraper(fun) {
  const start = Date.now();
  const db = getDatabase();

  getSavedWebsiteData(db, () => {
    getSavedConnectionData(db, () => {
      (() => {
        let _s = Date.now();
        console.log("Writting urls list...");
        listUrl.forEach((val) => {
          if (!savedUrl.includes(val)) writeFile("urls", `${val}\n`);
        });
        console.log(`Done writting urls list in: ${Date.now() - _s}ms.\n`);
      })();
      (() => {
        let _s = Date.now();
        console.log("Writting done_urls list...");
        doneUrl.forEach((val) => {
          if (!savedDoneUrl.includes(val)) writeFile("done_urls", `${val}\n`);
        });
        console.log(`Done writting done_urls list in: ${Date.now() - _s}ms.\n`);
      })();
      console.log(`Done get saved data in: ${Date.now() - start}ms.\n`);
      fun();
    });
  });
}

module.exports = handlerWraper;
