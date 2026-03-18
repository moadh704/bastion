<template>
  <transition name="toast">
    <div v-if="ui.toast.show" class="toast" :class="ui.toast.type">
      <v-icon size="18" class="mr-2">{{ icon }}</v-icon>
      {{ ui.toast.message }}
    </div>
  </transition>
</template>

<script setup>
import { computed } from 'vue';
import { useUiStore } from '../stores/ui';

const ui = useUiStore();

const icon = computed(() => {
  if (ui.toast.type === 'success') return 'mdi-check-circle-outline';
  if (ui.toast.type === 'error') return 'mdi-alert-circle-outline';
  return 'mdi-information-outline';
});
</script>

<style scoped>
.toast {
  position: fixed;
  bottom: 28px;
  right: 28px;
  z-index: 9999;
  padding: 14px 20px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.1);
  box-shadow: 0 8px 32px rgba(0,0,0,0.3);
  min-width: 260px;
}

.toast.success {
  background: rgba(16, 185, 129, 0.15);
  border-color: rgba(16, 185, 129, 0.3);
  color: #10b981;
}

.toast.error {
  background: rgba(239, 68, 68, 0.15);
  border-color: rgba(239, 68, 68, 0.3);
  color: #ef4444;
}

.toast.info {
  background: rgba(124, 58, 237, 0.15);
  border-color: rgba(124, 58, 237, 0.3);
  color: #a78bfa;
}

.toast-enter-active, .toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from, .toast-leave-to {
  opacity: 0;
  transform: translateY(12px);
}
</style>