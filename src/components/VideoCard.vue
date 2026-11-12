<script setup lang="ts">
import { ref, nextTick } from "vue";
import type { VideoItem } from "../types";
import { getThumbnail } from "../utils/youtube";

const props = defineProps<{
  video: VideoItem;
  showThumbnail: boolean;
  showNumbers: boolean;
  index: number;
  editable: boolean;
  dragging: boolean;
  isDragOver: boolean;
}>();

const emit = defineEmits<{
  play: [];
  remove: [];
  rename: [title: string];
  dragstart: [];
  dragend: [];
  dragover: [];
  drop: [];
}>();

const isEditing = ref(false);
const editTitle = ref("");
const titleInput = ref<HTMLInputElement | null>(null);

function startEdit() {
  if (!props.editable) return;
  isEditing.value = true;
  editTitle.value = props.video.title;
  nextTick(() => {
    titleInput.value?.focus();
    titleInput.value?.select();
  });
}

function saveEdit() {
  const trimmed = editTitle.value.trim();
  if (trimmed && trimmed !== props.video.title) {
    emit("rename", trimmed);
  }
  isEditing.value = false;
}

function cancelEdit() {
  isEditing.value = false;
}

function onDragStart(e: DragEvent) {
  emit("dragstart");
  e.dataTransfer?.setData("text/plain", props.video.id);
}

function onDragOver(e: DragEvent) {
  e.preventDefault();
  emit("dragover");
}

function onDrop(e: DragEvent) {
  e.preventDefault();
  emit("drop");
}
</script>

<template>
  <div
    class="video-card"
    :class="{
      'no-thumb': !showThumbnail,
      dragging: dragging,
      'drag-over': isDragOver,
    }"
    :draggable="editable ? true : false"
    @dragstart="onDragStart"
    @dragend="emit('dragend')"
    @dragover="onDragOver"
    @drop="onDrop"
  >
    <div v-if="showThumbnail" class="thumb-wrapper" @click="emit('play')">
      <img
        :src="getThumbnail(video.youtubeId)"
        :alt="video.title"
        loading="lazy"
      />
      <div class="play-overlay">
        <svg viewBox="0 0 24 24" class="play-icon">
          <path d="M8 5v14l11-7z" />
        </svg>
      </div>
      <div v-if="editable" class="drag-handle" title="Drag to reorder">
        <svg viewBox="0 0 24 24" width="18" height="18">
          <path d="M20 9H4v2h16V9zM4 15h16v-2H4v2z" />
        </svg>
      </div>
    </div>
    <div class="video-info" @click="!showThumbnail ? emit('play') : undefined">
      <div
        v-if="editable && !showThumbnail"
        class="drag-handle-inline"
        title="Drag to reorder"
      >
        <svg viewBox="0 0 24 24" width="16" height="16">
          <path d="M20 9H4v2h16V9zM4 15h16v-2H4v2z" />
        </svg>
      </div>
      <span v-if="showNumbers" class="video-number">{{ index + 1 }}.</span>
      <p
        v-if="!isEditing"
        class="video-title"
        :title="editable ? 'Double-click to edit title' : video.title"
        @dblclick="startEdit"
      >
        {{ video.title }}
      </p>
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
      <div class="actions">
        <button
          v-if="editable && !isEditing"
          class="edit-btn"
          @click.stop="startEdit"
          title="Edit title"
        >
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path
              d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
            />
          </svg>
        </button>
        <button
          v-if="editable"
          class="remove-btn"
          @click.stop="emit('remove')"
          title="Remove video"
        >
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path
              d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped src="../styles/components/VideoCard.css"></style>
