import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Star from 'App/Models/Star'

export default class StarsController {
  public async add(ctx: HttpContextContract) {
    const data = ctx.request.body()

    if (data.userId && data.repositoryId) {
      const star = await Star.create({
        userId: data.userId,
        repositoryId: data.repositoryId,
      })

      return ctx.response.created({
        data: star,
        success: true,
        message: 'star added successfully',
      })
    }
    return ctx.response.notFound({ success: false, message: 'userId and repositoryId is required' })
  }

  public async delete(ctx: HttpContextContract) {
    const starId = ctx.params.id
    let star = await Star.findBy('id', starId)
    if (star) {
      await star.delete()
      return ctx.response.ok({ success: true, message: 'star deleted successfully' })
    }
    return ctx.response.notFound({ success: false, message: 'star not found' })
  }
}
