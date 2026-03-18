<template>
  <transition name="fade">
    <div v-if="ui.confirm.show" class="overlay">
      <div class="dialog glass-strong">
        <div class="dialog-icon">
          <v-icon color="#ef4444" size="28">mdi-alert-outline</v-icon>
        </div>
        <div class="dialog-title syne">Are you sure?</div>
        <div class="dialog-message">{{ ui.confirm.message }}</div>
        <div class="dialog-actions">
          <button class="btn-cancel" @click="ui.resolveConfirm(false)">Cancel</button>
          <button class="btn-confirm" @click="ui.resolveConfirm(true)">Confirm</button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { useUiStore } from '../stores/ui';
const ui = useUiStore();
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  backdrop-filter: blur(4px);
  z-index: 9998;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dialog {
  width: 100%;
  max-width: 380px;
  padding: 32px;
  text-align: center;
}

.dialog-icon {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: rgba(239,68,68,0.1);
  border: 1px solid rgba(239,68,68,0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
}

.dialog-title {
  font-size: 20px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 8px;
}

.dialog-message {
  font-size: 14px;
  color: rgba(255,255,255,0.5);
  margin-bottom: 24px;
  line-height: 1.5;
}

.dialog-actions {
  display: flex;
  gap: 12px;
}

.btn-cancel, .btn-confirm {
  flex: 1;
  padding: 11px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  font-family: 'Outfit', sans-serif;
  cursor: pointer;
  border: none;
  transition: all 0.2s ease;
}

.btn-cancel {
  background: rgba(255,255,255,0.06);
  color: rgba(255,255,255,0.6);
  border: 1px solid rgba(255,255,255,0.1);
}

.btn-cancel:hover {
  background: rgba(255,255,255,0.1);
  color: #fff;
}

.btn-confirm {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: #fff;
}

.btn-confirm:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>