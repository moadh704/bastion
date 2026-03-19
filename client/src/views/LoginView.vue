<template>
  <div class="login-page">
    <canvas ref="canvas" class="particle-canvas" />

    <!-- Left Panel -->
    <div class="left-panel">
      <div class="brand-content">
        <div class="hex-wrapper">
          <svg class="hex-ring" viewBox="0 0 100 100">
            <polygon
              points="50,2 93,26 93,74 50,98 7,74 7,26"
              fill="none"
              stroke="rgba(120,80,220,0.25)"
              stroke-width="1"
            />
            <polygon
              points="50,10 87,30 87,70 50,90 13,70 13,30"
              fill="none"
              stroke="rgba(120,80,220,0.12)"
              stroke-width="0.5"
            />
          </svg>
          <div class="hex-icon">
            <v-icon color="#8b5cf6" size="26">mdi-shield-crown</v-icon>
          </div>
        </div>

        <div class="brand-text">
          <div class="brand-label">SECURE ADMIN PLATFORM</div>
          <h1 class="brand-name syne">Bastion</h1>
          <div class="brand-line" />
          <p class="brand-tagline">
            <span class="typed-text">{{ typedText }}</span>
            <span class="cursor">_</span>
          </p>
        </div>
      </div>

      <div class="brand-footer">
        <span class="dot" />
        System online — Vue 3 + Express.js
      </div>
    </div>

    <!-- Right Panel -->
    <div class="right-panel">
      <div class="form-card">
        <div class="card-glow" />

        <div class="form-header">
          <h2 class="syne">Sign In</h2>
          <p>Enter your credentials to access the dashboard</p>
        </div>

        <div class="form-body">
          <div class="field-group">
            <label>Email address</label>
            <v-text-field
              v-model="email"
              placeholder="admin@bastion.com"
              variant="outlined"
              density="compact"
              prepend-inner-icon="mdi-email-outline"
              color="primary"
              hide-details
              @keyup.enter="handleLogin"
            />
          </div>

          <div class="field-group">
            <label>Password</label>
            <v-text-field
              v-model="password"
              placeholder="••••••••••••"
              :type="showPass ? 'text' : 'password'"
              variant="outlined"
              density="compact"
              prepend-inner-icon="mdi-lock-outline"
              :append-inner-icon="showPass ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
              @click:append-inner="showPass = !showPass"
              color="primary"
              hide-details
              @keyup.enter="handleLogin"
            />
          </div>

          <v-alert
            v-if="error"
            type="error"
            variant="tonal"
            density="compact"
            class="mt-1"
          >
            {{ error }}
          </v-alert>

          <button
            class="login-btn"
            :disabled="loading"
            @click="handleLogin"
          >
            <span class="btn-content">
              <v-progress-circular
                v-if="loading"
                indeterminate
                size="16"
                width="2"
                class="mr-2"
              />
              <span>{{ loading ? 'Verifying...' : 'Authenticate' }}</span>
              <v-icon v-if="!loading" size="16" class="ml-2">mdi-arrow-right</v-icon>
            </span>
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const email = ref('');
const password = ref('');
const showPass = ref(false);
const error = ref('');
const loading = ref(false);
const typedText = ref('');
const canvas = ref(null);

const auth = useAuthStore();
const router = useRouter();

const fullText = 'Fortified access control for modern teams.';

let animFrame;

onMounted(() => {
  let i = 0;
  const interval = setInterval(() => {
    typedText.value += fullText[i];
    i++;
    if (i >= fullText.length) clearInterval(interval);
  }, 45);

  initCanvas();
});

onUnmounted(() => {
  cancelAnimationFrame(animFrame);
});

