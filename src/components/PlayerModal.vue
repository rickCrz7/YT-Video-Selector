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

<style scoped src="../styles/components/PlayerModal.css"></style>
