export type MediaType = 'movie' | 'tv'

export type MediaItem = {
  id: number
  title: string        // normalized — maps from 'name' for TV
  overview: string
  release_date: string // normalized — maps from 'first_air_date' for TV
  vote_average: number
  genre_ids: number[]
  poster_path: string | null
  media_type: MediaType
}

export const TMDB_POSTER_BASE = 'https://image.tmdb.org/t/p/w500'

// normalizes raw TMDB movie or TV response into MediaItem
export function normalizeMedia(raw: any, mediaType: MediaType): MediaItem {
  return {
    id: raw.id,
    title: raw.title ?? raw.name ?? 'Untitled',
    overview: raw.overview ?? '',
    release_date: raw.release_date ?? raw.first_air_date ?? '',
    vote_average: raw.vote_average ?? 0,
    genre_ids: raw.genre_ids ?? [],
    poster_path: raw.poster_path ?? null,
    media_type: mediaType,
  }
}