const fs = require("fs");
const path = require("path");
const { convertToSQL, convertFilesToArray } = require("./helper");

const getPath = (extension) => {
  return path.resolve(
    path.join(process.cwd(), "results", extension, `connections.${extension}`)
  );
};

function exportConnection() {
  let data = convertFilesToArray(getPath("txt"), " |#####| ");
  let sql =
    "INSERT INTO `connections_table` (`url`, `count`) VALUES \n";
  let sql_data = convertToSQL(data).join(", \n");
  sql += sql_data;
  fs.writeFileSync(getPath("sql"), sql);
  return getPath("sql");
}

module.exports = exportConnection;
