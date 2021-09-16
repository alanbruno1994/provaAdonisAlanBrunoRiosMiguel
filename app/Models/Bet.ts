import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, HasMany, BelongsTo, belongsTo } from '@ioc:Adonis/Lucid/Orm'
import { schema } from '@ioc:Adonis/Core/Validator'
import BetRules from './Rules/BetRules'
import User from './User'
import Game from './Game'
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
}
