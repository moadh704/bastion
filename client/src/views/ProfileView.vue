<template>
  <div class="page-container">
    <div class="page-header mb-6">
      <div>
        <h2 class="syne gradient-text">Profile</h2>
        <p class="page-sub">Your account details</p>
      </div>
    </div>

    <div class="profile-grid">
      <!-- Avatar Card -->
      <div class="glass pa-6 avatar-card">
        <div class="avatar-large" :style="{ background: avatarColor }">
          {{ auth.user?.name?.charAt(0).toUpperCase() }}
        </div>
        <div class="syne mt-4" style="font-size:20px; font-weight:700; color:#fff;">
          {{ auth.user?.name }}
        </div>
        <div style="font-size:13px; color:rgba(255,255,255,0.4); margin-top:4px;">
          {{ auth.user?.email }}
        </div>
        <v-chip :color="roleColor" size="small" variant="tonal" class="mt-3">
          {{ auth.user?.role }}
        </v-chip>
      </div>

      <!-- Change Password Card -->
      <div class="glass pa-6">
        <div class="syne mb-1" style="font-size:16px; font-weight:700; color:#fff;">
          Change Password
        </div>
        <div style="font-size:13px; color:rgba(255,255,255,0.4); margin-bottom:20px;">
          Update your account password
        </div>

        <div class="d-flex flex-column gap-3">
          <v-text-field
            v-model="passwords.current"
            label="Current Password"
            type="password"
            variant="outlined"
            density="compact"
            color="primary"
            hide-details
          />
          <v-text-field
            v-model="passwords.new"
            label="New Password"
            type="password"
            variant="outlined"
            density="compact"
            color="primary"
            hide-details
          />
          <v-text-field
            v-model="passwords.confirm"
            label="Confirm New Password"
            type="password"
            variant="outlined"
            density="compact"
            color="primary"
            hide-details
          />
        </div>

        <button class="save-btn mt-4" @click="handleChangePassword">
          Update Password
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useUiStore } from '../stores/ui';
import api from '../api/axios';

const auth = useAuthStore();
const ui = useUiStore();

const passwords = ref({ current: '', new: '', confirm: '' });

const avatarColors = ['#7c3aed','#2563eb','#059669','#d97706','#dc2626','#0891b2'];
const avatarColor = computed(() =>
  avatarColors[(auth.user?.name?.charCodeAt(0) || 0) % avatarColors.length]
);

const roleColor = computed(() => {
  if (auth.user?.role === 'superadmin') return 'purple';
  if (auth.user?.role === 'admin') return 'blue';
  return 'grey';
});

const handleChangePassword = async () => {
  if (passwords.value.new !== passwords.value.confirm) {
    ui.showToast('Passwords do not match', 'error');
    return;
  }
  if (passwords.value.new.length < 6) {
    ui.showToast('Password must be at least 6 characters', 'error');
    return;
  }
  try {
    await api.put('/auth/change-password', {
      currentPassword: passwords.value.current,
      newPassword: passwords.value.new,
    });
    ui.showToast('Password updated successfully');
    passwords.value = { current: '', new: '', confirm: '' };
  } catch (err) {
    ui.showToast(err.response?.data?.message || 'Failed to update password', 'error');
  }
};
</script>

<style scoped>
h2 { font-size: 28px; font-weight: 800; margin: 0 0 4px; }
.page-sub { font-size: 14px; color: rgba(255,255,255,0.4); margin: 0; }
.page-header { display: flex; align-items: center; justify-content: space-between; }

.profile-grid {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 20px;
}

.avatar-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.avatar-large {
  width: 80px; height: 80px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 32px; font-weight: 800;
  font-family: 'Syne', sans-serif; color: #fff;
}

.save-btn {
  width: 100%; padding: 11px; border-radius: 10px;
  background: linear-gradient(135deg, #7c3aed, #2563eb);
  border: none; color: #fff;
  font-size: 14px; font-weight: 600;
  font-family: 'Outfit', sans-serif;
  cursor: pointer; transition: all 0.2s ease;
}
.save-btn:hover { opacity: 0.9; transform: translateY(-1px); }
</style>