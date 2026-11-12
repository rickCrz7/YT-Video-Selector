<script setup lang="ts">
import { ref } from 'vue'
import { extractYouTubeId, generateId, fetchVideoTitle } from '../utils/youtube'
import type { VideoItem } from '../types'

const emit = defineEmits<{ add: [video: VideoItem] }>()

const url = ref('')
const title = ref('')
const error = ref('')
const adding = ref(false)

async function handleSubmit() {
  error.value = ''
  const id = extractYouTubeId(url.value)
  if (!id) {
    error.value = 'Could not find a valid YouTube video ID in that link.'
    return
  }

  adding.value = true
  let finalTitle = title.value.trim()

  if (!finalTitle) {
    const fetched = await fetchVideoTitle(id)
    finalTitle = fetched || 'Untitled video'
  }

  emit('add', {
    id: generateId(),
    youtubeId: id,
    title: finalTitle,
  })
  adding.value = false
  url.value = ''
  title.value = ''
}
</script>

<template>
  <div class="add-form">
    <div class="form-row">
      <input
        v-model="url"
        type="text"
        placeholder="Paste YouTube URL..."
        class="form-input"
        :disabled="adding"
        @keyup.enter="handleSubmit"
      />
      <input
        v-model="title"
        type="text"
        placeholder="Custom title (optional)"
        class="form-input title-input"
        :disabled="adding"
        @keyup.enter="handleSubmit"
      />
      <button class="add-btn" @click="handleSubmit" :disabled="adding">
        {{ adding ? 'Adding...' : 'Add' }}
      </button>
    </div>
    <p v-if="error" class="form-error">{{ error }}</p>
    <p v-if="adding" class="form-hint">Fetching video title from YouTube...</p>
  </div>
</template>

<style scoped src="./AddVideoForm.css"></style>
