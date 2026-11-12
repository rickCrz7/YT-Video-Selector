<script setup lang="ts">
import type { Settings, ThemeMode } from '../types'

defineProps<{ settings: Settings }>()

const emit = defineEmits<{
  close: []
  update: [settings: Partial<Settings>]
}>()

function setTheme(theme: ThemeMode) {
  emit('update', { theme })
}

function setFontSize(size: number) {
  emit('update', { fontSize: size })
}
</script>

<template>
  <div class="modal-backdrop" @click="emit('close')">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2 class="modal-title">Settings</h2>
        <button class="close-btn" @click="emit('close')" title="Close">
          <svg viewBox="0 0 24 24" width="24" height="24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" /></svg>
        </button>
      </div>
      <div class="modal-body">
        <section class="setting-section">
          <h3 class="section-label">Theme</h3>
          <div class="theme-options">
            <button
              class="theme-btn"
              :class="{ active: settings.theme === 'dark' }"
              @click="setTheme('dark')"
            >
              <svg viewBox="0 0 24 24" width="20" height="20"><path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z" /></svg>
              Dark
            </button>
            <button
              class="theme-btn"
              :class="{ active: settings.theme === 'light' }"
              @click="setTheme('light')"
            >
              <svg viewBox="0 0 24 24" width="20" height="20"><path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z" /></svg>
              Light
            </button>
          </div>
        </section>

        <section class="setting-section">
          <h3 class="section-label">Font Size</h3>
          <div class="font-size-controls">
            <button
              class="size-btn"
              :class="{ active: settings.fontSize === 14 }"
              @click="setFontSize(14)"
            >Small</button>
            <button
              class="size-btn"
              :class="{ active: settings.fontSize === 16 }"
              @click="setFontSize(16)"
            >Medium</button>
            <button
              class="size-btn"
              :class="{ active: settings.fontSize === 18 }"
              @click="setFontSize(18)"
            >Large</button>
            <button
              class="size-btn"
              :class="{ active: settings.fontSize === 20 }"
              @click="setFontSize(20)"
            >Extra Large</button>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped src="./SettingsModal.css"></style>
