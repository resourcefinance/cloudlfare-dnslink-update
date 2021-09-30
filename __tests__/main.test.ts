import { updateDNS } from '../src/dns'
import { expect, test } from '@jest/globals'

test('updates dns via Cloudflare', async () => {
  const CID = process.env.CID ?? null
  const RECORD_DOMAIN = process.env.RECORD_DOMAIN ?? null
  const RECORD_NAME = process.env.RECORD_NAME ?? null
  const ZONE_ID = process.env.ZONE_ID ?? null
  const TOKEN = process.env.TOKEN ?? null

  const { updated, data } = await updateDNS(
    TOKEN,
    ZONE_ID,
    CID,
    RECORD_DOMAIN,
    RECORD_NAME
  )

  expect(updated).toBeDefined()
  expect(data).toHaveProperty('content', 'dnslink=/ipfs/' + CID)
})
