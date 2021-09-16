import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Bet from 'App/Models/Bet'

export default class BetsController {
  public async index({ params, request }: HttpContextContract) {
    if (request.only(['all']).all) {
      console.log('puxa tudo', request.only(['all']).all)
      return await Bet.query().preload('users').preload('games')
    }
    return await Bet.all()
  }

  public async store({ request, auth }: HttpContextContract) {
    await request.validate({ schema: Bet.getRulesValidation() })
    let bet = request.only(['gameId', 'priceGame', 'numberChoose'])
    return await Bet.create({ ...bet, userId: auth.user?.id })
  }

  public async show({ params, response, request }: HttpContextContract) {
    try {
      let bet = await Bet.findByOrFail('id', params.id)
      if (request.only(['all']).all) {
        await bet.load('users')
        await bet.load('games')
      }
      return bet
    } catch (erro) {
      return response.badRequest({ mensage: 'Not found bet' })
    }
  }

  public async update({ request, params, response }: HttpContextContract) {
    try {
      let bet = await Bet.findByOrFail('id', params.id)
      await bet.merge(request.all()).save()
      return bet
    } catch (erro) {
      return response.badRequest({ mensage: 'Not found bet' })
    }
  }

  public async destroy({ params, response }: HttpContextContract) {
    try {
      let bet = await Bet.findByOrFail('id', params.id)
      await bet.delete()
    } catch (erro) {
      return response.badRequest({ mensage: 'Not found bet' })
    }
  }
}
