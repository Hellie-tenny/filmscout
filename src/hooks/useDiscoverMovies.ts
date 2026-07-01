import { useCallback, useEffect, useMemo, useState } from 'react'
import type { MediaItem } from '../types/media'
import mockMovies from '../mocks/mockMovies'

type RatedMovie = { movie: MediaItem; rating: number }

type Filters = {
  yearFrom: number | null
  yearTo: number | null
  adultContent: boolean
}


export function contentScore(
  movie: MediaItem,
  selectedGenreIds: number[],
  ratedMovies: RatedMovie[] = [],
  likedMovies: MediaItem[] = []
) {
  const selectedSet = new Set<number>(selectedGenreIds)

  const ratedHigh = new Set<number>()
  const ratedLow = new Set<number>()
  for (const r of ratedMovies) {
    for (const g of r.movie.genre_ids) {
      if (r.rating >= 4) ratedHigh.add(g)
      if (r.rating <= 2) ratedLow.add(g)
    }
  }

  const likedSet = new Set<number>()
  for (const m of likedMovies) {
    for (const g of m.genre_ids) likedSet.add(g)
  }

  let score = 0
  for (const g of movie.genre_ids) {
    if (ratedHigh.has(g)) score += 3
    if (likedSet.has(g)) score += 2
    if (ratedLow.has(g)) score -= 2
    if (selectedSet.has(g)) score += 1
  }

  score += 0.5 * (movie.vote_average || 0)

  return score
}

export default function useDiscoverMovies(
  genreIds: number[],
  mediaType: 'movie' | 'tv' = 'movie',
  ratedMoviesParam?: RatedMovie[],
  likedMoviesParam?: MediaItem[],
  filters?: Filters
) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [movies, setMovies] = useState<Array<MediaItem & { score: number }>>([])
  const [refreshIndex, setRefreshIndex] = useState(0)



  const ratedMovies = useMemo(() => ratedMoviesParam ?? [], [ratedMoviesParam])
  const likedMovies = useMemo<MediaItem[]>(() => likedMoviesParam ?? [], [likedMoviesParam])

  const fetchMovies = useCallback(async () => {

    if (!genreIds || genreIds.length === 0) {
      setMovies([])
      setError(null)
      setLoading(false)
      return
    }

    let token = import.meta.env.VITE_TMDB_READ_TOKEN
    let apiKey = import.meta.env.VITE_TMDB_API_KEY || import.meta.env.VITE_API_KEY || import.meta.env.API_KEY

    // If the READ_TOKEN env contains a v3-style API key (32 hex chars), treat it as apiKey
    if (!apiKey && token && /^[0-9a-fA-F]{32}$/.test(token)) {
      apiKey = token
      token = undefined
    }

    if (!token && !apiKey) {
      // In development, if no TMDB credentials are provided, fall back to a small
      // mock dataset so the app can run without external API keys.
      // Keep the original error message available in the UI if you prefer.
      setError(null)
      // Filter mock movies by requested genres when possible
      const filtered = mockMovies.filter((m) => m.genre_ids.some((g) => genreIds.includes(g)))
      const fallbackMovies = (filtered.length > 0 ? filtered : mockMovies).map((movie) => ({
        ...movie,
        media_type: mediaType,
        score: contentScore(movie, genreIds, ratedMovies, likedMovies),
      }))
      setMovies(fallbackMovies)
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const fetches = genreIds.map(async (gid) => {
        // const params = new URLSearchParams({
        //   'vote_average.gte': '7.0',
        //   'vote_count.gte': '200',
        //   sort_by: 'vote_average.desc',
        //   language: 'en-US',
        //   page: '1',
        //   with_genres: String(gid),
        // })

        const dateField = mediaType === 'movie' ? 'primary_release_date' : 'first_air_date'

        const params = new URLSearchParams({
          'vote_average.gte': '7.0',
          'vote_count.gte': '200',
          sort_by: 'vote_average.desc',
          language: 'en-US',
          page: '1',
          with_genres: String(gid),
          include_adult: filters?.adultContent ? 'true' : 'false',
        })

        if (filters?.yearFrom) {
          params.append(`${dateField}.gte`, `${filters.yearFrom}-01-01`)
        }
        if (filters?.yearTo) {
          params.append(`${dateField}.lte`, `${filters.yearTo}-12-31`)
        }

        // If an API key is provided (v3), use it as a query param. Otherwise use v4 Bearer token.
        if (apiKey) params.append('api_key', String(apiKey))

        const endpoint = mediaType === 'movie' ? 'movie' : 'tv'
        const url = `https://api.themoviedb.org/3/discover/${endpoint}?${params.toString()}`
        const headers: Record<string, string> = { 'Content-Type': 'application/json' }
        if (!apiKey && token) headers.Authorization = `Bearer ${token}`

        const res = await fetch(url, { headers })

        if (!res.ok) {
          const text = await res.text()
          throw new Error(`TMDB error: ${res.status} ${text}`)
        }

        const data = await res.json()
        return (data.results || []) as MediaItem[]
      })

      const allResults = await Promise.all(fetches)

      const byId = new Map<number, MediaItem>()
      for (const list of allResults) {
        for (const m of list) {
          if (!byId.has(m.id)) byId.set(m.id, m)
        }
      }

      const unique = Array.from(byId.values())

      const scored = unique.map((m) => ({ ...m, score: contentScore(m, genreIds, ratedMovies, likedMovies) }))

      scored.sort((a, b) => b.score - a.score)
      setMovies(scored.slice(0, 10))
      setLoading(false)
    } catch (err: any) {
      setError(err?.message || String(err))
      setMovies([])
      setLoading(false)
    }
  }, [genreIds, mediaType, ratedMovies, likedMovies, filters])

  useEffect(() => {
    fetchMovies()
  }, [fetchMovies, refreshIndex])

  const refresh = useCallback(() => setRefreshIndex((s) => s + 1), [])

  return useMemo(() => ({ movies, loading, error, refresh }), [movies, loading, error, refresh])
}
