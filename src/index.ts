import dotenv from 'dotenv'
import PronounPicker from './server.js'
import { logger } from './util/logger.js'

const run = async () => {
  dotenv.config()
  const server = PronounPicker.create({
    subscriptionEndpoint:
      maybeStr(process.env.JETSTREAM_SUBSCRIPTION_ENDPOINT) ??
      'wss://jetstream1.us-west.bsky.network/subscribe',
    subscriptionReconnectDelay:
      maybeInt(process.env.JETSTREAM_SUBSCRIPTION_RECONNECT_DELAY) ?? 3000,
    uriLabelMap: new Map(Object.entries(JSON.parse(process.env.URI_LABEL_MAP ?? '{}'))),
    resetPost:
      maybeStr(process.env.RESET_POST) ??
      'at://did:plc:l3nbhdfelt5d26btksecetxu/app.bsky.feed.post/3medxe3ubgk2w',
  })
  await server.start()
  await new Promise((f) => setTimeout(f, 3000))
  logger.info('Application Started')
}

const maybeStr = (val?: string) => {
  if (!val) {
    return undefined
  }
  return val
}

const maybeInt = (val?: string) => {
  if (!val) {
    return undefined
  }
  const int = parseInt(val, 10)
  if (isNaN(int)) {
    return undefined
  }
  return int
}

run()
