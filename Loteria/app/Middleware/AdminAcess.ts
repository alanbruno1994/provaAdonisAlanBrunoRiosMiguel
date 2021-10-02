import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AdminAcess {
  //Aqui seria o middleware que vai servi para impedir que determinadas rotas não sejam acessadas por usuários que não sejam administrador
  public async handle({ auth, response }: HttpContextContract, next: () => Promise<void>) {
    await auth.user?.load('access')
    if (auth.user?.access.level !== 'admin')
      return response.badRequest({ mensage: 'Route allowed only to administrators' })
    // code for middleware goes here. ABOVE THE NEXT CALL
    await next()
  }
}
