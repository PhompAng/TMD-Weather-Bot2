import Telegraf from 'telegraf'
import fs from 'fs'
import radarUrls from './radar'
import download from './download'

import _ from '~/env'

const bot = new Telegraf(process.env.BOT_TOKEN)

bot.use((ctx, next) => {
  const start = new Date()
  if (ctx.update.message != null) {
    console.log('Recive message: %s [%s]', ctx.update.message.text, start)
  }
  return next(ctx).then(() => {
    const ms = new Date() - start
    console.log('Response time %sms', ms)
  })
})

bot.start((ctx) => ctx.reply('Hello! type /weather to start'))
bot.command('weather', async (ctx) => {
  try {
    if (ctx.update.message.text == null) {
      return
    }
    let args = ctx.update.message.text.split(' ')
    if (args[1] != null) {
      switch (args[1]) {
      case 'nongchok':
        await ctx.replyWithPhoto({source: fs.createReadStream(await download(radarUrls.nongchok))})
        break
      case 'nongkhame':
        await ctx.replyWithPhoto({source: fs.createReadStream(await download(radarUrls.nongkhame))})
        break
      default:
        await ctx.reply('Unknown radar')
        break
      }
    } else {
      let stream = fs.createReadStream(await download(radarUrls.nongkhame))
      await ctx.replyWithPhoto({source: stream})
    }
  } catch (err) {
    console.log(err)
  }
})

bot.startPolling()
