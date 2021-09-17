import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import { afterFetch } from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/User'

export default class UsersController {
  public async index({}: HttpContextContract) {
    return await User.query().select('secure_id', 'email', 'name', 'created_at', 'updated_at')
  }

  public async store({ request }: HttpContextContract) {
    await request.validate({ schema: User.getRulesValidation() })
    let user = request.only(['accessProfileId', 'password', 'name', 'email'])
    let { email, createdAt, name, updatedAt } = await User.create(user)
    return { email, createdAt, name, updatedAt }
  }

  public async show({ params, response }: HttpContextContract) {
    try {
      let user = await User.query()
        .where('secure_id', params.id)
        .select('secure_id', 'email', 'name', 'created_at', 'updated_at')
        .first()
      if (user === null) {
        throw new Error()
      }
      return user
    } catch (erro) {
      return response.badRequest({ mensage: 'Not found user' })
    }
  }

  public async update({ request, params, response }: HttpContextContract) {
    try {
      let user = await User.findByOrFail('secure_id', params.id)
      let userAltered = await user.merge(request.all()).save()
      let { email, createdAt, name, updatedAt } = userAltered
      return { email, createdAt, name, updatedAt }
    } catch (erro) {
      return response.badRequest({ mensage: 'Not found user' })
    }
  }

  public async destroy({ params, response }: HttpContextContract) {
    try {
      let user = await User.findByOrFail('secure_id', params.id)
      await user.delete()
    } catch (erro) {
      return response.badRequest({ mensage: 'Not found user' })
    }
  }
}
