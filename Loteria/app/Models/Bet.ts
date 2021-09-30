import { DateTime } from 'luxon'
import { BaseModel, column, BelongsTo, belongsTo, beforeCreate } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Game from './Game'
import { v4 as uuidv4 } from 'uuid'
import CamelCaseNamingStrategy from 'App/lib/CamelCaseNamingStrategy'

//Aqui representa a entidade que está ligada a tabela bets
export default class Bet extends BaseModel {
  public static namingStrategy = new CamelCaseNamingStrategy()
  @column({ isPrimary: true })
  public id: number

  @column()
  public secureId: uuidv4

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
