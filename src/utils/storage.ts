import type { AppData, Page, Settings, VideoItem } from '../types'

const STORAGE_KEY = 'yt-video-selector-data'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isVideo(value: unknown): value is VideoItem {
  return isRecord(value)
    && typeof value.id === 'string'
    && typeof value.youtubeId === 'string'
    && typeof value.title === 'string'
}

function isPage(value: unknown): value is Page {
  return isRecord(value)
    && typeof value.id === 'string'
    && typeof value.title === 'string'
    && Array.isArray(value.videos)
    && value.videos.every(isVideo)
}

function readSettings(value: Record<string, unknown>): Partial<Settings> {
  const { gridColumns, showThumbnails, showNumbers, theme, fontSize, sidebarVisible, consentAccepted } = value
  const settings: Partial<Settings> = {}

  if (typeof gridColumns === 'number' && Number.isInteger(gridColumns) && gridColumns >= 2 && gridColumns <= 6) {
    settings.gridColumns = gridColumns
  }
  if (typeof showThumbnails === 'boolean') settings.showThumbnails = showThumbnails
  if (typeof showNumbers === 'boolean') settings.showNumbers = showNumbers
  if (theme === 'dark' || theme === 'light') settings.theme = theme
  if (typeof fontSize === 'number' && Number.isFinite(fontSize) && fontSize > 0) settings.fontSize = fontSize
  if (typeof sidebarVisible === 'boolean') settings.sidebarVisible = sidebarVisible
  if (typeof consentAccepted === 'boolean') settings.consentAccepted = consentAccepted

  return settings
}

function parseCollection(raw: string): AppData {
  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    throw new Error('Could not parse JSON file')
  }
  if (!isRecord(parsed) || !Array.isArray(parsed.pages) || !parsed.pages.every(isPage)) {
    throw new Error('Invalid file format')
  }
  const { settings } = parsed
  if (settings !== undefined && !isRecord(settings)) {
    throw new Error('Invalid file format')
  }
  return settings === undefined
    ? { pages: parsed.pages }
    : { pages: parsed.pages, settings: readSettings(settings) }
}

export function loadData(): AppData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? parseCollection(raw) : null
  } catch {
    return null
  }
}

export function saveData(data: AppData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    console.error('Failed to save data:', error)
  }
}

export function exportData(data: AppData): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'youtube-video-selector-backup.json'
  link.click()
  URL.revokeObjectURL(url)
}

export async function importDataFromFile(file: File): Promise<AppData> {
  let raw: string
  try {
    raw = await file.text()
  } catch {
    throw new Error('Could not read file')
  }
  return parseCollection(raw)
}
