import { did } from '../agent.js'
import { BskyAgent } from '@atproto/api'
import { logger } from './logger.js'

const atprotoProxy = process.env.ATPROTO_PROXY!

export async function emitNewLabel(agent: BskyAgent, subject: string, newLabel: string) {
  logger.info(`Emitting new label for ${subject} with ${newLabel}`)
  return await agent.api.tools.ozone.moderation.emitEvent(
    {
      event: {
        $type: 'tools.ozone.moderation.defs#modEventLabel',
        createLabelVals: [newLabel],
        negateLabelVals: [],
      },
      subject: {
        $type: 'com.atproto.admin.defs#repoRef',
        did: subject,
      },
      createdBy: did,
      subjectBlobCids: [],
    },
    {
      headers: {
        'atproto-proxy': atprotoProxy,
      },
    },
  )
}

export async function emitRemovalLabel(
  agent: BskyAgent,
  subject: string,
  labelsToRemove: string[],
) {
  logger.info(`Emitting remove label for ${subject} with ${labelsToRemove.toString()}`)
  return await agent.api.tools.ozone.moderation.emitEvent(
    {
      event: {
        $type: 'tools.ozone.moderation.defs#modEventLabel',
        createLabelVals: [],
        negateLabelVals: labelsToRemove,
      },
      subject: {
        $type: 'com.atproto.admin.defs#repoRef',
        did: subject,
      },
      createdBy: did,
      subjectBlobCids: [],
    },
    {
      headers: {
        'atproto-proxy': atprotoProxy,
      },
    },
  )
}
