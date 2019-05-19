import { get } from '~/utils/get'

export default class AbstractDownload {
  constructor (radar) {
    this.radar = radar
  }

  async download() {
    const uri = this.createUri()
    const fileExists = await this.isExists(uri)
    console.log(uri + ': ' + fileExists)
    if (!fileExists) {
        const file = this.createFile(uri)
        let response = await get(this.radar.getDownloadUrl())
        console.log('Loading ' + uri)
        await new Promise((resolve, reject) => {
          response.pipe(file)
          file.on('finish', () => {
            this.onDownloadFinish(file, uri)
            resolve()
          })
          file.on('error', (err) => {
            console.log(err)
            this.onDownloadError(file, uri)
            reject(err)
          })
        })
    }
    return uri
  }

  createUri() {
    throw new Error('You have to implement the method')
  }

  async isExists(uri) {
    throw new Error('You have to implement the method')
  }

  createFile(uri) {
    throw new Error('You have to implement the method')
  }

  onDownloadFinish(file, uri) {

  }

  onDownloadError(file, uri) {

  }
}