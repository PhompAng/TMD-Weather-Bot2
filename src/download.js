import { join } from 'path'
import { promisify } from 'util'
import appRoot from 'app-root-path'
import fs from 'fs'
import http from 'http'

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
  const start = Date.now().toString()
  let filename = join(appRoot.toString(), '.thumb', start + '_' + radarUrl.filename)
  let response = await get(radarUrl.url + radarUrl.filename)
  await new Promise((resolve, reject) => {
    let file = fs.createWriteStream(filename)
    response.pipe(file)
    file.on('finish', () => {
      file.close()
      resolve()
    })
    file.on('error', () => {
      fs.unlink(start)
      reject()
    })
  })
  return filename
}
