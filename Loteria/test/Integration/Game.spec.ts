import Database from '@ioc:Adonis/Lucid/Database'
import AccessProfile from 'App/Models/AccessProfile'
import Game from 'App/Models/Game'
import User from 'App/Models/User'
import test from 'japa'
import supertest from 'supertest'
let accessprofile1: AccessProfile
const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`
let user1: User
let password1 = '123456'
let token = ''
let game1: Game, game2: Game, game3: Game
async function seeder() {
  accessprofile1 = await AccessProfile.create({
    level: 'admin',
  })
  user1 = await User.create({
    name: 'Alan Bruno1',
    email: 'teste1@gmail.com',
    password: password1,
    accessProfileId: accessprofile1.id,
  })
  let data = { email: user1.email, password: password1 }
  var { body } = await supertest(BASE_URL)
    .post('/login')
    .set('Content-Type', 'application/json')
    .send(data)
    .expect(200)
  token = body.token.token
}

test.group('Integration Game Test', (group) => {
  group.before(async () => {
    await Database.rawQuery('DELETE FROM bets')
    await Database.rawQuery('DELETE FROM users')
    await Database.rawQuery('DELETE FROM games')
    await Database.rawQuery('DELETE FROM games')
    await Database.rawQuery('DELETE FROM access_profiles')
    await seeder()
  })

  test('Register Game', async (assert) => {
    var { body } = await supertest(BASE_URL)
      .post('/games')
      .send({
        typeGame: 'Loto Facil',
        description: 'escolher 15 valores',
        range: 15,
        price: 5,
        maxNumber: 25,
        color: 'red',
      })
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
    game1 = await Game.findByOrFail('secure_id', body.secureId)
    assert.equal('Loto Facil', game1.typeGame)
    assert.equal('escolher 15 valores', game1.description)
    assert.equal(15, game1.range)
    assert.equal(5, game1.price)
    assert.equal(25, game1.maxNumber)
    assert.equal('red', game1.color)
    var { body } = await supertest(BASE_URL)
      .post('/games')
      .send({
        typeGame: 'Mega Sena',
        description: 'escolher 6 valores',
        range: 6,
        price: 4,
        maxNumber: 60,
        color: 'blue',
      })
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
    game2 = await Game.findByOrFail('secure_id', body.secureId)
    assert.equal('Mega Sena', game2.typeGame)
    assert.equal('escolher 6 valores', game2.description)
    assert.equal(6, game2.range)
    assert.equal(4, game2.price)
    assert.equal(60, game2.maxNumber)
    assert.equal('blue', game2.color)
    var { body } = await supertest(BASE_URL)
      .post('/games')
      .send({
        typeGame: 'Quina',
        description: 'escolher 5 valores',
        range: 5,
        price: 3,
        maxNumber: 80,
        color: 'purple',
      })
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
    game3 = await Game.findByOrFail('secure_id', body.secureId)
    assert.equal('Quina', game3.typeGame)
    assert.equal('escolher 5 valores', game3.description)
    assert.equal(5, game3.range)
    assert.equal(3, game3.price)
    assert.equal(80, game3.maxNumber)
    assert.equal('purple', game3.color)
    assert.equal(3, (await Game.all()).length)
  })

  test('Registration Failure by Data of an Game', async (assert) => {
    await supertest(BASE_URL)
      .post('/games')
      .send({})
      .set('Authorization', 'Bearer ' + token)
      .expect(422)
    await supertest(BASE_URL)
      .post('/games')
      .send({
        typeGame: 'Quina',
        description: 'escolher 5 valores',
        maxNumber: 80,
        color: 'purple',
      })
      .set('Authorization', 'Bearer ' + token)
      .expect(422)
    assert.equal(3, (await Game.all()).length)
  })

  test('Find One Game', async (assert) => {
    var { body } = await supertest(BASE_URL)
      .get('/games/' + game1.secureId)
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
    assert.equal(body.typeGame, game1.typeGame)
    assert.equal(body.description, game1.description)
    assert.equal(body.range, game1.range)
    assert.equal(body.price, game1.price)
    assert.equal(body.maxNumber, game1.maxNumber)
    assert.equal(body.color, game1.color)
  })

  test('Find All Game', async (assert) => {
    var { body } = await supertest(BASE_URL)
      .get('/games')
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
    assert.equal(body[0].typeGame, game3.typeGame)
    assert.equal(body[0].description, game3.description)
    assert.equal(body[0].range, game3.range)
    assert.equal(body[0].price, game3.price)
    assert.equal(body[0].maxNumber, game3.maxNumber)
    assert.equal(body[0].color, game3.color)
    assert.equal(body[1].typeGame, game2.typeGame)
    assert.equal(body[1].description, game2.description)
    assert.equal(body[1].range, game2.range)
    assert.equal(body[1].price, game2.price)
    assert.equal(body[1].maxNumber, game2.maxNumber)
    assert.equal(body[1].color, game2.color)
    assert.equal(body[2].typeGame, game1.typeGame)
    assert.equal(body[2].description, game1.description)
    assert.equal(body[2].range, game1.range)
    assert.equal(body[2].price, game1.price)
    assert.equal(body[2].maxNumber, game1.maxNumber)
    assert.equal(body[2].color, game1.color)
  })

  test('Update One Game', async (assert) => {
    await supertest(BASE_URL)
      .put('/games/' + game1.secureId)
      .send({
        typeGame: 'Sorte Mania',
        description: 'escolher 8 valores',
        range: 8,
        price: 10,
        maxNumber: 85,
        color: 'yellow',
      })
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
    game1 = await Game.findByOrFail('secure_id', game1.secureId)
    assert.equal('Sorte Mania', game1.typeGame)
    assert.equal('escolher 8 valores', game1.description)
    assert.equal(8, game1.range)
    assert.equal(10, game1.price)
    assert.equal(85, game1.maxNumber)
    assert.equal('yellow', game1.color)
  })

  test('Delete One Game', async (assert) => {
    assert.equal(3, (await Game.all()).length)
    await supertest(BASE_URL)
      .delete('/games/' + game1.secureId)
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
    assert.equal(2, (await Game.all()).length)
  })
})
