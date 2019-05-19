import AbstractDownload from './AbstractDownload'
import { format } from 'util'
import { Storage } from '@google-cloud/storage'
import * as constant from '~/constant'

const storage = new Storage()

export default class GCloudDownload extends AbstractDownload {
  constructor (radar) {
    super(radar)
  }

  createUri() {
    const bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET || constant.BUCKET_NAME)
    let fileName = this.radar.getDownloadName()
    this.blob = bucket.file(fileName)
    return format(
      `${constant.STORAGE_PUBLIC_URL}/${bucket.name}/${this.blob.name}`
    )
  }

  async isExists(uri) {
    let exists = await this.blob.exists()
    return exists[0]
  }

  createFile(uri) {
    return this.blob.createWriteStream({
      resumable: false
    })
  }

  onDownloadFinish(file, uri) {
    console.log('Download complete')
  }

  onDownloadError(file, uri) {
  }
}