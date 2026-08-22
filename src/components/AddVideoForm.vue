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

<style scoped>
.add-form {
  margin-bottom: 24px;
}
.form-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.form-input {
  flex: 1;
  min-width: 160px;
  padding: 10px 14px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text);
  font-size: 0.875rem;
  font-family: inherit;
  outline: none;
  transition: border-color 0.2s ease;
}
.form-input:focus {
  border-color: var(--accent);
}
.form-input:disabled {
  opacity: 0.6;
}
.title-input {
  flex: 0.8;
}
.add-btn {
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  background: var(--accent);
  color: #fff;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background 0.2s ease;
  white-space: nowrap;
}
.add-btn:hover:not(:disabled) {
  background: var(--accent-hover);
}
.add-btn:disabled {
  opacity: 0.6;
  cursor: default;
}
.form-error {
  margin: 8px 0 0;
  color: var(--danger);
  font-size: 0.8125rem;
}
.form-hint {
  margin: 8px 0 0;
  color: var(--text-muted);
  font-size: 0.8125rem;
}
</style>
