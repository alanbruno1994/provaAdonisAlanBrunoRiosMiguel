import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UserLogoutsController {
  //Aqui é a operação de sair da conta
  public async store({ auth }: HttpContextContract) {
    await auth.logout()
  }
}
