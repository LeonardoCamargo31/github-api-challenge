import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Repository from 'App/Models/Repository'
import User from 'App/Models/User'
import RepositorySchema from '../../Validation/RepositorySchema'

export default class RepositoryController {
  public async findAllByUsername(ctx: HttpContextContract) {
    const username = ctx.params.username
    let user = await User.findBy('username', username)
    if (user) {
      const repositories = await user.related('Repositories').query()
      if (repositories) {
        return ctx.response.ok({
          data: repositories,
          count: repositories.length,
          success: true,
        })
      }
    }
  }

  public async findBySlug(ctx: HttpContextContract) {
    const username = ctx.params.username
    const slug = ctx.params.slug
    let user = await User.findBy('username', username)
    if (user) {
      let repository = await Repository.findBy('slug', slug)
      if (repository) {
        return ctx.response.ok({ success: true, data: repository })
      }
    }
  }

  public async create(ctx: HttpContextContract) {
    const username = ctx.params.username
    let user = await User.findBy('username', username)
    if (user) {
      try {
        const payload = await ctx.request.validate(RepositorySchema)
        const repository = await Repository.create({
          userId: user.id,
          name: payload.name,
          description: payload.description,
          public: payload.public,
        })

        return ctx.response.created({
          data: repository,
          success: true,
          message: 'repository created successfully',
        })
      } catch (error) {
        return ctx.response.badRequest({ success: false, message: error.messages })
      }
    }
    return ctx.response.notFound({ success: false, message: 'user not found' })
  }

  public async update(ctx: HttpContextContract) {
    const username = ctx.params.username
    const slug = ctx.params.slug
    let user = await User.findBy('username', username)
    if (user) {
      let repository = await Repository.findBy('slug', slug)
      if (repository) {
        try {
          const payload = await ctx.request.validate(RepositorySchema)
          repository.name = payload.name
          repository.description = payload.description
          repository.public = payload.public
          repository.slug = `${username}-${payload.name}`
          repository = await repository.save()
          return ctx.response.ok({
            data: repository,
            success: true,
            message: 'repository updated successfully',
          })
        } catch (error) {
          return ctx.response.badRequest({ success: false, message: error.messages })
        }
      }
    }
    return ctx.response.notFound({ success: false, message: 'user not found' })
  }

  public async delete(ctx: HttpContextContract) {
    const username = ctx.params.username
    const slug = ctx.params.slug
    let user = await User.findBy('username', username)
    if (user) {
      let repository = await Repository.findBy('slug', slug)
      if (repository) {
        await repository.delete()
        return ctx.response.ok({ success: true, message: 'repository deleted successfully' })
      }
      return ctx.response.notFound({ success: false, message: 'repository not found' })
    }
    return ctx.response.notFound({ success: false, message: 'user not found' })
  }
}
