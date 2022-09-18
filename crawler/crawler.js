const fs = require("fs");
const cheerio = require("cheerio");
const Parser = require("./Parser");
const { writeFile, urlsFile, doneURLsFile, disFile, connectionsFile, dataFile } = require("./helper");
const fetch = (...args) =>
  import("node-fetch")
    .then(({ default: fetch }) => fetch(...args))
    .catch((err) => console.log(err));

async function startCrawl() {
  let url = global.urlQueue.shift();
  let responnse;

  console.log(`Total URLs: ${global.urlList.length}`);
  console.log(`Done URLs: ${global.urlList.length - global.urlQueue.length}`);
  console.log(`Queue URLs: ${global.urlQueue.length}`);
  console.log(`Requesting: ${url}\n`);
  
  try {
    responnse = await (await fetch(url)).text();
  } catch (err) {
    console.log(`Can't reach site.. <${url}>\n`);
    writeFile(disFile, `${url}\n`);
    return;
  }

  const parser = new Parser({ $: cheerio.load(responnse) });

  parser.links.forEach(u => {
    const conn = `${url} |#####| ${u}`;
    writeFile(connectionsFile, `${conn}\n`);
    if (!global.urlList.includes(u)) {
      global.urlList.push(u);
      global.urlQueue.push(u);
      writeFile(urlsFile, `${u}\n`);
    }
  });

  let cmd = {
    url: url,
    title: url, 
    keywords: ""
  };

  parser.wordsList.forEach(w => cmd.keywords += `${w} `);
  
  if (parser.ogTitle != "") cmd.title = parser.ogTitle;
  else if (parser.metaTitle != "") cmd.title = parser.metaTitle;
  else if (parser.title != "") cmd.title = parser.title;
  else cmd.title = url;

  writeFile(dataFile, `${cmd.url} |#####| ${cmd.title} |#####| ${cmd.keywords}\n`);
  writeFile(doneURLsFile, `${url}\n`);
  startCrawl();
}

module.exports = startCrawl;