import axios, { AxiosRequestConfig, Method } from 'axios'

async function fetch(
  data: { type: string; name: string; content: string } | null,
  method: Method,
  params: string,
  zone: string,
  token: string
) {
  const url =
    'https://api.cloudflare.com/client/v4/zones/' +
    zone +
    '/dns_records' +
    params

  const c: AxiosRequestConfig = {
    url,
    method,
    data,
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token
    }
  }

  const res = await axios(c)

  if (res && res.data && method === 'GET') return res.data.result[0]
  if (res && res.data && method === 'PUT') return res.data.result

  return null
}

export async function updateDNS(
  TOKEN: string,
  ZONE_ID: string,
  CID: string,
  RECORD_DOMAIN: string,
  RECORD_NAME: string
) {
  if (!(TOKEN && ZONE_ID && CID && RECORD_DOMAIN && RECORD_NAME))
    throw new Error(
      ' Params TOKEN && ZONE_ID && CID && RECORD_DOMAIN && RECORD_NAME required'
    )

  try {
    const p = `?name=${RECORD_NAME}.${RECORD_DOMAIN}`
    const { id } = await fetch(null, 'GET', p, ZONE_ID, TOKEN)

    if (!id) throw new Error('Record does not exist')

    const data = await fetch(
      {
        type: 'TXT',
        name: RECORD_NAME + '.' + RECORD_DOMAIN,
        content: 'dnslink=/ipfs/' + CID
      },
      'PUT',
      '/' + id,
      ZONE_ID,
      TOKEN
    )

    if (!data) throw new Error('Could not update DNS link')

    return { updated: true, data: data }
  } catch (e) {
    console.log('Error fetching dns record: ', e)
    return { updated: false, data: null }
  }
}
