<template>
  <v-app theme="dark">
    <div class="bg-mesh" :style="meshStyle" />
    <NavBar v-if="auth.isLoggedIn" />
    <v-main :class="auth.isLoggedIn ? 'with-nav' : ''">
      <router-view />
    </v-main>
    <ToastNotification />
    <ConfirmDialog />
  </v-app>
</template>

<script setup>
import { computed } from 'vue';
import { useAuthStore } from './stores/auth';
import { useUiStore } from './stores/ui';
import NavBar from './components/NavBar.vue';
import ToastNotification from './components/ToastNotification.vue';
import ConfirmDialog from './components/ConfirmDialog.vue';

const auth = useAuthStore();
const ui = useUiStore();

const meshStyle = computed(() => ({
  background: `
    radial-gradient(ellipse at 15% 50%, ${ui.theme.mesh1} 0%, transparent 55%),
    radial-gradient(ellipse at 85% 15%, ${ui.theme.mesh2} 0%, transparent 55%),
    radial-gradient(ellipse at 60% 85%, ${ui.theme.mesh3} 0%, transparent 55%)
  `
}));
</script>

<style>
* { font-family: 'Outfit', sans-serif; }
h1, h2, h3, h4, .syne { font-family: 'Syne', sans-serif; }
.v-application { background: #0d0d1a !important; }

.bg-mesh {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  transition: background 0.6s ease;
}

.glass {
  background: rgba(255, 255, 255, 0.04) !important;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
  border-radius: 16px !important;
}

.glass-strong {
  background: rgba(255, 255, 255, 0.07) !important;
  backdrop-filter: blur(30px);
  -webkit-backdrop-filter: blur(30px);
  border: 1px solid rgba(255, 255, 255, 0.12) !important;
  border-radius: 16px !important;
}

.with-nav { padding-left: 260px !important; }
.v-main { position: relative; z-index: 1; }

.gradient-text {
  background: v-bind('ui.theme.gradient');
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-container { padding: 32px; min-height: 100vh; }
</style>