import Bet from 'App/Models/Bet'

export default class BetService {
  public static async updateBet(request, params, response) {
    if (request.method() === 'PUT') {
      await request.validate({
        schema: Bet.getRulesValidation(),
      })
    } else {
      await request.validate({ schema: Bet.getPatchValidation(request.except(['id'])) })
    }
    try {
      let bet = await Bet.findByOrFail('id', params.id)
      let alteredBet = await bet.merge(request.except(['id'])).save()
      return alteredBet
    } catch (erro) {
      return response.badRequest({ mensage: 'Not found bet' })
    }
  }

  public static async findDataAll(params, response) {
    try {
      let bet = await Bet.findByOrFail('id', params.id)
      await bet.load('users', (userBuider) =>
        userBuider.select('secure_id', 'email', 'name', 'created_at', 'updated_at')
      )
      await bet.load('games')
      return bet
    } catch (erro) {
      return response.badRequest({ mensage: 'Not found bet' })
    }
  }

  public static async findAllandDataAll() {
    return await Bet.query()
      .preload('users', (userQuery) => {
        userQuery.select('secure_id', 'email', 'name', 'created_at', 'updated_at')
      })
      .preload('games')
  }

  public static async findAll() {
    return await Bet.all()
  }

  public static async createBet(request, auth) {
    await request.validate({ schema: Bet.getRulesValidation() })
    let bet = request.only(['gameId', 'priceGame', 'numberChoose'])
    let { gameId, priceGame, numberChoose, games, createdAt, updatedAt } = await Bet.create({
      ...bet,
      userId: auth.user?.id,
    })
    return { gameId, priceGame, numberChoose, games, createdAt, updatedAt }
  }
}
