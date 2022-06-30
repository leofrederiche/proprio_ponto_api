const mongoose = require('mongoose')


const EntrySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId, ref: "User",
        required: [true, "USUARIO - O usuario não foi informado. Erro do DEV"]
    },
    day: {
        type: Date,
        required: [true, "DATA - Informe um dia"]
    },
    description: {
        type: String
    },
    entries: [{
        type: String,
        required: [true, "MARCAÇÃO - Informe a primeira entrada"]
    }],
    visible: {
        type: Boolean,
        default: true,
    },
    work: {
        type: String
    },
    balance: {
        type: String
    }
})

const Entry = mongoose.model('Entry', EntrySchema)

module.exports = Entry