const Bull=require('bull')
const nodemailer = require("nodemailer");
const templateEmail=require('./email')
const ShootGamesAdmins = new Bull("ShootGamesAdmins", {
  redis: { port: 9999, host: "redis_express" },
  limiter: {
    max: 1,
    duration: 30000,
  },
});

async function settingsEmail()
{
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "0d12d17096bde8", // generated ethereal user
      pass: "0330bfd563a648", // generated ethereal password
    },
  });

  return transporter
}

ShootGamesAdmins.process(async (job, done) => {
 
  let { bets, user, admins,sum } = job.data;
  let transporter=await settingsEmail()
  admins.forEach( async (value)=>{   
    await transporter.sendMail({
      from: '"Alan Bruno ?" <sosvari21@gmail.com>', // sender address
      to: ''+value.email, // list of receivers
      subject: 'There was a new bet', // Subject line
      text: 'Hello world ?', // plaintext body
      html: templateEmail(user,bets,sum) // html body
  });
  })


  done();
});

module.exports= ShootGamesAdmins;
