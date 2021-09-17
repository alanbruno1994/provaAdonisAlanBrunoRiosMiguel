import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column } from '@ioc:Adonis/Lucid/Orm'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import AccessProfileRules from './Rules/AccessProfileRules'
import { v4 as uuidv4 } from 'uuid'

export default class AccessProfile extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public secureId: string

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

  //Aqui usamos um hoook, de modo que antes de criar o usuario, ou persirtir ele no banco de dados sera chamado esse metodo o qual
  //vai criar o id unico para ser armazena no banco de dados
  @beforeCreate()
  public static assignUuid(acess: AccessProfile) {
    acess.secureId = '' + uuidv4() //aqui cria o id unico
  }
}
