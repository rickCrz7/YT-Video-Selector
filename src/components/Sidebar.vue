<script setup lang="ts">
import { ref, nextTick } from 'vue'
import type { Page } from '../types'

const props = defineProps<{
  pages: Page[]
  activePageId: string | null
  editable: boolean
}>()

const emit = defineEmits<{
  (e: 'select', id: string): void
  (e: 'add'): void
  (e: 'rename', id: string, title: string): void
  (e: 'remove', id: string): void
  (e: 'openLegal', tab: 'privacy' | 'terms'): void
}>()

const editingPageId = ref<string | null>(null)
const editTitle = ref('')
const titleInput = ref<HTMLInputElement | null>(null)

function startEdit(page: Page) {
  editingPageId.value = page.id
  editTitle.value = page.title
  nextTick(() => {
    titleInput.value?.focus()
    titleInput.value?.select()
  })
}

function saveEdit() {
  const trimmed = editTitle.value.trim()
  if (trimmed && editingPageId.value) {
    const page = props.pages.find((p) => p.id === editingPageId.value)
    if (page && trimmed !== page.title) {
      emit('rename', editingPageId.value, trimmed)
    }
  }
  editingPageId.value = null
}

function cancelEdit() {
  editingPageId.value = null
}
</script>

<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <h2 class="sidebar-title">Pages</h2>
      <button class="icon-btn add-page-btn" @click="emit('add')" title="New page">
        <svg viewBox="0 0 24 24" width="20" height="20"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" /></svg>
      </button>
    </div>
    <ul class="page-list">
      <li
        v-for="page in pages"
        :key="page.id"
        class="page-item"
        :class="{ active: page.id === activePageId }"
        @click="emit('select', page.id)"
      >
        <template v-if="editingPageId === page.id">
          <input
            ref="titleInput"
            v-model="editTitle"
            class="page-name-edit"
            @keyup.enter="saveEdit"
            @keyup.esc="cancelEdit"
            @blur="saveEdit"
            @click.stop
          />
        </template>
        <template v-else>
          <span class="page-name" @dblclick="editable ? startEdit(page) : undefined">{{ page.title }}</span>
          <span class="page-actions" @click.stop>
            <button class="icon-btn" @click="startEdit(page)" title="Rename page">
              <svg viewBox="0 0 24 24" width="16" height="16"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" /></svg>
            </button>
            <button class="icon-btn" @click="emit('remove', page.id)" title="Delete page">
              <svg viewBox="0 0 24 24" width="16" height="16"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" /></svg>
            </button>
          </span>
        </template>
      </li>
    </ul>
    <p v-if="pages.length === 0" class="empty-text">No pages yet. Click + to create one.</p>

    <div class="sidebar-footer">
      <button class="footer-link" @click="emit('openLegal', 'privacy')">Privacy Policy</button>
      <span class="footer-sep">·</span>
      <button class="footer-link" @click="emit('openLegal', 'terms')">Terms of Service</button>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 240px;
  flex-shrink: 0;
  background: var(--surface);
  border-right: 1px solid var(--border);
  padding: 16px 12px;
  overflow-y: auto;
  height: 100vh;
  position: sticky;
  top: 0;
  transition: margin-left 0.25s ease;
  display: flex;
  flex-direction: column;
}
.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  padding: 0 4px;
}
.sidebar-title {
  margin: 0;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
}
.page-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.page-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s ease;
}
.page-item:hover {
  background: var(--surface-hover);
}
.page-item.active {
  background: var(--accent-bg);
}
.page-name {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.page-name-edit {
  flex: 1;
  min-width: 0;
  padding: 2px 6px;
  border: 1px solid var(--accent);
  border-radius: 4px;
  background: var(--bg);
  color: var(--text);
  font-size: 0.875rem;
  font-family: inherit;
  outline: none;
}
.page-actions {
  display: flex;
  gap: 2px;
}
.icon-btn {
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
.icon-btn:hover {
  background: var(--surface-active);
  color: var(--text);
}
.icon-btn svg {
  fill: currentColor;
}
.add-page-btn:hover {
  color: var(--accent);
}
.empty-text {
  font-size: 0.8125rem;
  color: var(--text-muted);
  padding: 8px 4px;
}

.sidebar-footer {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px 6px;
  margin-top: auto;
  padding-top: 16px;
  border-top: 1px solid var(--border);
}
.footer-link {
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 0.6875rem;
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
  font-size: 0.6875rem;
}
.footer-license {
  color: var(--text-muted);
  font-size: 0.6875rem;
}

@media (max-width: 768px) {
  .sidebar {
    width: 100%;
    height: auto;
    border-right: none;
    border-bottom: 1px solid var(--border);
    position: relative;
  }
  .sidebar-footer {
    display: none; 
  }
}
</style>
