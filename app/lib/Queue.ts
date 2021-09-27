import Bull from 'bull'
import Env from '@ioc:Adonis/Core/Env'
import Mail from '@ioc:Adonis/Addons/Mail'

const RegisterUser = new Bull('RegisterUser', {
  redis: { port: +Env.get('REDIS_PORT'), host: Env.get('REDIS_HOST') },
  limiter: {
    max: 1,
    duration: 30000,
  },
})

const RegisterBet = new Bull('RegisterBet', {
  redis: { port: +Env.get('REDIS_PORT'), host: Env.get('REDIS_HOST') },
  limiter: {
    max: 1,
    duration: 30000,
  },
})

const RecoverPassword = new Bull('RecoverPassword', {
  redis: { port: +Env.get('REDIS_PORT'), host: Env.get('REDIS_HOST') },
  limiter: {
    max: 1,
    duration: 30000,
  },
})

const SevenGame = new Bull('SevenGame', {
  redis: { port: +Env.get('REDIS_PORT'), host: Env.get('REDIS_HOST') },
  limiter: {
    max: 1,
    duration: 30000,
  },
})

RegisterUser.process(async (job, done) => {
  let { email, template, subject } = job.data
  try {
    await Mail.send((message) => {
      message
        .from(Env.get('fromEmail'), Env.get('nameFrom'))
        .to(email)
        .subject(subject)
        .htmlView(template)
    })
  } catch (e) {}
  done()
})

RegisterBet.process(async (job, done) => {
  let { email, template, subject, bets, sum } = job.data
  try {
    await Mail.send((message) => {
      message
        .from(Env.get('fromEmail'), Env.get('nameFrom'))
        .to(email)
        .subject(subject)
        .htmlView(template, { bets, sum })
    })
  } catch (e) {}
  done()
})

RecoverPassword.process(async (job, done) => {
  let { email, template, subject } = job.data
  try {
    await Mail.send((message) => {
      message
        .from(Env.get('fromEmail'), Env.get('nameFrom'))
        .to(email)
        .subject(subject)
        .htmlView(template)
    })
  } catch (e) {}
  done()
})

SevenGame.process(async (job, done) => {
  let { email, template, subject, nameUser, data, sum } = job.data
  try {
    await Mail.send((message) => {
      message
        .from(Env.get('fromEmail'), Env.get('nameFrom'))
        .to(email)
        .subject(subject)
        .htmlView(template, { nameUser, data, sum })
    })
  } catch (e) {}
  done()
})

export default { RegisterUser, RegisterBet, RecoverPassword, SevenGame }
