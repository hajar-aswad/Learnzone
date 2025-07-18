<template>
  <div class="loading-overlay">
    <div class="spinner"></div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.loading-overlay {
  position: absolute;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(70, 45, 91, 0.20);
  backdrop-filter: blur(15px);
  transition: opacity 0.3s;
}
.spinner {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 4px solid rgba(255,255,255,0.3);
  border-top: 4px solid #e7e1eb;
  animation: spin 1s linear infinite;
  background: rgba(255,255,255,0.1);
  box-shadow: 0 4px 32px 0 rgba(70,45,91,0.15);
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style> 