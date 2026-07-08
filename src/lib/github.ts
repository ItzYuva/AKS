const GITHUB_GRAPHQL_API = 'https://api.github.com/graphql'

const query = `
query($username: String!) {
  user(login: $username) {
    contributionsCollection {
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays {
            date
            contributionCount
          }
        }
      }
    }
  }
}
`

export interface DayActivity {
  date: string
  count: number
}

export interface GitHubActivityData {
  streak: number
  totalContributions: number
  bestDay: number
  last30Days: DayActivity[]
  error?: string
}

/**
 * Fetches GitHub contribution activity. The upstream GitHub response is cached
 * for 1 hour (revalidate), so visitors never trigger a live GitHub API call on
 * page load — the data is served from cache and refreshed in the background.
 */
export async function getGitHubActivity(): Promise<GitHubActivityData> {
  const empty: GitHubActivityData = { streak: 0, totalContributions: 0, bestDay: 0, last30Days: [] }

  try {
    const username = process.env.GITHUB_USERNAME || 'ItzYuva'
    const token = process.env.GITHUB_TOKEN

    if (!token) {
      return { ...empty, error: 'GitHub token not found' }
    }

    const response = await fetch(GITHUB_GRAPHQL_API, {
      method: 'POST',
      headers: {
        'Authorization': `bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables: { username } }),
      next: { revalidate: 3600 },
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`GitHub API returned ${response.status}: ${errorText}`)
    }

    const { data, errors } = await response.json()

    if (errors) {
      throw new Error(errors.map((e: { message: string }) => e.message).join(', '))
    }

    const days: { date: string; contributionCount: number }[] =
      data.user.contributionsCollection.contributionCalendar.weeks.flatMap(
        (week: { contributionDays: { date: string; contributionCount: number }[] }) => week.contributionDays
      )

    const offset = new Date().getTimezoneOffset() * 60000
    const todayStr = new Date(Date.now() - offset).toISOString().split('T')[0]

    const pastDays = days.filter((d) => d.date <= todayStr)

    const last30Days = pastDays.slice(-30).map((d) => ({
      date: d.date,
      count: d.contributionCount,
    }))

    const currentYear = new Date().getFullYear().toString()
    const totalContributions = pastDays
      .filter((d) => d.date.startsWith(currentYear))
      .reduce((sum, day) => sum + day.contributionCount, 0)

    let bestDay = 0
    for (const day of last30Days) {
      if (day.count > bestDay) bestDay = day.count
    }

    let streak = 0
    for (let i = pastDays.length - 1; i >= 0; i--) {
      if (pastDays[i].contributionCount > 0) {
        streak++
      } else {
        if (i === pastDays.length - 1) continue // Skip if today is 0
        break
      }
    }

    return { streak, totalContributions, bestDay, last30Days }
  } catch (error) {
    console.error('GitHub Activity fetch error:', error)
    return { ...empty, error: error instanceof Error ? error.message : 'Internal Server Error' }
  }
}
