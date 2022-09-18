const fs = require("fs");
const path = require("path");
const { convertToSQL, convertFilesToArray } = require("./helper");

const getPath = (extension) => {
  return path.resolve(
    path.join(process.cwd(), "results", extension, `data.${extension}`)
  );
};

function exportWebsitesData() {
  let data = convertFilesToArray(getPath("txt"), " |#####| ");
  let sql = "INSERT INTO `<websites_table>` (`url`, `title`, `keywords`) VALUES \n";
  let sql_data = convertToSQL(data).join(', \n');
  sql += sql_data;
  fs.writeFileSync(getPath("sql"), sql);
}

module.exports = exportWebsitesData;