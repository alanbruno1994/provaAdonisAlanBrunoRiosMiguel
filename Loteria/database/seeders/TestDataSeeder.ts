import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Bet from 'App/Models/Bet'
import Game from 'App/Models/Game'
import User from 'App/Models/User'
import { DateTime } from 'luxon'

export default class TestDataSeeder extends BaseSeeder {
  public static developmentOnly = true
  public async run() {
    var dateCreated = DateTime.local(2021, 9, 5, 10, 30, 20)
    let user1 = await User.create({
      name: 'Alan Bruno',
      password: '123456',
      email: 'sosvari21@gmail.com',
      accessProfileId: 1,
      createdAt: dateCreated,
    })
    let user2 = await User.create({
      name: 'Alan Bruno2',
      password: '123456',
      email: 'sosvari22@gmail.com',
      accessProfileId: 1,
      createdAt: dateCreated,
    })
    var dateCreated = DateTime.local(2021, 9, 17, 8, 30, 20)
    let user3 = await User.create({
      name: 'Alan Bruno3',
      password: '123456',
      email: 'sosvari25@gmail.com',
      accessProfileId: 1,
      createdAt: dateCreated,
    })
    await User.create({
      name: 'Alan Bruno4',
      password: '123456',
      email: 'sosvari26@gmail.com',
      accessProfileId: 1,
      createdAt: dateCreated,
    })
    await User.create({
      name: 'Alan Bruno5',
      password: '123456',
      email: 'sosvari28@gmail.com',
      accessProfileId: 1,
      createdAt: dateCreated,
    })
    await User.create({
      name: 'Alan Bruno6',
      password: '123456',
      email: 'sosvari30@gmail.com',
      accessProfileId: 2,
      createdAt: dateCreated,
    })
    await User.create({
      name: 'Alan Bruno7',
      password: '123456',
      email: 'sosvari31@gmail.com',
      accessProfileId: 2,
      createdAt: dateCreated,
    })
    let game1 = await Game.create({
      typeGame: 'Loto Fácil',
      description: 'Jogo da sorte',
      range: 15,
      maxNumber: 80,
      price: 2,
      color: '#fc0303',
    })
    let game2 = await Game.create({
      typeGame: 'Mega Sena',
      description: 'Jogo da sorte',
      range: 6,
      maxNumber: 60,
      price: 3,
      color: '#fc0303',
    })
    let game3 = await Game.create({
      typeGame: 'Sorte Mania',
      description: 'Jogo da sorte',
      range: 6,
      maxNumber: 100,
      price: 4,
      color: '#fc0303',
    })

    await Bet.create({
      gameId: game1.id,
      numberChoose: '01,02,03,04,05,06,07,08,09,10,11,12,13,14,15',
      priceGame: 2,
      userId: user1.id,
      createdAt: dateCreated,
    })
    await Bet.create({
      gameId: game2.id,
      numberChoose: '01,02,03,04,05,06',
      priceGame: 2,
      userId: user1.id,
      createdAt: dateCreated,
    })
    await Bet.create({
      gameId: game3.id,
      numberChoose: '01,02,03,04,05,06',
      priceGame: 2,
      userId: user2.id,
      createdAt: dateCreated,
    })
    var dateCreated = DateTime.local(2021, 9, 5, 10, 30, 20)
    await Bet.create({
      gameId: game1.id,
      numberChoose: '01,02,03,04,05,06,07,08,09,10,11,12,13,14,15',
      priceGame: 2,
      userId: user3.id,
      createdAt: dateCreated,
    })
  }
}
