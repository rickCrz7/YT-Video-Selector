export interface VideoItem {
  id: string
  youtubeId: string
  title: string
}

export interface Page {
  id: string
  title: string
  videos: VideoItem[]
}

export type ThemeMode = 'dark' | 'light'

export interface Settings {
  gridColumns: number
  showThumbnails: boolean
  showNumbers: boolean
  theme: ThemeMode
  fontSize: number
  sidebarVisible: boolean
  consentAccepted: boolean
}

export interface AppData {
  pages: Page[]
  settings?: Partial<Settings>
}
