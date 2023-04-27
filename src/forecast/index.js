import https from 'https'
import { URL } from 'node:url'

const FORECAST_ENDPOINT = 'https://data.tmd.go.th/nwpapi/v1/forecast/location/hourly/place'
const CONDITION_MAP = {
  1: 'ท้องฟ้าแจ่มใส',
  2: 'มีเมฆบางส่วน',
  3: 'เมฆเป็นส่วนมาก',
  4: 'มีเมฆมาก',
  5: 'ฝนตกเล็กน้อย',
  6: 'ฝนปานกลาง',
  7: 'ฝนตกหนัก',
  8: 'ฝนฟ้าคะนอง',
  9: 'อากาศหนาวจัด',
  10: 'อากาศหนาว',
  11: 'อากาศเย็น',
  12: 'อากาศร้อนจัด'
}

function buildMessage (forecastResult) {
  let result = ''
  const placeMessage = 'พยากรณ์อากาศแขวง' + forecastResult.location.name + ' เขต' + forecastResult.location.amphoe + ' จังหวัด' + forecastResult.location.province + '\n'
  result += placeMessage
  for (const forecast of forecastResult.forecasts) {
    result += 'เวลา ' + new Date(forecast.time).toLocaleTimeString('th-TH', { timeZone: 'Asia/Bangkok' }) + '\n'
    result += CONDITION_MAP[forecast.data.cond] + ' อุณหภูมิ: ' + forecast.data.tc + '°C, ความชื้นสัมพัทธ์: ' + forecast.data.rh + '%\n'
    result += 'ปริมาณฝน: ' + forecast.data.rain + 'mm.\n'
  }
  return result
}

const placeForecast = async () => {
  const result = await new Promise((resolve, reject) => {
    const url = new URL(FORECAST_ENDPOINT)
    url.searchParams.append('province', 'กรุงเทพมหานคร')
    url.searchParams.append('amphoe', 'คลองเตย')
    url.searchParams.append('tambon', 'พระโขนง')
    url.searchParams.append('duration', 3)
    url.searchParams.append('fields', 'tc,rh,cond,rain')
    url.searchParams.append('subarea', 1)
    const options = {
      headers: {
        authorization: 'Bearer ' + process.env.FORECAST_TOKEN,
        accept: 'application/json'
      }
    }
    console.log(url.href)
    https.get(url, options, (response) => {
      let body = ''

      response.on('data', (chunk) => {
        body += chunk
      })

      response.on('end', () => {
        try {
          const json = JSON.parse(body)
          console.log(JSON.stringify(json))
          const forcast = json.WeatherForecasts[0]
          resolve(forcast)
        } catch (error) {
          reject(error)
        }
      })
    }).on('error', (e) => {
      reject(e)
    })
  })
  return buildMessage(result)
}

export default placeForecast
