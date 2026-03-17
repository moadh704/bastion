<template>
  <v-app>
    <div class="bg-mesh" />
    <NavBar v-if="auth.isLoggedIn" />
    <v-main :class="auth.isLoggedIn ? 'with-nav' : ''">
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
import { useAuthStore } from './stores/auth';
import NavBar from './components/NavBar.vue';
const auth = useAuthStore();
</script>

<style>
* {
  font-family: 'Outfit', sans-serif;
}

h1, h2, h3, h4, .syne {
  font-family: 'Syne', sans-serif;
}

.v-application {
  background: #0d0d1a !important;
}

.bg-mesh {
  position: fixed;
  inset: 0;
  z-index: 0;
  background:
    radial-gradient(ellipse at 15% 50%, rgba(124, 58, 237, 0.25) 0%, transparent 55%),
    radial-gradient(ellipse at 85% 15%, rgba(37, 99, 235, 0.2) 0%, transparent 55%),
    radial-gradient(ellipse at 60% 85%, rgba(167, 139, 250, 0.15) 0%, transparent 55%);
  pointer-events: none;
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

.with-nav {
  padding-left: 260px !important;
}

.v-main {
  position: relative;
  z-index: 1;
}

.gradient-text {
  background: linear-gradient(135deg, #a78bfa, #60a5fa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-container {
  padding: 32px;
  min-height: 100vh;
}
</style>