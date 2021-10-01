import Bet from 'App/Models/Bet'
import User from 'App/Models/User'
import AccessProfile from 'App/Models/AccessProfile'
import Bull from 'bull'
import Env from '@ioc:Adonis/Core/Env'
import Mail from '@ioc:Adonis/Addons/Mail'
import { Kafka } from 'kafkajs'
import Game from 'App/Models/Game'

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

const ShootGamesAdmins = new Bull('ShootGamesAdmins', {
  redis: { port: +Env.get('REDIS_PORT'), host: Env.get('REDIS_HOST') },
  limiter: {
    max: 1,
    duration: 10000,
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

ShootGamesAdmins.process(async (job, done) => {
  let { bets, user } = job.data
  let userSend = { name: user.name }

  const idAdmin = await (await AccessProfile.findByOrFail('level', 'admin')).id
  let adminsList = (await User.query().where('id', idAdmin)).map((value) => {
    return { name: value.name, email: value.email }
  })

  console.log('sends begin')
  console.log(adminsList)
  console.log(userSend)
  console.log(bets)
  console.log('sends end')
  done()

  const kafka = new Kafka({
    clientId: 'api',
    brokers: ['kafka:29092'], //kafka e o nome do broker que esta no docker-compose.yml
  })

  const producer = kafka.producer()
  await producer.connect()
  await producer.send({
    topic: 'bets',
    messages: [
      {
        value: JSON.stringify({ admins: adminsList, user: userSend, bets }),
      },
    ],
  })
  await producer.disconnect()
  done()
})

export default { RegisterUser, RegisterBet, RecoverPassword, SevenGame, ShootGamesAdmins }
