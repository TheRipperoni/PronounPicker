import { Jetstream } from '@skyware/jetstream'
import WebSocket from 'ws'
import { logger } from './util/logger.js'
import { BskyAgent } from '@atproto/api'
import { emitNewLabel, emitRemovalLabel } from './util/ozone-util.js'
import { Config } from './config.js'

export class MyJetstream {
  public jetstream
  public agent!: BskyAgent

  private readonly uriLabelMap: Map<string, string>
  private readonly resetPost: string

  constructor(cfg: Config) {
    this.uriLabelMap = cfg.uriLabelMap
    this.resetPost = cfg.resetPost

    this.jetstream = new Jetstream({
      wantedCollections: ['app.bsky.feed.like'],
      ws: WebSocket,
      endpoint: cfg.subscriptionEndpoint,
    })
    this.jetstream.onCreate('app.bsky.feed.like', async (event) => {
      try {
        const uri = event.commit.record.subject.uri.toString()
        const did = event.did
        const label = this.uriLabelMap.get(uri)
        if (label) {
          await emitNewLabel(this.agent, did, label)
        }

        if (uri === this.resetPost) {
          const labelsToRemove = Array.from(this.uriLabelMap.values())
          await emitRemovalLabel(this.agent, did, labelsToRemove)
        }
      } catch (e) {
        logger.error(`Error in Jetstream: ${e}`)
      }
    })
  }

  start(agent: BskyAgent) {
    this.agent = agent
    this.jetstream.start()
  }
}
