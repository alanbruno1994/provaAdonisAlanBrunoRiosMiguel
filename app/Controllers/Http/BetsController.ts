import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Bet from 'App/Models/Bet'
import BetService from 'App/Service/BetService'

export default class BetsController {
  //Aqui busca todas as apostas
  public async index({}: HttpContextContract) {
    return BetService.findAll()
  }
  //Aqui buasca todas as aposta e incluidados dados associadas as apostas
  public async indexAll({}: HttpContextContract) {
    return BetService.findAllandDataAll()
  }
  //Aqui faz um registro de aposta
  public async store({ request, auth }: HttpContextContract) {
    return BetService.createBet(request, auth)
  }
  //Aqui busca um jogo e os dados associados
  public async showAll({ params, response }: HttpContextContract) {
    return BetService.findDataAll(params, response)
  }
  //Aqui busca um jogo
  public async show({ params, response }: HttpContextContract) {
    try {
      return await Bet.findByOrFail('id', params.id)
    } catch (erro) {
      return response.badRequest({ mensage: 'Not found bet' })
    }
  }
  //Aqui atualiza um jogo
  public async update({ request, params, response }: HttpContextContract) {
    return BetService.updateBet(request, params, response)
  }
  //Aqui apaga uma aposta através de um id
  public async destroy({ params, response }: HttpContextContract) {
    try {
      let bet = await Bet.findByOrFail('id', params.id)
      await bet.delete()
    } catch (erro) {
      return response.badRequest({ mensage: 'Not found bet' })
    }
  }
}
