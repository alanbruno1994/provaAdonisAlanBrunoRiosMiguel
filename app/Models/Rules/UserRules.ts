import { schema, rules } from '@ioc:Adonis/Core/Validator'
//Aqui fica as regras de validação relacionas aos usuários
export default class UserRules {
  public static email() {
    return schema.string({}, [rules.email(), rules.unique({ table: 'users', column: 'email' })])
  }

  public static emailLogin() {
    return schema.string({}, [rules.email()])
  }

  public static password() {
    return schema.string({}, [rules.confirmed(), rules.minLength(6), rules.maxLength(15)])
  }

  public static passwordLogin() {
    return schema.string({}, [rules.minLength(6), rules.maxLength(15)])
  }

  public static name() {
    return schema.string({}, [rules.minLength(10)])
  }

  public static accessProfileId() {
    return schema.number([rules.exists({ table: 'access_profiles', column: 'id' })])
  }

  public static chooseRule(choose) {
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
}
