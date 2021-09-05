import test from 'japa'
import supertest from 'supertest'
import User from '../app/Models/User'
import Repository from '../app/Models/Repository'

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

test.group('repository controller - create', (group) => {
  let user
  group.beforeEach(async () => {
    user = await User.create({
      name: 'Robert C. Martin',
      email: 'unclebob@cleancoder.com',
      location: 'Gurnee, IL',
      username: 'unclebob',
      avatar: 'https://avatars.githubusercontent.com/u/36901?v=4',
      bio: 'Uncle Bob. Author of Clean Code.',
    })
  })

  group.afterEach(async () => {
    await User.query().delete()
    await Repository.query().delete()
  })

  test('should create new repository', async (assert) => {
    const { status, body } = await supertest(BASE_URL).post('/repository').send({
      username: 'unclebob',
      name: 'awesome nodejs',
      description: 'Lorem ipsum dolor sit',
      public: true,
    })

    assert.equal(status, 201)
    assert.equal(body.success, true)
    assert.equal(body.data.slug, 'awesome-nodejs')
    assert.equal(body.message, 'repository created successfully')
  })

  test('should return user not found', async (assert) => {
    const { status, body } = await supertest(BASE_URL).post('/repository').send({
      username: 'invalid_username',
      name: 'awesome nodejs',
      description: 'Lorem ipsum dolor sit',
      public: true,
    })

    assert.equal(status, 404)
    assert.equal(body.success, false)
    assert.equal(body.message, 'user not found')
  })

  test('should return bad request', async (assert) => {
    const { status, body } = await supertest(BASE_URL).post('/repository').send({
      name: 'awesome nodejs',
      description: 'Lorem ipsum dolor sit',
      public: true,
    })

    assert.equal(status, 400)
    assert.equal(body.success, false)
    assert.equal(body.message, 'the username is required to create a new repository')
  })

  test('should return bad request', async (assert) => {
    const { status, body } = await supertest(BASE_URL).post(`/repository`).send({
      description: 'Lorem ipsum dolor sit',
      public: true,
      username: user.username,
    })

    const { rule, field, message } = body.errors.errors[0]
    assert.equal(status, 400)
    assert.equal(body.success, false)
    assert.equal(rule, 'required')
    assert.equal(field, 'name')
    assert.equal(message, 'the name is required to create a new repository')
  })
})

test.group('repository controller - findAllByUsername', (group) => {
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
  })

  test('should find repository by username', async (assert) => {
    const { status, body } = await supertest(BASE_URL).get(`/repository/${user.username}`)

    assert.equal(status, 200)
    assert.equal(body.success, true)
    assert.equal(body.count, 1)
    assert.equal(body.data[0].name, repository.name)
  })

  test('should return user not found', async (assert) => {
    const { status, body } = await supertest(BASE_URL).get('/repository/0')

    assert.equal(status, 404)
    assert.equal(body.success, false)
    assert.equal(body.message, 'user not found')
  })
})

test.group('repository controller - findBySlug', (group) => {
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
  })

  test('should find repository by slug', async (assert) => {
    const { status, body } = await supertest(BASE_URL).get(
      `/repository/${user.username}/${repository.slug}`
    )

    assert.equal(status, 200)
    assert.equal(body.success, true)
    assert.equal(body.message, 'repository found successfully')
    assert.equal(body.data.name, repository.name)
    assert.equal(body.data.slug, 'awesome-nodejs')
  })

  test('should return repository not found', async (assert) => {
    const { status, body } = await supertest(BASE_URL).get(
      `/repository/${user.username}/invalid-slug`
    )

    assert.equal(status, 404)
    assert.equal(body.success, false)
    assert.equal(body.message, 'repository not found')
  })
})

test.group('repository controller - update', (group) => {
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
  })

  test('should update repository', async (assert) => {
    const { status, body } = await supertest(BASE_URL).put(`/repository/${repository.slug}`).send({
      name: 'awesome nodejs update',
      description: 'Lorem ipsum dolor sit',
      public: true,
      username: user.username,
    })

    assert.equal(status, 200)
    assert.equal(body.success, true)
    assert.equal(body.data.slug, 'awesome-nodejs-update')
    assert.equal(body.message, 'repository updated successfully')
  })

  test('should return bad request', async (assert) => {
    const { status, body } = await supertest(BASE_URL).put(`/repository/${repository.slug}`).send({
      name: 'awesome nodejs update',
      description: 'Lorem ipsum dolor sit',
      public: true,
    })

    assert.equal(status, 400)
    assert.equal(body.success, false)
    assert.equal(body.message, 'the username is required to update repository')
  })

  test('should return bad request', async (assert) => {
    const { status, body } = await supertest(BASE_URL).put(`/repository/${repository.slug}`).send({
      description: 'Lorem ipsum dolor sit',
      public: true,
      username: user.username,
    })

    const { rule, field, message } = body.errors.errors[0]
    assert.equal(status, 400)
    assert.equal(body.success, false)
    assert.equal(rule, 'required')
    assert.equal(field, 'name')
    assert.equal(message, 'the name is required to create a new repository')
  })

  test('should return user not found', async (assert) => {
    const { status, body } = await supertest(BASE_URL).put(`/repository/${repository.slug}`).send({
      name: 'awesome nodejs update',
      description: 'Lorem ipsum dolor sit',
      public: true,
      username: 'invalid_username',
    })

    assert.equal(status, 404)
    assert.equal(body.success, false)
    assert.equal(body.message, 'user not found')
  })

  test('should return repository not found', async (assert) => {
    const { status, body } = await supertest(BASE_URL).put('/repository/invalid-slug').send({
      name: 'awesome nodejs update',
      description: 'Lorem ipsum dolor sit',
      public: true,
      username: user.username,
    })

    assert.equal(status, 404)
    assert.equal(body.success, false)
    assert.equal(body.message, 'repository not found')
  })
})

test.group('repository controller - delete', (group) => {
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
  })

  test('should delete repository', async (assert) => {
    const { status, body } = await supertest(BASE_URL).delete(`/repository/${repository.slug}`)

    assert.equal(status, 200)
    assert.equal(body.success, true)
    assert.equal(body.message, 'repository deleted successfully')
  })

  test('should return repository not found ', async (assert) => {
    const { status, body } = await supertest(BASE_URL).delete('/repository/invalid-slug')

    assert.equal(status, 404)
    assert.equal(body.success, false)
    assert.equal(body.message, 'repository not found')
  })
})
