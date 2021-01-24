
const {loggerOptions} = require('../settings');
const logger = require('pino')(loggerOptions);


/**
 * Get most frequent value and it's count in Array
 * @param {Array} array - Array with values
 */
function mostFrequent(array) {
    const map = array.map((a) => array.filter((b) => a === b).length);
    const maxTimes = Math.max.apply(null, map);
    return [array[map.indexOf(maxTimes)], maxTimes];
}


module.exports = {
    mostFrequent, logger
};
