import AccessProfile from 'App/Models/AccessProfile'
import AccessProfileValidator from 'App/Validators/AccessProfile/AccessProfileValidator'

export default class AccessProfileService {
  public static async createdAccessProfile(request) {
    await request.validate(AccessProfileValidator)
    let access = request.only(['level'])
    return await AccessProfile.create(access)
  }

  public static async findAllAccessProfile() {
    return await AccessProfile.all()
  }

  public static async updateAccessProfile(request, response, params) {
    await request.validate(AccessProfileValidator)
    try {
      let access = await AccessProfile.findByOrFail('secure_id', params.id)
      await access.merge(request.except(['id', 'secureId'])).save()
      return access
    } catch (erro) {
      return response.badRequest({ mensage: 'Not found access level' })
    }
  }

  public static async findAccessProfile(response, params) {
    try {
      let access = await AccessProfile.findByOrFail('secure_id', params.id)
      return access
    } catch (erro) {
      return response.badRequest({ mensage: 'Not found access level' })
    }
  }

  public static async delete(response, params) {
    try {
      let access = await AccessProfile.findByOrFail('secure_id', params.id)
      await access.delete()
    } catch (erro) {
      if (erro.code === 'ER_ROW_IS_REFERENCED_2') throw erro
      return response.badRequest({ mensage: erro })
    }
  }
}
