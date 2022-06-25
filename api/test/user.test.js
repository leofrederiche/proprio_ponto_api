const request = require('supertest')
const app = require('../../config/express')
const { faker } = require('@faker-js/faker')
const { DeleteAllData } = require("./setup")
const User = require("../models/user")
const { DeleteUser } = require("../helpers/user_helper")

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

describe('User Tests', () => {
    beforeAll( async () => {
        await PreviousData()
    })

    afterAll( async () => {
        await DeleteUser(state.user._id)
    })

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
                DeleteUser(res.body._id)
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

})