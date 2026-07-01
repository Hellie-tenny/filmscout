import { useCallback, useEffect, useState } from 'react'
import type { MediaItem } from '../types/media'

const STORAGE_KEY = 'filmscout_disliked'

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
  } catch {}
}

export default function useDisliked() {
  const [disliked, setDisliked] = useState<MediaItem[]>([])

  useEffect(() => {
    setDisliked(loadFromStorage())
  }, [])

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setDisliked(loadFromStorage())
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  const isDisliked = useCallback(
    (id: number) => disliked.some((item) => item.id === id),
    [disliked]
  )

  const toggleDisliked = useCallback((item: MediaItem) => {
    setDisliked((current) => {
      const exists = current.some((m) => m.id === item.id)
      const next = exists
        ? current.filter((m) => m.id !== item.id)
        : [...current, item]
      saveToStorage(next)
      return next
    })
  }, [])

  return { disliked, isDisliked, toggleDisliked }
}