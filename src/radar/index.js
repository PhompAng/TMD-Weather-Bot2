import getFloorTimestamp from '~/utils/date-utils'
import radarUrls from './radarUrls'

export class Radar {
  constructor(arg) {
    switch (arg) {
      case 'nongchok':
      case 'njk':
        this.data = radarUrls.nongchok
        break
      case 'nongkhame':
      case 'nkm':
        this.data = radarUrls.nongkhame
        break
      case 'large':
        this.data = radarUrls.large
        break
      default:
        this.data = radarUrls.nongkhame
        break
      }
  }

  getDownloadUrl() {
    return this.data.url + this.data.filename
  }

  getDownloadName() {
    const start = getFloorTimestamp(Date.now())
    return start + '_' + this.data.filename
  }
}

export const radarList = Object.keys(radarUrls)