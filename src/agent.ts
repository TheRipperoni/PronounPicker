import { BskyAgent } from '@atproto/api'
import 'dotenv/config'

export const getAgent = async () => {
  const agent = new BskyAgent({
    service: process.env.AGENT_SERVICE!,
  })
  agent.configureLabelers([did])

  await agent.login({
    identifier: process.env.AGENT_IDENTIFIER!,
    password: process.env.AGENT_PASSWORD!,
  })
  return agent
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getOzoneAgent = async (session: any) => {
  const agent = new BskyAgent({
    service: process.env.OZONE_SERVICE!,
  })
  await agent.resumeSession(session)
  return agent
}

export const did = process.env.LABELER_DID!

BskyAgent.configure({
  appLabelers: [did],
})
