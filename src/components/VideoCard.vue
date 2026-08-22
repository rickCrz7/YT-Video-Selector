<script setup lang="ts">
import { ref, nextTick } from 'vue'
import type { VideoItem } from '../types'
import { getThumbnail } from '../utils/youtube'

const props = defineProps<{
  video: VideoItem
  showThumbnail: boolean
  editable: boolean
  dragging: boolean
  isDragOver: boolean
}>()

const emit = defineEmits<{
  play: []
  remove: []
  rename: [title: string]
  dragstart: []
  dragend: []
  dragover: []
  drop: []
}>()

const isEditing = ref(false)
const editTitle = ref('')
const titleInput = ref<HTMLInputElement | null>(null)

function startEdit() {
  if (!props.editable) return
  isEditing.value = true
  editTitle.value = props.video.title
  nextTick(() => {
    titleInput.value?.focus()
    titleInput.value?.select()
  })
}

function saveEdit() {
  const trimmed = editTitle.value.trim()
  if (trimmed && trimmed !== props.video.title) {
    emit('rename', trimmed)
  }
  isEditing.value = false
}

function cancelEdit() {
  isEditing.value = false
}

function onDragStart(e: DragEvent) {
  emit('dragstart')
  e.dataTransfer?.setData('text/plain', props.video.id)
}

function onDragOver(e: DragEvent) {
  e.preventDefault()
  emit('dragover')
}

function onDrop(e: DragEvent) {
  e.preventDefault()
  emit('drop')
}
</script>

<template>
  <div
    class="video-card"
    :class="{ 'no-thumb': !showThumbnail, 'dragging': dragging, 'drag-over': isDragOver }"
    :draggable="editable ? true : false"
    @dragstart="onDragStart"
    @dragend="emit('dragend')"
    @dragover="onDragOver"
    @drop="onDrop"
  >
    <div v-if="showThumbnail" class="thumb-wrapper" @click="emit('play')">
      <img :src="getThumbnail(video.youtubeId)" :alt="video.title" loading="lazy" />
      <div class="play-overlay">
        <svg viewBox="0 0 24 24" class="play-icon"><path d="M8 5v14l11-7z" /></svg>
      </div>
      <div v-if="editable" class="drag-handle" title="Drag to reorder">
        <svg viewBox="0 0 24 24" width="18" height="18"><path d="M20 9H4v2h16V9zM4 15h16v-2H4v2z" /></svg>
      </div>
    </div>
    <div class="video-info" @click="!showThumbnail ? emit('play') : undefined">
      <div v-if="editable && !showThumbnail" class="drag-handle-inline" title="Drag to reorder">
        <svg viewBox="0 0 24 24" width="16" height="16"><path d="M20 9H4v2h16V9zM4 15h16v-2H4v2z" /></svg>
      </div>
      <p
        v-if="!isEditing"
        class="video-title"
        :title="editable ? 'Double-click to edit title' : video.title"
        @dblclick="startEdit"
      >{{ video.title }}</p>
      <input
        v-else
        ref="titleInput"
        v-model="editTitle"
        class="title-edit-input"
        @keyup.enter="saveEdit"
        @keyup.esc="cancelEdit"
        @blur="saveEdit"
        @click.stop
      />
      <button v-if="editable && !isEditing" class="edit-btn" @click.stop="startEdit" title="Edit title">
        <svg viewBox="0 0 24 24" width="14" height="14"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" /></svg>
      </button>
      <button v-if="editable" class="remove-btn" @click.stop="emit('remove')" title="Remove video">
        <svg viewBox="0 0 24 24" width="16" height="16"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" /></svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
.video-card {
  background: var(--surface);
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--border);
  transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.15s ease, border-color 0.15s ease;
  display: flex;
  flex-direction: column;
}
.video-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px var(--shadow);
}
.video-card.dragging {
  opacity: 0.4;
}
.video-card.drag-over {
  border-color: var(--accent);
  box-shadow: 0 0 0 2px var(--accent-bg);
}
.video-card.no-thumb {
  cursor: pointer;
}
.thumb-wrapper {
  position: relative;
  cursor: pointer;
  aspect-ratio: 16 / 9;
  background: #000;
}
.thumb-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: opacity 0.2s ease;
}
.play-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.35);
  opacity: 0;
  transition: opacity 0.2s ease;
}
.thumb-wrapper:hover .play-overlay {
  opacity: 1;
}
.play-icon {
  width: 48px;
  height: 48px;
  fill: #fff;
}
.drag-handle {
  position: absolute;
  top: 6px;
  left: 6px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 6px;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: grab;
  opacity: 0;
  transition: opacity 0.15s ease;
}
.thumb-wrapper:hover .drag-handle {
  opacity: 1;
}
.drag-handle svg {
  fill: #fff;
}
.drag-handle-inline {
  display: flex;
  align-items: center;
  cursor: grab;
  color: var(--text-muted);
  padding: 2px;
  opacity: 0;
  transition: opacity 0.15s ease;
}
.video-info:hover .drag-handle-inline {
  opacity: 1;
}
.drag-handle-inline svg {
  fill: currentColor;
}
.video-info {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 10px 12px;
}
.video-card.no-thumb .video-info {
  padding: 18px 14px;
  align-items: center;
}
.video-title {
  flex: 1;
  margin: 0;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: break-word;
  cursor: default;
}
.video-card.no-thumb .video-title {
  font-size: 1rem;
  -webkit-line-clamp: 3;
}
.title-edit-input {
  flex: 1;
  margin: 0;
  padding: 2px 6px;
  border: 1px solid var(--accent);
  border-radius: 4px;
  background: var(--bg);
  color: var(--text);
  font-size: 0.875rem;
  font-family: inherit;
  outline: none;
  line-height: 1.4;
}
.edit-btn,
.remove-btn {
  flex-shrink: 0;
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s ease, color 0.15s ease;
}
.edit-btn:hover {
  background: var(--accent-bg);
  color: var(--accent);
}
.remove-btn:hover {
  background: var(--danger-bg);
  color: var(--danger);
}
.edit-btn svg,
.remove-btn svg {
  fill: currentColor;
}
</style>
