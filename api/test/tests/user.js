const request = require('supertest')
const app = require('../../../config/express')
const { faker } = require('@faker-js/faker')
const User = require("../../models/user")

const state = {
    user: null
}

const PreviousData = async () =>{
    const newUser = new User({
        name: faker.name.firstName(),
        email: faker.internet.email() + Date.now(),
        password: '123456',
        journey: "08:00"
    })

    return newUser.save()
        .then( res => {
            state.user = res.toJSON()
        })
        .catch( error => { throw error })
}

const UserTest = () => {
    describe('User Tests', () => {
        beforeAll( async () => {
            await PreviousData()
        })

        // afterAll( async () => {
        //     await DeleteUser(state.user._id)
        // })

        it('Create User', () => {
            const newUser = {
                name: faker.name.firstName(),
                email: faker.internet.email(),
                password: '123456',
                journey: "08:00"
            }

            return request(app)
                .post('/user/register')
                .send(newUser)
                .then( res => {
                    expect(res.statusCode).toBe(201)
                })
                .catch( error => { throw error })
        })

        it('Create invalid User', () => {
            const newUser = {
                name: faker.name.firstName(),
                email: faker.internet.email()
            }

            return request(app)
                .post('/user/register')
                .send(newUser)
                .then( res => expect(res.statusCode).toBe(400) )
                .catch( error => { throw error })
        })

        it('Update User', () => {
            var currentUser = state.user
            currentUser.journey = '09:00'

            return request(app)
                .put('/user/update')
                .send(currentUser)
                .then( res => {
                    expect(res.statusCode).toBe(200)
                    expect(res.body.journey).toBe(currentUser.journey)
                })
        })

        it("Login user", () => {
            const { email, password } = state.user

            return request(app)
                .get("/user/login")
                .send({ email, password })
                .then(res => {
                    expect(res.statusCode).toBe(200)
                    expect(res.body.email).toBe(email)
                    expect(res.body.password).toBe(password)
                })
                .catch( error => { throw error})
        })

        it("Login with wrong Password", () => {
            const email = state.user.email
            const password = "*&%@#&"

            return request(app)
                .get("/user/login")
                .send({ email, password })
                .then(res => {
                    expect(res.statusCode).toBe(401)
                })
                .catch( error => { throw error})
        })

        it("Login with wrong E-mail", () => {
            const email = state.user.email + "@"
            const password = state.user.mail

            return request(app)
                .get("/user/login")
                .send({ email, password })
                .then(res => {
                    expect(res.statusCode).toBe(401)
                })
                .catch( error => { throw error})
        })

        it("Registering Tolerance", () => {
            const user = {
                name: faker.name.firstName(),
                email: faker.internet.email() + Date.now(),
                password: '123456',
                journey: "08:00",
                tolerance: "00:15"
            }

            return request(app)
                .post("/user/register")
                .send(user)
                .then( res => {
                    expect(res.statusCode).toBe(201)
                    expect(res.body.tolerance).toBe(user.tolerance)
                })
                .catch( error => { throw error })
        })

    })
}

module.exports = UserTest