import 'regenerator-runtime/runtime'
import { Radar, radarList } from './radar'
import { Telegraf } from 'telegraf'
import GCloudDownload from './download/GCloudDownload'
import express from 'express'
import * as bodyParser from 'body-parser'
import * as Sentry from '@sentry/node'
import * as dotenv from 'dotenv'
import placeForecast from '~/forecast'

dotenv.config()

Sentry.init({ dsn: 'https://fe2fee6d61374ccabb70efd63982a214@sentry.io/1491151' })

const bot = new Telegraf(process.env.BOT_TOKEN, { username: process.env.USERNAME })
const regex = /^\/([^@\s]+)@?(?:(\S+)|)\s?([\s\S]*)$/i

async function main () {
  async function replyWithPhoto (ctx, arg) {
    const radar = new Radar(arg)
    const downloader = new GCloudDownload(radar)
    await ctx.replyWithPhoto(await downloader.download())
  }

  bot.use(async (ctx, next) => {
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
    await next()
    const ms = new Date() - start
    console.log('Response time %sms', ms)
  })

  bot.start((ctx) => ctx.reply('Hello! type /weather to start'))
  bot.command(['njk', 'nkm'], async (ctx) => {
    try {
      if (ctx.state.command.command == null) {
        return
      }
      await ctx.reply('Processing: ' + ctx.state.command.command)
      const command = ctx.state.command.command
      if (command != null) {
        await replyWithPhoto(ctx, command.toLowerCase())
      } else {
        await replyWithPhoto(ctx, 'nkm')
      }
    } catch (err) {
      console.log(err)
      Sentry.captureException(err)
      await ctx.reply(err.message)
    }
  })
  bot.command('radar', async (ctx) => {
    try {
      if (ctx.state.command.text == null) {
        return
      }
      console.log(ctx.state)
      await ctx.reply('Processing: ' + ctx.state.command.text)
      const args = ctx.state.command.text.split(' ')
      if (args[1] != null) {
        await replyWithPhoto(ctx, args[1].toLowerCase())
      } else {
        await replyWithPhoto(ctx, 'nkm')
      }
    } catch (err) {
      console.log(err)
      Sentry.captureException(err)
      await ctx.reply(err.message)
    }
  })
  bot.command('forecast', async (ctx) => {
    try {
      const result = await placeForecast()
      await ctx.reply(result)
    } catch (error) {
      await ctx.reply(error.message)
    }
  })
  bot.command('ping', ctx => ctx.reply('pong!'))
  bot.command('list', ctx => ctx.reply(radarList))

  const PORT = process.env.PORT || 8080
  const app = express()
  // The request handler must be the first middleware on the app
  app.use(Sentry.Handlers.requestHandler())
  app.use(bodyParser.json())
  if (process.env.ENV === 'local') {
    bot.launch()
  } else {
    app.use(await bot.createWebhook({ domain: process.env.WEBHOOK_DOMAIN }))
  }

  app.get('/', (_req, res) => {
    res.json({
      username: process.env.USERNAME
    })
  })
  app.get('/debug-sentry', function mainHandler (_req, _res) {
    throw new Error('My first Sentry error!')
  })
  // The error handler must be before any other error middleware
  app.use(Sentry.Handlers.errorHandler())

  // Optional fallthrough error handler
  // eslint-disable-next-line n/handle-callback-err
  app.use(function onError (_err, _req, res, _next) {
    // The error id is attached to `res.sentry` to be returned
    // and optionally displayed to the user for support.
    res.statusCode = 500
    res.end(res.sentry + '\n')
  })
  app.listen(PORT, function () {
    console.log('TMD app listening on port ' + PORT)
  })
}

main()
