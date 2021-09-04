import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class UserController {
  public async findAll(ctx: HttpContextContract) {
    const allUsers = await User.all()
    return ctx.response.status(200).send({
      data: allUsers,
      count: allUsers.length,
      success: true,
    })
  }

  public async findById(ctx: HttpContextContract) {
    const idUser = ctx.params.id
    const user = await User.findBy('id', idUser)
    return ctx.response
      .status(200)
      .send({ data: user, success: true, message: 'user found successfully' })
  }

  public async create(ctx: HttpContextContract) {
    const data = ctx.request.body()
    // validate

    const user = await User.create({
      name: data.name,
      email: data.email,
      location: data.location,
      avatar: data.avatar,
      username: data.username,
      bio: data.bio,
    })

    return ctx.response
      .status(201)
      .send({ data: user, success: true, message: 'user created successfully' })
  }

  public async update(ctx: HttpContextContract) {
    const idUser = ctx.params.id
    const data = ctx.request.body()
    // validate

    let user = await User.findBy('id', idUser)
    if (user) {
      user.name = data.name
      user.email = data.email
      user.location = data.location
      user.avatar = data.avatar
      user.username = data.username
      user.bio = data.bio
      user = await user.save()
      return ctx.response
        .status(200)
        .send({ data: user, success: true, message: 'user updated successfully' })
    }
    return ctx.response.status(404).send({ success: false, message: 'user not found' })
  }

  public async delete(ctx: HttpContextContract) {
    const idUser = ctx.params.id
    // validate

    let user = await User.findBy('id', idUser)
    if (user) {
      await user.delete()
      return ctx.response.status(200).send({ success: true, message: 'user deleted successfully' })
    }
    return ctx.response.status(404).send({ success: false, message: 'user not found' })
  }
}
