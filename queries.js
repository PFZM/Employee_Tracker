const db = require("./config/connection");
const cTable = require("console.table");

// View and print queries

function viewQuery(table) {
  const sql = `SELECT * FROM ${table};`;
  console.log(sql);
  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
    } else {
      console.table(`${table}s`, results);
    }
  });
}

// function addQuery(table) {}

module.exports = { viewQuery };
