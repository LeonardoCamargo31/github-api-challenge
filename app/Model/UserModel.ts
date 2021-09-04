import Database from '@ioc:Adonis/Lucid/Database'

export interface User {
  name: string
  email: string
  location: string
  avatar: string
  username: string
  bio: string
}

export class UserModel {
  public async findAll(): Promise<User[]> {
    return await Database.from('user').select('*')
  }

  public async create(user: User): Promise<User> {
    const data = await Database.table('user')
      .insert(user)
      .returning(['name', 'email', 'location', 'avatar', 'username', 'bio'])

    const userData = {
      name: data[0].name,
      email: data[0].email,
      location: data[0].location,
      avatar: data[0].avatar,
      username: data[0].username,
      bio: data[0].bio,
    }
    return userData
  }
}
