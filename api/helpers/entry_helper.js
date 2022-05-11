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

const CalcWorkedTime = (input1, output1, input2, output2) => {
    var time1 = output1 > input1 ? TimeToInt(output1) - TimeToInt(input1) : 0
    var time2 = output2 > input2 ? TimeToInt(output2) - TimeToInt(input2) : 0
    var workTime = time1 + time2

    return IntToTime(workTime)
}

const CalcDayBalance = (workTime, journey) => {
    var result = TimeToInt(workTime) - TimeToInt(journey)

    return IntToTime(result)
}

const CalcTotalBalance = async (user_id) => {
    return "a"
}

const SumBalance = (entries) => {
    let totalBalanceInt = 0

    entries.map( entry => {
        totalBalanceInt += TimeToInt(entry.balance)
    })

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
    CalcTotalBalance,
    SumBalance,
    DeleteEntry,
    DeleteEntries
}