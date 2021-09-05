import test from 'japa'
import supertest from 'supertest'
import User from '../app/Models/User'

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

test.group('user controller - create', (group) => {
  group.afterEach(async () => {
    await User.query().delete()
  })

  test('should create a new user', async (assert) => {
    const { status, body } = await supertest(BASE_URL).post('/user').send({
      name: 'Robert C. Martin',
      email: 'unclebob@cleancoder.com',
      location: 'Gurnee, IL',
      username: 'unclebob',
      avatar: 'https://avatars.githubusercontent.com/u/36901?v=4',
      bio: 'Uncle Bob. Author of Clean Code.',
    })

    assert.equal(status, 201)
    assert.equal(body.success, true)
    assert.equal(body.message, 'user created successfully')
  })

  test('should return bad request', async (assert) => {
    const { status, body } = await supertest(BASE_URL).post('/user').send({
      name: 'Robert C. Martin',
      email: 'unclebob@cleancoder.com',
      location: 'Gurnee, IL',
      avatar: 'https://avatars.githubusercontent.com/u/36901?v=4',
      bio: 'Uncle Bob. Author of Clean Code.',
    })

    const { rule, field, message } = body.errors.errors[0]
    assert.equal(status, 400)
    assert.equal(body.success, false)
    assert.equal(body.message, 'invalid data')
    assert.equal(rule, 'required')
    assert.equal(field, 'username')
    assert.equal(message, 'the username is required to create a new user')
  })
})

test.group('user controller - findById', (group) => {
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
  })

  test('should find user by id', async (assert) => {
    const { status, body } = await supertest(BASE_URL).get(`/user/${user.id}`)

    assert.equal(status, 200)
    assert.equal(body.success, true)
    assert.equal(body.message, 'user found successfully')
    assert.equal(body.data.name, user.name)
  })

  test('should return user not found', async (assert) => {
    const { status, body } = await supertest(BASE_URL).get('/user/0')

    assert.equal(status, 404)
    assert.equal(body.success, false)
    assert.equal(body.message, 'user not found')
  })
})

test.group('user controller - findAll', (group) => {
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
  })

  test('should find all users', async (assert) => {
    const { status, body } = await supertest(BASE_URL).get('/user')

    assert.equal(status, 200)
    assert.equal(body.success, true)
    assert.equal(body.count, 1)
  })
})

test.group('user controller - update', (group) => {
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
  })

  test('should update user', async (assert) => {
    const { status, body } = await supertest(BASE_URL).put(`/user/${user.id}`).send({
      name: 'Robert C. Martin',
      email: 'unclebob@cleancoder.com',
      location: 'Gurnee, IL',
      username: 'unclebob',
      avatar: 'https://avatars.githubusercontent.com/u/36901?v=4',
      bio: 'Uncle Bob. Author of Clean Code.',
    })

    assert.equal(status, 200)
    assert.equal(body.success, true)
    assert.equal(body.message, 'user updated successfully')
  })

  test('should return user not found', async (assert) => {
    const { status, body } = await supertest(BASE_URL).put('/user/0')

    assert.equal(status, 404)
    assert.equal(body.success, false)
    assert.equal(body.message, 'user not found')
  })

  test('should return bad request', async (assert) => {
    const { status, body } = await supertest(BASE_URL).put(`/user/${user.id}`).send({
      name: 'Robert C. Martin',
      email: 'unclebob@cleancoder.com',
      location: 'Gurnee, IL',
      avatar: 'https://avatars.githubusercontent.com/u/36901?v=4',
      bio: 'Uncle Bob. Author of Clean Code.',
    })

    const { rule, field, message } = body.errors.errors[0]
    assert.equal(status, 400)
    assert.equal(body.success, false)
    assert.equal(body.message, 'invalid data')
    assert.equal(rule, 'required')
    assert.equal(field, 'username')
    assert.equal(message, 'the username is required to create a new user')
  })
})

test.group('user controller - delete', (group) => {
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
  })

  test('should delete user', async (assert) => {
    const { status, body } = await supertest(BASE_URL).delete(`/user/${user.id}`)

    assert.equal(status, 200)
    assert.equal(body.success, true)
    assert.equal(body.message, 'user deleted successfully')
  })

  test('should return user not found ', async (assert) => {
    const { status, body } = await supertest(BASE_URL).delete('/user/0')

    assert.equal(status, 404)
    assert.equal(body.success, false)
    assert.equal(body.message, 'user not found')
  })
})
