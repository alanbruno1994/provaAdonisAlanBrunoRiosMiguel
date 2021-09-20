import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Bet from 'App/Models/Bet'
import BetService from 'App/Service/BetService'

export default class BetsController {
  public async index({}: HttpContextContract) {
    return BetService.findAll()
  }

  public async indexAll({}: HttpContextContract) {
    return BetService.findAllandDataAll()
  }

  public async store({ request, auth }: HttpContextContract) {
    return BetService.createBet(request, auth)
  }

  public async showAll({ params, response }: HttpContextContract) {
    return BetService.findDataAll(params, response)
  }

  public async show({ params, response }: HttpContextContract) {
    try {
      return await Bet.findByOrFail('id', params.id)
    } catch (erro) {
      return response.badRequest({ mensage: 'Not found bet' })
    }
  }

  public async update({ request, params, response }: HttpContextContract) {
    return BetService.updateBet(request, params, response)
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
