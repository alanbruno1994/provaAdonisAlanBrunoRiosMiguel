import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AccessProfile from 'App/Models/AccessProfile'

export default class AccessProfilesController {
  public async index({}: HttpContextContract) {
    return await AccessProfile.all()
  }

  public async store({ request }: HttpContextContract) {
    await request.validate({ schema: AccessProfile.getRulesValidation() })
    let access = request.only(['level'])
    return await AccessProfile.create(access)
  }

  public async show({ params, response }: HttpContextContract) {
    try {
      let access = await AccessProfile.findByOrFail('id', params.id)
      return access
    } catch (erro) {
      return response.badRequest({ mensage: 'Not found access level' })
    }
  }

  public async update({ request, params, response }: HttpContextContract) {
    try {
      let access = await AccessProfile.findByOrFail('id', params.id)
      await access.merge(request.all()).save()
      return access
    } catch (erro) {
      return response.badRequest({ mensage: 'Not found access level' })
    }
  }

  public async destroy({ params, response }: HttpContextContract) {
    try {
      let access = await AccessProfile.findByOrFail('id', params.id)
      await access.delete()
    } catch (erro) {
      return response.badRequest({ mensage: 'Not found access level' })
    }
  }
}
