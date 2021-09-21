import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import UserService from 'App/Service/UserService'

export default class UsersController {
  //Aqui busca todos os usuários
  public async index({}: HttpContextContract) {
    return UserService.findAll()
  }
  //Aqui busca todos os usuários e os dados relacionados
  public async indexAll({}: HttpContextContract) {
    return UserService.findAllandAllData()
  }
  //Aqui registra um usuário
  public async store({ request }: HttpContextContract) {
    return UserService.registerUser(request)
  }
  //Aqui busca um usuário pelo secure_id
  public async show({ params, response }: HttpContextContract) {
    try {
      let user = UserService.findUser(params.id)
      if (user === null) {
        throw new Error()
      }
      return user
    } catch (erro) {
      return response.badRequest({ mensage: 'Not found user' })
    }
  }
  //Aqui busca um usuário pelo secure_id e os dados relacionados a estes
  public async showAll({ params, response }: HttpContextContract) {
    try {
      let user = UserService.findUserAllData(params.id)
      if (user === null) {
        throw new Error()
      }
      return user
    } catch (erro) {
      return response.badRequest({ mensage: 'Not found user' })
    }
  }
  //Aqui atualza um usuário, mas para isso precisa passar o secure_id
  public async update({ request, params, response }: HttpContextContract) {
    let user = await User.query().where('secure_id', params.id).first()
    try {
      if (user === null) throw new Error()
    } catch (erro) {
      return response.badRequest({ mensage: 'User Not found' })
    }
    return UserService.updateUser(request, response, user)
  }
  //Aqui apaga um usuário a parti de um secure_id
  public async destroy({ params, response }: HttpContextContract) {
    try {
      let user = await User.findByOrFail('secure_id', params.id)
      await user.delete()
    } catch (erro) {
      return response.badRequest({ mensage: erro })
    }
  }
}
