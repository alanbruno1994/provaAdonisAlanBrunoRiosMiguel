import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UserLogoutsController {
  public async store({ auth }: HttpContextContract) {
    await auth.logout()
  }
}
