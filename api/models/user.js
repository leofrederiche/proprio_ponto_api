const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "NOME - Por favor, informe seu nome"]
    }, 
    email: {
        type: String,
        unique: [true, "E-MAIL - Este e-mail já está em uso"],
        required: [true, "E-MAIL - Informe um e-mail"],
        lowercase: true
    },
    password: {
        type: String,
        required: [true, "SENHA - Precisamos de uma senha para continuar"],
        select: false
    },
    journey: {
        type: String,
        required: [true, "JORNADA - Informe o tempo da sua jornada de trabalho Diaria"]
    },
    balance: {
        type: String,
        required: [true, "BALANÇO - Precisamos de um saldo inicial do Banco de Horas"],
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