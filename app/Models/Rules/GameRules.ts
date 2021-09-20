import { schema, rules } from '@ioc:Adonis/Core/Validator'
//Aqui fica as regras de validação ligadas ao jogo
export default class GamesRules {
  public static typeGame() {
    return schema.string({}, [])
  }

  public static description() {
    return schema.string({}, [])
  }

  public static color() {
    return schema.string({}, [rules.minLength(3)])
  }

  public static maxNumber() {
    return schema.number([rules.unsigned()])
  }

  public static range() {
    return schema.number([rules.unsigned()])
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
