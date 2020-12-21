const program = require("commander");
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const { prompt } = require("inquirer");

const question = [
  {
    type: "input",
    name: "email",
    message: "Enter your email id",
  },
  {
    type: "password",
    name: "password",
    message: "Enter your Password",
  },
  {
    type: "input",
    name: "reciever",
    message: "Enter reciever's email address",
  },
  {
    type: "input",
    name: "subject",
    message: "Enter Subject of the message",
  },
  {
    type: "input",
    name: "body",
    message: "Enter body of the message",
  },
];

const send = async (ans) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: ans.email,
      pass: ans.password,
    },
  });
  let mailOptions = {
    from: ans.email,
    to: ans.reciever,
    subject: ans.subject,
    text: ans.body,
  };
  transporter.sendMail(mailOptions, function (err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log("Email Sent Successfully:" + info.response);
    }
  });
};

program.version("1.0.0").description("A CLI to send Emails locally");

program
  .command("send")
  .alias("s")
  .description("Send")
  .action(() => {
    prompt(question).then((answers) => send(answers));
  });

program.parse(process.argv);
