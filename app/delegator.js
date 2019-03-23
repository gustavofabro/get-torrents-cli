const seedExtract = require('./seed_extract')
const magnetExtract = require('./magnet_extract')

function extractSeeds(data) {
    return seedExtract.extractSeeds(data)
}

function extractMagnet(query) {
    return magnetExtract.extractMagnet(query)
}

module.exports = {
    extractTorrents: (data) => {
        return new Promise((resolve, reject) => {
            extractSeeds(data)
                .then(extractMagnet)
                .then(resolve)
                .catch(reject)
        })
    }
}