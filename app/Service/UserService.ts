import User from 'App/Models/User'
import CreateUserPutValidator from 'App/Validators/User/CreateUserPutValidator'
import PatchUserValidator from 'App/Validators/User/PatchUserValidator'
import PutIgnoreEmailUserValidator from 'App/Validators/User/PutIgnoreEmailUserValidator'

export default class UserService {
  public static async updateUser(request, params, response) {
    let user = await User.query().where('secure_id', params.id).first()
    try {
      if (user === null) throw new Error()
    } catch (erro) {
      return response.badRequest({ mensage: 'User Not found' })
    }

    if (request.method() === 'PUT') {
      if (request.input('email') === user.email) {
        await request.validate(PutIgnoreEmailUserValidator)
      } else {
        await request.validate(CreateUserPutValidator)
      }
    } else {
      if (request.input('email') === user.email) {
        await request.validate({
          schema: new PatchUserValidator().getPatchValidation(
            request.except(['secureId', 'password_confirmation', 'email', 'id'])
          ),
        })
      } else {
        await request.validate({
          schema: new PatchUserValidator().getPatchValidation(
            request.except(['secureId', 'password_confirmation', 'id'])
          ),
        })
      }
    }
    try {
      let userAltered = await user.merge(
        request.except(['secureId', 'password_confirmation', 'id'])
      )
      await userAltered.save()
      let { email, createdAt, name, updatedAt, accessProfileId, id, secureId } = userAltered
      return { email, createdAt, name, updatedAt, accessProfileId, id, secureId }
    } catch (erro) {
      return response.status(404).send({ mensage: 'Not found user' })
    }
  }

  public static async findUserAllData(params, response) {
    try {
      let user = await User.query()
        .select('id', 'name', 'email', 'created_at', 'updated_at', 'access_profile_id', 'secure_id')
        .where('secure_id', params.id)
        .preload('access')
        .preload('bets')
        .first()
      if (user === null) {
        throw new Error()
      }
      return user
    } catch (erro) {
      return response.status(404).send({ mensage: 'Not found user' })
    }
  }

  public static async findUser(params, response) {
    try {
      let user = await User.query()
        .where('secure_id', params.id)
        .select('secure_id', 'email', 'name', 'created_at', 'updated_at', 'access_profile_id')
        .first()
      if (user === null) {
        throw new Error()
      }
      return user
    } catch (erro) {
      return response.status(404).send({ mensage: 'Not found user' })
    }
  }

  public static async registerUser(request) {
    await request.validate(CreateUserPutValidator)
    let user = request.only(['accessProfileId', 'password', 'name', 'email'])
    let { email, createdAt, name, updatedAt, id, secureId } = await User.create(user)
    return { email, createdAt, name, updatedAt, id, secureId }
  }

  public static async findAllandAllData() {
    return await User.query()
      .select('id', 'secure_id', 'email', 'name', 'created_at', 'updated_at', 'access_profile_id')
      .preload('access')
      .preload('bets')
  }

  public static async findAll() {
    return await User.query().select(
      'secure_id',
      'email',
      'name',
      'created_at',
      'updated_at',
      'access_profile_id',
      'id'
    )
  }

  public static async deteleUser(params, response) {
    try {
      let user = await User.findByOrFail('secure_id', params.id)
      await user.delete()
    } catch (erro) {
      return response.status(404).send({ mensage: 'Not found user' })
    }
  }
}
