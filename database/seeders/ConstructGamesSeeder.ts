import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'

import Drive from '@ioc:Adonis/Core/Drive'
import Application from '@ioc:Adonis/Core/Application'
import Game from 'App/Models/Game'

export default class ConstructGamesSeederSeeder extends BaseSeeder {
  public async run() {
    const contents = await Drive.get(Application.tmpPath() + '/games.json')
    let values = await JSON.parse('' + contents)
    for (const { type, range, price, description, maxNumber, color } of values.types) {
      await Game.create({ typeGame: type, range, price, description, maxNumber, color })
    }
  }
}
