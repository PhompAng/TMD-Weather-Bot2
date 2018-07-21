import 'babel-polyfill'
import Telegraf from 'telegraf'
import fs from 'fs'
import radarUrls from './radar'
import download from './download'

import _ from '~/env'

const bot = new Telegraf(process.env.BOT_TOKEN)

function getRadarPhoto (arg) {
  switch (arg) {
  case 'nongchok':
  case 'njk':
    return radarUrls.nongchok
  case 'nongkhame':
  case 'nkm':
    return radarUrls.nongkhame
  case 'large':
    return radarUrls.large
  default:
    return null
  }
}

async function replyWithPhoto (ctx, arg) {
  let radarUrl = getRadarPhoto(arg)
  if (radarUrl == null) {
    await ctx.reply('Unknown radar')
  } else {
    await ctx.replyWithPhoto({source: fs.createReadStream(await download(radarUrl))})
  }
}

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
bot.command('large', async (ctx) => {
  try {
    await replyWithPhoto(ctx, 'large')
  } catch (err) {
    console.log(err)
  }
})
bot.command(['njk', 'nkm'], async (ctx) => {
  try {
    if (ctx.update.message.text == null) {
      return
    }
    let args = ctx.update.message.text.split('/')
    if (args[1] != null) {
      await replyWithPhoto(ctx, args[1].toLowerCase())
    } else {
      await replyWithPhoto(ctx, 'nkm')
    }
  } catch (err) {
    console.log(err)
  }
})
bot.command('weather', async (ctx) => {
  try {
    if (ctx.update.message.text == null) {
      return
    }
    let args = ctx.update.message.text.split(' ')
    if (args[1] != null) {
      await replyWithPhoto(ctx, args[1].toLowerCase())
    } else {
      await replyWithPhoto(ctx, 'nkm')
    }
  } catch (err) {
    console.log(err)
  }
})
bot.command('ping', ctx => ctx.reply('pong!'))
bot.command('list', ctx => ctx.reply(Object.keys(radarUrls)))
bot.startPolling()
