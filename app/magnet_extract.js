const request = require('request')
const cheerio = require('cheerio')
const async = require('async')
const urlParser = require('url')
const validUrl = require('valid-url')

let options = {
    url: '',
    headers: {
       /*  'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:58.0) Gecko/20100101 Firefox/58.0' */
    }
}

const googleResultSelector = 'div.rc a'

function getSeeds(query, cbResult) {
    options.url = `https://www.google.com.br/search?q=${query.replace(/ /g, '+')}+download+torrent`
    
    request(options, (err, resp, body) => {
        if (err) {
            console.log('Erro: ' + err)
            return
        }

        let urls = []
        const $ = cheerio.load(body)

        $(googleResultSelector).each((i, result) => {
            urls.push(result.attribs['href'])
        })

        extractMagnet(urls, cbResult)
    })
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
                links.push(elem.attribs['href'])
            })

            callback(null, links)
        })
    }

    async.map(urls, getMagnetLinks, function (err, res) {
        if (err) {
            console.log(err)
            cbResult({ urls: [] })
            return
        }
        
        cbResult({ urls: res.length? getMagnetDto(res) : []})
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

module.exports = {
    extractTorrents: (data, callback) => {
        if (validUrl.isUri(data)) {
            extractMagnet([data], callback)
        } else {
            getSeeds(data, callback)
        }
    }
}