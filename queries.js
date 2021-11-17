const db = require("./config/connection");
const cTable = require("console.table");
const inquirer = require("inquirer");

function viewQuery(table) {
  let sql;
  if (table === "department") {
    sql = `SELECT * FROM ${table};`;
  } else if (table === "role") {
    console.log("I am here");
    sql = `SELECT role_name, role.id, department_name, salary 
    FROM ${table} INNER JOIN department ON ${table}.department_id = department.id`;
  } else if (table === "employee") {
    sql = `SELECT e.id, e.first_name, e.last_name, role_name, department_name, salary, manager.first_name manager
    FROM ${table} e 
    LEFT JOIN role ON e.role_id = role.id
    LEFT JOIN department ON role.department_id = department.id
    LEFT JOIN employee manager ON e.manager_id = manager.id`;
  }
  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
    } else {
      console.table(`\n ${table}s`, results);
    }
  });
}

async function addQuery(table) {
  let sql;
  if (table === "department") {
    try {
      const newDept = await inquirer.prompt({
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
      });
      sql = `INSERT INTO ${table} (department_name) VALUES ("${newDept.new_dept}")`;
      db.query(sql, (err, results) => {
        if (err) {
          console.error(err);
        } else {
          console.log(`${newDept.new_dept} added to ${table}s`);
        }
      });
      return true;
    } catch (err_1) {
      console.log(err_1);
    }
  } else {
    if (table === "role") {
      let newRole;
      try {
        const data = await inquirer.prompt([
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
        ]);
        newRole = data;
        let deptChoices;
        const depSql = "SELECT department_name, id FROM department";
        db.query(depSql, (err_2, results) => {
          if (err_2) {
            console.error(err_2);
          } else {
            deptChoices = results.map(({ department_name, id }) => ({
              name: department_name,
              value: id,
            }));
            return inquirer
              .prompt({
                type: "list",
                name: "department",
                message: "What is the department of this role?",
                choices: deptChoices,
              })
              .then((depChoice) => {
                newRole.depId = depChoice.department;

                sql = `INSERT INTO ${table} (role_name, salary, department_id) VALUES ('${newRole.new_role}',${newRole.salary},${newRole.depId})`;
                db.query(sql, (err_3, results) => {
                  if (err_3) {
                    console.error(err_3);
                    return false;
                  } else {
                    console.log(`${newRole.new_role} added to ${table}s`);
                    return true;
                  }
                });
              })
              .catch((err_4) => {
                console.log(err_4);
              });
          }
        });
      } catch (err_5) {
        console.log(err_5);
      }
    } else if (table === "employee") {
      let newEmployee;
      const data = await inquirer.prompt([
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
            if (last_name) {
              return true;
            } else {
              console.log("Please enter a last name");
              return false;
            }
          },
        },
      ]);
      newEmployee=data;
      let roleChoices;
      const rolSql = "SELECT role_name, id FROM role";
        db.query(rolSql, (err_6, results) => {
          if (err_6) {
            console.error(err_6);
          } else {
            roleChoices = results.map(({ role_name, id }) => ({
              name: role_name,
              value: id,
            }));
            return inquirer
              .prompt({
                type: "list",
                name: "role",
                message: "What is the role of this employee?",
                choices: deptChoices,
              })
              .then((roleChoice) => {
                newEmployee.roleId = roleChoice.role;




      sql = `INSERT INTO ${table} (role_name, salary, department_id) VALUES ("${newDept.new_dept}")`;
      db.query(sql, (err_6, results_3) => {
        if (err_6) {
          console.error(err_6);
        } else {
          console.log(`${newDept.new_dept} added to ${table}s`);
        }
      }).catch((err_7) => {
        console.log(err_7);
      });
    }

    console.log("hola");
  }
}

module.exports = { viewQuery, addQuery };
