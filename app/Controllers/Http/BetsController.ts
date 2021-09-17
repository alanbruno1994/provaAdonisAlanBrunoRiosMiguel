import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Bet from 'App/Models/Bet'

export default class BetsController {
  public async index({}: HttpContextContract) {
    return await Bet.query().select('price_game', 'number_choose', 'secure_id')
  }

  public async store({ request, auth }: HttpContextContract) {
    await request.validate({ schema: Bet.getRulesValidation() })
    let bet = request.only(['gameId', 'priceGame', 'numberChoose'])
    let { priceGame, numberChoose, secureId } = await Bet.create({ ...bet, userId: auth.user?.id })
    return { priceGame, numberChoose, secureId }
  }

  public async show({ params, response }: HttpContextContract) {
    try {
      let { priceGame, numberChoose, secureId } = await Bet.findByOrFail('secure_id', params.id)
      return { priceGame, numberChoose, secureId }
    } catch (erro) {
      return response.badRequest({ mensage: 'Not found bet' })
    }
  }

  public async update({ request, params, response }: HttpContextContract) {
    try {
      let bet = await Bet.findByOrFail('secure_id', params.id)
      let { priceGame, numberChoose, secureId } = await bet.merge(request.all()).save()
      return { priceGame, numberChoose, secureId }
    } catch (erro) {
      return response.badRequest({ mensage: 'Not found bet' })
    }
  }

  public async destroy({ params, response }: HttpContextContract) {
    try {
      let bet = await Bet.findByOrFail('secure_id', params.id)
      await bet.delete()
    } catch (erro) {
      return response.badRequest({ mensage: 'Not found bet' })
    }
  }
}
