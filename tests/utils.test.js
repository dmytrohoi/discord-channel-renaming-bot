
import { mostFrequent, logger } from '../src/utils';


test("Find most frequent value in array", async (test) => {
    const testCases = [
        { input: [111, 111, 1, 2, 3, 4], expected: [111, 2] },
        { input: [1, 2, 111, 111, 111, 3, 4], expected: [111, 3] },
        { input: [1, 2, 3, 4, 111, 111, 111, 111], expected: [111, 4] },
        { input: [123, 123], expected: [123, 2] },
        { input: [1, 2, 3], expected: [1, 1] }
    ];

    for (const testCase of testCases) {
        except(mostFrequent(testCase.input)).toBe(testCase.expected);
    };
})

test("Logger is available", async (test) => {
    except(logger).not.toBeUndefined();
})
