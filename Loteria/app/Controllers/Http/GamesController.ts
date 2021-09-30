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
    return GameService.createdGame(request)
  }
  //Aqui busca um jogo pelo id
  public async show({ params, response }: HttpContextContract) {
    return GameService.find(params, response)
  }
  //Aqui atualizamos um jogo
  public async update({ request, params, response }: HttpContextContract) {
    return GameService.updateGame(params, request, response)
  }
  //Aqui apaga um jogo pelo id
  public async destroy({ params, response }: HttpContextContract) {
    return GameService.delete(params, response)
  }
}
