import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class UserRules {
  public static email() {
    return schema.string({}, [rules.email(), rules.unique({ table: 'users', column: 'email' })])
  }

  public static password() {
    return schema.string({}, [rules.confirmed(), rules.minLength(6), rules.maxLength(15)])
  }

  public static name() {
    return schema.string({}, [rules.required(), rules.minLength(10)])
  }

  public static accessProfileId() {
    return schema.number([])
  }

  public static chooseRule(choose) {
    switch (choose) {
      case 'email':
        return this.email()
      case 'password':
        return this.password()
      case 'color':
        return this.name()
      case 'accessProfileId':
        return this.accessProfileId()
    }
  }
}
