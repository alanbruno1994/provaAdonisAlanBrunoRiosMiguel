import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
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

  public static getRulesValidation()
  {
    return schema.create({
      typeGame: schema.string({}, [       
        rules.required()              
      ]),
       description: schema.string({}, [       
        rules.required()              
      ]),
       color: schema.string({}, [       
        rules.required()              
      ]),
       maxNumber: schema.number(
        [
            rules.required()                   
        ]),
       range: schema.number(
        [
            rules.required()                   
        ]),
       price: schema.number(
        [
            rules.required()                   
        ]),
    })
  }
}
