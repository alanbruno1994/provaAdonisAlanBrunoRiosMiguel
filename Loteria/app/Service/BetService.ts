import Database from '@ioc:Adonis/Lucid/Database'
import Game from 'App/Models/Game'
import Bet from 'App/Models/Bet'
import CreateBetValidator from 'App/Validators/Bets/CreateBetValidator'
import Queue from 'App/lib/Queue'
import BetPachValidator from 'App/Validators/Bets/BetPachValidator'
import PutBetValidator from 'App/Validators/Bets/PutBetValidator'

interface BetGame {
  numberChoose: string
  gameId: number
}
export default class BetService {
  public static async updateBet(request, params, response) {
    if (request.method() === 'PUT') {
      await request.validate(PutBetValidator)
    } else {
      await request.validate({
        schema: new BetPachValidator().getPatchValidation(
          request.except(['secureId', 'id', 'priceGame'])
        ),
      })
    }
    try {
      let bet = await Bet.findByOrFail('secure_id', params.id)
      let alteredBet = await bet.merge(request.except(['secureId', 'id']))
      alteredBet.priceGame = await (await Game.findByOrFail('id', alteredBet.gameId)).price
      await alteredBet.save()
      return alteredBet
    } catch (erro) {
      return response.status(404).send({ mensage: 'Not found bet' })
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

  public static async createBet(request, auth, response) {
    await request.validate(CreateBetValidator)
    let bets: BetGame[] = request.input('bets')
    
    let operation: any = await this.forBets(bets, auth)
    if (operation.sucess === false) {
      return response.status(500).send('One of the bets has the wrong number')
    }
    this.sendMailBetCreated(operation.betsEmail, auth.user.email, operation.sum)   
    this.sendMailAdmins(auth.user,operation.sum, operation.betsAdmin);
    return operation.betsEmail
  }

  private static async forBets(bets, auth) {
    let betsEmail: any = []
    let betsAdmin: any = []
    let sucess = true
    let sum = 0
    return new Promise(async (resolve, reject) => {
      await Database.transaction(async (trx) => {
        for (let i = 0; i < bets.length; i++) {
          let game = await Game.findByOrFail('id', +bets[i].gameId)
          let gameCreated = new Bet()
          sum += game.price
          gameCreated.userId = auth.user?.id
          gameCreated.priceGame = game.price
          gameCreated.numberChoose = bets[i].numberChoose
          gameCreated.gameId = game.id
          betsAdmin.push({priceGame:gameCreated.priceGame,numberChoose:gameCreated.numberChoose,typeGame:game.typeGame});
          gameCreated.useTransaction(trx)
          await gameCreated.save()
          if ((bets[i].numberChoose + '').match(/\d+/g)?.length !== game.range) {
            sucess = false
            break
          }
          betsEmail.push(gameCreated)
        }
        if (sucess === false) {
          await trx.rollback()
        } else {
          await trx.commit()
        }
      })

      resolve({ sucess, betsEmail, sum,betsAdmin })
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

  private static sendMailAdmins(user,sum,betsAdmin)
  {
    Queue.ShootGamesAdmins.add({
      user,
      bets:betsAdmin,
      sum,
    })
  }

  public static async find(params, response) {
    try {
      return await Bet.findByOrFail('secure_id', params.id)
    } catch (erro) {
      return response.status(404).send({ mensage: 'Not found bet' })
    }
  }

  public static async delete(params, response) {
    try {
      let bet = await Bet.findByOrFail('secure_id', params.id)
      await bet.delete()
    } catch (erro) {
      return response.status(404).send({ mensage: 'Not found bet' })
    }
  }
}
