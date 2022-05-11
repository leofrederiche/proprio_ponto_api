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
    in1: {
        type: String,
        required: [true, "IN1 - Precisamos da Hora da Primeira Entrada"]
    },
    out1: {
        type: String
    },
    in2: {
        type: String
    },
    out2: {
        type: String
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