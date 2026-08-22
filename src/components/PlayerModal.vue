<script setup lang="ts">
import { computed } from 'vue'
import type { VideoItem } from '../types'
import { getEmbedUrl } from '../utils/youtube'

const props = defineProps<{ video: VideoItem | null }>()
const emit = defineEmits<{ close: [] }>()

const embedUrl = computed(() =>
  props.video ? getEmbedUrl(props.video.youtubeId) : ''
)

function onBackdropClick() {
  emit('close')
}
</script>

<template>
  <div v-if="video" class="modal-backdrop" @click="onBackdropClick">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <p class="modal-title">{{ video.title }}</p>
        <button class="close-btn" @click="emit('close')" title="Close">
          <svg viewBox="0 0 24 24" width="24" height="24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" /></svg>
        </button>
      </div>
      <div class="video-frame">
        <iframe
          :src="embedUrl"
          title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen
        ></iframe>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  animation: fadeIn 0.2s ease;
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
.modal-content {
  background: var(--surface);
  border-radius: 12px;
  width: 100%;
  max-width: 900px;
  overflow: hidden;
  border: 1px solid var(--border);
  animation: slideUp 0.25s ease;
}
@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  border-bottom: 1px solid var(--border);
}
.modal-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--text);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.close-btn {
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
  flex-shrink: 0;
}
.close-btn:hover {
  background: var(--surface-hover);
  color: var(--text);
}
.close-btn svg {
  fill: currentColor;
}
.video-frame {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  background: #000;
}
.video-frame iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: none;
}
</style>
