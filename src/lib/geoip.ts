interface GeoResult {
  country: string
  region: string
  city: string
}

interface CacheEntry {
  data: GeoResult
  expiry: number
}

const cache = new Map<string, CacheEntry>()
const CACHE_TTL = 60 * 60 * 1000 // 1 hour

function isPrivateIp(ip: string): boolean {
  return (
    ip === '127.0.0.1' ||
    ip === '::1' ||
    ip === 'unknown' ||
    ip.startsWith('10.') ||
    ip.startsWith('192.168.') ||
    ip.startsWith('172.16.') ||
    ip.startsWith('172.17.') ||
    ip.startsWith('172.18.') ||
    ip.startsWith('172.19.') ||
    ip.startsWith('172.2') ||
    ip.startsWith('172.3') ||
    ip.startsWith('fe80:') ||
    ip.startsWith('fd') ||
    ip.startsWith('fc')
  )
}

export async function getGeoData(ip: string): Promise<GeoResult> {
  const empty: GeoResult = { country: '', region: '', city: '' }

  if (!ip || isPrivateIp(ip)) return empty

  const cached = cache.get(ip)
  if (cached && Date.now() < cached.expiry) return cached.data

  try {
    const res = await fetch(`http://ip-api.com/json/${ip}?fields=country,regionName,city`, {
      signal: AbortSignal.timeout(3000),
    })

    if (!res.ok) return empty

    const data = await res.json()
    const result: GeoResult = {
      country: data.country || '',
      region: data.regionName || '',
      city: data.city || '',
    }

    cache.set(ip, { data: result, expiry: Date.now() + CACHE_TTL })
    return result
  } catch {
    return empty
  }
}
