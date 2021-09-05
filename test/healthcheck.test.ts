import test from 'japa'
import supertest from 'supertest'

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

test.group('health check', () => {
  test('[GET in "/"] should return status code 200', async (assert) => {
    const { status, body } = await supertest(BASE_URL).get('/').expect(200)
    assert.equal(status, 200)
    assert.equal(body.hello, 'world')
  })
})
