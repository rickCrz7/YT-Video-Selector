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

<style scoped src="./ConsentBanner.css"></style>
