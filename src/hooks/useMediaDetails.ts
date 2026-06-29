import { useEffect, useState } from 'react'
import { normalizeMedia } from '../types/media'
import type { MediaItem, MediaType } from '../types/media'

type Provider = {
  provider_name: string
  logo_path: string
}

export type MediaDetails = MediaItem & {
  backdrop_path: string | null
  runtime?: number        // movies
  number_of_seasons?: number  // tv
  tagline?: string
  providers: Provider[]
  trailerKey: string | null
  recommendations: MediaItem[]
}

export default function useMediaDetails(id: number | null, mediaType: MediaType) {
  const [details, setDetails] = useState<MediaDetails | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) {
      setDetails(null)
      return
    }

    const token = import.meta.env.VITE_TMDB_READ_TOKEN as string | undefined
    const apiKey = import.meta.env.VITE_TMDB_API_KEY as string | undefined

    const headers: Record<string, string> = { accept: 'application/json' }
    if (!apiKey && token) headers.Authorization = `Bearer ${token}`

    const buildUrl = (path: string) => {
      const url = new URL(`https://api.themoviedb.org/3${path}`)
      if (apiKey) url.searchParams.set('api_key', apiKey)
      return url.toString()
    }

    const fetchDetails = async () => {
      setLoading(true)
      setError(null)

      try {
        const endpoint = mediaType === 'movie' ? 'movie' : 'tv'

        const [detailsRes, providersRes, videosRes, recommendationsRes] = await Promise.all([
          fetch(buildUrl(`/${endpoint}/${id}`), { headers }),
          fetch(buildUrl(`/${endpoint}/${id}/watch/providers`), { headers }),
          fetch(buildUrl(`/${endpoint}/${id}/videos`), { headers }),
          fetch(buildUrl(`/${endpoint}/${id}/recommendations`), { headers }),
        ])

        const [detailsData, providersData, videosData, recommendationsData] = await Promise.all([
          detailsRes.json(),
          providersRes.json(),
          videosRes.json(),
          recommendationsRes.json(),
        ])

        // streaming providers
        const flatrate: Provider[] = providersData.results?.US?.flatrate ?? []

        // trailer — find official YouTube trailer first, fall back to any teaser
        const videos = videosData.results ?? []
        const trailer =
          videos.find((v: any) => v.type === 'Trailer' && v.site === 'YouTube' && v.official) ??
          videos.find((v: any) => v.type === 'Trailer' && v.site === 'YouTube') ??
          videos.find((v: any) => v.site === 'YouTube') ??
          null

        // recommendations
        const recs: MediaItem[] = (recommendationsData.results ?? [])
          .slice(0, 6)
          .map((r: any) => normalizeMedia(r, mediaType))

        setDetails({
          ...normalizeMedia(detailsData, mediaType),
          backdrop_path: detailsData.backdrop_path ?? null,
          runtime: detailsData.runtime,
          number_of_seasons: detailsData.number_of_seasons,
          tagline: detailsData.tagline,
          providers: flatrate,
          trailerKey: trailer?.key ?? null,
          recommendations: recs,
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load details.')
      } finally {
        setLoading(false)
      }
    }

    fetchDetails()
  }, [id, mediaType])

  return { details, loading, error }
}