import Database from '@ioc:Adonis/Lucid/Database'
import AccessProfile from 'App/Models/AccessProfile'
import User from 'App/Models/User'
import test from 'japa'
import supertest from 'supertest'
let accessprofile1: AccessProfile, accessprofile2: AccessProfile
const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`
let user1: User, user2: User, user3: User
let password1 = '123456',
  password2 = '123436',
  password3 = 'abcdef'
let token = ''
test.group('Integration User Test', (group) => {
  group.before(async () => {
    await Database.rawQuery('DELETE FROM bets')
    await Database.rawQuery('DELETE FROM users')
    await Database.rawQuery('DELETE FROM games')
    await Database.rawQuery('DELETE FROM games')
    await Database.rawQuery('DELETE FROM access_profiles')
    accessprofile1 = await AccessProfile.create({
      level: 'admin',
    })
    accessprofile2 = await AccessProfile.create({
      level: 'player',
    })
  })
  test('Register Users', async (assert) => {
    var { body } = await supertest(BASE_URL)
      .post('/users')
      .send({
        name: 'Alan Bruno1',
        email: 'teste1@gmail.com',
        password: password1,
        password_confirmation: password1,
        accessProfileId: accessprofile1.id,
      })
      .expect(200)
    user1 = await User.findByOrFail('secure_id', body.secureId)
    assert.equal(user1.name, body.name)
    assert.equal(user1.email, body.email)
    assert.equal(undefined, body.password)
    var { body } = await supertest(BASE_URL)
      .post('/users')
      .send({
        name: 'Alan Bruno2',
        email: 'teste2@gmail.com',
        password: password2,
        password_confirmation: password2,
        accessProfileId: accessprofile1.id,
      })
      .expect(200)
    user2 = await User.findByOrFail('secure_id', body.secureId)
    assert.equal(user2.name, body.name)
    assert.equal(user2.email, body.email)
    assert.equal(undefined, body.password)
    var { body } = await supertest(BASE_URL)
      .post('/users')
      .send({
        name: 'Alan Bruno3',
        email: 'teste3@gmail.com',
        password: password3,
        password_confirmation: password3,
        accessProfileId: accessprofile2.id,
      })
      .expect(200)
    user3 = await User.findByOrFail('secure_id', body.secureId)
    assert.equal(user3.name, body.name)
    assert.equal(user3.email, body.email)
    assert.equal(undefined, body.password)
    assert.equal(3, (await User.all()).length)
  })

  test('Registration Failure by Data of an User', async (assert) => {
    await supertest(BASE_URL)
      .post('/users')
      .send({})
      .set('Authorization', 'Bearer ' + token)
      .expect(422)
    await supertest(BASE_URL)
      .post('/users')
      .send({
        name: 'Alan Bruno3',
        email: 'teste3@gmail.com',
        password: password3,
        password_confirmation: password3,
      })
      .set('Authorization', 'Bearer ' + token)
      .expect(422)
    await supertest(BASE_URL)
      .post('/users')
      .send({
        password: password3,
        password_confirmation: password3,
        accessProfileId: accessprofile2.id,
      })
      .set('Authorization', 'Bearer ' + token)
      .expect(422)
    assert.equal(3, (await User.all()).length)
  })

  test('Login Admin User', async (assert) => {
    let data = { email: user1.email, password: password1 }
    const dataRecived = await supertest(BASE_URL)
      .post('/login')
      .set('Content-Type', 'application/json')
      .send(data)
      .expect(200)
    token = dataRecived.body.token.token
    let secureid = dataRecived.body.secureId
    assert.equal(user1.secureId, secureid)
    assert.notEqual(undefined, token)
  })

  test('Logout User', async (assert) => {
    assert.equal(3, (await User.all()).length)
    await supertest(BASE_URL)
      .post('/logout')
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
    await supertest(BASE_URL)
      .delete('/users/' + user1.secureId)
      .set('Authorization', 'Bearer ' + token)
      .expect(401)
    assert.equal(3, (await User.all()).length)
    let data = { email: user1.email, password: password1 }
    const dataRecived = await supertest(BASE_URL)
      .post('/login')
      .set('Content-Type', 'application/json')
      .send(data)
      .expect(200)
    token = dataRecived.body.token.token
  })

  test('Find One User', async (assert) => {
    var { body } = await supertest(BASE_URL)
      .get('/users/' + user1.secureId)
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
    assert.equal(body.name, user1.name)
    assert.equal(body.email, user1.email)
    assert.equal(body.secureId, user1.secureId)
  })

  test('No Find One User', async (assert) => {
    await supertest(BASE_URL)
      .get('/users/' + 123)
      .set('Authorization', 'Bearer ' + token)
      .expect(404)
  })

  test('Find One User and Dependency', async (assert) => {
    var { body } = await supertest(BASE_URL)
      .get('/usersAll/' + user1.secureId)
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
    assert.equal(body.name, user1.name)
    assert.equal(body.email, user1.email)
    assert.equal(body.secureId, user1.secureId)
    assert.equal(body.access.level, accessprofile1.level)
    assert.equal(body.access.secureId, accessprofile1.secureId)
  })

  test('Operation Admin User', async (assert) => {
    await supertest(BASE_URL)
      .post('/games')
      .set('Content-Type', 'application/json')
      .send({
        typeGame: 'lotofacil',
        description: 'game de sorteio',
        range: 10,
        price: 5,
        maxNumber: 10,
        color: 'ooo',
      })
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
  })

  test('Update One User', async (assert) => {
    var { body } = await supertest(BASE_URL)
      .put('/users/' + user1.secureId)
      .send({
        email: 'sosvari23@gmail.com',
        name: 'Alan XXXXX',
        password: '123458',
        password_confirmation: '123458',
        accessProfileId: accessprofile2.id,
      })
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
    user1 = await User.findByOrFail('secure_id', user1.secureId)
    assert.equal('Alan XXXXX', user1.name)
    assert.equal('sosvari23@gmail.com', user1.email)
    assert.equal(user1.secureId, user1.secureId)
    assert.equal(undefined, body.password)
  })

  test('Operation For No Admin User', async (assert) => {
    await supertest(BASE_URL)
      .post('/games')
      .set('Content-Type', 'application/json')
      .send({
        typeGame: 'lotofacil',
        description: 'game de sorteio',
        range: 10,
        price: 5,
        maxNumber: 10,
        color: 'ooo',
      })
      .set('Authorization', 'Bearer ' + token)
      .expect(400)
    await supertest(BASE_URL)
      .delete('/users/' + user1.secureId)
      .set('Authorization', 'Bearer ' + token)
      .expect(400)
    await supertest(BASE_URL)
      .delete('/games/' + 12333)
      .set('Authorization', 'Bearer ' + token)
      .expect(400)
    await supertest(BASE_URL)
      .delete('/accessProfiles/' + 12333)
      .set('Authorization', 'Bearer ' + token)
      .expect(400)
    await supertest(BASE_URL)
      .post('/accessProfiles')
      .send({
        level: 'security',
      })
      .set('Authorization', 'Bearer ' + token)
      .expect(400)
    await supertest(BASE_URL)
      .put('/accessProfiles/' + accessprofile1.secureId)
      .send({
        level: 'governament',
      })
      .set('Authorization', 'Bearer ' + token)
      .expect(400)
  })

  test('Delete One User', async (assert) => {
    let data = { email: user2.email, password: password2 }
    var { body } = await supertest(BASE_URL)
      .post('/login')
      .set('Content-Type', 'application/json')
      .send(data)
      .expect(200)
    token = body.token.token
    let secureid = body.secureId
    assert.equal(user2.secureId, secureid)
    assert.notEqual(undefined, token)

    assert.equal(3, (await User.all()).length)

    await supertest(BASE_URL)
      .delete('/users/' + user1.secureId)
      .set('Authorization', 'Bearer ' + token)
      .expect(200)

    assert.equal(2, (await User.all()).length)
  })
})
