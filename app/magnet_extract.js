const request = require('request')
const cheerio = require('cheerio')
const urlParser = require('url')
const validUrl = require('valid-url')

let options = {
    url: '',
    headers: {
        'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:58.0) Gecko/20100101 Firefox/58.0'
    }
}

function extractMagnet(urls) {
    function getMagnetLinks(url, resolve) {
        options.url = url

        request(options, (err, resp, body) => {
            let links = []

            if (err) {
                resolve([])
                return;
            }

            const $ = cheerio.load(body)

            $('a[href^="magnet:"]').each((i, elem) => {
                let link = elem.attribs['href']

                if (isValidMagnetLink(link)) {
                    links.push(link)
                }
            })

            resolve(links)
        })
    }

    function validUrls(item) {
        return validUrl.isUri(item)
    }


    function mountPromises(urls) {
        return urls.filter(validUrls).map(url => {
            return new Promise((resolve) => {
                getMagnetLinks(url, resolve)
            })
        })
    }

    return new Promise((resolve, reject) => {
        Promise.all(mountPromises(urls))
            .then((data) => {
                resolve({ urls: data ? getMagnetDto(data) : [] })
            })
            .catch(reject)
    })
}

function getMagnetDto(googleMagnetRes) {
    return googleMagnetRes.reduce((accum, curr) => {
        return accum.concat(curr);
    }).map((link) => {
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
            extractMagnet(urls)
                .then(resolve)
                .catch(reject)
        })
    }
}