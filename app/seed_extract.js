const request = require('request')
const cheerio = require('cheerio')
const validUrl = require('valid-url')

const options = {
    url: '',
    headers: {
        'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:58.0) Gecko/20100101 Firefox/58.0'
    },
    timeout: 10000
}

const googleResultSelector = "#main a";

function getSeeds(query) {
    options.url = `https://www.google.com.br/search?q=${query.replace(/ /g, '+')}+download+torrent`

    return new Promise((resolve, reject) => {
        console.log(`Retrieving sources from Google for '${query}'...`)

        request(options, (err, resp, body) => {
            if (err) {
                reject('Error fetching data sources. Try again.')
                return
            }

            const urls = []
            const $ = cheerio.load(body)
            $('footer').remove();
            $(googleResultSelector)
                .filter((i, result) => result.attribs['href'].indexOf('url=') !== -1)
                .each((i, result) => {
                    const dirtyHref = result.attribs['href'];
                    const fisrtSection = dirtyHref.substring(dirtyHref.indexOf('url=') + 4);
                    const finalUrl = fisrtSection.substring(0, fisrtSection.indexOf('&'))
                    urls.push(finalUrl)
                })

            resolve(urls)
        })
    })
}

module.exports = {
    extractSeeds: (data) => {
        return new Promise((resolve, reject) => {
            if (validUrl.isUri(data)) {
                resolve([data])
            } else {
                getSeeds(data)
                    .then(resolve)
                    .catch(reject)
            }
        })
    }
}
