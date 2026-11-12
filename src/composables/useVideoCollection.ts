import { computed, onMounted, ref, watch } from 'vue'
import type { AppData, Page, Settings, ThemeMode, VideoItem } from '../types'
import { exportData, loadData, saveData } from '../utils/storage'
import { moveVideo } from '../utils/collection'
import { generateId } from '../utils/youtube'

export function useVideoCollection() {
  const data = ref<AppData>({ pages: [] })
  const activePageId = ref<string | null>(null)

  const defaultSettings: Settings = {
    gridColumns: 3,
    showThumbnails: true,
    showNumbers: true,
    theme: 'dark',
    fontSize: 16,
    sidebarVisible: true,
    consentAccepted: false,
  }

  const settings = ref<Settings>({ ...defaultSettings })

  const activePage = computed(() =>
    data.value.pages.find((p) => p.id === activePageId.value) ?? null
  )

  watch([data, settings], ([collection, preferences]) => {
    saveData({ ...collection, settings: preferences })
  }, { deep: true })

  watch(() => settings.value.theme, applyTheme)
  watch(() => settings.value.fontSize, applyFontSize)

  function applyTheme(theme: ThemeMode) {
    document.documentElement.setAttribute('data-theme', theme)
  }

  function applyFontSize(size: number) {
    document.documentElement.style.setProperty('--font-base', `${size}px`)
  }

  onMounted(() => {
    const loaded = loadData()
    if (loaded) {
      replaceCollection(loaded)
    } else {
      const seedPage: Page = {
        id: generateId(),
        title: 'My First Page',
        videos: [],
      }
      data.value = { pages: [seedPage] }
      activePageId.value = seedPage.id
    }
    applyTheme(settings.value.theme)
    applyFontSize(settings.value.fontSize)
  })

  function selectPage(id: string) {
    activePageId.value = id
  }

  function addPage() {
    const newPage: Page = {
      id: generateId(),
      title: 'New Page',
      videos: [],
    }
    data.value.pages.push(newPage)
    activePageId.value = newPage.id
  }

  function renamePage(id: string, newTitle: string) {
    const page = data.value.pages.find((p) => p.id === id)
    if (page) page.title = newTitle
  }

  function replaceCollection(collection: AppData) {
    data.value = { pages: collection.pages }
    if (collection.settings) {
      settings.value = { ...defaultSettings, ...collection.settings }
    }
    activePageId.value = collection.pages[0]?.id ?? null
  }

  function removePage(id: string) {
    data.value.pages = data.value.pages.filter((page) => page.id !== id)
    if (activePageId.value === id) {
      activePageId.value = data.value.pages[0]?.id ?? null
    }
  }

  function addVideo(video: VideoItem) {
    if (!activePage.value) return
    activePage.value.videos.push(video)
  }

  function renameVideo(videoId: string, newTitle: string) {
    if (!activePage.value) return
    const video = activePage.value.videos.find((v) => v.id === videoId)
    if (video) video.title = newTitle
  }

  function removeVideo(pageId: string, videoId: string) {
    const page = data.value.pages.find((page) => page.id === pageId)
    if (page) page.videos = page.videos.filter((video) => video.id !== videoId)
  }

  function reorderVideos(fromId: string, toId: string) {
    if (activePage.value) moveVideo(activePage.value.videos, fromId, toId)
  }

  function handleExport() {
    exportData({ ...data.value, settings: settings.value })
  }

  function resetCollection() {
    replaceCollection({ pages: [] })
  }

  function toggleSidebar() {
    settings.value.sidebarVisible = !settings.value.sidebarVisible
  }

  function updateSettings(partial: Partial<Settings>) {
    settings.value = { ...settings.value, ...partial }
  }

  function acceptConsent() {
    settings.value.consentAccepted = true
  }

  return {
    data, activePageId, activePage, settings,
    selectPage, addPage, renamePage, removePage,
    addVideo, removeVideo, renameVideo, reorderVideos,
    handleExport, replaceCollection, resetCollection,
    toggleSidebar, updateSettings, acceptConsent,
  }
}
