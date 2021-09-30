import AccessProfile from 'App/Models/AccessProfile'
import Database from '@ioc:Adonis/Lucid/Database'
import User from 'App/Models/User'
import test from 'japa'
let user1: User, user2: User, user3: User
let accessprofile1: AccessProfile, accessprofile2: AccessProfile

test.group('User Test Unitary', (group) => {
  group.before(async () => {
    await Database.rawQuery('DELETE FROM users')
    await Database.rawQuery('DELETE FROM access_profiles')
    accessprofile1 = await AccessProfile.create({
      level: 'admin',
    })
    accessprofile2 = await AccessProfile.create({
      level: 'player',
    })
  })
  test('Register Test', async (assert) => {
    user1 = await User.create({
      email: 'sosvari21@gmail.com',
      name: 'Alan Bruno1',
      password: '12345',
      accessProfileId: accessprofile1.id,
    })
    assert.equal('Alan Bruno1', user1.name)
    assert.equal('sosvari21@gmail.com', user1.email)
    assert.equal(accessprofile1.id, user1.accessProfileId)
    assert.notEqual('12345', user1.password)
    user2 = await User.create({
      email: 'sosvari22@gmail.com',
      name: 'Alan Bruno2',
      password: '12346',
      accessProfileId: accessprofile1.id,
    })
    assert.equal('Alan Bruno2', user2.name)
    assert.equal('sosvari22@gmail.com', user2.email)
    assert.equal(accessprofile1.id, user2.accessProfileId)
    assert.notEqual('12346', user2.password)
    user3 = await User.create({
      email: 'sosvari23@gmail.com',
      name: 'Alan Bruno3',
      password: '12347',
      accessProfileId: accessprofile2.id,
    })
    assert.equal('Alan Bruno3', user3.name)
    assert.equal('sosvari23@gmail.com', user3.email)
    assert.equal(accessprofile2.id, user3.accessProfileId)
    assert.notEqual('12347', user3.password)
  })

  test('Update One User', async (assert) => {
    user1.merge({
      email: 'sosvari@gmail.com',
      name: 'Alan Bruno',
      password: '12345',
    })
    await user1.save()
    user1 = await User.findByOrFail('secure_id', user1.secureId)
    assert.notEqual('Alan Bruno2', user1.name)
    assert.notEqual('sosvari22@gmail.com', user1.email)
    assert.notEqual('12345', user1.password)
  })

  test('Unique Email of User', async (assert) => {
    assert.equal(3, (await User.all()).length)
    try {
      await User.create({
        email: 'sosvari@gmail.com',
        name: 'Alan Bruno2',
        password: '12345',
      })
    } catch (e) {}
    assert.equal(3, (await User.all()).length)
  })

  test('delete one user', async (assert) => {
    assert.equal(3, (await User.all()).length)
    await user3.delete()
    assert.equal(2, (await User.all()).length)
  })
})
