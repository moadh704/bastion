<template>
  <div class="page-container">
    <div class="page-header mb-6">
      <div>
        <h2 class="syne gradient-text">Users</h2>
        <p class="page-sub">Manage all platform accounts</p>
      </div>
    </div>

    <UserTable
      :users="usersStore.users"
      :loading="loading"
      @ban="handleBan"
      @unban="handleUnban"
      @delete="handleDelete"
      @create="showCreateDialog = true"
      @role-change="handleRoleChange"
      @reset-password="handleResetPassword"
    />

    <!-- Create User Dialog -->
    <div v-if="showCreateDialog" class="overlay">
      <div class="dialog glass-strong">
        <div class="d-flex align-center justify-space-between mb-5">
          <div class="syne" style="font-size:18px; font-weight:700; color:#fff;">Create User</div>
          <v-btn icon="mdi-close" variant="text" size="small" @click="showCreateDialog = false" />
        </div>

        <div class="d-flex flex-column gap-3">
          <v-text-field v-model="form.name" label="Full Name" variant="outlined" density="compact" color="primary" hide-details />
          <v-text-field v-model="form.email" label="Email" variant="outlined" density="compact" color="primary" hide-details />
          <v-text-field v-model="form.password" label="Password" type="password" variant="outlined" density="compact" color="primary" hide-details />
          <v-select v-model="form.role" label="Role" :items="['user', 'admin', 'superadmin']" variant="outlined" density="compact" color="primary" hide-details />
        </div>

        <div class="d-flex gap-3 mt-5">
          <button class="btn-cancel" @click="showCreateDialog = false">Cancel</button>
          <button class="btn-confirm-create" @click="handleCreate">Create User</button>
        </div>
      </div>
    </div>

    <!-- Reset Password Dialog -->
    <div v-if="showResetDialog" class="overlay">
      <div class="dialog glass-strong">
        <div class="d-flex align-center justify-space-between mb-5">
          <div class="syne" style="font-size:18px; font-weight:700; color:#fff;">Reset Password</div>
          <v-btn icon="mdi-close" variant="text" size="small" @click="showResetDialog = false" />
        </div>
        <p style="font-size:14px; color:rgba(255,255,255,0.5); margin-bottom:16px;">
          Set a new password for <strong style="color:#fff;">{{ resetTarget.name }}</strong>
        </p>
        <v-text-field
          v-model="newPassword"
          label="New Password"
          type="password"
          variant="outlined"
          density="compact"
          color="primary"
          hide-details
        />
        <div class="d-flex gap-3 mt-5">
          <button class="btn-cancel" @click="showResetDialog = false">Cancel</button>
          <button class="btn-confirm-create" @click="submitReset">Reset Password</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useUsersStore } from '../stores/users';
import { useUiStore } from '../stores/ui';
import UserTable from '../components/UserTable.vue';
import api from '../api/axios';

const usersStore = useUsersStore();
const ui = useUiStore();
const loading = ref(false);
const showCreateDialog = ref(false);
const showResetDialog = ref(false);
const resetTarget = ref({ id: null, name: '' });
const newPassword = ref('');

const form = ref({ name: '', email: '', password: '', role: 'user' });

onMounted(async () => {
  loading.value = true;
  await usersStore.fetchUsers();
  loading.value = false;
});

const handleBan = async (id) => {
  const ok = await ui.showConfirm('This user will be banned and unable to login.');
  if (!ok) return;
  try {
    await usersStore.banUser(id);
    ui.showToast('User banned successfully');
  } catch {
    ui.showToast('Failed to ban user', 'error');
  }
};

const handleUnban = async (id) => {
  const ok = await ui.showConfirm('This user will be restored to active status.');
  if (!ok) return;
  try {
    await usersStore.unbanUser(id);
    ui.showToast('User unbanned successfully');
  } catch {
    ui.showToast('Failed to unban user', 'error');
  }
};

const handleDelete = async (id) => {
  const ok = await ui.showConfirm('This action is permanent. The user will be deleted forever.');
  if (!ok) return;
  try {
    await usersStore.deleteUser(id);
    ui.showToast('User deleted');
  } catch {
    ui.showToast('Failed to delete user', 'error');
  }
};

const handleRoleChange = async (id, role) => {
  const ok = await ui.showConfirm(`Change this user's role to "${role}"?`);
  if (!ok) return;
  try {
    await usersStore.updateRole(id, role);
    ui.showToast('Role updated successfully');
  } catch {
    ui.showToast('Failed to update role', 'error');
  }
};

const handleResetPassword = (id, name) => {
  resetTarget.value = { id, name };
  newPassword.value = '';
  showResetDialog.value = true;
};

const submitReset = async () => {
  try {
    await api.put(`/users/${resetTarget.value.id}/reset-password`, { newPassword: newPassword.value });
    ui.showToast('Password reset successfully');
    showResetDialog.value = false;
  } catch (err) {
    ui.showToast(err.response?.data?.message || 'Failed to reset password', 'error');
  }
};

const handleCreate = async () => {
  try {
    await api.post('/users', form.value);
    await usersStore.fetchUsers();
    ui.showToast('User created successfully');
    showCreateDialog.value = false;
    form.value = { name: '', email: '', password: '', role: 'user' };
  } catch (err) {
    ui.showToast(err.response?.data?.message || 'Failed to create user', 'error');
  }
};
</script>

<style scoped>
h2 { font-size: 28px; font-weight: 800; margin: 0 0 4px; }
.page-sub { font-size: 14px; color: rgba(255,255,255,0.4); margin: 0; }
.page-header { display: flex; align-items: center; justify-content: space-between; }

.overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.6);
  backdrop-filter: blur(4px);
  z-index: 9998;
  display: flex; align-items: center; justify-content: center;
}

.dialog {
  width: 100%; max-width: 420px; padding: 32px;
}

.btn-cancel, .btn-confirm-create {
  flex: 1; padding: 11px; border-radius: 10px;
  font-size: 14px; font-weight: 600;
  font-family: 'Outfit', sans-serif;
  cursor: pointer; border: none;
  transition: all 0.2s ease;
  display: flex; align-items: center; justify-content: center;
}

.btn-cancel {
  background: rgba(255,255,255,0.06);
  color: rgba(255,255,255,0.6);
  border: 1px solid rgba(255,255,255,0.1);
}
.btn-cancel:hover { background: rgba(255,255,255,0.1); color: #fff; }

.btn-confirm-create {
  background: linear-gradient(135deg, #7c3aed, #2563eb);
  color: #fff;
}
.btn-confirm-create:hover { opacity: 0.9; transform: translateY(-1px); }
</style>