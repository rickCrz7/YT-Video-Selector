<script setup lang="ts">
const emit = defineEmits<{
  accept: []
  learnMore: []
}>()
</script>

<template>
  <div class="consent-banner">
    <div class="banner-content">
      <p class="banner-text">
        This app uses your browser's local storage to save your video collections and preferences.
        Playing YouTube videos may result in third-party cookies set by Google. See our
        <a href="#" @click.prevent="emit('learnMore')">Privacy Policy</a>.
      </p>
      <div class="banner-actions">
        <button class="accept-btn" @click="emit('accept')">Accept</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.consent-banner {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--surface);
  border-top: 1px solid var(--border);
  padding: 16px 24px;
  z-index: 1300;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.15);
  animation: slideUp 0.3s ease;
}
@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}
.banner-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  max-width: 1200px;
  margin: 0 auto;
  flex-wrap: wrap;
}
.banner-text {
  margin: 0;
  font-size: 0.8125rem;
  line-height: 1.5;
  color: var(--text);
  flex: 1;
  min-width: 250px;
}
.banner-text a {
  color: var(--accent);
  text-decoration: none;
  font-weight: 600;
}
.banner-text a:hover {
  text-decoration: underline;
}
.banner-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}
.accept-btn {
  padding: 10px 24px;
  border-radius: 8px;
  border: none;
  background: var(--accent);
  color: #fff;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;
  white-space: nowrap;
}
.accept-btn:hover {
  background: var(--accent-hover);
}

@media (max-width: 768px) {
  .consent-banner {
    padding: 12px 16px;
  }
  .banner-content {
    flex-direction: column;
    align-items: stretch;
  }
  .banner-actions {
    justify-content: flex-end;
  }
}
</style>
