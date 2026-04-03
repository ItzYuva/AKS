import crypto from 'crypto'

const salt = process.env.IP_HASH_SALT || 'default-analytics-salt-aks-portfolio'

export function hashIp(ip: string): string {
  return crypto.createHash('sha256').update(ip + salt).digest('hex')
}
