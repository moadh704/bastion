<template>
  <div class="login-page">
    <div class="login-card">
      <!-- Logo -->
      <div class="login-logo">
        <div class="logo-icon">
          <v-icon color="#a78bfa" size="28">mdi-shield-crown</v-icon>
        </div>
        <h1 class="syne gradient-text">AdminOS</h1>
        <p class="login-sub">Sign in to your dashboard</p>
      </div>

      <!-- Form -->
      <div class="login-form">
        <div class="field-group">
          <label>Email</label>
          <v-text-field
            v-model="email"
            placeholder="you@example.com"
            variant="outlined"
            density="compact"
            prepend-inner-icon="mdi-email-outline"
            color="primary"
            hide-details
          />
        </div>

        <div class="field-group">
          <label>Password</label>
          <v-text-field
            v-model="password"
            placeholder="••••••••"
            :type="showPass ? 'text' : 'password'"
            variant="outlined"
            density="compact"
            prepend-inner-icon="mdi-lock-outline"
            :append-inner-icon="showPass ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append-inner="showPass = !showPass"
            color="primary"
            hide-details
          />
        </div>

        <v-alert v-if="error" type="error" variant="tonal" density="compact" class="mt-2">
          {{ error }}
        </v-alert>

        <button class="login-btn" :disabled="loading" @click="handleLogin">
          <v-progress-circular v-if="loading" indeterminate size="16" width="2" class="mr-2" />
          <span>{{ loading ? 'Signing in...' : 'Sign In' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const email = ref('');
const password = ref('');
const showPass = ref(false);
const error = ref('');
const loading = ref(false);

const auth = useAuthStore();
const router = useRouter();

const handleLogin = async () => {
  error.value = '';
  loading.value = true;
  try {
    await auth.login(email.value, password.value);
    router.push('/dashboard');
  } catch (err) {
    error.value = err.response?.data?.message || 'Login failed';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.login-card {
  width: 100%;
  max-width: 420px;
  background: rgba(255,255,255,0.05);
  backdrop-filter: blur(40px);
  -webkit-backdrop-filter: blur(40px);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 24px;
  padding: 40px;
}

.login-logo {
  text-align: center;
  margin-bottom: 32px;
}

.logo-icon {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: linear-gradient(135deg, rgba(124,58,237,0.4), rgba(37,99,235,0.4));
  border: 1px solid rgba(167,139,250,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
}

h1 {
  font-size: 28px;
  font-weight: 800;
  margin: 0 0 6px;
}

.login-sub {
  font-size: 14px;
  color: rgba(255,255,255,0.4);
  margin: 0;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field-group label {
  font-size: 13px;
  font-weight: 500;
  color: rgba(255,255,255,0.6);
}

.login-btn {
  width: 100%;
  padding: 13px;
  border-radius: 12px;
  background: linear-gradient(135deg, #7c3aed, #2563eb);
  border: none;
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  font-family: 'Outfit', sans-serif;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s ease, transform 0.2s ease;
  margin-top: 4px;
}

.login-btn:hover:not(:disabled) {
  opacity: 0.9;
  transform: translateY(-1px);
}

.login-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>