<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { Page, Settings, VideoItem } from '../types'
import AddVideoForm from './AddVideoForm.vue'
import VideoCard from './VideoCard.vue'

const props = defineProps<{
  activePage: Page | null
  editMode: boolean
  settings: Settings
}>()

const emit = defineEmits<{
  add: [video: VideoItem]
  play: [video: VideoItem]
  remove: [id: string]
  rename: [id: string, title: string]
  reorder: [fromId: string, toId: string]
}>()

const gridStyle = computed(() => ({
  gridTemplateColumns: `repeat(${props.settings.gridColumns}, 1fr)`,
}))

const draggedVideoId = ref<string | null>(null)
const dragOverVideoId = ref<string | null>(null)

watch(() => [props.activePage?.id, props.editMode], onVideoDragEnd)

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
  const fromId = draggedVideoId.value
  onVideoDragEnd()
  if (fromId) emit('reorder', fromId, videoId)
}
</script>

<template>
  <div v-if="activePage" class="page-content">
    <AddVideoForm v-if="editMode" @add="emit('add', $event)" />

    <div v-if="activePage.videos.length > 0" class="video-grid" :style="gridStyle">
      <VideoCard
        v-for="(video, index) in activePage.videos"
        :key="video.id"
        :video="video"
        :show-thumbnail="settings.showThumbnails"
        :show-numbers="settings.showNumbers"
        :index="index"
        :editable="editMode"
        :dragging="draggedVideoId === video.id"
        :is-drag-over="dragOverVideoId === video.id"
        @play="emit('play', video)"
        @remove="emit('remove', video.id)"
        @rename="emit('rename', video.id, $event)"
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
</template>

<style scoped src="../styles/components/VideoPage.css"></style>
