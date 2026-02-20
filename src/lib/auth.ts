export const COOKIE_NAME = 'admin_session'

export function getSessionSecret(): string {
  return process.env.ADMIN_SESSION_SECRET || ''
}

export function isValidToken(token: string): boolean {
  const secret = getSessionSecret()
  return secret !== '' && token === secret
}
