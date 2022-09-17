const fs = require("fs");

function convertFilesToArray(filePath, separator) {
  let temp = fs.readFileSync(filePath, "utf-8").trim();
  temp = temp.split("\n");
  return temp.map((v) => v.trim().split(separator));
}

function escapeQuote(str="") {
  return str.replace(/'/g, `\\'`).trim();
}

function convertToSQL(data) {
  return data.map((d) => {
    d = d.map(v => `'${escapeQuote(v)}'`);
    return `(${d.join(', ')})`;
  });
}

module.exports = function exportWebsitesData() {
  let data = convertFilesToArray("data.txt", " |#####| ");
  let sql = "INSERT INTO `<websites_table>` (`url`, `title`, `keywords`) VALUES \n";
  let sql_data = convertToSQL(data).join(', \n');
  sql += sql_data;
  fs.writeFileSync('data.sql', sql);
}

module.exports = function exportConnectionsData() {
  let data = convertFilesToArray("connection.txt", " |#####| ");
  let sql = "INSERT INTO `<connections_table>` (`from_url`, `to_url`) VALUES \n";
  let sql_data = convertToSQL(data).join(', \n');
  sql += sql_data;
  fs.writeFileSync('connections.sql', sql);
}
