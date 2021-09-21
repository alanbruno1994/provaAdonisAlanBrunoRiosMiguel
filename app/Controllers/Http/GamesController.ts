import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Game from 'App/Models/Game'
import GameService from 'App/Service/GameService'

export default class GamesController {
  //Aqui busca todos os jogos
  public async index({}: HttpContextContract) {
    return await Game.all()
  }
  //Aqui registra um jogo
  public async store({ request }: HttpContextContract) {
    await request.validate({ schema: Game.getRulesValidation() })
    return GameService.createdGame(request)
  }
  //Aqui busca um jogo pelo id
  public async show({ params, response }: HttpContextContract) {
    try {
      return await Game.findByOrFail('id', params.id)
    } catch (erro) {
      return response.badRequest({ mensage: 'Not found game' })
    }
  }
  //Aqui atualizamos um jogo
  public async update({ request, params, response }: HttpContextContract) {
    return GameService.updateGame(params, request, response)
  }
  //Aqui apaga um jogo pelo id
  public async destroy({ params, response }: HttpContextContract) {
    try {
      let game = await Game.findByOrFail('id', params.id)
      await game.delete()
    } catch (erro) {
      return response.badRequest({ mensage: 'Not found game' })
    }
  }
}
