<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import type { AppData, Page, VideoItem, Settings, ThemeMode } from './types'
import { generateId } from './utils/youtube'
import { loadData, saveData, clearData, exportData, importDataFromFile } from './utils/storage'
import Sidebar from './components/Sidebar.vue'
import AddVideoForm from './components/AddVideoForm.vue'
import VideoCard from './components/VideoCard.vue'
import PlayerModal from './components/PlayerModal.vue'
import SettingsModal from './components/SettingsModal.vue'
import LegalModal from './components/LegalModal.vue'
import ConsentBanner from './components/ConsentBanner.vue'

const data = ref<AppData>({ pages: [] })
const activePageId = ref<string | null>(null)
const playingVideo = ref<VideoItem | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

const editMode = ref(false)
const showSettings = ref(false)
const showLegal = ref(false)
const legalTab = ref<'privacy' | 'terms'>('privacy')

const defaultSettings: Settings = {
  gridColumns: 3,
  showThumbnails: true,
  theme: 'dark',
  fontSize: 16,
  sidebarVisible: true,
  consentAccepted: false,
}

const settings = ref<Settings>({ ...defaultSettings })

const activePage = computed(() =>
  data.value.pages.find((p) => p.id === activePageId.value) ?? null
)

watch(data, (newData) => {
  saveData({ ...newData, settings: settings.value })
}, { deep: true })

watch(settings, (newSettings) => {
  applyTheme(newSettings.theme)
  applyFontSize(newSettings.fontSize)
  saveData({ ...data.value, settings: newSettings })
}, { deep: true })

function applyTheme(theme: ThemeMode) {
  document.documentElement.setAttribute('data-theme', theme)
}

function applyFontSize(size: number) {
  document.documentElement.style.setProperty('--font-base', `${size}px`)
}

