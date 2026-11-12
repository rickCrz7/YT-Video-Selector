<script setup lang="ts">
import { ref } from 'vue'
import type { VideoItem } from './types'
import { useVideoCollection } from './composables/useVideoCollection'
import { importDataFromFile } from './utils/storage'
import Sidebar from './components/Sidebar.vue'
import PageToolbar from './components/PageToolbar.vue'
import VideoPage from './components/VideoPage.vue'
import LegalFooter from './components/LegalFooter.vue'
import PlayerModal from './components/PlayerModal.vue'
import SettingsModal from './components/SettingsModal.vue'
import LegalModal from './components/LegalModal.vue'
import ConsentBanner from './components/ConsentBanner.vue'
import ConfirmModal from './components/ConfirmModal.vue'

const {
  data, activePageId, activePage, settings,
  selectPage, addPage, renamePage, removePage,
  addVideo, removeVideo, renameVideo, reorderVideos,
  handleExport, replaceCollection, resetCollection,
  toggleSidebar, updateSettings, acceptConsent,
} = useVideoCollection()

const playingVideo = ref<VideoItem | null>(null)

const editMode = ref(false)
const showSettings = ref(false)
const showLegal = ref(false)
const legalTab = ref<'privacy' | 'terms'>('privacy')

const confirmState = ref<{
  open: boolean
  title: string
  message: string
  confirmText: string
  danger: boolean
  action: (() => void) | null
}>({
  open: false,
  title: '',
  message: '',
  confirmText: '',
  danger: false,
  action: null,
})


function confirmRemovePage(id: string) {
  const page = data.value.pages.find((page) => page.id === id)
  if (!page) return
  openConfirm(
    'Delete page?',
    `"${page.title}" and all its videos will be permanently deleted.`,
    'Delete',
    true,
    () => removePage(id),
  )
}

function confirmRemoveVideo(id: string) {
  const page = activePage.value
  const video = page?.videos.find((video) => video.id === id)
  if (!page || !video) return
  openConfirm(
    'Delete video?',
    `"${video.title}" will be removed from this page.`,
    'Delete',
    true,
    () => removeVideo(page.id, id),
  )
}

function playVideo(video: VideoItem) {
  playingVideo.value = video
}

function closePlayer() {
  playingVideo.value = null
}


async function handleImport(file: File) {
  try {
    const collection = await importDataFromFile(file)
    openConfirm(
      'Import collection?',
      'Importing will replace your current collection. This cannot be undone.',
      'Import',
      true,
      () => replaceCollection(collection),
    )
  } catch (error) {
    window.alert((error as Error).message)
  }
}

function handleReset() {
  openConfirm(
    'Reset everything?',
    'This will delete ALL pages and videos. This cannot be undone.',
    'Reset',
    true,
    resetCollection,
  )
}

function openLegal(tab: 'privacy' | 'terms') {
  legalTab.value = tab
  showLegal.value = true
}

function openConfirm(title: string, message: string, confirmText: string, danger: boolean, action: () => void) {
  confirmState.value = {
    open: true,
    title,
    message,
    confirmText,
    danger,
    action,
  }
}

function onConfirm() {
  confirmState.value.action?.()
  confirmState.value.open = false
  confirmState.value.action = null
}

function onCancelConfirm() {
  confirmState.value.open = false
  confirmState.value.action = null
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
      @remove="confirmRemovePage"
      @open-legal="openLegal"
    />

    <main class="main-content">
      <PageToolbar
        :page-title="activePage?.title ?? null"
        :edit-mode="editMode"
        :settings="settings"
        @toggle-sidebar="toggleSidebar"
        @toggle-edit-mode="editMode = !editMode"
        @update-settings="updateSettings"
        @open-settings="showSettings = true"
        @export="handleExport"
        @import="handleImport"
        @reset="handleReset"
      />

      <VideoPage
        class="collection-page"
        :active-page="activePage"
        :edit-mode="editMode"
        :settings="settings"
        @add="addVideo"
        @play="playVideo"
        @remove="confirmRemoveVideo"
        @rename="renameVideo"
        @reorder="reorderVideos"
      />

      <LegalFooter @open-legal="openLegal" />
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
    <ConfirmModal
      v-if="confirmState.open"
      :title="confirmState.title"
      :message="confirmState.message"
      :confirm-text="confirmState.confirmText"
      :danger="confirmState.danger"
      @confirm="onConfirm"
      @cancel="onCancelConfirm"
    />
    <ConsentBanner
      v-if="!settings.consentAccepted"
      @accept="acceptConsent"
      @learn-more="openLegal('privacy')"
    />
  </div>
</template>

<style scoped src="./App.css"></style>
