require("dotenv").config();
const Bull = require("bull");
const nodemailer = require("nodemailer");
const templateEmail = require("./email");
const ShootGamesAdmins = new Bull("ShootGamesAdmins", {
  redis: { port: +process.env.REDIS_PORT, host: process.env.REDIS_HOST },
  limiter: {
    max: 1,
    duration: 1000,
  },
});

const SendMail = new Bull("SendMail", {
  redis: { port: +process.env.REDIS_PORT, host: process.env.REDIS_HOST },
  limiter: {
    max: 1,
    duration: 30000,
  },
});

function settingsEmail() {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: process.env.HOST_MAIL,
    port: +process.env.PORT_MAIL,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.USER_MAIL, // generated ethereal user
      pass: process.env.PASSWORD_MAIL, // generated ethereal password
    },
  });

  return transporter;
}

ShootGamesAdmins.process((job, done) => {
  let { bets, user, admins, sum } = job.data;
  admins.forEach((value) => {
    SendMail.add({
      user,
      bets,
      email: value.email,
      sum,
    });
  });

  done();
});

SendMail.process(async (job, done) => {
  let { bets, user, email, sum } = job.data;
  let transporter = settingsEmail();
  await transporter.sendMail({
    from: '"Alan Bruno" <sosvari21@gmail.com>', // sender address
    to: "" + email, // list of receivers
    subject: "There was a new bet", // Subject line
    text: "", // plaintext body
    html: templateEmail(user, bets, sum), // html body
  });
  done();
});

module.exports = ShootGamesAdmins;
