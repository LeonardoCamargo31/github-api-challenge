import test from 'japa'
import supertest from 'supertest'
import User from '../app/Models/User'

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

test.group('token controller - create', (group) => {
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

  test('should create new token', async (assert) => {
    const { status, body } = await supertest(BASE_URL).post('/token').send({
      username: 'unclebob',
    })

    assert.equal(status, 201)
    assert.equal(body.success, true)
    assert.exists(body.data.token)
    assert.exists(body.data.user)
    assert.equal(body.message, 'token created successfully')
  })

  test('should return user not found ', async (assert) => {
    const { status, body } = await supertest(BASE_URL).post('/token').send({
      username: 'invalid_username',
    })

    assert.equal(status, 404)
    assert.equal(body.success, false)
    assert.equal(body.message, 'user not found')
  })
})
