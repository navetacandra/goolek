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
        if (href.length > 4 && (href.startsWith("http") || href.startsWith("/"))) {
          this.links.push(href);
        }
      }
    });
  }
}

module.exports = Parser;
