import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Game from 'App/Models/Game'

export default class GamesController {
  public async index({}: HttpContextContract) {
    return await Game.query().select(
      'typeGame',
      'description',
      'range',
      'price',
      'maxNumber',
      'color',
      'secure_id'
    )
  }

  public async store({ request }: HttpContextContract) {
    await request.validate({ schema: Game.getRulesValidation() })
    let game = request.only(['typeGame', 'description', 'range', 'price', 'maxNumber', 'color'])
    let { typeGame, description, price, color, maxNumber, range, secureId, createdAt, updatedAt } =
      await Game.create(game)
    return {
      typeGame,
      description,
      price,
      color,
      maxNumber,
      range,
      secureId,
      createdAt,
      updatedAt,
    }
  }

  public async show({ params, response }: HttpContextContract) {
    try {
      let {
        typeGame,
        description,
        price,
        color,
        maxNumber,
        range,
        secureId,
        createdAt,
        updatedAt,
      } = await Game.findByOrFail('secure_id', params.id)
      return {
        typeGame,
        description,
        price,
        color,
        maxNumber,
        range,
        secureId,
        createdAt,
        updatedAt,
      }
    } catch (erro) {
      return response.badRequest({ mensage: 'Not found game' })
    }
  }

  public async update({ request, params, response }: HttpContextContract) {
    if (request.method() === 'PUT') {
      await request.validate({ schema: Game.getRulesValidation() })
    } else {
      await request.validate({ schema: Game.getPatchValidation(request.all()) })
    }
    try {
      let game = await Game.findByOrFail('secure_id', params.id)
      let {
        typeGame,
        description,
        price,
        color,
        maxNumber,
        range,
        secureId,
        createdAt,
        updatedAt,
      } = await game.merge(request.all()).save()
      return {
        typeGame,
        description,
        price,
        color,
        maxNumber,
        range,
        secureId,
        createdAt,
        updatedAt,
      }
    } catch (erro) {
      return response.badRequest({ mensage: 'Not found game' })
    }
  }

  public async destroy({ params, response }: HttpContextContract) {
    try {
      let game = await Game.findByOrFail('secure_id', params.id)
      await game.delete()
    } catch (erro) {
      return response.badRequest({ mensage: 'Not found game' })
    }
  }
}
