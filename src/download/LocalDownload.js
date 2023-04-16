import AbstractDownload from './AbstractDownload'
import appRoot from 'app-root-path'
import isThere from 'is-there'
import fs from 'fs'
import path from 'path'
import { Input } from 'telegraf'

export default class LocalDownload extends AbstractDownload {
  async download () {
    return Input.fromLocalFile(await super.download())
  }

  createUri () {
    return path.join(appRoot.toString(), 'thumb', this.radar.getDownloadName())
  }

  async isExists (uri) {
    return isThere(uri)
  }

  createFile (uri) {
    return fs.createWriteStream(uri)
  }

  onDownloadFinish (file, _uri) {
    console.log('finish: ' + file)
    file.close()
  }

  onDownloadError (_file, uri) {
    fs.unlink(uri, (e) => { console.log(e) })
  }
}
