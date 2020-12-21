const program = require("commander");
const fs = require("fs");
const path = require("path");
const { prompt } = require("inquirer");

const login = [
  {
    type: "input",
    name: "name",
    message: "Enter your name",
  },
  {
    type: "input",
    name: "email",
    message: "Enter email id",
  },
  {
    type: "password",
    name: "password",
    message: "Enter password",
  },
];

const register = (ans) => {
  let data = {
    name: ans.name,
    email: ans.email,
    password: ans.password,
  };
  data = JSON.stringify(data);
  fs.openSync(path.resolve(__dirname, "user.json"));
  fs.writeFileSync(path.resolve(__dirname, "user.json"), data);
};

program.version("1.0.0").description("A CLI to send Emails locally");

program
  .command("register")
  .alias("r")
  .description("Register")
  .action(() => {
    prompt(login).then((answers) => register(answers));
  });

program.parse(process.argv);
