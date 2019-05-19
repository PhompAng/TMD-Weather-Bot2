import 'core-js/shim'
import 'regenerator-runtime/runtime'
import { Radar } from './radar'
import Telegraf from 'telegraf'
import GCloudDownload from './download/GCloudDownload'
import express from 'express'
import * as bodyParser from 'body-parser'

import _ from '~/env'

const bot = new Telegraf(process.env.BOT_TOKEN, {username: process.env.USERNAME})
const regex = /^\/([^@\s]+)@?(?:(\S+)|)\s?([\s\S]*)$/i

async function main() {
  async function replyWithPhoto (ctx, arg) {
    let radar = new Radar(arg)
    const downloader = new GCloudDownload(radar)
    await ctx.replyWithPhoto(await downloader.download())
  }

  bot.use((ctx, next) => {
    const start = new Date()
    if (ctx.update.message != null) {
      console.log('Recive message: %s [%s]', ctx.update.message.text, start)
      const parts = regex.exec(ctx.update.message.text)
      if (!parts) return next()
      const command = {
        text: ctx.update.message.text,
        command: parts[1],
        bot: parts[2],
        args: parts[3],
        get splitArgs () {
          return parts[3].split(/\s+/)
        }
      }
      ctx.state.command = command
    }
    return next(ctx).then(() => {
      const ms = new Date() - start
      console.log('Response time %sms', ms)
    })
  })

  bot.start((ctx) => ctx.reply('Hello! type /weather to start'))
  bot.command('large', async (ctx) => {
    try {
      await ctx.reply('Processing: large')
      await replyWithPhoto(ctx, 'large')
    } catch (err) {
      await ctx.reply(err)
      console.log(err)
    }
  })
  bot.command(['njk', 'nkm'], async (ctx) => {
    try {
      if (ctx.state.command.command == null) {
        return
      }
      await ctx.reply('Processing: ' + ctx.state.command.command)
      let command = ctx.state.command.command
      if (command != null) {
        await replyWithPhoto(ctx, command.toLowerCase())
      } else {
        await replyWithPhoto(ctx, 'nkm')
      }
    } catch (err) {
      await ctx.reply(err)
      console.log(err)
    }
  })
  bot.command('weather', async (ctx) => {
    try {
      if (ctx.state.command.text == null) {
        return
      }
      console.log(ctx.state)
      await ctx.reply('Processing: ' + ctx.state.command.text)
      let args = ctx.state.command.text.split(' ')
      if (args[1] != null) {
        await replyWithPhoto(ctx, args[1].toLowerCase())
      } else {
        await replyWithPhoto(ctx, 'nkm')
      }
    } catch (err) {
      await ctx.reply(err)
      console.log(err)
    }
  })
  bot.command('ping', ctx => ctx.reply('pong!'))
  bot.command('list', ctx => ctx.reply(Object.keys(radarUrls)))
  bot.startPolling()

  const PORT = process.env.PORT || 8080
  const app = express()
  app.use(bodyParser.json())

  app.get('/', (req, res) => {
    res.json({
        'username': process.env.USERNAME
    })
  })
  app.get('/cron', async (req, res) => {
    try {
      let radar = new Radar(arg)
      const downloader = new GCloudDownload(radar)
      await downloader.download()
      res.json(null)
    } catch (err) {
      res.status(500).json(
        {
          'error': err
        }
      )
    }
  })

  app.listen(PORT, function () {
    console.log('Example app listening on port ' + PORT)
  })
}

main()