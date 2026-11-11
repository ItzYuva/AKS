'use client';

import { useEffect, useState } from 'react';
import { FaSpotify } from 'react-icons/fa';

interface Track {
  title: string;
  artist: string;
  url: string;
  albumArt?: string;
}

export default function SpotifyWidget() {
  const [track, setTrack] = useState<Track | null>(null);

  useEffect(() => {
    fetch('/api/spotify')
      .then((r) => r.json())
      .then((data) => {
        if (data.playing && data.track) setTrack(data.track);
      })
      .catch(() => {});
  }, []);

  if (!track) return null;

  return (
    <a
      href={track.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-2.5 py-1.5 text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
      aria-label={`Last played: ${track.title} by ${track.artist}`}
    >
      <FaSpotify className="w-[18px] h-[18px] text-[#1DB954] shrink-0" />
      <span className="text-zinc-500 dark:text-zinc-500">Last played</span>
      <span className="mx-0.5 text-zinc-300 dark:text-zinc-600">&mdash;</span>
      <span className="font-medium text-zinc-700 dark:text-zinc-200 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors truncate">
        {track.title}
      </span>
      <span className="text-zinc-400 dark:text-zinc-500 hidden sm:inline">
        &middot; {track.artist}
      </span>
    </a>
  );
}
