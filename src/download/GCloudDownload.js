import AbstractDownload from './AbstractDownload'
import { Storage } from '@google-cloud/storage'
import { Input } from 'telegraf'

const storage = new Storage()

export default class GCloudDownload extends AbstractDownload {
  async download () {
    const file = await super.download()
    return Input.fromReadableStream(file.createReadStream())
  }

  createUri () {
    const bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET)
    const fileName = this.radar.getDownloadName()
    return bucket.file(fileName)
  }

  async isExists (uri) {
    const exists = await uri.exists()
    return exists[0]
  }

  createFile (uri) {
    return uri.createWriteStream({
      resumable: false
    })
  }

  onDownloadFinish (_file, _uri) {
    console.log('Download complete')
  }

  onDownloadError (_file, _uri) {
  }
}
