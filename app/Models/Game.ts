import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import { schema } from '@ioc:Adonis/Core/Validator'
import GamesRules from './Rules/GameRules'
//Aqui representa a entidade que está ligada a tabela games
export default class Game extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public typeGame: string

  @column()
  public description: string

  @column()
  public range: number

  @column()
  public price: number

  @column()
  public maxNumber: number

  @column()
  public color: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  public static getRulesValidation() {
    return schema.create({
      typeGame: GamesRules.typeGame(),
      description: GamesRules.description(),
      color: GamesRules.color(),
      maxNumber: GamesRules.maxNumber(),
      range: GamesRules.range(),
      price: GamesRules.price(),
    })
  }

  public static getPatchValidation(inputs: object) {
    let rules = {}
    for (let value in inputs) {
      rules[value] = GamesRules.chooseRule(value)
    }
    return schema.create(rules)
  }
}
