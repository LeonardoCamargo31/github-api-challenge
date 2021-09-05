import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import Repository from 'App/Models/Repository'
import Star from 'App/Models/Star'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: String

  @column()
  public email: String

  @column()
  public avatar: string

  @column()
  public location: string

  @column()
  public username: string

  @column()
  public bio: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => Repository)
  public repositories: HasMany<typeof Repository>

  @hasMany(() => Star)
  public stars: HasMany<typeof Star>
}
