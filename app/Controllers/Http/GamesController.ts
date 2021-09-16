import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Game from 'App/Models/Game'

export default class GamesController {
  public async index({}: HttpContextContract) {
    return await Game.all()
  }

  public async store({ request }: HttpContextContract) {
    await request.validate({ schema: Game.getRulesValidation() })
    let game = request.only(['typeGame', 'description', 'range', 'price', 'maxNumber', 'color'])
    return await Game.create(game)
  }

  public async show({ params, response }: HttpContextContract) {
    try {
      let user = await Game.findByOrFail('id', params.id)
      return user
    } catch (erro) {
      return response.badRequest({ mensage: 'Not found user' })
    }
  }

  public async update({ request, params, response }: HttpContextContract) {
    try {
      let game = await Game.findByOrFail('id', params.id)
      await game.merge(request.all()).save()
      return game
    } catch (erro) {
      return response.badRequest({ mensage: 'Not found user' })
    }
  }

  public async destroy({ params, response }: HttpContextContract) {
    try {
      let game = await Game.findByOrFail('id', params.id)
      await game.delete()
    } catch (erro) {
      return response.badRequest({ mensage: 'Not found game' })
    }
  }
}
