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
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useUsersStore } from '../stores/users';
import UserTable from '../components/UserTable.vue';

const usersStore = useUsersStore();
const loading = ref(false);

onMounted(async () => {
  loading.value = true;
  await usersStore.fetchUsers();
  loading.value = false;
});

const handleBan = async (id) => await usersStore.banUser(id);
const handleUnban = async (id) => await usersStore.unbanUser(id);
const handleDelete = async (id) => await usersStore.deleteUser(id);
</script>

<style scoped>
h2 { font-size: 28px; font-weight: 800; margin: 0 0 4px; }
.page-sub { font-size: 14px; color: rgba(255,255,255,0.4); margin: 0; }
.page-header { display: flex; align-items: center; justify-content: space-between; }
</style>