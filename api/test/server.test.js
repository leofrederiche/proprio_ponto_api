const request = require('supertest')
const app = require('../../config/express')

test('Returning 200 to "/"', async () => {
    const res = await request(app)
        .get('/')

    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual({ message: 'Hello World' })
})