const initCanvas = () => {
  const c = canvas.value;
  if (!c) return;
  const ctx = c.getContext('2d');
  let W = c.width = window.innerWidth;
  let H = c.height = window.innerHeight;

  const resize = () => {
    W = c.width = window.innerWidth;
    H = c.height = window.innerHeight;
  };
  window.addEventListener('resize', resize);

  const particles = Array.from({ length: 55 }, () => ({
    x: Math.random() * W,
    y: Math.random() * H,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    r: Math.random() * 1.2 + 0.4,
  }));

  const MAX_DIST = 130;

  const draw = () => {
    ctx.clearRect(0, 0, W, H);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(120,80,220,0.4)';
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) {
          const alpha = (1 - dist / MAX_DIST) * 0.12;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(100,60,200,${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    animFrame = requestAnimationFrame(draw);
  };

  draw();
};

const handleLogin = async () => {
  error.value = '';
  loading.value = true;
  try {
    await auth.login(email.value, password.value);
    router.push('/dashboard');
  } catch (err) {
    error.value = err.response?.data?.message || 'Authentication failed';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-page {
  height: 100vh;
  display: flex;
  overflow: hidden;
  position: relative;
}

.particle-canvas {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

/* ── Left Panel ── */
.left-panel {
  width: 48%;
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 44px 48px;
  border-right: 1px solid rgba(255,255,255,0.04);
  animation: fadeSlideLeft 0.8s ease both;
}

@keyframes fadeSlideLeft {
  from { opacity: 0; transform: translateX(-24px); }
  to { opacity: 1; transform: translateX(0); }
}

.brand-content {
  margin: auto 0;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.hex-wrapper {
  position: relative;
  width: 68px;
  height: 68px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hex-ring {
  position: absolute;
  inset: 0;
  animation: hexRotate 14s linear infinite;
}

@keyframes hexRotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.hex-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: rgba(80,40,160,0.25);
  border: 1px solid rgba(120,80,220,0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
}

.brand-text {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.brand-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.22em;
  color: rgba(120,80,220,0.5);
}

.brand-name {
  font-size: 68px;
  font-weight: 800;
  line-height: 1;
  margin: 0;
  background: linear-gradient(140deg, #e2e8f0 0%, #a78bfa 55%, #818cf8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.brand-line {
  width: 40px;
  height: 2px;
  background: linear-gradient(90deg, rgba(120,80,220,0.6), transparent);
  border-radius: 2px;
}

.brand-tagline {
  font-size: 14px;
  color: rgba(255,255,255,0.3);
  margin: 0;
  min-height: 22px;
  line-height: 1.6;
}

.cursor {
  color: rgba(120,80,220,0.7);
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.brand-footer {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  color: rgba(255,255,255,0.15);
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #10b981;
  box-shadow: 0 0 6px rgba(16,185,129,0.6);
  animation: pulse-dot 2.5s ease-in-out infinite;
  flex-shrink: 0;
}

@keyframes pulse-dot {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

/* ── Right Panel ── */
.right-panel {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px;
  position: relative;
  z-index: 1;
  animation: fadeSlideRight 0.8s ease 0.15s both;
}

@keyframes fadeSlideRight {
  from { opacity: 0; transform: translateX(24px); }
  to { opacity: 1; transform: translateX(0); }
}

.form-card {
  width: 100%;
  max-width: 390px;
  background: rgba(10,8,20,0.7);
  backdrop-filter: blur(40px);
  -webkit-backdrop-filter: blur(40px);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 22px;
  padding: 40px;
  position: relative;
  overflow: hidden;
}

.card-glow {
  position: absolute;
  top: 0;
  left: 15%;
  right: 15%;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(120,80,220,0.5), transparent);
}

.form-header {
  margin-bottom: 28px;
}

.form-header h2 {
  font-size: 28px;
  font-weight: 700;
  color: #e2e8f0;
  margin: 0 0 6px;
}

.form-header p {
  font-size: 13px;
  color: rgba(255,255,255,0.25);
  margin: 0;
}

.form-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.field-group label {
  font-size: 11px;
  font-weight: 600;
  color: rgba(255,255,255,0.35);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.login-btn {
  width: 100%;
  padding: 13px;
  border-radius: 11px;
  background: linear-gradient(135deg, #5b21b6, #1d4ed8);
  border: none;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  font-family: 'Outfit', sans-serif;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s ease;
  margin-top: 6px;
  position: relative;
  overflow: hidden;
}

.login-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 8px 28px rgba(91,33,182,0.35);
  background: linear-gradient(135deg, #6d28d9, #2563eb);
}

.login-btn:active:not(:disabled) {
  transform: translateY(0);
}

.login-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-content {
  display: flex;
  align-items: center;
}

/* Responsive */
@media (max-width: 768px) {
  .left-panel { display: none; }
  .right-panel { padding: 24px; }
  .login-page { height: 100vh; }
}
</style>