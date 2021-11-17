const db = require("./config/connection");
const cTable = require("console.table");
const inquirer = require("inquirer");

// View and print queries

function viewQuery(table) {
  let sql;
  if (table === "department") {
    sql = `SELECT * FROM ${table};`;
  } else if (table === "role") {
    console.log("I am here");
    sql = `SELECT role_name, role.id, department_name, salary 
    FROM ${table} INNER JOIN department ON ${table}.department_id = department.id`;
  } else if (table === "employee") {
    sql = `SELECT employee.id, first_name, last_name, role_name, department_name, salary 
    FROM ${table} 
    LEFT JOIN role ON employee.role_id = role.id
    LEFT JOIN department ON role.department_id = department.id`;
  }
  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
    } else {
      console.table(`\n ${table}s`, results);
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
      let newRole;
      return inquirer
        .prompt([
          {
            type: "input",
            name: "new_role",
            message: "What role do you want to add?",
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
        ])
        .then((data) => {
          newRole = data;
          let deptChoices;
          const depSql = "SELECT department_name, id FROM department";
          db.query(depSql, (err, results) => {
            if (err) {
              console.error(err);
            } else {
              deptChoices = results.map(({ department_name, id }) => ({
                name: department_name,
                value: id,
              }));
              inquirer
                .prompt({
                  type: "list",
                  name: "department",
                  message: "What is the department of this role?",
                  choices: deptChoices,
                })
                .then((depChoice) => {
                  newRole.Depid = depChoice.department;

                  console.log("newROle", newRole);

                  // insert into this record into ROLe table
                  sql = `INSERT INTO ${table} (role_name, salary, department_id) VALUES ("'${newRole.new_role}',${newRole.salary},${newRole.Depid}")`;
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
          });
        })
        .then((deptChoice) => {
          //newRole.push(deptChoice);
          console.log(newRole);
        })
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
    } else if (table === "employee") {
      return inquirer
        .prompt([
          {
            type: "input",
            name: "name",
            message: "What is the name of the new employee?",
            validate: (name) => {
              if (name) {
                return true;
              } else {
                console.log("Please enter a name");
                return false;
              }
            },
          },
          {
            type: "input",
            name: "last_name",
            message: "What is the last name of the new employee?",
            validate: (last_name) => {
              if (!isNaN(last_name)) {
                return true;
              } else {
                console.log("Please enter a last name");
                return false;
              }
            },
          },
          {
            type: "list",
            name: "role",
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
