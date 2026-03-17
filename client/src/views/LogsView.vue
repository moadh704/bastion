<template>
  <div class="page-container">
    <div class="page-header mb-6">
      <div>
        <h2 class="syne gradient-text">Activity Logs</h2>
        <p class="page-sub">Full audit trail of admin actions</p>
      </div>
    </div>

    <div class="glass pa-5">
      <div v-if="loading" class="text-center pa-8">
        <v-progress-circular indeterminate color="primary" />
      </div>

      <div v-else-if="usersStore.logs.length === 0" class="empty-state">
        <v-icon color="rgba(255,255,255,0.2)" size="40">mdi-history</v-icon>
        <p>No logs yet</p>
      </div>

      <div v-else class="log-list">
        <div v-for="log in usersStore.logs" :key="log.id" class="log-row">
          <div class="log-icon">
            <v-icon size="16" color="#a78bfa">mdi-lightning-bolt</v-icon>
          </div>
          <div class="log-body">
            <span class="actor">{{ log.actor_name }}</span>
            <span class="action">{{ log.action }}</span>
            <span v-if="log.target_user_id" class="target">on user #{{ log.target_user_id }}</span>
          </div>
          <div class="log-date">{{ formatDate(log.created_at) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useUsersStore } from '../stores/users';

const usersStore = useUsersStore();
const loading = ref(false);

onMounted(async () => {
  loading.value = true;
  await usersStore.fetchLogs();
  loading.value = false;
});

const formatDate = (date) =>
  new Date(date).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
</script>

<style scoped>
h2 { font-size: 28px; font-weight: 800; margin: 0 0 4px; }
.page-sub { font-size: 14px; color: rgba(255,255,255,0.4); margin: 0; }
.page-header { display: flex; align-items: center; justify-content: space-between; }
.empty-state { text-align: center; padding: 40px; color: rgba(255,255,255,0.3); font-size: 14px; }

.log-list { display: flex; flex-direction: column; gap: 4px; }

.log-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 8px;
  border-radius: 10px;
  border-bottom: 1px solid rgba(255,255,255,0.04);
  transition: background 0.15s;
}

.log-row:hover { background: rgba(255,255,255,0.03); }

.log-icon {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  background: rgba(124,58,237,0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.log-body { flex: 1; font-size: 13px; }
.actor { font-weight: 600; color: #fff; margin-right: 6px; }
.action { color: rgba(255,255,255,0.5); margin-right: 6px; }
.target { color: #a78bfa; font-size: 12px; }
.log-date { font-size: 12px; color: rgba(255,255,255,0.3); white-space: nowrap; }
</style>