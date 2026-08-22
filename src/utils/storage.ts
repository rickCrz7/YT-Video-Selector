import type { AppData } from '../types'

const STORAGE_KEY = 'yt-video-selector-data'

export function loadData(): AppData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as AppData
  } catch {
    return null
  }
}

export function saveData(data: AppData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (e) {
    console.error('Failed to save data:', e)
  }
}

export function clearData(): void {
  localStorage.removeItem(STORAGE_KEY)
}

export function exportData(data: AppData): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'youtube-video-selector-backup.json'
  a.click()
  URL.revokeObjectURL(url)
}

export function importDataFromFile(file: File): Promise<AppData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result as string) as AppData
        if (!parsed.pages || !Array.isArray(parsed.pages)) {
          reject(new Error('Invalid file format'))
          return
        }
        resolve(parsed)
      } catch {
        reject(new Error('Could not parse JSON file'))
      }
    }
    reader.onerror = () => reject(new Error('Could not read file'))
    reader.readAsText(file)
  })
}
