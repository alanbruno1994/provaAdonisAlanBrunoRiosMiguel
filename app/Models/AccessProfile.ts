import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuidv4 } from 'uuid'

//Aqui representa a entidade que está ligada a tabela access_profiles
export default class AccessProfile extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public level: string

  @column()
  public secureId: uuidv4

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  //Aqui usamos um hoook, de modo que antes de criar o usuario, ou persirtir ele no banco de dados sera chamado esse metodo o qual
  //vai criar o id unico para ser armazena no banco de dados
  @beforeCreate()
  public static assignUuid(access: AccessProfile) {
    access.secureId = '' + uuidv4() //aqui cria o id unico
  }
}
