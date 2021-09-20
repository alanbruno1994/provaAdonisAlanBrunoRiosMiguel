import { schema } from '@ioc:Adonis/Core/Validator'
//Aqui ficas as regras de validação relacionadas ao nível de acesso
export default class AccessProfileRules {
  //Aqui fica regra ligada ao nível de acesso
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
