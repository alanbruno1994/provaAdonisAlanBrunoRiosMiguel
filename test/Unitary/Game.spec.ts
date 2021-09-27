import Database from '@ioc:Adonis/Lucid/Database'
import Game from 'App/Models/Game'
import test from 'japa'
let game1: Game, game2: Game, game3: Game

test.group('Game Test Unitary', (group) => {
  group.before(async () => {
    await Database.rawQuery('DELETE FROM games')
  })
  test('register one game test', async (assert) => {
    game1 = await Game.create({
      typeGame: 'Mega Sena',
      price: 5,
      range: 6,
      maxNumber: 60,
      color: 'green',
    })
    assert.equal('Mega Sena', game1.typeGame)
    assert.equal(5, game1.price)
    assert.equal(6, game1.range)
    assert.equal(60, game1.maxNumber)
    assert.equal('green', game1.color)
    game2 = await Game.create({
      typeGame: 'Lotofacil',
      price: 8,
      range: 15,
      maxNumber: 25,
      color: 'pink',
    })
    assert.equal('Lotofacil', game2.typeGame)
    assert.equal(8, game2.price)
    assert.equal(15, game2.range)
    assert.equal(25, game2.maxNumber)
    assert.equal('pink', game2.color)
    game3 = await Game.create({
      typeGame: 'Quina',
      price: 4,
      range: 5,
      maxNumber: 80,
      color: 'blue',
    })
    assert.equal('Quina', game3.typeGame)
    assert.equal(4, game3.price)
    assert.equal(5, game3.range)
    assert.equal(80, game3.maxNumber)
    assert.equal('blue', game3.color)
  })

  test('update one game', async (assert) => {
    game1.merge({
      typeGame: 'Sorte Mania',
      price: 2,
      range: 8,
      maxNumber: 90,
      color: 'blue',
    })
    await game1.save()
    game1 = await Game.findByOrFail('secure_id', game1.secureId)
    assert.equal('Sorte Mania', game1.typeGame)
    assert.equal(2, game1.price)
    assert.equal(8, game1.range)
    assert.equal(90, game1.maxNumber)
    assert.equal('blue', game1.color)
  })

  test('delete one game', async (assert) => {
    assert.equal(3, (await Game.all()).length)
    await game1.delete()
    assert.equal(2, (await Game.all()).length)
  })
})
