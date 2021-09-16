import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
export default class Bet extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId:number;

  @column()
  public gameID:number;

  @column()
  public priceGame:number;

  @column()
  public numberChoose:string;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  public static getRulesValidation()
  {
    return schema.create({
      numberChoose: schema.string({}, [       
        rules.required()              
      ]),     
       userId: schema.number(
        [
            rules.required()                   
        ]),
       gameID: schema.number(
        [
            rules.required()                   
        ]),
       priceGame: schema.number(
        [
            rules.required()                   
        ]),
    })
  }
}
