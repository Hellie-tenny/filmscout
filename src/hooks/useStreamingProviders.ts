import { useEffect, useState } from 'react'

type Provider = {
    provider_id: number
    provider_name: string
    logo_path: string
}

type ProvidersMap = Record<number, Provider[]>

const REGION = 'US'

export default function useStreamingProviders(movieIds: number[]) {
    const [providers, setProviders] = useState<ProvidersMap>({})
    const [loadingProviders, setLoadingProviders] = useState(false)

    const movieIdsKey = movieIds.join(',')  // ← up here, outside useEffect

    useEffect(() => {
        if (movieIds.length === 0) {
            setProviders({})
            return
        }

        const token = import.meta.env.VITE_TMDB_READ_TOKEN as string | undefined
        const apiKey = import.meta.env.VITE_TMDB_API_KEY as string | undefined

        const fetchProviders = async () => {
            setLoadingProviders(true)

            const results = await Promise.allSettled(
                movieIds.map(async (id) => {
                    const params = new URLSearchParams()
                    if (apiKey) params.set('api_key', apiKey)

                    const url = `https://api.themoviedb.org/3/movie/${id}/watch/providers?${params.toString()}`
                    const headers: Record<string, string> = { accept: 'application/json' }
                    if (!apiKey && token) headers.Authorization = `Bearer ${token}`

                    const res = await fetch(url, { headers })
                    if (!res.ok) return { id, list: [] }

                    const data = await res.json()
                    const regionData = data.results?.[REGION]
                    const list: Provider[] = regionData?.flatrate ?? []
                    return { id, list }
                })
            )

            const map: ProvidersMap = {}
            for (const result of results) {
                if (result.status === 'fulfilled') {
                    map[result.value.id] = result.value.list
                }
            }

            setProviders(map)
            setLoadingProviders(false)
        }

        fetchProviders()
    }, [movieIdsKey])  // ← used here

    return { providers, loadingProviders }
}