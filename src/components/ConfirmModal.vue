<script setup lang="ts">
defineProps<{
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  danger?: boolean
}>()

const emit = defineEmits<{
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()
</script>

<template>
  <div class="modal-backdrop" @click="emit('cancel')">
    <div class="modal-content" @click.stop>
      <div class="modal-icon" :class="{ danger }">
        <svg v-if="danger" viewBox="0 0 24 24" width="32" height="32"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" /></svg>
        <svg v-else viewBox="0 0 24 24" width="32" height="32"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" /></svg>
      </div>
      <h2 class="modal-title">{{ title }}</h2>
      <p class="modal-message">{{ message }}</p>
      <div class="modal-actions">
        <button class="cancel-btn" @click="emit('cancel')">{{ cancelText || 'Cancel' }}</button>
        <button class="confirm-btn" :class="{ danger }" @click="emit('confirm')">{{ confirmText || 'Confirm' }}</button>
      </div>
    </div>
  </div>
</template>

<style scoped src="../styles/components/ConfirmModal.css"></style>
