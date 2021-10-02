import Bet from 'App/Models/Bet'
import Database from '@ioc:Adonis/Lucid/Database'
import AccessProfile from 'App/Models/AccessProfile'
import Game from 'App/Models/Game'
import User from 'App/Models/User'
import test from 'japa'
import supertest from 'supertest'
import execa from 'execa'

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`
let game1: Game, game2: Game, game3: Game
let user: User
let token: string
let bet1: Bet, bet2: Bet, bet3: Bet

async function seeder() {
  let accessprofile1 = await AccessProfile.create({
    level: 'admin',
  })
  user = await User.create({
    name: 'Bruno Rios',
    email: 'teste2@gmail.com',
    password: '333333',
    accessProfileId: accessprofile1.id,
  })
  game1 = await Game.create({
    typeGame: 'Mega Sena',
    range: 6,
    maxNumber: 60,
    description: 'game of six choose',
    price: 2,
    color: 'green',
  })
  game2 = await Game.create({
    typeGame: 'Quina',
    range: 5,
    maxNumber: 80,
    description: 'game of five choose',
    price: 4,
    color: 'red',
  })
  game3 = await Game.create({
    typeGame: 'Loto Facil',
    range: 15,
    maxNumber: 25,
    description: 'game of fifteen choose',
    price: 8,
    color: 'yellow',
  })
  const dataRecived = await supertest(BASE_URL)
    .post('/login')
    .set('Content-Type', 'application/json')
    .send({ email: user.email, password: '333333' })
    .expect(200)
  token = dataRecived.body.token.token
}

function randonNumber(range: number, maxNumber: number, numberChoose: string) {
  if (numberChoose.match(/\d+/g)?.length !== range) {
    let choose = Math.trunc(Math.random() * maxNumber)
    if (numberChoose.match('' + choose)?.length !== 1 && choose > 0) {
      numberChoose += choose + ','
    }
    return randonNumber(range, maxNumber, numberChoose)
  }
  return numberChoose.slice(0, numberChoose.length - 1)
}

test.group('Integration Bet Test', (group) => {
  group.before(async () => {
    await execa.node('ace', ['migration:run'], {
      stdio: 'inherit',
    })
    await seeder()
  })
  test('Register Bets', async (assert) => {
    let chooseNumber1 = randonNumber(game1.range, game1.maxNumber, '')
    let chooseNumber2 = randonNumber(game2.range, game2.maxNumber, '')
    let chooseNumber3 = randonNumber(game3.range, game3.maxNumber, '')
    var { body } = await supertest(BASE_URL)
      .post('/bets')
      .send({
        bets: [
          {
            numberChoose: chooseNumber1,
            gameId: game1.id,
          },
          {
            numberChoose: chooseNumber2,
            gameId: game2.id,
          },
          {
            numberChoose: chooseNumber3,
            gameId: game3.id,
          },
        ],
      })
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
    bet1 = await Bet.findByOrFail('secure_id', body[0].secureId)
    bet2 = await Bet.findByOrFail('secure_id', body[1].secureId)
    bet3 = await Bet.findByOrFail('secure_id', body[2].secureId)
    assert.equal(chooseNumber1, body[0].numberChoose)
    assert.equal(chooseNumber2, body[1].numberChoose)
    assert.equal(chooseNumber3, body[2].numberChoose)
    assert.equal(game1.price, body[0].priceGame)
    assert.equal(game2.price, body[1].priceGame)
    assert.equal(game3.price, body[2].priceGame)
    assert.equal(3, (await Bet.all()).length)
  })

  test('Find One Bet', async (assert) => {
    var { body } = await supertest(BASE_URL)
      .get('/bets/' + bet1.secureId)
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
    assert.equal(bet1.numberChoose, body.numberChoose)
    assert.equal(bet1.priceGame, body.priceGame)
  })

  test('No Find One Bet', async (assert) => {
    await supertest(BASE_URL)
      .get('/bets/' + 1234)
      .set('Authorization', 'Bearer ' + token)
      .expect(404)
  })

  test('Registration Failure by Data of an Bet', async (assert) => {
    let chooseNumber1 = randonNumber(game1.range, game1.maxNumber, '')
    let chooseNumber2 = randonNumber(game2.range, game2.maxNumber, '')
    let chooseNumber3 = randonNumber(game3.range, game3.maxNumber, '')
    await supertest(BASE_URL)
      .post('/bets')
      .send({})
      .set('Authorization', 'Bearer ' + token)
      .expect(422)
    await supertest(BASE_URL)
      .post('/bets')
      .send({
        bets: [
          {
            numberChoose: chooseNumber1,
            gameId: game1.id,
          },
          {
            numberChoose: chooseNumber2,
          },
          {
            numberChoose: chooseNumber3,
            gameId: game3.id,
          },
        ],
      })
      .set('Authorization', 'Bearer ' + token)
      .expect(422)
  })

  test('Search For a Bet and its Dependencies', async (assert) => {
    var { body } = await supertest(BASE_URL)
      .get('/betsAll/' + bet1.secureId)
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
    assert.equal(bet1.numberChoose, body.numberChoose)
    assert.equal(bet1.priceGame, body.priceGame)
    assert.equal(game1.typeGame, body.games.typeGame)
    assert.equal(game1.price, body.games.price)
    assert.equal(game1.color, body.games.color)
    assert.equal(game1.secureId, body.games.secureId)
    assert.equal(game1.range, body.games.range)
    assert.equal(game1.maxNumber, body.games.maxNumber)
    assert.equal(user.email, body.users.email)
    assert.equal(user.name, body.users.name)
    assert.equal(user.secureId, body.users.secureId)
  })

  test('Find All Bet', async (assert) => {
    var { body } = await supertest(BASE_URL)
      .get('/bets')
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
    assert.equal(bet1.numberChoose, body[2].numberChoose)
    assert.equal(bet2.numberChoose, body[1].numberChoose)
    assert.equal(bet3.numberChoose, body[0].numberChoose)
    assert.equal(game1.price, body[2].priceGame)
    assert.equal(game2.price, body[1].priceGame)
    assert.equal(game3.price, body[0].priceGame)
  })

  test('Search For a All Bets and its Dependencies', async (assert) => {
    var { body } = await supertest(BASE_URL)
      .get('/betsAll')
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
    assert.equal(bet3.numberChoose, body[2].numberChoose)
    assert.equal(bet3.priceGame, body[2].priceGame)
    assert.equal(game3.typeGame, body[2].games.typeGame)
    assert.equal(game3.price, body[2].games.price)
    assert.equal(game3.color, body[2].games.color)
    assert.equal(game3.secureId, body[2].games.secureId)
    assert.equal(game3.range, body[2].games.range)
    assert.equal(game3.maxNumber, body[2].games.maxNumber)
    assert.equal(user.email, body[2].users.email)
    assert.equal(user.name, body[2].users.name)
    assert.equal(user.secureId, body[2].users.secureId)

    assert.equal(bet2.numberChoose, body[1].numberChoose)
    assert.equal(bet2.priceGame, body[1].priceGame)
    assert.equal(game2.typeGame, body[1].games.typeGame)
    assert.equal(game2.price, body[1].games.price)
    assert.equal(game2.color, body[1].games.color)
    assert.equal(game2.secureId, body[1].games.secureId)
    assert.equal(game2.range, body[1].games.range)
    assert.equal(game2.maxNumber, body[1].games.maxNumber)
    assert.equal(user.email, body[1].users.email)
    assert.equal(user.name, body[1].users.name)
    assert.equal(user.secureId, body[1].users.secureId)

    assert.equal(bet1.numberChoose, body[0].numberChoose)
    assert.equal(bet1.priceGame, body[0].priceGame)
    assert.equal(game1.typeGame, body[0].games.typeGame)
    assert.equal(game1.price, body[0].games.price)
    assert.equal(game1.color, body[0].games.color)
    assert.equal(game1.secureId, body[0].games.secureId)
    assert.equal(game1.range, body[0].games.range)
    assert.equal(game1.maxNumber, body[0].games.maxNumber)
    assert.equal(user.email, body[0].users.email)
    assert.equal(user.name, body[0].users.name)
    assert.equal(user.secureId, body[0].users.secureId)
  })

  test('Update One Bet', async (assert) => {
    var { body } = await supertest(BASE_URL)
      .put('/bets/' + bet1.secureId)
      .send({
        numberChoose: randonNumber(game2.range, game2.maxNumber, ''),
        gameId: game2.id,
      })
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
    assert.notEqual(bet1.priceGame, body.priceGame)
    bet1 = await Bet.findByOrFail('id', bet1.id)
  })

  test('Delete One Bet', async (assert) => {
    assert.equal(3, (await Bet.all()).length)
    var { body } = await supertest(BASE_URL)
      .delete('/bets/' + bet1.secureId)
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
    assert.equal(2, (await Bet.all()).length)
  })

  test('No Bet Found to Delete', async (assert) => {
    assert.equal(2, (await Bet.all()).length)
    await supertest(BASE_URL)
      .delete('/bets/' + 321)
      .set('Authorization', 'Bearer ' + token)
      .expect(404)
    assert.equal(2, (await Bet.all()).length)
  })

  test('Bet Registration Transaction Failed', async (assert) => {
    assert.equal(2, (await Bet.all()).length)
    let chooseNumber1 = randonNumber(game1.range, game1.maxNumber, '')
    let chooseNumber2 = randonNumber(game2.range, game2.maxNumber, '')
    let chooseNumber3 = randonNumber(game3.range, game3.maxNumber, '') + ',35'
    await supertest(BASE_URL)
      .post('/bets')
      .send({
        bets: [
          {
            numberChoose: chooseNumber1,
            gameId: game1.id,
          },
          {
            numberChoose: chooseNumber2,
            gameId: game2.id,
          },
          {
            numberChoose: chooseNumber3,
            gameId: game3.id,
          },
        ],
      })
      .set('Authorization', 'Bearer ' + token)
      .expect(500)
    assert.equal(2, (await Bet.all()).length)
  })
})
