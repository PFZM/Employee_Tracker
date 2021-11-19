const db = require("./config/connection");
const cTable = require("console.table");
const inquirer = require("inquirer");

async function viewQuery(table) {
  let sql;
  if (table === "department") {
    sql = `SELECT * FROM ${table};`;
  } else if (table === "role") {
    sql = `SELECT role_name, role.id, department_name, salary 
    FROM ${table} INNER JOIN department ON ${table}.department_id = department.id`;
  } else if (table === "employee") {
    sql = `SELECT e.id, e.first_name, e.last_name, role_name, department_name, salary, manager.first_name manager
    FROM ${table} e 
    LEFT JOIN role ON e.role_id = role.id
    LEFT JOIN department ON role.department_id = department.id
    LEFT JOIN employee manager ON e.manager_id = manager.id`;
  }
  try {
    const results = await db.promise().execute(sql);
    return results[0];
  } catch (error) {
    console.error(err);
  }
}

async function getManagersQuery() {
  const sql = "SELECT * from employee where manager_id = NULL";
  return (await db.promise().execute(sql))[0];
}

async function addQuery(table) {
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
      const sql = `INSERT INTO ${table} (department_name) VALUES ("${newDept.new_dept}")`;
      const results = await db.promise().execute(sql);
      console.log("New department has been added to Department's");
      return true;
    } catch (err_1) {
      console.log(err_1);
    }
  } else if (table === "role") {
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
              console.log("Please enter a role");
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
          message: "What is the department of this role?",
          choices: async function () {
            const results = await viewQuery("department");
            return results.map(({ department_name, id }) => ({
              name: department_name,
              value: id,
            }));
          },
        },
      ]);
      const sql = `INSERT INTO ${table} (role_name, salary, department_id) VALUES ('${data.new_role}',${data.salary},${data.department})`;
      try {
        const results = await db.promise().execute(sql);
        console.log("New role has been added to Role's table");
        return true;
      } catch (err) {
        console.error(err);
      }
    } catch (err) {
      console.log(err);
    }
  } else if (table === "employee") {
    try {
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
        {
          type: "list",
          name: "role",
          message: "What is the role of this employee?",
          choices: async function () {
            const results = await viewQuery("role");
            return results.map(({ role_name, id }) => ({
              name: role_name,
              value: id,
            }));
          },
        },
        {
          type: "list",
          name: "manager",
          message: "Who is the manager of this employee?",
          choices: async function () {
            const results = await getManagersQuery();
            return results.map(({ first_name, last_name, id }) => ({
              name: `${first_name} ${last_name}`,
              value: id,
            }));
          },
        },
      ]);
      try {
        const sql = `INSERT INTO ${table} (first_name, last_name, role, manager_id) VALUES ("${data.name}", "${data.last_name}", "${data.role}", ${data.managerID})`;
        const results = await db.promise().execute(sql);
        console.log("New employee has been added to Employee's table");
        return true;
      } catch (err) {
        console.error(err);
      }
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = { viewQuery, addQuery };
