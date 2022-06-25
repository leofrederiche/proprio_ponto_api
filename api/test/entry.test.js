const request = require('supertest')
const app = require('../../config/express')
const { faker } = require('@faker-js/faker')

const User = require("../models/user")
const Entry = require("../models/entry")

const { DeleteUser } = require("../helpers/user_helper")
const { DeleteEntries } = require("../helpers/entry_helper")

const state = { 
    user: null
}

const PreviousData = async () => {
    const user = new User({
        name: faker.name.firstName(),
        email: faker.internet.email() + Date.now(),
        password: '123456',
        journey: "08:00"
    })

    // Create Entries Date
    var date1 = new Date('02-10-1998')
    var date2 = new Date('07-23-2008')
    var date3 = new Date('09-06-2007')

    const entry1 = new Entry({
        user: user._id,
        day: date1,
        in1: '08:00',
        out1: '12:10',
        in2: '13:00',
        out2: '17:00',
        balance: '00:10'
    })

    const entry2 = new Entry({
        user: user._id,
        day: date2,
        in1: '08:00',
        out1: '12:00',
        in2: '13:00',
        out2: '17:20',
        balance: '00:20'
    })

    const entry3 = new Entry({
        user: user._id,
        day: date3,
        in1: '08:15',
        out1: '12:00',
        in2: '13:00',
        out2: '17:00',
        balance: '-00:15'
    })

    await user.save()
        .then( result => entry1.save())
        .then( result => entry2.save())
        .then( result => entry3.save())
        .then( result => {
            state.user = user.toJSON()
        })
        .catch( error => { 
            state.user = null
            throw error 
        })
}

describe('Entries Tests', () => {
    beforeAll( async () => {
        await PreviousData()
    })
    
    afterAll( async () => {
        await DeleteEntries(state.user._id)
        await DeleteUser(state.user._id)
    })
    
    it('Create sample Entry Point', () => {
        var date = new Date('03-16-2022')

        const newEntry = {
            user: state.user._id,
            day: date,
            in1: '08:00'
        }

        return request(app)
            .post("/entry/register")
            .send(newEntry)
            .then( res => {
                expect(res.statusCode).toBe(201)
            })
            .catch( error => { throw error } )
    })

    it('Create Invalid Entry Point', () => {
        var date = new Date('03-16-2022')

        const newEntry = {
            user: null,
            day: date,
            in1: '08:00'
        }

        return request(app)
            .post("/entry/register")
            .send(newEntry)
            .then( res => {
                expect(res.statusCode).toBe(400)
            })
            .catch( error => { throw error } )
    })

    it('Update Entry Point', () => {
        var date = new Date('03-16-2022')

        const newEntry = {
            user: state.user._id,
            day: date,
            in1: '08:00'
        }

        return request(app)
            .post("/entry/register")
            .send(newEntry)
            .then( entry => {
                let updatedEntry = { ...entry.body }
                updatedEntry.out1 = "12:00"

                return request(app)
                    .put("/entry/update")
                    .send(updatedEntry)
            })
            .then( resUpdate => {
                expect(resUpdate.statusCode).toBe(200)
                expect(resUpdate.body.out1).toBe("12:00")
            })
            .catch( error => { throw error } )
        
    })

    it('Get Entries by user', () => {
        // Get entries
        const filter = {
            user_id: state.user._id
        }

        return request(app)
            .get("/entry")
            .send(filter)
            .expect(200)
            .then( res => {
                expect(res.body.totalBalance).toBe('00:15')
                expect(res.body.entries.length).toBe(5)
            })
            .catch( error => { throw error })
    })
})