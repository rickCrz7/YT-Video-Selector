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

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1200;
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
  max-width: 400px;
  overflow: hidden;
  border: 1px solid var(--border);
  padding: 28px 24px 20px;
  text-align: center;
  animation: slideUp 0.25s ease;
}
@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
.modal-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  color: var(--accent);
}
.modal-icon.danger {
  color: var(--danger);
}
.modal-icon svg {
  fill: currentColor;
}
.modal-title {
  margin: 0 0 8px;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text);
}
.modal-message {
  margin: 0 0 24px;
  font-size: 0.875rem;
  line-height: 1.5;
  color: var(--text-muted);
}
.modal-actions {
  display: flex;
  gap: 10px;
  justify-content: center;
}
.cancel-btn {
  flex: 1;
  padding: 10px 16px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: var(--bg);
  color: var(--text);
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease;
}
.cancel-btn:hover {
  background: var(--surface-hover);
  border-color: var(--text-muted);
}
.confirm-btn {
  flex: 1;
  padding: 10px 16px;
  border-radius: 8px;
  border: none;
  background: var(--accent);
  color: #fff;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;
}
.confirm-btn:hover {
  background: var(--accent-hover);
}
.confirm-btn.danger {
  background: var(--danger);
}
.confirm-btn.danger:hover {
  background: #c93434;
}
</style>
