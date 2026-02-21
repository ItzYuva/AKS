import { NextResponse } from 'next/server';

const GITHUB_GRAPHQL_API = 'https://api.github.com/graphql';

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
`;

export async function GET() {
  try {
    const username = process.env.GITHUB_USERNAME || 'ItzYuva';
    const token = process.env.GITHUB_TOKEN;

    if (!token) {
      return NextResponse.json({ error: 'GitHub token not found' }, { status: 500 });
    }

    const variables = { username };

    const response = await fetch(GITHUB_GRAPHQL_API, {
      method: 'POST',
      headers: {
        'Authorization': `bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables }),
      cache: 'no-store'
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`GitHub API returned ${response.status}: ${errorText}`);
    }

    const { data, errors } = await response.json();

    if (errors) {
      throw new Error(errors.map((e: any) => e.message).join(', '));
    }

    // Get all days from the last 365 days
    const days = data.user.contributionsCollection.contributionCalendar.weeks
      .flatMap((week: any) => week.contributionDays);

    // Get local date string 'YYYY-MM-DD'
    const offset = new Date().getTimezoneOffset() * 60000;
    const todayStr = new Date(Date.now() - offset).toISOString().split('T')[0];

    // Filter to valid past days up to today
    const pastDays = days.filter((d: any) => d.date <= todayStr);

    // Take the last 30 days for our specific component
    const last30Days = pastDays.slice(-30).map((d: any) => ({
      date: d.date,
      count: d.contributionCount
    }));

    // Total contributions computation should be for the CURRENT YEAR exactly
    const currentYear = new Date().getFullYear().toString();
    const totalContributions = pastDays
      .filter((d: any) => d.date.startsWith(currentYear))
      .reduce((sum: number, day: any) => sum + day.contributionCount, 0);

    // Best Day in the last 30 days
    let bestDay = 0;
    for (const day of last30Days) {
      if (day.count > bestDay) {
        bestDay = day.count;
      }
    }

    // Current Streak
    let currentStreak = 0;
    for (let i = pastDays.length - 1; i >= 0; i--) {
      if (pastDays[i].contributionCount > 0) {
        currentStreak++;
      } else {
        if (i === pastDays.length - 1) continue; // Skip if today is 0
        break;
      }
    }

    return NextResponse.json({
      streak: currentStreak,
      totalContributions,
      bestDay,
      last30Days
    });
  } catch (error: any) {
    console.error('GitHub Activity API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

