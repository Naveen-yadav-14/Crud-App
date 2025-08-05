// const  sum = require('../services/sum');

const sum = require("../services/sum")

describe(("Math operations"), () => {
        test(("should be 7"), ()=> {
        expect(sum(3,4)).toBe(7)
    })

    test(("should be 11"), ()=> {
        expect(sum(5,6)).toEqual(11)
    })

})