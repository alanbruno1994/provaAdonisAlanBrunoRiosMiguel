import { BaseMailer, MessageContract } from '@ioc:Adonis/Addons/Mail'

export default class EmailTemplate extends BaseMailer {
  private email
  private fromEmail
  private nameFrom
  private subject
  private temmplateHTML
  private variables

  constructor(email, fromEmail, nameFrom, subject, templateHTMl, variables = {}) {
    super()
    this.email = email
    this.fromEmail = fromEmail
    this.nameFrom = nameFrom
    this.subject = subject
    this.temmplateHTML = templateHTMl
    this.variables = variables
  }

  public prepare(message: MessageContract) {
    message
      .to(this.email) //aqui para que receberá o e-mail
      .from(this.fromEmail, this.nameFrom) //Aqui seria de quem estou enviado o e-mail
      .subject(this.subject) //Aqui seria o assunto do e-mail
      .htmlView(this.temmplateHTML, this.variables)
  }
}
