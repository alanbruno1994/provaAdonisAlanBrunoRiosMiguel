import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
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
    return UserService.findUser(params, response)
  }
  //Aqui busca um usuário pelo secure_id e os dados relacionados a estes
  public async showAll({ params, response }: HttpContextContract) {
    return UserService.findUserAllData(params, response)
  }
  //Aqui atualza um usuário, mas para isso precisa passar o secure_id
  public async update({ request, params, response }: HttpContextContract) {
    return UserService.updateUser(request, params, response)
  }
  //Aqui apaga um usuário a parti de um secure_id
  public async destroy({ params, response }: HttpContextContract) {
    return UserService.deteleUser(params, response)
  }
}
