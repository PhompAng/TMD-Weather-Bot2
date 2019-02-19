import { join } from 'path'
import { promisify } from 'util'
import appRoot from 'app-root-path'
import isThere from 'is-there'
import fs from 'fs'
import http from 'http'

import getFloorTimestamp from './date-utils'

http.get[promisify.custom] = function getAsync (options) {
  return new Promise((resolve, reject) => {
    http.get(options, (response) => {
      response.end = new Promise((resolve) => response.on('end', resolve))
      resolve(response)
    }).on('error', reject)
  })
}

const get = promisify(http.get)

export default async function download (radarUrl) {
  const start = getFloorTimestamp(Date.now())
  let filePath = join(appRoot.toString(), 'thumb', start + '_' + radarUrl.filename)
  if (!isThere(filePath)) {
    console.log('Loading ' + filePath)
    let response = await get(radarUrl.url + radarUrl.filename)
    await new Promise((resolve, reject) => {
      let file = fs.createWriteStream(filePath)
      response.pipe(file)
      file.on('finish', () => {
        file.close()
        resolve()
      })
      file.on('error', (err) => {
        console.log(err)
        fs.unlink(filePath, (e) => { console.log(e) })
        reject(err)
      })
    })
  }
  return filePath
}
