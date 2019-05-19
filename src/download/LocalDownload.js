import AbstractDownload from './AbstractDownload'
import appRoot from 'app-root-path'
import isThere from 'is-there'
import fs from 'fs'

export default class LocalDownload extends AbstractDownload {
  constructor (radar) {
    super(radar)
  }

  createUri() {
    return join(appRoot.toString(), 'thumb', this.radar.getDownloadName())
  }

  async isExists(uri) {
    return !isThere(uri)
  }

  createFile(uri) {
    return fs.createWriteStream(uri)
  }

  onDownloadFinish(file, uri) {
    file.close()
  }

  onDownloadError(file, uri) {
    fs.unlink(uri, (e) => { console.log(e) })
  }
}