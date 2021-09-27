import { DateTime } from 'luxon'
import {
  afterCreate,
  BaseModel,
  beforeSave,
  BelongsTo,
  belongsTo,
  hasMany,
  HasMany,
  column,
  beforeCreate,
} from '@ioc:Adonis/Lucid/Orm'
import Hash from '@ioc:Adonis/Core/Hash'
import AccessProfile from './AccessProfile'
import Bet from './Bet'
import { v4 as uuidv4 } from 'uuid'
import Queue from '../lib/Queue'
import CamelCaseNamingStrategy from '../lib/CamelCaseNamingStrategy'

//Aqui representa a entidade que está ligada a tabela users
export default class User extends BaseModel {
  public static namingStrategy = new CamelCaseNamingStrategy()
  @column({ isPrimary: true })
  public id: number

  @column()
  public secureId: uuidv4

  @column()
  public email: string

  @column()
  public name: string

  @column()
  public password: string

  @column()
  public accessProfileId: number

  @column()
  public token: string | null

  @column()
  public createAtToken: Date | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  //Aqui colocamos um beforeSave usado para ser chamdo antes de salvar o usuário
  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password) //Aqui criptografa a senha
    }
  }

  @afterCreate()
  public static async protectedPassword(user: User) {
    user.password = ''
    Queue.RegisterUser.add({
      email: user.email,
      subject: 'You have registered to the betting system!',
      template: 'email/new_user',
    })
  }

  @belongsTo(() => AccessProfile)
  public access: BelongsTo<typeof AccessProfile>

  @hasMany(() => Bet)
  public bets: HasMany<typeof Bet>

  //Aqui usamos um hoook, de modo que antes de criar o usuario, ou persirtir ele no banco de dados sera chamado esse metodo o qual
  //vai criar o id unico para ser armazena no banco de dados
  @beforeCreate()
  public static assignUuid(user: User) {
    user.secureId = '' + uuidv4() //aqui cria o id unico
  }
}
