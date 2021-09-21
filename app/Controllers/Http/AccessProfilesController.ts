import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AccessProfile from 'App/Models/AccessProfile'

export default class AccessProfilesController {
  //Realiza uma busca por tudo
  public async index({}: HttpContextContract) {
    return await AccessProfile.all()
  }
  //Aqui irá fazer um registro
  public async store({ request }: HttpContextContract) {
    await request.validate({ schema: AccessProfile.getRulesValidation() })
    let access = request.only(['level'])
    return await AccessProfile.create(access)
  }
  //Aqui faz uma uma consulta
  public async show({ params, response }: HttpContextContract) {
    try {
      let access = await AccessProfile.findByOrFail('id', params.id)
      return access
    } catch (erro) {
      return response.badRequest({ mensage: 'Not found access level' })
    }
  }
  //Aqui busca pelo id
  public async update({ request, params, response }: HttpContextContract) {
    try {
      let access = await AccessProfile.findByOrFail('id', params.id)
      await access.merge(request.all()).save()
      return access
    } catch (erro) {
      return response.badRequest({ mensage: 'Not found access level' })
    }
  }
  //Aqui apaga pelo id
  public async destroy({ params, response }: HttpContextContract) {
    try {
      let access = await AccessProfile.findByOrFail('id', params.id)
      await access.delete()
    } catch (erro) {
      return response.badRequest({ mensage: 'Not found access level' })
    }
  }
}
