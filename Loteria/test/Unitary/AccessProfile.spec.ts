import Database from '@ioc:Adonis/Lucid/Database'
import AccessProfile from 'App/Models/AccessProfile'
import test from 'japa'
let access1: AccessProfile, access2: AccessProfile, access3: AccessProfile, access4: AccessProfile

test.group('Access Profile Unitary Test', (group) => {
  group.before(async () => {
    await Database.rawQuery('DELETE FROM users')
    await Database.rawQuery('DELETE FROM access_profiles')
  })
  test('register test', async (assert) => {
    access1 = await AccessProfile.create({
      level: 'admin',
    })
    access2 = await AccessProfile.create({
      level: 'player',
    })
    access3 = await AccessProfile.create({
      level: 'service',
    })
    access4 = await AccessProfile.create({
      level: 'security',
    })
    assert.equal(4, (await AccessProfile.all()).length)
    assert.equal('admin', access1.level)
    assert.equal('player', access2.level)
    assert.equal('service', access3.level)
    assert.equal('security', access4.level)
  })

  test('update one access profile', async (assert) => {
    access3.merge({ level: 'governance' })
    await access3.save()
    let value = await AccessProfile.findByOrFail('secure_id', access3.secureId)
    assert.equal('governance', value.level)
  })

  test('delete one access profile', async (assert) => {
    assert.equal(4, (await AccessProfile.all()).length)
    await access3?.delete()
    assert.equal(3, (await AccessProfile.all()).length)
  })
})
