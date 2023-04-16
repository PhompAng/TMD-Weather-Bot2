import https from 'https'

export default class AbstractDownload {
  constructor (radar) {
    this.radar = radar
  }

  async download () {
    const uri = this.createUri()
    const fileExists = await this.isExists(uri)
    console.log(uri + ': ' + fileExists)
    if (!fileExists) {
      const file = this.createFile(uri)
      const downloadUrl = this.radar.getDownloadUrl()
      console.log('Loading ' + downloadUrl + ' to ' + uri)
      try {
        await new Promise((resolve, reject) => {
          https.get(downloadUrl, function (response) {
            response.pipe(file)

            file.on('finish', () => {
              resolve()
            })
            file.on('error', (err) => {
              reject(err)
            })
          })
        })
        this.onDownloadFinish(file, uri)
      } catch (err) {
        console.log(err)
        this.onDownloadError(file, uri)
      }
    }
    return uri
  }

  createUri () {
    throw new Error('You have to implement the method')
  }

  async isExists (_uri) {
    throw new Error('You have to implement the method')
  }

  createFile (_uri) {
    throw new Error('You have to implement the method')
  }

  onDownloadFinish (_file, _uri) {

  }

  onDownloadError (_file, _uri) {

  }
}
