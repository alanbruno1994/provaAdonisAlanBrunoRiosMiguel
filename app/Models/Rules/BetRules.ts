import { schema } from '@ioc:Adonis/Core/Validator'
//Aqui fica as regras de validação relacionadas a aposta
export default class BetRules {
  public static numberChoose() {
    return schema.string({}, [])
  }

  public static gameId() {
    return schema.number([])
  }

  public static priceGame() {
    return schema.number([])
  }

  public static chooseRule(choose) {
    switch (choose) {
      case 'numberChoose':
        return this.numberChoose()
      case 'gameId':
        return this.gameId()
      case 'priceGame':
        return this.priceGame()
    }
  }
}
