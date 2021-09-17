import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column } from '@ioc:Adonis/Lucid/Orm'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import GamesRules from './Rules/GameRules'
import { v4 as uuidv4 } from 'uuid'
export default class Game extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public secureId: string

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

  //Aqui usamos um hoook, de modo que antes de criar o usuario, ou persirtir ele no banco de dados sera chamado esse metodo o qual
  //vai criar o id unico para ser armazena no banco de dados
  @beforeCreate()
  public static assignUuid(game: Game) {
    game.secureId = '' + uuidv4() //aqui cria o id unico
  }
}
