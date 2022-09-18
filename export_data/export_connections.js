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
    "INSERT INTO `<connections_table>` (`from_url`, `to_url`) VALUES \n";
  let sql_data = convertToSQL(data).join(", \n");
  sql += sql_data;
  fs.writeFileSync(getPath("sql"), sql);
}

module.exports = exportConnection;