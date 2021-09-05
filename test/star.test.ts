import test from 'japa'
import supertest from 'supertest'
import User from '../app/Models/User'
import Repository from '../app/Models/Repository'
import Star from '../app/Models/Star'

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

test.group('star controller - create', (group) => {
  let user
  let repository
  group.beforeEach(async () => {
    user = await User.create({
      name: 'Robert C. Martin',
      email: 'unclebob@cleancoder.com',
      location: 'Gurnee, IL',
      username: 'unclebob',
      avatar: 'https://avatars.githubusercontent.com/u/36901?v=4',
      bio: 'Uncle Bob. Author of Clean Code.',
    })

    repository = await Repository.create({
      userId: user.id,
      name: 'awesome nodejs',
      description: 'Lorem ipsum dolor sit',
      public: true,
    })
  })

  group.afterEach(async () => {
    await User.query().delete()
    await Repository.query().delete()
  })

  test('should add star to repository', async (assert) => {
    const { status, body } = await supertest(BASE_URL).post('/star').send({
      userId: user.id,
      repositoryId: repository.id,
    })

    assert.equal(status, 201)
    assert.equal(body.success, true)
    assert.equal(body.message, 'star added successfully')
  })

  test('should return bad request', async (assert) => {
    const { status, body } = await supertest(BASE_URL).post('/star').send({
      userId: user.id,
    })

    assert.equal(status, 400)
    assert.equal(body.success, false)
    assert.equal(body.message, 'the userId and repositoryId is required')
  })
})

test.group('star controller - delete', (group) => {
  let user
  let repository
  let star
  group.beforeEach(async () => {
    user = await User.create({
      name: 'Robert C. Martin',
      email: 'unclebob@cleancoder.com',
      location: 'Gurnee, IL',
      username: 'unclebob',
      avatar: 'https://avatars.githubusercontent.com/u/36901?v=4',
      bio: 'Uncle Bob. Author of Clean Code.',
    })

    repository = await Repository.create({
      userId: user.id,
      name: 'awesome nodejs',
      description: 'Lorem ipsum dolor sit',
      public: true,
    })

    star = await Star.create({
      userId: user.id,
      repositoryId: repository.id,
    })
  })

  group.afterEach(async () => {
    await User.query().delete()
    await Repository.query().delete()
  })

  test('should remove star from repository', async (assert) => {
    const { status, body } = await supertest(BASE_URL).delete(`/star/${star.id}`)

    assert.equal(status, 200)
    assert.equal(body.success, true)
    assert.equal(body.message, 'star removed successfully')
  })

  test('should return user not found ', async (assert) => {
    const { status, body } = await supertest(BASE_URL).delete('/star/0')

    assert.equal(status, 404)
    assert.equal(body.success, false)
    assert.equal(body.message, 'star not found')
  })
})
