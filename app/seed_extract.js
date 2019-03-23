const request = require('request')
const cheerio = require('cheerio')
const validUrl = require('valid-url')

let options = {
    url: '',
    headers: {
        'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:58.0) Gecko/20100101 Firefox/58.0'
    }
}

const googleResultSelector = 'div.rc a'

function getSeeds(query) {
    options.url = `https://www.google.com.br/search?q=${query.replace(/ /g, '+')}+download+torrent`

    return new Promise((resolve, reject) => {
        console.log('Retrieving sources from Google...')

        request(options, (err, resp, body) => {
            if (err) {
                reject('Error fetching data sources. Try again.')
                return
            }

            let urls = []
            const $ = cheerio.load(body)

            $(googleResultSelector).each((i, result) => {
                urls.push(result.attribs['href'])
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