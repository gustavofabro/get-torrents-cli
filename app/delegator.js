const seedExtract = require('./seed_extract');
const magnetExtract = require('./magnet_extract');

function extractSeeds(data) {
    return seedExtract.extractSeeds(data)
}

function extractMagnet(query) {
    return magnetExtract.extractMagnet(query)
}

module.exports = {
    extractTorrents: (data, callback) => {
        extractSeeds(data)
            .then(extractMagnet)
            .then(callback)
    }
}