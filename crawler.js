const fs = require("fs");
const cheerio = require("cheerio");
const fetch = (...args) =>
  import("node-fetch")
    .then(({ default: fetch }) => fetch(...args))
    .catch((err) => console.log(err));

function initializeRequirementFiles() {
  if (!fs.existsSync("connection.txt")) fs.writeFileSync("connection.txt", "");
  if (!fs.existsSync("done_urls.txt")) fs.writeFileSync("done_urls.txt", "");
  if (!fs.existsSync("data.txt")) fs.writeFileSync("data.txt", "");
  if (!fs.existsSync("urls.txt")) fs.writeFileSync("urls.txt", "");
  if (!fs.existsSync("dis.txt")) fs.writeFileSync("dis.txt", "");
}
initializeRequirementFiles();

function writeFile(filePath="", data="") {
  let before = fs.readFileSync(filePath, "utf-8");
  fs.writeFileSync(filePath, `${before}${data}`);
}

const initURL = "https://google.com";

let urlQueue = [];
let urlList = [];

const urlLines = fs.readFileSync("urls.txt", "utf-8").split("\n");
const doneUrlLines = fs.readFileSync("done_urls.txt", "utf-8").split("\n");

urlLines.forEach((u) => {
  if (!doneUrlLines.includes(u)) {
    urlQueue.push(u);
  }
  urlList.push(u);
});

class Parser {
  constructor({ $ }) {
    this.$ = $;
    this.headingTags = ["h1", "h2", "h3"];
    this.title = "";
    this.description = "";
    this.wordsList = [];
    this.ogTitle = "";
    this.metaTitle = "";
    this.links = [];
    this.processTagData();
  }

  makeKeyword(s) {
    let w_list = [];
    let s_list = s.split("\n");
    s_list.forEach((d) => {
      d = d.trim();
      if (d.match(/^[A-Za-z0-9'\\\_-]*/g)) {
        if (!w_list.includes(d) && d.length > 0) {
          w_list.push(d);
        }
      }
    });
    return w_list;
  }

  makeAlphanumberic(s) {
    return s.replace(/[^0-9a-zA-Z_ |+-=]/gi, "");
  }

  processTagData() {
    // Get Title
    this.title = this.makeAlphanumberic(this.$("title").text());
    this.makeKeyword(this.title).forEach((w) => {
      if (!this.wordsList.includes(w)) this.wordsList.push(w);
    });

    // Check All Meta Tags
    this.$("meta").each((i, el) => {
      const attr = el.attribs;
      if (Object.keys(attr).length != 2) return;

      // meta description
      if (Object.values(attr).filter((v) => v == "description").length > 0) {
        let descriptionContent = this.makeAlphanumberic(
          Object.values(attr).filter((v) => v != "description")[0]
        );
        this.description = descriptionContent;
        this.makeKeyword(this.description).forEach((w) => {
          if (!this.wordsList.includes(w)) this.wordsList.push(w);
        });
      }

      // meta keywords
      if (Object.values(attr).filter((v) => v == "keywords").length > 0) {
        let keywordsContent = this.makeAlphanumberic(
          Object.values(attr)
            .filter((v) => v != "keywords")[0]
            .replace(/,/g, "\n")
        );
        this.makeKeyword(keywordsContent).forEach((w) => {
          if (!this.wordsList.includes(w)) this.wordsList.push(w);
        });
      }

      // meta title
      if (Object.values(attr).filter((v) => v == "og:title").length > 0) {
        let metaTitle = this.makeAlphanumberic(
          Object.values(attr).filter((v) => v != "og:title")[0]
        );
        this.metaTitle = metaTitle;
        this.makeKeyword(metaTitle).forEach((w) => {
          if (!this.wordsList.includes(w)) this.wordsList.push(w);
        });
      }

      // meta site_name
      if (Object.values(attr).filter((v) => v == "og:site_name").length > 0) {
        let metaSiteName = this.makeAlphanumberic(
          Object.values(attr).filter((v) => v != "og:site_name")[0]
        );
        this.ogTitle = metaSiteName;
        this.makeKeyword(metaSiteName).forEach((w) => {
          if (!this.wordsList.includes(w)) this.wordsList.push(w);
        });
      }
    });

    // Get Heading Tags Data
    this.headingTags.forEach((tag) => {
      this.$(tag).each((i, el) => {
        let data = this.makeAlphanumberic(this.$(el).text());
        this.makeKeyword(data).forEach((w) => {
          if (!this.wordsList.includes(w)) this.wordsList.push(w);
        });
      });
    });

    // Get Anchor Href Tags
    this.$("a").map((i, el) => {
      let attr = el.attribs;
      if (Object.keys(attr).filter((v) => v == "href").length > 0) {
        let href = el.attribs.href;
        if (href.length > 4 && href.startsWith("http")) {
          this.links.push(href);
        }
      }
    });
  }
}

if (urlQueue.length == 0) {
  urlQueue.push(initURL);
  urlList.push(initURL);
  writeFile("urls.txt", `${initURL}\n`);
}

async function startCrawl() {
  let url = urlQueue.shift();
  let responnse;

  writeFile("done_urls.txt", `${url}\n`);
  console.log(`Total URLs: ${urlList.length}`);
  console.log(`Done URLs: ${urlList.length - urlQueue.length}`);
  console.log(`Queue URLs: ${urlQueue.length}`);

  console.log(`Requesting: ${url}\n`);
  
  try {
    responnse = await (await fetch(url)).text();
  } catch (err) {
    console.log("Can't reach site..");
    writeFile("dis.txt", `${url}\n`);
  }

  const parser = new Parser({ $: cheerio.load(responnse) });

  parser.links.forEach(u => {
    const conn = `${url} ${u}`;
    writeFile('connection.txt', `${conn}\n`);
    if (!urlList.includes(u)) {
      urlList.push(u);
      urlQueue.push(u);
      writeFile('urls.txt', `${u}\n`);
    }
  });

  let command = {
    url: url,
    title: url, 
    keywords: ""
  };

  parser.wordsList.forEach(w => command.keywords += `${w} `);

  if (parser.ogTitle != "") command.title = parser.ogTitle;
  else if (parser.metaTitle != "") command.title = parser.metaTitle;
  else if (parser.title != "") command.title = parser.title;
  else command.title = url;

  writeFile('data.txt', `${command.url} |#| ${command.title} |#| ${command.keywords}\n`);
  startCrawl();
}
startCrawl();
