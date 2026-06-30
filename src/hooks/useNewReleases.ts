import { useCallback, useEffect, useState } from 'react'
import { normalizeMedia } from '../types/media'
import type { MediaItem, MediaType } from '../types/media'

export default function useNewReleases(genreId: number | null, mediaType: MediaType) {
  const [movies, setMovies] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchReleases = useCallback(async () => {
    if (!genreId) {
      setMovies([])
      setError(null)
      setLoading(false)
      return
    }

    const token = import.meta.env.VITE_TMDB_READ_TOKEN as string | undefined
    const apiKey = import.meta.env.VITE_TMDB_API_KEY as string | undefined

    const headers: Record<string, string> = { accept: 'application/json' }
    if (!apiKey && token) headers.Authorization = `Bearer ${token}`

    setLoading(true)
    setError(null)

    try {
      const endpoint = mediaType === 'movie' ? '/discover/movie' : '/discover/tv'
      const dateField = mediaType === 'movie' ? 'primary_release_date' : 'first_air_date'

      // "new" window: last 45 days
      const today = new Date()
      const past = new Date()
      past.setDate(today.getDate() - 45)

      const formatDate = (d: Date) => d.toISOString().slice(0, 10)

      const params = new URLSearchParams({
        language: 'en-US',
        page: '1',
        sort_by: `${dateField}.desc`,
        with_genres: String(genreId),
        with_watch_monetization_types: 'flatrate',
        watch_region: 'US',
        [`${dateField}.gte`]: formatDate(past),
        [`${dateField}.lte`]: formatDate(today),
      })

      if (apiKey) params.set('api_key', apiKey)

      const url = `https://api.themoviedb.org/3${endpoint}?${params.toString()}`
      const res = await fetch(url, { headers })

      if (!res.ok) {
        throw new Error(`TMDB error: ${res.status}`)
      }

      const data = await res.json()
      const items: MediaItem[] = (data.results ?? [])
        .slice(0, 12)
        .map((r: any) => normalizeMedia(r, mediaType))

      setMovies(items)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load new releases.')
      setMovies([])
    } finally {
      setLoading(false)
    }
  }, [genreId, mediaType])

  useEffect(() => {
    fetchReleases()
  }, [fetchReleases])

  return { movies, loading, error }
}