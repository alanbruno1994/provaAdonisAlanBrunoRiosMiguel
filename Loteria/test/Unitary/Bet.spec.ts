import Database from '@ioc:Adonis/Lucid/Database'
import AccessProfile from 'App/Models/AccessProfile'
import Bet from 'App/Models/Bet'
import Game from 'App/Models/Game'
import User from 'App/Models/User'
import test from 'japa'
let user1: User, user2: User, user3: User
let accessprofile1: AccessProfile, accessprofile2: AccessProfile
let game1: Game, game2: Game, game3: Game
let bet1: Bet, bet2: Bet, bet3: Bet, bet4: Bet
let number1, number2, number3, number4
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

test.group('Bet Test Unitary', (group) => {
  group.before(async () => {
    await Database.rawQuery('DELETE FROM bets')
    await Database.rawQuery('DELETE FROM users')
    await Database.rawQuery('DELETE FROM games')
    accessprofile1 = await AccessProfile.create({
      level: 'admin',
    })
    accessprofile2 = await AccessProfile.create({
      level: 'player',
    })
    user1 = await User.create({
      email: 'sosvari21@gmail.com',
      name: 'Alan Bruno1',
      password: '12345',
      accessProfileId: accessprofile1.id,
    })
    user2 = await User.create({
      email: 'sosvari22@gmail.com',
      name: 'Alan Bruno2',
      password: '12346',
      accessProfileId: accessprofile1.id,
    })
    user3 = await User.create({
      email: 'sosvari23@gmail.com',
      name: 'Alan Bruno3',
      password: '12347',
      accessProfileId: accessprofile2.id,
    })
    game1 = await Game.create({
      typeGame: 'Mega Sena',
      price: 5,
      range: 6,
      maxNumber: 60,
      color: 'green',
    })
    game2 = await Game.create({
      typeGame: 'Lotofacil',
      price: 8,
      range: 15,
      maxNumber: 25,
      color: 'pink',
    })
    game3 = await Game.create({
      typeGame: 'Quina',
      price: 4,
      range: 5,
      maxNumber: 80,
      color: 'blue',
    })
    number1 = randonNumber(game1.range, game1.maxNumber, '')
    number2 = randonNumber(game1.range, game1.maxNumber, '')
    number3 = randonNumber(game2.range, game2.maxNumber, '')
    number4 = randonNumber(game3.range, game3.maxNumber, '')
  })

  test('Register Bets', async (assert) => {
    assert.equal(0, (await Bet.all()).length)
    bet1 = await Bet.create({
      gameId: game1.id,
      priceGame: game1.price,
      numberChoose: number1,
      userId: user1.id,
    })
    assert.equal(bet1.gameId, game1.id)
    assert.equal(bet1.userId, user1.id)
    assert.equal(game1.price, bet1.priceGame)
    assert.equal(number1, bet1.numberChoose)
    bet2 = await Bet.create({
      gameId: game1.id,
      priceGame: game1.price,
      numberChoose: number2,
      userId: user2.id,
    })
    assert.equal(bet2.gameId, game1.id)
    assert.equal(bet2.userId, user2.id)
    assert.equal(game1.price, bet2.priceGame)
    assert.equal(number2, bet2.numberChoose)
    bet3 = await Bet.create({
      gameId: game2.id,
      priceGame: game2.price,
      numberChoose: number3,
      userId: user3.id,
    })
    assert.equal(bet3.gameId, game2.id)
    assert.equal(bet3.userId, user3.id)
    assert.equal(bet3.priceGame, game2.price)
    assert.equal(number3, bet3.numberChoose)
    bet4 = await Bet.create({
      gameId: game3.id,
      priceGame: game3.price,
      numberChoose: number4,
      userId: user3.id,
    })
    assert.equal(bet4.gameId, game3.id)
    assert.equal(bet4.userId, user3.id)
    assert.equal(bet4.priceGame, game3.price)
    assert.equal(number4, bet4.numberChoose)
    assert.equal(4, (await Bet.all()).length)
  })

  test('Update One Bet', async (assert) => {
    number1 = randonNumber(game2.range, game2.maxNumber, '')
    bet1.merge({
      gameId: game2.id,
      priceGame: game2.price,
      numberChoose: number1,
      userId: user2.id,
    })
    await bet1.save()
    bet1 = await Bet.findByOrFail('secure_id', bet1.secureId)
    assert.equal(bet1.gameId, game2.id)
    assert.equal(bet1.userId, user2.id)
    assert.equal(bet1.priceGame, game2.price)
    assert.equal(number1, bet1.numberChoose)
  })

  test('Delete One Bet', async (assert) => {
    assert.equal(4, (await Bet.all()).length)
    await bet1.delete()
    assert.equal(3, (await Bet.all()).length)
  })

  test('Dependency of Game Delete', async (assert) => {
    assert.equal(3, (await Bet.all()).length)
    await game1.delete()
    assert.equal(2, (await Bet.all()).length)
  })

  test('Dependency User Delete', async (assert) => {
    assert.equal(2, (await Bet.all()).length)
    await user3.delete()
    assert.equal(0, (await Bet.all()).length)
  })
})
