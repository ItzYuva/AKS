interface UAResult {
  device: 'mobile' | 'tablet' | 'desktop'
  browser: string
}

export function parseUserAgent(ua: string): UAResult {
  if (!ua) return { device: 'desktop', browser: 'Other' }

  const lowerUA = ua.toLowerCase()

  // Device detection
  let device: UAResult['device'] = 'desktop'
  if (/ipad|tablet|playbook|silk|(android(?!.*mobile))/i.test(ua)) {
    device = 'tablet'
  } else if (/mobile|iphone|ipod|android.*mobile|windows phone|blackberry|bb10|opera mini|opera mobi|iemobile/i.test(ua)) {
    device = 'mobile'
  }

  // Browser detection (order matters — check more specific first)
  let browser = 'Other'
  if (lowerUA.includes('edg/') || lowerUA.includes('edge/')) {
    browser = 'Edge'
  } else if (lowerUA.includes('opr/') || lowerUA.includes('opera')) {
    browser = 'Opera'
  } else if (lowerUA.includes('chrome/') && !lowerUA.includes('edg/')) {
    browser = 'Chrome'
  } else if (lowerUA.includes('firefox/')) {
    browser = 'Firefox'
  } else if (lowerUA.includes('safari/') && !lowerUA.includes('chrome/')) {
    browser = 'Safari'
  }

  return { device, browser }
}
