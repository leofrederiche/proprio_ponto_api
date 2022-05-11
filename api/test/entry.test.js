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

    await Promise.all([user.save(), entry1.save(), entry2.save(), entry3.save()])
    .then( result => {
        state.user = user.toJSON()
    })
    .catch( error => {
        console.error("entry.test.js - PreviousData ==> ", error)
        state.user = null
    })
}

const CreateEntryRoute = async (entry) => {
    const res = await request(app)
        .post('/entry/register')
        .send(entry)

    return res
}

describe('Entries Tests', () => {
    beforeAll( async () => {
        await PreviousData()
    })
    
    afterAll( async() => {
        await DeleteEntries(state.user._id)
        await DeleteUser(state.user._id)
    })
    
    it('Create sample Entry Point', async () => {
        var date = new Date('03-16-2022')

        const newEntry = {
            user: state.user._id,
            day: date,
            in1: '08:00'
        }

        const res = await CreateEntryRoute(newEntry)

        if (res.statusCode != 201) {
            let test = await User.findOne({ _id: state.user._id }).exec()
            console.warn('Create sample Entry Point: ', test)
            console.error('entry.test.js -> Create sample Entry Point => ', res.body)
        }

        expect(res.statusCode).toBe(201)
    })

    it('Create Invalid Entry Point', async () => {
        var date = new Date('03-16-2022')

        const newEntry = {
            user: null,
            day: date,
            in1: '08:00'
        }

        const res = await CreateEntryRoute(newEntry)

        if (res.statusCode != 400) {
            console.error('entry.test.js -> Create Invalid Entry Point=> ', res.body)
        }

        expect(res.statusCode).toBe(400)
    })

    it('Update Entry Point', async() => {
        var date = new Date('03-16-2022')

        const newEntry = {
            user: state.user._id,
            day: date,
            in1: '08:00'
        }

        const resEntry = await CreateEntryRoute(newEntry)

        if (resEntry.statusCode != 201) {
            console.error('entry.test.js -> Update Entry Point => ', resEntry.body)
        }

        expect(resEntry.statusCode).toBe(201)

        // Updating entry
        const updatedEntry = Object.assign({}, resEntry.body)
        updatedEntry.out1 = '12:00'

        const res = await request(app)
            .put('/entry/update')
            .send(updatedEntry)

            if (res.statusCode != 200 || res.body.out1 != "12:00") {
                console.error('entry.test.js -> Update Entry Point => ', res.body)
            }

        expect(res.statusCode).toBe(200)
        expect(res.body.out1).toBe('12:00')
    })

    it('Get Entries by user', async() => {
        // Get entries
        const filter = {
            user_id: state.user._id
        }

        // Waiting to save all data
        const entries = await request(app)
            .get('/entry')
            .send(filter)

        
        if (entries.body.totalBalance != '00:15') {
            console.error('entry.test.js -> Get Entries by user => ', entries.body)
        }

        expect(entries.body.totalBalance).toBe('00:15')
        expect(entries.body.entries.length).toBe(5)
        expect(entries.statusCode).toBe(200)
    })
})