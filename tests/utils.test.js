const tap = require('tap');

const {mostFrequent, logger} = require('../src/utils');


tap.test("Find most frequent value in array", async (test) =>{
    const testCases = [
        {input: [111, 111, 1, 2, 3, 4], expected: [111, 2]},
        {input: [1, 2, 111, 111, 111, 3, 4], expected: [111, 3]},
        {input: [1, 2, 3, 4, 111, 111, 111, 111], expected: [111, 4]},
        {input: [123, 123], expected: [123, 2]},
        {input: [1, 2, 3], expected: [1, 1]}
    ];

    for (const testCase of testCases) {
        test.equivalent(mostFrequent(testCase.input), testCase.expected);
    };
})

tap.test("Logger is available", async (test) =>{
    test.assert(logger);
})
