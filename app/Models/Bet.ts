import { DateTime } from 'luxon'
import { BaseModel, column, BelongsTo, belongsTo, afterCreate } from '@ioc:Adonis/Lucid/Orm'
import { schema } from '@ioc:Adonis/Core/Validator'
import BetRules from './Rules/BetRules'
import User from './User'
import Game from './Game'
import EmailTemplate from 'App/Mailers/EmailTemplate'
import Env from '@ioc:Adonis/Core/Env'
//Aqui representa a entidade que está ligada a tabela bets
export default class Bet extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @column()
  public gameId: number

  @column()
  public priceGame: number

  @column()
  public numberChoose: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  public static getRulesValidation() {
    return schema.create({
      numberChoose: BetRules.numberChoose(),
      gameId: BetRules.gameId(),
      priceGame: BetRules.priceGame(),
    })
  }

  public static getPatchValidation(inputs: object) {
    let rules = {}
    for (let value in inputs) {
      rules[value] = BetRules.chooseRule(value)
    }
    return schema.create(rules)
  }

  @belongsTo(() => User)
  public users: BelongsTo<typeof User>

  @belongsTo(() => Game)
  public games: BelongsTo<typeof Game>

  @afterCreate()
  public static async createdBet(bet: Bet) {
    await bet.load('games')
    await bet.load('users')
    await new EmailTemplate(
      bet.$preloaded.users['$attributes'].email,
      Env.get('fromEmail'),
      Env.get('nameFrom'),
      'You made a new bet!',
      'email/new_bets',
      {
        value: bet.$preloaded.games['$attributes'].price,
        game: bet.$preloaded.games['$attributes'].typeGame,
      }
    ).sendLater()
  }
}
