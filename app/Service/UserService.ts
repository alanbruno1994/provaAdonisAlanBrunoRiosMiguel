import User from 'App/Models/User'

export default class UserService {
  public static async updateUser(request, response, user: User) {
    if (request.method() === 'PUT') {
      if (request.input('email') === user.email) {
        await request.validate({
          schema: User.getRulesValidationExceptEmail(),
        })
      } else {
        await request.validate({ schema: User.getRulesValidation() })
      }
    } else {
      if (request.input('email') === user.email) {
        await request.validate({
          schema: User.getPatchValidation(
            request.except(['email', 'secureId', 'password_confirmation', 'id'])
          ),
        })
      } else {
        await request.validate({
          schema: User.getPatchValidation(
            request.except(['password_confirmation', 'secureId', 'id'])
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
      return response.badRequest({ mensage: erro })
    }
  }

  public static async findUserAllData(secureId) {
    return await User.query()
      .select('id', 'name', 'email', 'created_at', 'updated_at', 'access_profile_id', 'secure_id')
      .where('secure_id', secureId)
      .preload('access')
      .preload('bets')
      .first()
  }

  public static async findUser(secureId) {
    return await User.query()
      .where('secure_id', secureId)
      .select('secure_id', 'email', 'name', 'created_at', 'updated_at', 'access_profile_id')
      .first()
  }

  public static async registerUser(request) {
    await request.validate({ schema: User.getRulesValidation() })
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
}
