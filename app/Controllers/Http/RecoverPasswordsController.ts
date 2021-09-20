import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import moment from 'moment'
import Env from '@ioc:Adonis/Core/Env'
import EmailTemplate from 'App/Mailers/EmailTemplate'
const crypto = require('crypto') //Isso aqui vem ja instalado se voce usar o Node aparti da versoa 14 e isso e usado na parte criptografia

export default class RecoverPasswordsController {
  public async store({ request, response }: HttpContextContract) {
    try {
      await request.validate({ schema: User.getRulesValidationRecoverPassword() })
      const email = request.input('email') //aqui usamos input quando queremos pegar um dos dados vindos da tela
      const user = await User.findByOrFail('email', email) //Aqui ira busca o usuario que tem o email que foi passado da tela, se nao encontrar sera lancado um erro
      user.token = Date.now() + crypto.randomBytes(10).toString('hex') //aqui cria um token aletorio de 10 bytes em modo hexadecimal
      user.createAtToken = new Date() //aqui passa a hora em que foi criado o token
      let url = `${request.input('redirect_url')}/fogots?token=${user.token}`
      if (user) {
        await user.save()
      }
      await new EmailTemplate(
        user.email,
        Env.get('fromEmail'),
        Env.get('nameFrom'),
        'Recovering password',
        'email/recover_password',
        {
          emailRecover: email,
          token: user.token,
          link: url,
        }
      ).sendLater()
    } catch (error) {
      //Aqui vai pegar o erro lancado caso o email nao exista
      return response //aqui usamos para responder a tela
        .status(error.status) //aqui coloca-se o status que vai ser o 404
        .send({ erro: error.message }) // aqui colocamamos a mensagem que sera enviada
    }
  }

  public async update({ request, response }: HttpContextContract) {
    try {
      await request.validate({ schema: User.getRulesValidationAlterPassword() })
      const { token, password } = request.all()
      const user = await User.findByOrFail('token', token)
      const tokenExpired = moment() //aqui pega a data atual
        .subtract('2', 'days') //subtrai a data atual em 2 dias
        .isAfter(user.createAtToken) //e ver se a data do token que esta no registro ela emaior que a data atual
      //indica que o token expiro, ou seja, foi superior a 2 dias
      if (tokenExpired) {
        return response //aqui usamos para responder a tela
          .status(401) //aqui indica que nao esta autorizado
          .send({ erro: 'Token is expired' }) // aqui colocamamos a mensagem que sera enviada
      }
      user.password = password
      user.token = null
      user.createAtToken = null
      await user.save()
    } catch (error) {
      //Aqui vai pegar o erro lancado caso o email nao exista
      return response //aqui usamos para responder a tela
        .status(error.status) //aqui coloca-se o status que vai ser o 404
        .send({ erro: error }) // aqui colocamamos a mensagem que sera enviada
    }
  }
}
