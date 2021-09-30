import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class PatchUserValidator {
  constructor() {}
  public email() {
    return schema.string({}, [rules.email(), rules.unique({ table: 'users', column: 'email' })])
  }

  public password() {
    return schema.string({}, [rules.confirmed(), rules.minLength(6), rules.maxLength(15)])
  }

  public name() {
    return schema.string({}, [rules.minLength(10)])
  }

  public accessProfileId() {
    return schema.number([rules.exists({ table: 'access_profiles', column: 'id' })])
  }

  public chooseRule(choose) {
    switch (choose) {
      case 'email':
        return this.email()
      case 'name':
        return this.name()
      case 'password':
        return this.password()
      case 'accessProfileId':
        return this.accessProfileId()
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
