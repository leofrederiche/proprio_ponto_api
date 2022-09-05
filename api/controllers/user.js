const router = require('express').Router()
const User = require('../models/user')

router.post('/register', async (req, res) => {
    const user = new User(req.body)
    var error = null

    await user.save( err => error = err)

    if (error) {
        return res.status(400).send({
            message: 'Erro ao salvar o usuario',
            request_body: req.body,
            error
        })
    } else {
        return res.status(201).send( user )
    }
})

router.post('/login', async (req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({ email, password }).exec()

    if (!user) {
        let returnMessage = {
            message: "Usuario ou senha incorretos",
            request_body: req.body,
            finded: user
        }

        return res.status(401).send( returnMessage )
    }

    Object.assign(user, req.body)

    return res.status(200).send(user)
})

router.put('/update', async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.body._id }).exec()

        if (!user) {
            let returnMessage = {
                message: 'Não foi possível localizar o usuario',
                request_body: req.body,
                finded: user
            }

            return res.status(400).send( returnMessage )
        }

        Object.assign(user, req.body)

        const savedUser = await user.save()
            .then(doc => doc)

        return res.status(200).send(savedUser)
    } catch(error) {
        return res.status(400).send({
            message: 'Erro desconhecido aconteceu',
            request_body: req.body,
            error
        })
    }
})

router.post("/exist", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email }).exec()

        if (!user) {
            let returnMessage = {
                message: 'E-mail não registrado',
                request_body: req.body,
                finded: user
            }

            return res.status(206).send( returnMessage )
        }

        return res.status(200).send(user)
    }
    catch (error) {
        return res.status(400).send({
            message: 'Erro desconhecido aconteceu',
            request_body: req.body,
            error
        })
    }
})

module.exports = router