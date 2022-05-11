const User = require('../models/user')

const GetUser = async (user_id) => {
    const user = await User.findOne({ _id: user_id }).exec()

    if (!user) {
        return null
    }

    return user
}

const DeleteUser = async (user_id) => {
    const result = await User.deleteOne({ _id: user_id }).exec()

    return result
}

module.exports = { GetUser, DeleteUser }