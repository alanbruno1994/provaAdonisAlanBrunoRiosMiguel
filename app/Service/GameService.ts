import Game from 'App/Models/Game'

export default class GameService {
  public static async updateGame(params, request, response) {
    if (request.method() === 'PUT') {
      await request.validate({ schema: Game.getRulesValidation() })
    } else {
      await request.validate({ schema: Game.getPatchValidation(request.all()) })
    }
    try {
      let game = await Game.findByOrFail('id', params.id)
      let gameAltered = await game.merge(request.except(['id'])).save()
      return gameAltered
    } catch (erro) {
      return response.badRequest({ mensage: 'Not found game' })
    }
  }

  public static async createdGame(request) {
    let game = request.only(['typeGame', 'description', 'range', 'price', 'maxNumber', 'color'])
    return await Game.create(game)
  }
}
