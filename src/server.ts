import http from 'http'
import { Config } from './config.js'
import { MyJetstream } from './subscription.js'
import { BskyAgent } from '@atproto/api'
import { getAgent, getOzoneAgent } from './agent.js'

export class PronounPicker {
  public server?: http.Server
  public jetstream: MyJetstream
  public cfg: Config
  public ozoneAgent?: BskyAgent

  constructor(jetstream: MyJetstream, cfg: Config) {
    this.jetstream = jetstream
    this.cfg = cfg
  }

  static create(cfg: Config) {
    const firehose = new MyJetstream(cfg)
    return new PronounPicker(firehose, cfg)
  }

  async start() {
    const agent = await getAgent()
    this.ozoneAgent = await getOzoneAgent(agent.session)

    this.jetstream.start(this.ozoneAgent)
    return this.server
  }
}

export default PronounPicker
