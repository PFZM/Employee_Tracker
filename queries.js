const db = require("./config/connection");
const cTable = require("console.table");
const inquirer = require("inquirer");

// View and print queries

function viewQuery(table) {
  let sql;
  if (table === "department") {
    sql = `SELECT * FROM ${table};`;
  } else if (table === "role") {
    sql = `SELECT role_name, id, salary, department_name FROM ${table} INNER JOIN department_name ON department = department_id`;
  } else if (table === "employee") {
    sql = `SELECT * FROM ${table}`;
  }
  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
    } else {
      console.table(`${table}s`, results);
    }
  });
}

function addQuery(table) {
  let sql;
  if (table === "department") {
    return inquirer
      .prompt({
        type: "input",
        name: "new_dept",
        message: "What department do you want to add?",
        validate: (new_dept) => {
          if (new_dept) {
            return true;
          } else {
            console.log("Please enter a department");
            return false;
          }
        },
      })
      .then((newDept) => {
        console.log(newDept.new_dept);
        sql = `INSERT INTO ${table} (department_name) VALUES ("${newDept.new_dept}")`;
        db.query(sql, (err, results) => {
          if (err) {
            console.error(err);
          } else {
            console.log(`${newDept.new_dept} added to ${table}s`);
          }
        }).catch((err) => {
          console.log(err);
        });
      });
  } else {
    if (table === "role") {
      let deptChoices;
      const depSql = "SELECT department_name, id FROM department";
      db.query(depSql, (err, results) => {
        if (err) {
          console.error(err);
        } else {
          deptChoices = results.map(({ department_name }) => department_name);
        }
      });
      console.log(deptChoices);
      return inquirer
        .prompt([
          {
            type: "input",
            name: "new_role",
            message: "What role fo you want to add?",
            validate: (new_role) => {
              if (new_role) {
                return true;
              } else {
                console.log("Please enter a department");
                return false;
              }
            },
          },
          {
            type: "input",
            name: "salary",
            message: "What is the salary of this new role?",
            validate: (salary) => {
              if (!isNaN(salary)) {
                return true;
              } else {
                console.log("Please enter salary in numbers");
                return false;
              }
            },
          },
          {
            type: "list",
            name: "department",
            choices: deptChoices,
          },
        ])
        .then((newRole) => {
          sql = `INSERT INTO ${table} (role_name, salary, department_id) VALUES ("${newDept.new_dept}")`;
          db.query(sql, (err, results) => {
            if (err) {
              console.error(err);
            } else {
              console.log(`${newDept.new_dept} added to ${table}s`);
            }
          }).catch((err) => {
            console.log(err);
          });
        });
    }

    console.log("hola");
  }
}

module.exports = { viewQuery, addQuery };
