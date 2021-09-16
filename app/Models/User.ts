import { DateTime } from 'luxon'
import {
  afterCreate,
  BaseModel,
  beforeSave,
  BelongsTo,
  belongsTo,
  column,
  HasOne,
  hasOne,
} from '@ioc:Adonis/Lucid/Orm'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Hash from '@ioc:Adonis/Core/Hash'
import AccessProfile from './AccessProfile'
export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

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
      email: schema.string({}, [
        rules.email(),
        rules.required(),
        rules.unique({ table: 'users', column: 'email' }),
      ]),
      password: schema.string({}, [rules.confirmed(), rules.minLength(6), rules.maxLength(15)]),
      name: schema.string({}, [rules.required(), rules.minLength(10)]),
      accessProfileId: schema.number([rules.required()]),
    })
  }

  public static getRulesValidationLogin() {
    return schema.create({
      email: schema.string({}, [rules.email(), rules.required()]),
      password: schema.string({}, [rules.minLength(6), rules.maxLength(15)]),
    })
  }

  public static getRulesValidationRecoverPassword() {
    return schema.create({
      email: schema.string({}, [rules.email(), rules.required()]),
    })
  }

  public static getRulesValidationAlterPassword() {
    return schema.create({
      password: schema.string({}, [rules.minLength(6), rules.maxLength(15)]),
    })
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
  }

  @belongsTo(() => AccessProfile)
  public access: BelongsTo<typeof AccessProfile>
}
