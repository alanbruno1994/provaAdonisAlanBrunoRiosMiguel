import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class BetPachValidator {
  constructor() {}

  public numberChoose() {
    return schema.string({}, [])
  }

  public gameId() {
    return schema.number([rules.exists({ table: 'games', column: 'id' })])
  }

  public chooseRule(choose) {
    switch (choose) {
      case 'numberChoose':
        return this.numberChoose()
      case 'gameId':
        return this.gameId()
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
