<template>
  <div class="not-found">
    <div class="content">
      <div class="error-code syne gradient-text">404</div>
      <div class="error-title syne">Page Not Found</div>
      <div class="error-sub">The page you're looking for doesn't exist or has been moved.</div>
      <button class="back-btn" @click="router.push('/dashboard')">
        <v-icon size="18" class="mr-2">mdi-arrow-left</v-icon>
        Back to Dashboard
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();
</script>

<style scoped>
.not-found {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.error-code {
  font-size: 120px;
  font-weight: 800;
  line-height: 1;
  margin-bottom: 16px;
}

.error-title {
  font-size: 28px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 12px;
}

.error-sub {
  font-size: 15px;
  color: rgba(255,255,255,0.4);
  margin-bottom: 32px;
}

.back-btn {
  padding: 12px 24px;
  border-radius: 12px;
  background: linear-gradient(135deg, #7c3aed, #2563eb);
  border: none;
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  font-family: 'Outfit', sans-serif;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  transition: all 0.2s ease;
}

.back-btn:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}
</style>