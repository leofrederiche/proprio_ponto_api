const request = require('supertest')
const app = require('../../../config/express')
const { faker } = require('@faker-js/faker')

const User = require("../../models/user")
const Entry = require("../../models/entry")

const state = { 
    user: null,
    incompleteEntry: null
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
        description: "Entry 1",
        entries: ["08:00", "12:10", "13:00", "17:00"],
        balance: '00:10'
    })

    const entry2 = new Entry({
        user: user._id,
        day: date2,
        description: "Entry 2",
        entries: ["08:00", "12:00", "13:00", "17:20"],
        balance: '00:20'
    })

    const entry3 = new Entry({
        user: user._id,
        day: date3,
        description: "Entry 3",
        entries: ["08:15", "12:00", "13:00", "17:00"],
        balance: "-00:15"
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

const EntryTest = () => {
    describe('Entries Tests', () => {
        beforeAll( async () => {
            await PreviousData()
        })
        
        it('Create sample Entry Point', () => {
            var date = new Date('03-16-2022')

            const newEntry = {
                user: state.user._id,
                day: date,
                description: "First Insert",
                entries: ["08:00", "12:00"]
            }

            return request(app)
                .post("/entry/register")
                .send(newEntry)
                .then( res => {
                    expect(res.statusCode).toBe(201)
                    expect(res.body.work).toBe("04:00")
                })
                .catch( error => { throw error } )
        })

        it('Incomplete Entries', () => {
            var date = new Date('03-17-2022')

            const newEntry = {
                user: state.user._id,
                day: date,
                description: "Incomplete Entries",
                entries: ["08:00", "12:00", "13:00"]
            }

            return request(app)
                .post("/entry/register")
                .send(newEntry)
                .then( res => {
                    state.incompleteEntry = res.body._id
                    expect(res.statusCode).toBe(201)
                    expect(res.body.work).toBe("00:00")
                })
                .catch( error => { throw error } )
        })

        it('Create Invalid Entry Point', () => {
            var date = new Date('03-16-2022')

            const newEntry = {
                user: null,
                day: date,
                description: "Withouth User",
                entries: ["08:00"]
            }

            return request(app)
                .post("/entry/register")
                .send(newEntry)
                .then( res => {
                    expect(res.statusCode).toBe(400)
                })
                .catch( error => { throw error } )
        })

        it('Create Entry withouth entries', () => {
            var date = new Date('03-16-2022')

            const newEntry = {
                user: null,
                description: "Withouth Entries",
                day: date
            }

            return request(app)
                .post("/entry/register")
                .send(newEntry)
                .then( res => {
                    expect(res.statusCode).toBe(400)
                })
                .catch( error => { throw error } )
        })

        it("Update entry (Incomplete Entries)", async () => {
            const currentEntry = await Entry.findOne({ _id: state.incompleteEntry }).exec()

            expect(currentEntry).not.toBeNull()
            expect(currentEntry).not.toBeUndefined()

            currentEntry.entries[3] = "17:40"
            currentEntry.description += " (Updated)"

            return request(app)
                .put("/entry/update")
                .send(currentEntry.toJSON())
                .then( res => {
                    expect(res.statusCode).toBe(200)
                    expect(res.body.work).toBe("08:40")
                    expect(res.body.entries[3]).toBe("17:40")
                })
                .catch(error => { throw error })
        })

        it('Get Entries by user', () => {
            // Get entries
            const filter = {
                user_id: state.user._id
            }

            return request(app)
                .post("/entry")
                .send(filter)
                .then( res => {
                    expect(res.statusCode).toBe(200)
                    expect(res.body.totalBalance).toBe('-03:05')
                    expect(res.body.entries.length).toBe(5)
                })
                .catch( error => { throw error })
        })

        it('Insert fast Entry', () => {
            const currentDate = new Date()
            const insertedTime = "03:47"

            const data = {
                user_id: state.user._id,
                day: currentDate,
                time: insertedTime
            }

            return request(app)
                .post("/entry/fast-entry")
                .send(data)
                .then( res => {
                    expect(res.statusCode).toBe(200)
                    expect(res.body.entries.length).toBe(1)
                    expect(res.body.entries[0]).toBe(insertedTime)
                })
                .catch( error => { throw error })
        })

        it('Update fast Entry', () => {
            const currentDate = new Date()
            const insertedTime = "04:47"

            const data = {
                user_id: state.user._id,
                day: currentDate,
                time: insertedTime
            }

            return request(app)
                .post("/entry/fast-entry")
                .send(data)
                .then( res => {
                    expect(res.statusCode).toBe(200)
                    expect(res.body.entries.length).toBe(2)
                    expect(res.body.entries[1]).toBe(insertedTime)
                })
                .catch( error => { throw error })
        })

        it("Delete inexistent entry", function() {
            const entry_id = state.incompleteEntry + `a`

            return request(app)
                .delete(`/entry/${entry_id}`)
                .then( res => {
                    expect(res.statusCode).toBe(400)
                })
                .catch( error => { throw error })
        })

        it("Delete valid entry", function() {
            const entry_id = state.incompleteEntry

            return request(app)
                .delete(`/entry/${entry_id}`)
                .then( res => {
                    expect(res.statusCode).toBe(204)
                })
                .catch( error => { throw error })
        })
    })
}

module.exports = EntryTest