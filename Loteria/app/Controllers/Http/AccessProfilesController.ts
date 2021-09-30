import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AccessProfileService from 'App/Service/AccessProfilesService'

export default class AccessProfilesController {
  //Realiza uma busca por tudo
  public async index({}: HttpContextContract) {
    return AccessProfileService.findAllAccessProfile()
  }
  //Aqui irá fazer um registro
  public async store({ request }: HttpContextContract) {
    return AccessProfileService.createdAccessProfile(request)
  }
  //Aqui faz uma uma consulta
  public async show({ params, response }: HttpContextContract) {
    return AccessProfileService.findAccessProfile(response, params)
  }
  //Aqui busca pelo id
  public async update({ request, params, response }: HttpContextContract) {
    return AccessProfileService.updateAccessProfile(request, response, params)
  }
  //Aqui apaga pelo id
  public async destroy({ params, response }: HttpContextContract) {
    return AccessProfileService.delete(response, params)
  }
}
