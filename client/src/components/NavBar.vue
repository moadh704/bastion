<template>
  <div class="sidebar">
    <div class="sidebar-inner">
      <!-- Logo -->
      <div class="logo-area">
        <div class="logo-icon" :style="{ background: `linear-gradient(135deg, ${ui.theme.mesh1}, ${ui.theme.mesh2})`, border: `1px solid ${ui.theme.accent}44` }">
          <v-icon :color="ui.theme.accent" size="22">mdi-shield-crown</v-icon>
        </div>
        <span class="logo-text syne" :style="{ background: ui.theme.gradient, '-webkit-background-clip': 'text', '-webkit-text-fill-color': 'transparent', 'background-clip': 'text' }">
          Bastion
        </span>
      </div>

      <!-- Theme Switcher -->
      <div class="theme-switcher">
        <div class="theme-label">Theme</div>
        <div class="theme-options">
          <button
            v-for="(t, key) in themes"
            :key="key"
            class="theme-dot"
            :class="{ active: ui.currentTheme === key }"
            :style="{ background: t.gradient }"
            :title="t.name"
            @click="ui.setTheme(key)"
          />
        </div>
      </div>

      <!-- User -->
      <router-link to="/profile" class="user-pill" :style="{ background: `${ui.theme.primary}1a`, border: `1px solid ${ui.theme.primary}33` }">
        <div class="avatar-circle" :style="{ background: avatarColor }">
          {{ auth.user?.name?.charAt(0).toUpperCase() }}
        </div>
        <div>
          <div class="user-name">{{ auth.user?.name }}</div>
          <div class="user-role" :style="{ color: ui.theme.accent }">{{ auth.user?.role }}</div>
        </div>
      </router-link>

      <!-- Nav Links -->
      <nav class="nav-links">
        <router-link
          v-for="item in filteredLinks"
          :key="item.to"
          :to="item.to"
          class="nav-link"
          :class="{ active: $route.path === item.to }"
          :style="$route.path === item.to ? {
            background: `linear-gradient(135deg, ${ui.theme.primary}55, ${ui.theme.secondary}33)`,
            border: `1px solid ${ui.theme.accent}33`
          } : {}"
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
import { useUiStore, themes } from '../stores/ui';

const auth = useAuthStore();
const ui = useUiStore();
const router = useRouter();

const links = [
  { to: '/dashboard', icon: 'mdi-view-dashboard-outline', label: 'Dashboard', role: 'user' },
  { to: '/users', icon: 'mdi-account-group-outline', label: 'Users', role: 'admin' },
  { to: '/logs', icon: 'mdi-history', label: 'Activity Logs', role: 'superadmin' },
];

const filteredLinks = computed(() =>
  links.filter(link => {
    if (link.role === 'superadmin') return auth.isSuperAdmin;
    if (link.role === 'admin') return auth.isAdmin;
    return true;
  })
);

const avatarColor = computed(() => {
  const colors = ui.theme.avatarColors;
  return colors[(auth.user?.name?.charCodeAt(0) || 0) % colors.length];
});

const handleLogout = () => {
  auth.logout();
  router.push('/login');
};
</script>

<style scoped>
.sidebar {
  position: fixed;
  top: 0; left: 0;
  height: 100vh; width: 260px;
  z-index: 100; padding: 16px;
}

.sidebar-inner {
  height: 100%;
  background: rgba(255,255,255,0.04);
  backdrop-filter: blur(30px);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 20px;
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.logo-area {
  display: flex; align-items: center; gap: 10px;
  padding: 0 8px 16px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  margin-bottom: 4px;
}

.logo-icon {
  width: 36px; height: 36px; border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; transition: all 0.4s ease;
}

.logo-text {
  font-size: 18px; font-weight: 800; flex: 1;
  transition: all 0.4s ease;
}

.theme-switcher {
  padding: 10px 8px;
  border-radius: 12px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.06);
  margin-bottom: 4px;
}

.theme-label {
  font-size: 11px;
  color: rgba(255,255,255,0.3);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 8px;
  font-weight: 600;
}

.theme-options {
  display: flex; gap: 8px;
}

.theme-dot {
  width: 22px; height: 22px; border-radius: 50%;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease;
  transform: scale(1);
}

.theme-dot:hover { transform: scale(1.15); }

.theme-dot.active {
  border-color: #fff;
  transform: scale(1.2);
  box-shadow: 0 0 10px rgba(255,255,255,0.3);
}

.user-pill {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 8px; border-radius: 12px;
  margin-bottom: 4px; text-decoration: none;
  transition: all 0.3s ease;
}
.user-pill:hover { filter: brightness(1.2); }

.avatar-circle {
  width: 32px; height: 32px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 13px; font-weight: 700;
  font-family: 'Syne', sans-serif; color: #fff; flex-shrink: 0;
  transition: background 0.4s ease;
}

.user-name { font-size: 13px; font-weight: 600; color: #e2e8f0; line-height: 1.2; }
.user-role { font-size: 11px; text-transform: capitalize; font-weight: 500; transition: color 0.4s ease; }

.nav-links { display: flex; flex-direction: column; gap: 4px; flex: 1; }

.nav-link {
  display: flex; align-items: center;
  padding: 11px 12px; border-radius: 12px;
  color: rgba(255,255,255,0.55);
  text-decoration: none; font-size: 14px; font-weight: 500;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}
.nav-link:hover { color: #fff; background: rgba(255,255,255,0.06); }
.nav-link.active { color: #fff; }

.logout-btn {
  display: flex; align-items: center;
  padding: 11px 12px; border-radius: 12px;
  color: rgba(255,255,255,0.4);
  font-size: 14px; font-weight: 500;
  background: none; border: none; cursor: pointer;
  transition: all 0.2s; width: 100%;
}
.logout-btn:hover { color: #ef4444; background: rgba(239,68,68,0.08); }
</style>