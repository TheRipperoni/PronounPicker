import { Jetstream } from '@skyware/jetstream'
import WebSocket from 'ws'
import { logger } from './util/logger.js'
import { BskyAgent } from '@atproto/api'
import { emitNewLabel, emitRemovalLabel } from './util/ozone-util.js'

export class MyJetstream {
  public jetstream
  public agent!: BskyAgent

  private readonly uriLabelMap = new Map<string, string>([
    ['at://did:plc:l3nbhdfelt5d26btksecetxu/app.bsky.feed.post/3medpvwfdls2l', 'she'],
    ['at://did:plc:l3nbhdfelt5d26btksecetxu/app.bsky.feed.post/3medpvwio222l', 'her'],
    ['at://did:plc:l3nbhdfelt5d26btksecetxu/app.bsky.feed.post/3medpvwiozc2l', 'he'],
    ['at://did:plc:l3nbhdfelt5d26btksecetxu/app.bsky.feed.post/3medpvwiozd2l', 'him'],
    ['at://did:plc:l3nbhdfelt5d26btksecetxu/app.bsky.feed.post/3medpvwioze2l', 'they'],
    ['at://did:plc:l3nbhdfelt5d26btksecetxu/app.bsky.feed.post/3medpvwiozf2l', 'them'],
    ['at://did:plc:l3nbhdfelt5d26btksecetxu/app.bsky.feed.post/3medpvwiozg2l', 'ey'],
    ['at://did:plc:l3nbhdfelt5d26btksecetxu/app.bsky.feed.post/3medpvwipyo2l', 'em'],
    ['at://did:plc:l3nbhdfelt5d26btksecetxu/app.bsky.feed.post/3medpvwipyp2l', 'en'],
    ['at://did:plc:l3nbhdfelt5d26btksecetxu/app.bsky.feed.post/3medpvwipyq2l', 'xie'],
    ['at://did:plc:l3nbhdfelt5d26btksecetxu/app.bsky.feed.post/3medpvwipyr2l', 'hir'],
    ['at://did:plc:l3nbhdfelt5d26btksecetxu/app.bsky.feed.post/3medpvwipys2l', 'yo'],
    ['at://did:plc:l3nbhdfelt5d26btksecetxu/app.bsky.feed.post/3medpvwipyt2l', 'ze'],
    ['at://did:plc:l3nbhdfelt5d26btksecetxu/app.bsky.feed.post/3medpvwipyu2l', 'zir'],
    ['at://did:plc:l3nbhdfelt5d26btksecetxu/app.bsky.feed.post/3medpvwipyv2l', 've'],
    ['at://did:plc:l3nbhdfelt5d26btksecetxu/app.bsky.feed.post/3medpvwipyw2l', 'vis'],
    ['at://did:plc:l3nbhdfelt5d26btksecetxu/app.bsky.feed.post/3medpvwipyx2l', 'fae'],
    ['at://did:plc:l3nbhdfelt5d26btksecetxu/app.bsky.feed.post/3medpvwiqy72l', 'faer'],
    ['at://did:plc:l3nbhdfelt5d26btksecetxu/app.bsky.feed.post/3medpvwiqya2l', 'xe'],
    ['at://did:plc:l3nbhdfelt5d26btksecetxu/app.bsky.feed.post/3meenoxbdfk2f', 'it'],
    ['at://did:plc:l3nbhdfelt5d26btksecetxu/app.bsky.feed.post/3meenpzvegk2f', 'nopronouns'],
    ['at://did:plc:l3nbhdfelt5d26btksecetxu/app.bsky.feed.post/3meenqpx2hk2f', 'any'],
    ['at://did:plc:l3nbhdfelt5d26btksecetxu/app.bsky.feed.post/3meenrs6yrk2f', 'yall'],
    ['at://did:plc:l3nbhdfelt5d26btksecetxu/app.bsky.feed.post/3meensrovpc2f', 'pup'],
    ['at://did:plc:l3nbhdfelt5d26btksecetxu/app.bsky.feed.post/3meentqj6as2f', 'cat'],
    ['at://did:plc:l3nbhdfelt5d26btksecetxu/app.bsky.feed.post/3meenujquwk2f', 'frog'],
    ['at://did:plc:l3nbhdfelt5d26btksecetxu/app.bsky.feed.post/3meenvbndt22f', 'we'],
    ['at://did:plc:l3nbhdfelt5d26btksecetxu/app.bsky.feed.post/3meetzkvwes2z', 'sheher'],
    ['at://did:plc:l3nbhdfelt5d26btksecetxu/app.bsky.feed.post/3meetzl3ox22z', 'hehim'],
    ['at://did:plc:l3nbhdfelt5d26btksecetxu/app.bsky.feed.post/3meetzl3pwc2z', 'theythem'],
    ['at://did:plc:l3nbhdfelt5d26btksecetxu/app.bsky.feed.post/3meetzl3pwd2z', 'hethey'],
    ['at://did:plc:l3nbhdfelt5d26btksecetxu/app.bsky.feed.post/3meetzl3qvl2z', 'shethey'],
    ['at://did:plc:l3nbhdfelt5d26btksecetxu/app.bsky.feed.post/3meetzl3qvm2z', 'theyhe'],
    ['at://did:plc:l3nbhdfelt5d26btksecetxu/app.bsky.feed.post/3meetzl3ruu2z', 'theyshe'],
    ['at://did:plc:l3nbhdfelt5d26btksecetxu/app.bsky.feed.post/3meetzl3ruv2z', 'bun'],
    ['at://did:plc:l3nbhdfelt5d26btksecetxu/app.bsky.feed.post/3meetzl3ruw2z', 'dey'],
    ['at://did:plc:l3nbhdfelt5d26btksecetxu/app.bsky.feed.post/3meeuv2d3xc2k', 'askme'],
  ])
  private readonly resetPost =
    'at://did:plc:l3nbhdfelt5d26btksecetxu/app.bsky.feed.post/3medxe3ubgk2w'

  constructor() {
    this.jetstream = new Jetstream({
      wantedCollections: ['app.bsky.feed.like'],
      ws: WebSocket,
      endpoint: process.env.JETSTREAM_ENDPOINT!,
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
