import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Movie } from '../types/movie'

type RatedMovie = { movie: Movie; rating: number }

export function contentScore(
  movie: Movie,
  selectedGenreIds: number[],
  ratedMovies: RatedMovie[] = [],
  likedMovies: Movie[] = []
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
  ratedMoviesParam?: RatedMovie[],
  likedMoviesParam?: Movie[]
) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [movies, setMovies] = useState<Array<Movie & { score: number }>>([])
  const [refreshIndex, setRefreshIndex] = useState(0)

  

  const ratedMovies = useMemo(() => ratedMoviesParam ?? [], [ratedMoviesParam])
  const likedMovies = useMemo(() => likedMoviesParam ?? [], [likedMoviesParam])

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

    const hasToken = Boolean(token)
    const hasApiKey = Boolean(apiKey)
    const tokenLooksLikeV3 = token && /^[0-9a-fA-F]{32}$/.test(String(token))

    if (!token && !apiKey) {
      setError('TMDB token missing. Set VITE_TMDB_READ_TOKEN or VITE_TMDB_API_KEY and restart dev server.')
      setMovies([])
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const fetches = genreIds.map(async (gid) => {
        const params = new URLSearchParams({
          'vote_average.gte': '7.0',
          'vote_count.gte': '200',
          sort_by: 'vote_average.desc',
          language: 'en-US',
          page: '1',
          with_genres: String(gid),
        })

        // If an API key is provided (v3), use it as a query param. Otherwise use v4 Bearer token.
        if (apiKey) params.append('api_key', String(apiKey))

        const url = `https://api.themoviedb.org/3/discover/movie?${params.toString()}`
        const headers: Record<string, string> = { 'Content-Type': 'application/json' }
        if (!apiKey && token) headers.Authorization = `Bearer ${token}`

        const res = await fetch(url, { headers })

        if (!res.ok) {
          const text = await res.text()
          throw new Error(`TMDB error: ${res.status} ${text}`)
        }

        const data = await res.json()
        return (data.results || []) as Movie[]
      })

      const allResults = await Promise.all(fetches)

      const byId = new Map<number, Movie>()
      for (const list of allResults) {
        for (const m of list) {
          if (!byId.has(m.id)) byId.set(m.id, m)
        }
      }

      const unique = Array.from(byId.values())

      const scored = unique.map((m) => ({ ...m, score: contentScore(m, genreIds, ratedMovies, likedMovies) }))

      scored.sort((a, b) => b.score - a.score)

      setMovies(scored)
      setLoading(false)
    } catch (err: any) {
      setError(err?.message || String(err))
      setMovies([])
      setLoading(false)
    }
  }, [genreIds, ratedMovies, likedMovies])

  useEffect(() => {
    fetchMovies()
  }, [fetchMovies, refreshIndex])

  const refresh = useCallback(() => setRefreshIndex((s) => s + 1), [])

  return useMemo(() => ({ movies, loading, error, refresh }), [movies, loading, error, refresh])
}
