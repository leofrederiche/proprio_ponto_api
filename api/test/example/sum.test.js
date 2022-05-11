const sum = require('./sum');

test('Add 1 + 2 to equals 3 ', () => {
    let result = sum(1,2)
    expect(result).toBe(3)
})
