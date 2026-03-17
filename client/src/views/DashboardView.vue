<template>
  <div class="page-container">
    <div class="page-header mb-6">
      <div>
        <h2 class="syne gradient-text">Dashboard</h2>
        <p class="page-sub">Welcome back, {{ auth.user?.name }}</p>
      </div>
    </div>

    <StatsCards :data="usersStore.stats" />

    <div class="glass pa-5">
      <div class="syne mb-1" style="font-size:16px; font-weight:700; color:#fff;">Recent Activity</div>
      <div style="font-size:13px; color:rgba(255,255,255,0.4); margin-bottom:16px;">
        Latest actions across the platform
      </div>

      <div v-if="usersStore.logs.length === 0" class="empty-state">
        <v-icon color="rgba(255,255,255,0.2)" size="40">mdi-history</v-icon>
        <p>No activity yet</p>
      </div>

      <div v-else class="log-list">
        <div v-for="log in usersStore.logs.slice(0, 8)" :key="log.id" class="log-item">
          <div class="log-dot" />
          <div class="log-content">
            <span class="log-actor">{{ log.actor_name }}</span>
            <span class="log-action">{{ log.action }}</span>
          </div>
          <div class="log-time">{{ formatTime(log.created_at) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useUsersStore } from '../stores/users';
import StatsCards from '../components/StatsCards.vue';

const auth = useAuthStore();
const usersStore = useUsersStore();

onMounted(async () => {
  await usersStore.fetchStats();
  if (auth.isSuperAdmin) await usersStore.fetchLogs();
});

const formatTime = (date) =>
  new Date(date).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
</script>

<style scoped>
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

h2 {
  font-size: 28px;
  font-weight: 800;
  margin: 0 0 4px;
}

.page-sub {
  font-size: 14px;
  color: rgba(255,255,255,0.4);
  margin: 0;
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: rgba(255,255,255,0.3);
  font-size: 14px;
}

.log-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.log-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 8px;
  border-radius: 8px;
  transition: background 0.15s;
}

.log-item:hover {
  background: rgba(255,255,255,0.03);
}

.log-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #a78bfa;
  flex-shrink: 0;
}

.log-content {
  flex: 1;
  font-size: 13px;
}

.log-actor {
  font-weight: 600;
  color: #fff;
  margin-right: 6px;
}

.log-action {
  color: rgba(255,255,255,0.5);
}

.log-time {
  font-size: 12px;
  color: rgba(255,255,255,0.3);
  white-space: nowrap;
}
</style>