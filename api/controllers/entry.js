const router = require("express").Router()
const Entry = require("../models/entry")
const User = require("../models/user")

const { ValidateEntry, CalcWorkedTime, CalcDayBalance, SumBalance } = require("../helpers/entry_helper")

router.post("/register", async (req, res) => {
    const entry = new Entry(req.body)
    const user = await User.findOne({ _id: req.body.user }).exec()

    if (!user) {
        let returnMessage = {
            message: "Não foi possível localizar o úsuario",
            request_body: req.body,
            error: null,
            finded: user
        }

        return res.status(400).send(returnMessage)
    }

    let workedTime = "00:00"
    let dayBalance = "00:00"

    workedTime = CalcWorkedTime(entry.entries)
    dayBalance = CalcDayBalance(workedTime, user.journey)

    entry.work = workedTime
    entry.balance = dayBalance

    var error = null

    const err = ValidateEntry(entry.validateSync())
    if (err) {
        let returnMessage = {
            message: "Informações inválidas",
            request_body: req.body,
            error: err
        }

        return res.status(400).send(returnMessage)
    }
    

    await entry.save( err => error = err)

    if (error) {
        let returnMessage = {
            message: "Erro ao salvar o registro",
            request_body: req.body,
            error
        }

        return res.status(400).send(returnMessage)
    } else {
        return res.status(201).send( entry )
    }
})

router.put("/update", async (req, res) => {
    try {
        const entry = await Entry.findOne({ _id: req.body._id }).exec()
        const user = await User.findOne({ _id: req.body.user}).exec()

        if (!entry) {
            let returnMessage = {
                message: "Não foi possível localizar o registro.",
                request_body: req.body,
                finded: entry
            } 

            return res.status(400).send(returnMessage)
        }

        Object.assign(entry, req.body)
        
        const worked = CalcWorkedTime(entry.entries)
        const dayBalance = CalcDayBalance(worked, user.journey)

        entry.work = worked
        entry.balance= dayBalance

        const entryUpdated = await entry.save()
            .then( doc => doc)

        return res.status(200).send(entryUpdated)
    } catch(error) {
        return res.status(400).send({
            message: "Um erro inesperado aconteceu ao atualizar o Registro",
            request_body: req.body,
            error
        })
    }
})

router.post("/", async (req, res) => {
    try {
        const { user_id } = req.body

        const user = await User.findOne({ _id: user_id}).exec()
        if (!user) {
            let returnMessage = {
                message: "Não foi possível localizar o usuario",
                request_body: req.body,
                finded: user
            }

            return res.status(400).send(returnMessage) 
        }

        const entries = await Entry.find({ user: user_id }).sort("day").exec()

        if (!entries) {
            let returnMessage = {
                message: "Não foi possível localizar os registros",
                request_body: req.body,
                finded: entries
            }

            return res.status(400).send(returnMessage)
        }

        // const totalBalance = SumBalance(entries)
        const totalBalance = SumBalance(entries, user.balance)

        const result = {
            totalBalance,
            entries: entries
        }

        return res.status(200).send(result)
    } catch( error ) {
        return res.status(400).send({
            message: "Erro ao consultar os registros",
            request_body: req.body,
            error
        })
    }
})

router.post("/fast-entry", async (req, res) => {
    const {user_id, day, time} = req.body
    let date = new Date(day)
    date.setHours(0,0,0,0)

    const user = await User.findOne({ _id: user_id}).exec()
    if (!user) {
        let returnMessage = {
            message: "Não foi possível localizar o usuario",
            request_body: req.body,
            finded: user
        }

        return res.status(400).send(returnMessage) 
    }

    let entry = await Entry.findOne({ user: user_id, day: date }).exec()
    if (!entry) {
        entry = new Entry
        entry.user = user_id
        entry.day = date
        entry.description = "Fast Entry"
        entry.entries = []
    }

    entry.entries.push(time)

    let workedTime = CalcWorkedTime(entry.entries)
    let dayBalance = CalcDayBalance(workedTime, user.journey)

    entry.work = workedTime
    entry.balance = dayBalance

    const entryUpdated = await entry.save().then(doc => doc)

    res.status(200).send(entryUpdated)

})

router.delete("/:entry_id", async (req, res) => {
    const { entry_id } = req.params
    const filter = { _id: entry_id }

    Entry.deleteOne(filter).then(function(response){
        let returnMessage = {
            message: "Registro excluido com sucesso!",
            request_body: req.body
        }
    
        return res.status(204).send(returnMessage)
    })
    .catch(function(error){
        let returnMessage = {
            message: "Não foi possível localizar os registros",
            request_body: req.body,
            filter: filter
        }

        return res.status(400).send(returnMessage)
    })
})

module.exports = router