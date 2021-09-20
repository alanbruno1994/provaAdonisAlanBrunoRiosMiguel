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

  /**
   * WANT TO USE A DIFFERENT MAILER?
   *
   * Uncomment the following line of code to use a different
   * mailer and chain the ".options" method to pass custom
   * options to the send method
   */
  // public mailer = this.mail.use()

  /**
   * The prepare method is invoked automatically when you run
   * "NewUserEmail.send".
   *
   * Use this method to prepare the email message. The method can
   * also be async.
   */
  public prepare(message: MessageContract) {
    message
      .to(this.email) //aqui para que recebera o e-mail
      .from(this.fromEmail, this.nameFrom) //Aqui seria de quem estou enviado o e-mail
      .subject(this.subject) //Aqui seria o assunto do e-mail
      .htmlView(this.temmplateHTML, this.variables)
  }
}
