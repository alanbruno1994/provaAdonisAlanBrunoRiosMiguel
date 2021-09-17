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
  afterFetch,
  afterFind,
} from '@ioc:Adonis/Lucid/Orm'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Hash from '@ioc:Adonis/Core/Hash'
import AccessProfile from './AccessProfile'
import Mail from '@ioc:Adonis/Addons/Mail'
import UserRules from './Rules/UserRules'
import Bet from './Bet'
import { v4 as uuidv4 } from 'uuid'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public secureId: string

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

  public static getRulesValidation() {
    return schema.create({
      email: UserRules.email(),
      password: UserRules.password(),
      name: UserRules.name(),
      accessProfileId: UserRules.accessProfileId(),
    })
  }

  public static getRulesValidationLogin() {
    return schema.create({
      email: UserRules.emailLogin(),
      password: UserRules.passwordLogin(),
    })
  }

  public static getRulesValidationRecoverPassword() {
    return schema.create({
      email: UserRules.emailLogin(),
    })
  }

  public static getRulesValidationAlterPassword() {
    return schema.create({
      password: UserRules.password(),
    })
  }

  public static getPatchValidation(inputs: object) {
    let rules = {}
    for (let value in inputs) {
      rules[value] = UserRules.chooseRule(value)
    }
    return schema.create(rules)
  }

  //Aqui colocamos um beforeSave usado para ser chamdo antes de salvar o usuario
  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password) //Aqui criptografa a senha
    }
  }

  @afterCreate()
  public static protectedPassword(user: User) {
    user.password = ''
    Mail.send((message) => {
      message
        .to(user.email) //aqui para que recebera o e-mail
        .from('sosvari21@gmail.com', 'Bruno da Luby') //Aqui seria de quem estou enviado o e-mail
        .subject('You have registered to the betting system!') //Aqui seria o assunto do e-mail
        .htmlView('email/new_user')
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
