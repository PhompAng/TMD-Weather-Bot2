import getFloorTimestamp from '~/utils/date-utils'
import radarUrls from './radarUrls'

export class Radar {
  constructor(arg) {
    switch (arg) {
      case 'nongchok':
      case 'njk':
        this.data = radarUrls.nongchok
      case 'nongkhame':
      case 'nkm':
        this.data = radarUrls.nongkhame
      case 'large':
        this.data = radarUrls.large
      default:
        this.data = radarUrls.nongkhame
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

