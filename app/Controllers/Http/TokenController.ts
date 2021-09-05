import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import Token from 'App/Models/Token'

export default class TokenController {
  public async create(ctx: HttpContextContract) {
    const data = ctx.request.body()
    let user = await User.findBy('username', data.username)
    if (user) {
      const token = await Token.create({
        userId: user.id,
      })

      return ctx.response.created({
        data: { token, user },
        success: true,
        message: 'token created successfully',
      })
    }
    return ctx.response.notFound({ success: false, message: 'user not found' })
  }
}
