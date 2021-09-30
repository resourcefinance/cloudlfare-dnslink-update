import * as core from '@actions/core'
import { updateDNS } from './dns'

async function run(): Promise<void> {
  try {
    const TOKEN = core.getInput('TOKEN', { required: true })
    const ZONE_ID = core.getInput('ZONE_ID', { required: true })
    const CID = core.getInput('CID', { required: true })
    const RECORD_DOMAIN = core.getInput('RECORD_DOMAIN', { required: true })
    const RECORD_NAME = core.getInput('RECORD_NAME', { required: true })

    const { updated, data } = await updateDNS(
      TOKEN,
      ZONE_ID,
      CID,
      RECORD_DOMAIN,
      RECORD_NAME
    )

    if (!updated) throw new Error('Could not update DNS')

    console.log(
      'Update DNSLINK records in Cloudflare finished successfully: ',
      data.content
    )
  } catch (e: any) {
    core.setFailed(e.message)
  }
}

run().catch(e => console.log('Error: ', e))
