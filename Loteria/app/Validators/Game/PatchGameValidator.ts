import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class PatchGameValidator {
  constructor() {}

  public typeGame() {
    return schema.string({}, [])
  }

  public description() {
    return schema.string({}, [])
  }

  public color() {
    return schema.string({}, [rules.minLength(3)])
  }

  public maxNumber() {
    return schema.number([rules.unsigned()])
  }

  public range() {
    return schema.number([rules.unsigned()])
  }

  public price() {
    return schema.number([])
  }

  public chooseRule(choose) {
    switch (choose) {
      case 'typeGame':
        return this.typeGame()
      case 'description':
        return this.description()
      case 'color':
        return this.color()
      case 'maxNumber':
        return this.maxNumber()
      case 'range':
        return this.range()
      case 'price':
        return this.price()
    }
  }

  public getPatchValidation(inputs: object) {
    let rules = {}
    for (let value in inputs) {
      rules[value] = this.chooseRule(value)
    }
    return schema.create(rules)
  }
}
