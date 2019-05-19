import { promisify, format } from 'util'
import http from 'http'

import getFloorTimestamp from './date-utils'
import { Storage } from '@google-cloud/storage'

const storage = new Storage()

http.get[promisify.custom] = function getAsync (options) {
  return new Promise((resolve, reject) => {
    http.get(options, (response) => {
      response.end = new Promise((resolve) => response.on('end', resolve))
      resolve(response)
    }).on('error', reject)
  })
}

const get = promisify(http.get)

export default async function download2 (radarUrl) {
  const bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET || 'tmd_weather')

  const start = getFloorTimestamp(Date.now())
  let fileName = start + '_' + radarUrl.filename
  const blob = bucket.file(fileName)
  let exists = await blob.exists()
  const publicUrl = format(
    `https://storage.googleapis.com/${bucket.name}/${blob.name}`
  )
  console.log(publicUrl + ': ' + exists[0])
  if (!exists[0]) {
    const file = blob.createWriteStream({
      resumable: false
    })
    console.log('Loading ' + fileName)
    let response = await get(radarUrl.url + radarUrl.filename)
    await new Promise((resolve, reject) => {
      response.pipe(file)
      file.on('finish', () => {
        resolve()
      })
      file.on('error', (err) => {
        console.log(err)
        reject(err)
      })
    })
  }
  return publicUrl
}
