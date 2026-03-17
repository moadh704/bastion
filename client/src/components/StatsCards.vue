<template>
  <div class="stats-grid">
    <div v-for="stat in stats" :key="stat.label" class="stat-card">
      <div class="stat-icon" :style="{ background: stat.gradient }">
        <v-icon :color="stat.color" size="20">{{ stat.icon }}</v-icon>
      </div>
      <div class="stat-value syne">{{ stat.value }}</div>
      <div class="stat-label">{{ stat.label }}</div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({ data: Object });

const stats = computed(() => [
  {
    label: 'Total Users',
    value: props.data?.total ?? '—',
    icon: 'mdi-account-multiple',
    color: '#a78bfa',
    gradient: 'rgba(124,58,237,0.15)',
  },
  {
    label: 'Active Users',
    value: props.data?.active ?? '—',
    icon: 'mdi-account-check',
    color: '#10b981',
    gradient: 'rgba(16,185,129,0.15)',
  },
  {
    label: 'Banned Users',
    value: props.data?.banned ?? '—',
    icon: 'mdi-account-cancel',
    color: '#ef4444',
    gradient: 'rgba(239,68,68,0.15)',
  },
  {
    label: 'Admins',
    value: props.data?.admins ?? '—',
    icon: 'mdi-shield-account',
    color: '#60a5fa',
    gradient: 'rgba(37,99,235,0.15)',
  },
  {
    label: 'New This Week',
    value: props.data?.newThisWeek ?? '—',
    icon: 'mdi-account-plus',
    color: '#f59e0b',
    gradient: 'rgba(245,158,11,0.15)',
  },
]);
</script>

<style scoped>
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
  gap: 16px;
  margin-bottom: 28px;
}

.stat-card {
  background: rgba(255,255,255,0.04);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 16px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition: transform 0.2s ease, border-color 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  border-color: rgba(167,139,250,0.2);
}

.stat-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-value {
  font-size: 28px;
  font-weight: 800;
  color: #fff;
  line-height: 1;
}

.stat-label {
  font-size: 12px;
  color: rgba(255,255,255,0.45);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
</style>