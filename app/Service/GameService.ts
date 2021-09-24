import Game from 'App/Models/Game'
import GameCreateAndPutValidator from 'App/Validators/Game/GameCreateAndPutValidator'
import PatchGameValidator from 'App/Validators/Game/PatchGameValidator'

export default class GameService {
  public static async updateGame(params, request, response) {
    if (request.method() === 'PUT') {
      await request.validate(GameCreateAndPutValidator)
    } else {
      await request.validate({
        schema: new PatchGameValidator().getPatchValidation(request.except(['id', 'secureId'])),
      })
    }
    try {
      let game = await Game.findByOrFail('secure_id', params.id)
      let gameAltered = await game.merge(request.except(['id', 'secureId'])).save()
      return gameAltered
    } catch (erro) {
      return response.badRequest({ mensage: 'Not found game' })
    }
  }

  public static async createdGame(request) {
    await request.validate(GameCreateAndPutValidator)
    let game = request.only(['typeGame', 'description', 'range', 'price', 'maxNumber', 'color'])
    return await Game.create(game)
  }

  public static async find(params, response) {
    try {
      return await Game.findByOrFail('secure_id', params.id)
    } catch (erro) {
      return response.badRequest({ mensage: 'Not found game' })
    }
  }

  public static async delete(params, response) {
    try {
      let game = await Game.findByOrFail('secure_id', params.id)
      await game.delete()
    } catch (erro) {
      return response.badRequest({ mensage: 'Not found game' })
    }
  }
}
