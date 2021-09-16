import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class UsersController {
  public async index({ request }: HttpContextContract) {
    if (request.only(['all']).all) {
      return await User.query().preload('access').preload('bets')
    }
    return await User.all()
  }

  public async store({ request }: HttpContextContract) {
    await request.validate({ schema: User.getRulesValidation() })
    let user = request.only(['accessProfileId', 'password', 'name', 'email'])
    return await User.create(user)
  }

  public async show({ params, response, request }: HttpContextContract) {
    try {
      let user = await User.findByOrFail('id', params.id)
      if (request.only(['all']).all) {
        await user.load('access')
        await user.load('bets')
      }
      return user
    } catch (erro) {
      return response.badRequest({ mensage: 'Not found user' })
    }
  }

  public async update({ request, params, response }: HttpContextContract) {
    try {
      let user = await User.findByOrFail('id', params.id)
      await user.merge(request.all()).save()
      return user
    } catch (erro) {
      return response.badRequest({ mensage: 'Not found user' })
    }
  }

  public async destroy({ params, response }: HttpContextContract) {
    try {
      let user = await User.findByOrFail('id', params.id)
      await user.delete()
    } catch (erro) {
      return response.badRequest({ mensage: 'Not found user' })
    }
  }
}
