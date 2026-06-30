import { useCallback, useEffect, useState } from 'react'
import type { MediaItem } from '../types/media'

const STORAGE_KEY = 'filmscout_watchlist'

function loadFromStorage(): MediaItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveToStorage(items: MediaItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {
    // localStorage may be unavailable (private mode, quota exceeded) — fail silently
  }
}

export default function useWatchlist() {
  const [watchlist, setWatchlist] = useState<MediaItem[]>([])

  // load once on mount
  useEffect(() => {
    setWatchlist(loadFromStorage())
  }, [])

  // keep other tabs/windows in sync
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        setWatchlist(loadFromStorage())
      }
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  const isInWatchlist = useCallback(
    (id: number) => watchlist.some((item) => item.id === id),
    [watchlist]
  )

  const addToWatchlist = useCallback((item: MediaItem) => {
    setWatchlist((current) => {
      if (current.some((m) => m.id === item.id)) return current
      const next = [...current, item]
      saveToStorage(next)
      return next
    })
  }, [])

  const removeFromWatchlist = useCallback((id: number) => {
    setWatchlist((current) => {
      const next = current.filter((m) => m.id !== id)
      saveToStorage(next)
      return next
    })
  }, [])

  const toggleWatchlist = useCallback((item: MediaItem) => {
    setWatchlist((current) => {
      const exists = current.some((m) => m.id === item.id)
      const next = exists
        ? current.filter((m) => m.id !== item.id)
        : [...current, item]
      saveToStorage(next)
      return next
    })
  }, [])

  return { watchlist, isInWatchlist, addToWatchlist, removeFromWatchlist, toggleWatchlist }
}