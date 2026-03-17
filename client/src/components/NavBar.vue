<template>
  <div class="sidebar">
    <div class="sidebar-inner">
      <!-- Logo -->
      <div class="logo-area">
        <div class="logo-icon">
          <v-icon color="#a78bfa" size="22">mdi-shield-crown</v-icon>
        </div>
        <span class="logo-text syne">AdminOS</span>
      </div>

      <!-- User info -->
      <div class="user-pill">
        <v-avatar size="32" color="primary" class="mr-2">
          <span style="font-size:13px; font-family:'Syne',sans-serif; font-weight:700">
            {{ auth.user?.name?.charAt(0).toUpperCase() }}
          </span>
        </v-avatar>
        <div>
          <div class="user-name">{{ auth.user?.name }}</div>
          <div class="user-role">{{ auth.user?.role }}</div>
        </div>
      </div>

      <!-- Nav links -->
      <nav class="nav-links">
        <router-link
          v-for="item in filteredLinks"
          :key="item.to"
          :to="item.to"
          class="nav-link"
          :class="{ active: $route.path === item.to }"
        >
          <v-icon size="18" class="mr-3">{{ item.icon }}</v-icon>
          {{ item.label }}
        </router-link>
      </nav>

      <!-- Logout -->
      <button class="logout-btn" @click="handleLogout">
        <v-icon size="18" class="mr-2">mdi-logout</v-icon>
        Logout
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const auth = useAuthStore();
const router = useRouter();

const links = [
  { to: '/dashboard', icon: 'mdi-view-dashboard-outline', label: 'Dashboard', role: 'user' },
  { to: '/users', icon: 'mdi-account-group-outline', label: 'Users', role: 'admin' },
  { to: '/logs', icon: 'mdi-history', label: 'Activity Logs', role: 'superadmin' },
];

const filteredLinks = computed(() => {
  return links.filter(link => {
    if (link.role === 'superadmin') return auth.isSuperAdmin;
    if (link.role === 'admin') return auth.isAdmin;
    return true;
  });
});

const handleLogout = () => {
  auth.logout();
  router.push('/login');
};
</script>

<style scoped>
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 260px;
  z-index: 100;
  padding: 16px;
}

.sidebar-inner {
  height: 100%;
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(30px);
  -webkit-backdrop-filter: blur(30px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.logo-area {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 8px 16px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  margin-bottom: 8px;
}

.logo-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: linear-gradient(135deg, rgba(124,58,237,0.4), rgba(37,99,235,0.4));
  border: 1px solid rgba(167,139,250,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-text {
  font-size: 18px;
  font-weight: 800;
  background: linear-gradient(135deg, #a78bfa, #60a5fa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.user-pill {
  display: flex;
  align-items: center;
  padding: 10px 8px;
  border-radius: 12px;
  background: rgba(124,58,237,0.1);
  border: 1px solid rgba(124,58,237,0.2);
  margin-bottom: 8px;
}

.user-name {
  font-size: 13px;
  font-weight: 600;
  color: #e2e8f0;
  line-height: 1.2;
}

.user-role {
  font-size: 11px;
  color: #a78bfa;
  text-transform: capitalize;
  font-weight: 500;
}

.nav-links {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 11px 12px;
  border-radius: 12px;
  color: rgba(255,255,255,0.55);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.nav-link:hover {
  color: #fff;
  background: rgba(255,255,255,0.06);
}

.nav-link.active {
  color: #fff;
  background: linear-gradient(135deg, rgba(124,58,237,0.35), rgba(37,99,235,0.25));
  border: 1px solid rgba(167,139,250,0.25);
}

.logout-btn {
  display: flex;
  align-items: center;
  padding: 11px 12px;
  border-radius: 12px;
  color: rgba(255,255,255,0.4);
  font-size: 14px;
  font-weight: 500;
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
}

.logout-btn:hover {
  color: #ef4444;
  background: rgba(239,68,68,0.08);
}
</style>