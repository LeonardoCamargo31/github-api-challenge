import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { UserModel } from '../../Model/UserModel'

export default class UserController {
  public async findAll(ctx: HttpContextContract) {
    const user = new UserModel()
    const allUsers = user.findAll()
    return allUsers
  }

  public async findById(ctx: HttpContextContract) {
    const idUser = ctx.params.id
    return [
      {
        id: 1,
        title: 'Hello world',
      },
      {
        id: 2,
        title: 'Hello universe',
      },
    ]
  }

  public async create(ctx: HttpContextContract) {
    const data = ctx.request.body()
    // validate

    const userData = {
      name: data.name,
      email: data.email,
      location: data.location,
      avatar: data.avatar,
      username: data.username,
      bio: data.bio,
    }

    const user = new UserModel()
    const newUser = user.create(userData)
    return newUser
  }
}
