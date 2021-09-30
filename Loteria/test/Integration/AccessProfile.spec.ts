import Database from '@ioc:Adonis/Lucid/Database'
import AccessProfile from 'App/Models/AccessProfile'
import Game from 'App/Models/Game'
import User from 'App/Models/User'
import test from 'japa'
import supertest from 'supertest'
const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`
let user1: User
let password1 = '123456'
let token = ''
let access1: AccessProfile, access2: AccessProfile, access3: AccessProfile

async function seeder() {
  access1 = await AccessProfile.create({
    level: 'admin',
  })
  user1 = await User.create({
    name: 'Alan Bruno1',
    email: 'teste1@gmail.com',
    password: password1,
    accessProfileId: access1.id,
  })
  let data = { email: user1.email, password: password1 }
  var { body } = await supertest(BASE_URL)
    .post('/login')
    .set('Content-Type', 'application/json')
    .send(data)
    .expect(200)
  token = body.token.token
}

test.group('Integration AccessProfile Test', (group) => {
  group.before(async () => {
    await Database.rawQuery('DELETE FROM bets')
    await Database.rawQuery('DELETE FROM users')
    await Database.rawQuery('DELETE FROM games')
    await Database.rawQuery('DELETE FROM games')
    await Database.rawQuery('DELETE FROM access_profiles')
    await seeder()
  })

  test('Register AccessProfile', async (assert) => {
    var { body } = await supertest(BASE_URL)
      .post('/accessProfiles')
      .send({
        level: 'security',
      })
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
    access2 = await AccessProfile.findByOrFail('secure_id', body.secureId)
    assert.equal('security', access2.level)
    var { body } = await supertest(BASE_URL)
      .post('/accessProfiles')
      .send({
        level: 'player',
      })
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
    access3 = await AccessProfile.findByOrFail('secure_id', body.secureId)
    assert.equal('player', access3.level)
  })

  test('Registration Failure by Data of an AccessProfile', async (assert) => {
    await supertest(BASE_URL)
      .post('/accessProfiles')
      .send({})
      .set('Authorization', 'Bearer ' + token)
      .expect(422)
  })

  test('Find One AccessProfile', async (assert) => {
    var { body } = await supertest(BASE_URL)
      .get('/accessProfiles/' + access1.secureId)
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
    assert.equal(access1.level, body.level)
    assert.equal(access1.secureId, body.secureId)
  })

  test('No Find One AccessProfile', async (assert) => {
    await supertest(BASE_URL)
      .get('/accessProfiles/' + 123)
      .set('Authorization', 'Bearer ' + token)
      .expect(404)
  })

  test('Find All AccessProfile', async (assert) => {
    var { body } = await supertest(BASE_URL)
      .get('/accessProfiles')
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
    assert.equal(access3.level, body[0].level)
    assert.equal(access3.secureId, body[0].secureId)
    assert.equal(access2.level, body[1].level)
    assert.equal(access2.secureId, body[1].secureId)
    assert.equal(access1.level, body[2].level)
    assert.equal(access1.secureId, body[2].secureId)
  })

  test('Update One AccessProfile', async (assert) => {
    await supertest(BASE_URL)
      .put('/accessProfiles/' + access2.secureId)
      .send({
        level: 'governament',
      })
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
    access2 = await AccessProfile.findByOrFail('secure_id', access2.secureId)
    assert.equal('governament', access2.level)
  })

  test('Delete One Game', async (assert) => {
    assert.equal(3, (await AccessProfile.all()).length)
    await supertest(BASE_URL)
      .delete('/accessProfiles/' + access2.secureId)
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
    assert.equal(2, (await AccessProfile.all()).length)
  })
})
