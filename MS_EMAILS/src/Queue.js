const Bull=require('bull')

const ShootGamesAdmins = new Bull("ShootGamesAdmins", {
  redis: { port: 9999, host: "redis_express" },
  limiter: {
    max: 1,
    duration: 30000,
  },
});

ShootGamesAdmins.process(async (job, done) => {
  let { bets, user } = job.data;
  let userSend = { name: user.name };

  done();
});

module.exports= ShootGamesAdmins;
