<template>
  <div class="glass pa-4">
    <!-- Header -->
    <div class="table-header mb-4">
      <div>
        <div class="syne" style="font-size:18px; font-weight:700; color:#fff;">Users</div>
        <div style="font-size:13px; color:rgba(255,255,255,0.4); margin-top:2px;">
          {{ users.length }} total accounts
        </div>
      </div>
      <v-text-field
        v-model="search"
        placeholder="Search users..."
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        density="compact"
        hide-details
        style="max-width:220px;"
        color="primary"
      />
    </div>

    <!-- Table -->
    <v-data-table
      :headers="headers"
      :items="filteredUsers"
      :loading="loading"
      class="glass-table"
      item-value="id"
    >
      <template #item.name="{ item }">
        <div class="d-flex align-center gap-2">
          <v-avatar size="30" color="primary">
            <span style="font-size:12px; font-family:'Syne',sans-serif; font-weight:700">
              {{ item.name?.charAt(0).toUpperCase() }}
            </span>
          </v-avatar>
          <div>
            <div style="font-size:14px; font-weight:500; color:#fff;">{{ item.name }}</div>
            <div style="font-size:12px; color:rgba(255,255,255,0.4);">{{ item.email }}</div>
          </div>
        </div>
      </template>

      <template #item.role="{ item }">
        <v-chip :color="roleColor(item.role)" size="small" variant="tonal">
          {{ item.role }}
        </v-chip>
      </template>

      <template #item.status="{ item }">
        <div class="d-flex align-center gap-1">
          <div :class="['status-dot', item.status]" />
          <span :style="{ color: item.status === 'active' ? '#10b981' : '#ef4444', fontSize:'13px' }">
            {{ item.status }}
          </span>
        </div>
      </template>

      <template #item.created_at="{ item }">
        <span style="font-size:13px; color:rgba(255,255,255,0.45);">
          {{ formatDate(item.created_at) }}
        </span>
      </template>

      <template #item.actions="{ item }">
        <div class="d-flex gap-1">
          <v-btn
            v-if="item.status === 'active' && auth.isAdmin"
            icon="mdi-account-cancel"
            size="x-small"
            variant="tonal"
            color="error"
            @click="$emit('ban', item.id)"
          />
          <v-btn
            v-if="item.status === 'banned' && auth.isAdmin"
            icon="mdi-account-check"
            size="x-small"
            variant="tonal"
            color="success"
            @click="$emit('unban', item.id)"
          />
          <v-btn
            v-if="auth.isSuperAdmin"
            icon="mdi-delete-outline"
            size="x-small"
            variant="tonal"
            color="error"
            @click="$emit('delete', item.id)"
          />
        </div>
      </template>
    </v-data-table>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useAuthStore } from '../stores/auth';

const props = defineProps({ users: Array, loading: Boolean });
defineEmits(['ban', 'unban', 'delete']);

const auth = useAuthStore();
const search = ref('');

const headers = [
  { title: 'User', key: 'name', sortable: true },
  { title: 'Role', key: 'role', sortable: true },
  { title: 'Status', key: 'status', sortable: true },
  { title: 'Joined', key: 'created_at', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false },
];

const filteredUsers = computed(() =>
  props.users.filter(u =>
    u.name.toLowerCase().includes(search.value.toLowerCase()) ||
    u.email.toLowerCase().includes(search.value.toLowerCase())
  )
);

const roleColor = (role) => {
  if (role === 'superadmin') return 'purple';
  if (role === 'admin') return 'blue';
  return 'grey';
};

const formatDate = (date) =>
  new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
</script>

<style scoped>
.table-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}
.status-dot.active { background: #10b981; }
.status-dot.banned { background: #ef4444; }

:deep(.v-data-table) {
  background: transparent !important;
}
:deep(.v-data-table-header__content) {
  color: rgba(255,255,255,0.4) !important;
  font-size: 11px !important;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-family: 'Outfit', sans-serif;
}
:deep(.v-data-table__tr:hover td) {
  background: rgba(255,255,255,0.03) !important;
}
:deep(.v-data-table__td) {
  border-bottom: 1px solid rgba(255,255,255,0.05) !important;
}
</style>