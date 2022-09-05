const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Por favor, informe seu nome"]
    }, 
    email: {
        type: String,
        unique: [true, "Este e-mail já está em uso"],
        required: [true, "Informe um e-mail"],
        lowercase: true
    },
    password: {
        type: String,
        required: [true, "Precisamos de uma senha para continuar"],
        select: true
    },
    journey: {
        type: String,
        required: [true, "Informe o tempo da sua jornada de trabalho Diaria"]
    },
    tolerance: {
        type: String,
        default: "00:00"
    },
    balance: {
        type: String,
        required: [true, "Precisamos de um saldo inicial do Banco de Horas"],
        default: '00:00'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    entries: [{
        type: mongoose.Schema.Types.ObjectId, ref: "Entry"
    }]
})

const User = mongoose.model('User', UserSchema)

module.exports = User