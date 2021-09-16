import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import AccessProfileRules from './Rules/AccessProfileRules'
export default class AccessProfile extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public level: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  public static getRulesValidation() {
    return schema.create({
      level: AccessProfileRules.level(),
    })
  }
}
