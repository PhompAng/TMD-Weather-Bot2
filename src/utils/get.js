import { promisify } from 'util'
import http from 'http'

http.get[promisify.custom] = function getAsync (options) {
  return new Promise((resolve, reject) => {
    http.get(options, (response) => {
      response.end = new Promise((resolve) => response.on('end', resolve))
      resolve(response)
    }).on('error', reject)
  })
}

export const get = promisify(http.get)