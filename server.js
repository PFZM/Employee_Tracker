const figlet = require("figlet");
const chalk = require("chalk");
const inquirer = require("inquirer");
const mysql = require("mysql2");
const { viewQuery, addQuery, updateQuery } = require("./queries");

const init = () => {
  figlet("Employee - Tracker", async (err, data) => {
    if (err) {
      console.error(err);
    } else {
      console.log(chalk.blue(data));
      await showMainMenu();
    }
  });
};

const showMainMenu = async () => {
  try {
    const selection = await inquirer.prompt({
      type: "list",
      name: "options",
      message: "What would you like to do?",
      choices: [
        "View all departments",
        "View all roles",
        "View all employees",
        new inquirer.Separator(),
        "Add a department",
        "Add a role",
        "Add an employee",
        new inquirer.Separator(),
        "Update an employee role",
        new inquirer.Separator(),
        "Quit",
        new inquirer.Separator("-- End of List --"),
      ],
    });
    console.log("\n");
    if (
      selection.options === "View all departments" ||
      selection.options === "View all roles" ||
      selection.options === "View all employees"
    ) {
      let table;
      switch (selection.options) {
        case "View all departments": {
          table = "department";
          break;
        }
        case "View all roles": {
          table = "role";
          break;
        }
        case "View all employees": {
          table = "employee";
          break;
        }
        default: {
          throw new Error("Invalid choice");
        }
      }
      const results = await viewQuery(table);
      console.table(results);
      await showMainMenu();
    } else if (
      selection.options === "Add a department" ||
      selection.options === "Add a role" ||
      selection.options === "Add an employee"
    ) {
      let table;
      switch (selection.options) {
        case "Add a department": {
          table = "department";
          break;
        }
        case "Add a role": {
          table = "role";
          break;
        }
        case "Add an employee": {
          table = "employee";
          break;
        }
        default: {
          throw new Error("Invalid choice");
        }
      }
      await addQuery(table);
      await showMainMenu();
    } else if (selection.options === "Update an employee role") {
      let updateItem = "employee";
      await updateQuery(updateItem);
      await showMainMenu();
    } else if (selection.options === "Quit") {
      process.exit();
    }
  } catch (e) {
    console.log(err);
  }
};

init();
