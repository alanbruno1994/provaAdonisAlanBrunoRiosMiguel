import Game from 'App/Models/Game'
import Bet from 'App/Models/Bet'
import CreateBetAndPutValidator from 'App/Validators/Bets/CreateBetAndPutValidator'
import Queue from 'App/lib/Queue'
import BetPachValidator from 'App/Validators/Bets/BetPachValidator'

interface BetGame {
  numberChoose: string
  gameId: number
}
export default class BetService {
  public static async updateBet(request, params, response) {
    if (request.method() === 'PUT') {
      await request.validate(CreateBetAndPutValidator)
    } else {
      await request.validate(BetPachValidator)
    }
    try {
      let bet = await Bet.findByOrFail('secure_id', params.id)
      let alteredBet = await bet.merge(request.except(['secureId', 'id'])).save()
      return alteredBet
    } catch (erro) {
      return response.badRequest({ mensage: 'Not found bet' })
    }
  }

  public static async findDataAll(params, response) {
    try {
      let bet = await Bet.findByOrFail('secure_id', params.id)
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
    await request.validate(CreateBetAndPutValidator)
    let bets: BetGame[] = request.input('bets')
    await this.forBets(bets, auth)
    return await Bet.query().where('user_id', auth.user.id)
  }

  private static async forBets(bets, auth) {
    let betsEmail: any = []
    let sum = 0
    await bets.forEach(async (value: BetGame, id, array) => {
      let game = await Game.findBy('id', value.gameId)
      let gameCreated = await Bet.create({
        userId: auth.user?.id,
        priceGame: game?.price,
        numberChoose: value.numberChoose,
        gameId: game?.id,
      })
      let { numberChoose, priceGame } = gameCreated
      sum += priceGame
      betsEmail.push({
        gameChoose: game?.typeGame,
        number_choose: numberChoose,
        price_game: priceGame,
      })
      if (id + 1 === array.length) {
        this.sendMailBetCreated(betsEmail, auth.user.email, sum)
      }
    })
  }

  private static sendMailBetCreated(betsEmail, email, sum) {
    Queue.RegisterBet.add({
      email,
      subject: 'You have just bet on the greatest betting system!',
      template: 'email/new_bets',
      bets: betsEmail,
      sum,
    })
  }

  public static async find(params, response) {
    try {
      return await Bet.findByOrFail('secure_id', params.id)
    } catch (erro) {
      return response.badRequest({ mensage: 'Not found bet' })
    }
  }

  public static async delete(params, response) {
    try {
      let bet = await Bet.findByOrFail('secure_id', params.id)
      await bet.delete()
    } catch (erro) {
      return response.badRequest({ mensage: 'Not found bet' })
    }
  }
}
