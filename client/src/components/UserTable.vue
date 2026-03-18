<template>
  <div class="glass pa-4">
    <div class="table-header mb-4">
      <div>
        <div class="syne" style="font-size:18px; font-weight:700; color:#fff;">Users</div>
        <div style="font-size:13px; color:rgba(255,255,255,0.4); margin-top:2px;">
          {{ filteredUsers.length }} accounts
        </div>
      </div>
      <div class="d-flex gap-3 align-center">
        <v-select
          v-model="filterRole"
          :items="['All', 'superadmin', 'admin', 'user']"
          variant="outlined"
          density="compact"
          hide-details
          style="max-width:130px;"
          color="primary"
        />
        <v-text-field
          v-model="search"
          placeholder="Search..."
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="compact"
          hide-details
          style="max-width:200px;"
          color="primary"
        />
        <v-btn
          v-if="auth.isAdmin"
          color="primary"
          variant="tonal"
          prepend-icon="mdi-plus"
          @click="$emit('create')"
        >
          Add User
        </v-btn>
        <v-btn
          color="success"
          variant="tonal"
          icon="mdi-download"
          @click="exportCSV"
        />
      </div>
    </div>

    <v-data-table
      :headers="headers"
      :items="filteredUsers"
      :loading="loading"
      :items-per-page="10"
      class="glass-table"
      item-value="id"
    >
      <template #item.name="{ item }">
        <div class="d-flex align-center gap-2">
          <div class="avatar-circle" :style="{ background: avatarColor(item.name) }">
            {{ item.name?.charAt(0).toUpperCase() }}
          </div>
          <div>
            <div style="font-size:14px; font-weight:500; color:#fff;">{{ item.name }}</div>
            <div style="font-size:12px; color:rgba(255,255,255,0.4);">{{ item.email }}</div>
          </div>
        </div>
      </template>

      <template #item.role="{ item }">
        <v-select
          v-if="auth.isSuperAdmin && item.id !== auth.user.id"
          :model-value="item.role"
          :items="['user', 'admin', 'superadmin']"
          variant="outlined"
          density="compact"
          hide-details
          style="max-width:130px;"
          color="primary"
          @update:model-value="(val) => $emit('roleChange', item.id, val)"
        />
        <v-chip v-else :color="roleColor(item.role)" size="small" variant="tonal">
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
          <v-tooltip text="Reset Password" location="top">
            <template #activator="{ props }">
              <v-btn
                v-if="auth.isSuperAdmin && item.id !== auth.user.id"
                v-bind="props"
                icon="mdi-lock-reset"
                size="x-small"
                variant="tonal"
                color="warning"
                @click="$emit('resetPassword', item.id, item.name)"
              />
            </template>
          </v-tooltip>
          <v-tooltip text="Ban User" location="top">
            <template #activator="{ props }">
              <v-btn
                v-if="item.status === 'active' && auth.isAdmin && item.id !== auth.user.id"
                v-bind="props"
                icon="mdi-account-cancel"
                size="x-small"
                variant="tonal"
                color="error"
                @click="$emit('ban', item.id)"
              />
            </template>
          </v-tooltip>
          <v-tooltip text="Unban User" location="top">
            <template #activator="{ props }">
              <v-btn
                v-if="item.status === 'banned' && auth.isAdmin"
                v-bind="props"
                icon="mdi-account-check"
                size="x-small"
                variant="tonal"
                color="success"
                @click="$emit('unban', item.id)"
              />
            </template>
          </v-tooltip>
          <v-tooltip text="Delete User" location="top">
            <template #activator="{ props }">
              <v-btn
                v-if="auth.isSuperAdmin && item.id !== auth.user.id"
                v-bind="props"
                icon="mdi-delete-outline"
                size="x-small"
                variant="tonal"
                color="error"
                @click="$emit('delete', item.id)"
              />
            </template>
          </v-tooltip>
        </div>
      </template>
    </v-data-table>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useAuthStore } from '../stores/auth';

const props = defineProps({ users: Array, loading: Boolean });
defineEmits(['ban', 'unban', 'delete', 'create', 'roleChange', 'resetPassword']);

const auth = useAuthStore();
const search = ref('');
const filterRole = ref('All');

const headers = [
  { title: 'User', key: 'name', sortable: true },
  { title: 'Role', key: 'role', sortable: true },
  { title: 'Status', key: 'status', sortable: true },
  { title: 'Joined', key: 'created_at', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false },
];

const filteredUsers = computed(() =>
  props.users.filter(u => {
    const matchSearch =
      u.name.toLowerCase().includes(search.value.toLowerCase()) ||
      u.email.toLowerCase().includes(search.value.toLowerCase());
    const matchRole = filterRole.value === 'All' || u.role === filterRole.value;
    return matchSearch && matchRole;
  })
);

const avatarColors = ['#7c3aed','#2563eb','#059669','#d97706','#dc2626','#0891b2'];
const avatarColor = (name) => avatarColors[(name?.charCodeAt(0) || 0) % avatarColors.length];
const roleColor = (role) => role === 'superadmin' ? 'purple' : role === 'admin' ? 'blue' : 'grey';
const formatDate = (date) =>
  new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

const exportCSV = () => {
  const headers = ['ID,Name,Email,Role,Status,Joined'];
  const rows = props.users.map(u =>
    `${u.id},"${u.name}","${u.email}",${u.role},${u.status},${formatDate(u.created_at)}`
  );
  const csv = [...headers, ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'users.csv';
  a.click();
  URL.revokeObjectURL(url);
};
</script>

<style scoped>
.table-header { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
.status-dot { width: 6px; height: 6px; border-radius: 50%; }
.status-dot.active { background: #10b981; }
.status-dot.banned { background: #ef4444; }

.avatar-circle {
  width: 32px; height: 32px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 13px; font-weight: 700;
  font-family: 'Syne', sans-serif; color: #fff; flex-shrink: 0;
}

:deep(.v-data-table) { background: transparent !important; }
:deep(.v-data-table-header__content) {
  color: rgba(255,255,255,0.4) !important;
  font-size: 11px !important;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
:deep(.v-data-table__tr:hover td) { background: rgba(255,255,255,0.03) !important; }
:deep(.v-data-table__td) { border-bottom: 1px solid rgba(255,255,255,0.05) !important; }
</style>