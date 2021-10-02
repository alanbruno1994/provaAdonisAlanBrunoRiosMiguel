import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import AccessProfile from 'App/Models/AccessProfile'

export default class AccessLevelSeederSeeder extends BaseSeeder {
  public async run() {
    await AccessProfile.create({ level: 'admin' })
    await AccessProfile.create({ level: 'player' })
  }
}
