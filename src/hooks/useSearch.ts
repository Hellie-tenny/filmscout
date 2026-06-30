import { useEffect, useState } from 'react'
import { normalizeMedia } from '../types/media'
import type { MediaItem } from '../types/media'

export default function useSearch(query: string) {
  const [results, setResults] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const trimmed = query.trim()

    if (trimmed.length === 0) {
      setResults([])
      setError(null)
      setLoading(false)
      return
    }

    const token = import.meta.env.VITE_TMDB_READ_TOKEN as string | undefined
    const apiKey = import.meta.env.VITE_TMDB_API_KEY as string | undefined

    const headers: Record<string, string> = { accept: 'application/json' }
    if (!apiKey && token) headers.Authorization = `Bearer ${token}`

    // debounce
    const handle = setTimeout(async () => {
      setLoading(true)
      setError(null)

      try {
        const params = new URLSearchParams({
          query: trimmed,
          include_adult: 'false',
          language: 'en-US',
          page: '1',
        })
        if (apiKey) params.set('api_key', apiKey)

        const url = `https://api.themoviedb.org/3/search/multi?${params.toString()}`
        const res = await fetch(url, { headers })

        if (!res.ok) throw new Error(`TMDB error: ${res.status}`)

        const data = await res.json()

        // filter out people, keep only movie and tv results
        const filtered = (data.results ?? []).filter(
          (r: any) => r.media_type === 'movie' || r.media_type === 'tv'
        )

        const normalized: MediaItem[] = filtered.map((r: any) =>
          normalizeMedia(r, r.media_type)
        )

        setResults(normalized)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Search failed.')
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 450)

    return () => clearTimeout(handle)
  }, [query])

  return { results, loading, error }
}