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
  console.log('quee user ', job.data)
  await Mail.send((message) => {
    message
      .from(Env.get('fromEmail'), Env.get('nameFrom'))
      .to(email)
      .subject(subject)
      .htmlView(template)
  })
  done()
})

RegisterBet.process(async (job, done) => {
  let { email, template, subject, bets, sum } = job.data
  console.log('quee email ', email, template, subject, bets)
  await Mail.send((message) => {
    message
      .from(Env.get('fromEmail'), Env.get('nameFrom'))
      .to(email)
      .subject(subject)
      .htmlView(template, { bets, sum })
  })
  done()
})

RecoverPassword.process(async (job, done) => {
  let { email, template, subject } = job.data
  console.log('quee recover ', job.data)
  await Mail.send((message) => {
    message
      .from(Env.get('fromEmail'), Env.get('nameFrom'))
      .to(email)
      .subject(subject)
      .htmlView(template)
  })
  done()
})

SevenGame.process(async (job, done) => {
  let { email, template, subject, nameUser, data, sum } = job.data
  console.log('quee email ', job.data)
  await Mail.send((message) => {
    message
      .from(Env.get('fromEmail'), Env.get('nameFrom'))
      .to(email)
      .subject(subject)
      .htmlView(template, { nameUser, data, sum })
  })
  done()
})

export default { RegisterUser, RegisterBet, RecoverPassword, SevenGame }
