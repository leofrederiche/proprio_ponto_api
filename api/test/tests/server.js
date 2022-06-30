const request = require('supertest')
const app = require('../../../config/express')

const ServerTest = () => {
    test('Returning 200 to "/"', async () => {
        return request(app)
            .get("/")
            .then(res => {
                expect(res.statusCode).toBe(200)
                expect(res.body).toEqual({ message: 'Hello World' })
            })
    })
}

module.exports = ServerTest