const fs = require('fs');

module.exports = {
  convertFilesToArray: (filePath, separator) => {
    let temp = fs.readFileSync(filePath, "utf-8").trim();
    temp = temp.split("\n");
    return temp.map((v) => v.trim().split(separator));
  },
  convertToSQL: (data) => {
    return data.map((d) => {
      d = d.map((v) => `'${v.replace(/'/g, `\\'`).trim()}'`);
      return `(${d.join(", ")})`;
    });
  }
}
