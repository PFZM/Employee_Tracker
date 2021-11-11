const figlet = require("figlet");
const chalk = require("chalk");

const init = async () => {
  figlet("Employee - Tracker", function (err, data) {
    err ? console.error(err) : console.log(chalk.blue(data));
  });
};

init();
