const rewire = require('rewire')
const magnetExtractRewire = rewire('../../app/magnet_extract')

const isValidMagnetLink = magnetExtractRewire.__get__('isValidMagnetLink')
const extractTorrentNameFromLink = magnetExtractRewire.__get__('extractTorrentNameFromLink')
const getMagnetDto = magnetExtractRewire.__get__('getMagnetDto')

describe('magnetExtract', () => {
  it('should return "true" for a link that start with ":magnet"', () => {
    const link = 'magnet:?xt=urn:btih:c12fc9f519b335aa7c1367a88a'

    expect(isValidMagnetLink(link)).toBe(true)
  })

  it('should return "false" for a link that does not starts with ":magnet"', () => {
    const link = 'xt=urn:btih:c12fc9f519b335aa7c1367a88a'

    expect(isValidMagnetLink(link)).toBe(false)
  })

  it('should return "example name" from link with display name', () => {
    const link = 'magnet:?xt=urn:btih:c12fe1c06bba254a9dc9f519b335aa7c1367a88a&dn=example+name'

    expect(extractTorrentNameFromLink(link)).toBe('example name')
  })

  it('should return array of objects with "uri" and "name" properties', () => {
    const link1 = 'magnet:?xt=urn:btih:c12fe1c06bba254a9dc9f519b335aa7c1367a88a&dn=example+1'
    const link2 = 'magnet:?xt=urn:btih:c12fe1c06bba254a9dc9f519b335aa7c1367a88a&dn=example+2'

    expect(getMagnetDto([link1, link2])).toMatchObject([
      {
        uri: link1,
        name: 'example 1'
      },
      {
        uri: link2,
        name: 'example 2'
      }
    ])
  })
})


