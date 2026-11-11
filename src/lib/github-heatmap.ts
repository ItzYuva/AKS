const GITHUB_GRAPHQL_API = 'https://api.github.com/graphql';

const HEATMAP_QUERY = `
query($username: String!, $from: DateTime!, $to: DateTime!) {
  user(login: $username) {
    contributionsCollection(from: $from, to: $to) {
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays {
            date
            contributionCount
            weekday
          }
        }
      }
    }
  }
}
`;

export interface HeatmapDay {
  date: string;
  count: number;
  weekday: number;
}

export interface HeatmapWeek {
  days: HeatmapDay[];
}

export interface HeatmapData {
  weeks: HeatmapWeek[];
  totalContributions: number;
  error?: string;
}

export async function getGitHubHeatmap(): Promise<HeatmapData> {
  const empty: HeatmapData = { weeks: [], totalContributions: 0 };

  try {
    const username = process.env.GITHUB_USERNAME || 'ItzYuva';
    const token = process.env.GITHUB_TOKEN?.trim();

    if (!token) {
      return { ...empty, error: 'GitHub token not found' };
    }

    const now = new Date();
    const to = now.toISOString();
    const oneYearAgo = new Date(now);
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    const from = oneYearAgo.toISOString();

    const response = await fetch(GITHUB_GRAPHQL_API, {
      method: 'POST',
      headers: {
        Authorization: `bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: HEATMAP_QUERY,
        variables: { username, from, to },
      }),
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`GitHub API returned ${response.status}`);
    }

    const json = await response.json();

    if (json.errors) {
      throw new Error(
        json.errors
          .map((e: { message: string }) => e.message)
          .join(', ')
      );
    }

    const calendar =
      json.data.user.contributionsCollection.contributionCalendar;

    const weeks: HeatmapWeek[] = calendar.weeks.map(
      (week: {
        contributionDays: {
          date: string;
          contributionCount: number;
          weekday: number;
        }[];
      }) => ({
        days: week.contributionDays.map(
          (day: {
            date: string;
            contributionCount: number;
            weekday: number;
          }) => ({
            date: day.date,
            count: day.contributionCount,
            weekday: day.weekday,
          })
        ),
      })
    );

    return {
      weeks,
      totalContributions: calendar.totalContributions,
    };
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Failed to fetch';
    if (typeof globalThis.process !== 'undefined') {
      console.warn('[heatmap]', msg);
    }
    return { ...empty, error: msg };
  }
}
