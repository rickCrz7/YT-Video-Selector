<script setup lang="ts">
import { ref } from 'vue'
import type { Settings } from '../types'

defineProps<{
  pageTitle: string | null
  editMode: boolean
  settings: Settings
}>()

const emit = defineEmits<{
  toggleSidebar: []
  toggleEditMode: []
  updateSettings: [settings: Partial<Settings>]
  openSettings: []
  export: []
  import: [file: File]
  reset: []
}>()

const fileInput = ref<HTMLInputElement | null>(null)

function triggerImport() {
  fileInput.value?.click()
}

function selectImportFile(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) emit('import', file)
  input.value = ''
}

function changeGridColumns(event: Event) {
  const select = event.target as HTMLSelectElement
  emit('updateSettings', { gridColumns: Number(select.value) })
}
</script>

<template>
  <header class="top-bar" :class="{ presenting: !editMode }">
    <div class="top-bar-left">
      <button class="icon-toggle" @click="emit('toggleSidebar')" :title="settings.sidebarVisible ? 'Hide sidebar' : 'Show sidebar'">
        <svg viewBox="0 0 24 24" width="20" height="20"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" /></svg>
      </button>
    </div>
    <div class="top-bar-center">
      <h1 v-if="pageTitle !== null" class="page-title">{{ pageTitle }}</h1>
      <h1 v-else class="page-title muted">No page selected</h1>
    </div>
    <div class="top-bar-right">
      <template v-if="editMode">
        <div class="control-group">
          <label class="control-label" for="grid-columns">Grid</label>
          <select id="grid-columns" :value="settings.gridColumns" @change="changeGridColumns" class="select-input">
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
          @click="emit('updateSettings', { showThumbnails: !settings.showThumbnails })"
          :title="settings.showThumbnails ? 'Hide thumbnails' : 'Show thumbnails'"
        >
          <svg viewBox="0 0 24 24" width="18" height="18"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" /></svg>
        </button>
        <button
          class="toggle-btn"
          :class="{ active: settings.showNumbers }"
          @click="emit('updateSettings', { showNumbers: !settings.showNumbers })"
          :title="settings.showNumbers ? 'Hide numbers' : 'Show numbers'"
        >
          <svg viewBox="0 0 24 24" width="18" height="18"><path d="M2 17h2v.5H3v1h1v.5H2v1h3v-4H2v1zm1-9h1V5H2v1h1v1zm-1 3h1.8L2 13.1v.9h3v-1H3.2L5 10.9V10H2v1zm5-6v1h14V5H7zm0 14h14v-1H7v1zm0-6h14v-1H7v1z" /></svg>
        </button>
        <button class="toolbar-btn" @click="emit('export')">Export</button>
        <button class="toolbar-btn" @click="triggerImport">Import</button>
        <button class="toolbar-btn danger" @click="emit('reset')">Reset</button>
        <input
          ref="fileInput"
          type="file"
          accept="application/json,.json"
          class="hidden-input"
          @change="selectImportFile"
        />
      </template>
      <button class="icon-toggle" @click="emit('openSettings')" title="Settings">
        <svg viewBox="0 0 24 24" width="20" height="20"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94 0 .31.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" /></svg>
      </button>
      <button
        class="icon-toggle mode-toggle"
        :class="{ presenting: !editMode }"
        @click="emit('toggleEditMode')"
        :title="editMode ? 'Present mode' : 'Edit mode'"
      >
        <svg v-if="!editMode" viewBox="0 0 24 24" width="20" height="20"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" /></svg>
        <svg v-else viewBox="0 0 24 24" width="20" height="20"><path d="M21 3H3c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h7v2H8v2h8v-2h-2v-2h7c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 13H3V5h18v11z" /></svg>
      </button>
    </div>
  </header>
</template>

<style scoped src="../styles/components/PageToolbar.css"></style>
