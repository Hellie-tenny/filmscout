import { useEffect, useState } from 'react'
import { normalizeMedia } from '../types/media'
import type { MediaItem } from '../types/media'

type GenresMap = Record<number, string>

export type MediaWithProviders = MediaItem & {
  providers: string[]
  providerLogos: Record<string, string>
}

export default function useLanding() {
  const [featuredMovies, setFeaturedMovies] = useState<MediaWithProviders[]>([])
  const [featuredShows, setFeaturedShows] = useState<MediaWithProviders[]>([])
  const [movieGenres, setMovieGenres] = useState<GenresMap>({})
  const [tvGenres, setTvGenres] = useState<GenresMap>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const token = import.meta.env.VITE_TMDB_READ_TOKEN as string | undefined
    const apiKey = import.meta.env.VITE_TMDB_API_KEY as string | undefined

    const headers: Record<string, string> = { accept: 'application/json' }
    if (!apiKey && token) headers.Authorization = `Bearer ${token}`

    const buildUrl = (path: string, params?: Record<string, string>) => {
      const url = new URL(`https://api.themoviedb.org/3${path}`)
      if (apiKey) url.searchParams.set('api_key', apiKey)
      if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
      return url.toString()
    }

    const fetchProviders = async (id: number, mediaType: 'movie' | 'tv') => {
      try {
        const res = await fetch(buildUrl(`/${mediaType}/${id}/watch/providers`), { headers })
        if (!res.ok) return { providers: [], providerLogos: {} }
        const data = await res.json()
        const flatrate = data.results?.US?.flatrate ?? []
        return {
          providers: flatrate.map((p: any) => p.provider_name as string),
          providerLogos: Object.fromEntries(
            flatrate.map((p: any) => [p.provider_name, p.logo_path])
          ),
        }
      } catch {
        return { providers: [], providerLogos: {} }
      }
    }

    const fetchSection = async (mediaType: 'movie' | 'tv'): Promise<MediaWithProviders[]> => {
      const endpoint = mediaType === 'movie' ? '/discover/movie' : '/discover/tv'
      const res = await fetch(buildUrl(endpoint, {
        include_adult: 'false',
        language: 'en-US',
        page: '1',
        sort_by: 'primary_release_date.desc',
        'vote_average.gte': '7.0',
        'vote_count.gte': '200',
        with_watch_monetization_types: 'flatrate',
        watch_region: 'US',
      }), { headers })

      if (!res.ok) throw new Error(`TMDB error: ${res.status}`)
      const data = await res.json()
      const items = (data.results ?? []).slice(0, 5).map((r: any) => normalizeMedia(r, mediaType))

      const withProviders = await Promise.all(
        items.map(async (item: MediaItem) => {
          const p = await fetchProviders(item.id, mediaType)
          return { ...item, ...p }
        })
      )

      return withProviders
    }

    const fetchAll = async () => {
      setLoading(true)
      setError(null)

      try {
        const [movies, shows, movieGenresRes, tvGenresRes] = await Promise.all([
          fetchSection('movie'),
          fetchSection('tv'),
          fetch(buildUrl('/genre/movie/list'), { headers }).then((r) => r.json()),
          fetch(buildUrl('/genre/tv/list'), { headers }).then((r) => r.json()),
        ])

        setFeaturedMovies(movies)
        setFeaturedShows(shows)

        setMovieGenres(
          Object.fromEntries(
            (movieGenresRes.genres ?? []).map((g: any) => [g.id, g.name])
          )
        )
        setTvGenres(
          Object.fromEntries(
            (tvGenresRes.genres ?? []).map((g: any) => [g.id, g.name])
          )
        )
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load.')
      } finally {
        setLoading(false)
      }
    }

    fetchAll()
  }, [])

  return { featuredMovies, featuredShows, movieGenres, tvGenres, loading, error }
}