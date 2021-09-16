import { schema, rules } from '@ioc:Adonis/Core/Validator'
export default class GamesRules {
  public static typeGame() {
    return schema.string({}, [])
  }

  public static description() {
    return schema.string({}, [])
  }

  public static color() {
    return schema.string({}, [])
  }

  public static maxNumber() {
    return schema.number([])
  }

  public static range() {
    return schema.number([])
  }

  public static price() {
    return schema.number([])
  }

  public static chooseRule(choose) {
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
}
