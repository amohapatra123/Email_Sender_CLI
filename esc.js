#!/usr/bin/env node
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
  {
    type: "list",
    name: "attach",
    message: "Do you want to send an attachment",
    choices: ["yes", "no"],
    default: "no",
  },
  {
    type: "input",
    name: "path",
    message: "Enter path to the folder",
    when: (answers) => answers.attach === "yes",
  },
  {
    type: "input",
    name: "file",
    message: "Enter name of file",
    when: (answers) => answers.attach === "yes",
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
    attachment: [
      {
        filename: ans.file,
        path: ans.path,
      },
    ],
  };
  transporter.sendMail(mailOptions, function (err, info) {
    if (err) {
      console.log(err.message);
    } else {
      fs.openSync(path.resolve(__dirname, "mail.json"));
      let last = fs.readFileSync(path.resolve(__dirname, "mail.json"));
      last = JSON.parse(last);
      if (last.length >= 5) {
        last = last.slice(last.length - 1);
      }
      let mail = {
        Sender: ans.email,
        Reciever: ans.reciever,
        Subject: ans.subject,
        Body: ans.body,
        Info: info.response,
      };

      last.unshift(mail);
      last = JSON.stringify(last);
      fs.writeFileSync(path.resolve(__dirname, "mail.json"), last);
      console.log("Email Sent Successfully:" + info.response);
    }
  });
};

const listMails = () => {
  try {
    fs.openSync(path.resolve(__dirname, "mail.json"));
    let data = fs.readFileSync(path.resolve(__dirname, "mail.json"));
    data = JSON.parse(data);
    if (data.length > 0) {
      console.log(data);
    } else {
      throw "You have not yet sent any emails.";
    }
  } catch (err) {
    console.log(err);
  }
};

program.version("1.0.3").description("A CLI to send Emails locally");
program
  .command("help")
  .alias("h")
  .description("Help")
  .action(function () {
    console.log("Usage :-");
    console.log(`$ emsc send  # Goes through a series of questions to send email.`);
    console.log(`$ emsc ls    # Show last 5 sent emails`);
  });

program
  .command("send")
  .alias("s")
  .description("Send")
  .action(() => {
    prompt(question).then((answers) => send(answers));
  });

program
  .command("ls")
  .alias("l")
  .description("List last 5 emails sent")
  .action(() => {
    listMails();
  });

program.parse(process.argv);
