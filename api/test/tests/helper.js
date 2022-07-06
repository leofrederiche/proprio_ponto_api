const EntryHelper = require("../../helpers/entry_helper")

const HelperTest = () => {

describe("Entry Helper", () => {
    it("TimeToInt", () => {
        const time = "01:20"

        const int = EntryHelper.TimeToInt(time)

        expect(int).toBe(80)
    })

    it("TimeToInt value '00:00'", () => {
        const time = "00:00"

        const int = EntryHelper.TimeToInt(time)

        expect(int).toBe(0)
    })

    it("IntToTime", () => {
        const int = 120

        const time = EntryHelper.IntToTime(int)

        expect(time).toBe("02:00")
    })

    it("IntToTime value 0", () => {
        const int = 0

        const time = EntryHelper.IntToTime(int)

        expect(time).toBe("00:00")
    })

    it("CalcWorkedTime Complete", () => {
        const times = ["08:00", "12:00", "13:00", "17:10"]

        const workedTime = EntryHelper.CalcWorkedTime(times)

        expect(workedTime).toBe("08:10")
    })

    it("CalcDayBalance Incomplete", () => {
        const times = ["08:00"]

        const workedTime = EntryHelper.CalcWorkedTime(times[0], times[1], times[2], times[3])

        expect(workedTime).toBe("00:00")
    })
})

}

module.exports = HelperTest