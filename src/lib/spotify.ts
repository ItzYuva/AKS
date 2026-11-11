const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';
const RECENTLY_PLAYED_ENDPOINT =
  'https://api.spotify.com/v1/me/player/recently-played?limit=1';

async function getAccessToken(): Promise<string | null> {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) return null;

  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  const res = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  });

  if (!res.ok) return null;

  const data = await res.json();
  return data.access_token ?? null;
}

export interface SpotifyTrack {
  title: string;
  artist: string;
  url: string;
  albumArt?: string;
}

export async function getLastPlayed(): Promise<SpotifyTrack | null> {
  try {
    const token = await getAccessToken();
    if (!token) return null;

    const res = await fetch(RECENTLY_PLAYED_ENDPOINT, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 120 },
    });

    if (!res.ok) return null;

    const data = await res.json();
    const item = data.items?.[0]?.track;
    if (!item) return null;

    return {
      title: item.name,
      artist: item.artists.map((a: { name: string }) => a.name).join(', '),
      url: item.external_urls.spotify,
      albumArt: item.album.images?.[2]?.url ?? item.album.images?.[0]?.url,
    };
  } catch {
    return null;
  }
}
