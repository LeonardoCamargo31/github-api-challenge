import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Repository from 'App/Models/Repository'
import User from 'App/Models/User'
import RepositorySchema from '../../Validation/RepositorySchema'

export default class RepositoryController {
  public async findAllByUsername(ctx: HttpContextContract) {
    const username = ctx.params.username
    let user = await User.findBy('username', username)
    if (!user) {
      return ctx.response.notFound({ success: false, message: 'user not found' })
    }

    const repositories = await user.related('repositories').query().withCount('stars')
    const response = repositories.map((item) => {
      return {
        ...item.$attributes,
        countStars: item.$extras.stars_count,
      }
    })

    return ctx.response.ok({
      data: response,
      count: repositories.length,
      success: true,
    })
  }

  public async findBySlug(ctx: HttpContextContract) {
    const slug = ctx.params.slug
    let repository = await Repository.query().where('slug', slug).withCount('stars').first()

    if (!repository) {
      return ctx.response.notFound({ success: false, message: 'repository not found' })
    }

    const response = {
      ...repository.$attributes,
      countStars: repository.$extras.stars_count,
    }

    return ctx.response.ok({
      success: true,
      message: 'repository found successfully',
      data: response,
    })
  }

  public async create(ctx: HttpContextContract) {
    const username = ctx.request.body().username
    if (!username) {
      return ctx.response.badRequest({
        success: false,
        message: 'the username is required to create a new repository',
      })
    }

    let user = await User.findBy('username', username)
    if (!user) {
      return ctx.response.notFound({ success: false, message: 'user not found' })
    }

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
      return ctx.response.badRequest({
        success: false,
        message: 'invalid data',
        errors: error.messages,
      })
    }
  }

  public async update(ctx: HttpContextContract) {
    const slug = ctx.params.slug
    const username = ctx.request.body().username
    if (!username) {
      return ctx.response.badRequest({
        success: false,
        message: 'the username is required to update repository',
      })
    }

    let user = await User.findBy('username', username)
    if (!user) {
      return ctx.response.notFound({ success: false, message: 'user not found' })
    }

    let repository = await Repository.findBy('slug', slug)
    if (!repository) {
      return ctx.response.notFound({ success: false, message: 'repository not found' })
    }

    try {
      const payload = await ctx.request.validate(RepositorySchema)
      repository.name = payload.name
      repository.description = payload.description
      repository.public = payload.public
      repository.userId = user.id
      repository = await repository.save()

      return ctx.response.ok({
        data: repository,
        success: true,
        message: 'repository updated successfully',
      })
    } catch (error) {
      return ctx.response.badRequest({
        success: false,
        message: 'invalid data',
        errors: error.messages,
      })
    }
  }

  public async delete(ctx: HttpContextContract) {
    const slug = ctx.params.slug

    let repository = await Repository.findBy('slug', slug)
    if (!repository) {
      return ctx.response.notFound({ success: false, message: 'repository not found' })
    }

    await repository.delete()
    return ctx.response.ok({ success: true, message: 'repository deleted successfully' })
  }
}
