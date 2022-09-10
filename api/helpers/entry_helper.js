const Entry = require('../models/entry')

const ValidateEntry = (errs) => {
    let errors = []

    if (errs) {
        for (field in errs.errors) {
            errors.push(`${field} - ${errs.errors[field].message}`)
        }

        return errors
    }
}

const GetEntries = async (user_id) => {
    const entries = await Entry.find({ _id: user_id }).exec()

    if (!entries) {
        return null
    }

    return entries
}

const DeleteEntry = async (entry_id) => {
    const result = await Entry.deleteOne({ _id: entry_id }).exec()

    return result
}

const DeleteEntries = async (user_id) => {
    const result = await Entry.deleteMany({ user: user_id }).exec()

    return result
}


const IsFirstEntry = async (user_id) => {
    const entries = await Entry.find({ _id: user_id }).exec()

    if (!entries) {
        return true
    }

    return false
}

const TimeToInt = (time = "") => {
    var negative = false 
    if (time.includes("-")) {
      negative = true
      time = time.substr(1)
    }

    var arrTime = time.split(":")
    var hours = parseInt(arrTime[0]) * 60
    var minutes = parseInt(arrTime[1])

    var result = hours + minutes
    return negative ? result * -1 : result
}

const IntToTime = (int) => {  
    var negative = false
    if (int < 0) {
      negative = true
      int = int * -1
    }

    var hours = int != 0 ? Math.floor(int / 60) : 0
    var minutes = int - (hours * 60)

    hours = hours < 10 ? "0" + hours : hours
    minutes = minutes < 10 ? "0" + minutes : minutes

    return (negative ? "-" : "") + hours + ":" + minutes
}

const CalcWorkedTime = (entries) => {
    var workTime = 0

    if (entries.length % 2 != 0) {
        return IntToTime(workTime)
    }

    entries.map((value, index) => {
        // Calc only Input X Output
        if (index % 2 === 0) {
            workTime += TimeToInt(entries[index + 1]) - TimeToInt(value)
        }
    })

    return IntToTime(workTime)
}

const CalcDayBalance = (workTime, journey) => {
    var result = TimeToInt(workTime) - TimeToInt(journey)

    return IntToTime(result)
}

const SumBalance = (entries, initialBalance = "00:00") => {
    let totalBalanceInt = 0

    entries.map( entry => {
        totalBalanceInt += TimeToInt(entry.balance)
    })

    totalBalanceInt += TimeToInt(initialBalance)

    const result = IntToTime(totalBalanceInt)
    return result
}

module.exports = {
    ValidateEntry,
    GetEntries, 
    IsFirstEntry, 
    TimeToInt,
    IntToTime,
    CalcWorkedTime,
    CalcDayBalance,
    SumBalance,
    DeleteEntry,
    DeleteEntries
}