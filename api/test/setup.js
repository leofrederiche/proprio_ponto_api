const Entry = require("../models/entry")
const User = require("../models/user")

const DeleteAllData = async () => {
    await Entry.deleteMany()
    await User.deleteMany()
}

module.exports = {
    DeleteAllData
}