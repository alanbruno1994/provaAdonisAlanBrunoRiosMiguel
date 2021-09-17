import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  hasMany,
  HasMany,
  BelongsTo,
  belongsTo,
  beforeCreate,
} from '@ioc:Adonis/Lucid/Orm'
import { schema } from '@ioc:Adonis/Core/Validator'
import BetRules from './Rules/BetRules'
import User from './User'
import Game from './Game'
import { v4 as uuidv4 } from 'uuid'
export default class Bet extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public secureId: string

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

  //Aqui usamos um hoook, de modo que antes de criar o usuario, ou persirtir ele no banco de dados sera chamado esse metodo o qual
  //vai criar o id unico para ser armazena no banco de dados
  @beforeCreate()
  public static assignUuid(bet: Bet) {
    bet.secureId = '' + uuidv4() //aqui cria o id unico
  }
}
