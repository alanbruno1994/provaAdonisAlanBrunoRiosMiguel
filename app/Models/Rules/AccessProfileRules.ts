import { schema } from '@ioc:Adonis/Core/Validator'
export default class AccessProfileRules {
  public static level() {
    return schema.number([])
  }

  public static chooseRule(choose) {
    switch (choose) {
      case 'level':
        return this.level()
    }
  }
}