onMounted(() => {
  const loaded = loadData()
  if (loaded) {
    data.value = { pages: loaded.pages }
    if (loaded.settings) {
      settings.value = { ...defaultSettings, ...loaded.settings }
    }
    if (loaded.pages.length > 0) {
      activePageId.value = loaded.pages[0].id
    }
  } else {
    const seedPage: Page = {
      id: generateId(),
      title: 'My First Page',
      videos: [
        { id: generateId(), youtubeId: 'dQw4w9WgXcQ', title: 'Rick Astley - Never Gonna Give You Up' },
      ],
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

function renamePage(id: string) {
  const page = data.value.pages.find((p) => p.id === id)
  if (!page) return
  const newName = window.prompt('Rename page:', page.title)
  if (newName !== null && newName.trim()) {
    page.title = newName.trim()
  }
}

function removePage(id: string) {
  const page = data.value.pages.find((p) => p.id === id)
  if (!page) return
  if (!window.confirm(`Delete page "${page.title}" and all its videos?`)) return
  data.value.pages = data.value.pages.filter((p) => p.id !== id)
  if (activePageId.value === id) {
    activePageId.value = data.value.pages[0]?.id ?? null
  }
}

function addVideo(video: VideoItem) {
  if (!activePage.value) return
  activePage.value.videos.push(video)
}

function removeVideo(videoId: string) {
  if (!activePage.value) return
  activePage.value.videos = activePage.value.videos.filter((v) => v.id !== videoId)
}

function renameVideo(videoId: string, newTitle: string) {
  if (!activePage.value) return
  const video = activePage.value.videos.find((v) => v.id === videoId)
  if (video) video.title = newTitle
}

function playVideo(video: VideoItem) {
  playingVideo.value = video
}

function closePlayer() {
  playingVideo.value = null
}

function handleExport() {
  exportData({ ...data.value, settings: settings.value })
}

function triggerImport() {
  fileInput.value?.click()
}

async function handleImport(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  try {
    const imported = await importDataFromFile(file)
    if (!window.confirm('Importing will replace your current collection. Continue?')) {
      input.value = ''
      return
    }
    data.value = { pages: imported.pages }
    if (imported.settings) {
      settings.value = { ...defaultSettings, ...imported.settings }
    }
    activePageId.value = imported.pages[0]?.id ?? null
  } catch (e) {
    window.alert((e as Error).message)
  }
  input.value = ''
}

function handleReset() {
  if (!window.confirm('This will delete ALL pages and videos. This cannot be undone. Continue?')) return
  clearData()
  data.value = { pages: [] }
  activePageId.value = null
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

function openLegal(tab: 'privacy' | 'terms') {
  legalTab.value = tab
  showLegal.value = true
}

const gridStyle = computed(() => ({
  gridTemplateColumns: `repeat(${settings.value.gridColumns}, 1fr)`,
}))

// Drag and drop reordering
const draggedVideoId = ref<string | null>(null)
const dragOverVideoId = ref<string | null>(null)

function onVideoDragStart(videoId: string) {
  draggedVideoId.value = videoId
}

function onVideoDragEnd() {
  draggedVideoId.value = null
  dragOverVideoId.value = null
}

function onVideoDragOver(videoId: string) {
  if (draggedVideoId.value && draggedVideoId.value !== videoId) {
    dragOverVideoId.value = videoId
  }
}

function onVideoDrop(videoId: string) {
  if (!draggedVideoId.value || !activePage.value) return
  const videos = activePage.value.videos
  const fromIdx = videos.findIndex((v) => v.id === draggedVideoId.value)
  const toIdx = videos.findIndex((v) => v.id === videoId)
  if (fromIdx === -1 || toIdx === -1 || fromIdx === toIdx) {
    draggedVideoId.value = null
    dragOverVideoId.value = null
    return
  }
  const [moved] = videos.splice(fromIdx, 1)
  videos.splice(toIdx, 0, moved)
  draggedVideoId.value = null
  dragOverVideoId.value = null
}
</script>

<template>
  <div class="app-layout">
    <Sidebar
      v-show="settings.sidebarVisible"
      :pages="data.pages"
      :active-page-id="activePageId"
      :editable="editMode"
      @select="selectPage"
      @add="addPage"
      @rename="renamePage"
      @remove="removePage"
    />

    <main class="main-content">
      <header class="top-bar" :class="{ presenting: !editMode }">
        <div class="top-bar-left">
          <button class="icon-toggle" @click="toggleSidebar" :title="settings.sidebarVisible ? 'Hide sidebar' : 'Show sidebar'">
            <svg viewBox="0 0 24 24" width="20" height="20"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" /></svg>
          </button>
        </div>
        <div class="top-bar-center">
          <h1 v-if="activePage" class="page-title">{{ activePage.title }}</h1>
          <h1 v-else class="page-title muted">No page selected</h1>
        </div>
        <div class="top-bar-right">
          <template v-if="editMode">
            <div class="control-group">
              <label class="control-label">Grid</label>
              <select v-model.number="settings.gridColumns" class="select-input">
                <option :value="2">2</option>
                <option :value="3">3</option>
                <option :value="4">4</option>
                <option :value="5">5</option>
                <option :value="6">6</option>
              </select>
            </div>
            <button
              class="toggle-btn"
              :class="{ active: settings.showThumbnails }"
              @click="settings.showThumbnails = !settings.showThumbnails"
              :title="settings.showThumbnails ? 'Hide thumbnails' : 'Show thumbnails'"
            >
              <svg viewBox="0 0 24 24" width="18" height="18"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" /></svg>
            </button>
            <button class="toolbar-btn" @click="handleExport">Export</button>
            <button class="toolbar-btn" @click="triggerImport">Import</button>
            <button class="toolbar-btn danger" @click="handleReset">Reset</button>
            <input
              ref="fileInput"
              type="file"
              accept="application/json,.json"
              class="hidden-input"
              @change="handleImport"
            />
          </template>
          <button class="icon-toggle" @click="showSettings = true" title="Settings">
            <svg viewBox="0 0 24 24" width="20" height="20"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94 0 .31.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" /></svg>
          </button>
          <button
            class="mode-toggle"
            :class="{ presenting: !editMode }"
            @click="editMode = !editMode"
          >
            {{ editMode ? 'Present' : 'Edit' }}
          </button>
        </div>
      </header>

      <div v-if="activePage" class="page-content">
        <AddVideoForm v-if="editMode" @add="addVideo" />

        <div v-if="activePage.videos.length > 0" class="video-grid" :style="gridStyle">
          <VideoCard
            v-for="video in activePage.videos"
            :key="video.id"
            :video="video"
            :show-thumbnail="settings.showThumbnails"
            :editable="editMode"
            :dragging="draggedVideoId === video.id"
            :is-drag-over="dragOverVideoId === video.id"
            @play="playVideo(video)"
            @remove="removeVideo(video.id)"
            @rename="(newTitle: string) => renameVideo(video.id, newTitle)"
            @dragstart="onVideoDragStart(video.id)"
            @dragend="onVideoDragEnd"
            @dragover="onVideoDragOver(video.id)"
            @drop="onVideoDrop(video.id)"
          />
        </div>
        <div v-else class="empty-state">
          <p>No videos on this page yet.</p>
          <p v-if="editMode" class="empty-hint">Paste a YouTube link above to get started.</p>
        </div>
      </div>

      <div v-else class="empty-state">
        <p>No pages yet.</p>
        <p class="empty-hint">Use the + button in the sidebar to create a page.</p>
      </div>
    </main>

    <PlayerModal :video="playingVideo" @close="closePlayer" />
    <SettingsModal
      v-if="showSettings"
      :settings="settings"
      @close="showSettings = false"
      @update="updateSettings"
    />
    <LegalModal
      v-if="showLegal"
      :initial-tab="legalTab"
      @close="showLegal = false"
    />
    <ConsentBanner
      v-if="!settings.consentAccepted"
      @accept="acceptConsent"
      @learn-more="openLegal('privacy')"
    />
    <footer class="app-footer">
      <button class="footer-link" @click="openLegal('privacy')">Privacy Policy</button>
      <span class="footer-sep">·</span>
      <button class="footer-link" @click="openLegal('terms')">Terms of Service</button>
      <span class="footer-sep">·</span>
      <span class="footer-license">Open-source under MIT License</span>
    </footer>
  </div>
</template>

<style scoped>
.app-layout {
  display: flex;
  min-height: 100vh;
}
.main-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}
.top-bar {
  display: flex;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  background: var(--bg);
  z-index: 10;
  gap: 12px;
  flex-wrap: wrap;
}
.top-bar.presenting {
  justify-content: space-between;
}
.top-bar-left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}
.top-bar-center {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
.top-bar:not(.presenting) .top-bar-center {
  display: none;
}
.top-bar:not(.presenting) .top-bar-left {
  gap: 12px;
}
.top-bar:not(.presenting) .page-title {
  display: none;
}
.top-bar-right {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  flex-shrink: 0;
}
.icon-toggle {
  background: none;
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--text-muted);
  cursor: pointer;
  padding: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;
}
.icon-toggle:hover {
  background: var(--surface-hover);
  color: var(--text);
  border-color: var(--accent);
}
.icon-toggle svg {
  fill: currentColor;
}
.page-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text);
  text-align: center;
}
.page-title.muted {
  color: var(--text-muted);
}
.control-group {
  display: flex;
  align-items: center;
  gap: 6px;
}
.control-label {
  font-size: 0.75rem;
  color: var(--text-muted);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.select-input {
  padding: 6px 10px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text);
  font-size: 0.8125rem;
  cursor: pointer;
  outline: none;
  transition: border-color 0.15s ease;
}
.select-input:focus {
  border-color: var(--accent);
}
.toggle-btn {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--text-muted);
  cursor: pointer;
  padding: 7px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;
}
.toggle-btn svg {
  fill: currentColor;
}
.toggle-btn.active {
  color: var(--accent);
  border-color: var(--accent);
}
.toggle-btn:hover {
  background: var(--surface-hover);
}
.toolbar-btn {
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text);
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease;
}
.toolbar-btn:hover {
  background: var(--surface-hover);
  border-color: var(--accent);
}
.toolbar-btn.danger {
  color: var(--danger);
}
.toolbar-btn.danger:hover {
  background: var(--danger-bg);
  border-color: var(--danger);
}
.mode-toggle {
  padding: 8px 18px;
  border-radius: 8px;
  border: 1px solid var(--accent);
  background: var(--accent);
  color: #fff;
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease;
  white-space: nowrap;
}
.mode-toggle:hover {
  background: var(--accent-hover);
  border-color: var(--accent-hover);
}
.mode-toggle.presenting {
  background: var(--surface);
  color: var(--accent);
  border-color: var(--accent);
}
.mode-toggle.presenting:hover {
  background: var(--surface-hover);
}
.hidden-input {
  display: none;
}
.page-content {
  padding: 24px;
}
.video-grid {
  display: grid;
  gap: 16px;
}
.empty-state {
  padding: 60px 24px;
  text-align: center;
}
.empty-state p {
  margin: 0;
  color: var(--text-muted);
  font-size: 1rem;
}
.empty-hint {
  margin-top: 8px !important;
  font-size: 0.875rem !important;
}

.app-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  border-top: 1px solid var(--border);
  flex-wrap: wrap;
}
.footer-link {
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 0.75rem;
  cursor: pointer;
  padding: 2px 4px;
  border-radius: 4px;
  transition: color 0.15s ease;
}
.footer-link:hover {
  color: var(--accent);
}
.footer-sep {
  color: var(--text-muted);
  font-size: 0.75rem;
}
.footer-license {
  color: var(--text-muted);
  font-size: 0.75rem;
}

@media (max-width: 768px) {
  .app-layout {
    flex-direction: column;
  }
  .page-content {
    padding: 16px;
  }
  .video-grid {
    gap: 12px;
  }
  .top-bar {
    padding: 12px 16px;
  }
  .page-title {
    font-size: 1.25rem;
  }
}
</style>
