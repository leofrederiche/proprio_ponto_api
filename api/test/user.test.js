const request = require('supertest')
const app = require('../../config/express')
const { faker } = require('@faker-js/faker')
const { DeleteAllData } = require("./setup")
const User = require("../models/user")
const { DeleteUser } = require("../helpers/user_helper")

const state = {
    user: null
}

const CreateUserRoute = async (user) => {
    const res = await request(app)
        .post('/user/register')
        .send(user)

    return res
}

const UpdateUserRoute = async (user) => {
    const res = await request(app)
        .put('/user/update')
        .send(user)

    return res
}

const PreviousData = async () =>{
    const newUser = new User({
        name: faker.name.firstName(),
        email: faker.internet.email() + Date.now(),
        password: '123456',
        journey: "08:00"
    })

    await newUser.save()
    .then( createdUser => {
        state.user = createdUser.toJSON()
    })
    .catch( error => {
        console.error("user.test.js - CreateFixedUser --> ", error)
        state.user = { msg: "Erro ao criar usuario", error }
    })
}

describe('User Tests', () => {
    beforeAll( async () => {
        await PreviousData()
    })

    afterAll( async () => {
        await DeleteUser(state.user._id)
    })

    it('Create User', async () => {
        const newUser = {
            name: faker.name.firstName(),
            email: faker.internet.email(),
            password: '123456',
            journey: "08:00"
        }

        const res = await CreateUserRoute(newUser)

        expect(res.statusCode).toBe(201)

        await DeleteUser(res.body._id)
    })

    it('Create invalid User', async () => {
        const newUser = {
            name: faker.name.firstName(),
            email: faker.internet.email()
        }

        const res = await CreateUserRoute(newUser)
        if (res.statusCode != 400) {
            console.error('user.test.js - Create invalid User ===> ', resUpdate.body)
        }

        expect(res.statusCode).toBe(400)
    })

    it('Update User', async () => {
        var currentUser = state.user
        currentUser.journey = '09:00'

        const resUpdate = await UpdateUserRoute(currentUser)

        if (resUpdate.statusCode != 200) {
            console.error('Update User ===> ', resUpdate.body)
        }

        expect(resUpdate.statusCode).toBe(200)
        expect(resUpdate.body.journey).toBe(currentUser.journey)
    })

})