<script setup lang="ts">
const emit = defineEmits<{
  openLegal: [tab: 'privacy' | 'terms']
}>()
</script>

<template>
  <footer class="mobile-footer">
    <button class="footer-link" @click="emit('openLegal', 'privacy')">Privacy Policy</button>
    <span class="footer-sep">·</span>
    <button class="footer-link" @click="emit('openLegal', 'terms')">Terms of Service</button>
    <span class="footer-sep">·</span>
    <span class="footer-license">Open-source under MIT License</span>
  </footer>
</template>

<style scoped src="../styles/components/LegalFooter.css"></style>
