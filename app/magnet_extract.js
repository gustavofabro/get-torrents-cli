const request = require('request')
const cheerio = require('cheerio')
const async = require('async')
const urlParser = require('url')
const validUrl = require('valid-url')

let options = {
    url: '',
    headers: {
        'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:58.0) Gecko/20100101 Firefox/58.0'
    }
}

function extractMagnet(urls, cbResult) {
    function getMagnetLinks(url, callback) {
        options.url = url

        request(options, (err, resp, body) => {
            let links = []

            if (err) {
                callback(null, links)
                return;
            }

            const $ = cheerio.load(body)

            $('a[href^="magnet:"]').each((i, elem) => {
                let link = elem.attribs['href']

                if (isValidMagnetLink(link)) {
                    links.push(link)
                }
            })

            callback(null, links)
        })
    }

    function validUrls(item) {
        return validUrl.isUri(item)
    }

    async.map(urls.filter(validUrls), getMagnetLinks, function (err, res) {
        if (err) {
            console.log(err)
            cbResult({ urls: [] })
            return
        }

        cbResult({ urls: res.length ? getMagnetDto(res) : [] })
    })
}

function getMagnetDto(googleMagnetRes) {
    return googleMagnetRes.reduce((accum, curr) => {
        return accum.concat(curr);
    }).map((link, i) => {
        return {
            uri: link,
            name: extractTorrentNameFromLink(link)
        }
    })
}

function extractTorrentNameFromLink(link) {
    let name = new urlParser.URL(link).searchParams.get('dn')

    if (!name) {
        let dnF = link.substring(link.indexOf('dn='))

        name = decodeURI(dnF.substring(3, dnF.indexOf('&amp')))
    }

    return name;
}

function isValidMagnetLink(link) {
    return link.startsWith('magnet:')
}

module.exports = {
    extractMagnet: (urls) => {
        return new Promise((resolve, reject) => {
            extractMagnet(urls, resolve)
        })
    }
}