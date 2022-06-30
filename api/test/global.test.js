const HelperTest = require("./tests/helper")
const ServerTest = require("./tests/server")
const EntryTest = require("./tests/entry")
const UserTest = require("./tests/user")

const TestSetup = require("./setup")
const mongoose = require("../database/config")

describe("Global Test",  () => {
    afterAll( async () => {
        await TestSetup.DeleteAllData()
        await mongoose.disconnect()
    })

    HelperTest()
    ServerTest()
    UserTest()
    EntryTest()
})