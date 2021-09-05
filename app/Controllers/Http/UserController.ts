import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import UserSchema from '../../Validation/UserSchema'

export default class UserController {
  public async findAll(ctx: HttpContextContract) {
    const allUsers = await User.query().withCount('repositories')

    const response = allUsers.map((item) => {
      return {
        ...item.$attributes,
        countRepositories: item.$extras.repositories_count,
      }
    })

    return ctx.response.ok({
      data: response,
      count: allUsers.length,
      success: true,
    })
  }

  public async findById(ctx: HttpContextContract) {
    const idUser = ctx.params.id
    const user = await User.query().where('id', idUser).withCount('repositories')

    const response = user.map((item) => {
      return {
        ...item.$attributes,
        countRepositories: item.$extras.repositories_count,
      }
    })

    return ctx.response.ok({ data: response, success: true, message: 'user found successfully' })
  }

  public async create(ctx: HttpContextContract) {
    try {
      const payload = await ctx.request.validate(UserSchema)
      const user = await User.create({
        name: payload.name,
        email: payload.email,
        location: payload.location,
        avatar: payload.avatar,
        username: payload.username,
        bio: payload.bio,
      })

      return ctx.response.created({
        data: user,
        success: true,
        message: 'user created successfully',
      })
    } catch (error) {
      return ctx.response.badRequest({ success: false, message: error.messages })
    }
  }

  public async update(ctx: HttpContextContract) {
    const idUser = ctx.params.id
    let user = await User.findBy('id', idUser)
    if (user) {
      try {
        const payload = await ctx.request.validate(UserSchema)
        user.name = payload.name
        user.email = payload.email
        user.location = payload.location
        user.avatar = payload.avatar
        user.username = payload.username
        user.bio = payload.bio
        user = await user.save()
        return ctx.response.ok({ data: user, success: true, message: 'user updated successfully' })
      } catch (error) {
        return ctx.response.badRequest({ success: false, message: error.messages })
      }
    }
    return ctx.response.notFound({ success: false, message: 'user not found' })
  }

  public async delete(ctx: HttpContextContract) {
    const idUser = ctx.params.id
    let user = await User.findBy('id', idUser)
    if (user) {
      await user.delete()
      return ctx.response.ok({ success: true, message: 'user deleted successfully' })
    }
    return ctx.response.notFound({ success: false, message: 'user not found' })
  }
}
