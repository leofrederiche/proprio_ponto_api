const router = require("express").Router()
const Entry = require("../models/entry")
const User = require("../models/user")

const { GetEntries, ValidateEntry, CalcWorkedTime, CalcDayBalance, SumBalance } = require("../helpers/entry_helper")
const { GetUser } = require("../helpers/user_helper")

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

    let { in1, out1, in2, out2 } = entry
    let workedTime = "00:00"
    let dayBalance = "00:00"

    if (![in1, in2, out1, out2].includes(undefined)) {
        workedTime = CalcWorkedTime(in1, out1, in2, out2)
        dayBalance = CalcDayBalance(workedTime, user.journey)
    }

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

        if (!entry) {
            let returnMessage = {
                message: "Não foi possível localizar o registro.",
                request_body: req.body,
                finded: entry
            } 

            return res.status(400).send(returnMessage)
        }

        Object.assign(entry, req.body)

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

router.get("/", async (req, res) => {
    try {
        const { user_id, date_start, date_end } = req.body

        const entries = await Entry.find({ user: user_id }).sort("day").exec()

        if (!entries) {
            let returnMessage = {
                message: "Não foi possível localizar os registros",
                request_body: req.body,
                finded: entries
            }

            return res.status(400).send(returnMessage)
        }

        const totalBalance = SumBalance(entries)

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

module.exports = router